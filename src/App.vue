<script setup>
import { ref } from '@vue/reactivity';
import AppHeader from './components/shared/AppHeader.vue';
import AppSidebar from './components/shared/AppSidebar.vue';
import { appConfig } from './config/app.config';

const showSidebar = ref(false);
const sidebarHundle = (bool) => showSidebar.value = bool;

</script>

<template>
 <v-app>
   <AppHeader @sidebar-click="sidebarHundle" />
   <AppSidebar :showColseBtn="false" v-if="showSidebar">
     <router-link v-for="route in appConfig.routeNames" :key="route" :to="route">
      <v-list class="mt-3">
        <v-list-item>
          {{ route === "/" ? appConfig.homeName : route }}
        </v-list-item>
      </v-list>
     </router-link>
   </AppSidebar>
   <v-container class="mt-16">
    <router-view></router-view>
  </v-container>
 </v-app>
</template>

<style>
a {
  color: black;
  text-decoration: none;
}
</style>