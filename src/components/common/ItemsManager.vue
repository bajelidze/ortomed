<template>
  <v-container>
    <v-row>
      <v-col align="left">
        <v-card-title class="text-h4">
          {{ title }}
        </v-card-title>
      </v-col>
      <v-spacer/>
      <v-col v-if="addButton" align="right">
        <slot name="addBtn"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <ItemsList :table="table" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import ItemsList from './ItemsList.vue';
import { ItemsManagerProps } from '../../common/props';

defineProps<ItemsManagerProps>();
</script>
