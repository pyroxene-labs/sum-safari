<script setup lang="ts">
import { SHORTCUTS, getShortcutLabel } from "@/services/keyboardManager";
import { getStrategyDisplayName } from "@/services/hintGenerator";
import type { Hint } from "@/types";

const props = defineProps<{
  show: boolean;
  hint: Hint | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

import { ref, onMounted, nextTick, watch } from 'vue';

const closeButton = ref<HTMLButtonElement | null>(null);

// Since hint modal might appear dynamically, watch for show prop or mount
onMounted(() => {
  if (props.show) {
    nextTick(() => closeButton.value?.focus());
  }
});

watch(() => props.show, (newVal) => {
  if (newVal) {
    nextTick(() => closeButton.value?.focus());
  }
});
</script>

<template>
  <Teleport to="body">
    <div v-if="show && hint" class="modal-overlay" @click="emit('close')" role="presentation">
      <div class="modal hint-modal" @click.stop role="dialog" aria-modal="true" aria-labelledby="hint-title">
        <div class="modal-emoji" aria-hidden="true">💡</div>
        <h3 id="hint-title" class="modal-title">{{ getStrategyDisplayName(hint.strategy) }}</h3>
        <p class="modal-message hint-text">
          {{ hint.message }}
        </p>
        <button ref="closeButton" class="modal-btn close-btn" @click="emit('close')">
          Got it!
          <span class="shortcut-hint" aria-hidden="true">[{{ getShortcutLabel(SHORTCUTS.ESCAPE.key) }}]</span>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
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

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
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
</style>
