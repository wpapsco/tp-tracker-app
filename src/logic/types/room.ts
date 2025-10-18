import type {Item} from './item';
import type { CheckFn } from './state';

export interface ExitEntry {
    ConnectedArea: string;
    Requirements: string;
    parsedRequirements?: CheckFn;
}

export interface RoomEntry {
    RoomName: string;
    Exits: ExitEntry[];
    Checks: string[];
    Region: string;
}

export interface Rooms {
    [roomName: string]: RoomEntry;
}

export interface CheckEntry {
    requirements: string;
    parsedRequirements?: CheckFn;
    checkCategory: string[];
    itemId: Item;
    filename: string;
}

export interface Checks {
    [checkName: string]: CheckEntry;
}

