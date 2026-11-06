// ========================================================
// PÁGINA: GESTIONARTICKETSPAGE (Gestión de Tipos de Entrada)
// Configuración de inventario de entradas con precios en Bs,
// plantillas predeterminadas por tipo de recinto y ConfirmModal.
// ========================================================

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { obtenerEventoPorId, agregarTipoTicket, eliminarTipoTicket } from '../services/storage';
import { useToast } from '../context/ToastContext';
import { obtenerSectoresPorTipo } from '../data/estadios';
import EmptyState from '../components/common/EmptyState';
import ConfirmModal from '../components/common/ConfirmModal';
import PageHeader from '../components/common/PageHeader';
import AlertBanner from '../components/common/AlertBanner';
import { formatBs } from '../utils/formatters';

export default function GestionarTicketsPage() {
  const { id } = useParams();
  const { notifySuccess, notifyInfo, notifyError } = useToast();

  const [evento, setEvento] = useState(null);
  const [nombreTicket, setNombreTicket] = useState('');
  const [precioTicket, setPrecioTicket] = useState('');
  const [cupoTicket, setCupoTicket] = useState('');
  const [errorForm, setErrorForm] = useState('');
  const [ticketAEliminar, setTicketAEliminar] = useState(null);

  const cargarEvento = () => {
    const data = obtenerEventoPorId(id);
    setEvento(data);
  };

  useEffect(() => {
    cargarEvento();
  }, [id]);

  if (!evento) {
    return (
      <div className="container py-5 text-center">
        <EmptyState
          icon="bi-calendar-x"
          title="Evento no encontrado"
          description="No se pudo cargar la información del evento para configurar sus entradas."
          actionText="Volver al panel"
          actionTo="/organizador/panel"
        />
      </div>
    );
  }

  const handleAgregarTicket = async (e) => {
    e.preventDefault();
    setErrorForm('');

    if (!nombreTicket.trim() || !precioTicket || !cupoTicket) {
      setErrorForm('Por favor completa todos los campos requeridos.');
      return;
    }

    try {
      await agregarTipoTicket(evento.id, {
        nombre: nombreTicket,
        precio: Number(precioTicket),
        cantidad_total: Number(cupoTicket),
        cantidad_disponible: Number(cupoTicket)
      });

      notifySuccess(`Entrada "${nombreTicket}" creada exitosamente.`);
      setNombreTicket('');
      setPrecioTicket('');
      setCupoTicket('');
      cargarEvento();
    } catch {
      setErrorForm('No se pudo registrar el tipo de entrada.');
      notifyError('Error al crear la entrada.');
    }
  };

  const handleCargarPlantilla = async () => {
    const sectoresDefecto = obtenerSectoresPorTipo(evento.tipo_recinto || 'estadio');
    try {
      for (const sec of sectoresDefecto) {
        await agregarTipoTicket(evento.id, {
          nombre: sec.nombre,
          sector: sec.ubicacion_estadio,
          puerta: sec.puerta,
          precio: Number(sec.precio),
          cantidad_total: Number(sec.capacidad || 1000),
          cantidad_disponible: Number(sec.capacidad || 1000),
          color_zona: sec.color
        });
      }
      notifySuccess('¡Sectores oficiales del recinto cargados con éxito!');
      cargarEvento();
    } catch {
      notifyError('Error al cargar la plantilla de sectores.');
    }
  };

  const handleEliminarTicketConfirmado = async () => {
    if (!ticketAEliminar) return;
    await eliminarTipoTicket(evento.id, ticketAEliminar.id);
    notifyInfo(`Entrada "${ticketAEliminar.nombre}" eliminada.`);
    setTicketAEliminar(null);
    cargarEvento();
  };

  return (
    <div className="container py-4">
      {/* Encabezado con componente modular */}
      <PageHeader
        title="Gestionar Entradas del Evento"
        subtitle={`Configuración de sectores para: ${evento.nombre} (${evento.estadio_nombre || evento.lugar})`}
        badgeText="Inventario y Precios"
        badgeVariant="info"
        badgeIcon="bi-ticket-detailed"
        backTo={`/evento/${evento.id}`}
        backText="Volver al Concierto"
        actions={
          <div className="d-flex gap-2">
            <button
              onClick={handleCargarPlantilla}
              className="btn btn-sm btn-modern-outline text-warning"
              title="Cargar sectores sugeridos automáticamente según el tipo de recinto"
            >
              <i className="bi bi-magic me-1"></i> Cargar Sectores Oficiales
            </button>
            <Link to="/organizador/panel" className="btn btn-sm btn-modern-outline text-decoration-none">
              <i className="bi bi-speedometer2 me-1"></i> Ir al Panel
            </Link>
          </div>
        }
      />

      <div className="row g-4">
        {/* Formulario para Agregar Nuevo Tipo de Ticket */}
        <div className="col-lg-5">
          <div className="glass-panel p-4">
            <h5 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-plus-circle text-primary"></i> Nueva Categoría de Entrada
            </h5>

            <AlertBanner type="danger" message={errorForm} onDismiss={() => setErrorForm('')} />

            <form onSubmit={handleAgregarTicket}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Nombre del Sector / Categoría *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: VIP Front Stage, Cancha General..."
                  className="form-control form-control-modern"
                  value={nombreTicket}
                  onChange={(e) => setNombreTicket(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Precio Unitario Oficial (Bs.) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="Ej: 250"
                  className="form-control form-control-modern"
                  value={precioTicket}
                  onChange={(e) => setPrecioTicket(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-muted">Cupo Máximo Disponible *</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="Ej: 500"
                  className="form-control form-control-modern"
                  value={cupoTicket}
                  onChange={(e) => setCupoTicket(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-modern-primary w-100">
                <i className="bi bi-plus-lg me-1"></i> Guardar Categoría
              </button>
            </form>
          </div>
        </div>

        {/* Lista de Entradas Actuales */}
        <div className="col-lg-7">
          <div className="glass-panel p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-white mb-0 d-flex align-items-center gap-2">
                <i className="bi bi-ticket-detailed text-info"></i> Entradas Configuradas
              </h5>
              <span className="badge rounded-pill bg-white bg-opacity-10 text-muted px-3 py-1">
                {evento.tipos_ticket?.length || 0} Sectores
              </span>
            </div>

            {evento.tipos_ticket && evento.tipos_ticket.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {evento.tipos_ticket.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-3 rounded-4 border d-flex justify-content-between align-items-center transition-all"
                    style={{ background: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.08)' }}
                  >
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="rounded-circle p-1" style={{ backgroundColor: ticket.color_zona || '#6366f1', width: '10px', height: '10px' }}></span>
                        <h6 className="fw-bold text-white mb-0">{ticket.nombre}</h6>
                      </div>
                      <div className="small text-muted mt-1">
                        Precio: <strong style={{ color: '#38bdf8' }}>{formatBs(ticket.precio)}</strong> &bull;{' '}
                        Cupo: <strong className="text-light">{ticket.cantidad_disponible}</strong> / {ticket.cantidad_total} pases disponibles
                      </div>
                    </div>

                    <button
                      onClick={() => setTicketAEliminar(ticket)}
                      className="btn btn-modern-outline btn-sm text-danger"
                      title="Eliminar este tipo de entrada"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon="bi-ticket-perforated"
                title="No hay categorías de entradas"
                description="Agrega una categoría desde el panel izquierdo o usa 'Cargar Sectores Oficiales' para poblar automáticamente."
                actionText="Cargar Sectores Oficiales"
                onAction={handleCargarPlantilla}
                actionIcon="bi-magic"
              />
            )}
          </div>
        </div>
      </div>

      {/* Modal de confirmación para eliminar ticket */}
      <ConfirmModal
        isOpen={Boolean(ticketAEliminar)}
        onClose={() => setTicketAEliminar(null)}
        onConfirm={handleEliminarTicketConfirmado}
        title="¿Eliminar esta categoría?"
        message={`¿Estás seguro de que deseas eliminar la entrada "${ticketAEliminar?.nombre}"?`}
        confirmText="Eliminar Categoría"
      />
    </div>
  );
}
