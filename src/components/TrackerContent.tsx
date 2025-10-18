'use client';

import { useChecklist } from '@/contexts/ChecklistContext';
import { RegionTabs } from '@/components/RegionTabs';
import { RoomCard } from '@/components/RoomCard';
import { useGamepadControls } from '@/hooks/useGamepadControls';
import { GoModeIndicator } from '@/components/GoModeIndicator';

export function TrackerContent() {
  const { checklist, selectedRegion, isGoMode } = useChecklist();
  const { selectedCheck } = useGamepadControls();
  const currentRegionData = selectedRegion ? checklist[selectedRegion] : {};
  const hasData = Object.keys(checklist).length > 0;

  return (
    <>
      <div className="app-container">
        <div className="card">
          {/* Region Tabs with Settings */}
          <RegionTabs />

          {/* Checklist Content */}
          <div className="card-content">
            {!hasData ? (
              <div className="welcome-message">
                <p className="welcome-title">Welcome to the Twilight Princess Randomizer Tracker</p>
                <p>Upload a spoiler log file to get started</p>
              </div>
            ) : currentRegionData && Object.keys(currentRegionData).length > 0 ? (
              <div className="checklist-grid">
                {Object.entries(currentRegionData)
                  .filter(([roomName, checks]) => Object.keys(checks).length > 0)
                  .map(([roomName, checks]) => (
                    <RoomCard
                      key={roomName}
                      roomName={roomName}
                      checks={checks}
                      selectedCheckName={selectedCheck?.checkName}
                    />
                  ))}
              </div>
            ) : (
              <div className="empty-message">
                No checks available in this region
              </div>
            )}
          </div>
        </div>
      </div>

      {/* GO MODE Indicator - Fixed to viewport */}
      <GoModeIndicator isGoMode={isGoMode} />
    </>
  );
}
