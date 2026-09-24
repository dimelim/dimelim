import { BEAT, W, H } from '../time.js';
import { seg, lerp, clamp, hash } from '../../../math.js';
import { outExpo, outQuint, inQuad, inExpo, outBack } from '../../../ease.js';
import { night, cream, ginger, alpha } from '../palette.js';
import { geist, newsreader } from '../../../fonts.js';
import { cat, shades } from '../cat.js';

const HORIZON = 640;
const SUN = [W / 2, 668];

function sky(ctx, b) {
  const g = ctx.createLinearGradient(0, 0, 0, HORIZON);
  g.addColorStop(0, night);
  g.addColorStop(0.55, '#1B1330');
  g.addColorStop(0.85, '#4A2138');
  g.addColorStop(1, '#8A3B2E');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, HORIZON);
  for (let i = 0; i < 90; i++) {
    const x = hash(i, 1) * W,
      y = hash(i, 2) * HORIZON * 0.8;
    const tw = 0.4 + 0.6 * Math.abs(Math.sin(b * 1.3 + i));
    ctx.fillStyle = alpha(cream, 0.5 * tw * (1 - y / HORIZON));
    ctx.fillRect(x, y, 2.5, 2.5);
  }
}

function sun(ctx, b) {
  const r = lerp(2400, 190, outExpo(seg(b, 112, 112.9))) * (1 + 0.5 * inExpo(seg(b, 117.5, 120)));
  const g = ctx.createLinearGradient(0, SUN[1] - r, 0, SUN[1] + r);
  g.addColorStop(0, '#FFD89A');
  g.addColorStop(0.6, '#F0923A');
  g.addColorStop(1, '#E0673D');
  const halo = ctx.createRadialGradient(SUN[0], SUN[1], r * 0.8, SUN[0], SUN[1], r * 2.6);
  halo.addColorStop(0, alpha(ginger, 0.35));
  halo.addColorStop(1, alpha(ginger, 0));
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(SUN[0], SUN[1], r, 0, Math.PI * 2);
  ctx.fill();
}

function ground(ctx, b) {
  ctx.fillStyle = '#0E0A12';
  ctx.fillRect(0, HORIZON, W, H - HORIZON);
  const speed = 1.2 + 6 * inQuad(seg(b, 117.5, 120));
  const travel = (b - 112) * BEAT * 1.2 + inQuad(seg(b, 117.5, 120)) * speed * 3;
  ctx.lineWidth = 2;
  for (let k = 0; k < 26; k++) {
    const z = 26 - k - (travel % 1);
    if (z < 0.6) continue;
    const y = HORIZON + 440 / z;
    ctx.strokeStyle = alpha(ginger, 0.55 * clamp(1.4 - z / 18));
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  for (let i = -16; i <= 16; i++) {
    ctx.strokeStyle = alpha(ginger, 0.35);
    ctx.beginPath();
    ctx.moveTo(W / 2 + i * 14, HORIZON);
    ctx.lineTo(W / 2 + i * 180, H);
    ctx.stroke();
  }
  const fade = ctx.createLinearGradient(0, HORIZON, 0, HORIZON + 120);
  fade.addColorStop(0, alpha('#8A3B2E', 0.6));
  fade.addColorStop(1, alpha('#8A3B2E', 0));
  ctx.fillStyle = fade;
  ctx.fillRect(0, HORIZON, W, 120);
}

function words(ctx, b) {
  const lift = inExpo(seg(b, 118, 120)) * 160;
  const rows = [
    [112.8, geist(104, 800), cream, 'Mirando hacia', 290],
    [113.6, newsreader(164, 400, true), ginger, 'el futuro', 450],
  ];
  ctx.textAlign = 'center';
  for (const [at, font, color, str, y] of rows) {
    const p = outQuint(seg(b, at, at + 0.7));
    if (p <= 0) continue;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, y - 170 - lift, W, 210);
    ctx.clip();
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(str, W / 2, y + (1 - p) * 180 - lift);
    ctx.restore();
  }
  ctx.textAlign = 'left';
}

function hero(ctx, b, t) {
  const p = outBack(seg(b, 113.2, 113.8), 2);
  if (p <= 0) return;
  const x = W / 2,
    y = 1010 + (1 - p) * 300;
  const fall = seg(b, 115.6, 116);
  const on = b >= 116;
  const land = on ? Math.exp(-(b - 116) * 10) : 0;
  cat(ctx, { x, y, s: 12, t, eyes: on ? 'shades' : undefined, sx: 1 + 0.08 * land, sy: 1 - 0.08 * land });
  if (!on && fall > 0) shades(ctx, x, y, 12, (1 - inQuad(fall)) * 700);
}

function draw(ctx, t) {
  const b = t / BEAT;
  sky(ctx, b);
  sun(ctx, b);
  ground(ctx, b);
  words(ctx, b);
  hero(ctx, b, t);
  const flash = seg(b, 119.6, 120);
  if (flash > 0) {
    ctx.fillStyle = alpha(cream, flash * flash);
    ctx.fillRect(0, 0, W, H);
  }
}

export default { to: 120, draw };
