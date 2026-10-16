// ========================================================
// PÁGINA: TICKETDETALLEPAGE (PASE DIGITAL 2026)
// Boleto digital estilo credencial/pase de festival con QR y precio en Bs
// ========================================================

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { obtenerCompraPorId } from '../services/storage';

export default function TicketDetallePage() {
  const { id } = useParams();
  const [compra, setCompra] = useState(null);

  useEffect(() => {
    const data = obtenerCompraPorId(id);
    setCompra(data);
  }, [id]);

  if (!compra) {
    return (
      <div className="container py-5 text-center">
        <div className="glass-panel p-5 d-inline-block">
          <i className="bi bi-ticket-perforated text-muted fs-1 mb-3"></i>
          <h3 className="text-white">Ticket no encontrado</h3>
          <p className="text-muted">No se localizó la entrada solicitada.</p>
          <Link to="/" className="btn-modern-primary mt-2">Ir al catálogo</Link>
        </div>
      </div>
    );
  }

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div className="container py-5">
      {/* Mensaje de Confirmación (Oculto al Imprimir) */}
      <div className="text-center mb-4 d-print-none">
        <div className="d-inline-flex p-3 rounded-circle mb-3"
             style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399' }}>
          <i className="bi bi-check2-circle fs-1"></i>
        </div>
        <h2 className="fw-extrabold text-white mb-1">¡Entrada Confirmada!</h2>
        <p className="text-muted small">
          Tu pase digital está listo. Puedes guardarlo, imprimirlo o presentarlo desde tu móvil.
        </p>
      </div>

      {/* Pase Digital Futurista */}
      <div className="ticket-pass mb-4">
        {/* Cabecera del Pase */}
        <div className="ticket-pass-header">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="badge rounded-pill bg-dark text-white px-3 py-1 small fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>
              ✦ Pase Digital Oficial
            </span>
            <span className="small text-white-50">
              {new Date(compra.fecha_compra).toLocaleDateString('es-ES')}
            </span>
          </div>
          <h3 className="fw-extrabold mb-1 text-white">{compra.evento_nombre}</h3>
          <p className="mb-0 text-white-50 small">
            <i className="bi bi-geo-alt me-1 text-warning"></i> {compra.evento_lugar}
          </p>
        </div>

        {/* Separador con Muescas */}
        <div className="ticket-notch-divider">
          <div className="ticket-dashed-separator"></div>
        </div>

        {/* Cuerpo del Pase */}
        <div className="ticket-pass-body">
          <div className="row g-4 align-items-center">
            {/* Detalles */}
            <div className="col-md-7">
              <div className="mb-3">
                <span className="text-dim small text-uppercase d-block" style={{ fontSize: '0.75rem' }}>TIPO DE ACCESO</span>
                <span className="fw-extrabold fs-4" style={{ color: '#38bdf8' }}>{compra.tipo_ticket_nombre}</span>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <span className="text-dim small text-uppercase d-block" style={{ fontSize: '0.7rem' }}>FECHA</span>
                  <span className="fw-semibold text-white">{compra.evento_fecha}</span>
                </div>
                <div className="col-6">
                  <span className="text-dim small text-uppercase d-block" style={{ fontSize: '0.7rem' }}>HORA</span>
                  <span className="fw-semibold text-white">{compra.evento_hora} hrs</span>
                </div>
                <div className="col-6">
                  <span className="text-dim small text-uppercase d-block" style={{ fontSize: '0.7rem' }}>CANTIDAD</span>
                  <span className="fw-semibold text-white">{compra.cantidad} Pase(s)</span>
                </div>
                <div className="col-6">
                  <span className="text-dim small text-uppercase d-block" style={{ fontSize: '0.7rem' }}>TOTAL PAGADO</span>
                  <span className="fw-bold text-emerald">Bs. {Number(compra.total).toLocaleString('es-ES')}</span>
                </div>
              </div>

              <div>
                <span className="text-dim small text-uppercase d-block" style={{ fontSize: '0.7rem' }}>TITULAR REGISTRADO</span>
                <span className="fw-semibold text-white">{compra.usuario_nombre}</span>
              </div>
            </div>

            {/* Código QR y Código Único */}
            <div className="col-md-5 text-center border-start ps-md-4" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <div className="p-3 rounded-4 d-inline-block border mb-3"
                   style={{ background: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                {/* Código QR dibujado en SVG limpio */}
                <svg width="115" height="115" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100" height="100" fill="#ffffff" />
                  <rect x="10" y="10" width="30" height="30" stroke="#0f172a" strokeWidth="6" fill="none" />
                  <rect x="20" y="20" width="10" height="10" fill="#0f172a" />
                  <rect x="60" y="10" width="30" height="30" stroke="#0f172a" strokeWidth="6" fill="none" />
                  <rect x="70" y="20" width="10" height="10" fill="#0f172a" />
                  <rect x="10" y="60" width="30" height="30" stroke="#0f172a" strokeWidth="6" fill="none" />
                  <rect x="20" y="70" width="10" height="10" fill="#0f172a" />
                  <rect x="50" y="50" width="12" height="12" fill="#0f172a" />
                  <rect x="70" y="60" width="16" height="8" fill="#0f172a" />
                  <rect x="55" y="75" width="25" height="12" fill="#0f172a" />
                </svg>
              </div>

              <div className="px-3 py-1 rounded-pill small font-monospace fw-bold d-inline-block mb-1"
                   style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)', letterSpacing: '1px' }}>
                {compra.codigo_ticket}
              </div>
              <small className="text-dim d-block" style={{ fontSize: '0.75rem' }}>Escanea este código en el acceso</small>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de Acción (Ocultos al Imprimir) */}
      <div className="d-flex flex-wrap justify-content-center gap-3 d-print-none">
        <button onClick={handleImprimir} className="btn-modern-primary">
          <i className="bi bi-printer me-1"></i> Imprimir / Guardar PDF (1 Hoja)
        </button>
        <Link to="/mis-tickets" className="btn-modern-outline text-decoration-none">
          <i className="bi bi-ticket-detailed me-1"></i> Ver Mis Entradas
        </Link>
        <Link to="/" className="btn-modern-outline text-decoration-none">
          Explorar Más
        </Link>
      </div>
    </div>
  );
}
