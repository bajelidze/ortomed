<template>
  <v-card>
    <v-table>
      <thead>
        <tr>
          <th class="text-left">
            ID
          </th>
          <th class="text-left">
            Name
          </th>
          <th class="text-left">
            Date Added
          </th>
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
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<script lang="ts">
const patients = await window.api.listPatients();

export default {
  data() {
    return {
      patients,
    };
  },
};
</script>
