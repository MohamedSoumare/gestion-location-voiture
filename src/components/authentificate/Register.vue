<template>
    <div class="d-flex justify-content-center align-items-center ">
      <div class="card p-4" style="max-width: 400px; border-radius: 8px; border: 1px solid #ddd;">
        <h2 class="text-center fw-bold mb-3">Créer un compte</h2>
        <p class="text-center fs-6">
          This account will allow you to manage your applications, follow the statuses, provide additional documents, and manage the potential offers you receive.
        </p>
        <ul class="list-unstyled text-muted mb-4">
          <li>Nombre</li>
          <li>Majuscule</li>
          <li>Minuscule</li>
          <li>8 caractères minimum</li>
          <li>Caractère spécial</li>
          <li>Lettre</li>
        </ul>
        
        <form @submit.prevent="register">
          <div class="mb-4">
            <label for="email" class="form-label">Adresse e-mail</label>
            <input v-model="email" type="email" id="email" class="form-control" required />
          </div>
          
          <div class="mb-4">
            <label for="password" class="form-label">Mot de passe</label>
            <input v-model="password" type="password" id="password" class="form-control" required />
          </div>
          
          <div class="mb-4">
            <label for="confirmPassword" class="form-label">Confirmer le nouveau mot de passe</label>
            <input v-model="confirmPassword" type="password" id="confirmPassword" class="form-control" required />
          </div>
          
          <p class="text-muted fst-italic mb-3">
            You agree to the terms and conditions listed on this page <a href="#">Terms & Conditions</a>
          </p>
          
          <div class="form-check mb-4">
            <input v-model="acceptTerms" type="checkbox" id="terms" class="form-check-input" required />
            <label for="terms" class="form-check-label">
              I consent to the Terms & Conditions and Data Privacy Statement
            </label>
          </div>
          
          <button type="submit" class="btn btn-primary w-100" :disabled="!acceptTerms">Créer un compte</button>
        </form>
        
        <div class="text-center mt-3">
          <p>Vous avez déjà un compte ? <a href="#">Connexion</a></p>
          <p><a href="#">Vous avez oublié votre mot de passe ?</a></p>
        </div>
        
        <div class="text-center mt-4">
          <p>Suivez-nous</p>
          <div class="d-flex justify-content-center">
            <a href="#" class="mx-2"><i class="fab fa-facebook"></i></a>
            <a href="#" class="mx-2"><i class="fab fa-twitter"></i></a>
            <a href="#" class="mx-2"><i class="fab fa-linkedin"></i></a>
          </div>
        </div>
        
        <p class="text-center mt-3">
          <a href="#">WFP Privacy Policy</a>
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const email = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  const acceptTerms = ref(false);
  
  const register = () => {
    // Vérifiez si les mots de passe correspondent
    if (password.value !== confirmPassword.value) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    alert('Inscription réussie');
  };
  </script>
  
  <style scoped>
  
  .card {
    /* max-width: 400px; */
    border-radius: 8px;
    border: 1px solid #ddd;
  }
  
  .fab {
    font-size: 1.5rem;
  }
  </style>
  