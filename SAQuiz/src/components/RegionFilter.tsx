import React from 'react';
import { REGION_COLORS } from '../data/statesData';

interface RegionFilterProps {
  currentRegion: string;
  onSelectRegion: (region: string) => void;
}

const REGIONS = ['All', 'Western', 'Northern', 'Southern', 'Eastern'];

export const RegionFilter: React.FC<RegionFilterProps> = ({
  currentRegion,
  onSelectRegion,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-xs font-semibold text-slate-500 mr-1">Filter Region:</span>
      {REGIONS.map((region) => {
        const isActive = currentRegion === region;
        const colorInfo = REGION_COLORS[region];

        return (
          <button
            key={region}
            onClick={() => onSelectRegion(region)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
              isActive
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100/70'
            }`}
          >
            {colorInfo && (
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: colorInfo.bg }}
              />
            )}
            {region}
          </button>
        );
      })}
    </div>
  );
};
