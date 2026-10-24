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
  it('contains exactly 25 South East Asian & Oceanian countries', () => {
    expect(OFFICIAL_50_STATES.length).toBe(25);
  });

  it('generates questions from the 25 countries', () => {
    for (let i = 0; i < 30; i++) {
      const q = generateQuestion('mixed');
      expect(q.targetState.id).toBeDefined();
    }
  });

  it('excludes answered/revealed country IDs when generating new questions', () => {
    const exclude = OFFICIAL_50_STATES.slice(0, 24).map((s) => s.id);
    const remaining = OFFICIAL_50_STATES[24];
    const q = generateQuestion('state-name', exclude);
    expect(q.targetState.id).toBe(remaining.id);
  });

  it('generates a question with target country and prompt', () => {
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
    expect(evaluateAnswer('AU', 'AU')).toBe(true);
    expect(evaluateAnswer('au', 'AU')).toBe(true);
    expect(evaluateAnswer('NZ', 'AU')).toBe(false);
    expect(evaluateAnswer('', 'AU')).toBe(false);
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
    expect(calculateQuizRank(25, 25).grade).toBe('S');
    expect(calculateQuizRank(22, 25).grade).toBe('A');
    expect(calculateQuizRank(21, 25).grade).toBe('B');
    expect(calculateQuizRank(18, 25).grade).toBe('B');
    expect(calculateQuizRank(14, 25).grade).toBe('C');
    expect(calculateQuizRank(10, 25).grade).toBe('D');
    expect(calculateQuizRank(0, 0).grade).toBe('D');
  });

  it('formats quiz summary string properly', () => {
    const rank = calculateQuizRank(25, 25);
    const summary = formatQuizSummary(25, 25, 25, rank, 'state-name');
    expect(summary).toContain('Rank S');
    expect(summary).toContain('Master Cartographer');
    expect(summary).toContain('25/25 (100%)');
  });

  it('provides all 5 performance tiers in descending order', () => {
    expect(PERFORMANCE_TIERS.length).toBe(5);
    expect(PERFORMANCE_TIERS.map((t) => t.grade)).toEqual(['S', 'A', 'B', 'C', 'D']);
  });

  it('accurately calculates quiz progress and countries remaining', () => {
    const start = calculateQuizProgress(0, 0, 25);
    expect(start.identifiedCount).toBe(0);
    expect(start.remainingCount).toBe(25);
    expect(start.percentage).toBe(0);

    const mid = calculateQuizProgress(12, 3, 25);
    expect(mid.identifiedCount).toBe(15);
    expect(mid.remainingCount).toBe(10);
    expect(mid.percentage).toBe(60);

    const done = calculateQuizProgress(23, 2, 25);
    expect(done.identifiedCount).toBe(25);
    expect(done.remainingCount).toBe(0);
    expect(done.percentage).toBe(100);
  });
});
