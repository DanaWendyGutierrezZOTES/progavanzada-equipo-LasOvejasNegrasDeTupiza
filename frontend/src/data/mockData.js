// ========================================================
// DATOS INICIALES (MOCK DATA)
// Estos datos simulan la base de datos de Django para que
// la aplicación React funcione de inmediato sin configuraciones complejas.
// ========================================================

export const USUARIOS_INICIALES = [
  {
    id: 1,
    username: 'organizador',
    nombre: 'Carlos Mendoza',
    email: 'organizador@ticketera.local',
    telefono: '+56 9 8765 4321',
    rol: 'organizador', // 'organizador' o 'comprador'
    password: '123'
  },
  {
    id: 2,
    username: 'comprador',
    nombre: 'Valeria Rojas',
    email: 'comprador@ticketera.local',
    telefono: '+56 9 1234 5678',
    rol: 'comprador',
    password: '123'
  },
  {
    id: 3,
    username: 'admin',
    nombre: 'Admin Principal',
    email: 'admin@ticketera.local',
    telefono: '+56 9 9999 8888',
    rol: 'organizador',
    password: '123'
  }
];

export const EVENTOS_INICIALES = [
  {
    id: 1,
    nombre: 'Rock Stadium Fest 2026',
    descripcion: 'El festival de rock más potente y esperado del año. Reúne a las bandas más influyentes del rock latino y alternativo en un escenario monumental con sonido de alta definición, efectos pirotécnicos y áreas gastronómicas exclusivas.\n\n¡No te quedes fuera de esta noche histórica!',
    fecha: '2026-11-15',
    hora: '19:00',
    lugar: 'Estadio Nacional, Santiago',
    imagen_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    precio_base: 25000,
    cupo_total: 8000,
    organizador_id: 1, // Pertenece al usuario 'organizador'
    organizador_nombre: 'Carlos Mendoza',
    tipos_ticket: [
      { id: 101, nombre: 'Cancha General', precio: 25000, cantidad_total: 5000, cantidad_disponible: 4985 },
      { id: 102, nombre: 'Platea Alta Numerada', precio: 42000, cantidad_total: 2500, cantidad_disponible: 2490 },
      { id: 103, nombre: 'VIP Front Stage + Merch', precio: 89000, cantidad_total: 500, cantidad_disponible: 495 }
    ]
  },
  {
    id: 2,
    nombre: 'Sunset Electronic Festival',
    descripcion: 'Baila al atardecer con los mejores DJs internacionales de House, Melodic Techno y Progressive. Dos escenarios al aire libre, visuales inmersivas, zona de descanso chill-out y barras premium.',
    fecha: '2026-11-28',
    hora: '16:30',
    lugar: 'Espacio Riesco Outdoor, Santiago',
    imagen_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    precio_base: 18000,
    cupo_total: 4000,
    organizador_id: 1,
    organizador_nombre: 'Carlos Mendoza',
    tipos_ticket: [
      { id: 201, nombre: 'General Early Bird', precio: 18000, cantidad_total: 1500, cantidad_disponible: 1480 },
      { id: 202, nombre: 'General Fase 2', precio: 24000, cantidad_total: 2000, cantidad_disponible: 2000 },
      { id: 203, nombre: 'VIP Lounge', precio: 45000, cantidad_total: 500, cantidad_disponible: 490 }
    ]
  },
  {
    id: 3,
    nombre: 'Noche de Jazz & Blues Acústico',
    descripcion: 'Una velada íntima con destacados exponentes del jazz contemporáneo y blues clásico. Ambiente de club con gastronomía gourmet y carta de vinos seleccionados.',
    fecha: '2026-12-05',
    hora: '20:30',
    lugar: 'Club Subterráneo, Providencia',
    imagen_url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80',
    precio_base: 12000,
    cupo_total: 200,
    organizador_id: 1,
    organizador_nombre: 'Carlos Mendoza',
    tipos_ticket: [
      { id: 301, nombre: 'Entrada General + Cover', precio: 12000, cantidad_total: 150, cantidad_disponible: 145 },
      { id: 302, nombre: 'Mesa Preferencial (2 pers)', precio: 20000, cantidad_total: 50, cantidad_disponible: 48 }
    ]
  }
];

export const COMPRAS_INICIALES = [
  {
    id: 1,
    codigo_ticket: 'TKT-9F3A1B4C',
    usuario_id: 2, // Usuario 'comprador'
    usuario_nombre: 'Valeria Rojas',
    evento_id: 1,
    evento_nombre: 'Rock Stadium Fest 2026',
    evento_fecha: '2026-11-15',
    evento_hora: '19:00',
    evento_lugar: 'Estadio Nacional, Santiago',
    tipo_ticket_id: 101,
    tipo_ticket_nombre: 'Cancha General',
    cantidad: 2,
    precio_unitario: 25000,
    total: 50000,
    fecha_compra: '2026-10-05T14:30:00Z'
  }
];
