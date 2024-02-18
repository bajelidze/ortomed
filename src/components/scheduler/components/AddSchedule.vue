<template>
  <v-form
    :id="formId"
    fast-fail
    @submit.prevent="submit"
  >
    <v-container>
      <v-row>
        <v-col>
          text
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
import { ref } from 'vue';
import MsgSnackbar from '../../common/MsgSnackbar.vue';
import { SubmitFormProps } from '../../../common/props';
import { Scheduler } from '../../../common/events';

const emit = defineEmits<{
  (e: typeof Scheduler.ADD_SCHEDULE_SUBMIT, fields: any): void;
}>();

defineProps<SubmitFormProps>();

const showScheduleError = ref(false);
const showScheduleErrorMsg = ref('');

function submit() {
  // if (!validate()) {
  //   return;
  // }

  emit(Scheduler.ADD_SCHEDULE_SUBMIT, { });
}
</script>
