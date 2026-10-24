import React, { useState, useEffect, useMemo } from 'react';
import { USState, REGION_COLORS } from '../data/statesData';
import { searchStates, filterStatesByRegion } from '../utils/stateUtils';
import { X, Search, CheckCircle2 } from 'lucide-react';

export interface CapitalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectState: (state: USState) => void;
  selectedStateId?: string;
  exploredStates: Set<string>;
}

const REGIONS = ['All', 'North Africa', 'West Africa', 'Central Africa'];

function useFilteredCapitals(search: string, region: string): USState[] {
  return useMemo(() => {
    let list = filterStatesByRegion(region);
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
      <p className="text-xs text-slate-500">Choose from all 27 North & West African capitals</p>
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
    {REGIONS.map((r) => {
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

const CapitalsFilterBar: React.FC<{
  search: string;
  onSearchChange: (val: string) => void;
  selectedRegion: string;
  onRegionChange: (reg: string) => void;
}> = ({ search, onSearchChange, selectedRegion, onRegionChange }) => (
  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 pb-2">
    <div className="relative flex-1">
      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        placeholder="Filter capitals or countries..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
      />
    </div>
    <RegionFilterButtons selectedRegion={selectedRegion} onRegionChange={onRegionChange} />
  </div>
);

const CapitalCardItem: React.FC<{
  state: USState;
  isSelected: boolean;
  isExplored: boolean;
  onSelect: () => void;
}> = ({ state, isSelected, isExplored, onSelect }) => (
  <button
    onClick={onSelect}
    className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
      isSelected
        ? 'border-rose-500 bg-rose-50/50 shadow-sm ring-1 ring-rose-500'
        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'
    }`}
  >
    <div className="flex items-start justify-between gap-1 mb-1">
      <span className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
        <span
          className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
          style={{ backgroundColor: state.color }}
        />
        {state.capital}
      </span>
      {isExplored ? (
        <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 ml-2 flex-shrink-0">
          <CheckCircle2 className="w-3 h-3" />
        </span>
      ) : (
        <span className="text-[10px] text-amber-500 font-medium ml-2 flex-shrink-0">
          ★
        </span>
      )}
    </div>

    <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
      <span className="truncate text-slate-700 font-medium">{state.name}</span>
      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded ml-2 flex-shrink-0">
        {state.id}
      </span>
    </div>
  </button>
);

const CapitalsGrid: React.FC<{
  states: USState[];
  selectedStateId?: string;
  exploredStates: Set<string>;
  onSelect: (state: USState) => void;
}> = ({ states, selectedStateId, exploredStates, onSelect }) => {
  if (states.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400 text-sm">
        No capitals match your search
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[60vh] overflow-y-auto pr-1 py-1">
      {states.map((state) => (
        <CapitalCardItem
          key={state.id}
          state={state}
          isSelected={selectedStateId === state.id}
          isExplored={exploredStates.has(state.id)}
          onSelect={() => onSelect(state)}
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
  const filteredCapitals = useFilteredCapitals(search, region);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <CapitalsModalHeader onClose={onClose} />
        <CapitalsFilterBar
          search={search}
          onSearchChange={setSearch}
          selectedRegion={region}
          onRegionChange={setRegion}
        />
        <CapitalsGrid
          states={filteredCapitals}
          selectedStateId={selectedStateId}
          exploredStates={exploredStates}
          onSelect={(s) => {
            onSelectState(s);
            onClose();
          }}
        />
        <div className="pt-3 border-t border-slate-200 mt-2 flex items-center justify-between text-xs text-slate-500">
          <span>{`Showing ${filteredCapitals.length} capitals`}</span>
          <button onClick={onClose} className="btn-secondary text-xs px-3 py-1.5">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
