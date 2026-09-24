import { BEAT, W, H } from '../time.js';
import { seg, lerp, clamp } from '../../../math.js';
import { outBack, outExpo, inOutCubic, inExpo, spring, inQuad, outCubic } from '../../../ease.js';
import { night, text, muted, alpha, rgb, lerpRgb } from '../palette.js';
import { geist, geistMono } from '../../../fonts.js';
import { camera, boxes } from '../../../space.js';
import { cat } from '../cat.js';

const LAYERS = [
  { name: 'Supabase', note: 'base de datos · auth', color: '#3ECF8E' },
  { name: 'Node.js', note: 'runtime', color: '#5FA04E' },
  { name: 'Next.js', note: 'framework', color: '#EDEDEF' },
  { name: 'React', note: 'librería de UI', color: '#61DAFB' },
  { name: 'HeroUI', note: 'componentes', color: '#8B6CFF' },
  { name: 'Tailwind', note: 'estilos', color: '#38BDF8' },
];
const HALF = 1.7;
const THICK = 0.46;
const ARRIVE = LAYERS.map((_, i) => 32.25 + i);
const SHELL = '#3178C6';
const WHITE = [255, 255, 255];
const shades = LAYERS.map(l => {
  const c = rgb(l.color);
  return { colors: [c.map(v => v * 0.42), c, lerpRgb(c, WHITE, 0.3)], top: lerpRgb(c, WHITE, 0.18) };
});

function gaps(b) {
  return LAYERS.map((_, i) => {
    const open = spring(seg(b, 48 + i * 0.14, 49.2 + i * 0.14), 1.2, 5);
    const close = inExpo(seg(b, 53, 54.2));
    return lerp(lerp(0.3, 1.3, open), 0.02, close);
  });
}

function levels(b) {
  const g = gaps(b);
  let y = 0;
  return LAYERS.map((_, i) => {
    const y0 = y;
    y += THICK + g[i];
    return y0;
  });
}

function landed(b) {
  return ARRIVE.reduce((n, a) => (b >= a ? n + 1 : n), 0);
}

function view(b, height) {
  const orbit = inOutCubic(seg(b, 40, 48));
  const away = inExpo(seg(b, 54.4, 56));
  const yaw = 0.72 + 0.95 * orbit + 0.25 * seg(b, 48, 56) + 2.4 * away;
  const dist = lerp(15.5, 21, outCubic(seg(b, 47.5, 50))) - 5.5 * inOutCubic(seg(b, 52.5, 54.4)) + 60 * away;
  return camera({
    yaw,
    pitch: 0.5 + 0.1 * orbit,
    dist,
    target: [0, height / 2, 0],
    focal: 1500,
    cx: W / 2,
    cy: H / 2 + 40,
  });
}

function hop(b, ys) {
  const n = landed(b);
  const top = i => (i < 0 ? 12 : ys[i] + THICK);
  for (let i = 0; i < ARRIVE.length; i++) {
    const p = seg(b, ARRIVE[i] - 0.42, ARRIVE[i] + 0.12);
    if (p > 0 && p < 1) return { y: lerp(top(i - 1), top(i), p) + (i ? 1.4 * Math.sin(Math.PI * p) : 0), air: true };
  }
  return { y: top(n - 1), air: false };
}

function floor(ctx, cam) {
  ctx.lineWidth = 1;
  for (let k = -7; k <= 7; k++) {
    for (const [a, b] of [
      [
        [k * 0.85, -0.3, -6],
        [k * 0.85, -0.3, 6],
      ],
      [
        [-6, -0.3, k * 0.85],
        [6, -0.3, k * 0.85],
      ],
    ]) {
      const p = cam.project(a),
        q = cam.project(b);
      if (p[2] < 0.1 || q[2] < 0.1) continue;
      ctx.strokeStyle = alpha(text, 0.07 * (1 - Math.abs(k) / 8));
      ctx.beginPath();
      ctx.moveTo(p[0], p[1]);
      ctx.lineTo(q[0], q[1]);
      ctx.stroke();
    }
  }
}

function corners(cam, y) {
  return [
    [-HALF, y, -HALF],
    [HALF, y, -HALF],
    [HALF, y, HALF],
    [-HALF, y, HALF],
  ].map(cam.project);
}

