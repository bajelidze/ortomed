<template>
  <ItemsManager
    v-model="showDialog"
    :title="locale.doctors.DOCTORS"
    :no-data-text="locale.doctors.NO_DOCTORS"
    :add-item-title="locale.doctors.ADD_DOCTOR"
    :table="table"
    :add-button="true"
    :sort-by="[{ key: 'date_added', order: Order.DESC }]"
    :form-id="formId"
    :submit-loading="submitLoading"
    :delete-disabled="deleteDisabled"
    :show-indicates-required-field="true"
    @items-manager-delete="deleteDoctor"
  >
    <AddDoctor
      :form-id="formId"
      :submit-loading="submitLoading"
      @add-doctor-submit="addDoctorSubmit"
    />
  </ItemsManager>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import ItemsManager from '../../common/ItemsManager.vue';
import AddDoctor from './components/AddDoctor.vue';
import { Table, Align, Order } from '../../../common/interfaces';
import { AddDoctorFields } from '../../../../common/fields';
import { FormattedDoctor } from '../../../../common/interfaces';
import { readFile } from '../../../common/locale';
import { useSettingsStore } from '../../../store/settings';

const formId = 'add-doctor-form';

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

const recomputeDoctors = ref(false);
const submitLoading = ref(false);
const deleteDisabled = ref(false);
const showDialog = ref(false);

const table = reactive({ header, rows: [] } as Table);

async function resetDoctorsTable() {
  // TODO: Add pagination for scalability.
  const doctors = await window.api.doctors.listAll();

  table.rows = doctors.map(doctor => ({
    id: doctor.id ? doctor.id : '0',
    name: doctor.name,
    date_added: doctor.dateAdded,
  }));
}

await resetDoctorsTable();

watch(recomputeDoctors, resetDoctorsTable);

function rerenderDoctors() {
  recomputeDoctors.value = !recomputeDoctors.value;
}

async function addDoctorSubmit(doctor: AddDoctorFields) {
  submitLoading.value = true;

  try {
    await window.api.doctors.add(JSON.stringify(doctor));
  } finally {
    submitLoading.value = false;
    showDialog.value = false;
  }

  rerenderDoctors();
}

async function deleteDoctor(doctorData: { raw: FormattedDoctor }) {
  deleteDisabled.value = true;

  if (doctorData.raw.id == undefined) {
    throw Error('selected doctor id is undefined');
  }

  try {
    await window.api.doctors.delete(+doctorData.raw.id);
  } finally {
    deleteDisabled.value = false;
  }

  rerenderDoctors();
}
</script>
