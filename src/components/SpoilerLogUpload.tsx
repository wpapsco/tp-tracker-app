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
      if (spoilerLogData.version != "s1.2.0") {
        alert("This tracker only supports 1.2.0")
      }

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
    <div className="upload-container">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        className="upload-input-hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="btn-upload"
      >
        Upload Spoiler Log
      </button>
    </div>
  );
}
