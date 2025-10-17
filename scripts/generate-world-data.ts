import { writeFileSync } from 'fs';
import { join } from 'path';
import { loadWorldRooms, loadWorldChecks, loadGlitchedWorldRooms, loadGlitchedWorldChecks } from '../src/logic/data/loadRooms';

console.log('Generating static world-data.json...');

try {
  const rooms = loadWorldRooms();
  const checks = loadWorldChecks();
  const glitchedRooms = loadGlitchedWorldRooms();
  const glitchedChecks = loadGlitchedWorldChecks();

  const worldData = { rooms, checks, glitchedRooms, glitchedChecks };

  // Write to public directory so it's accessible as a static asset
  const outputPath = join(process.cwd(), 'public', 'world-data.json');
  writeFileSync(outputPath, JSON.stringify(worldData, null, 2), 'utf-8');

  console.log(`✓ Generated world-data.json with ${rooms.length} rooms and ${checks.length} checks`);
  console.log(`  Output: ${outputPath}`);
} catch (error) {
  console.error('❌ Failed to generate world-data.json:', error);
  process.exit(1);
}
