import { defineStore } from 'pinia';
import axiosInstance from '../components/axios/configAxios';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchUsers() {
      this.loading = true;
      try {
        const response = await axiosInstance.get('/users');
        this.users = response.data;
      } catch (error) {
        this.error = 'Erreur lors du chargement des utilisateurs';
      } finally {
        this.loading = false;
      }
    },

    async addUser(userData) {
      try {
        await axiosInstance.post('/users/add', userData);
        await this.fetchUsers();
      } catch (error) {
        this.error = "Erreur lors de l'ajout de l'utilisateur";
      }
    },

    async updateUser(userId, user) {
      console.log("Updating user with ID:", userId); // Debugging
        console.log("User data to update:", user); // 
      try {
        await axiosInstance.put(`/users/edit/${userId}`, user);
        await this.fetchUsers();
      } catch (error) {
        this.error = "Erreur lors de la mise à jour de l'utilisateur";
      }
    },

    async getByIdUser(userId) {
      try {
        const response = await axiosInstance.get(`/users/${userId}`);
        return response.data; 
      } catch (error) {
        this.error = "Erreur lors de la récupération de l'utilisateur";
      }
    },

    async deleteUser(userId) {
      try {
        await axiosInstance.delete(`/users/delete/${userId}`);
        this.users = this.users.filter(user => user.id !== userId);
      } catch (error) {
        this.error = "Erreur lors de la suppression de l'utilisateur";
      }
    }
  },
});
