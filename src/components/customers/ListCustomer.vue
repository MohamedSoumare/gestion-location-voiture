<template>
  <div class="container mt-5">
    
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="mb-4">Liste des clients</h2>
      <button class="btn btn-primary add-button" @click="goToAddCustomer">Ajouter un client</button>
    </div>

    <input type="text" class="form-control search-input" placeholder="Rechercher un client" v-model="searchQuery" @input="searchCustomers" />
    
    <div v-if="loading">Chargement...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    
    <table v-if="!loading && filteredCustomers.length" class="table table-striped table-hover table-bordered mt-3">
      <thead class="table-light">
        <tr>
          <th>Nom</th>
          <th>Adresse</th>
          <th>NNI</th>
          <th>Date de Naissance</th>
          <th>Permis de Conduire</th>
          <th>Téléphone</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="customer in filteredCustomers" :key="customer.id">
          <td>{{ customer.fullName }}</td>
          <td>{{ customer.address }}</td>
          <td>{{ customer.nni }}</td>
          <td>{{ formatDate(customer.birthDate) }}</td>
          <td>{{ customer.drivingLicense }}</td>
          <td>{{ customer.phoneNumber }}</td>
          <td>
            <button class="btn btn-outline-primary me-2" @click="viewCustomer(customer.id)"> <i class="fas fa-eye"></i></button>
            <button class="btn btn-outline-secondary me-2" @click="editCustomer(customer.id)"><i class="fas fa-edit"></i></button>
            <button class="btn btn-outline-danger me-2" @click="confirmDeleteCustomer(customer.id)"> <i class="fas fa-trash"></i></button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { useCustomerStore } from '../../store/customerStore';
import { useRouter } from 'vue-router';

const customerStore = useCustomerStore();
const router = useRouter();
const customers = ref([]);
const filteredCustomers = ref([]);
const searchQuery = ref('');
const loading = ref(false);
const error = ref(null);

const fetchCustomers = async () => {
  loading.value = true;
  try {
    await customerStore.fetchCustomers();
    customers.value = customerStore.customers;
    filteredCustomers.value = customers.value;
  } catch (err) {
    error.value = "Erreur lors de la récupération des clients.";
  } finally {
    loading.value = false;
  }
};
const searchCustomers = () => {
  filteredCustomers.value = customers.value.filter(customer =>
    customer.fullName.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
};

const viewCustomer = (id) => router.push({ name: 'CustomerDetails', params: { id } });
const editCustomer = (id) => router.push({ name: 'CustomerEdit', params: { id } });

const confirmDeleteCustomer = (id) => {
  Swal.fire({
    title: "Êtes-vous sûr ?",
    text: "Cette action est irréversible.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const result = await customerStore.deleteCustomer(id);
      if (result.success) {
        Swal.fire({
          title: 'Succès!',
          text: result.message,
          icon: 'success',
        });
        fetchCustomers();
      } else {
        Swal.fire({
          title: 'Erreur!',
          text: result.message,
          icon: 'error',
        });
      }
    }
  });
};
const formatDate = date => new Date(date).toLocaleDateString('fr-FR');

const goToAddCustomer = () => router.push({ name: 'CustomerAdd' });
onMounted(fetchCustomers);
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: auto;
}
table{
  width: 100%;
}

.search-input{
  max-width: 450px;
}
</style>
   