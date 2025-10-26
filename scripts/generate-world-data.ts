import { writeFileSync } from 'fs';
import { join } from 'path';
import { loadWorldRooms, loadWorldChecks, loadGlitchedWorldRooms, loadGlitchedWorldChecks } from '../src/logic/data/loadRooms';
import type { CheckEntry } from '../src/logic/types/index';

console.log('Generating static world-data.json...');

// Hint signs data - separate from world data files
// Room names mapped from actual room data
// TODO: Need to add 14 more signs - there are 35 total according to wiki
const hintSigns: Array<{name: string, room: string, description: string, specialRequirements?: string}> = [
  { name: "Ordon Sign", room: "Outside_Links_House", description: "Next to the gate outside Link's House" },
  { name: "Faron Woods Sign", room: "South_Faron_Woods_Coros_Ledge", description: "On the ledge behind the scarecrow near Coro's House" },
  { name: "Faron Field Sign", room: "Faron_Field", description: "Underneath the wooden bridge" },
  { name: "Sacred Grove Sign", room: "Sacred_Grove_Upper", description: "On the wall next to the doors that lead to the past" },
  { name: "Death Mountain Sign", room: "Death_Mountain_Trail", description: "In the volcano area overlooking the Gorons" },
  { name: "Eldin Field Sign", room: "Eldin_Field", description: "Next to the wooden bridge that leads to Kakariko Gorge" },
  { name: "North Eldin Sign", room: "North_Eldin_Field", description: "On the ledge to the north of the rocks that lead to Lanayru Field" },
  { name: "Kakariko Gorge Sign", room: "Kakariko_Gorge", description: "Along the fence that is to the north of the Owl Statue" },
  { name: "Kakariko Village Sign", room: "Upper_Kakariko_Village", description: "In the hot spring that is above the Elde Inn" },
  { name: "Kakariko Graveyard Sign", room: "Kakariko_Graveyard", description: "Behind King Zora's Grave", specialRequirements: "Gate_Keys or (Setting.smallKeySettings equals Keysy)" },
  { name: "Hidden Village Sign", room: "Hidden_Village", description: "By the fence near the Howling Stone" },
  { name: "Beside Castle Town Sign", room: "Outside_Castle_Town_West", description: "On the stone ledge where the Golden Wolf sits" },
  { name: "Castle Town Sign", room: "Castle_Town_Center", description: "In the central plaza in front of the fountain" },
  { name: "South of Castle Town Sign", room: "Outside_Castle_Town_South", description: "In front of the fountain" },
  { name: "Great Bridge of Hylia Sign", room: "Lake_Hylia_Bridge", description: "On the ledge with hanging vines above the Owl Statue", specialRequirements: "(Progressive_Clawshot, 1)" },
  { name: "Lake Hylia Sign", room: "Lake_Hylia", description: "Near Falbi in the Flight By Fowl House" },
  { name: "Lake Lantern Cave Sign", room: "Eldin_Lantern_Cave", description: "At the halfway point near the light that allows you to leave" },
  { name: "Lanayru Spring Sign", room: "Lake_Hylia_Lanayru_Spring", description: "Underwater between the two small chests" }, // Special requirements handled separately for glitched/normal
  { name: "Lanayru Field Sign", room: "Lanayru_Field", description: "Along the fence on the north side of the field near the entrance to Zora's Domain" },
  { name: "Zora's Domain Sign", room: "Zoras_Domain_West_Ledge", description: "In the alcove above the entrance to Snowpeak Mountain" },
  { name: "Upper Zora's River Sign", room: "Upper_Zoras_River", description: "On the far side of Hena's house" },
  { name: "Gerudo Desert Sign", room: "Gerudo_Desert", description: "At the end of a long ledge near the central gate before the Bulblin campfire" },
  { name: "Bulblin Camp Sign", room: "Bulblin_Camp", description: "In the northern corner opposite the roasted boar" },
  { name: "Cave of Ordeals Sign", room: "Gerudo_Desert_Cave_of_Ordeals_Floors_01-11", description: "On the 1F ledge as soon as you enter" },
  { name: "Snowpeak Mountain Sign", room: "Snowpeak_Climb_Upper", description: "On the far side of the frozen lake near the blizzard" },
  { name: "Forest Temple Sign", room: "Forest_Temple_Lobby", description: "In the central hub, it is next to the door that has the webs in front of it" },
  { name: "Goron Mines Sign", room: "Goron_Mines_Upper_East_Wing", description: "In Gor Ebizo's room before the miniboss" },
  { name: "Lakebed Temple Sign", room: "Lakebed_Temple_Central_Room", description: "On the lower west path outside the main room" },
  { name: "Arbiters Grounds Sign", room: "Arbiters_Grounds_Lobby", description: "In front of the Poe Gate in the central room" },
  { name: "Snowpeak Ruins Sign", room: "Snowpeak_Ruins_Yeto_and_Yeta", description: "In the hearth room near Yeta" },
  { name: "Temple of Time Entrance Sign", room: "Temple_of_Time_Entrance", description: "In the entrance room near Ooccoo" },
  { name: "Temple of Time Midpoint Sign", room: "Temple_of_Time_Moving_Wall_Hallways", description: "After the Beamos moving walls room" },
  { name: "City in The Sky Sign", room: "City_in_The_Sky_Lobby", description: "In the central room near the door leading to the miniboss wing" },
  { name: "Palace of Twilight Sign", room: "Palace_of_Twilight_Entrance", description: "In the entrance of the dungeon near the platform to the second wing" },
  { name: "Hyrule Castle Sign", room: "Hyrule_Castle_Entrance", description: "In front of the tall statue at the start of the dungeon" }
];

