import { lerpRgb, css } from './palette.js';

export function camera({ yaw, pitch, dist, target = [0, 0, 0], focal = 1400, cx = 960, cy = 540 }) {
  const cw = Math.cos(yaw),
    sw = Math.sin(yaw),
    cp = Math.cos(pitch),
    sp = Math.sin(pitch);
  const project = ([x, y, z]) => {
    const qx = x - target[0],
      qy = y - target[1],
      qz = z - target[2];
    const x1 = qx * cw - qz * sw;
    const z1 = qx * sw + qz * cw;
    const y2 = qy * cp + z1 * sp;
    const z2 = -qy * sp + z1 * cp + dist;
    return [cx + (focal * x1) / z2, cy - (focal * y2) / z2, z2];
  };
  const eye = [target[0] - dist * cp * sw, target[1] + dist * sp, target[2] - dist * cp * cw];
  return { project, eye };
}

const LIGHT = (v => v.map(c => c / Math.hypot(...v)))([0.55, 0.75, -0.36]);
const FRONT = -LIGHT[2];

function shade(n) {
  const d = n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2];
  return d >= FRONT ? 0.5 + (0.5 * (d - FRONT)) / (1 - FRONT) : (0.5 * (d + 1)) / (FRONT + 1);
}

const ramp = ([dark, mid, light], s) => (s < 0.5 ? lerpRgb(dark, mid, s * 2) : lerpRgb(mid, light, s * 2 - 1));

const FACES = [
  { n: [0, 1, 0], v: [3, 2, 6, 7], seen: (e, b) => e[1] > b.y1 },
  { n: [0, -1, 0], v: [0, 1, 5, 4], seen: (e, b) => e[1] < b.y0 },
  { n: [-1, 0, 0], v: [0, 3, 7, 4], seen: (e, b) => e[0] < b.x0 },
  { n: [1, 0, 0], v: [1, 2, 6, 5], seen: (e, b) => e[0] > b.x1 },
  { n: [0, 0, -1], v: [0, 1, 2, 3], seen: (e, b) => e[2] < b.z0 },
  { n: [0, 0, 1], v: [4, 5, 6, 7], seen: (e, b) => e[2] > b.z1 },
];

export function boxes(ctx, cam, list, fog = () => [0, null]) {
  const items = list.map(b => ({
    b,
    d: Math.hypot((b.x0 + b.x1) / 2 - cam.eye[0], (b.y0 + b.y1) / 2 - cam.eye[1], (b.z0 + b.z1) / 2 - cam.eye[2]),
  }));
  items.sort((a, b) => b.d - a.d);
  ctx.lineJoin = 'round';
  ctx.lineWidth = 1.2;
  for (const { b, d } of items) {
    const pts = [
      [b.x0, b.y0, b.z0],
      [b.x1, b.y0, b.z0],
      [b.x1, b.y1, b.z0],
      [b.x0, b.y1, b.z0],
      [b.x0, b.y0, b.z1],
      [b.x1, b.y0, b.z1],
      [b.x1, b.y1, b.z1],
      [b.x0, b.y1, b.z1],
    ].map(cam.project);
    if (pts.some(p => p[2] < 0.05)) continue;
    const [f, fogColor] = fog(d);
    for (const face of FACES) {
      if (!face.seen(cam.eye, b)) continue;
      let color = face.n[1] > 0 && b.top ? b.top : ramp(b.colors, shade(face.n));
      if (f > 0) color = lerpRgb(color, fogColor, f);
      ctx.fillStyle = ctx.strokeStyle = css(color);
      ctx.beginPath();
      for (const i of face.v) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }
}
