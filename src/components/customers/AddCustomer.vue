<template>
  <div class="container mt-5 p-4 border rounded bg-light shadow">
    <h2 class="text-center text-primary mb-4">Ajouter un Client</h2>

    <div v-if="storeError && storeError.length" class="alert alert-danger">
  <ul>
    <li v-for="(error, index) in storeError" :key="index" v-text="error"></li>
  </ul>
</div>

    <form @submit.prevent="saveCustomer" class="mt-4">
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
      <div class="d-flex justify-content-between mt-4">
        <button type="submit" class="btn btn-success me-2">Enregistrer</button>
        <button @click.prevent="goBack" class="btn btn-secondary">Annuler</button>
      </div>
    </form>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue';
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

// Récupérer les erreurs du store
const storeError = computed(() => store.error);


const saveCustomer = async () => {
  try {
    await store.addCustomer(customer.value);

    // Redirige si aucune erreur
    if (!store.error || store.error.length === 0) {
      router.push({ name: 'CustomerList' });
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout du client :', error);
  }
};
const goBack = () => router.push({ name: 'CustomerList' });

</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  background-color: #f8f9fa;
}
.form-label {
  font-weight: bold;
}
button {
  width: 120px;
}
</style>
