<template>
  <v-form
    :id="formId"
    fast-fail
    @submit.prevent="submit"
  >
    <v-text-field
      v-model="firstName"
      label="First name"
      :disabled="firstNameTextDisabled"
    />
  </v-form>
</template>

<script setup lang="ts">
import { AddPatientProps } from '../../common/props';
import { Patient } from '../../common/events';

defineProps<AddPatientProps>();
defineEmits([Patient.ADD_PATIENT_SUBMIT]);
</script>

<script lang="ts">
export default {
  data() {
    return {
      firstName: '',
      firstNameTextDisabled: false,
    };
  },
  methods: {
    submit() {
      this.firstNameTextDisabled = true;
      this.$emit(Patient.ADD_PATIENT_SUBMIT, { firstName: this.firstName })
    }
  },
}
</script>
