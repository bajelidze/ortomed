<template>
  <v-form
    :id="formId"
    fast-fail
    @submit.prevent="submit(activity)"
  >
    <v-row>
      <v-col cols="6">
        <CardItem
          title="Pause"
          icon="mdi-timer-pause-outline"
          :tooltip-text="pauseTooltip"
        >
          <v-row>
            <v-col cols="1"/>
            <v-col cols="4">
              <v-autocomplete
                v-model="pauseHours"
                density="compact"
                label="Hours"
                :disabled="submitLoading"
                :items="HOURS_TRUNC"
                :rules="pauseHoursRules"
              />
            </v-col>

            <v-col cols="4">
              <v-autocomplete
                v-model="pauseMinutes"
                density="compact"
                label="Minutes"
                :disabled="submitLoading"
                :items="MINUTES_TRUNC"
                :rules="pauseMinutesRules"
              />
            </v-col>
          </v-row>
        </CardItem>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { AddCourseActivityProps } from '../../../../common/props';
import { CourseActivity, Activity } from '../../../../../common/interfaces';
import { CourseActivity as CourseActivityE } from '../../../../common/events';
import { HOURS_TRUNC, MINUTES_TRUNC } from '../../../../../common/consts';
import { numericRules } from '../../../../common/rules';
import { toSeconds } from '../../../../common/util';
import CardItem from '../../../common/CardItem.vue';

const pauseTooltip = 'The minimum time before the next course activity in the series can be scheduled';

const pauseHours = ref('12');
const pauseMinutes = ref('0');

const pauseHoursRules = computed(() => numericRules(pauseHours.value, 0, 24));
const pauseMinutesRules = computed(() => numericRules(pauseMinutes.value, 0, 60));

const emit = defineEmits<{
  (e: typeof CourseActivityE.ADD_COURSE_ACTIVITY_SUBMIT, fields: CourseActivity): void;
}>();

defineProps<AddCourseActivityProps>();

function validate(): boolean {
  for (const validators of [
    pauseHoursRules.value,
    pauseMinutesRules.value,
  ]) {
    for (const validator of validators) {
      if (typeof validator === 'string' || !validator) {
        return false;
      }
    }
  }

  return true;
}

function submit(activity: Activity) {
  if (!validate()) {
    return;
  }

  const courseActivity: CourseActivity = {
    activityID: activity.id,
    activityName: activity.name,
    pause: toSeconds(pauseHours.value, pauseMinutes.value),
  };

  emit(CourseActivityE.ADD_COURSE_ACTIVITY_SUBMIT, courseActivity);
}
</script>
