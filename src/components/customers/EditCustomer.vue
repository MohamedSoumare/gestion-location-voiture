<template>
  <div class="container mt-5 p-4 border rounded bg-light shadow">
   <h2 class="text-center text-primary mb-4">Modifier un Client</h2>
   
   <!-- Affichage des erreurs -->
    <div v-if="errors.length > 0" class="alert alert-danger">
      <ul>
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
    </div>
   
   <form @submit.prevent="saveCustomer" class="mt-4">
     <!-- Formulaire pour les données du client -->
     <div class="mb-3">
       <label class="form-label">Nom</label>
       <input v-model="customer.fullName" type="text" class="form-control" />
     </div>
     
     <div class="mb-3">
       <label class="form-label">Adresse</label>
       <input v-model="customer.address" type="text" class="form-control" />
     </div>
     
     <div class="mb-3">
       <label class="form-label">NNI</label>
       <input v-model="customer.nni" type="text" class="form-control" />
     </div>
     
     <div class="mb-3">
       <label class="form-label">Permis de Conduire</label>
       <input v-model="customer.drivingLicense" type="text" class="form-control" />
     </div>
     
     <div class="mb-3">
       <label class="form-label">Téléphone</label>
       <input v-model="customer.phoneNumber" type="text" class="form-control" />
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

// Déclarations des hooks et des variables
const router = useRouter();
const route = useRoute();
const customerStore = useCustomerStore();
const errors = ref([]); 

// Structure des données du client
const customer = ref({
  fullName: '',
  address: '',
  nni: '',
  drivingLicense: '',
  phoneNumber: ''
});

// Fonction de validation du NNI
const validateNNI = (nni) => /^\d{10}$/.test(nni);

const validateFullName = (fullName) => {
  const nameRegex = /^[A-Za-z]+( [A-Za-z]+)*$/;
  return nameRegex.test(fullName) && fullName.length >= 3 && fullName.length <= 60;
};

const validatePhoneNumber = (phoneNumber) => /^\d{8}$/.test(phoneNumber);

const validateDrivingLicense = (drivingLicense) => {
  const licenseRegex = /^(MR-\d{7}|\d{8,10})$/;
  return licenseRegex.test(drivingLicense);
};

// Chargement des données du client si un ID est passé dans l'URL
onMounted(async () => {
  const customerId = route.params.id;
  if (customerId) {
    try {
      const existingCustomer = await customerStore.getCustomerById(customerId);
      if (existingCustomer) {
        customer.value = { ...existingCustomer };
      }
    } catch (error) {
      errors.value = ['Erreur lors du chargement des données du client.'];
      console.error('Erreur onMounted:', error);
    }
  }
});

// Sauvegarde ou mise à jour des données du client
const saveCustomer = async () => {
  errors.value = []; // Réinitialiser les erreurs

  // Valider chaque champ individuellement
  if (!customer.value.fullName || !validateFullName(customer.value.fullName)) {
    errors.value.push('Le nom complet doit contenir uniquement des lettres, des espaces, et avoir entre 3 et 60 caractères.');
  }

  if (!customer.value.phoneNumber || !validatePhoneNumber(customer.value.phoneNumber)) {
    errors.value.push('Le numéro de téléphone doit comporter exactement 8 chiffres.');
  }

  if (!customer.value.nni || !validateNNI(customer.value.nni)) {
    errors.value.push('Le NNI doit comporter exactement 10 chiffres.');
  }

  if (customer.value.drivingLicense && !validateDrivingLicense(customer.value.drivingLicense)) {
    errors.value.push('Le permis doit commencer par "MR-" suivi de 7 chiffres, ou être un numéro entre 8 et 10 chiffres.');
  }

  // Si des erreurs sont détectées, ne pas continuer
  if (errors.value.length > 0) return;

  try {
    const customerId = route.params.id;

    if (customerId) {
      // Mise à jour du client existant
      await customerStore.updateCustomer(customerId, customer.value);
      Swal.fire('Succès', 'Client mis à jour avec succès!', 'success').then(() => {
        router.push({ name: 'CustomerList' });
      });
    } else {
      // Ajouter un nouveau client
      await customerStore.addCustomer(customer.value);
      Swal.fire('Succès', 'Client ajouté avec succès!', 'success').then(() => {
        router.push({ name: 'CustomerList' });
      });
    }
  } catch (error) {
    // Gestion des erreurs API
    if (error.response && error.response.data.errors) {
      errors.value = error.response.data.errors;
    } else {
      errors.value = ['Une erreur est survenue. Veuillez réessayer.'];
      console.error('Erreur saveCustomer:', error);
    }
  }
};

// Retour à la liste des clients
const goBack = () => {
  router.push({ name: 'CustomerList' });
};
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
