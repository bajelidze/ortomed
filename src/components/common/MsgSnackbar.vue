<template>
  <div class="text-center">
    <v-snackbar
      :modelValue="modelValue"
      @update:modelValue="showSnackbar($event)"
      :color="color"
      :timeout="timeout"
    >
      <v-icon start :icon="icon"/>
      {{ msg }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { MsgSnackbarProps } from '../../common/props';
import { Common } from '../../common/events';

defineProps<MsgSnackbarProps>();
const emit = defineEmits([Common.UPDATE_MODULE_VALUE]);

function showSnackbar(show: boolean) {
  emit(Common.UPDATE_MODULE_VALUE, show);
}
</script>
