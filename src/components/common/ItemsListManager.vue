<template>
  <v-toolbar>
    <v-toolbar-title>
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
      @update:modelValue="showDialog($event)"
      :max-width="1000"
    >
      <slot/>
    </AddDialog>
  </v-toolbar>

  <v-divider/>

  <div
    v-if="items.length == 0"
    :style="'height:'+defaultHeightPx+'px;text-align:center'"
  >
    {{ noDataText ? noDataText : 'No Data' }}
  </div>
  <v-virtual-scroll
     v-else
     :items="items"
     :height="defaultHeightPx"
     item-height="48"
     class="scrollable"
   >
     <template #default="{ item, index }">
       <slot name="listItem" :item="item" :index="index"/>
     </template>
  </v-virtual-scroll>
</template>

<script setup lang="ts">
import AddDialog from './AddDialog.vue';
import { ItemsListManagerProps } from '../../common/props';
import { Common, ItemsListManager } from '../../common/events';

const defaultHeightPx = 320;

const emit = defineEmits([
  Common.UPDATE_MODULE_VALUE,
  ItemsListManager.ADD_SUBMIT,
]);

withDefaults(
  defineProps<ItemsListManagerProps>(),
  {
    addDialog: true,
    tooltipText: '',
  },
);

function showDialog(show: boolean) {
  emit(Common.UPDATE_MODULE_VALUE, show);
}
</script>
