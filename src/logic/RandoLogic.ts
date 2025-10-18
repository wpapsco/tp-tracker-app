import type {Parjser} from "parjs"
import {getParser} from "./parser/parser"
import { type Settings, type ItemState, type Checklist, type SpoilerLog, type Rooms, type CheckFn, Item, type CheckEntry, type Checks, type RoomEntry } from "./types/index"

export class RandoLogic {
    private settings: Settings
    private itemState: ItemState
    private spoilerLog: SpoilerLog
    private loadedRooms: Rooms = {};
    private loadedChecks: Checks = {};
    private parser: Parjser<CheckFn>
    private checkedChecks: Set<string> = new Set()
    private worldData: WorldData;
    
    public constructor(spoilerLog: SpoilerLog, worldData: WorldData) {
        this.worldData = worldData
        this.itemState = {items: {}, openRooms:[]}
        this.spoilerLog = spoilerLog
        this.settings = spoilerLog.settings;

        let rooms = this.worldData.rooms
        let checks = this.worldData.checks
        if (this.settings.logicRules == "Glitched") {
            rooms = this.worldData.glitchedRooms
            checks = this.worldData.glitchedChecks
        }

        // Load rooms from provided data
        rooms.forEach(entry => {
            this.loadedRooms[entry.RoomName] = entry;
        })

        // Load checks from provided data
        checks.forEach(entry => {
            this.loadedChecks[entry.filename] = entry
        })

        this.parser = getParser(this.settings, this.loadedRooms)
        this.parseExitRequirements()
        this.parseCheckRequirements()

        // Process starting items from settings
        if (this.settings.startingItems && Array.isArray(this.settings.startingItems)) {
            this.settings.startingItems.forEach((itemName: string) => {
                if (itemName in Item) {
                    const item = Item[itemName as keyof typeof Item];
                    this.unlockItem(item);
                }
            });
        }

        this.findOpenRooms()
    }

    public static fromSaveData(worldData: WorldData, saveData: SaveData): RandoLogic {
        console.log(saveData.checked)
        const logic = new RandoLogic(saveData.spoilerLog, worldData)
        logic.checkedChecks = new Set(saveData.checked)
        console.log(logic.checkedChecks)
        logic.itemState = {"openRooms": [], "items": saveData.heldItems}
        logic.findOpenRooms()
        return logic
    }

    public openCheck(checkName: string) {
        this.checkedChecks.add(checkName)
        let theItem = this.spoilerLog.itemPlacements[checkName]
        if (!theItem) return;
        if (theItem == Item.Vanilla || theItem == Item.Gives_Vanilla) {
            theItem = this.getVanillaItem(checkName)
        }
        this.unlockItem(theItem)
    }

    public closeCheck(checkName: string) {
        this.checkedChecks.delete(checkName)
        let theItem = this.spoilerLog.itemPlacements[checkName]
        if (!theItem) return;
        if (theItem == Item.Vanilla || theItem == Item.Gives_Vanilla) {
            theItem = this.getVanillaItem(checkName)
        }
        this.removeItem(theItem)
    }

    public toggleCheck(checkName: string) {
        if (this.checkedChecks.has(checkName)) {
            this.closeCheck(checkName)
        } else {
            this.openCheck(checkName)
        }
    }

    public getAllChecks(filter?: CheckFilter): Checklist {

        filter = filter || {
            showPoes: "All",
            showGoldenBugs: true,
            showHiddenSkills: true,
            showShopItems: true,
            showNpcItems: true,
            showSkyCharacters: true,
            showExcludedItems: true,
            showOnlyAvailable: false
        }

        let checklist: Checklist = {}

        Object.keys(this.loadedRooms).forEach(roomName => {
            const room = this.loadedRooms[roomName]
            if (!room) return;
            const checklistRegion = checklist[room.Region] || {}
            const checklistRoom = checklistRegion[room.RoomName] || {}
            room.Checks.forEach(checkName => {
                const check = this.loadedChecks[checkName]
                if (!check || !this.shouldShowCheck(check, filter)) return;
                const isAvailable =
                    this.itemState.openRooms.includes(room.RoomName) &&
                    check.parsedRequirements ? check.parsedRequirements(this.itemState) : false;
                const isChecked = this.checkedChecks.has(checkName);

                // Skip unavailable checks if showOnlyAvailable is true
                if (filter.showOnlyAvailable && !isAvailable && !isChecked) return;

                checklistRoom[checkName] = {
                    available: isAvailable,
                    checked: isChecked,
                    category: check.checkCategory
                }
            })
            checklistRegion[room.RoomName] = checklistRoom
            checklist[room.Region] = checklistRegion
        })
        return checklist
    }

    public getHeldItems() {
        return this.itemState.items;
    }

