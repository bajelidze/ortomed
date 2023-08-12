<template>
  <v-card class="ma-12">
  <v-data-table
    :headers="table.header"
    :items="table.rows"
    :sort-by="sortBy"
    class="elevation-1"
    align="center"
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title
          align="left">
          {{ title }}
        </v-toolbar-title>

        <v-spacer/>

        <v-dialog
          scrollable
          width="1024"
          :modelValue="modelValue"
          @update:modelValue="$emit('update:modelValue', $event)"
          :persistent="submitLoading"
        >
          <template #activator="{ props }">
            <v-btn 
              class="mr-4"
              color="green"
              variant="flat"
              append-icon="mdi-plus"
              v-bind="props"
            >
              Add
            </v-btn>
          </template>

          <v-card>
            <v-card-title class="ma-3">
              <span class="text-h5">{{ addPatientTitle }}</span>
            </v-card-title>
            <v-card-text class="ml-2">
              <slot name="body"/>
              <br><br>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions class="mb-2 mr-2">
              <v-spacer/>
              <v-btn
                color="blue-darken-1"
                variant="flat"
                type="submit"
                :disabled="submitLoading"
                :loading="submitLoading"
                :form="formId"
              >
                Submit
                <template v-slot:loader>
                  <v-progress-circular indeterminate color="blue"/>
                </template>
              </v-btn>
              <v-btn
                color="blue"
                :disabled="submitLoading"
                @click="showDialog(false)"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-toolbar>
    </template>
    <template #item.actions="{ }">
      <v-btn
        class="ml-n3"
        icon="mdi-pencil"
        variant="text"
        @click="console.log('edit')"
      />
      <v-btn
        icon="mdi-trash-can"
        variant="text"
        @click="console.log('delete')"
      />
    </template>
    <template v-slot:no-data>
      {{ noDataText }}
    </template>
  </v-data-table>
  </v-card>
</template>

<script lang="ts">
export default {
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    showDialog(show: boolean) {
      this.$emit(Common.UPDATE_MODULE_VALUE, show)
    },
  },
}
</script>

<script setup lang="ts">
import { ItemsManagerProps } from '../../common/props';
import { Common } from '../../common/events';

defineProps<ItemsManagerProps>();
defineEmits([
  Common.ITEMS_MANAGER_ADD_SUBMIT,
  Common.UPDATE_MODULE_VALUE,
]);
</script>
