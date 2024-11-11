<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4" style="width: 100%; max-width: 400px;">
      <h2 class="text-center mb-4">Connexion</h2>
      <form @submit.prevent="onLogin">
        <div class="mb-3">
          <label for="email" class="form-label">Adresse e-mail</label>
          <input type="email" v-model="email" class="form-control" id="email" required />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Mot de passe</label>
          <input type="password" v-model="password" class="form-control" id="password" required />
        </div>
        <button type="submit" class="btn btn-primary w-100">Connexion</button>
      </form>
      <p v-if="errorMessage" class="text-danger mt-2">{{ errorMessage }}</p>
      <div class="text-center mt-3">
        <p class="mb-1">
          Vous n'avez pas encore de compte ? <a href="/register">Créer un compte</a>
        </p>
        <p class="mb-3">
          <a href="#">Vous avez oublié votre mot de passe ?</a>
        </p>
      </div>
      <div class="text-center mt-3">
        <p>Suivez-nous</p>
        <a href="#" class="social-icon"><i class="fab fa-facebook fa-lg"></i></a>
        <a href="#" class="social-icon"><i class="fab fa-twitter fa-lg"></i></a>
        <a href="#" class="social-icon"><i class="fab fa-linkedin fa-lg"></i></a>
      </div>
      
      <div class="text-center mt-4">
        <!-- <img src="/mnt/data/connection.jpg" alt="Workday Logo" class="img-fluid logo"> -->
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '../../store/authStore';
import router from '../../router';

export default {
  setup() {
    const authStore = useAuthStore();
    const email = ref('');
    const password = ref('');
    const errorMessage = ref('');

    const onLogin = async () => {
      try {
        await authStore.login(email.value, password.value);
        errorMessage.value = '';
        router.push({ name: "dashboard" });
      } catch (error) {
        errorMessage.value = error.message;
      }
    };

    return { email, password, onLogin, errorMessage };
  },
};
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: auto;
  padding: 2rem;
}
.card {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
button {
  margin-top: 1rem;
}
.social-icon {
  color: #6c757d;
  margin: 0 10px;
}
.social-icon:hover {
  color: #0056b3;
}
.logo {
  max-height: 30px;
}
.text-center p {
  font-size: 0.9rem;
}
</style>
