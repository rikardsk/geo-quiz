import React, { useState, useEffect, useMemo } from 'react';
import { USState, REGION_COLORS, US_STATES } from '../data/statesData';
import { X, Search, CheckCircle2 } from 'lucide-react';

export interface CapitalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectState: (state: USState) => void;
  selectedStateId?: string;
  exploredStates: Set<string>;
  states?: USState[];
  showLesserAntilles?: boolean;
}

const ALL_REGIONS = ['All', 'Central America', 'Greater Antilles', 'Lesser Antilles'];

function useFilteredCapitals(search: string, region: string, baseList: USState[]): USState[] {
  return useMemo(() => {
    let list = region === 'All' ? baseList : baseList.filter((s) => s.region === region);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) => s.capital.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
    }
    return list.sort((a, b) => a.capital.localeCompare(b.capital));
  }, [search, region, baseList]);
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

const CapitalsModalHeader: React.FC<{ onClose: () => void; totalCount: number }> = ({ onClose, totalCount }) => (
  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
    <div>
      <h2 className="text-xl font-bold text-slate-900">Select a Capital</h2>
      <p className="text-xs text-slate-500">Choose from all {totalCount} capitals</p>
    </div>
    <button
      onClick={onClose}
      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
      aria-label="Close modal"
    >
      <X className="w-5 h-5" />
    </button>
  </div>
);

const RegionFilterButtons: React.FC<{
  selectedRegion: string;
  onRegionChange: (reg: string) => void;
  regions: string[];
}> = ({ selectedRegion, onRegionChange, regions }) => (
  <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
    {regions.map((r) => {
      const isActive = selectedRegion === r;
      const colorInfo = REGION_COLORS[r];

      const style = colorInfo
        ? isActive
          ? {
              backgroundColor: colorInfo.bg,
              borderColor: colorInfo.bg,
              color: '#0f172a',
            }
          : {
              backgroundColor: `${colorInfo.bg}22`,
              borderColor: `${colorInfo.bg}66`,
              color: colorInfo.text,
            }
        : undefined;

      const className = colorInfo
        ? `px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-1 ${
            isActive ? 'ring-2 ring-slate-900/20 ring-offset-1 shadow-sm' : 'hover:brightness-95'
          }`
        : `px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-all ${
            isActive
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-slate-900/20 ring-offset-1'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`;

      return (
        <button
          key={r}
          onClick={() => onRegionChange(r)}
          style={style}
          className={className}
        >
          {colorInfo && (
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: isActive ? colorInfo.text : colorInfo.bg }}
            />
          )}
          {r}
        </button>
      );
    })}
  </div>
);

const CapitalsModalControls: React.FC<{
  search: string;
  onSearchChange: (val: string) => void;
  selectedRegion: string;
  onRegionChange: (reg: string) => void;
  regions: string[];
}> = ({ search, onSearchChange, selectedRegion, onRegionChange, regions }) => (
  <div className="py-3 flex flex-col sm:flex-row gap-2">
    <div className="search-bar-wrapper flex-1">
      <Search className="search-icon" />
      <input
        type="text"
        placeholder="Filter capitals or countries..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
        autoFocus
      />
      {search.length > 0 && (
        <button
          type="button"
          onClick={() => onSearchChange('')}
          className="search-clear-button"
          aria-label="Clear search"
          title="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
    <RegionFilterButtons selectedRegion={selectedRegion} onRegionChange={onRegionChange} regions={regions} />
  </div>
);

const CapitalCard: React.FC<{
  state: USState;
  isSelected: boolean;
  isExplored: boolean;
  onSelect: (state: USState) => void;
}> = ({ state, isSelected, isExplored, onSelect }) => (
  <button
    onClick={() => onSelect(state)}
    className={`p-3 text-left rounded-xl border transition-all flex items-center justify-between ${
      isSelected
        ? 'border-rose-500 bg-rose-50/70 shadow-sm'
        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
    }`}
  >
    <div className="flex items-center gap-2.5 overflow-hidden">
      <span
        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: state.color }}
      />
      <div className="truncate">
        <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5 truncate">
          <span>{state.capital}</span>
          <span className="text-[10px] font-mono text-slate-400">({state.id})</span>
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
          <span className="truncate">{state.name}</span>
        </div>
      </div>
    </div>
    {isExplored && (
      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 ml-1.5" />
    )}
  </button>
);

const CapitalCardsList: React.FC<{
  capitals: USState[];
  selectedStateId?: string;
  exploredStates: Set<string>;
  onSelect: (state: USState) => void;
}> = ({ capitals, selectedStateId, exploredStates, onSelect }) => {
  if (capitals.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400">
        <p className="text-sm">No capitals found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
      {capitals.map((st) => (
        <CapitalCard
          key={st.id}
          state={st}
          isSelected={selectedStateId === st.id}
          isExplored={exploredStates.has(st.id)}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export const CapitalsModal: React.FC<CapitalsModalProps> = ({
  isOpen,
  onClose,
  onSelectState,
  selectedStateId,
  exploredStates,
  states,
  showLesserAntilles = true,
}) => {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');

  useEscapeKey(isOpen, onClose);

  useEffect(() => {
    if (!isOpen) {
      setSearch('');
      setSelectedRegion('All');
    }
  }, [isOpen]);

  const activeRegions = showLesserAntilles
    ? ALL_REGIONS
    : ['All', 'Central America', 'Greater Antilles'];
  const baseStates = states && states.length > 0 ? states : US_STATES;
  const filteredCapitals = useFilteredCapitals(search, selectedRegion, baseStates);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop select-none" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <CapitalsModalHeader onClose={onClose} totalCount={baseStates.length} />
        <CapitalsModalControls
          search={search}
          onSearchChange={setSearch}
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
          regions={activeRegions}
        />
        <div className="modal-body-scroll">
          <CapitalCardsList
            capitals={filteredCapitals}
            selectedStateId={selectedStateId}
            exploredStates={exploredStates}
            onSelect={(st) => {
              onSelectState(st);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
};
