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
        await this.fetchCustomers(); // Recharge les clients après ajout
      } catch (error) {
        console.error("Erreur lors de l'ajout du client:", error);
        this.error = "Erreur lors de l'ajout du client";
      }
    },

    async updateCustomer(id, updatedCustomer) {
      try {
        await axiosInstance.put(`/customers/update/${id}`, updatedCustomer);
        const index = this.customers.findIndex((customer) => customer.id === id);
        if (index !== -1) {
          this.customers[index] = { ...this.customers[index], ...updatedCustomer };
        }
        await this.fetchCustomers();
      } catch (error) {
        this.error = 'Erreur lors de la mise à jour du client';
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
