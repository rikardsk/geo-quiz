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
  it('strictly contains 45 European countries', () => {
    expect(OFFICIAL_50_STATES.length).toBe(45);
  });

  it('generates questions from the 45 European countries', () => {
    for (let i = 0; i < 30; i++) {
      const q = generateQuestion('mixed');
      expect(q.targetState.id).toBeDefined();
    }
  });

  it('excludes answered/revealed state IDs when generating new questions', () => {
    const exclude = OFFICIAL_50_STATES.slice(0, 44).map((s) => s.id);
    const remaining = OFFICIAL_50_STATES[44];
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
    expect(evaluateAnswer('FR', 'FR')).toBe(true);
    expect(evaluateAnswer('fr', 'FR')).toBe(true);
    expect(evaluateAnswer('DE', 'FR')).toBe(false);
    expect(evaluateAnswer('', 'FR')).toBe(false);
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
    expect(calculateQuizRank(45, 45).grade).toBe('S');
    expect(calculateQuizRank(42, 45).grade).toBe('S');
    expect(calculateQuizRank(36, 45).grade).toBe('A');
    expect(calculateQuizRank(30, 45).grade).toBe('B');
    expect(calculateQuizRank(22, 45).grade).toBe('C');
    expect(calculateQuizRank(10, 45).grade).toBe('D');
    expect(calculateQuizRank(0, 0).grade).toBe('D');
  });

  it('formats quiz summary string properly', () => {
    const rank = calculateQuizRank(45, 45);
    const summary = formatQuizSummary(45, 45, 45, rank, 'state-name');
    expect(summary).toContain('Rank S');
    expect(summary).toContain('Master Cartographer');
    expect(summary).toContain('45/45 (100%)');
  });

  it('provides all 5 performance tiers in descending order', () => {
    expect(PERFORMANCE_TIERS.length).toBe(5);
    expect(PERFORMANCE_TIERS.map((t) => t.grade)).toEqual(['S', 'A', 'B', 'C', 'D']);
  });

  it('accurately calculates quiz progress and countries remaining', () => {
    const start = calculateQuizProgress(0, 0, 45);
    expect(start.identifiedCount).toBe(0);
    expect(start.remainingCount).toBe(45);
    expect(start.percentage).toBe(0);

    const mid = calculateQuizProgress(15, 5, 45);
    expect(mid.identifiedCount).toBe(20);
    expect(mid.remainingCount).toBe(25);
    expect(mid.percentage).toBe(44);

    const done = calculateQuizProgress(40, 5, 45);
    expect(done.identifiedCount).toBe(45);
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
    const rank = calculateQuizRank(30, 45);
    const summary = formatQuizSummary(30, 45, 10, rank, 'multiple-choice');
    expect(summary).toContain('Europe Quiz (Multiple Choice)');
    expect(summary).toContain('Rank B');
  });
});
