<template>
  <AddDialog
    :modelValue="modelValue"
    @update:modelValue="showDialog($event)"
    add-item-title="Add Schedule"
    :form-id="formId"
    :submit-loading="submitLoading"
    :show-indicates-required-field="true"
  >
    <AddScheduleStepper
      :add-schedule-form-id="schedulerAddFormID"
      :submit-schedule-form-id="schedulerSubmitFormID"
      :show-indicates-required-field="true"
      @submit-loading="loading => submitLoading = loading"
      @add-schedule-prepare="formId = schedulerSubmitFormID"
      @add-schedule-done="formId = schedulerAddFormID"
      @add-schedule-submit="addScheduleSubmit"
    />
  </AddDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AddDialog from '../../common/AddDialog.vue';
import AddScheduleStepper from './components/AddScheduleStepper.vue';
import { Common, Scheduler } from '../../../common/events';
import { Session } from '../../../../common/interfaces';
import { ModelProps } from '../../../common/props';

const schedulerAddFormID = 'addScheduleForm';
const schedulerSubmitFormID = 'submitScheduleForm';

const submitLoading = ref(false);

const formId = ref(schedulerAddFormID);

const emit = defineEmits<{
 (e: typeof Common.UPDATE_MODULE_VALUE, show: boolean): void;
 (e: typeof Scheduler.ADD_SCHEDULE_SUBMIT): void;
}>();

defineProps<ModelProps>();

function showDialog(show: boolean) {
  emit(Common.UPDATE_MODULE_VALUE, show);
}

async function addScheduleSubmit(sessions: Session[]) {
  submitLoading.value = true;

  try {
    await window.api.session.submit(JSON.stringify(sessions));
    emit(Scheduler.ADD_SCHEDULE_SUBMIT);
  } finally {
    formId.value = schedulerAddFormID;
    submitLoading.value = false;
    showDialog(false);
  }
}
</script>
