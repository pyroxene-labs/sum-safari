<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useGameStore } from "@/composables/useGameStore";
import { SCORING } from "@/types";
import {
  useKeyboardShortcuts,
} from "@/services/keyboardManager";

const gameStore = useGameStore();

const summary = computed(() => gameStore.scoreSummary.value);
const session = computed(() => gameStore.session.value);
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

// Accuracy calculation and level
const accuracy = computed(() => {
  if (!summary.value || summary.value.problemsAttempted === 0) return 0;
  return Math.round((summary.value.correctCount / summary.value.problemsAttempted) * 100);
});

const accuracyLevel = computed(() => {
  if (accuracy.value >= 75) return 'high';
  if (accuracy.value >= 45) return 'medium';
  return 'low';
});

const accuracyEmoji = computed(() => {
  if (accuracy.value >= 75) return '✅';
  if (accuracy.value >= 45) return '⚠️';
  return '📚';
});

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
  <div class="results-view">
    <header class="results-header">
      <div class="trophy-emoji">🏆</div>
      <h1 class="results-title">Safari Complete!</h1>
      <p class="results-subtitle">Great job exploring math today!</p>
    </header>

    <div class="score-card" v-if="summary">
      <div class="final-score">
        <span class="score-label">Final Score</span>
        <span class="score-number">{{ summary.finalScore }}</span>
      </div>

      <div class="score-breakdown">
        <h3 class="breakdown-title">📊 Score Breakdown</h3>

        <div class="breakdown-row">
          <span class="breakdown-label">
            <span class="row-emoji">🎯</span>
            Problems Attempted
          </span>
          <span class="breakdown-value">{{ summary.problemsAttempted }}</span>
        </div>

        <div class="breakdown-row positive">
          <span class="breakdown-label">
            <span class="row-emoji">✅</span>
            Correct Answers
          </span>
          <span class="breakdown-value">
            {{ summary.correctCount }}
            <span class="points">+{{ summary.basePoints }}</span>
          </span>
        </div>

        <div v-if="summary.skippedCount > 0" class="breakdown-row negative">
          <span class="breakdown-label">
            <span class="row-emoji">⏭️</span>
            Skipped
          </span>
          <span class="breakdown-value">
            {{ summary.skippedCount }}
            <span class="points">-{{ summary.skippedCount * SCORING.SKIP_PENALTY }}</span>
          </span>
        </div>

        <div v-if="summary.timeBonusPoints > 0" class="breakdown-row positive">
          <span class="breakdown-label">
            <span class="row-emoji">⚡</span>
            Time Bonus
          </span>
          <span class="breakdown-value">
            <span class="points">+{{ summary.timeBonusPoints }}</span>
          </span>
        </div>

        <div v-if="summary.hintsUsed > 0" class="breakdown-row negative">
          <span class="breakdown-label">
            <span class="row-emoji">💡</span>
            Hints Used
          </span>
          <span class="breakdown-value">
            {{ summary.hintsUsed }}
            <span class="points">-{{ summary.hintPenalty }}</span>
          </span>
        </div>

        <div v-if="summary.excessHintPenalty > 0" class="breakdown-row negative warning">
          <span class="breakdown-label">
            <span class="row-emoji">⚠️</span>
            Excess Hint Penalty
            <span class="hint-explanation">(&gt;2 hints/min)</span>
          </span>
          <span class="breakdown-value">
            <span class="points">-{{ summary.excessHintPenalty }}</span>
          </span>
        </div>

        <div class="breakdown-divider"></div>

        <div class="breakdown-row subtotal">
          <span class="breakdown-label">Subtotal</span>
          <span class="breakdown-value">{{ summary.subtotal }}</span>
        </div>

        <div class="breakdown-row multiplier">
          <span class="breakdown-label">
            <span class="row-emoji">🎚️</span>
            Difficulty ({{ session?.settings.difficulty }})
          </span>
          <span class="breakdown-value">×{{ summary.difficultyMultiplier }}</span>
        </div>
      </div>
    </div>

    <div class="stats-grid" v-if="summary">
      <div class="stat-card" :class="`accuracy-${accuracyLevel}`">
        <span class="stat-emoji">{{ accuracyEmoji }}</span>
        <span class="stat-value">{{ accuracy }}%</span>
        <span class="stat-label">Accuracy</span>
      </div>
      <div 
        class="stat-card animals-card" 
        :class="{ clickable: animalsCollected.length > 0 }"
        @click="openAnimalsModal"
      >
        <span class="stat-emoji">🦁</span>
        <span class="stat-value">{{ summary.correctCount }}</span>
        <span class="stat-label">Animals Found</span>
        <span v-if="animalsCollected.length > 0" class="tap-hint">Tap to view</span>
      </div>
    </div>

    <!-- Animals Modal -->
    <Teleport to="body">
      <div v-if="showAnimalsModal" class="modal-overlay" @click="closeAnimalsModal">
        <div class="modal animals-modal" @click.stop>
          <div class="modal-emoji">🎉</div>
          <h3 class="modal-title">Your Safari Collection!</h3>
          <p class="modal-message">You discovered {{ animalsCollected.length }} animals</p>
          <div class="animals-grid">
            <span v-for="(animal, index) in animalsCollected" :key="index" class="animal-item">
              {{ animal }}
            </span>
          </div>
          <button class="close-animals-btn" @click="closeAnimalsModal">
            Close [Esc]
          </button>
        </div>
      </div>
    </Teleport>

    <button 
      class="new-game-btn" 
      :class="{ disabled: !enterEnabled }"
      :disabled="!enterEnabled"
      @click="startNewGame"
    >
      <span class="btn-emoji">🚀</span>
      <span class="btn-text">
        <span class="btn-main">New Safari!</span>
        <span class="btn-sub" v-if="enterEnabled">Press Enter or click to begin</span>
        <span class="btn-sub countdown" v-else>Ready in {{ countdown }}...</span>
      </span>
    </button>
  </div>
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

