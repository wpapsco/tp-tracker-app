'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { type Checklist, type SpoilerLog, CheckEntry, Checks, Item, RoomEntry, Rooms } from '@/logic';
import { CheckFilter, RandoLogic, SaveData, WorldData } from '@/logic/RandoLogic';

// Sample checklist data for demonstration (fallback if RandoLogic isn't available)
const sampleChecklist: Checklist = {
  "Ordona Province": {
    "Link's house": {
      "Main room chest": {
        available: false,
        checked: false,
        category: []
      },
      "Basement chest": {
        available: true,
        checked: true,
        category: []
      }
    },
    "Village": {
      "Cradle": {
        available: false,
        checked: false,
        category: []
      },
      "Shop Slingshot": {
        available: true,
        checked: true,
        category: []
      }
    }
  },
  "Hyrule Field": {
    "Field Area": {
      "Bridge Chest": {
        available: true,
        checked: false,
        category: []
      },
      "Tree Heart Piece": {
        available: false,
        checked: false,
        category: []
      }
    }
  },
  "Forest Temple": {
    "Entrance": {
      "Vines Chest": {
        available: true,
        checked: false,
        category: []
      },
      "Gale Boomerang": {
        available: false,
        checked: false,
        category: []
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
  loadSpoilerLog: (spoilerLog: SpoilerLog) => void;
  filter: CheckFilter;
  setFilter: (filter: CheckFilter) => void;
}

const defaultFilter: CheckFilter = {
showPoes: "All",
showGoldenBugs: true,
showSkyCharacters: true,
showNpcItems: true,
showShopItems: true,
showHiddenSkills: true,
showExcludedItems: true
}


const ChecklistContext = createContext<ChecklistContextType | undefined>(undefined);

let worldData: WorldData | null = null
export function ChecklistProvider({ children }: { children: ReactNode }) {
  const [checklist, setChecklist] = useState<Checklist>(sampleChecklist);
  const [selectedRegion, setSelectedRegion] = useState<string>('Ordona Province');
  const [logic, setLogic] = useState<RandoLogic | null>(null);
  const [filter, setFilter] = useState<CheckFilter>(defaultFilter)

  {/* let rooms: RoomEntry[] = [] */}
  {/* let checks: CheckEntry[] = [] */}

  // Initialize with sample data if needed
  useEffect(() => {
    // In a real app, you might load the RandoLogic here
    // For now, we use the sample checklist
    const regions = Object.keys(checklist);
    if (regions.length > 0) {
      setSelectedRegion(regions[0]);
    }
  }, []);

  useEffect(() => {
      loadWorldData().then(() => loadSaveData())
  }, [])

  const loadWorldData = async () => {
      // Fetch rooms and checks data from static JSON file
      const response = await fetch('/world-data.json');
  
      if (!response.ok) {
        throw new Error('Failed to fetch world data');
      }
  
      worldData = await response.json();

      if (!worldData) {
        throw new Error('World data is missing');
      }
  }

  const loadSpoilerLog = (spoilerLog: SpoilerLog) => {
    try {
      console.log("loading spoiler log")
      if (!worldData) {
        console.log("no world data somehow")
        return;
      }

      const newLogic = new RandoLogic(spoilerLog, worldData);
      console.log("made new logic")
      setLogic(newLogic);
      const checklistData = newLogic.getAllChecks(filter);
      setChecklist(checklistData);
      console.log("set checklist")

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
      logic.toggleCheck(checkName);
      const updatedChecklist = logic.getAllChecks(filter);
      setChecklist(updatedChecklist);
      save()
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

  const save = () => {
    if (logic) {
      localStorage.setItem("tp-rando-save-data", JSON.stringify(logic.getSaveJson()))
    }
  }

  const loadSaveData = () => {
    const loadedData = localStorage.getItem("tp-rando-save-data")
    if (!loadedData || !worldData) return;
    const saveData = (JSON.parse(loadedData) as SaveData)
    const newLogic = RandoLogic.fromSaveData(worldData, saveData)
    setLogic(newLogic)
    const checklistData = newLogic.getAllChecks(filter)
    console.log(checklistData)
    setChecklist(checklistData)
    const regions = Object.keys(checklistData);
    if (regions.length > 0) {
      setSelectedRegion(regions[0]);
    }
  }

  const clearSaveData = () => {
    localStorage.removeItem("tp-rando-save-data")
  }

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
    <ChecklistContext.Provider value={{ checklist, selectedRegion, setSelectedRegion, toggleCheck, loadSpoilerLog, filter, setFilter }}>
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
