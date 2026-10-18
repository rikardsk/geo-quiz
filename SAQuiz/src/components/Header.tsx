import React from 'react';
import { Search, Compass, X } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectStateByName: (name: string) => void;
  searchResults: Array<{ id: string; name: string; capital: string }>;
}

const SearchDropdown: React.FC<{
  results: Array<{ id: string; name: string; capital: string }>;
  onSelect: (name: string) => void;
}> = ({ results, onSelect }) => {
  if (results.length === 0) {
    return <div className="p-3 text-xs text-slate-400 text-center">No matching countries found</div>;
  }
  return (
    <>
      {results.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.name)}
          className="w-full px-4 py-2 text-left text-sm hover:bg-rose-50/60 flex items-center justify-between transition-colors"
        >
          <span className="font-semibold text-slate-800">{item.name}</span>
          <span className="text-xs text-slate-500">Capital: {item.capital}</span>
        </button>
      ))}
    </>
  );
};

const HeaderTitle: React.FC = () => (
  <div className="pb-3 border-b border-slate-200">
    <div className="flex items-center gap-1.5 text-rose-600 font-semibold text-xs sm:text-sm mb-0.5">
      <Compass className="w-4 h-4 animate-spin-slow" />
      <span>Interactive South America Geography</span>
    </div>
    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
      South American Countries & Capitals Explorer
    </h1>
    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
      Click any country on the map or search below to reveal its capital, region, and facts.
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
      placeholder="Search by country name, capital, or code (e.g. Brazil, Buenos Aires, AR)..."
      value={query}
      onChange={(e) => onChange(e.target.value)}
      className="search-input"
    />
    {query.length > 0 && (
      <button
        type="button"
        onClick={() => onChange('')}
        className="search-clear-button"
        aria-label="Clear search"
        title="Clear search"
      >
        <X className="w-4 h-4" />
      </button>
    )}
  </div>
);

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onSelectStateByName,
  searchResults,
}) => (
  <header className="w-full max-w-5xl mx-auto mb-4">
    <HeaderTitle />
    <div className="relative mt-4">
      <SearchInputBar query={searchQuery} onChange={onSearchChange} />
      {searchQuery.trim().length > 0 && (
        <div className="absolute z-30 left-0 right-0 mt-1.5 max-h-56 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl divide-y divide-slate-100">
          <SearchDropdown
            results={searchResults}
            onSelect={(name) => {
              onSelectStateByName(name);
              onSearchChange('');
            }}
          />
        </div>
      )}
    </div>
  </header>
);
