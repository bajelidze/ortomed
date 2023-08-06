<template>
  <ItemsManager 
    title="Patients"
    :table="table"
    :add-button="true"
    :sort-by="[{ key: 'date_added', order: Order.DESC }]"
    no-data-text="No patients"
    add-patient-title="Add patient"
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
import { Table, Align, Order } from '../common/interfaces';

const patients = await window.api.listPatients(10, 0);

const header = ['ID', 'Name', 'Date Added'].map(col => ({
  title: col,
  key: col.toLowerCase().replace(' ', '_'),
  sortable: true,
  align: Align.START,
}));

header.push({
    title: 'Actions',
    key: 'actions',
    sortable: false,
    align: Align.START,
})

const table: Table = {
  header,
  rows: patients.map(patient => ({
    id: patient.id,
    name: patient.name,
    date_added: patient.dateAdded,
  })),
};
</script>
