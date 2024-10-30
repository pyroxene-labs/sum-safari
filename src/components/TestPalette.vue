<template>
  <div class="min-h-screen bg-gradient-to-b from-safari-light to-safari-accent p-4">
    <!-- Header -->
    <h1 class="text-4xl font-bold text-safari-dark text-center mb-4">
      SumSafari
    </h1>

    <!-- Score card example -->
    <div class="card p-4 mb-6">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <span class="text-2xl">🏆</span>
          <span class="text-lg font-bold text-safari-dark">Score: 100</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-2xl">⏳</span>
          <span class="text-lg font-bold text-safari-dark-soft">1:30</span>
        </div>
      </div>
    </div>

    <!-- Problem card example -->
    <div class="card p-6 mb-6">
      <div class="text-center space-y-6">
        <div class="text-6xl">🦒</div>
        <div class="text-4xl font-bold text-safari-dark">
          7 × 6 = ?
        </div>
        <input
          type="number"
          class="input-primary"
          placeholder="?"
        >
      </div>
    </div>

    <!-- Button examples -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <button class="btn bg-safari-success text-safari-dark hover:opacity-90">
        Check
      </button>
      <button class="btn bg-safari-warning text-safari-dark hover:opacity-90">
        Skip
      </button>
      <button class="btn bg-safari-info text-safari-dark hover:opacity-90">
        Hint
      </button>
      <button class="btn bg-safari-primary text-safari-dark hover:opacity-90">
        New
      </button>
    </div>

    <!-- Status message examples -->
    <div class="mt-6 space-y-4">
      <div class="card bg-safari-success/30 p-4">
        <p class="text-safari-dark">Great job! 🎉</p>
      </div>
      <div class="card bg-safari-error/30 p-4">
        <p class="text-safari-dark">Try again! 💪</p>
      </div>
    </div>
  </div>
</template>