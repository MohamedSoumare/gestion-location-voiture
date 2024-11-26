<template>
  <div class="container mt-4">
    <h2 class="mb-5 d-flex justify-content-center">Ajouter une Réservation</h2>

    <div v-if="validationErrors.length" class="alert alert-danger">
  <ul>
    <li v-for="(error, index) in validationErrors" :key="index">
      {{ error }}
    </li>
  </ul>
</div>

    <!-- Formulaire -->
    <form @submit.prevent="handleAddReservation">
      <div class="row">
        <!-- Client -->
        <div class="col-md-6 mb-3">
          <label for="customer" class="form-label">Client</label>
          <select v-model="reservation.customer_id" class="form-select" required>
            <option disabled value="">Sélectionner un Client</option>
            <option v-for="customer in customers" :key="customer.id" :value="customer.id">
              {{ customer.fullName }}
            </option>
          </select>
        </div>

        <!-- Véhicule -->
        <div class="col-md-6 mb-3">
          <label for="vehicle" class="form-label">Véhicule</label>
          <select v-model="reservation.vehicle_id" class="form-select" required>
            <option disabled value="">Sélectionner un Véhicule</option>
            <option v-for="vehicle in vehicles" :key="vehicle.id" :value="vehicle.id">
              {{ vehicle.brand }} {{ vehicle.model }}
            </option>
          </select>
        </div>
      </div>

      <div class="row">
        <!-- Date de début -->
        <div class="col-md-6 mb-3">
          <label for="startDate" class="form-label">Date de début</label>
          <input type="date" v-model="reservation.startDate" class="form-control" required />
        </div>

        <!-- Date de fin -->
        <div class="col-md-6 mb-3">
          <label for="endDate" class="form-label">Date de fin</label>
          <input type="date" v-model="reservation.endDate" class="form-control" required />
        </div>
      </div>

      <div class="row">
        <!-- Montant Total -->
        <div class="col-md-6 mb-3">
          <label for="totalAmount" class="form-label">Montant Total</label>
          <input
            type="number"
            v-model="reservation.totalAmount"
            class="form-control"
            min="0"
            required
          />
        </div>

        <!-- Statut -->
        <div class="col-md-6 mb-3">
          <label for="status" class="form-label">Statut</label>
          <select v-model="reservation.status" class="form-select" required>
            <option value="EN_ATTENTE">En attente</option>
            <option value="CONFIRMER">Confirmée</option>
          </select>
        </div>
      </div>

      <!-- Boutons -->
      <div class="d-flex justify-content-between mt-4">
        <button type="submit" class="btn btn-primary mx-2">Ajouter</button>
        <button @click.prevent="goBack" class="btn btn-secondary mx-2">Annuler</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useReservationStore } from "../../store/reservationStore";
import { useCustomerStore } from "../../store/customerStore";
import { useVehicleStore } from "../../store/vehicleStore";
import Swal from "sweetalert2";

const router = useRouter();
const reservationStore = useReservationStore();
const customerStore = useCustomerStore();
const vehicleStore = useVehicleStore();

const customers = ref([]);
const vehicles = ref([]);
const reservation = ref({
  customer_id: "",
  vehicle_id: "",
  startDate: "",
  endDate: "",
  totalAmount: 0,
  status: "EN_ATTENTE",
});
const validationErrors = ref([]);

const validateForm = () => {
  const errors = [];
  const today = new Date().toISOString().split("T")[0];

  if (!reservation.value.customer_id) {
    errors.push("Veuillez sélectionner un client.");
  }
  if (!reservation.value.vehicle_id) {
    errors.push("Veuillez sélectionner un véhicule.");
  }
  if (!reservation.value.startDate || !reservation.value.endDate) {
    errors.push("Les dates de début et de fin sont obligatoires.");
  }
  if (reservation.value.startDate < today) {
    errors.push("La date de début ne peut pas être dans le passé.");
  }
  if (new Date(reservation.value.endDate) < new Date(reservation.value.startDate)) {
    errors.push("La date de fin ne peut pas être antérieure à la date de début.");
  }
  if (!reservation.value.totalAmount || reservation.value.totalAmount <= 0) {
    errors.push("Le montant total doit être supérieur à 0.");
  }

  return errors;
};

onMounted(async () => {
  try {
    await customerStore.fetchCustomers();
    await vehicleStore.fetchVehicles();
    customers.value = customerStore.customers;
    vehicles.value = vehicleStore.vehicles;
  } catch (error) {
    console.error("Erreur lors du chargement des données :", error);
  }
});
const handleAddReservation = async () => {
  // Valider le formulaire côté frontend
  validationErrors.value = validateForm();

  if (validationErrors.value.length > 0) {
    Swal.fire("Erreur", "Veuillez corriger les erreurs dans le formulaire.", "error");
    return;
  }

  try {
    // Appeler l'API pour ajouter la réservation
    await reservationStore.addReservation(reservation.value);
    Swal.fire("Succès", "Réservation ajoutée avec succès.", "success");
    router.push({ name: "ListReservation" });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la réservation :", error);

    // Vérifier si une réponse avec un message d'erreur est disponible
    if (error.response && error.response.data && error.response.data.error) {
      // Ajouter le message d'erreur unique renvoyé par l'API à validationErrors
      validationErrors.value = [error.response.data.error];
    } else {
      // En cas d'erreur inconnue, ajouter un message générique
      validationErrors.value = ["Une erreur est survenue, veuillez réessayer."];
    }

    // Afficher une alerte pour informer l'utilisateur
    Swal.fire("Erreur", "Une erreur est survenue lors de l'ajout de la réservation.", "error");
  }
};


const goBack = () => router.push({ name: "ListReservation" });
</script>

<style scoped>
.container {
  max-width: 800px;
  margin-top: 2%;
}
</style>
