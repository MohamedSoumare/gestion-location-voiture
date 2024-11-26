<template>
  <div class="container">
    <h2>Modifier le véhicule</h2>
  <div v-if="storeError && storeError.length" class="alert alert-danger">
  <ul>
    <li v-for="(error, index) in storeError" :key="index">
      {{ error.message || error }}
    </li>
  </ul>
</div>
<div v-if="!storeError && successMessage" class="alert alert-success">
  {{ successMessage }}
</div>

    <form @submit.prevent="submitForm" class="form-layout">
      <div class="form-group">
        <label for="brand">Marque</label>
        <input v-model="vehicle.brand" type="text" id="brand" required />
      </div>

      <div class="form-group">
        <label for="model">Modèle</label>
        <input v-model="vehicle.model" type="text" id="model" required />
      </div>

      <div class="form-group">
        <label for="year">Année</label>
        <input v-model="vehicle.year" type="number" id="year" required />
      </div>

      <div class="form-group">
        <label for="registrationPlate">Plaque d'immatriculation</label>
        <input v-model="vehicle.registrationPlate" type="text" id="registrationPlate" required />
      </div>

      <div class="form-group">
        <label for="status">Statut</label>
        <select v-model="vehicle.status" id="status" required>
          <option value="Disponible">Disponible</option>
          <option value="Indisponible">Indisponible</option>
          <option value="Maintenance">En maintenance</option>
        </select>
      </div>

      <div class="form-group">
        <label for="seatCount">Nombre de sièges</label>
        <input v-model="vehicle.seatCount" type="number" id="seatCount" required />
      </div>

      <div class="form-group">
        <label for="doorCount">Nombre de portes</label>
        <input v-model="vehicle.doorCount" type="number" id="doorCount" required />
      </div>

      <div class="form-group">
        <label for="color">Couleur</label>
        <input v-model="vehicle.color" type="text" id="color" required />
      </div>

      <div class="form-group">
        <label for="fuelType">Type de carburant</label>
        <input v-model="vehicle.fuelType" type="text" id="fuelType" required />
      </div>

      <div class="form-group">
        <label for="transmissionType">Type de transmission</label>
        <input v-model="vehicle.transmissionType" type="text" id="transmissionType" required />
      </div>

      <div class="form-group">
        <label for="airConditioning">Climatisation</label>
        <select v-model="vehicle.airConditioning" id="airConditioning" required>
          <option :value="true">Oui</option>
          <option :value="false">Non</option>
        </select>
      </div>

      <div class="form-group">
        <label for="dailyRate">Tarif journalier</label>
        <input v-model="vehicle.dailyRate" type="number" step="0.01" id="dailyRate" required />
      </div>

      <div class="button-group">
        <button type="submit" class="btn btn-success">Enregistrer</button>
        <button type="button" @click="goBack" class="btn btn-secondary flex-end">Retour</button>
      </div>
    </form>
      
      </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

import { useVehicleStore } from '../../store/vehicleStore';
import { useRouter, useRoute } from 'vue-router';

const vehicleStore = useVehicleStore();
const router = useRouter();
const route = useRoute();
const vehicle = ref({
  brand: '',
  model: '',
  year: '',
  registrationPlate: '',
  status: '',
  seatCount: 0,
  doorCount: 0,
  color: '',
  fuelType: '',
  transmissionType: '',
  airConditioning: false,
  dailyRate: 0.0
});

const storeError = computed(() => vehicleStore.error);

onMounted(async () => {
  try {
    const vehicleId = route.params.id;
    const vehicleData = await vehicleStore.getVehicleById(vehicleId);
console.log('Données récupérées du véhicule:', vehicleData);
Object.assign(vehicle.value, vehicleData);

  } catch (error) {
    console.error("Erreur lors de la récupération des données du véhicule :", error);
  }
});

const successMessage = ref('');

const submitForm = async () => {
  // if (!isValidVehicle(vehicle.value)) {
  //   console.error("Le formulaire contient des champs invalides.");
  //   return;
  // }
  try {
    await vehicleStore.updateVehicle(route.params.id, vehicle.value);
    successMessage.value = 'Véhicule mis à jour avec succès.';
    router.push({ name: 'ListVehicle' });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du véhicule :", error);
  }
};

function goBack() {
  router.push({ name: 'ListVehicle' });
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 5% auto;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.form-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #555;
}

.form-group input,
.form-group select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #007bff;
}

.button-group {
  grid-column: span 2;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.btn-success {
  background-color: #28a745;
  color: #fff;
  border: none;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-secondary {
  background-color: #6c757d;
  color: #fff;
  border: none;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.btn:focus {
  outline: 2px solid #0056b3;
  outline-offset: 2px;
}
.alert {
  padding: 15px;
  margin-top: 20px;
  border-radius: 5px;
  font-weight: bold;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

</style>
