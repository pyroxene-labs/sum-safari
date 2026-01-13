<script setup lang="ts">

import { SHORTCUTS, getShortcutLabel } from "@/services/keyboardManager";

defineProps<{
  disabled: boolean;
}>();

defineEmits<{
  (e: 'new'): void;
  (e: 'skip'): void;
  (e: 'hint'): void;
  (e: 'check'): void;
}>();
</script>

<template>
  <div class="control-buttons">
    <button class="control-btn new-btn" @click="$emit('new')" :disabled="disabled" :aria-label="`Start New Game (Press ${getShortcutLabel(SHORTCUTS.NEW.key)})`">
      <span class="btn-emoji" aria-hidden="true">🔄</span>
      <span class="btn-label">New</span>
      <span class="btn-shortcut" aria-hidden="true">{{ getShortcutLabel(SHORTCUTS.NEW.key) }}</span>
    </button>
    <button class="control-btn skip-btn" @click="$emit('skip')" :disabled="disabled" :aria-label="`Skip Problem (Press ${getShortcutLabel(SHORTCUTS.SKIP.key)})`">
      <span class="btn-emoji" aria-hidden="true">⏭️</span>
      <span class="btn-label">Skip</span>
      <span class="btn-shortcut" aria-hidden="true">{{ getShortcutLabel(SHORTCUTS.SKIP.key) }}</span>
    </button>
    <button class="control-btn hint-btn" @click="$emit('hint')" :disabled="disabled" :aria-label="`Get Hint (Press ${getShortcutLabel(SHORTCUTS.HINT.key)})`">
      <span class="btn-emoji" aria-hidden="true">💡</span>
      <span class="btn-label">Hint</span>
      <span class="btn-shortcut" aria-hidden="true">{{ getShortcutLabel(SHORTCUTS.HINT.key) }}</span>
    </button>
    <button class="control-btn check-btn" @click="$emit('check')" :disabled="disabled" :aria-label="`Check Answer (Press ${getShortcutLabel(SHORTCUTS.CHECK.key)})`">
      <span class="btn-emoji" aria-hidden="true">🎯</span>
      <span class="btn-label">Check</span>
      <span class="btn-shortcut" aria-hidden="true">{{ getShortcutLabel(SHORTCUTS.CHECK.key) }}</span>
    </button>
  </div>
</template>

<style scoped>
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

@media (max-width: 480px) {
  .control-buttons {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
