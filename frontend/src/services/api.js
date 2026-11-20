// ========================================================
// CLIENTE HTTP REST API (api.js)
// Conecta el Frontend de React con el Backend de Django
// ========================================================

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Helper para realizar peticiones HTTP hacia el backend Django
 */
export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers,
    // Permite el paso de cookies de sesión entre React y Django
    credentials: 'include'
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.error || data.detail || data.mensaje || `Error HTTP: ${response.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    console.error(`Error en API (${endpoint}):`, error);
    throw error;
  }
}

// ========================================================
// SERVICIOS ESPECÍFICOS DE LA API
// ========================================================

export const EventosAPI = {
  listar: (filtros = {}) => {
    const params = new URLSearchParams(filtros).toString();
    return apiFetch(`/eventos/${params ? `?${params}` : ''}`);
  },
  obtener: (id) => apiFetch(`/eventos/${id}/`),
  crear: (eventoData) => apiFetch('/eventos/', {
    method: 'POST',
    body: JSON.stringify(eventoData)
  }),
  actualizar: (id, eventoData) => apiFetch(`/eventos/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(eventoData)
  }),
  eliminar: (id) => apiFetch(`/eventos/${id}/`, {
    method: 'DELETE'
  }),
  agregarTicket: (eventoId, ticketData) => apiFetch(`/eventos/${eventoId}/tickets/`, {
    method: 'POST',
    body: JSON.stringify(ticketData)
  }),
  eliminarTicket: (ticketId) => apiFetch(`/tickets/${ticketId}/`, {
    method: 'DELETE'
  })
};

export const ComprasAPI = {
  listar: (usuarioId = null) => {
    const query = usuarioId ? `?usuario_id=${usuarioId}` : '';
    return apiFetch(`/compras/${query}`);
  },
  obtener: (id) => apiFetch(`/compras/${id}/`),
  realizar: ({ eventoId, tipoTicketId, cantidad, usuario_id, usuario }) => apiFetch('/compras/', {
    method: 'POST',
    body: JSON.stringify({
      eventoId,
      tipoTicketId,
      cantidad,
      usuario_id: usuario_id || usuario?.id,
      usuario
    })
  })
};

export const AuthAPI = {
  login: (username, password) => apiFetch('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  }),
  registro: (userData) => apiFetch('/auth/registro/', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  logout: () => apiFetch('/auth/logout/', {
    method: 'POST'
  }),
  me: () => apiFetch('/auth/me/'),
  usuarios: () => apiFetch('/auth/usuarios/')
};

export const OrganizadorAPI = {
  dashboard: (organizadorId = null) => {
    const query = organizadorId ? `?organizador_id=${organizadorId}` : '';
    return apiFetch(`/organizador/dashboard/${query}`);
  }
};
