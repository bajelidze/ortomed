<template>
  <v-card
    class="ma-0 sticky-tabs"
    flat
  >
    <v-container fluid class="pa-2">
      <v-row>
        <v-col cols="auto">
          <v-tabs
              v-model="tab"
              color="blue"
           >
             <v-tab :value="1"><v-icon start icon="mdi-calendar"/>Calendar</v-tab>
          </v-tabs>
        </v-col>
        <v-spacer/>
        <v-col cols="auto">
          <v-btn
            prepend-icon="mdi-plus"
            class="mt-2 mr-1"
            color="green"
            flat
            @click="showDialog(true)"
          >
            Schedule
          </v-btn>

          <AddDialog
            v-model="showAddScheduleDialog"
            add-item-title="Add Schedule"
            :form-id="schedulerAddFormID"
            :submit-loading="submitLoading"
            :show-indicates-required-field="true"
          >
            <AddSchedule
              :form-id="schedulerAddFormID"
              :show-indicates-required-field="true"
              :submit-loading="submitLoading"
            />
          </AddDialog>
        </v-col>
      </v-row>
    </v-container>
    <v-divider/>
  </v-card>
  <ScheduleXCalendar />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AddDialog from '../common/AddDialog.vue';
import ScheduleXCalendar from './components/ScheduleXCalendar.vue';
import AddSchedule from './components/AddSchedule.vue';
const tab = ref(null);

const schedulerAddFormID = 'availabilityForm';

const showAddScheduleDialog = ref(false);
const submitLoading = ref(false);

function showDialog(show: boolean) {
  showAddScheduleDialog.value = show;
}
</script>

<style>
.sticky-tabs {
  position: -webkit-sticky; /* For Safari */
  position: sticky;
  top: 0;
  z-index: 100;
}
</style>

