// ========================================================
// PÁGINA: MISTICKETSPAGE (DISEÑO MODERNO 2026)
// Historial de pases digitales adquiridos con diseño de tarjetas
// ========================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerCompras } from '../services/storage';
import { useAuth } from '../context/AuthContext';

export default function MisTicketsPage() {
  const { usuario } = useAuth();
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    const todasLasCompras = obtenerCompras();
    if (usuario) {
      const mis = todasLasCompras.filter(c => Number(c.usuario_id) === Number(usuario.id));
      setCompras(mis);
    } else {
      setCompras(todasLasCompras);
    }
  }, [usuario]);

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-extrabold text-white mb-1">Mis Pases Digitales</h2>
          <p className="text-muted small mb-0">
            {usuario ? `Pases asociados a ${usuario.nombre || usuario.username}` : 'Mostrando pases emitidos en el sistema'}
          </p>
        </div>
        <Link to="/" className="btn-modern-outline btn-sm text-decoration-none">
          <i className="bi bi-plus-circle text-primary"></i> Explorar Más Eventos
        </Link>
      </div>

      {compras.length > 0 ? (
        <div className="row g-4">
          {compras.map((compra) => (
            <div key={compra.id} className="col-md-6 col-lg-4">
              <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-between glass-panel-hover">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <span className="badge rounded-pill px-3 py-1 small"
                          style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                      {compra.tipo_ticket_nombre}
                    </span>
                    <span className="text-dim small">
                      {new Date(compra.fecha_compra).toLocaleDateString('es-ES')}
                    </span>
                  </div>

                  <h5 className="fw-bold text-white mb-2 line-clamp-1">{compra.evento_nombre}</h5>

                  <div className="small text-muted mb-4 d-flex flex-column gap-1">
                    <div><i className="bi bi-calendar3 me-2 text-primary"></i> {compra.evento_fecha} &bull; {compra.evento_hora} hrs</div>
                    <div><i className="bi bi-geo-alt me-2 text-danger"></i> {compra.evento_lugar}</div>
                  </div>

                  <div className="p-3 rounded-3 mb-3 d-flex justify-content-between align-items-center"
                       style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div>
                      <small className="text-dim d-block" style={{ fontSize: '0.7rem' }}>CANTIDAD</small>
                      <strong className="text-light">{compra.cantidad} Pase(s)</strong>
                    </div>
                    <div className="text-end">
                      <small className="text-dim d-block" style={{ fontSize: '0.7rem' }}>TOTAL PAGADO</small>
                      <strong className="text-emerald">${Number(compra.total).toLocaleString('es-ES')}</strong>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center pt-3 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                  <span className="font-monospace small text-dim">{compra.codigo_ticket}</span>
                  <Link to={`/ticket/${compra.id}`} className="btn-modern-primary btn-sm text-decoration-none">
                    Ver Pase <i className="bi bi-qr-code ms-1"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel text-center py-5 p-4">
          <i className="bi bi-ticket-perforated text-muted fs-1 mb-3"></i>
          <h4 className="fw-bold text-white">No tienes entradas adquiridas</h4>
          <p className="text-muted small">Explora la cartelera y asegura tu pase para los próximos conciertos.</p>
          <Link to="/" className="btn-modern-primary mt-2 text-decoration-none">
            Explorar Cartelera
          </Link>
        </div>
      )}
    </div>
  );
}
