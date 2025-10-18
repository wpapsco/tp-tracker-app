'use client';

import { useChecklist } from '@/contexts/ChecklistContext';
import { useTheme } from '@/contexts/ThemeContext';
import { SpoilerLogUpload } from './SpoilerLogUpload';
import { sortRegions } from '@/utils/regionOrder';
import { useEffect, useRef } from 'react';
import type { CheckFilter } from '@/logic/RandoLogic';


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
]

export function RegionTabs() {
  const { checklist, selectedRegion, setSelectedRegion, filter, setFilter } = useChecklist();
  const { theme, toggleTheme } = useTheme();
  const allRegions = Object.keys(checklist);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const hasData = allRegions.length > 0;

  // Count unchecked available checks for each region
  const getAvailableCount = (region: string) => {
    const rooms = checklist[region];
    if (!rooms) return 0;
    let count = 0;
    Object.values(rooms).forEach(room => {
      Object.values(room).forEach(check => {
        if (check.available && !check.checked) count++;
      });
    });
    return count;
  }

  // Only set selected region when we have data
  useEffect(() => {
      // setSelectedRegion(orderedNames.find(name => allRegions.includes(name)) || allRegions[0]);
    setSelectedRegion(orderedNames[0])
  }, [])

  // Scroll selected tab into view
  useEffect(() => {
    if (selectedRegion && tabRefs.current[selectedRegion]) {
      // Use requestAnimationFrame to ensure DOM has updated before scrolling
      requestAnimationFrame(() => {
        tabRefs.current[selectedRegion]?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      });
    }
  }, [selectedRegion, checklist, filter.showOnlyAvailable]);

  type ToggleElement = {
      emoji: string,
      title: string,
      toggleName: keyof CheckFilter
  }

  const toggleButtons: ToggleElement[] = [
      {
          emoji: "✓",
          title: "Show Only Available Checks",
          toggleName: "showOnlyAvailable"
      },
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
    <div className="card-header">
      {/* Top row: Settings Icon and Upload Button */}
      <div className="header-row">
        {hasData ? (
          <div className="header-controls">
            <div className="filter-buttons-group">
              {toggleButtons.map(e =>
                <button
                  key={e.toggleName}
                  className={`btn-icon ${filter[e.toggleName] ? 'btn-icon-active' : 'btn-icon-inactive'}`}
                  title={e.title}
                  onClick={() => setFilter({...filter, [e.toggleName]: !filter[e.toggleName] })}>
                  {e.emoji}
                </button>
              )}
            </div>
            <div className="poe-filter-group">
              <span className="poe-filter-label">👻 Poes:</span>
              <select
                value={filter.showPoes}
                onChange={(e) => setFilter({...filter, showPoes: e.target.value as "Vanilla" | "Dungeons" | "Overworld" | "All"})}
                className="dropdown-select"
              >
                <option value="All">All</option>
                <option value="Dungeons">Dungeons</option>
                <option value="Overworld">Overworld</option>
                <option value="Vanilla">Vanilla (None)</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="no-data-message">Please upload a spoiler log to begin</div>
        )}
        <div className="header-actions">
          <button
            onClick={toggleTheme}
            className="btn-icon"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <SpoilerLogUpload />
        </div>
      </div>

      {/* Region Tabs - Only show when data is loaded */}
      {hasData && (
        <div className="region-tabs-container">
          {orderedNames
            .filter(region => allRegions.includes(region))
            .filter(region => {
              // If showOnlyAvailable is enabled, hide tabs with no available checks
              // BUT always keep the currently selected region visible
              if (filter.showOnlyAvailable) {
                // Always show the currently selected region
                if (region === selectedRegion) return true;

                const availableCount = getAvailableCount(region);
                return availableCount > 0;
              }
              return true;
            })
            .map((region) => {
              const availableCount = getAvailableCount(region);
              return (
                <button
                  key={region}
                  ref={(el) => { tabRefs.current[region] = el; }}
                  onClick={() => setSelectedRegion(region)}
                  className={`region-tab ${selectedRegion === region ? 'region-tab-active' : ''}`}
                >
                  {region} ({availableCount})
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}
