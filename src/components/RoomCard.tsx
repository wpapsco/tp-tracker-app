'use client';

import { CheckItem } from './CheckItem';
import { useChecklist } from '@/contexts/ChecklistContext';
import { Item } from '@/logic';

interface CheckData {
  available: boolean;
  checked: boolean;
  category: string[];
}

interface RoomCardProps {
  roomName: string;
  checks: { [checkName: string]: CheckData };
  selectedCheckName?: string;
}

export function RoomCard({ roomName, checks, selectedCheckName }: RoomCardProps) {
  const { spoilerLog } = useChecklist();

  const getItemName = (checkName: string): string | undefined => {
    if (!spoilerLog) return undefined;
    const itemEnum = spoilerLog.itemPlacements[checkName];
    if (itemEnum === undefined) return undefined;

    // Convert Item enum value to string name
    return Item[itemEnum];
  };

  return (
    <div className="room-card">
      {/* Room Header */}
      <div className="room-card-header">
        <h3 className="room-card-title">{roomName}</h3>
      </div>

      {/* Checks */}
      <div className="room-card-content">
        {Object.entries(checks).map(([checkName, checkData]) => (
          <CheckItem
            key={checkName}
            checkName={checkName}
            available={checkData.available}
            checked={checkData.checked}
            selected={checkName === selectedCheckName}
            itemName={getItemName(checkName)}
          />
        ))}
      </div>
    </div>
  );
}
