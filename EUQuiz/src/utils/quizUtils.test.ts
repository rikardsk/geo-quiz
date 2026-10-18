import { describe, it, expect } from 'vitest';
import {
  generateQuestion,
  evaluateAnswer,
  calculateNewStreak,
  getHintText,
  OFFICIAL_EU_STATES,
  OFFICIAL_50_STATES,
  calculateQuizRank,
  formatQuizSummary,
  calculateQuizProgress,
  PERFORMANCE_TIERS,
} from './quizUtils';

describe('quizUtils', () => {
  it('strictly contains 27 EU member states', () => {
    expect(OFFICIAL_EU_STATES.length).toBe(27);
    expect(OFFICIAL_50_STATES.length).toBe(27);
    expect(OFFICIAL_EU_STATES.find((s) => s.id === 'FR')).toBeDefined();
    expect(OFFICIAL_EU_STATES.find((s) => s.id === 'DE')).toBeDefined();
    expect(OFFICIAL_EU_STATES.find((s) => s.id === 'DC')).toBeUndefined();
  });

  it('generates questions exclusively from the 27 EU member states', () => {
    for (let i = 0; i < 30; i++) {
      const q = generateQuestion('mixed');
      expect(q.targetState).toBeDefined();
      expect(OFFICIAL_EU_STATES.some((s) => s.id === q.targetState.id)).toBe(true);
    }
  });

  it('excludes answered/revealed state IDs when generating new questions', () => {
    const exclude = OFFICIAL_EU_STATES.slice(0, 26).map((s) => s.id);
    const remaining = OFFICIAL_EU_STATES[26];
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
    expect(calculateQuizRank(27, 27).grade).toBe('S');
    expect(calculateQuizRank(26, 27).grade).toBe('S');
    expect(calculateQuizRank(23, 27).grade).toBe('A');
    expect(calculateQuizRank(20, 27).grade).toBe('B');
    expect(calculateQuizRank(15, 27).grade).toBe('C');
    expect(calculateQuizRank(10, 27).grade).toBe('D');
    expect(calculateQuizRank(0, 0).grade).toBe('D');
  });

  it('formats quiz summary string properly', () => {
    const rank = calculateQuizRank(27, 27);
    const summary = formatQuizSummary(27, 27, 27, rank, 'state-name');
    expect(summary).toContain('EU Member States Quiz');
    expect(summary).toContain('Rank S');
    expect(summary).toContain('EU Grand Commissioner');
    expect(summary).toContain('27/27 (100%)');
  });

  it('provides all 5 performance tiers in descending order', () => {
    expect(PERFORMANCE_TIERS.length).toBe(5);
    expect(PERFORMANCE_TIERS.map((t) => t.grade)).toEqual(['S', 'A', 'B', 'C', 'D']);
  });

  it('accurately calculates quiz progress and states remaining', () => {
    const start = calculateQuizProgress(0, 0, 27);
    expect(start.identifiedCount).toBe(0);
    expect(start.remainingCount).toBe(27);
    expect(start.percentage).toBe(0);

    const mid = calculateQuizProgress(10, 3, 27);
    expect(mid.identifiedCount).toBe(13);
    expect(mid.remainingCount).toBe(14);
    expect(mid.percentage).toBe(48);

    const done = calculateQuizProgress(25, 2, 27);
    expect(done.identifiedCount).toBe(27);
    expect(done.remainingCount).toBe(0);
    expect(done.percentage).toBe(100);
  });

  it('generates multiple choice questions with 4 choices including target', () => {
    const q = generateQuestion('multiple-choice');
    expect(q.questionType).toBe('multiple-choice');
    expect(q.prompt).toContain('Which EU member state is highlighted');
    expect(q.choices).toBeDefined();
    expect(q.choices?.length).toBe(4);
    const targetIncluded = q.choices?.some((c) => c.id === q.targetState.id);
    expect(targetIncluded).toBe(true);
    const uniqueIds = new Set(q.choices?.map((c) => c.id));
    expect(uniqueIds.size).toBe(4);
  });

  it('formats quiz summary with multiple-choice mode', () => {
    const rank = calculateQuizRank(20, 27);
    const summary = formatQuizSummary(20, 27, 5, rank, 'multiple-choice');
    expect(summary).toContain('EU Member States Quiz (Multiple Choice)');
    expect(summary).toContain('Rank B');
  });
});
