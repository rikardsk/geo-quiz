import React from 'react';
import { SwedenCountyData, REGION_THEMES, REGION_COLORS } from '../data/countiesData';
import { FilterOption } from './DivisionFilter';
import { formatPopulation } from '../utils/countiesUtils';
import { CheckCircle2, Shield, MapPin, Building2 } from 'lucide-react';

export interface FilteredTeamsListProps {
  filter: FilterOption;
  teams: SwedenCountyData[];
  exploredTeams: Set<string>;
  onSelectTeam: (team: SwedenCountyData) => void;
}

function getFilterBadge(filter: FilterOption) {
  if (filter === 'All') return null;
  const theme = REGION_THEMES[filter as 'Götaland' | 'Svealand' | 'Norrland'];
  if (theme) {
    return <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${theme.badge}`}>{filter}</span>;
  }
  const colorInfo = REGION_COLORS[filter as string];
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded border"
      style={{ backgroundColor: colorInfo?.bg, borderColor: colorInfo?.border }}
    >
      {filter}
    </span>
  );
}

const FilteredTeamsHeader: React.FC<{ filter: FilterOption; count: number }> = ({ filter, count }) => (
  <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 shrink-0">
    <div className="flex items-center gap-2">
      <Shield className="w-4 h-4 text-emerald-600" />
      <div>
        <h3 className="text-base font-extrabold text-slate-900 leading-tight">
          {filter === 'All' ? 'Alla 21 Svenska Län' : `${filter} Län`}
        </h3>
        <span className="text-[11px] text-slate-500">
          {`${count} ${count === 1 ? 'län' : 'län'} • Välj för att visa detaljer`}
        </span>
      </div>
    </div>
    {getFilterBadge(filter)}
  </div>
);

const DivisionCountyItem: React.FC<{
  county: SwedenCountyData;
  isExplored: boolean;
  onSelect: (county: SwedenCountyData) => void;
}> = ({ county, isExplored, onSelect }) => (
  <button
    onClick={() => onSelect(county)}
    className="w-full p-3 sm:p-3.5 rounded-2xl border border-slate-200/90 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-3 text-left group shadow-xs"
  >
    <img
      src={county.coatOfArms}
      alt={county.name}
      className="w-10 h-12 object-contain shrink-0 group-hover:scale-105 transition-transform"
      style={{ width: '40px', height: '48px', objectFit: 'contain' }}
    />
    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 truncate">
          <span className="font-bold text-sm text-slate-900 truncate">{county.name}</span>
          {isExplored && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
        </div>
        <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded shrink-0">
          {county.letter}
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-sky-700 font-semibold mt-1 min-w-0">
        <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
        <span className="truncate">Största stad: <strong className="text-slate-900">{county.largestCity}</strong></span>
      </div>
      <div className="text-[11px] text-slate-500 truncate mt-0.5 flex items-center gap-1.5">
        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
        <span>Residensstad: {county.residenceCity}</span>
        <span className="text-slate-300">•</span>
        <span>{formatPopulation(county.population)} inv.</span>
      </div>
    </div>
  </button>
);

const CompactCountyItem: React.FC<{
  county: SwedenCountyData;
  isExplored: boolean;
  onSelect: (county: SwedenCountyData) => void;
}> = ({ county, isExplored, onSelect }) => (
  <button
    onClick={() => onSelect(county)}
    className="w-full px-2.5 py-2 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2.5 text-left group shadow-xs"
  >
    <img
      src={county.coatOfArms}
      alt={county.name}
      className="w-7 h-8 object-contain shrink-0 group-hover:scale-105 transition-transform"
      style={{ width: '28px', height: '32px', objectFit: 'contain' }}
    />
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-1.5">
        <span className="font-bold text-xs text-slate-900 truncate">{county.name}</span>
        {isExplored && <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />}
      </div>
      <p className="text-[11px] text-sky-700 font-medium truncate flex items-center gap-1 mt-0.5">
        <MapPin className="w-2.5 h-2.5 text-sky-600 shrink-0" />
        <span className="truncate">Största stad: {county.largestCity}</span>
      </p>
    </div>
    <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-50 px-1 py-0.5 rounded border border-slate-200">
      {county.letter}
    </span>
  </button>
);

export const FilteredTeamsList: React.FC<FilteredTeamsListProps> = ({
  filter,
  teams,
  exploredTeams,
  onSelectTeam,
}) => {
  const isAllFilter = filter === 'All';

  return (
    <div className="team-card h-full max-h-full flex flex-col">
      <FilteredTeamsHeader filter={filter} count={teams.length} />
      <div
        className={`flex-1 overflow-y-auto pr-0.5 custom-scrollbar min-h-0 ${
          isAllFilter ? 'space-y-1.5' : 'space-y-2'
        }`}
      >
        {teams.map((county) => {
          const isExplored = exploredTeams.has(county.id);
          if (isAllFilter) {
            return (
              <CompactCountyItem
                key={county.id}
                county={county}
                isExplored={isExplored}
                onSelect={onSelectTeam}
              />
            );
          }
          return (
            <DivisionCountyItem
              key={county.id}
              county={county}
              isExplored={isExplored}
              onSelect={onSelectTeam}
            />
          );
        })}
      </div>
    </div>
  );
};

export const FilteredCountiesList = FilteredTeamsList;
