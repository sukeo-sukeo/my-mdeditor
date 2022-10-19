<script setup>
import { ref } from "@vue/reactivity";
import { dataLoad, deleteData } from "../../lib/database";

const emits = defineEmits([
  "cate-click"
])
const categoryList = ref([]);

const init = async () => {
  categoryList.value = await dataLoad("category");
}

const deleteCate = async (id) => {
  await deleteData("category", id);
  await init();
}

init()
</script>

<template>
  <v-list v-if="categoryList.length">
    <v-list-item v-for="cate in categoryList" :key="cate" @click="emits('cate-click', cate.name)">
      <span>
        {{ cate.name }}
      </span>
       <v-icon @click.stop="deleteCate(cate.id)" class="float-right">mdi-delete</v-icon>
       <v-divider class="my-2"></v-divider>
    </v-list-item>
  </v-list>
</template>