<template>
  <v-card>
    <v-toolbar>
      <v-toolbar-title>
        {{ title }}
      </v-toolbar-title>

      <v-spacer/>

      <v-dialog
        scrollable
        width="512"
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
          >
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="ma-3">
            <span class="text-h5">{{ addItemTitle }}</span>
          </v-card-title>

          <v-card-text class="ml-2 scrollable">
            <slot name="body"/>
          </v-card-text>

          <v-card-actions class="mb-2 mr-2">
            <small class="ml-5">
              *{{ locale.common.INDICATES_REQUIRED_FIELD }}
            </small>
            <v-spacer/>
            <v-btn
              color="blue"
              variant="flat"
              type="submit"
              :form="formId"
            >
              {{ locale.common.SUBMIT }}
              <template #loader>
                <v-progress-circular indeterminate color="blue"/>
              </template>
            </v-btn>
            <v-btn
              color="blue"
              @click="showDialog(false)"
            >
              {{ locale.common.CANCEL }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>

    <v-divider/>

    <v-virtual-scroll
       :items="items"
       height="320"
       item-height="48"
       class="scrollable"
     >
       <template #default="{ item }">
         <slot name="listItem" :item="item"/>
       </template>
    </v-virtual-scroll>

  </v-card>
</template>

<script setup lang="ts">
import { ItemsListManagerProps } from '../../common/props';
import { Common } from '../../common/events';
import { readFile } from '../../common/locale';
import { useSettingsStore } from '../../store/settings';

const settings = await useSettingsStore().get();
const locale = await readFile(settings.locale);

const emit = defineEmits([
  Common.UPDATE_MODULE_VALUE,
]);

defineProps<ItemsListManagerProps>();

function showDialog(show: boolean) {
  emit(Common.UPDATE_MODULE_VALUE, show);
}
</script>
