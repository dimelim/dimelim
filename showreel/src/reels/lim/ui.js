import { pixel } from '../../fonts.js';
import { alpha } from './palette.js';

export function box(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

export function frame(ctx, { x, y, w, h, r = 18, bar = 56, fill, top, stroke }) {
  box(ctx, x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.save();
  box(ctx, x, y, w, h, r);
  ctx.clip();
  ctx.fillStyle = top;
  ctx.fillRect(x, y, w, bar);
  ctx.restore();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1.5;
  box(ctx, x, y, w, h, r);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y + bar);
  ctx.lineTo(x + w, y + bar);
  ctx.stroke();
  [0, 1, 2].forEach(i => {
    ctx.beginPath();
    ctx.arc(x + 28 + i * 24, y + bar / 2, 7, 0, Math.PI * 2);
    ctx.fillStyle = alpha('#FFFFFF', 0.16);
    ctx.fill();
  });
}

export function pill(ctx, x, y, label, { font, fg, bg, stroke, h = 46, pad = 20 }) {
  ctx.font = font;
  const w = ctx.measureText(label).width + pad * 2;
  box(ctx, x, y, w, h, h / 2);
  if (bg) {
    ctx.fillStyle = bg;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  ctx.fillStyle = fg;
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x + pad, y + h / 2 + 1);
  ctx.textBaseline = 'alphabetic';
  return w;
}

export function bubble(ctx, x, y, label, s = 4, p = 1) {
  if (p <= 0) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(p, p);
  ctx.font = pixel(s * 9, 600);
  const w = Math.ceil((ctx.measureText(label).width + s * 8) / s) * s;
  const h = s * 14;
  ctx.fillStyle = '#FFF4E6';
  ctx.fillRect(0, -h - s * 3, w, h);
  ctx.fillRect(s * 2, -s * 3, s * 3, s * 2);
  ctx.fillRect(s * 2, -s, s * 1, s);
  ctx.fillStyle = '#101012';
  ctx.fillRect(0, -h - s * 3, w, s);
  ctx.fillRect(0, -s * 4, w, s);
  ctx.fillRect(0, -h - s * 3, s, h);
  ctx.fillRect(w - s, -h - s * 3, s, h);
  ctx.fillStyle = '#101012';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, s * 4, -h / 2 - s * 3 + s * 0.5);
  ctx.textBaseline = 'alphabetic';
  ctx.restore();
}
