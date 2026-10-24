import React from 'react';
import { Target } from 'lucide-react';
import { QuestionType, calculateQuizProgress } from '../utils/quizUtils';

interface QuizHeaderProps {
  mode: 'mixed' | QuestionType;
  solvedCount: number;
  revealedCount: number;
  totalStates: number;
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
  mode,
  solvedCount,
  revealedCount,
  totalStates,
}) => {
  const { remainingCount, percentage } = calculateQuizProgress(
    solvedCount,
    revealedCount,
    totalStates
  );

  const title =
    mode === 'state-name'
      ? '17 South & East Asia Countries Challenge'
      : mode === 'capital'
      ? '17 South & East Asia Capitals Challenge'
      : '17 South & East Asia Mixed Geography Challenge';

  return (
    <header className="w-full max-w-5xl mx-auto mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-rose-600 font-semibold text-sm mb-1">
            <Target className="w-4 h-4" />
            <span>Interactive Asian Geography Quiz</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
          <p className="text-sm text-slate-500 mt-1">
            Identify each country on the map to test your accuracy and complete all 17 nations.
          </p>
        </div>

        <div className="progress-badge">
          <div className="progress-badge-header">
            <span className="progress-label">
              <Target className="w-3.5 h-3.5 text-rose-500" />
              Countries Remaining
            </span>
            <span className="progress-ratio">
              <span className="progress-ratio-highlight">{remainingCount}</span>
              <span className="progress-ratio-total">{` / ${totalStates}`}</span>
            </span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${percentage}%` }} />
          </div>
        </div>
      </div>
    </header>
  );
};
