// ========================================================
// PÁGINA: FORMEVENTOPAGE (DISEÑO MODERNO 2026)
// Formulario para crear o editar eventos con precios en Bolivianos (Bs)
// ========================================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { obtenerEventoPorId, guardarEvento } from '../services/storage';
import { useAuth } from '../context/AuthContext';

export default function FormEventoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const esEdicion = Boolean(id);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fecha: '',
    hora: '19:00',
    lugar: '',
    imagen_url: '',
    precio_base: 150,
    cupo_total: 500,
    ticket_nombre: 'General',
    ticket_precio: 150,
    ticket_cupo: 500
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (esEdicion) {
      const eventoExistente = obtenerEventoPorId(id);
      if (eventoExistente) {
        setFormData({
          nombre: eventoExistente.nombre,
          descripcion: eventoExistente.descripcion,
          fecha: eventoExistente.fecha,
          hora: eventoExistente.hora,
          lugar: eventoExistente.lugar,
          imagen_url: eventoExistente.imagen_url || '',
          precio_base: eventoExistente.precio_base || 0,
          cupo_total: eventoExistente.cupo_total || 0,
          ticket_nombre: '',
          ticket_precio: 0,
          ticket_cupo: 0
        });
      }
    }
  }, [id, esEdicion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.nombre.trim() || !formData.fecha || !formData.lugar.trim()) {
      setError('Por favor completa los campos requeridos marcados con (*)');
      return;
    }

    try {
      const datosAEnviar = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        fecha: formData.fecha,
        hora: formData.hora,
        lugar: formData.lugar,
        imagen_url: formData.imagen_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
        precio_base: Number(formData.precio_base),
        cupo_total: Number(formData.cupo_total)
      };

      if (esEdicion) {
        datosAEnviar.id = Number(id);
        guardarEvento(datosAEnviar);
        alert('Evento actualizado exitosamente.');
        navigate(`/evento/${id}`);
      } else {
        datosAEnviar.organizador_id = usuario ? usuario.id : 1;
        datosAEnviar.organizador_nombre = usuario ? (usuario.nombre || usuario.username) : 'Organizador';

        datosAEnviar.tipos_ticket = [
          {
            id: Date.now(),
            nombre: formData.ticket_nombre || 'General',
            precio: Number(formData.ticket_precio || formData.precio_base),
            cantidad_total: Number(formData.ticket_cupo || formData.cupo_total),
            cantidad_disponible: Number(formData.ticket_cupo || formData.cupo_total)
          }
        ];

        const nuevo = guardarEvento(datosAEnviar);
        alert('Evento publicado con éxito en la cartelera.');
        navigate(`/evento/${nuevo.id}/tickets`);
      }
    } catch (err) {
      setError(err.message || 'Error al guardar el evento');
    }
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <Link to={esEdicion ? `/evento/${id}` : '/organizador/panel'} className="text-decoration-none text-muted small d-inline-flex align-items-center gap-1">
          <i className="bi bi-arrow-left"></i> Cancelar y Volver
        </Link>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="glass-panel p-4 p-md-5">
            <h2 className="fw-extrabold text-white mb-1">
              {esEdicion ? `Editar Evento: ${formData.nombre}` : 'Publicar Nuevo Evento'}
            </h2>
            <p className="text-muted small mb-4">
              Completa la ficha técnica para abrir la venta de entradas en Bolivianos (Bs)
            </p>

            {error && (
              <div className="alert alert-danger py-2 mb-4 d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-triangle"></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Nombre del Evento *</label>
                <input
                  type="text"
                  name="nombre"
                  required
                  className="form-control form-control-modern"
                  placeholder="Ej: Sunset Festival Bolivia 2026"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Descripción y Artistas *</label>
                <textarea
                  name="descripcion"
                  required
                  rows="4"
                  className="form-control form-control-modern"
                  placeholder="Describe la experiencia, bandas invitadas, horarios de acceso y recomendaciones..."
                  value={formData.descripcion}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Fecha del Evento *</label>
                  <input
                    type="date"
                    name="fecha"
                    required
                    className="form-control form-control-modern"
                    value={formData.fecha}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Hora de Inicio *</label>
                  <input
                    type="time"
                    name="hora"
                    required
                    className="form-control form-control-modern"
                    value={formData.hora}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Lugar / Recinto / Estadio *</label>
                <input
                  type="text"
                  name="lugar"
                  required
                  className="form-control form-control-modern"
                  placeholder="Ej: Estadio Hernando Siles, La Paz..."
                  value={formData.lugar}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">URL de Imagen de Portada</label>
                <input
                  type="url"
                  name="imagen_url"
                  className="form-control form-control-modern"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imagen_url}
                  onChange={handleChange}
                />
                <small className="text-dim">Se asignará una portada de concierto por defecto si se deja vacío.</small>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Precio Base Referencial (Bs.) *</label>
                  <input
                    type="number"
                    name="precio_base"
                    min="0"
                    required
                    className="form-control form-control-modern"
                    value={formData.precio_base}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Cupo Total Estimado *</label>
                  <input
                    type="number"
                    name="cupo_total"
                    min="1"
                    required
                    className="form-control form-control-modern"
                    value={formData.cupo_total}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {!esEdicion && (
                <div className="p-3 rounded-4 mb-4 border" style={{ background: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                  <h6 className="fw-bold text-white mb-2 d-flex align-items-center gap-2">
                    <i className="bi bi-ticket-perforated text-primary"></i> Categoría de Entrada Inicial
                  </h6>
                  <div className="row g-2">
                    <div className="col-md-5">
                      <label className="small text-dim">Nombre</label>
                      <input
                        type="text"
                        name="ticket_nombre"
                        className="form-control form-control-modern form-control-sm"
                        value={formData.ticket_nombre}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="small text-dim">Precio (Bs.)</label>
                      <input
                        type="number"
                        name="ticket_precio"
                        className="form-control form-control-modern form-control-sm"
                        value={formData.ticket_precio}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="small text-dim">Cupo</label>
                      <input
                        type="number"
                        name="ticket_cupo"
                        className="form-control form-control-modern form-control-sm"
                        value={formData.ticket_cupo}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="d-flex justify-content-end gap-3 mt-4">
                <Link to={esEdicion ? `/evento/${id}` : '/organizador/panel'} className="btn-modern-outline text-decoration-none">
                  Cancelar
                </Link>
                <button type="submit" className="btn-modern-primary">
                  <i className="bi bi-save"></i> {esEdicion ? 'Guardar Cambios' : 'Publicar Evento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
