<script setup>
import { computed, ref, toRefs } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import { useRouter } from "vue-router";

import { appConfig } from "../../config/app.config.js";

const props = defineProps({
  responsive: Boolean,
  isLogin: String,
  photoURL: String,
});

const emits = defineEmits([
  "login-click", "logout-click", "sidebar-click"
])

const { isLogin } = toRefs(props);
const { responsive } = toRefs(props);

const router = useRouter()

const showSidebar = ref(false);
watch(showSidebar, () => {
  emits("sidebar-click", showSidebar.value)
});

</script>

<template>
  <v-app-bar elevation="0" class="select-none" color="transparent">
    
    <h3 class="ms-10" style="cursor: pointer;" @click="router.push('/')">my editor</h3>    
    <v-spacer></v-spacer>
    
    <template v-if="!props.isLogin">
      <template v-if="responsive">
        <v-spacer></v-spacer>
        <v-btn :icon="showSidebar ? 'mdi-close' : 'mdi-menu'" @click="showSidebar = !showSidebar"></v-btn>
      </template>
      <template v-else>
        <v-tabs>
          <router-link v-for="route in appConfig.routeNames" :key="route" :to="route">
            <v-tab class="text-black">
              {{ route === "/" ? appConfig.homeName : route }}
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
    <template v-else>
      <v-btn icon="mdi-account-circle-outline" color="white" @click="emits('login-click')">
      </v-btn>
    </template>
  </v-app-bar>
</template>