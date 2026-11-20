// ========================================================
// CATÁLOGO CENTRALIZADO: ESTADIOS Y RECINTOS DE BOLIVIA
// Fuente única de verdad para recintos deportivos, teatros,
// campos feriales y coliseos de los 9 departamentos + Tupiza.
// ========================================================

/**
 * Sectores estándar por tipo de recinto para evitar duplicación
 */
export const SECTORES_ESTADIO_DEFECTO = [
  { id: 'vip', nombre: 'VIP Front Stage', ubicacion_estadio: 'Frente al Escenario', puerta: 'Puerta 1 - Alfombra Roja', color: '#f59e0b', precio: 450, capacidad: 800 },
  { id: 'cancha', nombre: 'Cancha General / Campo', ubicacion_estadio: 'Césped Central', puerta: 'Puertas 2 y 3 - Rampa Principal', color: '#6366f1', precio: 220, capacidad: 4000 },
  { id: 'preferencial', nombre: 'Tribuna Preferencial (Occidente)', ubicacion_estadio: 'Sector Occidental', puerta: 'Puerta 4 - Palcos y Butacas', color: '#38bdf8', precio: 280, capacidad: 1500 },
  { id: 'general', nombre: 'Tribuna General (Oriente)', ubicacion_estadio: 'Sector Oriental', puerta: 'Puerta 7 - Gradería Este', color: '#10b981', precio: 180, capacidad: 2000 },
  { id: 'curva_norte', nombre: 'Curva Norte', ubicacion_estadio: 'Cabecera Norte', puerta: 'Puerta 9 - Acceso Norte', color: '#ec4899', precio: 140, capacidad: 1200 },
  { id: 'curva_sur', nombre: 'Curva Sur', ubicacion_estadio: 'Cabecera Sur', puerta: 'Puerta 12 - Acceso Sur', color: '#8b5cf6', precio: 140, capacidad: 1200 }
];

export const SECTORES_TEATRO_DEFECTO = [
  { id: 'platea_vip', nombre: 'Platea Baja VIP', ubicacion_estadio: 'Filas 1 a 10', puerta: 'Acceso Central - Alfombra Roja', color: '#f59e0b', precio: 180, capacidad: 200 },
  { id: 'platea_alta', nombre: 'Platea Alta', ubicacion_estadio: 'Filas 11 a 25', puerta: 'Pasillo Principal', color: '#38bdf8', precio: 130, capacidad: 300 },
  { id: 'palcos', nombre: 'Palcos Oficiales', ubicacion_estadio: 'Nivel Intermedio Panorámico', puerta: 'Escalinata Derecha / Izquierda', color: '#8b5cf6', precio: 150, capacidad: 120 },
  { id: 'anfiteatro', nombre: 'Anfiteatro / Galería', ubicacion_estadio: 'Nivel Superior Acústico', puerta: 'Escalinatas Superiores', color: '#10b981', precio: 80, capacidad: 250 }
];

export const SECTORES_ARENA_DEFECTO = [
  { id: 'golden_circle', nombre: 'Golden Circle VIP Lounge', ubicacion_estadio: 'Plataforma Elevada Front Stage', puerta: 'Acceso Exclusivo VIP', color: '#f59e0b', precio: 400, capacidad: 600 },
  { id: 'pista_central', nombre: 'Pista Central / Campo', ubicacion_estadio: 'Nivel Suelo Pista', puerta: 'Puertas de Acceso 1 y 2', color: '#6366f1', precio: 220, capacidad: 3500 },
  { id: 'graderia_vip', nombre: 'Gradería Preferencial', ubicacion_estadio: 'Laterales con Butacas', puerta: 'Puerta 3 - Rampa Este', color: '#38bdf8', precio: 260, capacidad: 1200 },
  { id: 'general_arena', nombre: 'General Arena', ubicacion_estadio: 'Sector Panorámico Perimetral', puerta: 'Puerta 4 - Rampa Oeste', color: '#10b981', precio: 150, capacidad: 2500 }
];

/**
 * Catálogo completo de recintos de Bolivia
 */
