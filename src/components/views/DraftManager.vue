<script setup>
import { ref } from "@vue/reactivity";
import { dataLoad, deleteData } from "../../lib/database";

const emits = defineEmits([
  "blog-click"
])
const blogList = ref([]);

const init = async () => {
  blogList.value = await dataLoad("blog");
  console.log(blogList.value);
}

const deleteBlog = async (id) => {
  await deleteData("blog", id);
  await init();
}

init()
</script>

<template>
  <v-list v-if="blogList.length">
    <v-list-item v-for="blog in blogList" :key="blog">
      <span @click="emits('blog-click', blog)" style="cursor: pointer;">
        {{ blog.title ? blog.title : "Non Title" }}
      </span>
      <span>
        {{ blog.created_at }}
      </span>
      <v-chip :color="blog.published ? 'success' : 'gray'">{{ blog.published ? "公開" : "下書き" }}</v-chip>
      <v-icon @click.stop="deleteBlog(blog.id)" class="float-right">mdi-delete</v-icon>
    </v-list-item>
  </v-list>
</template>