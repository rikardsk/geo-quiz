import { useState, useMemo, useEffect, useRef } from 'react';
import { USState, UAEEmirate, UAE_EMIRATES } from './data/statesData';
import { USMap, MapViewType } from './components/USMap';
import { StateCard } from './components/StateCard';
import { Header } from './components/Header';
import { RegionFilter } from './components/RegionFilter';
import { StatesModal } from './components/StatesModal';
import { CapitalsModal } from './components/CapitalsModal';
import { QuizPanel } from './components/QuizPanel';
import { QuizStartModal } from './components/QuizStartModal';
import { QuizQuestionBanner, QuizQuestionOverlay } from './components/QuizQuestionBanner';
import { QuizToast } from './components/QuizToast';
import { QuizWinModal } from './components/QuizWinModal';
import { QuizBottomProgressBar } from './components/QuizBottomProgressBar';
import { ExploreBottomProgressBar } from './components/ExploreBottomProgressBar';
import { PerformanceTiersModal } from './components/PerformanceTiersModal';
import {
  generateQuestion,
  evaluateAnswer,
  calculateNewStreak,
  QuizQuestion,
  QuestionType,
  OFFICIAL_50_STATES,
} from './utils/quizUtils';
import { searchStates, getStateByName } from './utils/stateUtils';
import { Shuffle, MapPin, LayoutGrid, Compass, Target, Trophy, Info, Landmark, Layers } from 'lucide-react';

