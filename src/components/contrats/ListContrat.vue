<template> 
  <div class="container my-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Liste des Contrats</h2>
      <button @click="addContract" class="btn btn-primary mt-5">
        <i class="fas fa-plus"></i> Ajouter un contrat
      </button>
    </div>

    <table class="table table-striped table-hover table-bordered mt-3">
      <thead>
        <tr>
          <th>Contrat</th>
          <th>Clients</th>
          <th>Vehicules</th>
          <th>Date Début</th>
          <th>Date Fin</th>
          <th>Montant</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="contract in contracts" :key="contract.id">
          <td>{{ contract.contractNumber }}</td>
          <td>{{ getClientName(contract.customer_id) }}</td>
          <td>{{ getVehicleName(contract.vehicle_id) }}</td>
          <td>{{ formatDate(contract.startDate) }}</td>
          <td>{{ formatDate(contract.returnDate) }}</td>
          <td>{{ contract.totalAmount }} €</td>
          <td>{{ contract.status }}</td>
          <td>
            <button @click="viewContract(contract.id)" class="btn btn-sm btn-outline-primary me-2">
              <i class="fas fa-eye"></i>
            </button>
            <button @click="editContract(contract.id)" class="btn btn-sm btn-outline-secondary me-2">
              <i class="fas fa-edit"></i>
            </button>
            <button @click="confirmDelete(contract.id)" class="btn btn-sm btn-outline-danger me-2">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useContractStore } from '../../store/contratStore';
import { useCustomerStore } from '../../store/customerStore';
import { useVehicleStore } from '../../store/vehicleStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const contractStore = useContractStore();
const customerStore = useCustomerStore();
const vehicleStore = useVehicleStore();
const contracts = ref([]);
const customers = ref([]);
const vehicles = ref([]);

onMounted(async () => {
  try {
    await contractStore.fetchContracts();
    await customerStore.fetchCustomers();
    await vehicleStore.fetchVehicles();

    contracts.value = contractStore.contracts;
    customers.value = customerStore.customers;
    vehicles.value = vehicleStore.vehicles;
  } catch (error) {
    console.error("Erreur lors du chargement des données :", error);
  }
});

const addContract = () => {
  router.push({ name: 'AddContrat' });
};
const viewContract = (id) => {
  router.push({ name: 'DetailsContrat', params: { id } });
};

const editContract = (id) => {
  router.push({ name: 'EditContrat', params: { id } });
};

const confirmDelete = (id) => {
  if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contrat ?')) {
    deleteContract(id);
  }
};

const deleteContract = async (id) => {
  try {
    await contractStore.deleteContract(id);
    contracts.value = contractStore.contracts;
    console.log('Contrat supprimé avec succès!');
  } catch (error) {
    console.error('Erreur lors de la suppression du contrat:', error);
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR');
};

const getClientName = (customer_id) => {
  const client = customers.value.find(c => c.id === customer_id);
  return client ? client.fullName : 'Inconnu';
};

const getVehicleName = (vehicle_id) => {
  const vehicle = vehicles.value.find(v => v.id === vehicle_id);
  return vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Inconnu';
};
</script>

<style scoped>
.table th, .table td {
  text-align: center;
}

.btn i {
  font-size: 1rem;
}
.container {
  max-width: 1000px;
  margin-top: 5%;
}
</style>
