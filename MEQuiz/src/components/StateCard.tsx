import React from 'react';
import { USState, UAEEmirate, UAE_EMIRATES } from '../data/statesData';
import { Landmark, MapPin, Sparkles, CheckCircle2, ChevronRight, ChevronLeft, X, Layers, Globe } from 'lucide-react';

export interface StateCardProps {
  state: USState | null;
  onNextState: () => void;
  onPrevState: () => void;
  isExplored: boolean;
  onClose?: () => void;
  selectedEmirate?: UAEEmirate | null;
  onSelectEmirate?: (emirate: UAEEmirate | null) => void;
  mapView?: 'middle-east' | 'uae-emirates';
  onToggleMapView?: () => void;
  onOpenUAEMap?: () => void;
}

const StateCardEmpty: React.FC<{ mapView?: 'middle-east' | 'uae-emirates'; onToggleMapView?: () => void }> = ({
  mapView,
  onToggleMapView,
}) => (
  <div className="state-card-empty">
    <MapPin className="w-12 h-12 text-slate-300 mb-3 animate-bounce" />
    <h3 className="text-lg font-semibold text-slate-700">
      {mapView === 'uae-emirates' ? 'Select Any Emirate' : 'Select Any Country'}
    </h3>
    <p className="text-sm text-slate-500 max-w-xs text-center mt-1">
      {mapView === 'uae-emirates'
        ? 'Click on any of the 7 UAE emirates on the map above to view its capital, nickname, and details.'
        : 'Click on any country on the map above to view its name, capital, and regional details.'}
    </p>
    {onToggleMapView && (
      <button
        onClick={onToggleMapView}
        className="mt-4 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-all"
      >
        {mapView === 'uae-emirates' ? (
          <>
            <Globe className="w-3.5 h-3.5 text-rose-500" />
            Switch to Middle East Map
          </>
        ) : (
          <>
            <Layers className="w-3.5 h-3.5 text-rose-500" />
            Switch to UAE Emirates Map
          </>
        )}
      </button>
    )}
  </div>
);

