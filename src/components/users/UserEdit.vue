<template> 
  <div class="container mt-5">
    <h3 class="text-center">Modifier l'utilisateur</h3>

    <div v-if="errors.length" class="alert alert-danger">
      <ul>
        <li v-for="(error, index) in errors" :key="index">{{ error.message }}</li>
      </ul>
    </div>
        
  <form v-if="user" @submit.prevent="updateUser">
      <div class="mb-3">
        <label>Nom Complet:</label>
        <input v-model="form.fullName" required class="form-control" />
      </div>
      <div class="mb-3">  
        <label>Email:</label>
        <input v-model="form.email" required type="email" class="form-control" />
      </div>
      <div class="mb-3">
        <label>Téléphone:</label>
        <input v-model="form.phoneNumber" type="text" class="form-control" />
      </div>
      <div class="mb-3">
        <label>Rôle:</label>
        <select  v-model="form.role" required class="form-select" placeholder="Ex: Employé, admin">
          <option value="">Sélectionner le rôle</option>
          <option value="ADMIN">Admin</option>
          <option value="EMPLOYE">Employé</option>
        </select>
      </div>
      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" v-model="form.status" />
        <label class="form-check-label">Active</label>
      </div>

      <div class="d-flex justify-content-between mt-4">
        <button type="submit" class="btn btn-primary">Enregistrer</button>
        <button type="button" class="btn btn-secondary" @click="cancel">Annuler</button>
      </div>
    </form>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../../store/userStore';

const route = useRoute();
const router = useRouter();
const store = useUserStore();
const user = ref(null);
const errors = ref([]); // Stocke les messages d'erreur

const form = reactive({
  fullName: "",
  email: "",
  phoneNumber: "",
  role: "",
  status: true,
});

onMounted(async () => {
  try {
    const fetchedUser = await store.getByIdUser(route.params.id);
    if (fetchedUser) {
      user.value = fetchedUser;
      Object.assign(form, fetchedUser);
    } else {
      alert("Utilisateur non trouvé.");
      router.push({ name: 'UserList' });
    }
  } catch (error) {
    alert("Erreur lors de la récupération de l'utilisateur.");
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
  }
});

const updateUser = async () => {
  try {
    errors.value = []; // Réinitialise les erreurs
    const updatedData = {
      fullName: form.fullName,
      email: form.email,
      phoneNumber: form.phoneNumber,
      role: form.role,
      status: form.status === 'true' || form.status === true,
    };

    await store.updateUser(route.params.id, updatedData);
    await store.fetchUsers();
    router.push({ name: 'UserList' });
  }  catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors;
    } else {
      alert('Erreur lors de la mise à jour de l\'utilisateur.');
    }
  }
};

const cancel = () => router.push({ name: 'UserList' });
</script>


<style scoped>
.container {
  max-width: 500px;
  margin: auto;
}
</style>
