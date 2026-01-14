// ============================================
// Division Operator
// ============================================

import type { Difficulty, Problem } from "@/types";
import type { OperatorConfig } from "../types";
import { getRandomNumber, getRandomItem } from "./utils";

export const divisionOperator: OperatorConfig = {
  symbol: "÷",
  label: "Division",
  displaySymbol: "➗",
  difficulties: {
    easy: {
      operand1: { min: 1, max: 5 }, // These are quotient ranges
      operand2: { min: 1, max: 5 }, // Divisor ranges
    },
    medium: {
      operand1: { min: 2, max: 10 },
      operand2: { min: 2, max: 10 },
    },
    hard: {
      operand1: { min: 3, max: 12 },
      operand2: { min: 3, max: 12 },
      constraints: {
        allowDecimals: true,
        decimalProbability: 0.3,
      },
    },
  },

  generate(difficulty: Difficulty): Omit<Problem, "id" | "animal"> {
    const config = this.difficulties[difficulty];
    let operand1: number;
    let operand2: number;
    let answer: number;

    const allowDecimals = config.constraints?.allowDecimals ?? false;
    const decimalProbability = config.constraints?.decimalProbability ?? 0;

    if (allowDecimals && Math.random() < decimalProbability) {
      // Generate a decimal answer
      const possibleDivisors = [2, 3, 4, 5]; // Results in .5, .33, .25, .2
      operand2 = getRandomItem(possibleDivisors);

      // Ensure we get a non-integer result
      do {
        operand1 = getRandomNumber(1, 20);
      } while (operand1 % operand2 === 0);

      answer = Math.round((operand1 / operand2) * 100) / 100;
    } else {
      // Whole number division: generate quotient first, then compute dividend
      const quotient = getRandomNumber(config.operand1.min, config.operand1.max);
      operand2 = getRandomNumber(config.operand2.min, config.operand2.max);
      operand1 = quotient * operand2;
      answer = quotient;
    }

    return {
      operand1,
      operand2,
      operator: this.symbol,
      answer,
      difficulty,
    };
  },
};
