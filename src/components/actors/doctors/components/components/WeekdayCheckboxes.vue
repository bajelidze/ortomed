<template>
  <v-container>
    <v-row v-for="wd in weekdays" :key="wd">
      <v-col class="pa-0" cols="2">
        <v-checkbox
          v-model="selected"
          class="ma-n3"
          :label="wd"
          :value="wd"
        />
      </v-col>
      <v-col class="pa-0">
        <v-row>
          <v-col class="pa-0 pr-3">
            <v-autocomplete
              density="compact"
              label="Hours"
              :items="hours"
            />
          </v-col>
          <v-col class="pa-0">
            <v-autocomplete
              density="compact"
              label="Minutes"
              :items="minutes"
            />
          </v-col>

          <v-col cols="auto" lass="pa-0">
            <p>
              —
            </p>
          </v-col>

          <v-col class="pa-0 pr-3">
            <v-autocomplete
              density="compact"
              label="Hours"
              :items="hours"
            />
          </v-col>
          <v-col class="pa-0">
            <v-autocomplete
              density="compact"
              label="Minutes"
              :items="minutes"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selected = ref([]);

const minutes: string[] = [];

for (let i = 0; i < 60; i++) {
  let iStr = i.toString();
  if (i < 10) {
    iStr = '0' + iStr;
  }

  minutes.push(iStr);
}

const hours: string[] = [];

for (let i = 1; i <= 24; i++) {
  let iStr = i.toString();
  if (i < 10) {
    iStr = '0' + iStr;
  }

  hours.push(iStr);
}

const weekdays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
</script>
