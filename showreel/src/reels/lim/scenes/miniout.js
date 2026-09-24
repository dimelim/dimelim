import { BEAT, W, H } from '../time.js';
import { seg, lerp, clamp, decay } from '../../../math.js';
import { outExpo, outBack, outQuint, outCubic, inExpo, inOutCubic, spring } from '../../../ease.js';
import { alpha } from '../palette.js';
import { newsreader, figtree } from '../../../fonts.js';
import { typed } from '../../../text.js';
import { box, pill } from '../ui.js';
import { cat } from '../cat.js';

const BG = '#1D1B17';
const CARD = '#27241E';
const CREAM = '#F4F0E6';
const SOFT = '#A8A29A';
const AMBER = '#E0891C';
const ABE = '#4F9368';
const PHONE = { x: 1230, y: 80, w: 440, h: 920 };
const NOTE = 'parcial de cálculo el viernes';
const PRESS = 104.2;

function ruled(ctx) {
  ctx.fillStyle = alpha('#FFFFFF', 0.025);
  for (let y = 40; y < H; y += 44) ctx.fillRect(0, y, W, 2);
}

function mark(ctx, b, x, y) {
  const p = seg(b, 96.1, 96.9);
  if (p <= 0) return;
  ctx.save();
  ctx.lineWidth = 24;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = CREAM;
  ctx.setLineDash([520 * outCubic(p), 600]);
  ctx.beginPath();
  ctx.moveTo(x, y + 104);
  ctx.lineTo(x, y + 12);
  ctx.lineTo(x + 56, y + 62);
  ctx.lineTo(x + 112, y + 12);
  ctx.lineTo(x + 112, y + 104);
  ctx.stroke();
  ctx.restore();
  const q = outBack(seg(b, 96.6, 97.1), 1.8);
  if (q > 0) {
    box(ctx, x - 12, y + 134, 136 * q, 24, 12);
    ctx.fillStyle = AMBER;
    ctx.fill();
  }
}

function titles(ctx, b) {
  const rows = [
    [96.5, newsreader(136, 500), CREAM, 'Miniout', 300, 330],
    [97.5, figtree(36, 400), SOFT, 'Apuntes y tareas de universidad,', 440, 170],
    [98.1, newsreader(54, 400, true), AMBER, 'donde escribir es lo primero.', 520, 170],
  ];
  for (const [at, font, color, str, y, x] of rows) {
    const p = outQuint(seg(b, at, at + 0.6));
    if (p <= 0) continue;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, y - 140, 1180, 170);
    ctx.clip();
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(str, x, y + (1 - p) * 150);
    ctx.restore();
  }
  let x = 170;
  ['React Native + Expo', 'HeroUI Native', 'Apache-2.0', 'Alfa en Android'].forEach((f, i) => {
    const p = outBack(seg(b, 106.2 + i * 0.15, 106.6 + i * 0.15), 2);
    if (p <= 0) return;
    ctx.save();
    ctx.translate(x, 640);
    ctx.scale(p, p);
    const w = pill(ctx, 0, -23, f, { font: figtree(22, 500), fg: CREAM, bg: '#2A2721', stroke: '#3A362E' });
    ctx.restore();
    x += w + 12;
  });
}

