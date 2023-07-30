<template>
  <v-card>
    <v-table>
      <thead>
        <tr>
          <th width="33%" class="text-left">
            ID
          </th>
          <th width="33%" class="text-left">
            Name
          </th>
          <th width="33%" class="text-left">
            Date Added
          </th>
          <th width="1%"/>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="patient in patients"
          class="text-left"
          :key="patient.name"
        >
          <td>{{ patient.id }}</td>
          <td>{{ patient.name }}</td>
          <td>{{ patient.dateAdded }}</td>
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

<script lang="ts">
const patients = await window.api.listPatients(10, 0);

export default {
  data() {
    return {
      patients,
    };
  },
};
</script>
