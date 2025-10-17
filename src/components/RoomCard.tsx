'use client';

import { CheckItem } from './CheckItem';

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
  return (
    <div className="border-2 border-black">
      {/* Room Header */}
      <div className="bg-blue-600 p-3 border-b-2 border-black">
        <h3 className="font-bold text-lg text-white">{roomName}</h3>
      </div>

      {/* Checks */}
      <div className="p-4 bg-gray-50">
        {Object.entries(checks).map(([checkName, checkData]) => (
          <CheckItem
            key={checkName}
            checkName={checkName}
            available={checkData.available}
            checked={checkData.checked}
            selected={checkName === selectedCheckName}
          />
        ))}
      </div>
    </div>
  );
}
