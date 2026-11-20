// ========================================================
// PÁGINA: COMPRARTICKETPAGE (Checkout Seguro en Bs)
// Proceso de compra con cálculo reactivo en Bolivianos (Bs),
// validaciones exhaustivas (C.I., Celular Bolivia, Correo, Tarjeta/QR),
// y componentes reutilizables (DRY).
// ========================================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { obtenerEventoPorId, realizarCompra } from '../services/storage';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import EmptyState from '../components/common/EmptyState';
import AlertBanner from '../components/common/AlertBanner';
import FormInput from '../components/common/FormInput';
import { formatBs } from '../utils/formatters';
import {
  validarNombre,
  validarCI,
  validarEmail,
  validarTelefono,
  validarTarjeta
} from '../utils/validators';

export default function ComprarTicketPage() {
  const { eventoId, tipoId } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { notifySuccess, notifyError } = useToast();

  const [evento, setEvento] = useState(null);
  const [tipoTicket, setTipoTicket] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  // Campos del Comprador
  const [nombreComprador, setNombreComprador] = useState(usuario?.nombre || usuario?.username || '');
  const [ciComprador, setCiComprador] = useState('');
  const [emailComprador, setEmailComprador] = useState(usuario?.email || '');
  const [telefonoComprador, setTelefonoComprador] = useState(usuario?.telefono || '');

  // Método de Pago
  const [metodoPago, setMetodoPago] = useState('qr'); // 'qr' | 'tigo' | 'tarjeta'
  const [tarjetaData, setTarjetaData] = useState({
    titular: '',
    numero: '',
    expiracion: '',
    cvv: ''
  });

  // Errores de validación por campo
  const [errores, setErrores] = useState({});
  const [errorGlobal, setErrorGlobal] = useState('');
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
        <EmptyState
          icon="bi-exclamation-octagon"
          title="Entrada no encontrada"
          description="No se pudo cargar la información del evento o la categoría seleccionada."
          actionText="Volver a la cartelera"
          actionTo="/"
        />
      </div>
    );
  }

  const precioUnitario = Number(tipoTicket.precio);
  const totalPagar = precioUnitario * Number(cantidad);

  // Validación reactiva por campo
  const validarCampo = (campo, valor) => {
    let res = { valido: true, mensaje: '' };
    switch (campo) {
      case 'nombre':
        res = validarNombre(valor, 'El nombre completo');
        break;
      case 'ci':
        res = validarCI(valor, true);
        break;
      case 'email':
        res = validarEmail(valor);
        break;
      case 'telefono':
        res = validarTelefono(valor, false);
        break;
      default:
        break;
    }
    setErrores(prev => ({ ...prev, [campo]: res.valido ? '' : res.mensaje }));
    return res.valido;
  };

  const handleTarjetaChange = (e) => {
    const { name, value } = e.target;
    setTarjetaData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorGlobal('');

    // 1. Validar campos del comprador
    const vNombre = validarNombre(nombreComprador, 'El nombre completo');
    const vCI = validarCI(ciComprador, true);
    const vEmail = validarEmail(emailComprador);
    const vTel = validarTelefono(telefonoComprador, false);

    const nuevosErrores = {
      nombre: vNombre.valido ? '' : vNombre.mensaje,
      ci: vCI.valido ? '' : vCI.mensaje,
      email: vEmail.valido ? '' : vEmail.mensaje,
      telefono: vTel.valido ? '' : vTel.mensaje
    };

    // 2. Validar método de pago
    if (metodoPago === 'tarjeta') {
      const vTarj = validarTarjeta({
        numero: tarjetaData.numero,
        titular: tarjetaData.titular || nombreComprador,
        expiracion: tarjetaData.expiracion,
        cvv: tarjetaData.cvv
      });
      if (!vTarj.valido) {
        nuevosErrores.tarjeta = vTarj.mensaje;
      }
    }

    setErrores(nuevosErrores);

    const hayErrores = Object.values(nuevosErrores).some(msg => Boolean(msg));
    if (hayErrores) {
      setErrorGlobal('Por favor corrige los campos señalados antes de continuar.');
      return;
    }

    if (cantidad < 1) {
      setErrorGlobal('Debes seleccionar al menos 1 entrada.');
      return;
    }

    if (cantidad > tipoTicket.cantidad_disponible) {
      setErrorGlobal(`Solo quedan ${tipoTicket.cantidad_disponible} entradas disponibles.`);
      return;
    }

    setProcesando(true);

    try {
      const compradorActual = usuario || {
        id: Date.now(),
        username: emailComprador.split('@')[0] || 'invitado',
        nombre: nombreComprador,
        ci: ciComprador,
        email: emailComprador,
        telefono: telefonoComprador
      };

      const nuevaCompra = await realizarCompra({
        usuario: { ...compradorActual, ci: ciComprador },
        eventoId: evento.id,
        tipoTicketId: tipoTicket.id,
        cantidad: Number(cantidad)
      });

      notifySuccess('¡Compra confirmada! Tu pase digital ha sido generado con éxito.');
      navigate(`/ticket/${nuevaCompra.id}`);
    } catch (err) {
      setErrorGlobal(err.message || 'Ocurrió un error al procesar la compra.');
      notifyError('No se pudo completar la transacción.');
      setProcesando(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <Link to={`/evento/${evento.id}`} className="text-decoration-none text-muted small d-inline-flex align-items-center gap-1 link-hover">
          <i className="bi bi-arrow-left"></i> Volver al evento
        </Link>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="glass-panel p-4 p-md-5">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge rounded-pill px-3 py-1" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                Boletería Oficial &bull; Paso Final
              </span>
              <span className="text-muted small">Bolivia 2026</span>
            </div>

            <h2 className="fw-extrabold text-white mb-1 font-display">Confirmar Entradas</h2>
            <p className="text-muted small mb-4">
              Estás adquiriendo entradas oficiales para <strong className="text-light">{evento.nombre}</strong> ({evento.estadio_nombre || evento.lugar})
            </p>

            <AlertBanner type="danger" message={errorGlobal} onDismiss={() => setErrorGlobal('')} />

            <form onSubmit={handleSubmit} noValidate>
              {/* Tarjeta de Resumen del Ticket Seleccionado */}
              <div className="p-4 rounded-4 mb-4 border" style={{ background: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                  <div>
                    <span className="badge bg-primary rounded-pill mb-1">Categoría Oficial</span>
                    <h4 className="fw-bold text-white mb-0 font-display">{tipoTicket.nombre}</h4>
                    <small className="text-emerald d-block mt-1">
                      <i className="bi bi-check2-circle me-1"></i> {tipoTicket.cantidad_disponible} unidades disponibles
                    </small>
                  </div>
                  <div className="text-lg-end">
                    <span className="text-dim small d-block">PRECIO UNITARIO</span>
                    <span className="fs-4 fw-bold font-numbers" style={{ color: '#38bdf8' }}>
                      {formatBs(precioUnitario)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Selector de Cantidad */}
              <div className="mb-4">
                <label className="form-label fw-semibold text-light mb-2">Cantidad de Pases</label>
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
                      className="form-control form-control-modern text-center fw-bold fs-5 font-numbers"
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
                    Total: {cantidad} pase{cantidad > 1 ? 's' : ''} &bull; Máx. {tipoTicket.cantidad_disponible}
                  </span>
                </div>
              </div>

              {/* Datos del Asistente con Validación Centralizada */}
              <h5 className="fw-bold text-white mt-4 mb-3 d-flex align-items-center gap-2 font-display">
                <i className="bi bi-person-badge text-primary"></i> Datos del Titular del Pase
              </h5>

              <div className="row g-2 mb-4">
                <div className="col-md-6">
                  <FormInput
                    label="Nombre Completo"
                    name="nombreComprador"
                    value={nombreComprador}
                    placeholder="Ej: Juan Pérez Morales"
                    required
                    icon="bi-person"
                    error={errores.nombre}
                    onChange={(e) => {
                      setNombreComprador(e.target.value);
                      if (errores.nombre) validarCampo('nombre', e.target.value);
                    }}
                    onBlur={(e) => validarCampo('nombre', e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <FormInput
                    label="Carnet de Identidad (C.I.)"
                    name="ciComprador"
                    value={ciComprador}
                    placeholder="Ej: 8492012 LP o 7381920"
                    required
                    icon="bi-card-text"
                    helperText="Requerido para control en puertas"
                    error={errores.ci}
                    onChange={(e) => {
                      setCiComprador(e.target.value);
                      if (errores.ci) validarCampo('ci', e.target.value);
                    }}
                    onBlur={(e) => validarCampo('ci', e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <FormInput
                    label="Correo Electrónico"
                    name="emailComprador"
                    type="email"
                    value={emailComprador}
                    placeholder="correo@ejemplo.com"
                    required
                    icon="bi-envelope"
                    helperText="Recibirás tu pase QR digital aquí"
                    error={errores.email}
                    onChange={(e) => {
                      setEmailComprador(e.target.value);
                      if (errores.email) validarCampo('email', e.target.value);
                    }}
                    onBlur={(e) => validarCampo('email', e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <FormInput
                    label="Celular / WhatsApp (Bolivia)"
                    name="telefonoComprador"
                    type="tel"
                    value={telefonoComprador}
                    placeholder="Ej: 71234567 o +591 71234567"
                    icon="bi-whatsapp"
                    helperText="8 dígitos de Bolivia"
                    error={errores.telefono}
                    onChange={(e) => {
                      setTelefonoComprador(e.target.value);
                      if (errores.telefono) validarCampo('telefono', e.target.value);
                    }}
                    onBlur={(e) => validarCampo('telefono', e.target.value)}
                  />
                </div>
              </div>

              {/* Selector Interactivo de Métodos de Pago en Bolivia */}
              <h5 className="fw-bold text-white mt-4 mb-3 d-flex align-items-center gap-2 font-display">
                <i className="bi bi-wallet2 text-info"></i> Método de Pago (Bolivia)
              </h5>

              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <div
                    onClick={() => setMetodoPago('qr')}
                    className={`payment-option-card ${metodoPago === 'qr' ? 'selected' : ''}`}
                  >
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <i className="bi bi-qr-code text-info fs-4"></i>
                      <span className="fw-bold text-white small">QR Simple</span>
                    </div>
                    <span className="text-dim small d-block" style={{ fontSize: '0.72rem' }}>
                      Banco Unión, BCP, BNB, Banco FIE, Ganadero
                    </span>
                  </div>
                </div>

                <div className="col-md-4">
                  <div
                    onClick={() => setMetodoPago('tigo')}
                    className={`payment-option-card ${metodoPago === 'tigo' ? 'selected' : ''}`}
                  >
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <i className="bi bi-phone-fill text-warning fs-4"></i>
                      <span className="fw-bold text-white small">Tigo Money</span>
                    </div>
                    <span className="text-dim small d-block" style={{ fontSize: '0.72rem' }}>
                      Billetera móvil en toda Bolivia
                    </span>
                  </div>
                </div>

                <div className="col-md-4">
                  <div
                    onClick={() => setMetodoPago('tarjeta')}
                    className={`payment-option-card ${metodoPago === 'tarjeta' ? 'selected' : ''}`}
                  >
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <i className="bi bi-credit-card-2-front text-primary fs-4"></i>
                      <span className="fw-bold text-white small">Tarjeta Débito/Crédito</span>
                    </div>
                    <span className="text-dim small d-block" style={{ fontSize: '0.72rem' }}>
                      Red Enlace / Redeban Bolivia
                    </span>
                  </div>
                </div>
              </div>

              {/* Detalle del Método de Pago Seleccionado */}
              {metodoPago === 'qr' && (
                <div className="p-3 rounded-4 mb-4 border d-flex align-items-center gap-3 animate-fadeIn" style={{ background: 'rgba(6, 182, 212, 0.08)', borderColor: 'rgba(6, 182, 212, 0.25)' }}>
                  <i className="bi bi-shield-check text-info fs-2 flex-shrink-0"></i>
                  <div className="small text-muted">
                    <strong className="text-white d-block">Pago Inmediato con QR Simple Interbancario</strong>
                    Al confirmar, se generará tu pase con código QR oficial validado automáticamente por el sistema financiero boliviano sin comisiones.
                  </div>
                </div>
              )}

              {metodoPago === 'tigo' && (
                <div className="p-3 rounded-4 mb-4 border d-flex align-items-center gap-3 animate-fadeIn" style={{ background: 'rgba(245, 158, 11, 0.08)', borderColor: 'rgba(245, 158, 11, 0.25)' }}>
                  <i className="bi bi-check-circle-fill text-warning fs-2 flex-shrink-0"></i>
                  <div className="small text-muted">
                    <strong className="text-white d-block">Débito Automático Tigo Money</strong>
                    Se enviará una solicitud de cobro instantánea al número de celular proporcionado.
                  </div>
                </div>
              )}

              {metodoPago === 'tarjeta' && (
                <div className="glass-panel p-3 mb-4 animate-fadeIn border-primary border-opacity-25">
                  <h6 className="fw-bold text-white mb-3 small d-flex align-items-center gap-2">
                    <i className="bi bi-lock-fill text-emerald"></i> Pasarela Segura Red Enlace Bolivia
                  </h6>

                  {errores.tarjeta && (
                    <div className="alert alert-danger py-2 px-3 small mb-3">
                      <i className="bi bi-exclamation-triangle-fill me-1"></i> {errores.tarjeta}
                    </div>
                  )}

                  <div className="row g-2">
                    <div className="col-12">
                      <FormInput
                        label="Titular de la Tarjeta"
                        name="titular"
                        value={tarjetaData.titular}
                        placeholder={nombreComprador || 'Como figura en la tarjeta'}
                        icon="bi-person"
                        onChange={handleTarjetaChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <FormInput
                        label="Número de Tarjeta (16 dígitos)"
                        name="numero"
                        value={tarjetaData.numero}
                        placeholder="4500 1234 5678 9010"
                        icon="bi-credit-card"
                        onChange={handleTarjetaChange}
                      />
                    </div>
                    <div className="col-md-3">
                      <FormInput
                        label="Vencimiento"
                        name="expiracion"
                        value={tarjetaData.expiracion}
                        placeholder="MM/AA (ej: 12/28)"
                        icon="bi-calendar"
                        onChange={handleTarjetaChange}
                      />
                    </div>
                    <div className="col-md-3">
                      <FormInput
                        label="CVV"
                        name="cvv"
                        type="password"
                        value={tarjetaData.cvv}
                        placeholder="•••"
                        icon="bi-shield-lock"
                        onChange={handleTarjetaChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Desglose y Total en Bolivianos */}
              <div className="p-4 rounded-4 border mt-4" style={{ background: 'rgba(15, 23, 42, 0.6)', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                <div className="d-flex justify-content-between mb-2 small text-muted">
                  <span>Subtotal ({cantidad} x {formatBs(precioUnitario)}):</span>
                  <span className="text-light font-numbers">{formatBs(totalPagar)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3 small text-muted">
                  <span>Comisión de emisión:</span>
                  <span className="text-emerald fw-semibold">Bs. 0 (100% Bonificada)</span>
                </div>
                <div className="d-flex justify-content-between align-items-center pt-3 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <div>
                    <span className="fs-5 fw-bold text-white d-block font-display">Total Oficial a Pagar:</span>
                    <small className="text-muted">Pase con código QR único e intransferible</small>
                  </div>
                  <div className="text-end">
                    <span className="display-6 fw-extrabold font-numbers" style={{ color: '#38bdf8' }}>
                      {formatBs(totalPagar)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={procesando}
                  className="btn-modern-primary w-100 py-3 mt-4 fs-6"
                >
                  {procesando ? (
                    <span>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Generando Pase Digital...
                    </span>
                  ) : (
                    <span>
                      <i className="bi bi-shield-check me-1"></i> Pagar {formatBs(totalPagar)} y Emitir Pase
                    </span>
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
