<template>
  <div class="container">
    <h2>Ajouter un véhicule</h2>
    <form @submit.prevent="submitForm" class="form-layout mt-3">
      <div class="form-group">
        <label for="brand">Marque</label>
        <input v-model="vehicle.brand" type="text" id="brand" required class="form-control" />
      </div>
      
      <div class="form-group">
        <label for="model">Modèle</label>
        <input v-model="vehicle.model" type="text" id="model" required class="form-control" />
      </div>

      <div class="form-group">
        <label for="year">Année</label>
        <input v-model="vehicle.year" type="number" id="year" required class="form-control" />
      </div>

      <div class="form-group">
        <label for="registrationPlate">Plaque d'immatriculation</label>
        <input v-model="vehicle.registrationPlate" type="text" id="registrationPlate" required class="form-control" />
      </div>

      <div class="form-group">
        <label for="status">Statut</label>
        <select v-model="vehicle.status" id="status" required class="form-control">
          <option value="Available">Disponible</option>
          <option value="Unavailable">Indisponible</option>
          <option value="Maintenance">En maintenance</option>
        </select>
      </div>

      <div class="form-group">
        <label for="seatCount">Nombre de sièges</label>
        <input v-model="vehicle.seatCount" type="number" id="seatCount" required class="form-control" />
      </div>

      <div class="form-group">
        <label for="doorCount">Nombre de portes</label>
        <input v-model="vehicle.doorCount" type="number" id="doorCount" required class="form-control" />
      </div>

      <div class="form-group">
        <label for="color">Couleur</label>
        <input v-model="vehicle.color" type="text" id="color" required class="form-control" />
      </div>

      <div class="form-group">
        <label for="fuelType">Type de carburant</label>
        <input v-model="vehicle.fuelType" type="text" id="fuelType" required class="form-control" />
      </div>

      <div class="form-group">
        <label for="transmissionType">Type de transmission</label>
        <input v-model="vehicle.transmissionType" type="text" id="transmissionType" required class="form-control" />
      </div>

      <div class="form-group">
        <label for="airConditioning">Climatisation</label>
        <select v-model="vehicle.airConditioning" id="airConditioning" required class="form-control">
          <option :value="true">Oui</option>
          <option :value="false">Non</option>
        </select>
      </div>

      <div class="form-group">
        <label for="dailyRate">Tarif journalier</label>
        <input v-model="vehicle.dailyRate" type="number" step="0.01" id="dailyRate" required class="form-control" />
      </div>

      <div class="button-group">
        <button type="submit" class="btn btn-success">Enregistrer</button>
        <button type="button" @click="goBack" class="btn btn-secondary">Retour</button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useVehicleStore } from '../../store/vehicleStore';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const vehicleStore = useVehicleStore();
    const router = useRouter();
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

    async function submitForm() {
      await vehicleStore.addVehicle(vehicle.value);
      router.push({ name: 'ListVehicle' });
    }

    function goBack() {
      router.push({ name: 'ListVehicle' });
    }

    return { vehicle, submitForm, goBack };
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 5% auto;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
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

label {
  margin-bottom: 5px;
  color: #555;
}

.form-control {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.25);
}

.button-group {
  grid-column: span 2;
  display: flex;
  justify-content: space-between;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

button.btn-success {
  background-color: #28a745;
  color: white;
}

button.btn-success:hover {
  background-color: #218838;
}

button.btn-secondary {
  background-color: #6c757d;
  color: white;
}

button.btn-secondary:hover {
  background-color: #5a6268;
}
</style>
