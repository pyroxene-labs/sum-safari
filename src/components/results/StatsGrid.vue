<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  accuracy: number;
  animalsCollected: string[];
}>();

const emit = defineEmits<{
  (e: "view-collection"): void;
}>();

const accuracyLevel = computed(() => {
  if (props.accuracy >= 75) return "high";
  if (props.accuracy >= 45) return "medium";
  return "low";
});

const accuracyEmoji = computed(() => {
  if (props.accuracy >= 75) return "✅";
  if (props.accuracy >= 45) return "⚠️";
  return "📚";
});
</script>

<template>
  <div class="stats-grid">
    <div class="stat-card" :class="`accuracy-${accuracyLevel}`">
      <span class="stat-emoji" aria-hidden="true">{{ accuracyEmoji }}</span>
      <span class="stat-value">{{ accuracy }}%</span>
      <span class="stat-label">Accuracy</span>
    </div>
    <button class="stat-card animals-card" :class="{ clickable: animalsCollected.length > 0 }" @click="emit('view-collection')" :disabled="animalsCollected.length === 0" :aria-label="'Animals Found: ' + animalsCollected.length + (animalsCollected.length > 0 ? ', tap to view collection' : '')">
      <span class="stat-emoji" aria-hidden="true">🦁</span>
      <span class="stat-value">{{ animalsCollected.length }}</span>
      <span class="stat-label">Animals Found</span>
      <span v-if="animalsCollected.length > 0" class="tap-hint" aria-hidden="true">Tap to view</span>
    </button>
  </div>
</template>

<style scoped>
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
  border-color: #10b981;
  background: #ecfdf5;
}

.stat-card.accuracy-high .stat-value {
  color: #059669;
}

.stat-card.accuracy-medium {
  border-color: #f59e0b;
  background: #fffbeb;
}

.stat-card.accuracy-medium .stat-value {
  color: #d97706;
}

.stat-card.accuracy-low {
  border-color: #ef4444;
  background: #fef2f2;
}

.stat-card.accuracy-low .stat-value {
  color: #dc2626;
}

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
  color: #6b7280;
  margin-top: 0.25rem;
}
</style>
