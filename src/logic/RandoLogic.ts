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

    public constructor(spoilerLog: SpoilerLog, rooms: RoomEntry[], checks: CheckEntry[]) {
        this.itemState = {items: {}, openRooms:[]}
        this.spoilerLog = spoilerLog
        this.settings = spoilerLog.settings;

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
        this.findOpenRooms()
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

    public getAllChecks(): Checklist {
        let checklist: Checklist = {}
        console.log("getting all checks")
        console.log(this.itemState.openRooms)

        Object.keys(this.loadedRooms).forEach(roomName => {
            const room = this.loadedRooms[roomName]
            if (!room) return;
            const checklistRegion = checklist[room.Region] || {}
            const checklistRoom = checklistRegion[room.RoomName] || {}
            room.Checks.forEach(checkName => {
                const check = this.loadedChecks[checkName]
                if (!check) return;
                // console.log("checking check: " + checkName)
                checklistRoom[checkName] = {
                    available: 
                        this.itemState.openRooms.includes(room.RoomName) && 
                        check.parsedRequirements ? check.parsedRequirements(this.itemState) : false,
                    checked: this.checkedChecks.has(checkName)
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

    private getVanillaItem(checkName: string): Item {
        const theCheck = this.loadedChecks[checkName];
        if (!theCheck) return Item.Vanilla;
        return theCheck.itemId
    }

    private findOpenRooms() {
        this.itemState.openRooms = ["Outside Links House"]
        const visited: string[] = []
        for (var i = 0; i < this.itemState.openRooms.length; i++) {
            const curRoomName = this.itemState.openRooms[i];
            if (!curRoomName) return [];
            console.log("checking room " + curRoomName)
            visited.push(curRoomName)
            const currentRoom = this.loadedRooms[curRoomName]
            if (!currentRoom) return [];
            const openExits = currentRoom.Exits.filter(ex => {
                if (visited.includes(ex.ConnectedArea)) return false;
                if (!ex.parsedRequirements) return false;
                return ex.parsedRequirements({items: this.itemState.items, openRooms: this.itemState.openRooms})
            }).map(ex => ex.ConnectedArea)
            console.log("adding rooms: " + JSON.stringify(openExits))
            this.itemState.openRooms = this.itemState.openRooms.concat(openExits)
        }
        console.log("finished checking rooms")
        console.log(this.itemState.openRooms)
    }

    private unlockItem(item: Item) {
        const x = Item[item] as keyof typeof Item;
        this.itemState.items[x] = (this.itemState.items[x] || 0) + 1
        console.log(item, x, this.itemState.items);
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
}
