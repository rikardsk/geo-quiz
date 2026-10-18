import React from 'react';
import { Target } from 'lucide-react';
import { calculateQuizProgress } from '../utils/quizUtils';

interface QuizBottomProgressBarProps {
  solvedCount: number;
  revealedCount: number;
  totalStates: number;
  className?: string;
}

export const QuizBottomProgressBar: React.FC<QuizBottomProgressBarProps> = ({
  solvedCount,
  revealedCount,
  totalStates,
  className = '',
}) => {
  const { identifiedCount, remainingCount, percentage } = calculateQuizProgress(
    solvedCount,
    revealedCount,
    totalStates
  );

  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-3 shadow-sm ${className}`}>
      <div className="flex items-center justify-between text-xs font-semibold mb-2">
        <span className="text-slate-700 flex items-center gap-1.5 font-bold">
          <Target className="w-4 h-4 text-rose-500 flex-shrink-0" />
          <span>Countries Remaining to Identify</span>
        </span>
        <span className="text-slate-900 font-bold">
          <span className="text-rose-600 font-extrabold text-sm">{remainingCount}</span>
          <span className="text-slate-500 font-medium ml-1">left</span>
          <span className="text-slate-400 font-normal ml-1.5">
            ({identifiedCount} / {totalStates} • {percentage}%)
          </span>
        </span>
      </div>
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

export { QuizBottomProgressBar as QuizProgressBar };
