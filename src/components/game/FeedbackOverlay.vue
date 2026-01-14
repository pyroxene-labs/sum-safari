<script setup lang="ts">
import { formatAnswer } from "@/domain";
import { SHORTCUTS, getShortcutLabel } from "@/services/keyboardManager";

defineProps<{
  wasCorrect: boolean;
  correctAnswer: number;
}>();

defineEmits<{
  (e: "continue"): void;
}>();
</script>

<template>
  <div class="feedback-overlay" :class="{ correct: wasCorrect, wrong: !wasCorrect }" role="alert" aria-live="assertive">
    <div class="feedback-emoji" aria-hidden="true">{{ wasCorrect ? "🎉" : "📚" }}</div>
    <div class="feedback-message">
      {{ wasCorrect ? "Great job!" : "Not quite!" }}
    </div>
    <div v-if="!wasCorrect" class="correct-answer">
      The answer was: <strong>{{ formatAnswer(correctAnswer) }}</strong>
    </div>
    <button class="continue-btn" @click="$emit('continue')" ref="continueBtn">
      Continue
      <span class="shortcut-hint" aria-hidden="true">[{{ getShortcutLabel(SHORTCUTS.CHECK.key) }}]</span>
    </button>
  </div>
</template>

<style scoped>
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
  background: #d1fae5;
}

.feedback-overlay.wrong {
  background: #fee2e2;
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
  font-weight: 700;
  color: var(--color-primary-dark);
  background: white;
  border: 2px solid var(--color-primary-dark);
  border-radius: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.continue-btn:hover {
  background: var(--color-primary-light);
  color: var(--color-text);
  border-color: var(--color-primary-dark);
  transform: translateY(-2px);
}

.shortcut-hint {
  font-size: 0.8rem;
  opacity: 0.7;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes bounceIn {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
