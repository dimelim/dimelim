import { BEAT, W, H } from '../time.js';
import { seg, lerp, clamp, TAU, hash } from '../../../math.js';
import { bezier, outExpo, outBack, inOutCubic, outCubic, inBack, inCubic } from '../../../ease.js';
import { ink, paper, coral, alpha } from '../palette.js';
import { mono } from '../../../fonts.js';
import { typed } from '../../../text.js';

const ease = bezier(0.7, 0, 0.2, 1);
const box = { x: 500, y: 185, s: 670 };
const gx = v => box.x + v * box.s;
const gy = v => box.y + box.s - v * box.s;
const handles = [
  [0, 0],
  [0.7, 0],
  [0.2, 1],
  [1, 1],
];
const track = 1375;
const CODE = 'ease: cubic-bezier(.70, .00, .20, 1.00);';

function curvePoint(u) {
  const m = 1 - u;
  const k = [m * m * m, 3 * m * m * u, 3 * m * u * u, u * u * u];
  const x = handles.reduce((s, p, i) => s + p[0] * k[i], 0);
  const y = handles.reduce((s, p, i) => s + p[1] * k[i], 0);
  return [gx(x), gy(y)];
}

function line(ctx, x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function dots(ctx, a) {
  if (a <= 0) return;
  ctx.fillStyle = alpha(paper, a);
  for (let y = 30; y < H; y += 40) for (let x = 20; x < W; x += 40) ctx.fillRect(x - 1, y - 1, 2, 2);
}

function axes(ctx, b) {
  ctx.lineWidth = 1;
  ctx.strokeStyle = alpha(paper, 0.12);
  for (let i = 1; i <= 4; i++) {
    const g = outExpo(seg(b, 0.15 + i * 0.07, 0.85 + i * 0.07));
    if (g <= 0) continue;
    line(ctx, gx(i / 4), gy(0), gx(i / 4), gy(g));
    line(ctx, gx(0), gy(i / 4), gx(g), gy(i / 4));
  }
  ctx.lineWidth = 2;
  ctx.strokeStyle = alpha(paper, 0.75);
  line(ctx, gx(0), gy(0), gx(outExpo(seg(b, 0, 0.7))), gy(0));
  line(ctx, gx(0), gy(0), gx(0), gy(outExpo(seg(b, 0.08, 0.78))));
  const a = seg(b, 0.3, 0.8);
  ctx.fillStyle = alpha(paper, 0.55 * a);
  ctx.font = mono(15, 500);
  ctx.letterSpacing = '3px';
  ctx.textAlign = 'right';
  ctx.fillText('TIME', gx(1), gy(0) + 36);
  ctx.save();
  ctx.translate(gx(0) - 22, gy(1));
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('VALUE', 0, 0);
  ctx.restore();
  ctx.letterSpacing = '0px';
  ctx.textAlign = 'left';
}

function knob(ctx, x, y, s) {
  if (s <= 0) return;
  ctx.beginPath();
  ctx.arc(x, y, 10 * s, 0, TAU);
  ctx.fillStyle = ink;
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = paper;
  ctx.stroke();
}

function bezierHandles(ctx, b) {
  const [p0, p1, p2, p3] = handles.map(([x, y]) => [gx(x), gy(y)]);
  const h1 = outCubic(seg(b, 0.35, 0.8));
  const h2 = outCubic(seg(b, 0.45, 0.9));
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = alpha(paper, 0.6);
  if (h1 > 0) line(ctx, p0[0], p0[1], lerp(p0[0], p1[0], h1), lerp(p0[1], p1[1], h1));
  if (h2 > 0) line(ctx, p3[0], p3[1], lerp(p3[0], p2[0], h2), lerp(p3[1], p2[1], h2));
  knob(ctx, p1[0], p1[1], outBack(seg(b, 0.6, 1.0), 3));
  knob(ctx, p2[0], p2[1], outBack(seg(b, 0.7, 1.1), 3));
}

function curve(ctx, b) {
  const c = inOutCubic(seg(b, 0.35, 1.15));
  if (c <= 0) return;
  ctx.beginPath();
  const n = Math.ceil(90 * c);
  for (let i = 0; i <= n; i++) {
    const [x, y] = curvePoint((i / n) * c);
    if (i) ctx.lineTo(x, y);
    else ctx.moveTo(x, y);
  }
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.strokeStyle = coral;
  ctx.stroke();
  ctx.lineCap = 'butt';
}

function preview(ctx, b, p) {
  const a = seg(b, 0.9, 1.3);
  if (a <= 0) return;
  ctx.lineWidth = 2;
  ctx.strokeStyle = alpha(paper, 0.3 * a);
  line(ctx, track, gy(0), track, gy(1));
  ctx.strokeStyle = alpha(paper, 0.6 * a);
  for (let i = 0; i <= 16; i++) {
    if (i / 16 > p + 1e-6) break;
    const y = gy(ease(i / 16));
    line(ctx, track - 44, y, track - 30, y);
  }
  const v = ease(p);
  const y = gy(v);
  ctx.setLineDash([4, 6]);
  ctx.strokeStyle = alpha(paper, 0.35 * a);
  line(ctx, gx(p), y, track - 30, y);
  ctx.setLineDash([]);
  const s = 52 * outBack(a, 2);
  ctx.fillStyle = coral;
  ctx.fillRect(track - s / 2, y - s / 2, s, s);
  ctx.font = mono(15, 500);
  ctx.fillStyle = alpha(paper, 0.8 * a);
  ctx.textAlign = 'right';
  ctx.fillText(`t ${p.toFixed(2)}   v ${v.toFixed(2)}`, gx(1), box.y - 26);
  ctx.textAlign = 'left';
}

function code(ctx, b) {
  const p = seg(b, 0.55, 1.5);
  if (p <= 0) return;
  const text = typed(CODE, p);
  ctx.font = mono(22, 500);
  ctx.fillStyle = alpha(paper, 0.85);
  ctx.fillText(text, box.x, 955);
  if (Math.floor(b * 4) % 2 === 0 || p < 1) {
    const w = ctx.measureText(text).width;
    ctx.fillStyle = coral;
    ctx.fillRect(box.x + w + 4, 935, 12, 26);
  }
}

function playhead(ctx, p) {
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = alpha(paper, 0.35);
  line(ctx, gx(p), gy(0), gx(p), gy(1));
}

function dot(ctx, b, p) {
  const appear = outBack(seg(b, 1.0, 1.2), 3);
  if (appear <= 0) return;
  let x = gx(p),
    y = gy(ease(p)),
    r = 13 * appear;
  const fly = inOutCubic(seg(b, 3.0, 3.6));
  if (fly > 0) {
    const [ex, ey] = [gx(1), gy(1)];
    const cx = lerp(ex, W / 2, 0.5) + 120,
      cy = Math.min(ey, H / 2) - 160;
    x = (1 - fly) ** 2 * ex + 2 * (1 - fly) * fly * cx + fly ** 2 * (W / 2);
    y = (1 - fly) ** 2 * ey + 2 * (1 - fly) * fly * cy + fly ** 2 * (H / 2);
  }
  r *= 1 + 0.6 * outCubic(seg(b, 3.55, 3.85)) - 1.25 * inBack(seg(b, 3.85, 4.0), 2);
  const land = seg(b, 2.75, 3.2);
  if (land > 0 && land < 1) {
    ctx.lineWidth = 3 * (1 - land);
    ctx.strokeStyle = alpha(coral, 1 - land);
    ctx.beginPath();
    ctx.arc(x, y, 13 + 70 * outCubic(land), 0, TAU);
    ctx.stroke();
  }
  const g = ctx.createRadialGradient(x, y, 0, x, y, r * 5);
  g.addColorStop(0, alpha(coral, 0.45));
  g.addColorStop(1, alpha(coral, 0));
  ctx.fillStyle = g;
  ctx.fillRect(x - r * 5, y - r * 5, r * 10, r * 10);
  ctx.beginPath();
  ctx.arc(x, y, Math.max(r, 0), 0, TAU);
  ctx.fillStyle = coral;
  ctx.fill();
}

function converge(ctx, b) {
  const p = seg(b, 3.4, 4.0);
  if (p <= 0 || p >= 1) return;
  ctx.lineWidth = 1.5 + 3 * p;
  ctx.strokeStyle = alpha(paper, 0.6 * inCubic(p));
  ctx.beginPath();
  ctx.arc(W / 2, H / 2, 700 * (1 - inCubic(p)), 0, TAU);
  ctx.stroke();
}

function streaks(ctx, b) {
  const p = seg(b, 3.3, 4.0);
  if (p <= 0 || p >= 1) return;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  for (let i = 0; i < 44; i++) {
    const q = seg(p, hash(i, 5) * 0.4, 1);
    if (q <= 0 || q >= 1) continue;
    const a = (i / 44) * TAU + hash(i, 3) * 0.12;
    const r0 = 24 + 1150 * (1 - inCubic(q));
    const r1 = r0 + 50 + 220 * (1 - q);
    ctx.strokeStyle = alpha(i % 5 ? paper : coral, 0.55 * Math.sin(Math.PI * q));
    line(ctx, W / 2 + Math.cos(a) * r0, H / 2 + Math.sin(a) * r0, W / 2 + Math.cos(a) * r1, H / 2 + Math.sin(a) * r1);
  }
  ctx.lineCap = 'butt';
}

function draw(ctx, t) {
  const b = t / BEAT;
  ctx.fillStyle = ink;
  ctx.fillRect(0, 0, W, H);
  dots(ctx, 0.13 * seg(b, 0, 0.8) * (1 - seg(b, 3.2, 3.9)));
  ctx.save();
  const zoom = 1 + 0.035 * outCubic(b / 4);
  ctx.translate(W / 2, H / 2);
  ctx.scale(zoom, zoom);
  ctx.translate(-W / 2, -H / 2);
  const p = seg(b, 1.15, 2.75);
  const fold = seg(b, 2.85, 3.45);
  if (fold < 1) {
    const k = 1 - inBack(fold, 2.2);
    ctx.save();
    ctx.globalAlpha = clamp(k * 1.4);
    ctx.translate(gx(1), gy(1));
    ctx.scale(k, k);
    ctx.translate(-gx(1), -gy(1));
    axes(ctx, b);
    bezierHandles(ctx, b);
    curve(ctx, b);
    if (b > 1.1) playhead(ctx, p);
    preview(ctx, b, p);
    ctx.restore();
    ctx.globalAlpha = clamp(k * 1.4);
    code(ctx, b);
    ctx.globalAlpha = 1;
  }
  dot(ctx, b, p);
  ctx.restore();
  streaks(ctx, b);
  converge(ctx, b);
}

export default { to: 4, draw };
