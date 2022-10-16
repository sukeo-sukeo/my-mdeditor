<script setup>
import { ref } from "@vue/reactivity";
import { dataLoad } from "../../lib/database";

const emits = defineEmits([
  "cate-click"
])
const categoryList = ref([]);

const init = async () => {
  categoryList.value = await dataLoad("category");
}

init()
</script>

<template>
  <v-list v-if="categoryList.length">
    <v-list-item v-for="cate in categoryList" :key="cate" @click="emits('cate-click', cate.name)">
      {{ cate.name }}
    </v-list-item>
  </v-list>
</template>