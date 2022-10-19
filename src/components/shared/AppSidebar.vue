<script setup>

const props = defineProps({
  showColseBtn: { type: Boolean, default: true },
  barWidth: {type: Number, default: 50},
  color: {type: String, default: "white"}
})
const emits = defineEmits([
  "sidebar-close"
])

</script>

<template>
 <v-card class="px-6 py-4 h-100" :class="`bg-${props.color}`" style="position:fixed; z-index: 10000; top: 0; right: 0; overflow: scroll;" :style="`width: ${props.barWidth}%;`">
  <v-btn v-show="props.showColseBtn" text @click="emits('sidebar-close')"> 閉じる </v-btn>
  <v-spacer></v-spacer>
  <slot />
</v-card>
</template>