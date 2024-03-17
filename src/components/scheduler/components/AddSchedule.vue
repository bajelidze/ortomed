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
                  :items="patientsNames"
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
                  :items="doctorNames"
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
                  :items="courseNames"
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
import { ref, onMounted } from 'vue';
import MsgSnackbar from '../../common/MsgSnackbar.vue';
import CardItem from '../../common/CardItem.vue';
import { SubmitFormProps } from '../../../common/props';
import { Scheduler } from '../../../common/events';
import { createDatePicker } from '@schedule-x/date-picker';
import '@schedule-x/theme-default/dist/date-picker.css';

const patients = await window.api.patients.listAll();
const patientsNames = patients.map(patient => patient.name + ' (' + patient.id + ')');

const doctors = await window.api.doctors.listAll();
const doctorNames = doctors.map(doctor => doctor.name + ' (' + doctor.id + ')');

const courses = await window.api.courses.listAll();
const courseNames = courses.map(course => course.name + ' (' + course.id + ')');

// Contains: "$name ($id)"
const patient = ref('');
const doctor = ref('');
const course = ref('');
const startDate = ref('');

const emit = defineEmits<{
 (e: typeof Scheduler.ADD_SCHEDULE_SUBMIT, fields: any): void;
}>();

defineProps<SubmitFormProps>();

const showScheduleError = ref(false);
const showScheduleErrorMsg = ref('');

onMounted(() => {
  const dp = document.getElementById('schedule-date-picker');
  if (dp == null) {
    throw Error('date-picker null');
  }

  const datePicker = createDatePicker({
    min: '2024-03-17',
    locale: 'en-GB',
    listeners: {
      onChange: date => {
        startDate.value = date;
      },
    },
  });
  datePicker.render(dp);
});

function submit() {
  // if (!validate()) {
  //   return;
  // }

  emit(Scheduler.ADD_SCHEDULE_SUBMIT, { });
}
</script>
