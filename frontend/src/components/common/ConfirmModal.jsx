// ========================================================
// COMPONENTE: CONFIRMMODAL (Diálogo de Confirmación)
// Reemplaza window.confirm() por una modal estilizada y accesible
// ========================================================

import React from 'react';
import Modal from './Modal';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Confirmar acción?',
  message = '¿Estás seguro de que deseas realizar esta acción? Esta operación no se puede deshacer.',
  confirmText = 'Sí, eliminar',
  cancelText = 'Cancelar',
  variant = 'danger' // 'danger', 'warning', 'primary'
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={variant === 'danger' ? 'bi-exclamation-triangle-fill text-danger' : 'bi-question-circle-fill text-warning'}
      maxWidth="460px"
    >
      <p className="text-muted small mb-4">
        {message}
      </p>

      <div className="d-flex justify-content-end gap-2 pt-2 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
        <button
          type="button"
          onClick={onClose}
          className="btn btn-sm btn-modern-outline"
        >
          {cancelText}
        </button>

        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`btn btn-sm ${variant === 'danger' ? 'btn-danger' : 'btn-modern-primary'}`}
          style={{
            background: variant === 'danger' ? 'linear-gradient(135deg, #ef4444, #b91c1c)' : undefined,
            border: 'none',
            padding: '0.5rem 1.2rem',
            borderRadius: '10px'
          }}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
