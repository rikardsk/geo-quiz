import React, { useState, useEffect, useMemo } from 'react';
import { USState } from '../data/statesData';
import { searchStates, filterStatesByRegion } from '../utils/stateUtils';
import { X, Search, CheckCircle2 } from 'lucide-react';

export interface CapitalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectState: (state: USState) => void;
  selectedStateId?: string;
  exploredStates: Set<string>;
}

const REGIONS = ['All', 'West', 'Midwest', 'South', 'Northeast'];

function useFilteredCapitals(search: string, region: string): USState[] {
  return useMemo(() => {
    let list = filterStatesByRegion(region).filter((s) => s.id !== 'DC');
    if (search.trim()) {
      const matches = new Set(searchStates(search).map((s) => s.id));
      list = list.filter((s) => matches.has(s.id));
    }
    return list.sort((a, b) => a.capital.localeCompare(b.capital));
  }, [search, region]);
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

const CapitalsModalHeader: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
    <div>
      <h2 className="text-xl font-bold text-slate-900">Select a Capital</h2>
      <p className="text-xs text-slate-500">Choose from all 50 US state capitals</p>
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
}> = ({ selectedRegion, onRegionChange }) => (
  <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
    {REGIONS.map((r) => (
      <button
        key={r}
        onClick={() => onRegionChange(r)}
        className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
          selectedRegion === r
            ? 'bg-slate-900 text-white border-slate-900'
            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
        }`}
      >
        {r}
      </button>
    ))}
  </div>
);

const CapitalsModalControls: React.FC<{
  search: string;
  onSearchChange: (val: string) => void;
  selectedRegion: string;
  onRegionChange: (reg: string) => void;
}> = ({ search, onSearchChange, selectedRegion, onRegionChange }) => (
  <div className="py-3 flex flex-col sm:flex-row gap-2">
    <div className="search-bar-wrapper flex-1">
      <Search className="search-icon" />
      <input
        type="text"
        placeholder="Filter states or capitals..."
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
    <RegionFilterButtons selectedRegion={selectedRegion} onRegionChange={onRegionChange} />
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

const CapitalsGrid: React.FC<{
  capitals: USState[];
  selectedStateId?: string;
  exploredStates: Set<string>;
  onSelect: (state: USState) => void;
}> = ({ capitals, selectedStateId, exploredStates, onSelect }) => {
  if (capitals.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-slate-400">
        No state capitals match your search query.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
      {capitals.map((state) => (
        <CapitalCard
          key={state.id}
          state={state}
          isSelected={selectedStateId === state.id}
          isExplored={exploredStates.has(state.id)}
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
}) => {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All');
  useEscapeKey(isOpen, onClose);
  const capitals = useFilteredCapitals(search, region);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop select-none" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <CapitalsModalHeader onClose={onClose} />
        <CapitalsModalControls
          search={search}
          onSearchChange={setSearch}
          selectedRegion={region}
          onRegionChange={setRegion}
        />
        <div className="modal-body-scroll">
          <CapitalsGrid
            capitals={capitals}
            selectedStateId={selectedStateId}
            exploredStates={exploredStates}
            onSelect={(state) => {
              onSelectState(state);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
};
