<script setup lang="ts">
import type { Operator, Difficulty } from "@/types";
import { SCORING } from "@/types";
import { useSettingsStore } from "@/composables/useSettingsStore";
import { useGameStore } from "@/composables/useGameStore";
import { useKeyboardShortcuts } from "@/services/keyboardManager";

const settingsStore = useSettingsStore();
const gameStore = useGameStore();

// Operator options
const operatorOptions: { value: Operator; label: string; emoji: string }[] = [
  { value: "+", label: "Addition", emoji: "➕" },
  { value: "-", label: "Subtraction", emoji: "➖" },
  { value: "×", label: "Multiplication", emoji: "✖️" },
  { value: "÷", label: "Division", emoji: "➗" },
];

// Difficulty options
const difficultyOptions: { value: Difficulty; label: string; multiplier: number }[] = [
  { value: "easy", label: "Easy", multiplier: SCORING.DIFFICULTY_MULTIPLIERS.easy },
  { value: "medium", label: "Medium", multiplier: SCORING.DIFFICULTY_MULTIPLIERS.medium },
  { value: "hard", label: "Hard", multiplier: SCORING.DIFFICULTY_MULTIPLIERS.hard },
];

// Timer presets in seconds
const timerPresets = [60, 120, 180, 300];

function formatTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  return `${mins} min${mins !== 1 ? "s" : ""}`;
}

function isOperatorSelected(op: Operator): boolean {
  return settingsStore.operators.value.includes(op);
}

function startGame(): void {
  gameStore.startSession();
}

// Keyboard shortcuts
useKeyboardShortcuts([
  {
    key: "Enter",
    action: startGame,
    description: "Start game",
  },
]);
</script>

<template>
  <main class="settings-view">
    <header class="settings-header">
      <h1 class="app-title">
        Sum<span class="title-highlight">Safari</span>
        <span class="title-emoji">🦁</span>
      </h1>
      <p class="app-subtitle">🌴 Practice math while exploring the safari! 🦒</p>
    </header>

    <div class="settings-card">
      <section class="settings-section" aria-labelledby="difficulty-title">
        <h2 id="difficulty-title" class="section-title">
          <span class="section-emoji" aria-hidden="true">🎯</span>
          Difficulty
        </h2>
        <p class="section-hint">Choose how challenging the problems will be</p>
        <div class="difficulty-grid" role="radiogroup" aria-labelledby="difficulty-title">
          <button v-for="option in difficultyOptions" :key="option.value" :class="['option-btn', 'difficulty-btn', { active: settingsStore.difficulty.value === option.value }]" @click="settingsStore.setDifficulty(option.value)" role="radio" :aria-checked="settingsStore.difficulty.value === option.value" :aria-label="option.label + ' difficulty, multiplier ' + option.multiplier + 'x'">
            <span class="check-indicator" aria-hidden="true">✓</span>
            <span class="difficulty-label">{{ option.label }}</span>
            <span class="difficulty-multiplier">×{{ option.multiplier }} score</span>
          </button>
        </div>
      </section>

      <section class="settings-section" aria-labelledby="ops-title">
        <h2 id="ops-title" class="section-title">
          <span class="section-emoji" aria-hidden="true">🔢</span>
          Operations
        </h2>
        <p class="section-hint">Select which operations to practice (pick at least one)</p>
        <div class="operators-grid" role="group" aria-labelledby="ops-title">
          <button v-for="op in operatorOptions" :key="op.value" :class="['option-btn', 'operator-btn', { active: isOperatorSelected(op.value) }]" @click="settingsStore.toggleOperator(op.value)" role="checkbox" :aria-checked="isOperatorSelected(op.value)">
            <span class="check-indicator" aria-hidden="true">✓</span>
            <span class="operator-emoji" aria-hidden="true">{{ op.emoji }}</span>
            <span class="operator-label">{{ op.label }}</span>
          </button>
        </div>
      </section>

      <section class="settings-section" aria-labelledby="timer-title">
        <h2 id="timer-title" class="section-title">
          <span class="section-emoji" aria-hidden="true">⏱️</span>
          Timer
        </h2>
        <p class="section-hint">How long should each practice session last?</p>
        <div class="timer-grid" role="radiogroup" aria-labelledby="timer-title">
          <button v-for="seconds in timerPresets" :key="seconds" :class="['option-btn', 'timer-btn', { active: settingsStore.timerDuration.value === seconds }]" @click="settingsStore.setTimerDuration(seconds)" role="radio" :aria-checked="settingsStore.timerDuration.value === seconds">
            <span class="check-indicator" aria-hidden="true">✓</span>
            <span class="timer-label">{{ formatTimer(seconds) }}</span>
          </button>
        </div>
      </section>
    </div>

    <button class="start-btn" @click="startGame" aria-label="Start Safari Game">
      <span class="start-emoji" aria-hidden="true">🚀</span>
      <span class="start-text">
        <span class="start-main">Start Safari!</span>
        <span class="start-sub">Press Enter or click to begin</span>
      </span>
    </button>

    <footer class="settings-footer">
      <p class="scoring-info">🏆 +10 correct • ⏰ +2 bonus (&lt;2s) • 💡 -2 hint • ⏭️ -5 skip</p>
    </footer>
  </main>
