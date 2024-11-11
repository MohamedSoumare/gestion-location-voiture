<!-- src/components/customers/EditCustomer.vue -->
<template>
  <div class="container mt-5">
    <h2>Modifier un Client</h2>
    <form @submit.prevent="saveCustomer" class="mt-4">
      <div class="mb-3">
        <label class="form-label">Nom</label>
        <input v-model="customer.fullName" type="text" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Adresse</label>
        <input v-model="customer.address" type="text" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">NNI</label>
        <input v-model="customer.nni" type="text" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Date de Naissance</label>
        <input v-model="customer.birthDate" type="date" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Permis de Conduire</label>
        <input v-model="customer.drivingLicense" type="text" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Téléphone</label>
        <input v-model="customer.phoneNumber" type="text" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-success"> Enregistrer</button>
      <button @click.prevent="goBack" class="btn btn-secondary ms-2">Annuler</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCustomerStore } from '../../store/customerStore';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const customerStore = useCustomerStore();

const customer = ref({
  fullName: '',
  address: '',
  nni: '',
  birthDate: '',
  drivingLicense: '',
  phoneNumber: ''
});

onMounted(async () => {
  const customerId = route.params.id;
  if (customerId) {
    // Charger le client existant si on est en mode édition
    const existingCustomer = await customerStore.getCustomerById(customerId);
    if (existingCustomer) {
      customer.value = { ...existingCustomer };
    }
  }
});

const saveCustomer = async () => {
  try {
    const customerId = route.params.id;
    if (customerId) {
      // Si l'ID existe, mettre à jour le client
      await customerStore.updateCustomer(customerId, customer.value);
    } else {
      // Sinon, ajouter un nouveau client
      await customerStore.addCustomer(customer.value);
    }
    router.push({ name: 'CustomerList' });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du client', error);
  }
};

const goBack = () => router.push({ name: 'CustomerList' });
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: auto;
}
</style>
