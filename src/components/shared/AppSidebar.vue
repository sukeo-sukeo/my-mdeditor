<script setup>
const emits = defineEmits([
  "sidebar-close"
])

</script>

<template>
 <v-card class="px-6 py-4 w-50 h-100" style="position:fixed; z-index: 100; top: 0; right: 0; overflow: scroll;">
  <v-btn text @click="emits('sidebar-close')"> 閉じる </v-btn>
  <v-spacer></v-spacer>
  <slot />
</v-card>
</template>