import { useState } from 'react';
import api from '../api/client';
import { AuthContext } from './auth-context';
import { normalizeRole } from '../utils/roleUtils';

const STORAGE_KEY = 'cneisi_auth';

function loadStoredAuth() {
  // Lee el estado de sesión guardado en localStorage para mantener la sesión
  // entre recargas de página.
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null, token: null };
    const parsed = JSON.parse(raw);
    return {
      user: parsed.user || null,
      token: parsed.token || null,
    };
  } catch {
    return { user: null, token: null };
  }
}

export function AuthProvider({ children }) {
  const stored = loadStoredAuth();
  const [user, setUser] = useState(stored.user);
  const [token, setToken] = useState(stored.token);

  function persistAuth(nextUser, nextToken) {
    setUser(nextUser);
    setToken(nextToken);
    // Guardamos token y usuario para que la app recuerde la sesión.
    localStorage.setItem('cneisi_token', nextToken);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: nextUser, token: nextToken }));
  }

  async function login(email, password) {
    // Realiza login en el backend y guarda el token JWT retornado.
    const { data } = await api.post('/Authentications', { email, password });
    const nextUser = { ...data.user, rol: normalizeRole(data.user.rol) };
    persistAuth(nextUser, data.token);
    return nextUser;
  }

  async function register(form) {
    // Envía los datos de registro al backend.
    await api.post('/Usuarios', {
      nombreApellido: form.nombreApellido.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
    });
  }

  function logout() {
    // Limpia el estado de autenticación y borra los datos locales.
    setUser(null);
    setToken(null);
    localStorage.removeItem('cneisi_token');
    localStorage.removeItem(STORAGE_KEY);
  }

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
