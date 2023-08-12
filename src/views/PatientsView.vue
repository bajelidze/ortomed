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
import { ref, reactive, watch } from 'vue';
import ItemsManager from '../components/common/ItemsManager.vue';
import AddPatient from '../components/patients/AddPatient.vue';
import { Table, Align, Order, AddPatientFields } from '../common/interfaces';

const formId = 'add-patient-form';

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

const recomputePatients = ref(false);
const submitLoading = ref(false);
const showDialog = ref(false);

const table = reactive({ header, rows: [] } as Table)

async function resetPatientsTable() {
  // TODO: Add pagination for scalability.
  const patients = await window.api.patients.listAll();

  table.rows =  patients.map(patient => ({
    id: patient.id,
    name: patient.name,
    date_added: patient.dateAdded,
  }));
}

await resetPatientsTable();

watch(recomputePatients, resetPatientsTable);

const addPatientSubmit = async (patient: AddPatientFields) => {
  submitLoading.value = true;

  try {
    await window.api.patients.add(patient);
  } finally {
    submitLoading.value = false;
    showDialog.value = false;
  }

  recomputePatients.value = !recomputePatients.value;
};
</script>
