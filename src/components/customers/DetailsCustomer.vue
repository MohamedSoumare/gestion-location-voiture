<template>
  <div class="container mt-5 p-4">
    <h2 class="text-center text-primary mb-4">Détails du Client</h2>
    <div v-if="customer" class="card shadow p-4">
      <div class="card-body">
        <p class="card-text"><strong>Nom :</strong> {{ customer.fullName }}</p>
        <p class="card-text"><strong>Adresse :</strong> {{ customer.address }}</p>
        <p class="card-text"><strong>NNI :</strong> {{ customer.nni }}</p>
        <p class="card-text"><strong>Date de Naissance :</strong> {{ formatDate(customer.birthDate) }}</p>
        <p class="card-text"><strong>Permis de Conduire :</strong> {{ customer.drivingLicense }}</p>
        <p class="card-text"><strong>Téléphone :</strong> {{ customer.phoneNumber }}</p>
      </div>
      <div class="card-footer d-flex justify-content-end mt-4">
        <!-- <button @click="editCustomer" class="btn btn-primary">Modifier</button> -->
        <button @click="goBack" class="btn btn-secondary me-2">Retour</button>
      </div>
    </div>
    <div v-else class="text-center">
      <p>Chargement des détails du client...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCustomerStore } from '../../store/customerStore';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const customerStore = useCustomerStore();

const customer = ref(null);

onMounted(async () => {
  const customerId = route.params.id;
  if (customerId) {
    // Récupérer les détails du client par ID
    customer.value = await customerStore.getCustomerById(customerId);
  }
});

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};

const goBack = () => router.push({ name: 'CustomerList' });
// const editCustomer = () => router.push({ name: 'CustomerEdit', params: { id: route.params.id } });
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
}
.card {
  border: none;
  background-color: #f8f9fa;
}
.card-body p {
  font-size: 1.1rem;
  margin: 0.5rem 0;
}
.card-footer {
  background: transparent;
  border-top: none;
}
</style>
