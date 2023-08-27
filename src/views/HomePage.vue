<template>
  <v-navigation-drawer
    expand-on-hover
    rail
    permanent
  >
    <v-list density="compact" nav>
      <router-link to="/actors">
        <v-list-item prepend-icon="mdi-account" :title="locale.common.ACTORS" value="actors"/>
      </router-link>
      <router-link to="/courses">
        <v-list-item prepend-icon="mdi-medical-bag" :title="locale.courses.COURSES" value="courses"/>
      </router-link>
    </v-list>
  </v-navigation-drawer>

  <v-main>
    <Suspense>
      <template #default>
        <router-view />
      </template>
      <template #fallback>
        {{ locale.common.LOADING }}...
      </template>
    </Suspense>
  </v-main>
</template>

<script setup lang="ts">
import { readFile } from '../common/locale';
import { useSettingsStore } from '../store/settings';

const settings = await useSettingsStore().get();
const locale = await readFile(settings.locale);
</script>
