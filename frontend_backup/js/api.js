// ==========================================
// Travel Companion – API Client
// ==========================================

// Automatically use current domain or fallback if not available
const PROD_API_URL = 'https://your-production-backend.com/api'; // Replace this with actual backend deployment URL later
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:8080/api' 
    : PROD_API_URL;

const api = {
    // Get auth headers
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
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    async put(endpoint, data) {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    async delete(endpoint) {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method: 'DELETE',
            headers: this.getHeaders()
        });
        if (!res.ok) throw new Error(await res.text());
    }
};
