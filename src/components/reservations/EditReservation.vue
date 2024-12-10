<template>
  <div class="container mt-4">
    <h2 class="mb-5 d-flex justify-content-center">Modifier la Réservation</h2>
    
    <div v-if="validationErrors && validationErrors.length" class="alert alert-danger">
      <ul>
        <li v-for="(error, index) in validationErrors" :key="index">{{ error }}</li>
      </ul>
    </div>

    <form @submit.prevent="handleEditReservation">
      <div class="row g-4">
  
        <div class="col-md-6">
          <label for="customer" class="form-label">Client</label>
          <select v-model="reservation.customer_id" class="form-select" required>
            <option disabled value="">Sélectionner un Client</option>
            <option v-for="customer in customers" :key="customer.id" :value="customer.id">
              {{ customer.fullName }}
            </option>
          </select>
        </div>
        <div class="col-md-6">
          <label for="vehicle" class="form-label">Véhicule</label>
          <select v-model="reservation.vehicle_id" class="form-select" required>
            <option disabled value="">Sélectionner un Véhicule</option>
            <option v-for="vehicle in vehicles" :key="vehicle.id" :value="vehicle.id">
              {{ vehicle.brand }} {{ vehicle.model }}
            </option>
          </select>
        </div>
        <div class="col-md-6">
          <label for="startDate" class="form-label">Date de début</label>
          <input type="date" v-model="reservation.startDate" class="form-control" required />
        </div>

        <div class="col-md-6">
          <label for="endDate" class="form-label">Date de fin</label>
          <input type="date" v-model="reservation.endDate" class="form-control" required />
        </div>

        <!-- Montant Total -->
        <div class="col-md-6">
          <label for="totalAmount" class="form-label">Montant partiel</label>
          <input type="number" v-model="reservation.totalAmount"  class="form-control" 
          step="0.01"
  max="9999999999.99"

           required />
        </div>

        <!-- Statut -->
        <div class="col-md-6">
          <label for="status" class="form-label">Statut</label>
          <select v-model="reservation.status" class="form-select" required>
            <option value="EN_ATTENTE">En attente</option>
            <option value="ANNULER">Annulée</option>
            <option value="CONFIRMER">Confirmée</option>
          </select>
        </div>
      </div>

      <div class="d-flex justify-content-between mt-4">
        <button type="submit" class="btn btn-primary">Enregistrer</button>
        <button @click.prevent="goBack" class="btn btn-secondary">Annuler</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
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

const validationErrors = ref([]);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
};


onMounted(async () => {
  try {
    await customerStore.fetchCustomers();
    await vehicleStore.fetchVehicles();
    customers.value = customerStore.customers;
    vehicles.value = vehicleStore.vehicles;

    const reservationId = route.params.id;
    await reservationStore.getReservationById(reservationId);

    const existingReservation = reservationStore.reservation;

  reservation.value = {
  customer_id: existingReservation.customer_id,
  vehicle_id: existingReservation.vehicle_id,
  startDate: formatDate(existingReservation.startDate),
  endDate: formatDate(existingReservation.endDate),
  totalAmount: existingReservation.totalAmount,
  status: existingReservation.status
};

  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
  }
});

const handleEditReservation = async () => {
  validationErrors.value = [];
  const today = new Date();
  const startDate = new Date(reservation.value.startDate);
  const endDate = new Date(reservation.value.endDate);

  if (startDate < today) {
    validationErrors.value.push("La réservation ne peut pas commencer dans une période (date) passée.");
  }
  if (startDate.getTime() === endDate.getTime()) {
    validationErrors.value.push("La date de retour ne peut pas être identique à la date de départ.");
  }
  if (endDate < startDate) {
    validationErrors.value.push("La date de fin doit être supérieure à la date de début.");
  }
  if (reservation.value.totalAmount <= 0) {
  validationErrors.value.push("Le montant total doit être un nombre positif.");
}

if (reservation.value.totalAmount.toString().length > 10) {
  validationErrors.value.push("Le montant total ne doit pas dépasser 10 chiffres.");
}

  if (validationErrors.value.length > 0) {
    return; // Stop if validation errors exist
  }

  try {
    const updatedReservationData = {
  customer_id: reservation.value.customer_id,
  vehicle_id: reservation.value.vehicle_id,
  startDate: formatDate(reservation.value.startDate),
  endDate: formatDate(reservation.value.endDate),
  totalAmount: reservation.value.totalAmount,
  status: reservation.value.status || 'EN_ATTENTE',
};


    const reservationId = route.params.id;
    await reservationStore.updateReservation(reservationId, updatedReservationData);
    router.push('/reservations'); 
  } catch (error) {
  validationErrors.value.push("Erreur lors de la modification de la réservation.");
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
