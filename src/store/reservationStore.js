// reservationStore.js
import { defineStore } from 'pinia';
import axiosInstance from '../components/axios/configAxios';
import Swal from 'sweetalert2';

export const useReservationStore = defineStore('reservation', {
  state: () => ({  
    reservations: [],
    reservation: null,
    customers: [],
    vehicles: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchReservations() {
      this.loading = true;
      try {
        const response = await axiosInstance.get('/reservations');
        this.reservations = response.data;
        console.log('Réservations récupérées avec succès :', response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des réservations :', error.response || error.message);
        this.error = 'Erreur lors de la récupération des réservations';
        Swal.fire('Erreur', this.error, 'error');
      } finally {
        this.loading = false;
      }
    },
        
    async getReservationById(id) {
      try {
        const response = await axiosInstance.get(`/reservations/${id}`);
        this.reservation = response.data; 
      } catch (error) {
        console.error('Erreur lors du chargement de la réservation :', error.response || error.message);
    throw new Error('Impossible de charger la réservation. Veuillez vérifier l’ID et réessayer.');
      }
    },

    async addReservation(newReservation) {
      try {
        const response = await axiosInstance.post('/reservations/add', newReservation);
        this.reservations.push(response.data);
        await this.fetchReservations();
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Erreur lors de l\'ajout de la réservation';
        console.error("Erreur lors de l'ajout de la réservation :", errorMessage);
        Swal.fire('Erreur', errorMessage, 'error');
        throw new Error(errorMessage);
      }
    },
        
    async updateReservation(id, updatedReservation) {
      try {
        // Met à jour la réservation via l'API
        const response = await axiosInstance.put(`/reservations/edit/${id}`, updatedReservation);
    
        // Met à jour localement l'élément dans le tableau des réservations
        const index = this.reservations.findIndex(reservation => reservation.id === id);
        if (index !== -1) {
          this.reservations[index] = response.data;
        }
    
        // Recharge les réservations pour s'assurer que les données sont à jour
        await this.fetchReservations();
      } catch (error) {
        this.error = "Erreur lors de la mise à jour de la réservation.";
        console.error(this.error, error);
        throw error; // Relance l'erreur pour permettre une gestion en amont
      }
    },
    
    async updateReservationStatus(id, status) {
      try {
        // Appelle la méthode updateReservation pour modifier uniquement le statut
        await this.updateReservation(id, { status });
      } catch (error) {
        this.error = "Erreur lors de la mise à jour du statut de la réservation.";
        console.error(this.error, error);
        // Vous pouvez personnaliser davantage la gestion des erreurs ici si nécessaire
        throw error;
      }
    },
    
    async deleteReservation(id) {
      try {
        const response = await axiosInstance.delete(`/reservations/delete/${id}`);
        // Vérifiez si la suppression est réussie avec le statut 204
        if (response.status === 200 || response.status === 204) {
          this.reservations = this.reservations.filter(reservation => reservation.id !== id);
          console.log(`Réservation ${id} supprimée avec succès.`);
        } else {
          throw new Error(`Erreur lors de la suppression. Statut : ${response.status}`);
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la suppression de la réservation';
        console.error("Erreur:", error);
        Swal.fire('Erreur', this.error, 'error');
      }
    },
     
  },
  persist: true, 
});
