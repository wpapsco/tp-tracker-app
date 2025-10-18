'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { type Checklist, type SpoilerLog, CheckEntry, Checks, Item, RoomEntry, Rooms } from '@/logic';
import { CheckFilter, RandoLogic, SaveData, WorldData } from '@/logic/RandoLogic';

interface ChecklistContextType {
  checklist: Checklist;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  toggleCheck: (checkName: string) => void;
  loadSpoilerLog: (spoilerLog: SpoilerLog) => void;
  filter: CheckFilter;
  setFilter: (filter: CheckFilter) => void;
  isGoMode: boolean;
  heldItems: {[key: string]: number};
  spoilerLog: SpoilerLog | null;
}

const defaultFilter: CheckFilter = {
showPoes: "All",
showGoldenBugs: true,
showSkyCharacters: true,
showNpcItems: true,
showShopItems: true,
showHiddenSkills: true,
showExcludedItems: true,
showOnlyAvailable: false,
showItemList: true,
showCheckItems: true
}


const ChecklistContext = createContext<ChecklistContextType | undefined>(undefined);

let worldData: WorldData | null = null
export function ChecklistProvider({ children }: { children: ReactNode }) {
  const [checklist, setChecklist] = useState<Checklist>({});
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [logic, setLogic] = useState<RandoLogic | null>(null);
  const [filter, setFilter] = useState<CheckFilter>(defaultFilter);
  const [isGoMode, setIsGoMode] = useState<boolean>(false);
  const [heldItems, setHeldItems] = useState<{[key: string]: number}>({});
  const [spoilerLog, setSpoilerLog] = useState<SpoilerLog | null>(null);

  useEffect(() => {
      loadWorldData().then(() => loadSaveData())
  }, [])

  // Update checklist when filter changes
  useEffect(() => {
    if (logic) {
      const updatedChecklist = logic.getAllChecks(filter);
      setChecklist(updatedChecklist);
    }
  }, [filter, logic])

  // Update GO MODE state and held items whenever logic changes
  useEffect(() => {
    if (logic) {
      setIsGoMode(logic.isGoMode());
      setHeldItems(logic.getHeldItems());
    }
  }, [logic, checklist])

  const loadWorldData = async () => {
      // Fetch rooms and checks data from static JSON file
      // Use relative path to work with basePath in GitHub Pages deployment
      const basePath = '/tp-tracker-app';
      const response = await fetch(`${basePath}/world-data.json`);
  
      if (!response.ok) {
        throw new Error('Failed to fetch world data');
      }
  
      worldData = await response.json();

      if (!worldData) {
        throw new Error('World data is missing');
      }
  }

  const loadSpoilerLog = (spoilerLogData: SpoilerLog) => {
    try {
      console.log("loading spoiler log")
      if (!worldData) {
        console.log("no world data somehow")
        return;
      }

      setSpoilerLog(spoilerLogData);

      // Initialize filter from spoiler log settings
      const newFilter: CheckFilter = {
        showGoldenBugs: spoilerLogData.settings.shuffleGoldenBugs ?? true,
        showSkyCharacters: true, // Always true by default
        showNpcItems: true, // Always true by default
        showShopItems: true, // Always true by default
        showHiddenSkills: true, // Always true by default
        showPoes: spoilerLogData.settings.shufflePoes ?? "All",
        showExcludedItems: true,
        showOnlyAvailable: false,
        showItemList: true,
        showCheckItems: true
      };
      setFilter(newFilter);

      const newLogic = new RandoLogic(spoilerLogData, worldData);
      console.log("made new logic")
      setLogic(newLogic);
      const checklistData = newLogic.getAllChecks(newFilter);
      setChecklist(checklistData);
      console.log("set checklist")

      // Update selected region to the first one
      // const regions = Object.keys(checklistData);
      // if (regions.length > 0) {
      //   setSelectedRegion(regions[0]);
      // }
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

    setSpoilerLog(saveData.spoilerLog);

    // Restore filter from saved spoiler log settings
    const savedFilter: CheckFilter = {
      showGoldenBugs: saveData.spoilerLog.settings.shuffleGoldenBugs ?? true,
      showSkyCharacters: true, // Always true by default
      showNpcItems: true, // Always true by default
      showShopItems: true, // Always true by default
      showHiddenSkills: true, // Always true by default
      showPoes: saveData.spoilerLog.settings.shufflePoes ?? "All",
      showExcludedItems: true,
      showOnlyAvailable: false,
      showItemList: true,
      showCheckItems: true
    };
    setFilter(savedFilter);

    const newLogic = RandoLogic.fromSaveData(worldData, saveData)
    setLogic(newLogic)
    const checklistData = newLogic.getAllChecks(savedFilter)
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

  return (
    <ChecklistContext.Provider value={{ checklist, selectedRegion, setSelectedRegion, toggleCheck, loadSpoilerLog, filter, setFilter, isGoMode, heldItems, spoilerLog }}>
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
