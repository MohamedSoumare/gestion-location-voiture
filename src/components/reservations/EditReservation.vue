<template>
  <div class="container mt-4">
    <h2>Modifier la Réservation</h2>
    <form @submit.prevent="handleEditReservation">
      <div class="mb-3">
        <label for="customer" class="form-label">Client</label>
        <select v-model="reservation.customer_id" class="form-select" required>
          <option disabled value="">Sélectionner un Client</option>
          <option v-for="customer in customers" :key="customer.id" :value="customer.id">
            {{ customer.fullName }}
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label for="vehicle" class="form-label">Véhicule</label>
        <select v-model="reservation.vehicle_id" class="form-select" required>
          <option disabled value="">Sélectionner un Véhicule</option>
          <option v-for="vehicle in vehicles" :key="vehicle.id" :value="vehicle.id">
            {{ vehicle.brand }} {{ vehicle.model }}
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label for="startDate" class="form-label">Date de début</label>
        <input type="date" v-model="reservation.startDate" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="endDate" class="form-label">Date de fin</label>
        <input type="date" v-model="reservation.endDate" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="totalAmount" class="form-label">Montant Total</label>
        <input type="number" v-model="reservation.totalAmount" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="status" class="form-label">Statut</label>
        <select v-model="reservation.status" class="form-select" required>
          <option value="waitting">En attente</option>
          <option value="cancelled">Annulée</option>
          <option value="confirmed">Confirmée</option>
          <option value="ongoing">En cours</option>
        </select>
      </div>
      <div class="d-flex justify-content-center mt-4">
      <button type="submit" class="btn btn-primary">Enregistrer</button>
      <button @click.prevent="goBack" class="btn btn-secondary">Annuler</button></div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useReservationStore } from '../../store/reservationStore';
import { useVehicleStore } from '../../store/vehicleStore';
import { useCustomerStore } from '../../store/customerStore';

const router = useRouter();
const route = useRoute();
const reservationStore = useReservationStore();
const customerStore = useCustomerStore();
const vehicleStore = useVehicleStore();

const customers = ref([]);
const vehicles = ref([]);
const reservation = ref({
  customer_id: '',
  vehicle_id: '',
  startDate: '',
  endDate: '',
  totalAmount: 0,
  status: ''
});

onMounted(async () => {
  try {
    // Récupère les clients et les véhicules
    await customerStore.fetchCustomers();
    await vehicleStore.fetchVehicles();
    customers.value = customerStore.customers;
    vehicles.value = vehicleStore.vehicles;

    // Récupère les informations de la réservation à modifier
    const reservationId = route.params.id;
    await reservationStore.getReservationById(reservationId);
    const existingReservation = reservationStore.reservation;

    // Remplir le formulaire avec les données existantes
    reservation.value = {
      customer_id: existingReservation.customer_id,
      vehicle_id: existingReservation.vehicle_id,
      startDate: existingReservation.startDate,
      endDate: existingReservation.endDate,
      totalAmount: existingReservation.totalAmount,
      status: existingReservation.status
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
  }
});

const handleEditReservation = async () => {
  if (new Date(reservation.value.endDate) < new Date(reservation.value.startDate)) {
    alert("La date de fin doit être superiéur à la date de début.");
    return;
  }

  try {
    const updatedReservationData = {
      customer_id: reservation.value.customer_id,
      vehicle_id: reservation.value.vehicle_id,
      startDate: reservation.value.startDate,
      endDate: reservation.value.endDate,
      totalAmount: reservation.value.totalAmount,
      status: reservation.value.status
    };

    const reservationId = route.params.id;
    await reservationStore.updateReservation(reservationId, updatedReservationData);
    router.push('/reservations'); 
  } catch (error) {
    console.error("Erreur lors de la modification de la réservation :", error);
  }
};
const goBack = () => router.push({ name: 'ListReservation' });
</script>

<style scoped>
.container {
  max-width: 800px;
  margin-top: 5%;
}
button {
 margin: 10px;
}
</style>
