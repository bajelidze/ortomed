<template>
  <v-card
    class="pb-2"
    density="compact"
  >
    <v-tooltip
      v-if="tooltipText"
      :text="tooltipText"
      :location="tooltipLocation as any"
    >
      <template #activator="{ props }">
        <v-card-title class="mb-2" v-bind="props">
          <v-icon size="21" class="mb-1">{{ icon }}</v-icon>
          {{ title }}
        </v-card-title>
      </template>
    </v-tooltip>

    <v-card-title class="mb-2" v-else>
      <v-icon size="21" class="mb-1">{{ icon }}</v-icon>
      {{ title }}
    </v-card-title>
    <slot/>
  </v-card>
</template>

<script setup lang="ts">
import { CardItemProps } from '../../common/props';

withDefaults(
  defineProps<CardItemProps>(),
  {
    tooltipText: '',
    tooltipLocation: 'top',
  },
);
</script>
