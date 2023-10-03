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
            <v-toolbar>
              <v-toolbar-title>
                {{ locale.availability.WEEKLY_SCHEDULE }}
              </v-toolbar-title>

              <v-spacer/>

              <v-dialog
                scrollable
                width="1024"
              >
                <template #activator="{ props }">
                  <v-btn
                    size="small"
                    color="green"
                    variant="flat"
                    icon="mdi-plus"
                    v-bind="props"
                  >
                  </v-btn>
                </template>

                <v-card>
                  hello
                </v-card>
              </v-dialog>
            </v-toolbar>

            <v-divider/>
            <MutableList />
          </v-card>
        </v-col>

        <v-col>
          <v-card>
            <ItemsListManager
              v-model="showHolidayDialog"
              :title="locale.holidays.HOLIDAYS"
              add-item-title="Add Holiday"
              form-id="123"
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
import MutableList from './components/MutableList.vue';
import { SubmitFormProps } from '../../../../common/props';
import { Doctor } from '../../../../common/events';
import { AddDoctorFields } from '../../../../../common/fields';
import { readFile } from '../../../../common/locale';
import { useSettingsStore } from '../../../../store/settings';
import ItemsListManager from '../../../common/ItemsListManager.vue';

const name = ref('');

const settings = await useSettingsStore().get();
const locale = await readFile(settings.locale);

const emit = defineEmits<{
  (e: typeof Doctor.ADD_DOCTOR_SUBMIT, fields: AddDoctorFields): void;
}>();

defineProps<SubmitFormProps>();

const showHolidayDialog = ref(false);

function submit() {
  emit(Doctor.ADD_DOCTOR_SUBMIT, { name: name.value, schedule: { 'FR': { start: 123, end: 333 } } });
}
</script>