    public getSaveJson(): SaveData {
        return {
            "checked": Array.from(this.checkedChecks),
            "spoilerLog": this.spoilerLog,
            "heldItems": this.itemState.items
        }
    }

    public isGoMode(): boolean {
        return this.itemState.openRooms.includes("Ganondorf Castle")
    }

    private getVanillaItem(checkName: string): Item {
        const theCheck = this.loadedChecks[checkName];
        if (!theCheck) return Item.Vanilla;
        return theCheck.itemId
    }

    private findOpenRooms() {
        this.itemState.openRooms = ["Outside Links House"]
        let addedNewRoom = true
        while (addedNewRoom) {
            addedNewRoom = false;
            const visited: string[] = []
            for (var i = 0; i < this.itemState.openRooms.length; i++) {
                const curRoomName = this.itemState.openRooms[i];
                if (!curRoomName) return [];
                visited.push(curRoomName)
                const currentRoom = this.loadedRooms[curRoomName]
                if (!currentRoom) return [];
                const openExits = currentRoom.Exits.filter(ex => {
                    if (visited.includes(ex.ConnectedArea)) return false;
                    if (!ex.parsedRequirements) return false;
                    if (this.itemState.openRooms.includes(ex.ConnectedArea)) return false;
                    return ex.parsedRequirements({items: this.itemState.items, openRooms: this.itemState.openRooms})
                }).map(ex => ex.ConnectedArea)
                this.itemState.openRooms = this.itemState.openRooms.concat(openExits)
                addedNewRoom = addedNewRoom || (openExits.length > 0)
            }
        }
    }

    private unlockItem(item: Item) {
        const x = Item[item] as keyof typeof Item;
        this.itemState.items[x] = (this.itemState.items[x] || 0) + 1
        this.findOpenRooms()
    }

    private removeItem(item: Item) {
        const x = Item[item] as keyof typeof Item;
        this.itemState.items[x] = (this.itemState.items[x] || 0) - 1
        this.itemState.items[x] < 0 ? 0 : this.itemState.items[x]
        this.findOpenRooms()
    }

    private parseExitRequirements() {
        Object.values(this.loadedRooms).forEach(room => {
            room.Exits.forEach(exit => {
                const parseResult = this.parser.parse(exit.Requirements);
                if (parseResult.isOk) {
                    exit.parsedRequirements = parseResult.value;
                } else {
                    console.error(`Failed to parse requirements for exit to ${exit.ConnectedArea} in room ${room.RoomName}: ${exit.Requirements}`);
                }
            });
        });
    }

    private parseCheckRequirements() {
        Object.values(this.loadedChecks).forEach(check => {
            const parseResult = this.parser.parse(check.requirements);
            if (parseResult.isOk) {
                check.parsedRequirements = parseResult.value;
            } else {
                console.error(`Failed to parse requirements for check ${check.filename}: ${check.requirements}`);
            }
        });
    }

    private shouldShowCheck(entry: CheckEntry, checkFilter: CheckFilter): boolean {
        if (entry.checkCategory.includes("Golden Bug")) {
            return checkFilter.showGoldenBugs
        }
        if (entry.checkCategory.includes("Sky Book")) {
            return checkFilter.showSkyCharacters
        } 
        if (entry.checkCategory.includes("Npc")) {
            return checkFilter.showNpcItems
        } 
        if (entry.checkCategory.includes("Shop")) {
            return checkFilter.showShopItems
        } 
        if (entry.checkCategory.includes("Hidden Skill")) {
            return checkFilter.showHiddenSkills
        } 
        if (entry.checkCategory.includes("Poe")) {
            if (checkFilter.showPoes == "Dungeons") {
                return entry.checkCategory.includes("Dungeon")
            }
            if (checkFilter.showPoes == "Overworld") {
                return entry.checkCategory.includes("Overworld")
            }
            if (checkFilter.showPoes == "All") {
                return true
            }
            if (checkFilter.showPoes == "Vanilla") {
                return false
            }
        }
        if ((this.settings.excludedChecks || []).includes(entry.filename)) {
            return checkFilter.showExcludedItems
        }
        return true
    }
}

export interface CheckFilter {
    showPoes: "Vanilla" | "Dungeons" | "Overworld" | "All";
    showGoldenBugs: boolean;
    showSkyCharacters: boolean;
    showNpcItems: boolean;
    showShopItems: boolean;
    showHiddenSkills: boolean;
    showExcludedItems: boolean;
    showOnlyAvailable: boolean;
}

export interface SaveData {
    spoilerLog: SpoilerLog,
    checked: string[],
    heldItems: {[key in keyof typeof Item]?: number}
}

export interface WorldData {
    rooms: RoomEntry[];
    checks: CheckEntry[];
    glitchedRooms: RoomEntry[];
    glitchedChecks: CheckEntry[];
}
