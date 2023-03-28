<template>
  <div class="space-y-4 md:space-y-6 max-w-sm mx-auto mb-4 md:mb-6">
    <div class="flex justify-between items-center">
      <h1>
        <nuxt-link class="flex items-center gap-1" to="/">
          <div class="w-10 h-10 i-xx-icons-palette fill-red-400"/>
          <img class="h-6 md:h-10 w-auto" src="/game/color-matching.png" alt="">
        </nuxt-link>
      </h1>
    </div>
    <div class="flex justify-between">
      <div>
        <div>The objective is to simply match identical colors or patterns</div>
      </div>
    </div>
  </div>
  <div class="md:max-w-sm mx-auto mb-4 md:mb-6 bg-white p-4 relative" :style="{'--timeout': `${timeout}s`}">
    <div class="space-y-4 " :class="{'blur-sm': showLeaderboard}">
      <div class="flex justify-between text-xs font-bold uppercase">
        <div class="flex items-center gap-3">
          <div class="text-green-500">
            <span>Score: </span>
            <span>{{ score }}</span>
          </div>
          <div
              class="w-4 h-4 i-xx-icons-music cursor-pointer text-gray-300"
              :class="{'text-green-500': enableSound}"
              @click="enableSound = !enableSound"
          />
        </div>
        <div class="">
          <span>Highest: </span>
          <span>{{ scoreHighest }}</span>
        </div>
      </div>
      <div class="flex justify-center">
        <div class="w-1/2" :style="{backgroundColor: currentColor}">
          <div class="pt-full relative">
            <div class="absolute -inset-2" :class="{running: runTimer}">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 208 208">
                <path
                    class="squiggle"
                    fill="none" :stroke="currentColor"
                    stroke-miterlimit="10"
                    stroke-width="5" d="M 0 0 L 208 0 L 208 208 L 0 208 Z "/>
              </svg>
            </div>
            <div v-if="!isPlaying" class="absolute inset-0 flex items-center justify-center">
              <div
                  v-if="countDown === -1"
                  class="btn text-white font-bold border-2 border-white"
                  @click="handlePlay"
              >Play
              </div>
              <span v-else class="font-bold text-xl">{{ countDown }}</span>
            </div>
          </div>
        </div>
      </div>
      <Transition>
        <div
            class="grid grid-cols-2 gap-4"
            :class="{'grid-cols-2': maxItems === 4, 'grid-cols-3': maxItems === 9, 'grid-cols-4': maxItems === 16}"
        >
          <div
              v-for="c in maxItems" :key="c"
              class="pt-full cursor-pointer"
              :style="{backgroundColor: colors[c - 1]}"
              @click="handleClick(colors[c - 1])"
          />
        </div>
      </Transition>
      <div class="flex justify-between">
        <div class="cursor-pointer text-sm underline flex gap-1 items-center" @click="showLeaderboard = true">
          <div class="i-xx-icons-seal w-3 h-3"></div>
          <span>Leaderboard</span>
        </div>
        <div class="text-sm underline">How to play?</div>
      </div>
    </div>
    <div v-if="showLeaderboard" class="z-10 absolute inset-0 flex flex-col justify-end">
      <div class="absolute inset-0 -z-10 cursor-pointer" @click="showLeaderboard = false"></div>
      <div class="bg-white p-4 -shadow rounded-tl-xl rounded-tr-xl">
        <div class="text-sm divide-y divide-dashed">
          <h3 class="font-bold uppercase text-xs pb-2">Leaderboard</h3>
          <div class="flex justify-between py-1">
            <span>Kris</span>
            <span class="font-bold">123</span>
          </div>
          <div class="flex justify-between py-1">
            <span>Kris</span>
            <span class="font-bold">123</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="space-y-4 md:space-y-6 max-w-sm mx-auto mb-4 md:mb-6">
    <div class="space-y-2">
      <h2 class="uppercase text-xl font-bold">What is Color-Guessing game?</h2>
      <p class="text-sm"><b>Color guessing game</b> is a type of puzzle game where players are shown many colors on the screen and must guess the correct specific color. The game is often designed with multiple levels of difficulty, where the colors become increasingly complex or obscure.
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "@vue/reactivity";
import {onMounted, watch} from "@vue/runtime-core";
import {useSeoMeta} from "nuxt/app";
import {useRuntimeConfig} from "#app";

