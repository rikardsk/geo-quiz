const fs = require('fs');

const capitals = {
  AR: { name: 'Buenos Aires', x: 228, y: 464 },
  BO: { name: 'Sucre', x: 178, y: 312 },
  BR: { name: 'Brasília', x: 312, y: 278 },
  CL: { name: 'Santiago', x: 135, y: 462 },
  CO: { name: 'Bogotá', x: 78, y: 82 },
  EC: { name: 'Quito', x: 26, y: 147 },
  GF: { name: 'Cayenne', x: 301, y: 78 },
  GY: { name: 'Georgetown', x: 231, y: 54 },
  PY: { name: 'Asunción', x: 220, y: 368 },
  PE: { name: 'Lima', x: 42, y: 232 },
  SR: { name: 'Paramaribo', x: 264, y: 72 },
  UY: { name: 'Montevideo', x: 251, y: 468 },
  VE: { name: 'Caracas', x: 148, y: 22 },
};

// Check if any capital is within 10px of border [0, 471] x [0, 700]
for (const [id, c] of Object.entries(capitals)) {
  console.log(`${id}: (${c.x}, ${c.y}) - Dist from left: ${c.x}, right: ${471 - c.x}, top: ${c.y}, bottom: ${700 - c.y}`);
}
