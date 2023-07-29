<template>
  <v-container>
    <v-row>
      <v-col align="left">
        <v-card-title class="text-h4">
          Patients
        </v-card-title>
      </v-col>
      <v-spacer></v-spacer>
      <v-col align="right">
        <v-btn
          append-icon="mdi-plus"
          class="mt-3"
          flat
          color="primary"
        >
          Add
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
      <Suspense>
        <template #default>
          <PatientsList />
        </template>
        <template #fallback>
          Loading...
        </template>
      </Suspense>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import PatientsList from '../components/PatientsList.vue';
</script>
