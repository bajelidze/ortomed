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
              color="blue"
           >
             <v-tab :value="1"><v-icon start icon="mdi-calendar"/>Calendar</v-tab>
          </v-tabs>
        </v-col>
        <v-spacer/>
        <v-col cols="auto">
          <v-btn
            prepend-icon="mdi-plus"
            class="mt-2 mr-1"
            color="green"
            flat
          >
            Schedule
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-divider/>
  </v-card>
  <div>
    <ScheduleXCalendar :calendar-app="calendarApp" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ScheduleXCalendar } from '@schedule-x/vue';
import {
  createCalendar,
  viewDay,
  viewWeek,
  viewMonthGrid,
  viewMonthAgenda,
} from '@schedule-x/calendar';
import '@schedule-x/theme-default/dist/index.css';
import { createEventModalPlugin } from '@schedule-x/event-modal';

const tab = ref(null);

const calendarApp = createCalendar({
  locale: 'en-GB',
  views: [viewDay, viewWeek, viewMonthGrid, viewMonthAgenda],
  defaultView: viewWeek.name,
  plugins: [createEventModalPlugin()],
  events: [
    {
      id: 1,
      title: 'Event 1',
      start: '2024-01-28 12:00',
      end: '2024-01-28 13:00',
    },
    {
      id: 2,
      title: 'Event 2',
      start: '2024-01-28 17:00',
      end: '2024-01-28 18:00',
    },
  ],
});
</script>

<style>
.sticky-tabs {
  position: -webkit-sticky; /* For Safari */
  position: sticky;
  top: 0;
  z-index: 100;
}
</style>
