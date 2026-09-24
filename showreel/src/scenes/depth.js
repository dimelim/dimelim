import { BEAT, W, H } from '../time.js';
import { seg, lerp, clamp, hash } from '../math.js';
import { spring, outQuart, inOutExpo, inOutCubic, outCubic } from '../ease.js';
import { blue, navy, sky, paper, coral, rgb, lerpRgb, alpha } from '../palette.js';
import { camera, boxes } from '../space.js';

export const HALF = 212;
const FOCAL = 1400;
const NEAR = 0.5 + (0.5 * FOCAL) / HALF;
const GAP = 1.3;
const SPAN = 7;
const COOL = [navy, sky, paper].map(rgb);
const WARM = ['#7A1E0C', coral, '#FFC9B0'].map(rgb);
const PAPER = rgb(paper),
  CORAL = rgb(coral),
  BLUE = rgb(blue);

const cells = [];
for (let i = -SPAN; i <= SPAN; i++) {
  for (let j = -SPAN; j <= SPAN; j++) {
    cells.push({ i, j, r: Math.hypot(i, j), hero: !i && !j, accent: hash(i + 50, j + 90) > 0.94 });
  }
}

function view(b) {
  const turn = inOutCubic(seg(b, 11.5, 12));
  const pull = outQuart(seg(b, 12, 13.6));
  const yaw =
    (Math.PI / 4) * turn + 0.28 * seg(b, 12, 14) + 1.65 * inOutExpo(seg(b, 14, 14.5)) + 0.35 * seg(b, 14.5, 16);
  const pitch = lerp(0.61 * turn, Math.PI / 2 - 1e-3, inOutCubic(seg(b, 14.55, 15.35)));
  const dist = lerp(NEAR, 25, pull) - 4 * outCubic(seg(b, 15, 16));
  return { cam: camera({ yaw, pitch, dist, target: [0, lerp(0.5, 0.9, pull), 0], focal: FOCAL }), dist };
}

function height(c, b) {
  if (b < 12) return c.hero ? 1 : 0;
  let h = 0.35 + 1.3 * (0.5 + 0.5 * Math.sin(c.r * 0.75 - (b - 12) * Math.PI));
  for (const k of [13, 14, 15]) {
    if (b > k) h += 2.2 * Math.exp(-((c.r - 7 * (b - k)) ** 2) / 2.5) * Math.exp(-(b - k) * 1.4);
  }
  if (c.hero) return lerp(1, h, outCubic(seg(b, 12, 12.8)));
  return h * spring(seg(b, 12 + c.r * 0.07, 12.75 + c.r * 0.07), 1.3, 5.5);
}

function field(ctx, t, heroOnly) {
  const b = t / BEAT;
  const { cam, dist } = view(b);
  const list = [];
  for (const c of cells) {
    if (heroOnly && !c.hero) continue;
    const h = height(c, b);
    if (h < 0.01) continue;
    const warm = c.hero || c.accent;
    list.push({
      x0: c.i * GAP - 0.5,
      x1: c.i * GAP + 0.5,
      z0: c.j * GAP - 0.5,
      z1: c.j * GAP + 0.5,
      y0: 0,
      y1: h,
      colors: warm ? WARM : COOL,
      top: warm ? null : lerpRgb(PAPER, CORAL, clamp((h - 1.75) / 0.9)),
    });
  }
  const fog = heroOnly ? undefined : d => [0.85 * clamp((d - dist * 0.92) / (dist * 1.1)), BLUE];
  boxes(ctx, cam, list, fog);
}

function draw(ctx, t) {
  ctx.fillStyle = blue;
  ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(W / 2, H * 0.45, 0, W / 2, H * 0.45, W * 0.6);
  g.addColorStop(0, alpha('#5563FF', 0.9));
  g.addColorStop(1, alpha(blue, 0));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  field(ctx, t, false);
}

export default { to: 15.5, draw, hero: (ctx, t) => field(ctx, t, true) };
