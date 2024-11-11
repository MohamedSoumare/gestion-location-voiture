<template>
  <div class="container mt-5">
    <h3 class="text-center">Modifier l'utilisateur</h3>
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
        <input v-model="form.role" class="form-control" placeholder="Ex: Employé, admin" />
      </div>
      <div class="mb-3">
        <label>Statut:</label>
        <select v-model="form.status" class="form-select">
          <option :value="true">Actif</option>
          <option :value="false">Inactif</option>
        </select>
      </div>
      <div class="d-flex justify-content-between">
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
    console.log("Statut avant mise à jour:", form.status);  // Vérification du statut
    await store.updateUser(route.params.id, {
      fullName: form.fullName,
      email: form.email,
      phoneNumber: form.phoneNumber,
      role: form.role,
      status: form.status, // Envoie le statut sélectionné
    });
    router.push({ name: 'UserList' });
  } catch (error) {
    alert("Erreur lors de la mise à jour de l'utilisateur.");
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
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
