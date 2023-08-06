<template>
  <ItemsManager 
    title="Patients"
    no-data-text="No patients"
    add-patient-title="Add patient"
    :table="table"
    :add-button="true"
    :sort-by="[{ key: 'date_added', order: Order.DESC }]"
    :submit-loading="submitLoading"
    :form-id="formId"
  >
    <template #body>
      <AddPatient
        :form-id="formId"
        @add-patient-submit="submitLoading = true"
      />
    </template>
  </ItemsManager>
</template>

<script setup lang="ts">
import ItemsManager from '../components/common/ItemsManager.vue';
import AddPatient from '../components/patients/AddPatient.vue';
import { Table, Align, Order } from '../common/interfaces';

// const patients = await window.api.listPatients(10, 0);
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

const formId = 'add-patient-form';
</script>

<script lang="ts">
export default {
  data() {
    return {
      firstName: '',
      lastName: '',
      submitLoading: false,
    };
  },
}
</script>