// Howling stones data
const howlingStones: Array<{name: string, room: string, description: string, specialRequirements?: string}> = [
  // Howling Stone #1 is story-based (before Forest Temple), so skipping it as a check
  { name: "Death Mountain Howling Stone", room: "Death_Mountain_Trail", description: "In the geyser field on the path to Death Mountain" },
  { name: "Upper Zoras River Howling Stone", room: "Upper_Zoras_River", description: "At the cliff outcropping in front of the fishing hole door" },
  { name: "North Faron Woods Howling Stone", room: "Lost_Woods", description: "Just before the entrance to the Sacred Grove" },
  { name: "Lake Hylia Howling Stone", room: "Lake_Hylia", description: "Near the tower, just after climbing a ladder" },
  { name: "Snowpeak Howling Stone", room: "Snowpeak_Summit_Upper", description: "Before entering the cave to the top, at the cliff edge" },
  { name: "Hidden Village Howling Stone", room: "Hidden_Village", description: "In the backlot after smashing through a building on the left" }
];

// Convert hint signs to CheckEntry format
function createHintChecks(isGlitched: boolean = false): CheckEntry[] {
  return hintSigns.map(hint => {
    let requirements = "true";

    // Special requirements for Lanayru Spring
    if (hint.name === "Lanayru Spring Sign") {
      requirements = isGlitched
        ? "Iron_Boots or Zora_Armor or Magic_Armor"
        : "Iron_Boots or Zora_Armor";
    }
    // Use specialRequirements if provided
    else if (hint.specialRequirements) {
      requirements = hint.specialRequirements;
    }

    return {
      requirements,
      checkCategory: ["Hint"],
      itemId: "Hint" as any, // Hints don't give real items
      filename: hint.name.replace(/ /g, '_')
    };
  });
}

// Convert howling stones to CheckEntry format
function createHowlingStoneChecks(isGlitched: boolean = false): CheckEntry[] {
  return howlingStones.map(stone => {
    let requirements = "true";

    // Use specialRequirements if provided
    if (stone.specialRequirements) {
      requirements = stone.specialRequirements;
    }

    return {
      requirements,
      checkCategory: ["Howling Stone"],
      itemId: "Howling_Stone" as any,
      filename: stone.name.replace(/ /g, '_')
    };
  });
}

try {
  const rooms = loadWorldRooms();
  const checks = loadWorldChecks();
  const glitchedRooms = loadGlitchedWorldRooms();
  const glitchedChecks = loadGlitchedWorldChecks();

  // Add hint signs to both world and glitched checks
  const hintChecks = createHintChecks(false);
  const glitchedHintChecks = createHintChecks(true);

  // Add howling stones to both world and glitched checks
  const howlingStoneChecks = createHowlingStoneChecks(false);
  const glitchedHowlingStoneChecks = createHowlingStoneChecks(true);

  const checksWithExtras = [...checks, ...hintChecks, ...howlingStoneChecks];
  const glitchedChecksWithExtras = [...glitchedChecks, ...glitchedHintChecks, ...glitchedHowlingStoneChecks];

  // Add hint checks to their corresponding rooms' Checks arrays
  // This modifies the in-memory data only, not the original JSONC files
  hintSigns.forEach(hint => {
    const hintCheckName = hint.name.replace(/ /g, '_');
    // Room names in the data have spaces, but our hint.room has underscores
    const roomNameWithSpaces = hint.room.replace(/_/g, ' ');

    // Find and update the room in both world and glitched rooms
    const worldRoom = rooms.find(r => r.RoomName === roomNameWithSpaces);
    if (worldRoom) {
      if (!worldRoom.Checks.includes(hintCheckName)) {
        worldRoom.Checks.push(hintCheckName);
      }
    } else {
      console.warn(`Warning: Could not find room "${roomNameWithSpaces}" for hint "${hint.name}"`);
    }

    const glitchedRoom = glitchedRooms.find(r => r.RoomName === roomNameWithSpaces);
    if (glitchedRoom) {
      if (!glitchedRoom.Checks.includes(hintCheckName)) {
        glitchedRoom.Checks.push(hintCheckName);
      }
    }
  });

  // Add howling stone checks to their corresponding rooms' Checks arrays
  howlingStones.forEach(stone => {
    const stoneCheckName = stone.name.replace(/ /g, '_');
    const roomNameWithSpaces = stone.room.replace(/_/g, ' ');

    // Find and update the room in both world and glitched rooms
    const worldRoom = rooms.find(r => r.RoomName === roomNameWithSpaces);
    if (worldRoom) {
      if (!worldRoom.Checks.includes(stoneCheckName)) {
        worldRoom.Checks.push(stoneCheckName);
      }
    } else {
      console.warn(`Warning: Could not find room "${roomNameWithSpaces}" for howling stone "${stone.name}"`);
    }

    const glitchedRoom = glitchedRooms.find(r => r.RoomName === roomNameWithSpaces);
    if (glitchedRoom) {
      if (!glitchedRoom.Checks.includes(stoneCheckName)) {
        glitchedRoom.Checks.push(stoneCheckName);
      }
    }
  });

  const worldData = {
    rooms,
    checks: checksWithExtras,
    glitchedRooms,
    glitchedChecks: glitchedChecksWithExtras
  };

  // Write to public directory so it's accessible as a static asset
  const outputPath = join(process.cwd(), 'public', 'world-data.json');
  writeFileSync(outputPath, JSON.stringify(worldData, null, 2), 'utf-8');

  console.log(`✓ Generated world-data.json with ${rooms.length} rooms and ${checksWithExtras.length} checks (including ${hintChecks.length} hints and ${howlingStoneChecks.length} howling stones)`);
  console.log(`  Output: ${outputPath}`);
} catch (error) {
  console.error('❌ Failed to generate world-data.json:', error);
  process.exit(1);
}
