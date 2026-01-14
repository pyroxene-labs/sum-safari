// ============================================
// Math Problem Generator
// Generates problems based on difficulty and operators
// ============================================

import type { Problem, Operator, Difficulty } from "@/types";
import { SAFARI_ANIMALS } from "@/types";

/**
 * Generate a random number in range (inclusive)
 */
function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get a random item from an array
 */
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get number range based on difficulty
 */
function getNumberRange(difficulty: Difficulty): { min: number; max: number } {
  switch (difficulty) {
    case "easy":
      return { min: 1, max: 10 };
    case "medium":
      return { min: 10, max: 50 };
    case "hard":
      return { min: 50, max: 100 };
    default:
      return { min: 1, max: 10 };
  }
}

/**
 * Generate an addition problem
 */
function generateAddition(difficulty: Difficulty): Omit<Problem, "id" | "animal"> {
  const range = getNumberRange(difficulty);
  const operand1 = getRandomNumber(range.min, range.max);
  const operand2 = getRandomNumber(range.min, range.max);

  return {
    operand1,
    operand2,
    operator: "+",
    answer: operand1 + operand2,
    difficulty,
  };
}

/**
 * Generate a subtraction problem (never negative result)
 */
function generateSubtraction(difficulty: Difficulty): Omit<Problem, "id" | "animal"> {
  const range = getNumberRange(difficulty);
  let operand1 = getRandomNumber(range.min, range.max);
  let operand2 = getRandomNumber(range.min, range.max);

  // Ensure operand1 >= operand2 for non-negative result
  if (operand1 < operand2) {
    [operand1, operand2] = [operand2, operand1];
  }

  return {
    operand1,
    operand2,
    operator: "-",
    answer: operand1 - operand2,
    difficulty,
  };
}

/**
 * Generate a multiplication problem
 */
function generateMultiplication(difficulty: Difficulty): Omit<Problem, "id" | "animal"> {
  let operand1 = 1;
  let operand2 = 1;

  switch (difficulty) {
    case "easy":
      operand1 = getRandomNumber(1, 5);
      operand2 = getRandomNumber(1, 5);
      break;
    case "medium":
      operand1 = getRandomNumber(2, 10);
      operand2 = getRandomNumber(2, 10);
      break;
    case "hard":
      operand1 = getRandomNumber(5, 12);
      operand2 = getRandomNumber(5, 12);
      break;
  }

  return {
    operand1,
    operand2,
    operator: "×",
    answer: operand1 * operand2,
    difficulty,
  };
}

/**
 * Generate a division problem
 * Easy/Medium: whole number results only
 * Hard: allows common decimals (0.5, 0.25, 0.33, 0.2, 0.75)
 */
function generateDivision(difficulty: Difficulty): Omit<Problem, "id" | "animal"> {
  let operand1 = 1;
  let operand2 = 1;
  let answer = 1;

  if (difficulty === "hard" && Math.random() < 0.3) {
    // 30% chance of decimal answer on hard
    // Pick a divisor that produces relatively clean decimals
    const possibleDivisors = [2, 3, 4, 5]; // Results in .5, .33, .25, .2
    operand2 = getRandomItem(possibleDivisors);

    // Ensure we get a non-integer result
    do {
      operand1 = getRandomNumber(1, 20);
    } while (operand1 % operand2 === 0);

    answer = Math.round((operand1 / operand2) * 100) / 100;
  } else {
    // Whole number division
    let quotient = 1;

    switch (difficulty) {
      case "easy":
        quotient = getRandomNumber(1, 5);
        operand2 = getRandomNumber(1, 5);
        break;
      case "medium":
        quotient = getRandomNumber(2, 10);
        operand2 = getRandomNumber(2, 10);
        break;
      case "hard":
        quotient = getRandomNumber(3, 12);
        operand2 = getRandomNumber(3, 12);
        break;
    }

    operand1 = quotient * operand2;
    answer = quotient;
  }

  return {
    operand1,
    operand2,
    operator: "÷",
    answer,
    difficulty,
  };
}

/**
 * Generate a problem for the given difficulty and operators
 */
// prettier-ignore
export function generateProblem(
  difficulty: Difficulty,
  operators: Operator[] = ["+", "-", "×", "÷"]
): Problem {
  const operator = getRandomItem(operators);
  let problemData: Omit<Problem, "id" | "animal">;

  switch (operator) {
    case "+":
      problemData = generateAddition(difficulty);
      break;
    case "-":
      problemData = generateSubtraction(difficulty);
      break;
    case "×":
      problemData = generateMultiplication(difficulty);
      break;
    case "÷":
      problemData = generateDivision(difficulty);
      break;
    default:
      problemData = generateAddition(difficulty);
  }

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
