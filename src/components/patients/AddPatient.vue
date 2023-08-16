<template>
  <v-form
    :id="formId"
    fast-fail
    @submit.prevent="submit"
  >
    <v-text-field
      v-model="name"
      label="Name*"
      :disabled="submitLoading"
    />
  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { AddPatientProps } from '../../common/props';
import { Patient } from '../../common/events';
import { AddPatientFields } from '../../../common/fields';

const name = ref('');

const emit = defineEmits<{
  (e: typeof Patient.ADD_PATIENT_SUBMIT, fields: AddPatientFields): void;
}>();

defineProps<AddPatientProps>();

function submit() {
  emit(Patient.ADD_PATIENT_SUBMIT, { name: name.value });
}
</script>
