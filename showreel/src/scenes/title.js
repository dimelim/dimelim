import { BEAT, W, H, ROLL } from '../time.js';
import { seg, lerp, TAU, decay } from '../math.js';
import { spring, outExpo, outBack, outCubic, outQuint, inQuint, inExpo, inOutCubic } from '../ease.js';
import { ink, paper, coral, alpha } from '../palette.js';
import { display, mono, serif } from '../fonts.js';
import { scramble, run, inkBox } from '../text.js';
import { layer, reset, clear } from '../stage.js';
import form from './form.js';

const WORD = 'CLAUDE';
const SIZE = 300;
const BASE = 650;
const ROWS = [
  { k: -1, at: 6.25, width: 150, dir: 1 },
  { k: 1, at: 6.25, width: 150, dir: -1 },
  { k: -2, at: 6.5, width: 62, dir: -1 },
  { k: 2, at: 6.5, width: 62, dir: 1 },
  { k: 3, at: 6.75, width: 150, dir: -1 },
];
const ROW = 236;
let mask, scene;

function letters(b) {
  const lb = b - 4;
  const hit = decay(b, ROLL, 9);
  return [...WORD].map((ch, i) => {
    const p = seg(lb, 0.12 + i * 0.06, 1.12 + i * 0.06);
    const s = spring(p, 1.8, 5.2);
    const grow = outBack(seg(lb, 3.0 + i * 0.025, 3.4 + i * 0.025), 1.6);
    return {
      ch,
      on: p > 0,
      font: display(SIZE, lerp(200, 900, outExpo(p)) - 380 * hit * (1 - grow), lerp(50, 112, s) + 38 * grow),
      y: (1 - s) * 190,
      sy: lerp(1.7, 1, outCubic(p)) + 0.3 * grow,
    };
  });
}

function layout(ctx, b) {
  const r = run(ctx, letters(b));
  const x0 = W / 2 - r.width / 2;
  return r.letters.map(l => ({ ...l, x: x0 + l.x }));
}

function paint(ctx, placed, mode) {
  ctx.textAlign = 'center';
  for (const l of placed) {
    if (!l.on) continue;
    ctx.save();
    ctx.translate(l.x + l.w / 2, BASE);
    ctx.scale(1, l.sy);
    ctx.font = l.font;
    if (mode === 'stroke') ctx.strokeText(l.ch, 0, l.y);
    else ctx.fillText(l.ch, 0, l.y);
    ctx.restore();
  }
  ctx.textAlign = 'left';
}

function burst(ctx, lb) {
  ctx.fillStyle = ink;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = coral;
  ctx.beginPath();
  ctx.arc(W / 2, H / 2, lerp(5, 2300, outExpo(seg(lb, 0, 0.55))), 0, TAU);
  ctx.fill();
  const p = seg(lb, 0, 0.6);
  if (p < 1) {
    ctx.lineWidth = 50 * (1 - p) + 2;
    ctx.strokeStyle = alpha(paper, 1 - p);
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, 1600 * outCubic(p), 0, TAU);
    ctx.stroke();
  }
}

function labels(ctx, b, lb) {
  const inTop = seg(lb, 0.45, 1.2),
    outTop = seg(lb, 2.0, 2.3);
  if (inTop > 0 && outTop < 1) {
    ctx.font = mono(24, 600);
    ctx.letterSpacing = '8px';
    ctx.textAlign = 'center';
    ctx.fillStyle = ink;
    ctx.fillText(scramble('SHOWREEL — 2026', inTop * (1 - outTop), b * BEAT, 3), W / 2 + 4, 385);
    ctx.letterSpacing = '0px';
  }
  const inLow = outQuint(seg(lb, 0.6, 1.4)),
    outLow = inQuint(seg(lb, 2.0, 2.35));
  if (inLow > 0 && outLow < 1) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 700, W, 130);
    ctx.clip();
    ctx.font = serif(112);
    ctx.textAlign = 'center';
    ctx.fillStyle = ink;
    ctx.fillText('Motion Designer', W / 2, 800 + 130 * (1 - inLow) - 140 * outLow);
    ctx.restore();
  }
  ctx.textAlign = 'left';
}

function echoes(ctx, b, lb) {
  const exit = inExpo(seg(lb, 3.0, 3.35));
  if (exit >= 1) return;
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = ink;
  for (const row of ROWS) {
    const p = outExpo(seg(b, row.at, row.at + 0.4));
    if (p <= 0) continue;
    ctx.font = display(SIZE, 900, row.width);
    const unit = ctx.measureText(`${WORD} `).width;
    const drift = (((row.dir * (b - row.at) * 300) % unit) + unit) % unit;
    const y = BASE + row.k * ROW + Math.sign(row.k) * 900 * exit;
    ctx.save();
    ctx.beginPath();
    ctx.rect(row.dir > 0 ? 0 : W * (1 - p), y - SIZE, W * p, SIZE * 1.2);
    ctx.clip();
    ctx.strokeText(`${WORD} `.repeat(Math.ceil(W / unit) + 2), drift - unit, y);
    ctx.restore();
  }
}

function stemAnchor(ctx, placed) {
  const l = placed[1];
  const box = inkBox(ctx, l.font, 'L');
  const stem = inkBox(ctx, l.font, 'I');
  return [l.x + box.left + (stem.right - stem.left) / 2, BASE + (box.top * l.sy) / 2];
}

function knockout(ctx, t, b, lb, placed) {
  mask ??= layer();
  scene ??= layer();
  reset(scene.ctx);
  form.draw(scene.ctx, t);
  const m = mask.ctx;
  reset(m);
  clear(m);
  const [ax, ay] = stemAnchor(ctx, placed);
  const z = inExpo(seg(lb, 3.45, 4.0));
  const s = Math.exp(Math.log(48) * z);
  const move = inOutCubic(seg(lb, 3.3, 4.0));
  const tx = lerp(ax, W / 2, move),
    ty = lerp(ay, H / 2, move);
  const zoom = c => {
    c.translate(tx, ty);
    c.scale(s, s);
    c.translate(-ax, -ay);
  };
  m.save();
  zoom(m);
  m.fillStyle = '#fff';
  paint(m, placed);
  m.restore();
  m.globalCompositeOperation = 'source-in';
  m.drawImage(scene.canvas, 0, 0, W, H);
  m.globalCompositeOperation = 'source-over';
  ctx.drawImage(mask.canvas, 0, 0, W, H);
  ctx.save();
  zoom(ctx);
  ctx.lineWidth = 3 / s;
  ctx.strokeStyle = alpha(ink, 1 - z);
  paint(ctx, placed, 'stroke');
  ctx.restore();
}

function draw(ctx, t) {
  const b = t / BEAT;
  const lb = b - 4;
  burst(ctx, lb);
  const cam = 1 + 0.05 * outCubic(seg(lb, 0.1, 2.7)) * (1 - inOutCubic(seg(lb, 2.7, 3.0)));
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.scale(cam, cam);
  ctx.translate(-W / 2, -H / 2);
  echoes(ctx, b, lb);
  labels(ctx, b, lb);
  const placed = layout(ctx, b);
  if (lb < 3) {
    ctx.fillStyle = ink;
    paint(ctx, placed);
  }
  ctx.restore();
  if (lb >= 3) knockout(ctx, t, b, lb, placed);
}

export default { to: 8, draw };
