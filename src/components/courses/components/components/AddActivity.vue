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
            class="pb-2"
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
            class="pb-2"
            density="compact"
          >
            <v-card-title>
              Capacity
              <v-tooltip :text="capacityTooltip" location="top">
                <template #activator="{ props }">
                  <v-icon v-bind="props" size="18">
                    mdi-information-slab-circle-outline
                  </v-icon>
                </template>
              </v-tooltip>
            </v-card-title>
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
                v-bind="props"
                color="success"
                label="Flexible 🛈"
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

const nameRules = computed(() => _nameRules(name.value, nameMaxLength));
const durationHoursRules = computed(() => numericRules(durationHours.value, 0, 60));
const durationMinutesRules = computed(() => numericRules(durationMinutes.value, 0, capacityMaxValue));
const capacityRules = computed(() => numericRules(capacity.value, 1, 100));

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

const capacityValues: string[] = [];

for (let i = 1; i < capacityMaxValue; i++) {
  let iStr = i.toString();
  capacityValues.push(iStr);
}
</script>
