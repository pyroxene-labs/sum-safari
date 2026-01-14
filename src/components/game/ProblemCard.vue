<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAutoFocusInput } from "@/services/keyboardManager";
import FeedbackOverlay from "./FeedbackOverlay.vue";
import type { Problem } from "@/types";

defineProps<{
  problem: Problem;
  modelValue: string;
  isShowingFeedback: boolean;
  wasCorrect: boolean;
}>();

defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "continue"): void;
}>();

const answerInput = ref<HTMLInputElement | null>(null);

function focusInput(): void {
  setTimeout(() => {
    answerInput.value?.focus();
  }, 50);
}

// Auto-focus input when typing numbers
useAutoFocusInput(answerInput);

onMounted(() => {
  focusInput();
});

defineExpose({
  focusInput,
});
</script>

<template>
  <div class="problem-card">
    <!-- Animal -->
    <div class="problem-animal" aria-hidden="true">{{ problem.animal }}</div>

    <!-- Equation -->
    <div class="problem-equation" :aria-label="`${problem.operand1} ${problem.operator === '×' ? 'times' : problem.operator === '÷' ? 'divided by' : problem.operator} ${problem.operand2} equals what?`">{{ problem.operand1 }} {{ problem.operator }} {{ problem.operand2 }} = ?</div>

    <!-- Answer Input -->
    <div class="answer-container">
      <input ref="answerInput" :value="modelValue" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" type="number" inputmode="numeric" class="answer-input" :class="{ correct: isShowingFeedback && wasCorrect, wrong: isShowingFeedback && !wasCorrect }" :disabled="isShowingFeedback" placeholder="?" aria-label="Your Answer" />
    </div>

    <!-- Feedback Overlay -->
    <FeedbackOverlay v-if="isShowingFeedback" :was-correct="wasCorrect" :correct-answer="problem.answer" @continue="$emit('continue')" />
  </div>
</template>

<style scoped>
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
  appearance: textfield;
  -moz-appearance: textfield;
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
  .problem-equation {
    font-size: 2rem;
  }

  .problem-animal {
    font-size: 3rem;
  }

  .answer-input {
    font-size: 1.75rem;
  }
}
</style>
