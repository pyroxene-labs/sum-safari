<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useGameStore } from "@/composables/useGameStore";
import { formatAnswer } from "@/utils/mathGen";
import {
  useKeyboardShortcuts,
  useAutoFocusInput,
  SHORTCUTS,
  getShortcutLabel,
} from "@/services/keyboardManager";
import { getStrategyDisplayName } from "@/services/hintGenerator";

const gameStore = useGameStore();

// Answer input
const answerInput = ref<HTMLInputElement | null>(null);
const userAnswer = ref("");

// Modal states
const showConfirmModal = ref(false);
const showHintModal = ref(false);

// Computed
const problem = computed(() => gameStore.currentProblem.value);
const hint = computed(() => gameStore.currentHint.value);
const isShowingFeedback = computed(() => gameStore.showFeedback.value);
const wasCorrect = computed(() => gameStore.lastAnswerCorrect.value);

// Actions
function handleCheck(): void {
  if (isShowingFeedback.value) {
    handleContinue();
    return;
  }

  const answer = parseFloat(userAnswer.value);
  if (isNaN(answer)) return;

  gameStore.checkAnswer(answer);
}

function handleContinue(): void {
  userAnswer.value = "";
  gameStore.continueAfterFeedback();
  focusInput();
}

function handleSkip(): void {
  if (isShowingFeedback.value) return;
  userAnswer.value = "";
  gameStore.skipProblem();
  focusInput();
}

function handleHint(): void {
  if (isShowingFeedback.value) return;
  if (!hint.value) {
    gameStore.requestHint();
  }
  showHintModal.value = true;
}

function closeHintModal(): void {
  showHintModal.value = false;
}

function handleNewClick(): void {
  showConfirmModal.value = true;
}

function confirmNew(): void {
  showConfirmModal.value = false;
  gameStore.resetGame();
}

function cancelNew(): void {
  showConfirmModal.value = false;
}

function focusInput(): void {
  setTimeout(() => {
    answerInput.value?.focus();
  }, 50);
}

// Keyboard shortcuts
useKeyboardShortcuts([
  {
    key: SHORTCUTS.CHECK.key,
    action: handleCheck,
    description: SHORTCUTS.CHECK.description,
  },
  {
    key: SHORTCUTS.SKIP.key,
    action: handleSkip,
    description: SHORTCUTS.SKIP.description,
    enabled: computed(() => !isShowingFeedback.value),
  },
  {
    key: SHORTCUTS.HINT.key,
    action: handleHint,
    description: SHORTCUTS.HINT.description,
    enabled: computed(() => !isShowingFeedback.value),
  },
  {
    key: SHORTCUTS.NEW.key,
    action: handleNewClick,
    description: SHORTCUTS.NEW.description,
  },
  {
    key: SHORTCUTS.ESCAPE.key,
    action: () => {
      if (showConfirmModal.value) cancelNew();
      else if (showHintModal.value) closeHintModal();
    },
    description: SHORTCUTS.ESCAPE.description,
  },
]);

// Auto-focus input when typing numbers
useAutoFocusInput(answerInput);

// Focus input on mount
onMounted(() => {
  focusInput();
});
</script>

