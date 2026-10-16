// ========================================================
// COMPONENTE: EVENTCARD (DISEÑO PROFESIONAL ULTRA-MODERNO)
// Inspirado en Spotify Live, Dice.fm y Ticketmaster Pro
// ========================================================

import React from 'react';
import { Link } from 'react-router-dom';

export default function EventCard({ evento }) {
  const cuposTotales = evento.cupo_total || 5000;
  const cuposDisponibles = evento.tipos_ticket
    ? evento.tipos_ticket.reduce((total, t) => total + (Number(t.cantidad_disponible) || 0), 0)
    : 0;

  const precios = evento.tipos_ticket && evento.tipos_ticket.length > 0
    ? evento.tipos_ticket.map(t => Number(t.precio))
    : [evento.precio_base || 0];
  const precioMinimo = Math.min(...precios);

  // Porcentaje de disponibilidad
  const porcentajeVendido = Math.min(100, Math.max(0, Math.round(((cuposTotales - cuposDisponibles) / cuposTotales) * 100)));

  const formatearFecha = (fechaStr) => {
    try {
      const fecha = new Date(fechaStr + 'T00:00:00');
      const dia = fecha.getDate();
      const mes = fecha.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase().replace('.', '');
      return { dia, mes };
    } catch {
      return { dia: '15', mes: 'NOV' };
    }
  };

  const { dia, mes } = formatearFecha(evento.fecha);
  const estaAgotado = cuposDisponibles <= 0;
  const quedanPocos = cuposDisponibles > 0 && cuposDisponibles < 100;

  return (
    <div className="col">
      <div className="event-card h-100 position-relative group">
        {/* Imagen de Portada con Aspecto Cinematográfico */}
        <div className="event-image-wrapper position-relative">
          <img
            src={evento.imagen_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=80'}
            alt={evento.nombre}
            loading="lazy"
          />
          <div className="event-image-overlay"></div>

          {/* Chip de Calendario estilo Ticketmaster */}
          <div className="position-absolute top-0 start-0 m-3 text-center rounded-3 p-1 shadow-lg"
               style={{
                 background: 'rgba(15, 23, 42, 0.88)',
                 backdropFilter: 'blur(10px)',
                 border: '1px solid rgba(255, 255, 255, 0.18)',
                 minWidth: '52px'
               }}>
            <div className="fw-extrabold text-info" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>{mes}</div>
            <div className="fw-black text-white fs-5 lh-1">{dia}</div>
          </div>

          {/* Badge de Categoría & Ciudad */}
          <div className="position-absolute top-0 end-0 m-3 d-flex flex-column align-items-end gap-1">
            <span className="badge rounded-pill px-3 py-1 fw-bold shadow"
                  style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(168, 85, 247, 0.9) 100%)',
                    fontSize: '0.7rem',
                    letterSpacing: '0.5px'
                  }}>
              {evento.categoria || 'Concierto'}
            </span>
            {evento.ciudad && (
              <span className="badge rounded-pill bg-dark bg-opacity-75 text-light border border-secondary border-opacity-25 px-2 py-1" style={{ fontSize: '0.65rem' }}>
                <i className="bi bi-geo-alt-fill text-danger me-1"></i>{evento.ciudad}
              </span>
            )}
          </div>

          {/* Estadio o Recinto Tag sobre la imagen */}
          <div className="position-absolute bottom-0 start-0 m-3 end-0 pe-3">
            <span className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-2 text-truncate"
                  style={{
                    background: 'rgba(0, 0, 0, 0.65)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '0.75rem',
                    color: '#e2e8f0',
                    maxWidth: '100%'
                  }}>
              <i className="bi bi-building text-warning"></i>
              <strong className="text-white text-truncate">{evento.estadio_nombre || evento.lugar}</strong>
            </span>
          </div>
        </div>

        {/* Cuerpo de la Tarjeta */}
        <div className="p-4 d-flex flex-column flex-grow-1">
          {evento.subtitulo && (
            <div className="text-dim small text-uppercase fw-semibold mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}>
              {evento.subtitulo}
            </div>
          )}

          <h5 className="fw-extrabold text-white mb-2 line-clamp-1" title={evento.nombre}>
            {evento.nombre}
          </h5>

          <p className="text-secondary small flex-grow-1 mb-3" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: '1.6'
          }}>
            {evento.descripcion}
          </p>

          {/* Barra de Progreso de Entradas Vendidas */}
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center small mb-1" style={{ fontSize: '0.72rem' }}>
              <span className="text-muted">
                {estaAgotado ? (
                  <span className="text-danger fw-bold"><i className="bi bi-x-circle me-1"></i>Entradas Agotadas</span>
                ) : quedanPocos ? (
                  <span className="text-warning fw-bold"><i className="bi bi-fire me-1"></i>¡Últimas {cuposDisponibles} entradas!</span>
                ) : (
                  <span><i className="bi bi-ticket-perforated text-info me-1"></i>{cuposDisponibles.toLocaleString()} disponibles</span>
                )}
              </span>
              <span className="text-dim">{porcentajeVendido}% reservado</span>
            </div>
            <div className="progress" style={{ height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${porcentajeVendido}%`,
                  background: estaAgotado ? '#ef4444' : 'linear-gradient(90deg, #6366f1, #06b6d4)'
                }}
              ></div>
            </div>
          </div>

          {/* Footer de Tarjeta: Precio en Bolivianos (Bs) y Botón */}
          <div className="pt-3 border-top d-flex justify-content-between align-items-center mt-auto"
               style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
            <div>
              <span className="text-dim small d-block" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>DESDE</span>
              <span className="fs-5 fw-extrabold" style={{ color: '#38bdf8' }}>
                Bs. {Number(precioMinimo).toLocaleString('es-ES')}
              </span>
            </div>

            <Link
              to={`/evento/${evento.id}`}
              className="btn-modern-primary btn-sm px-3 py-2 text-decoration-none shadow-sm"
            >
              <span>Ver Zonas & Mapa</span>
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
