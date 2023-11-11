<template>
  <v-toolbar>
    <v-toolbar-title>
      {{ title }}
    </v-toolbar-title>

    <v-spacer/>

    <v-dialog
      scrollable
      max-width="1200"
      :persistent="submitLoading"
      :modelValue="modelValue"
      @update:modelValue="showDialog($event)"
    >
      <template #activator="{ props }">
        <v-btn
          size="small"
          color="green"
          variant="flat"
          icon="mdi-plus"
          v-bind="props"
        />
      </template>

      <v-card>
        <v-card-title class="ma-3">
          <span class="text-h5">{{ addItemTitle }}</span>
        </v-card-title>

        <v-card-text class="ml-2 scrollable">
          <slot name="body"/>
        </v-card-text>

        <v-card-actions class="mb-2 mr-2">
          <small v-if="showIndicatesRequiredField" class="ml-5">
            *{{ locale.common.INDICATES_REQUIRED_FIELD }}
          </small>
          <v-spacer/>
          <v-btn
            color="blue"
            variant="flat"
            type="submit"
            :disabled="submitLoading"
            :loading="submitLoading"
            :form="formId"
          >
            {{ locale.common.SUBMIT }}
            <template #loader>
              <v-progress-circular indeterminate color="blue"/>
            </template>
          </v-btn>
          <v-btn
            color="blue"
            :disabled="submitLoading"
            @click="showDialog(false)"
          >
            {{ locale.common.CANCEL }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
     <template #default="{ item }">
       <slot name="listItem" :item="item"/>
     </template>
  </v-virtual-scroll>
</template>

<script setup lang="ts">
import { ItemsListManagerProps } from '../../common/props';
import { Common, ItemsListManager } from '../../common/events';
import { readFile } from '../../common/locale';
import { useSettingsStore } from '../../store/settings';

const defaultHeightPx = 320;

const settings = await useSettingsStore().get();
const locale = await readFile(settings.locale);

const emit = defineEmits([
  Common.UPDATE_MODULE_VALUE,
  ItemsListManager.ADD_SUBMIT,
]);

defineProps<ItemsListManagerProps>();

function showDialog(show: boolean) {
  emit(Common.UPDATE_MODULE_VALUE, show);
}
</script>
