<template>
  <v-stepper
    v-model="currentStep"
    :items="['Create', 'Confirm']"
    flat
    hide-actions
  >
    <template #item.1>
      <AddSchedule
        :form-id="addScheduleFormId"
        :show-indicates-required-field="true"
        @add-schedule-submit="addSchedulePrepare"
      />
    </template>

    <template #item.2>
      <SessionViewer
        default-view="month-grid"
        :events="events"
      />

      <v-form
        :id="submitScheduleFormId"
        fast-fail
        @submit.prevent="submit"
      />
    </template>
  </v-stepper>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AddSchedule from './components/AddSchedule.vue';
import SessionViewer from '../SessionViewer.vue';
import { AddScheduleStepperProps } from '../../../../common/props';
import { Common, Scheduler } from '../../../../common/events';
import { AddScheduleFields } from '../../../../../common/fields';
import { Event } from '../../../../common/interfaces';
import { sessionsToEvents } from './src/util';

defineProps<AddScheduleStepperProps>();

const currentStep = ref(1);
const events = ref([] as Event[]);

const emit = defineEmits<{
 (e: typeof Common.SUBMIT_LOADING, submitLoading: boolean): void;
 (e: typeof Scheduler.ADD_SCHEDULE_PREPARE): void;
}>();

async function addSchedulePrepare(scheduleData: AddScheduleFields) {
  emit(Common.SUBMIT_LOADING, true);

  try {
    const candidateSessions = await window.api.session.schedule(scheduleData);
    events.value = await sessionsToEvents(candidateSessions);
  } finally {
    emit(Common.SUBMIT_LOADING, false);
    currentStep.value = 2;
    emit(Scheduler.ADD_SCHEDULE_PREPARE);
  }
}

function submit() {
  console.log('ddx');
}
</script>
