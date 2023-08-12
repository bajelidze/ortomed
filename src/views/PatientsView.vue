<template>
  <ItemsManager 
    title="Patients"
    no-data-text="No patients"
    add-patient-title="Add patient"
    :table="table"
    :add-button="true"
    :sort-by="[{ key: 'date_added', order: Order.DESC }]"
    :form-id="formId"
    :submit-loading="submitLoading"
    v-model="showDialog"
  >
    <template #body>
      <AddPatient
        :form-id="formId"
        :submit-loading="submitLoading"
        @add-patient-submit="addPatientSubmit"
      />
    </template>
  </ItemsManager>
</template>

<script setup lang="ts">
import ItemsManager from '../components/common/ItemsManager.vue';
import AddPatient from '../components/patients/AddPatient.vue';
import { Table, Align, Order, AddPatientFields } from '../common/interfaces';

// const patients = await window.api.listPatients(10, 0);
const patients = await window.api.patients.listAll();

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
      showDialog: false,
    };
  },
  methods: {
    async addPatientSubmit(patient: AddPatientFields) {
      this.submitLoading = true;

      try {
        await window.api.patients.add(patient);
      } finally {
        this.submitLoading = false;
        this.showDialog = false;
      }
    },
  },
}
</script>
