import { W, H, BEAT, IMPACTS } from './time.js';
import { decay, rng } from './math.js';
import { layer, reset } from './stage.js';

let grains, red, cyan;

function makeGrain(seed) {
  const size = 512;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const img = g.createImageData(size, size);
  const r = rng(seed);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.round(128 + (r() + r() + r() - 1.5) * 150);
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  return c;
}

function aberration(ctx, amount) {
  red ??= layer();
  cyan ??= layer();
  for (const [l, tint] of [
    [red, '#ff0000'],
    [cyan, '#00ffff'],
  ]) {
    reset(l.ctx);
    l.ctx.drawImage(ctx.canvas, 0, 0, W, H);
    l.ctx.globalCompositeOperation = 'multiply';
    l.ctx.fillStyle = tint;
    l.ctx.fillRect(0, 0, W, H);
  }
  const k = amount * 0.014;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'lighter';
  ctx.drawImage(red.canvas, (-W * k) / 2, (-H * k) / 2, W * (1 + k), H * (1 + k));
  ctx.drawImage(cyan.canvas, 0, 0, W, H);
  ctx.globalCompositeOperation = 'source-over';
}

function vignette(ctx) {
  const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 1.05);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(0,0,0,0.16)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

function grain(ctx, frame) {
  grains ??= Array.from({ length: 6 }, (_, i) => makeGrain(i + 1));
  const r = rng(frame * 7919 + 13);
  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  ctx.globalAlpha = 0.07;
  ctx.fillStyle = ctx.createPattern(grains[frame % grains.length], 'repeat');
  ctx.translate(-r() * 512, -r() * 512);
  ctx.fillRect(0, 0, W + 512, H + 512);
  ctx.restore();
}

export function finish(ctx, t, frame) {
  reset(ctx);
  const hit = decay(t / BEAT, IMPACTS, 5);
  if (hit > 0.02) aberration(ctx, hit);
  vignette(ctx);
  grain(ctx, frame);
}
