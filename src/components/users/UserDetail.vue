<template>
  <div class="container mt-5" v-if="user">
    <div class="card p-4 shadow-sm">
      <h3 class="card-title text-center mb-4">Détails de l'utilisateur</h3>
      <div class="card-body">
        <p><strong>Nom Complet:</strong>       {{ user.fullName }}</p>
        <p><strong>Email:</strong>       {{ user.email }}</p>
        <p><strong>Téléphone:</strong>       {{ user.phoneNumber }}</p>
        <p><strong>Rôle:</strong>       {{ user.role }}</p>
        <p>
          <strong>Statut:</strong>       <span :class="{'text-success': user.status, 'text-danger': !user.status}">
             {{ user.status ? 'Actif' : 'Inactif' }}
          </span>
        </p>
      </div>
      <div class="d-flex justify-content-center mt-4">
        <router-link :to="{ name: 'UserList' }" class="btn btn-primary btn-same-size">Retour</router-link>
      </div>
    </div>
  </div>
  <p v-else>Chargement des détails de l'utilisateur...</p>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '../../store/userStore';

const route = useRoute();
const store = useUserStore();
const user = ref(null);

onMounted(async () => {
  try {
    const fetchedUser = await store.getByIdUser(route.params.id);
    if (fetchedUser) {
      user.value = fetchedUser;
    } else {
      alert("Utilisateur non trouvé.");
    }
  } catch (error) {
    alert("Erreur lors de la récupération des détails de l'utilisateur.");
    console.error("Erreur lors de la récupération des détails de l'utilisateur:", error);
  }
});
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: auto;
}

.card {
  background-color: #ffffff;
  border-radius: 8px;
}

.card-title {
  color: #333;
}

.text-success {
  color: green;
}

.text-danger {
  color: red;
}

.btn-same-size {
  width: 100px;
}
</style>
