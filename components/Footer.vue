<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {

    }
  },
})
</script>

<template>
  <div class="w-full mt-4 font-bold text-sm text-emerald-600 mb-10 max-w-sm mx-auto">
    <p>Copyright © 2023 ColorGuessing.com.</p>
  </div>
  <button class="fixed right-0 top-0 rounded-bl-xl bg-yellow-300 px-4 p-1 font-bold text-sm cursor-pointer" data-feedback-fish>
    Send Feedback
  </button>
</template>
