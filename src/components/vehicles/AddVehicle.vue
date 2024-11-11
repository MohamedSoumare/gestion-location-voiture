<template>
  <div class="container">
    <h2>Ajouter un véhicule</h2>
    <form @submit.prevent="submitForm" class="form-layout mt-3">
      <div>
        <label for="brand">Marque</label>
        <input v-model="vehicle.brand" type="text" id="brand" required />
      </div>
      
      <div>
        <label for="model">Modèle</label>
        <input v-model="vehicle.model" type="text" id="model" required />
      </div>

      <div>
        <label for="year">Année</label>
        <input v-model="vehicle.year" type="number" id="year" required />
      </div>

      <div>
        <label for="registrationPlate">Plaque d'immatriculation</label>
        <input v-model="vehicle.registrationPlate" type="text" id="registrationPlate" required />
      </div>

      <div>
        <label for="status">Statut</label>
        <select v-model="vehicle.status" id="status" required>
          <option value="Available">Disponible</option>
          <option value="Unavailable">Indisponible</option>
          <option value="Maintenance">En maintenance</option>
        </select>
      </div>

      <div>
        <label for="seatCount">Nombre de sièges</label>
        <input v-model="vehicle.seatCount" type="number" id="seatCount" required />
      </div>

      <div>
        <label for="doorCount">Nombre de portes</label>
        <input v-model="vehicle.doorCount" type="number" id="doorCount" required />
      </div>

      <div>
        <label for="color">Couleur</label>
        <input v-model="vehicle.color" type="text" id="color" required />
      </div>

      <div>
        <label for="fuelType">Type de carburant</label>
        <input v-model="vehicle.fuelType" type="text" id="fuelType" required />
      </div>

      <div>
        <label for="transmissionType">Type de transmission</label>
        <input v-model="vehicle.transmissionType" type="text" id="transmissionType" required />
      </div>

      <div>
        <label for="airConditioning">Climatisation</label>
        <select v-model="vehicle.airConditioning" id="airConditioning" required>
          <option :value="true">Oui</option>
          <option :value="false">Non</option>
        </select>
      </div>

      <div>
        <label for="dailyRate">Tarif journalier</label>
        <input v-model="vehicle.dailyRate" type="number" step="0.01" id="dailyRate" required />
      </div>

      <button type="submit" class="btn btn-success">Enregistrer</button>
      <button type="button" @click="goBack" class="btn btn-secondary">Retour</button>
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
  margin-top: 5%;

}

.form-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 20px;
  
}

.form-layout div {
  display: flex;
  flex-direction: column;
}

button {
  margin-top: 20px;
}
</style>
