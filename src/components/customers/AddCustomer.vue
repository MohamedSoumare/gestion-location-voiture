<template>
  <div class="container mt-5">
    <h2>Ajouter un Client</h2>
    <form @submit.prevent="saveCustomer" class="mt-5">
      <!-- Formulaire pour ajouter un client -->
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
      <button type="submit" class="btn btn-success">Confirmer</button>
      <button @click.prevent="goBack" class="btn btn-secondary ms-2">Annuler</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

import { useCustomerStore } from '../../store/customerStore';
import { useRouter } from 'vue-router';

const store = useCustomerStore();
const router = useRouter();

const customer = ref({
  fullName: '',
  address: '',
  nni: '',
  birthDate: '',
  drivingLicense: '',
  phoneNumber: '',
});

const saveCustomer = async () => {
  await store.addCustomer(customer.value);
  router.push({ name: 'CustomerList' });
};

const goBack = () => router.push({ name: 'CustomerList' });
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: auto;
}
</style>
