import { BEAT, W, H, IMPACTS } from './time.js';
import { decay, hash, lerp } from '../../math.js';
import code from './scenes/code.js';
import title from './scenes/title.js';
import stack from './scenes/stack.js';
import work from './scenes/work.js';
import peek from './scenes/peek.js';
import shield from './scenes/shield.js';
import miniout from './scenes/miniout.js';
import vision from './scenes/vision.js';
import end from './scenes/end.js';
import { hud } from './hud.js';

const scenes = [code, title, stack, work, peek, shield, miniout, vision, end];

export const setup = () => Promise.all(scenes.map(s => s.setup?.()));

function wobble(x, seed) {
  const i = Math.floor(x),
    f = x - i;
  return lerp(hash(i, seed), hash(i + 1, seed), f * f * (3 - 2 * f)) * 2 - 1;
}

function shake(ctx, t) {
  const a = 12 * decay(t / BEAT, IMPACTS, 7);
  if (a < 0.1) return;
  const k = 1 + (a * 2.5) / H;
  ctx.translate(W / 2 + a * wobble(t * 38, 1), H / 2 + a * wobble(t * 38, 2));
  ctx.scale(k, k);
  ctx.translate(-W / 2, -H / 2);
}

export function draw(ctx, t) {
  const b = t / BEAT;
  const scene = scenes.find(s => b < s.to) ?? scenes.at(-1);
  ctx.save();
  shake(ctx, t);
  scene.draw(ctx, t);
  ctx.restore();
  hud(ctx, t);
}
