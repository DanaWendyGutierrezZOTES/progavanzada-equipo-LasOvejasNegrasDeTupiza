// ========================================================
// COMPONENTE: MAPARECINTO (MAPA GEOGRÁFICO Y DISTRIBUCIÓN DE ZONAS)
// Permite al comprador ver:
// 1. Dónde queda ubicado el recinto en el mapa (Geolocalización)
// 2. Cómo se distribuyen las zonas frente al escenario (VIP, Cancha, Platea)
// ========================================================

import React, { useState } from 'react';

export default function MapaRecinto({ evento, onSeleccionarZona, zonaSeleccionadaId }) {
  const [pestañaActiva, setPestañaActiva] = useState('zonas'); // 'zonas' o 'ubicacion'

  // URL para el mapa interactivo de OpenStreetMap
  const lat = evento.lat || -16.4994;
  const lng = evento.lng || -68.1225;
  const mapaUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.008}%2C${lat - 0.006}%2C${lng + 0.008}%2C${lat + 0.006}&layer=mapnik&marker=${lat}%2C${lng}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(evento.ubicacion_mapa || evento.lugar)}`;

  return (
    <div className="glass-panel p-4 mb-4">
      {/* Selector de Pestañas: Distribución de Zonas vs Ubicación GPS */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2 border-bottom pb-3" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
        <h5 className="fw-bold text-white mb-0 d-flex align-items-center gap-2">
          <i className="bi bi-geo-alt-fill text-danger"></i>
          <span>Mapa del Concierto & Ubicación</span>
        </h5>

        <div className="d-flex gap-1 p-1 rounded-pill" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
          <button
            onClick={() => setPestañaActiva('zonas')}
            className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold ${pestañaActiva === 'zonas' ? 'btn-modern-primary' : 'btn-link text-muted text-decoration-none'}`}
          >
            <i className="bi bi-layers me-1"></i> Zonas del Escenario
          </button>
          <button
            onClick={() => setPestañaActiva('ubicacion')}
            className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold ${pestañaActiva === 'ubicacion' ? 'btn-modern-primary' : 'btn-link text-muted text-decoration-none'}`}
          >
            <i className="bi bi-map me-1"></i> Ubicación en Mapa
          </button>
        </div>
      </div>

      {/* 1. DISTRIBUCIÓN VISUAL DE ZONAS FRENTE AL ESCENARIO */}
      {pestañaActiva === 'zonas' && (
        <div>
          <p className="text-muted small mb-3">
            Haz clic en una zona para ver su ubicación con respecto al escenario y conocer su precio en Bs:
          </p>

          <div className="p-4 rounded-4 text-center position-relative overflow-hidden mb-3"
               style={{ background: 'linear-gradient(180deg, #0f172a 0%, #090d16 100%)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            
            {/* ESCENARIO / STAGE */}
            <div className="py-2 px-4 rounded-pill mx-auto mb-4 fw-extrabold text-uppercase text-dark d-inline-block shadow-lg"
                 style={{ background: 'linear-gradient(90deg, #38bdf8, #818cf8, #38bdf8)', letterSpacing: '3px', fontSize: '0.85rem' }}>
              🎤 ESCENARIO PRINCIPAL / STAGE
            </div>

            {/* ZONAS DEL RECINTO */}
            <div className="d-flex flex-column gap-3 max-w-lg mx-auto" style={{ maxWidth: '480px', margin: '0 auto' }}>
              
              {/* ZONA 1: VIP FRONT STAGE */}
              <div
                onClick={() => onSeleccionarZona && onSeleccionarZona(evento.tipos_ticket?.[2]?.id || evento.tipos_ticket?.[0]?.id)}
                className={`p-3 rounded-3 border transition-all cursor-pointer ${zonaSeleccionadaId === evento.tipos_ticket?.[2]?.id ? 'border-warning shadow-lg' : ''}`}
                style={{
                  cursor: 'pointer',
                  background: 'rgba(245, 158, 11, 0.15)',
                  borderColor: 'rgba(245, 158, 11, 0.4)'
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div className="text-start">
                    <span className="badge bg-warning text-dark fw-bold mb-1">ZONA VIP / FRONT STAGE</span>
                    <div className="small text-white">Frente al escenario &bull; Acceso Preferencial</div>
                  </div>
                  <div className="text-end">
                    <span className="fw-bold fs-6" style={{ color: '#f59e0b' }}>
                      Bs. {evento.tipos_ticket?.[2]?.precio || evento.tipos_ticket?.[0]?.precio}
                    </span>
                  </div>
                </div>
              </div>

              {/* ZONA 2: CANCHA GENERAL / CAMPO */}
              <div
                onClick={() => onSeleccionarZona && onSeleccionarZona(evento.tipos_ticket?.[0]?.id)}
                className={`p-3 rounded-3 border transition-all cursor-pointer ${zonaSeleccionadaId === evento.tipos_ticket?.[0]?.id ? 'border-primary shadow-lg' : ''}`}
                style={{
                  cursor: 'pointer',
                  background: 'rgba(99, 102, 241, 0.15)',
                  borderColor: 'rgba(99, 102, 241, 0.4)'
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div className="text-start">
                    <span className="badge bg-primary text-white fw-bold mb-1">CANCHA GENERAL</span>
                    <div className="small text-white">Área central &bull; De pie con vista directa</div>
                  </div>
                  <div className="text-end">
                    <span className="fw-bold fs-6" style={{ color: '#818cf8' }}>
                      Bs. {evento.tipos_ticket?.[0]?.precio}
                    </span>
                  </div>
                </div>
              </div>

              {/* ZONA 3: PLATEA / GRADERÍAS */}
              {evento.tipos_ticket?.[1] && (
                <div
                  onClick={() => onSeleccionarZona && onSeleccionarZona(evento.tipos_ticket?.[1]?.id)}
                  className={`p-3 rounded-3 border transition-all cursor-pointer ${zonaSeleccionadaId === evento.tipos_ticket?.[1]?.id ? 'border-info shadow-lg' : ''}`}
                  style={{
                    cursor: 'pointer',
                    background: 'rgba(6, 182, 212, 0.15)',
                    borderColor: 'rgba(6, 182, 212, 0.4)'
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-start">
                      <span className="badge bg-info text-dark fw-bold mb-1">PLATEA / GRADERÍAS</span>
                      <div className="small text-white">Asientos numerados con vista panorámica</div>
                    </div>
                    <div className="text-end">
                      <span className="fw-bold fs-6" style={{ color: '#38bdf8' }}>
                        Bs. {evento.tipos_ticket?.[1]?.precio}
                      </span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* 2. MAPA GEOGRÁFICO INTERACTIVO */}
      {pestañaActiva === 'ubicacion' && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-muted small">
              <i className="bi bi-pin-map text-danger me-1"></i> {evento.lugar}
            </span>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-modern-outline btn-sm py-1 px-3 text-info"
            >
              <i className="bi bi-box-arrow-up-right me-1"></i> Abrir en Google Maps
            </a>
          </div>

          <div className="rounded-4 overflow-hidden border" style={{ height: '280px', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <iframe
              title={`Mapa de ${evento.nombre}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src={mapaUrl}
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
