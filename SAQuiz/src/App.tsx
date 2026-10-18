import { useState, useMemo, useEffect, useRef } from 'react';
import { USState } from './data/statesData';
import { USMap } from './components/USMap';
import { StateCard } from './components/StateCard';
import { Header } from './components/Header';
import { RegionFilter } from './components/RegionFilter';
import { StatesModal } from './components/StatesModal';
import { CapitalsModal } from './components/CapitalsModal';
import { QuizPanel } from './components/QuizPanel';
import { QuizStartModal } from './components/QuizStartModal';
import { QuizQuestionBanner } from './components/QuizQuestionBanner';
import { QuizOptionsPanel } from './components/QuizOptionsPanel';
import { QuizToast } from './components/QuizToast';
import { QuizWinModal } from './components/QuizWinModal';
import { QuizBottomProgressBar } from './components/QuizBottomProgressBar';
import { ExploreBottomProgressBar } from './components/ExploreBottomProgressBar';
import { PerformanceTiersModal } from './components/PerformanceTiersModal';
import {
  generateQuestion,
  evaluateAnswer,
  calculateNewStreak,
  calculateQuizRank,
  QuizQuestion,
  QuestionType,
  OFFICIAL_50_STATES,
} from './utils/quizUtils';
import { searchStates, getStateByName } from './utils/stateUtils';
import { Shuffle, MapPin, LayoutGrid, Compass, Target, Trophy, Info, Landmark } from 'lucide-react';

