<template>
  <div class="container my-4">
    <h2>Ajouter un nouveau contrat</h2>
    <form @submit.prevent="submitContract"> 
      <div class="form-group mb-3">
        <label for="contractNumber">Numéro de Contrat</label>
        <input v-model="newContract.contractNumber" type="text" id="contractNumber" class="form-control" required />
      </div>
      <div class="form-group mb-3">
        <label for="customer">Client</label>
        <select v-model="newContract.customer_id" class="form-control" required>
          <option v-for="customer in customers" :key="customer.id" :value="customer.id">{{ customer.fullName }}</option>
        </select>
      </div>
      <div class="form-group mb-3">
        <label for="vehicle">Véhicule</label>
        <select v-model="newContract.vehicle_id" class="form-control" required>
          <option v-for="vehicle in vehicles" :key="vehicle.id" :value="vehicle.id">{{ vehicle.brand }} {{ vehicle.model }}</option>
        </select>
      </div>
      <div class="form-group mb-3">
        <label for="startDate">Date de Début</label>
        <input v-model="newContract.startDate" type="date" id="startDate" class="form-control" required />
      </div>
      <div class="form-group mb-3">
        <label for="returnDate">Date de Fin</label>
        <input v-model="newContract.returnDate" type="date" id="returnDate" class="form-control" required />
      </div>
      <div class="form-group mb-3">
        <label for="totalAmount">Montant</label>
        <input v-model="newContract.totalAmount" type="number" id="totalAmount" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="status" class="form-label">Statut</label>
        <select v-model="newContract.status" class="form-control" required>
          <option value="EN_ATTENTE">En attend</option>
          <option value="ANNULER">Annuller</option>
          <option value="VALIDER">Valider</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary">Ajouter</button>
    
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
  status: 'waitting'
});

const customers = ref([]);
const vehicles = ref([]);

onMounted(async () => {
  await customerStore.fetchCustomers();
  await vehicleStore.fetchVehicles();
  customers.value = customerStore.customers;
  vehicles.value = vehicleStore.vehicles;
});

const submitContract = async () => {
  if (!newContract.value.customer_id || !newContract.value.vehicle_id) {
    alert('Veuillez sélectionner un client et un véhicule.');
    return;
  }

  if (!newContract.value.startDate || !newContract.value.returnDate) {
    alert('Veuillez remplir les dates de début et de fin.');
    return;
  }

  try {
    await contractStore.addContract(newContract.value);
    router.push({ name: 'ListContrat' });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du contrat :', error);
    alert('Une erreur s\'est produite lors de l\'ajout du contrat.');
  }
};
</script>
<style scoped>
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
.container {
  max-width: 1000px;
  margin-top: 5%;
}
</style>
