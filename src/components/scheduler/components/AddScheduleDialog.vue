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
      @add-schedule-prepare="addSchedulePrepare"
    />
  </AddDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AddDialog from '../../common/AddDialog.vue';
import AddScheduleStepper from './components/AddScheduleStepper.vue';
import { Common } from '../../../common/events';
import { ModelProps } from '../../../common/props';

const schedulerAddFormID = 'addScheduleForm';
const schedulerSubmitFormID = 'submitScheduleForm';

const submitLoading = ref(false);

const formId = ref(schedulerAddFormID);

const emit = defineEmits<{
 (e: typeof Common.UPDATE_MODULE_VALUE, show: boolean): void;
}>();

defineProps<ModelProps>();

function showDialog(show: boolean) {
  emit(Common.UPDATE_MODULE_VALUE, show);
}

function addSchedulePrepare() {
  console.log('HEREREE!');
  formId.value = schedulerSubmitFormID;
}
</script>
