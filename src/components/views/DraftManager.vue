<script setup>
import { ref } from "@vue/reactivity";
import { appConfig } from "../../config/app.config.js";
import { dataLoad, deleteData } from "../../lib/database.js";
import { getDate } from "../../lib/myUtills.js"

const emits = defineEmits([
  "blog-click"
])

const pageKey = "blog"
const blogList = ref([]);

const init = async () => {
  blogList.value = await dataLoad(pageKey);
}

const deleteBlog = async (id) => {
  await deleteData(pageKey, id);
  await init();
}

init()
</script>

<template>
  <v-table v-if="blogList.length" style="overflow: scroll;">
    <thead>
      <tr>
        <th v-for="key in appConfig.theadKeys[pageKey]" :key="key">
          {{key}}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="blog, idx in blogList" :key="blog">
        <td>
          {{ idx + 1 }}
        </td>
        <td @click="emits('blog-click', blog)" style="cursor: pointer;">
          {{ blog.title }}
        </td>
        <td>
          {{ blog.category }}
        </td>
        <td>
          {{ getDate(blog.created_at.toDate(), "/", ":") }}
        </td>
        <td>
          {{ blog.updated_at ? getDate(blog.updated_at.toDate(), "/", ":") : "" }}
        </td>
        <td>
          <v-chip :color="blog.published ? 'success' : 'gray'">{{ blog.published ? "公開中" : "下書き" }}</v-chip>
        </td>
        <td>
          <v-icon @click.stop="deleteBlog(blog.id)" class="float-right">mdi-delete</v-icon>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>