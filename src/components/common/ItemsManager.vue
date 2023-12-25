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
        <v-toolbar-title align="left">
          {{ title }}
        </v-toolbar-title>

        <v-spacer/>

        <v-btn
          size="small"
          color="green"
          variant="flat"
          icon="mdi-plus"
          v-if="addDialog"
          @click="showDialog(true)"
        />

        <AddDialog
          v-if="addDialog"
          :form-id="formId"
          :submit-loading="submitLoading"
          :add-item-title="addItemTitle"
          :persistent="submitLoading"
          :modelValue="modelValue"
          :show-indicates-required-field="showIndicatesRequiredField"
          @update:modelValue="showDialog($event)"
        >
          <slot/>
        </AddDialog>

      </v-toolbar>
    </template>
    <template #item.actions="{ item }">
      <v-btn
        class="ml-n3"
        icon="mdi-pencil"
        variant="text"
        @click="$emit(ItemsManager.EDIT, item)"
      />
      <v-btn
        icon="mdi-trash-can"
        variant="text"
        :disabled="deleteDisabled"
        @click="$emit(ItemsManager.DELETE, item)"
      />
    </template>
    <template v-slot:no-data>
      {{ noDataText }}
    </template>
  </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import AddDialog from './AddDialog.vue';
import { ItemsManagerProps } from '../../common/props';
import { Common, ItemsManager } from '../../common/events';

const emit = defineEmits([
  Common.UPDATE_MODULE_VALUE,
  ItemsManager.DELETE,
  ItemsManager.EDIT,
]);

withDefaults(
  defineProps<ItemsManagerProps>(),
  {
    addDialog: true,
  },
);

function showDialog(show: boolean) {
  emit(Common.UPDATE_MODULE_VALUE, show);
}
</script>
