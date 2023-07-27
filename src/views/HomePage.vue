<template>
  <v-card>
      <v-navigation-drawer
        expand-on-hover
        rail
        permanent
      >
        <v-list density="compact" nav>
          <router-link to="/patients">
            <v-list-item prepend-icon="mdi-account" title="Patients" value="patients"></v-list-item>
          </router-link>
          <router-link to="/doctors">
            <v-list-item prepend-icon="mdi-medical-bag" title="Doctors" value="doctors"></v-list-item>
          </router-link>
          <v-list-item prepend-icon="mdi-star" title="Starred" value="starred"></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <router-view />
      </v-main>
  </v-card>
</template>

<script setup lang="ts">
</script>
