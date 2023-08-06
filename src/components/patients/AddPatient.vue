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
import { AddPatientProps } from '../../common/props';
import { Patient } from '../../common/events';

defineProps<AddPatientProps>();
defineEmits([Patient.ADD_PATIENT_SUBMIT]);
</script>

<script lang="ts">
export default {
  data() {
    return {
      name: '',
    };
  },
  methods: {
    submit() {
      this.$emit(Patient.ADD_PATIENT_SUBMIT, {
        name: this.name,
      })
    }
  },
}
</script>
