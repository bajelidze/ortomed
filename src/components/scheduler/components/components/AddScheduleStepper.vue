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
import { ref, onUnmounted } from 'vue';
import AddSchedule from './components/AddSchedule.vue';
import SessionViewer from '../SessionViewer.vue';
import { AddScheduleStepperProps } from '../../../../common/props';
import { Common, Scheduler } from '../../../../common/events';
import { AddScheduleFields } from '../../../../../common/fields';
import { Event } from '../../../../common/interfaces';
import { Session } from '../../../../../common/interfaces';
import { sessionsToEvents } from './src/util';

defineProps<AddScheduleStepperProps>();

const currentStep = ref(1);
const events = ref([] as Event[]);
const sessions = ref([] as Session[]);

const emit = defineEmits<{
 (e: typeof Common.SUBMIT_LOADING, submitLoading: boolean): void;
 (e: typeof Scheduler.ADD_SCHEDULE_PREPARE): void;
 (e: typeof Scheduler.ADD_SCHEDULE_DONE): void;
 (e: typeof Scheduler.ADD_SCHEDULE_SUBMIT, sessions: Session[]): void;
}>();

onUnmounted(() => {
  emit(Scheduler.ADD_SCHEDULE_DONE);
});

async function addSchedulePrepare(scheduleData: AddScheduleFields) {
  emit(Common.SUBMIT_LOADING, true);

  try {
    sessions.value = await window.api.session.schedule(scheduleData);
    events.value = await sessionsToEvents(sessions.value);
  } finally {
    emit(Common.SUBMIT_LOADING, false);
    currentStep.value = 2;
    emit(Scheduler.ADD_SCHEDULE_PREPARE);
  }
}

function submit() {
  emit(Scheduler.ADD_SCHEDULE_SUBMIT, sessions.value);
}
</script>
