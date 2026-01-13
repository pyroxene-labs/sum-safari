import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import ProblemCard from './ProblemCard.vue';
import type { Problem } from '@/types';

// Mock dependencies
vi.mock('@/services/keyboardManager', () => ({
    useAutoFocusInput: vi.fn(),
    SHORTCUTS: { CHECK: { key: 'Enter' } },
    getShortcutLabel: () => 'Enter'
}));

describe('ProblemCard.vue', () => {
    const mockProblem: Problem = {
        id: '123',
        operand1: 5,
        operator: '+',
        operand2: 3,
        answer: 8,
        animal: '🦁',
        difficulty: 'easy'
    };

    it('renders problem details correctly', () => {
        const wrapper = mount(ProblemCard, {
            props: {
                problem: mockProblem,
                modelValue: '',
                isShowingFeedback: false,
                wasCorrect: false
            }
        });

        expect(wrapper.text()).toContain('🦁');
        expect(wrapper.text()).toContain('5 + 3 = ?');
    });

    it('emits update:modelValue when input changes', async () => {
        const wrapper = mount(ProblemCard, {
            props: {
                problem: mockProblem,
                modelValue: '',
                isShowingFeedback: false,
                wasCorrect: false
            }
        });

        const input = wrapper.find('input');
        await input.setValue('8');

        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        expect(wrapper.emitted('update:modelValue')![0]).toEqual(['8']);
    });

    it('shows feedback overlay when isShowingFeedback is true', () => {
        const wrapper = mount(ProblemCard, {
            props: {
                problem: mockProblem,
                modelValue: '8',
                isShowingFeedback: true,
                wasCorrect: true
            }
        });

        expect(wrapper.find('.feedback-overlay').exists()).toBe(true);
        expect(wrapper.text()).toContain('Great job!');
    });
});
