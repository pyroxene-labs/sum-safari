import { describe, it, expect } from 'vitest';
import { generateProblem, isAnswerCorrect } from './mathGen';
import { SAFARI_ANIMALS } from '@/types';

// Mock crypto.randomUUID since it's used in proper environment but might fail in some test envs depending on setup
// But jsdom usually supports it. If it fails we'll mock it.

describe('mathGen', () => {
    describe('generateProblem', () => {
        it('generates addition within range', () => {
            const p = generateProblem('easy', ['+']);
            expect(p.operator).toBe('+');
            expect(p.answer).toBe(p.operand1 + p.operand2);
            expect(SAFARI_ANIMALS).toContain(p.animal);
        });

        it('generates subtraction without negatives', () => {
            // run multiple times to ensure no negatives appear by random chance
            for (let i = 0; i < 20; i++) {
                const p = generateProblem('medium', ['-']);
                expect(p.operator).toBe('-');
                expect(p.operand1).toBeGreaterThanOrEqual(p.operand2);
                expect(p.answer).toBeGreaterThanOrEqual(0);
            }
        });

        it('generates multiplication respecting difficulty', () => {
            const p = generateProblem('easy', ['×']);
            expect(p.operator).toBe('×');
            // Easy mult 1-5
            expect(p.operand1).toBeLessThanOrEqual(5);
            expect(p.operand2).toBeLessThanOrEqual(5);
        });

        it('generates whole number division for easy/medium', () => {
            for (let i = 0; i < 20; i++) {
                const p = generateProblem('medium', ['÷']);
                expect(Number.isInteger(p.answer)).toBe(true);
                expect(p.operand1 % p.operand2).toBe(0);
            }
        });
    });

    describe('isAnswerCorrect', () => {
        it('exact match for integers', () => {
            expect(isAnswerCorrect(5, 5)).toBe(true);
            expect(isAnswerCorrect(5, 6)).toBe(false);
        });

        it('tolerance for decimals', () => {
            expect(isAnswerCorrect(0.33, 1 / 3)).toBe(true);
            expect(isAnswerCorrect(0.333, 1 / 3)).toBe(true);
            expect(isAnswerCorrect(0.35, 1 / 3)).toBe(false);
        });
    });
});