export function App() {
  const [appMode, setAppMode] = useState<'explore' | 'quiz'>('explore');
  const [selectedState, setSelectedState] = useState<USState | null>(null);
  const [exploredStates, setExploredStates] = useState<Set<string>>(new Set());
  const [regionFilter, setRegionFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAllCapitals, setShowAllCapitals] = useState<boolean>(false);
  const [showUnexploredOnly, setShowUnexploredOnly] = useState<boolean>(false);
  const [showScorePanel, setShowScorePanel] = useState<boolean>(true);
  const [showStatePanel, setShowStatePanel] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCapitalsModalOpen, setIsCapitalsModalOpen] = useState<boolean>(false);
  const [isQuizStartModalOpen, setIsQuizStartModalOpen] = useState<boolean>(false);
  const [isQuizWinModalOpen, setIsQuizWinModalOpen] = useState<boolean>(false);
  const [isTiersModalOpen, setIsTiersModalOpen] = useState<boolean>(false);

  // Quiz State (States mode by default)
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

  const isQuizComplete = (quizSolvedStates.size + quizRevealedStates.size) >= OFFICIAL_50_STATES.length;
  const currentRank = useMemo(() => calculateQuizRank(quizScore, quizTotal), [quizScore, quizTotal]);
  const unexploredCount = Math.max(0, OFFICIAL_50_STATES.length - exploredStates.size);
  const isMultipleChoiceActive =
    appMode === 'quiz' &&
    currentQuestion?.questionType === 'multiple-choice' &&
    !isQuizComplete;
  const isSidebarVisible =
    appMode === 'explore'
      ? showStatePanel
      : showScorePanel || isMultipleChoiceActive;

  useEffect(() => {
    if (appMode === 'quiz' && !currentQuestion) {
      setCurrentQuestion(generateQuestion(questionTypeMode));
    }
  }, [appMode, currentQuestion, questionTypeMode]);

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
    setQuizTotal((prev) => prev + 1);
    setQuizStreak(0);
    setLastStatus('revealed');
    setQuizFeedback({ stateId: targetId, status: 'revealed' });

    const nextRevealed = new Set(quizRevealedStates).add(targetId);
    setQuizRevealedStates(nextRevealed);

    if (quizSolvedStates.size + nextRevealed.size >= OFFICIAL_50_STATES.length) {
      revealTimerRef.current = setTimeout(() => {
        setIsRevealing(false);
        setIsQuizWinModalOpen(true);
      }, 1600);
      return;
    }

    revealTimerRef.current = setTimeout(() => {
      handleNextQuizQuestion(quizSolvedStates, nextRevealed);
    }, 2500);
  };

  const handleCorrectAnswer = (targetId: string) => {
    setQuizScore((prev) => prev + 1);
    setQuizTotal((prev) => prev + 1);
    const nextStreak = calculateNewStreak(quizStreak, true);
    setQuizStreak(nextStreak);
    setQuizBestStreak((prev) => Math.max(prev, nextStreak));
    setLastStatus('correct');
    setQuizFeedback({ stateId: targetId, status: 'correct' });
    const nextSolved = new Set(quizSolvedStates).add(targetId);
    setQuizSolvedStates(nextSolved);
    if (nextSolved.size + quizRevealedStates.size >= OFFICIAL_50_STATES.length) {
      setTimeout(() => setIsQuizWinModalOpen(true), 1100);
      return;
    }
    setTimeout(() => handleNextQuizQuestion(nextSolved, quizRevealedStates), 1300);
  };

  const handleIncorrectAnswer = (clickedState: USState) => {
    setQuizTotal((prev) => prev + 1);
    setQuizStreak(0);
    setLastStatus('incorrect');
    setQuizFeedback({ stateId: clickedState.id, status: 'incorrect' });
    incorrectTimerRef.current = setTimeout(() => {
      setQuizFeedback(null);
      setLastStatus((prev) => (prev === 'incorrect' ? 'idle' : prev));
    }, 1500);
  };

  const handleQuizAnswer = (clickedState: USState) => {
    if (!currentQuestion || quizFeedback?.status === 'correct' || isRevealing) return;
    if (incorrectTimerRef.current) clearTimeout(incorrectTimerRef.current);
    setLastAnsweredState(clickedState);
    if (evaluateAnswer(clickedState.id, currentQuestion.targetState.id)) {
      handleCorrectAnswer(currentQuestion.targetState.id);
      return;
    }
    handleIncorrectAnswer(clickedState);
  };

  const handleStartQuiz = (mode: 'mixed' | QuestionType) => {
    if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    if (incorrectTimerRef.current) clearTimeout(incorrectTimerRef.current);
    setQuestionTypeMode(mode);
    setQuizScore(0);
    setQuizTotal(0);
    setQuizStreak(0);
    setLastStatus('idle');
    setLastAnsweredState(null);
    setQuizFeedback(null);
    setHintUsed(false);
    setIsRevealing(false);
    setQuizSolvedStates(new Set());
    setQuizRevealedStates(new Set());
    setIsQuizWinModalOpen(false);
    setCurrentQuestion(generateQuestion(mode, []));
    setAppMode('quiz');
    setIsQuizStartModalOpen(false);
  };

  const handleMapClick = (state: USState) => {
    if (appMode === 'quiz') {
      if (isQuizComplete || isRevealing || currentQuestion?.questionType === 'multiple-choice') return;
      handleQuizAnswer(state);
      return;
    }
    setSelectedState(state);
    setExploredStates((prev) => new Set(prev).add(state.id));
  };

  const handleRestartQuiz = () => {
    if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    if (incorrectTimerRef.current) clearTimeout(incorrectTimerRef.current);
    setQuizScore(0);
    setQuizTotal(0);
    setQuizStreak(0);
    setQuizSolvedStates(new Set());
    setQuizRevealedStates(new Set());
    setIsRevealing(false);
    setIsQuizWinModalOpen(false);
    setLastStatus('idle');
    setLastAnsweredState(null);
    setQuizFeedback(null);
    setHintUsed(false);
    setCurrentQuestion(generateQuestion(questionTypeMode, []));
  };

  const handleNextState = () => {
    if (!selectedState) {
      setSelectedState(OFFICIAL_50_STATES[0]);
      return;
    }
    const idx = OFFICIAL_50_STATES.findIndex((s) => s.id === selectedState.id);
    setSelectedState(OFFICIAL_50_STATES[(idx + 1) % OFFICIAL_50_STATES.length]);
  };

  const handlePrevState = () => {
    if (!selectedState) {
      setSelectedState(OFFICIAL_50_STATES[OFFICIAL_50_STATES.length - 1]);
      return;
    }
    const idx = OFFICIAL_50_STATES.findIndex((s) => s.id === selectedState.id);
    setSelectedState(OFFICIAL_50_STATES[(idx - 1 + OFFICIAL_50_STATES.length) % OFFICIAL_50_STATES.length]);
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchStates(searchQuery).slice(0, 8);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 py-4 sm:py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Mode Tabs */}
        <div className="flex items-center justify-center gap-2 mb-4">
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
              onClick={() => setIsQuizStartModalOpen(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                appMode === 'quiz'
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Choose quiz mode"
            >
              <Target className="w-4 h-4" />
              Geography Quiz
            </button>
          </div>
        </div>

        {appMode === 'explore' ? (
          <Header
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectStateByName={(name) => {
              const found = getStateByName(name);
              if (found) handleMapClick(found);
            }}
            searchResults={searchResults}
          />
        ) : null}

        {/* Toolbar (Explore Mode only) */}
        {appMode === 'explore' && (
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-4">
            <RegionFilter
              currentRegion={regionFilter}
              onSelectRegion={setRegionFilter}
            />

            <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
              <button
                onClick={() => setShowUnexploredOnly((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-semibold rounded-lg shadow-sm transition-all ${
                  showUnexploredOnly
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-rose-500" />
                {showUnexploredOnly
                  ? `Hide Countries Left to Explore (${unexploredCount})`
                  : `Show Countries Left to Explore (${unexploredCount})`}
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
                title={showStatePanel ? 'Hide country information panel' : 'Show country information panel'}
              >
                <Info className="w-3.5 h-3.5 text-rose-500" />
                {showStatePanel ? 'Hide Info Panel' : 'Show Info Panel'}
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-all"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-rose-500" />
                {`Browse All Member States (${OFFICIAL_50_STATES.length})`}
              </button>

              <button
                onClick={() => setIsCapitalsModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-all"
              >
                <Landmark className="w-3.5 h-3.5 text-rose-500" />
                {`Browse All Capitals (${OFFICIAL_50_STATES.length})`}
              </button>

              <button
                onClick={() => handleMapClick(OFFICIAL_50_STATES[Math.floor(Math.random() * OFFICIAL_50_STATES.length)])}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-all"
              >
                <Shuffle className="w-3.5 h-3.5 text-rose-500" />
                Pick Random Country
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

        {/* Layout */}
        {appMode === 'explore' ? (
          <div className="flex flex-col gap-4">
            {/* Progress Bar aligned to map in Explore Mode */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={isSidebarVisible ? 'lg:col-span-2' : 'lg:col-span-3'}>
                <div className="w-full mx-auto progress-bar-wrapper" style={{ maxWidth: '580px' }}>
                  <ExploreBottomProgressBar
                    exploredCount={exploredStates.size}
                    totalStates={OFFICIAL_50_STATES.length}
                    className="mb-0"
                  />
                </div>
              </div>
            </div>

            {/* Map and Info Panel side-by-side, perfectly aligned at the top */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className={isSidebarVisible ? 'lg:col-span-2' : 'lg:col-span-3'}>
                <div className="relative">
                  <USMap
                    selectedState={selectedState}
                    onSelectState={handleMapClick}
                    highlightedRegion={regionFilter}
                    exploredStates={exploredStates}
                    showAllCapitals={showAllCapitals}
                    showUnexploredOnly={showUnexploredOnly}
                    isQuizMode={false}
                    quizFeedback={null}
                    hintRegion={null}
                    correctStateIds={quizSolvedStates}
                    revealedStateIds={quizRevealedStates}
                    targetHighlightStateId={null}
                  />
                </div>
              </div>

              {isSidebarVisible && (
                <div className="lg:col-span-1">
                  <StateCard
                    state={selectedState}
                    onNextState={handleNextState}
                    onPrevState={handlePrevState}
                    isExplored={selectedState ? exploredStates.has(selectedState.id) : false}
                    onClose={() => setSelectedState(null)}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Progress Bar aligned to map width in Quiz Mode */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={isSidebarVisible ? 'lg:col-span-2' : 'lg:col-span-3'}>
                <div className="w-full mx-auto progress-bar-wrapper" style={{ maxWidth: '580px' }}>
                  <QuizBottomProgressBar
                    solvedCount={quizSolvedStates.size}
                    revealedCount={quizRevealedStates.size}
                    totalStates={OFFICIAL_50_STATES.length}
                    className="mb-0"
                  />
                </div>
              </div>
            </div>

            {/* Map and Scoring Panel side-by-side, perfectly aligned at the top */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className={isSidebarVisible ? 'lg:col-span-2' : 'lg:col-span-3'}>
                <div className="relative">
                  <USMap
                    selectedState={selectedState}
                    onSelectState={handleMapClick}
                    highlightedRegion="All"
                    exploredStates={exploredStates}
                    showAllCapitals={false}
                    showUnexploredOnly={false}
                    isQuizMode={true}
                    disableMapSelection={currentQuestion?.questionType === 'multiple-choice'}
                    quizFeedback={quizFeedback}
                    hintRegion={hintUsed && currentQuestion ? currentQuestion.targetState.region : null}
                    correctStateIds={quizSolvedStates}
                    revealedStateIds={quizRevealedStates}
                    targetHighlightStateId={
                      currentQuestion?.questionType === 'multiple-choice'
                        ? currentQuestion.targetState.id
                        : null
                    }
                  />

                  {/* Question Banner Overlay on top of the map */}
                  <QuizQuestionBanner
                    currentQuestion={currentQuestion}
                    hintUsed={hintUsed}
                    isComplete={isQuizComplete}
                    disabled={isRevealing || quizFeedback?.status === 'correct'}
                    isRevealing={isRevealing}
                    showChoices={false}
                    overlay
                  />

                  <QuizToast
                    status={lastStatus}
                    targetStateName={currentQuestion?.targetState.name}
                    lastAnsweredState={lastAnsweredState}
                  />
                </div>
              </div>

              {isSidebarVisible && (
                <div className="lg:col-span-1 flex flex-col gap-4">
                  {showScorePanel && (
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
                      onOpenTiersModal={() => setIsTiersModalOpen(true)}
                      onUseHint={() => setHintUsed(true)}
                      onShowAnswer={handleShowAnswer}
                      onSkipQuestion={() => handleNextQuizQuestion()}
                      onRestartQuiz={handleRestartQuiz}
                      onClose={() => setShowScorePanel(false)}
                    />
                  )}

                  {/* Options Buttons sitting below the scoring panel in Quiz Mode */}
                  {currentQuestion?.questionType === 'multiple-choice' &&
                    !isQuizComplete &&
                    currentQuestion.choices && (
                      <QuizOptionsPanel
                        choices={currentQuestion.choices}
                        targetStateId={currentQuestion.targetState.id}
                        isRevealing={isRevealing}
                        onSelect={handleQuizAnswer}
                        disabled={isRevealing || quizFeedback?.status === 'correct'}
                      />
                    )}
                </div>
              )}
            </div>
          </div>
        )}

        <StatesModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectState={handleMapClick}
          selectedStateId={selectedState?.id}
          exploredStates={exploredStates}
        />

        <CapitalsModal
          isOpen={isCapitalsModalOpen}
          onClose={() => setIsCapitalsModalOpen(false)}
          onSelectState={handleMapClick}
          selectedStateId={selectedState?.id}
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
          onOpenTiersModal={() => setIsTiersModalOpen(true)}
        />

        <PerformanceTiersModal
          isOpen={isTiersModalOpen}
          onClose={() => setIsTiersModalOpen(false)}
          currentGrade={currentRank.grade}
        />
      </div>
    </div>
  );
}

export default App;
