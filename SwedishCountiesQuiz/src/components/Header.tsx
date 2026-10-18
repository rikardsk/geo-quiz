import React from 'react';
import { Search, Compass, X, MapPin } from 'lucide-react';
import { SwedenCountyData } from '../data/countiesData';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectTeamByName: (name: string) => void;
  searchResults: SwedenCountyData[];
}

const SearchDropdown: React.FC<{
  results: SwedenCountyData[];
  onSelect: (name: string) => void;
}> = ({ results, onSelect }) => {
  if (results.length === 0) {
    return <div className="p-3 text-xs text-slate-400 text-center">Inga matchande svenska län eller städer hittades</div>;
  }

  return (
    <>
      {results.map((county) => (
        <button
          key={county.id}
          onClick={() => onSelect(county.name)}
          className="w-full px-4 py-2.5 text-left text-sm hover:bg-sky-50/60 flex items-center justify-between transition-colors border-b border-slate-100 last:border-0"
        >
          <div className="flex items-center gap-3">
            <img
              src={county.coatOfArms}
              alt=""
              className="w-6 h-7 object-contain flex-shrink-0"
              style={{ width: '24px', height: '28px', objectFit: 'contain' }}
            />
            <div>
              <span className="font-semibold text-slate-800">{county.name}</span>
              <div className="text-xs text-sky-700 font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-sky-600 inline" />
                Största stad: {county.largestCity}
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
              {county.letter}
            </span>
            <div className="text-[11px] text-slate-400 mt-0.5">{county.region}</div>
          </div>
        </button>
      ))}
    </>
  );
};

const HeaderTitle: React.FC = () => (
  <div className="pb-4 border-b border-slate-200">
    <div className="flex items-center gap-2 text-sky-600 font-semibold text-sm mb-1">
      <Compass className="w-4 h-4 animate-spin-slow" />
      <span>Interaktiv Sverigekarta & Geografi</span>
    </div>
    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
      Sveriges 21 Län & Största Städer
    </h1>
    <p className="text-sm text-slate-500 mt-1">
      Klicka på ett län eller dess största stad på kartan, eller sök nedan för att utforska Sveriges 21 län, residensstäder och centralorter.
    </p>
  </div>
);

const SearchInputBar: React.FC<{
  query: string;
  onChange: (val: string) => void;
}> = ({ query, onChange }) => (
  <div className="search-bar-wrapper">
    <Search className="search-icon" />
    <input
      type="text"
      placeholder="Sök län, största stad, residensstad eller landsdel (t.ex. Skåne, Sundsvall, Götaland, Malmö)..."
      value={query}
      onChange={(e) => onChange(e.target.value)}
      className="search-input"
    />
    {query.length > 0 && (
      <button
        type="button"
        onClick={() => onChange('')}
        className="search-clear-button"
        aria-label="Rensa sökning"
        title="Rensa sökning"
      >
        <X className="w-4 h-4" />
      </button>
    )}
  </div>
);

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onSelectTeamByName,
  searchResults,
}) => (
  <header className="w-full max-w-5xl mx-auto mb-6">
    <HeaderTitle />
    <div className="relative mt-4">
      <SearchInputBar query={searchQuery} onChange={onSearchChange} />
      {searchQuery.trim().length > 0 && (
        <div className="absolute z-30 left-0 right-0 mt-1.5 max-h-56 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl divide-y divide-slate-100">
          <SearchDropdown
            results={searchResults}
            onSelect={(name) => {
              onSelectTeamByName(name);
              onSearchChange('');
            }}
          />
        </div>
      )}
    </div>
  </header>
);
