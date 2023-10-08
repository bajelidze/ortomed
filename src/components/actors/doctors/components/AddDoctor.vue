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
  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SubmitFormProps } from '../../../../common/props';
import { Doctor } from '../../../../common/events';
import { AddDoctorFields } from '../../../../../common/fields';
import { readFile } from '../../../../common/locale';
import { useSettingsStore } from '../../../../store/settings';
import ItemsListManager from '../../../common/ItemsListManager.vue';
import AddAvailability from './components/AddAvailability.vue';

const name = ref('');
const availabilityFormID = 'availabilityForm';

const settings = await useSettingsStore().get();
const locale = await readFile(settings.locale);

const emit = defineEmits<{
  (e: typeof Doctor.ADD_DOCTOR_SUBMIT, fields: AddDoctorFields): void;
}>();

defineProps<SubmitFormProps>();

const showAvailabilityDialog = ref(false);
const showHolidayDialog = ref(false);
const submitLoading = ref(false);

function submit() {
  emit(Doctor.ADD_DOCTOR_SUBMIT, { name: name.value, schedule: { 'FR': { start: 123, end: 333 } } });
}
</script>
