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
    />

    <v-textarea
      counter
      v-model="description"
      rows="3"
      label="Description"
      :disabled="submitLoading"
      :maxlength="descriptionMaxLength"
    />

    <v-container class="margin: initial;">
      <v-row>
        <v-col cols="6">
          <v-card
            class="pb-3"
            density="compact"
          >
            <v-card-title>Duration</v-card-title>
            <v-row>
              <v-col cols="1"/>
              <v-col cols="4">
                <v-autocomplete
                  v-model="durationHours"
                  density="compact"
                  label="Hours"
                  :disabled="submitLoading"
                  :items="HOURS"
                  :rules="durationHoursRules"
                />
              </v-col>

              <v-col cols="4">
                <v-autocomplete
                  v-model="durationMinutes"
                  density="compact"
                  label="Minutes"
                  :disabled="submitLoading"
                  :items="MINUTES"
                  :rules="durationMinutesRules"
                />
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card
            class="pb-3"
            density="compact"
          >
            <v-card-title>Capacity</v-card-title>
            <v-row>
              <v-col cols="1"/>
              <v-col cols="4">
                <v-autocomplete
                  v-model="durationMinutes"
                  density="compact"
                  label="Patients"
                  :disabled="submitLoading"
                  :items="MINUTES"
                  :rules="durationMinutesRules"
                />
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

  </v-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { SubmitFormProps } from '../../../../common/props';
import { Activity } from '../../../../../common/interfaces';
import { Activity as ActivityE } from '../../../../common/events';
import { HOURS, MINUTES } from '../../../../../common/consts';
import { readFile } from '../../../../common/locale';
import { useSettingsStore } from '../../../../store/settings';
import { numericRules, nameRules as _nameRules } from '../../../../common/rules';

const settings = await useSettingsStore().get();
const locale = await readFile(settings.locale);

const nameMaxLength = 50;
const descriptionMaxLength = 500;

const name = ref('');
const description = ref('');
const durationHours = ref('');
const durationMinutes = ref('');

const nameRules = computed(() => _nameRules(name.value, nameMaxLength));
const durationHoursRules = computed(() => numericRules(durationHours.value, 0, 60));
const durationMinutesRules = computed(() => numericRules(durationMinutes.value, 0, 60));

const emit = defineEmits<{
  // FIXME
  (e: typeof ActivityE.ADD_ACTIVITY_SUBMIT, fields: any[]): void;
}>();

defineProps<SubmitFormProps>();

function validate(): boolean {
  return true;
}

function submit() {
  if (!validate()) {
    return;
  }

  emit(ActivityE.ADD_ACTIVITY_SUBMIT, {} as any);
}
</script>
