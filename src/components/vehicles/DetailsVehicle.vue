<template>
  <div class="details-container mt-5">
    <h2 >Détails du véhicule</h2>
    <div v-if="vehicle" class="vehicle-details mt-5">
      <p><strong>Marque :</strong> {{ vehicle.brand }}</p>
      <p><strong>Modèle :</strong> {{ vehicle.model }}</p>
      <p><strong>Année :</strong> {{ vehicle.year }}</p>
      <p><strong>Plaque d'immatriculation :</strong> {{ vehicle.registrationPlate }}</p>
      <p><strong>Statut :</strong> <span :class="statusClass(vehicle.status)">{{ vehicle.status }}</span></p>
      <p><strong>Nombre de sièges :</strong> {{ vehicle.seatCount }}</p>
      <p><strong>Nombre de portes :</strong> {{ vehicle.doorCount }}</p>
      <p><strong>Couleur :</strong> {{ vehicle.color }}</p>
      <p><strong>Type de carburant :</strong> {{ vehicle.fuelType }}</p>
      <p><strong>Type de transmission :</strong> {{ vehicle.transmissionType }}</p>
      <p><strong>Climatisation :</strong> {{ vehicle.airConditioning ? 'Oui' : 'Non' }}</p>
      <p><strong>Tarif journalier :</strong> {{ vehicle.dailyRate }} MRU</p>
    </div>
    <div v-else class="loading">
      <p>Chargement des détails du véhicule...</p>
    </div>
    <div class="button-container">
      <button @click="goBack" class="btn btn-secondary">Retour</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useVehicleStore } from '../../store/vehicleStore';
import { useRouter, useRoute } from 'vue-router';

const vehicleStore = useVehicleStore();
const router = useRouter();
const route = useRoute();
const vehicle = ref(null);

onMounted(async () => {
  try {
    const vehicleId = route.params.id;
    const data = await vehicleStore.getVehicleById(vehicleId);
    vehicle.value = data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données du véhicule :", error);
  }
});

function goBack() {
  router.push({ name: 'ListVehicle' });
}

function statusClass(status) {
  return {
    Available: 'text-success',
    Unavailable: 'text-danger',
    Maintenance: 'text-warning'
  }[status];
}
</script>

<style scoped>
.details-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f7f7f7;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.vehicle-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  color: #444;
}

.vehicle-details p {
  font-size: 16px;
  line-height: 1.6;
}

.vehicle-details strong {
  color: #555;
}

.loading p {
  text-align: center;
  color: #888;
  font-size: 18px;
}

.button-container {
  text-align: right;
  margin-top: 20px;
}

.text-success {
  color: #28a745;
  font-weight: bold;
}

.text-danger {
  color: #dc3545;
  font-weight: bold;
}

.text-warning {
  color: #ffc107;
  font-weight: bold;
}
</style>
