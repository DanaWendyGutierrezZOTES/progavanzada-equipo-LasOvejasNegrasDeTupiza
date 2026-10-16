// ========================================================
// PÁGINA: EVENTOSPAGE (DISEÑO PROFESIONAL 2026)
// Incluye:
// 1. Hero Banner Cinematográfico con Métricas en Vivo
// 2. Conmutador entre Cartelera de Tarjetas y Explorador de Estadios en Google Maps
// 3. Filtro por Ciudad (La Paz, Santa Cruz, Cochabamba) y Categoría
// 4. Buscador instantáneo con diseño Glassmorphism
// ========================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerEventos } from '../services/storage';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';

const CATEGORIAS = ['Todos', 'Rock', 'Electrónica', 'Festivales', 'Jazz'];
const CIUDADES = ['Todas', 'La Paz', 'Santa Cruz', 'Cochabamba'];

// Estadios principales de Bolivia para el explorador
const ESTADIOS_BOLIVIA = [
  {
    id: 1,
    nombre: 'Estadio Hernando Siles',
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
    id: 2,
    nombre: 'Estadio Ramón Tahuichi Aguilera',
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
    id: 3,
    nombre: 'Estadio Félix Capriles',
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
    id: 4,
    nombre: 'Teatro Municipal Alberto Saavedra Pérez',
    ciudad: 'La Paz',
    capacidad: '650 espectadores',
    direccion: 'Calle Genaro Sanjinés, Casco Viejo',
    lat: -16.4952,
    lng: -68.1362,
    eventoId: 4,
    concierto: 'Noche de Jazz & Blues Acústico',
    fecha: '12 Dic 2026'
  }
];

