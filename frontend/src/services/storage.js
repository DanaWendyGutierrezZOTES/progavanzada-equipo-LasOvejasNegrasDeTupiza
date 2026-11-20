// ========================================================
// SERVICIO DE DATOS Y SINCRONIZACIÓN (storage.js)
// Conecta en tiempo real con el Backend Django REST API
// y mantiene la persistencia con SQLite en el servidor.
// Incluye soporte offline robusto y auto-fusión de datos.
// ========================================================

import { EVENTOS_INICIALES, COMPRAS_INICIALES, USUARIOS_INICIALES } from '../data/mockData';
import { EventosAPI, ComprasAPI, AuthAPI } from './api';

const CLAVE_EVENTOS = 'ticketera_eventos';
const CLAVE_COMPRAS = 'ticketera_compras';
const CLAVE_USUARIOS = 'ticketera_usuarios';

// Helpers seguros para lectura y escritura en localStorage
function leerStorage(clave, defecto) {
  try {
    const raw = localStorage.getItem(clave);
    return raw ? JSON.parse(raw) : defecto;
  } catch {
    return defecto;
  }
}

function escribirStorage(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
    window.dispatchEvent(new CustomEvent('ticketera_storage_updated', { detail: { clave } }));
  } catch (e) {
    console.warn('Error al guardar en storage local:', e);
  }
}

// --------------------------------------------------------
// SINCRONIZACIÓN AUTOMÁTICA CON DJANGO REST API
// --------------------------------------------------------

export async function sincronizarConBackend() {
  try {
    const [eventosApi, comprasApi, usuariosApi] = await Promise.all([
      EventosAPI.listar().catch(() => null),
      ComprasAPI.listar().catch(() => null),
      AuthAPI.usuarios().catch(() => null)
    ]);

    if (Array.isArray(eventosApi) && eventosApi.length > 0) {
      escribirStorage(CLAVE_EVENTOS, eventosApi);
    }
    if (Array.isArray(comprasApi)) {
      escribirStorage(CLAVE_COMPRAS, comprasApi);
    }
    if (Array.isArray(usuariosApi) && usuariosApi.length > 0) {
      escribirStorage(CLAVE_USUARIOS, usuariosApi);
    }
  } catch (error) {
    console.info('Backend Django en modo offline o sincronizando...', error);
  }
}

// Iniciar sincronización inicial al cargar el módulo
sincronizarConBackend();

// --------------------------------------------------------
// EVENTOS
// --------------------------------------------------------

export function obtenerEventos() {
  const guardados = leerStorage(CLAVE_EVENTOS, null);
  if (!guardados || guardados.length === 0) {
    escribirStorage(CLAVE_EVENTOS, EVENTOS_INICIALES);
    return EVENTOS_INICIALES;
  }

  // Fusión inteligente: Si el caché local tiene menos eventos que los iniciales de Bolivia,
  // agregamos los nuevos eventos sin sobreescribir los cambios del usuario
  if (guardados.length < EVENTOS_INICIALES.length) {
    const idsExistentes = new Set(guardados.map(e => Number(e.id)));
    const nuevos = EVENTOS_INICIALES.filter(e => !idsExistentes.has(Number(e.id)));
    if (nuevos.length > 0) {
      const actualizados = [...guardados, ...nuevos];
      escribirStorage(CLAVE_EVENTOS, actualizados);
      return actualizados;
    }
  }

  return guardados;
}

export function obtenerEventoPorId(id) {
  return obtenerEventos().find(e => Number(e.id) === Number(id)) || null;
}

export async function guardarEvento(eventoData) {
  let eventoGuardado = null;

  try {
    if (eventoData.id) {
      eventoGuardado = await EventosAPI.actualizar(eventoData.id, eventoData);
    } else {
      eventoGuardado = await EventosAPI.crear(eventoData);
    }
  } catch (err) {
    console.warn('Error al guardar en backend Django, aplicando guardado local:', err);
  }

  // Actualizar caché local
  const eventos = obtenerEventos();
  if (eventoData.id) {
    const index = eventos.findIndex(e => Number(e.id) === Number(eventoData.id));
    if (index !== -1) {
      eventos[index] = { ...eventos[index], ...(eventoGuardado || eventoData) };
    }
  } else {
    const nuevo = eventoGuardado || {
      ...eventoData,
      id: eventos.length > 0 ? Math.max(...eventos.map(e => Number(e.id))) + 1 : 1,
      tipos_ticket: eventoData.tipos_ticket || []
    };
    eventos.push(nuevo);
    eventoGuardado = nuevo;
  }

  escribirStorage(CLAVE_EVENTOS, eventos);
  return eventoGuardado || eventoData;
}

export async function eliminarEvento(id) {
  try {
    await EventosAPI.eliminar(id);
  } catch (err) {
    console.warn('Error al eliminar en backend Django:', err);
  }

  const filtrados = obtenerEventos().filter(e => Number(e.id) !== Number(id));
  escribirStorage(CLAVE_EVENTOS, filtrados);
  return true;
}

export async function agregarTipoTicket(eventoId, nuevoTicket) {
  let ticketCreado = null;
  try {
    ticketCreado = await EventosAPI.agregarTicket(eventoId, nuevoTicket);
  } catch (err) {
    console.warn('Error al crear ticket en Django:', err);
  }

  const eventos = obtenerEventos();
  const evento = eventos.find(e => Number(e.id) === Number(eventoId));
  if (!evento) return null;

  if (!evento.tipos_ticket) evento.tipos_ticket = [];

  const ticket = ticketCreado || {
    id: Date.now(),
    nombre: nuevoTicket.nombre,
    precio: Number(nuevoTicket.precio),
    cantidad_total: Number(nuevoTicket.cantidad_total),
    cantidad_disponible: Number(nuevoTicket.cantidad_disponible || nuevoTicket.cantidad_total)
  };

  evento.tipos_ticket.push(ticket);
  escribirStorage(CLAVE_EVENTOS, eventos);
  return ticket;
}

