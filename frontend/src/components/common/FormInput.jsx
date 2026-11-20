// ========================================================
// COMPONENTE: FORMINPUT (Campo de Formulario Reutilizable)
// Principio DRY: Elimina código repetido en vistas de formulario
// Soporta validación visual reactiva, iconos y mensajes de error
// ========================================================

import React from 'react';

export default function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder = '',
  required = false,
  error = '',
  success = false,
  helperText = '',
  icon = null,
  disabled = false,
  autoComplete = 'off',
  min,
  max,
  rows,
  children,
  className = ''
}) {
  const isInvalid = Boolean(error);
  const isValid = success && !error && value;

  const inputClasses = `form-control form-control-modern ${isInvalid ? 'is-invalid border-danger' : isValid ? 'is-valid border-success' : ''} ${className}`;

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className="form-label small fw-semibold text-muted d-flex justify-content-between align-items-center mb-1">
          <span>
            {label} {required && <span className="text-danger">*</span>}
          </span>
          {helperText && <span className="text-dim small" style={{ fontSize: '0.72rem' }}>{helperText}</span>}
        </label>
      )}

      <div className="input-group">
        {icon && (
          <span className="input-group-text bg-dark border-secondary border-opacity-25 text-muted">
            <i className={`bi ${icon}`}></i>
          </span>
        )}

        {type === 'textarea' ? (
          <textarea
            id={name}
            name={name}
            rows={rows || 3}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={inputClasses}
          />
        ) : type === 'select' ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            required={required}
            disabled={disabled}
            className={`form-select form-control-modern ${isInvalid ? 'is-invalid border-danger' : ''} ${className}`}
          >
            {children}
          </select>
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            autoComplete={autoComplete}
            min={min}
            max={max}
            className={inputClasses}
          />
        )}
      </div>

      {isInvalid && (
        <div className="text-danger small mt-1 d-flex align-items-center gap-1 animate-fadeIn" style={{ fontSize: '0.75rem' }}>
          <i className="bi bi-exclamation-circle-fill"></i>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
