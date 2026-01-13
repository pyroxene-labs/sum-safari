import { describe, it, expect } from 'vitest';
import { calculateProblemPoints, calculateExcessHints } from './scoringEngine';
import { SCORING, type ProblemResult } from '@/types';

describe('scoringEngine', () => {
    const mockResult: ProblemResult = {
        problemId: 'test',
        answered: true,
        correct: true,
        skipped: false,
        hintUsed: false,
        timeToAnswer: 5000,
        pointsAwarded: 0,
        timestamp: Date.now(),
    };

    describe('calculateProblemPoints', () => {
        it('returns base points for correct answer > 3 seconds', () => {
            const result = { ...mockResult, timeToAnswer: 5000 };
            const points = calculateProblemPoints(result, false);
            expect(points).toBe(SCORING.CORRECT_ANSWER);
        });

        it('applies fast time bonus (< 2s)', () => {
            const result = { ...mockResult, timeToAnswer: 1500 };
            const points = calculateProblemPoints(result, false);
            expect(points).toBe(SCORING.CORRECT_ANSWER + SCORING.TIME_BONUS_FAST);
        });

        it('applies quick time bonus (< 3s)', () => {
            const result = { ...mockResult, timeToAnswer: 2500 };
            const points = calculateProblemPoints(result, false);
            expect(points).toBe(SCORING.CORRECT_ANSWER + SCORING.TIME_BONUS_QUICK);
        });

        it('deducts hint penalty', () => {
            const result = { ...mockResult };
            const points = calculateProblemPoints(result, true);
            expect(points).toBe(SCORING.CORRECT_ANSWER - SCORING.HINT_PENALTY);
        });

        it('returns 0 for incorrect answer', () => {
            const result = { ...mockResult, correct: false };
            const points = calculateProblemPoints(result, false);
            expect(points).toBe(0);
        });

        it('returns skip penalty for skipped', () => {
            const result = { ...mockResult, skipped: true, correct: false };
            const points = calculateProblemPoints(result, false);
            expect(points).toBe(-SCORING.SKIP_PENALTY);
        });
    });

    describe('calculateExcessHints', () => {
        it('returns 0 if under threshold', () => {
            // 2 minutes session, allowed hints = 2 * 2 = 4
            const hints = [1000, 2000, 3000];
            const excess = calculateExcessHints(hints, 120000); // 2 mins
            expect(excess).toBe(0);
        });

        it('returns excess count if over threshold', () => {
            // 2 minutes session, allowed hints = 4
            const hints = [1, 2, 3, 4, 5, 6]; // 6 hints
            const excess = calculateExcessHints(hints, 120000);
            expect(excess).toBe(2);
        });
    });
});
