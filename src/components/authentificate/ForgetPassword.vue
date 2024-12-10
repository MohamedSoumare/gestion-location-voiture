<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4 shadow w-100" style="max-width: 400px">
      <h4 class="text-center mb-4">{{ reset ? 'Réinitialiser le mot de passe' : 'Mot de passe oublié' }}</h4>

      <!-- Formulaire pour demander l'OTP -->
      <form v-if="!reset" @submit.prevent="requestOTP">
        <div class="mb-3">
          <label for="email" class="form-label">Adresse e-mail</label>
          <input
            type="email"
            v-model="email"
            id="email"
            class="form-control"
            placeholder="Entrez votre email"
            required
          />
        </div>
        <div class="d-flex justify-content-between mt-4">
          <button type="submit" class="btn btn-primary">Envoyer</button>
          <button @click.prevent="goBack" class="btn btn-secondary">Annuler</button>
        </div>
      </form>

      <!-- Formulaire pour réinitialiser le mot de passe -->
      <form v-else @submit.prevent="resetPassword">
        <div class="mb-3">
          <label for="otp" class="form-label">Code OTP</label>
          <input
            type="text"
            v-model="otp"
            id="otp"
            class="form-control"
            placeholder="Entrez le code OTP reçu par email"
            required
          />
        </div>
        <div class="mb-3">
          <label for="newPassword" class="form-label">Nouveau mot de passe</label>
          <div class="input-group">
            <input
              :type="isPasswordVisible ? 'text' : 'password'"
              v-model="newPassword"
              id="newPassword"
              class="form-control"
              placeholder="Entrez votre nouveau mot de passe"
              required
            />
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="togglePasswordVisibility"
            >
              {{ isPasswordVisible ? 'Masquer' : 'Afficher' }}
            </button>
          </div>
        </div>
        <div class="d-flex justify-content-between mt-4">
        <button type="submit" class="btn btn-primary">Réinitialiser</button>
        <button @click.prevent="goBack" class="btn btn-secondary">Annuler</button>
        </div>
      </form>

      <!-- Affichage des erreurs -->
      <div v-if="errors.length" class="alert alert-danger mt-3">
        <ul>
          <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'vue-router';

const storeLogin = useAuthStore();
const router = useRouter();

const reset = ref(false); // Contrôle l'état du formulaire
const email = ref('');
const otp = ref('');
const newPassword = ref('');
const errors = ref([]);
const isPasswordVisible = ref(false);

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

const goBack = () => router.push({ name: 'login' });

const requestOTP = async () => {
  try {
    errors.value = [];
    const response = await storeLogin.sendOTP(email.value); // Action dans Pinia
    console.log('OTP envoyé:', response.message);
    reset.value = true;
  } catch (error) {
    errors.value = [error.message || 'Échec de l\'envoi de l\'OTP.'];
  }
};

const resetPassword = async () => {
  try {
    errors.value = [];
    await storeLogin.resetPassword(email.value, otp.value, newPassword.value); // Action dans Pinia
    console.log('Mot de passe réinitialisé avec succès');
    router.push({ name: 'login' });
  } catch (error) {
    errors.value = [error.message || 'Erreur lors de la réinitialisation du mot de passe.'];
  }
};

</script>
<style scoped>
.container {
  max-width: 580px;
  margin-right: 280px;
  padding: 2rem;
}
</style>