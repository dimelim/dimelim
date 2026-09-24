import { hash } from '../../math.js';

const COLORS = {
  O: '#F0923A',
  D: '#C9661F',
  W: '#FFF4E6',
  S: '#E2D0BC',
  P: '#FF9AA2',
  N: '#F37C86',
  E: '#2B1B14',
  H: '#FFFFFF',
  M: '#78402C',
  K: '#101012',
  G: '#6B6F78',
  B: '#5865F2',
  L: '#9DA8FF',
  A: '#3A3C44',
  C: '#55585F',
};
const SIZE = [24, 23];
const BODY = [
  '........................',
  '.....O............O.....',
  '.....OO..........OO.....',
  '.....OPO........OPO.....',
  '.....OPPOOOOOOOOPPO.....',
  '....OOOOODODDODOOOOO....',
  '....DOOOOODOODOOOOOD....',
  '...DOOOOOOOWWOOOOOOOD...',
  '...DOOOOOOOWWOOOOOOOD...',
  '...DOOOOOOWWWWOOOOOOD...',
  '...DOOOOOWWWWWWOOOOOD...',
  '...DONOOWWWPPWWWOONOD...',
  '....DOOWWWMWWMWWWOOD....',
  '.....OOWWWWMMWWWWOO.....',
  '......OOSWWWWWWSOO......',
  '.......OOWWWWWWOO.......',
  '......OOOWWWWWWOOO......',
  '.....OOOOWWWWWWOOOO.....',
  '.....DOOOWWWWWWOOOD.....',
  '.....DOOOWWWWWWOOOD.....',
  '.....DOWWWOWWOWWWOD.....',
  '......DWWWDDDDWWWD......',
  '........................',
];
const EYES = {
  open: [
    [6, 8, 'H'],
    [7, 8, 'E'],
    [6, 9, 'E'],
    [7, 9, 'E'],
    [6, 10, 'E'],
    [7, 10, 'E'],
    [16, 8, 'H'],
    [17, 8, 'E'],
    [16, 9, 'E'],
    [17, 9, 'E'],
    [16, 10, 'E'],
    [17, 10, 'E'],
  ],
  blink: [
    [6, 9, 'E'],
    [7, 9, 'E'],
    [16, 9, 'E'],
    [17, 9, 'E'],
  ],
  happy: [
    [6, 8, 'E'],
    [7, 8, 'E'],
    [5, 9, 'E'],
    [8, 9, 'E'],
    [16, 8, 'E'],
    [17, 8, 'E'],
    [15, 9, 'E'],
    [18, 9, 'E'],
  ],
  shades: [
    ...[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map(x => [x, 8, 'K']),
    ...[5, 6, 7, 8, 15, 16, 17, 18].map(x => [x, 9, 'K']),
    [6, 10, 'K'],
    [7, 10, 'K'],
    [16, 10, 'K'],
    [17, 10, 'K'],
    [6, 9, 'G'],
    [16, 9, 'G'],
  ],
};
const TAILS = [
  [
    [19, 21, 'O'],
    [20, 21, 'O'],
    [21, 20, 'O'],
    [22, 20, 'O'],
    [22, 19, 'O'],
    [22, 18, 'D'],
    [21, 17, 'O'],
    [20, 17, 'O'],
  ],
  [
    [19, 21, 'O'],
    [20, 21, 'O'],
    [21, 20, 'O'],
    [21, 19, 'O'],
    [22, 18, 'O'],
    [22, 17, 'O'],
    [22, 16, 'D'],
    [21, 15, 'O'],
  ],
  [
    [19, 21, 'O'],
    [20, 21, 'O'],
    [21, 21, 'O'],
    [22, 20, 'O'],
    [23, 19, 'O'],
    [23, 18, 'D'],
    [22, 17, 'O'],
  ],
];
const LOWER = [
  [7, 20, 'O'],
  [8, 20, 'O'],
  [9, 20, 'O'],
  [7, 21, 'D'],
  [8, 21, 'D'],
  [9, 21, 'D'],
];
const ARMS = {
  down: [],
  up: [
    ...LOWER,
    [4, 15, 'O'],
    [4, 14, 'O'],
    [3, 14, 'O'],
    [3, 13, 'O'],
    [2, 13, 'O'],
    [2, 12, 'O'],
    [3, 12, 'D'],
    [1, 12, 'W'],
    [0, 9, 'W'],
    [1, 9, 'W'],
    [2, 9, 'W'],
    [0, 10, 'W'],
    [1, 10, 'P'],
    [2, 10, 'W'],
    [0, 11, 'W'],
    [1, 11, 'W'],
    [2, 11, 'W'],
    [1, 8, 'W'],
  ],
  tilt: [
    ...LOWER,
    [4, 15, 'O'],
    [4, 14, 'O'],
    [3, 14, 'O'],
    [3, 13, 'O'],
    [3, 12, 'O'],
    [2, 12, 'D'],
    [2, 11, 'W'],
    [1, 8, 'W'],
    [2, 8, 'W'],
    [3, 8, 'W'],
    [1, 9, 'W'],
    [2, 9, 'P'],
    [3, 9, 'W'],
    [1, 10, 'W'],
    [2, 10, 'W'],
    [3, 10, 'W'],
    [2, 7, 'W'],
  ],
  left: [
    [7, 21, 'D'],
    [8, 21, 'D'],
    [9, 21, 'D'],
    [7, 19, 'W'],
    [8, 19, 'W'],
    [9, 19, 'W'],
  ],
  right: [
    [14, 21, 'D'],
    [15, 21, 'D'],
    [16, 21, 'D'],
    [14, 19, 'W'],
    [15, 19, 'W'],
    [16, 19, 'W'],
  ],
};
const PROPS = {
  shield: [
    '...LLLLLLL...',
    '..LBBBBBBBL..',
    '.LBBWWWWWBBL.',
    '.LBWBBBBBBBL.',
    '.LBWBBBBBBBL.',
    '.LBBWWWWBBBL.',
    '.LBBBBBBWBBL.',
    '.LBBBBBBWBBL.',
    '..LBWWWWBBL..',
    '..LBBBBBBBL..',
    '...LBBBBBL...',
    '....LBBBL....',
    '.....LLL.....',
  ],
  shades: ['KKKKKKKKKKKKKK', 'KGKK......KGKK', '.KK........KK.'],
  keys: [
    '.CCCCCCCCCCCCCCCCCCCCCC.',
    'CAGAGAGAGAGAGAGAGAGAGAAC',
    'CAAGAGAGAGAGAGAGAGAGAGAC',
    'CAGAAGGGGGGGGGGGGGGAAGAC',
    '.CCCCCCCCCCCCCCCCCCCCCC.',
  ],
};
const cache = new Map();

function paint(rows, edits = []) {
  const [w, h] = [rows[0].length, rows.length];
  const grid = rows.map(r => [...r]);
  for (const [x, y, c] of edits) grid[y][x] = c;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const g = canvas.getContext('2d');
  grid.forEach((row, y) =>
    row.forEach((c, x) => {
      if (!COLORS[c]) return;
      g.fillStyle = COLORS[c];
      g.fillRect(x, y, 1, 1);
    }),
  );
  return canvas;
}

function sprite(eyes, arm, tail) {
  const key = `${eyes}/${arm}/${tail}`;
  if (!cache.has(key)) cache.set(key, paint(BODY, [...TAILS[tail], ...ARMS[arm], ...EYES[eyes]]));
  return cache.get(key);
}

function prop(name) {
  if (!cache.has(name)) cache.set(name, paint(PROPS[name]));
  return cache.get(name);
}

export function mood(t, seed = 0) {
  const period = 2.6 + hash(seed, 7) * 0.8;
  const phase = (t + hash(seed, 3) * period) % period;
  return phase < 0.13 ? 'blink' : 'open';
}

export function cat(ctx, o) {
  const { x, y, s = 10, t = 0, eyes = mood(t), pose = 'sit', sx = 1, sy = 1, rot = 0, holding } = o;
  const arm = {
    sit: 'down',
    raise: 'up',
    wave: Math.floor(t * 6) % 2 ? 'tilt' : 'up',
    type: Math.floor(t * 11) % 2 ? 'left' : 'right',
  }[pose];
  const tail = Math.floor(t * 2.5) % 3;
  const [w, h] = SIZE;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(sx, sy);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(sprite(eyes, arm, tail), (-w / 2) * s, -(h - 1) * s, w * s, h * s);
  if (holding) {
    const p = prop(holding);
    ctx.drawImage(p, (-p.width / 2 + 3) * s, -(h - 1) * s + 11 * s, p.width * s, p.height * s);
  }
  ctx.restore();
}

export function shades(ctx, x, y, s, drop) {
  const p = prop('shades');
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(p, x - 7 * s, y - 14 * s - drop, p.width * s, p.height * s);
  ctx.restore();
}

export function keyboard(ctx, x, y, s, press = 0) {
  const p = prop('keys');
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(p, x - (p.width / 2) * s, y + press * s, p.width * s, p.height * s);
  ctx.restore();
}
