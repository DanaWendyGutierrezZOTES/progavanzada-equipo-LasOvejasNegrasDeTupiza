// ========================================================
// PÁGINA: PANELORGANIZADORPAGE (DASHBOARD ANALYTICS 2026)
// Métricas en tiempo real con KPIs en Bs y Registro de Organizadores por el Admin
// ========================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerEventos, obtenerCompras, eliminarEvento, obtenerUsuarios, registrarUsuario } from '../services/storage';
import { useAuth } from '../context/AuthContext';

export default function PanelOrganizadorPage() {
  const { usuario, esAdmin } = useAuth();
  const [eventos, setEventos] = useState([]);
  const [metricas, setMetricas] = useState({
    totalEventos: 0,
    totalTicketsVendidos: 0,
    totalRecaudacion: 0
  });

  // Estado para el modal/formulario de creación de nuevo Organizador (solo Admin)
  const [mostrarModalOrganizador, setMostrarModalOrganizador] = useState(false);
  const [nuevoOrg, setNuevoOrg] = useState({
    username: '',
    nombre: '',
    email: '',
    telefono: '',
    password: '123'
  });
  const [mensajeOrg, setMensajeOrg] = useState({ tipo: '', texto: '' });

  const cargarDatos = () => {
    const todosLosEventos = obtenerEventos();
    const todasLasCompras = obtenerCompras();

    const eventosOrganizador = usuario
      ? todosLosEventos.filter(e => Number(e.organizador_id) === Number(usuario.id) || usuario.rol === 'admin')
      : todosLosEventos;

    let totalVendidos = 0;
    let totalIngresos = 0;

    eventosOrganizador.forEach(ev => {
      const comprasDelEvento = todasLasCompras.filter(c => Number(c.evento_id) === Number(ev.id));
      comprasDelEvento.forEach(c => {
        totalVendidos += Number(c.cantidad) || 0;
        totalIngresos += Number(c.total) || 0;
      });
    });

    setEventos(eventosOrganizador);
    setMetricas({
      totalEventos: eventosOrganizador.length,
      totalTicketsVendidos: totalVendidos,
      totalRecaudacion: totalIngresos
    });
  };

  useEffect(() => {
    cargarDatos();
  }, [usuario]);

  const handleEliminar = (id, nombre) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el evento "${nombre}"?`)) {
      eliminarEvento(id);
      cargarDatos();
    }
  };

  const handleCrearOrganizador = (e) => {
    e.preventDefault();
    setMensajeOrg({ tipo: '', texto: '' });

    if (!nuevoOrg.username.trim() || !nuevoOrg.nombre.trim() || !nuevoOrg.email.trim()) {
      setMensajeOrg({ tipo: 'danger', texto: 'Por favor completa todos los datos obligatorios.' });
      return;
    }

    try {
      registrarUsuario({
        ...nuevoOrg,
        rol: 'organizador'
      });
      setMensajeOrg({ tipo: 'success', texto: `¡Organizador "${nuevoOrg.nombre}" registrado exitosamente!` });
      setNuevoOrg({ username: '', nombre: '', email: '', telefono: '', password: '123' });
      setTimeout(() => setMostrarModalOrganizador(false), 1800);
    } catch (err) {
      setMensajeOrg({ tipo: 'danger', texto: err.message || 'Error al crear organizador' });
    }
  };

  return (
    <div className="container py-4">
      {/* Cabecera del Panel */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 gap-3">
        <div>
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2"
               style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <i className="bi bi-speedometer2 text-warning"></i>
            <span className="small fw-bold text-warning text-uppercase" style={{ letterSpacing: '0.5px' }}>
              Centro de Control {esAdmin ? '(Modo Administrador)' : ''}
            </span>
          </div>
          <h2 className="fw-extrabold text-white mb-1">Panel de Control</h2>
          <p className="text-muted small mb-0">
            Monitoreo en vivo de ventas, ingresos en Bolivianos (Bs) y administración
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          {/* Botón exclusivo para Administrador */}
          {(esAdmin || usuario?.username === 'admin') && (
            <button
              onClick={() => setMostrarModalOrganizador(!mostrarModalOrganizador)}
              className="btn btn-modern-outline"
            >
              <i className="bi bi-person-plus text-warning"></i> Registrar Organizador
            </button>
          )}

          <Link to="/evento/crear" className="btn-modern-primary text-decoration-none">
            <i className="bi bi-plus-circle"></i> Publicar Nuevo Evento
          </Link>
        </div>
      </div>

      {/* MODAL / FORMULARIO PARA REGISTRAR ORGANIZADOR (Solo Admin) */}
      {mostrarModalOrganizador && (
        <div className="glass-panel p-4 mb-5 border-warning animate-fadeIn" style={{ background: 'rgba(245, 158, 11, 0.05)', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold text-warning mb-0 d-flex align-items-center gap-2">
              <i className="bi bi-shield-lock-fill"></i> Registrar Nuevo Organizador (Función Exclusiva de Admin)
            </h5>
            <button onClick={() => setMostrarModalOrganizador(false)} className="btn btn-sm btn-modern-outline py-0 px-2">
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          <p className="text-muted small mb-3">
            Como Administrador, tienes el permiso exclusivo para otorgar credenciales de Organizador.
          </p>

          {mensajeOrg.texto && (
            <div className={`alert alert-${mensajeOrg.tipo} py-2 mb-3 small`} role="alert">
              {mensajeOrg.texto}
            </div>
          )}

          <form onSubmit={handleCrearOrganizador} className="row g-3">
            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted">Usuario *</label>
              <input
                type="text"
                required
                className="form-control form-control-modern"
                placeholder="ej: carlos_eventos"
                value={nuevoOrg.username}
                onChange={(e) => setNuevoOrg({ ...nuevoOrg, username: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted">Nombre Completo *</label>
              <input
                type="text"
                required
                className="form-control form-control-modern"
                placeholder="ej: Carlos Mendoza"
                value={nuevoOrg.nombre}
                onChange={(e) => setNuevoOrg({ ...nuevoOrg, nombre: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted">Correo Electrónico *</label>
              <input
                type="email"
                required
                className="form-control form-control-modern"
                placeholder="organizador@mail.com"
                value={nuevoOrg.email}
                onChange={(e) => setNuevoOrg({ ...nuevoOrg, email: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted">Teléfono</label>
              <input
                type="text"
                className="form-control form-control-modern"
                placeholder="+591 71234567"
                value={nuevoOrg.telefono}
                onChange={(e) => setNuevoOrg({ ...nuevoOrg, telefono: e.target.value })}
              />
            </div>
            <div className="col-12 d-flex justify-content-end gap-2 mt-3">
              <button type="button" onClick={() => setMostrarModalOrganizador(false)} className="btn btn-modern-outline btn-sm">
                Cancelar
              </button>
              <button type="submit" className="btn-modern-primary btn-sm" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                <i className="bi bi-check2-circle"></i> Guardar Cuenta de Organizador
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tarjetas KPI de Métricas en Bolivianos */}
      <div className="row g-3 mb-5">
        <div className="col-md-4">
          <div className="kpi-card">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-dim small fw-semibold text-uppercase" style={{ fontSize: '0.75rem' }}>EVENTOS PUBLICADOS</span>
                <h2 className="fw-extrabold text-white mb-1 mt-2">{metricas.totalEventos}</h2>
                <span className="small text-muted">Cartelera en vivo</span>
              </div>
              <div className="kpi-icon-badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                <i className="bi bi-calendar2-event"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="kpi-card">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-dim small fw-semibold text-uppercase" style={{ fontSize: '0.75rem' }}>ENTRADAS VENDIDAS</span>
                <h2 className="fw-extrabold text-white mb-1 mt-2">{metricas.totalTicketsVendidos}</h2>
                <span className="small text-emerald">
                  <i className="bi bi-arrow-up-short"></i> Actualización en tiempo real
                </span>
              </div>
              <div className="kpi-icon-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                <i className="bi bi-ticket-perforated"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="kpi-card">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-dim small fw-semibold text-uppercase" style={{ fontSize: '0.75rem' }}>RECAUDACIÓN TOTAL</span>
                <h2 className="fw-extrabold mb-1 mt-2" style={{ color: '#38bdf8' }}>
                  Bs. {metricas.totalRecaudacion.toLocaleString('es-ES')}
                </h2>
                <span className="small text-muted">Total acumulado en Bolivianos</span>
              </div>
              <div className="kpi-icon-badge" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8' }}>
                <i className="bi bi-cash-stack"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Eventos Gestionados */}
      <div className="glass-panel overflow-hidden">
        <div className="p-4 border-bottom d-flex justify-content-between align-items-center" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
          <h5 className="fw-bold text-white mb-0">Listado de Eventos</h5>
          <span className="badge rounded-pill bg-white bg-opacity-10 text-muted px-3 py-1">
            {eventos.length} Eventos Activos
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th className="ps-4 py-3">Evento</th>
                <th className="py-3">Fecha y Hora</th>
                <th className="py-3">Lugar / Recinto</th>
                <th className="py-3">Stock Disponible</th>
                <th className="text-end pe-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {eventos.length > 0 ? (
                eventos.map((ev) => {
                  const disponibles = ev.tipos_ticket?.reduce(
                    (total, t) => total + (Number(t.cantidad_disponible) || 0),
                    0
                  ) || 0;

                  return (
                    <tr key={ev.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td className="ps-4 py-3">
                        <div className="fw-bold text-white">{ev.nombre}</div>
                        <small className="text-dim">{ev.tipos_ticket?.length || 0} categorías de tickets</small>
                      </td>
                      <td className="py-3">
                        <div className="small fw-semibold text-light">{ev.fecha}</div>
                        <div className="small text-dim">{ev.hora} hrs</div>
                      </td>
                      <td className="small text-muted py-3">{ev.lugar}</td>
                      <td className="py-3">
                        <span className={`badge rounded-pill px-3 py-1 small ${disponibles > 0 ? 'bg-success bg-opacity-20 text-emerald border border-emerald-500/30' : 'bg-danger bg-opacity-20 text-danger'}`}>
                          {disponibles} restantes
                        </span>
                      </td>
                      <td className="text-end pe-4 py-3">
                        <div className="d-inline-flex gap-2">
                          <Link to={`/evento/${ev.id}`} className="btn btn-modern-outline btn-sm py-1 px-2" title="Ver detalle">
                            <i className="bi bi-eye"></i>
                          </Link>
                          <Link to={`/evento/${ev.id}/editar`} className="btn btn-modern-outline btn-sm py-1 px-2 text-primary" title="Editar">
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <Link to={`/evento/${ev.id}/tickets`} className="btn btn-modern-outline btn-sm py-1 px-2 text-info" title="Gestionar Tickets">
                            <i className="bi bi-ticket-detailed"></i>
                          </Link>
                          <button
                            onClick={() => handleEliminar(ev.id, ev.nombre)}
                            className="btn btn-modern-outline btn-sm py-1 px-2 text-danger"
                            title="Eliminar"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    No tienes eventos creados todavía. Haz clic en "Publicar Nuevo Evento" para comenzar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
