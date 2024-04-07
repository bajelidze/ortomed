<template>
  <v-card
    class="ma-0 sticky-tabs"
    flat
  >
    <v-container fluid class="pa-2">
      <v-row>
        <v-col cols="auto">
          <v-tabs
              v-model="tab"
              color="primary"
           >
             <v-tab :value="1"><v-icon start icon="mdi-calendar"/>Calendar</v-tab>
          </v-tabs>
        </v-col>
        <v-spacer/>
        <v-col cols="auto">
          <slot/>
        </v-col>
      </v-row>
    </v-container>
    <v-divider/>
  </v-card>
  <ScheduleXCalendar />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ScheduleXCalendar from './components/ScheduleXCalendar.vue';

const tab = ref(null);
</script>

<style>
.sticky-tabs {
  position: sticky;
  top: 0;
  z-index: 100;
}
</style>
