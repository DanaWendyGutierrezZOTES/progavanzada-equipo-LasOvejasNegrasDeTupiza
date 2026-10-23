// ========================================================
// SERVICIO DE DATOS (storage.js)
// Maneja la persistencia en el navegador (localStorage)
// Centralizado y optimizado sin código redundante
// ========================================================

import { EVENTOS_INICIALES, COMPRAS_INICIALES, USUARIOS_INICIALES } from '../data/mockData';

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
  localStorage.setItem(clave, JSON.stringify(valor));
}

// --------------------------------------------------------
// EVENTOS
// --------------------------------------------------------

export function obtenerEventos() {
  const guardados = leerStorage(CLAVE_EVENTOS, null);
  if (!guardados) {
    escribirStorage(CLAVE_EVENTOS, EVENTOS_INICIALES);
    return EVENTOS_INICIALES;
  }

  // Sincronizar o enriquecer con los estadios y sectores por defecto si faltan
  let actualizado = false;
  EVENTOS_INICIALES.forEach(def => {
    const index = guardados.findIndex(e => Number(e.id) === Number(def.id));
    if (index === -1) {
      guardados.push(def);
      actualizado = true;
    } else if (!guardados[index].sectores_geograficos || !guardados[index].estadio_nombre) {
      guardados[index] = { ...def, ...guardados[index] };
      actualizado = true;
    }
  });

  if (actualizado) {
    escribirStorage(CLAVE_EVENTOS, guardados);
  }
  return guardados;
}

export function obtenerEventoPorId(id) {
  return obtenerEventos().find(e => Number(e.id) === Number(id)) || null;
}

export function guardarEvento(eventoData) {
  const eventos = obtenerEventos();

  if (eventoData.id) {
    const index = eventos.findIndex(e => Number(e.id) === Number(eventoData.id));
    if (index !== -1) {
      eventos[index] = { ...eventos[index], ...eventoData };
    }
  } else {
    const nuevoId = eventos.length > 0 ? Math.max(...eventos.map(e => Number(e.id))) + 1 : 1;
    eventoData = {
      ...eventoData,
      id: nuevoId,
      tipos_ticket: eventoData.tipos_ticket || []
    };
    eventos.push(eventoData);
  }

  escribirStorage(CLAVE_EVENTOS, eventos);
  return eventoData;
}

export function eliminarEvento(id) {
  const filtrados = obtenerEventos().filter(e => Number(e.id) !== Number(id));
  escribirStorage(CLAVE_EVENTOS, filtrados);
  return true;
}

export function agregarTipoTicket(eventoId, nuevoTicket) {
  const eventos = obtenerEventos();
  const evento = eventos.find(e => Number(e.id) === Number(eventoId));
  if (!evento) return null;

  if (!evento.tipos_ticket) evento.tipos_ticket = [];

  const ticket = {
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

export function eliminarTipoTicket(eventoId, ticketId) {
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
  if (!guardadas) {
    escribirStorage(CLAVE_COMPRAS, COMPRAS_INICIALES);
    return COMPRAS_INICIALES;
  }
  return guardadas;
}

export function obtenerCompraPorId(id) {
  return obtenerCompras().find(c => Number(c.id) === Number(id)) || null;
}

export function realizarCompra({ usuario, eventoId, tipoTicketId, cantidad }) {
  const eventos = obtenerEventos();
  const evento = eventos.find(e => Number(e.id) === Number(eventoId));
  if (!evento) throw new Error('El evento no existe');

  const tipoTicket = evento.tipos_ticket?.find(t => Number(t.id) === Number(tipoTicketId));
  if (!tipoTicket) throw new Error('El tipo de ticket no existe');

  if (tipoTicket.cantidad_disponible < cantidad) {
    throw new Error(`Solo quedan ${tipoTicket.cantidad_disponible} tickets disponibles`);
  }

  // 1. Descontar cupo
  tipoTicket.cantidad_disponible -= Number(cantidad);
  escribirStorage(CLAVE_EVENTOS, eventos);

  // 2. Generar código y registro
  const codigoTicket = `TKT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  const compras = obtenerCompras();
  const nuevoId = compras.length > 0 ? Math.max(...compras.map(c => Number(c.id))) + 1 : 1;

  const nuevaCompra = {
    id: nuevoId,
    codigo_ticket: codigoTicket,
    usuario_id: usuario.id,
    usuario_nombre: usuario.nombre || usuario.username,
    evento_id: evento.id,
    evento_nombre: evento.nombre,
    evento_fecha: evento.fecha,
    evento_hora: evento.hora,
    evento_lugar: evento.lugar,
    tipo_ticket_id: tipoTicket.id,
    tipo_ticket_nombre: tipoTicket.nombre,
    cantidad: Number(cantidad),
    precio_unitario: Number(tipoTicket.precio),
    total: Number(tipoTicket.precio) * Number(cantidad),
    fecha_compra: new Date().toISOString()
  };

  compras.unshift(nuevaCompra);
  escribirStorage(CLAVE_COMPRAS, compras);
  return nuevaCompra;
}

// --------------------------------------------------------
// USUARIOS
// --------------------------------------------------------

export function obtenerUsuarios() {
  const lista = leerStorage(CLAVE_USUARIOS, null);
  if (!lista) {
    escribirStorage(CLAVE_USUARIOS, USUARIOS_INICIALES);
    return USUARIOS_INICIALES;
  }

  let cambios = false;
  USUARIOS_INICIALES.forEach(def => {
    const item = lista.find(u => u.username.toLowerCase() === def.username.toLowerCase());
    if (!item) {
      lista.push(def);
      cambios = true;
    } else if (item.password !== def.password || item.rol !== def.rol) {
      item.password = def.password;
      item.rol = def.rol;
      cambios = true;
    }
  });

  if (cambios) escribirStorage(CLAVE_USUARIOS, lista);
  return lista;
}

export function registrarUsuario(nuevoUsuario) {
  const usuarios = obtenerUsuarios();
  if (usuarios.some(u => u.username.toLowerCase() === nuevoUsuario.username.toLowerCase())) {
    throw new Error('El nombre de usuario ya está en uso');
  }

  const id = usuarios.length > 0 ? Math.max(...usuarios.map(u => Number(u.id))) + 1 : 1;
  const usuario = {
    id,
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
