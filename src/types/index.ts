export interface Problem {
  id: string;
  operand1: number;
  operand2: number;
  operator: "×" | "+" | "-" | "÷";
  answer: number;
  animal: string; // Animal emoji for each problem
  difficulty: "easy" | "medium" | "hard";
}

export interface GameState {
  score: number
  currentLevel: number
  problemsSolved: number
  timeRemaining: number
}
