<template>
  <v-row no-gutters>
    <v-col cols="auto">
      <v-row align="center" no-gutters>
        <v-col cols="auto">
          <v-icon :color="iconColor" class="ml-5">{{ icon }}</v-icon>
        </v-col>
        <v-col cols="auto">
          <v-card
            elevation="0"
            :title="title"
            :subtitle="subtitle"
          />
        </v-col>
      </v-row>
    </v-col>
    <v-spacer/>
    <slot name="actions"/>
  </v-row>
  <v-divider/>
</template>

<script setup lang="ts">
import { ListItemProps } from '../../common/props';

withDefaults(
  defineProps<ListItemProps>(),
  {
    iconColor: 'gray',
  },
);
</script>
