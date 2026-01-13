<script setup lang="ts">
import { SHORTCUTS, getShortcutLabel } from "@/services/keyboardManager";

defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

import { ref, onMounted } from 'vue';

const cancelButton = ref<HTMLButtonElement | null>(null);

onMounted(() => {
  // Focus cancel button for accessibility and safety
  cancelButton.value?.focus();
});
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay" @click="emit('cancel')" role="presentation">
      <div class="modal" @click.stop role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <div class="modal-emoji" aria-hidden="true">🆕</div>
        <h3 id="confirm-title" class="modal-title">Start New Game?</h3>
        <p class="modal-message">
          This will reset your score and start a new session.
        </p>
        <div class="modal-buttons">
          <button ref="cancelButton" class="modal-btn cancel-btn" @click="emit('cancel')">
            Cancel
            <span class="shortcut-hint" aria-hidden="true">[{{ getShortcutLabel(SHORTCUTS.ESCAPE.key) }}]</span>
          </button>
          <button class="modal-btn confirm-btn" @click="emit('confirm')">
            Start New
          </button>
        </div>
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
