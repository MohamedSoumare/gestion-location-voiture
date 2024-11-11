<!-- DetailsContract.vue -->
<template>
  <div class="container my-4">
    <h2>Détails du Contrat</h2>
    <div v-if="contract">
      <p><strong>Numéro de Contrat:</strong> {{ contract.contractNumber }}</p>
      <p><strong>Client:</strong> {{ getClientName(contract.customer_id) }}</p>
      <p><strong>Véhicule:</strong> {{ getVehicleName(contract.vehicle_id) }}</p>
      <p><strong>Date de Début:</strong> {{ formatDate(contract.startDate) }}</p>
      <p><strong>Date de Fin:</strong> {{ formatDate(contract.returnDate) }}</p>
      <p><strong>Montant:</strong> {{ contract.totalAmount }} €</p>
      <p><strong>Statut:</strong> {{ contract.status }}</p>
    </div>
    <button @click="goBack" class="btn btn-secondary">Retour</button>
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

const contract = ref(null);

onMounted(async () => {
  const contractId = route.params.id;
  contract.value = await contractStore.getContractById(contractId);
});

const goBack = () => {
  router.push({ name: 'ListContrat' });
};

const getClientName = (customer_id) => {
  const client = customerStore.customers.find(c => c.id === customer_id);
  return client ? client.fullName : 'Inconnu';
};

const getVehicleName = (vehicle_id) => {
  const vehicle = vehicleStore.vehicles.find(v => v.id === vehicle_id);
  return vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Inconnu';
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR');
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
