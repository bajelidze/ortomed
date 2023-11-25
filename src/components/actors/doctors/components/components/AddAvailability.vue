<template>
  <v-form
    :id="formId"
    fast-fail
    @submit.prevent="submit"
  >
    <v-container>
      <v-row>
        <v-col
          v-for="(weekday, field) in locale.weekday"
          :key="field"
          class="pa-0"
        >
          <v-checkbox
            v-model="selectedWeekdays"
            :label="weekday"
            :value="WEEKDAY_MAP[field]"
            :disabled="submitLoading"
            :rules="field == 'MONDAY' ? selectedWeekdaysRules : undefined"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="2"/>
        <v-col cols="2">
          <v-autocomplete
            v-model="selectedStartHours"
            density="compact"
            label="Hours"
            :disabled="submitLoading"
            :items="HOURS"
            :rules="selectedStartHoursRules"
          />
        </v-col>
        <v-col cols="2">
          <v-autocomplete
            v-model="selectedStartMinutes"
            density="compact"
            label="Minutes"
            :disabled="submitLoading"
            :items="MINUTES"
            :rules="selectedStartMinutesRules"
          />
        </v-col>

        <v-col cols="auto" lass="pa-0">
          <p class="pt-2">
            —
          </p>
        </v-col>

        <v-col cols="2">
          <v-autocomplete
            v-model="selectedEndHours"
            density="compact"
            label="Hours"
            :disabled="submitLoading"
            :items="HOURS"
            :rules="selectedEndHoursRules"
          />
        </v-col>
        <v-col cols="2">
          <v-autocomplete
            v-model="selectedEndMinutes"
            density="compact"
            label="Minutes"
            :disabled="submitLoading"
            :items="MINUTES"
            :rules="selectedEndMinutesRules"
          />
        </v-col>
      </v-row>

      <v-row>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { WeekdayStr } from 'rrule';
import { SubmitFormProps } from '../../../../../common/props';
import { Availability } from '../../../../../common/events';
import { WeekdayInterval } from '../../../../../../common/interfaces';
import { readFile } from '../../../../../common/locale';
import { useSettingsStore } from '../../../../../store/settings';
import { WEEKDAY_MAP, HOURS, MINUTES } from '../../../../../../common/consts';
import { numericRules } from '../../../../../common/rules';

const settings = await useSettingsStore().get();
const locale = await readFile(settings.locale);

const emit = defineEmits<{
  (e: typeof Availability.ADD_AVAILABILITY_SUBMIT, fields: WeekdayInterval[]): void;
}>();

defineProps<SubmitFormProps>();

const selectedWeekdays = ref([] as WeekdayStr[]);
const selectedStartHours = ref('09');
const selectedStartMinutes = ref('00');
const selectedEndHours = ref('18');
const selectedEndMinutes = ref('00');

const selectedWeekdaysRules = computed(() => ([
  selectedWeekdays.value.length > 0 || 'Select at least one weekday',
]));
const selectedStartHoursRules = computed(() => numericRules(selectedStartHours.value, 0, 24));
const selectedStartMinutesRules = computed(() => numericRules(selectedStartMinutes.value, 0, 60));
const selectedEndHoursRules = computed(() => numericRules(selectedEndHours.value, 0, 24));
const selectedEndMinutesRules = computed(() => numericRules(selectedEndMinutes.value, 0, 60));

function validate(): boolean {
  for (const validators of [
    selectedWeekdaysRules.value,
    selectedStartHoursRules.value,
    selectedStartMinutesRules.value,
    selectedEndHoursRules.value,
    selectedEndMinutesRules.value,
  ]) {
    for (const validator of validators) {
      if (typeof validator === 'string' || !validator) {
        return false;
      }
    }
  }

  return true;
}

function submit() {
  if (!validate()) {
    return;
  }

  const toSeconds = (hours: string, minutes: string): number => {
    return +hours * 60 * 60 + +minutes * 60;
  };

  const start = toSeconds(selectedStartHours.value, selectedStartMinutes.value);
  const end = toSeconds(selectedEndHours.value, selectedEndMinutes.value);

  const weekdayInterval: WeekdayInterval[] = selectedWeekdays.value.map(
    (weekday: WeekdayStr): WeekdayInterval => ({
      weekday,
      interval: {
        start,
        end,
      },
    }),
  );

  emit(Availability.ADD_AVAILABILITY_SUBMIT, weekdayInterval);
}
</script>
