<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useGameStore } from "@/composables/useGameStore";
import { useKeyboardShortcuts } from "@/services/keyboardManager";
import ScoreSummaryCard from "@/components/results/ScoreSummaryCard.vue";
import StatsGrid from "@/components/results/StatsGrid.vue";
import AnimalsCollectionModal from "@/components/results/AnimalsCollectionModal.vue";

const gameStore = useGameStore();

const summary = computed(() => gameStore.scoreSummary.value);
const accuracy = computed(() => {
  if (!summary.value || summary.value.problemsAttempted === 0) return 0;
  return Math.round((summary.value.correctCount / summary.value.problemsAttempted) * 100);
});
const animalsCollected = computed(() => gameStore.animalsCollected.value);

// Animals modal state
const showAnimalsModal = ref(false);

function openAnimalsModal(): void {
  if (animalsCollected.value.length > 0) {
    showAnimalsModal.value = true;
  }
}

function closeAnimalsModal(): void {
  showAnimalsModal.value = false;
}

// Delay before Enter key works to prevent accidental game starts
const enterEnabled = ref(false);
const countdown = ref(3); // Start at 3 seconds

let countdownInterval: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  // Start countdown
  countdownInterval = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      enterEnabled.value = true;
      if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
      }
    }
  }, 1000);
});

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});

function startNewGame(): void {
  if (!enterEnabled.value) return; // Prevent click during countdown
  gameStore.resetGame();
}

// Keyboard shortcut - only enabled after delay
useKeyboardShortcuts([
  {
    key: "Enter",
    action: startNewGame,
    description: "Start new game",
    enabled: enterEnabled,
  },
  {
    key: "Escape",
    action: closeAnimalsModal,
    description: "Close modal",
  },
]);
</script>

<template>
  <main class="results-view">
    <header class="results-header">
      <div class="trophy-emoji" aria-hidden="true">🏆</div>
      <h1 class="results-title">Safari Complete!</h1>
      <p class="results-subtitle">Great job exploring math today!</p>
    </header>

    <ScoreSummaryCard v-if="summary" :summary="summary" />

    <StatsGrid v-if="summary" :accuracy="accuracy" :animals-collected="animalsCollected" @view-collection="openAnimalsModal" />

    <AnimalsCollectionModal :show="showAnimalsModal" :animals="animalsCollected" @close="closeAnimalsModal" />

    <button class="new-game-btn" :class="{ disabled: !enterEnabled }" :disabled="!enterEnabled" @click="startNewGame" :aria-label="!enterEnabled ? 'New Game, ready in ' + countdown + ' seconds' : 'Start New Safari Game'">
      <span class="btn-emoji" aria-hidden="true">🚀</span>
      <span class="btn-text">
        <span class="btn-main">New Safari!</span>
        <span class="btn-sub" v-if="enterEnabled">Press Enter or click to begin</span>
        <span class="btn-sub countdown" v-else>Ready in {{ countdown }}...</span>
      </span>
    </button>
  </main>
</template>

<style scoped>
.results-view {
  min-height: 100vh;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  max-width: 500px;
  margin: 0 auto;
}

.results-header {
  text-align: center;
}

.trophy-emoji {
  font-size: 4rem;
  animation: bounce 1s ease-in-out infinite;
}

.results-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin: 0.5rem 0 0;
}

.results-subtitle {
  font-size: 1.1rem;
  color: var(--color-text-muted);
  margin: 0.25rem 0 0;
}

.new-game-btn {
  width: 100%;
  padding: 1.25rem 2rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #34d399 0%, #059669 100%);
  border: 4px solid #059669;
  border-radius: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  transition: all 0.2s ease;
  box-shadow: 0 6px 20px rgba(5, 150, 105, 0.4);
}

.new-game-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(5, 150, 105, 0.5);
}

.new-game-btn:focus-visible {
  outline: 4px solid rgba(52, 211, 153, 0.5);
  outline-offset: 2px;
}

.btn-emoji {
  font-size: 2rem;
}

.btn-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.btn-main {
  font-size: 1.5rem;
  line-height: 1.2;
}

.btn-sub {
  font-size: 0.875rem;
  opacity: 0.9;
  font-weight: 500;
}

.btn-sub.countdown {
  animation: pulse 1s ease-in-out infinite;
}

/* Disabled state during countdown */
.new-game-btn.disabled {
  background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
  border-color: #6b7280;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.new-game-btn.disabled:hover {
  transform: none;
  box-shadow: none;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.9;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 480px) {
  .results-view {
    padding: 1rem;
  }

  .trophy-emoji {
    font-size: 3rem;
  }

  .results-title {
    font-size: 1.75rem;
  }
}
</style>
