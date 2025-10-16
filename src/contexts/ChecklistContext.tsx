'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { type Checklist, type SpoilerLog, Item } from '@/logic';

// Sample checklist data for demonstration (fallback if RandoLogic isn't available)
const sampleChecklist: Checklist = {
  "Ordona Province": {
    "Link's house": {
      "Main room chest": {
        available: false,
        checked: false
      },
      "Basement chest": {
        available: true,
        checked: true
      }
    },
    "Village": {
      "Cradle": {
        available: false,
        checked: false
      },
      "Shop Slingshot": {
        available: true,
        checked: true
      }
    }
  },
  "Hyrule Field": {
    "Field Area": {
      "Bridge Chest": {
        available: true,
        checked: false
      },
      "Tree Heart Piece": {
        available: false,
        checked: false
      }
    }
  },
  "Forest Temple": {
    "Entrance": {
      "Vines Chest": {
        available: true,
        checked: false
      },
      "Gale Boomerang": {
        available: false,
        checked: false
      }
    }
  }
};

// Sample spoiler log (in a real app, this would be loaded from a file)
const sampleSpoilerLog: any = {
  settings: {
    logicRules: "Glitchless",
    castleRequirements: "Vanilla",
    palaceRequirements: "Vanilla",
    faronWoodsLogic: "Closed",
    shuffleGoldenBugs: false,
    shuffleSkyCharacters: false,
    shuffleNpcItems: false,
    shufflePoes: "Vanilla",
    shuffleShopItems: false,
    shuffleHiddenSkills: false,
    itemScarcity: "Vanilla",
    damageMagnification: "Vanilla",
    bonksDoDamage: false,
    shuffleRewards: false,
    smallKeySettings: "Vanilla",
    bigKeySettings: "Vanilla",
    mapAndCompassSettings: "Vanilla",
    skipPrologue: false,
    faronTwilightCleared: false,
    eldinTwilightCleared: false,
    lanayruTwilightCleared: false,
    skipMdh: false,
    skipMinorCutscenes: false,
    skipMajorCutscenes: false,
    fastIronBoots: false,
    quickTransform: false,
    transformAnywhere: false,
    increaseWallet: false,
    modifyShopModels: false,
    trapFrequency: "None",
    barrenDungeons: false,
    goronMinesEntrance: "Closed",
    skipLakebedEntrance: false,
    skipArbitersEntrance: false,
    skipSnowpeakEntrance: false,
    totEntrance: "Closed",
    skipCityEntrance: false,
    instantText: false,
    openMap: false,
    increaseSpinnerSpeed: false,
    openDot: false,
    noSmallKeysOnBosses: false,
    startingToD: "Noon",
    hintDistribution: "Balanced",
    startingItems: [],
    excludedChecks: []
  },
  itemPlacements: {
    "Links Basement Chest": "Shadow_Crystal",
    "Sera Shop Slingshot": "Slingshot",
    "Wrestling With Bo": "Lantern",
    "Wooden Sword Chest": "Purple_Rupee",
    "Ordon Cat Rescue": "Sera_Bottle",
    "Uli Cradle Delivery": "Water_Bombs_5",
  }
};

interface ChecklistContextType {
  checklist: Checklist;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  toggleCheck: (checkName: string) => void;
  loadSpoilerLog: (spoilerLog: SpoilerLog, roomsData?: any[], checksData?: any[]) => Promise<void>;
}

const ChecklistContext = createContext<ChecklistContextType | undefined>(undefined);

export function ChecklistProvider({ children }: { children: ReactNode }) {
  const [checklist, setChecklist] = useState<Checklist>(sampleChecklist);
  const [selectedRegion, setSelectedRegion] = useState<string>('Ordona Province');
  const [logic, setLogic] = useState<any>(null); // RandoLogic instance

  // Initialize with sample data if needed
  useEffect(() => {
    // In a real app, you might load the RandoLogic here
    // For now, we use the sample checklist
    const regions = Object.keys(checklist);
    if (regions.length > 0) {
      setSelectedRegion(regions[0]);
    }
  }, []);

  const loadSpoilerLog = async (spoilerLog: SpoilerLog, roomsData?: any[], checksData?: any[]) => {
    try {
      // If rooms and checks data aren't provided, fetch them from public folder
      let rooms = roomsData;
      let checks = checksData;

      if (!rooms || !checks) {
        // Fetch rooms and checks data from static JSON file
        const response = await fetch('/world-data.json');

        if (!response.ok) {
          throw new Error('Failed to fetch world data');
        }

        const data = await response.json();
        rooms = data.rooms;
        checks = data.checks;
      }

      if (!rooms || !checks) {
        throw new Error('Rooms or checks data is missing');
      }

      const { RandoLogic } = await import('@/logic/RandoLogic');
      const newLogic = new RandoLogic(spoilerLog, rooms, checks);
      setLogic(newLogic);
      const checklistData = newLogic.getAllChecks();
      setChecklist(checklistData);

      // Update selected region to the first one
      const regions = Object.keys(checklistData);
      if (regions.length > 0) {
        setSelectedRegion(regions[0]);
      }
    } catch (error) {
      console.error('Failed to load RandoLogic:', error);
      alert(`Failed to initialize tracker: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const toggleCheck = (checkName: string) => {
    if (logic) {
      // If we have RandoLogic, use it to toggle the check
      const location = findCheckInChecklist(checkName);
      if (location) {
        const { region, room } = location;
        const isChecked = checklist[region][room][checkName].checked;
        if (isChecked) {
          logic.closeCheck(checkName);
        } else {
          logic.openCheck(checkName);
        }
        // Update checklist from logic
        const updatedChecklist = logic.getAllChecks();
        setChecklist(updatedChecklist);
      }
    } else {
      // Fallback: manually toggle the check in the sample data
      const location = findCheckInChecklist(checkName);
      if (location) {
        const { region, room } = location;
        setChecklist(prev => ({
          ...prev,
          [region]: {
            ...prev[region],
            [room]: {
              ...prev[region][room],
              [checkName]: {
                ...prev[region][room][checkName],
                checked: !prev[region][room][checkName].checked
              }
            }
          }
        }));
      }
    }
  };

  const findCheckInChecklist = (checkName: string): { region: string; room: string } | null => {
    for (const region in checklist) {
      for (const room in checklist[region]) {
        if (checkName in checklist[region][room]) {
          return { region, room };
        }
      }
    }
    return null;
  };

  return (
    <ChecklistContext.Provider value={{ checklist, selectedRegion, setSelectedRegion, toggleCheck, loadSpoilerLog }}>
      {children}
    </ChecklistContext.Provider>
  );
}

export function useChecklist() {
  const context = useContext(ChecklistContext);
  if (context === undefined) {
    throw new Error('useChecklist must be used within a ChecklistProvider');
  }
  return context;
}
