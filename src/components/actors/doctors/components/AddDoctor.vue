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
      :maxlength="nameMaxLength"
    />

    <v-container>
      <v-row>
        <v-col>
          <v-card>
            <ItemsListManager
              v-model="showAvailabilityDialog"
              :title="locale.availability.WEEKLY_SCHEDULE"
              :add-item-title="locale.availability.ADD_AVAILABILITY"
              :form-id="availabilityFormID"
              :submit-loading="submitLoading"
              :show-indicates-required-field="false"
              :items="availabilities"
            >
              <template #body>
                <AddAvailability
                  :form-id="availabilityFormID"
                  :submit-loading="availabilitySubmitLoading"
                  @add-availability-submit="addAvailabilitySubmit"
                />
              </template>
              <template #listItem="{ item }: { item: Schedule }">
                <v-row no-gutters>
                  <v-col cols="auto">
                    <v-card
                      prepend-icon="mdi-calendar-clock"
                      elevation="0"
                      :title="formatInterval(item.interval)"
                      :subtitle="weekdayToLocale(item.weekday)"
                    />
                  </v-col>
                  <v-spacer/>
                  <v-col cols="auto" class="mt-3 mr-5">
                    <v-btn flat icon="mdi-trash-can"/>
                  </v-col>
                </v-row>
                <v-divider/>
              </template>
            </ItemsListManager>
          </v-card>
        </v-col>

        <v-col>
          <v-card>
            <ItemsListManager
              v-model="showHolidayDialog"
              :title="locale.holidays.HOLIDAYS"
              :add-item-title="locale.holidays.ADD_HOLIDAY"
              form-id="123"
              :submit-loading="submitLoading"
              :show-indicates-required-field="false"
              :items="[]"
            >
              <template #body>
                <p>Not implemented</p>
              </template>
            </ItemsListManager>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <MsgSnackbar
      v-model="showAvailabilityError"
      :msg="showAvailabilityErrorMsg"
      :timeout="3000"
      icon="mdi-alert-circle-outline"
      color="error"
    />
  </v-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { WeekdayStr } from 'rrule';
import { SubmitFormProps } from '../../../../common/props';
import { WeekdayInterval, Schedule } from '../../../../../common/interfaces';
import { formatInterval } from '../../../../../common/utils/format';
import { Doctor } from '../../../../common/events';
import { AddDoctorFields } from '../../../../../common/fields';
import { readFile } from '../../../../common/locale';
import { useSettingsStore } from '../../../../store/settings';
import ItemsListManager from '../../../common/ItemsListManager.vue';
import AddAvailability from './components/AddAvailability.vue';
import MsgSnackbar from '../../../common/MsgSnackbar.vue';
import { ALL_WEEKDAYS, WEEKDAY_MAP_REV } from '../../../../../common/consts';
import { nameRules as _nameRules } from '../../../../common/rules';

const name = ref('');
const availabilityFormID = 'availabilityForm';

const settings = await useSettingsStore().get();
const locale = await readFile(settings.locale);

const nameMaxLength = 50;

const nameRules = computed(() => _nameRules(name.value, nameMaxLength));

const emit = defineEmits<{
  (e: typeof Doctor.ADD_DOCTOR_SUBMIT, fields: AddDoctorFields): void;
}>();

defineProps<SubmitFormProps>();

const availabilities = ref([] as Schedule[]);

const showAvailabilityDialog = ref(false);
const showHolidayDialog = ref(false);
const submitLoading = ref(false);
const availabilitySubmitLoading = ref(false);
const showAvailabilityError = ref(false);

const showAvailabilityErrorMsg = ref('');

function weekdayToLocale(weekday: WeekdayStr): string {
  //@ts-ignore
  return locale.weekday[WEEKDAY_MAP_REV[weekday]];
}

function pushAvailabilities(...newAvailabilities: Schedule[]) {
  availabilities.value.push(...newAvailabilities);
  availabilities.value.sort((curr, next) => {
    const currWeekdayIdx = ALL_WEEKDAYS.indexOf(curr.weekday);
    const nextWeekdayIdx = ALL_WEEKDAYS.indexOf(next.weekday);
    return (currWeekdayIdx === nextWeekdayIdx && curr.interval.start < next.interval.start) || currWeekdayIdx < nextWeekdayIdx ? -1 : 1;
  });
}

function validateEndGreaterThanStart(availability: WeekdayInterval): boolean {
  return availability.interval.start < availability.interval.end;
}

function validateOverlap(av: WeekdayInterval, newAv: WeekdayInterval): boolean {
  return av.interval.end <= newAv.interval.start || av.interval.start >= newAv.interval.end;
}

function validateAvailabilities(newAvailabilities: WeekdayInterval[]): boolean|string {
  const mergedAvailabilities: Schedule[] = [];
  availabilities.value.forEach(av => mergedAvailabilities.push(Object.assign({}, av)));

  for (const newAv of newAvailabilities) {
    if (!validateEndGreaterThanStart(newAv)) {
      return `Start time must be earlier than end time: ${formatInterval(newAv.interval)}`;
    }

    for (const av of mergedAvailabilities) {
      if (av.weekday !== newAv.weekday) {
        continue;
      }

      // Check overlap. Reject overlapping intervals.
      if (!validateOverlap(av, newAv)) {
        //@ts-ignore
        return `Intervals overlap: ${weekdayToLocale(av.weekday)}: ${formatInterval(av.interval)}, ${formatInterval(newAv.interval)}`;
      }
    }
  }

  return true;
}

function validate(): boolean {
  for (const validator of nameRules.value) {
    if (typeof validator === 'string') {
      return false;
    }
  }

  return true;
}

function submit() {
  if (!validate()) {
    return;
  }

  emit(Doctor.ADD_DOCTOR_SUBMIT, { name: name.value, schedule: availabilities.value });
}

function addAvailabilitySubmit(newAvailabilities: WeekdayInterval[]) {
  availabilitySubmitLoading.value = true;

  try {
    const validateResult = validateAvailabilities(newAvailabilities);
    if (typeof validateResult === 'string') {
      showAvailabilityErrorMsg.value = validateResult;
      showAvailabilityError.value = true;
      return;
    }

    pushAvailabilities(...newAvailabilities);

    showAvailabilityDialog.value = false;
  } finally {
    availabilitySubmitLoading.value = false;
  }
}
</script>
