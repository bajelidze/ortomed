<template>
  <v-form
    :id="formId"
    fast-fail
    @submit.prevent="$emit('submitted')"
  >
    <v-text-field
      v-model="firstName"
      label="First name"
    />
  </v-form>
</template>

<script setup lang="ts">
import { AddPatientProps } from '../../common/props';

defineProps<AddPatientProps>();
</script>

<script lang="ts">
export default {
  data() {
    return {
      firstName: '',
      lastName: '',
    };
  },
}
</script>