const EmirateCardDetails: React.FC<{
  emirate: UAEEmirate;
  onClear: () => void;
  onSelectEmirate?: (em: UAEEmirate | null) => void;
  onToggleMapView?: () => void;
  onPrevEmirate: () => void;
  onNextEmirate: () => void;
  isExplored?: boolean;
}> = ({ emirate, onClear, onSelectEmirate, onToggleMapView, onPrevEmirate, onNextEmirate, isExplored }) => (
  <div className="state-card">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <span
          className="w-3.5 h-3.5 rounded-full inline-block shadow-sm"
          style={{ backgroundColor: emirate.color }}
        />
        <span className="text-xs font-bold tracking-wider uppercase text-slate-500">
          UAE Emirate
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
          {emirate.id}
        </span>
        <button
          onClick={onClear}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Back to UAE"
          title="Back to country view"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>

    <div className="mb-6">
      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
        {emirate.name}
        {isExplored && (
          <span title="Explored">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          </span>
        )}
      </h2>
      <p className="text-xs text-slate-400 mt-0.5">Emirate of the United Arab Emirates</p>
      {emirate.nickname && (
        <p className="text-xs italic text-slate-500 mt-2 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 inline flex-shrink-0" />
          {emirate.nickname}
        </p>
      )}
    </div>

    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-rose-100 text-rose-600 rounded-lg">
          <Landmark className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Emirate Capital
          </span>
          <p className="text-xl font-bold text-slate-900">{emirate.capital}</p>
        </div>
      </div>
    </div>

    {/* Emirates quick selector pills */}
    <div className="pt-3 pb-3 border-t border-slate-100 mb-2">
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
        7 Emirates of UAE:
      </span>
      <div className="flex flex-wrap gap-1">
        {UAE_EMIRATES.map((em) => (
          <button
            key={em.id}
            onClick={() => onSelectEmirate?.(em)}
            className={`px-2 py-1 text-[11px] font-semibold rounded-md border transition-all ${
              em.id === emirate.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {em.name}
          </button>
        ))}
      </div>
    </div>

    {onToggleMapView && (
      <div className="mb-3">
        <button
          onClick={onToggleMapView}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-all"
        >
          <Globe className="w-3.5 h-3.5 text-rose-500" />
          View Full Middle East Map
        </button>
      </div>
    )}

    {/* Emirate Previous / Next Navigation */}
    <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
      <button onClick={onPrevEmirate} className="btn-secondary" aria-label="Previous Emirate">
        <ChevronLeft className="w-4 h-4" /> Previous
      </button>
      <button onClick={onNextEmirate} className="btn-primary" aria-label="Next Emirate">
        Next <ChevronRight className="w-4 h-4" />
      </button>
    </div>
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

const StateCardDetails: React.FC<{
  state: USState;
  isExplored: boolean;
  onOpenUAEMap?: () => void;
  onSelectEmirate?: (em: UAEEmirate | null) => void;
}> = ({ state, isExplored, onOpenUAEMap, onSelectEmirate }) => (
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
          <Sparkles className="w-3.5 h-3.5 text-amber-500 inline flex-shrink-0" />
          {state.nickname}
        </p>
      )}
    </div>

    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-rose-100 text-rose-600 rounded-lg">
          <Landmark className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            National Capital
          </span>
          <p className="text-xl font-bold text-slate-900">{state.capital}</p>
        </div>
      </div>
    </div>

    {/* Special UAE 7 Emirates Section */}
    {state.id === 'AE' && (
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-amber-600" />
            7 Federated Emirates
          </span>
          {onOpenUAEMap && (
            <button
              onClick={onOpenUAEMap}
              className="text-[11px] font-bold text-amber-700 hover:text-amber-900 underline flex items-center gap-1"
            >
              Open Full Map →
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1 mb-2.5">
          {UAE_EMIRATES.map((em) => (
            <button
              key={em.id}
              onClick={() => {
                onSelectEmirate?.(em);
                onOpenUAEMap?.();
              }}
              className="px-2 py-0.5 text-[11px] font-semibold bg-white border border-amber-200 hover:bg-amber-100 rounded text-slate-800 transition-colors"
            >
              {em.name}
            </button>
          ))}
        </div>
        {onOpenUAEMap && (
          <button
            onClick={onOpenUAEMap}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
          >
            <Layers className="w-3.5 h-3.5" />
            View UAE Emirates Map
          </button>
        )}
      </div>
    )}
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
  selectedEmirate,
  onSelectEmirate,
  mapView = 'middle-east',
  onToggleMapView,
  onOpenUAEMap,
}) => {
  const handlePrevEmirate = () => {
    if (!selectedEmirate) {
      onSelectEmirate?.(UAE_EMIRATES[UAE_EMIRATES.length - 1]);
      return;
    }
    const idx = UAE_EMIRATES.findIndex((em) => em.id === selectedEmirate.id);
    const prevIdx = (idx - 1 + UAE_EMIRATES.length) % UAE_EMIRATES.length;
    onSelectEmirate?.(UAE_EMIRATES[prevIdx]);
  };

  const handleNextEmirate = () => {
    if (!selectedEmirate) {
      onSelectEmirate?.(UAE_EMIRATES[0]);
      return;
    }
    const idx = UAE_EMIRATES.findIndex((em) => em.id === selectedEmirate.id);
    const nextIdx = (idx + 1) % UAE_EMIRATES.length;
    onSelectEmirate?.(UAE_EMIRATES[nextIdx]);
  };

  if (selectedEmirate) {
    return (
      <EmirateCardDetails
        emirate={selectedEmirate}
        onClear={() => onSelectEmirate?.(null)}
        onSelectEmirate={onSelectEmirate}
        onToggleMapView={onToggleMapView}
        onPrevEmirate={handlePrevEmirate}
        onNextEmirate={handleNextEmirate}
        isExplored={isExplored}
      />
    );
  }

  if (!state) return <StateCardEmpty mapView={mapView} onToggleMapView={onToggleMapView} />;

  return (
    <div className="state-card">
      <StateCardHeader state={state} onClose={onClose} />
      <StateCardDetails
        state={state}
        isExplored={isExplored}
        onOpenUAEMap={onOpenUAEMap || onToggleMapView}
        onSelectEmirate={onSelectEmirate}
      />
      <StateCardNav onPrev={onPrevState} onNext={onNextState} />
    </div>
  );
};
