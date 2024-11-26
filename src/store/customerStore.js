import { defineStore } from 'pinia';
import axiosInstance from '../components/axios/configAxios';
import Swal from 'sweetalert2';

export const useCustomerStore = defineStore('customer', {
  state: () => ({
    customers: [],
    loading: false,
    error: null,
    deleteError: null,
  }),

  actions: {
    async fetchCustomers() {
      this.loading = true;
      this.error = null;

      try {
        const response = await axiosInstance.get('/customers');
        this.customers = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des clients:', error);
        this.error = 'Erreur lors de la récupération des clients';
      } finally {
        this.loading = false;
      }
    },

    async addCustomer(newCustomer) {
      this.error = null;

      try {
        const response = await axiosInstance.post('/customers/add', newCustomer);
        this.customers.push(response.data);

        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Client ajouté avec succès.',
          timer: 3000,
          showConfirmButton: false,
        });
      } catch (error) {
        this.error = this.handleApiError(error, 'Une erreur est survenue lors de l’ajout du client.');
      }
    },

    async updateCustomer(id, updatedCustomer) {
      this.error = null;

      try {
        const response = await axiosInstance.put(`/customers/update/${id}`, updatedCustomer);
        const index = this.customers.findIndex((customer) => customer.id === id);
        if (index !== -1) {
          this.customers[index] = { ...this.customers[index], ...response.data };
        }

        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Client mis à jour avec succès.',
          timer: 3000,
          showConfirmButton: false,
        });
      } catch (error) {
        this.error = this.handleApiError(error, 'Une erreur est survenue lors de la mise à jour du client.');
      }
    },

    async getCustomerById(id) {
      this.error = null;

      try {
        const response = await axiosInstance.get(`/customers/${id}`);
        return response.data;
      } catch (error) {
        this.error = 'Erreur lors de la récupération du client.';
        console.error('Erreur lors de la récupération du client:', error);
      }
    },

  async deleteCustomer(id) {
      this.deleteError = null;

      try {
        await axiosInstance.delete(`/customers/delete/${id}`);
        this.customers = this.customers.filter((customer) => customer.id !== id);

        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Client supprimé avec succès.',
          timer: 3000,
          showConfirmButton: false,
        });
      } catch (error) {
        this.handleDeleteError(error);
      }
    },

    handleApiError(error, defaultMessage) {
      if (error.response && error.response.data.errors) {
        return error.response.data.errors.map((e) => e.message || e);
      }
      console.error('Erreur réseau ou serveur:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: defaultMessage,
      });
      return [defaultMessage];
    },

    handleDeleteError(error) {
      if (error.response) {
        const { errorCode, message } = error.response.data;

        switch (errorCode) {
          case 'RESERVATIONS_OR_CONTRACTS_ACTIVE':
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Le client ne peut pas être supprimé car il a des réservations ou des contrats actifs.',
            });
            break;

          case 'CUSTOMER_NOT_FOUND':
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Le client spécifié n\'existe pas.',
            });
            break;

          case 'CUSTOMER_ASSOCIATED_DATA':
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Le client est lié à des données importantes et ne peut être supprimé.',
            });
            break;

          default:
            Swal.fire({
              icon: 'error',
              title: 'Erreur inconnue',
              text: message || 'Une erreur inconnue est survenue.',
            });
        }
      } else {
        console.error('Erreur réseau ou de serveur:', error);

        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de contacter le serveur.',
        });
      }
    },
  },

  persist: {
    enabled: true,
  },
});
