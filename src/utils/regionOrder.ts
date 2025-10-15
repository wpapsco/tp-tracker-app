// Define the logical order of regions (game progression order)
export const REGION_ORDER = [
  'Ordona Province',
  'Faron Province',
  'Eldin Province',
  'Lanayru Province',
  'Gerudo Desert',
  'Snowpeak',
  'Peak Province',
  'Forest Temple',
  'Goron Mines',
  'Lakebed Temple',
  'Arbiters Grounds',
  'Snowpeak Ruins',
  'Temple of Time',
  'City in the Sky',
  'Palace of Twilight',
  'Hyrule Castle',
];

// Sort regions by the defined order
export function sortRegions(regions: string[]): string[] {
  return regions.sort((a, b) => {
    const indexA = REGION_ORDER.indexOf(a);
    const indexB = REGION_ORDER.indexOf(b);

    // If both are in the order list, sort by their position
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    // If only A is in the list, A comes first
    if (indexA !== -1) return -1;
    // If only B is in the list, B comes first
    if (indexB !== -1) return 1;
    // If neither is in the list, sort alphabetically
    return a.localeCompare(b);
  });
}
