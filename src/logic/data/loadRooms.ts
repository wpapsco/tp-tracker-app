import { readFileSync, readdirSync, statSync } from 'fs';
import { join, basename } from 'path';
import type { CheckEntry, RoomEntry } from '../types/index';
import {WorldData} from '../RandoLogic';

// Function to recursively find all .jsonc files in a directory
function findJsoncFiles(dir: string): string[] {
    const results: string[] = [];
    const items = readdirSync(dir);

    for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
            results.push(...findJsoncFiles(fullPath));
        } else if (item.endsWith('.jsonc') || item.endsWith('.json')) {
            results.push(fullPath);
        }
    }

    return results;
}

// Function to strip comments from JSONC content
function stripJsonComments(content: string): string {
    // Remove single-line comments (// ...)
    content = content.replace(/\/\/.*$/gm, '');
    // Remove multi-line comments (/* ... */)
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');
    // Remove trailing commas before closing braces/brackets
    content = content.replace(/,(\s*[}\]])/g, '$1');
    return content;
}

// Load all room entries from a directory
function loadRoomsFromDirectory(dir: string): RoomEntry[] {
    const allRooms: RoomEntry[] = [];
    const jsonFiles = findJsoncFiles(dir);

    for (const file of jsonFiles) {
        try {
            const content = readFileSync(file, 'utf-8');
            const cleanContent = stripJsonComments(content);
            const rooms = JSON.parse(cleanContent) as RoomEntry[];
            allRooms.push(...rooms);
        } catch (error) {
            console.error(`Error loading ${file}:`, error);
        }
    }

    return allRooms;
}

function loadChecksFromDirectory(dir: string): CheckEntry[] {
    const allChecks: CheckEntry[] = [];
    const jsonFiles = findJsoncFiles(dir);

    for (const file of jsonFiles) {
        try {
            const content = readFileSync(file, 'utf-8');
            const cleanContent = stripJsonComments(content);
            const check = JSON.parse(cleanContent) as CheckEntry;
            check.filename = basename(file, ".jsonc")
            allChecks.push(check);
        } catch (error) {
            console.error(`Error loading ${file}:`, error);
        }
    }

    return allChecks;
}

// Load all World rooms
export function loadWorldRooms(): RoomEntry[] {
    return loadRoomsFromDirectory(join(process.cwd(), 'data', 'World', 'Rooms'));
}

export function loadWorldChecks(): CheckEntry[] {
    return loadChecksFromDirectory(join(process.cwd(), 'data', 'World', 'Checks'))
}

// Load all Glitched-World rooms
export function loadGlitchedWorldRooms(): RoomEntry[] {
    return loadRoomsFromDirectory(join(process.cwd(), 'data', 'Glitched-World', 'Rooms'));
}

export function loadGlitchedWorldChecks(): CheckEntry[] {
    return loadChecksFromDirectory(join(process.cwd(), 'data', 'Glitched-World', 'Checks'))
}

export function loadWorldData(): WorldData {
    return {
        "checks": loadWorldChecks(),
        "rooms": loadWorldRooms(),
        "glitchedChecks": loadGlitchedWorldChecks(),
        "glitchedRooms": loadGlitchedWorldRooms()
    }
}

// Load rooms based on logic mode
export function loadRooms(glitched: boolean = false): RoomEntry[] {
    return glitched ? loadGlitchedWorldRooms() : loadWorldRooms();
}
