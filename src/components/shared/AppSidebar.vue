<script setup>

const props = defineProps({
  showColseBtn: { type: Boolean, default: true },
  barWidth: {type: Number, default: 50},
  color: { type: String, default: "white" },
  zIndex: { type: Number, default: 10000 }
})
const emits = defineEmits([
  "sidebar-close"
])

</script>

<template>
 <v-card class="px-6 py-4 h-100" :class="`bg-${props.color}`" style="position:fixed; top: 0; right: 0; overflow: scroll;" :style="`width: ${props.barWidth}%; z-index: ${props.zIndex};`">
  <v-btn v-show="props.showColseBtn" text @click="emits('sidebar-close')"> 閉じる </v-btn>
  <v-spacer></v-spacer>
  <slot />
</v-card>
</template>