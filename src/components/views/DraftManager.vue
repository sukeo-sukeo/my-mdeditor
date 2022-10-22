<script setup>
import { ref, toRefs } from "@vue/reactivity";
import { computed } from "@vue/runtime-core";
import { useRouter } from "vue-router";
import { appConfig } from "../../config/app.config.js";
import { makeTableHeads } from "../../lib/appUtill";
import { dataLoad, deleteData } from "../../lib/database.js";
import { getDate } from "../../lib/myUtills.js"


const props = defineProps({
  responsive: Boolean,
  routePath: String
});

const emits = defineEmits([
  "blog-click"
])

const router = useRouter();
const { responsive } = toRefs(props);

const pageKey = "blog"
const blogList = ref([]);
const theads = computed(() => makeTableHeads(appConfig.theadKeys[pageKey], responsive.value, [0, 1, 5]));

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
        <th v-for="thead in theads" :key="thead">
          {{ thead }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="blog, idx in blogList" :key="blog">
        <td>
          {{ idx + 1 }}
        </td>
        <td @click="props.routePath === '/draft' ? router.push({path: `/${blog.id}`}) : emits('blog-click', blog)" style="cursor: pointer;">
          {{ blog.title }}
          <v-tooltip v-if="responsive"
          activator="parent"
          location="top" style="z-index: 100000;">
            <p>
              カテゴリー: {{ blog.category }}
            </p>
            <p>
              作成日: {{ getDate(blog.created_at.toDate(), "/", ":") }}
            </p>
            <p>
              更新日: {{ blog.updated_at ? getDate(blog.updated_at.toDate(), "/", ":") : "" }}
            </p>
          </v-tooltip>
        </td>
        <template v-if="!responsive">
          <td>
            {{ blog.category }}
          </td>
          <td>
            {{ getDate(blog.created_at.toDate(), "/", ":") }}
          </td>
          <td>
            {{ blog.updated_at ? getDate(blog.updated_at.toDate(), "/", ":") : "" }}
          </td>
        </template>
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