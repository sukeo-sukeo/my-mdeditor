<script setup>
import { ref } from "@vue/reactivity";
import { dataLoad } from "../../lib/database";

const emits = defineEmits([
  "tag-click"
])
const tagList = ref([]);

const init = async () => {
  tagList.value = await dataLoad("tag");
}

init()
</script>

<template>
  <v-list v-if="tagList.length">
    <v-list-item v-for="tag in tagList" :key="tag" @click="emits('tag-click', tag.tag)">
      {{ tag.tag }}
    </v-list-item>
  </v-list>
</template>