export const ESTADIOS_BOLIVIA = [
  // --------------------------------------------------------
  // LA PAZ & EL ALTO
  // --------------------------------------------------------
  {
    key: 'siles',
    id: 1,
    nombre: 'Estadio Olímpico Hernando Siles',
    lugar: 'Estadio Hernando Siles, La Paz',
    tipo: 'estadio',
    ciudad: 'La Paz',
    departamento: 'La Paz',
    capacidad: '41.143 espectadores',
    capacidadNum: 41143,
    direccion: 'Av. Saavedra, Zona Miraflores',
    lat: -16.4994,
    lng: -68.1225,
    eventoId: 1,
    concierto: 'Rock Stadium Fest 2026',
    fecha: '15 Nov 2026',
    sectores_geograficos: SECTORES_ESTADIO_DEFECTO,
    puertas: [
      { nombre: 'Puerta 1 y 4 (Av. Saavedra)', sectores: 'VIP Front Stage y Preferencial', apertura: '17:30 hrs' },
      { nombre: 'Puertas 2 y 3 (Rampa Sur)', sectores: 'Cancha General y Césped', apertura: '17:00 hrs' },
      { nombre: 'Puerta 7 (Calle Sanjinés)', sectores: 'Tribuna General (Oriente)', apertura: '17:00 hrs' },
      { nombre: 'Puertas 9 y 12 (Av. del Ejército / Carrasco)', sectores: 'Curvas Norte y Sur', apertura: '16:30 hrs' }
    ],
    descripcion: 'El coloso de Miraflores, principal escenario deportivo e internacional de La Paz a 3.600 msnm. Sede histórica de los recitales de rock y megafestivales más multitudinarios del país.'
  },
  {
    key: 'jaime_laredo',
    id: 2,
    nombre: 'Teatro al Aire Libre "Jaime Laredo"',
    lugar: 'Teatro al Aire Libre Jaime Laredo, La Paz',
    tipo: 'arena',
    ciudad: 'La Paz',
    departamento: 'La Paz',
    capacidad: '9.000 espectadores',
    capacidadNum: 9000,
    direccion: 'Av. del Poeta y Calle Bueno, Centro Urbano',
    lat: -16.5028,
    lng: -68.1278,
    eventoId: 10,
    concierto: 'Illimani Metal & Rock Summit 2026',
    fecha: '18 Dic 2026',
    sectores_geograficos: SECTORES_ARENA_DEFECTO,
    puertas: [
      { nombre: 'Acceso Av. del Poeta', sectores: 'VIP Golden Circle y Pista Central', apertura: '18:00 hrs' },
      { nombre: 'Acceso Parque Urbano Central', sectores: 'Graderías y General', apertura: '17:30 hrs' }
    ],
    descripcion: 'El mítico anfiteatro paceño de acústica natural bajo el cañón del río Choqueyapu. El templo del rock nacional e internacional en La Paz.'
  },
  {
    key: 'chuquiago',
    id: 3,
    nombre: 'Campo Ferial Chuquiago Marka',
    lugar: 'Campo Ferial Chuquiago Marka, La Paz',
    tipo: 'campo_ferial',
    ciudad: 'La Paz',
    departamento: 'La Paz',
    capacidad: '10.000 espectadores',
    capacidadNum: 10000,
    direccion: 'Av. Costanera, Bajo Següencoma (Zona Sur)',
    lat: -16.5397,
    lng: -68.0892,
    eventoId: null,
    concierto: 'Ferias, Exposiciones & Mega-Conciertos',
    fecha: 'Temporada 2026',
    sectores_geograficos: SECTORES_ARENA_DEFECTO,
    puertas: [
      { nombre: 'Acceso Principal Bloque Rojo', sectores: 'Auditorio y VIP Deck', apertura: '17:00 hrs' },
      { nombre: 'Acceso Rampa Costanera', sectores: 'Pabellones y Pista General', apertura: '16:30 hrs' }
    ],
    descripcion: 'Moderno complejo ferial y de convenciones de la Zona Sur paceña, con pabellones climatizados y explanadas para grandes montajes.'
  },
  {
    key: 'teatro_saavedra',
    id: 4,
    nombre: 'Teatro Municipal Alberto Saavedra Pérez',
    lugar: 'Teatro Municipal Alberto Saavedra Pérez, La Paz',
    tipo: 'teatro',
    ciudad: 'La Paz',
    departamento: 'La Paz',
    capacidad: '650 espectadores',
    capacidadNum: 650,
    direccion: 'Calle Genaro Sanjinés esq. Indaburo, Casco Viejo',
    lat: -16.4952,
    lng: -68.1362,
    eventoId: 4,
    concierto: 'Noche de Jazz & Blues Acústico',
    fecha: '12 Dic 2026',
    sectores_geograficos: SECTORES_TEATRO_DEFECTO,
    puertas: [
      { nombre: 'Puerta Principal de Honor (Calle Sanjinés)', sectores: 'Platea Baja VIP y Platea Alta', apertura: '19:15 hrs' },
      { nombre: 'Escalinatas Laterales', sectores: 'Palcos Oficiales y Galería', apertura: '19:15 hrs' }
    ],
    descripcion: 'Inaugurado en 1845, es el teatro más antiguo de Sudamérica en funcionamiento continuo, con imponente arquitectura neoclásica y acústica privilegiada.'
  },
  {
    key: 'villa_ingenio',
    id: 5,
    nombre: 'Estadio Municipal de El Alto (Villa Ingenio)',
    lugar: 'Estadio Municipal de Villa Ingenio, El Alto',
    tipo: 'estadio',
    ciudad: 'El Alto',
    departamento: 'La Paz',
    capacidad: '25.000 espectadores',
    capacidadNum: 25000,
    direccion: 'Distrito 5, Zona Villa Ingenio, El Alto',
    lat: -16.4714,
    lng: -68.1947,
    eventoId: 12,
    concierto: 'High-Altitude Electronic Summit El Alto',
    fecha: '20 Dic 2026',
    sectores_geograficos: SECTORES_ESTADIO_DEFECTO,
    puertas: [
      { nombre: 'Puertas 1 y 2 (Av. Juan Pablo II prolongación)', sectores: 'Preferencia y Cancha', apertura: '16:00 hrs' },
      { nombre: 'Puertas 3 y 4 (Sector Ingenio Norte)', sectores: 'General y Curvas', apertura: '15:30 hrs' }
    ],
    descripcion: 'El estadio internacional más alto del planeta a 4.088 msnm, con moderna iluminación LED y tribunas techadas de última generación.'
  },

  // --------------------------------------------------------
  // SANTA CRUZ
  // --------------------------------------------------------
  {
    key: 'tahuichi',
    id: 6,
    nombre: 'Estadio Ramón "Tahuichi" Aguilera',
    lugar: 'Estadio Ramón Tahuichi Aguilera, Santa Cruz',
    tipo: 'estadio',
    ciudad: 'Santa Cruz',
    departamento: 'Santa Cruz',
    capacidad: '38.500 espectadores',
    capacidadNum: 38500,
    direccion: 'Segundo Anillo, Av. Ejército Nacional',
    lat: -17.7972,
    lng: -63.1895,
    eventoId: 2,
    concierto: 'Santa Cruz Electronic Festival 2026',
    fecha: '28 Nov 2026',
    sectores_geograficos: SECTORES_ESTADIO_DEFECTO,
    puertas: [
      { nombre: 'Puerta 1 (Av. Ejército)', sectores: 'VIP Lounge y Pista Electrónica (Césped)', apertura: '16:00 hrs' },
      { nombre: 'Puerta 3 (Tribuna Oeste)', sectores: 'Preferencia Tahuichi', apertura: '16:30 hrs' },
      { nombre: 'Puerta 6 (Calle Choferes del Chaco)', sectores: 'Tribuna General Este', apertura: '16:00 hrs' },
      { nombre: 'Puertas 8 y 10 (Curvas)', sectores: 'Curvas Norte y Sur', apertura: '15:30 hrs' }
    ],
    descripcion: 'El principal templo deportivo y musical del oriente boliviano, hogar de inolvidables conciertos de talla internacional y festivales multitudinarios.'
  },
  {
    key: 'fexpocruz',
    id: 7,
    nombre: 'Arena FEXPOCRUZ',
    lugar: 'Predio Ferial Fexpocruz, Santa Cruz',
    tipo: 'arena',
    ciudad: 'Santa Cruz',
    departamento: 'Santa Cruz',
    capacidad: '25.000 espectadores',
    capacidadNum: 25000,
    direccion: 'Av. Roca y Coronado, entre 3er y 4to Anillo',
    lat: -17.7886,
    lng: -63.2089,
    eventoId: 11,
    concierto: 'Expocruz Mega Live 2026',
    fecha: '10 Nov 2026',
    sectores_geograficos: SECTORES_ARENA_DEFECTO,
    puertas: [
      { nombre: 'Puerta de la Bandera (Av. Roca y Coronado)', sectores: 'VIP Box y Pista Central', apertura: '17:00 hrs' },
      { nombre: 'Puerta 4 (Estacionamiento Sur)', sectores: 'Graderías y Sector General', apertura: '16:30 hrs' }
    ],
    descripcion: 'El epicentro ferial y de espectáculos más grande de Bolivia, sede de macroeventos de música urbana, pop internacional y ferias globales.'
  },
  {
    key: 'sonilum',
    id: 8,
    nombre: 'Arena Sonilum Boulevard',
    lugar: 'Sonilum Boulevard, Santa Cruz',
    tipo: 'arena',
    ciudad: 'Santa Cruz',
    departamento: 'Santa Cruz',
    capacidad: '12.000 espectadores',
    capacidadNum: 12000,
    direccion: '4to Anillo esq. Av. Alemana',
    lat: -17.7547,
    lng: -63.1672,
    eventoId: null,
    concierto: 'Festivales Pop & Electrónica',
    fecha: 'Temporada 2026',
    sectores_geograficos: SECTORES_ARENA_DEFECTO,
    puertas: [
      { nombre: 'Entrada Boulevard Principal', sectores: 'VIP Deck y Pista', apertura: '18:00 hrs' },
      { nombre: 'Acceso 4to Anillo', sectores: 'Sector General', apertura: '17:30 hrs' }
    ],
    descripcion: 'Innovador complejo al aire libre diseñado específicamente para la producción de conciertos de alta fidelidad, gastronomía y vida nocturna cruceña.'
  },
  {
    key: 'gilberto_parada',
    id: 9,
    nombre: 'Estadio Gilberto Parada ("La Caldera")',
    lugar: 'Estadio Gilberto Parada, Montero',
    tipo: 'estadio',
    ciudad: 'Montero',
    departamento: 'Santa Cruz',
    capacidad: '18.000 espectadores',
    capacidadNum: 18000,
    direccion: 'Zona Central, Montero, Santa Cruz',
    lat: -17.3411,
    lng: -63.2536,
    eventoId: null,
    concierto: 'Festivales del Norte Integrado',
    fecha: 'Temporada 2026',
    sectores_geograficos: SECTORES_ESTADIO_DEFECTO,
    puertas: [
      { nombre: 'Puerta 1 (Calle Independencia)', sectores: 'Preferencia y Cancha', apertura: '17:00 hrs' },
      { nombre: 'Puerta 2 (Calle Sucre)', sectores: 'General y Curvas', apertura: '16:30 hrs' }
    ],
    descripcion: 'Emblemático estadio del norte integrado cruceño con apasionada afición, sede de festivales cumbieros y eventos folclóricos.'
  },

  // --------------------------------------------------------
  // COCHABAMBA
  // --------------------------------------------------------
  {
    key: 'capriles',
    id: 10,
    nombre: 'Estadio Sudamericano Félix Capriles',
    lugar: 'Estadio Félix Capriles, Cochabamba',
    tipo: 'estadio',
    ciudad: 'Cochabamba',
    departamento: 'Cochabamba',
    capacidad: '32.000 espectadores',
    capacidadNum: 32000,
    direccion: 'Av. Libertador Bolívar, Zona Cala Cala',
    lat: -17.3792,
    lng: -66.1614,
    eventoId: 3,
    concierto: 'Cochabamba Fest: Ritmos & Folclore',
    fecha: '05 Dic 2026',
    sectores_geograficos: SECTORES_ESTADIO_DEFECTO,
    puertas: [
      { nombre: 'Puerta 1 (Cala Cala)', sectores: 'VIP Golden Circle y Frente al Escenario', apertura: '17:00 hrs' },
      { nombre: 'Puerta 2 (Rampa Libertador)', sectores: 'Cancha Libre Césped', apertura: '16:30 hrs' },
      { nombre: 'Puerta 4 (Av. Libertador Bolívar)', sectores: 'Preferencia Capriles', apertura: '16:30 hrs' },
      { nombre: 'Puertas 7 y 8 (Curvas)', sectores: 'General y Curvas Norte/Sur', apertura: '16:00 hrs' }
    ],
    descripcion: 'El máximo escenario de la llajta cochabambina, enclavado en Cala Cala. Testigo de inolvidables noches de folclore, rock y hermandad de los valles.'
  },
  {
    key: 'fexco_arena',
    id: 11,
    nombre: 'FEXCO Arena (Recinto Ferial Alalay)',
    lugar: 'FEXCO Recinto Ferial, Cochabamba',
    tipo: 'arena',
    ciudad: 'Cochabamba',
    departamento: 'Cochabamba',
    capacidad: '15.000 espectadores',
    capacidadNum: 15000,
    direccion: 'Circuito Bolivia, Laguna Alalay',
    lat: -17.4158,
    lng: -66.1389,
    eventoId: null,
    concierto: 'Feria Internacional & Conciertos FEXCO',
    fecha: 'Temporada 2026',
    sectores_geograficos: SECTORES_ARENA_DEFECTO,
    puertas: [
      { nombre: 'Acceso Puerta Principal Circuito Bolivia', sectores: 'VIP Deck y Pista Central', apertura: '17:30 hrs' },
      { nombre: 'Acceso Parqueo Laguna', sectores: 'Graderías y Sector General', apertura: '17:00 hrs' }
    ],
    descripcion: 'Espacio ferial moderno a orillas de la Laguna Alalay, equipado con infraestructura técnica de alto nivel para conciertos y festivales gastronómicos.'
  },
  {
    key: 'teatro_acha',
    id: 12,
    nombre: 'Teatro José María Achá',
    lugar: 'Teatro José María Achá, Cochabamba',
    tipo: 'teatro',
    ciudad: 'Cochabamba',
    departamento: 'Cochabamba',
    capacidad: '800 espectadores',
    capacidadNum: 800,
    direccion: 'Calle España entre Heroínas y Bolívar',
    lat: -17.3941,
    lng: -66.1558,
    eventoId: null,
    concierto: 'Recitales de Cámara y Jazz Valluno',
    fecha: 'Temporada 2026',
    sectores_geograficos: SECTORES_TEATRO_DEFECTO,
    puertas: [
      { nombre: 'Entrada de Honor Calle España', sectores: 'Platea Baja y Palcos', apertura: '19:00 hrs' }
    ],
    descripcion: 'Histórico recinto teatral del siglo XIX ubicado en el corazón colonial de Cochabamba, caracterizado por su acústica envolvente.'
  },

  // --------------------------------------------------------
  // POTOSÍ & TUPIZA (Tierra de Las Ovejas Negras De Tupiza)
  // --------------------------------------------------------
  {
    key: 'tupiza_estadio',
    id: 13,
    nombre: 'Estadio Departamental de Tupiza',
    lugar: 'Estadio Víctor Agustín Ugarte de Tupiza, Potosí',
    tipo: 'estadio',
    ciudad: 'Tupiza',
    departamento: 'Potosí',
    capacidad: '15.000 espectadores',
    capacidadNum: 15000,
    direccion: 'Av. Chichas, Barrio Central, Tupiza',
    lat: -21.4428,
    lng: -65.7197,
    eventoId: 5,
    concierto: 'Festival Internacional de la Vendimia y Folclore de Tupiza 2026',
    fecha: '18 Nov 2026',
    sectores_geograficos: [
      { id: 'vip', nombre: 'VIP Chicheño de Oro', ubicacion_estadio: 'Frente al Gran Escenario', puerta: 'Puerta 1 - Av. Chichas', color: '#f59e0b', precio: 220, capacidad: 600 },
      { id: 'cancha', nombre: 'Cancha Central Fiesta', ubicacion_estadio: 'Césped Principal', puerta: 'Puerta 2 - Rampa Central', color: '#6366f1', precio: 120, capacidad: 4000 },
      { id: 'preferencial', nombre: 'Tribuna Preferencial Tupiza', ubicacion_estadio: 'Occidente Techado', puerta: 'Puerta 3 - Palcos', color: '#38bdf8', precio: 150, capacidad: 1500 },
      { id: 'general', nombre: 'Tribuna General Valle Hermoso', ubicacion_estadio: 'Oriente', puerta: 'Puerta 4 - Acceso Este', color: '#10b981', precio: 90, capacidad: 2000 }
    ],
    puertas: [
      { nombre: 'Puerta 1 (Av. Chichas)', sectores: 'VIP Chicheño de Oro y Palcos', apertura: '17:00 hrs' },
      { nombre: 'Puerta 2 (Rampa Central)', sectores: 'Cancha Central Fiesta', apertura: '16:30 hrs' },
      { nombre: 'Puertas 3 y 4 (Graderías)', sectores: 'Preferencia y General', apertura: '16:00 hrs' }
    ],
    descripcion: '¡Orgullo de los valles del sur y cuna de Los Chichas! El epicentro cultural y deportivo de Tupiza, escenario de las más grandes celebraciones de folclore, chacarera y festivales chicheños.'
  },
  {
    key: 'potosi_ugarte',
    id: 14,
    nombre: 'Estadio Víctor Agustín Ugarte (Potosí)',
    lugar: 'Estadio Víctor Agustín Ugarte, Potosí',
    tipo: 'estadio',
    ciudad: 'Potosí',
    departamento: 'Potosí',
    capacidad: '32.105 espectadores',
    capacidadNum: 32105,
    direccion: 'Zona San Clemente, Av. Universitaria',
    lat: -19.5786,
    lng: -65.7533,
    eventoId: 6,
    concierto: 'Mega Cumbia & Rock Fest Potosí 2026',
    fecha: '22 Nov 2026',
    sectores_geograficos: SECTORES_ESTADIO_DEFECTO,
    puertas: [
      { nombre: 'Puerta Principal (Av. Universitaria)', sectores: 'VIP y Preferencia', apertura: '16:30 hrs' },
      { nombre: 'Puerta Rampa San Clemente', sectores: 'Cancha General', apertura: '16:00 hrs' },
      { nombre: 'Puertas Curvas Norte y Sur', sectores: 'Curvas y General', apertura: '15:30 hrs' }
    ],
    descripcion: 'El coloso de la Villa Imperial a 3.900 msnm. Uno de los estadios más altos y majestuosos del continente, con vista panorámica al Cerro Rico de Potosí.'
  },
  {
    key: 'coliseo_potosi',
    id: 15,
    nombre: 'Coliseo Ciudad de Potosí',
    lugar: 'Coliseo Ciudad de Potosí, Potosí',
    tipo: 'coliseo',
    ciudad: 'Potosí',
    departamento: 'Potosí',
    capacidad: '10.000 espectadores',
    capacidadNum: 10000,
    direccion: 'Calle Chayanta y Calle San Alberto',
    lat: -19.5847,
    lng: -65.7558,
    eventoId: null,
    concierto: 'Recitales y Festivales Andinos',
    fecha: 'Temporada 2026',
    sectores_geograficos: SECTORES_ARENA_DEFECTO,
    puertas: [
      { nombre: 'Acceso Calle Chayanta', sectores: 'Pista Central y Graderías Bajas', apertura: '17:30 hrs' },
      { nombre: 'Acceso Calle San Alberto', sectores: 'Graderías Altas', apertura: '17:00 hrs' }
    ],
    descripcion: 'Moderno coliseo techado con excelente acústica y temperatura controlada, ideal para grandes espectáculos bajo el cielo potosino.'
  },

  // --------------------------------------------------------
  // CHUQUISACA (SUCRE)
  // --------------------------------------------------------
  {
    key: 'patria_sucre',
    id: 16,
    nombre: 'Estadio Olímpico Patria',
    lugar: 'Estadio Olímpico Patria, Sucre',
    tipo: 'estadio',
    ciudad: 'Sucre',
    departamento: 'Chuquisaca',
    capacidad: '32.700 espectadores',
    capacidadNum: 32700,
    direccion: 'Av. Jaime Mendoza, Sucre',
    lat: -19.0347,
    lng: -65.2536,
    eventoId: null,
    concierto: 'Festivales de la Capital Histórica',
    fecha: 'Temporada 2026',
    sectores_geograficos: SECTORES_ESTADIO_DEFECTO,
    puertas: [
      { nombre: 'Puerta Principal (Av. Jaime Mendoza)', sectores: 'Preferencia y Cancha', apertura: '17:00 hrs' },
      { nombre: 'Puertas 2 y 3 (Tribuna Este)', sectores: 'General y Curvas', apertura: '16:30 hrs' }
    ],
    descripcion: 'El principal escenario deportivo de la capital constitucional de Bolivia, equipado con pista atlética sintética y amplias tribunas.'
  },
  {
    key: 'teatro_mariscal',
    id: 17,
    nombre: 'Teatro Gran Mariscal de Ayacucho',
    lugar: 'Teatro Gran Mariscal de Ayacucho, Sucre',
    tipo: 'teatro',
    ciudad: 'Sucre',
    departamento: 'Chuquisaca',
    capacidad: '1.200 espectadores',
    capacidadNum: 1200,
    direccion: 'Plaza Libertad s/n, Sucre',
    lat: -19.0436,
    lng: -65.2597,
    eventoId: 7,
    concierto: 'Sucre Filarmónica & Rock Sinfónico',
    fecha: '02 Dic 2026',
    sectores_geograficos: SECTORES_TEATRO_DEFECTO,
    puertas: [
      { nombre: 'Puerta de Honor (Plaza Libertad)', sectores: 'Platea Baja y Palcos', apertura: '19:00 hrs' },
      { nombre: 'Acceso Galería Lateral', sectores: 'Galería Alta', apertura: '18:45 hrs' }
    ],
    descripcion: 'Monumento arquitectónico y joya cultural de la Ciudad Blanca de Sucre, réplica de la Ópera de París con acústica sublime.'
  },

  // --------------------------------------------------------
  // TARIJA
  // --------------------------------------------------------
  {
    key: 'iv_centenario',
    id: 18,
    nombre: 'Estadio IV Centenario',
    lugar: 'Estadio IV Centenario, Tarija',
    tipo: 'estadio',
    ciudad: 'Tarija',
    departamento: 'Tarija',
    capacidad: '20.000 espectadores',
    capacidadNum: 20000,
    direccion: 'Av. Las Panosas esq. Potosí, Barrio La Pampa',
    lat: -21.5358,
    lng: -64.7314,
    eventoId: null,
    concierto: 'Mega Conciertos del Sur Tarijeño',
    fecha: 'Temporada 2026',
    sectores_geograficos: SECTORES_ESTADIO_DEFECTO,
    puertas: [
      { nombre: 'Puerta Principal (Av. Las Panosas)', sectores: 'Preferencia y Cancha', apertura: '17:00 hrs' },
      { nombre: 'Puerta Este (Calle Potosí)', sectores: 'General y Curvas', apertura: '16:30 hrs' }
    ],
    descripcion: 'El bastión del deporte y el entretenimiento tarijeño, situado en el tradicional barrio de La Pampa en la capital de la sonrisa.'
  },
  {
    key: 'parque_tematico',
    id: 19,
    nombre: 'Parque Temático de Tarija',
    lugar: 'Parque Temático de Tarija, Tarija',
    tipo: 'arena',
    ciudad: 'Tarija',
    departamento: 'Tarija',
    capacidad: '12.000 espectadores',
    capacidadNum: 12000,
    direccion: 'Av. Integración, Costanera del Río Guadalquivir',
    lat: -21.5433,
    lng: -64.7267,
    eventoId: 8,
    concierto: 'Festival de la Vendimia & Vino Chapaco 2026',
    fecha: '29 Nov 2026',
    sectores_geograficos: SECTORES_ARENA_DEFECTO,
    puertas: [
      { nombre: 'Acceso Av. Integración', sectores: 'VIP Chapaco y Pista Central', apertura: '17:30 hrs' },
      { nombre: 'Acceso Puente Bicentenario', sectores: 'Graderías y Sector General', apertura: '17:00 hrs' }
    ],
    descripcion: 'Explanada monumental a orillas del legendario Río Guadalquivir, escenario de los conciertos de carnaval y festivales vitivinícolas más alegres del país.'
  },

  // --------------------------------------------------------
  // ORURO
  // --------------------------------------------------------
  {
    key: 'bermudez_oruro',
    id: 20,
    nombre: 'Estadio Jesús Bermúdez',
    lugar: 'Estadio Jesús Bermúdez, Oruro',
    tipo: 'estadio',
    ciudad: 'Oruro',
    departamento: 'Oruro',
    capacidad: '33.000 espectadores',
    capacidadNum: 33000,
    direccion: 'Av. Sargento Flores y Calle La Paz, Zona Norte',
    lat: -17.9483,
    lng: -67.1147,
    eventoId: 9,
    concierto: 'Carnaval & Morenada Sound Arena 2026',
    fecha: '25 Nov 2026',
    sectores_geograficos: SECTORES_ESTADIO_DEFECTO,
    puertas: [
      { nombre: 'Puerta Principal (Av. Sargento Flores)', sectores: 'VIP y Preferencia', apertura: '16:00 hrs' },
      { nombre: 'Puerta Rampa Norte', sectores: 'Cancha General Césped', apertura: '15:30 hrs' },
      { nombre: 'Puertas Este y Curvas', sectores: 'General y Curvas', apertura: '15:00 hrs' }
    ],
    descripcion: 'El templo deportivo de la capital del folclore boliviano, hogar de las más grandes manifestaciones musicales, bandas de bronce y recitales andinos.'
  },
  {
    key: 'palacio_deportes_oruro',
    id: 21,
    nombre: 'Palacio de los Deportes Eduardo Leclere Polo',
    lugar: 'Palacio de los Deportes, Oruro',
    tipo: 'coliseo',
    ciudad: 'Oruro',
    departamento: 'Oruro',
    capacidad: '12.000 espectadores',
    capacidadNum: 12000,
    direccion: 'Zona Sud, Calle 6 de Octubre y Campo Ferial',
    lat: -17.9803,
    lng: -67.1189,
    eventoId: null,
    concierto: 'Festival Nacional de la Canción Aquí... Canta Bolivia',
    fecha: 'Temporada 2026',
    sectores_geograficos: SECTORES_ARENA_DEFECTO,
    puertas: [
      { nombre: 'Acceso Principal Calle 6 de Octubre', sectores: 'Pista y Butacas Bajas', apertura: '17:30 hrs' }
    ],
    descripcion: 'Coliseo cubierto de gran capacidad, sede del histórico festival folclórico "Aquí... Canta Bolivia".'
  },

  // --------------------------------------------------------
  // BENI & PANDO
  // --------------------------------------------------------
  {
    key: 'gran_mamore',
    id: 22,
    nombre: 'Estadio Gran Mamoré',
    lugar: 'Estadio Gran Mamoré, Trinidad, Beni',
    tipo: 'estadio',
    ciudad: 'Trinidad',
    departamento: 'Beni',
    capacidad: '15.000 espectadores',
    capacidadNum: 15000,
    direccion: 'Av. Busch y Circunvalación, Trinidad',
    lat: -14.8322,
    lng: -64.9042,
    eventoId: null,
    concierto: 'Festival del Macheteroy Ritmos Amazónicos',
    fecha: 'Temporada 2026',
    sectores_geograficos: SECTORES_ESTADIO_DEFECTO,
    puertas: [
      { nombre: 'Puerta Principal (Av. Busch)', sectores: 'Preferencia y Cancha', apertura: '17:00 hrs' }
    ],
    descripcion: 'El principal coliseo deportivo de la Amazonía beniana, sede de conciertos veraniegos y festivales tradicionales trinitarios.'
  },
  {
    key: 'jordan_cuellar',
    id: 23,
    nombre: 'Estadio Roberto Jordán Cuéllar',
    lugar: 'Estadio Roberto Jordán Cuéllar, Cobija, Pando',
    tipo: 'estadio',
    ciudad: 'Cobija',
    departamento: 'Pando',
    capacidad: '24.000 espectadores',
    capacidadNum: 24000,
    direccion: 'Av. Pando, Cobija, Pando',
    lat: -11.0264,
    lng: -68.7692,
    eventoId: null,
    concierto: 'Festival de la Castaña & Frontera Live',
    fecha: 'Temporada 2026',
    sectores_geograficos: SECTORES_ESTADIO_DEFECTO,
    puertas: [
      { nombre: 'Puerta Principal Av. Pando', sectores: 'Preferencia y Pista', apertura: '17:00 hrs' }
    ],
    descripcion: 'El imponente recinto del extremo norte de Bolivia en Cobija, con césped natural y moderna infraestructura amazónica.'
  }
];

