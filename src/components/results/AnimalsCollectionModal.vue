<script setup lang="ts">
const props = defineProps<{
  show: boolean;
  animals: string[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

import { ref, onMounted, watch, nextTick } from 'vue';

const closeButton = ref<HTMLButtonElement | null>(null);

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
    <div v-if="show" class="modal-overlay" @click="emit('close')" role="presentation">
      <div class="modal animals-modal" @click.stop role="dialog" aria-modal="true" aria-labelledby="collection-title">
        <div class="modal-emoji" aria-hidden="true">🎉</div>
        <h3 id="collection-title" class="modal-title">Your Safari Collection!</h3>
        <p class="modal-message">You discovered {{ animals.length }} animals</p>
        <div class="animals-grid" role="list">
          <span v-for="(animal, index) in animals" :key="index" class="animal-item" role="listitem">
            {{ animal }}
          </span>
        </div>
        <button ref="closeButton" class="close-animals-btn" @click="emit('close')" aria-label="Close Modal">
          Close [Esc]
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
}

.modal {
  background: white;
  border-radius: 1.5rem;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.modal-emoji {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1F2937;
  margin: 0 0 0.5rem;
}

.modal-message {
  font-size: 1rem;
  color: #6B7280;
  margin: 0 0 1rem;
}

.animals-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #F9FAFB;
  border-radius: 1rem;
}

.animal-item {
  font-size: 2.5rem;
  animation: pop-in 0.3s ease forwards;
}

.animal-item:nth-child(1) { animation-delay: 0s; }
.animal-item:nth-child(2) { animation-delay: 0.05s; }
.animal-item:nth-child(3) { animation-delay: 0.1s; }
.animal-item:nth-child(4) { animation-delay: 0.15s; }
.animal-item:nth-child(5) { animation-delay: 0.2s; }
.animal-item:nth-child(6) { animation-delay: 0.25s; }
.animal-item:nth-child(7) { animation-delay: 0.3s; }
.animal-item:nth-child(8) { animation-delay: 0.35s; }
.animal-item:nth-child(9) { animation-delay: 0.4s; }
.animal-item:nth-child(10) { animation-delay: 0.45s; }

@keyframes pop-in {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}

.close-animals-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #FB923C 0%, #EA580C 100%);
  border: 2px solid #EA580C;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-animals-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3);
}
</style>
