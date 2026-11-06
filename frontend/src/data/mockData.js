// ========================================================
// DATOS INICIALES (MOCK DATA)
// Configurado con moneda en Bolivianos (Bs) y recintos reales
// representativos de los 9 departamentos de Bolivia y Tupiza.
// ========================================================

export const USUARIOS_INICIALES = [
  {
    id: 1,
    username: 'organizador',
    nombre: 'Carlos Mendoza',
    email: 'organizador@ticketera.local',
    telefono: '+591 71234567',
    rol: 'organizador',
    password: '123'
  },
  {
    id: 2,
    username: 'comprador',
    nombre: 'Valeria Rojas',
    email: 'comprador@ticketera.local',
    telefono: '+591 79876543',
    rol: 'comprador',
    password: '123'
  },
  {
    id: 3,
    username: 'admin',
    nombre: 'Administrador Principal',
    email: 'admin@ticketera.local',
    telefono: '+591 70001122',
    rol: 'admin',
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
    departamento: 'La Paz',
    tipo_recinto: 'estadio',
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
    departamento: 'Santa Cruz',
    tipo_recinto: 'estadio',
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
    departamento: 'Cochabamba',
    tipo_recinto: 'estadio',
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
    departamento: 'La Paz',
    tipo_recinto: 'teatro',
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
      { id: 'platea_vip', nombre: 'Platea Baja VIP', ubicacion_estadio: 'Frente al Escenario', puerta: 'Puerta Principal - Calle Sanjinés', color: '#f59e0b', precio: 150, capacidad: 150, disponibles: 145 },
      { id: 'palcos', nombre: 'Palcos Oficiales', ubicacion_estadio: 'Nivel Intermedio', puerta: 'Escalinata Derecha', color: '#38bdf8', precio: 120, capacidad: 100, disponibles: 95 },
      { id: 'anfiteatro', nombre: 'Galería Alta', ubicacion_estadio: 'Nivel Superior Panorámico', puerta: 'Escalinata Izquierda', color: '#6366f1', precio: 80, capacidad: 150, disponibles: 140 }
    ],
    tipos_ticket: [
      { id: 401, nombre: 'Galería Alta', sector: 'Nivel Superior', puerta: 'Escalinata Izquierda', precio: 80, cantidad_total: 150, cantidad_disponible: 140, color_zona: '#6366f1' },
      { id: 402, nombre: 'Palcos Oficiales', sector: 'Nivel Intermedio', puerta: 'Escalinata Derecha', precio: 120, cantidad_total: 100, cantidad_disponible: 95, color_zona: '#38bdf8' },
      { id: 403, nombre: 'Platea Baja VIP', sector: 'Frente al Escenario', puerta: 'Puerta Principal', precio: 150, cantidad_total: 150, cantidad_disponible: 145, color_zona: '#f59e0b' }
    ]
  },
  {
    id: 5,
    nombre: 'Festival Internacional de la Vendimia y Folclore de Tupiza 2026',
    subtitulo: '¡Orgullo de los valles del sur y la tierra de Los Chichas!',
    categoria: 'Festivales',
    ciudad: 'Tupiza',
    departamento: 'Potosí',
    tipo_recinto: 'estadio',
    descripcion: 'La fiesta mayor del sur de Bolivia en el Estadio Departamental de Tupiza. Presentando a las máximas leyendas del folclore chicheño, tonadas, chacareras, coplas y grupos invitados de Argentina y los Andes. Despliegue de gastronomía típica, tamales tupiceños, asado chicheño y el mejor vino de los valles.',
    fecha: '2026-11-18',
    hora: '17:00',
    lugar: 'Estadio Departamental de Tupiza, Potosí',
    ubicacion_mapa: 'Estadio Departamental de Tupiza, Potosi, Bolivia',
    estadio_nombre: 'Estadio Departamental de Tupiza',
    capacidad_estadio: '15.000 espectadores',
    lat: -21.4428,
    lng: -65.7197,
    imagen_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    precio_base: 90,
    cupo_total: 7000,
    organizador_id: 1,
    organizador_nombre: 'Carlos Mendoza',
    sectores_geograficos: [
      { id: 'vip', nombre: 'VIP Chicheño de Oro', ubicacion_estadio: 'Frente al Gran Escenario', puerta: 'Puerta 1 - Av. Chichas', color: '#f59e0b', precio: 220, capacidad: 600, disponibles: 590 },
      { id: 'cancha', nombre: 'Cancha Central Fiesta', ubicacion_estadio: 'Césped Principal', puerta: 'Puerta 2 - Rampa Central', color: '#6366f1', precio: 120, capacidad: 4000, disponibles: 3940 },
      { id: 'preferencial', nombre: 'Tribuna Preferencial Tupiza', ubicacion_estadio: 'Occidente Techado', puerta: 'Puerta 3 - Palcos', color: '#38bdf8', precio: 150, capacidad: 1500, disponibles: 1480 },
      { id: 'general', nombre: 'Tribuna General Valle Hermoso', ubicacion_estadio: 'Oriente', puerta: 'Puerta 4 - Acceso Este', color: '#10b981', precio: 90, capacidad: 2000, disponibles: 1975 }
    ],
    tipos_ticket: [
      { id: 501, nombre: 'General Graderías Valle Hermoso', sector: 'Oriente', puerta: 'Puerta 4', precio: 90, cantidad_total: 2000, cantidad_disponible: 1975, color_zona: '#10b981' },
      { id: 502, nombre: 'Cancha Central Fiesta', sector: 'Césped', puerta: 'Puerta 2', precio: 120, cantidad_total: 4000, cantidad_disponible: 3940, color_zona: '#6366f1' },
      { id: 503, nombre: 'Preferencia Techada Tupiza', sector: 'Occidente', puerta: 'Puerta 3', precio: 150, cantidad_total: 1500, cantidad_disponible: 1480, color_zona: '#38bdf8' },
      { id: 504, nombre: 'VIP Chicheño de Oro + Brindis', sector: 'Frente al Escenario', puerta: 'Puerta 1', precio: 220, cantidad_total: 600, cantidad_disponible: 590, color_zona: '#f59e0b' }
    ]
  },
  {
    id: 6,
    nombre: 'Mega Cumbia & Rock Fest Potosí 2026',
    subtitulo: 'A 3.900 metros de altura frente al Cerro Rico',
    categoria: 'Festivales',
    ciudad: 'Potosí',
    departamento: 'Potosí',
    tipo_recinto: 'estadio',
    descripcion: 'El gran encuentro musical en el coloso de San Clemente. Las mejores bandas de cumbia sureña, rock boliviano y ritmos urbanos calentando la noche en la histórica Villa Imperial.',
    fecha: '2026-11-22',
    hora: '18:00',
    lugar: 'Estadio Víctor Agustín Ugarte, Potosí',
    ubicacion_mapa: 'Estadio Victor Agustin Ugarte, Potosi, Bolivia',
    estadio_nombre: 'Estadio Víctor Agustín Ugarte (Potosí)',
    capacidad_estadio: '32.105 espectadores',
    lat: -19.5786,
    lng: -65.7533,
    imagen_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    precio_base: 80,
    cupo_total: 6000,
    organizador_id: 1,
    organizador_nombre: 'Carlos Mendoza',
    sectores_geograficos: [
      { id: 'vip', nombre: 'VIP Imperial', ubicacion_estadio: 'Frente al Escenario', puerta: 'Puerta Principal - Av. Universitaria', color: '#f59e0b', precio: 200, capacidad: 600, disponibles: 585 },
      { id: 'cancha', nombre: 'Cancha Libre', ubicacion_estadio: 'Césped Central', puerta: 'Rampa San Clemente', color: '#6366f1', precio: 120, capacidad: 3500, disponibles: 3460 },
      { id: 'preferencial', nombre: 'Tribuna Preferencial', ubicacion_estadio: 'Occidente Techado', puerta: 'Puerta 2', color: '#38bdf8', precio: 140, capacidad: 1200, disponibles: 1180 },
      { id: 'general', nombre: 'General y Curvas', ubicacion_estadio: 'Graderías Este y Sur', puerta: 'Puertas 3 y 4', color: '#10b981', precio: 80, capacidad: 2000, disponibles: 1970 }
    ],
    tipos_ticket: [
      { id: 601, nombre: 'General y Curvas', sector: 'Graderías', puerta: 'Puertas 3 y 4', precio: 80, cantidad_total: 2000, cantidad_disponible: 1970, color_zona: '#10b981' },
      { id: 602, nombre: 'Cancha Libre', sector: 'Césped', puerta: 'Rampa San Clemente', precio: 120, cantidad_total: 3500, cantidad_disponible: 3460, color_zona: '#6366f1' },
      { id: 603, nombre: 'Tribuna Preferencial', sector: 'Occidente', puerta: 'Puerta 2', precio: 140, cantidad_total: 1200, cantidad_disponible: 1180, color_zona: '#38bdf8' },
      { id: 604, nombre: 'VIP Imperial Front Stage', sector: 'Escenario', puerta: 'Puerta 1', precio: 200, cantidad_total: 600, cantidad_disponible: 585, color_zona: '#f59e0b' }
    ]
  },
  {
    id: 7,
    nombre: 'Sucre Filarmónica & Rock Sinfónico',
    subtitulo: 'Magna velada en la joya teatral de la Ciudad Blanca',
    categoria: 'Rock',
    ciudad: 'Sucre',
    departamento: 'Chuquisaca',
    tipo_recinto: 'teatro',
    descripcion: 'La Orquesta Filarmónica junto a leyendas del rock en una fusión sinfónica sublime. Clásicos del rock adaptados con arreglos para 60 músicos de cuerda, metales y banda eléctrica en el emblemático Teatro Gran Mariscal.',
    fecha: '2026-12-02',
    hora: '19:30',
    lugar: 'Teatro Gran Mariscal de Ayacucho, Sucre',
    ubicacion_mapa: 'Teatro Gran Mariscal de Ayacucho, Sucre, Bolivia',
    estadio_nombre: 'Teatro Gran Mariscal de Ayacucho',
    capacidad_estadio: '1.200 espectadores',
    lat: -19.0436,
    lng: -65.2597,
    imagen_url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80',
    precio_base: 90,
    cupo_total: 800,
    organizador_id: 1,
    organizador_nombre: 'Carlos Mendoza',
    sectores_geograficos: [
      { id: 'platea_vip', nombre: 'Platea Baja Presidencial', ubicacion_estadio: 'Filas 1 a 10', puerta: 'Puerta Principal - Plaza Libertad', color: '#f59e0b', precio: 190, capacidad: 250, disponibles: 240 },
      { id: 'platea_alta', nombre: 'Platea Alta', ubicacion_estadio: 'Filas 11 a 24', puerta: 'Puerta Principal', color: '#38bdf8', precio: 140, capacidad: 250, disponibles: 242 },
      { id: 'palcos', nombre: 'Palcos Oficiales', ubicacion_estadio: 'Nivel 1 Panorámico', puerta: 'Escalinatas de Mármol', color: '#8b5cf6', precio: 160, capacidad: 120, disponibles: 115 },
      { id: 'anfiteatro', nombre: 'Galería Alta', ubicacion_estadio: 'Nivel Superior Acústico', puerta: 'Acceso Lateral', color: '#10b981', precio: 90, capacidad: 180, disponibles: 175 }
    ],
    tipos_ticket: [
      { id: 701, nombre: 'Galería Alta', sector: 'Nivel Superior', puerta: 'Acceso Lateral', precio: 90, cantidad_total: 180, cantidad_disponible: 175, color_zona: '#10b981' },
      { id: 702, nombre: 'Platea Alta', sector: 'Filas 11-24', puerta: 'Puerta Principal', precio: 140, cantidad_total: 250, cantidad_disponible: 242, color_zona: '#38bdf8' },
      { id: 703, nombre: 'Palcos de Honor', sector: 'Nivel 1', puerta: 'Escalinatas', precio: 160, cantidad_total: 120, cantidad_disponible: 115, color_zona: '#8b5cf6' },
      { id: 704, nombre: 'Platea Baja Presidencial', sector: 'Filas 1-10', puerta: 'Puerta Principal', precio: 190, cantidad_total: 250, cantidad_disponible: 240, color_zona: '#f59e0b' }
    ]
  },
  {
    id: 8,
    nombre: 'Festival de la Vendimia & Vino Chapaco 2026',
    subtitulo: 'Música, coplas y cata a orillas del Guadalquivir',
    categoria: 'Festivales',
    ciudad: 'Tarija',
    departamento: 'Tarija',
    tipo_recinto: 'arena',
    descripcion: 'El festival más alegre y aromático de la primavera tarijeña. Grupos folclóricos de renombre, violines chapacos, zapateos y degustación libre de bodegas artesanales en el Parque Temático de Tarija.',
    fecha: '2026-11-29',
    hora: '16:00',
    lugar: 'Parque Temático de Tarija, Tarija',
    ubicacion_mapa: 'Parque Tematico de Tarija, Tarija, Bolivia',
    estadio_nombre: 'Parque Temático de Tarija',
    capacidad_estadio: '12.000 espectadores',
    lat: -21.5433,
    lng: -64.7267,
    imagen_url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80',
    precio_base: 80,
    cupo_total: 4500,
    organizador_id: 1,
    organizador_nombre: 'Carlos Mendoza',
    sectores_geograficos: [
      { id: 'golden_circle', nombre: 'VIP Vendimia & Cata', ubicacion_estadio: 'Frente al Escenario', puerta: 'Acceso Av. Integración', color: '#f59e0b', precio: 240, capacidad: 500, disponibles: 480 },
      { id: 'pista_central', nombre: 'Pista Central Rueda Chapaca', ubicacion_estadio: 'Explanada Principal', puerta: 'Puerta 1 - Río Guadalquivir', color: '#6366f1', precio: 120, capacidad: 2500, disponibles: 2460 },
      { id: 'general_arena', nombre: 'General Parque Temático', ubicacion_estadio: 'Graderías y Áreas Verdes', puerta: 'Puerta 2 - Puente Bicentenario', color: '#10b981', precio: 80, capacidad: 1500, disponibles: 1470 }
    ],
    tipos_ticket: [
      { id: 801, nombre: 'General Áreas Verdes', sector: 'Perímetro', puerta: 'Puerta 2', precio: 80, cantidad_total: 1500, cantidad_disponible: 1470, color_zona: '#10b981' },
      { id: 802, nombre: 'Pista Central Rueda Chapaca', sector: 'Explanada', puerta: 'Puerta 1', precio: 120, cantidad_total: 2500, cantidad_disponible: 2460, color_zona: '#6366f1' },
      { id: 803, nombre: 'VIP Vendimia + Copa Conmemorativa', sector: 'Front Stage', puerta: 'Av. Integración', precio: 240, cantidad_total: 500, cantidad_disponible: 480, color_zona: '#f59e0b' }
    ]
  },
  {
    id: 9,
    nombre: 'Carnaval & Morenada Sound Arena 2026',
    subtitulo: 'Las bandas de bronce más potentes del mundo en el Bermúdez',
    categoria: 'Festivales',
    ciudad: 'Oruro',
    departamento: 'Oruro',
    tipo_recinto: 'estadio',
    descripcion: 'Más de 300 músicos de bronce, platillos y tambores junto a las fraternidades emblemáticas del Carnaval de Oruro, Obra Maestra del Patrimonio de la Humanidad. Un derroche de fe, cultura, vestimentas bordadas y sonido atronador.',
    fecha: '2026-11-25',
    hora: '17:00',
    lugar: 'Estadio Jesús Bermúdez, Oruro',
    ubicacion_mapa: 'Estadio Jesus Bermudez, Oruro, Bolivia',
    estadio_nombre: 'Estadio Jesús Bermúdez',
    capacidad_estadio: '33.000 espectadores',
    lat: -17.9483,
    lng: -67.1147,
    imagen_url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
    precio_base: 70,
    cupo_total: 7000,
    organizador_id: 1,
    organizador_nombre: 'Carlos Mendoza',
    sectores_geograficos: [
      { id: 'vip', nombre: 'VIP Morenada Central', ubicacion_estadio: 'Frente al Escenario Monumental', puerta: 'Puerta 1 - Av. Sargento Flores', color: '#f59e0b', precio: 210, capacidad: 600, disponibles: 580 },
      { id: 'cancha', nombre: 'Cancha Danza & Césped', ubicacion_estadio: 'Campo Central', puerta: 'Puerta 2 - Rampa Norte', color: '#6366f1', precio: 110, capacidad: 3500, disponibles: 3450 },
      { id: 'preferencial', nombre: 'Preferencia Oruro', ubicacion_estadio: 'Occidente Techado', puerta: 'Puerta 3', color: '#38bdf8', precio: 130, capacidad: 1400, disponibles: 1380 },
      { id: 'general', nombre: 'General & Curvas Quirquincho', ubicacion_estadio: 'Tribuna Este', puerta: 'Puertas 4 y 5', color: '#10b981', precio: 70, capacidad: 2000, disponibles: 1960 }
    ],
    tipos_ticket: [
      { id: 901, nombre: 'General & Curvas Quirquincho', sector: 'Graderías', puerta: 'Puertas 4 y 5', precio: 70, cantidad_total: 2000, cantidad_disponible: 1960, color_zona: '#10b981' },
      { id: 902, nombre: 'Cancha Danza & Césped', sector: 'Césped', puerta: 'Puerta 2', precio: 110, cantidad_total: 3500, cantidad_disponible: 3450, color_zona: '#6366f1' },
      { id: 903, nombre: 'Preferencia Oruro', sector: 'Occidente', puerta: 'Puerta 3', precio: 130, cantidad_total: 1400, cantidad_disponible: 1380, color_zona: '#38bdf8' },
      { id: 904, nombre: 'VIP Morenada Central', sector: 'Front Stage', puerta: 'Puerta 1', precio: 210, cantidad_total: 600, cantidad_disponible: 580, color_zona: '#f59e0b' }
    ]
  },
  {
    id: 10,
    nombre: 'Illimani Metal & Rock Summit 2026',
    subtitulo: 'Potencia sonora bajo las estrellas en el Teatro al Aire Libre',
    categoria: 'Rock',
    ciudad: 'La Paz',
    departamento: 'La Paz',
    tipo_recinto: 'arena',
    descripcion: 'Las mejores bandas de heavy metal, rock clásico y progresivo del país y Sudamérica en el histórico anfiteatro Jaime Laredo. Escenario con sonido envolvente y efectos de fuego real.',
    fecha: '2026-12-18',
    hora: '18:00',
    lugar: 'Teatro al Aire Libre Jaime Laredo, La Paz',
    ubicacion_mapa: 'Teatro al Aire Libre Jaime Laredo, La Paz, Bolivia',
    estadio_nombre: 'Teatro al Aire Libre "Jaime Laredo"',
    capacidad_estadio: '9.000 espectadores',
    lat: -16.5028,
    lng: -68.1278,
    imagen_url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80',
    precio_base: 100,
    cupo_total: 3500,
    organizador_id: 1,
    organizador_nombre: 'Carlos Mendoza',
    sectores_geograficos: [
      { id: 'golden_circle', nombre: 'VIP Moshpit Front Stage', ubicacion_estadio: 'Frente al Escenario', puerta: 'Acceso Av. del Poeta', color: '#f59e0b', precio: 250, capacidad: 500, disponibles: 485 },
      { id: 'pista_central', nombre: 'Pista General', ubicacion_estadio: 'Explanada Baja', puerta: 'Acceso Central', color: '#6366f1', precio: 150, capacidad: 1800, disponibles: 1780 },
      { id: 'general_arena', nombre: 'Graderías Panorámicas', ubicacion_estadio: 'Graderías de Piedra', puerta: 'Acceso Parque Urbano', color: '#10b981', precio: 100, capacidad: 1200, disponibles: 1180 }
    ],
    tipos_ticket: [
      { id: 1001, nombre: 'Graderías Panorámicas', sector: 'Graderías', puerta: 'Acceso Parque', precio: 100, cantidad_total: 1200, cantidad_disponible: 1180, color_zona: '#10b981' },
      { id: 1002, nombre: 'Pista General', sector: 'Explanada', puerta: 'Acceso Central', precio: 150, cantidad_total: 1800, cantidad_disponible: 1780, color_zona: '#6366f1' },
      { id: 1003, nombre: 'VIP Moshpit Front Stage', sector: 'Frente al Artista', puerta: 'Av. del Poeta', precio: 250, cantidad_total: 500, cantidad_disponible: 485, color_zona: '#f59e0b' }
    ]
  },
  {
    id: 11,
    nombre: 'Expocruz Mega Live 2026',
    subtitulo: 'El macroconcierto de música urbana y pop en FEXPOCRUZ',
    categoria: 'Festivales',
    ciudad: 'Santa Cruz',
    departamento: 'Santa Cruz',
    tipo_recinto: 'arena',
    descripcion: 'La Arena Fexpocruz vibra con los máximos exponentes del pop latino, reggaetón y trap internacional. 3 escenarios simultáneos, patio gastronómico gourmet y zonas exclusivas para influencers y prensa.',
    fecha: '2026-11-10',
    hora: '17:00',
    lugar: 'Predio Ferial Fexpocruz, Santa Cruz',
    ubicacion_mapa: 'Arena Fexpocruz, Santa Cruz, Bolivia',
    estadio_nombre: 'Arena FEXPOCRUZ',
    capacidad_estadio: '25.000 espectadores',
    lat: -17.7886,
    lng: -63.2089,
    imagen_url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1200&q=80',
    precio_base: 150,
    cupo_total: 8000,
    organizador_id: 1,
    organizador_nombre: 'Carlos Mendoza',
    sectores_geograficos: [
      { id: 'golden_circle', nombre: 'VIP Diamond Experience', ubicacion_estadio: 'Plataforma VIP Elevada', puerta: 'Puerta Bandera', color: '#f59e0b', precio: 500, capacidad: 800, disponibles: 760 },
      { id: 'pista_central', nombre: 'Pista Arena Central', ubicacion_estadio: 'Pista Frente al Escenario', puerta: 'Puerta 2 Roca y Coronado', color: '#6366f1', precio: 250, capacidad: 4200, disponibles: 4120 },
      { id: 'general_arena', nombre: 'General Fexpocruz', ubicacion_estadio: 'Sector Perimetral', puerta: 'Puerta 4 Sur', color: '#10b981', precio: 150, capacidad: 3000, disponibles: 2950 }
    ],
    tipos_ticket: [
      { id: 1101, nombre: 'General Fexpocruz', sector: 'Perímetro', puerta: 'Puerta 4 Sur', precio: 150, cantidad_total: 3000, cantidad_disponible: 2950, color_zona: '#10b981' },
      { id: 1102, nombre: 'Pista Arena Central', sector: 'Pista Central', puerta: 'Puerta 2', precio: 250, cantidad_total: 4200, cantidad_disponible: 4120, color_zona: '#6366f1' },
      { id: 1103, nombre: 'VIP Diamond Experience + Open Bar', sector: 'Plataforma VIP', puerta: 'Puerta Bandera', precio: 500, cantidad_total: 800, cantidad_disponible: 760, color_zona: '#f59e0b' }
    ]
  },
  {
    id: 12,
    nombre: 'High-Altitude Electronic Summit El Alto',
    subtitulo: 'Música electrónica a 4.088 metros de altura en Villa Ingenio',
    categoria: 'Electrónica',
    ciudad: 'El Alto',
    departamento: 'La Paz',
    tipo_recinto: 'estadio',
    descripcion: 'Un evento sin precedentes en el estadio más alto del circuito internacional. DJs de techno de Berlín y Sudamérica con visuales hipnóticas proyectadas en pantallas colosales de 360 grados.',
    fecha: '2026-12-20',
    hora: '16:00',
    lugar: 'Estadio Municipal de Villa Ingenio, El Alto',
    ubicacion_mapa: 'Estadio Municipal de Villa Ingenio, El Alto, Bolivia',
    estadio_nombre: 'Estadio Municipal de El Alto (Villa Ingenio)',
    capacidad_estadio: '25.000 espectadores',
    lat: -16.4714,
    lng: -68.1947,
    imagen_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    precio_base: 100,
    cupo_total: 5000,
    organizador_id: 1,
    organizador_nombre: 'Carlos Mendoza',
    sectores_geograficos: [
      { id: 'vip', nombre: 'VIP Altura 4088', ubicacion_estadio: 'Front Stage Escenario', puerta: 'Puerta 1 Juan Pablo II', color: '#f59e0b', precio: 300, capacidad: 500, disponibles: 485 },
      { id: 'cancha', nombre: 'Cancha Rave Césped', ubicacion_estadio: 'Césped Central', puerta: 'Puerta 2 Rampa', color: '#6366f1', precio: 170, capacidad: 2500, disponibles: 2470 },
      { id: 'general', nombre: 'Tribuna General El Alto', ubicacion_estadio: 'Tribuna Techada', puerta: 'Puertas 3 y 4', color: '#10b981', precio: 100, capacidad: 2000, disponibles: 1960 }
    ],
    tipos_ticket: [
      { id: 1201, nombre: 'Tribuna General El Alto', sector: 'Graderías', puerta: 'Puertas 3 y 4', precio: 100, cantidad_total: 2000, cantidad_disponible: 1960, color_zona: '#10b981' },
      { id: 1202, nombre: 'Cancha Rave Césped', sector: 'Césped', puerta: 'Puerta 2', precio: 170, cantidad_total: 2500, cantidad_disponible: 2470, color_zona: '#6366f1' },
      { id: 1203, nombre: 'VIP Altura 4088', sector: 'Front Stage', puerta: 'Puerta 1', precio: 300, cantidad_total: 500, cantidad_disponible: 485, color_zona: '#f59e0b' }
    ]
  }
];