const config = useRuntimeConfig()
const title = "Color-Guessing Game | ColorGuessing.com"
const desc = 'Color guessing game is a type of puzzle game where players are shown many colors on the screen and must guess the correct specific color. The game is often designed with multiple levels of difficulty, where the colors become increasingly complex or obscure.'
useSeoMeta({
  applicationName: 'Color-Guessing Game',
  title: title,
  description: desc,
  ogDescription: desc,
  ogTitle: title,
  ogImage: '/screenshot/color-matching.png',
  twitterCard: 'summary_large_image',
})
const MAX_TIME_OUT = 3
let SOUND_TAP: HTMLAudioElement;
let SOUND_OVER: HTMLAudioElement;

function shuffleArray(array: string[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

const palette = [
  "#00235B",
  "#245953",
  "#408E91",
  "#7AA874",
  "#98DFD6",
  "#CCD5AE",
  "#D864A9",
  "#D864A9",
  "#DFA67B",
  "#E21818",
  "#E9EDC9",
  "#EBB02D",
  "#EBB02D",
  "#F4B183",
  "#F7DB6A",
  "#FAEDCD",
  "#FEFAE0",
  "#FFDD83",
]

const colors = ref(["#7AA874",
  "#EBB02D",
  "#D864A9",
  "#F7DB6A",])
const currentColor = ref("#7AA874")

let checker: string | number | NodeJS.Timeout | undefined;

const showLeaderboard = ref(false)
const timeout = ref(MAX_TIME_OUT)
const countDown = ref(-1)
const score = ref(0)
const scoreHighest = ref(0)
const isPlaying = ref(false)
const isUserEnter = ref(false)
const runTimer = ref(false)
const maxItems = ref(4)
const enableSound = ref(true)

const draw = () => {
  colors.value = []
  const temp = shuffleArray(palette)
  currentColor.value = temp[Math.floor(Math.random() * maxItems.value)]
  colors.value = temp
}

const handleClick = (color: string) => {
  if (enableSound.value) SOUND_TAP?.play();
  if (isPlaying.value) {
    if (color === currentColor.value) {
      isUserEnter.value = true
      score.value++
      setTimeout(play, 500)
    } else {
      isPlaying.value = false
    }
    runTimer.value = false
  }
}

const handlePlay = () => {
  countDown.value = 3
  const it = setInterval(() => countDown.value--, 1000)
  const to = setTimeout(() => {
    countDown.value = -1
    clearTimeout(to)
    clearInterval(it)
    play()
  }, (countDown.value + 1) * 1000)
}

const play = () => {
  if (score.value < 10) {
    timeout.value = timeout.value - 0.1
  } else if (score.value < 20) {
    maxItems.value = Math.pow(3, 2)
  } else if (score.value < 30) {
    maxItems.value = Math.pow(4, 2)
  }else if (score.value < 40) {
    maxItems.value = Math.pow(5, 2)
  }
  draw()
  setTimeout(() => {
    isPlaying.value = true
    isUserEnter.value = false
    runTimer.value = true
    check()
  }, 500)
}

const check = () => {
  if (checker) clearTimeout(checker);
  checker = setTimeout(() => {
    if (!isUserEnter.value) {
      isPlaying.value = false
      runTimer.value = false
    }
    if (checker) clearTimeout(checker);
  }, timeout.value * 1000)
}

watch(isPlaying, (newValue) => {
  if (!newValue) {
    timeout.value = 3
    if (score.value > scoreHighest.value) scoreHighest.value = score.value;
    score.value = 0
    maxItems.value = Math.pow(2, 2)
    if (enableSound.value) SOUND_OVER?.play()
  }
})

onMounted(() => {
  SOUND_TAP = new window.Audio("/sound/tap.wav")
  SOUND_OVER = new window.Audio("/sound/over.wav")
})
</script>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.running .squiggle {
  stroke-dasharray: 832;
  stroke-dashoffset: 832;
  animation: draw linear forwards;
  animation-duration: var(--timeout);
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
