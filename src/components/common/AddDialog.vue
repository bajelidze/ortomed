<template>
  <v-dialog
    scrollable
    :max-width="maxWidth"
    :persistent="submitLoading"
    :modelValue="modelValue"
    @update:modelValue="showDialog($event)"
  >
    <v-card>
      <v-card-title class="ma-3">
        <span class="text-h5">{{ addItemTitle }}</span>
      </v-card-title>

      <v-card-text class="ml-2 scrollable">
        <slot/>
      </v-card-text>

      <v-card-actions class="mb-2 mr-2">
        <small v-if="showIndicatesRequiredField" class="ml-5">
          *{{ locale.common.INDICATES_REQUIRED_FIELD }}
        </small>
        <v-spacer/>
        <v-btn
          color="primary"
          variant="flat"
          type="submit"
          :disabled="submitLoading"
          :loading="submitLoading"
          :form="formId"
        >
          {{ locale.common.SUBMIT }}
          <template #loader>
            <v-progress-circular indeterminate color="primary"/>
          </template>
        </v-btn>
        <v-btn
          color="primary"
          :disabled="submitLoading"
          @click="showDialog(false)"
        >
          {{ locale.common.CANCEL }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { Common } from '../../common/events';
import { AddDialogProps } from '../../common/props';
import { readFile } from '../../common/locale';
import { useSettingsStore } from '../../store/settings';

const settings = await useSettingsStore().get();
const locale = await readFile(settings.locale);

const emit = defineEmits([
  Common.UPDATE_MODULE_VALUE,
]);

withDefaults(
  defineProps<AddDialogProps>(),
  {
    maxWidth: 1200,
  },
);

function showDialog(show: boolean) {
  emit(Common.UPDATE_MODULE_VALUE, show);
}
</script>