/**
 * Helper para obtener todos los departamentos únicos
 */
export const DEPARTAMENTOS_BOLIVIA = [
  'Todos',
  'La Paz',
  'Santa Cruz',
  'Cochabamba',
  'Potosí',
  'Chuquisaca',
  'Tarija',
  'Oruro',
  'Beni',
  'Pando'
];

/**
 * Helper para obtener ciudades con recintos
 */
export const CIUDADES_BOLIVIA = [
  'Todas',
  'La Paz',
  'El Alto',
  'Santa Cruz',
  'Cochabamba',
  'Tupiza',
  'Potosí',
  'Sucre',
  'Tarija',
  'Oruro',
  'Montero',
  'Trinidad',
  'Cobija'
];

/**
 * Helper para obtener un recinto por key o id
 */
export function obtenerEstadioPorKey(key) {
  if (!key) return null;
  return ESTADIOS_BOLIVIA.find(est => est.key === key || String(est.id) === String(key)) || null;
}

/**
 * Helper para obtener sectores predeterminados según el tipo de recinto
 */
export function obtenerSectoresPorTipo(tipo) {
  switch (tipo) {
    case 'teatro':
      return SECTORES_TEATRO_DEFECTO;
    case 'arena':
    case 'campo_ferial':
    case 'coliseo':
      return SECTORES_ARENA_DEFECTO;
    case 'estadio':
    default:
      return SECTORES_ESTADIO_DEFECTO;
  }
}
