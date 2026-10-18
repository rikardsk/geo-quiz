import React from 'react';
import { BookOpen } from 'lucide-react';

export interface ExploreBottomProgressBarProps {
  exploredCount: number;
  totalStates: number;
  className?: string;
}

export const ExploreBottomProgressBar: React.FC<ExploreBottomProgressBarProps> = ({
  exploredCount,
  totalStates,
  className = '',
}) => {
  const percentage = totalStates > 0 ? Math.round((exploredCount / totalStates) * 100) : 0;
  const remainingCount = Math.max(0, totalStates - exploredCount);

  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-3 shadow-sm ${className}`}>
      <div className="flex items-center justify-between text-xs font-semibold mb-2">
        <span className="text-slate-700 flex items-center gap-1.5 font-bold">
          <BookOpen className="w-4 h-4 text-rose-500 flex-shrink-0" />
          <span>Countries Explored</span>
        </span>
        <span className="text-slate-900 font-bold">
          <span className="text-rose-600 font-extrabold text-sm">{exploredCount}</span>
          <span className="text-slate-500 font-medium ml-1">explored</span>
          <span className="text-slate-400 font-normal ml-1.5">
            {`(${remainingCount} left • ${percentage}%)`}
          </span>
        </span>
      </div>
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

export { ExploreBottomProgressBar as ExploreProgressBar };
