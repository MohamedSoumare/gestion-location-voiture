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
      this.error = null;
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
      try {
        await axiosInstance.post('/contracts/add', contractData);
        await this.fetchContracts(); 
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          this.errorMessage = error.response.data.error}
        if (error.response) {
          // Gérer différentes structures possibles de réponse d'erreur
          if (error.response.data.erreurs) {
            // Structure avec 'erreurs'
            this.validationErrors = error.response.data.erreurs.map(err => err.message);
          } else if (error.response.data.errors) {
            // Structure alternative avec 'errors'
            this.validationErrors = error.response.data.errors.map(err => 
              typeof err === 'string' ? err : err.msg
            );
          } else {
            // Message d'erreur générique
            this.validationErrors = [error.response.data.error || 'Erreur lors de l\'ajout du contrat'];
          }
        } else {
          // Erreur sans réponse du serveur
          this.validationErrors = ['Une erreur réseau est survenue'];
        }
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateContract(id, contractData) {
      try {
        const response = await axiosInstance.put(`/contracts/update/${id}`, contractData);
        this.validationErrors = [];
        await this.fetchContracts(); 
        return response.data;
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          this.validationErrors = error.response.data.errors.map(err => err.message || err);
        } else {
          this.validationErrors = ['Erreur lors de la mise à jour du contrat.'];
        }
        throw error;
      }
    },
    async updateContractStatus(id, status) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.put(`/contracts/status/${id}`, { status });
        // Met à jour le contrat dans la liste locale
        const updatedContractIndex = this.contracts.findIndex(contract => contract.id === id);
        if (updatedContractIndex !== -1) {
          this.contracts[updatedContractIndex].status = status;
        }
        await this.fetchContracts(); 
        return response.data;
        
      } catch (error) {
        console.error('Erreur lors de la mise à jour du statut :', error);
        this.error = error.response?.data?.message || 'Erreur lors de la mise à jour du statut.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    // Supprimer un contrat
    async deleteContract(id) {
      this.loading = true;
      try {
        await axiosInstance.delete(`/contracts/delete/${id}`);
        this.contracts = this.contracts.filter(contract => contract.id !== id);
        await this.fetchContracts(); 
      } catch (error) {
        console.error('Erreur lors de la suppression du contrat', error);
        this.error = 'Erreur lors de la suppression du contrat';
      } finally {
        this.loading = false;
      }
    },
  
    
    // Obtenir les détails d'un contrat par ID
    async getContractById(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.get(`/contracts/${id}`);
        await this.fetchContracts(); 
        return response.data;
      }catch (error) {
        console.error("Erreur lors de la récupération des détails du contrat", error);
          this.error = error.response?.data?.message || 'Erreur lors de la récupération de la réservation.';
          throw error;
      }
    }
  },
  persist: {
    enabled: true,
  },
});
