// src/components/axios/configAxios.js
import axios from 'axios';
import { getAuthToken } from '../../utils/token';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token dans les en-têtes
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Gestion des erreurs 401 (non autorisé)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    
    if (status === 401) {
      // Gestion des erreurs 401 (non autorisé)
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('/refresh-token', { token: refreshToken });
        localStorage.setItem('authToken', response.data.authToken);
        error.config.headers.Authorization = `Bearer ${response.data.authToken}`;
        return axiosInstance(error.config);
      } catch (refreshError) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
      }
    } else if (status === 403) {
      Swal.fire('Accès refusé', 'Vous n\'avez pas les droits pour effectuer cette action.', 'warning');
    } else if (status >= 500) {
      Swal.fire('Erreur serveur', 'Une erreur interne s\'est produite. Réessayez plus tard.', 'error');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
