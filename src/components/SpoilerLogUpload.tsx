'use client';

import { useRef } from 'react';
import { useChecklist } from '@/contexts/ChecklistContext';
import { Item } from '@/logic';

export function SpoilerLogUpload() {
  const { loadSpoilerLog } = useChecklist();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const spoilerLogData = JSON.parse(text);

      // Convert item placement strings to Item enum values
      const itemPlacements: { [checkName: string]: Item } = {};
      for (const checkName in spoilerLogData.itemPlacements) {
        const itemName = spoilerLogData.itemPlacements[checkName] as keyof typeof Item;
        if (itemName in Item) {
          itemPlacements[checkName] = Item[itemName];
        }
      }

      const spoilerLog = {
        ...spoilerLogData,
        itemPlacements
      };

      loadSpoilerLog(spoilerLog);
    } catch (error) {
      console.error('Error loading spoiler log:', error);
      alert('Failed to load spoiler log. Please check the file format.');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Upload Spoiler Log
      </button>
    </div>
  );
}
