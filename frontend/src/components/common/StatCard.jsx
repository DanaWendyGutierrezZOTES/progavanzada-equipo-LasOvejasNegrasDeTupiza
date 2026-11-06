// ========================================================
// COMPONENTE: STATCARD (KPI / Métrica Reutilizable)
// Elimina código repetido de tarjetas de estadísticas
// ========================================================

import React from 'react';

export default function StatCard({
  label,
  value,
  subtext,
  icon = 'bi-bar-chart',
  variant = 'primary', // 'primary', 'info', 'warning', 'emerald', 'danger'
  trend
}) {
  const colorMap = {
    primary: { bg: 'rgba(99, 102, 241, 0.15)', text: '#818cf8', border: 'rgba(99, 102, 241, 0.3)' },
    info: { bg: 'rgba(6, 182, 212, 0.15)', text: '#38bdf8', border: 'rgba(6, 182, 212, 0.3)' },
    warning: { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' },
    emerald: { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.3)' },
    danger: { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239, 68, 68, 0.3)' }
  };

  const currentTheme = colorMap[variant] || colorMap.primary;

  return (
    <div className="kpi-card h-100">
      <div className="d-flex justify-content-between align-items-start">
        <div className="flex-grow-1 me-3">
          <span className="text-dim small fw-semibold text-uppercase d-block" style={{ fontSize: '0.73rem', letterSpacing: '0.5px' }}>
            {label}
          </span>
          <h2 className="fw-extrabold text-white mb-1 mt-2 tracking-tight">
            {value}
          </h2>
          {subtext && (
            <div className="small text-muted d-flex align-items-center gap-1 mt-1">
              {trend && <i className={`bi bi-${trend === 'up' ? 'arrow-up-short text-emerald' : 'arrow-down-short text-danger'} fs-6`}></i>}
              <span>{subtext}</span>
            </div>
          )}
        </div>

        <div
          className="kpi-icon-badge flex-shrink-0"
          style={{
            background: currentTheme.bg,
            color: currentTheme.text,
            border: `1px solid ${currentTheme.border}`
          }}
        >
          <i className={`bi ${icon}`}></i>
        </div>
      </div>
    </div>
  );
}
