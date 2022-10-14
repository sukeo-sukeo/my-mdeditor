<script setup>
import { ref } from '@vue/reactivity';
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { upload } from "../../lib/database.js"

const title = ref("");
const content = ref("");


const save = (place) => {
  if (!validation()) return;
  const data = {
    title: title.value,
    content: content.value
  }
  upload(data, place)
};

const validation = () => {
  if (!title.value) return false
  return true
}

const uploadImg = async (files, callback) => {
  console.log("img保存!")
  console.log(files);
  const res = await Promise.all(
    files.map((file) => {
      return new Promise((rev, rej) => {
        const form = new FormData();
        form.append('file', file);

        // axios
        //   .post('/api/img/upload', form, {
        //     headers: {
        //       'Content-Type': 'multipart/form-data'
        //     }
        //   })
        //   .then((res) => rev(res))
        //   .catch((error) => rej(error));
      });
    })
  );

  callback(res.map((item) => console.log(item.data.url)));
}

</script>

<template>
  <div>
    <input type="text" v-model="title">
  </div>
  <div>
    <button class="bg-green-500 p-2 rounded" @click="save('publish')">投稿する！</button>
    <md-editor style="text-align: left;" v-model="content"
     preview-theme="github"
     language="en-US"
     @on-save="save('draft')"
     @on-upload-img="uploadImg"
     />
  </div>
</template>

<style scoped>

</style>