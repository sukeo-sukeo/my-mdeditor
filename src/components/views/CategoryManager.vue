<script setup>
import { ref } from "@vue/reactivity";
import { computed } from "@vue/runtime-core";
import { appConfig } from "../../config/app.config";
import { makeTableHeads } from "../../lib/appUtill";
import { dataLoad, deleteData, existInBlog, updateData } from "../../lib/database";
import { getDate } from "../../lib/myUtills";
import AppModal from "../shared/AppModal.vue"

const props = defineProps({
  responsive: Boolean,
  routePath: String
});

const emits = defineEmits([
  "cate-click"
]);

const showModal = ref(false);

const categoryList = ref([]);
const pageKey = "category"
const theads = computed(() => makeTableHeads(appConfig.theadKeys[pageKey], false));

const init = async () => {
  categoryList.value = await dataLoad("category");
}

const deleteCate = async (id, name) => {
  if (await existInBlog(pageKey, name)) {
    alert("使用中です")
    return
  } else {
    await deleteData("category", id);
    await init();
  }
}

const updateTarget = ref({});
const setUpdate = (name, id) => {
  console.log(name, id);
  updateTarget.value.before = name
  updateTarget.value.after = name
  updateTarget.value.id = id
  showModal.value = true;
}
const updateCate = async () => {
  const tage = updateTarget.value;
  if (tage.before === tage.after) return
  
  if (await existInBlog(pageKey, tage.before)) {
    if (!confirm("使用中のカテゴリー名も変更されます")) return
  }

  await updateData(pageKey, tage.after, tage.id);

  showModal.value = false
  
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
        <td @click="props.routePath === '/category' ? setUpdate(cate.name, cate.id) : emits('cate-click', cate.name)" style="cursor: pointer;">
          {{ cate.name }}
        </td>
        <td>
          {{ getDate(cate.created_at.toDate(), "/", ":") }}
        </td>
        <td>
          <v-icon @click.stop="deleteCate(cate.id, cate.name)" class="float-right">mdi-delete</v-icon>
        </td>
      </tr>
    </tbody>
  </v-table>
  <AppModal v-if="showModal" @modal-close="showModal = false">
    <v-text-field class="w-100"  v-model="updateTarget.after"></v-text-field>
    <v-btn @click="updateCate" color="success">変更する</v-btn>
  </AppModal>
</template>