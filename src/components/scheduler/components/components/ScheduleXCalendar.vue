<template>
  <v-card class="ma-12">
    <ScheduleXCalendar
      v-if="calendarApp != undefined"
      :calendar-app="calendarApp"
    />
  </v-card>
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
import { ScheduleXCalendarProps } from '../../../../common/props';

const props = withDefaults(
  defineProps<ScheduleXCalendarProps>(),
  {
    defaultView: viewWeek.name,
    withPagination: false,
  },
);

const calendarApp = createCalendar({
  locale: 'en-GB',
  views: [viewDay, viewWeek, viewMonthGrid, viewMonthAgenda],
  defaultView: props.defaultView,
  plugins: [createEventModalPlugin()],
  events: props.events,
  callbacks: {
    onRangeUpdate: props.withPagination ? (range) => {
      console.log('new calendar range start date', range.start);
      console.log('new calendar range end date', range.end);
    } : undefined,
  },
});
</script>

<style>
.sx__calendar {
  border-radius: 0;
  border-width: 0 0 1px 0;
}
.sx__month-grid-day__events {
  min-height: 60px;
}
</style>

