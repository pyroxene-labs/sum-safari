// ============================================
// Subtraction Operator
// ============================================

import type { Difficulty, Problem } from "@/types";
import type { OperatorConfig } from "../types";
import { getRandomNumber } from "./utils";

export const subtractionOperator: OperatorConfig = {
  symbol: "-",
  label: "Subtraction",
  displaySymbol: "➖",
  difficulties: {
    easy: {
      operand1: { min: 1, max: 10 },
      operand2: { min: 1, max: 10 },
      constraints: { ensureNonNegative: true },
    },
    medium: {
      operand1: { min: 10, max: 50 },
      operand2: { min: 10, max: 50 },
      constraints: { ensureNonNegative: true },
    },
    hard: {
      operand1: { min: 50, max: 100 },
      operand2: { min: 50, max: 100 },
      // No ensureNonNegative — allows negative results on hard
    },
  },

  generate(difficulty: Difficulty): Omit<Problem, "id" | "animal"> {
    const config = this.difficulties[difficulty];
    let operand1 = getRandomNumber(config.operand1.min, config.operand1.max);
    let operand2 = getRandomNumber(config.operand2.min, config.operand2.max);

    // Ensure non-negative result if constraint is set
    if (config.constraints?.ensureNonNegative && operand1 < operand2) {
      [operand1, operand2] = [operand2, operand1];
    }

    return {
      operand1,
      operand2,
      operator: this.symbol,
      answer: operand1 - operand2,
      difficulty,
    };
  },
};
