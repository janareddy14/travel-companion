import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const login = useCallback(async (username, password) => {
    const data = await api.post('/auth/login', { username, password });
    const userData = {
      userId: data.userId,
      username: data.username,
      email: data.email,
      role: data.role,
    };
    setToken(data.token);
    setUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (username, email, password) => {
    const data = await api.post('/auth/register', { username, email, password });
    const userData = {
      userId: data.userId,
      username: data.username,
      email: data.email,
      role: data.role,
    };
    setToken(data.token);
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const isLoggedIn = !!token && !!user;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
