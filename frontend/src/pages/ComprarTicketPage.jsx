// ========================================================
// PÁGINA: COMPRARTICKETPAGE (DISEÑO MODERNO 2026)
// Proceso de compra con moneda en Bolivianos (Bs)
// ========================================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { obtenerEventoPorId, realizarCompra } from '../services/storage';
import { useAuth } from '../context/AuthContext';

export default function ComprarTicketPage() {
  const { eventoId, tipoId } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const [evento, setEvento] = useState(null);
  const [tipoTicket, setTipoTicket] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [nombreComprador, setNombreComprador] = useState(usuario?.nombre || usuario?.username || '');
  const [emailComprador, setEmailComprador] = useState(usuario?.email || '');
  const [telefonoComprador, setTelefonoComprador] = useState(usuario?.telefono || '');
  const [error, setError] = useState('');
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    const ev = obtenerEventoPorId(eventoId);
    if (ev) {
      setEvento(ev);
      const ticket = ev.tipos_ticket?.find(t => Number(t.id) === Number(tipoId));
      setTipoTicket(ticket);
    }
  }, [eventoId, tipoId]);

  if (!evento || !tipoTicket) {
    return (
      <div className="container py-5 text-center">
        <div className="glass-panel p-5 d-inline-block">
          <i className="bi bi-exclamation-octagon text-warning fs-1 mb-3"></i>
          <h3 className="text-white">Ticket no encontrado</h3>
          <p className="text-muted">No se pudo cargar la información del evento seleccionado.</p>
          <Link to="/" className="btn-modern-primary mt-2">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  const precioUnitario = Number(tipoTicket.precio);
  const totalPagar = precioUnitario * Number(cantidad);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (cantidad < 1) {
      setError('Debes seleccionar al menos 1 ticket.');
      return;
    }

    if (cantidad > tipoTicket.cantidad_disponible) {
      setError(`Solo quedan ${tipoTicket.cantidad_disponible} tickets disponibles.`);
      return;
    }

    setProcesando(true);

    try {
      const compradorActual = usuario || {
        id: Date.now(),
        username: emailComprador.split('@')[0] || 'invitado',
        nombre: nombreComprador || 'Comprador Invitado',
        email: emailComprador
      };

      const nuevaCompra = realizarCompra({
        usuario: compradorActual,
        eventoId: evento.id,
        tipoTicketId: tipoTicket.id,
        cantidad: Number(cantidad)
      });

      navigate(`/ticket/${nuevaCompra.id}`);
    } catch (err) {
      setError(err.message || 'Ocurrió un error al procesar la compra.');
      setProcesando(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <Link to={`/evento/${evento.id}`} className="text-decoration-none text-muted small d-inline-flex align-items-center gap-1">
          <i className="bi bi-arrow-left"></i> Volver al evento
        </Link>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="glass-panel p-4 p-md-5">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge rounded-pill px-3 py-1" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                Paso Final
              </span>
              <span className="text-muted small">Checkout Seguro SSL</span>
            </div>

            <h2 className="fw-extrabold text-white mb-1">Confirmar Entradas</h2>
            <p className="text-muted small mb-4">
              Estás adquiriendo entradas oficiales para <strong className="text-light">{evento.nombre}</strong> ({evento.lugar})
            </p>

            {error && (
              <div className="alert alert-danger py-2 mb-4 d-flex align-items-center gap-2" role="alert">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Tarjeta de Resumen del Ticket Seleccionado */}
              <div className="p-4 rounded-4 mb-4 border" style={{ background: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                  <div>
                    <span className="badge bg-primary rounded-pill mb-1">Categoría Seleccionada</span>
                    <h4 className="fw-bold text-white mb-0">{tipoTicket.nombre}</h4>
                    <small className="text-emerald d-block mt-1">
                      <i className="bi bi-check2-circle me-1"></i> {tipoTicket.cantidad_disponible} unidades disponibles
                    </small>
                  </div>
                  <div className="text-lg-end">
                    <span className="text-dim small d-block">PRECIO UNITARIO</span>
                    <span className="fs-4 fw-bold" style={{ color: '#38bdf8' }}>
                      Bs. {precioUnitario.toLocaleString('es-ES')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Selector de Cantidad */}
              <div className="mb-4">
                <label className="form-label fw-semibold text-light mb-2">Cantidad de Entradas</label>
                <div className="d-flex align-items-center gap-3">
                  <div className="input-group" style={{ maxWidth: '180px' }}>
                    <button
                      type="button"
                      className="btn btn-modern-outline"
                      onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={tipoTicket.cantidad_disponible}
                      className="form-control form-control-modern text-center fw-bold fs-5"
                      value={cantidad}
                      onChange={(e) => setCantidad(Math.max(1, Math.min(tipoTicket.cantidad_disponible, Number(e.target.value))))}
                    />
                    <button
                      type="button"
                      className="btn btn-modern-outline"
                      onClick={() => setCantidad(Math.min(tipoTicket.cantidad_disponible, cantidad + 1))}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-muted small">
                    Total: {cantidad} entrada{cantidad > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Datos del Asistente */}
              <h5 className="fw-bold text-white mt-4 mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-person-badge text-primary"></i> Datos del Titular
              </h5>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    className="form-control form-control-modern"
                    placeholder="Ej: Juan Pérez"
                    value={nombreComprador}
                    onChange={(e) => setNombreComprador(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    className="form-control form-control-modern"
                    placeholder="correo@ejemplo.com"
                    value={emailComprador}
                    onChange={(e) => setEmailComprador(e.target.value)}
                  />
                </div>
                <div className="col-md-12">
                  <label className="form-label small fw-semibold text-muted">Teléfono / WhatsApp</label>
                  <input
                    type="text"
                    className="form-control form-control-modern"
                    placeholder="+591 71234567"
                    value={telefonoComprador}
                    onChange={(e) => setTelefonoComprador(e.target.value)}
                  />
                </div>
              </div>

              {/* Desglose y Total en Bolivianos */}
              <div className="p-4 rounded-4 border mt-4" style={{ background: 'rgba(15, 23, 42, 0.6)', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                <div className="d-flex justify-content-between mb-2 small text-muted">
                  <span>Subtotal ({cantidad} x Bs. {precioUnitario.toLocaleString('es-ES')}):</span>
                  <span className="text-light">Bs. {totalPagar.toLocaleString('es-ES')}</span>
                </div>
                <div className="d-flex justify-content-between mb-3 small text-muted">
                  <span>Comisión por servicio:</span>
                  <span className="text-emerald fw-semibold">Bs. 0 (Gratis)</span>
                </div>
                <div className="d-flex justify-content-between align-items-center pt-3 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <div>
                    <span className="fs-5 fw-bold text-white d-block">Total a Pagar:</span>
                    <small className="text-muted">Pase digital con código QR al instante</small>
                  </div>
                  <div className="text-end">
                    <span className="display-6 fw-extrabold" style={{ color: '#38bdf8' }}>
                      Bs. {totalPagar.toLocaleString('es-ES')}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={procesando}
                  className="btn-modern-primary w-100 py-3 mt-4 fs-6"
                >
                  {procesando ? (
                    <span>Generando Pase Digital...</span>
                  ) : (
                    <span><i className="bi bi-shield-check"></i> Pagar Bs. {totalPagar.toLocaleString('es-ES')} y Obtener Pase</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
