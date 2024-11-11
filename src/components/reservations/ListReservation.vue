<template>
  <div class="container mt-5">
   

    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="mb-4">Liste des Réservations</h2>
     
    <button class="btn btn-primary mb-3" @click="addReservation">
      <i class="fas fa-add"></i> Ajouter une Réservation
    </button>

    </div>

    <input
      v-model="searchTerm"
      @input="filterReservations"
      type="text"
      class="form-control search-input mb-3"
      placeholder="Rechercher une réservation par client, véhicule, ou statut"
    />

    <table class="table table-striped table-hover table-bordered mt-3">
      <thead>
        <tr>
          <th>Client</th>
          <th>Véhicule</th>
          <th>Date de début</th>
          <th>Date de fin</th>
          <th>Montant total</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="reservation in filteredReservations" :key="reservation.id">
          <td>{{ reservation.customer?.fullName || 'Inconnu' }}</td>
          <td>{{ reservation.vehicle?.brand || 'Marque inconnue' }} {{ reservation.vehicle?.model || 'Modèle inconnu' }}</td>
          <td>{{ formatDate(reservation.startDate) }}</td>
          <td>{{ formatDate(reservation.endDate) }}</td>
          <td>{{ reservation.totalAmount }} €</td>
          <td>{{ reservation.status }}</td>
          <td>
            <button class="btn btn-outline-info me-2" @click="viewDetails(reservation.id)">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn  btn-outline-secondary me-2" @click="editReservation(reservation.id)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-outline-danger" @click="confirmDeleteReservation(reservation.id)">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useReservationStore } from '../../store/reservationStore';
import Swal from 'sweetalert2';

const router = useRouter();
const reservationStore = useReservationStore();
const { fetchReservations, deleteReservation, reservations } = reservationStore;

const searchTerm = ref('');

const filteredReservations = computed(() =>
  reservationStore.reservations.filter(reservation =>
    reservation.customer.fullName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    reservation.vehicle.brand.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    reservation.status.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
);


onMounted(async () => {
  try {
    await fetchReservations();
  } catch (error) {
    Swal.fire('Erreur', 'Erreur lors du chargement des réservations.', 'error');
  }
});
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const viewDetails = (id) => router.push({ name: 'DetailsReservation', params: { id } });
const editReservation = (id) => router.push({ name: 'EditReservation', params: { id } });
const addReservation = () => router.push({ name: 'AddReservation' });

const confirmDeleteReservation = async (id) => {
  console.log('ID de la réservation à supprimer:', id);
  const result = await Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: 'Cette action est irréversible.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  });

  if (result.isConfirmed) {
    try {
      await deleteReservation(id);
      Swal.fire('Supprimé !', 'La réservation a été supprimée avec succès.', 'success');
      await fetchReservations();
    } catch (error) {
      Swal.fire('Erreur', 'Erreur lors de la suppression de la réservation.', 'error');
      console.error('Erreur lors de la suppression:', error);
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin-top: 5%;
}

.search-input{
  max-width: 500px;
}
</style>
