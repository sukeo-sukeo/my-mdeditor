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
import DraftManager from './DraftManager.vue';

const editor = ref("");

const title = ref("");
const content = ref("");
const category = ref("");
const tags = ref([]);
const thumnail = ref("");
const blogId = ref("")

const blogSingle = ref("");

const blogList = ref([]);
const imageList = ref([]);
const categoryList = ref([]);
const tagList = ref([]);

const clearable = () => {
  title.value = ""
  content.value = ""
  category.value = ""
  tags.value = []
  thumnail.value = ""
  blogId.value = ""
  blogSingle.value = ""
}

const init = async () => {
  clearable();
  imageList.value = await dataLoad("image");
  categoryList.value = await dataLoad("category");
  tagList.value = await dataLoad("tag");
  blogList.value = await dataLoad("blog");
}

init()

const save = async (bool) => {
  if (!confirm("保存しますか？")) return
  // 公開ボタンを押したとき
  if (bool.published) {
    if (!validation()) {
      alert("タイトル、カテゴリ、タグ、サムネイルを確認してください")
      return
    }
  }
  // 下書き保存ボタンを押したとき
  let updated_at;
  if (!bool.published) {
    if (blogSingle.value) {
      // 公開中の記事を下書き保存しようとしたとき
      if (blogSingle.value.published) {
        if (confirm("公開中の記事を変更しますか？")) {
          // 新規下書きは作成されない
          bool.published = true
          updated_at = true
        } else {
          // 新規下書き保存
          // 新規フィールド作成しdocIdを取得しそいつをいれる↓
          blogId.value = ""
        }
      }
    }
  }
  
  const data = {
    title: title.value,
    content: content.value,
    category: category.value,
    tags: typeof tags.value === "string" ? tags.value.split(",") : tags.value,
    created_at: serverTimestamp(),
    updated_at: updated_at ? serverTimestamp() : "",
    thumnail_url: thumnail.value,
    published: bool.published,
  }
  // ブログ記事のアップロード
  await upload(data, "blog", blogId.value);

  // カテゴリーのアップロード
  if (!categoryList.value.filter(d => d["name"] === data.category).length) {
    await upload({
      name: data.category,
      created_at: serverTimestamp(),
    }, "category")
  }

  // タグのアップロード
  for (const tag of data.tags) {
    if (!tagList.value.filter(d => d["name"] === tag).length) {
      await upload({ name:tag, created_at: serverTimestamp() }, "tag");
    }
  }

  alert(bool.published ? "公開しました！" : "下書きに保存しました！")
  init();
};

const validation = () => {
  if (!title.value) return false
  if (!thumnail.value) return false
  if (!category.value) return false
  if (!tags.value.length) return false
  return true
}

const uploadImg = async (files) => {
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
const insertTag = (val) => tags.value = tags.value.length ? `${tags.value},${val}` : val;
const drawDraft = (blog) => {
  console.log(blogId.value);
  if (blogId.value) {
    if (confirm("編集中のデータは失われます")) {
      title.value = blog.title
      content.value = blog.content
      category.value = blog.category
      tags.value = blog.tags
      thumnail.value = blog.thumnail_url
      blogId.value = blog.id
      blogSingle.value = blog
    }
  } else {
     title.value = blog.title
    content.value = blog.content
    category.value = blog.category
    tags.value = blog.tags
    thumnail.value = blog.thumnail_url
    blogId.value = blog.id
    blogSingle.value = blog
  }
}

const imgClick = (url) => {
  if (showSidebar.value.media) {
    content.value = insertWord(getPos(), content.value, imgLink("", url));
    return
  }
  if (showSidebar.value.thumnail) {
    thumnail.value = url
    return
  }
}

const closeSidebar = () => Object.keys(showSidebar.value).forEach(key => showSidebar.value[key] = false);

const showSidebar = ref({
  media: false,
  thumnail: false,
  category: false,
  tag: false,
  draft: false,
})

</script>

<template>
  <div>

    <div class="mask" v-if="Object.values(showSidebar).filter(bool => bool).length" @click="closeSidebar"></div>
  
    <!-- title & button -->
    <v-row class="align-center">
      <v-col cols="12" sm="7">
        <v-text-field label="タイトル" clearable variant="outlined" v-model="title"></v-text-field>
      </v-col>
      <v-col cols="12" sm="auto">
        <v-btn class="mx-1" color="success" @click="save({published: true})">投稿する</v-btn>
        <v-btn class="mx-1" color="grey" @click="save({published: false})">下書きに保存</v-btn>
        <v-btn class="mx-1" color="info" @click="showSidebar.media = true" icon="mdi-image">
        </v-btn>
        <v-btn class="mx-1" color="info" @click="showSidebar.draft = true" icon="mdi-file-download">
        </v-btn>
      </v-col>
    </v-row>
  
    <!-- editor -->
    <v-row>
      <span class="text-grey" v-if="blogId"> 
        <v-chip>編集中</v-chip>
      </span>
      <span v-else>
        <v-chip color="success">新規</v-chip>
      </span>
      <span v-if="content.length">
        <v-icon @click="clearable" color="grey" style="cursor: pointer;">mdi-close</v-icon>
      </span>
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
    <v-card class="pa-6 mt-10">
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field label="カテゴリー" 
          @click="showSidebar.category = true" variant="outlined" clearable v-model="category" readonly></v-text-field>
          <v-text-field label="タグ" 
          @click="showSidebar.tag = true" variant="outlined" clearable v-model="tags" readonly></v-text-field>
          <v-text-field label="サムネイル" 
          @click="showSidebar.thumnail = true" variant="outlined" clearable v-model="thumnail" readonly></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <p v-show="!thumnail" class="text-center">プレビュー</p>
          <v-img :src="thumnail"></v-img>
        </v-col>
      </v-row>
    </v-card>
  
    <!-- 以下サイドバー -->
    <!-- mediaLibrary -->
    <AppSidebar v-if="showSidebar.media || showSidebar.thumnail" @sidebar-close="closeSidebar">
      <MediaLiblary :col="1" @img-click="imgClick"/>
    </AppSidebar>
    <!-- categoryLibrary -->
    <AppSidebar v-if="showSidebar.category" @sidebar-close="closeSidebar">
      <v-text-field label="カテゴリー" variant="outlined" clearable v-model="category"></v-text-field>
      <CategoryManager @cate-click="insertCate" />
    </AppSidebar>
    <!-- tagLibrary -->
    <AppSidebar v-if="showSidebar.tag" @sidebar-close="closeSidebar">
      <v-text-field label="タグ" variant="outlined" clearable v-model="tags"></v-text-field>
      <TagsManager @tag-click="insertTag" />
    </AppSidebar>
    <!-- draftLibrary -->
    <AppSidebar v-if="showSidebar.draft" @sidebar-close="closeSidebar">
      <DraftManager @blog-click="drawDraft" />
    </AppSidebar>
  </div>
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