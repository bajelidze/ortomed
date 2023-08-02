<template>
  <v-card class="ma-12">
  <v-data-table
    :headers="table.header"
    :items="table.rows"
    :sort-by="[{ key: 'date_added', order: 'desc' }]"
    class="elevation-1"
    align="center"
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title align="left">
          {{ title }}
        </v-toolbar-title>
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
import { ItemsManagerProps } from '../../common/props';

defineProps<ItemsManagerProps>();
</script>
