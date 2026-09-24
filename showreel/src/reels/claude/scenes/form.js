import { BEAT, W, H } from '../time.js';
import { seg, lerp, clamp, TAU } from '../../../math.js';
import { spring, outBack, outExpo, inOutCubic, inBack } from '../../../ease.js';
import { ink, paper, coral, blue, mix, alpha } from '../palette.js';
import depth, { HALF } from './depth.js';

const N = 240;
const R = 250;
const angle = j => -Math.PI / 2 + (TAU * j) / N;

function ngon(n, r, turn = 0, inner = 0) {
  const count = inner ? n * 2 : n;
  return Array.from({ length: count }, (_, k) => {
    const a = -Math.PI / 2 + turn + (TAU * k) / count;
    const rr = inner && k % 2 ? inner : r;
    return [Math.cos(a) * rr, Math.sin(a) * rr];
  });
}

function radii(verts) {
  const out = new Float32Array(N);
  for (let j = 0; j < N; j++) {
    const dx = Math.cos(angle(j)),
      dy = Math.sin(angle(j));
    let best = Infinity;
    verts.forEach(([ax, ay], k) => {
      const [bx, by] = verts[(k + 1) % verts.length];
      const ex = bx - ax,
        ey = by - ay;
      const den = dx * ey - dy * ex;
      if (Math.abs(den) < 1e-9) return;
      const s = (ax * ey - ay * ex) / den;
      const u = (ax * dy - ay * dx) / den;
      if (s > 0 && u > -1e-6 && u < 1 + 1e-6) best = Math.min(best, s);
    });
    out[j] = best;
  }
  return out;
}

const SHAPES = [
  { r: new Float32Array(N).fill(1), color: coral },
  { r: radii(ngon(3, 1.32)), color: blue },
  { r: radii(ngon(5, 1.34, 0, 0.56)), color: ink },
  { r: radii(ngon(4, (HALF * Math.SQRT2) / R, Math.PI / 4)), color: coral },
];

function state(b) {
  const to = clamp(Math.floor(b - 8), 0, 3);
  const from = Math.max(0, to - 1);
  const m = to === 0 ? 1 : spring(seg(b, 8 + to, 8.7 + to), 1.4, 6);
  const r = SHAPES[from].r.map((v, j) => lerp(v, SHAPES[to].r[j], m));
  let rot = 0;
  for (let i = 1; i <= 3; i++) rot += (Math.PI / 2) * outBack(seg(b, 8 + i, 8.45 + i), 2.2);
  const d = b - Math.floor(b);
  const live = b >= 8;
  const sq = live ? 0.2 * Math.exp(-5 * d) * Math.cos(TAU * 1.6 * d) : 0;
  const punch = live ? 1 + 0.12 * Math.exp(-9 * d) : 0.9 + 0.025 * Math.sin(b * TAU);
  return {
    r,
    rot,
    color: mix(SHAPES[from].color, SHAPES[to].color, clamp(m)),
    sx: punch * (1 + sq),
    sy: punch * (1 - sq),
  };
}

function shapePath(ctx, st) {
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.scale(st.sx, st.sy);
  ctx.rotate(st.rot);
  ctx.beginPath();
  for (let j = 0; j < N; j++) {
    const a = angle(j);
    ctx.lineTo(Math.cos(a) * st.r[j] * R, Math.sin(a) * st.r[j] * R);
  }
  ctx.closePath();
  ctx.restore();
}

function pluses(ctx, b, fade) {
  if (fade <= 0) return;
  ctx.strokeStyle = alpha(ink, 0.3 * fade);
  ctx.lineWidth = 2;
  for (let y = 60; y < H; y += 120) {
    for (let x = 60; x < W; x += 120) {
      const d = Math.hypot(x - W / 2, y - H / 2);
      let rot = 0,
        s = 1;
      for (const k of [8, 9, 10, 11]) {
        const p = (b - k - d / 1500) / 0.5;
        if (p >= 1) rot += Math.PI / 2;
        else if (p > 0) {
          rot += (Math.PI / 2) * outBack(p);
          s += 1.1 * Math.sin(Math.PI * p);
        }
      }
      const h = 9 * s;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.moveTo(-h, 0);
      ctx.lineTo(h, 0);
      ctx.moveTo(0, -h);
      ctx.lineTo(0, h);
      ctx.stroke();
      ctx.restore();
    }
  }
}

