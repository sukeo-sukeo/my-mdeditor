<script setup>
import { ref } from "@vue/reactivity";
import { dataLoad, deleteData } from "../../lib/database";

const emits = defineEmits([
  "tag-click"
])
const tagList = ref([]);

const init = async () => {
  tagList.value = await dataLoad("tag");
}

const deleteTag = async (id) => {
  await deleteData("tag", id);
  await init();
}

init()
</script>

<template>
  <v-list v-if="tagList.length">
    <v-list-item v-for="tag in tagList" :key="tag" @click="emits('tag-click', tag.name)">
      <span>
        {{ tag.name }}
      </span>
       <v-icon @click.stop="deleteTag(tag.id)" class="float-right">mdi-delete</v-icon>
       <v-divider class="my-2"></v-divider>
    </v-list-item>
  </v-list>
</template>