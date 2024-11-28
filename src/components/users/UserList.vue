<template>
  <div class="container mt-5">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="mb-4">Liste des Utilisateurs</h2>
      <router-link :to="{ name: 'AddUser' }" class="btn btn-primary mt-5">
        <i class="fa-solid fa-plus"></i> Ajout utilisateur
      </router-link>
    </div>

    <div v-if="loading" class="alert alert-info">Chargement...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <table v-if="!loading && users.length" class="table table-striped table-hover table-bordered mt-3">
      <thead>
        <tr>
          <th>Nom Complet</th>
          <th>Email</th>
          <th>Téléphone</th>
          <th>Rôle</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.fullName }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phoneNumber }}</td>
          <td>{{ user.role }}</td>
          <td :class="{ 'text-success': user.status, 'text-danger': !user.status }">
            {{ user.status ? 'Actif' : 'Inactif' }}
          </td>
          <td>
            <button class="btn btn-outline-primary me-2" @click="viewDetails(user)">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn-outline-secondary me-2" @click="editUser(user.id)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-outline-danger" @click="remove(user.id)">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '../../store/userStore';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const router = useRouter();
const store = useUserStore();

const loading = ref(false);
const error = ref(null);

// Accéder à la liste des utilisateurs depuis le store
const users = computed(() => store.users);

onMounted(async () => {
  loading.value = true;
  try {
    await store.fetchUsers();
  } catch (err) {
    error.value = "Erreur lors du chargement des utilisateurs.";
  } finally {
    loading.value = false;
  }
});

const viewDetails = (user) => {
  router.push({ name: 'UserDetail', params: { id: user.id } });
};

const editUser = (id) => {
  router.push({ name: 'EditUser', params: { id } });
};

const remove = async (id) => {
  const { isConfirmed } = await Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: "Cette action est irréversible !",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  });

  if (isConfirmed) {
    try {
      await store.deleteUser(id);
      Swal.fire('Supprimé !', 'L\'utilisateur a été supprimé avec succès.', 'success');
    } catch (error) {
      Swal.fire('Erreur !', 'Une erreur s\'est produite lors de la suppression.', 'error');
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: auto;
}
</style>
