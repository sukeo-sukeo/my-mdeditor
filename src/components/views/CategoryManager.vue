<script setup>
import { ref } from "@vue/reactivity";
import { computed } from "@vue/runtime-core";
import { appConfig } from "../../config/app.config";
import { makeTableHeads } from "../../lib/appUtill";
import { dataLoad, deleteData } from "../../lib/database";
import { getDate } from "../../lib/myUtills";

const emits = defineEmits([
  "cate-click"
]);

const categoryList = ref([]);
const pageKey = "category"
const theads = computed(() => makeTableHeads(appConfig.theadKeys[pageKey], false));

const init = async () => {
  categoryList.value = await dataLoad("category");
}

const deleteCate = async (id) => {
  // blogを走査
  // 使われている
  // 削除できません
  // 使われていない
  // 削除
  await deleteData("category", id);
  await init();
}

const updateCate = () => {
  // blogを走査
  // 使われている
  // 公開済みの記事のカテゴリも変更されます
  // 使われていない
  // 変更
}

init()
</script>

<template>
  <v-table v-if="categoryList.length" style="overflow: scroll;">
    <thead>
      <tr>
        <th v-for="thead in theads" :key="thead">
          {{ thead }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="cate, idx in categoryList" :key="cate">
        <td>
          {{ idx + 1 }}
        </td>
        <td @click="emits('cate-click', cate.name)">
          {{ cate.name }}
        </td>
        <td>
          {{ getDate(cate.created_at.toDate(), "/", ":") }}
        </td>
        <td>
          <v-icon @click.stop="deleteCate(cate.id)" class="float-right">mdi-delete</v-icon>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>