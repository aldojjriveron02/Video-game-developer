/* Mecha Protocol — grid, terrain, Dijkstra ranges, A* path */
'use strict';

function makeGrid(mapRows) {
  const h = mapRows.length, w = mapRows[0].length;
  const cells = [];
  for (let y = 0; y < h; y++) {
    cells[y] = [];
    for (let x = 0; x < w; x++) {
      const ch = mapRows[y][x];
      cells[y][x] = ch === 'c' ? 'cover' : ch === 'r' ? 'rough' : ch === 'w' ? 'scorched' : 'plain';  // Round 159: w = scorched (VEX duel wreckage)
    }
  }
  return { w, h, cells };
}

const inBounds = (g, x, y) => x >= 0 && y >= 0 && x < g.w && y < g.h;
const terrainAt = (g, x, y) => TERRAIN[g.cells[y][x]];
const neighbors = (g, x, y) => [[x+1,y],[x-1,y],[x,y+1],[x,y-1]].filter(([a,b]) => inBounds(g,a,b));

// Dijkstra movement range. blocked(x,y) = occupied by another mech.
function moveRange(g, sx, sy, points, blocked) {
  const dist = {}, prev = {};
  const key = (x, y) => x + ',' + y;
  dist[key(sx, sy)] = 0;
  const pq = [[0, sx, sy]];
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, x, y] = pq.shift();
    if (d > (dist[key(x, y)] ?? Infinity)) continue;
    for (const [nx, ny] of neighbors(g, x, y)) {
      if (blocked(nx, ny, sx, sy)) continue;
      const nd = d + terrainAt(g, nx, ny).moveCost;
      if (nd <= points && nd < (dist[key(nx, ny)] ?? Infinity)) {
        dist[key(nx, ny)] = nd; prev[key(nx, ny)] = [x, y];
        pq.push([nd, nx, ny]);
      }
    }
  }
  return { dist, prev };
}

function pathTo(prev, sx, sy, tx, ty) {
  const key = (x, y) => x + ',' + y;
  const path = [[tx, ty]];
  let cur = [tx, ty];
  while (!(cur[0] === sx && cur[1] === sy)) {
    const p = prev[key(cur[0], cur[1])];
    if (!p) return [];
    path.unshift(p); cur = p;
  }
  return path;
}

// Manhattan distance
const manhattan = (ax, ay, bx, by) => Math.abs(ax - bx) + Math.abs(ay - by);

// Line of sight: straight rows/cols/diagonals only (tactics-simple). Returns true if clear.
// Bresenham line-of-sight. Blocked only by terrain with blocksSight
// (no current terrain blocks sight — open desert reads as open).
function hasLine(g, ax, ay, bx, by) {
  const x1 = bx, y1 = by;
  const dx = Math.abs(x1 - ax), dy = Math.abs(y1 - ay);
  const sx = Math.sign(x1 - ax), sy = Math.sign(y1 - ay);
  let err = dx - dy, x = ax, y = ay;
  let guard = 0;
  while (!(x === x1 && y === y1) && guard++ < 64) {
    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x += sx; }
    if (e2 < dx) { err += dx; y += sy; }
    if (x === x1 && y === y1) break;
    if (x < 0 || y < 0 || x >= g.w || y >= g.h) return false;
    const t = terrainAt(g, x, y);
    if (t && t.blocksSight) return false;
  }
  return true;
}

// All tiles within weapon range with line
function tilesInRange(g, sx, sy, range) {
  const out = [];
  for (let y = 0; y < g.h; y++)
    for (let x = 0; x < g.w; x++) {
      const d = manhattan(sx, sy, x, y);
      if (d >= 1 && d <= range && hasLine(g, sx, sy, x, y)) out.push([x, y]);
    }
  return out;
}
