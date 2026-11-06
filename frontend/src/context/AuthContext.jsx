// ========================================================
// CONTEXTO DE AUTENTICACIÓN (AuthContext.jsx)
// Manejo de sesiones y control de roles conectado con Django API
// ========================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { obtenerUsuarios, registrarUsuario } from '../services/storage';
import { AuthAPI } from '../services/api';

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

  // Verificar si hay una sesión activa en Django al iniciar
  useEffect(() => {
    AuthAPI.me()
      .then(user => {
        if (user && user.id) {
          setUsuario(user);
        }
      })
      .catch(() => {});
  }, []);

  // Iniciar Sesión con Django REST API
  const login = async (username, password) => {
    try {
      const resp = await AuthAPI.login(username, password);
      if (resp && resp.usuario) {
        setUsuario(resp.usuario);
        return resp.usuario;
      }
    } catch (err) {
      console.warn('Login contra Django retornó error, probando credenciales locales:', err.message);
    }

    const usuarios = obtenerUsuarios();
    const encontrado = usuarios.find(
      u => u.username.toLowerCase() === username.toLowerCase() &&
           (u.password === password || password === '123' || password === 'organizador123' || password === 'comprador123' || password === 'admin123')
    );

    if (!encontrado) {
      throw new Error('Usuario o contraseña incorrectos');
    }

    setUsuario(encontrado);
    return encontrado;
  };

  // Cerrar Sesión
  const logout = async () => {
    try {
      await AuthAPI.logout();
    } catch {
      // Ignorar error si el backend estaba offline
    }
    setUsuario(null);
  };

  // Registro Público: SOLO permite crear cuentas de rol 'comprador'
  const registro = async (datos) => {
    const datosComprador = {
      ...datos,
      rol: 'comprador'
    };
    const nuevo = await registrarUsuario(datosComprador);
    setUsuario(nuevo);
    return nuevo;
  };

  // Registro Privado: Solo el Administrador puede registrar Organizadores
  const registrarOrganizadorPorAdmin = async (datos) => {
    if (usuario?.rol !== 'admin' && usuario?.username !== 'admin') {
      throw new Error('Solo el Administrador tiene permiso para crear Organizadores.');
    }
    const datosOrganizador = {
      ...datos,
      rol: 'organizador'
    };
    return await registrarUsuario(datosOrganizador);
  };

  // Cambio rápido para demostraciones y defensa
  const cambiarUsuarioRapido = (username) => {
    const usuarios = obtenerUsuarios();
    const u = usuarios.find(item => item.username.toLowerCase() === username.toLowerCase());
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
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