export const COMPRAS_INICIALES = [
  {
    id: 1,
    codigo_ticket: 'TKT-9F3A1B4C',
    usuario_id: 2,
    usuario_nombre: 'Valeria Rojas',
    comprador_nombre: 'Valeria Rojas',
    comprador_email: 'comprador@ticketera.local',
    comprador_telefono: '+591 79876543',
    evento_id: 1,
    evento_nombre: 'Rock Stadium Fest 2026',
    evento_fecha: '2026-11-15',
    evento_hora: '19:00',
    evento_lugar: 'Estadio Hernando Siles, La Paz',
    tipo_ticket_id: 103,
    tipo_ticket_nombre: 'Cancha General (Campo)',
    cantidad: 2,
    precio_unitario: 220,
    total: 440,
    fecha_compra: '2026-10-05T14:30:00Z',
    qr_url: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=TKT-9F3A1B4C'
  },
  {
    id: 2,
    codigo_ticket: 'TKT-7K2M9X4P',
    usuario_id: 2,
    usuario_nombre: 'Valeria Rojas',
    comprador_nombre: 'Valeria Rojas',
    comprador_email: 'comprador@ticketera.local',
    comprador_telefono: '+591 79876543',
    evento_id: 5,
    evento_nombre: 'Festival Internacional de la Vendimia y Folclore de Tupiza 2026',
    evento_fecha: '2026-11-18',
    evento_hora: '17:00',
    evento_lugar: 'Estadio Departamental de Tupiza, Potosí',
    tipo_ticket_id: 504,
    tipo_ticket_nombre: 'VIP Chicheño de Oro + Brindis',
    cantidad: 1,
    precio_unitario: 220,
    total: 220,
    fecha_compra: '2026-10-12T11:15:00Z',
    qr_url: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=TKT-7K2M9X4P'
  }
];
