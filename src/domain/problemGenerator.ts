// ============================================
// Problem Generator
// Main entry point for generating math problems
// ============================================

import type { Problem, Operator, Difficulty } from "@/types";
import { SAFARI_ANIMALS } from "@/types";
import { getOperator, getRandomItem } from "./operators";

/**
 * Generate a problem for the given difficulty and operators
 */
export function generateProblem(difficulty: Difficulty, operators: Operator[] = ["+", "-", "×", "÷"]): Problem {
  const operatorSymbol = getRandomItem(operators);
  const operatorConfig = getOperator(operatorSymbol);

  if (!operatorConfig) {
    throw new Error(`Unknown operator: ${operatorSymbol}`);
  }

  const problemData = operatorConfig.generate(difficulty);

  return {
    ...problemData,
    id: crypto.randomUUID(),
    animal: getRandomItem(SAFARI_ANIMALS),
  };
}

/**
 * Format answer for display (handle decimals)
 */
export function formatAnswer(answer: number): string {
  if (Number.isInteger(answer)) {
    return answer.toString();
  }
  // Round to 2 decimal places
  return (Math.round(answer * 100) / 100).toString();
}

/**
 * Check if user answer is correct (with tolerance for decimals)
 */
export function isAnswerCorrect(userAnswer: number, correctAnswer: number): boolean {
  if (Number.isInteger(correctAnswer)) {
    return userAnswer === correctAnswer;
  }
  // Allow small tolerance for decimal answers
  return Math.abs(userAnswer - correctAnswer) < 0.01;
}
