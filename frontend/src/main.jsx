// ========================================================
// PUNTO DE ENTRADA: MAIN.JSX
// Monta la aplicación React en el DOM (en el div#root de index.html)
// ========================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
