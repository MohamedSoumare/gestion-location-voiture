import { defineStore } from 'pinia';
import axiosInstance from '../components/axios/configAxios';

export const useContractStore = defineStore('contract', {
  state: () => ({
    contracts: [],
    loading: false,
    error: null,
    validationErrors: [], 
  }),

  actions: { 
    async fetchContracts() {
      this.loading = true;
      try {
        const response = await axiosInstance.get('/contracts');
        this.contracts = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des contrats', error);
        this.error = error.response?.data?.message || 'Erreur lors de la récupération des réservations.';
      } finally {
        this.loading = false;
      }
    },
    async addContract(contractData) {
      this.loading = true;
      this.validationErrors = [];
      this.error = null;
      try {
        await axiosInstance.post('/contracts/add', contractData);
        await this.fetchContracts(); 
      }  catch (error) {
        if (error.response && error.response.status === 400) {
          this.validationErrors = error.response.data.erreurs.map(err => err.message);
        } else {
          console.error('Erreur inattendue :', error);
        }
        throw error;
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
    async updateContract(id, contractData) {
      try {
        await axios.put(`/contracts/update/${id}`, contractData);
        this.validationErrors = [];
      } catch (error) {
        if (error.response && error.response.data && error.response.data.erreurs) {
          this.validationErrors = error.response.data.erreurs;
        } else {
          console.error(error);
        }
        throw error;
      }
    },

    async updateContract(id, contractData) {
      try {
        const response = await axiosInstance.put(`/contracts/update/${id}`, contractData);
        this.validationErrors = [];
        return response.data; // Retourne les données mises à jour pour validation
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          this.validationErrors = error.response.data.errors.map(err => err.message || err);
        } else {
          this.validationErrors = ['Erreur lors de la mise à jour du contrat.'];
        }
        throw error;
      }
    },
    

    // Obtenir les détails d'un contrat par ID
    async getContractById(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.get(`/contracts/${id}`);
        return response.data;
      }catch (error) {
        console.error("Erreur lors de la récupération des détails du contrat", error);
          this.error = error.response?.data?.message || 'Erreur lors de la récupération de la réservation.';
          throw error;
      }
    }
  },
});
