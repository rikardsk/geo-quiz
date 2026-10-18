import { SWEDISH_COUNTIES, SwedenCountyData } from '../data/countiesData';

export type QuestionType =
  | 'county-name'
  | 'largest-city'
  | 'residence-city'
  | 'multiple-choice'
  | 'team-name' // backwards compat alias
  | 'stadium'   // backwards compat alias
  | 'city';     // backwards compat alias

export interface QuizQuestion {
  targetCounty: SwedenCountyData;
  questionType: QuestionType;
  prompt: string;
  choices?: SwedenCountyData[];
  // Backwards compat aliases
  targetTeam?: SwedenCountyData;
}

export interface PerformanceTier {
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  minAccuracy: number;
  thresholdLabel: string;
  title: string;
  description: string;
  color: string;
  badgeEmoji: string;
}

export const PERFORMANCE_TIERS: PerformanceTier[] = [
  {
    grade: 'S',
    minAccuracy: 95,
    thresholdLabel: '95% – 100%',
    title: 'Rikskartograf',
    description: 'Enastående! Fullständig precision och perfekt koll på alla 21 län och deras största städer.',
    color: '#e11d48',
    badgeEmoji: '🏆',
  },
  {
    grade: 'A',
    minAccuracy: 85,
    thresholdLabel: '85% – 94%',
    title: 'Geografiexpert',
    description: 'Imponerande kunskap! Mycket god orientering i Sveriges geografi och centralorter.',
    color: '#f59e0b',
    badgeEmoji: '🥇',
  },
  {
    grade: 'B',
    minAccuracy: 70,
    thresholdLabel: '70% – 84%',
    title: 'Sverigeutforskare',
    description: 'Bra jobbat! Stabil överblick över Sveriges län från Skåne till Norrbotten.',
    color: '#3b82f6',
    badgeEmoji: '🥈',
  },
  {
    grade: 'C',
    minAccuracy: 50,
    thresholdLabel: '50% – 69%',
    title: 'Länsresenär',
    description: 'Godkänt resultat! Fortsätt öva för att sätta alla 21 län och residensstäder.',
    color: '#10b981',
    badgeEmoji: '🥉',
  },
  {
    grade: 'D',
    minAccuracy: 0,
    thresholdLabel: '< 50%',
    title: 'Vilsen Turist',
    description: 'Dags att damma av kartboken och utforska Sveriges län en vända till!',
    color: '#64748b',
    badgeEmoji: '🧭',
  },
];

export function calculateQuizRank(score: number, totalAnswered: number): PerformanceTier {
  const fallback = PERFORMANCE_TIERS[PERFORMANCE_TIERS.length - 1];
  if (totalAnswered <= 0) return fallback;

  const accuracy = Math.round((score / totalAnswered) * 100);
  const found = PERFORMANCE_TIERS.find((t) => accuracy >= t.minAccuracy);
  return found || fallback;
}

export function generateMultipleChoiceOptions(
  targetCounty: SwedenCountyData,
  counties: SwedenCountyData[] = SWEDISH_COUNTIES
): SwedenCountyData[] {
  const sameRegion = counties.filter(
    (c) => c.id !== targetCounty.id && c.region === targetCounty.region
  );
  const otherRegion = counties.filter(
    (c) => c.id !== targetCounty.id && c.region !== targetCounty.region
  );

  const shuffledSame = [...sameRegion].sort(() => Math.random() - 0.5);
  const shuffledOther = [...otherRegion].sort(() => Math.random() - 0.5);
  const distractors = [...shuffledSame, ...shuffledOther].slice(0, 3);

  return [targetCounty, ...distractors].sort(() => Math.random() - 0.5);
}

function normalizeType(mode: 'mixed' | QuestionType): QuestionType {
  if (mode !== 'mixed') {
    if (mode === 'team-name') return 'county-name';
    if (mode === 'stadium' || mode === 'city') return 'largest-city';
    return mode;
  }
  const types: QuestionType[] = ['county-name', 'largest-city', 'multiple-choice'];
  return types[Math.floor(Math.random() * types.length)];
}

function buildQuestionData(
  type: QuestionType,
  county: SwedenCountyData,
  counties: SwedenCountyData[]
): { prompt: string; choices?: SwedenCountyData[] } {
  if (type === 'county-name' || type === 'team-name') {
    return { prompt: `Hitta ${county.name} på kartan` };
  }
  if (type === 'largest-city' || type === 'city' || type === 'stadium') {
    return { prompt: `Vilket län har ${county.largestCity} som största stad?` };
  }
  if (type === 'residence-city') {
    return { prompt: `Vilket län har ${county.residenceCity} som residensstad?` };
  }
  return {
    prompt: `Vilket län är markerat på kartan?`,
    choices: generateMultipleChoiceOptions(county, counties),
  };
}

export function generateQuestion(
  mode: 'mixed' | QuestionType = 'mixed',
  excludeIds: string[] = [],
  counties: SwedenCountyData[] = SWEDISH_COUNTIES
): QuizQuestion {
  const pool = counties.filter((c) => !excludeIds.includes(c.id));
  const candidatePool = pool.length > 0 ? pool : counties;
  const targetCounty = candidatePool[Math.floor(Math.random() * candidatePool.length)];

  const selectedType = normalizeType(mode);
  const { prompt, choices } = buildQuestionData(selectedType, targetCounty, counties);

  return {
    targetCounty,
    targetTeam: targetCounty,
    questionType: selectedType,
    prompt,
    choices,
  };
}

export function evaluateAnswer(
  selectedCountyId: string,
  targetCountyId: string
): boolean {
  if (!selectedCountyId || !targetCountyId) return false;
  return selectedCountyId.toUpperCase() === targetCountyId.toUpperCase();
}

export function calculateNewStreak(
  currentStreak: number,
  isCorrect: boolean
): number {
  if (!isCorrect) return 0;
  return currentStreak + 1;
}

export function getHintText(county: SwedenCountyData): string {
  if (!county) return '';
  return `Ledtråd: Länet ligger i ${county.region}. Residensstad är ${county.residenceCity}.`;
}

export function calculateQuizProgress(
  solvedCount: number,
  revealedCount: number,
  totalCount: number = SWEDISH_COUNTIES.length
): {
  identifiedCount: number;
  remainingCount: number;
  percentage: number;
} {
  const identifiedCount = Math.min(totalCount, Math.max(0, solvedCount + revealedCount));
  const remainingCount = Math.max(0, totalCount - identifiedCount);
  const percentage = totalCount > 0 ? Math.round((identifiedCount / totalCount) * 100) : 0;
  return { identifiedCount, remainingCount, percentage };
}
