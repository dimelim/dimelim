import { BEAT, W, H } from '../time.js';
import { seg, lerp, decay } from '../../../math.js';
import { spring, outBack, outQuint, inQuad, inOutCubic, outCubic } from '../../../ease.js';
import { night, text, muted, ginger, alpha } from '../palette.js';
import { geist, geistMono } from '../../../fonts.js';
import { typed } from '../../../text.js';
import { bubble } from '../ui.js';
import { cat } from '../cat.js';

const NAME = [...'Lim'];
const LEFT = 440;
const BASE = 650;
const SIZE = 400;
const TICKER = 'FULL-STACK · NEXT.JS · TYPESCRIPT · REACT · TAILWIND · NODE.JS · SUPABASE · HEROUI · ';
const BEATS = [24, 25, 26, 27, 28];

function ticker(ctx, b, y, dir) {
  const a = seg(b, 16.5, 17.5);
  if (a <= 0) return;
  ctx.font = geistMono(22, 500);
  ctx.letterSpacing = '4px';
  const unit = ctx.measureText(TICKER).width;
  const shift = (((dir * (b - 16) * 70) % unit) + unit) % unit;
  ctx.fillStyle = alpha(text, 0.22 * a);
  ctx.fillText(TICKER.repeat(4), shift - unit, y);
  ctx.letterSpacing = '0px';
}

function name(ctx, b) {
  let x = LEFT;
  const punch = decay(b, BEATS, 7);
  NAME.forEach((ch, i) => {
    const p = seg(b, 16 + i * 0.12, 17.1 + i * 0.12);
    if (p <= 0) return;
    const s = spring(p, 1.6, 5);
    ctx.font = geist(SIZE, lerp(400, 900, outQuint(p)));
    const w = ctx.measureText(ch).width;
    ctx.save();
    ctx.translate(x + w / 2, BASE);
    ctx.scale(1 + punch * 0.03, 1 - punch * 0.05 + (1 - outCubic(p)) * 0.4);
    ctx.fillStyle = text;
    ctx.textAlign = 'center';
    ctx.fillText(ch, 0, -(1 - s) * 420);
    ctx.restore();
    ctx.font = geist(SIZE, 900);
    x += ctx.measureText(ch).width;
  });
  ctx.textAlign = 'left';
  ctx.font = geist(SIZE, 900);
  return LEFT + ctx.measureText('Lim').width;
}

function subtitle(ctx, b) {
  const p = outQuint(seg(b, 18, 18.7));
  if (p > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, BASE + 50, W, 90);
    ctx.clip();
    ctx.font = geist(58, 500);
    ctx.fillStyle = text;
    ctx.fillText('Dev full-stack', LEFT + 8, BASE + 118 + (1 - p) * 90);
    ctx.restore();
  }
  const q = seg(b, 19, 19.6);
  if (q > 0) {
    ctx.font = geist(58, 500);
    const x0 = LEFT + 8 + ctx.measureText('Dev full-stack ').width;
    ctx.font = geist(58, lerp(300, 750, outQuint(q)));
    ctx.fillStyle = ginger;
    ctx.fillText('/ Next.js', x0 + (1 - outBack(q, 2.5)) * 160, BASE + 118);
  }
  const r = seg(b, 20, 21.2);
  if (r > 0) {
    ctx.font = geistMono(24, 450);
    ctx.fillStyle = muted;
    ctx.fillText(typed('@dimelim  ·  Colombia', r), LEFT + 10, BASE + 190);
  }
}

function hero(ctx, b, t, right) {
  const fall = seg(b, 16.35, 16.95);
  if (fall <= 0) return;
  const land = b > 16.95 ? Math.exp(-(b - 16.95) * 8) : 0;
  const crouch = seg(b, 29.6, 30);
  const jump = seg(b, 30, 30.7);
  const x = right + 170;
  let y = lerp(-200, BASE, inQuad(fall)) - inQuad(jump) * 1100;
  const bob = b > 20 && b < 29.5 ? Math.abs(Math.sin(b * Math.PI)) * 10 : 0;
  y -= bob;
  const sx = 1 + 0.16 * land + 0.14 * crouch * (1 - jump) - 0.1 * jump;
  const sy = 1 - 0.2 * land - 0.18 * crouch * (1 - jump) + 0.22 * jump + (1 - fall) * 0.15;
  const waving = b > 17.4 && b < 20.2;
  cat(ctx, { x, y, s: 12, t, pose: waving ? 'wave' : 'sit', eyes: waving || b > 29.6 ? 'happy' : undefined, sx, sy });
  const pop = outBack(seg(b, 17.6, 17.9), 3) * (1 - seg(b, 20.3, 20.5));
  bubble(ctx, x + 70, y - 280, 'miau', 6, pop);
}

function draw(ctx, t) {
  const b = t / BEAT;
  ctx.fillStyle = night;
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W * 0.45, H * 0.52, 0, W * 0.45, H * 0.52, 1000);
  glow.addColorStop(0, alpha(ginger, 0.08 + 0.06 * decay(b, BEATS, 5)));
  glow.addColorStop(1, alpha(ginger, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  ctx.save();
  ctx.translate(0, 1150 * inOutCubic(seg(b, 30.6, 32)));
  ticker(ctx, b, 118, -1);
  ticker(ctx, b, 1000, 1);
  const right = name(ctx, b);
  subtitle(ctx, b);
  ctx.restore();
  hero(ctx, b, t, right);
}

export default { to: 32, draw };
