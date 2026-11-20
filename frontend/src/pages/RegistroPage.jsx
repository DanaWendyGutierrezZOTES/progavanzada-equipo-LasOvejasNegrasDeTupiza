// ========================================================
// PÁGINA: REGISTROPAGE (Registro Público de Comprador)
// Registro público seguro exclusivo para asistentes y compradores
// con validaciones centralizadas y componentes modulares (DRY).
// ========================================================

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import AlertBanner from '../components/common/AlertBanner';
import FormInput from '../components/common/FormInput';
import {
  validarUsername,
  validarNombre,
  validarEmail,
  validarTelefono,
  validarPassword
} from '../utils/validators';

export default function RegistroPage() {
  const [formData, setFormData] = useState({
    username: '',
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });

  const [errores, setErrores] = useState({});
  const [errorGlobal, setErrorGlobal] = useState('');
  const [procesando, setProcesando] = useState(false);

  const { registro } = useAuth();
  const { notifySuccess } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorGlobal('');

    // Validaciones con validators.js
    const vUser = validarUsername(formData.username);
    const vNombre = validarNombre(formData.nombre, 'El nombre completo');
    const vEmail = validarEmail(formData.email);
    const vTel = validarTelefono(formData.telefono, false);
    const vPass = validarPassword(formData.password, formData.confirmPassword);

    const nuevosErrores = {
      username: vUser.valido ? '' : vUser.mensaje,
      nombre: vNombre.valido ? '' : vNombre.mensaje,
      email: vEmail.valido ? '' : vEmail.mensaje,
      telefono: vTel.valido ? '' : vTel.mensaje,
      password: vPass.valido ? '' : vPass.mensaje,
      confirmPassword: (formData.password !== formData.confirmPassword) ? 'Las contraseñas no coinciden.' : ''
    };

    setErrores(nuevosErrores);

    if (Object.values(nuevosErrores).some(m => Boolean(m))) {
      setErrorGlobal('Por favor completa todos los campos requeridos correctamente.');
      return;
    }

    setProcesando(true);

    try {
      const nuevo = await registro({
        username: formData.username.trim(),
        nombre: formData.nombre.trim(),
        email: formData.email.trim(),
        telefono: formData.telefono.trim(),
        password: formData.password
      });

      notifySuccess(`¡Bienvenido a TicketEventos, ${nuevo.nombre || nuevo.username}! Tu cuenta de comprador ha sido creada.`);
      navigate('/');
    } catch (err) {
      setErrorGlobal(err.message || 'Error al registrar el usuario');
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <div className="glass-panel p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow-lg"
                   style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.25) 100%)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.35)' }}>
                <i className="bi bi-person-plus-fill fs-3"></i>
              </div>
              <h3 className="fw-extrabold text-white mb-1 font-display">Registro de Comprador</h3>
              <p className="text-muted small">Crea tu cuenta para comprar y gestionar tus entradas oficiales en Bolivia</p>
            </div>

            {/* Aviso informativo sobre el rol de comprador */}
            <div className="p-3 rounded-4 mb-4 d-flex align-items-center gap-3 border"
                 style={{ background: 'rgba(99, 102, 241, 0.08)', borderColor: 'rgba(99, 102, 241, 0.25)' }}>
              <i className="bi bi-info-circle-fill text-primary fs-4 flex-shrink-0"></i>
              <div className="small text-muted">
                <strong className="text-white d-block">Cuenta de Asistente / Comprador</strong>
                Podrás explorar cartelera, comprar entradas en Bolivianos (Bs) y descargar tus pases QR.
                *(Los Organizadores son registrados exclusivamente por el Administrador).*
              </div>
            </div>

            <AlertBanner type="danger" message={errorGlobal} onDismiss={() => setErrorGlobal('')} />

            <form onSubmit={handleSubmit} noValidate>
              <div className="row g-2 mb-2">
                <div className="col-md-6">
                  <FormInput
                    label="Usuario"
                    name="username"
                    value={formData.username}
                    placeholder="ej: juan123"
                    required
                    icon="bi-person"
                    error={errores.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <FormInput
                    label="Nombre Completo"
                    name="nombre"
                    value={formData.nombre}
                    placeholder="ej: Juan Pérez"
                    required
                    icon="bi-person-badge"
                    error={errores.nombre}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row g-2 mb-2">
                <div className="col-md-6">
                  <FormInput
                    label="Correo Electrónico"
                    name="email"
                    type="email"
                    value={formData.email}
                    placeholder="correo@ejemplo.com"
                    required
                    icon="bi-envelope"
                    error={errores.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <FormInput
                    label="Teléfono / Celular Bolivia"
                    name="telefono"
                    type="tel"
                    value={formData.telefono}
                    placeholder="71234567 o +591..."
                    icon="bi-whatsapp"
                    helperText="Opcional"
                    error={errores.telefono}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-md-6">
                  <FormInput
                    label="Contraseña"
                    name="password"
                    type="password"
                    value={formData.password}
                    placeholder="••••••••"
                    required
                    icon="bi-lock"
                    error={errores.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <FormInput
                    label="Confirmar Contraseña"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    placeholder="••••••••"
                    required
                    icon="bi-lock-fill"
                    error={errores.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={procesando}
                className="btn-modern-primary w-100 py-2 fs-6 mt-2"
              >
                {procesando ? (
                  <span>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Registrando Cuenta...
                  </span>
                ) : (
                  <span>
                    <i className="bi bi-person-check me-1"></i> Registrar Cuenta de Comprador
                  </span>
                )}
              </button>
            </form>

            <div className="text-center mt-3">
              <span className="small text-muted">¿Ya tienes una cuenta creada? </span>
              <Link to="/login" className="small text-info text-decoration-none fw-semibold">
                Inicia sesión aquí
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