export function App() {
  const [appMode, setAppMode] = useState<'explore' | 'quiz'>('explore');
  const [mapView, setMapView] = useState<MapViewType>('middle-east');
  const [selectedState, setSelectedState] = useState<USState | null>(null);
  const [exploredStates, setExploredStates] = useState<Set<string>>(new Set());
  const [exploredEmirates, setExploredEmirates] = useState<Set<string>>(new Set());
  const [regionFilter, setRegionFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAllCapitals, setShowAllCapitals] = useState<boolean>(false);
  const [showUnexploredOnly, setShowUnexploredOnly] = useState<boolean>(false);
  const [showScorePanel, setShowScorePanel] = useState<boolean>(true);
  const [showStatePanel, setShowStatePanel] = useState<boolean>(true);
  const [selectedEmirate, setSelectedEmirate] = useState<UAEEmirate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCapitalsModalOpen, setIsCapitalsModalOpen] = useState<boolean>(false);
  const [isQuizStartModalOpen, setIsQuizStartModalOpen] = useState<boolean>(false);
  const [isQuizWinModalOpen, setIsQuizWinModalOpen] = useState<boolean>(false);
  const [isTiersModalOpen, setIsTiersModalOpen] = useState<boolean>(false);

  // Quiz State (Countries mode by default)
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);
  const [quizStreak, setQuizStreak] = useState(0);
  const [quizBestStreak, setQuizBestStreak] = useState(0);
  const [lastStatus, setLastStatus] = useState<'idle' | 'correct' | 'incorrect' | 'revealed'>('idle');
  const [lastAnsweredState, setLastAnsweredState] = useState<USState | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<{ stateId: string; status: 'correct' | 'incorrect' | 'revealed' } | null>(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [questionTypeMode, setQuestionTypeMode] = useState<'mixed' | QuestionType>('state-name');
  const [quizSolvedStates, setQuizSolvedStates] = useState<Set<string>>(new Set());
  const [quizRevealedStates, setQuizRevealedStates] = useState<Set<string>>(new Set());
  const [isRevealing, setIsRevealing] = useState<boolean>(false);
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const incorrectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isUAEMap = mapView === 'uae-emirates' && appMode === 'explore';
  const currentTotalCount = isUAEMap ? UAE_EMIRATES.length : OFFICIAL_50_STATES.length;
  const currentExploredCount = isUAEMap ? exploredEmirates.size : exploredStates.size;
  const unexploredCount = Math.max(0, currentTotalCount - currentExploredCount);

  const isQuizComplete = (quizSolvedStates.size + quizRevealedStates.size) >= OFFICIAL_50_STATES.length;
  const isSidebarVisible = appMode === 'explore' ? showStatePanel : showScorePanel;

  useEffect(() => {
    if (appMode === 'quiz' && !currentQuestion) {
      setCurrentQuestion(generateQuestion(questionTypeMode));
    }
  }, [appMode, currentQuestion, questionTypeMode]);

  const handleToggleMapView = () => {
    setMapView((prev) => (prev === 'middle-east' ? 'uae-emirates' : 'middle-east'));
  };

  const handleNextQuizQuestion = (nextSolvedSet?: Set<string>, nextRevealedSet?: Set<string>) => {
    if (revealTimerRef.current) {
      clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }
    if (incorrectTimerRef.current) {
      clearTimeout(incorrectTimerRef.current);
      incorrectTimerRef.current = null;
    }
    setLastStatus('idle');
    setLastAnsweredState(null);
    setQuizFeedback(null);
    setHintUsed(false);
    setIsRevealing(false);
    const solved = nextSolvedSet instanceof Set ? nextSolvedSet : quizSolvedStates;
    const revealed = nextRevealedSet instanceof Set ? nextRevealedSet : quizRevealedStates;
    const excluded = Array.from(new Set([...Array.from(solved), ...Array.from(revealed)]));
    setCurrentQuestion(generateQuestion(questionTypeMode, excluded));
  };

  const handleShowAnswer = () => {
    if (!currentQuestion || isQuizComplete || isRevealing) return;
    if (incorrectTimerRef.current) {
      clearTimeout(incorrectTimerRef.current);
      incorrectTimerRef.current = null;
    }
    const targetId = currentQuestion.targetState.id;
    setIsRevealing(true);
    setLastStatus('revealed');
    setQuizFeedback({ stateId: targetId, status: 'revealed' });

    setQuizStreak(0);
    setQuizTotal((prev) => prev + 1);

    const nextRevealed = new Set(quizRevealedStates);
    nextRevealed.add(targetId);
    setQuizRevealedStates(nextRevealed);

    if (quizSolvedStates.size + nextRevealed.size >= OFFICIAL_50_STATES.length) {
      revealTimerRef.current = setTimeout(() => {
        setIsRevealing(false);
        setIsQuizWinModalOpen(true);
      }, 1400);
      return;
    }

    revealTimerRef.current = setTimeout(() => {
      handleNextQuizQuestion(quizSolvedStates, nextRevealed);
    }, 1800);
  };

  const handleCorrectAnswer = (targetState: USState) => {
    setLastStatus('correct');
    setQuizScore((prev) => prev + 1);
    setQuizTotal((prev) => prev + 1);
    setQuizStreak((prev) => {
      const nextStreak = calculateNewStreak(prev, true);
      setQuizBestStreak((best) => Math.max(best, nextStreak));
      return nextStreak;
    });

    const nextSolved = new Set(quizSolvedStates);
    nextSolved.add(targetState.id);
    setQuizSolvedStates(nextSolved);
    if (nextSolved.size + quizRevealedStates.size >= OFFICIAL_50_STATES.length) {
      setTimeout(() => setIsQuizWinModalOpen(true), 1100);
    }

    setQuizFeedback({ stateId: targetState.id, status: 'correct' });
    setTimeout(() => {
      handleNextQuizQuestion(nextSolved, quizRevealedStates);
    }, 900);
  };

  const handleIncorrectAnswer = (clickedState: USState) => {
    setLastStatus('incorrect');
    setQuizTotal((prev) => prev + 1);
    setQuizStreak(0);
    setQuizFeedback({ stateId: clickedState.id, status: 'incorrect' });
    incorrectTimerRef.current = setTimeout(() => {
      setQuizFeedback(null);
      setLastStatus((prev) => (prev === 'incorrect' ? 'idle' : prev));
    }, 1500);
  };

  const handleQuizAnswer = (clickedState: USState) => {
    if (!currentQuestion || isQuizComplete || isRevealing) return;

    if (incorrectTimerRef.current) {
      clearTimeout(incorrectTimerRef.current);
      incorrectTimerRef.current = null;
    }

    setLastAnsweredState(clickedState);
    const isCorrect = evaluateAnswer(clickedState.id, currentQuestion.targetState.id);

    if (isCorrect) {
      handleCorrectAnswer(currentQuestion.targetState);
    } else {
      handleIncorrectAnswer(clickedState);
    }
  };

  const handleStartQuiz = (mode: 'mixed' | QuestionType) => {
    setMapView('middle-east');
    setQuestionTypeMode(mode);
    setQuizScore(0);
    setQuizTotal(0);
    setQuizStreak(0);
    setQuizBestStreak(0);
    setLastStatus('idle');
    setLastAnsweredState(null);
    setQuizFeedback(null);
    setHintUsed(false);
    setQuizSolvedStates(new Set());
    setQuizRevealedStates(new Set());
    setIsRevealing(false);
    setIsQuizStartModalOpen(false);
    setIsQuizWinModalOpen(false);
    setCurrentQuestion(generateQuestion(mode));
  };

  const handleRestartQuiz = () => {
    handleStartQuiz(questionTypeMode);
  };

  const handleMapClick = (state: USState) => {
    if (appMode === 'quiz') {
      handleQuizAnswer(state);
      return;
    }
    setSelectedState(state);
    setSelectedEmirate(null);
    setExploredStates((prev) => {
      const next = new Set(prev);
      next.add(state.id);
      return next;
    });
  };

  const handleNextState = () => {
    if (isUAEMap) {
      if (!selectedEmirate) {
        setSelectedEmirate(UAE_EMIRATES[0]);
        setExploredEmirates((prev) => new Set([...Array.from(prev), UAE_EMIRATES[0].id]));
        return;
      }
      const idx = UAE_EMIRATES.findIndex((em) => em.id === selectedEmirate.id);
      const nextIdx = (idx + 1) % UAE_EMIRATES.length;
      setSelectedEmirate(UAE_EMIRATES[nextIdx]);
      setExploredEmirates((prev) => new Set([...Array.from(prev), UAE_EMIRATES[nextIdx].id]));
      return;
    }
    if (!selectedState) {
      setSelectedState(OFFICIAL_50_STATES[0]);
      return;
    }
    const currentIndex = OFFICIAL_50_STATES.findIndex((s) => s.id === selectedState.id);
    const nextIndex = (currentIndex + 1) % OFFICIAL_50_STATES.length;
    handleMapClick(OFFICIAL_50_STATES[nextIndex]);
  };

  const handlePrevState = () => {
    if (isUAEMap) {
      if (!selectedEmirate) {
        setSelectedEmirate(UAE_EMIRATES[UAE_EMIRATES.length - 1]);
        setExploredEmirates((prev) => new Set([...Array.from(prev), UAE_EMIRATES[UAE_EMIRATES.length - 1].id]));
        return;
      }
      const idx = UAE_EMIRATES.findIndex((em) => em.id === selectedEmirate.id);
      const prevIdx = (idx - 1 + UAE_EMIRATES.length) % UAE_EMIRATES.length;
      setSelectedEmirate(UAE_EMIRATES[prevIdx]);
      setExploredEmirates((prev) => new Set([...Array.from(prev), UAE_EMIRATES[prevIdx].id]));
      return;
    }
    if (!selectedState) {
      setSelectedState(OFFICIAL_50_STATES[OFFICIAL_50_STATES.length - 1]);
      return;
    }
    const currentIndex = OFFICIAL_50_STATES.findIndex((s) => s.id === selectedState.id);
    const prevIndex = (currentIndex - 1 + OFFICIAL_50_STATES.length) % OFFICIAL_50_STATES.length;
    handleMapClick(OFFICIAL_50_STATES[prevIndex]);
  };

  const handlePickRandom = () => {
    if (isUAEMap) {
      const randomEmirate = UAE_EMIRATES[Math.floor(Math.random() * UAE_EMIRATES.length)];
      setSelectedEmirate(randomEmirate);
      setExploredEmirates((prev) => new Set([...Array.from(prev), randomEmirate.id]));
    } else {
      handleMapClick(OFFICIAL_50_STATES[Math.floor(Math.random() * OFFICIAL_50_STATES.length)]);
    }
  };

  const handleSelectStateByName = (name: string) => {
    const found = getStateByName(name);
    if (found) {
      if (mapView !== 'middle-east') {
        setMapView('middle-east');
      }
      handleMapClick(found);
    }
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchStates(searchQuery).slice(0, 8).map((s) => ({
      id: s.id,
      name: s.name,
      capital: s.capital,
    }));
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 font-sans antialiased selection:bg-rose-500 selection:text-white">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Mode Tabs */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="bg-slate-200/80 p-1 rounded-xl flex items-center shadow-inner">
            <button
              onClick={() => setAppMode('explore')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                appMode === 'explore'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-4 h-4 text-rose-500" />
              Explore Map
            </button>
            <button
              onClick={() => {
                setAppMode('quiz');
                setMapView('middle-east');
                setIsQuizStartModalOpen(true);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                appMode === 'quiz'
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Choose quiz mode"
            >
              <Target className="w-4 h-4" />
              Find the Country Quiz
            </button>
          </div>
        </div>

        {/* Main Header (in Explore mode) */}
        {appMode === 'explore' ? (
          <Header
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectStateByName={handleSelectStateByName}
            searchResults={searchResults}
          />
        ) : null}

        {/* Toolbar in Explore Mode */}
        {appMode === 'explore' && (
          <div className="flex flex-col gap-4 mb-4">
            {!isUAEMap && (
              <RegionFilter
                currentRegion={regionFilter}
                onSelectRegion={setRegionFilter}
              />
            )}

            <div className="flex flex-wrap items-center gap-2">
              {/* Map Toggle Button */}
              <button
                onClick={handleToggleMapView}
                className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-semibold rounded-lg shadow-sm transition-all ${
                  mapView === 'uae-emirates'
                    ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-slate-900/20'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
                title={mapView === 'uae-emirates' ? 'Switch to Middle East Map' : 'Switch to UAE Emirates Map'}
              >
                <Layers className="w-3.5 h-3.5 text-rose-500" />
                <span>{mapView === 'uae-emirates' ? 'Switch to Middle East Map' : 'UAE Emirates Map'}</span>
              </button>

              <button
                onClick={() => setShowUnexploredOnly((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-semibold rounded-lg shadow-sm transition-all ${
                  showUnexploredOnly
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-rose-500" />
                <span>
                  {showUnexploredOnly
                    ? `Hide Left to Explore (${unexploredCount})`
                    : `Show Left to Explore (${unexploredCount})`}
                </span>
              </button>

              <button
                onClick={() => setShowAllCapitals((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-semibold rounded-lg shadow-sm transition-all ${
                  showAllCapitals
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                {showAllCapitals ? 'Hide All Capital Pins' : 'Show All Capital Pins'}
              </button>

              <button
                onClick={() => setShowStatePanel((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-semibold rounded-lg shadow-sm transition-all ${
                  showStatePanel
                    ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    : 'bg-slate-900 text-white border-slate-900'
                }`}
                title={showStatePanel ? 'Hide information panel' : 'Show information panel'}
              >
                <Info className="w-3.5 h-3.5 text-rose-500" />
                {showStatePanel ? 'Hide Info Panel' : 'Show Info Panel'}
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-all"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-rose-500" />
                Browse All Countries ({OFFICIAL_50_STATES.length})
              </button>

              <button
                onClick={() => setIsCapitalsModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-all"
              >
                <Landmark className="w-3.5 h-3.5 text-rose-500" />
                Browse All Capitals ({OFFICIAL_50_STATES.length})
              </button>

              <button
                onClick={handlePickRandom}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-all"
              >
                <Shuffle className="w-3.5 h-3.5 text-rose-500" />
                {isUAEMap ? 'Pick Random Emirate' : 'Pick Random Country'}
              </button>
            </div>
          </div>
        )}

        {/* Toolbar in Quiz Mode */}
        {appMode === 'quiz' && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Mode:
              </span>
              <span className="text-xs font-bold text-slate-800 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-sm">
                {questionTypeMode === 'state-name'
                  ? 'Countries Only'
                  : questionTypeMode === 'capital'
                  ? 'Capitals Challenge'
                  : questionTypeMode === 'multiple-choice'
                  ? 'Identify the Country'
                  : 'Mixed Mode'}
              </span>
              {!showScorePanel && (
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-sm">
                  <span>Score: {quizScore}/{quizTotal}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-amber-600">🔥 {quizStreak}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => setShowScorePanel((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-semibold rounded-lg shadow-sm transition-all ${
                  showScorePanel
                    ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    : 'bg-slate-900 text-white border-slate-900'
                }`}
                title={showScorePanel ? 'Hide scoring panel' : 'Show scoring panel'}
              >
                <Trophy className="w-3.5 h-3.5 text-rose-500" />
                <span>{showScorePanel ? 'Hide Scoring Panel' : 'Show Scoring Panel'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Progress Bar Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
          <div className={isSidebarVisible ? 'lg:col-span-2' : 'lg:col-span-3'}>
            {appMode === 'explore' ? (
              <ExploreBottomProgressBar
                exploredCount={currentExploredCount}
                totalStates={currentTotalCount}
                label={isUAEMap ? 'Emirates Explored' : 'Countries Explored'}
              />
            ) : (
              <QuizBottomProgressBar
                solvedCount={quizSolvedStates.size}
                revealedCount={quizRevealedStates.size}
                totalStates={OFFICIAL_50_STATES.length}
              />
            )}
          </div>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className={isSidebarVisible ? 'lg:col-span-2' : 'lg:col-span-3'}>
            <div className="relative w-full max-w-5xl mx-auto">
              <USMap
                mapView={appMode === 'quiz' ? 'middle-east' : mapView}
                onToggleMapView={handleToggleMapView}
                selectedState={selectedState}
                onSelectState={handleMapClick}
                highlightedRegion={appMode === 'quiz' ? 'All' : regionFilter}
                exploredStates={exploredStates}
                exploredEmirates={exploredEmirates}
                showAllCapitals={appMode === 'explore' && showAllCapitals}
                showUnexploredOnly={appMode === 'explore' && showUnexploredOnly}
                isQuizMode={appMode === 'quiz'}
                disableMapSelection={appMode === 'quiz' && currentQuestion?.questionType === 'multiple-choice'}
                quizFeedback={quizFeedback}
                hintRegion={hintUsed && currentQuestion ? currentQuestion.targetState.region : null}
                correctStateIds={quizSolvedStates}
                revealedStateIds={quizRevealedStates}
                targetHighlightStateId={
                  appMode === 'quiz' && currentQuestion?.questionType === 'multiple-choice'
                    ? currentQuestion.targetState.id
                    : null
                }
                selectedEmirate={selectedEmirate}
                onSelectEmirate={(em) => {
                  setSelectedEmirate(em);
                  setExploredEmirates((prev) => new Set([...Array.from(prev), em.id]));
                }}
              />

              {appMode === 'quiz' && (
                <QuizQuestionOverlay
                  currentQuestion={currentQuestion}
                  hintUsed={hintUsed}
                  isComplete={isQuizComplete}
                />
              )}

              {appMode === 'quiz' && (
                <QuizToast
                  status={lastStatus}
                  targetStateName={currentQuestion?.targetState.name}
                  lastAnsweredState={lastAnsweredState}
                />
              )}
            </div>

            {/* Options button panel below map in Quiz Mode (Multiple Choice only) */}
            {appMode === 'quiz' && currentQuestion?.questionType === 'multiple-choice' && !isQuizComplete && (
              <QuizQuestionBanner
                currentQuestion={currentQuestion}
                hintUsed={hintUsed}
                isComplete={isQuizComplete}
                onSelectChoice={handleQuizAnswer}
                disabled={isRevealing || quizFeedback?.status === 'correct'}
                isRevealing={isRevealing}
              />
            )}
          </div>

          {isSidebarVisible && (
            <div className="lg:col-span-1">
              {appMode === 'explore' ? (
                <StateCard
                  state={selectedState}
                  onNextState={handleNextState}
                  onPrevState={handlePrevState}
                  isExplored={
                    selectedEmirate
                      ? exploredEmirates.has(selectedEmirate.id)
                      : selectedState
                      ? exploredStates.has(selectedState.id)
                      : false
                  }
                  onClose={() => {
                    setSelectedState(null);
                    setSelectedEmirate(null);
                  }}
                  selectedEmirate={selectedEmirate}
                  onSelectEmirate={(em) => {
                    setSelectedEmirate(em);
                    if (em) {
                      setExploredEmirates((prev) => new Set([...Array.from(prev), em.id]));
                    }
                  }}
                  mapView={mapView}
                  onToggleMapView={handleToggleMapView}
                  onOpenUAEMap={() => setMapView('uae-emirates')}
                />
              ) : (
                <QuizPanel
                  score={quizScore}
                  totalAnswered={quizTotal}
                  streak={quizStreak}
                  bestStreak={quizBestStreak}
                  hintUsed={hintUsed}
                  questionTypeMode={questionTypeMode}
                  currentQuestionType={currentQuestion?.questionType}
                  isComplete={isQuizComplete}
                  isRevealing={isRevealing}
                  onViewWinModal={() => setIsQuizWinModalOpen(true)}
                  onOpenModeModal={() => setIsQuizStartModalOpen(true)}
                  onOpenTiersModal={() => setIsQuizStartModalOpen(true)}
                  onUseHint={() => setHintUsed(true)}
                  onShowAnswer={handleShowAnswer}
                  onSkipQuestion={() => handleNextQuizQuestion()}
                  onRestartQuiz={handleRestartQuiz}
                  onClose={() => setShowScorePanel(false)}
                />
              )}
            </div>
          )}
        </div>

        {/* Modals */}
        <StatesModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectState={(state) => {
            if (mapView !== 'middle-east') {
              setMapView('middle-east');
            }
            handleMapClick(state);
            setIsModalOpen(false);
          }}
          exploredStates={exploredStates}
        />

        <CapitalsModal
          isOpen={isCapitalsModalOpen}
          onClose={() => setIsCapitalsModalOpen(false)}
          onSelectState={(state) => {
            if (mapView !== 'middle-east') {
              setMapView('middle-east');
            }
            handleMapClick(state);
            setIsCapitalsModalOpen(false);
          }}
          exploredStates={exploredStates}
        />

        <QuizStartModal
          isOpen={isQuizStartModalOpen}
          onClose={() => setIsQuizStartModalOpen(false)}
          onStart={handleStartQuiz}
          initialMode={questionTypeMode}
        />

        <QuizWinModal
          isOpen={isQuizWinModalOpen}
          score={quizScore}
          totalAnswered={quizTotal}
          bestStreak={quizBestStreak}
          mode={questionTypeMode}
          onPlayAgain={handleRestartQuiz}
          onReviewMap={() => setIsQuizWinModalOpen(false)}
          onOpenTiersModal={() => {
            setIsQuizWinModalOpen(false);
            setIsTiersModalOpen(true);
          }}
        />

        <PerformanceTiersModal
          isOpen={isTiersModalOpen}
          onClose={() => setIsTiersModalOpen(false)}
        />
      </div>
    </div>
  );
}

export default App;
