import { defineStore } from "pinia";
import axiosInstance from '../components/axios/configAxios';

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    user: null,
    token: null,
  }),
  actions: {

    async login(email, password) {
      try {
        const response = await axiosInstance.post('/login', { email, password });
        const { accessToken, user } = response.data;
        this.isAuthenticated = true;
        this.token = accessToken;
        this.user = user;
        localStorage.setItem('authToken', accessToken);

        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Échec de la connexion. Veuillez réessayer.';
        console.error('Erreur de connexion :', errorMessage);
        throw new Error(errorMessage);
      }
    },

    logout() {
      this.isAuthenticated = false;
      this.user = null;
      this.token = null;
      localStorage.removeItem("authToken");
      delete axiosInstance.defaults.headers.common["Authorization"];
      return Promise.resolve();
    },
    
    checkAuth() {
      const token = localStorage.getItem("authToken");
      if (token) {
        this.isAuthenticated = true;
        this.token = token;
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } else {
        this.isAuthenticated = false;
      }
    },
  },
});
