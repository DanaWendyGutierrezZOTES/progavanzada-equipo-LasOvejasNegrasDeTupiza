// ========================================================
// CONTEXTO DE NOTIFICACIONES TOAST (ToastContext.jsx)
// Reemplaza los molestos alert() y da feedback visual elegante
// ========================================================

import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((mensaje, tipo = 'info', duracionMs = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const nuevoToast = { id, mensaje, tipo };

    setToasts((prev) => [...prev, nuevoToast]);

    if (duracionMs > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duracionMs);
    }
  }, [removeToast]);

  const notifySuccess = useCallback((msg) => addToast(msg, 'success'), [addToast]);
  const notifyError = useCallback((msg) => addToast(msg, 'danger'), [addToast]);
  const notifyInfo = useCallback((msg) => addToast(msg, 'info'), [addToast]);
  const notifyWarning = useCallback((msg) => addToast(msg, 'warning'), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, notifySuccess, notifyError, notifyInfo, notifyWarning }}>
      {children}
      {/* Contenedor flotante de Toasts */}
      <div
        className="toast-container position-fixed bottom-0 end-0 p-3 d-print-none"
        style={{ zIndex: 1090, pointerEvents: 'none' }}
      >
        {toasts.map((t) => {
          const icono =
            t.tipo === 'success' ? 'bi-check-circle-fill text-success' :
            t.tipo === 'danger' ? 'bi-exclamation-triangle-fill text-danger' :
            t.tipo === 'warning' ? 'bi-exclamation-circle-fill text-warning' :
            'bi-info-circle-fill text-info';

          return (
            <div
              key={t.id}
              className={`toast show align-items-center mb-2 shadow-lg border border-opacity-25 rounded-4 animate-slideIn`}
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
              style={{
                pointerEvents: 'auto',
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(16px)',
                minWidth: '300px',
                maxWidth: '420px',
                borderColor: t.tipo === 'success' ? '#10b981' : t.tipo === 'danger' ? '#ef4444' : '#6366f1'
              }}
            >
              <div className="d-flex p-3 align-items-center">
                <i className={`bi ${icono} fs-4 me-3`}></i>
                <div className="toast-body text-white small p-0 flex-grow-1">
                  {t.mensaje}
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white ms-2"
                  onClick={() => removeToast(t.id)}
                  aria-label="Cerrar"
                ></button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Si no está envuelto en ToastProvider, fallback a consola para evitar crash
    return {
      addToast: (msg) => console.log(msg),
      notifySuccess: (msg) => console.log(msg),
      notifyError: (msg) => console.error(msg),
      notifyInfo: (msg) => console.info(msg),
      notifyWarning: (msg) => console.warn(msg)
    };
  }
  return context;
}
