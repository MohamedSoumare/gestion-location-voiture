<template>
  <div class="container my-4">
    <h2>Modifier le Contrat</h2>
    <form @submit.prevent="updateContract">
      <div class="form-group mb-3">
        <label for="contractNumber">Numéro de Contrat</label>
        <input v-model="contract.contractNumber" type="text" id="contractNumber" class="form-control" required />
      </div>
      <div class="form-group mb-3">
        <label for="customer">Client</label>
        <select v-model="contract.customer_id" class="form-control" required>
          <option v-for="customer in customers" :key="customer.id" :value="customer.id">{{ customer.fullName }}</option>
        </select>
      </div>
      <div class="form-group mb-3">
        <label for="vehicle">Véhicule</label>
        <select v-model="contract.vehicle_id" class="form-control" required>
          <option v-for="vehicle in vehicles" :key="vehicle.id" :value="vehicle.id">{{ vehicle.brand }} {{ vehicle.model }}</option>
        </select>
      </div>
      <div class="form-group mb-3">
        <label for="startDate">Date de Début</label>
        <input v-model="contract.startDate" type="date" id="startDate" class="form-control" required />
      </div>
      <div class="form-group mb-3">
        <label for="returnDate">Date de Fin</label>
        <input v-model="contract.returnDate" type="date" id="returnDate" class="form-control" required />
      </div>
      <div class="form-group mb-3">
        <label for="totalAmount">Montant</label>
        <input v-model="contract.totalAmount" type="number" id="totalAmount" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="status" class="form-label">Statut</label>
        <select v-model="contract.status" class="form-control" required>
          <option value="waitting">En attend</option>
          <option value="cancelled">Annuller</option>
          <option value="validate">Valider</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary">Enregistrer</button>
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
  status: 'waitting',
});

const customers = ref([]);
const vehicles = ref([]);

onMounted(async () => {
  await customerStore.fetchCustomers();
  await vehicleStore.fetchVehicles();
  customers.value = customerStore.customers;
  vehicles.value = vehicleStore.vehicles;
  contract.value = await contractStore.getContractById(route.params.id);
});

const updateContract = async () => {
  await contractStore.updateContract(route.params.id, contract.value);
  router.push({ name: 'ListContrat' });
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
