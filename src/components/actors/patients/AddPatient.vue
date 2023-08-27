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
import { AddPatientProps } from '../../../common/props';
import { Patient } from '../../../common/events';
import { AddPatientFields } from '../../../../common/fields';
import { readFile } from '../../../common/locale';
import { useSettingsStore } from '../../../store/settings';

const name = ref('');

const settings = await useSettingsStore().get();
const locale = await readFile(settings.locale);

const emit = defineEmits<{
  (e: typeof Patient.ADD_PATIENT_SUBMIT, fields: AddPatientFields): void;
}>();

defineProps<AddPatientProps>();

function submit() {
  emit(Patient.ADD_PATIENT_SUBMIT, { name: name.value });
}
</script>
