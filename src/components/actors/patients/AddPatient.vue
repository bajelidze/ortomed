<template>
  <v-form
    :id="formId"
    fast-fail
    @submit.prevent="submit"
  >
    <v-text-field
      counter
      v-model="name"
      :label="locale.common.NAME + '*'"
      :disabled="submitLoading"
      :rules="nameRules"
    />
  </v-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { SubmitFormProps } from '../../../common/props';
import { Patient } from '../../../common/events';
import { AddPatientFields } from '../../../../common/fields';
import { readFile } from '../../../common/locale';
import { useSettingsStore } from '../../../store/settings';

const name = ref('');

const nameMaxLength = 50;

const nameRules = computed(() => [
  name.value.length > 0 || 'The name must not be empty',
  name.value.length <= nameMaxLength || `The name length must be less than or equal ${nameMaxLength}`,
]);

const settings = await useSettingsStore().get();
const locale = await readFile(settings.locale);

const emit = defineEmits<{
  (e: typeof Patient.ADD_PATIENT_SUBMIT, fields: AddPatientFields): void;
}>();

defineProps<SubmitFormProps>();

function validate(): boolean {
  for (const validator of nameRules.value) {
    if (typeof validator === 'string' || !validator) {
      return false;
    }
  }

  return true;
}

function submit() {
  if (!validate()) {
    return;
  }

  emit(Patient.ADD_PATIENT_SUBMIT, { name: name.value });
}
</script>