function abe(ctx, b, cx, cy, r) {
  const hop = spring(seg(b, 106.1, 106.9), 2, 5);
  const bounce = Math.sin(Math.PI * clamp(hop)) * 26;
  const y = cy - bounce + Math.sin(b * 1.4) * 4;
  ctx.fillStyle = ABE;
  ctx.beginPath();
  ctx.arc(cx, y, r, 0, Math.PI * 2);
  ctx.fill();
  const happy = b > 106.1 && b < 109;
  const blink = !happy && (b * BEAT) % 2.3 < 0.12;
  ctx.fillStyle = '#1B1A17';
  for (const ex of [cx - r * 0.42, cx - r * 0.02]) {
    if (happy) {
      ctx.strokeStyle = '#1B1A17';
      ctx.lineWidth = 9;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(ex, y + 4, 12, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
    } else {
      box(ctx, ex - 11, y - (blink ? 3 : 22), 22, blink ? 6 : 44, 11);
      ctx.fill();
    }
  }
}

function phone(ctx, b) {
  const p = outExpo(seg(b, 96.8, 97.8));
  if (p <= 0) return;
  const { x, y, w, h } = PHONE;
  ctx.save();
  ctx.translate(0, (1 - p) * 140);
  ctx.globalAlpha = p;
  box(ctx, x, y, w, h, 64);
  ctx.fillStyle = '#16140F';
  ctx.fill();
  ctx.strokeStyle = '#34302A';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.save();
  box(ctx, x + 10, y + 10, w - 20, h - 20, 56);
  ctx.clip();
  ctx.fillStyle = BG;
  ctx.fillRect(x, y, w, h);
  ctx.font = figtree(18, 500);
  ctx.fillStyle = SOFT;
  ctx.fillText('hoy', x + 40, y + 76);
  ctx.beginPath();
  ctx.arc(x + w - 58, y + 70, 22, 0, Math.PI * 2);
  ctx.fillStyle = '#2E2A23';
  ctx.fill();
  ctx.save();
  ctx.clip();
  cat(ctx, { x: x + w - 58, y: y + 116, s: 2.4, t: 0, eyes: 'happy' });
  ctx.restore();
  box(ctx, x + 26, y + 112, w - 52, 196, 32);
  ctx.fillStyle = CARD;
  ctx.fill();
  ctx.save();
  box(ctx, x + 26, y + 112, w - 52, 196, 32);
  ctx.clip();
  abe(ctx, b, x + w - 30, y + 236, 96);
  ctx.restore();
  ctx.font = newsreader(31, 500);
  ctx.fillStyle = CREAM;
  ctx.fillText('Buenas noches, Lim', x + 54, y + 200);
  ctx.font = figtree(17, 400);
  ctx.fillStyle = SOFT;
  ctx.fillText('No te queda nada por', x + 54, y + 236);
  ctx.fillText('hacer hoy.', x + 54, y + 260);
  const fy = y + 334;
  box(ctx, x + 26, fy, w - 52, 84, 30);
  ctx.fillStyle = CARD;
  ctx.fill();
  const typing = seg(b, 99.8, 102.3);
  const sent = seg(b, PRESS, PRESS + 0.5);
  ctx.font = figtree(21, 400);
  if (typing > 0 && sent < 0.5) {
    ctx.fillStyle = CREAM;
    ctx.fillText(typed(NOTE, typing), x + 52, fy + 50);
  } else if (typing === 0) {
    ctx.fillStyle = SOFT;
    ctx.fillText('Escribe algo', x + 52, fy + 50);
  }
  const press = decay(b, [PRESS], 6);
  ctx.save();
  ctx.translate(x + w - 72, fy + 42);
  ctx.scale(1 - press * 0.25, 1 - press * 0.25);
  ctx.beginPath();
  ctx.arc(0, 0, 27, 0, Math.PI * 2);
  ctx.fillStyle = AMBER;
  ctx.fill();
  ctx.strokeStyle = '#1B1A17';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.lineTo(10, 0);
  ctx.moveTo(0, -10);
  ctx.lineTo(0, 10);
  ctx.stroke();
  ctx.restore();
  let cx = x + 30;
  [
    ['Cálculo', AMBER, AMBER],
    ['viernes', CREAM, '#4A463E'],
  ].forEach(([label, fg, stroke], i) => {
    const q = outBack(seg(b, 102.6 + i * 0.25, 103 + i * 0.25), 2.2) * (1 - seg(b, PRESS, PRESS + 0.3));
    if (q <= 0) return;
    ctx.save();
    ctx.translate(cx, fy + 118);
    ctx.scale(q, q);
    cx += pill(ctx, 0, -20, label, { font: figtree(19, 600), fg, stroke, h: 40, pad: 16 }) * q + 10;
    ctx.restore();
  });
  ctx.font = newsreader(29, 500);
  ctx.fillStyle = CREAM;
  ctx.fillText('Hoy', x + 40, y + 580);
  const item = outBack(sent, 1.5);
  if (item > 0) {
    const iy = y + 606 + (1 - item) * -240;
    box(ctx, x + 26, iy, w - 52, 108, 26);
    ctx.fillStyle = CARD;
    ctx.fill();
    ctx.fillStyle = AMBER;
    ctx.beginPath();
    ctx.arc(x + 58, iy + 42, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = figtree(21, 600);
    ctx.fillStyle = CREAM;
    ctx.fillText('parcial de cálculo', x + 78, iy + 49);
    ctx.font = figtree(16, 500);
    ctx.fillStyle = AMBER;
    ctx.fillText('Cálculo  ·  viernes', x + 78, iy + 80);
  } else {
    ctx.font = figtree(17, 400);
    ctx.fillStyle = SOFT;
    ctx.fillText('Lo que escribas hoy aparece aquí.', x + 40, y + 624);
  }
  ctx.restore();
  ctx.restore();
}

function heart(ctx, x, y, s, p) {
  if (p <= 0) return;
  const rows = ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...'];
  ctx.fillStyle = alpha('#FF7A8A', clamp(p * 3));
  rows.forEach((r, j) =>
    [...r].forEach((c, i) => c === 'X' && ctx.fillRect(x + (i - 3.5) * s, y + j * s - p * 40, s, s)),
  );
}

function hero(ctx, b, t) {
  const p = outBack(seg(b, 99, 99.6), 2);
  if (p <= 0) return;
  const x = 1080,
    y = 990;
  cat(ctx, {
    x,
    y: y + (1 - p) * 320,
    s: 10,
    t,
    pose: b > 105.4 && b < 107.6 ? 'wave' : 'sit',
    eyes: b > 105.4 && b < 109 ? 'happy' : undefined,
  });
  heart(ctx, 1160, 700, 9, outCubic(seg(b, 106.4, 107.2)) * (1 - seg(b, 108.6, 109)));
}

function draw(ctx, t) {
  const b = t / BEAT;
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);
  ruled(ctx);
  const dive = inExpo(seg(b, 110.3, 112));
  const px = PHONE.x + PHONE.w - 72,
    py = PHONE.y + 334 + 42;
  ctx.save();
  const k = Math.exp(Math.log(60) * dive);
  ctx.translate(lerp(px, W / 2, inOutCubic(seg(b, 110.3, 112))), lerp(py, H / 2, inOutCubic(seg(b, 110.3, 112))));
  ctx.scale(k, k);
  ctx.translate(-px, -py);
  mark(ctx, b, 176, 160);
  titles(ctx, b);
  phone(ctx, b);
  hero(ctx, b, t);
  ctx.restore();
  if (dive > 0.6) {
    ctx.fillStyle = alpha(AMBER, clamp((dive - 0.6) / 0.4));
    ctx.fillRect(0, 0, W, H);
  }
}

export default { to: 112, draw };
