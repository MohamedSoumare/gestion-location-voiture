<template>
  <div class="container mt-5 p-4 border rounded bg-light shadow">
    <h2 class="text-center text-primary mb-4">Modifier un Client</h2>
  
  <div v-if="errors.length" class="alert alert-danger">
  <ul>
    <li v-for="(error, index) in errors" :key="index">
      {{ error }}
    </li>
  </ul>
</div>

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
      <!-- <div class="mb-3">
        <label class="form-label">Date de Naissance</label>
        <input v-model="customer.birthDate" type="date" class="form-control" />
      </div> -->
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
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { useCustomerStore } from '../../store/customerStore';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const customerStore = useCustomerStore();
const errors = ref([]); 

const customer = ref({
  fullName: '',
  address: '',
  nni: '',
  // birthDate: '',
  drivingLicense: '',
  phoneNumber: ''
});

onMounted(async () => {
  const customerId = route.params.id;
  if (customerId) {
    const existingCustomer = await customerStore.getCustomerById(customerId);
    if (existingCustomer) {
      customer.value = { ...existingCustomer };
    }
  }
});
// const validateCustomer = () => {
//   errors.value = [];
//   if (!customer.value.fullName) errors.value.push("Le nom est obligatoire.");
//   if (!customer.value.address) errors.value.push("L'adresse est obligatoire")
//   if (!customer.value.nni) errors.value.push("Le NNI est obligatoire.");
//   if (!customer.value.drivingLicense) errors.value.push("Le permis de conduire est obligatoire")
//   if (!customer.value.phoneNumber) errors.value.push("Le numéro de téléphone est obligatoire.");

// };

const saveCustomer = async () => {
  try {
    errors.value = [];
    const customerId = route.params.id;
    if (customerId) {
      await customerStore.updateCustomer(customerId, customer.value);
      Swal.fire('Succès', 'Client mis à jour avec succès!', 'success');
    }
    router.push({ name: 'CustomerList' });
  } catch (error) {
    if (error.response?.data?.errors) {
      // Extraire uniquement les messages des erreurs et suggestions
      errors.value = error.response.data.errors.map(
        (err) => `${err.message} ${err.suggestion}`
      );

    } else {
      errors.value = ['Erreur lors de la mise à jour du client.'];
    }
  }
};

const goBack = () => router.push({ name: 'CustomerList' });
</script  >

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
