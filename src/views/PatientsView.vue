<template>
  <ItemsManager 
    title="Patients"
    :table="table"
    :add-button="true"
  >
    <template #addBtn>
      <TextButton
        color="blue"
        append-icon="mdi-plus"
      >
        Add
        <AddDialog title="Add Patient">
          <template #content>
            Add patient form here...<br/>
          </template>
        </AddDialog>
      </TextButton>
    </template>
  </ItemsManager>
</template>

<script setup lang="ts">
import ItemsManager from '../components/common/ItemsManager.vue';
import AddDialog from '../components/common/AddDialog.vue';
import TextButton from '../components/common/TextButton.vue';
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
