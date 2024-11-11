<template>
  <div class="container mt-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-5">Liste des véhicules</h2>
      <button @click="goToAdd" class="btn btn-primary mt-5">
        <i class="fas fa-plus"></i> Ajouter un véhicule
      </button>
    </div>
    <!-- Champ de recherche -->
    <input 
      v-model="searchTerm" 
      class="form-control search-input mb-3"
      type="text" 
      placeholder="Rechercher un véhicule par marque, modèle, ou immatriculation"
    />
    <div class="row ml-md-3">
      <div class="col-md-4 mb-4" v-for="vehicle in filteredVehicles" :key="vehicle.id">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">{{ vehicle.brand }} {{ vehicle.model }} ({{ vehicle.year }})</h5>
            <h6 class="card-subtitle mb-2 text-muted">Immatriculation: {{ vehicle.registrationPlate }}</h6>
            <p class="card-text">
              <strong>Statut :</strong> {{ vehicle.status }}<br />
              <strong>Places :</strong> {{ vehicle.seatCount }}<br />
              <strong>Portes :</strong> {{ vehicle.doorCount }}<br />
              <strong>Couleur :</strong> {{ vehicle.color }}<br />
              <strong>Carburant :</strong> {{ vehicle.fuelType }}<br />
              <strong>Transmission :</strong> {{ vehicle.transmissionType }}<br />
              <strong>Climatisation :</strong> {{ vehicle.airConditioning ? 'Oui' : 'Non' }}<br />
              <strong>Tarif journalier :</strong> {{ vehicle.dailyRate }} €
            </p>
            <div class="d-flex justify-content-between">
              <button  @click="viewDetails(vehicle.id)" class="btn btn-outline-primary btn-sm">
                <i class="fas fa-eye"></i>
              </button>
              <button @click="editVehicle(vehicle.id)" class="btn btn-outline-secondary btn-sm">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="confirmDeleteVehicle(vehicle.id)" class="btn btn-outline-danger btn-sm">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { useVehicleStore } from '../../store/vehicleStore';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

export default {
  setup() {
    const vehicleStore = useVehicleStore();
    const router = useRouter();
    const searchTerm = ref('');

    const filteredVehicles = computed(() => {
      return vehicleStore.vehicles.filter(vehicle =>
        vehicle.brand.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        vehicle.registrationPlate.toLowerCase().includes(searchTerm.value.toLowerCase())
      );
    });

    onMounted(async () => {
      await vehicleStore.fetchVehicles();
    });

    function goToAdd() {
      router.push({ name: 'AddVehicle' });
    }

    function viewDetails(id) {
      router.push({ name: 'DetailsVehicle', params: { id } });
    }

    function editVehicle(id) {
      router.push({ name: 'EditVehicle', params: { id } });
    }

    async function confirmDeleteVehicle(id) {
      const result = await Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: "Cette action est irréversible !",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler'
      });

      if (result.isConfirmed) {
        try {
          await vehicleStore.deleteVehicle(id);
          Swal.fire('Supprimé!', 'Le véhicule a été supprimé.', 'success');
        } catch (err) {
          Swal.fire('Erreur', 'Erreur lors de la suppression.', 'error');
        }
      }
    }

    return {
      searchTerm,
      filteredVehicles,
      goToAdd,
      viewDetails,
      editVehicle,
      confirmDeleteVehicle
    };
  }
};
</script>

<style scoped>
.container {
  max-width: 900px;
  margin-top: 5%;
}

.table {
  margin-top: 20px;
}
</style>
