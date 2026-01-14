<script setup lang="ts">
import { SCORING, type ScoreSummary } from "@/types";

defineProps<{
  summary: ScoreSummary;
}>();
</script>

<template>
  <div class="score-card">
    <div class="final-score">
      <span class="score-label">Final Score</span>
      <span class="score-number">{{ summary.finalScore }}</span>
    </div>

    <div class="score-breakdown">
      <h3 class="breakdown-title">📊 Score Breakdown</h3>

      <div class="breakdown-row">
        <span class="breakdown-label">
          <span class="row-emoji" aria-hidden="true">🎯</span>
          Problems Attempted
        </span>
        <span class="breakdown-value">{{ summary.problemsAttempted }}</span>
      </div>

      <div class="breakdown-row positive">
        <span class="breakdown-label">
          <span class="row-emoji" aria-hidden="true">✅</span>
          Correct Answers
        </span>
        <span class="breakdown-value">
          {{ summary.correctCount }}
          <span class="points" :aria-label="`plus ${summary.basePoints} points`">+{{ summary.basePoints }}</span>
        </span>
      </div>

      <div v-if="summary.skippedCount > 0" class="breakdown-row negative">
        <span class="breakdown-label">
          <span class="row-emoji" aria-hidden="true">⏭️</span>
          Skipped
        </span>
        <span class="breakdown-value">
          {{ summary.skippedCount }}
          <span class="points" :aria-label="`minus ${summary.skippedCount * SCORING.SKIP_PENALTY} points`">-{{ summary.skippedCount * SCORING.SKIP_PENALTY }}</span>
        </span>
      </div>

      <div v-if="summary.timeBonusPoints > 0" class="breakdown-row positive">
        <span class="breakdown-label">
          <span class="row-emoji" aria-hidden="true">⚡</span>
          Time Bonus
        </span>
        <span class="breakdown-value">
          <span class="points" :aria-label="`plus ${summary.timeBonusPoints} points`">+{{ summary.timeBonusPoints }}</span>
        </span>
      </div>

      <div v-if="summary.hintsUsed > 0" class="breakdown-row negative">
        <span class="breakdown-label">
          <span class="row-emoji" aria-hidden="true">💡</span>
          Hints Used
        </span>
        <span class="breakdown-value">
          {{ summary.hintsUsed }}
          <span class="points" :aria-label="`minus ${summary.hintPenalty} points`">-{{ summary.hintPenalty }}</span>
        </span>
      </div>

      <div v-if="summary.excessHintPenalty > 0" class="breakdown-row negative warning">
        <span class="breakdown-label">
          <span class="row-emoji" aria-hidden="true">⚠️</span>
          Excess Hint Penalty
          <span class="hint-explanation">(&gt;2 hints/min)</span>
        </span>
        <span class="breakdown-value">
          <span class="points" :aria-label="`minus ${summary.excessHintPenalty} points`">-{{ summary.excessHintPenalty }}</span>
        </span>
      </div>

      <div class="breakdown-divider" role="separator"></div>

      <div class="breakdown-row subtotal">
        <span class="breakdown-label">Subtotal</span>
        <span class="breakdown-value">{{ summary.subtotal }}</span>
      </div>

      <div class="breakdown-row multiplier">
        <span class="breakdown-label">
          <span class="row-emoji" aria-hidden="true">🎚️</span>
          Difficulty Multiplier
        </span>
        <span class="breakdown-value" :aria-label="`multiplier ${summary.difficultyMultiplier} times`">×{{ summary.difficultyMultiplier }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.score-card {
  width: 100%;
  background: white;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  border: 3px solid #e5e7eb;
}

.final-score {
  background: linear-gradient(135deg, #34d399 0%, #059669 100%);
  padding: 2rem;
  text-align: center;
  color: white;
}

.score-label {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  opacity: 0.95;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.score-number {
  font-size: 5rem;
  font-weight: 800;
  text-shadow: 3px 3px 0 rgba(0, 0, 0, 0.2);
  line-height: 1;
}

.score-breakdown {
  padding: 1.5rem;
  background: #f9fafb;
}

.breakdown-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.breakdown-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  background: white;
  border-radius: 0.75rem;
  margin-bottom: 0.5rem;
  border: 1px solid #e5e7eb;
}

.breakdown-row:last-child {
  margin-bottom: 0;
}

.breakdown-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #374151;
  font-weight: 500;
}

.row-emoji {
  font-size: 1.25rem;
}

.breakdown-value {
  font-weight: 700;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
}

.points {
  font-size: 0.9rem;
  padding: 0.25rem 0.6rem;
  border-radius: 0.5rem;
  font-weight: 600;
}

.positive .points {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #6ee7b7;
}

.negative .points {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

.warning .breakdown-label {
  color: #92400e;
}

.hint-explanation {
  font-size: 0.8rem;
  opacity: 0.7;
}

.breakdown-divider {
  height: 3px;
  background: linear-gradient(90deg, #e5e7eb 0%, #d1d5db 50%, #e5e7eb 100%);
  margin: 1rem 0;
  border-radius: 2px;
}

.subtotal {
  font-weight: 700;
  background: #f3f4f6;
  border: 2px solid #d1d5db;
}

.subtotal .breakdown-value {
  font-size: 1.25rem;
  color: #111827;
}

.multiplier {
  font-weight: 600;
  background: #fef3c7;
  border: 2px solid #fcd34d;
}

.multiplier .breakdown-label {
  color: #92400e;
}

.multiplier .breakdown-value {
  color: #92400e;
  font-size: 1.1rem;
}
</style>
