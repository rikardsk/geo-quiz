import React from 'react';
import { BookOpen } from 'lucide-react';

export interface ExploreBottomProgressBarProps {
  exploredCount: number;
  totalTeams: number;
  className?: string;
}

export const ExploreBottomProgressBar: React.FC<ExploreBottomProgressBarProps> = ({
  exploredCount,
  totalTeams,
  className = 'w-full max-w-5xl mx-auto',
}) => {
  const percentage = totalTeams > 0 ? Math.round((exploredCount / totalTeams) * 100) : 0;
  const remainingCount = Math.max(0, totalTeams - exploredCount);

  return (
    <div className={`bg-white border border-slate-200 rounded-2xl p-4 shadow-sm ${className}`}>
      <div className="flex items-center justify-between text-xs font-semibold mb-2">
        <span className="text-slate-700 flex items-center gap-1.5 font-bold">
          <BookOpen className="w-4 h-4 text-sky-500 flex-shrink-0" />
          <span>Svenska län utforskade</span>
        </span>
        <span className="text-slate-900 font-bold">
          <span className="text-sky-600 font-extrabold text-sm">{exploredCount}</span>
          <span className="text-slate-500 font-medium ml-1">av {totalTeams}</span>
          <span className="text-slate-400 font-normal ml-1.5">
            {`(${remainingCount} kvar • ${percentage}%)`}
          </span>
        </span>
      </div>
      <div className="progress-bar-track">
        <div className="progress-bar-fill bg-sky-500" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};
