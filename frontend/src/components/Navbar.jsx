// ========================================================
// COMPONENTE: NAVBAR (DISEÑO MODERNO 2026)
// Barra de navegación flotante con efecto cristal (Glassmorphism),
// selector rápido de rol para presentaciones y diseño responsive
// ========================================================

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { usuario, logout, esOrganizador, cambiarUsuarioRapido } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-modern py-3 sticky-top d-print-none">
      <div className="container">
        {/* Logo Moderno con Degradado e Icono Neón */}
        <Link className="navbar-brand-modern d-flex align-items-center gap-2 text-decoration-none" to="/">
          <span className="p-2 rounded-3 d-inline-flex align-items-center justify-content-center"
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)' }}>
            <i className="bi bi-ticket-perforated-fill text-white fs-5"></i>
          </span>
          <span>Ticket<span style={{ color: '#38bdf8' }}>Eventos</span></span>
        </Link>

        {/* Botón responsive para móviles */}
        <button
          className="navbar-toggler border-0 shadow-none text-white-50"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <i className="bi bi-list fs-2"></i>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Enlaces de Navegación con Pills */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-lg-1">
            <li className="nav-item">
              <Link
                className={`nav-link px-3 py-2 rounded-pill fw-semibold ${isActive('/') ? 'text-white bg-white bg-opacity-10' : 'text-light text-opacity-75'}`}
                to="/"
              >
                <i className="bi bi-compass me-1 text-info"></i> Explorar
              </Link>
            </li>

            {/* Enlace solo para usuarios logueados */}
            {usuario && (
              <li className="nav-item">
                <Link
                  className={`nav-link px-3 py-2 rounded-pill fw-semibold ${isActive('/mis-tickets') ? 'text-white bg-white bg-opacity-10' : 'text-light text-opacity-75'}`}
                  to="/mis-tickets"
                >
                  <i className="bi bi-ticket-detailed me-1 text-primary"></i> Mis Tickets
                </Link>
              </li>
            )}

            {/* Enlace para organizadores con acento de color */}
            {esOrganizador && (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link px-3 py-2 rounded-pill fw-semibold ${isActive('/organizador/panel') ? 'text-warning bg-warning bg-opacity-10' : 'text-warning text-opacity-80'}`}
                    to="/organizador/panel"
                  >
                    <i className="bi bi-speedometer2 me-1"></i> Panel Organizador
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link px-3 py-2 rounded-pill fw-semibold ${isActive('/evento/crear') ? 'text-info bg-info bg-opacity-10' : 'text-info text-opacity-80'}`}
                    to="/evento/crear"
                  >
                    <i className="bi bi-plus-circle me-1"></i> Publicar Evento
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Selector Rápido de Demo (ideal para defensa y presentación) */}
          <div className="d-flex align-items-center gap-1 p-1 rounded-pill my-2 my-lg-0 me-lg-3"
               style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span className="small text-muted px-2 d-none d-xl-inline">Rol:</span>
            <button
              onClick={() => cambiarUsuarioRapido('admin')}
              className={`btn btn-sm rounded-pill px-2 py-1 fw-semibold ${usuario?.username === 'admin' ? 'btn-modern-primary text-white' : 'btn-link text-muted text-decoration-none'}`}
              title="Cambiar a rol Administrador"
            >
              Admin
            </button>
            <button
              onClick={() => cambiarUsuarioRapido('organizador')}
              className={`btn btn-sm rounded-pill px-2 py-1 fw-semibold ${usuario?.username === 'organizador' ? 'btn-modern-primary text-white' : 'btn-link text-muted text-decoration-none'}`}
              title="Cambiar a rol Organizador"
            >
              Organizador
            </button>
            <button
              onClick={() => cambiarUsuarioRapido('comprador')}
              className={`btn btn-sm rounded-pill px-2 py-1 fw-semibold ${usuario?.username === 'comprador' ? 'btn-modern-primary text-white' : 'btn-link text-muted text-decoration-none'}`}
              title="Cambiar a rol Comprador"
            >
              Comprador
            </button>
          </div>

          {/* Menú de Sesión y Perfil */}
          <div className="d-flex align-items-center gap-3">
            {usuario ? (
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center gap-2">
                  <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                       style={{
                         width: '38px',
                         height: '38px',
                         background: usuario.rol === 'admin'
                           ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                           : (esOrganizador ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #6366f1, #3b82f6)')
                       }}>
                    {usuario.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-start d-none d-sm-block">
                    <div className="fw-bold small text-white line-clamp-1">{usuario.nombre || usuario.username}</div>
                    <span className={`badge rounded-pill ${usuario.rol === 'admin' ? 'bg-danger text-white' : (esOrganizador ? 'bg-warning text-dark' : 'bg-primary')}`} style={{ fontSize: '0.65rem' }}>
                      {usuario.rol.toUpperCase()}
                    </span>
                  </div>
                </div>
                <button onClick={handleLogout} className="btn btn-modern-outline btn-sm py-1 px-3" title="Cerrar sesión">
                  <i className="bi bi-box-arrow-right"></i>
                </button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-modern-outline btn-sm">
                  Entrar
                </Link>
                <Link to="/registro" className="btn btn-modern-primary btn-sm">
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
