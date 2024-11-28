<template>
  <div class="container d-flex justify-content-center align-items-center vh-100 mr-1">
    <div class="card p-5" style="width: 100%">
      <h2 class="text-center mb-5">Connexion</h2>
      <form @submit.prevent="onLogin">
        <div class="mb-3">
          <label for="email" class="form-label">Adresse e-mail</label>
          <input
            type="email"
            v-model="email"
            class="form-control"
            id="email"
            required
          />
        </div>
        <div class="mb-3 position-relative">
          <label for="password" class="form-label">Mot de passe</label>
          <input
            :type="isPasswordVisible ? 'text' : 'password'"
            v-model="password"
            class="form-control"
            id="password"
            rmquired
          />
          <span class="toggle-password" @click="togglePasswordVisibility">
            <i
              :class="isPasswordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"
            ></i>
          </span>
        </div>
        <button type="submit" class="btn btn-primary w-100">Connexion</button>
      </form>
      <div class="mt-3 text-center">
        <router-link to="/forget-password" class="text-decoration-none">
          <i class="bi bi-key"></i> Mot de passe oublié
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useAuthStore } from "../../store/authStore";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const authStore = useAuthStore();
    const router = useRouter();
    const isPasswordVisible = ref(false);

    const togglePasswordVisibility = () => {
      isPasswordVisible.value = !isPasswordVisible.value;
    };

    const onLogin = async () => {
      try {
        await authStore.login(email.value, password.value);
        Swal.fire({
          title: "Connexion réussie",
          text: "Bienvenue sur le tableau de bord !",
          icon: "success",
          confirmButtonText: "OK",
        });
        router.push({ name: "Home" });
      } catch (error) {
        Swal.fire({
          title: "Erreur de connexion",
          text:
            error.message || "Impossible de se connecter. Veuillez réessayer.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    return {
      email,
      password,
      onLogin,
      togglePasswordVisibility,
      isPasswordVisible,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 480px;
  margin-right: 280px;
  padding: 2rem;
}
.card {
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
button {
  margin-top: 1.2rem;
}
.toggle-password {
  position: absolute;
  top: 73%;
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
