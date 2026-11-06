// ========================================================
// PÁGINA: MISTICKETSPAGE (Historial de Pases Adquiridos)
// Métricas resumidas en Bs, vista rápida de pases con QR y diseño responsive
// ========================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerCompras } from '../services/storage';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/common/EmptyState';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import Modal from '../components/common/Modal';
import TicketPass from '../components/TicketPass';
import { formatBs, formatDate } from '../utils/formatters';

export default function MisTicketsPage() {
  const { usuario } = useAuth();
  const [compras, setCompras] = useState([]);
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);

  useEffect(() => {
    const todasLasCompras = obtenerCompras();
    if (usuario) {
      const mis = todasLasCompras.filter(c => Number(c.usuario_id) === Number(usuario.id));
      setCompras(mis);
    } else {
      setCompras(todasLasCompras);
    }
  }, [usuario]);

  const totalInvertido = compras.reduce((acc, c) => acc + (Number(c.total) || 0), 0);
  const totalPases = compras.reduce((acc, c) => acc + (Number(c.cantidad) || 0), 0);

  return (
    <div className="container py-4">
      {/* Encabezado con componente modular */}
      <PageHeader
        title="Mis Pases Digitales"
        subtitle={usuario ? `Pases asociados a ${usuario.nombre || usuario.username}` : 'Mostrando pases emitidos en el sistema'}
        badgeText="Billetera Digital Oficial"
        badgeVariant="primary"
        badgeIcon="bi-wallet2"
        actions={
          <Link to="/" className="btn-modern-outline btn-sm text-decoration-none">
            <i className="bi bi-compass text-primary me-1"></i> Explorar Más Conciertos
          </Link>
        }
      />

      {/* Métricas del usuario si tiene pases */}
      {compras.length > 0 && (
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <StatCard
              label="TOTAL PASES ADQUIRIDOS"
              value={`${totalPases} Entrada${totalPases !== 1 ? 's' : ''}`}
              subtext="Válidas para ingreso con código QR"
              icon="bi-ticket-perforated-fill"
              variant="primary"
            />
          </div>
          <div className="col-md-6">
            <StatCard
              label="TOTAL INVERTIDO"
              value={formatBs(totalInvertido)}
              subtext="Moneda oficial bolivianos (Bs)"
              icon="bi-cash-coin"
              variant="emerald"
            />
          </div>
        </div>
      )}

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
                      {formatDate(compra.fecha_compra)}
                    </span>
                  </div>

                  <h5 className="fw-bold text-white mb-2 line-clamp-1">{compra.evento_nombre}</h5>

                  <div className="small text-muted mb-4 d-flex flex-column gap-1">
                    <div><i className="bi bi-calendar3 me-2 text-primary"></i> {compra.evento_fecha} &bull; {compra.evento_hora} hrs</div>
                    <div className="text-truncate"><i className="bi bi-geo-alt me-2 text-danger"></i> {compra.evento_lugar}</div>
                  </div>

                  <div className="p-3 rounded-3 mb-3 d-flex justify-content-between align-items-center"
                       style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div>
                      <small className="text-dim d-block" style={{ fontSize: '0.7rem' }}>CANTIDAD</small>
                      <strong className="text-light">{compra.cantidad} Pase(s)</strong>
                    </div>
                    <div className="text-end">
                      <small className="text-dim d-block" style={{ fontSize: '0.7rem' }}>TOTAL PAGADO</small>
                      <strong className="text-emerald">{formatBs(compra.total)}</strong>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center pt-3 border-top gap-2" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                  <button
                    type="button"
                    onClick={() => setTicketSeleccionado(compra)}
                    className="btn btn-sm btn-modern-outline flex-grow-1"
                    title="Vista Rápida del QR"
                  >
                    <i className="bi bi-eye me-1"></i> Vista Rápida
                  </button>

                  <Link to={`/ticket/${compra.id}`} className="btn-modern-primary btn-sm text-decoration-none px-3">
                    Pase <i className="bi bi-qr-code ms-1"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="bi-ticket-perforated"
          title="No tienes entradas adquiridas aún"
          description="Explora la cartelera oficial y asegura tu lugar en los próximos conciertos en estadios de Bolivia."
          actionText="Explorar Cartelera de Conciertos"
          actionTo="/"
        />
      )}

      {/* Modal de Vista Rápida del Pase */}
      <Modal
        isOpen={Boolean(ticketSeleccionado)}
        onClose={() => setTicketSeleccionado(null)}
        title="Vista Rápida de Entrada Digital"
        icon="bi-qr-code-scan text-info"
        maxWidth="640px"
      >
        {ticketSeleccionado && (
          <div>
            <TicketPass compra={ticketSeleccionado} />
            <div className="d-flex justify-content-end gap-2 mt-3">
              <Link to={`/ticket/${ticketSeleccionado.id}`} className="btn btn-sm btn-modern-primary">
                Ver Pantalla Completa & Imprimir
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
