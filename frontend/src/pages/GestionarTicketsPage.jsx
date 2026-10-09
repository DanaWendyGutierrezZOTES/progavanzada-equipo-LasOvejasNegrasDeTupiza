// ========================================================
// PÁGINA: GESTIONARTICKETSPAGE (DISEÑO MODERNO 2026)
// Gestión de inventario de tickets por evento
// ========================================================

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { obtenerEventoPorId, agregarTipoTicket, eliminarTipoTicket } from '../services/storage';

export default function GestionarTicketsPage() {
  const { id } = useParams();
  const [evento, setEvento] = useState(null);

  const [nombreTicket, setNombreTicket] = useState('');
  const [precioTicket, setPrecioTicket] = useState('');
  const [cupoTicket, setCupoTicket] = useState('');
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

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
        <div className="glass-panel p-5 d-inline-block">
          <h3 className="text-white">Evento no encontrado</h3>
          <Link to="/organizador/panel" className="btn-modern-primary mt-2">Volver al panel</Link>
        </div>
      </div>
    );
  }

  const handleAgregarTicket = (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });

    if (!nombreTicket.trim() || !precioTicket || !cupoTicket) {
      setMensaje({ tipo: 'danger', texto: 'Por favor completa todos los campos.' });
      return;
    }

    try {
      agregarTipoTicket(evento.id, {
        nombre: nombreTicket,
        precio: Number(precioTicket),
        cantidad_total: Number(cupoTicket),
        cantidad_disponible: Number(cupoTicket)
      });

      setMensaje({ tipo: 'success', texto: `Entrada "${nombreTicket}" configurada con éxito.` });
      setNombreTicket('');
      setPrecioTicket('');
      setCupoTicket('');
      cargarEvento();
    } catch {
      setMensaje({ tipo: 'danger', texto: 'No se pudo registrar el tipo de entrada.' });
    }
  };

  const handleEliminarTicket = (ticketId, nombre) => {
    if (window.confirm(`¿Seguro que deseas eliminar la entrada "${nombre}"?`)) {
      eliminarTipoTicket(evento.id, ticketId);
      setMensaje({ tipo: 'info', texto: `Entrada "${nombre}" eliminada.` });
      cargarEvento();
    }
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <Link to={`/evento/${evento.id}`} className="text-decoration-none text-muted small d-inline-flex align-items-center gap-1">
          <i className="bi bi-arrow-left"></i> Volver al evento
        </Link>
      </div>

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-extrabold text-white mb-1">Gestionar Entradas</h2>
          <p className="text-muted small mb-0">
            Evento: <strong className="text-light">{evento.nombre}</strong> &bull; {evento.fecha}
          </p>
        </div>
        <Link to="/organizador/panel" className="btn-modern-outline btn-sm text-decoration-none">
          <i className="bi bi-speedometer2"></i> Volver al Panel
        </Link>
      </div>

      {mensaje.texto && (
        <div className={`alert alert-${mensaje.tipo} py-2 mb-4 d-flex align-items-center gap-2`} role="alert">
          <i className="bi bi-info-circle"></i>
          <span>{mensaje.texto}</span>
        </div>
      )}

      <div className="row g-4">
        {/* Formulario para Agregar Nuevo Tipo de Ticket */}
        <div className="col-lg-5">
          <div className="glass-panel p-4">
            <h5 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-plus-circle text-primary"></i> Nueva Categoría
            </h5>

            <form onSubmit={handleAgregarTicket}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Nombre de la Categoría</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: VIP Golden, Platea Baja..."
                  className="form-control form-control-modern"
                  value={nombreTicket}
                  onChange={(e) => setNombreTicket(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Precio Unitario ($)</label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="Ej: 35000"
                  className="form-control form-control-modern"
                  value={precioTicket}
                  onChange={(e) => setPrecioTicket(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-muted">Cupo Asignado</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="Ej: 200"
                  className="form-control form-control-modern"
                  value={cupoTicket}
                  onChange={(e) => setCupoTicket(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-modern-primary w-100">
                <i className="bi bi-plus-lg"></i> Guardar Categoría
              </button>
            </form>
          </div>
        </div>

        {/* Lista de Entradas Actuales */}
        <div className="col-lg-7">
          <div className="glass-panel p-4">
            <h5 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-ticket-detailed text-info"></i> Entradas Configuradas
            </h5>

            {evento.tipos_ticket && evento.tipos_ticket.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {evento.tipos_ticket.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-3 rounded-4 border d-flex justify-content-between align-items-center"
                    style={{ background: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.08)' }}
                  >
                    <div>
                      <h6 className="fw-bold text-white mb-1">{ticket.nombre}</h6>
                      <div className="small text-muted">
                        Precio: <strong style={{ color: '#38bdf8' }}>${Number(ticket.precio).toLocaleString('es-ES')}</strong> &bull;{' '}
                        Cupo: <strong className="text-light">{ticket.cantidad_disponible}</strong> / {ticket.cantidad_total} disponibles
                      </div>
                    </div>

                    <button
                      onClick={() => handleEliminarTicket(ticket.id, ticket.nombre)}
                      className="btn btn-modern-outline btn-sm text-danger"
                      title="Eliminar este tipo de entrada"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5 text-muted">
                No hay categorías de entradas configuradas. Agrega una desde el panel izquierdo.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
