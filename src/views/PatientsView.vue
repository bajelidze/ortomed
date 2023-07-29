<template>
  <Suspense>
    <template #default>
      <PatientsList />
    </template>
    <template #fallback>
      Loading...
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import PatientsList from '../components/PatientsList.vue';
</script>