function labels(ctx, b, cam, ys, fade) {
  LAYERS.forEach((l, i) => {
    const p = outExpo(seg(b, ARRIVE[i] + 0.05, ARRIVE[i] + 0.55));
    if (p <= 0) return;
    const pts = corners(cam, ys[i] + THICK / 2);
    const left = i % 2 === 0;
    const anchor = pts.reduce((m, q) => (left ? (q[0] < m[0] ? q : m) : q[0] > m[0] ? q : m));
    const lx = left ? 560 : W - 560;
    const ly = anchor[1];
    ctx.globalAlpha = p * fade;
    ctx.strokeStyle = alpha(text, 0.35);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(anchor[0], anchor[1]);
    ctx.lineTo(lerp(anchor[0], lx, p), ly);
    ctx.stroke();
    ctx.fillStyle = l.color;
    ctx.beginPath();
    ctx.arc(anchor[0], anchor[1], 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.textAlign = left ? 'right' : 'left';
    const tx = lx + (left ? -18 : 18) + (1 - p) * (left ? -40 : 40);
    ctx.font = geist(46, 700);
    ctx.fillStyle = text;
    ctx.fillText(l.name, tx, ly + 6);
    ctx.font = geistMono(20, 450);
    ctx.fillStyle = muted;
    ctx.fillText(l.note, tx, ly + 38);
    ctx.textAlign = 'left';
  });
  ctx.globalAlpha = 1;
}

function shell(ctx, b, cam, height, fade) {
  const p = outBack(seg(b, 39.4, 40.1), 1.8);
  if (p <= 0) return;
  const m = 0.35 + (1 - p) * 0.6;
  const x = HALF + m,
    y0 = -0.2,
    y1 = height + m;
  const v = [
    [-x, y0, -x],
    [x, y0, -x],
    [x, y1, -x],
    [-x, y1, -x],
    [-x, y0, x],
    [x, y0, x],
    [x, y1, x],
    [-x, y1, x],
  ].map(cam.project);
  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
  ];
  ctx.globalAlpha = clamp(p) * fade;
  ctx.fillStyle = alpha(SHELL, 0.1);
  for (const f of [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [3, 2, 6, 7],
    [0, 3, 7, 4],
    [1, 2, 6, 5],
  ]) {
    ctx.beginPath();
    f.forEach(i => ctx.lineTo(v[i][0], v[i][1]));
    ctx.fill();
  }
  ctx.strokeStyle = alpha('#6FA8FF', 0.9);
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (const [a, c] of edges) {
    ctx.moveTo(v[a][0], v[a][1]);
    ctx.lineTo(v[c][0], v[c][1]);
  }
  ctx.stroke();
  const corner = [v[2], v[3], v[6], v[7]].reduce((m, q) => (q[0] < m[0] ? q : m));
  const lx = 560;
  const ly = corner[1] - 40;
  ctx.strokeStyle = alpha('#6FA8FF', 0.5);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(corner[0], corner[1]);
  ctx.lineTo(lx, ly);
  ctx.stroke();
  ctx.textAlign = 'right';
  ctx.font = geist(46, 700);
  ctx.fillStyle = '#6FA8FF';
  ctx.fillText('TypeScript', lx - 18, ly + 6);
  ctx.font = geistMono(20, 450);
  ctx.fillStyle = muted;
  ctx.fillText('tipos en todo', lx - 18, ly + 38);
  ctx.textAlign = 'left';
  ctx.globalAlpha = 1;
}

function draw(ctx, t) {
  const b = t / BEAT;
  ctx.fillStyle = night;
  ctx.fillRect(0, 0, W, H);
  const ys = levels(b);
  const n = landed(b);
  const height = n ? ys[n - 1] + THICK : 0.5;
  const cam = view(b, lerp(0.5, height, 1));
  const fade = 1 - seg(b, 53.1, 53.8);
  const word = outExpo(seg(b, 32, 33.5)) * (1 - seg(b, 54.4, 55.4));
  if (word > 0) {
    ctx.font = geist(300, 800);
    ctx.textAlign = 'center';
    ctx.fillStyle = alpha(text, 0.035 * word);
    ctx.fillText('Full-stack', W / 2, H / 2 + 110 + (1 - word) * 60);
    ctx.textAlign = 'left';
  }
  floor(ctx, cam);
  const list = [];
  LAYERS.forEach((l, i) => {
    const slide = outBack(seg(b, ARRIVE[i] - 0.34, ARRIVE[i] + 0.06), 1.4);
    if (slide <= 0) return;
    const dx = (1 - slide) * 9;
    list.push({ x0: -HALF + dx, x1: HALF + dx, z0: -HALF, z1: HALF, y0: ys[i], y1: ys[i] + THICK, ...shades[i] });
  });
  boxes(ctx, cam, list);
  shell(ctx, b, cam, height, fade);
  labels(ctx, b, cam, ys, fade);
  const { y, air } = hop(b, ys);
  const feet = cam.project([0, y, 0]);
  const fall = seg(b, 31.9, 32.37);
  const since = ARRIVE.map(a => b - a - 0.12).filter(d => d >= 0);
  const land = since.length ? Math.exp(-Math.min(...since) * 9) : 0;
  const s = clamp(1 - inExpo(seg(b, 54.4, 55.4)));
  if (fall > 0 && s > 0) {
    cat(ctx, {
      x: feet[0],
      y: fall < 1 ? lerp(-250, feet[1], inQuad(fall)) : feet[1],
      s: 8 * s,
      t,
      eyes: air ? 'happy' : land > 0.3 ? 'happy' : undefined,
      sx: 1 + 0.15 * land - (air ? 0.08 : 0),
      sy: 1 - 0.18 * land + (air ? 0.12 : 0),
    });
  }
}

export default { to: 56, draw };
