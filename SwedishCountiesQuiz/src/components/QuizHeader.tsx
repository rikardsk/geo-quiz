import React from 'react';
import { Target } from 'lucide-react';
import { QuestionType } from '../utils/quizUtils';

interface QuizHeaderProps {
  mode: 'mixed' | QuestionType;
  solvedCount?: number;
  revealedCount?: number;
  totalTeams?: number;
}

function getModeTitle(mode: 'mixed' | QuestionType): string {
  if (mode === 'county-name' || mode === 'team-name') return '21 Svenska Län Kartutmaning';
  if (mode === 'largest-city' || mode === 'city' || mode === 'stadium') return 'Största Stad i Varje Län Utmaning';
  if (mode === 'residence-city') return 'Residensstäder Utmaning';
  if (mode === 'multiple-choice') return 'Sveriges Län Flervalsquiz';
  return '21 Svenska Län & Största Städer Quiz';
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
  mode,
}) => {
  const title = getModeTitle(mode);

  return (
    <header className="w-full max-w-5xl mx-auto mb-6">
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-sky-600 font-semibold text-sm mb-1">
          <Target className="w-4 h-4" />
          <span>Interaktiv Sverigekarta: Län & Största Städer</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
        <p className="text-sm text-slate-500 mt-1">
          Klicka på rätt län eller stad på Sverigekartan för att sätta alla 21 svenska län och deras största städer.
        </p>
      </div>
    </header>
  );
};
