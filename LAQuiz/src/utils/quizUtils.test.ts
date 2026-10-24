import { describe, it, expect } from 'vitest';
import {
  generateQuestion,
  evaluateAnswer,
  calculateNewStreak,
  getHintText,
  OFFICIAL_50_STATES,
  calculateQuizRank,
  formatQuizSummary,
  calculateQuizProgress,
  PERFORMANCE_TIERS,
} from './quizUtils';

describe('quizUtils', () => {
  it('strictly contains 21 sovereign countries', () => {
    expect(OFFICIAL_50_STATES.length).toBe(21);
  });

  it('generates questions from the 21 countries', () => {
    for (let i = 0; i < 30; i++) {
      const q = generateQuestion('mixed');
      expect(q.targetState.id).toBeDefined();
    }
  });

  it('excludes answered/revealed state IDs when generating new questions', () => {
    const exclude = OFFICIAL_50_STATES.slice(0, 20).map((s) => s.id);
    const remaining = OFFICIAL_50_STATES[20];
    const q = generateQuestion('state-name', exclude);
    expect(q.targetState.id).toBe(remaining.id);
  });

  it('generates a question with target state and prompt', () => {
    const question = generateQuestion('state-name');
    expect(question.targetState).toBeDefined();
    expect(question.prompt).toContain(question.targetState.name);
    expect(question.questionType).toBe('state-name');
  });

  it('generates a capital question with capital name in prompt', () => {
    const question = generateQuestion('capital');
    expect(question.targetState).toBeDefined();
    expect(question.prompt).toContain(question.targetState.capital);
    expect(question.questionType).toBe('capital');
  });

  it('evaluates answers correctly', () => {
    expect(evaluateAnswer('MX', 'MX')).toBe(true);
    expect(evaluateAnswer('mx', 'MX')).toBe(true);
    expect(evaluateAnswer('CU', 'MX')).toBe(false);
    expect(evaluateAnswer('', 'MX')).toBe(false);
  });

  it('calculates streaks accurately', () => {
    expect(calculateNewStreak(0, true)).toBe(1);
    expect(calculateNewStreak(3, true)).toBe(4);
    expect(calculateNewStreak(5, false)).toBe(0);
  });

  it('returns appropriate region hint', () => {
    const question = generateQuestion('state-name');
    const hint = getHintText(question.targetState);
    expect(hint).toContain(question.targetState.region);
  });

  it('assigns correct quiz rank tiers based on accuracy', () => {
    expect(calculateQuizRank(21, 21).grade).toBe('S');
    expect(calculateQuizRank(20, 21).grade).toBe('S');
    expect(calculateQuizRank(18, 21).grade).toBe('A');
    expect(calculateQuizRank(15, 21).grade).toBe('B');
    expect(calculateQuizRank(12, 21).grade).toBe('C');
    expect(calculateQuizRank(6, 21).grade).toBe('D');
    expect(calculateQuizRank(0, 0).grade).toBe('D');
  });

  it('formats quiz summary string properly', () => {
    const rank = calculateQuizRank(21, 21);
    const summary = formatQuizSummary(21, 21, 21, rank, 'state-name');
    expect(summary).toContain('Rank S');
    expect(summary).toContain('Master Cartographer');
    expect(summary).toContain('21/21 (100%)');
  });

  it('provides all 5 performance tiers in descending order', () => {
    expect(PERFORMANCE_TIERS.length).toBe(5);
    expect(PERFORMANCE_TIERS.map((t) => t.grade)).toEqual(['S', 'A', 'B', 'C', 'D']);
  });

  it('accurately calculates quiz progress and countries remaining', () => {
    const start = calculateQuizProgress(0, 0, 21);
    expect(start.identifiedCount).toBe(0);
    expect(start.remainingCount).toBe(21);
    expect(start.percentage).toBe(0);

    const mid = calculateQuizProgress(10, 2, 21);
    expect(mid.identifiedCount).toBe(12);
    expect(mid.remainingCount).toBe(9);
    expect(mid.percentage).toBe(57);

    const done = calculateQuizProgress(20, 1, 21);
    expect(done.identifiedCount).toBe(21);
    expect(done.remainingCount).toBe(0);
    expect(done.percentage).toBe(100);
  });

  it('generates multiple choice questions with 4 choices including target', () => {
    const q = generateQuestion('multiple-choice');
    expect(q.questionType).toBe('multiple-choice');
    expect(q.prompt).toContain('Which country is highlighted');
    expect(q.choices).toBeDefined();
    expect(q.choices?.length).toBe(4);
    const targetIncluded = q.choices?.some((c) => c.id === q.targetState.id);
    expect(targetIncluded).toBe(true);
    const uniqueIds = new Set(q.choices?.map((c) => c.id));
    expect(uniqueIds.size).toBe(4);
  });

  it('formats quiz summary with multiple-choice mode', () => {
    const rank = calculateQuizRank(16, 21);
    const summary = formatQuizSummary(16, 21, 5, rank, 'multiple-choice');
    expect(summary).toContain('Central America & Caribbean Quiz (Multiple Choice)');
    expect(summary).toContain('Rank B');
  });
});
