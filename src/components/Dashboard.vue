<template>
  <div :class="{ 'sidebar-collapsed': isSidebarCollapsed, 'light-grey-mode': isLightGreyMode }">
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <!-- <button @click="toggleSidebar" class="btn btn-outline-secondary">
          <i :class="isSidebarCollapsed ? 'fas fa-arrow-right' : 'fas fa-arrow-left'"></i>
        </button> -->
      </div>
  
      <div class="header-right">
        <select
          id="language"
          class="form-select border-0 m-lg-4"
          @change="changeLanguage"
          aria-label="Language selection"
        >
          <option value="fr">FR</option>
          <option value="en">EN</option>
          <option value="ar">AR</option>
        </select>
        
      <div class="user-info d-flex align-items-center">
          <i class="fas fa-user me-3"></i>
      <span class="fw-bold user-name me-5">{{ user?.fullName || 'Inconnu' }}</span>
      <div class="user-info d-flex align-items-center position-relative">
  <div class="dropdown">
    <button
      class="btn btn-outline-secondary dropdown-toggle me-3"
      type="button"
      id="dropdownMenuButton"
      @click="toggleProfileMenu"
    >
      Profil
    </button>
    <ul
      v-if="isProfileMenuVisible"
      class="dropdown-menu"
      :class="{ show: isProfileMenuVisible }"
    >
      <li><router-link to="/users/profile" class="dropdown-item">Voir Profil</router-link></li>
      <li><router-link to="/settings" class="dropdown-item">Paramètres</router-link></li>
      <li><button class="dropdown-item " @click="onLogout">Déconnexion</button></li>
    </ul>
  </div>
</div>
        
        </div>
      </div>
    </header>

    <!-- Sidebar -->
    <nav class="sidebar">
      <div class="sidebar-header">
        <h4 v-if="!isSidebarCollapsed">Gestion de Location</h4>
      </div>
      <ul class="list-unstyled">
        <li>
    <router-link 
      to="/home" 
      class="nav-link" 
      :class="{ active: $route.path === '/home' }">
      <i class="fas fa-home"></i>
      <span>Accueil</span>
    </router-link>
  </li>
  <li>
    <router-link 
      to="/customer-list" 
      class="nav-link" 
      :class="{ active: $route.path === '/customer-list' }">
      <i class="fas fa-users"></i>
      <span>Clients</span>
    </router-link>
  </li>
  <li>
    <router-link 
      to="/list-vehicle" 
      class="nav-link" 
      :class="{ active: $route.path === '/list-vehicle' }">
      <i class="fas fa-car"></i>
      <span>Véhicules</span>
    </router-link>
  </li>
  <li>
    <router-link 
      to="/reservations" 
      class="nav-link" 
      :class="{ active: $route.path === '/reservations' }">
      <i class="fas fa-calendar-alt"></i>
      <span>Réservations</span>
    </router-link>
  </li>
        <li>
          <router-link to="/contrats" class="nav-link"  :class="{ active: $route.path === '/contrats' }">
            <i class="fas fa-file-alt"></i>
            <span v-if="!isSidebarCollapsed">Contrats</span>
          </router-link>
        </li>
        <li v-if="userRole === 'ADMIN' && userRole">
      <router-link to="/users" class="nav-link" :class="{ active: $route.path === '/users' }">
        <i class="fas fa-user"></i>
        <span v-if="!isSidebarCollapsed">Utilisateur</span>
      </router-link>

      <button
            class="btn btn-outline-secondary ms-4 d-flex align-items-center mt-3"
            @click="isAuthenticated ? onLogout() : onLogin()"
          >
            <i :class="isAuthenticated ? 'fas fa-sign-out-alt me-2' : 'fas fa-sign-in-alt me-3'"></i>
            {{ isAuthenticated ? 'Déconnexion' : 'Connexion' }}
      </button>
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

// Données utilisateur et rôle
const user = computed(() => authStore.user);
const isAuthenticated = computed(() => authStore.isAuthenticated);
const userRole = computed(() => {
  console.log("Débogage userRole:", authStore.user?.role || 'EMPLOYE');
  return authStore.user?.role || 'EMPLOYE';
});


// Déconnexion
const onLogout = () => {
  authStore.logout();
  router.push({ name: 'login' });
};

// Basculer l'état de la barre latérale
// const toggleSidebar = () => {
//   isSidebarCollapsed.value = !isSidebarCollapsed.value;
// };

// Changer la langue
function changeLanguage(event) {
  const selectedLanguage = event.target.value;
  console.log(`Langue sélectionnée : ${selectedLanguage}`);
}

const isProfileMenuVisible = ref(false);

const toggleProfileMenu = () => {
  isProfileMenuVisible.value = !isProfileMenuVisible.value;
};

// Fermer le menu si l'utilisateur clique en dehors
const handleClickOutside = (event) => {
  const dropdown = document.querySelector('.dropdown');
  if (dropdown && !dropdown.contains(event.target)) {
    isProfileMenuVisible.value = false;
  }
};

document.addEventListener('click', handleClickOutside);

</script>

<style scoped>

.user-name{
  font-size: 16px;
  font-weight: bold;
  width: 100px;

}
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

.nav-link {
  display: flex;
  align-items: center;
  padding: 15px 35px;
  color: #333;
  text-decoration: none;
  transition: background 0.3s ease;
}

.nav-link.active {
  background-color: #424242; /* Couleur d'arrière-plan pour le lien actif */
  color: #fff; /* Texte blanc */
  border-radius: 5px; /* Coins arrondis */
  font-weight: bold;
  
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
.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  display: none;
  float: left;
  min-width: 160px;
  padding: 5px 0;
  margin: 0;
  font-size: 1rem;
  text-align: left;
  list-style: none;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.175);
}

.dropdown-menu.show {
  display: block;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.25rem 1.5rem;
  clear: both;
  font-weight: 400;
  color: #212529;
  text-align: inherit;
  white-space: nowrap;
  background-color: transparent;
  border: 0;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #d1d1d1;
}

.dropdown-item.text-danger {
  color: #dc3545;
}

</style>
