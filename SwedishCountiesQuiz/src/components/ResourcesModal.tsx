import React, { useState, useEffect, useMemo } from 'react';
import {
  CountyResource,
  COUNTIES_RESOURCES,
  ResourceCategory,
  RESOURCE_CATEGORIES,
  CATEGORY_BADGES,
} from '../data/countiesResourcesData';
import { X, Search, ExternalLink, Globe } from 'lucide-react';

export interface ResourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
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

const ResourcesModalHeader: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
        <Globe className="w-4 h-4" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-900 leading-tight">Sveriges Län Resurser & Länkar</h2>
        <p className="text-xs text-slate-500">Officiella myndigheter, SCB-statistik, kartdata och geografiska källor</p>
      </div>
    </div>
    <button
      onClick={onClose}
      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
      aria-label="Stäng modalfönster"
    >
      <X className="w-5 h-5" />
    </button>
  </div>
);

const CategoryPills: React.FC<{
  currentCategory: ResourceCategory;
  onSelectCategory: (cat: ResourceCategory) => void;
}> = ({ currentCategory, onSelectCategory }) => (
  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
    {RESOURCE_CATEGORIES.map((cat) => (
      <button
        key={cat}
        onClick={() => onSelectCategory(cat)}
        className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
          currentCategory === cat
            ? 'bg-slate-900 text-white shadow-sm'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
      >
        {cat}
      </button>
    ))}
  </div>
);

const SearchBar: React.FC<{
  search: string;
  onSearchChange: (val: string) => void;
}> = ({ search, onSearchChange }) => (
  <div className="search-bar-wrapper mb-3.5">
    <Search className="search-icon" />
    <input
      type="text"
      placeholder="Sök resurser efter namn eller nyckelord..."
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
      className="search-input"
    />
    {search && (
      <button
        onClick={() => onSearchChange('')}
        className="search-clear-button"
        aria-label="Rensa sökning"
      >
        <X className="w-4 h-4" />
      </button>
    )}
  </div>
);

const ResourceCard: React.FC<{ item: CountyResource }> = ({ item }) => {
  const badgeClass = CATEGORY_BADGES[item.category] ?? 'bg-slate-100 text-slate-700';

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="p-4 rounded-2xl border border-slate-200/90 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all flex flex-col justify-between group shadow-xs"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeClass}`}>
            {item.category}
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" />
        </div>
        <h4 className="font-bold text-sm text-slate-900 group-hover:text-sky-600 transition-colors">
          {item.name}
        </h4>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.description}</p>
      </div>
      <span className="text-[11px] font-semibold text-sky-600 mt-3 flex items-center gap-1 group-hover:underline">
        Öppna länk →
      </span>
    </a>
  );
};

export const ResourcesModal: React.FC<ResourcesModalProps> = ({ isOpen, onClose }) => {
  useEscapeKey(isOpen, onClose);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ResourceCategory>('All');

  const filteredResources = useMemo(() => {
    return COUNTIES_RESOURCES.filter((res) => {
      const matchCat = category === 'All' || res.category === category;
      const matchSearch =
        !search.trim() ||
        res.name.toLowerCase().includes(search.toLowerCase()) ||
        res.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, category]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 pb-3">
          <ResourcesModalHeader onClose={onClose} />
        </div>
        <div className="px-6 pb-3">
          <SearchBar search={search} onSearchChange={setSearch} />
          <CategoryPills currentCategory={category} onSelectCategory={setCategory} />
        </div>
        <div className="p-6 pt-2 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 custom-scrollbar">
          {filteredResources.map((res) => (
            <ResourceCard key={res.id} item={res} />
          ))}
          {filteredResources.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 text-sm">
              Inga resurser matchade din sökning
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
