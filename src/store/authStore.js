import { defineStore } from 'pinia';
import axiosInstance from '../components/axios/configAxios';
import { getAuthToken } from '../utils/token';
import Swal from 'sweetalert2';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null,
    token: null,
  }),

  actions: {
    async login(email, password) {
      try {
        const response = await axiosInstance.post('/login', { email, password });
        const { token, refreshToken, user } = response.data;
    
        if (!token) throw new Error('Token non trouvé dans la réponse de l\'API.');
    
        // Sauvegarder les tokens et l'utilisateur
        localStorage.setItem('authToken', token);
        localStorage.setItem('refreshToken', refreshToken);
        // this.user = user;
        this.user = user || {};
        console.log("Utilisateur après connexion :", this.user);
        this.token = token;
        this.isAuthenticated = true;
        
      } catch (error) {
        this.isAuthenticated = false; // Assurez-vous que l'utilisateur reste non authentifié en cas d'erreur
        const errorMessage = error.response?.data?.message || 'Échec de la connexion. Veuillez réessayer.';
        console.error('Erreur de connexion :', errorMessage);
        throw new Error(errorMessage);
      }
    },
    
    logout() {
      this.isAuthenticated = false;
      this.user = null;
      this.token = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      
      Swal.fire({
        title: 'Déconnexion',
        text: 'Vous avez été déconnecté avec succès.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    },
    
    

    checkAuth() {
      const token = getAuthToken();
      if (token) {
        axiosInstance.get('/validate-token', { headers: { Authorization: `Bearer ${token}` } })
          .then(() => {
            this.isAuthenticated = true;
            this.token = token;
          })
          .catch(() => {
            this.logout();
          });
      } else {
        this.isAuthenticated = false;
        this.token = null;
      }
    }
  },
  persist: {
    enabled: true,
  },
});
