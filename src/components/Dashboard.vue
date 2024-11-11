<template>
  <div :class="{ 'sidebar-collapsed': isSidebarCollapsed, 'light-grey-mode': isLightGreyMode }">
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <button @click="toggleSidebar" class="btn btn-outline-secondary">
          <i class="fas fa-bars"></i>
        </button>
      </div>

      <div class="header-right">
        <!-- <div class="notification">
          <i class="fas fa-bell"></i>
          <span class="badge">{{ notifications }}</span>
        </div> -->
        <div class="user">
          <i class="fas fa-user"></i>
          <span class="badge">Utilisateur</span>
        </div> 
        <button class="btn btn-outline-secondary" @click="toggleAuth">
          <i class="fas" :class="isAuthenticated ? 'fa-sign-out-alt' : 'fa-sign-in-alt'"></i>
          <span class="ms-2">{{ isAuthenticated ? "Déconnexion" : "Connexion" }}</span>
        </button>
      </div>
    </header>

    <!-- Sidebar -->
    <nav class="sidebar">
      <div class="sidebar-header">
       
        <h4>Gestion de Location</h4>
      </div>
      <ul class="list-unstyled">
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

        <li>
          <router-link to="/users" class="nav-link">
            <i class="fas fa-user"></i>
            <span>Utilisateur</span>
          </router-link>
        </li>
        <li>
          <router-link to="/login" class="nav-link">
            <i class="fas fa-lock"></i>
            <span>Login</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <main class="content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isLightGreyMode = ref(true); 
const isSidebarCollapsed = ref(false);
const isAuthenticated = ref(false);
const notifications = ref(5);

// function toggleSidebar() {
//   isSidebarCollapsed.value = !isSidebarCollapsed.value;
// }

function toggleAuth() {
  isAuthenticated.value = !isAuthenticated.value;
  if (isAuthenticated.value) {
    console.log("Utilisateur connecté");
  } else {
    console.log("Utilisateur déconnecté");
  }
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

/* Header */
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

.notification {
  position: relative;
  font-size: 1.5rem;
  color: #333;
}

.notification .badge {
  position: absolute;
  top: -5px;
  right: -10px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 2px 8px;
  font-size: 0.75rem;
}

/* Sidebar */
.sidebar {
  width: 350px;
  background-color: #BCBCBC; 
  color: #BCBCBC;
  padding: 30px;
  position: fixed;
  top: 60px;
  left: 0;
  height: calc(100vh - 60px);
  transition: width 0.3s ease;
}

.sidebar-header {
  display: flex;
  align-items: center;
 justify-content: center;
  margin-bottom: 30px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 15px 35px;
  gap: 35px;
  font-size: 1.1rem;
  color: #333;
  text-decoration: none;
  transition: background 0.3s ease;
}

.nav-link:hover {
  background-color: #c0c0c0;
  border-radius: 5px;
}

.content {
  margin-top: 80px;
  margin-left: 400px;
  width: 85%;
  padding: 10px;
  background-color: #BCBCBC;
  transition: margin-left 0.3s ease;
}
.badge{
  color: black;
}
/* Light Grey Mode */
body.light-grey-mode {
  background-color: #f1f1f1;
  color: #BCBCBC;
}

.light-grey-mode .header,
.light-grey-mode .sidebar,
.light-grey-mode .content {
  background-color: #f1f1f1;
}

.light-grey-mode .nav-link {
  color: #333;
}

.light-grey-mode .nav-link:hover {
  background-color: #c0c0c0;
}
.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
}

th, td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

th {
  background-color: #f1f1f1;
} 

/* Responsive Design */
@media (max-width: 768px) {
  .sidebar {
    width: 80px;
  }

  .content {
    margin-left: 80px;
    min-width: 800px;
  }

  .sidebar-collapsed .sidebar {
    display: none;
  }

  .sidebar-collapsed .content {
    margin-left: 0;
  }
  
}
</style>
