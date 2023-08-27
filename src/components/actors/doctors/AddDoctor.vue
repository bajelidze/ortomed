<template>
  <v-form
    :id="formId"
    fast-fail
    @submit.prevent="submit"
  >
    <v-text-field
      v-model="name"
      :label="locale.common.NAME + '*'"
      :disabled="submitLoading"
    />
  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SubmitFormProps } from '../../../common/props';
import { Doctor } from '../../../common/events';
import { AddDoctorFields } from '../../../../common/fields';
import { readFile } from '../../../common/locale';
import { useSettingsStore } from '../../../store/settings';

const name = ref('');

const settings = await useSettingsStore().get();
const locale = await readFile(settings.locale);

const emit = defineEmits<{
  (e: typeof Doctor.ADD_DOCTOR_SUBMIT, fields: AddDoctorFields): void;
}>();

defineProps<SubmitFormProps>();

function submit() {
  emit(Doctor.ADD_DOCTOR_SUBMIT, { name: name.value, schedule: { 'FR': { start: 123, end: 333 } } });
}
</script>
