// ========================================================
// PÁGINA: PANELORGANIZADORPAGE (DASHBOARD ANALYTICS 2026)
// Métricas en tiempo real con KPIs y tabla de gestión moderna
// ========================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerEventos, obtenerCompras, eliminarEvento } from '../services/storage';
import { useAuth } from '../context/AuthContext';

export default function PanelOrganizadorPage() {
  const { usuario } = useAuth();
  const [eventos, setEventos] = useState([]);
  const [metricas, setMetricas] = useState({
    totalEventos: 0,
    totalTicketsVendidos: 0,
    totalRecaudacion: 0
  });

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

  return (
    <div className="container py-4">
      {/* Cabecera del Panel */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 gap-3">
        <div>
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2"
               style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <i className="bi bi-speedometer2 text-warning"></i>
            <span className="small fw-bold text-warning text-uppercase" style={{ letterSpacing: '0.5px' }}>
              Centro de Control
            </span>
          </div>
          <h2 className="fw-extrabold text-white mb-1">Panel del Organizador</h2>
          <p className="text-muted small mb-0">
            Monitoreo en vivo de ventas, ingresos y administración de eventos
          </p>
        </div>
        <Link to="/evento/crear" className="btn-modern-primary text-decoration-none">
          <i className="bi bi-plus-circle"></i> Publicar Nuevo Evento
        </Link>
      </div>

      {/* Tarjetas KPI de Métricas */}
      <div className="row g-3 mb-5">
        <div className="col-md-4">
          <div className="kpi-card">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-dim small fw-semibold text-uppercase" style={{ fontSize: '0.75rem' }}>EVENTOS ACTIVOS</span>
                <h2 className="fw-extrabold text-white mb-1 mt-2">{metricas.totalEventos}</h2>
                <span className="small text-muted">Publicados en cartelera</span>
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
                  <i className="bi bi-arrow-up-short"></i> En aumento continuo
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
                  ${metricas.totalRecaudacion.toLocaleString('es-ES')}
                </h2>
                <span className="small text-muted">Ingresos brutos acumulados</span>
              </div>
              <div className="kpi-icon-badge" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8' }}>
                <i className="bi bi-currency-dollar"></i>
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
            {eventos.length} Registros
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th className="ps-4 py-3">Evento</th>
                <th className="py-3">Fecha y Hora</th>
                <th className="py-3">Lugar</th>
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
