// ========================================================
// PÁGINA: EVENTOSPAGE (DISEÑO MODERNO 2026)
// Catálogo principal con Hero futurista, filtro por categorías (Chips),
// buscador en tiempo real y grilla de tarjetas interactivas
// ========================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerEventos } from '../services/storage';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';

const CATEGORIAS = ['Todos', 'Rock', 'Electrónica', 'Jazz', 'Festivales'];

export default function EventosPage() {
  const { usuario, esOrganizador } = useAuth();

  // Estados
  const [eventos, setEventos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');

  // Carga inicial
  useEffect(() => {
    const datos = obtenerEventos();
    setEventos(datos);
  }, []);

  // Filtro en tiempo real por texto, fecha y categoría
  const eventosFiltrados = eventos.filter((ev) => {
    const coincideTexto =
      ev.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      ev.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      ev.lugar.toLowerCase().includes(busqueda.toLowerCase());

    const coincideFecha = filtroFecha ? ev.fecha >= filtroFecha : true;

    const coincideCategoria =
      categoriaActiva === 'Todos' ||
      ev.nombre.toLowerCase().includes(categoriaActiva.toLowerCase()) ||
      ev.descripcion.toLowerCase().includes(categoriaActiva.toLowerCase());

    return coincideTexto && coincideFecha && coincideCategoria;
  });

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroFecha('');
    setCategoriaActiva('Todos');
  };

  return (
    <div className="container py-4">
      {/* Hero Banner Futurista */}
      <div className="hero-glow-card p-4 p-md-5 mb-5">
        <div className="row align-items-center position-relative" style={{ zIndex: 1 }}>
          <div className="col-lg-8">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3"
                 style={{ background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
              <span className="spinner-grow spinner-grow-sm text-info" style={{ width: '8px', height: '8px' }}></span>
              <span className="small fw-bold text-info text-uppercase" style={{ letterSpacing: '1px' }}>
                Temporada 2026 • Entradas Oficiales
              </span>
            </div>

            <h1 className="display-4 fw-extrabold mb-3 text-gradient">
              Siente la emoción de los eventos en vivo
            </h1>

            <p className="lead text-muted mb-4" style={{ maxWidth: '620px', lineHeight: '1.7' }}>
              Descubre conciertos monumentales, festivales y recitales acústicos.
              Compra tus entradas al instante y recibe tu pase digital con código de validación QR.
            </p>

            <div className="d-flex flex-wrap gap-3">
              {!usuario && (
                <Link to="/registro" className="btn-modern-primary text-decoration-none">
                  <i className="bi bi-stars"></i> Crear Cuenta Gratis
                </Link>
              )}
              {esOrganizador && (
                <Link to="/evento/crear" className="btn-modern-primary text-decoration-none" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                  <i className="bi bi-plus-circle"></i> Publicar Evento
                </Link>
              )}
              <a href="#catalogo" className="btn-modern-outline text-decoration-none">
                <i className="bi bi-arrow-down-circle"></i> Ver Cartelera
              </a>
            </div>
          </div>

          <div className="col-lg-4 d-none d-lg-block text-center">
            <div className="p-4 rounded-circle d-inline-flex align-items-center justify-content-center"
                 style={{ width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)' }}>
              <i className="bi bi-soundwave" style={{ fontSize: '7rem', color: '#818cf8', opacity: 0.8 }}></i>
            </div>
          </div>
        </div>
      </div>

      {/* Chips de Categorías */}
      <div className="d-flex flex-wrap gap-2 mb-4 align-items-center">
        <span className="small text-muted me-2 fw-semibold">
          <i className="bi bi-funnel me-1"></i> Filtrar por:
        </span>
        {CATEGORIAS.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaActiva(cat)}
            className={`category-chip ${categoriaActiva === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Buscador Flotante con Glassmorphism */}
      <div id="catalogo" className="glass-panel p-4 mb-5">
        <div className="row g-3 align-items-end">
          <div className="col-md-6 col-lg-5">
            <label className="form-label small fw-semibold text-muted mb-1">
              <i className="bi bi-search me-1 text-info"></i> Buscar por artista, evento o ciudad
            </label>
            <div className="input-group">
              <span className="input-group-text border-end-0" style={{ background: 'rgba(15, 23, 42, 0.8)', borderColor: 'rgba(255, 255, 255, 0.12)' }}>
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control form-control-modern border-start-0"
                placeholder="Ej: Rock, Festival, Estadio..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-4 col-lg-4">
            <label className="form-label small fw-semibold text-muted mb-1">
              <i className="bi bi-calendar3 me-1 text-primary"></i> A partir de la fecha
            </label>
            <input
              type="date"
              className="form-control form-control-modern"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
            />
          </div>

          <div className="col-md-2 col-lg-3 d-flex gap-2">
            {(busqueda || filtroFecha || categoriaActiva !== 'Todos') && (
              <button onClick={limpiarFiltros} className="btn-modern-outline w-100 py-2">
                <i className="bi bi-arrow-counterclockwise"></i> Limpiar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Encabezado del Listado */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-white mb-1">Próximos Eventos Disponibles</h3>
          <p className="text-muted small mb-0">
            Mostrando <span className="text-info fw-semibold">{eventosFiltrados.length}</span> evento{eventosFiltrados.length !== 1 ? 's' : ''}
            {categoriaActiva !== 'Todos' && <span> en categoría <em>{categoriaActiva}</em></span>}
          </p>
        </div>

        {esOrganizador && (
          <Link to="/evento/crear" className="btn-modern-outline btn-sm">
            <i className="bi bi-plus-lg text-primary"></i> Nuevo Evento
          </Link>
        )}
      </div>

      {/* Grilla de Eventos */}
      {eventosFiltrados.length > 0 ? (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {eventosFiltrados.map((evento) => (
            <EventCard key={evento.id} evento={evento} />
          ))}
        </div>
      ) : (
        <div className="glass-panel text-center py-5 my-4 p-4">
          <i className="bi bi-search text-muted" style={{ fontSize: '3rem', opacity: 0.5 }}></i>
          <h4 className="fw-bold mt-3 text-white">No encontramos eventos con esos criterios</h4>
          <p className="text-muted small">Prueba modificando la búsqueda o seleccionando otra categoría.</p>
          <button onClick={limpiarFiltros} className="btn-modern-primary mt-2">
            Ver Todos los Eventos
          </button>
        </div>
      )}
    </div>
  );
}
