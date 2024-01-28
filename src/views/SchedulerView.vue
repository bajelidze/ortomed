<template>
  <div>
    <ScheduleXCalendar :calendar-app="calendarApp" />
  </div>
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
