<template>
  <v-card>
    <v-layout>
      <v-app-bar
        color="white"
        density="compact"
      >
        <v-btn icon="mdi-home" />

        <v-tabs
          color="grey-darken-2"
        >
          <v-tab
            v-for="link in links"
            :key="link"
          >
            {{ link }}
          </v-tab>
        </v-tabs>

        <v-spacer></v-spacer>

        <template v-slot:append>
          <v-btn icon="mdi-dots-vertical"></v-btn>
        </template>
      </v-app-bar>

      <v-main class="bg-grey-lighten-3">
        <v-container>
          Test123         <v-icon icon="md-home" />
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>

<script setup lang="ts">
const links = [
  'Dashboard',
  'Messages',
  'Profile',
  'Updates',
];
</script>
