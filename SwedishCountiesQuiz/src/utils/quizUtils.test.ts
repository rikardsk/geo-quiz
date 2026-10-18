import { describe, it, expect } from 'vitest';
import {
  calculateQuizRank,
  generateQuestion,
  evaluateAnswer,
  calculateNewStreak,
  getHintText,
  calculateQuizProgress,
  PERFORMANCE_TIERS,
} from './quizUtils';
import { SWEDISH_COUNTIES } from '../data/countiesData';

describe('quizUtils', () => {
  it('correctly calculates performance tiers for Swedish geography', () => {
    expect(PERFORMANCE_TIERS.length).toBe(5);
    expect(calculateQuizRank(21, 21).grade).toBe('S');
    expect(calculateQuizRank(21, 21).title).toContain('Rikskartograf');
    expect(calculateQuizRank(19, 21).grade).toBe('A');
    expect(calculateQuizRank(16, 21).grade).toBe('B');
    expect(calculateQuizRank(12, 21).grade).toBe('C');
    expect(calculateQuizRank(6, 21).grade).toBe('D');
    expect(calculateQuizRank(0, 0).grade).toBe('D');
  });

  it('evaluates answers correctly case-insensitively', () => {
    expect(evaluateAnswer('AB', 'ab')).toBe(true);
    expect(evaluateAnswer('M', 'O')).toBe(false);
    expect(evaluateAnswer('', 'M')).toBe(false);
  });

  it('updates streak properly', () => {
    expect(calculateNewStreak(3, true)).toBe(4);
    expect(calculateNewStreak(5, false)).toBe(0);
  });

  it('generates questions with valid target county and Swedish prompt', () => {
    const q = generateQuestion('county-name');
    expect(q.targetCounty).toBeDefined();
    expect(q.prompt).toBe(`Hitta ${q.targetCounty.name} på kartan`);

    const cityQ = generateQuestion('largest-city');
    expect(cityQ.prompt).toContain('som största stad?');
  });

  it('generates questions excluding answered IDs', () => {
    const exclude = SWEDISH_COUNTIES.slice(0, 20).map((t) => t.id);
    const q = generateQuestion('county-name', exclude);
    expect(q.targetCounty.id).toBe(SWEDISH_COUNTIES[20].id);
  });

  it('provides helpful hint text in Swedish for Swedish counties', () => {
    const skane = SWEDISH_COUNTIES.find((t) => t.id === 'M')!;
    const hint = getHintText(skane);
    expect(hint).toContain('Ledtråd:');
    expect(hint).toContain('Götaland');
    expect(hint).toContain('Malmö');
  });

  it('calculates quiz progress percentages for 21 counties', () => {
    const progress = calculateQuizProgress(10, 0, 21);
    expect(progress.identifiedCount).toBe(10);
    expect(progress.remainingCount).toBe(11);
    expect(progress.percentage).toBe(48);
  });
});
