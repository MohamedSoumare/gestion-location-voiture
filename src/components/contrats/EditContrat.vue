<template>
  <div class="container my-4">
    <h2 class="mb-5 d-flex justify-content-center">Modifier le Contrat</h2>

    <!-- Erreurs générales -->
    <div v-if="validationErrors.length" class="alert alert-danger">
      <ul>
        <li v-for="(error, index) in validationErrors" :key="index">{{ error }}</li>
      </ul>
    </div>

    <!-- Indicateur de chargement -->
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
          />
          <small v-if="fieldErrors.contractNumber" class="text-danger">
            {{ fieldErrors.contractNumber }}
          </small>
        </div>

        <!-- Client -->
        <div class="col-md-6 mb-3">
          <label for="customer" class="form-label">Client</label>
          <select v-model="contract.customer_id" id="customer" class="form-select" required>
            <option v-for="customer in customers" :key="customer.id" :value="customer.id">
              {{ customer.fullName }}
            </option>
          </select>
          <small v-if="fieldErrors.customer_id" class="text-danger">{{ fieldErrors.customer_id }}</small>
        </div>

        <!-- Véhicule -->
        <div class="col-md-6 mb-3">
          <label for="vehicle" class="form-label">Véhicule</label>
          <select v-model="contract.vehicle_id" id="vehicle" class="form-select" required>
            <option v-for="vehicle in vehicles" :key="vehicle.id" :value="vehicle.id">
              {{ vehicle.brand }} {{ vehicle.model }}
            </option>
          </select>
          <small v-if="fieldErrors.vehicle_id" class="text-danger">{{ fieldErrors.vehicle_id }}</small>
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
          <small v-if="fieldErrors.startDate" class="text-danger">{{ fieldErrors.startDate }}</small>
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
          <small v-if="fieldErrors.returnDate" class="text-danger">{{ fieldErrors.returnDate }}</small>
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
  max="9999999999.99"
  required
/>
         

          <small v-if="fieldErrors.totalAmount" class="text-danger">{{ fieldErrors.totalAmount }}</small>
        </div>

        <!-- Statut -->
        <div class="col-md-6 mb-3">
          <label for="status" class="form-label">Statut</label>
          <select v-model="contract.status" id="status" class="form-select" required>
            <option value="EN_ATTENTE">En attente</option>
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
  status: 'EN_ATTENTE',
});

const customers = ref([]);
const vehicles = ref([]);
const validationErrors = ref([]);
const fieldErrors = ref({});

const validateForm = () => {
  validationErrors.value = [];
  fieldErrors.value = {};

  if (!contract.value.contractNumber.trim()) {
    fieldErrors.value.contractNumber = 'Le numéro de contrat est obligatoire.';
  }
  if (!contract.value.customer_id) {
    fieldErrors.value.customer_id = 'Veuillez sélectionner un client.';
  }
  if (!contract.value.vehicle_id) {
    fieldErrors.value.vehicle_id = 'Veuillez sélectionner un véhicule.';
  }
  if (!contract.value.startDate) {
    fieldErrors.value.startDate = 'La date de début est obligatoire.';
  }
  if (!contract.value.returnDate) {
    fieldErrors.value.returnDate = 'La date de fin est obligatoire.';
  } else if (new Date(contract.value.startDate) > new Date(contract.value.returnDate)) {
    fieldErrors.value.returnDate = 'La date de fin doit être après la date de début.';
  }
  
  if (!contract.value.totalAmount.toString().trim()) {
    fieldErrors.value.totalAmount = 'Le montant est obligatoire.';
  } else if (!/^\d{1,10}(\.\d{1,2})?$/.test(contract.value.totalAmount)) {
    fieldErrors.value.totalAmount =
      'Le montant doit être un nombre positif avec jusqu’à 10 chiffres.';
  }
  return Object.keys(fieldErrors.value).length === 0;
};

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
  } catch (error) {
    validationErrors.value.push('Erreur lors du chargement des données.');
  } finally {
    isLoading.value = false;
  }
});

const updateContract = async () => {
  if (!validateForm()) return;

  try {
    const formattedContract = {
      ...contract.value,
      startDate: new Date(contract.value.startDate),
      returnDate: new Date(contract.value.returnDate),
    };
    await contractStore.updateContract(route.params.id, formattedContract);
    router.push({ name: 'ListContrat' });
  } catch (error) {
    if (error.response?.data?.erreurs) {
      error.response.data.erreurs.forEach((err) => {
        if (err.champ) {
          fieldErrors.value[err.champ] = err.message;
        } else {
          validationErrors.value.push(err.message);
        }
      });
    } else {
      validationErrors.value.push('Une erreur inattendue est survenue.');
    }
  }
};

const goBack = () => router.push({ name: 'ListContrat' });
</script>
