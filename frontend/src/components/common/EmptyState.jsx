// ========================================================
// COMPONENTE: EMPTYSTATE (Reutilizable)
// Elimina código repetido para estados vacíos en todas las páginas
// ========================================================

import React from 'react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  icon = 'bi-inbox',
  title = 'No hay datos disponibles',
  description = 'No se encontraron registros para mostrar.',
  actionText,
  actionTo,
  onAction,
  actionIcon = 'bi-arrow-right',
  extraContent
}) {
  return (
    <div className="glass-panel text-center py-5 px-4 my-4">
      <div
        className="d-inline-flex p-3 rounded-circle mb-3"
        style={{
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          color: '#818cf8'
        }}
      >
        <i className={`bi ${icon} fs-1`} style={{ lineHeight: 1 }}></i>
      </div>

      <h4 className="fw-bold text-white mb-2">{title}</h4>
      <p className="text-muted small mx-auto mb-4" style={{ maxWidth: '460px' }}>
        {description}
      </p>

      {extraContent}

      {actionText && actionTo && (
        <Link to={actionTo} className="btn-modern-primary text-decoration-none">
          <span>{actionText}</span>
          {actionIcon && <i className={`bi ${actionIcon}`}></i>}
        </Link>
      )}

      {actionText && onAction && !actionTo && (
        <button type="button" onClick={onAction} className="btn-modern-primary">
          <span>{actionText}</span>
          {actionIcon && <i className={`bi ${actionIcon}`}></i>}
        </button>
      )}
    </div>
  );
}
