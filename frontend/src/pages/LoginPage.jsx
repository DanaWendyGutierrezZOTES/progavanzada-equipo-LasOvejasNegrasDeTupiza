// ========================================================
// PÁGINA: LOGINPAGE (DISEÑO MODERNO 2026)
// Inicio de sesión con autenticación rápida para defensa y pruebas
// ========================================================

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    try {
      const u = login(username, password);
      if (u.rol === 'organizador' || u.rol === 'admin') {
        navigate('/organizador/panel');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    }
  };

  const autoCompletar = (user, pass) => {
    setUsername(user);
    setPassword(pass);
    try {
      const u = login(user, pass);
      if (u.rol === 'organizador' || u.rol === 'admin') {
        navigate('/organizador/panel');
      } else {
        navigate('/');
      }
    } catch {}
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="glass-panel p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                   style={{ width: '56px', height: '56px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                <i className="bi bi-person-fill fs-3"></i>
              </div>
              <h3 className="fw-extrabold text-white mb-1">Iniciar Sesión</h3>
              <p className="text-muted small">Ingresa tus credenciales para acceder a la plataforma</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3" role="alert">
                <i className="bi bi-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Usuario</label>
                <input
                  type="text"
                  required
                  className="form-control form-control-modern"
                  placeholder="admin, organizador o comprador"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-muted">Contraseña</label>
                <input
                  type="password"
                  required
                  className="form-control form-control-modern"
                  placeholder="123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-modern-primary w-100 py-2">
                <i className="bi bi-box-arrow-in-right me-1"></i> Iniciar Sesión
              </button>
            </form>

            {/* Accesos rápidos para defensa y pruebas */}
            <div className="mt-4 pt-4 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <span className="small text-dim d-block text-center mb-3 fw-semibold">
                Acceso con 1 Clic para la Evaluación:
              </span>
              <div className="d-grid gap-2">
                <button
                  type="button"
                  onClick={() => autoCompletar('admin', '123')}
                  className="btn btn-modern-outline btn-sm py-2 text-danger d-flex align-items-center justify-content-center gap-2"
                >
                  <i className="bi bi-shield-lock-fill"></i> Iniciar como Administrador (Admin)
                </button>
                <button
                  type="button"
                  onClick={() => autoCompletar('organizador', '123')}
                  className="btn btn-modern-outline btn-sm py-2 text-warning d-flex align-items-center justify-content-center gap-2"
                >
                  <i className="bi bi-briefcase-fill"></i> Iniciar como Organizador (Carlos)
                </button>
                <button
                  type="button"
                  onClick={() => autoCompletar('comprador', '123')}
                  className="btn btn-modern-outline btn-sm py-2 text-info d-flex align-items-center justify-content-center gap-2"
                >
                  <i className="bi bi-person-fill"></i> Iniciar como Comprador (Valeria)
                </button>
              </div>
            </div>

            <div className="text-center mt-4">
              <span className="small text-muted">¿Aún no tienes cuenta? </span>
              <Link to="/registro" className="small fw-bold text-info text-decoration-none">
                Crear cuenta
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
