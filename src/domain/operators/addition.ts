// ============================================
// Addition Operator
// ============================================

import type { Difficulty, Problem } from "@/types";
import type { OperatorConfig } from "../types";
import { getRandomNumber } from "./utils";

export const additionOperator: OperatorConfig = {
  symbol: "+",
  label: "Addition",
  displaySymbol: "➕",
  difficulties: {
    easy: {
      operand1: { min: 1, max: 10 },
      operand2: { min: 1, max: 10 },
    },
    medium: {
      operand1: { min: 5, max: 50 },
      operand2: { min: 5, max: 50 },
    },
    hard: {
      operand1: { min: 50, max: 100 },
      operand2: { min: 50, max: 100 },
    },
  },

  generate(difficulty: Difficulty): Omit<Problem, "id" | "animal"> {
    const config = this.difficulties[difficulty];
    const operand1 = getRandomNumber(config.operand1.min, config.operand1.max);
    const operand2 = getRandomNumber(config.operand2.min, config.operand2.max);

    return {
      operand1,
      operand2,
      operator: this.symbol,
      answer: operand1 + operand2,
      difficulty,
    };
  },
};
