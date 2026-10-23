// ========================================================
// CATÁLOGO CENTRALIZADO: ESTADIOS Y RECINTOS DE BOLIVIA
// Fuente única de verdad para evitar datos duplicados
// ========================================================

export const ESTADIOS_BOLIVIA = [
  {
    key: 'siles',
    id: 1,
    nombre: 'Estadio Olímpico Hernando Siles',
    lugar: 'Estadio Hernando Siles, La Paz',
    ciudad: 'La Paz',
    capacidad: '41.143 espectadores',
    direccion: 'Av. Saavedra, Miraflores',
    lat: -16.4994,
    lng: -68.1225,
    eventoId: 1,
    concierto: 'Rock Stadium Fest 2026',
    fecha: '15 Nov 2026'
  },
  {
    key: 'tahuichi',
    id: 2,
    nombre: 'Estadio Ramón Tahuichi Aguilera',
    lugar: 'Estadio Ramón Tahuichi Aguilera, Santa Cruz',
    ciudad: 'Santa Cruz',
    capacidad: '38.500 espectadores',
    direccion: '2do Anillo, Av. Ejército',
    lat: -17.7972,
    lng: -63.1895,
    eventoId: 2,
    concierto: 'Santa Cruz Electronic Festival',
    fecha: '28 Nov 2026'
  },
  {
    key: 'capriles',
    id: 3,
    nombre: 'Estadio Sudamericano Félix Capriles',
    lugar: 'Estadio Félix Capriles, Cochabamba',
    ciudad: 'Cochabamba',
    capacidad: '32.000 espectadores',
    direccion: 'Zona Cala Cala, Av. Libertador Bolívar',
    lat: -17.3792,
    lng: -66.1614,
    eventoId: 3,
    concierto: 'Cochabamba Fest: Ritmos & Folclore',
    fecha: '05 Dic 2026'
  },
  {
    key: 'teatro',
    id: 4,
    nombre: 'Teatro Municipal Alberto Saavedra Pérez',
    lugar: 'Teatro Municipal Alberto Saavedra Pérez, La Paz',
    ciudad: 'La Paz',
    capacidad: '650 espectadores',
    direccion: 'Calle Genaro Sanjinés, Casco Viejo',
    lat: -16.4952,
    lng: -68.1362,
    eventoId: 4,
    concierto: 'Noche de Jazz & Blues Acústico',
    fecha: '12 Dic 2026'
  },
  {
    key: 'chuquiago',
    id: 5,
    nombre: 'Campo Ferial Chuquiago Marka',
    lugar: 'Campo Ferial Chuquiago Marka, La Paz',
    ciudad: 'La Paz',
    capacidad: '10.000 espectadores',
    direccion: 'Bajo Següencoma, Av. Costanera',
    lat: -16.5397,
    lng: -68.0892,
    eventoId: null,
    concierto: 'Eventos y Ferias Especiales',
    fecha: '2026'
  }
];

export const SECTORES_ESTADIO_DEFECTO = [
  { id: 'vip', nombre: 'VIP Front Stage', ubicacion_estadio: 'Frente al Escenario', puerta: 'Puerta 1 - Alfombra Roja', color: '#f59e0b', precio: 450, capacidad: 800 },
  { id: 'cancha', nombre: 'Cancha General / Campo', ubicacion_estadio: 'Césped Central', puerta: 'Puertas 2 y 3 - Rampa Sur', color: '#6366f1', precio: 220, capacidad: 4000 },
  { id: 'preferencial', nombre: 'Tribuna Preferencial (Occidente)', ubicacion_estadio: 'Sector Occidental', puerta: 'Puerta 4 - Palcos y Butacas', color: '#38bdf8', precio: 280, capacidad: 1500 },
  { id: 'general', nombre: 'Tribuna General (Oriente)', ubicacion_estadio: 'Sector Oriental', puerta: 'Puerta 7 - Calle Sanjinés', color: '#10b981', precio: 180, capacidad: 2000 },
  { id: 'curva_norte', nombre: 'Curva Norte', ubicacion_estadio: 'Cabecera Norte', puerta: 'Puerta 9 - Av. del Ejército', color: '#ec4899', precio: 140, capacidad: 1200 },
  { id: 'curva_sur', nombre: 'Curva Sur', ubicacion_estadio: 'Cabecera Sur', puerta: 'Puerta 12 - Calle Carrasco', color: '#8b5cf6', precio: 140, capacidad: 1200 }
];
