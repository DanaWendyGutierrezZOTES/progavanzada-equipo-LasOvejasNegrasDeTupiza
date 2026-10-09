// ========================================================
// CONTEXTO DE AUTENTICACIÓN (AuthContext.jsx)
// Manejo de sesiones y control de roles (Admin, Organizador, Comprador)
// ========================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { obtenerUsuarios, registrarUsuario } from '../services/storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const sesionGuardada = localStorage.getItem('ticketera_sesion_activa');
    return sesionGuardada ? JSON.parse(sesionGuardada) : null;
  });

  useEffect(() => {
    if (usuario) {
      localStorage.setItem('ticketera_sesion_activa', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('ticketera_sesion_activa');
    }
  }, [usuario]);

  // Iniciar Sesión
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

  // Cerrar Sesión
  const logout = () => {
    setUsuario(null);
  };

  // Registro Público: SOLO permite crear cuentas de rol 'comprador'
  const registro = (datos) => {
    const datosComprador = {
      ...datos,
      rol: 'comprador' // Seguridad: el registro público siempre es comprador
    };
    const nuevo = registrarUsuario(datosComprador);
    setUsuario(nuevo);
    return nuevo;
  };

  // Registro Privado: Solo el Administrador puede registrar Organizadores
  const registrarOrganizadorPorAdmin = (datos) => {
    if (usuario?.rol !== 'admin' && usuario?.username !== 'admin') {
      throw new Error('Solo el Administrador tiene permiso para crear Organizadores.');
    }
    const datosOrganizador = {
      ...datos,
      rol: 'organizador'
    };
    return registrarUsuario(datosOrganizador);
  };

  // Cambio rápido para demostraciones y defensa
  const cambiarUsuarioRapido = (username) => {
    const usuarios = obtenerUsuarios();
    const u = usuarios.find(item => item.username === username);
    if (u) {
      setUsuario(u);
    }
  };

  const esAdmin = usuario?.rol === 'admin';
  const esOrganizador = usuario?.rol === 'organizador' || usuario?.rol === 'admin';

  return (
    <AuthContext.Provider
      value={{
        usuario,
        esAdmin,
        esOrganizador,
        login,
        logout,
        registro,
        registrarOrganizadorPorAdmin,
        cambiarUsuarioRapido
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
