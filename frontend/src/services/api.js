import axios from 'axios';

// Crea una instancia de axios con la URL base
const api = axios.create({
  baseURL: 'http://localhost:3000/api',  // Ajusta si es diferente
});

// Interceptor para agregar el token automáticamente a todas las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');  // Recupera el token almacenado
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de token expirado (opcional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido: redirige a login
      localStorage.removeItem('token');
      window.location.href = '/login';  // O usa router.push('/login')
    }
    return Promise.reject(error);
  }
);

export default api;