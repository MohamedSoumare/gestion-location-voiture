<!-- DetailsContract.vue -->
<template>
  <div class="details-container my-4">
    <div class="card">
      <div class="card-header text-white bg-primary">
        <h2 class="text-center">Détails du Contrat</h2>
      </div>
      <div class="card-body">
        <div v-if="contract" class="details-content">
          <div class="row mb-3">
            <div class="col-md-6">
              <p><strong>Numéro de Contrat:</strong> {{ contract.contractNumber }}</p>
            </div>
            <div class="col-md-6">
              <p><strong>Client:</strong> {{ getClientName(contract.customer_id) }}</p>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <p><strong>Véhicule:</strong> {{ getVehicleName(contract.vehicle_id) }}</p>
            </div>
            <div class="col-md-6">
              <p><strong>Date de Début:</strong> {{ formatDate(contract.startDate) }}</p>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <p><strong>Date de Fin:</strong> {{ formatDate(contract.returnDate) }}</p>
            </div>
            <div class="col-md-6">
              <p><strong>Montant:</strong> {{ contract.totalAmount }} MRU</p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <p><strong>Statut:</strong> <span :class="statusClass(contract.status)">{{ contract.status }}</span></p>
            </div>
          </div>
        </div>
      </div>
      <div class="card-footer text-center d-flex justify-content-end">
        <button @click="goBack" class="btn btn-secondary">
          <i class="bi bi-arrow-left"></i> Retour
        </button>
      </div>
    </div>
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

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
} // Correction ici : fermeture manquante de la fonction

const statusClass = (status) => {
  switch (status) {
    case 'Actif':
      return 'text-success';
    case 'Terminé':
      return 'text-secondary';
    case 'Annulé':
      return 'text-danger';
    default:
      return 'text-warning';
  }
};
</script>

<style scoped>
.details-container {
  max-width: 900px;
  margin: auto;
}

.card-header {
  padding: 1rem;
  background-color: #007bff;
  color: white;
}

.card-body {
  padding: 2rem;
}

.card-footer {
  padding: 1rem;
}

.details-content p {
  margin: 0.5rem 0;
}

.btn i {
  margin-right: 0.5rem;
}

.text-success {
  color: #28a745;
}

.text-danger {
  color: #dc3545;
}

.text-secondary {
  color: #6c757d;
}

.text-warning {
  color: #ffc107;
}
</style>
