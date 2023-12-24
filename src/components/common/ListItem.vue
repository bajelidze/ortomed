<template>
  <v-row no-gutters>
    <v-col cols="auto">
      <v-row align="center" no-gutters>
        <v-col cols="auto">
          <v-icon class="ml-5">{{ icon }}</v-icon>
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
    <v-col cols="auto" class="mt-3 mr-5">
      <v-btn flat icon="mdi-trash-can"/>
    </v-col>
  </v-row>
  <v-divider/>
</template>

<script setup lang="ts">
import { ListItemProps } from '../../common/props';

defineProps<ListItemProps>();
</script>
