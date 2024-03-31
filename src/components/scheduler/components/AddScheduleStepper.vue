<template>
  <v-stepper :items="['Step 1', 'Step 2', 'Step 3']">
    <template v-slot:item.1>
      <AddSchedule
        :form-id="formId"
        :show-indicates-required-field="true"
        :submit-loading="submitLoading"
        @add-schedule-submit="fields => emit(Scheduler.ADD_SCHEDULE_SUBMIT, fields)"
      />
    </template>

    <template v-slot:item.2>
      <v-card title="Step Two" flat>...</v-card>
    </template>

    <template v-slot:item.3>
      <v-card title="Step Three" flat>...</v-card>
    </template>
  </v-stepper>
</template>

<script setup lang="ts">
import AddSchedule from './components/AddSchedule.vue';
import { SubmitFormProps } from '../../../common/props';
import { Scheduler } from '../../../common/events';
import { AddScheduleFields } from '../../../../common/fields';

defineProps<SubmitFormProps>();

const emit = defineEmits<{
 (e: typeof Scheduler.ADD_SCHEDULE_SUBMIT, fields: AddScheduleFields): void;
}>();
</script>
