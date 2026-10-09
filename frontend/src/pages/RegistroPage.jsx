// ========================================================
// PÁGINA: REGISTROPAGE (DISEÑO MODERNO 2026)
// Registro de nuevos usuarios con selector de rol interactivo
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
    rol: 'comprador',
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
        rol: formData.rol,
        password: formData.password
      });

      alert(`¡Bienvenido a TicketEventos, ${nuevo.nombre || nuevo.username}! Tu cuenta ha sido creada.`);
      if (nuevo.rol === 'organizador') {
        navigate('/organizador/panel');
      } else {
        navigate('/');
      }
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
              <h3 className="fw-extrabold text-white mb-1">Crear Cuenta</h3>
              <p className="text-muted small">Únete a la plataforma oficial de eventos</p>
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
                  <label className="form-label small fw-semibold text-muted">Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    className="form-control form-control-modern"
                    placeholder="+56 9 1234 5678"
                    value={formData.telefono}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Selector de Rol Moderno */}
              <div className="mb-4">
                <label className="form-label small fw-semibold text-muted mb-2">Selecciona tu perfil de cuenta: *</label>
                <div className="row g-2">
                  <div className="col-6">
                    <div
                      onClick={() => setFormData(prev => ({ ...prev, rol: 'comprador' }))}
                      className="p-3 rounded-4 border text-center transition-all cursor-pointer"
                      style={{
                        cursor: 'pointer',
                        background: formData.rol === 'comprador' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        borderColor: formData.rol === 'comprador' ? '#6366f1' : 'rgba(255, 255, 255, 0.08)'
                      }}
                    >
                      <i className="bi bi-ticket-perforated fs-4" style={{ color: '#818cf8' }}></i>
                      <div className="fw-bold text-white mt-1 small">Comprador</div>
                      <small className="text-dim d-block" style={{ fontSize: '0.7rem' }}>Asistir a eventos</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div
                      onClick={() => setFormData(prev => ({ ...prev, rol: 'organizador' }))}
                      className="p-3 rounded-4 border text-center transition-all cursor-pointer"
                      style={{
                        cursor: 'pointer',
                        background: formData.rol === 'organizador' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        borderColor: formData.rol === 'organizador' ? '#f59e0b' : 'rgba(255, 255, 255, 0.08)'
                      }}
                    >
                      <i className="bi bi-briefcase fs-4 text-warning"></i>
                      <div className="fw-bold text-white mt-1 small">Organizador</div>
                      <small className="text-dim d-block" style={{ fontSize: '0.7rem' }}>Publicar eventos</small>
                    </div>
                  </div>
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
                Crear Mi Cuenta
              </button>
            </form>

            <div className="text-center mt-4">
              <span className="small text-muted">¿Ya estás registrado? </span>
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
