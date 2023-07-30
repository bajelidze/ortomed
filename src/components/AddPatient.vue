<template>
  <v-card>

  </v-card>
</template>

<script lang="ts">
const patients = await window.api.listPatients();

export default {
  data() {
    return {
      patients,
    };
  },
};
</script>
