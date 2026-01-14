// ============================================
// Domain Types for Problem Generation
// ============================================

import type { Operator, Difficulty, Problem } from "@/types";

/**
 * Configuration for difficulty-specific operand ranges
 */
export interface OperatorDifficultyConfig {
  operand1: { min: number; max: number };
  operand2: { min: number; max: number };
  constraints?: OperatorConstraints;
}

/**
 * Optional constraints for problem generation
 */
export interface OperatorConstraints {
  /** Allow decimal answers (e.g., for hard division) */
  allowDecimals?: boolean;
  /** Probability of generating a decimal answer (0-1) */
  decimalProbability?: number;
  /** Ensure result is non-negative (for subtraction on easy/medium) */
  ensureNonNegative?: boolean;
}

/**
 * Configuration for an operator
 * Each operator owns its difficulty ranges and generation logic
 */
export interface OperatorConfig {
  /** The operator symbol used in types (e.g., "+", "-") */
  symbol: Operator;
  /** Human-readable label (e.g., "Addition", "Subtraction") */
  label: string;
  /** Display symbol shown to user (e.g., "×" vs "*") */
  displaySymbol: string;
  /** Per-difficulty configuration */
  difficulties: Record<Difficulty, OperatorDifficultyConfig>;
  /** Generate a problem for the given difficulty */
  generate(difficulty: Difficulty): Omit<Problem, "id" | "animal">;
}
