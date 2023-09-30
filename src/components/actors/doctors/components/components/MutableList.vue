<template>
 <v-virtual-scroll
    :items="weekdays"
    height="320"
    item-height="48"
    class="scrollable"
  >
    <template #default="{ item }">
      <v-list-item
          :title="item"
          :subtitle="`${item}`"
        >
          <template v-slot:prepend>
            <v-icon>mdi-calendar-clock</v-icon>
          </template>

          <template v-slot:append>
            <v-btn
              icon="mdi-trash-can"
              size="x-small"
              variant="tonal"
            ></v-btn>
          </template>
      </v-list-item>
    </template>
 </v-virtual-scroll>
</template>

<script setup lang="ts">
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
