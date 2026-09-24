import { BEAT, W, H, DURATION } from './time.js';
import { seg } from '../../math.js';
import { text, ginger, alpha } from './palette.js';
import { geistMono } from '../../fonts.js';
import { scramble } from '../../text.js';

const SECTIONS = [
  [16, 'HOLA'],
  [32, 'STACK'],
  [56, 'PROYECTOS'],
  [64, 'PEEKSTORE'],
  [80, 'SHIELUS'],
  [96, 'MINIOUT'],
  [112, 'VISIÓN'],
];

export function hud(ctx, t) {
  const b = t / BEAT;
  if (b < 16.3 || b >= 120) return;
  const [from, label] = SECTIONS.findLast(([s]) => b >= s);
  const a = seg(b, 16.3, 17) * 0.75;
  ctx.save();
  ctx.font = geistMono(18, 500);
  ctx.letterSpacing = '3px';
  ctx.fillStyle = alpha(text, a);
  ctx.fillText('@DIMELIM', 70, 72);
  ctx.textAlign = 'right';
  ctx.fillText(scramble(label, seg(b - from, 0, 0.4), t, from), W - 70, 72);
  ctx.textAlign = 'left';
  ctx.letterSpacing = '0px';
  ctx.fillStyle = alpha(text, a * 0.2);
  ctx.fillRect(70, H - 44, W - 140, 2);
  ctx.fillStyle = alpha(ginger, a * 1.2);
  ctx.fillRect(70, H - 44, (W - 140) * (t / DURATION), 2);
  ctx.restore();
}
