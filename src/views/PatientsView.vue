<template>
  <ItemsManager 
    title="Patients"
    :table="table"
    :add-button="true"
  >
    <template #addBtn>
      <AddDialog />
    </template>
  </ItemsManager>
</template>

<script setup lang="ts">
import ItemsManager from '../components/common/ItemsManager.vue';
import AddDialog from '../components/common/AddDialog.vue';
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
