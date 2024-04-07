<template>
  <v-card
    class="ma-0 sticky-tabs"
    flat
  >
    <SessionViewer>
      <v-btn
        prepend-icon="mdi-plus"
        class="mt-2 mr-1"
        color="green"
        flat
        @click="showDialog(true)"
      >
        Schedule
      </v-btn>

      <AddScheduleDialog v-model="showAddScheduleDialog" />
    </SessionViewer>
    <v-divider/>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AddScheduleDialog from './components/AddScheduleDialog.vue';
import SessionViewer from './components/SessionViewer.vue';

const showAddScheduleDialog = ref(false);

function showDialog(show: boolean) {
  showAddScheduleDialog.value = show;
}
</script>

<style>
.sticky-tabs {
  position: sticky;
  top: 0;
  z-index: 100;
}
</style>
