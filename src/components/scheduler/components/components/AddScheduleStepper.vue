<template>
  <v-stepper
    :items="['Create', 'Confirm']"
    flat
    hide-actions
    :modelValue="modelValue"
    @update:modelValue="setStep($event as number)"
  >
    <template #item.1>
      <AddSchedule
        :form-id="formId"
        :show-indicates-required-field="true"
        :submit-loading="submitLoading"
        @add-schedule-submit="fields => emit(Scheduler.ADD_SCHEDULE_SUBMIT, fields)"
      />
    </template>

    <template #item.2>
      <SessionViewer default-view="month-grid" />
    </template>
  </v-stepper>
</template>

<script setup lang="ts">
import AddSchedule from './components/AddSchedule.vue';
import SessionViewer from '../SessionViewer.vue';
import { AddScheduleStepperProps } from '../../../../common/props';
import { Scheduler, Common } from '../../../../common/events';
import { AddScheduleFields } from '../../../../../common/fields';

defineProps<AddScheduleStepperProps>();

const emit = defineEmits<{
 (e: typeof Scheduler.ADD_SCHEDULE_SUBMIT, fields: AddScheduleFields): void;
 (e: typeof Common.UPDATE_MODULE_VALUE, currentStep: number): void;
}>();

function setStep(step: number) {
  emit(Common.UPDATE_MODULE_VALUE, step);
}
</script>
