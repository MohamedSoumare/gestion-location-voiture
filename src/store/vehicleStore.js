import { defineStore } from 'pinia';
import axiosInstance from '../components/axios/configAxios';

export const useVehicleStore = defineStore('vehicle', {
  state: () => ({
    vehicles: [], 
    loading: false,
    error: null,
  }),

actions: {
    async fetchVehicles() {
      this.loading = true;
      try {
        const response = await axiosInstance.get('/vehicles');
        this.vehicles = Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error('Erreur lors de la récupération des véhicules', error);
        // this.error = 'Erreur lors de la récupération des véhicules';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async addVehicle(vehicleData) {
      try {
        await axiosInstance.post('/vehicles/add', vehicleData);
        await this.fetchVehicles();
        this.error = null;
      } catch (error) {
        if (error.response && error.response.data.errors) {
          // Récupérer les erreurs détaillées
          this.error = error.response.data.errors.map((e) => e.message || e);
        } else {
          this.error = ['Une erreur est survenue lors de l’ajout d\'un véhicule .'];
        }
        throw error;
      }
    },
    async getVehicleById(id) {
      try {
        const response = await axiosInstance.get(`/vehicles/${id}`);
        return response.data; // Vérifiez que cela retourne les bonnes données
      } catch (error) {
        console.error("Erreur lors du chargement du véhicule :", error);
        throw error;
      }
    },
    
    async updateVehicle(id, updatedData) {
      try {
        await axiosInstance.put(`/vehicles/edit/${id}`, updatedData);
        await this.fetchVehicles();
      } catch (error) {
        if (error.response && error.response.data.errors) {
          // Récupérer les erreurs détaillées
          this.error = error.response.data.errors.map((e) => e.message || e);
        } else {
          this.error = ['Une erreur est survenue lors de mise à jour d\'un véhicule .'];
        }
        throw error;
      }
    },

    async deleteVehicle(id) {
      this.loading = true;
      try {
        await axiosInstance.delete(`/vehicles/delete/${id}`);
        this.vehicles = this.vehicles.filter(vehicle => vehicle.id !== id);
      } catch (error) {
        console.error('Erreur lors de la suppression du véhicule:', error); // Correction ici
        throw error;
      } finally {
        this.loading = false; // Ajout de cette ligne pour stopper le chargement
      }
    },
    
  },
});
