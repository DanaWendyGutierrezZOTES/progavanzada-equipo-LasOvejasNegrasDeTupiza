# Guía de Explicación y Defensa del Proyecto en React

> **Proyecto:** TicketEventos Bolivia (Plataforma de Venta y Gestión de Entradas Oficiales)  
> **Equipo:** Las Ovejas Negras De Tupiza (Programación Avanzada 2026)  
> **Tecnología:** React 18 + Vite + Bootstrap 5.3 + HTML5 `<dialog>` + Google Maps Satelital  
> **Enfoque de Calidad:** Arquitectura Limpia, Principio DRY (Sin código repetido), Componentes Atómicos Reutilizables y Cobertura Nacional de Recintos de Bolivia.

---

## 1. Mejoras Clave Realizadas al Frontend

### A) Eliminación de Código Repetido (Principio DRY - Don't Repeat Yourself)
Se identificaron patrones repetitivos en las vistas y se modularizaron en componentes reutilizables dentro de `src/components/common/`:
- **`EmptyState.jsx`**: Unifica los mensajes de estado vacío (búsquedas sin resultados, lista de pases vacía, errores 404).
- **`StatCard.jsx`**: Tarjeta universal de métricas (KPIs) con variantes semánticas (`primary`, `emerald`, `info`, `warning`, `danger`), cálculo de porcentajes e iconos dinámicos.
- **`AlertBanner.jsx`**: Estandariza las alertas y avisos con soporte de descarte interactivo.
- **`PageHeader.jsx`**: Centraliza el encabezado de página, migas de pan (breadcrumbs), botón "Volver" con animación y acciones contextuales.
- **`Modal.jsx`**: Implementación moderna con el elemento estándar HTML5 `<dialog>`, control de foco nativo y contención de scroll (`overscroll-behavior: contain`).
- **`ConfirmModal.jsx`**: Reemplaza el invasivo `window.confirm()` del navegador por un modal accesible e integrado al diseño Dark Mode.
- **`TicketPass.jsx`**: Centraliza el renderizado del boleto digital holográfico con QR dinámico y fallback vectorial SVG para contingencia offline.
- **`ToastContext.jsx`**: Sistema reactivo de notificaciones flotantes (éxito, error, advertencia) que sustituye `window.alert()`.

### B) Cobertura Exhaustiva de Recintos de Bolivia (23+ Escenarios)
Se expandió `src/data/estadios.js` con geolocalización satelital precisa de los 9 departamentos y la ciudad de Tupiza:
1. **Potosí & Tupiza (Homenaje al Equipo):**
   - **Estadio Departamental de Tupiza / Víctor Agustín Ugarte de Tupiza** (Capacidad: 15.000) - Sede del Festival de la Vendimia y Folclore de Tupiza.
   - **Estadio Víctor Agustín Ugarte** (Potosí, Capacidad: 32.105 a 3.900 msnm).
   - **Coliseo Ciudad de Potosí** (Capacidad: 10.000).
2. **La Paz & El Alto:**
   - **Estadio Olímpico Hernando Siles** (La Paz, Capacidad: 41.143).
   - **Estadio Municipal de El Alto "Villa Ingenio"** (El Alto, Capacidad: 25.000 a 4.088 msnm).
   - **Teatro al Aire Libre "Jaime Laredo"** (La Paz, Capacidad: 9.000).
   - **Campo Ferial Chuquiago Marka** (La Paz, Capacidad: 10.000).
   - **Teatro Municipal Alberto Saavedra Pérez** (La Paz, Capacidad: 650).
3. **Santa Cruz:**
   - **Estadio Ramón "Tahuichi" Aguilera** (Santa Cruz, Capacidad: 38.500).
   - **Arena FEXPOCRUZ** (Santa Cruz, Capacidad: 25.000).
   - **Arena Sonilum Boulevard** (Santa Cruz, Capacidad: 12.000).
   - **Estadio Gilberto Parada "La Caldera del Diablo"** (Montero, Capacidad: 18.000).
4. **Cochabamba:**
   - **Estadio Sudamericano Félix Capriles** (Cochabamba, Capacidad: 32.000).
   - **FEXCO Arena - Recinto Ferial Alalay** (Cochabamba, Capacidad: 15.000).
   - **Teatro José María Achá** (Cochabamba, Capacidad: 800).
5. **Chuquisaca (Sucre):**
   - **Estadio Olímpico Patria** (Sucre, Capacidad: 32.700).
   - **Teatro Gran Mariscal de Ayacucho** (Sucre, Capacidad: 1.200).
   - **Campo Ferial FEXPO Sucre** (Sucre, Capacidad: 10.000).
6. **Tarija:**
   - **Estadio IV Centenario** (Tarija, Capacidad: 20.000).
   - **Parque Temático de Tarija** (Tarija, Capacidad: 12.000).
   - **Teatro de la Cultura de Tarija** (Tarija, Capacidad: 700).
7. **Oruro:**
   - **Estadio Jesús Bermúdez** (Oruro, Capacidad: 33.000).
   - **Palacio de los Deportes Eduardo Leclere Polo** (Oruro, Capacidad: 12.000).
8. **Beni & Pando:**
   - **Estadio Gran Mamoré** (Trinidad, Beni, Capacidad: 15.000).
   - **Estadio Roberto Jordán Cuéllar** (Cobija, Pando, Capacidad: 24.000).

