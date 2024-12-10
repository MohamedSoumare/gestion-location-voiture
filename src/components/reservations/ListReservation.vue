<template>
  <div class="container mt-5">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="mb-5 ">Liste des Réservations</h2>
      <button class="btn btn-primary mt-5" @click="addReservation">
        <i class="fas fa-plus"></i> Ajouter une Réservation
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
          <th>Montant partiel</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="reservation in paginatedReservations" :key="reservation.id">
          <td>{{ reservation.customer?.fullName || 'Inconnu' }}</td>
          <td>
            {{ reservation.vehicle?.brand || 'Marque inconnue' }}
            {{ reservation.vehicle?.model || 'Modèle inconnu' }}
          </td>
          <td>{{ formatDate(reservation.startDate) }}</td>
          <td>{{ formatDate(reservation.endDate) }}</td>
          <td>{{ reservation.totalAmount }} MRU</td>
          <td>
            <select
          v-model="reservation.status"
          :disabled="new Date(reservation.endDate) < new Date()"
          @change="updateStatus(reservation.id, reservation.status)"
          :style="{
            color: reservation.status === 'CONFIRMER' ? '#008000' :
                  reservation.status === 'ANNULLER' ? '#ff0000' : ''
          }"
          class="form-select bg-opacity-50"
        >
          <option value="CONFIRMER">Confirmé</option>
          <option value="EN_ATTENTE">En attente</option>
          <option value="ANNULLER">Annulé</option>
        </select>

      </td>
          <td>
            <button class="btn btn-outline-info me-3" @click="viewDetails(reservation.id)">
              <i class="fas fa-eye"></i>
            </button>
            <button
              class="btn btn-outline-secondary me-3"
              @click="editReservation(reservation.id)"
            >
              <i class="fas fa-edit"></i>
            </button>
            <!-- <button
            
              class="btn btn-outline-danger me-3"
              v-if="reservation.status !== 'CONFIRMER'"
              @click="confirmDeleteReservation(reservation.id)"
            >
              <i class="fas fa-trash"></i>
            </button> -->
            <button
  class="btn btn-outline-danger me-3"
  v-if="userRole === 'ADMIN' && reservation.status !== 'CONFIRMER'"
  @click="confirmDeleteReservation(reservation.id)"
>
  <i class="fas fa-trash"></i>
</button>

          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button
        class="btn btn-light"
        :disabled="currentPage === 1"
        @click="currentPage = 1"
      >
        Première
      </button>
      <button
        class="btn btn-light"
        :disabled="currentPage === 1"
        @click="previousPage"
      >
        Précédent
      </button>
      <span>Page {{ currentPage }} sur {{ totalPages }}</span>
      <button
        class="btn btn-light"
        :disabled="currentPage === totalPages"
        @click="nextPage"
      >
        Suivant
      </button>
      <button
        class="btn btn-light"
        :disabled="currentPage === totalPages"
        @click="currentPage = totalPages"
      >
        Dernière
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useReservationStore } from '../../store/reservationStore';
import Swal from 'sweetalert2'; 
import { useAuthStore } from '../../store/authStore';


const authStore = useAuthStore();
const userRole = authStore.user?.role; 

const router = useRouter();
const reservationStore = useReservationStore();
const { fetchReservations, deleteReservation, reservations } = reservationStore;

// Recherche et pagination
const searchTerm = ref('');
const itemsPerPage = 5;
const currentPage = ref(1);

onMounted(async () => {
  try {
    await fetchReservations();
  } catch (error) {
    Swal.fire('Erreur', 'Erreur lors du chargement des réservations.', 'error');
  }
});

const filteredReservations = computed(() =>
  reservations.filter(reservation =>
    (reservation.customer?.fullName?.toLowerCase().includes(searchTerm.value.toLowerCase()) || '') ||
    (reservation.vehicle?.brand?.toLowerCase().includes(searchTerm.value.toLowerCase()) || '') ||
    (reservation.status?.toLowerCase().includes(searchTerm.value.toLowerCase()) || '')
  )
);

const paginatedReservations = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  return filteredReservations.value.slice(startIndex, startIndex + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(filteredReservations.value.length / itemsPerPage));

watch(filteredReservations, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value || 1;
  }
});

// const formatDate = date => {
//   const options = { year: 'numeric', month: 'short', day: 'numeric' };
//   return new Date(date).toLocaleDateString('fr-FR', options);
// };

const formatDate = date => new Date(date).toLocaleDateString('fr-FR');

const addReservation = () => router.push({ name: 'AddReservation' });
const viewDetails = id => router.push({ name: 'DetailsReservation', params: { id } });
const editReservation = id => router.push({ name: 'EditReservation', params: { id } });

const confirmDeleteReservation = async id => {
  const result = await Swal.fire({
    title: 'Êtes-vous sûr?',
    text: 'Cette action supprimera définitivement la réservation.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Supprimer',
  });

  if (result.isConfirmed) {
    try {
      await deleteReservation(id);
      Swal.fire('Succès', 'La réservation a été supprimée avec succès.', 'success');
      window.location.reload(); // Recharger la page entière
    } catch (error) {
      Swal.fire('Erreur', 'Impossible de supprimer la réservation.', 'error');
      console.error(error.message);
    }
  }
};

const updateStatus = async (id, status) => {
  try {
    await reservationStore.updatestatusReservation(id, status);
    Swal.fire('Succès', 'Le statut de la réservation a été mis à jour.', 'success');
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error.message);
    Swal.fire('Erreur', 'Impossible de mettre à jour le statut.', 'error');
  }
};

</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: auto;
}
.search-input {
  max-width: 500px;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  gap: 10px;
}
select {
  -webkit-appearance: none; /* Masque la flèche sur les navigateurs WebKit */
  -moz-appearance: none; /* Masque la flèche sur Firefox */
  appearance: none; /* Masque la flèche sur les navigateurs modernes */
  background: none; /* Enlève l'arrière-plan */
}

</style>
