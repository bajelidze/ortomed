<template>
  <ItemsManager
    v-model="showDialog"
    :title="locale.patients.PATIENTS"
    :no-data-text="locale.patients.NO_PATIENTS"
    :add-item-title="locale.patients.ADD_PATIENT"
    :table="table"
    :add-button="true"
    :sort-by="[{ key: 'date_added', order: Order.DESC }]"
    :form-id="formId"
    :submit-loading="submitLoading"
    :delete-disabled="deleteDisabled"
    @items-manager-delete="deletePatient"
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
import ItemsManager from '../../common/ItemsManager.vue';
import AddPatient from './AddPatient.vue';
import { Table, Align, Order } from '../../../common/interfaces';
import { AddPatientFields } from '../../../../common/fields';
import { FormattedPatient } from '../../../../common/interfaces';
import { readFile } from '../../../common/locale';
import { useSettingsStore } from '../../../store/settings';

const formId = 'add-patient-form';

// Read the current locale.
const settings = await useSettingsStore().get();
const locale = await readFile(settings.locale);

const header = [];

const cols = {
  'ID': 'ID',
  'Name': locale.common.NAME,
  'Date Added': locale.common.DATE_ADDED,
};

for (const key in cols) {
  header.push({
    //@ts-ignore
    title: cols[key],
    key: key.toLowerCase().replace(' ', '_'),
    sortable: true,
    align: Align.START,
  });
}

header.push({
  title: locale.common.ACTIONS,
  key: 'actions',
  sortable: false,
  align: Align.START,
});

const recomputePatients = ref(false);
const submitLoading = ref(false);
const deleteDisabled = ref(false);
const showDialog = ref(false);

const table = reactive({ header, rows: [] } as Table);

async function resetPatientsTable() {
  // TODO: Add pagination for scalability.
  const patients = await window.api.patients.listAll();

  table.rows = patients.map(patient => ({
    id: patient.id ? patient.id : '0',
    name: patient.name,
    date_added: patient.dateAdded,
  }));
}

await resetPatientsTable();

watch(recomputePatients, resetPatientsTable);

function rerenderPatients() {
  recomputePatients.value = !recomputePatients.value;
}

async function addPatientSubmit(patient: AddPatientFields) {
  submitLoading.value = true;

  try {
    await window.api.patients.add(patient);
  } finally {
    submitLoading.value = false;
    showDialog.value = false;
  }

  rerenderPatients();
}

async function deletePatient(patientData: { raw: FormattedPatient }) {
  deleteDisabled.value = true;

  if (patientData.raw.id == undefined) {
    throw Error('selected patient id is undefined');
  }

  try {
    await window.api.patients.delete(+patientData.raw.id);
  } finally {
    deleteDisabled.value = false;
  }

  rerenderPatients();
}
</script>
