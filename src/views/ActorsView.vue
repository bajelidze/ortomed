<template>
  <v-tabs
      v-model="tab"
      color="blue"
      align-tabs="center"
    >
    <v-tab :value="1"><v-icon start icon="mdi-account"/>{{ locale.patients.PATIENTS }}</v-tab>
    <v-tab :value="2"><v-icon start icon="mdi-medical-bag"/>{{ locale.doctors.DOCTORS }}</v-tab>
  </v-tabs>
  <v-window v-model="tab">
    <v-window-item :value="1">
      <PatientsManager />
    </v-window-item>
    <v-window-item :key="2" :value="2">
      <DoctorsManager />
    </v-window-item>
  </v-window>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PatientsManager from '../components/actors/patients/PatientsManager.vue';
import DoctorsManager from '../components/actors/doctors/DoctorsManager.vue';
import { useSettingsStore } from '../store/settings';
import { readFile } from '../common/locale';

const settings = await useSettingsStore().get();
const locale = await readFile(settings.locale);

const tab = ref(null);
</script>
