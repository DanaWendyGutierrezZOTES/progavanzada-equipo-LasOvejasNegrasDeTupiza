// ========================================================
// PÁGINA: TICKETDETALLEPAGE (Pase Digital 2026)
// Visualización del boleto digital con QR único y opciones de impresión
// ========================================================

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { obtenerCompraPorId } from '../services/storage';
import TicketPass from '../components/TicketPass';
import EmptyState from '../components/common/EmptyState';

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
        <EmptyState
          icon="bi-ticket-perforated"
          title="Pase digital no encontrado"
          description="No se localizó la entrada solicitada en el registro del sistema."
          actionText="Ir a la cartelera"
          actionTo="/"
        />
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
        <h2 className="fw-extrabold text-white mb-1">¡Pase Digital Confirmado!</h2>
        <p className="text-muted small">
          Tu entrada oficial está registrada. Preséntala desde tu teléfono móvil o imprímela en PDF.
        </p>
      </div>

      {/* Pase Digital Holográfico Modular */}
      <TicketPass compra={compra} onImprimir={handleImprimir} />

      {/* Botones de Acción (Ocultos al imprimir) */}
      <div className="d-flex flex-wrap justify-content-center gap-3 d-print-none mt-4">
        <button onClick={handleImprimir} className="btn-modern-primary">
          <i className="bi bi-printer me-2"></i> Imprimir / Guardar en PDF
        </button>
        <Link to="/mis-tickets" className="btn-modern-outline text-decoration-none">
          <i className="bi bi-ticket-detailed me-2"></i> Ver Mis Otros Pases
        </Link>
        <Link to="/" className="btn-modern-outline text-decoration-none">
          <i className="bi bi-compass me-2"></i> Explorar Más Eventos
        </Link>
      </div>
    </div>
  );
}
