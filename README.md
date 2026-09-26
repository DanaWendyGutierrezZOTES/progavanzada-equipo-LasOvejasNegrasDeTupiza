# 🎟️ TicketEventos - Prototipo de Venta y Creación de Eventos

> **Prototipo Académico y Funcional** desarrollado con **Django**, **Python 3**, **SQLite** y **Bootstrap 5**.

Permite demostrar el flujo completo de una ticketera moderna: creación de eventos por parte de organizadores, listado público con filtros de búsqueda, selección y simulación de compra de tickets con descuento de stock en tiempo real, generación de entradas con código único/QR, historial para compradores y panel de métricas para organizadores.

---

## 🚀 Características Principales

1. **Autenticación con Roles:**
   - **Organizador:** Puede crear, editar y eliminar sus eventos, gestionar categorías de tickets y visualizar su panel de ventas.
   - **Comprador:** Puede explorar la cartelera, adquirir entradas (proceso simulado sin pasarela real) y consultar su historial de tickets digitales.
2. **CRUD Completo de Eventos:**
   - Creación con validaciones de fechas, horarios, cupo total, imagen/póster y precio base referencial.
   - Edición y eliminación protegidas (solo el organizador dueño del evento o superusuario).
3. **Gestión de Tipos de Ticket:**
   - Soporta múltiples categorías por evento (ej. *General, VIP, Preventa, Palco*).
   - Control de stock y asignación de precios por categoría.
4. **Buscador y Filtros en Tiempo Real:**
   - Filtro por texto (artista, recinto, nombre del evento) y por fecha.
5. **Simulación de Compra de Tickets:**
   - Selector interactivo de cantidades con cálculo automático de totales.
   - Control de concurrencia y stock seguro mediante transacciones atómicas (`transaction.atomic`) y bloqueo `select_for_update()`.
   - Generación de código único de ticket (ej. `TKT-A87BC1E2`) y visualización de **código QR digital**.
6. **Vista "Mis Tickets":**
   - Historial de compras con acceso a cada entrada digital formateada para presentar en el acceso o imprimir en PDF.
7. **Panel del Organizador (Dashboard):**
   - Métricas clave: eventos publicados, tickets vendidos, recaudación total simulada.
   - Tabla detallada por evento con barras de progreso de ocupación y desglose por categoría.

---

## 🛠️ Requisitos Previos

- **Python 3.10+** (probado con Python 3.14)
- **Git**

---

## ⚙️ Instalación y Puesta en Marcha

### 1. Clonar el Repositorio o acceder al directorio del proyecto
```bash
cd ticketera_django
```

### 2. Crear y Activar el Entorno Virtual

En **Windows (PowerShell)**:
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

En **Windows (Command Prompt)**:
```cmd
python -m venv venv
venv\Scripts\activate.bat
```

En **Linux / macOS**:
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Instalar Dependencias
```bash
pip install -r requirements.txt
```

### 4. Ejecutar Migraciones
```bash
python manage.py migrate
```

### 5. Cargar Datos de Prueba (Seed Data)
El proyecto incluye un comando personalizado que crea automáticamente usuarios de prueba, 4 conciertos/festivales con múltiples categorías de tickets y compras de ejemplo:
```bash
python manage.py seed_data
```

### 6. Iniciar el Servidor de Desarrollo
```bash
python manage.py runserver
```

Abre tu navegador en: **`http://127.0.0.1:8000/`**

---

## 👤 Cuentas y Credenciales de Prueba

Gracias al comando `python manage.py seed_data`, puedes iniciar sesión inmediatamente con cualquiera de estos roles:

| Rol | Usuario | Contraseña | Capacidades |
| :--- | :--- | :--- | :--- |
| **Organizador** | `organizador` | `organizador123` | Crear/editar sus eventos, añadir tickets y ver panel de métricas |
| **Comprador** | `comprador` | `comprador123` | Explorar cartelera, comprar tickets y ver "Mis Tickets" |
| **Administrador** | `admin` | `admin123` | Acceso completo al sitio y a Django Admin (`/admin/`) |

---

## 🧪 Ejecución de Pruebas Automatizadas

El proyecto cuenta con un conjunto de tests unitarios y de integración que validan el flujo completo (permisos, compras concurrentes, cálculo de stock y estadísticas):

```bash
python manage.py test
```

---

## 📂 Estructura del Proyecto

```text
ticketera_django/
├── config/                  # Configuración principal de Django
│   ├── settings.py          # Apps, templates, static/media, timezone
│   ├── urls.py              # Rutas principales y media en DEBUG
│   └── wsgi.py
├── eventos/                 # Aplicación de eventos y tickets
│   ├── management/
│   │   └── commands/
│   │       └── seed_data.py # Comando para cargar datos de prueba
│   ├── migrations/          # Migraciones de base de datos
│   ├── admin.py             # Configuración del panel Django Admin
│   ├── forms.py             # Formularios con clases Bootstrap 5
│   ├── models.py            # PerfilUsuario, Evento, TipoTicket, Compra
│   ├── tests.py             # Pruebas unitarias completas
│   ├── urls.py              # Rutas de eventos, compras y auth
│   └── views.py             # Lógica de vistas y controladores
├── media/                   # Directorio para subida de imágenes
├── static/                  # Archivos estáticos complementarios
├── templates/               # Templates HTML con Bootstrap 5
│   ├── base.html            # Layout maestro con navbar y footer
│   └── eventos/
│       ├── lista_eventos.html      # Catálogo público y buscador
│       ├── detalle_evento.html     # Detalle y tickets disponibles
│       ├── crear_evento.html       # Formulario de creación/edición
│       ├── confirmar_eliminar.html # Confirmación de eliminación
│       ├── gestionar_tickets.html  # Gestión de categorías de entradas
│       ├── comprar_ticket.html     # Checkout / Simulación de pago
│       ├── detalle_compra.html     # Ticket digital con código QR
│       ├── mis_tickets.html        # Historial de entradas del usuario
│       ├── panel_organizador.html  # Dashboard de organizador
│       ├── registro.html           # Registro con selector de rol
│       └── login.html              # Inicio de sesión
├── .gitignore               # Exclusiones de Git (venv, SQLite, media)
├── manage.py
├── README.md                # Documentación del proyecto
└── requirements.txt         # Lista de dependencias Python
```

---

## 🚢 Subir a GitHub

Para publicar este proyecto en tu cuenta de GitHub, sigue estos pasos:

1. Crea un repositorio vacío en tu cuenta de [GitHub](https://github.com/new) (ejemplo: `ticketera-django`).
2. En tu terminal (dentro de la carpeta del proyecto):
```bash
git remote add origin https://github.com/TU_USUARIO/ticketera-django.git
git branch -M main
git push -u origin main
```

---

*Desarrollado como prototipo académico para demostrar arquitectura MVC, control transaccional y diseño web responsivo con Django.*
