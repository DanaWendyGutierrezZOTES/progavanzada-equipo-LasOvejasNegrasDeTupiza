// ========================================================
// COMPONENTE: FOOTER (DISEÑO MODERNO 2026)
// Pie de página minimalista y elegante
// ========================================================

import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-auto py-4 border-top d-print-none" style={{ background: 'rgba(9, 13, 22, 0.95)', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
      <div className="container text-center">
        <div className="mb-2 d-flex align-items-center justify-content-center gap-2">
          <span className="p-1 rounded-2" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
            <i className="bi bi-ticket-perforated-fill text-white small"></i>
          </span>
          <span className="fw-bold text-white">TicketEventos</span>
          <span className="text-dim small">&bull; Sistema de Gestión y Emisión de Entradas</span>
        </div>
        <div className="small text-dim">
          Programación Avanzada &bull; Equipo: <span className="text-light">Las Ovejas Negras De Tupiza</span>
        </div>
      </div>
    </footer>
  );
}
