<template>
  <AddDialog
    :modelValue="modelValue"
    @update:modelValue="showDialog($event)"
    add-item-title="Add Schedule"
    :form-id="schedulerAddFormID"
    :submit-loading="submitLoading"
    :show-indicates-required-field="true"
    :submit-btn-text="submitBtnText"
  >
    <AddScheduleStepper
      v-model="currentStep"
      :form-id="schedulerAddFormID"
      :show-indicates-required-field="true"
      :submit-loading="submitLoading"
      @add-schedule-submit="addScheduleSubmit"
    />
  </AddDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AddDialog from '../../common/AddDialog.vue';
import AddScheduleStepper from './components/AddScheduleStepper.vue';
import { AddScheduleFields } from '../../../../common/fields';
import { Common } from '../../../common/events';
import { ModelProps } from '../../../common/props';
import { computed } from 'vue';

const schedulerAddFormID = 'addScheduleForm';

const submitLoading = ref(false);

const currentStep = ref(1);
const submitBtnText = computed(() => currentStep.value == 1 ? 'Next' : '');

const emit = defineEmits<{
 (e: typeof Common.UPDATE_MODULE_VALUE, show: boolean): void;
}>();

defineProps<ModelProps>();

async function addScheduleSubmit(scheduleData: AddScheduleFields) {
  submitLoading.value = true;

  console.log(JSON.stringify(scheduleData));

  try {
    await window.api.session.schedule(scheduleData);
  } finally {
    submitLoading.value = false;
    currentStep.value = 2;
  }
}

function showDialog(show: boolean) {
  emit(Common.UPDATE_MODULE_VALUE, show);

  if (currentStep.value != 1) {
    setTimeout(() => {
      currentStep.value = 1;
    }, 500);
  }
}
</script>
