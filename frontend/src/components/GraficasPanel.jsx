// ========================================================
// COMPONENTE: GRAFICASPANEL
// Gráficas visuales del dashboard: ventas por evento,
// ingresos por categoría y progreso de ocupación.
// Implementado con Canvas nativo (sin librerías extra).
// ========================================================

import React, { useRef, useEffect, useMemo } from 'react';
import { formatBs } from '../utils/formatters';

// ── Gráfico de Barras Horizontal (Canvas nativo) ─────────────────────────────
function GraficaBarras({ datos, titulo, colorBarra = '#6366f1', colorTexto = '#b0c4d8' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !datos || datos.length === 0) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const paddingLeft = 160;
    const paddingRight = 80;
    const paddingTop = 24;
    const paddingBot = 24;
    const maxVal = Math.max(...datos.map(d => d.valor), 1);
    const barH = Math.floor((H - paddingTop - paddingBot) / datos.length) - 6;

    ctx.clearRect(0, 0, W, H);

    datos.forEach((d, i) => {
      const y = paddingTop + i * (barH + 6);
      const barW = Math.max(4, ((d.valor / maxVal) * (W - paddingLeft - paddingRight)));

      // Fondo barra
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.beginPath();
      ctx.roundRect(paddingLeft, y, W - paddingLeft - paddingRight, barH, 4);
      ctx.fill();

      // Barra de valor
      const grad = ctx.createLinearGradient(paddingLeft, 0, paddingLeft + barW, 0);
      grad.addColorStop(0, colorBarra);
      grad.addColorStop(1, colorBarra + '99');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(paddingLeft, y, barW, barH, 4);
      ctx.fill();

      // Etiqueta izquierda (nombre)
      ctx.fillStyle = colorTexto;
      ctx.font = `600 11px 'Plus Jakarta Sans', system-ui, sans-serif`;
      ctx.textAlign = 'right';
      ctx.fillText(
        d.label.length > 20 ? d.label.substring(0, 20) + '…' : d.label,
        paddingLeft - 8,
        y + barH / 2 + 4
      );

      // Valor derecho
      ctx.fillStyle = '#f1f5f9';
      ctx.font = `700 11px 'Plus Jakarta Sans', system-ui, sans-serif`;
      ctx.textAlign = 'left';
      ctx.fillText(d.etiqueta || d.valor, paddingLeft + barW + 8, y + barH / 2 + 4);
    });
  }, [datos, colorBarra, colorTexto]);

  return (
    <div>
      {titulo && <h6 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">{titulo}</h6>}
      <canvas
        ref={canvasRef}
        width={520}
        height={Math.max(120, datos.length * 42 + 48)}
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  );
}

