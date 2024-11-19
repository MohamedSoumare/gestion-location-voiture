<template>
  <div class="container mt-5">
    <h3 class="text-center mb-5">Ajouter un nouvel utilisateur</h3>
    
    <div v-if="errors.length" class="alert alert-danger">
      <ul>
        <li v-for="(error, index) in errors" :key="index">{{ error.message }}</li>
      </ul>
    </div>
    <form @submit.prevent="onSubmit" class="form-card">
      <div class="mb-3">
        <label>Nom Complet:</label>
        <input v-model="user.fullName" required class="form-control" />
      </div>
      <div class="mb-3">
        <label>Email:</label>
        <input v-model="user.email" required type="email" class="form-control" />
      </div>
      <div class="mb-3">
        <label>Téléphone:</label>
        <input v-model="user.phoneNumber" required type="text" class="form-control" />
      </div>
      <div class="mb-3">
        <label>Mot de Passe:</label>
        <input v-model="user.password" required type="password" class="form-control" />
      </div>
      <div class="mb-3">
        <label>Rôle:</label>
        <select v-model="user.role" required class="form-select">
          <option value="">Sélectionner le rôle</option>
          <option value="ADMIN">Admin</option>
          <option value="EMPLOYE">Employé</option>
        </select>
      </div>
      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" v-model="user.status" />
        <label class="form-check-label">Active</label>
      </div>
      <div class="d-flex justify-content-between">
        <button type="submit" class="btn btn-success">Ajouter</button>
        <router-link :to="{ name: 'UserList' }" class="btn btn-secondary">Annuler</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../store/userStore';

const user = ref({
  fullName: '',
  email: '',
  phoneNumber: '',
  password: '',
  role: '',
  status: true
});

const router = useRouter();
const store = useUserStore();
const errors = ref([]); 
const onSubmit = async () => {
  try {
    errors.value = []; 
    await store.addUser(user.value);
    router.push({ name: 'UserList' });
  }  catch (error) {
    // Ajouter les erreurs de validation
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors;
    } else {
      errors.value = [{ message: 'Erreur inconnue, veuillez réessayer.' }];
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: auto;
}
</style>

