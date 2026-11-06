// ========================================================
// COMPONENTE: TICKETPASS (Boleto Digital Holográfico)
// Componente modular y reutilizable para el pase de evento
// ========================================================

import React, { useState } from 'react';
import { formatBs, formatDate } from '../utils/formatters';

export default function TicketPass({ compra, onImprimir }) {
  const [copiado, setCopiado] = useState(false);

  if (!compra) return null;

  const codigo = compra.codigo_ticket || 'TKT-BO-2026';
  const qrOnline = compra.qr_url || `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(codigo)}`;

  const handleCopiarCodigo = () => {
    navigator.clipboard.writeText(codigo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handlePrint = () => {
    if (onImprimir) {
      onImprimir();
    } else {
      window.print();
    }
  };

  return (
    <div className="ticket-pass shadow-2xl">
      {/* Cabecera del Pase con degradado dinámico */}
      <div className="ticket-pass-header position-relative overflow-hidden">
        <div className="position-absolute top-0 end-0 p-3 opacity-25">
          <i className="bi bi-ticket-perforated-fill" style={{ fontSize: '6rem' }}></i>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-2 position-relative" style={{ zIndex: 2 }}>
          <span className="badge rounded-pill bg-dark text-white px-3 py-1 small fw-bold text-uppercase d-inline-flex align-items-center gap-1" style={{ letterSpacing: '1px' }}>
            <i className="bi bi-patch-check-fill text-warning"></i> Pase Oficial Digital
          </span>
          <span className="small text-white-50">
            {formatDate(compra.fecha_compra)}
          </span>
        </div>

        <h3 className="fw-extrabold mb-1 text-white position-relative" style={{ zIndex: 2 }}>
          {compra.evento_nombre}
        </h3>
        <p className="mb-0 text-white-50 small position-relative d-flex align-items-center gap-1" style={{ zIndex: 2 }}>
          <i className="bi bi-geo-alt-fill text-warning"></i> {compra.evento_lugar}
        </p>
      </div>

      {/* Separador con Muescas laterales para simular desprendible */}
      <div className="ticket-notch-divider">
        <div className="ticket-dashed-separator"></div>
      </div>

      {/* Cuerpo del Pase */}
      <div className="ticket-pass-body">
        <div className="row g-4 align-items-center">
          {/* Detalles de la entrada */}
          <div className="col-md-7">
            <div className="mb-3">
              <span className="text-dim small text-uppercase d-block" style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}>
                SECTOR / ACCESO AUTORIZADO
              </span>
              <span className="fw-extrabold fs-4" style={{ color: '#38bdf8' }}>
                {compra.tipo_ticket_nombre}
              </span>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-6">
                <span className="text-dim small text-uppercase d-block" style={{ fontSize: '0.7rem' }}>FECHA DEL EVENTO</span>
                <span className="fw-semibold text-white">{compra.evento_fecha}</span>
              </div>
              <div className="col-6">
                <span className="text-dim small text-uppercase d-block" style={{ fontSize: '0.7rem' }}>HORA DE APERTURA</span>
                <span className="fw-semibold text-white">{compra.evento_hora} hrs</span>
              </div>
              <div className="col-6">
                <span className="text-dim small text-uppercase d-block" style={{ fontSize: '0.7rem' }}>CANTIDAD</span>
                <span className="fw-semibold text-white">{compra.cantidad} Pase(s)</span>
              </div>
              <div className="col-6">
                <span className="text-dim small text-uppercase d-block" style={{ fontSize: '0.7rem' }}>MONTO PAGADO</span>
                <span className="fw-bold text-emerald">{formatBs(compra.total)}</span>
              </div>
            </div>

            <div className="p-3 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span className="text-dim small text-uppercase d-block mb-1" style={{ fontSize: '0.7rem' }}>TITULAR REGISTRADO</span>
              <div className="fw-bold text-white">{compra.comprador_nombre || compra.usuario_nombre}</div>
              <div className="small text-muted">{compra.comprador_email || 'comprador@ticketera.local'}</div>
            </div>
          </div>

          {/* Código QR y Verificación Criptográfica */}
          <div className="col-md-5 text-center">
            <div className="p-3 rounded-4 d-inline-block bg-white shadow-lg position-relative group">
              <img
                src={qrOnline}
                alt={`Código QR ${codigo}`}
                onError={(e) => {
                  // Fallback a visualizador de QR generado si el servicio externo no responde
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
                style={{ width: '150px', height: '150px', display: 'block' }}
              />

              {/* QR Fallback SVG offline */}
              <div style={{ display: 'none', width: '150px', height: '150px', color: '#090d16' }}>
                <svg viewBox="0 0 100 100" width="100%" height="100%">
                  <rect x="0" y="0" width="100" height="100" fill="#ffffff" />
                  <rect x="10" y="10" width="30" height="30" fill="#090d16" />
                  <rect x="15" y="15" width="20" height="20" fill="#ffffff" />
                  <rect x="20" y="20" width="10" height="10" fill="#090d16" />
                  <rect x="60" y="10" width="30" height="30" fill="#090d16" />
                  <rect x="65" y="15" width="20" height="20" fill="#ffffff" />
                  <rect x="70" y="20" width="10" height="10" fill="#090d16" />
                  <rect x="10" y="60" width="30" height="30" fill="#090d16" />
                  <rect x="15" y="65" width="20" height="20" fill="#ffffff" />
                  <rect x="20" y="70" width="10" height="10" fill="#090d16" />
                  <rect x="50" y="50" width="15" height="15" fill="#090d16" />
                  <rect x="70" y="50" width="10" height="20" fill="#090d16" />
                  <rect x="50" y="70" width="20" height="10" fill="#090d16" />
                  <rect x="80" y="80" width="10" height="10" fill="#090d16" />
                </svg>
              </div>
            </div>

            <div className="mt-3">
              <div className="d-flex align-items-center justify-content-center gap-2">
                <span className="font-monospace fw-bold text-white fs-6 tracking-wide">
                  {codigo}
                </span>
                <button
                  type="button"
                  onClick={handleCopiarCodigo}
                  className="btn btn-sm btn-link text-info p-0 d-print-none text-decoration-none"
                  title="Copiar código del ticket"
                >
                  <i className={`bi ${copiado ? 'bi-check-lg text-success' : 'bi-clipboard'}`}></i>
                </button>
              </div>
              <span className="text-dim small d-block" style={{ fontSize: '0.75rem' }}>
                {copiado ? '¡Código copiado al portapapeles!' : 'Validación QR en Puerta'}
              </span>
            </div>
          </div>
        </div>

        {/* Código de barras estilizado */}
        <div className="mt-4 pt-3 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
          <div className="barcode-strip mb-2">
            {[4, 2, 6, 1, 3, 5, 2, 7, 3, 2, 4, 1, 5, 3, 6, 2, 4, 3, 5, 1, 2, 6, 3, 4, 2, 5, 1, 4, 3, 6, 2, 4, 5, 2].map((w, i) => (
              <span key={i} style={{ width: `${w}px` }}></span>
            ))}
          </div>
          <div className="d-flex justify-content-between align-items-center text-dim small" style={{ fontSize: '0.72rem' }}>
            <span>AUTENTICACIÓN DIGITAL 2026 &bull; BOLIVIA</span>
            <span>NO COMPARTIR ESTE CÓDIGO CON TERCEROS</span>
          </div>
        </div>
      </div>

      {/* Footer del Pase con Indicaciones de Seguridad */}
      <div className="ticket-pass-footer p-3 border-top" style={{ background: 'rgba(0, 0, 0, 0.25)', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 text-muted small">
          <div>
            <i className="bi bi-shield-check text-emerald me-1"></i>
            Boleto oficial intransferible. Válido con Cédula de Identidad (CI).
          </div>
          <div className="d-flex gap-2 d-print-none">
            <button
              onClick={handlePrint}
              className="btn btn-sm btn-link text-white text-decoration-none p-0 d-flex align-items-center gap-1"
            >
              <i className="bi bi-printer text-info"></i> Imprimir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
