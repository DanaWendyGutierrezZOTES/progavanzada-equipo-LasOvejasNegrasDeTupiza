// ========================================================
// PÁGINA: GESTIONARTICKETSPAGE (Gestión de Tipos de Entrada)
// Configuración de inventario de entradas con precios en Bs,
// plantillas predeterminadas por tipo de recinto, ConfirmModal
// y validaciones con componentes reutilizables (DRY).
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
import FormInput from '../components/common/FormInput';
import { formatBs } from '../utils/formatters';
import { validarNombre, validarPrecio, validarCupo } from '../utils/validators';

export default function GestionarTicketsPage() {
  const { id } = useParams();
  const { notifySuccess, notifyInfo, notifyError } = useToast();

  const [evento, setEvento] = useState(null);
  const [nombreTicket, setNombreTicket] = useState('');
  const [precioTicket, setPrecioTicket] = useState('');
  const [cupoTicket, setCupoTicket] = useState('');
  const [errores, setErrores] = useState({});
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

    const vNom = validarNombre(nombreTicket, 'El nombre del sector');
    const vPre = validarPrecio(precioTicket, 1, 10000);
    const vCup = validarCupo(cupoTicket, 50000);

    const nuevosErrores = {
      nombre: vNom.valido ? '' : vNom.mensaje,
      precio: vPre.valido ? '' : vPre.mensaje,
      cupo: vCup.valido ? '' : vCup.mensaje
    };

    setErrores(nuevosErrores);

    if (Object.values(nuevosErrores).some(m => Boolean(m))) {
      setErrorForm('Por favor completa los campos del sector correctamente.');
      return;
    }

    try {
      await agregarTipoTicket(evento.id, {
        nombre: nombreTicket.trim(),
        precio: Number(precioTicket),
        cantidad_total: Number(cupoTicket),
        cantidad_disponible: Number(cupoTicket)
      });

      notifySuccess(`Entrada "${nombreTicket}" creada exitosamente.`);
      setNombreTicket('');
      setPrecioTicket('');
      setCupoTicket('');
      setErrores({});
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

    try {
      await eliminarTipoTicket(evento.id, ticketAEliminar.id);
      notifyInfo(`Entrada "${ticketAEliminar.nombre}" eliminada.`);
      setTicketAEliminar(null);
      cargarEvento();
    } catch {
      notifyError('No se pudo eliminar la entrada.');
    }
  };

  return (
    <div className="container py-4">
      <PageHeader
        backTo={`/evento/${evento.id}`}
        badgeText="Inventario y Cupos en Bs"
        title={`Gestionar Entradas: ${evento.nombre}`}
        subtitle={`Configura sectores, precios en Bolivianos y capacidades para ${evento.estadio_nombre || evento.lugar}`}
        actions={
          <div className="d-flex gap-2">
            <button
              onClick={handleCargarPlantilla}
              className="btn btn-modern-outline text-info btn-sm"
              title="Cargar sectores oficiales estándar según el tipo de recinto"
            >
              <i className="bi bi-magic me-1"></i> Cargar Sectores Oficiales
            </button>
            <Link to={`/evento/${evento.id}`} className="btn btn-modern-primary btn-sm">
              <i className="bi bi-eye me-1"></i> Ver en Cartelera
            </Link>
          </div>
        }
      />

      <div className="row g-4">
        {/* Formulario Agregar Entrada */}
        <div className="col-lg-5">
          <div className="glass-panel p-4">
            <h5 className="fw-bold text-white mb-3 d-flex align-items-center gap-2 font-display">
              <i className="bi bi-plus-circle-fill text-primary"></i> Nueva Categoría de Entrada
            </h5>

            <AlertBanner type="danger" message={errorForm} onDismiss={() => setErrorForm('')} />

            <form onSubmit={handleAgregarTicket} noValidate>
              <FormInput
                label="Nombre del Sector / Categoría"
                name="nombreTicket"
                value={nombreTicket}
                placeholder="Ej: VIP Front Stage, Cancha General..."
                required
                icon="bi-tag"
                error={errores.nombre}
                onChange={(e) => {
                  setNombreTicket(e.target.value);
                  if (errores.nombre) setErrores(prev => ({ ...prev, nombre: '' }));
                }}
              />

              <FormInput
                label="Precio Unitario Oficial (Bs.)"
                name="precioTicket"
                type="number"
                min="1"
                value={precioTicket}
                placeholder="Ej: 250"
                required
                icon="bi-cash"
                error={errores.precio}
                onChange={(e) => {
                  setPrecioTicket(e.target.value);
                  if (errores.precio) setErrores(prev => ({ ...prev, precio: '' }));
                }}
              />

              <FormInput
                label="Cupo Máximo Disponible"
                name="cupoTicket"
                type="number"
                min="1"
                value={cupoTicket}
                placeholder="Ej: 500"
                required
                icon="bi-people"
                error={errores.cupo}
                onChange={(e) => {
                  setCupoTicket(e.target.value);
                  if (errores.cupo) setErrores(prev => ({ ...prev, cupo: '' }));
                }}
              />

              <button type="submit" className="btn-modern-primary w-100 mt-2">
                <i className="bi bi-plus-lg me-1"></i> Guardar Categoría
              </button>
            </form>
          </div>
        </div>

        {/* Lista de Entradas Actuales */}
        <div className="col-lg-7">
          <div className="glass-panel p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-white mb-0 d-flex align-items-center gap-2 font-display">
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
                        <h6 className="fw-bold text-white mb-0 font-display">{ticket.nombre}</h6>
                      </div>
                      <div className="small text-muted mt-1">
                        Precio: <strong className="font-numbers" style={{ color: '#38bdf8' }}>{formatBs(ticket.precio)}</strong> &bull;{' '}
                        Cupo: <strong className="text-light font-numbers">{ticket.cantidad_disponible}</strong> / {ticket.cantidad_total} pases disponibles
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
