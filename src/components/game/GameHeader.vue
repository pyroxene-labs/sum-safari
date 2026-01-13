<script setup lang="ts">
defineProps<{
  score: number;
  formattedTime: string;
  timeRemaining: number;
}>();
</script>

<template>
  <div class="score-bar">
    <div class="score-item" aria-label="Current Score">
      <span class="score-emoji" aria-hidden="true">🏆</span>
      <span class="score-value">{{ score }}</span>
    </div>
    <div 
      class="score-item timer" 
      :class="{ warning: timeRemaining <= 30 }" 
      aria-label="Time Remaining"
    >
      <span class="score-emoji" aria-hidden="true">⏳</span>
      <span class="score-value">{{ formattedTime }}</span>
    </div>
  </div>
</template>

<style scoped>
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

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
