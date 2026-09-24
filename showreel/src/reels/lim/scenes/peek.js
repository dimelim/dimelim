import { BEAT, W, H } from '../time.js';
import { seg, lerp, clamp } from '../../../math.js';
import { outExpo, outBack, outQuint, inOutCubic, outCubic } from '../../../ease.js';
import { night, text, muted, rim, ginger, violet, alpha } from '../palette.js';
import { geist, geistMono, newsreader } from '../../../fonts.js';
import { typed } from '../../../text.js';
import { box, frame } from '../ui.js';
import { cat } from '../cat.js';
import { dots } from './halftone.js';

const WIN = { x: 720, y: 250, w: 1100, h: 720 };
const PAGE = { x: WIN.x + 30, y: WIN.y + 90 };
const LOAD = 70;
const CARDS = [
  ['#F0923A', '#B35A8C'],
  ['#8FB8FF', '#6D5BD0'],
  ['#3ECF8E', '#2A7F8F'],
  ['#F5C06B', '#E0673D'],
];

function blocks() {
  const list = [
    [65.2, 0, 10, 130, 26, 'logo'],
    ...[0, 1, 2, 3].map(i => [65.3 + i * 0.05, 560 + i * 100, 14, 72, 18, 'menu']),
    [65.5, 1000, 8, 30, 30, 'icon'],
    [65.7, 0, 90, 470, 44, 'title'],
    [65.8, 0, 146, 380, 44, 'title'],
    [65.9, 0, 214, 440, 14, 'text'],
    [65.95, 0, 240, 400, 14, 'text'],
    [66.05, 0, 286, 170, 50, 'button'],
    [66.1, 560, 80, 480, 260, 'image'],
    ...[0, 1, 2, 3].map(i => [66.4 + i * 0.12, i * 262, 380, 238, 150, `card${i}`]),
    ...[0, 1, 2, 3].map(i => [66.5 + i * 0.12, i * 262, 548, 150, 14, 'text']),
    ...[0, 1, 2, 3].map(i => [66.55 + i * 0.12, i * 262, 574, 80, 14, 'price']),
  ];
  return list.map(([at, x, y, w, h, kind], i) => ({ at, x: PAGE.x + x, y: PAGE.y + y, w, h, kind, i }));
}

function skeleton(ctx, b) {
  const loaded = inOutCubic(seg(b, LOAD, LOAD + 1));
  const sweep = ((b - 65) / 1.3) % 1;
  for (const k of blocks()) {
    const p = outBack(seg(b, k.at, k.at + 0.4), 1.6);
    if (p <= 0) continue;
    const card = k.kind.startsWith('card') ? +k.kind.slice(4) : -1;
    const lift = card === 1 ? -12 * outCubic(seg(b, 72.2, 72.5)) * (1 - seg(b, 76.5, 76.8)) : 0;
    const grad = ctx.createLinearGradient(WIN.x + sweep * 1500 - 400, 0, WIN.x + sweep * 1500, 0);
    grad.addColorStop(0, '#1C1C20');
    grad.addColorStop(0.5, '#2A2A30');
    grad.addColorStop(1, '#1C1C20');
    ctx.save();
    ctx.translate(k.x + k.w / 2, k.y + k.h / 2 + lift);
    ctx.scale(p, p);
    ctx.translate(-(k.x + k.w / 2), -(k.y + k.h / 2));
    const r = k.kind === 'button' ? 25 : k.kind === 'icon' ? 15 : k.h > 60 ? 16 : 7;
    box(ctx, k.x, k.y, k.w, k.h, r);
    ctx.fillStyle = grad;
    ctx.fill();
    if (loaded > 0) {
      ctx.globalAlpha = loaded;
      if (card >= 0 || k.kind === 'image') {
        const [a, c] = card >= 0 ? CARDS[card] : [ginger, violet];
        const g = ctx.createLinearGradient(k.x, k.y, k.x + k.w, k.y + k.h);
        g.addColorStop(0, alpha(a, 0.85));
        g.addColorStop(1, alpha(c, 0.85));
        ctx.fillStyle = g;
      } else
        ctx.fillStyle =
          { title: text, button: ginger, logo: text, price: ginger, icon: '#2A2A30' }[k.kind] ?? '#5A5B63';
      box(ctx, k.x, k.y, k.w, k.h, r);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }
}

function pointer(ctx, b) {
  const p = seg(b, 71.4, 72.4);
  if (p <= 0) return;
  const out = seg(b, 76.5, 77.5);
  const target = [PAGE.x + 262 + 150, PAGE.y + 440];
  const x = lerp(W + 40, target[0], outCubic(p)) + out * 300;
  const y = lerp(H - 60, target[1], outCubic(p)) + out * 200;
  const click = seg(b, 73.5, 74.1);
  if (click > 0 && click < 1) {
    ctx.strokeStyle = alpha(ginger, 1 - click);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, 14 + 50 * outCubic(click), 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1.6 - 0.2 * Math.sin(Math.PI * click), 1.6 - 0.2 * Math.sin(Math.PI * click));
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 26);
  ctx.lineTo(7, 20);
  ctx.lineTo(12, 31);
  ctx.lineTo(17, 29);
  ctx.lineTo(12, 18);
  ctx.lineTo(21, 18);
  ctx.closePath();
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
}

