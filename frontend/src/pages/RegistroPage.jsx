// ========================================================
// PÁGINA: REGISTROPAGE (DISEÑO MODERNO 2026)
// Registro público EXCLUSIVO para Compradores
// (Los Organizadores son registrados únicamente por el Administrador)
// ========================================================

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegistroPage() {
  const [formData, setFormData] = useState({
    username: '',
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const { registro } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas ingresadas no coinciden.');
      return;
    }

    try {
      const nuevo = registro({
        username: formData.username,
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        password: formData.password
      });

      alert(`¡Bienvenido a TicketEventos, ${nuevo.nombre || nuevo.username}! Tu cuenta de comprador ha sido creada.`);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al registrar el usuario');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <div className="glass-panel p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                   style={{ width: '56px', height: '56px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                <i className="bi bi-person-plus-fill fs-3"></i>
              </div>
              <h3 className="fw-extrabold text-white mb-1">Registro de Comprador</h3>
              <p className="text-muted small">Crea tu cuenta para comprar y gestionar tus entradas oficiales</p>
            </div>

            {/* Aviso informativo sobre el rol de comprador */}
            <div className="p-3 rounded-4 mb-4 d-flex align-items-center gap-3 border"
                 style={{ background: 'rgba(99, 102, 241, 0.08)', borderColor: 'rgba(99, 102, 241, 0.25)' }}>
              <i className="bi bi-info-circle-fill text-primary fs-4"></i>
              <div className="small text-muted">
                <strong className="text-white d-block">Cuenta de Asistente / Comprador</strong>
                Podrás explorar cartelera, comprar entradas y descargar tus pases QR.
                *(Los Organizadores son registrados exclusivamente por el Administrador).*
              </div>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3" role="alert">
                <i className="bi bi-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Usuario *</label>
                  <input
                    type="text"
                    required
                    name="username"
                    className="form-control form-control-modern"
                    placeholder="ej: juan123"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    name="nombre"
                    className="form-control form-control-modern"
                    placeholder="ej: Juan Pérez"
                    value={formData.nombre}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    name="email"
                    className="form-control form-control-modern"
                    placeholder="correo@ejemplo.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Teléfono / WhatsApp</label>
                  <input
                    type="text"
                    name="telefono"
                    className="form-control form-control-modern"
                    placeholder="+591 71234567"
                    value={formData.telefono}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Contraseña *</label>
                  <input
                    type="password"
                    required
                    name="password"
                    className="form-control form-control-modern"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Confirmar Contraseña *</label>
                  <input
                    type="password"
                    required
                    name="confirmPassword"
                    className="form-control form-control-modern"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button type="submit" className="btn-modern-primary w-100 py-2">
                Crear Mi Cuenta de Comprador
              </button>
            </form>

            <div className="text-center mt-4">
              <span className="small text-muted">¿Ya tienes cuenta? </span>
              <Link to="/login" className="small fw-bold text-info text-decoration-none">
                Inicia sesión aquí
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
