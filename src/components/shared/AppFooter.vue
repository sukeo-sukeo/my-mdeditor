<script setup>

</script>

<template>
<v-footer class="justify-center" color="transparent">
  <v-card elevation="0" rounded="0" class="text-center w-full" color="transparent">
    <v-card-text>
      <a  href="https://github.com/sukeo-sukeo" target="_blank" rel="noopener noreferrer" class="no-underline"> @sukeo </a>
      {{ ' ' + new Date().getFullYear() }}. Some rights reserved.
    </v-card-text>
  </v-card>
</v-footer>
</template>

<style scoped>
footer {
  position: absolute;
  bottom: 0;
  right: 0;
}

.v-card-text, a {
  color: white;
}
</style>