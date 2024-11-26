import { defineStore } from 'pinia';
import axiosInstance from '../components/axios/configAxios';
import Swal from 'sweetalert2';


export const useReservationStore = defineStore('reservation', {
  state: () => ({
    reservations: [], 
    reservation: null,
    loading: false, 
    error: null, 
    validationErrors: [], 
  }),

  actions: {
    // Récupérer toutes les réservations
    async fetchReservations() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.get('/reservations');
        this.reservations = response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la récupération des réservations.';
        Swal.fire('Erreur', this.error, 'error');
      } finally {
        this.loading = false;
      }
    },

    // Récupérer une réservation par ID
    async getReservationById(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.get(`/reservations/${id}`);
        this.reservation = response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la récupération de la réservation.';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async addReservation(newReservation) {
      this.loading = true;
      this.validationErrors = [];
      this.error = null;
      try {
        const response = await axiosInstance.post('/reservations/add', newReservation);
        this.reservations.push(response.data);
        Swal.fire('Succès', 'Réservation ajoutée avec succès.', 'success');
        await this.fetchReservations();
      } catch (error) {
        if (error.response?.data?.errors) {
          this.validationErrors = error.response.data.errors.map(err => 
            err.message || `Erreur dans le champ ${err.field}`
          );
        }
        
        
        Swal.fire('Erreur', 'Veuillez vérifier les champs saisis.', 'error');
        throw error;
      } finally {
        this.loading = false;
      }
    },
    // async addReservation(newReservation) {
    //   this.loading = true;
    //   this.validationErrors = [];
    //   this.error = null;
    //   try {
    //     const response = await axiosInstance.post('/reservations/add', newReservation);
    //     this.reservations.push(response.data);
    //     Swal.fire('Succès', 'Réservation ajoutée avec succès.', 'success');
    //     await this.fetchReservations();
    //   } catch (error) {
    //     if (error.response && error.response.data.errors) {
    //       // Récupérer les erreurs détaillées
    //       this.error = error.response.data.errors.map((e) => e.message || e);
    //     } else {
    //       this.error = ['Une erreur est survenue lors de l’ajout d\'une reservation.'];
    //     }
    //     throw error;
    //   }
    // },

    // Mettre à jour une réservation
    async updateReservation(id, updatedReservation) {
      this.loading = true;
      this.validationErrors = []; // Réinitialiser les erreurs
      this.error = null;
      try {
        const response = await axiosInstance.put(`/reservations/edit/${id}`, updatedReservation);
        const index = this.reservations.findIndex(reservation => reservation.id === id);
        if (index !== -1) {
          this.reservations[index] = response.data;
        }
        Swal.fire('Succès', 'Réservation mise à jour avec succès.', 'success');
        await this.fetchReservations();
      } catch (error) {
        if (error.response?.data?.errors) {
          // Mettre à jour validationErrors
          this.validationErrors = error.response.data.errors.map(err => err.message || err);
        } else {
          this.error = error.response?.data?.message || 'Erreur lors de la mise à jour de la réservation.';
        }
        Swal.fire('Erreur', 'Veuillez vérifier les champs saisis.', 'error');

        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updatestatusReservation(id, status) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.put(`/reservations/status/${id}`, { status });
        const index = this.reservations.findIndex(reservation => reservation.id === id);
        if (index !== -1) {
          this.reservations[index].status = status;
        }
        Swal.fire('Succès', 'Le statut de la réservation a été mis à jour.', 'success');
        await this.fetchReservations();
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la mise à jour du statut.';
        Swal.fire('Erreur', this.error, 'error');
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteReservation(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.delete(`/reservations/delete/${id}`);
        if (response.status === 200 || response.status === 204) {
          this.reservations = this.reservations.filter(reservation => reservation.id !== id);
          Swal.fire('Succès', 'Réservation supprimée avec succès.', 'success');
          await this.fetchReservations();
        } else {
          throw new Error(`Erreur lors de la suppression. Statut : ${response.status}`);
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la suppression de la réservation.';
        Swal.fire('Erreur', this.error, 'error');
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
  persist: true,
});
