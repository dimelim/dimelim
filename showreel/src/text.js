import { hash } from './math.js';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/';

export function scramble(text, p, t, seed = 0) {
  const n = text.length;
  let out = '';
  for (let i = 0; i < n; i++) {
    const k = p * (n + 5) - i;
    if (text[i] === ' ' || k >= 5) out += text[i];
    else if (k > 0) out += GLYPHS[Math.floor(hash(i + seed * 97, Math.floor(t * 24)) * GLYPHS.length)];
    else out += ' ';
  }
  return out;
}

export const typed = (text, p) => text.slice(0, Math.round(p * text.length));

export function run(ctx, letters) {
  let x = 0;
  const placed = letters.map(l => {
    ctx.font = l.font;
    const w = ctx.measureText(l.ch).width;
    const item = { ...l, x, w };
    x += w + (l.gap ?? 0);
    return item;
  });
  return { letters: placed, width: x - (letters.at(-1)?.gap ?? 0) };
}

export function inkBox(ctx, font, ch) {
  ctx.font = font;
  ctx.textAlign = 'left';
  const m = ctx.measureText(ch);
  return {
    left: -m.actualBoundingBoxLeft,
    right: m.actualBoundingBoxRight,
    top: -m.actualBoundingBoxAscent,
    bottom: m.actualBoundingBoxDescent,
  };
}
