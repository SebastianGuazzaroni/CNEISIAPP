import axios from 'axios';

const api = axios.create({
  // Base URL del API. En desarrollo Vite redirige /api al backend.
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cneisi_token');
  if (token) {
    // Agrega el token JWT en cada petición autorizada
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normaliza los errores HTTP para que el frontend pueda mostrarlos con mensajes legibles.
    const message = error.response?.data?.message || error.message || 'Error de conexión';
    const enriched = new Error(message);
    enriched.status = error.response?.status;
    enriched.data = error.response?.data;
    return Promise.reject(enriched);
  },
);

export default api;
