import { W, H } from '../time.js';
import { clamp } from '../../../math.js';

const STEP = 40;

export function dots(ctx, p, color, fromRight = false) {
  if (p <= 0) return;
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let y = STEP / 2; y < H + STEP; y += STEP) {
    for (let x = STEP / 2; x < W + STEP; x += STEP) {
      const lag = (fromRight ? W - x : x) / W;
      const q = clamp(p * 1.7 - lag * 0.7);
      if (q <= 0) continue;
      const r = q * STEP * 0.75;
      ctx.moveTo(x + r, y);
      ctx.arc(x, y, r, 0, Math.PI * 2);
    }
  }
  ctx.fill();
}

export function field(ctx, t, color, strength = 1) {
  const step = 22;
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let y = step / 2; y < H; y += step) {
    for (let x = step / 2; x < W; x += step) {
      const d = (x * 0.8 + y) / 1400;
      const wave = 0.5 + 0.5 * Math.sin(d * 7 - t * 1.6);
      const edge = clamp(1.2 - Math.abs(x / W - 0.85) * 2.2 - (y / H) * 0.3);
      const r = step * 0.36 * wave * edge * strength;
      if (r < 0.4) continue;
      ctx.moveTo(x + r, y);
      ctx.arc(x, y, r, 0, Math.PI * 2);
    }
  }
  ctx.fill();
}
