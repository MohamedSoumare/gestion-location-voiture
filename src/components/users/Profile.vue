<template>
    <div class="container">
      <h2 class="text-center">Mon Profil</h2>
  
      <div v-if="loading" class="loading text-center">
        Chargement...
      </div>
  
      <div v-else>
        <!-- Formulaire de mise à jour du profil -->
        <form @submit.prevent="updateProfile" class="profile-form">
          <fieldset>
            <legend>Informations personnelles</legend>
            <div class="grid">
              <div class="form-group">
                <label for="fullName">Nom Complet :</label>
                <input v-model="form.fullName" id="fullName" class="form-control" required />
              </div>
  
              <div class="form-group">
                <label for="email">Email :</label>
                <input
                  v-model="form.email"
                  id="email"
                  type="email"
                  class="form-control"
                  required
                />
              </div>
  
              <div class="form-group">
                <label for="phoneNumber">Téléphone :</label>
                <input
                  v-model="form.phoneNumber"
                  id="phoneNumber"
                  type="text"
                  class="form-control"
                  required
                />
              </div>
            </div>
          </fieldset>
  
          <!-- Boutons -->
          <div class="button-group">
            <button type="submit" class="btn btn-primary">Mettre à jour</button>
            <button type="button" class="btn btn-secondary" @click="cancel">Annuler</button>
          </div>
        </form>
  
        <!-- Bouton pour afficher/cacher le formulaire de mot de passe -->
        <div class="password-toggle">
          <button @click="togglePasswordUpdate" class="btn btn-link">
            {{ showPasswordUpdate ? 'Masquer' : 'Changer' }} le mot de passe
          </button>
        </div>
  
        <!-- Formulaire de changement de mot de passe -->
        <div v-if="showPasswordUpdate" class="password-form">
          <h3 class="mb-5">Changer le mot de passe</h3>
          <form @submit.prevent="updatePassword">
            <div class="grid">
              <div class="form-group position-relative">
                <label for="currentPassword">Mot de passe actuel :</label>
                <input
                  :type="isPasswordVisible ? 'text' : 'password'"
                  v-model="passwordForm.currentPassword"
                  id="currentPassword"
                  required
                  class="form-control"
                />
                <span class="toggle-password" @click="togglePasswordVisibility">
                  <i :class="isPasswordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </span>
              </div>
  
              <div class="form-group position-relative">
                <label for="newPassword">Nouveau mot de passe :</label>
                <input
                  :type="isPasswordVisible ? 'text' : 'password'"
                  v-model="passwordForm.newPassword"
                  id="newPassword"
                  required
                  class="form-control"
                />
                <span class="toggle-password" @click="togglePasswordVisibility">
                  <i :class="isPasswordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </span>
              </div>
            </div>
  
            <div class="button-group">
              <button type="submit" class="btn btn-primary mt-4">Mettre à jour le mot de passe</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import Swal from 'sweetalert2';
  import { useUserStore } from '../../store/userStore';
  import { useRouter } from 'vue-router';
  
  const userStore = useUserStore();
  const router = useRouter();
  
  const loading = ref(false);
  const showPasswordUpdate = ref(false);
  const isPasswordVisible = ref(false);
  
  const form = ref({
    fullName: '',
    email: '',
    phoneNumber: '',
  });
  
  const passwordForm = ref({
    currentPassword: '',
    newPassword: '',
  });
  
  onMounted(async () => {
    try {
      loading.value = true;
      const profile = await userStore.fetchProfile();
      form.value = {
        fullName: profile.fullName,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
      };
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors du chargement du profil',
      });
    } finally {
      loading.value = false;
    }
  });
  
  const updateProfile = async () => {
    try {
      await userStore.updateProfile(form.value);
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Profil mis à jour avec succès',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.message || 'Erreur lors de la mise à jour du profil',
      });
    }
  };
  
  const updatePassword = async () => {
    try {
      await userStore.updatePassword(
        passwordForm.value.currentPassword,
        passwordForm.value.newPassword
      );
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Mot de passe mis à jour avec succès',
      });
      showPasswordUpdate.value = false;
      passwordForm.value.currentPassword = '';
      passwordForm.value.newPassword = '';
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.message || 'Erreur lors de la mise à jour du mot de passe',
      });
    }
  };
  
  const togglePasswordVisibility = () => {
    isPasswordVisible.value = !isPasswordVisible.value;
  };
  
  const togglePasswordUpdate = () => {
    showPasswordUpdate.value = !showPasswordUpdate.value;
  };
  
  const cancel = () => {
    router.go(-1);
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 800px;
    margin: 30px auto;
    padding: 20px;
    border-radius: 8px;
    background-color: #f9f9f9;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    margin-bottom: 20px;
  }
  
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
  }
  
  .button-group {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  
  .password-toggle {
    text-align: right;
    margin: 20px 0;
  }
  
  .loading {
    color: #555;
  }
  
  button {
    border: none;
    cursor: pointer;
  }
  
  button.btn-primary {
    background-color: #007bff;
    color: white;
  }
  
  button.btn-primary:hover {
    background-color: #0056b3;
  }
  
  button.btn-secondary {
    background-color: #6c757d;
    color: white;
  }
  
  button.btn-secondary:hover {
    background-color: #5a6268;
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
  