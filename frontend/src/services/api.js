// ==========================================
// Travel Companion – API Client
// ==========================================

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = {
  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  },

  async get(endpoint) {
    const res = await fetch(`${API_BASE}${endpoint}`, { headers: this.getHeaders() });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async post(endpoint, data) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async put(endpoint, data) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async del(endpoint) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error(await res.text());
  },
};

export default api;
