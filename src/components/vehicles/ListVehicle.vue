<template>
  <div class="container mt-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-5">Liste des véhicules</h2>
      <button @click="goToAdd" class="btn btn-primary">
        <i class="fas fa-plus"></i> Ajouter un véhicule
      </button>
    </div>
    
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
            <h5 class="card-title">{{ vehicle.brand }} {{ vehicle.model }}</h5>
            <h6 class="card-title"><strong>Année : </strong> {{ vehicle.year }}</h6>
            <h6 class="card-subtitle mb-2 text-muted">Immatriculation: {{ vehicle.registrationPlate }}</h6>
            <p class="card-text">
              <strong>Statut :</strong> {{ vehicle.status }}<br />
              <strong>Places :</strong> {{ vehicle.seatCount }}<br />
              <strong>Portes :</strong> {{ vehicle.doorCount }}<br />
              <strong>Couleur :</strong> {{ vehicle.color }}<br />
              <strong>Carburant :</strong> {{ vehicle.fuelType }}<br />
              <strong>Transmission :</strong> {{ vehicle.transmissionType }}<br />
              <strong>Climatisation :</strong> {{ vehicle.airConditioning ? 'Oui' : 'Non' }}<br />
              <strong>Tarif journalier :</strong> {{ vehicle.dailyRate }} MRU
            </p>
            <div class="d-flex justify-content-between">
              <button  @click="viewDetails(vehicle.id)" class="btn btn-outline-primary btn-sm">
                <i class="fas fa-eye"></i>
              </button>
              <button @click="editVehicle(vehicle.id)" class="btn btn-outline-secondary btn-sm">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="confirmDeleteVehicle(vehicle.id)"
              class="btn btn-outline-danger btn-sm" v-if="userRole === 'ADMIN'">
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
import { useAuthStore } from '../../store/authStore';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

export default {
  setup() {
    const vehicleStore = useVehicleStore();
    const authStore = useAuthStore();
    const router = useRouter();
    const searchTerm = ref('');

    const filteredVehicles = computed(() => {
      const term = searchTerm.value.toLowerCase();
      return vehicleStore.vehicles.filter(vehicle =>
        vehicle.brand.toLowerCase().includes(term) ||
        vehicle.model.toLowerCase().includes(term) ||
        vehicle.registrationPlate.toLowerCase().includes(term)
      );
    });

    const userRole = authStore.user?.role;

    onMounted(async () => {
      try {
        await vehicleStore.fetchVehicles();
      } catch (error) {
        Swal.fire('Erreur', "Impossible de charger les véhicules.", 'error');
      }
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
        text: 'Cette action supprimera définitivement ce véhicule.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
      });

      if (result.isConfirmed) {
        try {
          await vehicleStore.deleteVehicle(id);
          Swal.fire('Supprimé !', 'Le véhicule a été supprimé avec succès.', 'success');
        } catch (error) {
          if (error.response && error.response.status === 400) {
            Swal.fire('Erreur', error.response.data.error || "Action non autorisée.", 'error');
          } else if (error.response && error.response.status === 500) {
            Swal.fire('Erreur', "Erreur interne lors de la suppression du véhicule.", 'error');
          } else {
            Swal.fire('Erreur', "Une erreur inattendue s'est produite.", 'error');
          }
        }
      }
    }

    return {
      userRole,
      searchTerm,
      filteredVehicles,
      goToAdd,
      viewDetails,
      editVehicle,
      confirmDeleteVehicle,
    };
  }
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin-top: 5%;
}
.search-input{
  max-width: 500px;
}
.table {
  margin-top: 20px;
}
</style>
