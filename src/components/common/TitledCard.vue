<template>
  <v-card-title>
    <v-icon size="21">{{ icon }}</v-icon>
    {{ title }}
  </v-card-title>
</template>

<script setup lang="ts">
import { TitledCardProps } from '../../common/props';
defineProps<TitledCardProps>();
</script>
