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
  it('strictly contains 13 provinces and territories', () => {
    expect(OFFICIAL_50_STATES.length).toBe(13);
  });

  it('generates questions from the 13 provinces and territories', () => {
    for (let i = 0; i < 30; i++) {
      const q = generateQuestion('mixed');
      expect(q.targetState.id).toBeDefined();
    }
  });

  it('excludes answered/revealed state IDs when generating new questions', () => {
    const exclude = OFFICIAL_50_STATES.slice(0, 12).map((s) => s.id);
    const remaining = OFFICIAL_50_STATES[12];
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
    expect(evaluateAnswer('ON', 'ON')).toBe(true);
    expect(evaluateAnswer('on', 'ON')).toBe(true);
    expect(evaluateAnswer('QC', 'ON')).toBe(false);
    expect(evaluateAnswer('', 'ON')).toBe(false);
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
    expect(calculateQuizRank(13, 13).grade).toBe('S');
    expect(calculateQuizRank(12, 13).grade).toBe('S');
    expect(calculateQuizRank(11, 13).grade).toBe('A');
    expect(calculateQuizRank(9, 13).grade).toBe('B');
    expect(calculateQuizRank(7, 13).grade).toBe('C');
    expect(calculateQuizRank(4, 13).grade).toBe('D');
    expect(calculateQuizRank(0, 0).grade).toBe('D');
  });

  it('formats quiz summary string properly', () => {
    const rank = calculateQuizRank(13, 13);
    const summary = formatQuizSummary(13, 13, 13, rank, 'state-name');
    expect(summary).toContain('Rank S');
    expect(summary).toContain('Master Cartographer');
    expect(summary).toContain('13/13 (100%)');
  });

  it('provides all 5 performance tiers in descending order', () => {
    expect(PERFORMANCE_TIERS.length).toBe(5);
    expect(PERFORMANCE_TIERS.map((t) => t.grade)).toEqual(['S', 'A', 'B', 'C', 'D']);
  });

  it('accurately calculates quiz progress and provinces remaining', () => {
    const start = calculateQuizProgress(0, 0, 13);
    expect(start.identifiedCount).toBe(0);
    expect(start.remainingCount).toBe(13);
    expect(start.percentage).toBe(0);

    const mid = calculateQuizProgress(5, 2, 13);
    expect(mid.identifiedCount).toBe(7);
    expect(mid.remainingCount).toBe(6);
    expect(mid.percentage).toBe(54);

    const done = calculateQuizProgress(12, 1, 13);
    expect(done.identifiedCount).toBe(13);
    expect(done.remainingCount).toBe(0);
    expect(done.percentage).toBe(100);
  });

  it('generates multiple choice questions with 4 choices including target', () => {
    const q = generateQuestion('multiple-choice');
    expect(q.questionType).toBe('multiple-choice');
    expect(q.prompt).toContain('Which province or territory is highlighted');
    expect(q.choices).toBeDefined();
    expect(q.choices?.length).toBe(4);
    const targetIncluded = q.choices?.some((c) => c.id === q.targetState.id);
    expect(targetIncluded).toBe(true);
    const uniqueIds = new Set(q.choices?.map((c) => c.id));
    expect(uniqueIds.size).toBe(4);
  });

  it('formats quiz summary with multiple-choice mode', () => {
    const rank = calculateQuizRank(9, 13);
    const summary = formatQuizSummary(9, 13, 5, rank, 'multiple-choice');
    expect(summary).toContain('Canada Quiz (Multiple Choice)');
    expect(summary).toContain('Rank B');
  });
});