### C) Distribución Arquitectónica Adaptativa (`MapaRecinto.jsx`)
A diferencia de versiones anteriores donde todo recinto se dibujaba como estadio de fútbol:
- Si el recinto es un **Teatro** (ej. Alberto Saavedra Pérez o Gran Mariscal), dibuja la boca del escenario, platea baja VIP, palcos oficiales y galería acústica.
- Si es una **Arena o Anfiteatro** (ej. Jaime Laredo, FEXPOCRUZ, Parque Temático), dibuja el Golden Circle, pista central y graderías perimetrales.
- Si es un **Estadio**, dibuja cancha de césped, VIP Front Stage, Preferencia, General, Curva Norte y Curva Sur.
- Las **puertas de acceso recomendadas** cambian dinámicamente según la infraestructura real de cada escenario.

---

## 2. Estructura de Archivos del Proyecto

```text
frontend/
├── index.html                   # Base HTML con fuentes y meta viewport
├── package.json                 # React 18, React Router DOM 6, Vite
├── vite.config.js               # Configuración del servidor Vite
└── src/
    ├── main.jsx                 # Montaje en el DOM (#root)
    ├── App.jsx                  # Enrutador principal, AuthProvider y ToastProvider
    ├── index.css                # CSS moderno: Dark Glassmorphism, animaciones, impresión
    │
    ├── components/              # Componentes de la interfaz
    │   ├── common/              # Piezas modulares reutilizables (DRY)
    │   │   ├── EmptyState.jsx   # Estado vacío reutilizable
    │   │   ├── StatCard.jsx     # Tarjeta de KPI / Métrica
    │   │   ├── AlertBanner.jsx  # Banner de avisos y alertas
    │   │   ├── PageHeader.jsx   # Encabezados y navegación
    │   │   ├── Modal.jsx        # <dialog> nativo accesible
    │   │   └── ConfirmModal.jsx # Confirmación no bloqueante
    │   │
    │   ├── Navbar.jsx           # Barra superior con cambio de roles en vivo
    │   ├── Footer.jsx           # Créditos (Las Ovejas Negras De Tupiza)
    │   ├── EventCard.jsx        # Tarjeta de concierto con barra de ocupación
    │   ├── MapaRecinto.jsx      # Blueprint adaptativo y Google Maps Satelital HD
    │   └── TicketPass.jsx       # Pase digital con validación QR
    │
    ├── context/                 # Estado global de la aplicación
    │   ├── AuthContext.jsx      # Autenticación, roles y usuarios
    │   └── ToastContext.jsx     # Notificaciones visuales flotantes
    │
    ├── data/                    # Datos estructurados
    │   ├── estadios.js          # Catálogo completo de 23 recintos de Bolivia
    │   └── mockData.js          # Conciertos iniciales y compras de prueba
    │
    ├── services/                # Persistencia y API REST
    │   ├── api.js               # Conexión HTTP con Django REST API
    │   └── storage.js           # Caché local, auto-fusión y modo offline
    │
    ├── utils/                   # Funciones utilitarias
    │   └── formatters.js        # Moneda oficial en Bolivianos (formatBs), fechas
    │
    └── pages/                   # Vistas principales de la aplicación
        ├── EventosPage.jsx          # Cartelera y explorador satelital de Bolivia
        ├── DetalleEventoPage.jsx    # Zonas interactivas, ficha y selección
        ├── ComprarTicketPage.jsx    # Checkout seguro con cálculo en tiempo real
        ├── TicketDetallePage.jsx    # Pase digital imprimible y código único
        ├── MisTicketsPage.jsx       # Historial de entradas con vista rápida modal
        ├── PanelOrganizadorPage.jsx # Dashboard con métricas de ventas y recaudación
        ├── FormEventoPage.jsx       # Crear y editar con autocompletado de estadios
        ├── GestionarTicketsPage.jsx # Crear sectores y cargar plantillas oficiales
        ├── LoginPage.jsx            # Inicio de sesión con accesos directos de demo
        └── RegistroPage.jsx         # Registro público de compradores
```

---

## 3. Puntos Fuertes para Defender con el Docente

1. **Arquitectura Limpia y Modular (DRY):**  
   Demuestra cómo los componentes de `components/common/` (`EmptyState`, `StatCard`, `PageHeader`, `Modal`, `AlertBanner`) se reutilizan en 8 pantallas distintas, eliminando más de 500 líneas de código duplicado.

2. **Uso de HTML5 Moderno (`<dialog>`):**  
   Explica que los modales no usan librerías pesadas externas ni hacks de z-index, sino el estándar nativo `<dialog>` con contención de scroll (`overscroll-behavior: contain`) y Light Dismiss.

3. **Geolocalización Real y Mapas Satelitales:**  
   Muestra la pestaña "Red de Recintos en Google Maps" en `EventosPage` y cómo `MapaRecinto` conmuta entre Satelital HD, Callejero e Híbrido con las coordenadas GPS reales de estadios de Tupiza, Potosí, La Paz, Santa Cruz, etc.

4. **Identidad Nacional y Enfoque Boliviano:**  
   Muestra que todos los precios están normalizados en **Bolivianos (Bs.)** mediante la función centralizada `formatBs()`, y que la cartelera incluye eventos culturales de gran escala como el *Festival Internacional de Tupiza*, *Carnaval de Oruro*, *Vendimia Chapaca* y *Rock Stadium Fest*.

5. **Experiencia de Usuario (UX) Profesional:**  
   No existen alertas invasivas del navegador; todo funciona mediante **Toasts animados**, confirmaciones modulares y cálculo instantáneo del precio total al modificar la cantidad de entradas.
