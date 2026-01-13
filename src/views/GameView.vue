<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useGameStore } from "@/composables/useGameStore";
import {
  useKeyboardShortcuts,
  SHORTCUTS,
} from "@/services/keyboardManager";
import GameHeader from "@/components/game/GameHeader.vue";
import ProblemCard from "@/components/game/ProblemCard.vue";
import GameControls from "@/components/game/GameControls.vue";
import ConfirmModal from "@/components/game/ConfirmModal.vue";
import HintModal from "@/components/game/HintModal.vue";

const gameStore = useGameStore();

// References
const problemCard = ref<InstanceType<typeof ProblemCard> | null>(null);
const userAnswer = ref("");

// Modal states
const showConfirmModal = ref(false);
const showHintModal = ref(false);

// Computed
const problem = computed(() => gameStore.currentProblem.value);
const hint = computed(() => gameStore.currentHint.value);
const isShowingFeedback = computed(() => gameStore.showFeedback.value);
const wasCorrect = computed(() => gameStore.lastAnswerCorrect.value);
const currentScore = computed(() => gameStore.currentScore.value);
const timeRemaining = computed(() => gameStore.timeRemaining.value);
const formattedTime = computed(() => gameStore.formattedTime.value);

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
  focusInput();
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
  focusInput();
}

function focusInput(): void {
  setTimeout(() => {
    problemCard.value?.focusInput();
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

// Focus input on mount
onMounted(() => {
  focusInput();
});
</script>

<template>
  <main class="game-view">
    <!-- Score Bar -->
    <GameHeader 
      :score="currentScore" 
      :formatted-time="formattedTime" 
      :time-remaining="timeRemaining" 
    />

    <!-- Problem Card -->
    <ProblemCard
      v-if="problem"
      ref="problemCard"
      :problem="problem"
      v-model="userAnswer"
      :is-showing-feedback="isShowingFeedback"
      :was-correct="wasCorrect"
      @continue="handleContinue"
    />

    <!-- Control Buttons -->
    <GameControls 
      :disabled="isShowingFeedback"
      @new="handleNewClick"
      @skip="handleSkip"
      @hint="handleHint"
      @check="handleCheck"
    />

    <!-- Encouragement Message -->
    <div class="encouragement" aria-hidden="true">
      <span class="encouragement-emoji">🎪</span>
      <p class="encouragement-text">
        Solve the problem to discover more safari animals!
      </p>
    </div>

    <!-- Modals -->
    <ConfirmModal 
      :show="showConfirmModal"
      @confirm="confirmNew"
      @cancel="cancelNew"
    />

    <HintModal 
      :show="showHintModal"
      :hint="hint"
      @close="closeHintModal"
    />
  </main>
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

/* Mobile adjustments */
@media (max-width: 480px) {
  /* No specific overrides needed now that components handle their own mobile styles */
}
</style>
