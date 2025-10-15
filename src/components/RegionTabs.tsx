'use client';

import { useChecklist } from '@/contexts/ChecklistContext';
import { SpoilerLogUpload } from './SpoilerLogUpload';
import { sortRegions } from '@/utils/regionOrder';
import { useEffect, useRef } from 'react';

export function RegionTabs() {
  const { checklist, selectedRegion, setSelectedRegion } = useChecklist();
  const allRegions = Object.keys(checklist);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Sort regions by the defined order
  const sortedRegions = sortRegions(allRegions);

  // Count unchecked available checks for each region
  const getAvailableCount = (region: string) => {
    const rooms = checklist[region];
    let count = 0;
    Object.values(rooms).forEach(room => {
      Object.values(room).forEach(check => {
        if (check.available && !check.checked) count++;
      });
    });
    return count;
  };

  // Scroll selected tab into view
  useEffect(() => {
    if (selectedRegion && tabRefs.current[selectedRegion]) {
      tabRefs.current[selectedRegion]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [selectedRegion]);

  return (
    <div className="sticky top-0 z-10 bg-white flex flex-col gap-2 p-4 border-b">
      {/* Top row: Settings Icon and Upload Button */}
      <div className="flex items-center justify-between">
        <button className="p-2 hover:bg-gray-100 rounded">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <SpoilerLogUpload />
      </div>

      {/* Region Tabs - Scrollable */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        {sortedRegions.map((region) => {
          const availableCount = getAvailableCount(region);
          return (
            <button
              key={region}
              ref={(el) => { tabRefs.current[region] = el; }}
              onClick={() => setSelectedRegion(region)}
              className={`px-4 py-2 border-2 border-black font-semibold whitespace-nowrap flex-shrink-0 ${
                selectedRegion === region
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {region} ({availableCount})
            </button>
          );
        })}
      </div>
    </div>
  );
}
