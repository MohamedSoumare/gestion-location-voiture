import { defineStore } from 'pinia';
import axiosInstance from '../components/axios/configAxios';

export const useCustomerStore = defineStore('customer', {
  state: () => ({
    customers: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchCustomers() {
      this.loading = true;
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
      try {
        const response = await axiosInstance.post('/customers/add', newCustomer);
        this.customers.push(response.data);
        await this.fetchCustomers();
        this.error = null; // Réinitialiser les erreurs en cas de succès
      } catch (error) {
        // if (error.response && error.response.data && error.response.data.errors) {
        //   // Si des erreurs de validation sont renvoyées
        //   this.error = error.response.data.errors;
        // } else {
        //   this.error = "Erreur lors de l'ajout du client";
        // }
        throw error;
      }
    },
    async updateCustomer(id, updatedCustomer) {
      try {
        const response = await axiosInstance.put(`/customers/update/${id}`, updatedCustomer);
        const index = this.customers.findIndex(customer => customer.id === id);
        if (index !== -1) {
          this.customers[index] = { ...this.customers[index], ...response.data };
        }
        await this.fetchCustomers();
      } catch (err) {
        console.error('Failed to update customer:', err);
        throw err;
      }
    },
  
    async getCustomerById(id) {
      try {
        const response = await axiosInstance.get(`/customers/${id}`);
        return response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération du client:", error);
        this.error = "Erreur lors de la récupération du client";
      }
    },

    async deleteCustomer(id) {
      try {
        await axiosInstance.delete(`/customers/delete/${id}`);
        this.customers = this.customers.filter((customer) => customer.id !== id);
        await this.fetchCustomers();
      } catch (error) {
        this.error = 'Erreur lors de la suppression du client';
      }
    },
  },

  persist: {
    enabled: true,
  },
});