<template>
  <div class="game-view">
    <!-- Score Bar -->
    <div class="score-bar">
      <div class="score-item">
        <span class="score-emoji">🏆</span>
        <span class="score-value">{{ gameStore.currentScore.value }}</span>
      </div>
      <div class="score-item timer" :class="{ warning: gameStore.timeRemaining.value <= 30 }">
        <span class="score-emoji">⏳</span>
        <span class="score-value">{{ gameStore.formattedTime.value }}</span>
      </div>
    </div>

    <!-- Problem Card -->
    <div class="problem-card" v-if="problem">
      <!-- Animal -->
      <div class="problem-animal">{{ problem.animal }}</div>

      <!-- Equation -->
      <div class="problem-equation">
        {{ problem.operand1 }} {{ problem.operator }} {{ problem.operand2 }} = ?
      </div>

      <!-- Answer Input -->
      <div class="answer-container">
        <input
          ref="answerInput"
          v-model="userAnswer"
          type="number"
          inputmode="numeric"
          class="answer-input"
          :class="{ correct: isShowingFeedback && wasCorrect, wrong: isShowingFeedback && !wasCorrect }"
          :disabled="isShowingFeedback"
          placeholder="?"
        />
      </div>

      <!-- Feedback Overlay -->
      <div v-if="isShowingFeedback" class="feedback-overlay" :class="{ correct: wasCorrect, wrong: !wasCorrect }">
        <div class="feedback-emoji">{{ wasCorrect ? "🎉" : "💪" }}</div>
        <div class="feedback-message">
          {{ wasCorrect ? "Great job!" : "Not quite!" }}
        </div>
        <div v-if="!wasCorrect" class="correct-answer">
          The answer was: <strong>{{ formatAnswer(problem.answer) }}</strong>
        </div>
        <button class="continue-btn" @click="handleContinue">
          Continue
          <span class="shortcut-hint">[{{ getShortcutLabel(SHORTCUTS.CHECK.key) }}]</span>
        </button>
      </div>
    </div>

    <!-- Control Buttons -->
    <div class="control-buttons">
      <button class="control-btn new-btn" @click="handleNewClick" :disabled="isShowingFeedback">
        <span class="btn-emoji">🔄</span>
        <span class="btn-label">New</span>
        <span class="btn-shortcut">{{ getShortcutLabel(SHORTCUTS.NEW.key) }}</span>
      </button>
      <button class="control-btn skip-btn" @click="handleSkip" :disabled="isShowingFeedback">
        <span class="btn-emoji">⏭️</span>
        <span class="btn-label">Skip</span>
        <span class="btn-shortcut">{{ getShortcutLabel(SHORTCUTS.SKIP.key) }}</span>
      </button>
      <button class="control-btn hint-btn" @click="handleHint" :disabled="isShowingFeedback">
        <span class="btn-emoji">💡</span>
        <span class="btn-label">Hint</span>
        <span class="btn-shortcut">{{ getShortcutLabel(SHORTCUTS.HINT.key) }}</span>
      </button>
      <button class="control-btn check-btn" @click="handleCheck" :disabled="isShowingFeedback">
        <span class="btn-emoji">🎯</span>
        <span class="btn-label">Check</span>
        <span class="btn-shortcut">{{ getShortcutLabel(SHORTCUTS.CHECK.key) }}</span>
      </button>
    </div>

    <!-- Encouragement Message -->
    <div class="encouragement">
      <span class="encouragement-emoji">🎪</span>
      <p class="encouragement-text">
        Solve the problem to discover more safari animals!
      </p>
    </div>

    <!-- Confirm New Modal -->
    <Teleport to="body">
      <div v-if="showConfirmModal" class="modal-overlay" @click="cancelNew">
        <div class="modal" @click.stop>
          <div class="modal-emoji">🆕</div>
          <h3 class="modal-title">Start New Game?</h3>
          <p class="modal-message">
            This will reset your score and start a new session.
          </p>
          <div class="modal-buttons">
            <button class="modal-btn cancel-btn" @click="cancelNew">
              Cancel
              <span class="shortcut-hint">[{{ getShortcutLabel(SHORTCUTS.ESCAPE.key) }}]</span>
            </button>
            <button class="modal-btn confirm-btn" @click="confirmNew">
              Start New
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Hint Modal -->
    <Teleport to="body">
      <div v-if="showHintModal && hint" class="modal-overlay" @click="closeHintModal">
        <div class="modal hint-modal" @click.stop>
          <div class="modal-emoji">💡</div>
          <h3 class="modal-title">{{ getStrategyDisplayName(hint.strategy) }}</h3>
          <p class="modal-message hint-text">
            {{ hint.message }}
          </p>
          <button class="modal-btn close-btn" @click="closeHintModal">
            Got it!
            <span class="shortcut-hint">[{{ getShortcutLabel(SHORTCUTS.ESCAPE.key) }}]</span>
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.game-view {
  min-height: 100vh;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

/* Score Bar */
.score-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--color-card-bg);
  border-radius: 1rem;
  padding: 0.75rem 1.25rem;
  box-shadow: var(--shadow-md);
  border: 2px solid var(--color-border);
}

.score-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.score-emoji {
  font-size: 1.5rem;
}

.score-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
}

.timer.warning .score-value {
  color: var(--color-error);
  animation: pulse 1s ease-in-out infinite;
}

