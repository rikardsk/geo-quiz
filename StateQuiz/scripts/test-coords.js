import { US_STATES } from '../src/data/statesData.js';

// Let's inspect how paths are formatted
for (const s of US_STATES.slice(0, 5)) {
  console.log(s.id, s.name, s.capital, s.d.slice(0, 50));
}
