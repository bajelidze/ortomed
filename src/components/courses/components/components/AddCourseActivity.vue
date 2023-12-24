<template>
  <v-form
    :id="formId"
    fast-fail
    @submit.prevent="submit"
  >
    <v-container class="margin: initial;">
      <v-autocomplete
        v-model="pauseHours"
        density="compact"
        label="Hours"
        :disabled="submitLoading"
        :items="HOURS"
        :rules="pauseHoursRules"
      />

      <v-autocomplete
        v-model="pauseMinutes"
        density="compact"
        label="Minutes"
        :disabled="submitLoading"
        :items="MINUTES"
        :rules="pauseMinutesRules"
      />
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { SubmitFormProps } from '../../../../common/props';
import { CourseActivity } from '../../../../../common/interfaces';
import { CourseActivity as CourseActivityE } from '../../../../common/events';
import { HOURS, MINUTES } from '../../../../../common/consts';
import { numericRules } from '../../../../common/rules';
import { toSeconds } from '../../../../common/util';

const pauseHours = ref('');
const pauseMinutes = ref('');

const pauseHoursRules = computed(() => numericRules(pauseHours.value, 0, 24));
const pauseMinutesRules = computed(() => numericRules(pauseMinutes.value, 0, 60));

const emit = defineEmits<{
  (e: typeof CourseActivityE.ADD_COURSE_ACTIVITY_SUBMIT, fields: CourseActivity): void;
}>();

defineProps<SubmitFormProps>();

function validate(): boolean {
  return true;
//  for (const validators of [
//    
//  ]) {
//    for (const validator of validators) {
//      if (typeof validator === 'string' || !validator) {
//        return false;
//      }
//    }
//  }
//
//  return true;
}

function submit() {
  if (!validate()) {
    return;
  }

  const courseActivity: CourseActivity = {
    pause: toSeconds(pauseHours.value, pauseMinutes.value),
  };

  emit(CourseActivityE.ADD_COURSE_ACTIVITY_SUBMIT, courseActivity);
}
</script>
