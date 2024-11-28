<template>
    <div class="container d-flex justify-content-center align-items-center vh-100">
      <div class="card p-4 shadow w-100" style="max-width: 400px">
        <h4 class="text-center mb-4">{{ reset ? 'Réinitialiser le mot de passe' : 'Mot de passe oublié' }}</h4>
  
        <!-- Formulaire pour demander l'OTP -->
        <form v-if="!reset" @submit.prevent="forget">
          <div class="mb-3">
            <label for="email" class="form-label">Adresse e-mail</label>
            <input
              type="email"
              v-model="storeLogin.user.email"
              id="email"
              class="form-control"
              placeholder="Entrez votre email"
              required
            />
          </div>
          <button type="submit" class="btn btn-primary w-100">Envoyer l'OTP</button>
        </form>
  
        <!-- Formulaire pour réinitialiser le mot de passe -->
        <form v-else @submit.prevent="resetPwd">
          <div class="mb-3">
            <label for="email" class="form-label">Adresse e-mail</label>
            <input
              type="email"
              v-model="storeLogin.user.email"
              id="email"
              class="form-control"
              placeholder="Entrez votre email"
              required
            />
          </div>
          <div class="mb-3">
            <label for="otp" class="form-label">Code OTP</label>
            <input
              type="text"
              id="otp"
              v-model="storeLogin.user.codeOtp"
              class="form-control"
              placeholder="Entrez le code OTP reçu"
              required
            />
          </div>
          <div class="mb-3 position-relative">
            <label for="newPassword" class="form-label">Nouveau mot de passe</label>
            <input
              :type="isPasswordVisible ? 'text' : 'password'"
              id="newPassword"
              v-model="storeLogin.user.newPassword"
              class="form-control"
              placeholder="Entrez un nouveau mot de passe"
              required
            />
            <span class="toggle-password" @click="togglePasswordVisibility">
              <i :class="isPasswordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </span>
          </div>
          <button type="submit" class="btn btn-primary w-100">Réinitialiser</button>
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
const reset = ref(false);
const errors = ref([]);
const isPasswordVisible = ref(false);

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

const forget = async () => {
  try {
    await storeLogin.forgotPwd();
    reset.value = true; 
  } catch (error) {
    errors.value = error.response?.data?.errors || ['Une erreur est survenue.'];
  }
};

const resetPwd = async () => {
  try {
    await storeLogin.resetPwd();
    router.push({ name: 'login' }); 
  } catch (error) {
    errors.value = error.response?.data?.errors || ['Une erreur est survenue.'];
  }
};
</script>
  