// Script to generate exact capital coordinates based on state bounding boxes and geographic offsets
import fs from 'node:fs';

// Relative positions (fraction of [minX..maxX], [minY..maxY]) for capitals inside each state
// { xPct: 0..1, yPct: 0..1 } where 0 is West/North, 1 is East/South
const CAPITAL_OFFSETS = {
  AL: { x: 0.58, y: 0.60 }, // Montgomery (central-south)
  AK: { x: 0.88, y: 0.88 }, // Juneau (southeast panhandle)
  AZ: { x: 0.40, y: 0.65 }, // Phoenix (south-central)
  AR: { x: 0.52, y: 0.55 }, // Little Rock (central)
  CA: { x: 0.35, y: 0.38 }, // Sacramento (north-central inland)
  CO: { x: 0.58, y: 0.35 }, // Denver (north-central)
  CT: { x: 0.50, y: 0.45 }, // Hartford (central)
  DE: { x: 0.45, y: 0.45 }, // Dover (central)
  FL: { x: 0.35, y: 0.12 }, // Tallahassee (panhandle)
  GA: { x: 0.40, y: 0.32 }, // Atlanta (north-central)
  HI: { x: 0.65, y: 0.62 }, // Honolulu (Oahu)
  ID: { x: 0.28, y: 0.72 }, // Boise (southwest)
  IL: { x: 0.45, y: 0.52 }, // Springfield (central)
  IN: { x: 0.52, y: 0.50 }, // Indianapolis (central)
  IA: { x: 0.48, y: 0.55 }, // Des Moines (central)
  KS: { x: 0.82, y: 0.38 }, // Topeka (northeast)
  KY: { x: 0.62, y: 0.40 }, // Frankfort (north-central)
  LA: { x: 0.62, y: 0.68 }, // Baton Rouge (southeast)
  ME: { x: 0.42, y: 0.72 }, // Augusta (south-central)
  MD: { x: 0.65, y: 0.55 }, // Annapolis (Chesapeake bay)
  MA: { x: 0.82, y: 0.48 }, // Boston (east coast)
  MI: { x: 0.68, y: 0.75 }, // Lansing (lower peninsula central)
  MN: { x: 0.62, y: 0.60 }, // Saint Paul (southeast central)
  MS: { x: 0.45, y: 0.58 }, // Jackson (central-southwest)
  MO: { x: 0.55, y: 0.52 }, // Jefferson City (central)
  MT: { x: 0.32, y: 0.52 }, // Helena (west-central)
  NE: { x: 0.85, y: 0.58 }, // Lincoln (southeast)
  NV: { x: 0.15, y: 0.38 }, // Carson City (west near Tahoe)
  NH: { x: 0.52, y: 0.68 }, // Concord (south-central)
  NJ: { x: 0.45, y: 0.48 }, // Trenton (west-central border)
  NM: { x: 0.56, y: 0.32 }, // Santa Fe (north-central)
  NY: { x: 0.78, y: 0.48 }, // Albany (east-central)
  NC: { x: 0.58, y: 0.38 }, // Raleigh (east-central)
  ND: { x: 0.46, y: 0.58 }, // Bismarck (south-central)
  OH: { x: 0.50, y: 0.52 }, // Columbus (central)
  OK: { x: 0.55, y: 0.50 }, // Oklahoma City (central)
  OR: { x: 0.30, y: 0.35 }, // Salem (northwest Willamette valley)
  PA: { x: 0.68, y: 0.62 }, // Harrisburg (south-central)
  RI: { x: 0.50, y: 0.38 }, // Providence (north-central)
  SC: { x: 0.50, y: 0.45 }, // Columbia (central)
  SD: { x: 0.48, y: 0.48 }, // Pierre (central)
  TN: { x: 0.45, y: 0.42 }, // Nashville (north-central)
  TX: { x: 0.55, y: 0.62 }, // Austin (central-south)
  UT: { x: 0.48, y: 0.22 }, // Salt Lake City (north-central)
  VT: { x: 0.48, y: 0.38 }, // Montpelier (north-central)
  VA: { x: 0.68, y: 0.52 }, // Richmond (east-central)
  WA: { x: 0.35, y: 0.65 }, // Olympia (southwest Puget sound)
  WV: { x: 0.38, y: 0.60 }, // Charleston (southwest)
  WI: { x: 0.55, y: 0.75 }, // Madison (south-central)
  WY: { x: 0.88, y: 0.88 }, // Cheyenne (southeast corner)
  DC: { x: 0.50, y: 0.50 }, // Washington, D.C.
};

// Let's run find-centers logic and compute exact points
import { execSync } from 'node:child_process';
const rawCenters = JSON.parse(execSync('node scripts/find-centers.js', { encoding: 'utf8' }));

const capitalPoints = {};
for (const [id, data] of Object.entries(rawCenters)) {
  const offset = CAPITAL_OFFSETS[id] || { x: 0.5, y: 0.5 };
  if (id === 'DC') {
    capitalPoints[id] = { x: 801.6, y: 252.1 };
    continue;
  }
  const x = Number((data.bbox.minX + offset.x * (data.bbox.maxX - data.bbox.minX)).toFixed(1));
  const y = Number((data.bbox.minY + offset.y * (data.bbox.maxY - data.bbox.minY)).toFixed(1));
  capitalPoints[id] = { x, y };
}

console.log('Capital coordinates computed:');
console.log(JSON.stringify(capitalPoints, null, 2));

// Save to a json or update statesData.ts
fs.writeFileSync('src/data/capitalCoordinates.json', JSON.stringify(capitalPoints, null, 2));
