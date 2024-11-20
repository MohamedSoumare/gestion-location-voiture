<template>
  <div class="container my-4">
    <h2 class="mb-5 d-flex justify-content-center">Modifier le Contrat</h2>

    <div v-if="validationErrors.length" class="alert alert-danger">
  <ul>
    <li v-for="(error, index) in validationErrors" :key="index">{{ error }}</li>
  </ul>
</div>


    <form @submit.prevent="updateContract">
      <div class="row">
        <!-- Numéro de Contrat -->
        <div class="col-md-6 mb-3">
          <label for="contractNumber" class="form-label">Numéro de Contrat</label>
          <input v-model="contract.contractNumber" type="text" id="contractNumber" class="form-control" required />
          <small v-if="fieldErrors.contractNumber" class="text-danger">
  {{ fieldErrors.contractNumber }}
</small>

        </div>

        <!-- Client -->
        <div class="col-md-6 mb-3">
          <label for="customer" class="form-label">Client</label>
          <select v-model="contract.customer_id" class="form-select" required>
            <option v-for="customer in customers" :key="customer.id" :value="customer.id">
              {{ customer.fullName }}
            </option>
          </select>
          <small v-if="fieldErrors.customer_id" class="text-danger">{{ fieldErrors.customer_id }}</small>
        </div>

        <!-- Véhicule -->
        <div class="col-md-6 mb-3">
          <label for="vehicle" class="form-label">Véhicule</label>
          <select v-model="contract.vehicle_id" class="form-select" required>
            <option v-for="vehicle in vehicles" :key="vehicle.id" :value="vehicle.id">
              {{ vehicle.brand }} {{ vehicle.model }}
            </option>
          </select>
          <small v-if="fieldErrors.vehicle_id" class="text-danger">{{ fieldErrors.vehicle_id }}</small>
        </div>

        <!-- Dates -->
        <div class="col-md-6 mb-3">
          <label for="startDate" class="form-label">Date de Début</label>
          <input v-model="contract.startDate" type="date" id="startDate" class="form-control" required />
          <small v-if="fieldErrors.startDate" class="text-danger">{{ fieldErrors.startDate }}</small>
        </div>
        <div class="col-md-6 mb-3">
          <label for="returnDate" class="form-label">Date de Fin</label>
          <input v-model="contract.returnDate" type="date" id="returnDate" class="form-control" required />
          <small v-if="fieldErrors.returnDate" class="text-danger">{{ fieldErrors.returnDate }}</small>
        </div>

        <!-- Montant -->
        <div class="col-md-6 mb-3">
          <label for="totalAmount" class="form-label">Montant</label>
          <input v-model="contract.totalAmount" type="number" id="totalAmount" class="form-control" required />
          <small v-if="fieldErrors.totalAmount" class="text-danger">{{ fieldErrors.totalAmount }}</small>
        </div>

        <!-- Statut -->
        <div class="col-md-6 mb-3">
          <label for="status" class="form-label">Statut</label>
          <select v-model="contract.status" class="form-select" required>
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

onMounted(async () => {
  try {
    await customerStore.fetchCustomers();
    await vehicleStore.fetchVehicles();
    customers.value = customerStore.customers;
    vehicles.value = vehicleStore.vehicles;
    contract.value = await contractStore.getContractById(route.params.id);
  } catch (error) {
    console.error("Erreur lors du chargement des données :", error);
  }
});

const updateContract = async () => {
  validationErrors.value = [];
  fieldErrors.value = {};

  try {
    await contractStore.updateContract(route.params.id, contract.value);
    router.push({ name: 'ListContrat' });
  } catch (error) {
  if (error.response && error.response.data && error.response.data.erreurs) {
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
