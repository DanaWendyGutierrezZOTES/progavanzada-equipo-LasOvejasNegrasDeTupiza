// ========================================================
// COMPONENTE: PAGEHEADER (Encabezado con Navegación)
// Elimina repetición del botón Volver, títulos y breadcrumbs
// ========================================================

import React from 'react';
import { Link } from 'react-router-dom';

export default function PageHeader({
  title,
  subtitle,
  badgeText,
  badgeVariant = 'primary', // 'primary', 'warning', 'info', 'danger'
  badgeIcon,
  backTo,
  backText = 'Volver',
  actions
}) {
  return (
    <div className="mb-4">
      {backTo && (
        <div className="mb-3">
          <Link
            to={backTo}
            className="text-decoration-none text-muted small d-inline-flex align-items-center gap-1 link-hover"
          >
            <i className="bi bi-arrow-left"></i>
            <span>{backText}</span>
          </Link>
        </div>
      )}

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div>
          {badgeText && (
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2"
                 style={{
                   background: badgeVariant === 'warning' ? 'rgba(245, 158, 11, 0.15)' :
                               badgeVariant === 'info' ? 'rgba(6, 182, 212, 0.15)' :
                               badgeVariant === 'danger' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                   border: `1px solid ${badgeVariant === 'warning' ? 'rgba(245, 158, 11, 0.3)' :
                                        badgeVariant === 'info' ? 'rgba(6, 182, 212, 0.3)' :
                                        badgeVariant === 'danger' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`
                 }}>
              {badgeIcon && <i className={`bi ${badgeIcon} ${badgeVariant === 'warning' ? 'text-warning' : badgeVariant === 'info' ? 'text-info' : badgeVariant === 'danger' ? 'text-danger' : 'text-primary'}`}></i>}
              <span className={`small fw-bold text-uppercase ${badgeVariant === 'warning' ? 'text-warning' : badgeVariant === 'info' ? 'text-info' : badgeVariant === 'danger' ? 'text-danger' : 'text-primary'}`} style={{ letterSpacing: '0.5px' }}>
                {badgeText}
              </span>
            </div>
          )}

          <h2 className="fw-extrabold text-white mb-1">{title}</h2>
          {subtitle && <p className="text-muted small mb-0">{subtitle}</p>}
        </div>

        {actions && <div className="d-flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}
