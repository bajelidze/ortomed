<template>
  <v-form
    :id="formId"
    fast-fail
    @submit.prevent="submit"
  >
    <v-text-field
      counter
      v-model="name"
      :label="locale.common.NAME + '*'"
      :disabled="submitLoading"
      :rules="nameRules"
      :maxlength="nameMaxLength"
    />

    <v-textarea
      counter
      v-model="description"
      rows="3"
      label="Description"
      :disabled="submitLoading"
      :maxlength="descriptionMaxLength"
    />

    <v-autocomplete
      v-model="repetitions"
      label="Repetitions"
      :disabled="submitLoading"
      :items="repetitionsValues"
      :rules="repetitionsRules"
    />

    <v-container>
      <v-row>
        <v-col>
          <v-card>
            <ItemsListManager
              v-model="showActivityDialog"
              title="Activities"
              add-item-title="Add Activity"
              :form-id="activityFormID"
              :submit-loading="submitLoading"
              :show-indicates-required-field="true"
              :items="activities"
            >
              <AddActivity
                :form-id="activityFormID"
                :submit-loading="activitySubmitLoading"
                @add-activity-submit="addActivitySubmit"
              />
              <template #listItem="{ item }: { item: Activity }">
                <ListItem
                  :title="item.name"
                  :subtitle="`ID: ${item.id}`"
                  icon="mdi-lightning-bolt"
                  :iconColor="item.flexible ? 'green' : 'gray'"
                  tooltip-location="right"
                >
                  <template #actions>
                    <v-col cols="auto" class="mt-3">
                      <v-btn flat icon="mdi-trash-can"/>
                    </v-col>
                    <v-col cols="auto" class="mt-3 mr-3">
                      <v-btn
                        flat icon="mdi-arrow-right-bold"
                        @click="doShowCourseActivityDialog(item)"
                      />
                    </v-col>
                  </template>

                  <template #tooltip>
                    <strong>ID</strong>: {{ item.id }}<br/>
                    <strong>Duration</strong>: {{ formatDurationSeconds(item.duration) }}<br/>
                    <strong>Capacity</strong>: {{ item.capacity }}<br/>
                    <strong>Flexible</strong>: {{ item.flexible }}<br/>
                    <strong>Description</strong>: {{ formatDescription(item.description) }}<br/>
                  </template>
                </ListItem>
              </template>
            </ItemsListManager>
          </v-card>
        </v-col>

        <v-col>
          <v-card>
            <ItemsListManager
              v-model="showCourseActivityDialog"
              title="Course Activities"
              add-item-title="Add Course Activity"
              form-id="courseActivityFormID"
              :submit-loading="submitLoading"
              :show-indicates-required-field="false"
              :items="courseActivities"
              :add-dialog="false"
            >
              <template #listItem="{ item, index }: { item: CourseActivity, index: number }">
                <ListItem
                  :title="newCourseActivityTitle(item)"
                  :subtitle="`Activity ID: ${item.activityId}`"
                  icon="mdi-run-fast"
                  :iconColor="newCourseActivityColor(item)"
                  tooltip-location="left"
                >
                  <template #actions>
                    <v-col cols="auto" class="mt-3">
                      <v-btn
                        flat
                        icon="mdi-arrow-up-bold"
                        @click="moveCourseActivity(Direction.LEFT, index)"
                      />
                    </v-col>
                    <v-col cols="auto" class="mt-3">
                      <v-btn
                        flat
                        icon="mdi-arrow-down-bold"
                        @click="moveCourseActivity(Direction.RIGHT, index)"
                      />
                    </v-col>
                    <v-col cols="auto" class="mt-3 mr-3">
                      <v-btn
                        flat
                        icon="mdi-trash-can"
                        @click="deleteCourseActivity(index)"
                      />
                    </v-col>
                  </template>
                  <template #tooltip>
                    <template v-for="activity in [findActivity(item.activityId)]" :key="activity">
                      <strong>Activity ID</strong>: {{ item.activityId }}<br/>
                      <strong>Duration</strong>: {{ formatDurationSeconds(activity.duration) }}<br/>
                      <strong>Pause</strong>: {{ formatDurationSeconds(item.pause) }}<br/>
                      <strong>Capacity</strong>: {{ activity.capacity }}<br/>
                      <strong>Flexible</strong>: {{ activity.flexible }}<br/>
                      <strong>Description</strong>: {{ formatDescription(activity.description) }}<br/>
                    </template>
                  </template>
                </ListItem>
              </template>
            </ItemsListManager>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <AddDialog
      v-model="showCourseActivityDialog"
      add-item-title="Add Course Activity"
      :form-id="courseActivityFormID"
      :submit-loading="submitLoading"
      :max-width="1000"
    >
      <AddCourseActivity
        :form-id="courseActivityFormID"
        :submit-loading="submitLoading"
        :activity="selectedActivity"
        @add-course-activity-submit="addCourseActivitySubmit"
      />
    </AddDialog>

    <MsgSnackbar
      v-model="showActivityError"
      :msg="showActivityErrorMsg"
      :timeout="3000"
      icon="mdi-alert-circle-outline"
      color="error"
    />
  </v-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { formatDurationSeconds } from '../../../../common/utils/format';
