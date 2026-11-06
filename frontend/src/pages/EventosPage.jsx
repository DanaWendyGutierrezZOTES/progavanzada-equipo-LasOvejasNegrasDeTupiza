// ========================================================
// PÁGINA: EVENTOSPAGE (Cartelera & Red de Recintos de Bolivia)
// Incluye:
// 1. Hero Banner Cinematográfico con Métricas en Vivo de Bolivia
// 2. Conmutador entre Cartelera de Tarjetas y Explorador Nacional de Recintos en Google Maps
// 3. Filtros avanzados por Departamento, Ciudad, Género y Búsqueda Instantánea
// 4. Componentes modulares reutilizables sin código repetido
// ========================================================

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { obtenerEventos } from '../services/storage';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import EmptyState from '../components/common/EmptyState';
import { ESTADIOS_BOLIVIA, DEPARTAMENTOS_BOLIVIA, CIUDADES_BOLIVIA } from '../data/estadios';

const CATEGORIAS = ['Todos', 'Rock', 'Electrónica', 'Festivales', 'Jazz'];

export default function EventosPage() {
  const { esOrganizador } = useAuth();

  // Estados
  const [eventos, setEventos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [ciudadActiva, setCiudadActiva] = useState('Todas');
  const [deptoActivo, setDeptoActivo] = useState('Todos');
  const [vistaModo, setVistaModo] = useState('grid'); // 'grid' | 'mapa'
  const [estadioSeleccionado, setEstadioSeleccionado] = useState(ESTADIOS_BOLIVIA[0]);
  const [busquedaRecinto, setBusquedaRecinto] = useState('');

  // Carga inicial
  useEffect(() => {
    setEventos(obtenerEventos());
  }, []);

  // Extraer ciudades dinámicas con eventos activos para chips rápidos
  const ciudadesConEventos = useMemo(() => {
    const ciudadesSet = new Set(eventos.map(e => e.ciudad).filter(Boolean));
    return ['Todas', ...Array.from(ciudadesSet)];
  }, [eventos]);

  // Filtro de eventos en tiempo real
  const eventosFiltrados = useMemo(() => {
    return eventos.filter((ev) => {
      const busq = busqueda.toLowerCase();
      const coincideTexto =
        !busqueda ||
        ev.nombre.toLowerCase().includes(busq) ||
        ev.descripcion?.toLowerCase().includes(busq) ||
        ev.lugar?.toLowerCase().includes(busq) ||
        (ev.estadio_nombre && ev.estadio_nombre.toLowerCase().includes(busq)) ||
        (ev.ciudad && ev.ciudad.toLowerCase().includes(busq));

      const coincideFecha = filtroFecha ? ev.fecha >= filtroFecha : true;

      const coincideCategoria =
        categoriaActiva === 'Todos' ||
        ev.categoria === categoriaActiva ||
        ev.nombre.toLowerCase().includes(categoriaActiva.toLowerCase());

      const coincideCiudad =
        ciudadActiva === 'Todas' ||
        ev.ciudad === ciudadActiva ||
        ev.lugar.toLowerCase().includes(ciudadActiva.toLowerCase());

      const coincideDepto =
        deptoActivo === 'Todos' ||
        ev.departamento === deptoActivo;

      return coincideTexto && coincideFecha && coincideCategoria && coincideCiudad && coincideDepto;
    });
  }, [eventos, busqueda, filtroFecha, categoriaActiva, ciudadActiva, deptoActivo]);

  // Filtro para el explorador de recintos en Google Maps
  const recintosFiltrados = useMemo(() => {
    return ESTADIOS_BOLIVIA.filter(est => {
      const q = busquedaRecinto.toLowerCase();
      const coincideTexto =
        !busquedaRecinto ||
        est.nombre.toLowerCase().includes(q) ||
        est.ciudad.toLowerCase().includes(q) ||
        est.departamento.toLowerCase().includes(q) ||
        (est.concierto && est.concierto.toLowerCase().includes(q));

      const coincideDepto = deptoActivo === 'Todos' || est.departamento === deptoActivo;
      return coincideTexto && coincideDepto;
    });
  }, [busquedaRecinto, deptoActivo]);

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroFecha('');
    setCategoriaActiva('Todos');
    setCiudadActiva('Todas');
    setDeptoActivo('Todos');
  };

  const capacidadTotalGraderias = useMemo(() => {
    return ESTADIOS_BOLIVIA.reduce((acc, est) => acc + (est.capacidadNum || 15000), 0);
  }, []);

  return (
    <div className="container py-4">
      {/* ========================================================
          HERO BANNER CINEMATOGRÁFICO
         ======================================================== */}
      <div className="hero-glow-card p-4 p-md-5 mb-5 position-relative overflow-hidden">
        <div className="row align-items-center position-relative" style={{ zIndex: 2 }}>
          <div className="col-lg-8">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3"
                 style={{ background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.35)' }}>
              <span className="spinner-grow spinner-grow-sm text-info" style={{ width: '8px', height: '8px' }}></span>
              <span className="small fw-bold text-info text-uppercase" style={{ letterSpacing: '1px' }}>
                Temporada Oficial de Conciertos 2026 &bull; Bolivia
              </span>
            </div>

            <h1 className="display-4 fw-extrabold mb-3 text-gradient">
              Vive la Música en los Grandes Recintos de Bolivia
            </h1>

            <p className="lead text-muted mb-4" style={{ maxWidth: '640px', lineHeight: '1.7' }}>
              Descubre festivales multitudinarios, recitales folclóricos y noches legendarias en los 9 departamentos y Tupiza.
              Visualiza las zonas y accesos en <strong>Google Maps</strong>, compra al instante en Bolivianos (Bs)
              y obtén tu pase digital oficial con código de validación QR.
            </p>

            {/* Métricas destacadas del sistema */}
            <div className="d-flex flex-wrap gap-3 mb-4">
              <div className="px-3 py-2 rounded-3 border" style={{ background: 'rgba(255, 255, 255, 0.04)', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                <div className="fs-5 fw-extrabold text-info">{ESTADIOS_BOLIVIA.length} Recintos</div>
                <div className="text-dim small" style={{ fontSize: '0.75rem' }}>Estadios, Teatros y Arenas en Bolivia</div>
              </div>
              <div className="px-3 py-2 rounded-3 border" style={{ background: 'rgba(255, 255, 255, 0.04)', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                <div className="fs-5 fw-extrabold text-emerald">+{capacidadTotalGraderias.toLocaleString()}</div>
                <div className="text-dim small" style={{ fontSize: '0.75rem' }}>Capacidad Total en Graderías</div>
              </div>
              <div className="px-3 py-2 rounded-3 border" style={{ background: 'rgba(255, 255, 255, 0.04)', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                <div className="fs-5 fw-extrabold text-warning">100% Digital</div>
                <div className="text-dim small" style={{ fontSize: '0.75rem' }}>Pases QR con Precios en Bs</div>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-3">
              <button
                onClick={() => setVistaModo('grid')}
                className={`btn ${vistaModo === 'grid' ? 'btn-modern-primary' : 'btn-modern-outline'}`}
              >
                <i className="bi bi-grid-fill me-1"></i> Ver Cartelera ({eventosFiltrados.length})
              </button>

              <button
                onClick={() => setVistaModo('mapa')}
                className={`btn ${vistaModo === 'mapa' ? 'btn-modern-primary' : 'btn-modern-outline'} text-info`}
              >
                <i className="bi bi-geo-alt-fill me-1 text-danger"></i> Red de Recintos en Google Maps ({ESTADIOS_BOLIVIA.length})
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
          VISTA 1: EXPLORADOR NACIONAL DE RECINTOS EN GOOGLE MAPS
         ======================================================== */}
      {vistaModo === 'mapa' && (
        <div className="glass-panel p-4 mb-5 border-info border-opacity-25 animate-fadeIn">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2 border-bottom pb-3" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
            <div>
              <span className="badge rounded-pill bg-danger text-white px-3 py-1 mb-1">
                <i className="bi bi-geo-alt-fill me-1"></i> Red de Recintos de Bolivia &bull; Google Maps
              </span>
              <h4 className="fw-extrabold text-white mb-0">
                Ubicación Satelital de Estadios, Teatros y Arenas del País
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
            {/* Lista y Filtro de Recintos */}
            <div className="col-lg-5 col-xl-4">
              <div className="d-flex flex-column gap-3">
                {/* Buscador de recinto */}
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-dark border-secondary border-opacity-25 text-muted">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control form-control-modern form-control-sm"
                    placeholder="Buscar estadio, teatro, ciudad..."
                    value={busquedaRecinto}
                    onChange={(e) => setBusquedaRecinto(e.target.value)}
                  />
                  {busquedaRecinto && (
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setBusquedaRecinto('')}
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  )}
                </div>

                {/* Filtro por Departamento */}
                <div className="d-flex align-items-center gap-1 overflow-x-auto pb-1" style={{ whiteSpace: 'nowrap' }}>
                  {DEPARTAMENTOS_BOLIVIA.slice(0, 6).map((dep) => (
                    <button
                      key={dep}
                      onClick={() => setDeptoActivo(dep)}
                      className={`btn btn-sm py-1 px-2 rounded-pill ${deptoActivo === dep ? 'btn-primary' : 'btn-outline-secondary text-muted'}`}
                      style={{ fontSize: '0.72rem' }}
                    >
                      {dep}
                    </button>
                  ))}
                </div>

                <div className="recintos-scroll-list d-flex flex-column gap-2" style={{ maxHeight: '480px', overflowY: 'auto' }}>
                  {recintosFiltrados.map((est) => {
                    const estaSeleccionado = estadioSeleccionado.id === est.id;
                    const esTupiza = est.ciudad === 'Tupiza';

                    return (
                      <div
                        key={est.id}
                        onClick={() => setEstadioSeleccionado(est)}
                        className={`p-3 rounded-4 border transition-all cursor-pointer ${estaSeleccionado ? 'border-primary shadow-lg' : ''}`}
                        style={{
                          cursor: 'pointer',
                          background: estaSeleccionado ? 'rgba(99, 102, 241, 0.2)' : esTupiza ? 'rgba(245, 158, 11, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                          borderColor: estaSeleccionado ? '#6366f1' : esTupiza ? 'rgba(245, 158, 11, 0.3)' : 'rgba(255, 255, 255, 0.08)'
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <span className="fw-bold text-white small">
                            {est.tipo === 'teatro' ? '🎭' : est.tipo === 'arena' ? '🎪' : '🏟️'} {est.nombre}
                          </span>
                          <span className={`badge rounded-pill ${esTupiza ? 'bg-warning text-dark' : 'bg-dark border border-secondary text-info'}`} style={{ fontSize: '0.65rem' }}>
                            {est.ciudad}
                          </span>
                        </div>
                        <div className="text-dim small" style={{ fontSize: '0.75rem' }}>
                          <i className="bi bi-people me-1"></i> {est.capacidad} &bull; <span className="text-muted">{est.departamento}</span>
                        </div>
                        <div className="text-muted small mt-1 text-truncate" style={{ fontSize: '0.72rem' }}>
                          <i className="bi bi-geo-alt text-danger me-1"></i> {est.direccion}
                        </div>
                        {est.concierto && (
                          <div className="mt-2 pt-2 border-top d-flex justify-content-between align-items-center" style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}>
                            <span className="small text-warning fw-semibold text-truncate" style={{ fontSize: '0.72rem' }}>
                              <i className="bi bi-calendar-event me-1"></i> {est.concierto}
                            </span>
                            <i className="bi bi-chevron-right text-muted small"></i>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Visualizador de Google Maps del Recinto Seleccionado */}
            <div className="col-lg-7 col-xl-8">
              <div className="glass-panel p-3 h-100 d-flex flex-column">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-2 gap-2">
                  <div>
                    <h6 className="fw-bold text-white mb-0 d-flex align-items-center gap-2">
                      <i className="bi bi-google text-danger"></i>
                      <span>{estadioSeleccionado.nombre} ({estadioSeleccionado.ciudad}, {estadioSeleccionado.departamento})</span>
                    </h6>
                    <span className="text-dim small">{estadioSeleccionado.direccion}</span>
                  </div>

                  <div className="d-flex gap-2">
                    {estadioSeleccionado.eventoId ? (
                      <Link
                        to={`/evento/${estadioSeleccionado.eventoId}`}
                        className="btn btn-sm btn-modern-primary"
                      >
                        Ver Concierto & Zonas <i className="bi bi-arrow-right ms-1"></i>
                      </Link>
                    ) : (
                      <span className="badge rounded-pill bg-dark border border-secondary text-muted align-self-center px-3 py-2 small">
                        Sin evento programado hoy
                      </span>
                    )}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${estadioSeleccionado.nombre}, ${estadioSeleccionado.ciudad}, Bolivia`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-modern-outline text-info"
                      title="Abrir en Google Maps Oficial"
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

                  <div className="position-absolute bottom-0 start-0 m-3 px-3 py-2 rounded-pill small fw-semibold text-white d-flex align-items-center gap-2 shadow-lg"
                       style={{ background: 'rgba(15, 23, 42, 0.88)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                    <i className="bi bi-satellite text-info"></i>
                    <span>Satelital HD</span>
                    <span className="text-dim">|</span>
                    <span className="text-warning">{estadioSeleccionado.capacidad}</span>
                    <span className="text-dim">|</span>
                    <span className="text-white">GPS: {estadioSeleccionado.lat}, {estadioSeleccionado.lng}</span>
                  </div>
                </div>

                {estadioSeleccionado.descripcion && (
                  <p className="text-muted small mt-3 mb-0" style={{ lineHeight: '1.6' }}>
                    <i className="bi bi-info-circle text-info me-1"></i>
                    {estadioSeleccionado.descripcion}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          BARRA DE FILTROS & BÚSQUEDA
         ======================================================== */}
      <div id="catalogo" className="glass-panel p-4 mb-4">
        {/* Selector de Ciudad */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4 border-bottom pb-3" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="small text-muted fw-semibold">
              <i className="bi bi-geo-alt-fill text-danger me-1"></i> Ciudad / Recinto:
            </span>
            {ciudadesConEventos.map((ciudad) => (
              <button
                key={ciudad}
                onClick={() => setCiudadActiva(ciudad)}
                className={`category-chip ${ciudadActiva === ciudad ? 'active' : ''}`}
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.9rem' }}
              >
                {ciudad === 'Tupiza' ? '⭐ Tupiza' : ciudad}
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
              <i className="bi bi-search me-1 text-info"></i> Buscar por artista, estadio o recinto en Bolivia
            </label>
            <div className="input-group">
              <span className="input-group-text border-end-0" style={{ background: 'rgba(15, 23, 42, 0.8)', borderColor: 'rgba(255, 255, 255, 0.12)' }}>
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control form-control-modern border-start-0"
                placeholder="Ej: Tupiza, Siles, Tahuichi, Capriles, Rock, Folclore..."
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
            {(busqueda || filtroFecha || categoriaActiva !== 'Todos' || ciudadActiva !== 'Todas' || deptoActivo !== 'Todos') && (
              <button onClick={limpiarFiltros} className="btn-modern-outline w-100 py-2">
                <i className="bi bi-arrow-counterclockwise me-1"></i> Limpiar Filtros
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
            Mostrando <strong className="text-info">{eventosFiltrados.length}</strong> concierto{eventosFiltrados.length !== 1 ? 's' : ''} oficial{eventosFiltrados.length !== 1 ? 'es' : ''}
            {ciudadActiva !== 'Todas' && <span> en <em className="text-warning">{ciudadActiva}</em></span>}
            {categoriaActiva !== 'Todos' && <span> de <em>{categoriaActiva}</em></span>}
          </p>
        </div>

        {esOrganizador && (
          <Link to="/evento/crear" className="btn-modern-primary btn-sm text-decoration-none">
            <i className="bi bi-plus-lg"></i> Publicar Concierto
          </Link>
        )}
      </div>

      {eventosFiltrados.length > 0 ? (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 g-4 mb-5">
          {eventosFiltrados.map((evento) => (
            <EventCard key={evento.id} evento={evento} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="bi-search"
          title="No encontramos eventos con esos filtros"
          description="Prueba cambiando la ciudad, género o limpiando los términos de búsqueda para ver todos los conciertos de Bolivia."
          actionText="Mostrar Todos los Conciertos"
          onAction={limpiarFiltros}
        />
      )}
    </div>
  );
}
