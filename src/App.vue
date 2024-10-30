<script setup lang="ts">
import { ref } from 'vue'
import { Problem } from './types'
import { generateProblem } from './utils/mathGen'
import TestPalette from './components/TestPalette.vue'

const score = ref(0)
const answer = ref('')
const showCelebration = ref(false)

// Safari animals for different problem types
const safariAnimals = ['🦁', '🦒', '🦊', '🦘', '🦛', '🐘', '🦏', '🦬', '🦓']

// Sample problem - in real app would come from mathGen utility
// const problem: Problem = {
//   operand1: 7,
//   operand2: 6,
//   operator: '×',
//   answer: 42,
//   animal: '🦁',
//   difficulty: 'easy'
// }

const problem = generateProblem('medium')

const checkAnswer = () => {
  showCelebration.value = true
  setTimeout(() => {
    showCelebration.value = false
  }, 2000)
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50 p-4 relative overflow-hidden">
    <!-- Safari-themed background elements -->
    <div class="absolute inset-0 pointer-events-none opacity-10">
      <div class="text-8xl select-none">
        🌴 🌳 🌿 🌴 🌳 🌿 🌴 🌳 🌿
      </div>
    </div>

    <!-- Top Bar - Safari themed -->
    <div class="max-w-4xl mx-auto mb-8">
      <h1 class="text-4xl font-bold text-center mb-4 text-orange-800">
        Sum<span class="text-yellow-600">Safari</span>
        <span class="text-2xl"> 🦁</span>
      </h1>

      <div class="flex justify-between items-center bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
        <div class="flex items-center gap-2">
          <span class="text-2xl">🏆</span>
          <span class="text-lg font-bold text-orange-800">Score: {{ score }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-2xl">⏳</span>
          <span class="text-lg font-bold text-orange-800">1:30</span>
        </div>
      </div>
    </div>

    <!-- Main Game Area -->
    <div class="max-w-4xl mx-auto">
      <!-- Problem Card -->
      <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 mb-6 border-2 border-orange-200">
        <div class="text-center space-y-6">
          <!-- Animal character -->
          <div class="text-6xl md:text-7xl animate-bounce">
            {{ problem.animal }}
          </div>

          <!-- Problem Display -->
          <div class="text-4xl md:text-6xl lg:text-7xl font-bold text-orange-800">
            {{ problem.operand1 }} {{ problem.operator }} {{ problem.operand2 }} = ?
          </div>

          <!-- Answer Input -->
          <div class="max-w-xs mx-auto w-full">
            <input
              type="number"
              v-model="answer"
              class="w-full text-3xl md:text-4xl text-center p-4 border-2 border-orange-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors bg-white/90"
              placeholder="?"
            >
          </div>
        </div>
      </div>

      <!-- Controls - Safari themed buttons -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          @click="checkAnswer"
          class="bg-green-300 hover:bg-green-400 text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
        >
          <span>🎯</span> Check
        </button>
        <button
          class="bg-yellow-300 hover:bg-yellow-400 text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
        >
          <span>⏭️</span> Skip
        </button>
        <button
          class="bg-blue-300 hover:bg-blue-400 text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
        >
          <span>💡</span> Hint
        </button>
        <button
          class="bg-purple-300 hover:bg-purple-400 text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
        >
          <span>🔄</span> New
        </button>
      </div>

      <!-- Feedback Area -->
      <div class="mt-6">
        <div class="bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-xl p-4 flex items-start gap-2">
          <span class="text-2xl">🎪</span>
          <p class="text-sm text-orange-800 font-medium">
            Help our safari friend solve this problem! Each correct answer helps us discover more animals!
          </p>
        </div>
      </div>
    </div>

    <!-- <TestPalette /> -->

    <!-- Celebration overlay -->
    <div v-if="showCelebration" class="fixed inset-0 pointer-events-none flex items-center justify-center">
      <div class="text-8xl animate-bounce">
        {{ safariAnimals[Math.floor(Math.random() * safariAnimals.length)] }}
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8,0,1,1);
  }
  50% {
    transform: none;
    animation-timing-function: cubic-bezier(0,0,0.2,1);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}
</style>