<script setup>
import { ref } from '@vue/reactivity';
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { dataLoad, upload, uploadImage } from "../../lib/database.js"


import { uuidv4 } from "@firebase/util";
import { serverTimestamp } from '@firebase/firestore';
import { onMounted } from '@vue/runtime-core';

const editor = ref("")

const title = ref("");
const content = ref("");
const category = ref("");
const tags = ref([]);

const imageList = ref([]);
const categoryList = ref([]);
const tagList = ref([]);

const init = async () => {
  imageList.value = await dataLoad("image");
  categoryList.value = await dataLoad("category");
  tagList.value = await dataLoad("tag");
}

init()

// onMounted(() => {
//   setTimeout(() => {
//     console.log(imageList.value);
//     console.log(categoryList.value);
//     console.log(tagList.value);
//   }, 1000)
// })

const save = async (published) => {
  if (published) {
    if (!validation()) return;
  }
  const data = {
    title: title.value,
    content: content.value,
    category: category.value,
    tags: tags.value.split(","),
    created_at: serverTimestamp(),
    updated_at: "",
    thumnail_url: "",
    published,
  }
  // ブログ記事のアップロード
  await upload(data, "blog");

  // カテゴリーのアップロード
  if (!categoryList.value.includes(data.category)) {
    await upload({
      category: data.category,
      created_at: serverTimestamp(),
    }, "category")
  }

  // タグのアップロード
  for (const tag of data.tags) {
    if (!tagList.value.includes(tag)) {
      await upload({ tag, created_at: serverTimestamp() }, "tag");
    }
  }
  init();
};

const validation = () => {
  if (!title.value) return false
  if (!category.value) return false
  if (!tags.value.length) return false
  return true
}

const uploadImg = async (files) => {
  console.log("img保存!")

  for (const file of files) {
    const uuid = uuidv4();
    const imgURL = await uploadImage(file, uuid);
    const data = {
      storageId: uuid,
      imgURL,
      name: file.name,
      category: category.value,
      tags: tags.value,
      created_at: serverTimestamp()
    }
    await upload(data, "image");

    const word = `\n![${data.name}](${imgURL})\n`;
    content.value = insertWord(getPos(), content.value, word);
    
  }
}

const getPos = () => {
  const textarea = editor.value.$el.children[1].children[0].children[0];
  const pos = textarea.selectionStart;
  return pos
}

const insertWord = (pos, text, word) => {
  const before = text.substr(0, pos);
  const after = text.substr(pos, text.length);
  return before + word + after;
}

</script>

<template>
  <v-row>
    <v-text-field label="タイトル" variant="outlined" v-model="title"></v-text-field>
  </v-row>
  <v-row>
    <v-btn @click="save({published: true})">投稿する</v-btn>
    <v-btn @click="save({published: false})">下書きに保存</v-btn>
    <md-editor ref="editor" style="text-align: left;" v-model="content"
     preview-theme="github"
     language="en-US"
     @on-save="save({published: false})"
     @on-upload-img="uploadImg"
     />
  </v-row>
  <v-row>
    <v-card class="w-100 pa-6">
      <v-text-field label="カテゴリー" variant="outlined" v-model="category"></v-text-field>
      <v-text-field label="タグ" variant="outlined" v-model="tags"></v-text-field>
    </v-card>
  </v-row>
</template>

<style scoped>

</style>