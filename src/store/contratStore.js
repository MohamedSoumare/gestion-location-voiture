import { defineStore } from 'pinia';
import axiosInstance from '../components/axios/configAxios';

export const useContractStore = defineStore('contract', {
  state: () => ({
    contracts: [],
    loading: false,
    error: null,
  }),

  actions: {
    // Récupérer tous les contrats
    async fetchContracts() {
      this.loading = true;
      try {
        const response = await axiosInstance.get('/contracts');
        this.contracts = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des contrats', error);
        this.error = 'Erreur lors de la récupération des contrats';
      } finally {
        this.loading = false;
      }
    },
    async addContract(contractData) {
      console.log('ssssssss',contractData);
      
      try {
        await axiosInstance.post('/contracts/add', contractData);
        await this.fetchContracts(); 
      } catch (error) {
        console.error("Erreur lors de l'ajout du contrat", error);
        this.error = "Erreur lors de l'ajout du contrat";
      }
    },

    // Supprimer un contrat
    async deleteContract(id) {
      this.loading = true;
      try {
        await axiosInstance.delete(`/contracts/delete/${id}`);
        this.contracts = this.contracts.filter(contract => contract.id !== id);
      } catch (error) {
        console.error('Erreur lors de la suppression du contrat', error);
        this.error = 'Erreur lors de la suppression du contrat';
      } finally {
        this.loading = false;
      }
    },
    async updateContract(id, updatedData) {
      try {
        await axiosInstance.put(`/contracts/update/${id}`, updatedData);
        await this.fetchContracts();
      } catch (error) {
        console.error("Erreur lors de la mise à jour du contrat", error);
        this.error = "Erreur lors de la mise à jour du contrat";
      }
    },

    // Obtenir les détails d'un contrat par ID
    async getContractById(id) {
      try {
        const response = await axiosInstance.get(`/contracts/${id}`);
        return response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des détails du contrat", error);
        this.error = "Erreur lors de la récupération des détails du contrat";
        return null;
      }
    }
  },
});
