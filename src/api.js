const API = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('ciudadalerta_token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || data.mensaje || `Error ${res.status}`);
  }

  return res.json();
}

export function loginUser(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export function registrarUsuario(nombre, email, password) {
  return request('/auth/registro', {
    method: 'POST',
    body: JSON.stringify({ nombre, email, password })
  });
}

export function getAlertas(params = {}) {
  const qs = new URLSearchParams();
  if (params.sector) qs.set('sector', params.sector);
  if (params.tipo) qs.set('tipo', params.tipo);
  if (params.estado) qs.set('estado', params.estado);
  if (params.q) qs.set('q', params.q);
  if (params.page) qs.set('page', params.page);
  if (params.limit) qs.set('limit', params.limit);
  const query = qs.toString();
  return request(`/alertas${query ? '?' + query : ''}`);
}

export function getAlerta(id) {
  return request(`/alertas/${id}`);
}

export function crearAlerta(data) {
  return request('/alertas', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function cambiarEstadoAlerta(id, estado) {
  return request(`/alertas/${id}/estado`, {
    method: 'PATCH',
    body: JSON.stringify({ estado })
  });
}

export function eliminarAlerta(id) {
  return request(`/alertas/${id}`, { method: 'DELETE' });
}

export function restaurarAlerta(id) {
  return request(`/alertas/${id}/restaurar`, { method: 'PATCH' });
}

export function getHealth() {
  return request('/health');
}

export function getStats() {
  return request('/alertas/stats');
}

export function getUsuarios() {
  return request('/usuarios');
}

export function cambiarRolUsuario(id, rol) {
  return request(`/usuarios/${id}/rol`, {
    method: 'PATCH',
    body: JSON.stringify({ rol })
  });
}
