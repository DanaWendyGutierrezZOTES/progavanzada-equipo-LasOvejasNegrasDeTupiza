// ========================================================
// PÁGINA: DETALLEEVENTOPAGE (DISEÑO MODERNO 2026)
// Presentación cinematográfica con Mapa del Recinto y Precios en Bs
// ========================================================

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { obtenerEventoPorId, eliminarEvento } from '../services/storage';
import { useAuth } from '../context/AuthContext';
import MapaRecinto from '../components/MapaRecinto';

export default function DetalleEventoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario, esOrganizador } = useAuth();

  const [evento, setEvento] = useState(null);
  const [zonaSeleccionadaId, setZonaSeleccionadaId] = useState(null);

  useEffect(() => {
    const data = obtenerEventoPorId(id);
    setEvento(data);
  }, [id]);

  if (!evento) {
    return (
      <div className="container py-5 text-center">
        <div className="glass-panel p-5 d-inline-block">
          <i className="bi bi-calendar-x text-muted fs-1 mb-3"></i>
          <h3 className="text-white">Evento no encontrado</h3>
          <p className="text-muted">El evento que buscas no existe o fue retirado de la cartelera.</p>
          <Link to="/" className="btn-modern-primary mt-2">Volver al catálogo</Link>
        </div>
      </div>
    );
  }

  const esDueno = usuario && (usuario.id === evento.organizador_id || usuario.rol === 'admin' || esOrganizador);

  const handleEliminar = () => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el evento "${evento.nombre}"?`)) {
      eliminarEvento(evento.id);
      alert('Evento eliminado correctamente');
      navigate('/');
    }
  };

  return (
    <div className="container py-4">
      {/* Botón Volver */}
      <div className="mb-4">
        <Link to="/" className="text-decoration-none text-muted small d-inline-flex align-items-center gap-1">
          <i className="bi bi-arrow-left"></i> Volver a Cartelera
        </Link>
      </div>

      {/* Tarjeta Principal del Evento */}
      <div className="glass-panel overflow-hidden mb-4">
        <div className="row g-0">
          {/* Imagen de Portada con Aspecto Cinematográfico */}
          <div className="col-lg-6 position-relative" style={{ minHeight: '380px', backgroundColor: '#0f172a' }}>
            <img
              src={evento.imagen_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80'}
              alt={evento.nombre}
              className="w-100 h-100 position-absolute inset-0"
              style={{ objectFit: 'cover' }}
            />
            <div className="position-absolute inset-0 w-100 h-100"
                 style={{ background: 'linear-gradient(90deg, rgba(11, 15, 25, 0.2) 0%, rgba(11, 15, 25, 0.8) 100%)' }}>
            </div>
          </div>

          {/* Información Principal */}
          <div className="col-lg-6 p-4 p-md-5 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="badge rounded-pill px-3 py-2 fw-semibold"
                      style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                  <i className="bi bi-patch-check-fill me-1"></i> Oficial
                </span>
                <span className="text-muted small">
                  Por: <strong className="text-light">{evento.organizador_nombre || 'Organizador'}</strong>
                </span>
              </div>

              <h1 className="fw-extrabold text-white mb-4 display-6">{evento.nombre}</h1>

              <div className="d-flex flex-column gap-3 mb-4">
                <div className="d-flex align-items-center gap-3 text-light">
                  <div className="p-2 rounded-3 text-primary" style={{ background: 'rgba(99, 102, 241, 0.15)' }}>
                    <i className="bi bi-calendar-event fs-5"></i>
                  </div>
                  <div>
                    <div className="text-dim small text-uppercase" style={{ fontSize: '0.75rem' }}>FECHA</div>
                    <div className="fw-semibold">{evento.fecha}</div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 text-light">
                  <div className="p-2 rounded-3 text-info" style={{ background: 'rgba(6, 182, 212, 0.15)' }}>
                    <i className="bi bi-clock fs-5"></i>
                  </div>
                  <div>
                    <div className="text-dim small text-uppercase" style={{ fontSize: '0.75rem' }}>HORA DE APERTURA</div>
                    <div className="fw-semibold">{evento.hora} hrs</div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 text-light">
                  <div className="p-2 rounded-3 text-danger" style={{ background: 'rgba(239, 68, 68, 0.15)' }}>
                    <i className="bi bi-geo-alt fs-5"></i>
                  </div>
                  <div>
                    <div className="text-dim small text-uppercase" style={{ fontSize: '0.75rem' }}>LUGAR / RECINTO</div>
                    <div className="fw-semibold">{evento.lugar}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Opciones del Organizador */}
            {esDueno && (
              <div className="p-3 rounded-3 border mt-3"
                   style={{ background: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                <div className="small fw-semibold text-warning mb-2 d-flex align-items-center gap-1">
                  <i className="bi bi-shield-lock"></i> Controles del Organizador
                </div>
                <div className="d-flex flex-wrap gap-2">
                  <Link to={`/evento/${evento.id}/editar`} className="btn btn-modern-outline btn-sm">
                    <i className="bi bi-pencil"></i> Editar
                  </Link>
                  <Link to={`/evento/${evento.id}/tickets`} className="btn btn-modern-outline btn-sm text-info">
                    <i className="bi bi-ticket-perforated"></i> Entradas
                  </Link>
                  <button onClick={handleEliminar} className="btn btn-modern-outline btn-sm text-danger">
                    <i className="bi bi-trash"></i> Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAPA INTERACTIVO DEL RECINTO Y ZONAS */}
      <MapaRecinto
        evento={evento}
        zonaSeleccionadaId={zonaSeleccionadaId}
        onSeleccionarZona={(ticketId) => setZonaSeleccionadaId(ticketId)}
      />

      {/* Sección Inferior: Descripción y Selección de Tickets */}
      <div className="row g-4">
        {/* Descripción */}
        <div className="col-lg-7">
          <div className="glass-panel p-4 p-md-5 h-100">
            <h4 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-info-circle text-primary"></i> Acerca del Evento
            </h4>
            <div className="text-muted" style={{ whiteSpace: 'pre-line', lineHeight: '1.8', fontSize: '1rem' }}>
              {evento.descripcion}
            </div>
          </div>
        </div>

        {/* Tipos de Tickets Disponibles con Precios en Bs */}
        <div className="col-lg-5">
          <div className="glass-panel p-4 p-md-5">
            <h4 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-ticket-detailed text-info"></i> Comprar Entradas
            </h4>

            {evento.tipos_ticket && evento.tipos_ticket.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {evento.tipos_ticket.map((ticket) => {
                  const agotado = ticket.cantidad_disponible <= 0;
                  const estaSeleccionado = zonaSeleccionadaId === ticket.id;

                  return (
                    <div
                      key={ticket.id}
                      className={`p-3 rounded-4 border transition-all ${estaSeleccionado ? 'shadow-lg' : ''}`}
                      style={{
                        background: estaSeleccionado
                          ? 'rgba(99, 102, 241, 0.15)'
                          : (agotado ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.05)'),
                        borderColor: estaSeleccionado
                          ? '#6366f1'
                          : (agotado ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.12)')
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="fw-bold text-white mb-1">{ticket.nombre}</h6>
                          <small className={agotado ? 'text-danger fw-semibold' : 'text-emerald'}>
                            {agotado ? 'Agotado' : `${ticket.cantidad_disponible} disponibles`}
                          </small>
                        </div>
                        <span className="fs-5 fw-bold" style={{ color: '#38bdf8' }}>
                          Bs. {Number(ticket.precio).toLocaleString('es-ES')}
                        </span>
                      </div>

                      {agotado ? (
                        <button className="btn btn-modern-outline btn-sm w-100 opacity-50 cursor-not-allowed" disabled>
                          Agotado
                        </button>
                      ) : (
                        <Link
                          to={`/comprar/${evento.id}/${ticket.id}`}
                          className="btn-modern-primary btn-sm w-100 text-decoration-none mt-2"
                        >
                          <i className="bi bi-cart3"></i> Comprar por Bs. {Number(ticket.precio).toLocaleString('es-ES')}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4 text-muted">
                No hay entradas disponibles en este momento.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
