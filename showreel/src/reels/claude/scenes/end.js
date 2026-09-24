import { BEAT, W, H } from '../time.js';
import { seg, TAU, rng } from '../../../math.js';
import { outBack, outExpo, outQuint, outCubic } from '../../../ease.js';
import { ink, paper, coral, lime, alpha } from '../palette.js';
import { display, mono, serif } from '../../../fonts.js';
import { typed } from '../../../text.js';

const MARK = [W / 2, 380];
const RAYS = [150, 104, 132, 96, 150, 110, 138, 100, 150, 106, 128, 98];
const embers = (() => {
  const r = rng(99);
  return Array.from({ length: 70 }, () => ({
    x: r() * W,
    o: r() * H,
    v: 30 + r() * 70,
    s: 1 + r() * 2.5,
    a: 0.2 + r() * 0.5,
  }));
})();

function spark(ctx, lb) {
  const turn = (-Math.PI / 2) * (1 - outExpo(seg(lb, 0, 1.3))) + lb * 0.06;
  const breathe = 1 + 0.04 * Math.sin(lb * 2.6) * seg(lb, 1.2, 2);
  ctx.save();
  ctx.translate(...MARK);
  ctx.rotate(turn);
  ctx.lineCap = 'round';
  ctx.strokeStyle = coral;
  ctx.lineWidth = 24;
  RAYS.forEach((len, k) => {
    const g = outBack(seg(lb, k * 0.03, 0.55 + k * 0.03), 2.2);
    if (g <= 0) return;
    const a = (TAU * k) / RAYS.length;
    const r1 = 26 + len * g * breathe;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * 26, Math.sin(a) * 26);
    ctx.lineTo(Math.cos(a) * r1, Math.sin(a) * r1);
    ctx.stroke();
  });
  ctx.restore();
}

function shockwave(ctx, lb) {
  const p = seg(lb, 0, 0.8);
  if (p >= 1) return;
  ctx.lineWidth = 8 * (1 - p);
  ctx.strokeStyle = alpha(coral, 1 - p);
  ctx.beginPath();
  ctx.arc(...MARK, 900 * outCubic(p), 0, TAU);
  ctx.stroke();
}

function wordmark(ctx, lb) {
  const font = display(150, 800, 118);
  ctx.font = font;
  const letters = [...'CLAUDE'];
  const widths = letters.map(l => ctx.measureText(l).width);
  let x = W / 2 - ctx.measureText('CLAUDE').width / 2;
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 560, W, 160);
  ctx.clip();
  ctx.fillStyle = paper;
  letters.forEach((l, j) => {
    const p = outQuint(seg(lb, 0.35 + j * 0.05, 1.2 + j * 0.05));
    ctx.fillText(l, x, 705 + 170 * (1 - p));
    x += widths[j];
  });
  ctx.restore();
  const s = outQuint(seg(lb, 0.8, 1.5));
  ctx.font = serif(66);
  ctx.textAlign = 'center';
  ctx.fillStyle = alpha(coral, s);
  ctx.fillText('Motion Designer', W / 2, 800 + 30 * (1 - s));
  ctx.textAlign = 'left';
}

function footer(ctx, lb) {
  const p = seg(lb, 1.2, 2.2);
  if (p <= 0) return;
  ctx.font = mono(17, 500);
  ctx.letterSpacing = '4px';
  ctx.textAlign = 'center';
  const line = typed('AVAILABLE FOR NEW PROJECTS', p);
  ctx.fillStyle = alpha(paper, 0.8);
  ctx.fillText(line, W / 2 + 16, 925);
  const w = ctx.measureText('AVAILABLE FOR NEW PROJECTS').width;
  ctx.fillStyle = alpha(lime, 0.55 + 0.45 * Math.sin(lb * 6));
  ctx.beginPath();
  ctx.arc(W / 2 - w / 2 - 8, 919, 6, 0, TAU);
  ctx.fill();
  const q = seg(lb, 1.8, 2.4);
  ctx.fillStyle = alpha(paper, 0.5 * q);
  ctx.fillText('claude.ai', W / 2, 962);
  ctx.letterSpacing = '0px';
  ctx.textAlign = 'left';
}

function drift(ctx, lb) {
  const a = seg(lb, 0.2, 1);
  if (a <= 0) return;
  const s = lb * BEAT;
  for (const e of embers) {
    const y = H + 20 - ((e.o + s * e.v) % (H + 40));
    ctx.fillStyle = alpha(coral, e.a * a);
    ctx.fillRect(e.x + Math.sin(s + e.o) * 12, y, e.s, e.s);
  }
}

function draw(ctx, t) {
  const lb = t / BEAT - 28;
  ctx.fillStyle = ink;
  ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(...MARK, 0, ...MARK, 520);
  g.addColorStop(0, alpha(coral, 0.16 * outCubic(seg(lb, 0, 1))));
  g.addColorStop(1, alpha(coral, 0));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  drift(ctx, lb);
  shockwave(ctx, lb);
  spark(ctx, lb);
  wordmark(ctx, lb);
  footer(ctx, lb);
}

export default { to: 32, draw };
