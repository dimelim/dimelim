import { BEAT, W, H } from '../time.js';
import { seg, lerp, hash, clamp } from '../../../math.js';
import { outExpo, outBack, outCubic, inQuad } from '../../../ease.js';
import { night, panel, rim, text, muted, dim, ginger, violet, azure, amber, alpha } from '../palette.js';
import { geistMono } from '../../../fonts.js';
import { frame } from '../ui.js';
import { cat, keyboard } from '../cat.js';

const X = muted;
const LINES = [
  [
    ['const ', violet],
    ['developer', text],
    [' = {', X],
  ],
  [
    ['  name', azure],
    [': ', X],
    ['"Lim"', amber],
    [',', X],
  ],
  [
    ['  role', azure],
    [': ', X],
    ['"Full-stack / Next.js"', amber],
    [',', X],
  ],
  [
    ['  stack', azure],
    [': [', X],
  ],
  [
    ['    "TypeScript"', amber],
    [', ', X],
    ['"React"', amber],
    [', ', X],
    ['"Tailwind"', amber],
    [',', X],
  ],
  [
    ['    "Node.js"', amber],
    [', ', X],
    ['"Supabase"', amber],
    [',', X],
  ],
  [['  ],', X]],
  [
    ['  vision', azure],
    [': ', X],
    ['"Mirando hacia el futuro"', amber],
    [',', X],
  ],
  [
    ['  discord', azure],
    [': ', X],
    ['"dimelim"', amber],
    [',', X],
  ],
  [['}', X]],
];
const TERMINAL = [
  ['$ npm run dev', text, 12.4],
  ['▲ Next.js', text, 14.7],
  ['- Local:   http://localhost:3000', muted, 14.9],
  ['✓ Ready', '#5EBC7B', 15.15],
];
const WIN = { x: 190, y: 120, w: 1180, h: 840 };
const CODE = { x: 300, y: 250, line: 45, size: 27 };
const TYPE_FROM = 1.0;
const TYPE_TO = 11.6;

const glyphs = (() => {
  const list = [];
  LINES.forEach((line, row) => line.forEach(([str, color]) => [...str].forEach(ch => list.push({ ch, color, row }))));
  let cost = 0;
  const costs = list.map((g, i) => {
    const next = list[i + 1];
    cost += g.ch === ' ' ? 0.35 : 1;
    if (next && next.row !== g.row) cost += 3.5;
    return cost;
  });
  return list.map((g, i) => ({ ...g, at: lerp(TYPE_FROM, TYPE_TO, costs[i] / cost), seed: i }));
})();

export const TYPED = glyphs.map(({ at, ch }) => ({ at, ch }));

function layout(ctx) {
  ctx.font = geistMono(CODE.size, 450);
  const xs = [];
  let row = -1,
    x = 0;
  for (const g of glyphs) {
    if (g.row !== row) {
      row = g.row;
      x = 0;
    }
    xs.push(x);
    x += ctx.measureText(g.ch).width;
  }
  return xs;
}

let offsets;

function code(ctx, b) {
  offsets ??= layout(ctx);
  const blast = seg(b, 15.45, 16);
  ctx.font = geistMono(CODE.size, 450);
  let cursor = null;
  glyphs.forEach((g, i) => {
    if (b < g.at) return;
    let x = CODE.x + offsets[i];
    let y = CODE.y + g.row * CODE.line;
    cursor = [x + ctx.measureText(g.ch).width, y];
    if (blast > 0) {
      const a = hash(g.seed, 1) * Math.PI * 2;
      const d = inQuad(blast) * (700 + hash(g.seed, 2) * 900);
      x += Math.cos(a) * d + (x - W / 2) * blast * 0.6;
      y += Math.sin(a) * d - 200 * blast;
      ctx.globalAlpha = 1 - blast;
    }
    ctx.fillStyle = g.color;
    ctx.fillText(g.ch, x, y);
  });
  ctx.globalAlpha = 1;
  const idle = b > TYPE_TO + 0.1;
  if (cursor && blast === 0 && (!idle || Math.floor(b * 2) % 2 === 0) && b < 12.3) {
    ctx.fillStyle = ginger;
    ctx.fillRect(cursor[0] + 2, cursor[1] - CODE.size * 0.8, 14, CODE.size);
  }
}

function gutter(ctx, b) {
  const rows = glyphs.filter(g => g.at <= b).reduce((m, g) => Math.max(m, g.row), 0);
  ctx.font = geistMono(22, 400);
  ctx.textAlign = 'right';
  for (let r = 0; r <= rows; r++) {
    ctx.fillStyle = r === rows ? muted : dim;
    ctx.fillText(String(r + 1), CODE.x - 40, CODE.y + r * CODE.line);
  }
  ctx.textAlign = 'left';
  if (b < TYPE_TO + 0.5) {
    ctx.fillStyle = alpha('#FFFFFF', 0.035);
    ctx.fillRect(WIN.x + 1, CODE.y + rows * CODE.line - 33, WIN.w - 2, CODE.line);
  }
}

