<template>
  <ItemsManager
    v-model="showDialog"
    :title="locale.courses.COURSES"
    :no-data-text="locale.courses.NO_COURSES"
    :add-item-title="locale.courses.ADD_COURSE"
    :table="table"
    :add-button="true"
    :sort-by="[{ key: 'date_added', order: Order.DESC }]"
    :form-id="formId"
    :submit-loading="submitLoading"
    :delete-disabled="deleteDisabled"
    @items-manager-delete="deleteCourse"
  >
    <template #body>
      <AddCourse
        :form-id="formId"
        :submit-loading="submitLoading"
        @add-course-submit="addCourseSubmit"
      />
    </template>
  </ItemsManager>
</template>

<script setup lang="ts">

import { ref, reactive, watch } from 'vue';
import ItemsManager from '../common/ItemsManager.vue';
import AddCourse from './components/AddCourse.vue';
import { Table, Align, Order } from '../../common/interfaces';
import { AddCourseFields } from '../../../common/fields';
import { FormattedCourse } from '../../../common/interfaces';
import { readFile } from '../../common/locale';
import { useSettingsStore } from '../../store/settings';

const formId = 'add-course-form';

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

const recomputeCourses = ref(false);
const submitLoading = ref(false);
const deleteDisabled = ref(false);
const showDialog = ref(false);

const table = reactive({ header, rows: [] } as Table);

async function resetCoursesTable() {
  // TODO: Add pagination for scalability.
  const courses = await window.api.courses.listAll();

  table.rows = courses.map(course => ({
    id: course.id ? course.id : '0',
    name: course.name,
    date_added: course.dateAdded,
  }));
}

await resetCoursesTable();

watch(recomputeCourses, resetCoursesTable);

function rerenderCourses() {
  recomputeCourses.value = !recomputeCourses.value;
}

async function addCourseSubmit(course: AddCourseFields) {
  submitLoading.value = true;

  try {
    await window.api.courses.add(JSON.stringify(course));
  } finally {
    submitLoading.value = false;
    showDialog.value = false;
  }

  rerenderCourses();
}

async function deleteCourse(courseData: { raw: FormattedCourse }) {
  deleteDisabled.value = true;

  if (courseData.raw.id == undefined) {
    throw Error('selected course id is undefined');
  }

  try {
    await window.api.courses.delete(+courseData.raw.id);
  } finally {
    deleteDisabled.value = false;
  }

  rerenderCourses();
}
</script>
