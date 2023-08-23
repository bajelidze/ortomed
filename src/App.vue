<script setup lang="ts">
import HomePage from './views/HomePage.vue';
</script>

<template>
  <v-app>
    <Suspense>
      <HomePage/>
    </Suspense>
  </v-app>
  <div class="absolute-square"></div>
</template>

<style scoped>
.absolute-square {
  position: absolute;
  top: 0;
  left: 0;
  min-width: 100%;
  height: 100%;
  background-color: white;
  z-index: -1;
}
</style>
