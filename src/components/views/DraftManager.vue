<script setup>
import { ref } from "@vue/reactivity";
import { dataLoad, deleteData } from "../../lib/database";

const emits = defineEmits([
  "blog-click"
])
const blogList = ref([]);

const init = async () => {
  blogList.value = await dataLoad("blog");
}

const deleteBlog = async (id) => {
  await deleteData("blog", id);
  await init();
}

init()
</script>

<template>
  <v-table v-if="blogList.length">
    <thead>
      <tr>
        <th>
          id
        </th>
        <th>
          タイトル
        </th>
        <th>
          カテゴリー
        </th>
        <th>
          作成日
        </th>
        <th>
          更新日
        </th>
        <th>
          公開
        </th>
      </tr>
    </thead>
  </v-table>
  <v-list v-if="blogList.length">
    <v-list-item v-for="blog in blogList" :key="blog">
      <span @click="emits('blog-click', blog)" style="cursor: pointer;">
        {{ blog.title ? blog.title : "Non Title" }}
      </span>
      <span>
        {{ blog.created_at }}
        {{ blog }}
      </span>
      <v-chip :color="blog.published ? 'success' : 'gray'">{{ blog.published ? "公開中" : "下書き" }}</v-chip>
      <v-icon @click.stop="deleteBlog(blog.id)" class="float-right">mdi-delete</v-icon>
      <v-divider class="my-2"></v-divider>
    </v-list-item>
  </v-list>
</template>