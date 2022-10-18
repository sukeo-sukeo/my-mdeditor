<script setup>

const props = defineProps({
  showColseBtn: { type: Boolean, default: true },
  barWidth: {type: Number, default: 50}
})
const emits = defineEmits([
  "sidebar-close"
])

</script>

<template>
 <v-card class="px-6 py-4 h-100" :class="`w-${props.barWidth}`" style="position:fixed; z-index: 100; top: 0; right: 0; overflow: scroll;">
  <v-btn v-show="props.showColseBtn" text @click="emits('sidebar-close')"> 閉じる </v-btn>
  <v-spacer></v-spacer>
  <slot />
</v-card>
</template>