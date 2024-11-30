<template>
  <div class="container mt-5">
    <h3 class="text-center">Modifier l'utilisateur</h3>

    <div v-if="errors.length" class="alert alert-danger">
      <ul>
        <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
      </ul>
    </div>
        
    <form v-if="user" @submit.prevent="updateUser">
      <div class="mb-3">
        <label>Nom Complet:</label>
        <input v-model="form.fullName" class="form-control" />
      </div>
      <div class="mb-3">
        <label>Email:</label>
        <input v-model="form.email" type="email" class="form-control" />
      </div>
      <div class="mb-3">
        <label>Téléphone:</label>
        <input v-model="form.phoneNumber" type="text" class="form-control" />
      </div>
      <div class="mb-3 position-relative">
        <label>Mot de Passe:</label>
        <input
          :type="isPasswordVisible ? 'text' : 'password'"
          v-model="form.password"
          required
          class="form-control"
        />
        <span class="toggle-password" @click="togglePasswordVisibility">
          <i
            :class="isPasswordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"
          ></i>
        </span>
      </div>

      <div class="mb-3">
        <label>Rôle:</label>
        <select v-model="form.role" class="form-select">
          <option value="">Sélectionner le rôle</option>
          <option value="ADMIN">Admin</option>
          <option value="EMPLOYE">Employé</option>
        </select>
      </div>
      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" v-model="form.status" />
        <label class="form-check-label">Actif</label>
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
const errors = ref([]);

const form = reactive({
  fullName: '',
  email: '',
  phoneNumber: '',
  password: '', // Mot de passe initialisé vide
  role: '',
  status: true,
});
const isPasswordVisible = ref(false);

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

onMounted(async () => {
  try {
    const fetchedUser = await store.getByIdUser(route.params.id);
    if (fetchedUser) {
      user.value = fetchedUser;
      Object.assign(form, fetchedUser);
      form.password = ''; // Ne pas afficher le mot de passe existant
    } else {
      alert('Utilisateur non trouvé.');
      router.push({ name: 'UserList' });
    }
  } catch (error) {
    alert('Erreur lors de la récupération de l\'utilisateur.');
    console.error('Erreur:', error);
  }
});

const updateUser = async () => {
  try {
    errors.value = [];
    const updatedData = {
      fullName: form.fullName || user.value.fullName,
      email: form.email || user.value.email,
      phoneNumber: form.phoneNumber || user.value.phoneNumber,
      role: form.role || user.value.role,
      status: form.status,
    };

    // Inclure le mot de passe seulement si un nouveau est fourni
    if (form.password) {
      updatedData.password = form.password;
    }

    await store.updateUser(route.params.id, updatedData);
    await store.fetchUsers();
    router.push({ name: 'UserList' });
  } catch (error) {
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

.position-relative {
  position: relative;
}

.toggle-password {
  position: absolute;
  top: 72%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
}

.toggle-password i {
  font-size: 1.2rem;
  color: #6c757d;
}

.toggle-password:hover i {
  color: #495057;
}

</style>