const BANDS = [
  { at: 8.5, y: 330, h: 120, color: ink, dir: 1 },
  { at: 9.5, y: 760, h: 84, color: blue, dir: -1 },
  { at: 10.5, y: 470, h: 150, color: coral, dir: 1 },
];

function bands(ctx, b) {
  for (const { at, y, h, color, dir } of BANDS) {
    const head = outExpo(seg(b, at, at + 0.4));
    const tail = inOutCubic(seg(b, at + 0.12, at + 0.62));
    if (head <= tail) continue;
    ctx.save();
    ctx.translate(W / 2, y);
    ctx.rotate(-0.21);
    ctx.scale(dir, 1);
    const x0 = lerp(-1400, 1400, tail),
      x1 = lerp(-1400, 1400, head);
    ctx.fillStyle = color;
    ctx.fillRect(x0, -h / 2, x1 - x0, h);
    ctx.restore();
  }
}

const ORBITERS = [
  { color: ink, r: 16, phase: 0 },
  { color: blue, r: 24, phase: 2.1 },
  { color: coral, r: 13, phase: 4.2 },
];

function orbiters(ctx, b, front, s) {
  if (s <= 0) return;
  for (const o of ORBITERS) {
    const a = o.phase + (TAU * (b - 8)) / 2;
    const z = Math.sin(a);
    if (z > 0 !== front) continue;
    const x = Math.cos(a) * 470,
      y = z * 130;
    const c = Math.cos(-0.26),
      sn = Math.sin(-0.26);
    ctx.beginPath();
    ctx.arc(W / 2 + x * c - y * sn, H / 2 + x * sn + y * c, o.r * (1 + 0.35 * z) * s, 0, TAU);
    ctx.fillStyle = front ? o.color : mix(o.color, paper, 0.25);
    ctx.fill();
  }
}

let stripes;

function hatch(ctx) {
  if (!stripes) {
    const c = document.createElement('canvas');
    c.width = c.height = 14;
    const g = c.getContext('2d');
    g.strokeStyle = ink;
    g.lineWidth = 3.4;
    g.beginPath();
    for (const o of [-14, 0, 14]) {
      g.moveTo(o - 2, 16);
      g.lineTo(o + 16, -2);
    }
    g.stroke();
    stripes = ctx.createPattern(c, 'repeat');
  }
  return stripes;
}

function draw(ctx, t) {
  const b = t / BEAT;
  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, W, H);
  const out = seg(b, 11.45, 11.85);
  pluses(ctx, b, 1 - out);
  bands(ctx, b);
  const orb = 1 - inBack(out, 2);
  orbiters(ctx, b, false, orb);
  if (b < 11.5) {
    ctx.lineWidth = 3;
    [
      [0.2, 0.22],
      [0.1, 0.5],
    ].forEach(([lag, a]) => {
      shapePath(ctx, state(b - lag));
      ctx.strokeStyle = alpha(ink, a);
      ctx.stroke();
    });
    const st = state(b);
    ctx.save();
    ctx.translate(18, 22);
    shapePath(ctx, st);
    ctx.restore();
    ctx.globalAlpha = 1 - seg(b, 11.15, 11.45);
    ctx.fillStyle = hatch(ctx);
    ctx.fill();
    ctx.globalAlpha = 1;
    shapePath(ctx, st);
    ctx.fillStyle = st.color;
    ctx.fill();
  } else {
    depth.hero(ctx, t);
  }
  orbiters(ctx, b, true, orb);
}

export default { to: 12, draw };
