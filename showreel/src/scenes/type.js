import { BEAT, W, H } from '../time.js';
import { seg, lerp, clamp } from '../math.js';
import { outExpo, outBack, inOutQuint, inExpo, spring, inOutCubic } from '../ease.js';
import { ink, paper, coral, alpha } from '../palette.js';
import { display, mono, serif } from '../fonts.js';

const WORDS = ['TIMING', 'SPACING', 'EASING', 'RHYTHM', 'WEIGHT', 'DETAIL', 'MOTION'];
const LAND = [24, 24.5, 25, 25.5, 26, 26.5, 27];
const SIZE = 190;
const ROW = 205;

function scroll(b) {
  let s = -1.4 * (1 - outExpo(seg(b, 24, 24.2)));
  for (let i = 1; i < LAND.length; i++) s += inOutQuint(seg(b, LAND[i] - 0.2, LAND[i] + 0.1));
  return s;
}

function paintLetters(ctx, y, word, font, { spacing = 0, dy = () => 0, weight, color }) {
  const fontOf = j => (weight ? display(SIZE, weight(j), 125) : font);
  let x = 0;
  const list = [...word].map((ch, j) => {
    ctx.font = fontOf(j);
    const w = ctx.measureText(ch).width;
    const item = { ch, x, w, font: fontOf(j) };
    x += w + spacing;
    return item;
  });
  const x0 = W / 2 - (x - spacing) / 2;
  ctx.fillStyle = color;
  list.forEach((l, j) => {
    const off = dy(j);
    if (off === null) return;
    ctx.font = l.font;
    ctx.fillText(l.ch, x0 + l.x, y + off);
  });
  return list.map(l => ({ ...l, x: x0 + l.x }));
}

function detail(ctx, y, placed, p, color) {
  const cap = SIZE * 0.72;
  const reach = outExpo(p);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (const gy of [y, y - cap]) {
    ctx.moveTo(W / 2 - 900 * reach, gy);
    ctx.lineTo(W / 2 + 900 * reach, gy);
  }
  ctx.stroke();
  ctx.setLineDash([5, 5]);
  placed.forEach((l, j) => {
    const q = outBack(seg(p, 0.1 + j * 0.08, 0.5 + j * 0.08));
    if (q <= 0) return;
    const cx = l.x + l.w / 2,
      h = cap * q,
      w = l.w * q;
    ctx.strokeRect(cx - w / 2, y - cap / 2 - h / 2, w, h);
  });
  ctx.setLineDash([]);
  ctx.font = mono(14, 500);
  ctx.fillStyle = color;
  const a = seg(p, 0.3, 0.6);
  if (a > 0) {
    ctx.globalAlpha = a;
    ctx.fillText(`cap ${Math.round(cap)}px`, W / 2 + 610, y - cap - 12);
    ctx.fillText('baseline', W / 2 + 610, y + 24);
    placed.forEach(l => ctx.fillText(`${Math.round(l.w)}`, l.x + l.w / 2 - 12, y + 24));
    ctx.globalAlpha = 1;
  }
}

function active(ctx, i, y, lt, color) {
  const word = WORDS[i];
  const base = display(SIZE, 800, 125);
  if (word === 'TIMING') {
    return paintLetters(ctx, y, word, base, {
      color,
      dy: j => (lt < j * 0.04 ? null : -34 * Math.exp(-(lt - j * 0.04) * 14)),
    });
  }
  if (word === 'SPACING') return paintLetters(ctx, y, word, base, { color, spacing: 70 * outExpo(seg(lt, 0, 0.45)) });
  if (word === 'EASING') {
    return paintLetters(ctx, y + 10, word, serif(SIZE * 1.45), {
      color,
      dy: j => 120 * (1 - outBack(seg(lt, j * 0.035, 0.3 + j * 0.035), 2.4)),
    });
  }
  if (word === 'RHYTHM') {
    return paintLetters(ctx, y, word, base, { color, dy: j => -46 * Math.abs(Math.sin(Math.PI * (lt * 4 + j * 0.3))) });
  }
  if (word === 'WEIGHT') {
    return paintLetters(ctx, y, word, base, {
      color,
      weight: j => lerp(100, 900, outExpo(seg(lt, j * 0.04, 0.4 + j * 0.04))),
    });
  }
  if (word === 'DETAIL') {
    const placed = paintLetters(ctx, y, word, base, { color });
    detail(ctx, y, placed, seg(lt, 0, 0.5), color);
    return placed;
  }
  const stretch = spring(seg(lt, 0, 0.7), 1.5, 5);
  const font = display(SIZE, 900, lerp(50, 132, stretch));
  ctx.globalAlpha = 0.25;
  paintLetters(ctx, y, word, font, { color: coral, dy: () => 0, spacing: -8 + 30 * (1 - stretch) });
  ctx.globalAlpha = 1;
  return paintLetters(ctx, y, word, font, { color });
}

function list(ctx, b, fg) {
  const s = scroll(b);
  const current = clamp(Math.round(s), 0, WORDS.length - 1);
  WORDS.forEach((word, i) => {
    const y = H / 2 + (i - s) * ROW + SIZE * 0.36;
    if (y < -ROW || y > H + ROW * 1.5) return;
    const focus = clamp(1 - Math.abs(i - s) * 1.6);
    ctx.font = display(SIZE, 800, 125);
    ctx.textAlign = 'center';
    ctx.lineWidth = 2;
    ctx.strokeStyle = alpha(fg, 0.35 + 0.25 * (1 - Math.min(1, Math.abs(i - s) / 3)));
    if (focus < 1) ctx.strokeText(word, W / 2, y);
    ctx.textAlign = 'left';
    if (i === current && focus > 0.35) {
      ctx.globalAlpha = focus;
      active(ctx, i, y, b - LAND[i], fg);
      ctx.globalAlpha = 1;
    }
    ctx.font = mono(18, 500);
    ctx.fillStyle = alpha(fg, 0.45 + 0.55 * focus);
    ctx.fillText(String(i + 1).padStart(2, '0'), 120, y - SIZE * 0.3);
  });
  const top = H / 2 - ROW / 2 - 4,
    bottom = H / 2 + ROW / 2 - 4;
  ctx.strokeStyle = alpha(fg, 0.5);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(90, top);
  ctx.lineTo(W - 90, top);
  ctx.moveTo(90, bottom);
  ctx.lineTo(W - 90, bottom);
  ctx.stroke();
  const progress = clamp(s / (WORDS.length - 1));
  ctx.fillStyle = alpha(fg, 0.25);
  ctx.fillRect(W - 110, 200, 3, H - 400);
  ctx.fillStyle = fg;
  ctx.fillRect(W - 114, 200 + (H - 440) * progress, 11, 40);
}

function draw(ctx, t) {
  const b = t / BEAT;
  const squash = inExpo(seg(b, 27.72, 28));
  ctx.fillStyle = coral;
  ctx.fillRect(0, 0, W, H);
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.scale(1 + 0.5 * squash, 1 - 0.985 * squash);
  ctx.translate(-W / 2, -H / 2);
  list(ctx, b, ink);
  ctx.restore();
  const wipe = inOutCubic(seg(b, 26.8, 27.05));
  if (wipe > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, H * (1 - wipe), W, H * wipe);
    ctx.clip();
    ctx.fillStyle = ink;
    ctx.fillRect(0, 0, W, H);
    ctx.translate(W / 2, H / 2);
    ctx.scale(1 + 0.5 * squash, 1 - 0.985 * squash);
    ctx.translate(-W / 2, -H / 2);
    list(ctx, b, paper);
    ctx.restore();
  }
}

export default { to: 28, draw };
