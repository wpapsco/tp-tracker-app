'use client';

import { useChecklist } from '@/contexts/ChecklistContext';
import { SpoilerLogUpload } from './SpoilerLogUpload';
import { sortRegions } from '@/utils/regionOrder';
import { useEffect, useRef, useState } from 'react';
import {CheckFilter} from '@/logic/RandoLogic';


export const orderedNames = [
    "Ordona Province",
    "Ordon Village",
    "Faron Woods",
    "Kakariko Village",
    "Death Mountain",
    "Lake Hylia",
    "Zoras Domain",
    "Gerudo Desert",
    "Snowpeak Province",
    "Sacred Grove",
    "Hidden Village",
    "Hyrule Field - Faron Province",
    "Hyrule Field - Eldin Province",
    "Hyrule Field - Lanayru Province",
    "Castle Town",
    "Forest Temple",
    "Goron Mines",
    "Lakebed Temple",
    "Arbiters Grounds",
    "Snowpeak Ruins",
    "Temple of Time",
    "City in The Sky",
    "Palace of Twilight",
    "Hyrule Castle",
    "Ganondorf",
]

export function RegionTabs() {
  const { checklist, selectedRegion, setSelectedRegion } = useChecklist();
  const allRegions = Object.keys(checklist);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  console.log(allRegions);

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

  const defaultFilter: CheckFilter = {
    showPoes: "All",
    showGoldenBugs: true,
    showSkyCharacters: true,
    showNpcItems: true,
    showShopItems: true,
    showHiddenSkills: true,
    showExcludedItems: true
  }

  const [filter, setFilter] = useState(defaultFilter)

  useEffect(() => {
    setSelectedRegion(orderedNames[0]);
  }, [])

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

  type ToggleElement = {
      emoji: string,
      title: string,
      toggleName: keyof CheckFilter
  }

  const toggleButtons: ToggleElement[] = [
      {
          emoji: "🐛",
          title: "Show Golden Bugs",
          toggleName: "showGoldenBugs"
      },
      {
          emoji: "🅰️",
          title: "Show Sky Characters",
          toggleName: "showSkyCharacters"
      },
      {
          emoji: "👨",
          title: "Show NPC Items",
          toggleName: "showNpcItems"
      },
      {
          emoji: "💰",
          title: "Show Shop Items",
          toggleName: "showShopItems"
      },
      {
          emoji: "🐺",
          title: "Show Hidden Skills",
          toggleName: "showHiddenSkills"
      },
      {
          emoji: "🚫",
          title: "Show Excluded Checks",
          toggleName: "showExcludedItems"
      },
  ]

  return (
    <div className="sticky top-0 z-10 bg-white flex flex-col gap-2 p-4 border-b">
      {/* Top row: Settings Icon and Upload Button */}
      <div className="flex items-center justify-between">
        <div>
            {toggleButtons.map(e => 
            <button 
                className={"p-2 " + (filter[e.toggleName] ? "bg-indigo-500" : "bg-indigo-100") + " hover:bg-gray-100 rounded" }
                title={e.title} 
                onClick={() => setFilter({...filter, [e.toggleName]: !filter[e.toggleName] })}>
                {e.emoji}
            </button>
            )}
        </div>
        <SpoilerLogUpload />
      </div>

      {/* Region Tabs - Scrollable */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        {orderedNames.map((region) => {
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