import { SubmitFormProps } from '../../../common/props';
import { Course } from '../../../common/events';
import { Activity, CourseActivity } from '../../../../common/interfaces';
import { AddCourseFields } from '../../../../common/fields';
import { readFile } from '../../../common/locale';
import { useSettingsStore } from '../../../store/settings';
import { numericRules } from '../../../common/rules';
import ItemsListManager from '../../common/ItemsListManager.vue';
import MsgSnackbar from '../../common/MsgSnackbar.vue';
import AddActivity from './components/AddActivity.vue';
import AddCourseActivity from './components/AddCourseActivity.vue';
import AddDialog from '../../common/AddDialog.vue';
import ListItem from '../../common/ListItem.vue';

const settings = await useSettingsStore().get();
const locale = await readFile(settings.locale);

const activityFormID = 'activityForm';
const courseActivityFormID = 'courseActivityForm';

const name = ref('');
const description = ref('');
const repetitions = ref('1');

const nameMaxLength = 50;
const descriptionMaxLength = 500;
const repetitionsMaxValue = 100;

const repetitionsRules = computed(() => numericRules(repetitions.value, 1, repetitionsMaxValue));
const nameRules = computed(() => [
  name.value.length > 0 || 'The name must not be empty',
  name.value.length <= nameMaxLength || `The name length must be less than or equal ${nameMaxLength}`,
]);

const emit = defineEmits<{
  (e: typeof Course.ADD_COURSE_SUBMIT, fields: AddCourseFields): void;
}>();

defineProps<SubmitFormProps>();

const activities = ref(await listActivities());
const courseActivities = ref([] as CourseActivity[]);

const selectedActivity = ref({
  name: 'undefined',
  duration: 0,
  capacity: 0,
  flexible: false,
} as Activity);

const showActivityDialog = ref(false);
const showCourseActivityDialog = ref(false);
const submitLoading = ref(false);
const activitySubmitLoading = ref(false);
const showActivityError = ref(false);

const showActivityErrorMsg = ref('');

function validate(): boolean {
  for (const validators of [
    nameRules.value,
    repetitionsRules.value,
  ]) {
    for (const validator of validators) {
      if (typeof validator === 'string') {
        return false;
      }
    }
  }

  return true;
}

function submit() {
  if (!validate()) {
    return;
  }

  const course: AddCourseFields = {
    name: name.value,
    description: description.value,
    repetitions: +repetitions.value,
    courseActivities: courseActivities.value,
  };

  emit(Course.ADD_COURSE_SUBMIT, course);
}

async function listActivities(): Promise<Activity[]> {
  return await window.api.activity.listAll();
}

async function addActivitySubmit(newActivity: Activity) {
  activitySubmitLoading.value = true;

  try {
    activities.value.push(newActivity);

    const id = await window.api.activity.add([newActivity]);

    if (id.length == 0) {
      console.log('The window.api.activity.add returned no ids');
    } else {
      newActivity.id = id[0];
    }

    showActivityDialog.value = false;
  } finally {
    activitySubmitLoading.value = false;
  }
}

function addCourseActivitySubmit(courseActivity: CourseActivity) {
  activitySubmitLoading.value = true;

  try {
    courseActivities.value.push(courseActivity);
    showCourseActivityDialog.value = false;
  } finally {
    activitySubmitLoading.value = false;
  }
}

function doShowCourseActivityDialog(activity: Activity) {
  selectedActivity.value = activity;
  showCourseActivityDialog.value = true;
}

function deleteCourseActivity(index?: number) {
  if (index == undefined) {
    console.log('The delete index is undefined');
    return;
  }

  courseActivities.value.splice(index, 1);
}

enum Direction {
  LEFT,
  RIGHT,
}

function moveCourseActivity(direction: Direction, index?: number) {
  function moveItem(num: number) {
    if (index == undefined) {
      console.log('The move index is undefined');
      return;
    } else if (index + num >= courseActivities.value.length || index + num < 0) {
      return;
    }

    const temp = courseActivities.value[index];
    courseActivities.value[index] = courseActivities.value[index + num];
    courseActivities.value[index + num] = temp;
  }

  switch (direction) {
    case Direction.LEFT: {
      moveItem(-1);
      break;
    } case Direction.RIGHT: {
      moveItem(1);
      break;
    }
  }
}

function findActivity(id?: number): Activity {
  if (id == undefined) {
    throw Error('the selected activity ID is undefined');
  }

  let activity: Activity | undefined;

  for (const act of activities.value) {
    if (act.id == id) {
      activity = act;
      break;
    }
  }

  if (activity == undefined) {
    throw Error(`the activity with ID ${id} is undefined`);
  }

  return activity;
}

function newCourseActivityTitle(ca: CourseActivity): string {
  const activity = findActivity(ca.activityId);
  return activity.name;
}

function newCourseActivityColor(ca: CourseActivity): string {
  const activity = findActivity(ca.activityId);
  return activity.flexible ? 'green' : 'gray';
}

function formatDescription(description?: string): string {
  return description != undefined && description.length > 0 ? description : 'No description';
}

// Consts
//
const repetitionsValues: string[] = [];

for (let i = 1; i < repetitionsMaxValue; i++) {
  let iStr = i.toString();
  repetitionsValues.push(iStr);
}
</script>
