<template>
  <ItemsList :title="'Cheli'" :table="table"/>
</template>

<script setup lang="ts">
import ItemsList from './ItemsList.vue';
import { Table } from '../common/interfaces';

const patients = await window.api.listPatients(10, 0);

const table: Table = {
  header: ['ID', 'Name', 'Date Added'],
  rows: patients.map(patient => ({
    key: patient.id,
    content: [patient.id, patient.name, patient.dateAdded],
  })),
};

</script>
