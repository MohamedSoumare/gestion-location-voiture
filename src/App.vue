<template>
  <div id="app">
    <!-- <Dashboard />  -->
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script setup>

import Dashboard from './components/Dashboard.vue';

</script>

<style scoped>
#app {
  display: flex;
}

.content {
  width: calc(100% - 250px);
}

@media (max-width: 768px) {
  .content {
    margin-left: 0;
  }
}
</style>