export async function eliminarTipoTicket(eventoId, ticketId) {
  try {
    await EventosAPI.eliminarTicket(ticketId);
  } catch (err) {
    console.warn('Error al eliminar ticket en Django:', err);
  }

  const eventos = obtenerEventos();
  const evento = eventos.find(e => Number(e.id) === Number(eventoId));
  if (!evento) return false;

  evento.tipos_ticket = (evento.tipos_ticket || []).filter(t => Number(t.id) !== Number(ticketId));
  escribirStorage(CLAVE_EVENTOS, eventos);
  return true;
}

// --------------------------------------------------------
// COMPRAS / TICKETS
// --------------------------------------------------------

export function obtenerCompras() {
  const guardadas = leerStorage(CLAVE_COMPRAS, null);
  if (!guardadas || guardadas.length === 0) {
    escribirStorage(CLAVE_COMPRAS, COMPRAS_INICIALES);
    return COMPRAS_INICIALES;
  }
  return guardadas;
}

export function obtenerCompraPorId(id) {
  return obtenerCompras().find(c => Number(c.id) === Number(id)) || null;
}

export async function realizarCompra({ usuario, eventoId, tipoTicketId, cantidad }) {
  let compraBackend = null;

  try {
    // 1. Ejecutar compra atómica en Django REST API (con descuento de cupo en SQLite)
    compraBackend = await ComprasAPI.realizar({
      eventoId,
      tipoTicketId,
      cantidad,
      usuario_id: usuario?.id,
      usuario
    });
  } catch (err) {
    console.warn('Backend Django no respondió, continuando con transacción local:', err);
  }

  // 2. Reflejar descuento de cupo en caché local
  const eventos = obtenerEventos();
  const evento = eventos.find(e => Number(e.id) === Number(eventoId));
  let tipoTicket = null;
  if (evento) {
    tipoTicket = evento.tipos_ticket?.find(t => Number(t.id) === Number(tipoTicketId));
    if (tipoTicket) {
      tipoTicket.cantidad_disponible = Math.max(0, tipoTicket.cantidad_disponible - Number(cantidad));
      escribirStorage(CLAVE_EVENTOS, eventos);
    }
  }

  // 3. Generar código y guardar registro en historial local
  const codigo = `TKT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  const precioUnitario = tipoTicket ? Number(tipoTicket.precio) : (evento?.precio_base || 50);
  const total = precioUnitario * Number(cantidad);

  const compras = obtenerCompras();
  const nuevaCompra = compraBackend || {
    id: compras.length > 0 ? Math.max(...compras.map(c => Number(c.id))) + 1 : 1,
    codigo_ticket: codigo,
    usuario_id: usuario?.id || 1,
    usuario_nombre: usuario?.nombre || usuario?.username || 'Comprador',
    comprador_nombre: usuario?.nombre || usuario?.username || 'Comprador',
    comprador_email: usuario?.email || 'comprador@ticketera.local',
    comprador_telefono: usuario?.telefono || '',
    evento_id: evento ? evento.id : eventoId,
    evento_nombre: evento ? evento.nombre : 'Evento',
    evento_fecha: evento ? evento.fecha : '',
    evento_hora: evento ? evento.hora : '',
    evento_lugar: evento ? evento.lugar : '',
    tipo_ticket_id: tipoTicketId,
    tipo_ticket_nombre: tipoTicket ? tipoTicket.nombre : 'Entrada General',
    cantidad: Number(cantidad),
    precio_unitario: precioUnitario,
    total: total,
    fecha_compra: new Date().toISOString(),
    qr_url: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${codigo}`
  };

  compras.unshift(nuevaCompra);
  escribirStorage(CLAVE_COMPRAS, compras);
  return nuevaCompra;
}

// --------------------------------------------------------
// USUARIOS Y AUTENTICACIÓN
// --------------------------------------------------------

export function obtenerUsuarios() {
  const lista = leerStorage(CLAVE_USUARIOS, null);
  if (!lista || lista.length === 0) {
    escribirStorage(CLAVE_USUARIOS, USUARIOS_INICIALES);
    return USUARIOS_INICIALES;
  }
  return lista;
}

export async function registrarUsuario(nuevoUsuario) {
  let usuarioBackend = null;
  try {
    usuarioBackend = await AuthAPI.registro(nuevoUsuario);
  } catch (err) {
    console.warn('Registro en backend falló o usuario existente, aplicando local:', err);
  }

  const usuarios = obtenerUsuarios();
  const usuario = usuarioBackend || {
    id: usuarios.length > 0 ? Math.max(...usuarios.map(u => Number(u.id))) + 1 : 1,
    username: nuevoUsuario.username,
    nombre: nuevoUsuario.nombre || nuevoUsuario.username,
    email: nuevoUsuario.email,
    telefono: nuevoUsuario.telefono || '',
    rol: nuevoUsuario.rol || 'comprador',
    password: nuevoUsuario.password
  };

  usuarios.push(usuario);
  escribirStorage(CLAVE_USUARIOS, usuarios);
  return usuario;
}
