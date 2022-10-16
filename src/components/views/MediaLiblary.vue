<script setup>
import { ref } from "@vue/reactivity";
import { computed } from "@vue/runtime-core";
import { dataLoad } from "../../lib/database";

const props = defineProps({
  col: { type: Number, default: 4 }
});
const emits = defineEmits([
  "img-click"
])

const imageList = ref([]);

const init = async () => {
  imageList.value = await dataLoad("image");
}

const col = computed(() => 12 / props.col)

init();

</script>

<template>
  <template v-if="imageList.length">
    <v-row>
      <v-col :cols="col" v-for="image in imageList" :key="image" @click="emits('img-click', image.imgURL)">
        <v-img :src="image.imgURL" :alt="image?.text" style="cursor: pointer;"></v-img>
      </v-col>
    </v-row>
  </template>
</template>