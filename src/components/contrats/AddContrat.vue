<template>
  <div class="container my-4">
    <h2 class="mb-5 d-flex justify-content-center">Ajouter un nouveau contrat</h2>

  <div v-if="contractStore.validationErrors.length" class="alert alert-danger">
    <ul>
      <li v-for="error in contractStore.validationErrors" :key="error">{{ error }}</li>
    </ul>
  </div>

  <form @submit.prevent="submitContract"> 
      <div class="row g-4">
        <!-- Numéro de Contrat -->
        <div class="col-md-6">
          <label for="contractNumber" class="form-label">Numéro de Contrat</label>
          <input v-model="newContract.contractNumber" type="text" id="contractNumber" class="form-control" required />
        </div>

        <!-- Client -->
        <div class="col-md-6">
          <label for="customer" class="form-label">Client</label>
          <select v-model="newContract.customer_id" class="form-select" required>
            <option disabled value="">Sélectionner un Client</option>
            <option v-for="customer in customers" :key="customer.id" :value="customer.id">
              {{ customer.fullName }}
            </option>
          </select>
        </div>

        <!-- Véhicule -->
        <div class="col-md-6">
          <label for="vehicle" class="form-label">Véhicule</label>
          <select v-model="newContract.vehicle_id" class="form-select" required>
            <option disabled value="">Sélectionner un Véhicule</option>
            <option v-for="vehicle in vehicles" :key="vehicle.id" :value="vehicle.id">
              {{ vehicle.brand }} {{ vehicle.model }}
            </option>
          </select>
        </div>

        <!-- Date de Début -->
        <div class="col-md-6">
          <label for="startDate" class="form-label">Date de Début</label>
          <input v-model="newContract.startDate" type="date" id="startDate" class="form-control" required />
        </div>

        <!-- Date de Fin -->
        <div class="col-md-6">
          <label for="returnDate" class="form-label">Date de Fin</label>
          <input v-model="newContract.returnDate" type="date" id="returnDate" class="form-control" required />
        </div>

        <!-- Montant -->
        <div class="col-md-6">
          <label for="totalAmount" class="form-label">Montant</label>
          <input v-model="newContract.totalAmount" type="number" id="totalAmount" class="form-control" required />
        </div>

        <!-- Statut -->
        <div class="col-md-6">
          <label for="status" class="form-label">Statut</label>
          <select v-model="newContract.status" class="form-select" required>
            <option value="EN_ATTENTE">En attente</option>
            <option value="ANNULER">Annulée</option>
            <option value="VALIDER">Validée</option>
          </select>
        </div>
      </div>

      <div class="d-flex justify-content-between mt-4">
        <button type="submit" class="btn btn-primary">Ajouter</button>
        <button @click.prevent="goBack" class="btn btn-secondary">Annuler</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useContractStore } from '../../store/contratStore';
import { useCustomerStore } from '../../store/customerStore';
import { useVehicleStore } from '../../store/vehicleStore';
import { useRouter } from 'vue-router';

const contractStore = useContractStore();
const customerStore = useCustomerStore();
const vehicleStore = useVehicleStore();
const router = useRouter();

const newContract = ref({
  contractNumber: '',
  customer_id: null,
  vehicle_id: null,
  startDate: '',
  returnDate: '',
  totalAmount: 0,
  status: 'EN_ATTENTE'
});

const customers = ref([]);
const vehicles = ref([]);
const validationErrors = ref([]);

onMounted(async () => {
  await customerStore.fetchCustomers();
  await vehicleStore.fetchVehicles();
  customers.value = customerStore.customers;
  vehicles.value = vehicleStore.vehicles;
});

const validateDates = () => {
  const errors = [];
  const today = new Date().toISOString().split('T')[0];

  if (newContract.value.startDate < today) {
    errors.push('La date de départ ne peut pas être dans le passé.');
  }
  if (newContract.value.startDate === newContract.value.endDate) {
    errors.push('La date de retour ne peut pas être identique à la date de début.');
  }
  if (new Date(newContract.value.endDate) < new Date(newContract.value.startDate)) {
    errors.push('La date de fin ne peut pas être antérieure à la date de début.');
  }

  return errors;
};
const submitContract = async () => {
  validationErrors.value = validateDates();

if (validationErrors.value.length > 0) {
  return;
}
  if (!newContract.value.customer_id || !newContract.value.vehicle_id) {
    alert('Veuillez sélectionner un client et un véhicule.');
    return;
  }

  if (!newContract.value.startDate || !newContract.value.returnDate) {
    alert('Veuillez remplir les dates de début et de fin.');
    return;
  }
  validationErrors.value = validateDates();
  if (validationErrors.value.length > 0) return;
  try {
    await contractStore.addContract(newContract.value);
    router.push({ name: 'ListContrat' });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du contrat :', error);
    alert('Une erreur s\'est produite lors de l\'ajout du contrat.');
  }
};

const goBack = () => router.push({ name: 'ListContrat' });

</script>

<style scoped>
.container {
  max-width: 1000px;
  margin-top: 5%;
}
button {
  margin: 5px;
}
.table th, .table td {
  text-align: center;
}
.table thead th {
  background-color: #2f6690;
  color: white;
}
.table tbody tr:hover {
  background-color: #f1f1f1;
}
.btn i {
  font-size: 1rem;
}
</style>