// ── Gráfico Dona (Canvas nativo) ───────────────────────────────────────────────
function GraficaDona({ datos, titulo }) {
  const canvasRef = useRef(null);
  const COLORES = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#a855f7'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !datos || datos.length === 0) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const outerR = Math.min(cx, cy) - 16;
    const innerR = outerR * 0.58;
    const total = datos.reduce((s, d) => s + d.valor, 0) || 1;

    ctx.clearRect(0, 0, W, H);

    let startAngle = -Math.PI / 2;
    datos.forEach((d, i) => {
      const slice = (d.valor / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, outerR, startAngle, startAngle + slice);
      ctx.closePath();
      ctx.fillStyle = COLORES[i % COLORES.length];
      ctx.fill();
      startAngle += slice;
    });

    // Hueco interior
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, 2 * Math.PI);
    ctx.fillStyle = '#111827';
    ctx.fill();

    // Texto central
    ctx.fillStyle = '#f1f5f9';
    ctx.font = `700 18px 'Plus Jakarta Sans', system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(total.toLocaleString(), cx, cy + 4);
    ctx.font = `500 10px 'Plus Jakarta Sans', system-ui, sans-serif`;
    ctx.fillStyle = '#8899b0';
    ctx.fillText('Total', cx, cy + 18);
  }, [datos]);

  return (
    <div>
      {titulo && <h6 className="fw-bold text-white mb-2">{titulo}</h6>}
      <div className="d-flex align-items-center gap-4 flex-wrap">
        <canvas
          ref={canvasRef}
          width={180}
          height={180}
          style={{ flex: '0 0 auto', width: '160px', height: '160px' }}
        />
        <div className="d-flex flex-column gap-2 flex-grow-1">
          {datos.map((d, i) => (
            <div key={i} className="d-flex align-items-center gap-2">
              <span
                className="rounded-circle flex-shrink-0"
                style={{ width: '10px', height: '10px', backgroundColor: ['#6366f1','#06b6d4','#10b981','#f59e0b','#ec4899','#a855f7'][i % 6] }}
              />
              <span className="small text-muted flex-grow-1 text-truncate">{d.label}</span>
              <span className="small fw-bold text-white">{d.etiqueta || d.valor}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Componente principal exportado ────────────────────────────────────────────
export default function GraficasPanel({ eventos, compras }) {
  // Datos para gráfica 1: Ventas por evento (top 6)
  const ventasPorEvento = useMemo(() => {
    const mapa = {};
    compras.forEach(c => {
      const nombre = c.evento_nombre || 'Sin nombre';
      mapa[nombre] = (mapa[nombre] || 0) + Number(c.cantidad || 0);
    });
    return Object.entries(mapa)
      .map(([label, valor]) => ({ label, valor, etiqueta: `${valor} pases` }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 6);
  }, [compras]);

  // Datos para gráfica 2: Ingresos por categoría
  const ingresosPorCategoria = useMemo(() => {
    const mapa = {};
    eventos.forEach(ev => {
      const cat = ev.categoria || 'Sin categoría';
      const vendidos = compras
        .filter(c => Number(c.evento_id) === Number(ev.id))
        .reduce((s, c) => s + Number(c.total || 0), 0);
      mapa[cat] = (mapa[cat] || 0) + vendidos;
    });
    return Object.entries(mapa)
      .filter(([, v]) => v > 0)
      .map(([label, valor]) => ({ label, valor, etiqueta: formatBs(valor) }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 6);
  }, [eventos, compras]);

  // Datos para gráfica 3: Ocupación por evento (dona)
  const ocupacionDona = useMemo(() => {
    return eventos
      .filter(ev => ev.tipos_ticket && ev.tipos_ticket.length > 0)
      .map(ev => {
        const total = ev.tipos_ticket.reduce((s, t) => s + Number(t.cantidad_total || 0), 0);
        const disp = ev.tipos_ticket.reduce((s, t) => s + Number(t.cantidad_disponible || 0), 0);
        return { label: ev.nombre, valor: Math.max(0, total - disp), etiqueta: `${Math.max(0, total - disp)} vendidos` };
      })
      .filter(d => d.valor > 0)
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 5);
  }, [eventos]);

  const hayDatos = compras.length > 0 || eventos.length > 0;

  if (!hayDatos) return null;

  return (
    <div className="mb-5">
      <div className="d-flex align-items-center gap-2 mb-4">
        <i className="bi bi-graph-up-arrow text-info fs-5"></i>
        <h5 className="fw-bold text-white mb-0">Análisis Gráfico de Ventas</h5>
        <span className="badge rounded-pill bg-info bg-opacity-20 text-info border border-info border-opacity-25 px-2 py-1 small">
          Tiempo real
        </span>
      </div>

      <div className="row g-4">
        {/* Gráfica 1: Ventas por Evento */}
        {ventasPorEvento.length > 0 && (
          <div className="col-lg-6">
            <div className="glass-panel p-4 h-100">
              <GraficaBarras
                datos={ventasPorEvento}
                titulo={<><i className="bi bi-ticket-perforated text-primary me-2"></i>Pases Vendidos por Concierto</>}
                colorBarra="#6366f1"
              />
            </div>
          </div>
        )}

        {/* Gráfica 2: Ingresos por Categoría */}
        {ingresosPorCategoria.length > 0 && (
          <div className="col-lg-6">
            <div className="glass-panel p-4 h-100">
              <GraficaBarras
                datos={ingresosPorCategoria}
                titulo={<><i className="bi bi-cash-coin text-emerald me-2" style={{color:'#34d399'}}></i>Recaudación por Género (Bs)</>}
                colorBarra="#10b981"
              />
            </div>
          </div>
        )}

        {/* Gráfica 3: Ocupación tipo dona */}
        {ocupacionDona.length > 0 && (
          <div className="col-lg-5">
            <div className="glass-panel p-4 h-100">
              <GraficaDona
                datos={ocupacionDona}
                titulo={<><i className="bi bi-pie-chart-fill text-warning me-2" style={{color:'#fbbf24'}}></i>Ocupación por Evento</>}
              />
            </div>
          </div>
        )}

        {/* Gráfica 4: Resumen rápido */}
        <div className={`col-lg-${ocupacionDona.length > 0 ? '7' : '12'}`}>
          <div className="glass-panel p-4 h-100">
            <h6 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-lightning-charge-fill text-warning" style={{color:'#fbbf24'}}></i>
              Resumen Rápido del Sistema
            </h6>
            <div className="row g-3">
              {[
                {
                  label: 'Evento con más pases vendidos',
                  valor: ventasPorEvento[0]?.label || '—',
                  sub: ventasPorEvento[0] ? `${ventasPorEvento[0].valor} pases` : 'Sin datos',
                  color: '#818cf8', icon: 'bi-trophy-fill'
                },
                {
                  label: 'Categoría más rentable',
                  valor: ingresosPorCategoria[0]?.label || '—',
                  sub: ingresosPorCategoria[0] ? formatBs(ingresosPorCategoria[0].valor) : 'Sin datos',
                  color: '#34d399', icon: 'bi-currency-dollar'
                },
                {
                  label: 'Total pases emitidos',
                  valor: compras.reduce((s, c) => s + Number(c.cantidad || 0), 0).toLocaleString(),
                  sub: `en ${new Set(compras.map(c => c.evento_id)).size} eventos`,
                  color: '#38bdf8', icon: 'bi-qr-code'
                },
                {
                  label: 'Eventos con entradas activas',
                  valor: eventos.filter(ev =>
                    (ev.tipos_ticket || []).some(t => Number(t.cantidad_disponible) > 0)
                  ).length,
                  sub: `de ${eventos.length} publicados`,
                  color: '#fbbf24', icon: 'bi-calendar-check-fill'
                },
              ].map((item, i) => (
                <div key={i} className="col-sm-6">
                  <div className="p-3 rounded-4 border h-100"
                    style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <i className={`bi ${item.icon}`} style={{ color: item.color, fontSize: '1rem' }}></i>
                      <span className="text-dim small">{item.label}</span>
                    </div>
                    <div className="fw-bold text-white" style={{ fontSize: '1.05rem' }}>{item.valor}</div>
                    <div className="text-muted small mt-1">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
