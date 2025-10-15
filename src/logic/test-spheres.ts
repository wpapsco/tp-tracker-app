import { RandoLogic } from './RandoLogic';
import { loadWorldRooms, loadWorldChecks } from './data/loadRooms';
import type { SpoilerLog } from './types';
import { readFileSync } from 'fs';
import { join } from 'path';

export function testSpheres(spoilerLogPath: string = 'example-spoiler-log.json'): boolean {
    console.log('=== Starting Sphere Logic Test ===\n');

    // Load the spoiler log
    const spoilerLogContent = readFileSync(join(process.cwd(), spoilerLogPath), 'utf-8');
    const spoilerLog: SpoilerLog & { spheres?: { [sphereName: string]: { [checkName: string]: string } } } = JSON.parse(spoilerLogContent);

    if (!spoilerLog.spheres) {
        console.error('❌ ERROR: No spheres found in spoiler log');
        return false;
    }

    // Load rooms and checks data
    console.log('Loading world data...');
    const rooms = loadWorldRooms();
    const checks = loadWorldChecks();
    console.log(`Loaded ${rooms.length} rooms and ${checks.length} checks\n`);

    // Create RandoLogic instance
    console.log('Initializing RandoLogic...');
    const logic = new RandoLogic(spoilerLog, rooms, checks);
    console.log('RandoLogic initialized\n');

    // Get all spheres in order
    const sphereNames = Object.keys(spoilerLog.spheres).sort((a, b) => {
        const numA = parseInt(a.replace('Sphere ', ''));
        const numB = parseInt(b.replace('Sphere ', ''));
        return numA - numB;
    });

    console.log(`Found ${sphereNames.length} spheres to test\n`);

    // Track statistics
    let totalChecks = 0;
    let passedChecks = 0;
    let failedChecks = 0;
    const openedChecks: string[] = [];

    // Process each sphere
    for (const sphereName of sphereNames) {
        const sphereChecks = spoilerLog.spheres[sphereName];
        const checkNames = Object.keys(sphereChecks);

        console.log(`\n--- ${sphereName} (${checkNames.length} checks) ---`);

        // Get current checklist state
        const checklist = logic.getAllChecks();

        // Check each check in this sphere
        for (const checkName of checkNames) {
            totalChecks++;
            const item = sphereChecks[checkName];

            // Find the check in the checklist
            let checkData: { available: boolean; checked: boolean } | null = null;
            let foundRegion = '';
            let foundRoom = '';

            for (const [region, rooms] of Object.entries(checklist)) {
                for (const [room, checks] of Object.entries(rooms)) {
                    if (checkName in checks) {
                        checkData = checks[checkName];
                        foundRegion = region;
                        foundRoom = room;
                        break;
                    }
                }
                if (checkData) break;
            }

            if (!checkData) {
                console.error(`❌ CRITICAL ERROR: Check "${checkName}" not found in checklist!`);
                console.error(`   This check is in ${sphereName} with item: ${item}`);
                failedChecks++;
                return false;
            }

            // Verify the check is available
            if (!checkData.available) {
                console.error(`\n❌ LOGIC ERROR: Check "${checkName}" is NOT AVAILABLE but should be!`);
                console.error(`   Sphere: ${sphereName}`);
                console.error(`   Location: ${foundRegion} -> ${foundRoom}`);
                console.error(`   Expected item: ${item}`);
                console.error(`   All previous sphere checks have been opened, so this should be available.`);
                console.error(`\n   Previously opened checks (${openedChecks.length}):`);
                openedChecks.forEach((c, i) => {
                    console.error(`     ${i + 1}. ${c}`);
                });
                console.error('\n=== TEST FAILED ===');
                failedChecks++;
                return false;
            }

            // Check is available, open it
            console.log(`✓ ${checkName}: ${item} (${foundRegion})`);
            logic.openCheck(checkName);
            openedChecks.push(checkName);
            passedChecks++;
        }
    }

    // All checks passed!
    console.log('\n=== TEST PASSED ===');
    console.log(`✓ All ${totalChecks} checks across ${sphereNames.length} spheres were available when expected`);
    console.log(`  Passed: ${passedChecks}`);
    console.log(`  Failed: ${failedChecks}`);

    return true;
}

// Run the test if executed directly
if (require.main === module) {
    const success = testSpheres();
    process.exit(success ? 0 : 1);
}
