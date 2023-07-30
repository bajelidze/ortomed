<template>
  <v-card>
    <v-table>
      <thead>
        <tr>
          <th
            v-for="(cell, idx) in table.header"
            :key="idx"
            :width="(99 / table.header.length).toString() + '%'"
            class="text-left"
          >
            {{ cell }}
          </th>
          <th width="1%"/>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in table.rows"
          class="text-left"
          :key="row.key"
        >
          <td
            v-for="(cell, idx) in row.content"
            :key="idx"
          >
            {{ cell }}
          </td>
          <td>
            <v-btn
              icon="mdi-trash-can"
              flat
            />
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<script setup lang="ts">
import { Table } from '../common/interfaces';

interface Props {
  title: string
  table: Table,
}

defineProps<Props>();

</script>
