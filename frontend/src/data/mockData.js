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
    subtitulo: 'El festival de rock más potente y esperado del continente',
    categoria: 'Rock',
    ciudad: 'La Paz',
    descripcion: 'El festival de rock más potente y esperado del año en el coloso miraflorino. Reúne a las bandas más legendarias del rock latino y alternativo en un escenario monumental con sonido lineal L-Acoustics de alta definición, efectos pirotécnicos sincronizados y áreas VIP exclusivas.\n\n¡Una experiencia que marcará la historia de la música en vivo!',
    fecha: '2026-11-15',
    hora: '19:00',
    lugar: 'Estadio Hernando Siles, La Paz',
    ubicacion_mapa: 'Estadio Hernando Siles, La Paz, Bolivia',
    estadio_nombre: 'Estadio Olímpico Hernando Siles',
    capacidad_estadio: '41.143 espectadores',
    lat: -16.4994,
    lng: -68.1225,
    imagen_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    precio_base: 140,
    cupo_total: 8000,
    organizador_id: 1,
    organizador_nombre: 'Carlos Mendoza',
    sectores_geograficos: [
      { id: 'vip', nombre: 'VIP Front Stage', ubicacion_estadio: 'Frente al Escenario', puerta: 'Puerta 1 - Alfombra Roja Saavedra', color: '#f59e0b', precio: 450, capacidad: 800, disponibles: 780 },
      { id: 'cancha', nombre: 'Cancha General / Campo', ubicacion_estadio: 'Césped Central', puerta: 'Puerta 2 y 3 - Rampa Sur', color: '#6366f1', precio: 220, capacidad: 4000, disponibles: 3950 },
      { id: 'preferencial', nombre: 'Tribuna Preferencial (Occidente)', ubicacion_estadio: 'Sector Occidental', puerta: 'Puerta 4 - Palcos y Butacas', color: '#38bdf8', precio: 280, capacidad: 1500, disponibles: 1470 },
      { id: 'general', nombre: 'Tribuna General (Oriente)', ubicacion_estadio: 'Sector Oriental', puerta: 'Puerta 7 - Calle Sanjinés', color: '#10b981', precio: 180, capacidad: 2000, disponibles: 1980 },
      { id: 'curva_norte', nombre: 'Curva Norte', ubicacion_estadio: 'Cabecera Norte', puerta: 'Puerta 9 - Av. del Ejército', color: '#ec4899', precio: 140, capacidad: 1200, disponibles: 1190 },
      { id: 'curva_sur', nombre: 'Curva Sur', ubicacion_estadio: 'Cabecera Sur', puerta: 'Puerta 12 - Calle Carrasco', color: '#8b5cf6', precio: 140, capacidad: 1200, disponibles: 1195 }
    ],
    tipos_ticket: [
      { id: 101, nombre: 'Curva Norte / Sur', sector: 'Cabeceras', puerta: 'Puertas 9 y 12', precio: 140, cantidad_total: 2400, cantidad_disponible: 2385, color_zona: '#ec4899' },
      { id: 102, nombre: 'Tribuna General (Oriente)', sector: 'Graderías Este', puerta: 'Puerta 7 - Calle Sanjinés', precio: 180, cantidad_total: 2000, cantidad_disponible: 1980, color_zona: '#10b981' },
      { id: 103, nombre: 'Cancha General (Campo)', sector: 'Césped Central', puerta: 'Puertas 2 y 3 - Rampa Sur', precio: 220, cantidad_total: 4000, cantidad_disponible: 3950, color_zona: '#6366f1' },
      { id: 104, nombre: 'Tribuna Preferencial', sector: 'Occidente / Butacas', puerta: 'Puerta 4 - Av. Saavedra', precio: 280, cantidad_total: 1500, cantidad_disponible: 1470, color_zona: '#38bdf8' },
      { id: 105, nombre: 'VIP Front Stage + Experiencia', sector: 'Frente al Escenario', puerta: 'Puerta 1 - Alfombra Roja', precio: 450, cantidad_total: 800, cantidad_disponible: 780, color_zona: '#f59e0b' }
    ]
  },
  {
    id: 2,
    nombre: 'Santa Cruz Electronic Festival 2026',
    subtitulo: 'La fiesta electrónica más grande del oriente boliviano',
    categoria: 'Electrónica',
    ciudad: 'Santa Cruz',
    descripcion: 'Baila bajo las estrellas del oriente con los mejores DJs del circuito mundial de House, Melodic Techno y Progressive. Un despliegue de pantallas LED curvas, lásers de última generación, pirotecnia fría y áreas de descanso VIP con barras de coctelería de autor.',
    fecha: '2026-11-28',
    hora: '17:00',
    lugar: 'Estadio Ramón Tahuichi Aguilera, Santa Cruz',
    ubicacion_mapa: 'Estadio Ramon Tahuichi Aguilera, Santa Cruz de la Sierra, Bolivia',
    estadio_nombre: 'Estadio Ramón Tahuichi Aguilera',
    capacidad_estadio: '38.500 espectadores',
    lat: -17.7972,
    lng: -63.1895,
    imagen_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    precio_base: 130,
    cupo_total: 6000,
    organizador_id: 1,
    organizador_nombre: 'Carlos Mendoza',
    sectores_geograficos: [
      { id: 'vip', nombre: 'VIP Lounge Deck', ubicacion_estadio: 'Plataforma Elevada Escenario', puerta: 'Acceso VIP 2do Anillo', color: '#f59e0b', precio: 380, capacidad: 600, disponibles: 580 },
      { id: 'cancha', nombre: 'Pista Electrónica (Césped)', ubicacion_estadio: 'Campo Principal', puerta: 'Puerta 1 - Av. Ejército', color: '#6366f1', precio: 200, capacidad: 3500, disponibles: 3450 },
      { id: 'preferencial', nombre: 'Preferencia Tahuichi', ubicacion_estadio: 'Tribuna Oeste', puerta: 'Puerta 3 - Tribuna Central', color: '#38bdf8', precio: 250, capacidad: 1200, disponibles: 1180 },
      { id: 'general', nombre: 'General Gradería', ubicacion_estadio: 'Tribuna Este', puerta: 'Puerta 6 - Calle Choferes', color: '#10b981', precio: 130, capacidad: 1500, disponibles: 1475 }
    ],
    tipos_ticket: [
      { id: 201, nombre: 'General Gradería Este', sector: 'Tribuna Este', puerta: 'Puerta 6', precio: 130, cantidad_total: 1500, cantidad_disponible: 1475, color_zona: '#10b981' },
      { id: 202, nombre: 'Pista Electrónica (Césped)', sector: 'Campo Principal', puerta: 'Puerta 1', precio: 200, cantidad_total: 3500, cantidad_disponible: 3450, color_zona: '#6366f1' },
      { id: 203, nombre: 'Tribuna Preferencial', sector: 'Tribuna Oeste', puerta: 'Puerta 3', precio: 250, cantidad_total: 1200, cantidad_disponible: 1180, color_zona: '#38bdf8' },
      { id: 204, nombre: 'VIP Lounge Deck', sector: 'Plataforma VIP', puerta: 'Acceso VIP', precio: 380, cantidad_total: 600, cantidad_disponible: 580, color_zona: '#f59e0b' }
    ]
  },
  {
    id: 3,
    nombre: 'Cochabamba Fest: Ritmos & Folclore',
    subtitulo: 'El gran encuentro musical de los valles en el Capriles',
    categoria: 'Festivales',
    ciudad: 'Cochabamba',
    descripcion: 'El corazón de Bolivia vibra con las agrupaciones más galardonadas de la música andina y fusión contemporánea. Una noche irrepetible con más de 6 horas de música en vivo, pantallas holográficas y gastronomía cochabambina.',
    fecha: '2026-12-05',
    hora: '18:30',
    lugar: 'Estadio Félix Capriles, Cochabamba',
    ubicacion_mapa: 'Estadio Felix Capriles, Cochabamba, Bolivia',
    estadio_nombre: 'Estadio Sudamericano Félix Capriles',
    capacidad_estadio: '32.000 espectadores',
    lat: -17.3792,
    lng: -66.1614,
    imagen_url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80',
    precio_base: 90,
    cupo_total: 5000,
    organizador_id: 1,
    organizador_nombre: 'Carlos Mendoza',
    sectores_geograficos: [
      { id: 'vip', nombre: 'VIP Golden Circle', ubicacion_estadio: 'Front Stage Escenario', puerta: 'Puerta 1 - Cala Cala', color: '#f59e0b', precio: 320, capacidad: 500, disponibles: 490 },
      { id: 'cancha', nombre: 'Cancha Libre', ubicacion_estadio: 'Césped Central', puerta: 'Puerta 2 - Rampa Libertador', color: '#6366f1', precio: 160, capacidad: 2500, disponibles: 2470 },
      { id: 'preferencial', nombre: 'Preferencia Capriles', ubicacion_estadio: 'Tribuna Principal', puerta: 'Puerta 4 - Av. Libertador Bolívar', color: '#38bdf8', precio: 220, capacidad: 1000, disponibles: 980 },
      { id: 'general', nombre: 'General & Curvas', ubicacion_estadio: 'Graderías Generales', puerta: 'Puertas 7 y 8', color: '#10b981', precio: 90, capacidad: 2000, disponibles: 1960 }
    ],
    tipos_ticket: [
      { id: 301, nombre: 'General & Curvas', sector: 'Graderías Generales', puerta: 'Puertas 7 y 8', precio: 90, cantidad_total: 2000, cantidad_disponible: 1960, color_zona: '#10b981' },
      { id: 302, nombre: 'Cancha Libre', sector: 'Césped Central', puerta: 'Puerta 2', precio: 160, cantidad_total: 2500, cantidad_disponible: 2470, color_zona: '#6366f1' },
      { id: 303, nombre: 'Preferencia Capriles', sector: 'Tribuna Principal', puerta: 'Puerta 4', precio: 220, cantidad_total: 1000, cantidad_disponible: 980, color_zona: '#38bdf8' },
      { id: 304, nombre: 'VIP Golden Circle', sector: 'Front Stage', puerta: 'Puerta 1 - Cala Cala', precio: 320, cantidad_total: 500, cantidad_disponible: 490, color_zona: '#f59e0b' }
    ]
  },
  {
    id: 4,
    nombre: 'Noche de Jazz & Blues Acústico',
    subtitulo: 'Sesión íntima en el histórico teatro paceño',
    categoria: 'Jazz',
    ciudad: 'La Paz',
    descripcion: 'Una velada íntima de acústica perfecta con virtuosos del jazz contemporáneo y blues clásico en el recinto teatral más emblemático del país. Ambiente exclusivo con carta de vinos de altura y quesos artesanales.',
    fecha: '2026-12-12',
    hora: '20:00',
    lugar: 'Teatro Municipal Alberto Saavedra Pérez, La Paz',
    ubicacion_mapa: 'Teatro Municipal Alberto Saavedra Perez, La Paz, Bolivia',
    estadio_nombre: 'Teatro Municipal Alberto Saavedra Pérez',
    capacidad_estadio: '650 espectadores',
    lat: -16.4952,
    lng: -68.1362,
    imagen_url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80',
    precio_base: 80,
    cupo_total: 400,
    organizador_id: 1,
    organizador_nombre: 'Carlos Mendoza',
    sectores_geograficos: [
      { id: 'platea', nombre: 'Platea Baja', ubicacion_estadio: 'Frente al Escenario', puerta: 'Puerta Principal - Calle Sanjinés', color: '#f59e0b', precio: 150, capacidad: 150, disponibles: 145 },
      { id: 'palcos', nombre: 'Palcos Oficiales', ubicacion_estadio: 'Nivel Intermedio', puerta: 'Escalinata Derecha', color: '#38bdf8', precio: 120, capacidad: 100, disponibles: 95 },
      { id: 'galeria', nombre: 'Galería Alta', ubicacion_estadio: 'Nivel Superior Panorámico', puerta: 'Escalinata Izquierda', color: '#6366f1', precio: 80, capacidad: 150, disponibles: 140 }
    ],
    tipos_ticket: [
      { id: 401, nombre: 'Galería Alta', sector: 'Nivel Superior', puerta: 'Escalinata Izquierda', precio: 80, cantidad_total: 150, cantidad_disponible: 140, color_zona: '#6366f1' },
      { id: 402, nombre: 'Palcos Oficiales', sector: 'Nivel Intermedio', puerta: 'Escalinata Derecha', precio: 120, cantidad_total: 100, cantidad_disponible: 95, color_zona: '#38bdf8' },
      { id: 403, nombre: 'Platea Baja VIP', sector: 'Frente al Escenario', puerta: 'Puerta Principal', precio: 150, cantidad_total: 150, cantidad_disponible: 145, color_zona: '#f59e0b' }
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
