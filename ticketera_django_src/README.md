# progavanzada-equipo-LasOvejasNegrasDeTupiza

## Integrantes del Equipo
* **Miguel Angel Andrade Arnez**
* **Dana Wendy Gutierrez Zotes**
* **Kelian Medrano Crespo**

---

# 🎟️ TicketEventos Bolivia - Plataforma de Venta y Creación de Eventos

> **Prototipo Académico y Funcional** adaptado para la **Región Bolivia (Bs.)**, desarrollado con arquitectura **MVC**, **Django REST Framework**, **Python 3**, **SQLite** y frontend en **React + Vite**.

Permite demostrar el flujo completo de una ticketera moderna: creación de eventos por parte de organizadores en ciudades de Bolivia (La Paz, Santa Cruz, Cochabamba, etc.), listado público con filtros de búsqueda, selección y simulación de compra de tickets en Bolivianos (**Bs.**) con descuento de stock en tiempo real, generación de entradas con código único/QR, historial para compradores y panel de métricas para organizadores.

---

## 🏗️ Arquitectura MVC (Backend Django)
- **Modelos (`eventos/models/`):** `PerfilUsuario`, `Evento`, `TipoTicket`, `Compra` (con control transaccional ACID y reglas de negocio).
- **Vistas (`eventos/views/`):** Serializadores JSON DRF (`serializers_view.py`), constructores de respuesta API (`api_view.py`) y plantillas HTML de respaldo (`web_view.py`).
- **Controladores (`eventos/controllers/`):** `auth_controller`, `evento_controller`, `ticket_controller`, `compra_controller`, `web_controller`.

---

## 🚀 Características Principales

1. **Autenticación con Roles:**
   - **Organizador:** Puede crear, editar y eliminar sus eventos, gestionar categorías de tickets y visualizar su panel de ventas.
   - **Comprador:** Puede explorar la cartelera, adquirir entradas (proceso simulado sin pasarela real) y consultar su historial de tickets digitales.
   - **Administrador:** Cancelación de eventos, auditoría de ventas y acceso al Django Admin.
2. **CRUD Completo de Eventos:**
   - Creación con validaciones de fechas, horarios, cupo total, capacidad máxima física, póster y precio base en Bolivianos (Bs.).
3. **Gestión de Tipos de Ticket:**
   - Soporta múltiples categorías por evento (ej. *General, VIP Illimani, Curva*).
   - Control de stock y asignación de precios por categoría en Bs.
4. **Buscador y Filtros en Tiempo Real:**
   - Filtro por texto (artista, recinto, ciudad), categoría y fecha.
5. **Simulación de Compra de Tickets:**
   - Control de concurrencia y stock seguro mediante transacciones atómicas (`transaction.atomic`) y bloqueo `select_for_update()`.
   - Generación de código único de ticket y código QR digital.
6. **Panel del Organizador y Auditoría de Ventas:**
   - Métricas clave: eventos publicados, tickets vendidos, recaudación total en Bs.

---

## ⚙️ Puesta en Marcha

### 1. Iniciar el Backend (Django)
```bash
cd ticketera_django_src
..\venv\Scripts\activate
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

### 2. Iniciar el Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

---

## 👤 Credenciales de Acceso de Prueba

| Rol | Usuario | Contraseña | Capacidades |
| :--- | :--- | :--- | :--- |
| **Organizador** | `organizador` | `organizador123` | Publicar eventos, gestionar tickets y métricas en Bs. |
| **Comprador** | `comprador` | `comprador123` | Comprar tickets simulados y ver mis entradas |
| **Administrador** | `admin` | `admin123` | Control total, cancelar eventos y Django Admin |
