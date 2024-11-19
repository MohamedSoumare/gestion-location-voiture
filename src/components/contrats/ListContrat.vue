<template>
  <div class="container my-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Liste des Contrats</h2>
      <button @click="addContract" class="btn btn-primary">
        <i class="fas fa-plus"></i> Ajouter un contrat
      </button>
    </div>

    <table class="table table-striped table-hover table-bordered mt-3">
      <thead>
        <tr>
          <th>Contrat</th>
          <th>Clients</th>
          <th>Véhicules</th>
          <th>Date Début</th>
          <th>Date Fin</th>
          <th>Montant</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="contract in paginatedContracts" :key="contract.id">
          <td>{{ contract.contractNumber }}</td>
          <td>{{ getClientName(contract.customer_id) }}</td>
          <td>{{ getVehicleName(contract.vehicle_id) }}</td>
          <td>{{ formatDate(contract.startDate) }}</td>
          <td>{{ formatDate(contract.returnDate) }}</td>
          <td>{{ contract.totalAmount }} MRU</td>
          <td>
            <select
              v-model="contract.status"
              :disabled="new Date(contract.returnDate) < new Date()"
              @change="updateContractStatus(contract.id, contract.status)"
              :style="{ color: { 'VALIDER': '#008000', 'ANNULER': '#ff0000' }[contract.status] || '' }"
              class="form-select bg-opacity-50"
            >
              <option value="VALIDER">Valider</option>
              <option value="EN_ATTENTE">En attente</option>
              <option value="ANNULER">Annulé</option>
            </select>
          </td>
          <td>
          
  <button @click="viewContract(contract.id)" class="btn btn-sm btn-outline-primary me-3" title="Voir les détails">
    <i class="fas fa-eye"></i>
  </button>
  <!-- Bouton Modifier, visible uniquement si le statut n'est pas "VALIDER" -->
  <button
   
    @click="editContract(contract.id)"
    class="btn btn-sm btn-outline-secondary me-3"
    title="Modifier le contrat"
  >
    <i class="fas fa-edit"></i>
  </button>
  <!-- Bouton Supprimer, visible uniquement si le statut n'est pas "VALIDER" -->
  <button
    v-if="contract.status !== 'VALIDER'"
    @click="confirmDelete(contract.id)"
    class="btn btn-sm btn-outline-danger me-3"
    title="Supprimer le contrat"
  >
    <i class="fas fa-trash"></i>
  </button>

          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="pagination mt-4">
      <button class="btn btn-light" :disabled="currentPage === 1" @click="currentPage = 1">Première</button>
      <button class="btn btn-light" :disabled="currentPage === 1" @click="previousPage">Précédent</button>
      <span>Page {{ currentPage }} sur {{ totalPages }}</span>
      <button class="btn btn-light" :disabled="currentPage === totalPages" @click="nextPage">Suivant</button>
      <button class="btn btn-light" :disabled="currentPage === totalPages" @click="currentPage = totalPages">Dernière</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useContractStore } from '../../store/contratStore';
import { useCustomerStore } from '../../store/customerStore';
import { useVehicleStore } from '../../store/vehicleStore';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const router = useRouter();
const contractStore = useContractStore();
const customerStore = useCustomerStore();
const vehicleStore = useVehicleStore();

const contracts = ref([]);
const customers = ref([]);
const vehicles = ref([]);
const currentPage = ref(1);
const itemsPerPage = 5;

onMounted(async () => {
  try {
    await contractStore.fetchContracts();
    await customerStore.fetchCustomers();
    await vehicleStore.fetchVehicles();

    contracts.value = contractStore.contracts;
    customers.value = customerStore.customers;
    vehicles.value = vehicleStore.vehicles;
  } catch (error) {
    console.error('Erreur lors du chargement des données :', error);
    Swal.fire('Erreur', 'Impossible de charger les données.', 'error');
  }
});

const addContract = () => router.push({ name: 'AddContrat' });
const viewContract = id => router.push({ name: 'DetailsContrat', params: { id } });
const editContract = id => router.push({ name: 'EditContrat', params: { id } });

const confirmDelete = async id => {
  const result = await Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: 'Vous ne pourrez pas revenir en arrière !',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, supprimer !',
    cancelButtonText: 'Annuler',
  });
  if (result.isConfirmed) {
    await deleteContract(id);
    Swal.fire('Supprimé !', 'Le contrat a été supprimé.', 'success');
  }
};

const deleteContract = async id => {
  try {
    await contractStore.deleteContract(id);
    contracts.value = contractStore.contracts;
  } catch (error) {
    console.error('Erreur lors de la suppression du contrat :', error);
    Swal.fire('Erreur', 'Impossible de supprimer le contrat.', 'error');
  }
};

const formatDate = date => new Date(date).toLocaleDateString('fr-FR');

const getClientName = customer_id => {
  const client = customers.value.find(c => c.id === customer_id);
  return client ? client.fullName : 'Inconnu';
};

const getVehicleName = vehicle_id => {
  const vehicle = vehicles.value.find(v => v.id === vehicle_id);
  return vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Inconnu';
};

const updateContractStatus = async (id, status) => {
  if (!id || !status) {
    console.error('ID ou statut invalide.');
    return;
  }
  try {
    await contractStore.updateContractStatus(id, status);
    Swal.fire('Succès', 'Le statut du contrat a été mis à jour.', 'success');
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut :', error.message);
    Swal.fire('Erreur', 'Impossible de mettre à jour le statut.', 'error');
  }
};

const paginatedContracts = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  return contracts.value.slice(startIndex, startIndex + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(contracts.value.length / itemsPerPage));

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
</script>

<style scoped>
.table th, .table td {
  text-align: center;
}
.container {
  max-width: 1000px;
  margin: 0 auto;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
select {
  -webkit-appearance: none; /* Masque la flèche sur les navigateurs WebKit */
  -moz-appearance: none; /* Masque la flèche sur Firefox */
  appearance: none; /* Masque la flèche sur les navigateurs modernes */
  background: none; /* Enlève l'arrière-plan */
}

</style>
