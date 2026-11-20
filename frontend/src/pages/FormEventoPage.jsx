// ========================================================
// PÁGINA: FORMEVENTOPAGE (Creación y Edición de Conciertos)
// Autocompletado inteligente con recintos de toda Bolivia
// Precios oficiales en Bolivianos (Bs), geolocalización Google Maps
// y validaciones robustas centralizadas sin código repetido (DRY).
// ========================================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { obtenerEventoPorId, guardarEvento } from '../services/storage';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import AlertBanner from '../components/common/AlertBanner';
import FormInput from '../components/common/FormInput';
import { ESTADIOS_BOLIVIA } from '../data/estadios';
import {
  validarNombre,
  validarFechaEvento,
  validarPrecio,
  validarCupo
} from '../utils/validators';

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

  const [errores, setErrores] = useState({});
  const [errorGlobal, setErrorGlobal] = useState('');
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
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: '' }));
    }
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
      setErrores(prev => ({ ...prev, lugar: '', ciudad: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorGlobal('');

    // Validaciones modulares con validators.js
    const vNombre = validarNombre(formData.nombre, 'El título del evento');
    const vFecha = validarFechaEvento(formData.fecha, formData.hora, esEdicion);
    const vPrecio = validarPrecio(formData.precio_base, 10, 20000);
    const vCupo = validarCupo(formData.cupo_total, 100000);

    const nuevosErrores = {
      nombre: vNombre.valido ? '' : vNombre.mensaje,
      fecha: vFecha.valido ? '' : vFecha.mensaje,
      lugar: formData.lugar?.trim() ? '' : 'El lugar o recinto es obligatorio.',
      descripcion: formData.descripcion?.trim() ? '' : 'La descripción es obligatoria.',
      precio_base: vPrecio.valido ? '' : vPrecio.mensaje,
      cupo_total: vCupo.valido ? '' : vCupo.mensaje
    };

    setErrores(nuevosErrores);

    if (Object.values(nuevosErrores).some(m => Boolean(m))) {
      setErrorGlobal('Por favor completa todos los campos requeridos correctamente.');
      return;
    }

    setGuardando(true);

    try {
      const datosAEnviar = {
        nombre: formData.nombre.trim(),
        subtitulo: formData.subtitulo.trim(),
        categoria: formData.categoria,
        descripcion: formData.descripcion.trim(),
        fecha: formData.fecha,
        hora: formData.hora,
        lugar: formData.lugar.trim(),
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
      setErrorGlobal(err.message || 'Error al guardar el evento');
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
              <span className="text-muted small">Plataforma Oficial de Conciertos 2026 &bull; Bolivia</span>
            </div>

            <h2 className="fw-extrabold text-white mb-1 font-display">
              {esEdicion ? `Editar Concierto: ${formData.nombre}` : 'Publicar Nuevo Concierto en Bolivia'}
            </h2>
            <p className="text-muted small mb-4">
              Completa la ficha técnica para abrir la venta de entradas en Bolivianos (Bs) con geolocalización satelital
            </p>

            <AlertBanner type="danger" message={errorGlobal} onDismiss={() => setErrorGlobal('')} />

            <form onSubmit={handleSubmit} noValidate>
              <div className="row g-3 mb-2">
                <div className="col-md-8">
                  <FormInput
                    label="Nombre del Concierto / Festival"
                    name="nombre"
                    value={formData.nombre}
                    placeholder="Ej: Festival Internacional de Tupiza 2026"
                    required
                    icon="bi-music-note-beamed"
                    error={errores.nombre}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <FormInput
                    label="Género / Categoría"
                    name="categoria"
                    type="select"
                    value={formData.categoria}
                    icon="bi-tag"
                    onChange={handleChange}
                  >
                    <option value="Rock">Rock</option>
                    <option value="Electrónica">Electrónica</option>
                    <option value="Festivales">Festivales / Folclore</option>
                    <option value="Jazz">Jazz & Acústico</option>
                    <option value="Pop">Pop & Urbano</option>
                  </FormInput>
                </div>
              </div>

              <FormInput
                label="Subtítulo / Lema del Espectáculo"
                name="subtitulo"
                value={formData.subtitulo}
                placeholder="Ej: ¡Orgullo de los valles del sur y la tierra de Los Chichas!"
                icon="bi-chat-quote"
                onChange={handleChange}
              />

              <FormInput
                label="Descripción y Artistas Invitados"
                name="descripcion"
                type="textarea"
                rows={4}
                value={formData.descripcion}
                placeholder="Describe la experiencia, bandas invitadas, horarios de acceso y recomendaciones para los asistentes..."
                required
                icon="bi-card-text"
                error={errores.descripcion}
                onChange={handleChange}
              />

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <FormInput
                    label="Fecha del Evento"
                    name="fecha"
                    type="date"
                    value={formData.fecha}
                    required
                    icon="bi-calendar-event"
                    error={errores.fecha}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <FormInput
                    label="Hora de Inicio / Apertura"
                    name="hora"
                    type="time"
                    value={formData.hora}
                    required
                    icon="bi-clock"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Selector de Recintos de Bolivia con Geolocalización */}
              <div className="p-4 rounded-4 mb-4 border" style={{ background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.2)' }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label small fw-bold text-white mb-0 d-flex align-items-center gap-1 font-display">
                    <i className="bi bi-geo-alt-fill text-danger"></i> Seleccionar Recinto de Bolivia (Estadios, Teatros, Arenas)
                  </label>
                  <span className="badge rounded-pill bg-info text-dark" style={{ fontSize: '0.7rem' }}>
                    Google Maps Satelital Automático
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
                    <FormInput
                      label="Dirección o Nombre del Recinto"
                      name="lugar"
                      value={formData.lugar}
                      placeholder="Dirección o nombre del recinto..."
                      required
                      icon="bi-geo"
                      error={errores.lugar}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-5">
                    <FormInput
                      label="Ciudad"
                      name="ciudad"
                      value={formData.ciudad}
                      placeholder="Tupiza, La Paz, Santa Cruz..."
                      required
                      icon="bi-pin-map"
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
              <FormInput
                label="URL de Imagen de Portada"
                name="imagen_url"
                type="url"
                value={formData.imagen_url}
                placeholder="https://images.unsplash.com/..."
                icon="bi-image"
                helperText="Deja vacío para usar una imagen predeterminada HD"
                onChange={handleChange}
              />

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <FormInput
                    label="Precio Base de Referencia (Bs.)"
                    name="precio_base"
                    type="number"
                    min="1"
                    value={formData.precio_base}
                    required
                    icon="bi-cash"
                    error={errores.precio_base}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <FormInput
                    label="Cupo Total del Evento"
                    name="cupo_total"
                    type="number"
                    min="1"
                    value={formData.cupo_total}
                    required
                    icon="bi-people"
                    error={errores.cupo_total}
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
                  <span>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Guardando...
                  </span>
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