export default function EventosPage() {
  const { usuario, esOrganizador } = useAuth();

  // Estados
  const [eventos, setEventos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [ciudadActiva, setCiudadActiva] = useState('Todas');
  const [vistaModo, setVistaModo] = useState('grid'); // 'grid' (tarjetas) o 'mapa' (explorador estadios Google Maps)
  const [estadioSeleccionado, setEstadioSeleccionado] = useState(ESTADIOS_BOLIVIA[0]);

  // Carga inicial
  useEffect(() => {
    const datos = obtenerEventos();
    setEventos(datos);
  }, []);

  // Filtro inteligente en tiempo real
  const eventosFiltrados = eventos.filter((ev) => {
    const coincideTexto =
      ev.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      ev.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      ev.lugar.toLowerCase().includes(busqueda.toLowerCase()) ||
      (ev.estadio_nombre && ev.estadio_nombre.toLowerCase().includes(busqueda.toLowerCase()));

    const coincideFecha = filtroFecha ? ev.fecha >= filtroFecha : true;

    const coincideCategoria =
      categoriaActiva === 'Todos' ||
      ev.categoria === categoriaActiva ||
      ev.nombre.toLowerCase().includes(categoriaActiva.toLowerCase());

    const coincideCiudad =
      ciudadActiva === 'Todas' ||
      ev.ciudad === ciudadActiva ||
      ev.lugar.toLowerCase().includes(ciudadActiva.toLowerCase());

    return coincideTexto && coincideFecha && coincideCategoria && coincideCiudad;
  });

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroFecha('');
    setCategoriaActiva('Todos');
    setCiudadActiva('Todas');
  };

  return (
    <div className="container py-4">
      {/* ========================================================
          HERO BANNER CINEMATOGRÁFICO
         ======================================================== */}
      <div className="hero-glow-card p-4 p-md-5 mb-5 position-relative overflow-hidden">
        <div className="row align-items-center position-relative" style={{ zIndex: 2 }}>
          <div className="col-lg-8">
            {/* Pill de Temporada */}
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3"
                 style={{ background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.35)' }}>
              <span className="spinner-grow spinner-grow-sm text-info" style={{ width: '8px', height: '8px' }}></span>
              <span className="small fw-bold text-info text-uppercase" style={{ letterSpacing: '1px' }}>
                Temporada Oficial de Conciertos 2026 &bull; Bolivia
              </span>
            </div>

            <h1 className="display-4 fw-extrabold mb-3 text-gradient">
              Vive la Música en los Grandes Estadios del País
            </h1>

            <p className="lead text-muted mb-4" style={{ maxWidth: '640px', lineHeight: '1.7' }}>
              Descubre festivales multitudinarios y recitales legendarios.
              Visualiza las zonas y accesos en <strong>Google Maps</strong>, compra al instante en Bolivianos (Bs)
              y obtén tu pase digital oficial con código de validación QR.
            </p>

            {/* Métricas destacadas del sistema */}
            <div className="d-flex flex-wrap gap-3 mb-4">
              <div className="px-3 py-2 rounded-3 border" style={{ background: 'rgba(255, 255, 255, 0.04)', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                <div className="fs-5 fw-extrabold text-info">4 Estadios</div>
                <div className="text-dim small" style={{ fontSize: '0.75rem' }}>Geolocalizados con Google Maps</div>
              </div>
              <div className="px-3 py-2 rounded-3 border" style={{ background: 'rgba(255, 255, 255, 0.04)', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                <div className="fs-5 fw-extrabold text-emerald">+120.000</div>
                <div className="text-dim small" style={{ fontSize: '0.75rem' }}>Capacidad Total en Graderías</div>
              </div>
              <div className="px-3 py-2 rounded-3 border" style={{ background: 'rgba(255, 255, 255, 0.04)', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                <div className="fs-5 fw-extrabold text-warning">100% Digital</div>
                <div className="text-dim small" style={{ fontSize: '0.75rem' }}>Entradas con QR Único</div>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-3">
              <button
                onClick={() => setVistaModo('grid')}
                className={`btn ${vistaModo === 'grid' ? 'btn-modern-primary' : 'btn-modern-outline'}`}
              >
                <i className="bi bi-grid-fill me-1"></i> Ver Cartelera
              </button>

              <button
                onClick={() => setVistaModo('mapa')}
                className={`btn ${vistaModo === 'mapa' ? 'btn-modern-primary' : 'btn-modern-outline'} text-info`}
              >
                <i className="bi bi-google me-1 text-danger"></i> Explorar Estadios en Google Maps
              </button>

              {esOrganizador && (
                <Link to="/evento/crear" className="btn-modern-outline text-warning text-decoration-none">
                  <i className="bi bi-plus-circle me-1"></i> Publicar Concierto
                </Link>
              )}
            </div>
          </div>

          <div className="col-lg-4 d-none d-lg-block text-center">
            <div className="position-relative d-inline-block">
              <div className="p-4 rounded-circle d-inline-flex align-items-center justify-content-center"
                   style={{
                     width: '240px',
                     height: '240px',
                     background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(6, 182, 212, 0.05) 60%, transparent 70%)',
                     boxShadow: '0 0 50px rgba(99, 102, 241, 0.3)'
                   }}>
                <i className="bi bi-music-note-beamed" style={{ fontSize: '7rem', color: '#818cf8', opacity: 0.85 }}></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          VISTA 1: EXPLORADOR DE ESTADIOS EN GOOGLE MAPS
         ======================================================== */}
      {vistaModo === 'mapa' && (
        <div className="glass-panel p-4 mb-5 border-info border-opacity-25">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2 border-bottom pb-3" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
            <div>
              <span className="badge rounded-pill bg-danger text-white px-3 py-1 mb-1">
                <i className="bi bi-geo-alt-fill me-1"></i> Red de Estadios Nacionales &bull; Google Maps
              </span>
              <h4 className="fw-extrabold text-white mb-0">
                Ubicación Geográfica de los Recintos de Concierto
              </h4>
            </div>

            <button
              onClick={() => setVistaModo('grid')}
              className="btn btn-sm btn-modern-outline"
            >
              <i className="bi bi-grid-fill me-1"></i> Volver a Cartelera
            </button>
          </div>

          <div className="row g-4">
            {/* Lista de Estadios Sede */}
            <div className="col-lg-4">
              <div className="d-flex flex-column gap-2">
                <span className="small text-muted fw-bold text-uppercase" style={{ letterSpacing: '0.5px' }}>
                  Selecciona un Estadio para ubicarlo:
                </span>

                {ESTADIOS_BOLIVIA.map((est) => {
                  const estaSeleccionado = estadioSeleccionado.id === est.id;
                  return (
                    <div
                      key={est.id}
                      onClick={() => setEstadioSeleccionado(est)}
                      className={`p-3 rounded-4 border transition-all cursor-pointer ${estaSeleccionado ? 'border-primary shadow-lg' : ''}`}
                      style={{
                        cursor: 'pointer',
                        background: estaSeleccionado ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                        borderColor: estaSeleccionado ? '#6366f1' : 'rgba(255, 255, 255, 0.08)'
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <span className="fw-bold text-white small">{est.nombre}</span>
                        <span className="badge rounded-pill bg-dark border border-secondary text-info" style={{ fontSize: '0.65rem' }}>
                          {est.ciudad}
                        </span>
                      </div>
                      <div className="text-dim small" style={{ fontSize: '0.75rem' }}>
                        <i className="bi bi-people me-1"></i> {est.capacidad}
                      </div>
                      <div className="text-muted small mt-1 text-truncate" style={{ fontSize: '0.75rem' }}>
                        <i className="bi bi-pin-map text-danger me-1"></i> {est.direccion}
                      </div>
                      <div className="mt-2 pt-2 border-top d-flex justify-content-between align-items-center" style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}>
                        <span className="small text-warning fw-semibold" style={{ fontSize: '0.75rem' }}>
                          <i className="bi bi-calendar-event me-1"></i> {est.concierto}
                        </span>
                        <i className="bi bi-chevron-right text-muted small"></i>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Visualizador de Google Maps del Estadio Seleccionado */}
            <div className="col-lg-8">
              <div className="glass-panel p-3 h-100 d-flex flex-column">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-2 gap-2">
                  <div>
                    <h6 className="fw-bold text-white mb-0 d-flex align-items-center gap-2">
                      <i className="bi bi-google text-danger"></i>
                      <span>{estadioSeleccionado.nombre} ({estadioSeleccionado.ciudad})</span>
                    </h6>
                    <span className="text-dim small">{estadioSeleccionado.direccion}</span>
                  </div>

                  <div className="d-flex gap-2">
                    <Link
                      to={`/evento/${estadioSeleccionado.eventoId}`}
                      className="btn btn-sm btn-modern-primary"
                    >
                      Ver Concierto & Zonas <i className="bi bi-arrow-right"></i>
                    </Link>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${estadioSeleccionado.nombre}, ${estadioSeleccionado.ciudad}, Bolivia`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-modern-outline text-info"
                    >
                      <i className="bi bi-box-arrow-up-right"></i>
                    </a>
                  </div>
                </div>

                {/* Mapa Google Maps Embebido */}
                <div className="rounded-4 overflow-hidden border flex-grow-1 position-relative"
                     style={{ minHeight: '380px', borderColor: 'rgba(255, 255, 255, 0.15)', background: '#090d16' }}>
                  <iframe
                    key={estadioSeleccionado.id}
                    title={`Google Maps de ${estadioSeleccionado.nombre}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '380px' }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://maps.google.com/maps?q=${estadioSeleccionado.lat},${estadioSeleccionado.lng}&hl=es&z=17&t=k&output=embed`}
                  ></iframe>

                  <div className="position-absolute bottom-0 start-0 m-3 px-3 py-2 rounded-pill small fw-semibold text-white d-flex align-items-center gap-2"
                       style={{ background: 'rgba(9, 13, 22, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                    <i className="bi bi-satellite text-info"></i>
                    <span>Vista Satelital Oficial de Google Maps</span>
                    <span className="text-dim">|</span>
                    <span className="text-warning">{estadioSeleccionado.capacidad}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          BARRA DE FILTROS & BÚSQUEDA
         ======================================================== */}
      <div id="catalogo" className="glass-panel p-4 mb-4">
        {/* Filtros superiores: Chips de Ciudades y Categorías */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4 border-bottom pb-3" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
          {/* Selector de Ciudad */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="small text-muted fw-semibold">
              <i className="bi bi-geo-alt-fill text-danger me-1"></i> Ciudad:
            </span>
            {CIUDADES.map((ciudad) => (
              <button
                key={ciudad}
                onClick={() => setCiudadActiva(ciudad)}
                className={`category-chip ${ciudadActiva === ciudad ? 'active' : ''}`}
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.9rem' }}
              >
                {ciudad}
              </button>
            ))}
          </div>

          {/* Selector de Género / Categoría */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="small text-muted fw-semibold">
              <i className="bi bi-music-note-list text-info me-1"></i> Género:
            </span>
            {CATEGORIAS.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className={`category-chip ${categoriaActiva === cat ? 'active' : ''}`}
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.9rem' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs de Búsqueda y Fecha */}
        <div className="row g-3 align-items-end">
          <div className="col-md-6 col-lg-6">
            <label className="form-label small fw-semibold text-muted mb-1">
              <i className="bi bi-search me-1 text-info"></i> Buscar por artista, estadio o recinto
            </label>
            <div className="input-group">
              <span className="input-group-text border-end-0" style={{ background: 'rgba(15, 23, 42, 0.8)', borderColor: 'rgba(255, 255, 255, 0.12)' }}>
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control form-control-modern border-start-0"
                placeholder="Ej: Rock Stadium, Siles, Tahuichi, Capriles..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-3 col-lg-3">
            <label className="form-label small fw-semibold text-muted mb-1">
              <i className="bi bi-calendar3 me-1 text-primary"></i> Desde la fecha
            </label>
            <input
              type="date"
              className="form-control form-control-modern"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
            />
          </div>

          <div className="col-md-3 col-lg-3 d-flex gap-2">
            {(busqueda || filtroFecha || categoriaActiva !== 'Todos' || ciudadActiva !== 'Todas') && (
              <button onClick={limpiarFiltros} className="btn-modern-outline w-100 py-2">
                <i className="bi bi-arrow-counterclockwise"></i> Limpiar Filtros
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          LISTADO DE EVENTOS EN GRILLA
         ======================================================== */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-extrabold text-white mb-1">Próximos Conciertos en Cartelera</h3>
          <p className="text-muted small mb-0">
            Mostrando <strong className="text-info">{eventosFiltrados.length}</strong> evento{eventosFiltrados.length !== 1 ? 's' : ''}
            {ciudadActiva !== 'Todas' && <span> en <em>{ciudadActiva}</em></span>}
            {categoriaActiva !== 'Todos' && <span> de <em>{categoriaActiva}</em></span>}
          </p>
        </div>

        {esOrganizador && (
          <Link to="/evento/crear" className="btn-modern-outline btn-sm">
            <i className="bi bi-plus-lg text-primary"></i> Nuevo Evento
          </Link>
        )}
      </div>

      {/* Grilla de Tarjetas */}
      {eventosFiltrados.length > 0 ? (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 g-4 mb-5">
          {eventosFiltrados.map((evento) => (
            <EventCard key={evento.id} evento={evento} />
          ))}
        </div>
      ) : (
        <div className="glass-panel text-center py-5 my-4 p-4">
          <i className="bi bi-search text-muted" style={{ fontSize: '3rem', opacity: 0.5 }}></i>
          <h4 className="fw-bold mt-3 text-white">No encontramos eventos con esos filtros</h4>
          <p className="text-muted small">Prueba cambiando la ciudad o limpiando los términos de búsqueda.</p>
          <button onClick={limpiarFiltros} className="btn-modern-primary mt-2">
            Mostrar Todos los Conciertos
          </button>
        </div>
      )}
    </div>
  );
}
