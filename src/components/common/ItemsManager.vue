<template>
  <v-card class="ma-12">
  <v-data-table
    :headers="table.header"
    :items="table.rows"
    :sort-by="[{ key: 'date_added', order: 'desc' }]"
    class="elevation-1"
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title align="left">
          {{ title }}
        </v-toolbar-title>
      </v-toolbar>
    </template>
      <template #item.actions="{ item }">
      <v-icon
        size="small"
        class="me-2"
        @click="console.log('edit')"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        size="small"
        @click="console.log('delete')"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="console.log('initialize')"
      >
        Reset
      </v-btn>
    </template>
  </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
// import ItemsList from './ItemsList.vue';
import { ItemsManagerProps } from '../../common/props';

defineProps<ItemsManagerProps>();
</script>
