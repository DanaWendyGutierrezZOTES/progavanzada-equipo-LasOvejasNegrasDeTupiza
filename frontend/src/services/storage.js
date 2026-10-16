// ========================================================
// SERVICIO DE DATOS (storage.js)
// Maneja la persistencia en el navegador (localStorage)
// Muy fácil de explicar: lee y escribe datos como si fuera una base de datos local.
// ========================================================

import { EVENTOS_INICIALES, COMPRAS_INICIALES, USUARIOS_INICIALES } from '../data/mockData';

const CLAVE_EVENTOS = 'ticketera_eventos';
const CLAVE_COMPRAS = 'ticketera_compras';
const CLAVE_USUARIOS = 'ticketera_usuarios';

// --------------------------------------------------------
// EVENTOS
// --------------------------------------------------------

// Obtener todos los eventos
export function obtenerEventos() {
  const guardados = localStorage.getItem(CLAVE_EVENTOS);
  if (guardados) {
    try {
      const lista = JSON.parse(guardados);
      let actualizado = false;
      // Sincronizar o enriquecer con estadios y sectores geográficos iniciales
      EVENTOS_INICIALES.forEach(eventoDefecto => {
        const index = lista.findIndex(e => Number(e.id) === Number(eventoDefecto.id));
        if (index === -1) {
          lista.push(eventoDefecto);
          actualizado = true;
        } else if (!lista[index].sectores_geograficos || !lista[index].estadio_nombre) {
          lista[index] = { ...eventoDefecto, ...lista[index], sectores_geograficos: eventoDefecto.sectores_geograficos, estadio_nombre: eventoDefecto.estadio_nombre, capacidad_estadio: eventoDefecto.capacidad_estadio, lat: eventoDefecto.lat, lng: eventoDefecto.lng };
          actualizado = true;
        }
      });
      if (actualizado) {
        localStorage.setItem(CLAVE_EVENTOS, JSON.stringify(lista));
      }
      return lista;
    } catch {
      // En caso de error de parseo, reinicia a iniciales
    }
  }
  // Si no hay datos guardados, guardamos los iniciales y los retornamos
  localStorage.setItem(CLAVE_EVENTOS, JSON.stringify(EVENTOS_INICIALES));
  return EVENTOS_INICIALES;
}

// Obtener un solo evento por su ID
export function obtenerEventoPorId(id) {
  const eventos = obtenerEventos();
  return eventos.find(e => Number(e.id) === Number(id)) || null;
}

// Guardar o actualizar un evento
export function guardarEvento(eventoData) {
  const eventos = obtenerEventos();

  if (eventoData.id) {
    // Editar evento existente
    const index = eventos.findIndex(e => Number(e.id) === Number(eventoData.id));
    if (index !== -1) {
      eventos[index] = { ...eventos[index], ...eventoData };
    }
  } else {
    // Crear nuevo evento con nuevo ID incremental
    const nuevoId = eventos.length > 0 ? Math.max(...eventos.map(e => Number(e.id))) + 1 : 1;
    const nuevoEvento = {
      ...eventoData,
      id: nuevoId,
      tipos_ticket: eventoData.tipos_ticket || []
    };
    eventos.push(nuevoEvento);
    eventoData = nuevoEvento;
  }

  localStorage.setItem(CLAVE_EVENTOS, JSON.stringify(eventos));
  return eventoData;
}

// Eliminar un evento por su ID
export function eliminarEvento(id) {
  const eventos = obtenerEventos();
  const filtrados = eventos.filter(e => Number(e.id) !== Number(id));
  localStorage.setItem(CLAVE_EVENTOS, JSON.stringify(filtrados));
  return true;
}

// Agregar o actualizar un tipo de ticket a un evento
export function agregarTipoTicket(eventoId, nuevoTicket) {
  const eventos = obtenerEventos();
  const evento = eventos.find(e => Number(e.id) === Number(eventoId));
  if (!evento) return null;

  if (!evento.tipos_ticket) {
    evento.tipos_ticket = [];
  }

  const ticketId = Date.now(); // Genera ID único usando la fecha actual
  const ticket = {
    id: ticketId,
    nombre: nuevoTicket.nombre,
    precio: Number(nuevoTicket.precio),
    cantidad_total: Number(nuevoTicket.cantidad_total),
    cantidad_disponible: Number(nuevoTicket.cantidad_disponible || nuevoTicket.cantidad_total)
  };

  evento.tipos_ticket.push(ticket);
  localStorage.setItem(CLAVE_EVENTOS, JSON.stringify(eventos));
  return ticket;
}

// Eliminar un tipo de ticket de un evento
export function eliminarTipoTicket(eventoId, ticketId) {
  const eventos = obtenerEventos();
  const evento = eventos.find(e => Number(e.id) === Number(eventoId));
  if (!evento) return false;

  evento.tipos_ticket = evento.tipos_ticket.filter(t => Number(t.id) !== Number(ticketId));
  localStorage.setItem(CLAVE_EVENTOS, JSON.stringify(eventos));
  return true;
}

// --------------------------------------------------------
// COMPRAS / TICKETS
// --------------------------------------------------------

// Obtener todas las compras registradas
export function obtenerCompras() {
  const guardadas = localStorage.getItem(CLAVE_COMPRAS);
  if (guardadas) {
    try {
      return JSON.parse(guardadas);
    } catch {
      // Error de parseo
    }
  }
  localStorage.setItem(CLAVE_COMPRAS, JSON.stringify(COMPRAS_INICIALES));
  return COMPRAS_INICIALES;
}

// Obtener una compra por su ID o código
export function obtenerCompraPorId(id) {
  const compras = obtenerCompras();
  return compras.find(c => Number(c.id) === Number(id)) || null;
}

// Realizar una compra (descuenta stock del ticket y guarda la orden)
export function realizarCompra({ usuario, eventoId, tipoTicketId, cantidad }) {
  const eventos = obtenerEventos();
  const evento = eventos.find(e => Number(e.id) === Number(eventoId));
  if (!evento) throw new Error('El evento no existe');

  const tipoTicket = evento.tipos_ticket.find(t => Number(t.id) === Number(tipoTicketId));
  if (!tipoTicket) throw new Error('El tipo de ticket no existe');

  if (tipoTicket.cantidad_disponible < cantidad) {
    throw new Error(`Solo quedan ${tipoTicket.cantidad_disponible} tickets disponibles`);
  }

  // 1. Descontar cupo del ticket
  tipoTicket.cantidad_disponible -= Number(cantidad);
  localStorage.setItem(CLAVE_EVENTOS, JSON.stringify(eventos));

  // 2. Generar código único para el ticket (ej: TKT-A8F4C2)
  const codigoAleatorio = Math.random().toString(36).substring(2, 10).toUpperCase();
  const codigoTicket = `TKT-${codigoAleatorio}`;

  // 3. Crear el registro de la compra
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
  localStorage.setItem(CLAVE_COMPRAS, JSON.stringify(compras));

  return nuevaCompra;
}

// --------------------------------------------------------
// USUARIOS
// --------------------------------------------------------

export function obtenerUsuarios() {
  const guardados = localStorage.getItem(CLAVE_USUARIOS);
  if (guardados) {
    try {
      return JSON.parse(guardados);
    } catch {}
  }
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(USUARIOS_INICIALES));
  return USUARIOS_INICIALES;
}

export function registrarUsuario(nuevoUsuario) {
  const usuarios = obtenerUsuarios();
  
  // Verificar si ya existe el nombre de usuario
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
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
  return usuario;
}
