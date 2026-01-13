// ============================================
// Settings Store
// Global and session settings management
// ============================================

import { ref, computed } from "vue";
import type { GlobalSettings, Operator, Difficulty } from "@/types";
import { DEFAULT_SETTINGS } from "@/types";
import { storage, STORAGE_KEYS } from "@/services/persistenceService";

// Singleton state
const settings = ref<GlobalSettings>({ ...DEFAULT_SETTINGS });
const isLoaded = ref(false);

/**
 * Settings store composable
 */
export function useSettingsStore() {
    // Load settings from storage
    async function loadSettings(): Promise<void> {
        if (isLoaded.value) return;

        const stored = await storage.load<GlobalSettings>(STORAGE_KEYS.SETTINGS);
        if (stored) {
            settings.value = { ...DEFAULT_SETTINGS, ...stored };
        }
        isLoaded.value = true;
    }

    // Save settings to storage
    async function saveSettings(): Promise<void> {
        await storage.save(STORAGE_KEYS.SETTINGS, settings.value);
    }

    // Update difficulty
    function setDifficulty(difficulty: Difficulty): void {
        settings.value.defaultDifficulty = difficulty;
        saveSettings();
    }

    // Update operators
    function setOperators(operators: Operator[]): void {
        if (operators.length === 0) return; // Must have at least one
        settings.value.defaultOperators = operators;
        saveSettings();
    }

    // Toggle an operator
    function toggleOperator(operator: Operator): void {
        const current = settings.value.defaultOperators;
        if (current.includes(operator)) {
            // Don't allow removing the last operator
            if (current.length > 1) {
                settings.value.defaultOperators = current.filter((o) => o !== operator);
            }
        } else {
            settings.value.defaultOperators = [...current, operator];
        }
        saveSettings();
    }

    // Update timer duration
    function setTimerDuration(seconds: number): void {
        settings.value.defaultTimerDuration = Math.max(30, Math.min(600, seconds));
        saveSettings();
    }

    // Reset to defaults
    function resetToDefaults(): void {
        settings.value = { ...DEFAULT_SETTINGS };
        saveSettings();
    }

    // Computed values
    const difficulty = computed(() => settings.value.defaultDifficulty);
    const operators = computed(() => settings.value.defaultOperators);
    const timerDuration = computed(() => settings.value.defaultTimerDuration);

    // Initialize on first use
    loadSettings();

    return {
        // State
        settings: computed(() => settings.value),
        isLoaded: computed(() => isLoaded.value),

        // Computed
        difficulty,
        operators,
        timerDuration,

        // Actions
        loadSettings,
        saveSettings,
        setDifficulty,
        setOperators,
        toggleOperator,
        setTimerDuration,
        resetToDefaults,
    };
}
