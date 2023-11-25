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
            class="pb-2"
            density="compact"
          >
            <v-card-title>
              <v-icon size="21">mdi-clock-outline</v-icon>
              Duration
            </v-card-title>
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
            class="pb-2"
            density="compact"
          >
            <v-tooltip :text="capacityTooltip" location="left">
              <template #activator="{ props }">
                <v-card-title v-bind="props">
                  <v-icon size="21">mdi-account-multiple</v-icon>
                  Capacity
                </v-card-title>
              </template>
            </v-tooltip>
            <v-row>
              <v-col cols="1"/>
              <v-col cols="4">
                <v-autocomplete
                  v-model="capacity"
                  density="compact"
                  label="Patients"
                  :disabled="submitLoading"
                  :items="capacityValues"
                  :rules="capacityRules"
                />
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="3">
          <v-tooltip :text="flexibleTooltip" location="top">
            <template #activator="{ props }">
              <v-switch
                v-model="flexible"
                v-bind="props"
                color="success"
                label="Flexible"
              />
            </template>
          </v-tooltip>
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
import { toSeconds } from '../../../../common/util';

const settings = await useSettingsStore().get();
const locale = await readFile(settings.locale);

const nameMaxLength = 50;
const descriptionMaxLength = 500;
const capacityMaxValue = 100;
const capacityTooltip = 'How many patients can participate in the activity';
const flexibleTooltip = 'Whether the activity can be scheduled on the same day with other activity types';

const name = ref('');
const description = ref('');
const durationHours = ref('01');
const durationMinutes = ref('00');
const capacity = ref('1');
const flexible = ref(false);

const nameRules = computed(() => _nameRules(name.value, nameMaxLength));
const durationHoursRules = computed(() => numericRules(durationHours.value, 0, 60));
const durationMinutesRules = computed(() => numericRules(durationMinutes.value, 0, capacityMaxValue));
const capacityRules = computed(() => numericRules(capacity.value, 1, 100));

const emit = defineEmits<{
  (e: typeof ActivityE.ADD_ACTIVITY_SUBMIT, fields: Activity): void;
}>();

defineProps<SubmitFormProps>();

function validate(): boolean {
  for (const validators of [
    nameRules.value,
    durationHoursRules.value,
    durationMinutesRules.value,
    capacityRules.value,
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

  const activity: Activity = {
    name: name.value,
    description: description.value,
    duration: toSeconds(durationHours.value, durationMinutes.value),
    capacity: +capacity.value,
    flexible: flexible.value,
  };

  emit(ActivityE.ADD_ACTIVITY_SUBMIT, activity);
}

// Consts
//
const capacityValues: string[] = [];

for (let i = 1; i < capacityMaxValue; i++) {
  let iStr = i.toString();
  capacityValues.push(iStr);
}
</script>
