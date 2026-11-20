// ========================================================
// COMPONENTE: EVENTCAROUSEL (Carrusel de Conciertos Destacados)
// Carrusel cinemático interactivo con transiciones suaves,
// soporte táctil, autoplay inteligente y enlaces directos a boletería.
// ========================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { formatBs, formatearFechaLarga } from '../utils/formatters';

export default function EventCarousel({ eventos = [] }) {
  // Filtrar eventos destacados (o los primeros 5 más relevantes)
  const destacados = React.useMemo(() => {
    if (!eventos || eventos.length === 0) return [];
    const conTag = eventos.filter(e => e.destacado);
    return conTag.length >= 3 ? conTag : eventos.slice(0, 5);
  }, [eventos]);

  const [indiceActual, setIndiceActual] = useState(0);
  const [estaPausado, setEstaPausado] = useState(false);
  const timerRef = useRef(null);

  const totalSlides = destacados.length;

  const siguiente = useCallback(() => {
    if (totalSlides === 0) return;
    setIndiceActual(prev => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const anterior = useCallback(() => {
    if (totalSlides === 0) return;
    setIndiceActual(prev => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const irASlide = (idx) => {
    setIndiceActual(idx);
  };

  // Autoplay con temporizador
  useEffect(() => {
    if (totalSlides <= 1 || estaPausado) return;

    timerRef.current = setInterval(() => {
      siguiente();
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [totalSlides, estaPausado, siguiente]);

  if (totalSlides === 0) return null;

  const eventoActual = destacados[indiceActual];
  const esTupiza = eventoActual.ciudad === 'Tupiza' || eventoActual.nombre.includes('Tupiza');

  return (
    <div
      className="carousel-container position-relative mb-5 rounded-4 overflow-hidden shadow-2xl border"
      style={{
        borderColor: 'rgba(255, 255, 255, 0.12)',
        background: '#090d16'
      }}
      onMouseEnter={() => setEstaPausado(true)}
      onMouseLeave={() => setEstaPausado(false)}
    >
      {/* Diapositiva Principal */}
      <div className="carousel-slide position-relative" style={{ minHeight: '440px' }}>
        {/* Fondo con imagen y degradados cinematográficos */}
        <div
          className="carousel-backdrop position-absolute inset-0 w-100 h-100"
          style={{
            backgroundImage: `url(${eventoActual.imagen_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'background-image 0.6s ease-in-out',
            filter: 'brightness(0.55)'
          }}
        />

        {/* Capas de gradiente para legibilidad y elegancia visual */}
        <div
          className="position-absolute inset-0 w-100 h-100"
          style={{
            background: 'linear-gradient(90deg, rgba(9, 13, 22, 0.95) 0%, rgba(9, 13, 22, 0.75) 50%, rgba(9, 13, 22, 0.35) 100%)',
            pointerEvents: 'none'
          }}
        />
        <div
          className="position-absolute bottom-0 start-0 w-100"
          style={{
            height: '140px',
            background: 'linear-gradient(0deg, rgba(9, 13, 22, 0.98) 0%, transparent 100%)',
            pointerEvents: 'none'
          }}
        />

        {/* Contenido del Slide */}
        <div className="position-relative p-4 p-md-5 d-flex flex-column justify-content-between h-100" style={{ zIndex: 3, minHeight: '440px' }}>
          {/* Header del slide: Badges y control de pausa */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <span
                className="badge rounded-pill px-3 py-1 fw-bold text-uppercase"
                style={{
                  background: esTupiza ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  color: '#ffffff',
                  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                  letterSpacing: '0.8px',
                  fontSize: '0.75rem'
                }}
              >
                <i className={esTupiza ? 'bi bi-star-fill me-1' : 'bi bi-fire me-1'}></i>
                {esTupiza ? 'Sede Orgullo Chicheño' : 'Gira Oficial 2026'}
              </span>

              <span className="badge rounded-pill bg-dark border border-secondary text-info px-3 py-1 small">
                <i className="bi bi-geo-alt-fill text-danger me-1"></i> {eventoActual.ciudad}, Bolivia
              </span>

              <span className="badge rounded-pill bg-dark border border-secondary text-muted px-3 py-1 small">
                {eventoActual.categoria}
              </span>
            </div>

            <button
              onClick={() => setEstaPausado(!estaPausado)}
              className="btn btn-sm btn-dark rounded-circle border border-secondary d-none d-md-flex align-items-center justify-content-center"
              style={{ width: '34px', height: '34px', opacity: 0.8 }}
              title={estaPausado ? 'Reanudar carrusel automático' : 'Pausar carrusel'}
            >
              <i className={`bi ${estaPausado ? 'bi-play-fill text-success' : 'bi-pause-fill text-light'}`}></i>
            </button>
          </div>

          {/* Cuerpo del Slide */}
          <div className="my-auto" style={{ maxWidth: '720px' }}>
            <h2
              className="display-5 fw-extrabold text-white mb-2"
              style={{
                fontFamily: "'Outfit', sans-serif",
                letterSpacing: '-0.5px',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.6)'
              }}
            >
              {eventoActual.nombre}
            </h2>

            {eventoActual.subtitulo && (
              <p className="lead text-light text-opacity-90 mb-3" style={{ fontSize: '1.1rem' }}>
                {eventoActual.subtitulo}
              </p>
            )}

            {/* Metadatos rápidos: Fecha, Recinto y Precio */}
            <div className="d-flex flex-wrap align-items-center gap-3 gap-md-4 mb-4 text-white text-opacity-90 small">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-calendar-check-fill text-info fs-5"></i>
                <span>{formatearFechaLarga(eventoActual.fecha)} &bull; {eventoActual.hora || '19:00'}</span>
              </div>

              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-building-fill text-warning fs-5"></i>
                <span>{eventoActual.estadio_nombre || eventoActual.lugar}</span>
              </div>

              <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <span className="text-muted small">Desde</span>
                <span className="fw-extrabold text-emerald fs-6">{formatBs(eventoActual.precio_base)}</span>
              </div>
            </div>

            {/* Botones de Acción Inmediata */}
            <div className="d-flex flex-wrap align-items-center gap-3">
              <Link
                to={`/evento/${eventoActual.id}`}
                className="btn-modern-primary text-decoration-none px-4 py-2"
                style={{ fontSize: '0.95rem' }}
              >
                <i className="bi bi-ticket-perforated-fill me-1"></i> Comprar Entradas
              </Link>

              <Link
                to={`/evento/${eventoActual.id}#recinto-blueprint`}
                className="btn-modern-outline text-decoration-none px-3 py-2 text-info"
                style={{ fontSize: '0.95rem' }}
              >
                <i className="bi bi-map-fill me-1"></i> Zonas & Recinto
              </Link>
            </div>
          </div>

          {/* Footer del Slide: Indicadores y Controles */}
          <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-3" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
            {/* Puntos / Indicadores */}
            <div className="d-flex align-items-center gap-2">
              {destacados.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => irASlide(idx)}
                  className="border-0 p-0 transition-all"
                  style={{
                    width: indiceActual === idx ? '32px' : '10px',
                    height: '8px',
                    borderRadius: '4px',
                    background: indiceActual === idx ? '#6366f1' : 'rgba(255, 255, 255, 0.25)',
                    boxShadow: indiceActual === idx ? '0 0 10px #6366f1' : 'none',
                    cursor: 'pointer'
                  }}
                  title={`Ir a ${item.nombre}`}
                />
              ))}
              <span className="text-muted small ms-2" style={{ fontSize: '0.75rem' }}>
                {indiceActual + 1} de {totalSlides}
              </span>
            </div>

            {/* Flechas de Navegación Anterior / Siguiente */}
            <div className="d-flex align-items-center gap-2">
              <button
                onClick={anterior}
                className="btn btn-sm btn-dark rounded-circle border border-secondary d-flex align-items-center justify-content-center"
                style={{ width: '36px', height: '36px' }}
                aria-label="Anterior concierto"
              >
                <i className="bi bi-chevron-left text-white"></i>
              </button>
              <button
                onClick={siguiente}
                className="btn btn-sm btn-dark rounded-circle border border-secondary d-flex align-items-center justify-content-center"
                style={{ width: '36px', height: '36px' }}
                aria-label="Siguiente concierto"
              >
                <i className="bi bi-chevron-right text-white"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ticker / Miniaturas inferiores de navegación rápida */}
      <div className="d-none d-lg-flex bg-dark bg-opacity-75 border-top p-2 overflow-x-auto" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
        {destacados.map((ev, idx) => {
          const activo = idx === indiceActual;
          return (
            <div
              key={ev.id}
              onClick={() => irASlide(idx)}
              className={`px-3 py-2 rounded-3 cursor-pointer d-flex align-items-center gap-2 transition-all flex-grow-1 ${activo ? 'border border-primary' : 'opacity-75'}`}
              style={{
                background: activo ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                cursor: 'pointer',
                minWidth: '180px'
              }}
            >
              <div
                className="rounded-2"
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundImage: `url(${ev.imagen_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  flexShrink: 0
                }}
              />
              <div className="text-truncate">
                <div className={`small fw-bold text-truncate ${activo ? 'text-white' : 'text-muted'}`} style={{ fontSize: '0.78rem' }}>
                  {ev.nombre}
                </div>
                <div className="text-dim" style={{ fontSize: '0.7rem' }}>
                  {ev.ciudad} &bull; {formatBs(ev.precio_base)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
