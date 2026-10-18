import React from 'react';
import { SwedenRegion, REGION_COLORS } from '../data/countiesData';

export type FilterOption = 'All' | SwedenRegion | 'Eastern' | 'Western' | 'Canada';

interface DivisionFilterProps {
  currentFilter: FilterOption;
  onSelectFilter: (filter: FilterOption) => void;
}

const FILTER_GROUPS: FilterOption[] = ['All', 'Götaland', 'Svealand', 'Norrland'];

const FILTER_LABELS: Record<string, string> = {
  All: 'Alla (21 län)',
  Götaland: 'Götaland (9)',
  Svealand: 'Svealand (7)',
  Norrland: 'Norrland (5)',
};

function getFilterColor(filter: FilterOption): { bg: string; border: string } | null {
  if (filter === 'All') return null;
  const regionInfo = REGION_COLORS[filter as string];
  if (regionInfo) return { bg: regionInfo.bg, border: regionInfo.border };
  return null;
}

function getFilterButtonStyle(
  color: { bg: string; border: string } | null,
  isActive: boolean
): React.CSSProperties {
  if (isActive) {
    return {
      backgroundColor: color ? color.bg : '#0f172a',
      borderColor: '#0f172a',
      borderWidth: '2px',
      borderStyle: 'solid',
      boxShadow: '0 0 0 2px #ffffff, 0 0 0 4px #0f172a, 0 2px 5px rgba(0, 0, 0, 0.15)',
    };
  }
  return {
    backgroundColor: color ? color.bg : '#ffffff',
    borderColor: color ? color.border : '#cbd5e1',
    borderWidth: '1.5px',
    borderStyle: 'solid',
    boxShadow: 'none',
  };
}

interface FilterButtonProps {
  filter: FilterOption;
  isActive: boolean;
  dimmed: boolean;
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  filter,
  isActive,
  dimmed,
  onClick,
}) => {
  const color = getFilterColor(filter);
  const isGotaland = filter === 'Götaland';
  const isSvealand = filter === 'Svealand';
  const isNorrland = filter === 'Norrland';

  const activeClasses = color
    ? 'font-extrabold text-slate-950 opacity-100 scale-[1.02]'
    : 'bg-slate-900 text-white font-extrabold opacity-100 scale-[1.02]';

  const inactiveClasses = color
    ? `${dimmed ? 'opacity-70' : 'opacity-100'} text-slate-800 font-medium hover:brightness-95 hover:opacity-100 hover:shadow-xs`
    : 'bg-white text-slate-700 hover:bg-slate-100/70';

  const label = FILTER_LABELS[filter as string] || filter;

  return (
    <button
      onClick={onClick}
      style={getFilterButtonStyle(color, isActive)}
      className={`px-2.5 py-1 rounded-lg text-xs transition-all flex items-center gap-1.5 ${
        isActive ? activeClasses : inactiveClasses
      }`}
    >
      {isGotaland && <span className="w-2 h-2 rounded-full bg-sky-500 inline-block shrink-0" />}
      {isSvealand && <span className="w-2 h-2 rounded-full bg-amber-500 inline-block shrink-0" />}
      {isNorrland && <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0" />}
      {label}
    </button>
  );
};

export const DivisionFilter: React.FC<DivisionFilterProps> = ({
  currentFilter,
  onSelectFilter,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs font-semibold text-slate-500 mr-1">Landsdel:</span>
      {FILTER_GROUPS.map((filter) => (
        <FilterButton
          key={filter}
          filter={filter}
          isActive={currentFilter === filter}
          dimmed={currentFilter !== 'All' && currentFilter !== filter}
          onClick={() => onSelectFilter(filter)}
        />
      ))}
    </div>
  );
};