function browser(ctx, b) {
  frame(ctx, { ...WIN, r: 20, bar: 64, fill: '#101013', top: '#18181C', stroke: rim });
  box(ctx, WIN.x + 120, WIN.y + 13, WIN.w - 170, 38, 19);
  ctx.fillStyle = '#222227';
  ctx.fill();
  const lx = WIN.x + 146,
    ly = WIN.y + 32;
  ctx.strokeStyle = muted;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(lx, ly - 3, 5, Math.PI, 0);
  ctx.stroke();
  ctx.fillStyle = muted;
  ctx.fillRect(lx - 7, ly - 3, 14, 10);
  ctx.font = geistMono(20, 450);
  ctx.fillStyle = text;
  ctx.fillText(typed('peekstore.com', seg(b, 64.3, 65.1)), WIN.x + 166, WIN.y + 39);
}

function labels(ctx, b) {
  const lines = [
    [64.4, geistMono(22, 500), ginger, '01 — trabajo', 430],
    [64.6, geist(76, 800), text, 'peekstore', 524],
    [64.75, geist(76, 800), muted, '.com', 606],
    [65.1, newsreader(44, 400, true), muted, 'donde trabajo', 690],
  ];
  for (const [at, font, color, str, y] of lines) {
    const p = outQuint(seg(b, at, at + 0.6));
    if (p <= 0) continue;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, y - 90, 700, 110);
    ctx.clip();
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(str, 120, y + (1 - p) * 100);
    ctx.restore();
  }
}

function peeker(ctx, b, t) {
  const up = [
    [67.4, 68.9, 1560],
    [70.6, 72.0, 980],
  ];
  for (const [a, z, x] of up) {
    const p = outBack(seg(b, a, a + 0.35), 2) * (1 - inOutCubic(seg(b, z - 0.3, z)));
    if (p > 0) cat(ctx, { x, y: WIN.y + 220 - 110 * p, s: 9, t, eyes: b > a + 0.8 ? 'blink' : undefined });
  }
}

function sitter(ctx, b, t) {
  const p = seg(b, 74.6, 75.2);
  if (p <= 0) return;
  const x = 1560;
  const y = lerp(WIN.y + 300, WIN.y, outCubic(p)) - Math.sin(Math.PI * p) * 120;
  const land = b > 75.2 ? Math.exp(-(b - 75.2) * 9) : 0;
  cat(ctx, {
    x,
    y,
    s: 10,
    t,
    eyes: b > 75.3 ? 'happy' : undefined,
    pose: b > 75.6 && b < 77.4 ? 'wave' : 'sit',
    sx: 1 + 0.15 * land,
    sy: 1 - 0.18 * land,
  });
}

function draw(ctx, t) {
  const b = t / BEAT;
  ctx.fillStyle = night;
  ctx.fillRect(0, 0, W, H);
  const show = outExpo(seg(b, 64, 64.8));
  const glow = ctx.createRadialGradient(
    WIN.x + WIN.w / 2,
    WIN.y + WIN.h / 2,
    0,
    WIN.x + WIN.w / 2,
    WIN.y + WIN.h / 2,
    900,
  );
  glow.addColorStop(0, alpha(ginger, 0.07));
  glow.addColorStop(1, alpha(ginger, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  peeker(ctx, b, t);
  ctx.save();
  const k = lerp(1.08, 1, show);
  ctx.translate(WIN.x + WIN.w / 2, WIN.y + WIN.h / 2);
  ctx.scale(k, k);
  ctx.translate(-(WIN.x + WIN.w / 2), -(WIN.y + WIN.h / 2));
  ctx.globalAlpha = clamp(show * 1.4);
  browser(ctx, b);
  ctx.save();
  box(ctx, WIN.x, WIN.y + 64, WIN.w, WIN.h - 64, 20);
  ctx.clip();
  skeleton(ctx, b);
  pointer(ctx, b);
  ctx.restore();
  ctx.restore();
  labels(ctx, b);
  sitter(ctx, b, t);
  dots(ctx, seg(b, 78.6, 80), '#0E0F11', true);
}

export default { to: 80, draw };
