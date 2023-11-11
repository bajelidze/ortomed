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
      :rules="nameRules"
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
              :items="[]"
            >
              <template #body>
                <AddAvailability
                  :form-id="availabilityFormID"
                  :submit-loading="submitLoading"
                  @add-availability-submit="addAvailabilitySubmit"
                />
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
                <p>Form body!</p>
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
    color="error"
  />
  </v-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
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

const name = ref('');
const availabilityFormID = 'availabilityForm';

const settings = await useSettingsStore().get();
const locale = await readFile(settings.locale);

const nameMaxLength = 50;

const nameRules = computed(() => [
  name.value.length > 0 || 'The name must not be empty',
  name.value.length <= nameMaxLength || `The name length must be less than or equal ${nameMaxLength}`,
]);

defineEmits<{
  (e: typeof Doctor.ADD_DOCTOR_SUBMIT, fields: AddDoctorFields): void;
}>();

defineProps<SubmitFormProps>();

const availabilities = ref([] as Schedule[]);

const showAvailabilityDialog = ref(false);
const showHolidayDialog = ref(false);
const submitLoading = ref(false);
const showAvailabilityError = ref(false);

const showAvailabilityErrorMsg = ref('');

function validateEndGreaterThanStart(availability: WeekdayInterval): boolean {
  return availability.interval.start < availability.interval.end;
}

function validateOverlap(av: WeekdayInterval, newAv: WeekdayInterval): boolean {
  return av.interval.end <= newAv.interval.start || av.interval.start > newAv.interval.end;
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
        return `Intervals overlap: ${formatInterval(av.interval)}, ${formatInterval(newAv.interval)}`;
      }
    }
  }

  return 'passed xdd';
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

  // emit(Doctor.ADD_DOCTOR_SUBMIT, { name.value, schedule: { 'FR': { start: 123, end: 333 } } });
}

function addAvailabilitySubmit(newAvailabilities: WeekdayInterval[]) {
  const validateResult = validateAvailabilities(newAvailabilities);
  if (typeof validateResult === 'string') {
    showAvailabilityErrorMsg.value = validateResult;
    showAvailabilityError.value = true;
    return;
  }

  console.log(JSON.stringify(newAvailabilities));
  // submitLoading.value = !submitLoading.value;
}
</script>