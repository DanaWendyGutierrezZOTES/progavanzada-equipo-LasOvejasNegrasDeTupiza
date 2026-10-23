// ========================================================
// PÁGINA: TICKETDETALLEPAGE (PASE DIGITAL 2026)
// Boleto digital estilo credencial/pase de festival con QR y precio en Bs
// ========================================================

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { obtenerCompraPorId } from '../services/storage';
import { formatBs, formatDate } from '../utils/formatters';

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
              {formatDate(compra.fecha_compra)}
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
                  <span className="fw-bold text-emerald">{formatBs(compra.total)}</span>
                </div>
              </div>

              <div className="p-3 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span className="text-dim small text-uppercase d-block mb-1" style={{ fontSize: '0.7rem' }}>TITULAR DEL PASE</span>
                <div className="fw-bold text-white">{compra.comprador_nombre}</div>
                <div className="small text-muted">{compra.comprador_email}</div>
              </div>
            </div>

            {/* Código QR y Verificación */}
            <div className="col-md-5 text-center">
              <div className="p-3 rounded-4 d-inline-block bg-white shadow-lg">
                <img
                  src={compra.qr_url}
                  alt={`Código QR ${compra.codigo_ticket}`}
                  style={{ width: '150px', height: '150px', display: 'block' }}
                />
              </div>
              <div className="mt-3">
                <span className="font-monospace fw-bold text-white fs-6 tracking-wide d-block">
                  {compra.codigo_ticket}
                </span>
                <span className="text-dim small" style={{ fontSize: '0.75rem' }}>
                  Código Único Criptográfico Verificado
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer del Pase con Indicaciones de Seguridad */}
        <div className="ticket-pass-footer">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 text-muted small">
            <div>
              <i className="bi bi-shield-check text-emerald me-1"></i>
              Boleto intransferible. Válido únicamente con documento de identidad.
            </div>
            <div className="text-dim" style={{ fontSize: '0.75rem' }}>
              Sistema Oficial Boletería Digital 2026
            </div>
          </div>
        </div>
      </div>

      {/* Botones de Acción (Ocultos al imprimir) */}
      <div className="d-flex justify-content-center gap-3 d-print-none mt-4">
        <button onClick={handleImprimir} className="btn-modern-primary">
          <i className="bi bi-printer me-2"></i> Imprimir / Guardar en PDF
        </button>
        <Link to="/mis-tickets" className="btn-modern-outline">
          <i className="bi bi-collection me-2"></i> Ver Todos Mis Pases
        </Link>
      </div>
    </div>
  );
}
