<template>
  <div class="reservation-details-container mt-4">
    <div class="card">
      <div class="card-header text-white bg-primary">
        <h2 class="text-center">Détails de la Réservation</h2>
      </div>
      <div class="card-body">
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <strong>Client : </strong> {{ reservation.customer?.fullName || 'N/A' }}
          </li>
          <li class="list-group-item">
            <strong>Véhicule : </strong> 
            {{ reservation.vehicle?.brand || 'N/A' }} {{ reservation.vehicle?.model || '' }}
          </li>
          <li class="list-group-item">
            <strong>Date de début : </strong> {{ formatDate(reservation.startDate) }}
          </li>
          <li class="list-group-item">
            <strong>Date de fin : </strong> {{ formatDate(reservation.endDate) }}
          </li>
          <li class="list-group-item">
            <strong>Montant Total : </strong> 
            {{ reservation.totalAmount ? reservation.totalAmount + ' MRU' : 'N/A' }}
          </li>
          <li class="list-group-item">
            <strong>Statut : </strong>
            <span :class="statusClass(reservation.status)">
              {{ reservation.status || 'N/A' }}
            </span>
          </li>
        </ul>
      </div>
      <div class="card-footer text-center d-flex justify-content-end">
        <button class="btn btn-secondary" @click="backToList">
          <i class="bi bi-arrow-left"></i> Retour
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useReservationStore } from '../../store/reservationStore';

// State variables
const reservation = ref({
  customer: { fullName: 'N/A' },
  vehicle: { brand: 'N/A', model: '' },
  startDate: null,
  endDate: null,
  totalAmount: null,
  status: 'N/A',
});

const router = useRouter();
const route = useRoute();
const reservationStore = useReservationStore();

// Fetch data on component mount
onMounted(async () => {
  const reservationId = route.params.id;
  await reservationStore.getReservationById(reservationId);
  reservation.value = reservationStore.reservation || reservation.value;
});

// Navigate back to the list
const backToList = () => {
  router.push({ name: 'ListReservation' });
};

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// Determine status class based on reservation status
const statusClass = (status) => {
  switch (status) {
    case 'Confirmée':
      return 'text-success';
    case 'Annulée':
      return 'text-danger';
    default:
      return 'text-secondary';
  }
};
</script>

<style scoped>
.reservation-details-container {
  max-width: 800px;
  margin: auto;
}

.card {
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 1rem;
  background-color: #007bff;
  color: white;
  border-radius: 10px 10px 0 0;
}

.card-body {
  padding: 1.5rem;
}

.list-group-item {
  font-size: 1rem;
  padding: 0.75rem 1rem;
}

.text-success {
  color: #28a745;
}

.text-danger {
  color: #dc3545;
}

.text-secondary {
  color: #6c757d;
}

.card-footer {
  padding: 1rem;
  border-radius: 0 0 10px 10px;
}

button {
  font-size: 1rem;
  padding: 0.5rem 1.5rem;
}

button i {
  margin-right: 0.5rem;
}
</style>
