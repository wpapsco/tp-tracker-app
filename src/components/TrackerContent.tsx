'use client';

import { useChecklist } from '@/contexts/ChecklistContext';
import { RegionTabs } from '@/components/RegionTabs';
import { RoomCard } from '@/components/RoomCard';
import { useGamepadControls } from '@/hooks/useGamepadControls';

export function TrackerContent() {
  const { checklist, selectedRegion } = useChecklist();
  const { selectedCheck } = useGamepadControls();
  const currentRegionData = selectedRegion ? checklist[selectedRegion] : {};

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
        {/* Region Tabs with Settings */}
        <RegionTabs />

        {/* Checklist Content */}
        <div className="p-6">
          {currentRegionData && Object.keys(currentRegionData).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="text-center text-gray-500 py-8">
              No checks available in this region
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
