import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { US_STATES, BACKGROUND_PATHS, USState } from '../data/statesData';
import {
  ZoomState,
  INITIAL_ZOOM,
  calculateZoomIn,
  calculateZoomOut,
  calculatePan,
  formatViewBox,
} from '../utils/mapZoomUtils';

interface USMapProps {
  selectedState: USState | null;
  onSelectState: (state: USState) => void;
  highlightedRegion?: string;
  exploredStates: Set<string>;
  showAllCapitals?: boolean;
  showUnexploredOnly?: boolean;
  isQuizMode?: boolean;
  targetHighlightStateId?: string | null;
  disableMapSelection?: boolean;
  quizFeedback?: { stateId: string; status: 'correct' | 'incorrect' | 'revealed' } | null;
  hintRegion?: string | null;
  correctStateIds?: Set<string>;
  revealedStateIds?: Set<string>;
  showLesserAntilles?: boolean;
}

export const USMap: React.FC<USMapProps> = ({
  selectedState,
  onSelectState,
  highlightedRegion = 'All',
  exploredStates,
  showAllCapitals = false,
  showUnexploredOnly = false,
  isQuizMode = false,
  targetHighlightStateId = null,
  disableMapSelection = false,
  quizFeedback = null,
  hintRegion = null,
  correctStateIds,
  revealedStateIds,
  showLesserAntilles = false,
}) => {
  const [hoveredState, setHoveredState] = useState<USState | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<ZoomState>(INITIAL_ZOOM);
  const [isPanning, setIsPanning] = useState(false);
  const [panOrigin, setPanOrigin] = useState<{ clientX: number; clientY: number; startX: number; startY: number } | null>(null);

  const dragDistanceRef = React.useRef(0);
  const mouseDownPosRef = React.useRef<{ x: number; y: number } | null>(null);

  const visibleStates = showLesserAntilles
    ? US_STATES
    : US_STATES.filter((s) => s.region !== 'Lesser Antilles');

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    mouseDownPosRef.current = { x: e.clientX, y: e.clientY };
    dragDistanceRef.current = 0;

    if (zoom.scale <= 1) return;
    setIsPanning(true);
    setPanOrigin({
      clientX: e.clientX,
      clientY: e.clientY,
      startX: zoom.x,
      startY: zoom.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    if (mouseDownPosRef.current) {
      dragDistanceRef.current = Math.hypot(
        e.clientX - mouseDownPosRef.current.x,
        e.clientY - mouseDownPosRef.current.y
      );
    }

    if (!isPanning || !panOrigin || zoom.scale <= 1) return;

    const dx = e.clientX - panOrigin.clientX;
    const dy = e.clientY - panOrigin.clientY;

    setZoom(
      calculatePan(zoom, panOrigin.startX, panOrigin.startY, dx, dy, rect.width, rect.height)
    );
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setPanOrigin(null);
    mouseDownPosRef.current = null;
  };

  const handleStateClick = (state: USState) => {
    if (disableMapSelection) return;
    if (dragDistanceRef.current > 6) return;
    onSelectState(state);
  };

  const handleZoomIn = () => setZoom((prev) => calculateZoomIn(prev));
  const handleZoomOut = () => setZoom((prev) => calculateZoomOut(prev));
  const handleResetZoom = () => setZoom(INITIAL_ZOOM);

  const getStateFill = (state: USState) => {
    if (quizFeedback?.stateId === state.id) {
      if (quizFeedback.status === 'correct') return '#10b981';
      if (quizFeedback.status === 'revealed') return '#f59e0b';
      return '#ef4444';
    }
    if (isQuizMode && targetHighlightStateId === state.id) return '#f43f5e';
    if (isQuizMode && correctStateIds?.has(state.id)) return '#a7f3d0';
    if (isQuizMode && revealedStateIds?.has(state.id)) return '#fde68a';
    if (!isQuizMode && selectedState?.id === state.id) return '#f43f5e';
    if (!disableMapSelection && hoveredState?.id === state.id) return isQuizMode ? '#fda4af' : '#fb7185';
    if (!isQuizMode && showUnexploredOnly && exploredStates.has(state.id)) return '#e2e8f0';

    const targetRegion = hintRegion || (highlightedRegion !== 'All' ? highlightedRegion : null);
    if (targetRegion && state.region !== targetRegion) return '#e2e8f0';

    return state.color;
  };

  const getStateOpacity = (state: USState) => {
    if (!isQuizMode && showUnexploredOnly && exploredStates.has(state.id) && selectedState?.id !== state.id) {
      return 0.35;
    }
    const targetRegion = hintRegion || (highlightedRegion !== 'All' ? highlightedRegion : null);
    if (!targetRegion || state.region === targetRegion) return 1;
    return 0.35;
  };

  const renderCorrectBadge = (state: USState) => {
    const { x, y } = state.capitalCoordinates;
    if (!x || !y) return null;

    return (
      <g key={`solved-badge-${state.id}`} className="pointer-events-none select-none">
        <circle cx={x} cy={y} r="6.5" fill="#ffffff" opacity="0.9" />
        <circle cx={x} cy={y} r="5.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.2" />
        <path
          d={`M ${x - 2.5} ${y - 0.2} L ${x - 0.7} ${y + 1.8} L ${x + 2.5} ${y - 1.8}`}
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    );
  };

  const renderRevealedBadge = (state: USState) => {
    const { x, y } = state.capitalCoordinates;
    if (!x || !y) return null;

    return (
      <g key={`revealed-badge-${state.id}`} className="pointer-events-none select-none">
        <circle cx={x} cy={y} r="6.5" fill="#ffffff" opacity="0.9" />
        <circle cx={x} cy={y} r="5.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.2" />
        <text x={x} y={y + 3} textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
          ?
        </text>
      </g>
    );
  };

  const renderTargetBeacon = (state: USState) => {
    const { x, y } = state.capitalCoordinates;
    if (!x || !y) return null;

    return (
      <g key={`target-beacon-${state.id}`} className="pointer-events-none select-none">
        <circle cx={x} cy={y} r="16" fill="#f43f5e" opacity="0.4" className="animate-ping" />
        <circle cx={x} cy={y} r="7" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
        <circle cx={x} cy={y} r="2.5" fill="#ffffff" />
      </g>
    );
  };

  const renderRevealedBeacon = (state: USState) => {
    const { x, y } = state.capitalCoordinates;
    if (!x || !y) return null;

    return (
      <g key={`revealed-beacon-${state.id}`} className="pointer-events-none select-none">
        <circle cx={x} cy={y} r="18" fill="#f59e0b" opacity="0.4" className="animate-ping" />
        <circle cx={x} cy={y} r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
        <rect
          x={x - state.name.length * 4.2}
          y={y - 24}
          width={state.name.length * 8.4}
          height="18"
          rx="5"
          fill="#0f172a"
          opacity="0.92"
        />
        <text x={x} y={y - 12} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
          {state.name}
        </text>
      </g>
    );
  };

  const renderCapitalBadge = (state: USState) => {
    const { x, y } = state.capitalCoordinates;
    if (!x || !y) return null;

    const labelText = `★ ${state.capital}`;
    const badgeWidth = Math.max(75, labelText.length * 6.8 + 16);
    const rectX = x > 800 ? x - badgeWidth - 10 : x + 10;
    const rectY = y < 35 ? y + 8 : y - 11;

    return (
      <g key={`capital-badge-${state.id}`} className="pointer-events-none select-none">
        <circle cx={x} cy={y} r="11" fill="none" stroke="#f43f5e" strokeWidth="1.5" className="animate-ping" opacity="0.7" />
        <circle cx={x} cy={y} r="5.5" fill="#0f172a" stroke="#ffffff" strokeWidth="1.8" />
        <circle cx={x} cy={y} r="2" fill="#f43f5e" />
        <rect x={rectX} y={rectY} width={badgeWidth} height="20" rx="5" fill="#0f172a" stroke="#334155" strokeWidth="1" opacity="0.95" />
        <text x={rectX + 8} y={rectY + 14} fill="#ffffff" fontSize="11" fontWeight="700" fontFamily="system-ui, sans-serif">
          {labelText}
        </text>
      </g>
    );
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto select-none">
      <svg
        viewBox={formatViewBox(zoom)}
        className={`w-full h-auto drop-shadow-md rounded-2xl bg-slate-50 border border-slate-200 ${
          zoom.scale > 1 ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : ''
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setHoveredState(null);
          setIsPanning(false);
          setPanOrigin(null);
        }}
        role="img"
        aria-label="Interactive Map of Central America and the Caribbean"
      >
        {/* Background landmasses (e.g. USA, Colombia, Venezuela, Puerto Rico) */}
        <g id="background-layer" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.8" strokeLinejoin="round" pointerEvents="none">
          {BACKGROUND_PATHS.map((bg) => (
            <path key={bg.id} d={bg.d} />
          ))}
        </g>

        {/* Countries Layer */}
        <g id="countries-layer">
          {visibleStates.map((state) => (
            <path
              key={state.id}
              id={`country-${state.id.toLowerCase()}`}
              d={state.d}
              fill={getStateFill(state)}
              opacity={getStateOpacity(state)}
              stroke="#ffffff"
              strokeWidth="1.2"
              strokeLinejoin="round"
              className={`${disableMapSelection ? 'cursor-default' : 'cursor-pointer'} transition-colors duration-150 ease-out`}
              onClick={() => handleStateClick(state)}
              onMouseEnter={() => {
                if (!disableMapSelection) setHoveredState(state);
              }}
              tabIndex={disableMapSelection ? -1 : 0}
              role={disableMapSelection ? undefined : 'button'}
              aria-label={isQuizMode ? 'Country' : `${state.name}, Capital: ${state.capital}`}
            >
              {!isQuizMode && <title>{`${state.name} (${state.id}) - Capital: ${state.capital}`}</title>}
            </path>
          ))}
        </g>

        {/* Small Island Targets (enhanced interactive indicators for small Caribbean islands) */}
        <g id="small-islands-layer">
          {visibleStates.filter((s) => s.isSmallIsland).map((s) => (
            <circle
              key={`island-target-${s.id}`}
              cx={s.capitalCoordinates.x}
              cy={s.capitalCoordinates.y}
              r="5"
              fill={getStateFill(s)}
              stroke="#ffffff"
              strokeWidth="1.2"
              opacity={getStateOpacity(s)}
              className={`${disableMapSelection ? 'cursor-default' : 'cursor-pointer'} transition-transform hover:scale-125`}
              onClick={() => handleStateClick(s)}
              onMouseEnter={() => {
                if (!disableMapSelection) setHoveredState(s);
              }}
              tabIndex={disableMapSelection ? -1 : 0}
              role={disableMapSelection ? undefined : 'button'}
              aria-label={isQuizMode ? 'Country' : `${s.name}, Capital: ${s.capital}`}
            >
              {!isQuizMode && <title>{`${s.name} (${s.id}) - Capital: ${s.capital}`}</title>}
            </circle>
          ))}
        </g>

        {!isQuizMode && selectedState && renderCapitalBadge(selectedState)}

        {/* Badges for countries in Quiz Mode */}
        {isQuizMode && (
          <g id="solved-badges-layer">
            {correctStateIds && visibleStates.filter((s) => correctStateIds.has(s.id)).map(renderCorrectBadge)}
            {revealedStateIds && visibleStates.filter((s) => revealedStateIds.has(s.id)).map(renderRevealedBadge)}
          </g>
        )}

        {isQuizMode && targetHighlightStateId && !quizFeedback && (() => {
          const state = visibleStates.find((s) => s.id === targetHighlightStateId);
          return state ? renderTargetBeacon(state) : null;
        })()}

        {isQuizMode && quizFeedback?.status === 'revealed' && (() => {
          const state = visibleStates.find((s) => s.id === quizFeedback.stateId);
          return state ? renderRevealedBeacon(state) : null;
        })()}

        {showAllCapitals &&
          visibleStates.filter((s) => s.id !== selectedState?.id).map((s) => (
            <circle
              key={`dot-${s.id}`}
              cx={s.capitalCoordinates.x}
              cy={s.capitalCoordinates.y}
              r="2.5"
              fill="#0f172a"
              stroke="#ffffff"
              strokeWidth="1"
              opacity="0.75"
              className={`${disableMapSelection ? 'pointer-events-none' : 'cursor-pointer'}`}
              onClick={() => handleStateClick(s)}
            />
          ))}
      </svg>

      {/* Zoom and Pan Controls (side-by-side in bottom-left corner) */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-row items-center gap-1 bg-white/95 backdrop-blur-sm p-1 rounded-xl shadow-md border border-slate-200">
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom in"
          aria-label="Zoom in"
          className="flex items-center justify-center p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          disabled={zoom.scale <= 1}
          title="Zoom out"
          aria-label="Zoom out"
          className="flex items-center justify-center p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        {zoom.scale > 1 && (
          <>
            <div className="w-px h-4 bg-slate-200 my-auto" />
            <button
              type="button"
              onClick={handleResetZoom}
              title="Reset zoom"
              aria-label="Reset zoom"
              className="flex items-center justify-center p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {!disableMapSelection && hoveredState && (
        <div
          className="pointer-events-none absolute z-30 px-3 py-1.5 rounded-lg shadow-lg text-xs font-medium text-white bg-slate-900/90 backdrop-blur-sm transform -translate-x-1/2 -translate-y-12 transition-all duration-75"
          style={{ left: mousePos.x, top: mousePos.y }}
        >
          {isQuizMode ? (
            <p className="font-semibold text-rose-300">Click to choose country</p>
          ) : (
            <>
              <p className="font-bold">{hoveredState.name}</p>
              <p className="text-slate-300">Capital: {hoveredState.capital}</p>
              {exploredStates.has(hoveredState.id) ? (
                <span className="text-[10px] text-emerald-300">✓ Explored</span>
              ) : (
                <span className="text-[10px] text-amber-300">★ Left to explore</span>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export const LAMap = USMap;
