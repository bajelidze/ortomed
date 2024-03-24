<template>
  <v-form
    :id="formId"
    fast-fail
    @submit.prevent="submit"
  >
    <v-container>
      <v-row>
        <v-col cols="5">
          <div class="mb-3" id="schedule-date-picker"/>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6">
          <CardItem
            title="Patient"
            icon="mdi-account"
          >
            <v-row>
              <v-col cols="1"/>
              <v-col cols="5">
                <v-autocomplete
                  v-model="patient"
                  density="compact"
                  label="Patient*"
                  :disabled="submitLoading"
                  :items="patientItems"
                  :rules="patientRules"
                />
              </v-col>
            </v-row>
          </CardItem>
        </v-col>

        <v-col cols="6">
          <CardItem
            title="Doctor"
            icon="mdi-medical-bag"
          >
            <v-row>
              <v-col cols="1"/>
              <v-col cols="5">
                <v-autocomplete
                  v-model="doctor"
                  density="compact"
                  label="Doctor*"
                  :disabled="submitLoading"
                  :items="doctorItems"
                  :rules="doctorRules"
                />
              </v-col>
            </v-row>
          </CardItem>
        </v-col>

        <v-col cols="6" class="mb-12">
          <CardItem
            title="Course"
            icon="mdi-list-box"
          >
            <v-row>
              <v-col cols="1"/>
              <v-col cols="5">
                <v-autocomplete
                  v-model="course"
                  density="compact"
                  label="Course*"
                  :disabled="submitLoading"
                  :items="courseItems"
                  :rules="courseRules"
                />
              </v-col>
            </v-row>
          </CardItem>
        </v-col>
      </v-row>

    </v-container>

    <MsgSnackbar
      v-model="showScheduleError"
      :msg="showScheduleErrorMsg"
      :timeout="3000"
      icon="mdi-alert-circle-outline"
      color="error"
    />
  </v-form>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { DateTime } from 'luxon';
import MsgSnackbar from '../../common/MsgSnackbar.vue';
import CardItem from '../../common/CardItem.vue';
import { SubmitFormProps } from '../../../common/props';
import { Scheduler } from '../../../common/events';
import { AddScheduleFields } from '../../../../common/fields';
import {
  FormattedPatient, FormattedDoctor, FormattedCourse,
} from '../../../../common/interfaces';
import { createDatePicker } from '@schedule-x/date-picker';
import { autocompleteRules } from '../../../common/rules';
import '@schedule-x/theme-default/dist/date-picker.css';

const patients = await window.api.patients.listAll();

const patientItems = patients.map(patient => ({
  title: patient.name + ' (' + patient.id + ')',
  value: patient,
}));

const doctors = await window.api.doctors.listAll();

const doctorItems = doctors.map(doctor => ({
  title: doctor.name + ' (' + doctor.id + ')',
  value: doctor,
}));

const courses = await window.api.courses.listAll();

const courseItems = courses.map(course => ({
  title: course.name + ' (' + course.id + ')',
  value: course,
}));

// Contains: "$name ($id)"
const patient = ref<FormattedPatient|null>(null);
const doctor = ref<FormattedDoctor|null>(null);
const course = ref<FormattedCourse|null>(null);
const startDate = ref('');

const patientRules = computed(() => autocompleteRules(patient.value));
const doctorRules = computed(() => autocompleteRules(doctor.value));
const courseRules = computed(() => autocompleteRules(course.value));

const emit = defineEmits<{
 (e: typeof Scheduler.ADD_SCHEDULE_SUBMIT, fields: AddScheduleFields): void;
}>();

defineProps<SubmitFormProps>();

const showScheduleError = ref(false);
const showScheduleErrorMsg = ref('');

onMounted(() => {
  const dp = document.getElementById('schedule-date-picker');
  if (dp == null) {
    throw Error('date-picker null');
  }

  createDatePicker({
    min: new Date().toISOString().split('T')[0],
    locale: 'en-GB',
    listeners: {
      onChange: date => startDate.value = date,
    },
  }).render(dp);
});

function validate(): boolean {
  for (const validators of [
    patientRules.value,
    doctorRules.value,
    courseRules.value,
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

  if (doctor.value == null || doctor.value.id == undefined) {
    throw Error('doctor is null');
  } else if (patient.value == null || patient.value.id == undefined) {
    throw Error('patient is null');
  } else if (course.value == null || course.value.id == undefined) {
    throw Error('course is null');
  }

  const now = DateTime.now();
  let startTime = DateTime.fromISO(startDate.value);

  startTime = startTime.set({
    hour: now.hour,
    minute: now.minute,
    second: now.second,
    millisecond: now.millisecond,
  });

  const startTimeISO = startTime.toISO();
  if (startTimeISO == null) {
    throw Error('startTimeISO is null');
  }

  const schedule: AddScheduleFields = {
    patientId: +patient.value.id,
    doctorId: +doctor.value.id,
    courseId: +course.value.id,
    startTime: startTimeISO,
  };

  emit(Scheduler.ADD_SCHEDULE_SUBMIT, schedule);
}
</script>
