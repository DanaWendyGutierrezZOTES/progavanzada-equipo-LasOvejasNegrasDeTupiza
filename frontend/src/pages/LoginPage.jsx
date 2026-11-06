// ========================================================
// PÁGINA: LOGINPAGE (Inicio de Sesión y Demo 2026)
// Autenticación rápida para evaluación de proyectos y defensa
// ========================================================

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import AlertBanner from '../components/common/AlertBanner';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { notifySuccess } = useToast();
  const navigate = useNavigate();

  // Función unificada de inicio de sesión y redirección inteligente
  const ejecutarLogin = async (user, pass) => {
    setError('');
    try {
      const u = await login(user, pass);
      notifySuccess(`¡Bienvenido de vuelta, ${u.nombre || u.username}! Sesión iniciada como ${u.rol.toUpperCase()}.`);
      navigate(u.rol === 'organizador' || u.rol === 'admin' ? '/organizador/panel' : '/');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    ejecutarLogin(username, password);
  };

  const autoCompletar = (user, pass) => {
    setUsername(user);
    setPassword(pass);
    ejecutarLogin(user, pass);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="glass-panel p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow-lg"
                   style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.25) 100%)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.35)' }}>
                <i className="bi bi-person-fill fs-3"></i>
              </div>
              <h3 className="fw-extrabold text-white mb-1">Iniciar Sesión</h3>
              <p className="text-muted small">Ingresa tus credenciales para acceder a la boletería digital</p>
            </div>

            <AlertBanner type="danger" message={error} onDismiss={() => setError('')} />

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Nombre de Usuario *</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary border-opacity-25 text-muted">
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    type="text"
                    required
                    className="form-control form-control-modern"
                    placeholder="admin, organizador o comprador"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-muted">Contraseña *</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary border-opacity-25 text-muted">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type="password"
                    required
                    className="form-control form-control-modern"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn-modern-primary w-100 py-2 fs-6">
                <i className="bi bi-box-arrow-in-right me-1"></i> Iniciar Sesión
              </button>
            </form>

            <div className="text-center mt-3">
              <span className="small text-muted">¿No tienes cuenta? </span>
              <Link to="/registro" className="small text-info text-decoration-none fw-semibold">
                Regístrate como comprador
              </Link>
            </div>

            {/* Accesos rápidos para defensa y evaluación docente */}
            <div className="mt-4 pt-4 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <span className="small text-dim d-block text-center mb-3 fw-semibold">
                Acceso con 1 Clic para la Evaluación Docente:
              </span>
              <div className="d-grid gap-2">
                <button
                  type="button"
                  onClick={() => autoCompletar('admin', '123')}
                  className="btn btn-modern-outline btn-sm py-2 text-danger d-flex align-items-center justify-content-center gap-2"
                >
                  <i className="bi bi-shield-lock-fill"></i>
                  <span>Entrar como <strong>Administrador</strong></span>
                </button>

                <button
                  type="button"
                  onClick={() => autoCompletar('organizador', '123')}
                  className="btn btn-modern-outline btn-sm py-2 text-warning d-flex align-items-center justify-content-center gap-2"
                >
                  <i className="bi bi-building"></i>
                  <span>Entrar como <strong>Organizador</strong></span>
                </button>

                <button
                  type="button"
                  onClick={() => autoCompletar('comprador', '123')}
                  className="btn btn-modern-outline btn-sm py-2 text-info d-flex align-items-center justify-content-center gap-2"
                >
                  <i className="bi bi-person-check"></i>
                  <span>Entrar como <strong>Comprador</strong></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