function terminal(ctx, b) {
  const open = outExpo(seg(b, 12.1, 12.6));
  if (open <= 0) return;
  const top = WIN.y + WIN.h - 250 * open;
  ctx.save();
  ctx.beginPath();
  ctx.rect(WIN.x, top, WIN.w, WIN.y + WIN.h - top);
  ctx.clip();
  ctx.fillStyle = '#0F0F12';
  ctx.fillRect(WIN.x, top, WIN.w, 260);
  ctx.strokeStyle = rim;
  ctx.beginPath();
  ctx.moveTo(WIN.x, top);
  ctx.lineTo(WIN.x + WIN.w, top);
  ctx.stroke();
  ctx.font = geistMono(17, 500);
  ctx.fillStyle = dim;
  ctx.fillText('TERMINAL', WIN.x + 40, top + 36);
  ctx.font = geistMono(24, 450);
  TERMINAL.forEach(([line, color, at], i) => {
    const p = seg(b, at, at + (i ? 0.08 : 0.6));
    if (p <= 0) return;
    ctx.fillStyle = color;
    ctx.fillText(i ? line : line.slice(0, Math.ceil(p * line.length)), WIN.x + 40, top + 84 + i * 40);
  });
  ctx.restore();
}

function hero(ctx, b, t) {
  const pop = outBack(seg(b, 0.4, 1.0), 2.2);
  if (pop <= 0) return;
  const x = 1590,
    base = 900;
  const typing = b > TYPE_FROM && b < TYPE_TO + 0.2;
  const slam = seg(b, 14.3, 14.5);
  const land = Math.exp(-Math.max(0, b - 14.5) * 9) * (b > 14.5 ? 1 : 0);
  const crouch = seg(b, 15.3, 15.55);
  const jump = seg(b, 15.55, 16);
  let y = base + (1 - pop) * 300 - inQuad(jump) * 1300 + outCubic(jump) * -60;
  const sy = 1 - 0.18 * land - 0.2 * crouch * (1 - jump) + 0.25 * jump;
  const sx = 1 + 0.12 * land + 0.15 * crouch * (1 - jump) - 0.12 * jump;
  const pose = b > 13.9 && b < 14.3 ? 'raise' : typing ? 'type' : 'sit';
  const eyes = b > 14.5 && b < 15.3 ? 'happy' : undefined;
  y += Math.sin(b * Math.PI * 2) * (typing ? 3 : 0) - slam * 10;
  cat(ctx, { x, y, s: 11, t, pose, eyes, sx, sy });
  if (jump === 0) keyboard(ctx, x, base - 12, 11, (typing && Math.floor(t * 11) % 2) || land > 0.5 ? 1 : 0);
}

function draw(ctx, t) {
  const b = t / BEAT;
  ctx.fillStyle = night;
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W * 0.42, H * 0.5, 0, W * 0.42, H * 0.5, 900);
  glow.addColorStop(0, alpha(ginger, 0.07));
  glow.addColorStop(1, alpha(ginger, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = alpha('#FFFFFF', 0.05);
  for (let y = 30; y < H; y += 44) for (let x = 30; x < W; x += 44) ctx.fillRect(x, y, 2, 2);
  const show = outExpo(seg(b, 0, 0.9));
  const leave = seg(b, 15.45, 16);
  ctx.save();
  const k = lerp(0.94, 1, show) * (1 + 0.12 * inQuad(leave));
  ctx.translate(WIN.x + WIN.w / 2, WIN.y + WIN.h / 2);
  ctx.scale(k, k);
  ctx.translate(-(WIN.x + WIN.w / 2), -(WIN.y + WIN.h / 2));
  ctx.globalAlpha = show * (1 - leave);
  frame(ctx, { ...WIN, fill: panel, top: '#18181C', stroke: rim });
  ctx.font = geistMono(18, 500);
  ctx.fillStyle = muted;
  ctx.textAlign = 'center';
  ctx.fillText('developer.ts', WIN.x + WIN.w / 2, WIN.y + 35);
  ctx.textAlign = 'left';
  gutter(ctx, b);
  terminal(ctx, b);
  ctx.globalAlpha = 1;
  ctx.restore();
  code(ctx, b);
  hero(ctx, b, t);
  const flash = seg(b, 15.8, 16);
  if (flash > 0) {
    ctx.fillStyle = alpha('#FFF4E6', clamp(flash * flash));
    ctx.fillRect(0, 0, W, H);
  }
}

export default { to: 16, draw };
