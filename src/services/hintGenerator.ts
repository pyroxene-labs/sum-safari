// ============================================
// Hint Generator
// Khan Academy-inspired hints for primary school math
// ============================================

import type { Problem, Hint, HintStrategy } from "@/types";

/**
 * Generate an appropriate hint for the given problem
 * Selects strategy based on problem characteristics
 */
export function generateHint(problem: Problem): Hint {
    switch (problem.operator) {
        case "+":
            return generateAdditionHint(problem);
        case "-":
            return generateSubtractionHint(problem);
        case "×":
            return generateMultiplicationHint(problem);
        case "÷":
            return generateDivisionHint(problem);
        default:
            return { strategy: "place-value", message: "Break the problem into smaller parts!" };
    }
}

/**
 * Addition hint strategies
 */
function generateAdditionHint(problem: Problem): Hint {
    const { operand1, operand2, answer } = problem;
    const larger = Math.max(operand1, operand2);
    const smaller = Math.min(operand1, operand2);

    // Check for "making tens" opportunity
    const ones1 = operand1 % 10;
    const ones2 = operand2 % 10;
    if (ones1 + ones2 === 10 || ones1 === 0 || ones2 === 0) {
        const tens1 = Math.floor(operand1 / 10) * 10;
        const tens2 = Math.floor(operand2 / 10) * 10;
        return {
            strategy: "making-tens",
            message: `Make a 10! Add the ones: ${ones1} + ${ones2} = ${ones1 + ones2}. Add the tens: ${tens1} + ${tens2} = ${tens1 + tens2}. Now combine them!`,
        };
    }

    // Check for doubles or near-doubles
    if (Math.abs(operand1 - operand2) <= 1) {
        if (operand1 === operand2) {
            return {
                strategy: "doubles",
                message: `This is a double! ${operand1} + ${operand1} = ${operand1} × 2 = ${answer}`,
            };
        }
        return {
            strategy: "doubles",
            message: `Almost a double! Think: ${smaller} + ${smaller} = ${smaller * 2}, then add 1 more = ${answer}`,
        };
    }

    // Place value for larger numbers
    if (larger >= 10) {
        const tens1 = Math.floor(operand1 / 10) * 10;
        const ones1 = operand1 % 10;
        const tens2 = Math.floor(operand2 / 10) * 10;
        const ones2 = operand2 % 10;
        return {
            strategy: "place-value",
            message: `Break it down! Tens: ${tens1} + ${tens2} = ${tens1 + tens2}. Ones: ${ones1} + ${ones2} = ${ones1 + ones2}. Add together: ${answer}`,
        };
    }

    // Default: counting on
    return {
        strategy: "counting-on",
        message: `Start at ${larger} and count up ${smaller} more: ${Array.from({ length: smaller }, (_, i) => larger + i + 1).join(", ")}`,
    };
}

/**
 * Subtraction hint strategies
 */
function generateSubtractionHint(problem: Problem): Hint {
    const { operand1, operand2, answer } = problem;

    // Number bonds for small numbers
    if (operand1 <= 20 && operand2 <= 10) {
        return {
            strategy: "number-bonds",
            message: `Think: what + ${operand2} = ${operand1}? The answer is ${answer}!`,
        };
    }

    // Place value for larger numbers
    if (operand1 >= 20) {
        const tens1 = Math.floor(operand1 / 10) * 10;
        const ones1 = operand1 % 10;
        const tens2 = Math.floor(operand2 / 10) * 10;
        const ones2 = operand2 % 10;

        if (ones1 >= ones2) {
            return {
                strategy: "place-value",
                message: `Break it down! Tens: ${tens1} - ${tens2} = ${tens1 - tens2}. Ones: ${ones1} - ${ones2} = ${ones1 - ones2}. Combine: ${answer}`,
            };
        }
    }

    // Counting up for moderate numbers
    if (operand2 <= 20) {
        return {
            strategy: "counting-up",
            message: `Count up from ${operand2} to ${operand1}. How many jumps? That's your answer: ${answer}!`,
        };
    }

    // Counting back
    return {
        strategy: "counting-back",
        message: `Start at ${operand1} and count back ${operand2}. Try counting back by 10s first, then the rest.`,
    };
}

/**
 * Multiplication hint strategies
 */
function generateMultiplicationHint(problem: Problem): Hint {
    const { operand1, operand2, answer } = problem;
    const smaller = Math.min(operand1, operand2);
    const larger = Math.max(operand1, operand2);

    // Doubling for ×2
    if (smaller === 2) {
        return {
            strategy: "doubling",
            message: `×2 means double! Double ${larger} = ${answer}`,
        };
    }

    // Known facts with adjustment
    if (smaller >= 5 && smaller <= 9) {
        const knownMultiplier = smaller - 1;
        const knownProduct = larger * knownMultiplier;
        return {
            strategy: "known-facts",
            message: `Use a fact you know! ${larger} × ${knownMultiplier} = ${knownProduct}. Now add one more ${larger}: ${knownProduct} + ${larger} = ${answer}`,
        };
    }

    // Skip counting for smaller multipliers
    if (smaller <= 5) {
        const skipCount = Array.from({ length: smaller }, (_, i) => larger * (i + 1));
        return {
            strategy: "skip-counting",
            message: `Count by ${larger}s, ${smaller} times: ${skipCount.join(", ")}`,
        };
    }

    // Repeated addition
    return {
        strategy: "repeated-addition",
        message: `${operand1} × ${operand2} means adding ${operand1} a total of ${operand2} times. Try adding in groups!`,
    };
}

/**
 * Division hint strategies
 */
function generateDivisionHint(problem: Problem): Hint {
    const { operand1, operand2, answer } = problem;

    // Fair sharing for relatable numbers
    if (operand1 <= 50 && operand2 <= 10) {
        return {
            strategy: "fair-sharing",
            message: `Imagine sharing ${operand1} cookies among ${operand2} friends equally. Each friend gets ${answer} cookies!`,
        };
    }

    // Inverse multiplication
    if (operand2 <= 12) {
        return {
            strategy: "inverse-multiplication",
            message: `Think backwards! What times ${operand2} equals ${operand1}? __ × ${operand2} = ${operand1}. The answer is ${answer}!`,
        };
    }

    // Grouping
    if (operand2 <= 20) {
        return {
            strategy: "grouping",
            message: `How many groups of ${operand2} can you make from ${operand1}? Count by ${operand2}s until you reach ${operand1}.`,
        };
    }

    // Repeated subtraction
    return {
        strategy: "repeated-subtraction",
        message: `How many times can you subtract ${operand2} from ${operand1}? Keep subtracting until you can't anymore!`,
    };
}

/**
 * Get display name for hint strategy
 */
export function getStrategyDisplayName(strategy: HintStrategy): string {
    const names: Record<HintStrategy, string> = {
        "making-tens": "Making Tens",
        "place-value": "Place Value",
        "counting-on": "Counting On",
        "doubles": "Doubles",
        "counting-back": "Counting Back",
        "counting-up": "Counting Up",
        "number-bonds": "Number Bonds",
        "skip-counting": "Skip Counting",
        "repeated-addition": "Repeated Addition",
        "known-facts": "Known Facts",
        "doubling": "Doubling",
        "array": "Array",
        "fair-sharing": "Fair Sharing",
        "grouping": "Grouping",
        "inverse-multiplication": "Inverse Multiplication",
        "repeated-subtraction": "Repeated Subtraction",
    };
    return names[strategy] || strategy;
}
