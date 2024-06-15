<template>
  <v-card
    class="ma-0 sticky-tabs"
    flat
  >
    <SessionViewer
      :events="events"
      :rerender="recomputeSessions"
    >
      <v-btn
        prepend-icon="mdi-plus"
        class="mt-2 mr-1"
        color="green"
        flat
        @click="showDialog(true)"
      >
        Schedule
      </v-btn>

      <AddScheduleDialog
        v-model="showAddScheduleDialog"
        @add-schedule-submit="rerenderSessions"
      />
    </SessionViewer>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AddScheduleDialog from './components/AddScheduleDialog.vue';
import SessionViewer from './components/SessionViewer.vue';
import { sessionsToEvents } from './components/components/src/util';
import { Event } from '../../common/interfaces';

const showAddScheduleDialog = ref(false);
const recomputeSessions = ref(0);

const events = ref([] as Event[]);

async function listSessions() {
  const sessions = await window.api.session.list(0, 100000000000000);
  events.value = await sessionsToEvents(sessions);
}

await listSessions();

async function rerenderSessions() {
  await listSessions();
  recomputeSessions.value++;
}

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
