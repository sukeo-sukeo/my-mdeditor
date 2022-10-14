<script setup>
import { ref } from '@vue/reactivity';
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { upload } from "../../lib/database.js"
import { appConfig } from "../../config/app.config.js"
import { storage } from "../../config/firebase.js";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";

const title = ref("");
const content = ref("");
const category = ref("");
const tags = ref([]);

const save = (published) => {
  if (published) {
    if (!validation()) return;
  }
  const data = {
    title: title.value,
    content: content.value,
    category: category.value,
    tags: tags.value,
    published,
  }
  upload(data, "blog")
};

const validation = () => {
  if (!title.value) return false
  if (!category.value) return false
  if (!tags.value.length) return false
  return true
}

const uploadImg = async (files, callback) => {
  console.log("img保存!")
  console.log(files[0]);

  const sRef = storageRef(storage, `images/${files[0].name}`);

  await uploadBytes(sRef, files[0]);
  const imgURL = await getDownloadURL(sRef)
  console.log(imgURL);
  
  // await upload(formData, "images")
  // callback(res.map((item) => console.log(item.data.url)));
}

</script>

<template>
  <v-row>
    <v-text-field label="タイトル" variant="outlined" v-model="title"></v-text-field>
  </v-row>
  <v-row>
    <v-btn @click="save({published: true})">投稿する</v-btn>
    <v-btn @click="save({published: false})">下書きに保存</v-btn>
    <md-editor style="text-align: left;" v-model="content"
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