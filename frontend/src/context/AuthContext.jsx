// ========================================================
// CONTEXTO DE AUTENTICACIÓN (AuthContext.jsx)
// Permite saber en cualquier componente qué usuario ha iniciado sesión.
// Es nativo de React (no requiere librerías complejas como Redux).
// ========================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { obtenerUsuarios, registrarUsuario } from '../services/storage';

// 1. Creamos el contexto
const AuthContext = createContext();

// 2. Proveedor que envuelve a la aplicación
export function AuthProvider({ children }) {
  // Estado con el usuario logueado actualmente
  const [usuario, setUsuario] = useState(() => {
    const sesionGuardada = localStorage.getItem('ticketera_sesion_activa');
    return sesionGuardada ? JSON.parse(sesionGuardada) : null;
  });

  // Guardamos la sesión en el almacenamiento local cuando cambia el usuario
  useEffect(() => {
    if (usuario) {
      localStorage.setItem('ticketera_sesion_activa', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('ticketera_sesion_activa');
    }
  }, [usuario]);

  // Función para Iniciar Sesión
  const login = (username, password) => {
    const usuarios = obtenerUsuarios();
    const encontrado = usuarios.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (!encontrado) {
      throw new Error('Usuario o contraseña incorrectos');
    }

    setUsuario(encontrado);
    return encontrado;
  };

  // Función para Cerrar Sesión
  const logout = () => {
    setUsuario(null);
  };

  // Función para Registrar Usuario
  const registro = (datos) => {
    const nuevo = registrarUsuario(datos);
    setUsuario(nuevo);
    return nuevo;
  };

  // Función para cambio rápido de usuario durante presentaciones/pruebas
  const cambiarUsuarioRapido = (username) => {
    const usuarios = obtenerUsuarios();
    const u = usuarios.find(item => item.username === username);
    if (u) {
      setUsuario(u);
    }
  };

  // Comprobar si es organizador
  const esOrganizador = usuario?.rol === 'organizador';

  return (
    <AuthContext.Provider
      value={{
        usuario,
        esOrganizador,
        login,
        logout,
        registro,
        cambiarUsuarioRapido
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 3. Hook personalizado para usar el contexto fácilmente
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}
