<template>
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
        <Suspense>
          <template #default>
            <router-view />
          </template>
          <template #fallback>
            Loading...
          </template>
        </Suspense>
      </v-main>
</template>

<script setup lang="ts">
</script>
