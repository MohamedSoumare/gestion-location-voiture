<template>
  <div class="container mt-4">
    <h2>Détails de la Réservation</h2>
    <ul class="list-group">
      <li class="list-group-item"><strong>Client :</strong> {{ reservation.customer?.fullName || 'N/A' }}</li>
      <li class="list-group-item"><strong>Véhicule :</strong> {{ reservation.vehicle?.brand || 'N/A' }} {{ reservation.vehicle?.model || '' }}</li>
      <li class="list-group-item"><strong>Date de début :</strong> {{ reservation.startDate }}</li>
      <li class="list-group-item"><strong>Date de fin :</strong> {{ reservation.endDate }}</li>
      <li class="list-group-item"><strong>Montant Total :</strong> {{ reservation.totalAmount }}</li>
      <li class="list-group-item"><strong>Statut :</strong> {{ reservation.status }}</li>
    </ul>
    <button class="btn btn-secondary mt-3" @click="backToList">Retour</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useReservationStore } from '../../store/reservationStore';

const reservation = ref({});
const router = useRouter();
const route = useRoute();
const reservationStore = useReservationStore();

onMounted(async () => {
  const reservationId = route.params.id;
  await reservationStore.getReservationById(reservationId);
  reservation.value = reservationStore.reservation;
});

function backToList() {
  router.push({ name: 'ListReservation' });
}
</script>
