# Guía de Explicación y Defensa del Proyecto en React

> **Proyecto:** TicketEventos (Plataforma de Venta y Gestión de Entradas)  
> **Tecnología:** React + Vite + Bootstrap 5  
> **Enfoque:** Código limpio, sin sobre-ingeniería, fácil de entender y defender.

---

## 1. ¿Qué es este proyecto y qué cambio se realizó?
Originalmente, el proyecto estaba construido en **Django con plantillas HTML tradicionales** (Monolito con Server-Side Rendering). Cada acción requería recargar la página completa.

Se migró a **React (Single Page Application - SPA)**, lo que aporta:
- **Mayor rapidez y fluidez:** Las vistas cambian al instante sin recargar la página.
- **Interactividad en tiempo real:** Los filtros de búsqueda, cálculos de precios de entradas y estadísticas se actualizan inmediatamente.
- **Componentes modulares y reutilizables:** El código está organizado en piezas pequeñas e independientes (`Navbar`, `EventCard`, `Footer`).

---

## 2. Estructura de Carpetas del Proyecto

```text
frontend/
├── index.html               # Archivo base HTML (carga Bootstrap 5 y las fuentes)
├── package.json             # Dependencias del proyecto (React, React Router, Vite)
├── vite.config.js           # Configuración rápida del servidor de desarrollo
└── src/
    ├── main.jsx             # Punto de entrada: monta la app en el div #root
    ├── App.jsx              # Enrutador principal (React Router DOM)
    ├── index.css            # Estilos personalizados (colores, sombras, ticket)
    │
    ├── components/          # Componentes visuales reutilizables
    │   ├── Navbar.jsx       # Barra superior con cambio rápido de rol
    │   ├── Footer.jsx       # Pie de página con créditos del equipo
    │   └── EventCard.jsx    # Tarjeta individual para mostrar un evento
    │
    ├── context/             # Estado global de la aplicación
    │   └── AuthContext.jsx  # Contexto de autenticación (login, logout, usuario activo)
    │
    ├── data/                # Datos iniciales para que funcione de inmediato
    │   └── mockData.js      # Usuarios, eventos y compras de prueba
    │
    ├── services/            # Capa de datos y persistencia
    │   └── storage.js       # Lectura/escritura en localStorage (simula la BD)
    │
    └── pages/               # Pantallas completas de la aplicación
        ├── EventosPage.jsx          # Catálogo principal con buscador y filtros
        ├── DetalleEventoPage.jsx    # Información del evento y tipos de ticket
        ├── ComprarTicketPage.jsx    # Formulario de compra y cálculo en vivo
        ├── TicketDetallePage.jsx    # Boleto digital con QR simulado y código único
        ├── MisTicketsPage.jsx       # Historial de entradas compradas por el usuario
        ├── PanelOrganizadorPage.jsx # Métricas (ingresos, ventas) y gestión
        ├── FormEventoPage.jsx       # Crear y editar eventos
        ├── GestionarTicketsPage.jsx # Agregar/eliminar tipos de entradas por evento
        ├── LoginPage.jsx            # Inicio de sesión con accesos rápidos para demo
        └── RegistroPage.jsx         # Registro con selección de rol
```

---

## 3. Conceptos Clave de React para Explicar al Profesor

### A) `useState` (El estado del componente)
- **Qué es:** Es una variable reactiva. Cuando su valor cambia, React vuelve a pintar la interfaz automáticamente.
- **Ejemplo en nuestro código (`EventosPage.jsx`):**
  ```jsx
  const [busqueda, setBusqueda] = useState('');
  ```
  Permite capturar lo que el usuario escribe en el input de búsqueda y filtrar la lista al instante.

### B) `useEffect` (Efectos secundarios / Ciclo de vida)
- **Qué es:** Permite ejecutar código en momentos clave, por ejemplo al entrar a una pantalla.
- **Ejemplo en nuestro código (`DetalleEventoPage.jsx`):**
  ```jsx
  useEffect(() => {
    const data = obtenerEventoPorId(id);
    setEvento(data);
  }, [id]);
  ```
  Carga los datos del evento específico cada vez que cambia el parámetro `id` de la URL.

### C) `Props` (Paso de propiedades entre componentes)
- **Qué es:** Son argumentos que un componente padre le pasa a un componente hijo para que se dibuje.
- **Ejemplo (`EventCard.jsx`):**
  ```jsx
  <EventCard evento={evento} />
  ```
  Le enviamos el objeto del evento al componente `EventCard`, el cual dibuja la imagen, título y precio correspondiente.

### D) `AuthContext` (Context API vs Redux)
- **Por qué no usamos Redux:** Redux agrega mucha complejidad innecesaria (actions, reducers, dispatchers).
- **Cómo lo resolvimos:** Usamos **Context API** nativo de React (`createContext` y `useContext`). Permite que cualquier pantalla sepa qué usuario está conectado y si tiene rol de **Comprador** u **Organizador**.

### E) `React Router DOM` (Navegación SPA)
- Usamos `<BrowserRouter>`, `<Routes>` y `<Route>` en `App.jsx`.
- Para cambiar de página sin recargar usamos `<Link to="...">` o `useNavigate()`.

---

## 4. Flujo de Demostración Recomendado para tu Presentación

1. **Mostrar el Catálogo:**
   - Abre `http://localhost:3000`.
   - Escribe en el buscador (ej: "Rock" o "Jazz") y muestra cómo los eventos se filtran en tiempo real sin recargar.
2. **Demostrar el Flujo de Compra:**
   - Entra a "Rock Stadium Fest 2026".
   - Elige una entrada (ej: VIP Front Stage) y haz clic en "Comprar Entrada".
   - Modifica la cantidad (1, 2, 3...) y muestra cómo el total se calcula en vivo.
   - Presiona "Pagar y Generar Ticket Digital".
   - Muestra el **Ticket Digital generado**, con su código único `TKT-...` y el botón para imprimirlo.
3. **Demostrar el Cambio de Rol:**
   - En la barra de navegación, haz clic en el botón de demo **"Organizador"**.
   - Verás que aparecen automáticamente los enlaces: **"Panel Organizador"** y **"Publicar Evento"**.
4. **Mostrar el Panel del Organizador:**
   - Entra al Panel y muestra las 3 tarjetas de KPIs:
     1. Eventos Publicados
     2. Entradas Vendidas
     3. Recaudación Total ($)
   - Muestra la tabla de eventos con opciones para editar o agregar nuevos tipos de ticket.
5. **Crear o Editar un Evento:**
   - Haz clic en "Publicar Evento", completa el formulario y guarda.
   - Demuestra que el nuevo evento aparece de inmediato en la cartelera.
