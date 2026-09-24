import { BEAT, W, H } from '../time.js';
import { seg, lerp, rng, TAU, decay, clamp } from '../../../math.js';
import { outExpo, inExpo, inOutCubic } from '../../../ease.js';
import { ink, paper, coral, pink, violet, alpha, rgb } from '../palette.js';
import { camera } from '../../../space.js';

const COUNT = 9000;
const NODES = 150;
const RADIUS = 2.1;
const COLORS = [coral, pink, violet, paper, '#5B6BFF'];
const WEIGHTS = [0.3, 0.2, 0.2, 0.18, 0.12];
let groups, nodes, links, sprites;

function fibonacci(i, n) {
  const k = i + 0.5;
  const phi = Math.acos(1 - (2 * k) / n);
  const th = Math.PI * (1 + Math.sqrt(5)) * k;
  return [Math.cos(th) * Math.sin(phi), Math.cos(phi), Math.sin(th) * Math.sin(phi)];
}

function sprite(hex) {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const [r, gg, b] = rgb(hex);
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.18, `rgba(${r},${gg},${b},1)`);
  grad.addColorStop(0.45, `rgba(${r},${gg},${b},0.35)`);
  grad.addColorStop(1, `rgba(${r},${gg},${b},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return c;
}

function init() {
  const r = rng(7);
  const gauss = () => (r() + r() + r() - 1.5) * 1.15;
  groups = COLORS.map(() => []);
  for (let i = 0; i < COUNT; i++) {
    const u = r() * 2 - 1,
      a = r() * TAU,
      s = Math.sqrt(1 - u * u);
    const R = 0.35 + 3.4 * r() ** 1.5;
    let pick = r(),
      c = 0;
    while (pick > WEIGHTS[c] && c < COLORS.length - 1) pick -= WEIGHTS[c++];
    groups[c].push({
      dir: [s * Math.cos(a), u, s * Math.sin(a)],
      speed: 0.45 + Math.sqrt(r()) * 0.95,
      R,
      theta: ((i % 3) * TAU) / 3 + R * 1.25 + gauss() * 0.3,
      y: (gauss() * 0.16) / (0.6 + R * 0.4),
      sph: fibonacci(i, COUNT),
      delay: r(),
      size: 0.8 + r() ** 3 * 2.6,
    });
  }
  nodes = Array.from({ length: NODES }, (_, i) => fibonacci(i, NODES));
  links = [];
  nodes.forEach((a, i) =>
    nodes.forEach((b, j) => {
      if (j > i && Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) < 0.3) links.push([i, j]);
    }),
  );
  sprites = COLORS.map(sprite);
}

function spin([x, y, z], yaw, tilt) {
  const cy = Math.cos(yaw),
    sy = Math.sin(yaw);
  const x1 = x * cy - z * sy,
    z1 = x * sy + z * cy;
  const ct = Math.cos(tilt),
    st = Math.sin(tilt);
  return [x1, y * ct - z1 * st, y * st + z1 * ct];
}

function position(p, lb, tau, out) {
  const burst = 3.4 * p.speed * outExpo(seg(lb, 0, 1.1));
  const th = p.theta + tau * (0.9 / Math.sqrt(p.R));
  const w1 = inOutCubic(seg(lb, 0.3 + p.delay * 0.5, 1.4 + p.delay * 0.5));
  const w2 = outExpo(seg(lb, 2 + p.delay * 0.3, 2.5 + p.delay * 0.3));
  const w3 = inExpo(seg(lb, 3.4 + p.delay * 0.2, 3.97));
  const pulse = 1 + 0.08 * decay(lb, [3, 3.25, 3.5], 10);
  const [sx, sy, sz] = spin(p.sph, tau * 1.1, 0.35);
  let x = lerp(lerp(p.dir[0] * burst, p.R * Math.cos(th), w1), sx * RADIUS * pulse, w2);
  let y = lerp(lerp(p.dir[1] * burst, p.y, w1), sy * RADIUS * pulse, w2);
  let z = lerp(lerp(p.dir[2] * burst, p.R * Math.sin(th), w1), sz * RADIUS * pulse, w2);
  const k = 1 - w3,
    a = w3 * 4;
  out[0] = (x * Math.cos(a) - z * Math.sin(a)) * k;
  out[1] = y * k;
  out[2] = (x * Math.sin(a) + z * Math.cos(a)) * k;
}

function draw(ctx, t) {
  if (!groups) init();
  const b = t / BEAT;
  const lb = b - 20;
  const tau = lb * BEAT;
  ctx.fillStyle = ink;
  ctx.fillRect(0, 0, W, H);
  const glow = 0.25 + 0.5 * decay(b, [20, 21, 22, 23], 4) + 0.8 * seg(lb, 3.6, 4);
  const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 700);
  g.addColorStop(0, alpha(violet, 0.35 * glow));
  g.addColorStop(1, alpha(violet, 0));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  const dist = 7.2;
  const cam = camera({ yaw: 0.5 + lb * 0.3, pitch: 0.42, dist, focal: 1250 });
  const hot = Math.exp(-lb * 2.5);
  const tmp = [0, 0, 0];
  const order = outExpo(seg(lb, 2.05, 2.6));
  ctx.globalCompositeOperation = 'lighter';
  groups.forEach((list, c) => {
    for (const p of list) {
      position(p, lb, tau, tmp);
      const [x, y, z] = cam.project(tmp);
      if (z < 0.3) continue;
      const blur = Math.abs(z - dist) / 2.5;
      const s = (p.size * (1 + hot * 1.5 + 0.35 * order) * (1 + blur * 1.6) * 9) / z;
      ctx.globalAlpha = clamp((0.9 + hot + 0.5 * order) / (1 + blur * 2.2));
      ctx.drawImage(sprites[c], x - s, y - s, s * 2, s * 2);
    }
  });
  ctx.globalAlpha = 1;
  const net = seg(lb, 2.1, 2.6) * (1 - seg(lb, 3.35, 3.6));
  if (net > 0) {
    const pts = nodes.map(n => cam.project(spin(n, tau * 1.1, 0.35).map(v => v * RADIUS * 1.001)));
    ctx.strokeStyle = alpha(paper, 0.4 * net);
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    for (const [i, j] of links) {
      ctx.moveTo(pts[i][0], pts[i][1]);
      ctx.lineTo(pts[j][0], pts[j][1]);
    }
    ctx.stroke();
  }
  ctx.globalCompositeOperation = 'source-over';
}

export default { to: 24, draw };
