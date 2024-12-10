<template>
  <div class="container my-4">
    <h2 class="mb-5 text-center">Modifier le Contrat</h2>

    <!-- Affichage des erreurs générales -->
    <div v-if="validationErrors.length" class="alert alert-danger">
      <ul>
        <li v-for="(error, index) in validationErrors" :key="index">
          {{ error }}
        </li>
      </ul>
    </div>

    <div v-if="isLoading" class="text-center my-4">
      <p>Chargement des données...</p>
    </div>

    <!-- Formulaire -->
    <form v-else @submit.prevent="updateContract">
      <div class="row">
        <!-- Numéro de Contrat -->
        <div class="col-md-6 mb-3">
          <label for="contractNumber" class="form-label">Numéro de Contrat</label>
          <input
            v-model="contract.contractNumber"
            type="text"
            id="contractNumber"
            class="form-control"
            required
            disabled
          />
        </div>

        <!-- Client -->
        <div class="col-md-6 mb-3">
          <label for="customer" class="form-label">Client</label>
          <select v-model="contract.customer_id" id="customer" class="form-select" required disabled>
            <option disabled value="">Sélectionner un client</option>
            <option v-for="customer in customers" :key="customer.id" :value="customer.id">
              {{ customer.fullName }}
            </option>
          </select>
        </div>

        <!-- Véhicule -->
        <div class="col-md-6 mb-3">
          <label for="vehicle" class="form-label">Véhicule</label>
          <select v-model="contract.vehicle_id" id="vehicle" class="form-select" required>
            <option disabled value="">Sélectionner un véhicule</option>
            <option v-for="vehicle in vehicles" :key="vehicle.id" :value="vehicle.id">
              {{ vehicle.brand }} {{ vehicle.model }}
            </option>
          </select>
        </div>

        <!-- Dates -->
        <div class="col-md-6 mb-3">
          <label for="startDate" class="form-label">Date de Début</label>
          <input
            v-model="contract.startDate"
            type="date"
            id="startDate"
            class="form-control"
            required
          />
        </div>
        <div class="col-md-6 mb-3">
          <label for="returnDate" class="form-label">Date de Fin</label>
          <input
            v-model="contract.returnDate"
            type="date"
            id="returnDate"
            class="form-control"
            required
          />
        </div>

        <!-- Montant -->
        <div class="col-md-6 mb-3">
          <label for="totalAmount" class="form-label">Montant</label>
          <input
            v-model="contract.totalAmount"
            type="number"
            id="totalAmount"
            class="form-control"
            step="0.01"
            min="0"
            max="9999999999.99"
            required
          />
        </div>

        <!-- Statut -->
        <div class="col-md-6 mb-3">
          <label for="status" class="form-label">Statut</label>
          <select v-model="contract.status" id="status" class="form-select" required>
            <option disabled value="">Sélectionner un statut</option>
            <option value="EN_ATTENTE">Annuler</option> 
            <option value="ANNULER">Annuler</option>
            <option value="VALIDER">Valider</option>
          </select>
        </div>
      </div>

      <!-- Boutons -->
      <div class="d-flex justify-content-between mt-4">
        <button type="submit" class="btn btn-primary">Enregistrer</button>
        <button @click.prevent="goBack" class="btn btn-secondary mx-2">Annuler</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useContractStore } from '../../store/contratStore';
import { useCustomerStore } from '../../store/customerStore';
import { useVehicleStore } from '../../store/vehicleStore';
import { useRouter, useRoute } from 'vue-router';
import Swal from 'sweetalert2';

const contractStore = useContractStore();
const customerStore = useCustomerStore();
const vehicleStore = useVehicleStore();
const router = useRouter();
const route = useRoute();

const isLoading = ref(true);
const contract = ref({
  contractNumber: '',
  customer_id: null,
  vehicle_id: null,
  startDate: '',
  returnDate: '',
  totalAmount: 0,
  status: 'VALIDER',
});

const customers = ref([]);
const vehicles = ref([]);
const validationErrors = ref([]);

const validateForm = () => {
  const errors = [];
  const today = new Date().toISOString().split('T')[0];

  if (!contract.value.contractNumber.trim() || contract.value.contractNumber.length < 5) {
    errors.push('Le numéro de contrat est obligatoire et doit comporter au moins 5 caractères.');
  }
  if (!contract.value.customer_id) {
    errors.push('Veuillez sélectionner un client.');
  }
  if (!contract.value.vehicle_id) {
    errors.push('Veuillez sélectionner un véhicule.');
  }
  if (!contract.value.startDate) {
    errors.push('La date de début est obligatoire.');
  } else if (contract.value.startDate < today) {
    errors.push('La date de début ne peut pas être dans le passé.');
  }
  if (!contract.value.returnDate) {
    errors.push('La date de fin est obligatoire.');
  } else if (new Date(contract.value.returnDate) <= new Date(contract.value.startDate)) {
    errors.push('La date de fin doit être postérieure à la date de début.');
  }
  if (contract.value.totalAmount <= 0) {
    errors.push('Le montant total doit être supérieur à zéro.');
  }

  validationErrors.value = errors;
  return errors.length === 0;
};

const updateContract = async () => {
  if (!validateForm()) return;

  try {
    await contractStore.updateContract(route.params.id, contract.value);
    Swal.fire({
      icon: 'success',
      title: 'Succès',
      text: 'Le contrat a été mis à jour avec succès.',
    });
    router.push({ name: 'ListContrat' });
  } catch (error) {
    if (error.response && error.response.data && error.response.data.erreurs) {
      validationErrors.value = error.response.data.erreurs.map((err) => err.message);
    } else {
      validationErrors.value = ['Une erreur inconnue est survenue.'];
    }
  }
};

const goBack = () => router.push({ name: 'ListContrat' });

onMounted(async () => {
  try {
    await customerStore.fetchCustomers();
    await vehicleStore.fetchVehicles();
    customers.value = customerStore.customers;
    vehicles.value = vehicleStore.vehicles;

    const data = await contractStore.getContractById(route.params.id);
    contract.value = {
      ...data,
      startDate: data.startDate?.split('T')[0] || '',
      returnDate: data.returnDate?.split('T')[0] || '',
    };
  } catch {
    validationErrors.value.push('Erreur lors du chargement des données.');
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin-top: 5%;
}
button {
  margin: 5px;
}
</style>
