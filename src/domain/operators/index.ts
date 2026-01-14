// ============================================
// Operator Registry
// ============================================

import type { Operator } from "@/types";
import type { OperatorConfig } from "../types";

import { additionOperator } from "./addition";
import { subtractionOperator } from "./subtraction";
import { multiplicationOperator } from "./multiplication";
import { divisionOperator } from "./division";

const operators = new Map<Operator, OperatorConfig>();

/**
 * Register an operator configuration
 */
export function registerOperator(config: OperatorConfig): void {
  operators.set(config.symbol, config);
}

/**
 * Get operator configuration by symbol
 */
export function getOperator(symbol: Operator): OperatorConfig | undefined {
  return operators.get(symbol);
}

/**
 * Get all registered operators
 */
export function getAllOperators(): OperatorConfig[] {
  return Array.from(operators.values());
}

// Register built-in operators
registerOperator(additionOperator);
registerOperator(subtractionOperator);
registerOperator(multiplicationOperator);
registerOperator(divisionOperator);

// Re-export utilities for use by custom operators
export { getRandomNumber, getRandomItem } from "./utils";
