// ========================================================
// COMPONENTE: MAPARECINTO (GOOGLE MAPS & DISTRIBUCIÓN ADAPTATIVA)
// Soporta estadios de fútbol, teatros históricos, coliseos y arenas de Bolivia
// ========================================================

import React, { useState } from 'react';
import { SECTORES_ESTADIO_DEFECTO, ESTADIOS_BOLIVIA, obtenerEstadioPorKey } from '../data/estadios';
import { formatBs } from '../utils/formatters';

export default function MapaRecinto({ evento, onSeleccionarZona, zonaSeleccionadaId }) {
  const [pestañaActiva, setPestañaActiva] = useState('recinto'); // 'recinto', 'googlemaps', 'accesos'
  const [tipoGoogleMap, setTipoGoogleMap] = useState('k'); // 'k' = Satélite HD, 'm' = Callejero, 'h' = Híbrido

  // Coordenadas y datos del recinto
  const lat = Number(evento.lat) || -16.4994;
  const lng = Number(evento.lng) || -68.1225;
  const nombreLugar = evento.estadio_nombre || evento.lugar;
  const ciudad = evento.ciudad || 'Bolivia';

  // Buscar información ampliada del catálogo si existe
  const recintoCatalogo = ESTADIOS_BOLIVIA.find(
    (e) => e.nombre.toLowerCase() === nombreLugar.toLowerCase() ||
           nombreLugar.toLowerCase().includes(e.ciudad.toLowerCase())
  ) || null;

  const tipoRecinto = evento.tipo_recinto || recintoCatalogo?.tipo || 'estadio';
  const puertasRecinto = recintoCatalogo?.puertas || [
    { nombre: 'Puerta Principal / Acceso A', sectores: 'VIP y Preferencial', apertura: `${evento.hora || '18:00'} hrs` },
    { nombre: 'Puerta Lateral / Acceso B', sectores: 'Cancha y General', apertura: `${evento.hora || '18:00'} hrs` }
  ];

  const sectores = evento.sectores_geograficos || recintoCatalogo?.sectores_geograficos || SECTORES_ESTADIO_DEFECTO;

  // URLs oficiales de Google Maps
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${lat},${lng}&hl=es&z=17&t=${tipoGoogleMap}&output=embed`;
  const googleMapsDirectUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${nombreLugar}, ${ciudad}, Bolivia`)}`;
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  const getPrecioSector = (id, fallback) => {
    const sec = sectores.find(s => s.id === id);
    return formatBs(sec?.precio || fallback);
  };

  const seleccionarZonaPorKeywords = (keywords, exclude = []) => {
    if (!onSeleccionarZona || !evento.tipos_ticket) return;
    const ticket = evento.tipos_ticket.find(t => {
      const nombre = t.nombre.toLowerCase();
      const coincide = keywords.some(k => nombre.includes(k));
      const excluido = exclude.some(k => nombre.includes(k));
      return coincide && !excluido;
    });
    if (ticket) onSeleccionarZona(ticket.id);
  };

  return (
    <div className="glass-panel p-4 mb-4 position-relative overflow-hidden">
      {/* Encabezado con información del Recinto y Selector de Pestañas */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3 border-bottom pb-3" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge rounded-pill bg-danger bg-opacity-25 text-danger border border-danger border-opacity-50 px-2 py-1 small">
              <i className="bi bi-geo-alt-fill me-1"></i> Google Maps Certificado
            </span>
            <span className="badge rounded-pill bg-primary bg-opacity-20 text-info border border-info border-opacity-30 px-2 py-1 small text-uppercase">
              {tipoRecinto === 'teatro' ? '🎭 Teatro Histórico' : tipoRecinto === 'arena' ? '🏟️ Arena / Anfiteatro' : '🏟️ Estadio Olímpico'}
            </span>
            <span className="text-dim small d-none d-md-inline">• {evento.capacidad_estadio || recintoCatalogo?.capacidad || 'Gran Capacidad'}</span>
          </div>
          <h5 className="fw-bold text-white mb-0">
            {nombreLugar}
          </h5>
        </div>

        {/* Botones de navegación interna */}
        <div className="d-flex gap-1 p-1 rounded-pill" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button
            onClick={() => setPestañaActiva('recinto')}
            className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold ${pestañaActiva === 'recinto' ? 'btn-modern-primary' : 'btn-link text-muted text-decoration-none'}`}
          >
            <i className="bi bi-diagram-3 me-1"></i> Distribución de Zonas
          </button>
          <button
            onClick={() => setPestañaActiva('googlemaps')}
            className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold ${pestañaActiva === 'googlemaps' ? 'btn-modern-primary' : 'btn-link text-muted text-decoration-none'}`}
          >
            <i className="bi bi-google me-1 text-danger"></i> Google Maps
          </button>
          <button
            onClick={() => setPestañaActiva('accesos')}
            className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold ${pestañaActiva === 'accesos' ? 'btn-modern-primary' : 'btn-link text-muted text-decoration-none'}`}
          >
            <i className="bi bi-signpost-2 me-1"></i> Puertas y Accesos
          </button>
        </div>
      </div>

      {/* ========================================================
          1. DISTRIBUCIÓN GEOGRÁFICA INTERACTIVA DEL RECINTO
         ======================================================== */}
      {pestañaActiva === 'recinto' && (
        <div>
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
            <p className="text-muted small mb-0">
              <i className="bi bi-info-circle text-info me-1"></i>
              Haz clic sobre cualquier sector para seleccionarlo en la compra de entradas:
            </p>
            <span className="badge rounded-pill bg-dark border border-secondary text-light px-3 py-1 small">
              Orientación: Norte hacia arriba
            </span>
          </div>

          {/* BLUEPRINT DINÁMICO SEGÚN EL TIPO DE RECINTO */}
          {tipoRecinto === 'teatro' ? (
            /* DISEÑO PARA TEATROS Y AUDITORIOS */
            <div className="stadium-layout-container p-4 rounded-4 mb-4 position-relative text-center overflow-hidden"
                 style={{
                   background: 'radial-gradient(ellipse at center, #1e1b4b 0%, #060913 100%)',
                   border: '1px solid rgba(255, 255, 255, 0.12)',
                   boxShadow: 'inset 0 0 50px rgba(0, 0, 0, 0.8)'
                 }}>
              {/* Escenario del Teatro */}
              <div className="p-3 rounded-4 mx-auto mb-4 text-center shadow-lg"
                   style={{
                     maxWidth: '460px',
                     background: 'linear-gradient(135deg, #b45309 0%, #d97706 50%, #92400e 100%)',
                     color: '#ffffff',
                     border: '2px solid #f59e0b'
                   }}>
                <div className="fw-extrabold small text-uppercase" style={{ letterSpacing: '2px' }}>
                  🎭 ESCENARIO PRINCIPAL / BOCA DEL TEATRO
                </div>
                <div className="small text-white-50" style={{ fontSize: '0.72rem' }}>Acústica Pro Sinfónica & Iluminación Teatral</div>
              </div>

              {/* Platea Baja VIP */}
              <div
                onClick={() => seleccionarZonaPorKeywords(['platea', 'vip'])}
                className="p-3 rounded-4 mb-3 mx-auto cursor-pointer transition-all"
                style={{
                  maxWidth: '420px',
                  background: 'rgba(245, 158, 11, 0.2)',
                  border: '2px solid #f59e0b',
                  cursor: 'pointer'
                }}
              >
                <div className="fw-bold text-warning small">⭐ PLATEA BAJA VIP (FILAS 1 A 10)</div>
                <div className="text-white small">Ubicación Preferencial Central &bull; {getPrecioSector('platea_vip', 180)}</div>
              </div>

              {/* Palcos y Platea Alta */}
              <div className="d-flex justify-content-center align-items-center gap-3 mb-3 mx-auto" style={{ maxWidth: '500px' }}>
                <div
                  onClick={() => seleccionarZonaPorKeywords(['palco'])}
                  className="p-3 rounded-4 cursor-pointer transition-all flex-grow-1"
                  style={{
                    background: 'rgba(139, 92, 246, 0.2)',
                    border: '2px solid #8b5cf6',
                    cursor: 'pointer'
                  }}
                >
                  <div className="fw-bold small" style={{ color: '#c084fc' }}>🏛️ PALCOS OFICIALES</div>
                  <div className="text-dim small" style={{ fontSize: '0.75rem' }}>{getPrecioSector('palcos', 150)}</div>
                </div>

                <div
                  onClick={() => seleccionarZonaPorKeywords(['alta', 'platea'])}
                  className="p-3 rounded-4 cursor-pointer transition-all flex-grow-1"
                  style={{
                    background: 'rgba(56, 189, 248, 0.2)',
                    border: '2px solid #38bdf8',
                    cursor: 'pointer'
                  }}
                >
                  <div className="fw-bold text-info small">💺 PLATEA ALTA</div>
                  <div className="text-dim small" style={{ fontSize: '0.75rem' }}>{getPrecioSector('platea_alta', 130)}</div>
                </div>
              </div>

              {/* Galería Alta / Anfiteatro */}
              <div
                onClick={() => seleccionarZonaPorKeywords(['galeria', 'anfiteatro'])}
                className="p-2 rounded-4 mx-auto cursor-pointer transition-all"
                style={{
                  maxWidth: '460px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '2px solid #10b981',
                  cursor: 'pointer'
                }}
              >
                <div className="fw-bold text-success small">⬆ ANFITEATRO / GALERÍA SUPERIOR</div>
                <div className="text-muted small" style={{ fontSize: '0.75rem' }}>Vista Panorámica Acústica &bull; {getPrecioSector('anfiteatro', 80)}</div>
              </div>
            </div>
          ) : tipoRecinto === 'arena' || tipoRecinto === 'campo_ferial' || tipoRecinto === 'coliseo' ? (
            /* DISEÑO PARA ARENAS, COLISEOS Y ANFITEATROS */
            <div className="stadium-layout-container p-4 rounded-4 mb-4 position-relative text-center overflow-hidden"
                 style={{
                   background: 'radial-gradient(ellipse at center, #0f172a 0%, #060913 100%)',
                   border: '1px solid rgba(255, 255, 255, 0.12)',
                   boxShadow: 'inset 0 0 50px rgba(0, 0, 0, 0.8)'
                 }}>
              {/* Escenario Monumental */}
              <div className="py-2 px-4 rounded-pill mx-auto mb-3 shadow-lg fw-extrabold text-dark"
                   style={{
                     background: 'linear-gradient(90deg, #38bdf8 0%, #a855f7 50%, #38bdf8 100%)',
                     fontSize: '0.82rem',
                     letterSpacing: '2px',
                     maxWidth: '360px'
                   }}>
                🎤 ESCENARIO MEGA LIVE ARENA
              </div>

              {/* Golden Circle VIP Lounge */}
              <div
                onClick={() => seleccionarZonaPorKeywords(['golden', 'vip'])}
                className="p-3 rounded-4 mb-3 mx-auto cursor-pointer transition-all"
                style={{
                  maxWidth: '440px',
                  background: 'rgba(245, 158, 11, 0.25)',
                  border: '2px solid #f59e0b',
                  cursor: 'pointer'
                }}
              >
                <span className="badge bg-warning text-dark fw-bold mb-1" style={{ fontSize: '0.7rem' }}>⭐ GOLDEN CIRCLE VIP LOUNGE</span>
                <div className="text-white small fw-semibold">Frente al Artista &bull; Experiencia Exclusiva &bull; {getPrecioSector('golden_circle', 350)}</div>
              </div>

              {/* Pista Central y Graderías Laterales */}
              <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
                <div
                  onClick={() => seleccionarZonaPorKeywords(['graderia', 'preferencial'])}
                  className="p-3 rounded-4 cursor-pointer text-start transition-all d-flex flex-column justify-content-center"
                  style={{
                    width: '130px',
                    minHeight: '160px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '2px solid #38bdf8',
                    cursor: 'pointer'
                  }}
                >
                  <span className="badge bg-info text-dark fw-bold mb-1" style={{ fontSize: '0.65rem' }}>LATERAL</span>
                  <div className="fw-bold text-white small">GRADERÍA OESTE</div>
                  <div className="text-info mt-1 small">{getPrecioSector('graderia_vip', 220)}</div>
                </div>

                <div
                  onClick={() => seleccionarZonaPorKeywords(['pista', 'central', 'cancha'])}
                  className="p-4 rounded-4 flex-grow-1 cursor-pointer transition-all text-center"
                  style={{
                    maxWidth: '340px',
                    minHeight: '160px',
                    background: 'rgba(99, 102, 241, 0.2)',
                    border: '2px solid #6366f1',
                    cursor: 'pointer'
                  }}
                >
                  <span className="badge bg-primary text-white fw-bold mb-2">PISTA CENTRAL ARENA</span>
                  <div className="text-white small fw-semibold">Campo Principal &bull; De Pie</div>
                  <div className="fw-extrabold mt-2 text-primary fs-5" style={{ color: '#818cf8' }}>{getPrecioSector('pista_central', 200)}</div>
                </div>

                <div
                  onClick={() => seleccionarZonaPorKeywords(['graderia', 'general'])}
                  className="p-3 rounded-4 cursor-pointer text-end transition-all d-flex flex-column justify-content-center"
                  style={{
                    width: '130px',
                    minHeight: '160px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '2px solid #10b981',
                    cursor: 'pointer'
                  }}
                >
                  <span className="badge bg-success text-white fw-bold mb-1 ms-auto" style={{ fontSize: '0.65rem' }}>LATERAL</span>
                  <div className="fw-bold text-white small">GRADERÍA ESTE</div>
                  <div className="text-success mt-1 small">{getPrecioSector('general_arena', 150)}</div>
                </div>
              </div>
            </div>
          ) : (
            /* DISEÑO TRADICIONAL PARA ESTADIOS DE FÚTBOL */
            <div className="stadium-layout-container p-4 rounded-4 mb-4 position-relative text-center overflow-hidden"
                 style={{
                   background: 'radial-gradient(ellipse at center, #0f172a 0%, #060913 100%)',
                   border: '1px solid rgba(255, 255, 255, 0.12)',
                   boxShadow: 'inset 0 0 50px rgba(0, 0, 0, 0.8)'
                 }}>
              
              {/* Cabecera / Curva Norte */}
              <div className="mb-3 max-w-md mx-auto" style={{ maxWidth: '420px' }}>
                <div
                  onClick={() => seleccionarZonaPorKeywords(['curva', 'norte', 'general'])}
                  className="stadium-stand-curva-norte p-2 rounded-top-pill cursor-pointer transition-all"
                  style={{
                    background: 'rgba(236, 72, 153, 0.15)',
                    border: '2px solid #ec4899',
                    borderRadius: '120px 120px 20px 20px',
                    cursor: 'pointer'
                  }}
                >
                  <div className="fw-bold small text-white">⬆ CURVA NORTE (TRIBUNA NORTE)</div>
                  <div className="text-pink small" style={{ color: '#f472b6', fontSize: '0.75rem' }}>
                    Acceso Puerta Norte &bull; {getPrecioSector('curva_norte', 140)}
                  </div>
                </div>
              </div>

              {/* Cuerpo Central del Estadio: Tribuna Oeste (Preferencia) - Cancha - Tribuna Este (General) */}
              <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
                {/* Tribuna Preferencial (Occidente) */}
                <div
                  onClick={() => seleccionarZonaPorKeywords(['preferen', 'platea'])}
                  className="p-3 rounded-4 cursor-pointer text-start transition-all d-flex flex-column justify-content-center"
                  style={{
                    width: '130px',
                    minHeight: '260px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '2px solid #38bdf8',
                    cursor: 'pointer'
                  }}
                >
                  <span className="badge bg-info text-dark fw-bold mb-1" style={{ fontSize: '0.65rem' }}>OESTE</span>
                  <div className="fw-bold text-white small">TRIBUNA PREFERENCIAL</div>
                  <div className="text-info small" style={{ fontSize: '0.75rem' }}>Palcos / Butacas</div>
                  <div className="mt-2 fw-extrabold text-info">{getPrecioSector('preferencial', 280)}</div>
                </div>

                {/* Centro de la Cancha / Césped + Escenario */}
                <div className="p-3 rounded-4 flex-grow-1 position-relative"
                     style={{
                       maxWidth: '380px',
                       minHeight: '260px',
                       background: 'rgba(16, 185, 129, 0.08)',
                       border: '2px dashed rgba(16, 185, 129, 0.35)'
                     }}>
                  {/* Escenario Monumental */}
                  <div className="py-2 px-3 rounded-pill mx-auto mb-3 shadow-lg fw-extrabold text-dark"
                       style={{
                         background: 'linear-gradient(90deg, #38bdf8 0%, #a855f7 50%, #38bdf8 100%)',
                         fontSize: '0.8rem',
                         letterSpacing: '2px',
                         maxWidth: '280px'
                       }}>
                    🎤 ESCENARIO PRINCIPAL / STAGE
                  </div>

                  {/* Zona VIP Front Stage */}
                  <div
                    onClick={() => seleccionarZonaPorKeywords(['vip'])}
                    className="p-3 rounded-3 mb-2 cursor-pointer transition-all"
                    style={{
                      background: 'rgba(245, 158, 11, 0.25)',
                      border: '2px solid #f59e0b',
                      cursor: 'pointer'
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="text-start">
                        <span className="badge bg-warning text-dark fw-bold mb-1" style={{ fontSize: '0.7rem' }}>⭐ VIP FRONT STAGE</span>
                        <div className="text-white small fw-semibold">Frente al Artista &bull; Alfombra Roja</div>
                      </div>
                      <span className="fw-bold text-warning fs-6">{getPrecioSector('vip', 450)}</span>
                    </div>
                  </div>

                  {/* Zona Cancha General / Césped */}
                  <div
                    onClick={() => seleccionarZonaPorKeywords(['cancha'])}
                    className="p-3 rounded-3 cursor-pointer transition-all"
                    style={{
                      background: 'rgba(99, 102, 241, 0.2)',
                      border: '2px solid #6366f1',
                      cursor: 'pointer'
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="text-start">
                        <span className="badge bg-primary text-white fw-bold mb-1" style={{ fontSize: '0.7rem' }}>CANCHA GENERAL</span>
                        <div className="text-white small fw-semibold">Césped Central &bull; De pie</div>
                      </div>
                      <span className="fw-bold fs-6" style={{ color: '#818cf8' }}>{getPrecioSector('cancha', 220)}</span>
                    </div>
                  </div>
                </div>

                {/* Tribuna General (Oriente) */}
                <div
                  onClick={() => seleccionarZonaPorKeywords(['general'], ['cancha'])}
                  className="p-3 rounded-4 cursor-pointer text-end transition-all d-flex flex-column justify-content-center"
                  style={{
                    width: '130px',
                    minHeight: '260px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '2px solid #10b981',
                    cursor: 'pointer'
                  }}
                >
                  <span className="badge bg-success text-white fw-bold mb-1 ms-auto" style={{ fontSize: '0.65rem' }}>ESTE</span>
                  <div className="fw-bold text-white small">TRIBUNA GENERAL</div>
                  <div className="text-success small" style={{ fontSize: '0.75rem' }}>Gradería Este</div>
                  <div className="mt-2 fw-extrabold text-success">{getPrecioSector('general', 180)}</div>
                </div>
              </div>

              {/* Cabecera / Curva Sur */}
              <div className="mt-3 max-w-md mx-auto" style={{ maxWidth: '420px' }}>
                <div
                  onClick={() => seleccionarZonaPorKeywords(['curva', 'sur', 'general'])}
                  className="p-2 rounded-bottom-pill cursor-pointer transition-all"
                  style={{
                    background: 'rgba(139, 92, 246, 0.15)',
                    border: '2px solid #8b5cf6',
                    borderRadius: '20px 20px 120px 120px',
                    cursor: 'pointer'
                  }}
                >
                  <div className="fw-bold small text-white">⬇ CURVA SUR (TRIBUNA SUR)</div>
                  <div className="text-purple small" style={{ color: '#c084fc', fontSize: '0.75rem' }}>
                    Acceso Puerta Sur &bull; {getPrecioSector('curva_sur', 140)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Listado de Sectores Geográficos Resumidos */}
          <div className="row row-cols-2 row-cols-md-3 g-2">
            {sectores.map((sec) => (
              <div key={sec.id} className="col">
                <div className="p-2 rounded-3 border" style={{ background: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                  <div className="d-flex align-items-center gap-2">
                    <span className="rounded-circle p-1" style={{ backgroundColor: sec.color || '#6366f1', width: '10px', height: '10px' }}></span>
                    <span className="fw-bold text-white small text-truncate">{sec.nombre}</span>
                  </div>
                  <div className="text-muted d-flex justify-content-between align-items-center mt-1" style={{ fontSize: '0.75rem' }}>
                    <span className="text-truncate">{sec.puerta}</span>
                    <span className="fw-bold text-info ms-1">{formatBs(sec.precio)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          2. GOOGLE MAPS OFICIAL (SATÉLITE HD Y CALLEJERO)
         ======================================================== */}
      {pestañaActiva === 'googlemaps' && (
        <div>
          {/* Barra de Controles de Google Maps */}
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div className="d-flex align-items-center gap-2">
              <span className="small text-muted fw-semibold">
                <i className="bi bi-layers text-primary me-1"></i> Modo de Google Maps:
              </span>
              <div className="btn-group btn-group-sm" role="group">
                <button
                  type="button"
                  onClick={() => setTipoGoogleMap('k')}
                  className={`btn ${tipoGoogleMap === 'k' ? 'btn-modern-primary text-white' : 'btn-modern-outline text-muted'}`}
                >
                  <i className="bi bi-satellite me-1"></i> Satelital HD
                </button>
                <button
                  type="button"
                  onClick={() => setTipoGoogleMap('m')}
                  className={`btn ${tipoGoogleMap === 'm' ? 'btn-modern-primary text-white' : 'btn-modern-outline text-muted'}`}
                >
                  <i className="bi bi-map me-1"></i> Callejero
                </button>
                <button
                  type="button"
                  onClick={() => setTipoGoogleMap('h')}
                  className={`btn ${tipoGoogleMap === 'h' ? 'btn-modern-primary text-white' : 'btn-modern-outline text-muted'}`}
                >
                  <i className="bi bi-globe me-1"></i> Híbrido
                </button>
              </div>
            </div>

            <div className="d-flex gap-2">
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-modern-primary"
              >
                <i className="bi bi-cursor-fill me-1"></i> Cómo Llegar (Ruta GPS)
              </a>
              <a
                href={googleMapsDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-modern-outline text-info"
              >
                <i className="bi bi-box-arrow-up-right me-1"></i> Abrir en Google Maps
              </a>
            </div>
          </div>

          {/* Iframe oficial de Google Maps */}
          <div className="rounded-4 overflow-hidden border position-relative"
               style={{ height: '360px', borderColor: 'rgba(255, 255, 255, 0.15)', background: '#090d16' }}>
            <iframe
              title={`Google Maps de ${nombreLugar}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={googleMapsEmbedUrl}
            ></iframe>

            {/* Badge Flotante con Coordenadas GPS */}
            <div className="position-absolute bottom-0 start-0 m-3 px-3 py-2 rounded-pill small fw-semibold text-white d-flex align-items-center gap-2 shadow-lg"
                 style={{ background: 'rgba(9, 13, 22, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <i className="bi bi-crosshair text-danger"></i>
              <span>GPS: {lat.toFixed(4)}, {lng.toFixed(4)}</span>
              <span className="text-dim">|</span>
              <span className="text-info">{ciudad}</span>
            </div>
          </div>

          <p className="text-muted small text-center mt-2 mb-0">
            <i className="bi bi-check-circle-fill text-success me-1"></i>
            Geolocalización satelital precisa de <strong>Google Maps</strong> para <strong>{nombreLugar}</strong>.
          </p>
        </div>
      )}

      {/* ========================================================
          3. GUÍA DE ACCESOS Y PUERTAS ESPECÍFICAS DEL RECINTO
         ======================================================== */}
      {pestañaActiva === 'accesos' && (
        <div>
          <h6 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
            <i className="bi bi-door-open-fill text-warning"></i> Puertas y Accesos Oficiales ({nombreLugar})
          </h6>
          <div className="row g-3">
            {puertasRecinto.map((puerta, idx) => (
              <div key={idx} className="col-md-6">
                <div className="p-3 rounded-4 border h-100" style={{ background: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <div className="d-flex align-items-center gap-2 text-warning fw-bold mb-2">
                    <i className="bi bi-signpost-fill"></i> {puerta.nombre}
                  </div>
                  <p className="text-muted small mb-2">
                    Acceso designado para: <strong className="text-light">{puerta.sectores}</strong>.
                  </p>
                  <div className="badge bg-primary bg-opacity-20 text-info border border-info border-opacity-30">
                    Apertura estimada: {puerta.apertura || `${evento.hora || '18:00'} hrs`}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-4 mt-3 border" style={{ background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.15)' }}>
            <div className="small text-muted d-flex align-items-center gap-2">
              <i className="bi bi-shield-lock-fill text-primary fs-5"></i>
              <span>
                <strong>Control de Seguridad Oficial:</strong> Llega con anticipación y ten listo tu pase digital en tu teléfono celular para el escaneo de código QR.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
