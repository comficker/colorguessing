<template>
  <main
    id="main"
    class="flex flex-col text-emerald-800 min-h-full gap-4 font-sans px-8"
    :class="{'bg-emerald-50': !isTelegram}">
    <Header v-if="!isTelegram"/>
    <div class="flex-1 flex flex-col justify-center">
      <slot class="w-full"/>
    </div>
    <Footer v-if="!isTelegram"/>
  </main>
</template>
<script setup lang="ts">
import {useRoute} from "nuxt/app";
import {ref} from "@vue/reactivity";

const route = useRoute()
const isTelegram = ref(route.hash.includes("#tgWebAppData"))
</script>
<style>
html {
  scroll-behavior: smooth;
}

body {
  background: #fff;
  color: #776e65;
}

#main {
}
</style>
