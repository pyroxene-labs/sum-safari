import type { Problem } from '@/types'

const SAFARI_ANIMALS = ['🦁', '🦒', '🦊', '🦘', '🦛', '🐘', '🦏', '🦬', '🦓']

export const generateProblem = (difficulty: Problem['difficulty']): Problem => {
  const getRandomNumber = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min

  const operators: Problem['operator'][] = ['+', '-', '×', '÷']
  const operator = operators[Math.floor(Math.random() * operators.length)]

  let operand1: number, operand2: number, answer: number

  switch(difficulty) {
    case 'easy':
      operand1 = getRandomNumber(1, 10)
      operand2 = getRandomNumber(1, 10)
      break
    case 'medium':
      operand1 = getRandomNumber(10, 50)
      operand2 = getRandomNumber(10, 50)
      break
    case 'hard':
      operand1 = getRandomNumber(50, 100)
      operand2 = getRandomNumber(50, 100)
      break
  }

  // Ensure division results in whole numbers
  if (operator === '÷') {
    answer = operand2
    operand1 = operand2 * getRandomNumber(1, 10)
    operand2 = operand2
  } else {
    answer = eval(`${operand1}${operator === '×' ? '*' : operator}${operand2}`)
  }

  return {
    id: crypto.randomUUID(),
    operand1,
    operand2,
    operator,
    answer,
    animal: SAFARI_ANIMALS[Math.floor(Math.random() * SAFARI_ANIMALS.length)],
    difficulty
  }
}