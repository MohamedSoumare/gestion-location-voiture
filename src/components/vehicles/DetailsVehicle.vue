<template>
  <div class="container mt-5">
    <h2>Détails du véhicule</h2>
    <div v-if="vehicle">
      <p><strong>Marque :</strong> {{ vehicle.brand }}</p>
      <p><strong>Modèle :</strong> {{ vehicle.model }}</p>
      <p><strong>Année :</strong> {{ vehicle.year }}</p>
      <p><strong>Plaque d'immatriculation :</strong> {{ vehicle.registrationPlate }}</p>
      <p><strong>Statut :</strong> {{ vehicle.status }}</p>
      <p><strong>Nombre de sièges :</strong> {{ vehicle.seatCount }}</p>
      <p><strong>Nombre de portes :</strong> {{ vehicle.doorCount }}</p>
      <p><strong>Couleur :</strong> {{ vehicle.color }}</p>
      <p><strong>Type de carburant :</strong> {{ vehicle.fuelType }}</p>
      <p><strong>Type de transmission :</strong> {{ vehicle.transmissionType }}</p>
      <p><strong>Climatisation :</strong> {{ vehicle.airConditioning ? 'Oui' : 'Non' }}</p>
      <p><strong>Tarif journalier :</strong> {{ vehicle.dailyRate }} €</p>
      <button @click="goBack" class="btn btn-secondary mt-3">Retour</button>
    </div>
    <div v-else>
      <p>Chargement des détails du véhicule...</p>
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
    vehicle.value = data; // Utilisez la donnée récupérée
  } catch (error) {
    console.error("Erreur lors de la récupération des données du véhicule :", error);
  }
});

function goBack() {
  router.push({ name: 'ListVehicle' });
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin-top: 5%;
}
</style>
