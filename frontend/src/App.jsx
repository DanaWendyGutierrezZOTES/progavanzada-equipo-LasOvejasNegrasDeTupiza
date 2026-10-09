// ========================================================
// COMPONENTE PRINCIPAL: APP.JSX
// Configuración de rutas (React Router) y estructura general
// Código limpio y fácil de explicar paso a paso
// ========================================================

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Componentes de Estructura
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Páginas
import EventosPage from './pages/EventosPage';
import DetalleEventoPage from './pages/DetalleEventoPage';
import FormEventoPage from './pages/FormEventoPage';
import GestionarTicketsPage from './pages/GestionarTicketsPage';
import ComprarTicketPage from './pages/ComprarTicketPage';
import TicketDetallePage from './pages/TicketDetallePage';
import MisTicketsPage from './pages/MisTicketsPage';
import PanelOrganizadorPage from './pages/PanelOrganizadorPage';
import LoginPage from './pages/LoginPage';
import RegistroPage from './pages/RegistroPage';

export default function App() {
  return (
    // 1. AuthProvider comparte el estado de autenticación en toda la aplicación
    <AuthProvider>
      {/* 2. BrowserRouter maneja la navegación sin recargar la página */}
      <BrowserRouter>
        {/* Barra de Navegación superior */}
        <Navbar />

        {/* Contenedor principal con las rutas */}
        <main className="flex-grow-1">
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<EventosPage />} />
            <Route path="/evento/:id" element={<DetalleEventoPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegistroPage />} />

            {/* Rutas de Compra y Tickets */}
            <Route path="/comprar/:eventoId/:tipoId" element={<ComprarTicketPage />} />
            <Route path="/ticket/:id" element={<TicketDetallePage />} />
            <Route path="/mis-tickets" element={<MisTicketsPage />} />

            {/* Rutas del Organizador */}
            <Route path="/organizador/panel" element={<PanelOrganizadorPage />} />
            <Route path="/evento/crear" element={<FormEventoPage />} />
            <Route path="/evento/:id/editar" element={<FormEventoPage />} />
            <Route path="/evento/:id/tickets" element={<GestionarTicketsPage />} />
          </Routes>
        </main>

        {/* Pie de Página */}
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}
