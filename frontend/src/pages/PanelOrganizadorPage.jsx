// ========================================================
// PÁGINA: PANELORGANIZADORPAGE (Dashboard de Gestión 2026)
// Métricas en tiempo real con KPIs en Bs, ConfirmModal y creación de Organizadores
// ========================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerEventos, obtenerCompras, eliminarEvento, registrarUsuario } from '../services/storage';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StatCard from '../components/common/StatCard';
import Modal from '../components/common/Modal';
import ConfirmModal from '../components/common/ConfirmModal';
import PageHeader from '../components/common/PageHeader';
import AlertBanner from '../components/common/AlertBanner';
import { formatBs } from '../utils/formatters';

export default function PanelOrganizadorPage() {
  const { usuario, esAdmin } = useAuth();
  const { notifySuccess, notifyError } = useToast();

  const [eventos, setEventos] = useState([]);
  const [metricas, setMetricas] = useState({
    totalEventos: 0,
    totalTicketsVendidos: 0,
    totalRecaudacion: 0
  });

  // Modal para crear nuevo organizador (solo admin)
  const [mostrarModalOrganizador, setMostrarModalOrganizador] = useState(false);
  const [nuevoOrg, setNuevoOrg] = useState({
    username: '',
    nombre: '',
    email: '',
    telefono: '',
    password: '123'
  });
  const [errorOrg, setErrorOrg] = useState('');

  // Modal de confirmación para eliminar evento
  const [eventoAEliminar, setEventoAEliminar] = useState(null);

  const cargarDatos = () => {
    const todosLosEventos = obtenerEventos();
    const todasLasCompras = obtenerCompras();

    const eventosOrganizador = usuario
      ? todosLosEventos.filter(e => Number(e.organizador_id) === Number(usuario.id) || usuario.rol === 'admin')
      : todosLosEventos;

    const idsEventos = new Set(eventosOrganizador.map(e => Number(e.id)));
    const { totalVendidos, totalIngresos } = todasLasCompras.reduce((acc, c) => {
      if (idsEventos.has(Number(c.evento_id))) {
        acc.totalVendidos += Number(c.cantidad) || 0;
        acc.totalIngresos += Number(c.total) || 0;
      }
      return acc;
    }, { totalVendidos: 0, totalIngresos: 0 });

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

  const handleEliminarConfirmado = async () => {
    if (!eventoAEliminar) return;
    await eliminarEvento(eventoAEliminar.id);
    notifySuccess(`El evento "${eventoAEliminar.nombre}" ha sido eliminado.`);
    setEventoAEliminar(null);
    cargarDatos();
  };

  const handleCrearOrganizador = async (e) => {
    e.preventDefault();
    setErrorOrg('');

    if (!nuevoOrg.username.trim() || !nuevoOrg.nombre.trim() || !nuevoOrg.email.trim()) {
      setErrorOrg('Por favor completa todos los datos obligatorios.');
      return;
    }

    try {
      await registrarUsuario({
        ...nuevoOrg,
        rol: 'organizador'
      });
      notifySuccess(`¡Organizador "${nuevoOrg.nombre}" registrado exitosamente!`);
      setNuevoOrg({ username: '', nombre: '', email: '', telefono: '', password: '123' });
      setMostrarModalOrganizador(false);
    } catch (err) {
      setErrorOrg(err.message || 'Error al crear organizador');
      notifyError('No se pudo crear la cuenta de organizador.');
    }
  };

  return (
    <div className="container py-4">
      {/* Cabecera del Panel con Componente Modular */}
      <PageHeader
        title="Panel de Control y Métricas"
        subtitle="Monitoreo en vivo de ventas de entradas, recaudación en Bolivianos (Bs) y gestión de eventos"
        badgeText={`Centro de Control ${esAdmin ? '(Modo Administrador)' : '(Organizador)'}`}
        badgeVariant="warning"
        badgeIcon="bi-speedometer2"
        actions={
          <div className="d-flex flex-wrap gap-2">
            {(esAdmin || usuario?.username === 'admin') && (
              <button
                onClick={() => setMostrarModalOrganizador(true)}
                className="btn btn-modern-outline"
              >
                <i className="bi bi-person-plus text-warning me-1"></i> Registrar Organizador
              </button>
            )}

            <Link to="/evento/crear" className="btn-modern-primary text-decoration-none">
              <i className="bi bi-plus-circle me-1"></i> Publicar Concierto
            </Link>
          </div>
        }
      />

      {/* Tarjetas KPI de Métricas en Bolivianos usando StatCard */}
      <div className="row g-3 mb-5">
        <div className="col-md-4">
          <StatCard
            label="EVENTOS PUBLICADOS"
            value={metricas.totalEventos}
            subtext="Cartelera oficial activa en Bolivia"
            icon="bi-calendar2-event-fill"
            variant="primary"
          />
        </div>

        <div className="col-md-4">
          <StatCard
            label="ENTRADAS VENDIDAS"
            value={metricas.totalTicketsVendidos}
            subtext="Actualización reactiva en tiempo real"
            icon="bi-ticket-perforated-fill"
            variant="emerald"
            trend="up"
          />
        </div>

        <div className="col-md-4">
          <StatCard
            label="RECAUDACIÓN TOTAL"
            value={formatBs(metricas.totalRecaudacion)}
            subtext="Total acumulado en Bolivianos (Bs)"
            icon="bi-cash-stack"
            variant="info"
          />
        </div>
      </div>

      {/* Tabla de Eventos Gestionados */}
      <div className="glass-panel overflow-hidden">
        <div className="p-4 border-bottom d-flex justify-content-between align-items-center" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
          <div>
            <h5 className="fw-bold text-white mb-0">Listado de Eventos Gestionados</h5>
            <small className="text-muted">Administra entradas, precios y detalles de cada concierto</small>
          </div>
          <span className="badge rounded-pill bg-white bg-opacity-10 text-info px-3 py-1">
            {eventos.length} Eventos Activos
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th className="ps-4 py-3">Concierto</th>
                <th className="py-3">Fecha y Hora</th>
                <th className="py-3">Recinto / Ciudad</th>
                <th className="py-3">Stock Restante</th>
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
                        <small className="text-dim">{ev.tipos_ticket?.length || 0} sectores de tickets configurados</small>
                      </td>
                      <td className="py-3">
                        <div className="small fw-semibold text-light">{ev.fecha}</div>
                        <div className="small text-dim">{ev.hora} hrs</div>
                      </td>
                      <td className="small text-muted py-3">
                        <div>{ev.estadio_nombre || ev.lugar}</div>
                        {ev.ciudad && <span className="badge bg-dark border border-secondary text-info mt-1" style={{ fontSize: '0.65rem' }}>{ev.ciudad}</span>}
                      </td>
                      <td className="py-3">
                        <span className={`badge rounded-pill px-3 py-1 small ${disponibles > 0 ? 'bg-success bg-opacity-20 text-emerald border border-emerald-500/30' : 'bg-danger bg-opacity-20 text-danger'}`}>
                          {disponibles.toLocaleString()} disponibles
                        </span>
                      </td>
                      <td className="text-end pe-4 py-3">
                        <div className="d-inline-flex gap-2">
                          <Link to={`/evento/${ev.id}`} className="btn btn-modern-outline btn-sm py-1 px-2" title="Ver en cartelera">
                            <i className="bi bi-eye"></i>
                          </Link>
                          <Link to={`/evento/${ev.id}/editar`} className="btn btn-modern-outline btn-sm py-1 px-2 text-primary" title="Editar">
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <Link to={`/evento/${ev.id}/tickets`} className="btn btn-modern-outline btn-sm py-1 px-2 text-info" title="Gestionar Tipos de Entrada">
                            <i className="bi bi-ticket-detailed"></i>
                          </Link>
                          <button
                            onClick={() => setEventoAEliminar(ev)}
                            className="btn btn-modern-outline btn-sm py-1 px-2 text-danger"
                            title="Eliminar Concierto"
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
                    No tienes eventos creados todavía. Haz clic en "Publicar Concierto" para comenzar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para Registrar Organizador (Solo Admin) con Componente Nativo */}
      <Modal
        isOpen={mostrarModalOrganizador}
        onClose={() => setMostrarModalOrganizador(false)}
        title="Registrar Nuevo Organizador (Función Admin)"
        icon="bi-shield-lock-fill text-warning"
        maxWidth="600px"
        headerVariant="warning"
      >
        <p className="text-muted small mb-3">
          Como Administrador de la ticketera, tienes el privilegio de otorgar credenciales a promotores y organizadores de eventos en Bolivia.
        </p>

        <AlertBanner type="danger" message={errorOrg} onDismiss={() => setErrorOrg('')} />

        <form onSubmit={handleCrearOrganizador}>
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">Nombre de Usuario *</label>
              <input
                type="text"
                required
                className="form-control form-control-modern"
                placeholder="ej: tupiza_shows"
                value={nuevoOrg.username}
                onChange={(e) => setNuevoOrg({ ...nuevoOrg, username: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">Nombre Completo / Empresa *</label>
              <input
                type="text"
                required
                className="form-control form-control-modern"
                placeholder="ej: Producciones Tupiza Sur"
                value={nuevoOrg.nombre}
                onChange={(e) => setNuevoOrg({ ...nuevoOrg, nombre: e.target.value })}
              />
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">Correo Electrónico *</label>
              <input
                type="email"
                required
                className="form-control form-control-modern"
                placeholder="contacto@productora.bo"
                value={nuevoOrg.email}
                onChange={(e) => setNuevoOrg({ ...nuevoOrg, email: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">Teléfono / WhatsApp</label>
              <input
                type="text"
                className="form-control form-control-modern"
                placeholder="+591 71234567"
                value={nuevoOrg.telefono}
                onChange={(e) => setNuevoOrg({ ...nuevoOrg, telefono: e.target.value })}
              />
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 pt-3 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
            <button type="button" onClick={() => setMostrarModalOrganizador(false)} className="btn btn-modern-outline btn-sm">
              Cancelar
            </button>
            <button type="submit" className="btn-modern-primary btn-sm" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
              <i className="bi bi-check2-circle me-1"></i> Guardar Cuenta de Organizador
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de confirmación para eliminar evento */}
      <ConfirmModal
        isOpen={Boolean(eventoAEliminar)}
        onClose={() => setEventoAEliminar(null)}
        onConfirm={handleEliminarConfirmado}
        title="¿Eliminar este concierto?"
        message={`¿Estás seguro de que deseas eliminar permanentemente el concierto "${eventoAEliminar?.nombre}"?`}
        confirmText="Eliminar Concierto"
      />
    </div>
  );
}
