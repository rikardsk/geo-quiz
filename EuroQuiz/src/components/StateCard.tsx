import React from 'react';
import { USState } from '../data/statesData';
import { Landmark, MapPin, Sparkles, CheckCircle2, ChevronRight, ChevronLeft, X } from 'lucide-react';

export interface StateCardProps {
  state: USState | null;
  onNextState: () => void;
  onPrevState: () => void;
  isExplored: boolean;
  onClose?: () => void;
}

const StateCardEmpty: React.FC = () => (
  <div className="state-card-empty">
    <MapPin className="w-12 h-12 text-slate-300 mb-3 animate-bounce" />
    <h3 className="text-lg font-semibold text-slate-700">Select Any Country</h3>
    <p className="text-sm text-slate-500 max-w-xs text-center mt-1">
      Click on any country on the map above to view its name, capital, and regional details.
    </p>
  </div>
);

const StateCardHeader: React.FC<{ state: USState; onClose?: () => void }> = ({ state, onClose }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <span
        className="w-3.5 h-3.5 rounded-full inline-block shadow-sm"
        style={{ backgroundColor: state.color }}
      />
      <span className="text-xs font-bold tracking-wider uppercase text-slate-500">
        {`${state.region} Region`}
      </span>
    </div>
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
        {state.id}
      </span>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close Country Details"
          title="Close details"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  </div>
);

const StateCardDetails: React.FC<{ state: USState; isExplored: boolean }> = ({ state, isExplored }) => (
  <>
    <div className="mb-6">
      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
        {state.name}
        {isExplored && (
          <span title="Explored">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          </span>
        )}
      </h2>
      {state.nickname && (
        <p className="text-xs italic text-slate-500 mt-1 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 inline" />
          {state.nickname}
        </p>
      )}
    </div>

    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-rose-100 text-rose-600 rounded-lg">
          <Landmark className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Country Capital
          </span>
          <p className="text-xl font-bold text-slate-900">{state.capital}</p>
        </div>
      </div>
    </div>
  </>
);

const StateCardNav: React.FC<{ onPrev: () => void; onNext: () => void }> = ({ onPrev, onNext }) => (
  <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
    <button onClick={onPrev} className="btn-secondary" aria-label="Previous Country">
      <ChevronLeft className="w-4 h-4" /> Previous
    </button>
    <button onClick={onNext} className="btn-primary" aria-label="Next Country">
      Next <ChevronRight className="w-4 h-4" />
    </button>
  </div>
);

export const StateCard: React.FC<StateCardProps> = ({
  state,
  onNextState,
  onPrevState,
  isExplored,
  onClose,
}) => {
  if (!state) {
    return <StateCardEmpty />;
  }

  return (
    <div className="state-card-container">
      <StateCardHeader state={state} onClose={onClose} />
      <StateCardDetails state={state} isExplored={isExplored} />
      <StateCardNav onPrev={onPrevState} onNext={onNextState} />
    </div>
  );
};
