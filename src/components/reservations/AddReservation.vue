<!-- <template>
  <div class="container mt-4">
    <h2>Ajouter une Réservation</h2>
    <form @submit.prevent="handleAddReservation">
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
        <select v-model="reservation.status" class="form-control" required>
          <option value="reserved"> Réservé</option>
          <option value="cancelled">Annulé</option>
          <option value="maintenance">Maintenance</option>
          <option value="waiting">En cours</option>
        </select>
      </div>

      <button type="submit" class="btn btn-primary">Ajouter</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useReservationStore } from '../../store/reservationStore';
import { useVehicleStore } from '../../store/vehicleStore';
import { useCustomerStore } from '../../store/customerStore';
import Swal from 'sweetalert2';

const customerStore = useCustomerStore();
const vehicleStore = useVehicleStore();
const reservationStore = useReservationStore();
const router = useRouter();

const customers = ref([]);
const vehicles = ref([]);
const reservation = ref({
  customer_id: '',
  vehicle_id: '',
  startDate: '',
  endDate: '',
  totalAmount: 0,
  status: 'waiting'
});

onMounted(async () => {
  try {
    await customerStore.fetchCustomers();
    await vehicleStore.fetchVehicles();
    customers.value = customerStore.customers;
    vehicles.value = vehicleStore.vehicles;
  } catch (error) {
    Swal.fire('Erreur', 'Erreur lors du chargement des données.', 'error');
  }
});

const isVehicleAvailable = async (vehicleId, startDate, endDate) => {
  const existingReservations = await reservationStore.fetchReservationsByVehicle(vehicleId);
  return !existingReservations.some(reservation =>
    (new Date(startDate) <= new Date(reservation.endDate) &&
     new Date(endDate) >= new Date(reservation.startDate))
  );
};

const handleAddReservation = async () => {
  try {
    const available = await isVehicleAvailable(reservation.value.vehicle_id, reservation.value.startDate, reservation.value.endDate);
    if (!available) {
      Swal.fire('Erreur', 'Le véhicule sélectionné n\'est pas disponible pour les dates choisies.', 'error');
      return;
    }

    await reservationStore.addReservation(reservation.value);
    Swal.fire('Succès', 'Réservation ajoutée avec succès.', 'success');
    router.push({ name: 'ListReservation' });
  } catch (error) {
    Swal.fire('Erreur', 'Erreur lors de l\'ajout de la réservation.', 'error');
  }
};
</script>


<style scoped>
.container {
  max-width: 600px;
  margin-top: 5%;
}
</style> -->
<template>
  <div class="container mt-4">
    <h2>Ajouter une Réservation</h2>
    <form @submit.prevent="handleAddReservation">
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
        <select v-model="reservation.status" class="form-control" required>
          <option value="EN_ATTENTE">En attente</option>
          <option value="ANNULER">Annulée</option>
          <option value="CONFIRMER">Confirmée</option>
        </select>
      </div>


      <div class="d-flex justify-content-center mt-4">
        <button type="submit" class="btn btn-primary">Ajouter</button>
      <button @click.prevent="goBack" class="btn btn-secondary">Annuler</button></div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useReservationStore } from '../../store/reservationStore';
import { useVehicleStore } from '../../store/vehicleStore';
import { useCustomerStore } from '../../store/customerStore';
import Swal from 'sweetalert2';

const customerStore = useCustomerStore();
const vehicleStore = useVehicleStore();
const reservationStore = useReservationStore();
const router = useRouter();

const customers = ref([]);
const vehicles = ref([]);
const reservation = ref({
  customer_id: '',
  vehicle_id: '',
  startDate: '',
  endDate: '',
  totalAmount: 0,
  status: 'waiting'
});

onMounted(async () => {
  try {
    await customerStore.fetchCustomers();
    await vehicleStore.fetchVehicles();
    customers.value = customerStore.customers;
    vehicles.value = vehicleStore.vehicles;
  } catch (error) {
    Swal.fire('Erreur', 'Erreur lors du chargement des données.', 'error');
  }
});

const handleAddReservation = async () => {
  try {

    await reservationStore.addReservation(reservation.value);
    Swal.fire('Succès', 'Réservation ajoutée avec succès.', 'success');
    router.push({ name: 'ListReservation' });
  } catch (error) {
    Swal.fire('Erreur', 'Erreur lors de l\'ajout de la réservation.', 'error');
   
  }
};

const goBack = () => router.push({ name: 'ListReservation' });
</script>

<style scoped>
.container {
  max-width: 600px;
  margin-top: 5%;
}
button {
  margin: 10px;
}
</style>
