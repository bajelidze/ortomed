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
            color="primary"
          >
            <v-tab :value="1"><v-icon start icon="mdi-calendar"/>Calendar</v-tab>
            <v-tab :value="2"><v-icon start icon="mdi-table"/>Table</v-tab>
          </v-tabs>
        </v-col>
        <v-spacer/>
        <v-col cols="auto">
          <slot/>
        </v-col>
      </v-row>
    </v-container>
    <v-divider/>
  </v-card>
  <v-window v-model="tab">
    <v-window-item :value="1">
      <ScheduleXCalendar />
    </v-window-item>

    <v-window-item :value="2">
      <ItemsManager
        :sort-by="[{ key: 'date_added', order: Order.DESC }]"
        :table="table"
        :add-dialog="false"
        title="Sessions"
        :delete-disabled="true"
        no-data-text="No Sessions"
      />
    </v-window-item>
  </v-window>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import ScheduleXCalendar from './components/ScheduleXCalendar.vue';
import ItemsManager from '../../common/ItemsManager.vue';
import { Align, Order, Table } from '../../../common/interfaces';
import { readFile } from '../../../common/locale';
import { useSettingsStore } from '../../../store/settings';

const settings = await useSettingsStore().get();
const locale = await readFile(settings.locale);

const tab = ref(1);

const header = [];

const cols = {
  'ID': 'ID',
  'Name': locale.common.NAME,
  'Date Added': locale.common.DATE_ADDED,
};

for (const key in cols) {
  header.push({
    //@ts-ignore
    title: cols[key],
    key: key.toLowerCase().replace(' ', '_'),
    sortable: true,
    align: Align.START,
  });
}

const table = reactive({ header, rows: [] } as Table);
</script>

<style>
.sticky-tabs {
  position: sticky;
  top: 0;
  z-index: 100;
}
</style>
