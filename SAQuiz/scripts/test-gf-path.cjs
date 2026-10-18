const fs = require('fs');

// Suriname border going south (from north coast to southern point with Brazil):
// S to N:
// M284.5,71.0 L283.9,74.9 L279.8,79.5 L279.4,85.7 L280.3,90.7 L283.3,95.1 L283.8,97.0 L281.4,100.5 L281.8,102.2 L279.5,107.1 L276.7,108.9
// Brazil border from (276.7, 108.9) along Tumuk Humak to Oyapock mouth:
// L281.7,111.4 L285.1,109.4 L290.3,109.2 L294.4,111.3 L297.2,109.5 L305.7,95.4 L308.1,92.6 L311.3,91.4 L311.3,87.8
// Coastline from Oyapock mouth back to Maroni mouth:
// L306.8,83.0 L301.5,78.2 L296.2,75.0 L290.5,72.4 Z

const gfD = "M284.5,71.0 L283.9,74.9 L279.8,79.5 L279.4,85.7 L280.3,90.7 L283.3,95.1 L283.8,97.0 L281.4,100.5 L281.8,102.2 L279.5,107.1 L276.7,108.9 L281.7,111.4 L285.1,109.4 L290.3,109.2 L294.4,111.3 L297.2,109.5 L305.7,95.4 L308.1,92.6 L311.3,91.4 L311.3,87.8 L306.8,83.0 L301.5,78.2 L296.2,75.0 L290.5,72.4 Z";

console.log('GF D:', gfD);
