// ========================================================
// COMPONENTE: EVENTCARD (DISEÑO 2026 MODERNO)
// Tarjeta moderna con efecto zoom en imagen, badges con glassmorphism,
// indicador de disponibilidad y botón de compra con glow
// ========================================================

import React from 'react';
import { Link } from 'react-router-dom';

export default function EventCard({ evento }) {
  // Calculamos los cupos disponibles sumando los tipos de tickets
  const cuposDisponibles = evento.tipos_ticket
    ? evento.tipos_ticket.reduce((total, t) => total + (Number(t.cantidad_disponible) || 0), 0)
    : 0;

  // Calculamos el precio menor disponible para mostrar "Desde $X"
  const precios = evento.tipos_ticket && evento.tipos_ticket.length > 0
    ? evento.tipos_ticket.map(t => Number(t.precio))
    : [evento.precio_base || 0];
  const precioMinimo = Math.min(...precios);

  // Formateo de fecha legible (ej: 15 Nov, 2026)
  const formatearFecha = (fechaStr) => {
    try {
      const fecha = new Date(fechaStr + 'T00:00:00');
      return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return fechaStr;
    }
  };

  const estaAgotado = cuposDisponibles <= 0;
  const quedanPocos = cuposDisponibles > 0 && cuposDisponibles < 50;

  return (
    <div className="col">
      <div className="event-card h-100">
        {/* Imagen de Portada con Zoom y Badges Flotantes */}
        <div className="event-image-wrapper">
          <img
            src={evento.imagen_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=80'}
            alt={evento.nombre}
            loading="lazy"
          />
          <div className="event-image-overlay"></div>

          {/* Badge de Fecha con Glassmorphism */}
          <div className="position-absolute top-0 start-0 m-3 px-3 py-1 rounded-pill small fw-semibold text-white d-flex align-items-center gap-1"
               style={{ background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
            <i className="bi bi-calendar3 text-info"></i>
            <span>{formatearFecha(evento.fecha)}</span>
          </div>

          {/* Badge de Estado: Agotado / Últimos Cupos / Disponible */}
          <div className="position-absolute top-0 end-0 m-3">
            {estaAgotado ? (
              <span className="badge rounded-pill bg-danger px-2 py-1 small">Agotado</span>
            ) : quedanPocos ? (
              <span className="badge rounded-pill bg-warning text-dark px-2 py-1 small fw-bold">
                ¡Últimos {cuposDisponibles}!
              </span>
            ) : (
              <span className="badge rounded-pill px-2 py-1 small fw-semibold"
                    style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                Disponible
              </span>
            )}
          </div>
        </div>

        {/* Cuerpo de la Tarjeta */}
        <div className="p-4 d-flex flex-column flex-grow-1">
          <h5 className="fw-bold text-white mb-2 line-clamp-1" title={evento.nombre}>
            {evento.nombre}
          </h5>

          <p className="text-muted small mb-3 d-flex align-items-center">
            <i className="bi bi-geo-alt-fill text-danger me-1"></i>
            <span className="text-truncate">{evento.lugar}</span>
          </p>

          <p className="text-secondary small flex-grow-1 mb-4" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: '1.6'
          }}>
            {evento.descripcion}
          </p>

          {/* Footer de Tarjeta: Precio y Botón Moderno */}
          <div className="pt-3 border-top d-flex justify-content-between align-items-center mt-auto"
               style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
            <div>
              <span className="text-dim small d-block" style={{ fontSize: '0.75rem' }}>DESDE</span>
              <span className="fs-5 fw-bold" style={{ color: '#38bdf8' }}>
                ${Number(precioMinimo).toLocaleString('es-ES')}
              </span>
            </div>

            <Link
              to={`/evento/${evento.id}`}
              className="btn-modern-primary btn-sm px-3 py-2 text-decoration-none"
            >
              Ver Entradas <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
