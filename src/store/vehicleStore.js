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
        this.error = 'Erreur lors de la récupération des véhicules';
      } finally {
        this.loading = false;
      }
    },

    async addVehicle(vehicleData) {
      try {
        await axiosInstance.post('/vehicles/add', vehicleData);
        await this.fetchVehicles();
      } catch (error) {
        console.error("Erreur lors de l'ajout du véhicule", error);
        this.error = "Erreur lors de l'ajout du véhicule";
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
        console.error("Erreur lors de la mise à jour du véhicule", error);
        this.error = "Erreur lors de la mise à jour du véhicule";
      }
    },

    async deleteVehicle(id) {
      this.loading = true;
      try {
        await axiosInstance.delete(`/vehicles/delete/${id}`);
        this.vehicles = this.vehicles.filter(vehicle => vehicle.id !== id);
      } catch (error) {
        console.error('Erreur lors de la suppression du véhicule', error);
        this.error = 'Erreur lors de la suppression du véhicule';
      } finally {
        this.loading = false;
      }
    },
  },
});
