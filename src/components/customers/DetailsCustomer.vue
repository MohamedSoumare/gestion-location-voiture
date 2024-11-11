<!-- src/components/customers/DetailCustomer.vue -->
<template>
  <div class="container mt-5">
    <h2>Détails du Client</h2>
    <div v-if="customer" class="mt-4">
      <p><strong>Nom :</strong> {{ customer.fullName }}</p>
      <p><strong>Adresse :</strong> {{ customer.address }}</p>
      <p><strong>NNI :</strong> {{ customer.nni }}</p>
      <p><strong>Date de Naissance :</strong> {{ formatDate(customer.birthDate) }}</p>
      <p><strong>Permis de Conduire :</strong> {{ customer.drivingLicense }}</p>
      <p><strong>Téléphone :</strong> {{ customer.phoneNumber }}</p>
      <button @click="goBack" class="btn btn-secondary mt-3">Retour</button>
      <button @click="editCustomer" class="btn btn-primary mt-3 ms-2">Modifier</button>
    </div>
    <div v-else>
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
const editCustomer = () => router.push({ name: 'EditCustomer', params: { id: route.params.id } });
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
}
</style>
