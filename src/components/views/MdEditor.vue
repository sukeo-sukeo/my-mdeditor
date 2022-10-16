<script setup>
import { reactive, ref, toRefs } from '@vue/reactivity';
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { dataLoad, upload, uploadImage } from "../../lib/database.js"
import { uuidv4 } from "@firebase/util";
import { serverTimestamp } from '@firebase/firestore';
import { onMounted } from '@vue/runtime-core';
import AppSidebar from '../shared/AppSidebar.vue';
import MediaLiblary from './MediaLiblary.vue';
import CategoryManager from './CategoryManager.vue';
import TagsManager from './TagsManager.vue'

const editor = ref("");

const title = ref("");
const content = ref("");
const category = ref("");
const tags = ref([]);

const blogList = ref([]);
const imageList = ref([]);
const categoryList = ref([]);
const tagList = ref([]);

const init = async () => {
  imageList.value = await dataLoad("image");
  categoryList.value = await dataLoad("category");
  tagList.value = await dataLoad("tag");
  blogList.value = await dataLoad("blog");
}

init()

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
  if (!categoryList.value.filter(d => d["name"] === data.category)) {
    await upload({
      name: data.category,
      created_at: serverTimestamp(),
    }, "category")
  }

  // タグのアップロード
  for (const tag of data.tags) {
    if (!tagList.value.filter(d => d["name"] === tag)) {
      await upload({ name:tag, created_at: serverTimestamp() }, "tag");
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
      text: "",
      created_at: serverTimestamp()
    }
    await upload(data, "image");

    const word = imgLink(data.name, imgURL);
    content.value = insertWord(getPos(), content.value, word);
    
  }
}

const getPos = () => {
  const textarea = editor.value.$el.children[1].children[0].children[0];
  const pos = textarea.selectionStart;
  return pos
}

const imgLink = (name, url) => `\n![${name}](${url})\n`;

const insertWord = (pos, text, word) => {
  const before = text.substr(0, pos);
  const after = text.substr(pos, text.length);
  return before + word + after;
}

const insertCate = (val) => category.value = val;
const insertTag = (val) => tags.value.push(val);

const imgClick = (url) => {
  content.value = insertWord(getPos(), content.value, imgLink("", url));
}

const showSidebar = ref({
  media: false,
  category: false,
  tag: false,
})

</script>

<template>
  <div class="mask" v-if="Object.values(showSidebar).filter(bool => bool).length" @click="Object.keys(showSidebar).forEach(key => showSidebar[key] = false )"></div>

  <!-- title & button -->
  <v-row class="align-center">
    <v-col cols="12" sm="7">
      <v-text-field label="タイトル" variant="outlined" v-model="title"></v-text-field>
    </v-col>
    <v-col cols="12" sm="auto">
      <v-btn class="mx-1" color="success" @click="save({published: true})">投稿する</v-btn>
      <v-btn class="mx-1" color="grey" @click="save({published: false})">下書きに保存</v-btn>
      <v-btn class="mx-1" color="info" @click="showSidebar.media = true" icon="mdi-image">
      </v-btn>
    </v-col>
  </v-row>

  <!-- editor -->
  <v-row>
    <md-editor ref="editor" 
      v-model="content"
      style="text-align: left;" 
      preview-theme="github"
      language="en-US"
      @on-save="save({published: false})"
      @on-upload-img="uploadImg"
      />
  </v-row>

  <!-- metaデータ付与場 -->
  <v-row>
    <v-card class="w-100 pa-6">
      <v-text-field label="カテゴリー" @click="showSidebar.category = true" variant="outlined" clearable v-model="category" readonly></v-text-field>
      <v-text-field label="タグ" 
      @click="showSidebar.tag = true" variant="outlined" clearable v-model="tags" readonly></v-text-field>
    </v-card>
  </v-row>

  <!-- 以下サイドバー -->
  <!-- mediaLibrary -->
  <AppSidebar v-if="showSidebar.media" @sidebar-close="showSidebar.media = false">
    <MediaLiblary :col="1" @img-click="imgClick"/>
  </AppSidebar>
  <!-- categoryLibrary -->
  <AppSidebar v-if="showSidebar.category" @sidebar-close="showSidebar.category = false">
    <v-text-field label="カテゴリー" variant="outlined" clearable v-model="category"></v-text-field>
    <CategoryManager @cate-click="insertCate" />
  </AppSidebar>
  <!-- tagLibrary -->
  <AppSidebar v-if="showSidebar.tag" @sidebar-close="showSidebar.tag = false">
    <v-text-field label="タグ" variant="outlined" clearable v-model="tags"></v-text-field>
    <TagsManager @tag-click="insertTag" />
  </AppSidebar>
</template>

<style scoped>
.mask {
  /* z-index: 1; */
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, .5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

</style>