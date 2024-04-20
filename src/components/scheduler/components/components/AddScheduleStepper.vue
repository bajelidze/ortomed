<template>
  <v-stepper
    v-model="currentStep"
    :items="['Create', 'Confirm']"
    flat
    hide-actions
  >
    <template #item.1>
      <AddSchedule
        :form-id="formId"
        :show-indicates-required-field="true"
        @add-schedule-submit="addSchedulePrepare"
      />
    </template>

    <template #item.2>
      <SessionViewer
        default-view="month-grid"
        :events="[]"
      />
    </template>
  </v-stepper>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AddSchedule from './components/AddSchedule.vue';
import SessionViewer from '../SessionViewer.vue';
import { AddScheduleStepperProps } from '../../../../common/props';
import { Common } from '../../../../common/events';
import { AddScheduleFields } from '../../../../../common/fields';
import { Session } from '../../../../../common/interfaces';

defineProps<AddScheduleStepperProps>();

const currentStep = ref(1);
const sessions = ref([] as Session[]);

const emit = defineEmits<{
 (e: typeof Common.SUBMIT_LOADING, submitLoading: boolean): void;
}>();

async function addSchedulePrepare(scheduleData: AddScheduleFields) {
  emit(Common.SUBMIT_LOADING, true);

  console.log(JSON.stringify(scheduleData));

  try {
    const candidateSessions = await window.api.session.schedule(scheduleData);
    sessions.value = candidateSessions;
  } finally {
    emit(Common.SUBMIT_LOADING, false);
    currentStep.value = 2;
  }
}
</script>
