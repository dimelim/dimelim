import { BEAT, W, H, FPS } from './time.js';
import { seg, lerp, clamp } from '../../math.js';
import { outExpo } from '../../ease.js';
import { ink, paper, coral, alpha } from './palette.js';
import { mono } from '../../fonts.js';
import { scramble } from '../../text.js';

const CHAPTERS = [
  {
    from: 8,
    n: '01',
    name: 'FORM',
    color: ink,
    notes: ['anticipation', 'squash & stretch', 'overshoot', 'follow-through'],
  },
  { from: 12, n: '02', name: 'DEPTH', color: paper, notes: ['camera reveal', 'wave field', 'whip pan', 'top-down'] },
  { from: 16, n: '03', name: 'FLOW', color: paper, notes: ['domain warp', 'metaballs', 'refraction', 'merge'] },
  { from: 20, n: '04', name: 'SYSTEMS', color: paper, notes: ['9,000 particles', 'chaos', 'order', 'collapse'] },
  { from: 24, n: '05', name: 'TYPE', color: ink, notes: ['kinetic type', 'variable fonts', 'rhythm', 'motion'] },
  { from: 28, n: '', name: '', color: paper, notes: [] },
];

function timecode(t) {
  const f = Math.floor(t * FPS);
  const ss = Math.floor(f / FPS),
    ff = f % FPS;
  return `00:00:${String(ss).padStart(2, '0')}:${String(ff).padStart(2, '0')}`;
}

function corners(ctx, p) {
  const inset = lerp(260, 44, p),
    arm = 28;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (const [sx, sy] of [
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
  ]) {
    const x = sx > 0 ? inset : W - inset;
    const y = sy > 0 ? inset * 0.6 : H - inset * 0.6;
    ctx.moveTo(x + sx * arm, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + sy * arm);
  }
  ctx.stroke();
}

export function hud(ctx, t) {
  const b = t / BEAT;
  if (b < 8) return;
  const chapter = CHAPTERS.findLast(c => b >= c.from);
  const color = b >= 27 && b < 28 ? paper : chapter.color;
  const p = outExpo(seg(b, 8, 8.6));
  const reveal = seg(b, 8.1, 8.9);
  ctx.save();
  ctx.strokeStyle = alpha(color, 0.9);
  corners(ctx, p);
  ctx.font = mono(15, 600);
  ctx.letterSpacing = '2px';
  ctx.fillStyle = alpha(color, 0.9);
  ctx.fillText(scramble('CLAUDE — MOTION REEL 2026', reveal, t, 1), 80, 84);
  ctx.textAlign = 'right';
  ctx.fillText(scramble(`REC  ${timecode(t)}`, reveal, t, 2), W - 80, 84);
  const w = ctx.measureText(`REC  ${timecode(t)}`).width;
  ctx.fillStyle = alpha(coral, 0.4 + 0.6 * Math.exp(-(b % 1) * 5));
  ctx.beginPath();
  ctx.arc(W - 80 - w - 16, 79, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = alpha(color, 0.9);
  ctx.fillText(scramble('1920×1080 · 60 FPS · 0 KEYFRAMES', reveal, t, 3), W - 80, H - 66);
  ctx.textAlign = 'left';
  if (chapter.n) {
    const into = b - chapter.from;
    const swap = seg(into, 0, 0.35);
    ctx.fillText(scramble(`${chapter.n} / 05 — ${chapter.name}`, Math.min(reveal, swap), t, 4), 80, H - 66);
    const note = chapter.notes[clamp(Math.floor(into), 0, 3)];
    ctx.font = mono(15, 400);
    ctx.fillStyle = alpha(color, 0.6);
    ctx.fillText(scramble(`→ ${note}`, seg(into % 1, 0, 0.3), t, 5), 80, H - 92);
  }
  ctx.restore();
}
