<script setup>
import { ref, toRefs } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";
import { useDisplay } from "vuetify/lib/framework.mjs";

import { appConfig } from "../config/app.config";

const props = defineProps({
  isLogin: String,
  photoURL: String,
});

const emits = defineEmits([
  "login-click", "logout-click", "sidebar-open", "sidebar-close"
])

const { isLogin } = toRefs(props);

const display = useDisplay()
const xs = ref(display.xs.value);

const selected = ref()

const route = useRoute();
const router = useRouter();
const currentURL = ref("");
const currentMeta = ref("");

const sideBarBtnIcon = ref(true);

const openSideBar = () => {
  sideBarBtnIcon.value = !sideBarBtnIcon.value
  if (!sideBarBtnIcon.value) {
    emits('sidebar-open');
  } else {
    emits('sidebar-close')
  }
}

const giveup = () => {
  if (confirm("あきらめますか？\nクイズの状態は保存されません")) {
    router.push("/quizmenu")
  }
}

watch(isLogin, () => {
  if (!isLogin.value) {
    sideBarBtnIcon.value = true
  }
})

watch(route, () => {
  sideBarBtnIcon.value = true
  emits('sidebar-close')
  currentURL.value = route.path
  currentMeta.value = route.path.split('/')[1]
  selected.value = appConfig.routeList.map(rl => Object.values(rl)[0]).indexOf(currentURL.value);
})

</script>

<template>
<v-app-bar elevation="0" class="select-none" color="transparent">
  
  <template v-if="props.isLogin">
    
    <v-spacer></v-spacer>

    <!-- 画面幅でメニューの出し分け -->
    <template v-if="xs && currentMeta !== 'quiz'">
      <v-icon v-if="sideBarBtnIcon" @click="openSideBar" class="text-white me-5">
        mdi-menu
      </v-icon>
      <v-icon v-else @click="openSideBar" class="text-white me-5">
        mdi-close
      </v-icon>
    </template>
    <template v-else>
      <template v-if="currentMeta === 'quiz'">
        <v-btn @click="giveup" class="bg-yellow-lighten-1" elevation="5">
          give up
        </v-btn>
      </template>
      <template v-else>
        <v-tabs v-model="selected">
          <router-link v-for="route in appConfig.routeList" :key="route" :to="Object.values(route)[0]">
            <v-tab>
              {{ Object.values(route)[0] === "/" ? "home" : Object.keys(route)[0] }}
            </v-tab>
          </router-link>
        </v-tabs>
        <v-btn icon @click="emits('logout-click')">
          <v-avatar>
            <img :src="props.photoURL" class="w-100">
          </v-avatar>
        </v-btn>
      </template>
    </template>

  </template>
  <template v-else>
    <v-btn icon color="white" @click="emits('login-click')">
      <v-icon>mdi-account-circle-outline</v-icon>
    </v-btn>
  </template>

</v-app-bar>
</template>

<style scoped>
a {
  color: white;
}
</style>