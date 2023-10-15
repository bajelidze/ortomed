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
            :rules="selectedWeekdaysRules"
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
            :items="hours"
          />
        </v-col>
        <v-col cols="2">
          <v-autocomplete
            v-model="selectedStartMinutes"
            density="compact"
            label="Minutes"
            :items="minutes"
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
            :items="hours"
          />
        </v-col>
        <v-col cols="2">
          <v-autocomplete
            v-model="selectedEndMinutes"
            density="compact"
            label="Minutes"
            :items="minutes"
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
import { SubmitFormProps } from '../../../../../common/props';
import { Availability } from '../../../../../common/events';
import { WeekdayInterval } from '../../../../../../common/interfaces';
import { readFile } from '../../../../../common/locale';
import { useSettingsStore } from '../../../../../store/settings';
import { WEEKDAY_MAP } from '../../../../../../common/consts';
import { WeekdayStr } from 'rrule';

const settings = await useSettingsStore().get();
const locale = await readFile(settings.locale);

const emit = defineEmits<{
  (e: typeof Availability.ADD_AVAILABILITY_SUBMIT, fields: WeekdayInterval): void;
}>();

defineProps<SubmitFormProps>();

const selectedWeekdaysRules = computed(() => ([
  selectedWeekdays.value.length > 0,
]));

function submit() {
// const weekdayInterval: WeekdayInterval[] = { 
//   weekday: selectedWeekdays.value,
// };

  emit(Availability.ADD_AVAILABILITY_SUBMIT, [] as WeekdayInterval[]);
}

const selectedWeekdays = ref([] as WeekdayStr[]);
const selectedStartHours = ref('9');
const selectedStartMinutes = ref('00');
const selectedEndHours = ref('18');
const selectedEndMinutes = ref('00');

// Constants.
//
const hours: string[] = [];

for (let i = 1; i <= 24; i++) {
  let iStr = i.toString();
  if (i < 10) {
    iStr = '0' + iStr;
  }

  hours.push(iStr);
}

const minutes: string[] = [];

for (let i = 0; i < 60; i++) {
  let iStr = i.toString();
  if (i < 10) {
    iStr = '0' + iStr;
  }

  minutes.push(iStr);
}
</script>
