// ============================================
// Domain Module - Problem Generation
// ============================================

// Re-export main API
export { generateProblem, formatAnswer, isAnswerCorrect } from "./problemGenerator";

// Re-export registry for extensibility
export { registerOperator, getOperator, getAllOperators } from "./operators";

// Re-export types
export type { OperatorConfig, OperatorDifficultyConfig, OperatorConstraints } from "./types";
