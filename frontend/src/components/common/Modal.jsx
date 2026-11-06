// ========================================================
// COMPONENTE: MODAL (<dialog> Nativo Moderno)
// Basado en el estándar HTML5 <dialog> y guías oficiales de modern-web
// ========================================================

import React, { useEffect, useRef } from 'react';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '550px',
  icon = 'bi-window',
  headerVariant = 'default' // 'default', 'warning', 'info', 'primary'
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  // Manejador de click fuera del cuadro modal (Light Dismiss nativo seguro)
  const handlePointerDown = (e) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const rect = dialog.getBoundingClientRect();
    const isOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;

    if (isOutside && onClose) {
      onClose();
    }
  };

  const titleId = `modal-title-${Math.random().toString(36).substring(2, 7)}`;

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault();
        if (onClose) onClose();
      }}
      onPointerDown={handlePointerDown}
      aria-labelledby={title ? titleId : undefined}
      className="modern-native-dialog p-0 rounded-4 overflow-hidden shadow-2xl"
      style={{
        maxWidth: maxWidth,
        width: '92%',
        background: 'rgba(15, 23, 42, 0.98)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        color: '#f8fafc'
      }}
    >
      <div className="p-4">
        {/* Encabezado */}
        <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
          <h5 id={titleId} className={`fw-bold mb-0 d-flex align-items-center gap-2 ${headerVariant === 'warning' ? 'text-warning' : headerVariant === 'info' ? 'text-info' : 'text-white'}`}>
            <i className={`bi ${icon}`}></i>
            <span>{title}</span>
          </h5>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-modern-outline py-1 px-2 border-0 text-muted"
            aria-label="Cerrar modal"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Contenido */}
        <div className="modal-content-body">
          {children}
        </div>
      </div>
    </dialog>
  );
}
