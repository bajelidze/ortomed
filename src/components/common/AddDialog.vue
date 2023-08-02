<template>
  <v-dialog
    scrollable
    width="1024"
    activator="parent"
    v-model="dialog"
  >
    <v-card>
      <v-card-title class="ma-3">
        <span class="text-h5">{{ title }}</span>
      </v-card-title>
      <v-card-text class="ml-2">
        <slot name="content"/>
        <small>*indicates required field</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="$emit('addClicked')"
        >
          Add
        </v-btn>
        <v-btn
          color="blue"
          @click="dialog = false"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
// Doesn't work in `setup` for whatever reason.
export default {
  data () {
    return {
      dialog: false,
    };
  },
  props: {
    title: String,
  },
};
</script>
