<script setup>
import { ref } from "@vue/reactivity";
import { computed } from "@vue/runtime-core";
import { dataLoad, deleteData, deleteStorage } from "../../lib/database";

const props = defineProps({
  routePath: String,
  col: { type: Number, default: 3 }
});
const emits = defineEmits([
  "img-click"
])

const imageList = ref([]);
const col = computed(() => 12 / props.col)

const init = async () => {
  imageList.value = await dataLoad("image");
}

const deleteImage = async (image) => {
  await deleteStorage(image.id, image.name);
  await deleteData("image", image.id);
  await init();
}

console.log(props.routePath);

init();

</script>

<template>
  <template v-if="imageList.length">
    <v-row>
      <v-col :cols="col" class="d-flex align-end" v-for="image in imageList" :key="image" @click="emits('img-click', image.imgURL)">
        <v-img :src="image.imgURL" :alt="image?.text" style="cursor: pointer;"></v-img>
        <v-icon @click.stop="deleteImage(image)">mdi-delete</v-icon>
      </v-col>
    </v-row>
  </template>
</template>