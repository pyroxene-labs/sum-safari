<script setup lang="ts">
import { onMounted } from "vue";
import { useGameStore } from "./composables/useGameStore";
import SettingsView from "./views/SettingsView.vue";
import GameView from "./views/GameView.vue";
import ResultsView from "./views/ResultsView.vue";

const gameStore = useGameStore();

// Try to restore session on mount
onMounted(async () => {
  await gameStore.restoreSession();
});
</script>

<template>
  <div class="app">
    <SettingsView v-if="gameStore.currentView.value === 'settings'" />
    <GameView v-else-if="gameStore.currentView.value === 'game'" />
    <ResultsView v-else-if="gameStore.currentView.value === 'results'" />
  </div>
</template>

<style scoped>
.app {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%);
}
</style>
