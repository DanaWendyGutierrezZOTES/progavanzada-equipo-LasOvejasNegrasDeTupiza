// ========================================================
// PÁGINA: FORMEVENTOPAGE (Creación y Edición de Conciertos)
// Autocompletado inteligente con recintos de toda Bolivia
// Precios oficiales en Bolivianos (Bs) y geolocalización Google Maps
// ========================================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { obtenerEventoPorId, guardarEvento } from '../services/storage';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import AlertBanner from '../components/common/AlertBanner';
import { ESTADIOS_BOLIVIA, DEPARTAMENTOS_BOLIVIA } from '../data/estadios';

export default function FormEventoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { notifySuccess, notifyError } = useToast();
  const esEdicion = Boolean(id);

  const [formData, setFormData] = useState({
    nombre: '',
    subtitulo: '',
    categoria: 'Rock',
    descripcion: '',
    fecha: '',
    hora: '19:00',
    lugar: '',
    estadio_nombre: '',
    ciudad: 'La Paz',
    departamento: 'La Paz',
    tipo_recinto: 'estadio',
    capacidad_estadio: '',
    lat: -16.4994,
    lng: -68.1225,
    imagen_url: '',
    precio_base: 150,
    cupo_total: 1000,
    ticket_nombre: 'General',
    ticket_precio: 150,
    ticket_cupo: 1000
  });

  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (esEdicion) {
      const eventoExistente = obtenerEventoPorId(id);
      if (eventoExistente) {
        setFormData({
          nombre: eventoExistente.nombre || '',
          subtitulo: eventoExistente.subtitulo || '',
          categoria: eventoExistente.categoria || 'Rock',
          descripcion: eventoExistente.descripcion || '',
          fecha: eventoExistente.fecha || '',
          hora: eventoExistente.hora || '19:00',
          lugar: eventoExistente.lugar || '',
          estadio_nombre: eventoExistente.estadio_nombre || eventoExistente.lugar || '',
          ciudad: eventoExistente.ciudad || 'La Paz',
          departamento: eventoExistente.departamento || 'La Paz',
          tipo_recinto: eventoExistente.tipo_recinto || 'estadio',
          capacidad_estadio: eventoExistente.capacidad_estadio || '',
          lat: eventoExistente.lat || -16.4994,
          lng: eventoExistente.lng || -68.1225,
          imagen_url: eventoExistente.imagen_url || '',
          precio_base: eventoExistente.precio_base || 150,
          cupo_total: eventoExistente.cupo_total || 1000,
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

  const handleSelectEstadio = (e) => {
    const key = e.target.value;
    const estadio = ESTADIOS_BOLIVIA.find(est => est.key === key);
    if (estadio) {
      setFormData(prev => ({
        ...prev,
        lugar: estadio.lugar,
        estadio_nombre: estadio.nombre,
        ciudad: estadio.ciudad,
        departamento: estadio.departamento,
        tipo_recinto: estadio.tipo,
        capacidad_estadio: estadio.capacidad,
        lat: estadio.lat,
        lng: estadio.lng,
        cupo_total: estadio.capacidadNum || prev.cupo_total,
        ticket_cupo: estadio.capacidadNum || prev.ticket_cupo
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.nombre.trim() || !formData.fecha || !formData.lugar.trim()) {
      setError('Por favor completa todos los campos requeridos marcados con (*)');
      return;
    }

    setGuardando(true);

    try {
      const datosAEnviar = {
        nombre: formData.nombre,
        subtitulo: formData.subtitulo,
        categoria: formData.categoria,
        descripcion: formData.descripcion,
        fecha: formData.fecha,
        hora: formData.hora,
        lugar: formData.lugar,
        estadio_nombre: formData.estadio_nombre || formData.lugar,
        ciudad: formData.ciudad || 'La Paz',
        departamento: formData.departamento || 'La Paz',
        tipo_recinto: formData.tipo_recinto || 'estadio',
        capacidad_estadio: formData.capacidad_estadio,
        lat: Number(formData.lat) || -16.4994,
        lng: Number(formData.lng) || -68.1225,
        imagen_url: formData.imagen_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
        precio_base: Number(formData.precio_base),
        cupo_total: Number(formData.cupo_total)
      };

      if (esEdicion) {
        datosAEnviar.id = Number(id);
        await guardarEvento(datosAEnviar);
        notifySuccess(`El evento "${formData.nombre}" ha sido actualizado.`);
        navigate(`/evento/${id}`);
      } else {
        datosAEnviar.organizador_id = usuario ? usuario.id : 1;
        datosAEnviar.organizador_nombre = usuario ? (usuario.nombre || usuario.username) : 'Organizador';

        // Preconfigurar tipos de tickets según el recinto o el input
        const recinto = ESTADIOS_BOLIVIA.find(est => est.nombre === formData.estadio_nombre);
        if (recinto && recinto.sectores_geograficos) {
          datosAEnviar.sectores_geograficos = recinto.sectores_geograficos;
          datosAEnviar.tipos_ticket = recinto.sectores_geograficos.map((sec, idx) => ({
            id: Date.now() + idx,
            nombre: sec.nombre,
            sector: sec.ubicacion_estadio,
            puerta: sec.puerta,
            precio: Number(sec.precio),
            cantidad_total: Number(sec.capacidad || 1000),
            cantidad_disponible: Number(sec.capacidad || 1000),
            color_zona: sec.color
          }));
        } else {
          datosAEnviar.tipos_ticket = [
            {
              id: Date.now(),
              nombre: formData.ticket_nombre || 'General',
              precio: Number(formData.ticket_precio || formData.precio_base),
              cantidad_total: Number(formData.ticket_cupo || formData.cupo_total),
              cantidad_disponible: Number(formData.ticket_cupo || formData.cupo_total),
              color_zona: '#6366f1'
            }
          ];
        }

        const nuevo = await guardarEvento(datosAEnviar);
        notifySuccess(`¡Evento "${nuevo.nombre}" publicado con éxito!`);
        navigate(`/evento/${nuevo.id}/tickets`);
      }
    } catch (err) {
      setError(err.message || 'Error al guardar el evento');
      notifyError('No se pudo guardar el evento.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <Link to={esEdicion ? `/evento/${id}` : '/organizador/panel'} className="text-decoration-none text-muted small d-inline-flex align-items-center gap-1 link-hover">
          <i className="bi bi-arrow-left"></i> Cancelar y Volver
        </Link>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="glass-panel p-4 p-md-5">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge rounded-pill bg-primary bg-opacity-20 text-info border border-info border-opacity-30 px-3 py-1">
                {esEdicion ? 'Modo Edición' : 'Nueva Publicación'}
              </span>
              <span className="text-muted small">Plataforma Oficial de Conciertos 2026</span>
            </div>

            <h2 className="fw-extrabold text-white mb-1">
              {esEdicion ? `Editar Concierto: ${formData.nombre}` : 'Publicar Nuevo Concierto en Bolivia'}
            </h2>
            <p className="text-muted small mb-4">
              Completa la ficha técnica para abrir la venta de entradas en Bolivianos (Bs) con geolocalización satelital
            </p>

            <AlertBanner type="danger" message={error} onDismiss={() => setError('')} />

            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-md-8">
                  <label className="form-label small fw-semibold text-muted">Nombre del Concierto / Festival *</label>
                  <input
                    type="text"
                    name="nombre"
                    required
                    className="form-control form-control-modern"
                    placeholder="Ej: Festival Internacional de Tupiza 2026"
                    value={formData.nombre}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-muted">Género / Categoría</label>
                  <select
                    name="categoria"
                    className="form-select form-control-modern"
                    value={formData.categoria}
                    onChange={handleChange}
                  >
                    <option value="Rock">Rock</option>
                    <option value="Electrónica">Electrónica</option>
                    <option value="Festivales">Festivales / Folclore</option>
                    <option value="Jazz">Jazz & Acústico</option>
                    <option value="Pop">Pop & Urbano</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Subtítulo / Lema del Espectáculo</label>
                <input
                  type="text"
                  name="subtitulo"
                  className="form-control form-control-modern"
                  placeholder="Ej: ¡Orgullo de los valles del sur y la tierra de Los Chichas!"
                  value={formData.subtitulo}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Descripción y Artistas Invitados *</label>
                <textarea
                  name="descripcion"
                  required
                  rows="4"
                  className="form-control form-control-modern"
                  placeholder="Describe la experiencia, bandas invitadas, horarios de acceso y recomendaciones para los asistentes..."
                  value={formData.descripcion}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="row g-3 mb-4">
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
                  <label className="form-label small fw-semibold text-muted">Hora de Inicio / Apertura *</label>
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

              {/* Selector de Recintos de Bolivia con Geolocalización */}
              <div className="p-4 rounded-4 mb-4 border" style={{ background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.2)' }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label small fw-bold text-white mb-0 d-flex align-items-center gap-1">
                    <i className="bi bi-geo-alt-fill text-danger"></i> Seleccionar Recinto de Bolivia (Estadios, Teatros, Arenas)
                  </label>
                  <span className="badge rounded-pill bg-info text-dark" style={{ fontSize: '0.7rem' }}>
                    Google Maps Automático
                  </span>
                </div>

                <select className="form-select form-control-modern mb-3" onChange={handleSelectEstadio}>
                  <option value="">-- Elige un recinto preconfigurado de Bolivia --</option>
                  <optgroup label="Tupiza & Potosí">
                    {ESTADIOS_BOLIVIA.filter(e => e.departamento === 'Potosí').map(est => (
                      <option key={est.key} value={est.key}>
                        {est.ciudad === 'Tupiza' ? '⭐' : '🏟️'} {est.nombre} ({est.ciudad} - Cap. {est.capacidad})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="La Paz & El Alto">
                    {ESTADIOS_BOLIVIA.filter(e => e.departamento === 'La Paz').map(est => (
                      <option key={est.key} value={est.key}>
                        {est.tipo === 'teatro' ? '🎭' : '🏟️'} {est.nombre} ({est.ciudad} - Cap. {est.capacidad})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Santa Cruz">
                    {ESTADIOS_BOLIVIA.filter(e => e.departamento === 'Santa Cruz').map(est => (
                      <option key={est.key} value={est.key}>
                        🏟️ {est.nombre} ({est.ciudad} - Cap. {est.capacidad})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Cochabamba">
                    {ESTADIOS_BOLIVIA.filter(e => e.departamento === 'Cochabamba').map(est => (
                      <option key={est.key} value={est.key}>
                        🏟️ {est.nombre} ({est.ciudad} - Cap. {est.capacidad})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Otros Departamentos (Sucre, Tarija, Oruro, Beni, Pando)">
                    {ESTADIOS_BOLIVIA.filter(e => !['La Paz', 'Santa Cruz', 'Cochabamba', 'Potosí'].includes(e.departamento)).map(est => (
                      <option key={est.key} value={est.key}>
                        🏟️ {est.nombre} ({est.ciudad} - Cap. {est.capacidad})
                      </option>
                    ))}
                  </optgroup>
                </select>

                <div className="row g-2 mb-2">
                  <div className="col-md-7">
                    <input
                      type="text"
                      name="lugar"
                      required
                      className="form-control form-control-modern"
                      placeholder="Dirección o nombre del recinto..."
                      value={formData.lugar}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-5">
                    <input
                      type="text"
                      name="ciudad"
                      required
                      className="form-control form-control-modern"
                      placeholder="Ciudad (ej: Tupiza, La Paz...)"
                      value={formData.ciudad}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {formData.lat && (
                  <div className="small text-info d-flex align-items-center gap-1 mt-2">
                    <i className="bi bi-pin-map-fill text-danger"></i>
                    Coordenadas GPS asignadas: <strong>{formData.lat}, {formData.lng}</strong> &bull; {formData.capacidad_estadio || 'Capacidad Oficial'}
                  </div>
                )}
              </div>

              {/* Imagen y Precios */}
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
                <small className="text-dim">Deja vacío para usar la portada predeterminada de alta calidad.</small>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Precio Base de Referencia (Bs.) *</label>
                  <input
                    type="number"
                    name="precio_base"
                    required
                    min="1"
                    className="form-control form-control-modern"
                    value={formData.precio_base}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Cupo Total del Evento *</label>
                  <input
                    type="number"
                    name="cupo_total"
                    required
                    min="1"
                    className="form-control form-control-modern"
                    value={formData.cupo_total}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={guardando}
                className="btn-modern-primary w-100 py-3 fs-6"
              >
                {guardando ? (
                  <span>Guardando...</span>
                ) : (
                  <span>
                    <i className={`bi ${esEdicion ? 'bi-check-lg' : 'bi-cloud-upload'} me-1`}></i>
                    {esEdicion ? 'Actualizar Datos del Evento' : 'Publicar Concierto y Configurar Entradas'}
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
