<template>
  <div class="container my-4">
    <h2 class="mb-5 text-center">Ajouter un nouveau contrat</h2>

    <!-- Affichage des erreurs de validation -->
    <div v-if="validationErrors.length" class="alert alert-danger" role="alert" aria-live="assertive">
      <ul>
        <li v-for="(error, index) in validationErrors" :key="index">{{ error.message }}</li>
      </ul>
    </div>
    
    <form @submit.prevent="submitContract">
      <div class="row g-4">
        <!-- Numéro de Contrat -->
        <div class="col-md-6">
          <label for="contractNumber" class="form-label">Numéro de Contrat</label>
          <input
            v-model="newContract.contractNumber"
            type="text"
            id="contractNumber"
            class="form-control"
            required
            aria-required="true"
          />
        </div>

        <!-- Client -->
        <div class="col-md-6">
          <label for="customer" class="form-label">Client</label>
          <select v-model="newContract.customer_id" class="form-select" required aria-required="true">
            <option disabled value="">Sélectionner un Client</option>
            <option
              v-for="customer in customers"
              :key="customer.id"
              :value="customer.id"
            >
              {{ customer.fullName }}
            </option>
          </select>
        </div>

        <!-- Véhicule -->
        <div class="col-md-6">
          <label for="vehicle" class="form-label">Véhicule</label>
          <select v-model="newContract.vehicle_id" class="form-select" required aria-required="true">
            <option disabled value="">Sélectionner un Véhicule</option>
            <option
              v-for="vehicle in vehicles"
              :key="vehicle.id"
              :value="vehicle.id"
            >
              {{ vehicle.brand }} {{ vehicle.model }}
            </option>
          </select>
        </div>

        <!-- Date de Début -->
        <div class="col-md-6">
          <label for="startDate" class="form-label">Date de Début</label>
          <input
            v-model="newContract.startDate"
            type="date"
            id="startDate"
            class="form-control"
            required
            aria-required="true"
          />
        </div>

        <!-- Date de Fin -->
        <div class="col-md-6">
          <label for="returnDate" class="form-label">Date de Fin</label>
          <input
            v-model="newContract.returnDate"
            type="date"
            id="returnDate"
            class="form-control"
            required
            aria-required="true"
          />
        </div>

        <!-- Montant -->
        <div class="col-md-6">
          <label for="totalAmount" class="form-label">Montant</label>
          <input
            v-model="newContract.totalAmount"
            type="number"
            id="totalAmount"
            step="0.01"
            min="0"
            max="9999999999.99"
            required
            class="form-control" 
            aria-required="true"
          />
        </div>

        <!-- Statut -->
        <div class="col-md-6">
          <label for="status" class="form-label">Statut</label>
          <select v-model="newContract.status" class="form-select" required>
            <option value="EN_ATTENTE">En attente</option>
            <option value="VALIDER">Validée</option>
          </select>
        </div>
      </div>

      <div class="d-flex justify-content-between mt-4">
        <button type="submit" class="btn btn-primary">Ajouter</button>
        <button @click.prevent="goBack" class="btn btn-secondary">Annuler</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useContractStore } from '../../store/contratStore';
import { useCustomerStore } from '../../store/customerStore';
import { useVehicleStore } from '../../store/vehicleStore';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const contractStore = useContractStore();
const customerStore = useCustomerStore();
const vehicleStore = useVehicleStore();
const router = useRouter();

const newContract = ref({
  contractNumber: '',
  customer_id: null,
  vehicle_id: null,
  startDate: '',
  returnDate: '',
  totalAmount: 0,
  status: 'EN_ATTENTE',
});

const customers = ref([]);
const vehicles = ref([]);
const validationErrors = ref([]);

onMounted(async () => {
  try {
    await customerStore.fetchCustomers();
    await vehicleStore.fetchVehicles();
    customers.value = customerStore.customers;
    vehicles.value = vehicleStore.vehicles;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur de chargement',
      text: 'Impossible de charger les clients ou les véhicules',
    });
  }
});

const validateForm = () => {
  const errors = [];
  const today = new Date().toISOString().split('T')[0];

  if (!newContract.value.contractNumber.trim()) {
    errors.push({ message: 'Le numéro de contrat est obligatoire.' });
  }
  if (!newContract.value.customer_id) {
    errors.push({ message: 'Le client est obligatoire.' });
  }
  if (!newContract.value.vehicle_id) {
    errors.push({ message: 'Le véhicule est obligatoire.' });
  }
  if (!newContract.value.startDate) {
    errors.push({ message: 'La date de début est obligatoire.' });
  } else if (newContract.value.startDate < today) {
    errors.push({ message: 'La date de début ne peut pas être dans le passé.' });
  }
  if (!newContract.value.returnDate) {
    errors.push({ message: 'La date de fin est obligatoire.' });
  } else if (new Date(newContract.value.returnDate) < new Date(newContract.value.startDate)) {
    errors.push({ message: 'La date de fin ne peut pas être antérieure à la date de début.' });
  }
  if (Number(newContract.value.totalAmount) <= 0) {
    errors.push({ message: 'Le montant doit être supérieur à zéro.' });
  }
  if (newContract.value.totalAmount.toString().length > 10) {
    errors.push({ message: 'Le montant total ne doit pas dépasser 10 chiffres.' });
  }

  return errors;
};

const submitContract = async () => {
  // Validation frontend
  validationErrors.value = validateForm();

  if (validationErrors.value.length > 0) {
    return;
  }

  try {
    await contractStore.addContract(newContract.value);
    Swal.fire({
      icon: 'success',
      title: 'Contrat ajouté',
      text: 'Le contrat a été ajouté avec succès',
    });
    router.push({ name: 'ListContrat' });
  } catch (error) {
    // Gestion des erreurs retournées par le backend
    if (error.response && error.response.data && error.response.data.errors) {
      // Vérifier si c'est un tableau de chaînes ou d'objets
      if (typeof error.response.data.errors[0] === 'string') {
        // Si c'est un tableau de chaînes
        validationErrors.value = error.response.data.errors.map((err) => ({
          message: err,
        }));
      } else {
        // Si c'est un tableau d'objets
        validationErrors.value = error.response.data.errors.map((err) => ({
          message: err.msg || err.message || 'Une erreur est survenue.',
        }));
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible d\'ajouter le contrat',
      });
    }
  }
};

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin-top: 5%;
}
button {
  margin: 5px;
}
</style>
