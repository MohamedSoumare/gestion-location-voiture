<template>
  <div :class="{ 'sidebar-collapsed': isSidebarCollapsed, 'light-grey-mode': isLightGreyMode }">
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <!-- <button @click="toggleSidebar" class="btn btn-outline-secondary">
          <i class="fas fa-bars"></i>
        </button> -->
      </div>
      <div class="header-right">
        <select
          id="language"
          class="form-select border-0 m-lg-4"
          @change="changeLanguage"
          aria-label="Language selection"
        >
          <option value="en">EN</option>
          <option value="fr">FR</option>
          <option value="ar">AR</option>
        </select>
        <div class="user-info d-flex align-items-center">
          <img
            v-if="user?.profileImage"
            :src="user.profileImage"
            class="rounded-circle me-2"
            alt="User Profile"
            width="50"
          />
          <!-- Affichage du nom de l'utilisateur -->
          <span class="fw-bold user-name me-5">{{ user?.fullName || 'Inconnu' }}</span>
          <button
            class="btn btn-outline-secondary ms-5 d-flex align-items-center"
            @click="isAuthenticated ? onLogout() : onLogin()"
          >
            <i :class="isAuthenticated ? 'fas fa-sign-out-alt me-3' : 'fas fa-sign-in-alt me-3'"></i>
            {{ isAuthenticated ? 'Déconnexion' : 'Connexion' }}
          </button>
        </div>
      </div>
    </header>
    <!-- Sidebar -->
    <nav class="sidebar">
      <div class="sidebar-header">
       
        <h4>Gestion de Location</h4>
      </div>
      <ul class="list-unstyled">
        <router-link to="/home" class="nav-link">
            <i class="fas fa-home"></i>
            <span>Acceuil</span>
          </router-link>
        <li>
          <router-link to="/customer-list" class="nav-link">
            <i class="fas fa-users"></i>
            <span>Clients</span>
          </router-link>
        </li>
        <li>
          <router-link to="/list-vehicle" class="nav-link">
            <i class="fas fa-car"></i>
            <span>Véhicules</span>
          </router-link>
        </li>
        <li>
          <router-link to="/reservations" class="nav-link">
            <i class="fas fa-calendar-alt"></i>
            <span>Réservations</span>
          </router-link>
        </li>
        <li>
          <router-link to="/contrats" class="nav-link">
            <i class="fas fa-file-alt"></i>
            <span>Contrats</span>
          </router-link>
        </li>

        <li v-if="userRole !== 'ADMIN'">
  <router-link to="/users" class="nav-link">
    <i class="fas fa-user"></i>
    <span>Utilisateur</span>
  </router-link>
</li>

          </ul>
    </nav>

    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'vue-router';

const isLightGreyMode = ref(true);
const isSidebarCollapsed = ref(false);
const authStore = useAuthStore();
const router = useRouter();

// Données utilisateur et état d'authentification
const user = computed(() => authStore.user);
const isAuthenticated = computed(() => authStore.isAuthenticated);

// Définir un rôle basé sur l'utilisateur connecté
// const userRole = computed(() => user.value?.role || 'EMPLOYE'); // ADMIN par défaut si nécessaire
const userRole = computed(() => authStore.user?.role);


// Déconnexion
const onLogout = () => {
  authStore.logout();
  router.push({ name: 'login' });
};

// Fonction pour changer la langue
function changeLanguage(event) {
  const selectedLanguage = event.target.value;
  console.log(`Language changed to: ${selectedLanguage}`);
}

function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
}

</script>

<style scoped>
/* Sidebar Collapsed */
.sidebar-collapsed .sidebar {
  width: 80px;
}

.sidebar-collapsed .content {
  margin-left: 80px;
}


.header {
  width: 100%;
  height: 60px;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 35px;
  
}


.sidebar {
  width: 350px;
  background-color: #F1F1F1;
  /* color: #333; */
  padding: 30px;
  position: fixed;
  top: 60px;
  left: 0;
  height: calc(100vh - 60px);
  transition: width 0.3s ease;
}

.sidebar-header {
  text-align: center;
  margin-bottom: 30px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 15px 35px;
  gap: 15px;
  font-size: 1.1rem;
  color: #333;
  text-decoration: none;
  transition: background 0.3s ease;
}

.nav-link:hover {
  background-color: #c0c0c0;
  border-radius: 5px;
}

/* Content */
.content {
  margin-top: 80px;
  margin-left: 400px;
  width: 85%;
  padding: 10px;
  background-color: #f9f9f9;
  transition: margin-left 0.3s ease;
}

@media (max-width: 768px) {
  .sidebar {
    width: 80px;
  }

  .content {
    margin-left: 80px;
  }

  .sidebar-collapsed .sidebar {
    display: none;
  }

  .sidebar-collapsed .content {
    margin-left: 0;
  }
}
</style>
