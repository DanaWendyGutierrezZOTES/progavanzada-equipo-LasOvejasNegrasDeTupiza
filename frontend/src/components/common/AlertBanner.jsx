// ========================================================
// COMPONENTE: ALERTBANNER (Alertas Reutilizables)
// Elimina repetición de markup para avisos de error/éxito
// ========================================================

import React from 'react';

export default function AlertBanner({
  type = 'danger', // 'danger', 'success', 'warning', 'info'
  message,
  onDismiss
}) {
  if (!message) return null;

  const iconMap = {
    danger: 'bi-exclamation-triangle-fill',
    success: 'bi-check-circle-fill',
    warning: 'bi-exclamation-circle-fill',
    info: 'bi-info-circle-fill'
  };

  const icon = iconMap[type] || 'bi-info-circle-fill';

  return (
    <div
      className={`alert alert-${type} py-2 px-3 mb-4 rounded-3 d-flex align-items-center justify-content-between gap-2 shadow-sm animate-fadeIn`}
      role="alert"
    >
      <div className="d-flex align-items-center gap-2">
        <i className={`bi ${icon} fs-5 flex-shrink-0`}></i>
        <span className="small">{message}</span>
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="btn-close btn-sm p-1 ms-2"
          aria-label="Cerrar"
        ></button>
      )}
    </div>
  );
}
