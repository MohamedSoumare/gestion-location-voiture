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
          <tr v-for="reservation in paginatedReservations" :key="reservation.id">
            <td>{{ reservation.customer?.fullName || 'Inconnu' }}</td>
            <td>{{ reservation.vehicle?.brand || 'Marque inconnue' }} {{ reservation.vehicle?.model || 'Modèle inconnu' }}</td>
            <td>{{ formatDate(reservation.startDate) }}</td>
            <td>{{ formatDate(reservation.endDate) }}</td>
            <td>{{ reservation.totalAmount }} MRU</td>
            <td>
              <select
                v-model="reservation.status"
                :disabled="new Date(reservation.endDate) < new Date()"
                @change="updateStatus(reservation.id, reservation.status)"
                :style="
                  reservation.status === 'CONFIRMER'
                    ? 'color: #008000'
                    : reservation.status === 'ANNULLER'
                    ? 'color: #ff0000'
                    : ''
                "
                class="form-select bg-opacity-50"
              >
                <option value="CONFIRMER">Confirmé</option>
                <option value="EN_ATTENTE">En attente</option>
                <option value="ANNULLER">Annulé</option>
              </select>
            </td>
            <td>
              <button class="btn btn-outline-info me-2" @click="viewDetails(reservation.id)">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn btn-outline-secondary me-2" :disabled="reservation.status === 'CONFIRMER'" 
              @click="editReservation(reservation.id)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-outline-danger" :disabled="reservation.status === 'CONFIRMER'" 
              @click="deleteReservation(reservation.id)">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <div class="pagination">
        <button class="btn btn-light" :disabled="currentPage === 1" @click="previousPage">
          Précédent
        </button>
        <span>Page {{ currentPage }} sur {{ totalPages }}</span>
        <button class="btn btn-light" :disabled="currentPage === totalPages" @click="nextPage">
          Suivant
        </button>
      </div>
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
    reservationStore.reservations.filter(reservation =>
      reservation.customer.fullName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      reservation.vehicle.brand.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      reservation.status.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  );
  
  const paginatedReservations = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage;
    return filteredReservations.value.slice(startIndex, startIndex + itemsPerPage);
  });
  
  const totalPages = computed(() => Math.ceil(filteredReservations.value.length / itemsPerPage));
  
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('fr-FR', options);
  };
  
  const addReservation = () => router.push({ name: 'AddReservation' });
  const viewDetails = (id) => router.push({ name: 'DetailsReservation', params: { id } });
  const editReservation = (id) => router.push({ name: 'EditReservation', params: { id } });
  // console.log('Navigating to DetailsReservation:', id);
  
  
  const confirmDeleteReservation = (id) => {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Cette action supprimera définitivement la réservation.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
    }).then(result => {
      if (result.isConfirmed) deleteReservation(id);
    });
  };
  
  const updateStatus = async (id, status) => {
    try {
      await reservationStore.updateReservationStatus(id, status);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  </script>
  
  <style scoped>
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
  }
  </style>
  
  
  <style scoped>
    .container {
      max-width: 1000px;
      margin-top: 5%;
    }
  
    .search-input {
      max-width: 500px;
    }
  
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 40px;
    }
  
    .pagination button {
      margin: 0 5px;
    }
  
  </style>
  