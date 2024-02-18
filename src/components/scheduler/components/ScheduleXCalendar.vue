<template>
  <ScheduleXCalendar :calendar-app="calendarApp"/>
</template>

<script setup lang="ts">
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

const calendarApp = createCalendar({
  locale: 'en-GB',
  views: [viewDay, viewWeek, viewMonthGrid, viewMonthAgenda],
  defaultView: viewWeek.name,
  plugins: [createEventModalPlugin()],
  events: [
    {
      id: 1,
      title: 'Event 1',
      start: '2024-02-17 12:00',
      end: '2024-02-17 13:00',
    },
    {
      id: 1,
      title: 'Event 2',
      start: '2024-02-17 14:00',
      end: '2024-02-17 15:00',
    },
  ],
  callbacks: {
    onRangeUpdate(range) {
      console.log('new calendar range start date', range.start);
      console.log('new calendar range end date', range.end);
    },
  },
});
</script>

<style>
.sx__calendar {
  border-radius: 0;
  border-width: 0 0 1px 0;
}
</style>