/* Problem Card */
.problem-card {
  background: var(--color-card-bg);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: var(--shadow-lg);
  border: 2px solid var(--color-border);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.problem-animal {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: bounce 1s ease-in-out infinite;
}

.problem-equation {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-primary-dark);
  margin-bottom: 1.5rem;
}

.answer-container {
  max-width: 200px;
  margin: 0 auto;
}

.answer-input {
  width: 100%;
  font-size: 2rem;
  text-align: center;
  padding: 0.75rem 1rem;
  border: 3px solid var(--color-border);
  border-radius: 1rem;
  background: white;
  color: var(--color-text);
  outline: none;
  transition: all 0.2s ease;
}

.answer-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(251, 146, 60, 0.2);
}

.answer-input.correct {
  border-color: var(--color-success);
  background: var(--color-success-light);
}

.answer-input.wrong {
  border-color: var(--color-error);
  background: var(--color-error-light);
}

.answer-input:disabled {
  opacity: 0.7;
}

/* Hide number input spinners */
.answer-input::-webkit-inner-spin-button,
.answer-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.answer-input {
  -moz-appearance: textfield;
}

/* Feedback Overlay */
.feedback-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border-radius: 1.5rem;
  animation: fadeIn 0.3s ease;
}

.feedback-overlay.correct {
  background: #D1FAE5;
}

.feedback-overlay.wrong {
  background: #FEE2E2;
}

.feedback-emoji {
  font-size: 4rem;
  animation: bounceIn 0.5s ease;
}

.feedback-message {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
}

.correct-answer {
  font-size: 1.1rem;
  color: var(--color-text-muted);
}

.continue-btn {
  margin-top: 0.5rem;
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  background: var(--color-primary);
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.continue-btn:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
}

/* Control Buttons */
.control-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.control-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.875rem 0.5rem;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.control-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-emoji {
  font-size: 1.5rem;
}

.btn-label {
  font-size: 0.9rem;
}

.btn-shortcut {
  font-size: 0.7rem;
  opacity: 0.7;
}

.new-btn {
  background: #E8F4FD;
  border: 2px solid #93C5FD;
  color: #1E40AF;
}

.skip-btn {
  background: #F3E8FF;
  border: 2px solid #C4B5FD;
  color: #5B21B6;
}

.hint-btn {
  background: #FEF3C7;
  border: 2px solid #FCD34D;
  color: #92400E;
}

.check-btn {
  background: #D1FAE5;
  border: 2px solid #6EE7B7;
  color: #065F46;
}

/* Encouragement */
.encouragement {
  background: var(--color-card-bg);
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border: 2px solid var(--color-border);
}

.encouragement-emoji {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.encouragement-text {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin: 0;
  line-height: 1.4;
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
  animation: fadeIn 0.2s ease;
}

.modal {
  background: white;
  border-radius: 1.5rem;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
  animation: slideUp 0.3s ease;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.modal-emoji {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 0.5rem;
}

.modal-message {
  color: var(--color-text-muted);
  margin: 0 0 1.5rem;
  line-height: 1.4;
}

.hint-text {
  font-size: 1.1rem;
  color: var(--color-text);
  background: var(--color-bg);
  padding: 1rem;
  border-radius: 0.75rem;
}

.modal-buttons {
  display: flex;
  gap: 0.75rem;
}

.modal-btn {
  flex: 1;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.cancel-btn {
  background: white;
  color: #374151;
  border: 2px solid #D1D5DB;
}

.cancel-btn:hover {
  background: #F3F4F6;
  border-color: #9CA3AF;
}

.confirm-btn {
  background: linear-gradient(135deg, #34D399 0%, #059669 100%);
  color: white;
  border: 2px solid #059669;
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
}

.confirm-btn:hover {
  box-shadow: 0 6px 16px rgba(5, 150, 105, 0.4);
}

.close-btn {
  width: 100%;
  background: #FB923C;
  color: white;
  border: 2px solid #EA580C;
}

.modal-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.shortcut-hint {
  font-size: 0.8rem;
  opacity: 0.7;
}

/* Animations */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes bounceIn {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile adjustments */
@media (max-width: 480px) {
  .problem-equation {
    font-size: 2rem;
  }

  .problem-animal {
    font-size: 3rem;
  }

  .control-buttons {
    grid-template-columns: repeat(2, 1fr);
  }

  .answer-input {
    font-size: 1.75rem;
  }
}
</style>
