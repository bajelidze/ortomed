<template>
  <v-btn flat color="blue">
    {{ text }}
  </v-btn>
</template>

<script setup lang="ts">
interface Props {
  text: string,
}

defineProps<Props>();
</script>
