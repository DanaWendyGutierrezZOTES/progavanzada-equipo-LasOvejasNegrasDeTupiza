// ========================================================
// DATOS INICIALES (MOCK DATA)
// Configurado con moneda en Bolivianos (Bs) y recintos reales
// ========================================================

export const USUARIOS_INICIALES = [
  {
    id: 1,
    username: 'organizador',
    nombre: 'Carlos Mendoza',
    email: 'organizador@ticketera.local',
    telefono: '+591 71234567',
    rol: 'organizador', // Solo el administrador puede crear este rol
    password: '123'
  },
  {
    id: 2,
    username: 'comprador',
    nombre: 'Valeria Rojas',
    email: 'comprador@ticketera.local',
    telefono: '+591 79876543',
    rol: 'comprador', // Rol público por defecto
    password: '123'
  },
  {
    id: 3,
    username: 'admin',
    nombre: 'Administrador Principal',
    email: 'admin@ticketera.local',
    telefono: '+591 70001122',
    rol: 'admin', // Administrador con permisos para registrar organizadores
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
    lugar: 'Estadio Hernando Siles, La Paz',
    ubicacion_mapa: 'Estadio Hernando Siles, La Paz, Bolivia',
    lat: -16.4994,
    lng: -68.1225,
    imagen_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    precio_base: 150,
    cupo_total: 8000,
    organizador_id: 1,
    organizador_nombre: 'Carlos Mendoza',
    tipos_ticket: [
      { id: 101, nombre: 'Cancha General', precio: 150, cantidad_total: 5000, cantidad_disponible: 4985, color_zona: '#6366f1' },
      { id: 102, nombre: 'Platea Numerada', precio: 280, cantidad_total: 2500, cantidad_disponible: 2490, color_zona: '#06b6d4' },
      { id: 103, nombre: 'VIP Front Stage + Merch', precio: 450, cantidad_total: 500, cantidad_disponible: 495, color_zona: '#f59e0b' }
    ]
  },
  {
    id: 2,
    nombre: 'Sunset Electronic Festival',
    descripcion: 'Baila al atardecer con los mejores DJs internacionales de House, Melodic Techno y Progressive. Dos escenarios al aire libre, visuales inmersivas, zona de descanso chill-out y barras premium.',
    fecha: '2026-11-28',
    hora: '16:30',
    lugar: 'Campo Ferial Chuquiago Marka, La Paz',
    ubicacion_mapa: 'Campo Ferial Chuquiago Marka, La Paz, Bolivia',
    lat: -16.5397,
    lng: -68.0892,
    imagen_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    precio_base: 120,
    cupo_total: 4000,
    organizador_id: 1,
    organizador_nombre: 'Carlos Mendoza',
    tipos_ticket: [
      { id: 201, nombre: 'General Early Bird', precio: 120, cantidad_total: 1500, cantidad_disponible: 1480, color_zona: '#6366f1' },
      { id: 202, nombre: 'General Fase 2', precio: 180, cantidad_total: 2000, cantidad_disponible: 2000, color_zona: '#10b981' },
      { id: 203, nombre: 'VIP Lounge Terrace', precio: 320, cantidad_total: 500, cantidad_disponible: 490, color_zona: '#a855f7' }
    ]
  },
  {
    id: 3,
    nombre: 'Noche de Jazz & Blues Acústico',
    descripcion: 'Una velada íntima con destacados exponentes del jazz contemporáneo y blues clásico. Ambiente de club con gastronomía gourmet y carta de vinos seleccionados.',
    fecha: '2026-12-05',
    hora: '20:30',
    lugar: 'Teatro Municipal Alberto Saavedra Pérez, La Paz',
    ubicacion_mapa: 'Teatro Municipal Alberto Saavedra Pérez, La Paz, Bolivia',
    lat: -16.4952,
    lng: -68.1362,
    imagen_url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80',
    precio_base: 80,
    cupo_total: 200,
    organizador_id: 1,
    organizador_nombre: 'Carlos Mendoza',
    tipos_ticket: [
      { id: 301, nombre: 'Entrada General + Cover', precio: 80, cantidad_total: 150, cantidad_disponible: 145, color_zona: '#6366f1' },
      { id: 302, nombre: 'Mesa Preferencial (2 pers)', precio: 140, cantidad_total: 50, cantidad_disponible: 48, color_zona: '#f59e0b' }
    ]
  }
];

export const COMPRAS_INICIALES = [
  {
    id: 1,
    codigo_ticket: 'TKT-9F3A1B4C',
    usuario_id: 2,
    usuario_nombre: 'Valeria Rojas',
    evento_id: 1,
    evento_nombre: 'Rock Stadium Fest 2026',
    evento_fecha: '2026-11-15',
    evento_hora: '19:00',
    evento_lugar: 'Estadio Hernando Siles, La Paz',
    tipo_ticket_id: 101,
    tipo_ticket_nombre: 'Cancha General',
    cantidad: 2,
    precio_unitario: 150,
    total: 300,
    fecha_compra: '2026-10-05T14:30:00Z'
  }
];
