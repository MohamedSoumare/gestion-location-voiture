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
      this.error = null;
      try {
        const response = await axiosInstance.get('/users');
        this.users = response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement des utilisateurs';
        throw error;
      } finally {
        this.loading = false;
      }
    },
      async addUser(userData) {
      try {
        await axiosInstance.post('/users/add', userData);
        await this.fetchUsers();
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de l\'ajout de l\'utilisateur';
        throw error;
      }
    },

    async updateUser(userId, user) {
      try {
        await axiosInstance.put(`/users/edit/${userId}`, user);
        const index = this.users.findIndex(u => u.id === userId);
        if (index !== -1) {
          this.users[index] = { ...this.users[index], ...user };
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la mise à jour de l\'utilisateur';
        throw error;
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
        this.error = error.response?.data?.message || 'Erreur lors de la suppression de l\'utilisateur';
      }
    },


    // Dans le store userStore.js
async fetchProfile() {
  try {
    const response = await axiosInstance.get('/users/profile');
    return response.data.user;
  } catch (error) {
    this.error = error.response?.data?.message || 'Erreur lors de la récupération du profil';
    throw error;
  }
},
      // Mettre à jour le profil
      async updateProfile(updatedData) {
        try {
          await axiosInstance.put('/users/update-profile', updatedData);
          await this.fetchProfile();
        } catch (error) {
          this.error = error.response?.data?.message || 'Erreur lors de la mise à jour du profil';
          throw error;
        }
      },
  
      async getProfile(updatedData) {
        try {
          await axiosInstance.get('/users/profile', updatedData);
          await this.fetchProfile();
        } catch (error) {
          this.error = error.response?.data?.message || 'Erreur lors de la mise à jour du profil';
          throw error;
        }
      },

      // Changer le mot de passe
      async updatePassword(currentPassword, newPassword) {
        try {
          await axiosInstance.put('/profile/update-password', {
            currentPassword,
            newPassword,
          });
        } catch (error) {
          this.error = error.response?.data?.message || 'Erreur lors de la mise à jour du mot de passe';
          throw error;
        }
      },
  },
  persist: {
    enabled: true,
  },
});
