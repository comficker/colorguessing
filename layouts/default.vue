<template>
  <main id="main" class="flex flex-col bg-emerald-50 text-emerald-800 min-h-full gap-4 font-sans px-8">
    <Header/>
    <div class="flex-1">
      <slot class="w-full"/>
    </div>
    <Footer/>
  </main>
</template>
<script>
export default {
}
</script>
<style>
html {
  scroll-behavior: smooth;
}

body {
  background: #faf8ef;
  color: #776e65;
}

#main {
}
</style>