.score-card {
  width: 100%;
  background: white;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  border: 3px solid #E5E7EB;
}

.final-score {
  background: linear-gradient(135deg, #34D399 0%, #059669 100%);
  padding: 2rem;
  text-align: center;
  color: white;
}

.score-label {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  opacity: 0.95;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.score-number {
  font-size: 5rem;
  font-weight: 800;
  text-shadow: 3px 3px 0 rgba(0, 0, 0, 0.2);
  line-height: 1;
}

.score-breakdown {
  padding: 1.5rem;
  background: #F9FAFB;
}

.breakdown-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1F2937;
  margin: 0 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #E5E7EB;
}

.breakdown-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  background: white;
  border-radius: 0.75rem;
  margin-bottom: 0.5rem;
  border: 1px solid #E5E7EB;
}

.breakdown-row:last-child {
  margin-bottom: 0;
}

.breakdown-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #374151;
  font-weight: 500;
}

.row-emoji {
  font-size: 1.25rem;
}

.breakdown-value {
  font-weight: 700;
  color: #1F2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
}

.points {
  font-size: 0.9rem;
  padding: 0.25rem 0.6rem;
  border-radius: 0.5rem;
  font-weight: 600;
}

.positive .points {
  background: #D1FAE5;
  color: #065F46;
  border: 1px solid #6EE7B7;
}

.negative .points {
  background: #FEE2E2;
  color: #991B1B;
  border: 1px solid #FCA5A5;
}

.warning .breakdown-label {
  color: #92400E;
}

.hint-explanation {
  font-size: 0.8rem;
  opacity: 0.7;
}

.breakdown-divider {
  height: 3px;
  background: linear-gradient(90deg, #E5E7EB 0%, #D1D5DB 50%, #E5E7EB 100%);
  margin: 1rem 0;
  border-radius: 2px;
}

.subtotal {
  font-weight: 700;
  background: #F3F4F6;
  border: 2px solid #D1D5DB;
}

.subtotal .breakdown-value {
  font-size: 1.25rem;
  color: #111827;
}

.multiplier {
  font-weight: 600;
  background: #FEF3C7;
  border: 2px solid #FCD34D;
}

.multiplier .breakdown-label {
  color: #92400E;
}

.multiplier .breakdown-value {
  color: #92400E;
  font-size: 1.1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  width: 100%;
}

.stat-card {
  background: var(--color-card-bg);
  border-radius: 1rem;
  padding: 1rem;
  text-align: center;
  box-shadow: var(--shadow-md);
  border: 2px solid var(--color-border);
}

.stat-emoji {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.25rem;
}

.stat-value {
  display: block;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text);
}

.stat-label {
  display: block;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

/* Accuracy level colors */
.stat-card.accuracy-high {
  border-color: #10B981;
  background: #ECFDF5;
}

.stat-card.accuracy-high .stat-value {
  color: #059669;
}

.stat-card.accuracy-medium {
  border-color: #F59E0B;
  background: #FFFBEB;
}

.stat-card.accuracy-medium .stat-value {
  color: #D97706;
}

.stat-card.accuracy-low {
  border-color: #EF4444;
  background: #FEF2F2;
}

.stat-card.accuracy-low .stat-value {
  color: #DC2626;
}

.new-game-btn {
  width: 100%;
  padding: 1.25rem 2rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #34D399 0%, #059669 100%);
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
  background: linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%);
  border-color: #6B7280;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.new-game-btn.disabled:hover {
  transform: none;
  box-shadow: none;
}

@keyframes pulse {
  0%, 100% { opacity: 0.9; }
  50% { opacity: 0.5; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
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

  .score-number {
    font-size: 3rem;
  }
}

/* Animals card */
.animals-card.clickable {
  cursor: pointer;
  transition: all 0.2s ease;
}

.animals-card.clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.tap-hint {
  display: block;
  font-size: 0.7rem;
  color: #6B7280;
  margin-top: 0.25rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 100;
}

.modal {
  background: white;
  border-radius: 1.5rem;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.modal-emoji {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1F2937;
  margin: 0 0 0.5rem;
}

.modal-message {
  font-size: 1rem;
  color: #6B7280;
  margin: 0 0 1rem;
}

.animals-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #F9FAFB;
  border-radius: 1rem;
}

.animal-item {
  font-size: 2.5rem;
  animation: pop-in 0.3s ease forwards;
}

.animal-item:nth-child(1) { animation-delay: 0s; }
.animal-item:nth-child(2) { animation-delay: 0.05s; }
.animal-item:nth-child(3) { animation-delay: 0.1s; }
.animal-item:nth-child(4) { animation-delay: 0.15s; }
.animal-item:nth-child(5) { animation-delay: 0.2s; }
.animal-item:nth-child(6) { animation-delay: 0.25s; }
.animal-item:nth-child(7) { animation-delay: 0.3s; }
.animal-item:nth-child(8) { animation-delay: 0.35s; }
.animal-item:nth-child(9) { animation-delay: 0.4s; }
.animal-item:nth-child(10) { animation-delay: 0.45s; }

@keyframes pop-in {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}

.close-animals-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #FB923C 0%, #EA580C 100%);
  border: 2px solid #EA580C;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-animals-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3);
}
</style>
