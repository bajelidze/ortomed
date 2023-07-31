<template>
  <v-container>
    <v-row>
      <v-col align="left">
        <v-card-title class="text-h4">
          {{ title }}
        </v-card-title>
      </v-col>
      <v-spacer></v-spacer>
      <v-col v-if="addButton" align="right">
        <TextButton
          append-icon="mdi-plus"
          class="mt-3"
          @click="$emit(Events.ADD_ITEM_CLICKED)"
        >
          Add
          <slot name="addBtn"></slot>
        </TextButton>
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
import TextButton from './TextButton.vue';
import { ItemsManagerProps } from '../../common/props';
import { Events } from '../../common/events';

defineProps<ItemsManagerProps>();
defineEmits([Events.ADD_ITEM_CLICKED]);
</script>
