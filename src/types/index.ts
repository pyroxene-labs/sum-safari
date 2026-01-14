// ============================================
// Sum Safari Type Definitions
// ============================================

// Core Types
export type Operator = "+" | "-" | "×" | "÷";
export type Difficulty = "easy" | "medium" | "hard";
export type ViewState = "settings" | "game" | "results";

// Problem Definition
export interface Problem {
  id: string;
  operand1: number;
  operand2: number;
  operator: Operator;
  answer: number;
  animal: string;
  difficulty: Difficulty;
}

// Per-problem result tracking
export interface ProblemResult {
  problemId: string;
  answered: boolean;
  correct: boolean;
  skipped: boolean;
  hintUsed: boolean;
  timeToAnswer: number; // milliseconds
  pointsAwarded: number;
  timestamp: number;
}

// Session settings (locked at session start)
export interface SessionSettings {
  difficulty: Difficulty;
  operators: Operator[];
  timerDuration: number; // seconds
}

// Global settings (configurable anytime)
export interface GlobalSettings {
  defaultDifficulty: Difficulty;
  defaultOperators: Operator[];
  defaultTimerDuration: number; // seconds
}

// Game session state
export interface GameSession {
  id: string;
  settings: SessionSettings;
  startedAt: number;
  results: ProblemResult[];
  hintTimestamps: number[]; // for calculating hints per minute
}

// Final score breakdown
export interface ScoreSummary {
  basePoints: number;
  timeBonusPoints: number;
  hintPenalty: number;
  excessHintPenalty: number;
  subtotal: number;
  difficultyMultiplier: number;
  finalScore: number;
  problemsAttempted: number;
  correctCount: number;
  skippedCount: number;
  hintsUsed: number;
}

// Hint types
// prettier-ignore
export type HintStrategy =
  | "making-tens"
  | "place-value"
  | "counting-on"
  | "doubles"
  | "counting-back"
  | "counting-up"
  | "number-bonds"
  | "skip-counting"
  | "repeated-addition"
  | "known-facts"
  | "doubling"
  | "array"
  | "fair-sharing"
  | "grouping"
  | "inverse-multiplication"
  | "repeated-subtraction";

export interface Hint {
  strategy: HintStrategy;
  message: string;
}

// Persistence interface for future API extensibility
export interface StorageProvider {
  save(key: string, data: unknown): Promise<void>;
  load<T>(key: string): Promise<T | null>;
  remove(key: string): Promise<void>;
}

// Scoring constants
export const SCORING = {
  CORRECT_ANSWER: 10,
  SKIP_PENALTY: 5,
  HINT_PENALTY: 2,
  TIME_BONUS_FAST: 2, // under 2 seconds
  TIME_BONUS_QUICK: 1, // under 3 seconds
  EXCESS_HINT_THRESHOLD: 2, // hints per minute before penalty
  EXCESS_HINT_PENALTY: 3, // per excess hint
  DIFFICULTY_MULTIPLIERS: {
    easy: 0.66,
    medium: 1.0,
    hard: 1.5,
  } as const,
} as const;

// Default settings
export const DEFAULT_SETTINGS: GlobalSettings = {
  defaultDifficulty: "medium",
  defaultOperators: ["+", "-", "×", "÷"],
  defaultTimerDuration: 120, // 2 minutes
};

// Safari animals for problems
// prettier-ignore
export const SAFARI_ANIMALS = [
  "🦁",
  "🦒",
  "🦊",
  "🦘",
  "🦛",
  "🐘",
  "🦏",
  "🦬",
  "🦓",
  "🐆",
  "🦔",
  "🐪",
];
