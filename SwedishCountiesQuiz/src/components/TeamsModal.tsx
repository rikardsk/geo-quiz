import React, { useState, useEffect, useMemo } from 'react';
import { SwedenCountyData, SWEDISH_COUNTIES } from '../data/countiesData';
import { searchCounties, filterCountiesByRegion, formatPopulation } from '../utils/countiesUtils';
import { COUNTIES_STANDINGS_URL } from '../data/countiesResourcesData';
import { X, Search, CheckCircle2, BarChart2, ExternalLink, MapPin } from 'lucide-react';
import { FilterOption } from './DivisionFilter';

export interface TeamsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTeam: (county: SwedenCountyData) => void;
  selectedTeamId?: string;
  exploredTeams: Set<string>;
}

function useEscapeKey(isOpen: boolean, onClose: () => void): void {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
}

const TeamsModalHeader: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
    <div>
      <h2 className="text-base sm:text-lg font-bold text-slate-900">Alla 21 Svenska Län</h2>
      <p className="text-xs text-slate-500">Utforska län efter landsdel, residensstad och största stad</p>
    </div>
    <div className="flex items-center gap-2">
      <a
        href={COUNTIES_STANDINGS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="px-2 py-1 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:text-sky-600 transition-all flex items-center gap-1 shadow-2xs"
        title="Se officiell befolkningsstatistik från SCB"
      >
        <BarChart2 className="w-3.5 h-3.5 text-sky-500" />
        <span className="hidden sm:inline">SCB Tabell</span>
        <ExternalLink className="w-3 h-3 text-slate-400" />
      </a>
      <button
        onClick={onClose}
        className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        aria-label="Stäng modal"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  </div>
);

const TeamsModalSearch: React.FC<{
  search: string;
  onSearchChange: (val: string) => void;
  filter: FilterOption;
  onFilterChange: (opt: FilterOption) => void;
}> = ({ search, onSearchChange, filter, onFilterChange }) => (
  <div className="p-3 border-b border-slate-100">
    <div className="search-bar-wrapper mb-2">
      <Search className="search-icon" />
      <input
        type="text"
        placeholder="Sök län, största stad eller residensstad..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
      {search.length > 0 && (
        <button
          type="button"
          onClick={() => onSearchChange('')}
          className="search-clear-button"
          aria-label="Rensa sökning"
          title="Rensa sökning"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
    <div className="flex items-center gap-1.5">
      {(['All', 'Götaland', 'Svealand', 'Norrland'] as FilterOption[]).map((opt) => (
        <button
          key={opt}
          onClick={() => onFilterChange(opt)}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
            filter === opt
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          {opt === 'All' ? 'Alla' : opt}
        </button>
      ))}
    </div>
  </div>
);

const CountyModalCard: React.FC<{
  county: SwedenCountyData;
  isSelected: boolean;
  isExplored: boolean;
  onSelect: (county: SwedenCountyData) => void;
}> = ({ county, isSelected, isExplored, onSelect }) => {
  const cardStyle = isSelected
    ? 'bg-sky-50 border-sky-400 ring-1 ring-sky-300'
    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50';

  return (
    <button
      type="button"
      onClick={() => onSelect(county)}
      className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 group shadow-2xs cursor-pointer ${cardStyle}`}
    >
      <img
        src={county.coatOfArms}
        alt={county.name}
        className="w-6 h-8 object-contain shrink-0 group-hover:scale-105 transition-transform"
        style={{ width: '24px', height: '32px', objectFit: 'contain' }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <h4 className="font-bold text-xs text-slate-900 truncate">{county.name}</h4>
          <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1 py-0.2 rounded shrink-0">
            {county.letter}
          </span>
        </div>
        <div className="text-[11px] text-sky-700 font-semibold truncate flex items-center gap-1">
          <MapPin className="w-2.5 h-2.5 text-sky-600 shrink-0" />
          <span className="truncate">{county.largestCity}</span>
        </div>
        <div className="text-[10px] text-slate-400 truncate">
          {county.region} • {formatPopulation(county.population)}
        </div>
      </div>
      {isExplored && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 self-center" />}
    </button>
  );
};

const TeamsModalGrid: React.FC<{
  counties: SwedenCountyData[];
  selectedTeamId?: string;
  exploredTeams: Set<string>;
  onSelect: (county: SwedenCountyData) => void;
}> = ({ counties, selectedTeamId, exploredTeams, onSelect }) => (
  <div className="p-3 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 flex-1 custom-scrollbar">
    {counties.map((county) => (
      <CountyModalCard
        key={county.id}
        county={county}
        isSelected={selectedTeamId === county.id}
        isExplored={exploredTeams.has(county.id)}
        onSelect={onSelect}
      />
    ))}
    {counties.length === 0 && (
      <div className="col-span-full py-8 text-center text-slate-400 text-sm">
        Inga län matchade din sökning
      </div>
    )}
  </div>
);

export const TeamsModal: React.FC<TeamsModalProps> = ({
  isOpen,
  onClose,
  onSelectTeam,
  selectedTeamId,
  exploredTeams,
}) => {
  useEscapeKey(isOpen, onClose);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterOption>('All');

  const filteredCounties = useMemo(() => {
    const list = filter === 'All' ? SWEDISH_COUNTIES : filterCountiesByRegion(filter);
    return search.trim() ? searchCounties(search, list) : list;
  }, [search, filter]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 counties-modal-dialog flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 pb-0">
          <TeamsModalHeader onClose={onClose} />
        </div>
        <TeamsModalSearch
          search={search}
          onSearchChange={setSearch}
          filter={filter}
          onFilterChange={setFilter}
        />
        <TeamsModalGrid
          counties={filteredCounties}
          selectedTeamId={selectedTeamId}
          exploredTeams={exploredTeams}
          onSelect={(c) => {
            onSelectTeam(c);
            onClose();
          }}
        />
      </div>
    </div>
  );
};

export const CountiesModal = TeamsModal;
