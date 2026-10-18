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
  it('strictly contains 50 states excluding Washington, D.C.', () => {
    expect(OFFICIAL_50_STATES.length).toBe(50);
    expect(OFFICIAL_50_STATES.find((s) => s.id === 'DC')).toBeUndefined();
  });

  it('generates questions exclusively from the 50 states', () => {
    for (let i = 0; i < 30; i++) {
      const q = generateQuestion('mixed');
      expect(q.targetState.id).not.toBe('DC');
    }
  });

  it('excludes answered/revealed state IDs when generating new questions', () => {
    const exclude = OFFICIAL_50_STATES.slice(0, 49).map((s) => s.id);
    const remaining = OFFICIAL_50_STATES[49];
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
    expect(evaluateAnswer('TX', 'TX')).toBe(true);
    expect(evaluateAnswer('tx', 'TX')).toBe(true);
    expect(evaluateAnswer('CA', 'TX')).toBe(false);
    expect(evaluateAnswer('', 'TX')).toBe(false);
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
    expect(calculateQuizRank(50, 50).grade).toBe('S');
    expect(calculateQuizRank(48, 50).grade).toBe('S');
    expect(calculateQuizRank(45, 50).grade).toBe('A');
    expect(calculateQuizRank(38, 50).grade).toBe('B');
    expect(calculateQuizRank(30, 50).grade).toBe('C');
    expect(calculateQuizRank(20, 50).grade).toBe('D');
    expect(calculateQuizRank(0, 0).grade).toBe('D');
  });

  it('formats quiz summary string properly', () => {
    const rank = calculateQuizRank(50, 50);
    const summary = formatQuizSummary(50, 50, 50, rank, 'state-name');
    expect(summary).toContain('Rank S');
    expect(summary).toContain('Master Cartographer');
    expect(summary).toContain('50/50 (100%)');
  });

  it('provides all 5 performance tiers in descending order', () => {
    expect(PERFORMANCE_TIERS.length).toBe(5);
    expect(PERFORMANCE_TIERS.map((t) => t.grade)).toEqual(['S', 'A', 'B', 'C', 'D']);
  });

  it('accurately calculates quiz progress and states remaining', () => {
    const start = calculateQuizProgress(0, 0, 50);
    expect(start.identifiedCount).toBe(0);
    expect(start.remainingCount).toBe(50);
    expect(start.percentage).toBe(0);

    const mid = calculateQuizProgress(20, 5, 50);
    expect(mid.identifiedCount).toBe(25);
    expect(mid.remainingCount).toBe(25);
    expect(mid.percentage).toBe(50);

    const done = calculateQuizProgress(48, 2, 50);
    expect(done.identifiedCount).toBe(50);
    expect(done.remainingCount).toBe(0);
    expect(done.percentage).toBe(100);
  });

  it('generates multiple choice questions with 4 choices including target', () => {
    const q = generateQuestion('multiple-choice');
    expect(q.questionType).toBe('multiple-choice');
    expect(q.prompt).toContain('Which state is highlighted');
    expect(q.choices).toBeDefined();
    expect(q.choices?.length).toBe(4);
    const targetIncluded = q.choices?.some((c) => c.id === q.targetState.id);
    expect(targetIncluded).toBe(true);
    const uniqueIds = new Set(q.choices?.map((c) => c.id));
    expect(uniqueIds.size).toBe(4);
  });

  it('formats quiz summary with multiple-choice mode', () => {
    const rank = calculateQuizRank(40, 50);
    const summary = formatQuizSummary(40, 50, 5, rank, 'multiple-choice');
    expect(summary).toContain('US State Quiz (Multiple Choice)');
    expect(summary).toContain('Rank B');
  });
});

