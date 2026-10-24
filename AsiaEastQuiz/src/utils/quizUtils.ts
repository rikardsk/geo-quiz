import { US_STATES, USState } from '../data/statesData';

export type QuestionType = 'state-name' | 'capital' | 'multiple-choice';

export interface QuizQuestion {
  targetState: USState;
  questionType: QuestionType;
  prompt: string;
  choices?: USState[];
}

export interface QuizState {
  score: number;
  totalAnswered: number;
  streak: number;
  bestStreak: number;
  currentQuestion: QuizQuestion | null;
  lastAnswerStatus: 'idle' | 'correct' | 'incorrect';
  lastAnsweredState: USState | null;
  hintUsed: boolean;
}

export const OFFICIAL_50_STATES = US_STATES;
export const OFFICIAL_17_COUNTRIES = US_STATES;

export interface PerformanceTier {
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  minAccuracy: number;
  thresholdLabel: string;
  title: string;
  description: string;
  color: string;
  badgeEmoji: string;
}

export type QuizRank = PerformanceTier;

export const PERFORMANCE_TIERS: PerformanceTier[] = [
  {
    grade: 'S',
    minAccuracy: 95,
    thresholdLabel: '95% – 100%',
    title: 'Master Cartographer',
    description: 'Legendary accuracy! You know every corner of South & East Asia.',
    color: '#e11d48',
    badgeEmoji: '🏆',
  },
  {
    grade: 'A',
    minAccuracy: 85,
    thresholdLabel: '85% – 94%',
    title: 'Expert Geographer',
    description: 'Outstanding performance! Virtually flawless recall of Asian countries and capitals.',
    color: '#f59e0b',
    badgeEmoji: '🥇',
  },
  {
    grade: 'B',
    minAccuracy: 70,
    thresholdLabel: '70% – 84%',
    title: 'Avid Explorer',
    description: 'Great job! A solid grasp of South & East Asian geography.',
    color: '#3b82f6',
    badgeEmoji: '🥈',
  },
  {
    grade: 'C',
    minAccuracy: 50,
    thresholdLabel: '50% – 69%',
    title: 'Mekong Voyager',
    description: 'Good effort! You know your way around key regional nations.',
    color: '#10b981',
    badgeEmoji: '🥉',
  },
  {
    grade: 'D',
    minAccuracy: 0,
    thresholdLabel: '< 50%',
    title: 'Wandering Tourist',
    description: 'Keep practicing to master all 17 South & East Asian countries!',
    color: '#64748b',
    badgeEmoji: '🧭',
  },
];

export function calculateQuizRank(score: number, totalAnswered: number): QuizRank {
  const fallback = PERFORMANCE_TIERS[PERFORMANCE_TIERS.length - 1];
  if (totalAnswered <= 0) return fallback;
  const accuracy = Math.round((score / totalAnswered) * 100);
  const found = PERFORMANCE_TIERS.find((t) => accuracy >= t.minAccuracy);
  return found || fallback;
}

export function formatQuizSummary(
  score: number,
  totalAnswered: number,
  bestStreak: number,
  rank: QuizRank,
  mode: 'mixed' | QuestionType
): string {
  const accuracy = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;
  const modeLabel =
    mode === 'state-name'
      ? 'Countries'
      : mode === 'capital'
      ? 'Capitals'
      : mode === 'multiple-choice'
      ? 'Multiple Choice'
      : 'Mixed';
  return `🌏 South & East Asia Quiz (${modeLabel}): ${rank.badgeEmoji} Rank ${rank.grade} - ${rank.title} | ${score}/${totalAnswered} (${accuracy}%) | Best Streak: ${bestStreak}`;
}

export function calculateQuizProgress(
  solvedCount: number,
  revealedCount: number,
  totalStates: number = OFFICIAL_50_STATES.length
): {
  identifiedCount: number;
  remainingCount: number;
  percentage: number;
} {
  const identifiedCount = Math.min(totalStates, Math.max(0, solvedCount + revealedCount));
  const remainingCount = Math.max(0, totalStates - identifiedCount);
  const percentage = totalStates > 0 ? Math.round((identifiedCount / totalStates) * 100) : 0;
  return { identifiedCount, remainingCount, percentage };
}

export function generateMultipleChoiceOptions(targetState: USState): USState[] {
  const sameRegion = OFFICIAL_50_STATES.filter(
    (s) => s.id !== targetState.id && s.region === targetState.region
  );
  const otherRegions = OFFICIAL_50_STATES.filter(
    (s) => s.id !== targetState.id && s.region !== targetState.region
  );
  const shuffledSame = [...sameRegion].sort(() => Math.random() - 0.5);
  const shuffledOther = [...otherRegions].sort(() => Math.random() - 0.5);
  const distractors = [...shuffledSame, ...shuffledOther].slice(0, 3);
  return [targetState, ...distractors].sort(() => Math.random() - 0.5);
}

function pickQuestionType(mode: 'mixed' | QuestionType): QuestionType {
  if (mode !== 'mixed') return mode;
  const types: QuestionType[] = ['state-name', 'capital', 'multiple-choice'];
  return types[Math.floor(Math.random() * types.length)];
}

function buildQuestionData(
  type: QuestionType,
  targetState: USState
): { prompt: string; choices?: USState[] } {
  if (type === 'state-name') {
    return { prompt: `Find ${targetState.name} on the map` };
  }
  if (type === 'capital') {
    return { prompt: `Which country has the capital ${targetState.capital}?` };
  }
  return {
    prompt: 'Which country is highlighted on the map?',
    choices: generateMultipleChoiceOptions(targetState),
  };
}

export function generateQuestion(
  type: 'state-name' | 'capital' | 'multiple-choice' | 'mixed' = 'mixed',
  excludeIds: string[] = []
): QuizQuestion {
  const pool = OFFICIAL_50_STATES.filter((s) => !excludeIds.includes(s.id));
  const candidatePool = pool.length > 0 ? pool : OFFICIAL_50_STATES;
  const targetState = candidatePool[Math.floor(Math.random() * candidatePool.length)];
  const selectedType = pickQuestionType(type);
  const { prompt, choices } = buildQuestionData(selectedType, targetState);

  return { targetState, questionType: selectedType, prompt, choices };
}

export function evaluateAnswer(
  clickedStateId: string,
  targetStateId: string
): boolean {
  if (!clickedStateId || !targetStateId) return false;
  return clickedStateId.toUpperCase() === targetStateId.toUpperCase();
}

export function calculateNewStreak(
  currentStreak: number,
  isCorrect: boolean
): number {
  if (!isCorrect) return 0;
  return currentStreak + 1;
}

export function getHintText(state: USState): string {
  if (!state) return '';
  return `Hint: This country is located in the ${state.region} region.`;
}
