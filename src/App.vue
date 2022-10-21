<script setup>
import { ref } from '@vue/reactivity';
import { computed, watch } from '@vue/runtime-core';
import { useRoute } from 'vue-router';
import AppHeader from './components/shared/AppHeader.vue';
import AppSidebar from './components/shared/AppSidebar.vue';
import { appConfig } from './config/app.config';

const showSidebar = ref(false);
const sidebarHundle = (bool) => showSidebar.value = bool;
const route = useRoute();
const routePath = computed(() => route.path)

watch(routePath, () => {
  console.log(routePath.value);
})

</script>

<template>
 <v-app>
   <AppHeader @sidebar-click="sidebarHundle" />
   <AppSidebar :showColseBtn="false" v-if="showSidebar">
    <v-list class="text-center mt-5">
      <router-link v-for="route in appConfig.routeNames" :key="route" :to="route">
        <v-list-item>
          {{ route === "/" ? appConfig.homeName : route }}
        </v-list-item>
        <v-divider></v-divider>
      </router-link>
    </v-list>
   </AppSidebar>
   <v-container class="mt-16">
    <router-view :routePath="routePath"></router-view>
   </v-container>
 </v-app>
</template>

<style>
a {
  color: black;
  text-decoration: none;
}
</style>