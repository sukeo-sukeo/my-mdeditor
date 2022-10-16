<script setup>
import { ref } from "@vue/reactivity";
import { dataLoad } from "../../lib/database";

const emits = defineEmits([
  "blog-click"
])
const blogList = ref([]);

const init = async () => {
  blogList.value = await dataLoad("blog");
}

init()
</script>

<template>
  <v-list v-if="blogList.length">
    <v-list-item v-for="blog in blogList" :key="blog" @click="emits('blog-click', blog)">
      {{ blog.title ? blog.title : "Non Title" }}{{ blog.created_at }}
    </v-list-item>
  </v-list>
</template>