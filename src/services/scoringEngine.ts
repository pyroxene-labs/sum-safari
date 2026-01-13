// ============================================
// Scoring Engine
// Modular scoring system with extensibility
// ============================================

import {
    type ProblemResult,
    type ScoreSummary,
    type Difficulty,
    SCORING,
} from "@/types";

/**
 * Calculate points for a single problem result
 */
export function calculateProblemPoints(
    result: ProblemResult,
    hintUsed: boolean
): number {
    if (result.skipped) {
        return -SCORING.SKIP_PENALTY;
    }

    if (!result.correct) {
        return 0;
    }

    let points = SCORING.CORRECT_ANSWER;

    // Apply hint penalty if used
    if (hintUsed) {
        points -= SCORING.HINT_PENALTY;
    }

    // Apply time bonus
    const timeSeconds = result.timeToAnswer / 1000;
    if (timeSeconds < 2) {
        points += SCORING.TIME_BONUS_FAST;
    } else if (timeSeconds < 3) {
        points += SCORING.TIME_BONUS_QUICK;
    }

    return points;
}

/**
 * Calculate excess hint penalty based on hint frequency
 * Returns the number of excess hints (hints beyond 2 per minute)
 */
export function calculateExcessHints(
    hintTimestamps: number[],
    sessionDurationMs: number
): number {
    if (hintTimestamps.length === 0) {
        return 0;
    }

    const sessionMinutes = Math.max(1, sessionDurationMs / 60000);
    const allowedHints = Math.floor(
        sessionMinutes * SCORING.EXCESS_HINT_THRESHOLD
    );
    const excessHints = Math.max(0, hintTimestamps.length - allowedHints);

    return excessHints;
}

/**
 * Calculate complete score summary for a session
 */
export function calculateScoreSummary(
    results: ProblemResult[],
    hintTimestamps: number[],
    difficulty: Difficulty,
    sessionDurationMs: number
): ScoreSummary {
    let basePoints = 0;
    let timeBonusPoints = 0;
    let hintPenalty = 0;
    let correctCount = 0;
    let skippedCount = 0;

    for (const result of results) {
        if (result.skipped) {
            skippedCount++;
            basePoints = Math.max(0, basePoints - SCORING.SKIP_PENALTY);
        } else if (result.correct) {
            correctCount++;
            basePoints += SCORING.CORRECT_ANSWER;

            // Track hint penalty separately
            if (result.hintUsed) {
                hintPenalty += SCORING.HINT_PENALTY;
            }

            // Track time bonus separately
            const timeSeconds = result.timeToAnswer / 1000;
            if (timeSeconds < 2) {
                timeBonusPoints += SCORING.TIME_BONUS_FAST;
            } else if (timeSeconds < 3) {
                timeBonusPoints += SCORING.TIME_BONUS_QUICK;
            }
        }
        // Wrong answers = 0 points, already handled
    }

    // Calculate excess hint penalty
    const excessHints = calculateExcessHints(hintTimestamps, sessionDurationMs);
    const excessHintPenalty = excessHints * SCORING.EXCESS_HINT_PENALTY;

    // Calculate subtotal before multiplier
    const subtotal = Math.max(
        0,
        basePoints + timeBonusPoints - hintPenalty - excessHintPenalty
    );

    // Apply difficulty multiplier
    const difficultyMultiplier = SCORING.DIFFICULTY_MULTIPLIERS[difficulty];
    const finalScore = Math.round(subtotal * difficultyMultiplier);

    return {
        basePoints,
        timeBonusPoints,
        hintPenalty,
        excessHintPenalty,
        subtotal,
        difficultyMultiplier,
        finalScore,
        problemsAttempted: results.length,
        correctCount,
        skippedCount,
        hintsUsed: hintTimestamps.length,
    };
}

/**
 * Get a human-readable description of the score breakdown
 */
export function getScoreBreakdownText(summary: ScoreSummary): string[] {
    const lines: string[] = [];

    lines.push(`Problems Attempted: ${summary.problemsAttempted}`);
    lines.push(
        `Correct Answers: ${summary.correctCount} (+${summary.basePoints} base points)`
    );

    if (summary.skippedCount > 0) {
        lines.push(
            `Skipped: ${summary.skippedCount} (-${summary.skippedCount * SCORING.SKIP_PENALTY} points)`
        );
    }

    if (summary.timeBonusPoints > 0) {
        lines.push(`Time Bonus: +${summary.timeBonusPoints} points`);
    }

    if (summary.hintsUsed > 0) {
        lines.push(`Hints Used: ${summary.hintsUsed} (-${summary.hintPenalty} points)`);
    }

    if (summary.excessHintPenalty > 0) {
        lines.push(`Excess Hint Penalty: -${summary.excessHintPenalty} points`);
    }

    lines.push(`Subtotal: ${summary.subtotal} points`);
    lines.push(`Difficulty Multiplier: ×${summary.difficultyMultiplier}`);
    lines.push(`Final Score: ${summary.finalScore} points`);

    return lines;
}
