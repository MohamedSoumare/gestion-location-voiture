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
        console.log('Reservations fetched:', this.reservations);
      } catch (error) {
        this.error = 'Erreur lors de la récupération des réservations';
        // Swal.fire('Erreur', this.error, 'error');
      } finally {
        this.loading = false;
      }
    },
    
    async getReservationById(id) {
      try {
        const response = await axiosInstance.get(`/reservations/${id}`);
        this.reservation = response.data; 
      } catch (error) {
        console.error("Erreur lors du chargement de la réservation :", error);
        // Swal.fire('Erreur', 'Erreur lors du chargement de la réservation', 'error');
      }
    },

    async addReservation(newReservation) {
      try {
        const response = await axiosInstance.post('/reservations/add', newReservation);
        this.reservations.push(response.data);
        await this.fetchReservations(); 
      } catch (error) {
        console.error("Erreur lors de l'ajout de la réservation :", error.response?.data || error.message);
        // Swal.fire('Erreur', "Erreur lors de l'ajout de la réservation", 'error');
        throw error;
      }
    },
    
    async updateReservation(id, updatedReservation) {
      try {
        const response = await axiosInstance.put(`/reservations/edit/${id}`, updatedReservation);
        const index = this.reservations.findIndex(reservation => reservation.id === id);
        if (index !== -1) {
          this.reservations[index] = response.data;
          await this.fetchReservations();
        }
      } catch (error) {
        this.error = "Erreur lors de la mise à jour de la réservation";
        // Swal.fire('Erreur', this.error, 'error');
        throw error;
      }
    },

    async deleteReservation(id) {
      try {
        const response = await axiosInstance.delete(`/reservations/delete/${id}`);
        if (response.status === 200) {
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
