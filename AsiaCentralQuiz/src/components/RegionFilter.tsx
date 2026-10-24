import React from 'react';
import { REGION_COLORS } from '../data/statesData';

interface RegionFilterProps {
  currentRegion: string;
  onSelectRegion: (region: string) => void;
}

const REGIONS = ['All', 'Central Asia', 'South Asia'];

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
          ? `px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border shadow-sm ${
              isActive
                ? 'ring-2 ring-slate-900/20 ring-offset-1 shadow-md'
                : 'hover:brightness-95'
            }`
          : `px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
              isActive
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-slate-900/20 ring-offset-1'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100/70'
            }`;

        return (
          <button
            key={region}
            onClick={() => onSelectRegion(region)}
            style={style}
            className={className}
          >
            {colorInfo && (
              <span
                className={`w-2.5 h-2.5 rounded-full inline-block transition-transform ${
                  isActive ? 'scale-110 ring-1 ring-slate-900/20' : ''
                }`}
                style={{ backgroundColor: isActive ? colorInfo.text : colorInfo.bg }}
              />
            )}
            {region}
          </button>
        );
      })}
    </div>
  );
};
