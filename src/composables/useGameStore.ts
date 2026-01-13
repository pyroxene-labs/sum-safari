// ============================================
// Game Store
// Session state and gameplay management
// ============================================

import { ref, computed } from "vue";
import type {
    Problem,
    ProblemResult,
    GameSession,
    SessionSettings,
    ScoreSummary,
    Hint,
    ViewState,
} from "@/types";
import { SCORING } from "@/types";
import { generateProblem, isAnswerCorrect } from "@/utils/mathGen";
import { generateHint } from "@/services/hintGenerator";
import { calculateScoreSummary, calculateProblemPoints } from "@/services/scoringEngine";
import { storage, STORAGE_KEYS } from "@/services/persistenceService";
import { useSettingsStore } from "./useSettingsStore";

// Singleton state
const currentView = ref<ViewState>("settings");
const session = ref<GameSession | null>(null);
const currentProblem = ref<Problem | null>(null);
const currentHint = ref<Hint | null>(null);
const problemStartTime = ref<number>(0);
const timeRemaining = ref<number>(0);
const currentScore = ref<number>(0);
const showFeedback = ref<boolean>(false);
const lastAnswerCorrect = ref<boolean>(false);
const timerInterval = ref<number | null>(null);
const animalsCollected = ref<string[]>([]);

/**
 * Game store composable
 */
