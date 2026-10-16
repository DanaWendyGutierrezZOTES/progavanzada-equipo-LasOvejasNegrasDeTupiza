// ========================================================
// COMPONENTE: MAPARECINTO (GOOGLE MAPS & DISTRIBUCIÓN DE ESTADIO)
// Integra:
// 1. Google Maps Oficial (conmutador entre Satelital HD y Callejero)
// 2. Esquema Geográfico del Estadio (Curvas, Preferencia, General, VIP y Cancha)
// 3. Guía de Accesos y Puertas de Entrada Oficiales
// ========================================================

import React, { useState } from 'react';

export default function MapaRecinto({ evento, onSeleccionarZona, zonaSeleccionadaId }) {
  const [pestañaActiva, setPestañaActiva] = useState('estadio'); // 'estadio', 'googlemaps', 'accesos'
  const [tipoGoogleMap, setTipoGoogleMap] = useState('k'); // 'k' = Satélite HD, 'm' = Callejero, 'h' = Híbrido

  const lat = evento.lat || -16.4994;
  const lng = evento.lng || -68.1225;
  const nombreLugar = evento.estadio_nombre || evento.lugar;

  // URL oficial de Google Maps Embed con soporte para satélite y vista normal
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${lat},${lng}&hl=es&z=17&t=${tipoGoogleMap}&output=embed`;
  const googleMapsDirectUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${nombreLugar}, ${evento.ciudad || 'Bolivia'}`)}`;
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  const sectores = evento.sectores_geograficos || [
    { id: 'vip', nombre: 'VIP Front Stage', ubicacion_estadio: 'Frente al Escenario', puerta: 'Puerta 1 - Alfombra Roja', color: '#f59e0b', precio: 450, capacidad: 800 },
    { id: 'cancha', nombre: 'Cancha General / Campo', ubicacion_estadio: 'Césped Central', puerta: 'Puertas 2 y 3 - Rampa Sur', color: '#6366f1', precio: 220, capacidad: 4000 },
    { id: 'preferencial', nombre: 'Tribuna Preferencial (Occidente)', ubicacion_estadio: 'Sector Occidental', puerta: 'Puerta 4 - Palcos y Butacas', color: '#38bdf8', precio: 280, capacidad: 1500 },
    { id: 'general', nombre: 'Tribuna General (Oriente)', ubicacion_estadio: 'Sector Oriental', puerta: 'Puerta 7 - Calle Sanjinés', color: '#10b981', precio: 180, capacidad: 2000 },
    { id: 'curva_norte', nombre: 'Curva Norte', ubicacion_estadio: 'Cabecera Norte', puerta: 'Puerta 9 - Av. del Ejército', color: '#ec4899', precio: 140, capacidad: 1200 },
    { id: 'curva_sur', nombre: 'Curva Sur', ubicacion_estadio: 'Cabecera Sur', puerta: 'Puerta 12 - Calle Carrasco', color: '#8b5cf6', precio: 140, capacidad: 1200 }
  ];

  return (
    <div className="glass-panel p-4 mb-4 position-relative overflow-hidden">
      {/* Encabezado con información del Estadio y Selector de Pestañas */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3 border-bottom pb-3" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge rounded-pill bg-danger bg-opacity-25 text-danger border border-danger border-opacity-50 px-2 py-1 small">
              <i className="bi bi-geo-alt-fill me-1"></i> Google Maps Certificado
            </span>
            <span className="text-dim small">• {evento.capacidad_estadio || 'Recinto de Gran Capacidad'}</span>
          </div>
          <h5 className="fw-bold text-white mb-0">
            {evento.estadio_nombre || evento.lugar}
          </h5>
        </div>

        {/* Botones de navegación interna */}
        <div className="d-flex gap-1 p-1 rounded-pill" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button
            onClick={() => setPestañaActiva('estadio')}
            className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold ${pestañaActiva === 'estadio' ? 'btn-modern-primary' : 'btn-link text-muted text-decoration-none'}`}
          >
            <i className="bi bi-diagram-3 me-1"></i> Zonas del Estadio
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
            <i className="bi bi-signpost-2 me-1"></i> Accesos y Puertas
          </button>
        </div>
      </div>

      {/* ========================================================
          1. DISTRIBUCIÓN GEOGRÁFICA DEL ESTADIO PARA EL CONCIERTO
         ======================================================== */}
      {pestañaActiva === 'estadio' && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="text-muted small mb-0">
              <i className="bi bi-info-circle text-info me-1"></i>
              Haz clic sobre cualquier sector geográfico o tribuna para seleccionarlo y ver su puerta de acceso:
            </p>
            <span className="badge rounded-pill bg-dark border border-secondary text-light px-3 py-1 small">
              Orientación: Norte arriba
            </span>
          </div>

          {/* Blueprint del Estadio */}
          <div className="stadium-layout-container p-4 rounded-4 mb-4 position-relative text-center overflow-hidden"
               style={{
                 background: 'radial-gradient(ellipse at center, #0f172a 0%, #060913 100%)',
                 border: '1px solid rgba(255, 255, 255, 0.12)',
                 boxShadow: 'inset 0 0 50px rgba(0, 0, 0, 0.8)'
               }}>
            
            {/* Cabecera / Curva Norte */}
            <div className="mb-3 max-w-md mx-auto" style={{ maxWidth: '420px' }}>
              <div
                onClick={() => {
                  const ticket = evento.tipos_ticket?.find(t => t.nombre.toLowerCase().includes('curva') || t.nombre.toLowerCase().includes('general'));
                  onSeleccionarZona && ticket && onSeleccionarZona(ticket.id);
                }}
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
                  Puerta 9 &bull; Acceso Av. del Ejército &bull; Bs. {sectores.find(s => s.id === 'curva_norte')?.precio || 140}
                </div>
              </div>
            </div>

            {/* Cuerpo Central del Estadio: Tribuna Oeste (Preferencia) - Cancha / Césped - Tribuna Este (General) */}
            <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
              
              {/* Tribuna Preferencial (Occidente) */}
              <div
                onClick={() => {
                  const ticket = evento.tipos_ticket?.find(t => t.nombre.toLowerCase().includes('preferen') || t.nombre.toLowerCase().includes('platea'));
                  onSeleccionarZona && ticket && onSeleccionarZona(ticket.id);
                }}
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
                <div className="mt-2 fw-extrabold text-info">Bs. {sectores.find(s => s.id === 'preferencial')?.precio || 280}</div>
                <div className="text-dim mt-1" style={{ fontSize: '0.7rem' }}>Puerta 4 Saavedra</div>
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
                  onClick={() => {
                    const ticket = evento.tipos_ticket?.find(t => t.nombre.toLowerCase().includes('vip'));
                    onSeleccionarZona && ticket && onSeleccionarZona(ticket.id);
                  }}
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
                    <span className="fw-bold text-warning fs-6">Bs. {sectores.find(s => s.id === 'vip')?.precio || 450}</span>
                  </div>
                </div>

                {/* Zona Cancha General / Césped */}
                <div
                  onClick={() => {
                    const ticket = evento.tipos_ticket?.find(t => t.nombre.toLowerCase().includes('cancha'));
                    onSeleccionarZona && ticket && onSeleccionarZona(ticket.id);
                  }}
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
                    <span className="fw-bold fs-6" style={{ color: '#818cf8' }}>Bs. {sectores.find(s => s.id === 'cancha')?.precio || 220}</span>
                  </div>
                </div>
              </div>

              {/* Tribuna General (Oriente) */}
              <div
                onClick={() => {
                  const ticket = evento.tipos_ticket?.find(t => t.nombre.toLowerCase().includes('general') && !t.nombre.toLowerCase().includes('cancha'));
                  onSeleccionarZona && ticket && onSeleccionarZona(ticket.id);
                }}
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
                <div className="mt-2 fw-extrabold text-success">Bs. {sectores.find(s => s.id === 'general')?.precio || 180}</div>
                <div className="text-dim mt-1" style={{ fontSize: '0.7rem' }}>Puerta 7 Sanjinés</div>
              </div>
            </div>

            {/* Cabecera / Curva Sur */}
            <div className="mt-3 max-w-md mx-auto" style={{ maxWidth: '420px' }}>
              <div
                onClick={() => {
                  const ticket = evento.tipos_ticket?.find(t => t.nombre.toLowerCase().includes('curva') || t.nombre.toLowerCase().includes('general'));
                  onSeleccionarZona && ticket && onSeleccionarZona(ticket.id);
                }}
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
                  Puerta 12 &bull; Acceso Calle Carrasco &bull; Bs. {sectores.find(s => s.id === 'curva_sur')?.precio || 140}
                </div>
              </div>
            </div>
          </div>

          {/* Listado de Sectores Geográficos Resumidos */}
          <div className="row row-cols-2 row-cols-md-3 g-2">
            {sectores.map((sec) => (
              <div key={sec.id} className="col">
                <div className="p-2 rounded-3 border" style={{ background: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                  <div className="d-flex align-items-center gap-2">
                    <span className="rounded-circle p-1" style={{ backgroundColor: sec.color, width: '10px', height: '10px' }}></span>
                    <span className="fw-bold text-white small text-truncate">{sec.nombre}</span>
                  </div>
                  <div className="text-muted d-flex justify-content-between align-items-center mt-1" style={{ fontSize: '0.75rem' }}>
                    <span>{sec.puerta}</span>
                    <span className="fw-bold text-info">Bs. {sec.precio}</span>
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
                <i className="bi bi-box-arrow-up-right me-1"></i> Abrir en App Google Maps
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
              <span className="text-info">{evento.ciudad || 'Bolivia'}</span>
            </div>
          </div>

          <p className="text-muted small text-center mt-2 mb-0">
            <i className="bi bi-check-circle-fill text-success me-1"></i>
            Geolocalización satelital provista por <strong>Google Maps</strong>. Muestra la infraestructura real del estadio, calles aledañas y accesos peatonales.
          </p>
        </div>
      )}

      {/* ========================================================
          3. GUÍA DE ACCESOS Y PUERTAS DE INGRESO
         ======================================================== */}
      {pestañaActiva === 'accesos' && (
        <div>
          <h6 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
            <i className="bi bi-door-open-fill text-warning"></i> Puertas y Accesos Recomendados
          </h6>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="p-3 rounded-4 border h-100" style={{ background: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                <div className="d-flex align-items-center gap-2 text-warning fw-bold mb-2">
                  <i className="bi bi-star-fill"></i> Acceso Preferencial & VIP Front Stage
                </div>
                <p className="text-muted small mb-2">
                  Ingreso exclusivo por <strong>Puerta 1 y Puerta 4 (Avenida Principal / Saavedra)</strong>.
                  Presenta tu código QR digital directamente desde tu teléfono móvil.
                </p>
                <div className="badge bg-warning text-dark">Apertura: {evento.hora || '18:00'} hrs</div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-3 rounded-4 border h-100" style={{ background: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                <div className="d-flex align-items-center gap-2 text-info fw-bold mb-2">
                  <i className="bi bi-people-fill"></i> Acceso Cancha General y Curvas
                </div>
                <p className="text-muted small mb-2">
                  Ingreso por <strong>Puertas 2, 3 (Rampas Sur) y Puertas 9 / 12 (Cabeceras)</strong>.
                  Recomendamos llegar 45 minutos antes del inicio del espectáculo.
                </p>
                <div className="badge bg-info text-dark">Control de Seguridad en Anillo Externo</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
