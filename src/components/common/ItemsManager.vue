<template>
  <v-card class="ma-12">
  <v-data-table
    :headers="table.header"
    :items="table.rows"
    :sort-by="sortBy"
    class="elevation-1"
    align="center"
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title
          align="left">
          {{ title }}
        </v-toolbar-title>
        <v-spacer/>
        <v-btn 
          class="mr-3"
          color="green"
          variant="flat"
          append-icon="mdi-plus"
        >
          Add
          <AddDialog :title="addPatientTitle"/>
        </v-btn>
      </v-toolbar>
    </template>
    <template #item.actions="{ item }">
      <v-btn
        class="ml-n3"
        icon="mdi-pencil"
        variant="text"
        @click="console.log('edit')"
      />
      <v-btn
        icon="mdi-trash-can"
        variant="text"
        @click="console.log('delete')"
      />
    </template>
    <template v-slot:no-data>
      {{ noDataText }}
    </template>
  </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import AddDialog from './AddDialog.vue';
import { ItemsManagerProps } from '../../common/props';

defineProps<ItemsManagerProps>();
</script>
