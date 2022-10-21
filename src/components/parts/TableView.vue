<script setup>
const props = defineProps({
  dataList: Array,
  keyList: Array,
  valList: Array
})
</script>

<template>
<v-table v-if="dataList.length" style="overflow: scroll;">
  <thead>
    <tr>
      <th v-for="key in keyList" :key="key">
        {{ key }}
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td v-for="val in valList" :key="val.id">
        {{ val }}
      </td>
    </tr>
  </tbody>
</v-table>
</template>