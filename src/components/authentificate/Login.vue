<template>
  <div class="container d-flex justify-content-center align-items-center vh-100 mr-1">
    <div class="card p-5" style="width: 100%">
      <h2 class="text-center mb-5">Connexion</h2>
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
      <div class="text-center mt-3">
        <p class="mb-3">
          <a href="#">Vous avez oublié votre mot de passe ?</a>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const authStore = useAuthStore();
    const router = useRouter();

    const onLogin = async () => {
      try {
        await authStore.login(email.value, password.value);
        // Afficher une alerte de succès
        Swal.fire({
          title: 'Connexion réussie',
          text: 'Bienvenue sur le tableau de bord !',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        // Rediriger vers le tableau de bord
        router.push({ name: 'dashboard' });
      } catch (error) {
        // Afficher une alerte d'erreur
        Swal.fire({
          title: 'Erreur de connexion',
          text: error.message || 'Impossible de se connecter. Veuillez réessayer.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    };

    return { email, password, onLogin };
  },
};
</script>


<style scoped>
.container {
  max-width: 480px;
  margin-right:280px ;
  padding: 2rem;

}
.card {
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
button {
  margin-top: 1.2rem;
}
</style>