</template>

<style scoped>
.settings-view {
  min-height: 100vh;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
}

.settings-header {
  text-align: center;
  margin-bottom: 0.5rem;
}

.app-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin: 0;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
}

.title-highlight {
  color: var(--color-accent);
}

.title-emoji {
  display: inline-block;
  margin-left: 0.5rem;
  animation: bounce 1s ease-in-out infinite;
}

.app-subtitle {
  font-size: 1.1rem;
  color: var(--color-text-muted);
  margin: 0.5rem 0 0;
}

.settings-card {
  width: 100%;
  background: var(--color-card-bg);
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-lg);
  border: 2px solid var(--color-border);
}

.settings-section {
  margin-bottom: 1.75rem;
}

.settings-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-emoji {
  font-size: 1.25rem;
}

.section-hint {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin: 0 0 0.75rem;
}

.difficulty-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.timer-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.operators-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

/* Base option button styling - card-like buttons */
.option-btn {
  position: relative;
  padding: 1rem;
  border: 3px solid var(--color-border);
  border-radius: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  color: var(--color-text);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.option-btn:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.option-btn:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

/* Check indicator - hidden by default */
.check-indicator {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 1.5rem;
  height: 1.5rem;
  background: var(--color-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: transparent;
  transition: all 0.2s ease;
}

/* Active state - clearly selected */
.option-btn.active {
  border-color: var(--color-success-dark);
  background: linear-gradient(135deg, #e8fff0 0%, #d1fae5 100%);
  box-shadow: 0 4px 12px rgba(52, 211, 153, 0.2);
}

.option-btn.active .check-indicator {
  color: #059669;
  border: 1px solid var(--color-success);
}

/* Difficulty button specifics */
.difficulty-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  min-height: 80px;
}

.difficulty-label {
  font-size: 1rem;
  font-weight: 700;
}

.difficulty-multiplier {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.option-btn.active .difficulty-multiplier {
  color: var(--color-success-dark);
}

/* Operator button specifics */
.operator-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: flex-start;
  padding-left: 1.25rem;
}

.operator-emoji {
  font-size: 1.5rem;
}

.operator-label {
  font-size: 1rem;
}

/* Timer button specifics */
.timer-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 56px;
}

.timer-label {
  font-size: 0.95rem;
}

/* Start button - prominent CTA */
.start-btn {
  width: 100%;
  max-width: 400px;
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

.start-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(5, 150, 105, 0.5);
}

.start-btn:active {
  transform: translateY(-1px);
}

.start-btn:focus-visible {
  outline: 4px solid rgba(52, 211, 153, 0.5);
  outline-offset: 2px;
}

.start-emoji {
  font-size: 2rem;
}

.start-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.start-main {
  font-size: 1.5rem;
  line-height: 1.2;
}

.start-sub {
  font-size: 0.875rem;
  opacity: 0.9;
  font-weight: 500;
}

.settings-footer {
  text-align: center;
}

.scoring-info {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin: 0;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@media (max-width: 480px) {
  .settings-view {
    padding: 1rem;
  }

  .app-title {
    font-size: 2rem;
  }

  .difficulty-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .timer-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .operators-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .start-btn {
    padding: 1rem 1.5rem;
  }

  .start-main {
    font-size: 1.25rem;
  }

  .option-btn {
    padding: 0.75rem;
  }

  .difficulty-btn {
    min-height: 70px;
  }

  .check-indicator {
    width: 1.25rem;
    height: 1.25rem;
    font-size: 0.7rem;
  }
}
</style>