export function useGameStore() {
    const settingsStore = useSettingsStore();

    // Start a new game session
    function startSession(): void {
        const settings: SessionSettings = {
            difficulty: settingsStore.difficulty.value,
            operators: [...settingsStore.operators.value],
            timerDuration: settingsStore.timerDuration.value,
        };

        session.value = {
            id: crypto.randomUUID(),
            settings,
            startedAt: Date.now(),
            results: [],
            hintTimestamps: [],
        };

        timeRemaining.value = settings.timerDuration;
        currentScore.value = 0;
        currentHint.value = null;
        showFeedback.value = false;
        animalsCollected.value = [];

        // Generate first problem
        nextProblem();

        // Start timer
        startTimer();

        // Switch to game view
        currentView.value = "game";

        // Save session state
        saveSession();
    }

    // Generate next problem
    function nextProblem(): void {
        if (!session.value) return;

        currentProblem.value = generateProblem(
            session.value.settings.difficulty,
            session.value.settings.operators
        );
        problemStartTime.value = Date.now();
        currentHint.value = null;
        showFeedback.value = false;
    }

    // Check the user's answer
    function checkAnswer(userAnswer: number): void {
        if (!session.value || !currentProblem.value) return;

        const timeToAnswer = Date.now() - problemStartTime.value;
        const correct = isAnswerCorrect(userAnswer, currentProblem.value.answer);
        const hintUsed = currentHint.value !== null;

        // Calculate points using the centralized scoring engine
        // We create a temporary result object to pass to the calculator
        const tempResult: ProblemResult = {
            problemId: currentProblem.value.id,
            answered: true,
            correct,
            skipped: false,
            hintUsed,
            timeToAnswer,
            pointsAwarded: 0, // Placeholder
            timestamp: Date.now(),
        };

        const points = calculateProblemPoints(tempResult, hintUsed);

        // Record result
        const result: ProblemResult = {
            ...tempResult,
            pointsAwarded: points,
        };

        session.value.results.push(result);
        currentScore.value = Math.max(0, currentScore.value + points);
        lastAnswerCorrect.value = correct;
        showFeedback.value = true;

        // Collect the animal on correct answer
        if (correct && currentProblem.value) {
            animalsCollected.value.push(currentProblem.value.animal);
        }

        saveSession();
    }

    // Skip current problem
    function skipProblem(): void {
        if (!session.value || !currentProblem.value) return;

        const result: ProblemResult = {
            problemId: currentProblem.value.id,
            answered: false,
            correct: false,
            skipped: true,
            hintUsed: currentHint.value !== null,
            timeToAnswer: Date.now() - problemStartTime.value,
            pointsAwarded: -SCORING.SKIP_PENALTY,
            timestamp: Date.now(),
        };

        const points = -SCORING.SKIP_PENALTY;

        session.value.results.push(result);
        currentScore.value = Math.max(0, currentScore.value + points);

        nextProblem();
        saveSession();
    }

    // Request a hint
    function requestHint(): void {
        if (!session.value || !currentProblem.value) return;
        if (currentHint.value) return; // Already have a hint

        currentHint.value = generateHint(currentProblem.value);
        session.value.hintTimestamps.push(Date.now());

        saveSession();
    }

    // Dismiss hint
    function dismissHint(): void {
        currentHint.value = null;
    }

    // Continue after feedback
    function continueAfterFeedback(): void {
        showFeedback.value = false;
        nextProblem();
    }

    // Timer management
    function startTimer(): void {
        if (timerInterval.value) {
            clearInterval(timerInterval.value);
        }

        timerInterval.value = window.setInterval(() => {
            if (timeRemaining.value > 0) {
                timeRemaining.value--;

                if (timeRemaining.value === 0) {
                    endSession();
                }
            }
        }, 1000);
    }

    function stopTimer(): void {
        if (timerInterval.value) {
            clearInterval(timerInterval.value);
            timerInterval.value = null;
        }
    }

    // End the session
    function endSession(): void {
        stopTimer();
        currentView.value = "results";
        saveSession();
    }

    // Reset for new game (with confirmation already done)
    function resetGame(): void {
        stopTimer();
        session.value = null;
        currentProblem.value = null;
        currentHint.value = null;
        currentScore.value = 0;
        showFeedback.value = false;
        currentView.value = "settings";
        storage.remove(STORAGE_KEYS.CURRENT_SESSION);
    }

    // Calculate final score summary
    const scoreSummary = computed<ScoreSummary | null>(() => {
        if (!session.value) return null;

        const sessionDurationMs = session.value.settings.timerDuration * 1000;
        return calculateScoreSummary(
            session.value.results,
            session.value.hintTimestamps,
            session.value.settings.difficulty,
            sessionDurationMs
        );
    });

    // Save session to storage
    async function saveSession(): Promise<void> {
        if (session.value) {
            await storage.save(STORAGE_KEYS.CURRENT_SESSION, {
                session: session.value,
                currentProblem: currentProblem.value,
                timeRemaining: timeRemaining.value,
                currentScore: currentScore.value,
            });
        }
    }

    // Restore session from storage
    async function restoreSession(): Promise<boolean> {
        const stored = await storage.load<{
            session: GameSession;
            currentProblem: Problem;
            timeRemaining: number;
            currentScore: number;
        }>(STORAGE_KEYS.CURRENT_SESSION);

        if (stored && stored.timeRemaining > 0) {
            session.value = stored.session;
            currentProblem.value = stored.currentProblem;
            timeRemaining.value = stored.timeRemaining;
            currentScore.value = stored.currentScore;
            problemStartTime.value = Date.now();
            currentView.value = "game";
            startTimer();
            return true;
        }

        return false;
    }

    // Format time remaining as MM:SS
    const formattedTime = computed(() => {
        const minutes = Math.floor(timeRemaining.value / 60);
        const seconds = timeRemaining.value % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    });

    return {
        // State
        currentView: computed(() => currentView.value),
        session: computed(() => session.value),
        currentProblem: computed(() => currentProblem.value),
        currentHint: computed(() => currentHint.value),
        currentScore: computed(() => currentScore.value),
        timeRemaining: computed(() => timeRemaining.value),
        formattedTime,
        showFeedback: computed(() => showFeedback.value),
        lastAnswerCorrect: computed(() => lastAnswerCorrect.value),
        scoreSummary,
        animalsCollected: computed(() => animalsCollected.value),

        // Actions
        startSession,
        checkAnswer,
        skipProblem,
        requestHint,
        dismissHint,
        continueAfterFeedback,
        endSession,
        resetGame,
        restoreSession,
    };
}
