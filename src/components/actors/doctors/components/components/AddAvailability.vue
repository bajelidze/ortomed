<template>
  <v-form
    :id="formId"
    fast-fail
    @submit.prevent="submit"
  >
    <v-container>
      <v-row>
        <v-col
          v-for="weekday in locale.weekday"
          :key="weekday"
          class="pa-0"
        >
          <v-checkbox
            v-model="selected"
            :label="weekday"
            :value="weekday"
            :disabled="submitLoading"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="2"/>
        <v-col cols="2">
          <v-autocomplete
            density="compact"
            label="Hours"
            :items="hours"
          />
        </v-col>
        <v-col cols="2">
          <v-autocomplete
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
            density="compact"
            label="Hours"
            :items="hours"
          />
        </v-col>
        <v-col cols="2">
          <v-autocomplete
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
import { ref } from 'vue';
import { SubmitFormProps } from '../../../../../common/props';
import { Availability } from '../../../../../common/events';
import { AddPatientFields } from '../../../../../../common/fields';
import { readFile } from '../../../../../common/locale';
import { useSettingsStore } from '../../../../../store/settings';

const name = ref('');

const settings = await useSettingsStore().get();
const locale = await readFile(settings.locale);

const emit = defineEmits<{
  (e: typeof Availability.ADD_AVAILABILITY_SUBMIT, fields: AddPatientFields): void;
}>();

defineProps<SubmitFormProps>();

function submit() {
  emit(Availability.ADD_AVAILABILITY_SUBMIT, { name: name.value });
}

const selected = ref([]);

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
