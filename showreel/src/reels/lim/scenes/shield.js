import { BEAT, W, H } from '../time.js';
import { seg, lerp, clamp, hash } from '../../../math.js';
import { outExpo, outBack, outQuint, outCubic, inQuad } from '../../../ease.js';
import { alpha } from '../palette.js';
import { jakarta } from '../../../fonts.js';
import { box, pill } from '../ui.js';
import { cat } from '../cat.js';
import { dots, field } from './halftone.js';

const BLURPLE = '#5865F2';
const GREEN = '#5EBC7B';
const RED = '#ED4245';
const INK = '#F2F3F6';
const MUTE = '#9BA1A9';
const AVATARS = ['#5865F2', '#3BA55C', '#FAA61A', '#ED4245', '#EB459E'];
const PANEL = { x: 1080, y: 170, w: 700, h: 640 };
const ACTIVE = 86;
const FLOOD = Array.from({ length: 22 }, (_, i) => 84 + i * 0.1);

function logo(ctx, b, x, y, s) {
  const p = seg(b, 80.1, 81);
  if (p <= 0) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.lineWidth = 12;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = INK;
  ctx.setLineDash([500 * outCubic(p), 600]);
  ctx.beginPath();
  ctx.moveTo(50, 6);
  ctx.quadraticCurveTo(70, 16, 90, 18);
  ctx.lineTo(90, 62);
  ctx.quadraticCurveTo(90, 98, 50, 116);
  ctx.quadraticCurveTo(10, 98, 10, 62);
  ctx.lineTo(10, 18);
  ctx.quadraticCurveTo(30, 16, 50, 6);
  ctx.stroke();
  const q = seg(b, 80.5, 81.2);
  ctx.setLineDash([220 * outCubic(q), 300]);
  ctx.beginPath();
  ctx.moveTo(68, 38);
  ctx.quadraticCurveTo(50, 28, 34, 40);
  ctx.quadraticCurveTo(24, 54, 50, 60);
  ctx.quadraticCurveTo(76, 66, 66, 84);
  ctx.quadraticCurveTo(52, 98, 32, 86);
  ctx.stroke();
  ctx.restore();
}

function titles(ctx, b) {
  const rows = [
    [80.6, jakarta(128, 600), INK, 'ShielUs', 438, 318],
    [81.5, jakarta(38, 400), MUTE, 'Bot anti-raid gratuito para Discord', 540, 150],
    [81.9, jakarta(28, 500), BLURPLE, 'shielus.lat', 596, 150],
  ];
  for (const [at, font, color, str, y, x] of rows) {
    const p = outQuint(seg(b, at, at + 0.6));
    if (p <= 0) continue;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, y - 130, 1060, 150);
    ctx.clip();
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(str, x, y + (1 - p) * 140);
    ctx.restore();
  }
  let x = 150;
  ['Anti-Raid', 'Anti-Nuke', 'AutoMod', 'Copias', 'Registros'].forEach((f, i) => {
    const p = outBack(seg(b, 82.4 + i * 0.12, 82.8 + i * 0.12), 2);
    if (p <= 0) return;
    ctx.save();
    ctx.translate(x, 660);
    ctx.scale(p, p);
    const w = pill(ctx, 0, -23, f, { font: jakarta(22, 500), fg: INK, bg: '#232529', stroke: '#3A3D44', h: 46 });
    ctx.restore();
    x += w + 12;
  });
  const s = seg(b, 88, 88.8);
  if (s > 0) {
    ctx.font = jakarta(22, 400);
    ctx.fillStyle = alpha(MUTE, s);
    ctx.fillText('Next.js 16  ·  React 19  ·  HeroUI v3  ·  Tailwind v4', 150, 740);
  }
}

function feed(ctx, b) {
  const p = outExpo(seg(b, 82.6, 83.4));
  if (p <= 0) return;
  const { x, y, w, h } = PANEL;
  ctx.save();
  ctx.translate(0, (1 - p) * 80);
  ctx.globalAlpha = p;
  box(ctx, x, y, w, h, 22);
  ctx.fillStyle = '#1E1F22';
  ctx.fill();
  ctx.strokeStyle = '#2B2D32';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.font = jakarta(24, 600);
  ctx.fillStyle = INK;
  ctx.fillText('# bienvenida', x + 32, y + 50);
  const safe = b >= ACTIVE;
  const badge = safe ? 'PROTEGIDO' : b > 84 ? 'RAID EN CURSO' : 'EN VIVO';
  ctx.font = jakarta(16, 700);
  const bw = ctx.measureText(badge).width + 26;
  box(ctx, x + w - bw - 28, y + 28, bw, 30, 15);
  ctx.fillStyle = safe ? alpha(GREEN, 0.2) : b > 84 ? alpha(RED, 0.25 + 0.2 * Math.sin(b * 20)) : '#2B2D32';
  ctx.fill();
  ctx.fillStyle = safe ? GREEN : b > 84 ? RED : MUTE;
  ctx.fillText(badge, x + w - bw - 15, y + 49);
  ctx.beginPath();
  ctx.rect(x, y + 80, w, h - 90);
  ctx.clip();
  const shown = FLOOD.filter(a => b >= a).length;
  const scroll = Math.max(0, shown - 8) * 62;
  FLOOD.forEach((a, i) => {
    if (b < a) return;
    const ry = y + 110 + i * 62 - scroll;
    const q = outCubic(seg(b, a, a + 0.15));
    const blocked = seg(b, ACTIVE + i * 0.02, ACTIVE + 0.3 + i * 0.02);
    ctx.globalAlpha = p * q * (1 - 0.55 * blocked);
    ctx.beginPath();
    ctx.arc(x + 52, ry, 18, 0, Math.PI * 2);
    ctx.fillStyle = AVATARS[Math.floor(hash(i, 4) * AVATARS.length)];
    ctx.fill();
    const nw = 90 + hash(i, 5) * 120;
    box(ctx, x + 84, ry - 16, nw, 14, 7);
    ctx.fillStyle = '#4E5058';
    ctx.fill();
    ctx.font = jakarta(17, 400);
    ctx.fillStyle = MUTE;
    ctx.fillText('se unió al servidor', x + 84, ry + 17);
    ctx.fillStyle = blocked > 0.5 ? MUTE : RED;
    ctx.beginPath();
    ctx.arc(x + w - 44, ry, 6, 0, Math.PI * 2);
    ctx.fill();
    if (blocked > 0) {
      ctx.strokeStyle = alpha(MUTE, 0.8);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 80, ry);
      ctx.lineTo(x + 80 + (w - 150) * blocked, ry);
      ctx.stroke();
    }
  });
  ctx.globalAlpha = p;
  const toast = outBack(seg(b, ACTIVE + 0.3, ACTIVE + 0.8), 1.6);
  if (toast > 0) {
    const ty = y + 90 + (1 - toast) * -60;
    box(ctx, x + 24, ty, w - 48, 86, 16);
    ctx.fillStyle = '#16301F';
    ctx.fill();
    ctx.strokeStyle = alpha(GREEN, 0.6);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 70, ty + 43, 18, 0, Math.PI * 2);
    ctx.fillStyle = GREEN;
    ctx.fill();
    ctx.strokeStyle = '#061109';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x + 61, ty + 44);
    ctx.lineTo(x + 68, ty + 51);
    ctx.lineTo(x + 80, ty + 36);
    ctx.stroke();
    ctx.font = jakarta(24, 700);
    ctx.fillStyle = INK;
    ctx.fillText('Raid bloqueado', x + 104, ty + 40);
    ctx.font = jakarta(17, 400);
    ctx.fillStyle = MUTE;
    ctx.fillText('Servidor protegido · incidente registrado', x + 104, ty + 66);
  }
  ctx.restore();
}

function hero(ctx, b, t) {
  const p = outBack(seg(b, 82.8, 83.4), 2);
  if (p <= 0) return;
  const x = 900,
    y = 930;
  const hit = FLOOD.some(a => b - a - 0.35 > 0 && b - a - 0.35 < 0.08) && b < ACTIVE + 0.4;
  cat(ctx, {
    x,
    y: y + (1 - p) * 300,
    s: 11,
    t,
    holding: 'shield',
    eyes: b > ACTIVE + 0.4 ? 'happy' : undefined,
    sx: hit ? 1.04 : 1,
    sy: hit ? 0.97 : 1,
  });
  const ring = seg(b, ACTIVE, ACTIVE + 0.8);
  if (ring > 0 && ring < 1) {
    ctx.strokeStyle = alpha(BLURPLE, 1 - ring);
    ctx.lineWidth = 10 * (1 - ring) + 2;
    ctx.beginPath();
    ctx.arc(x + 33, y - 100, 60 + 900 * outCubic(ring), 0, Math.PI * 2);
    ctx.stroke();
  }
}

function raid(ctx, b) {
  const target = [940, 840];
  FLOOD.forEach((a, i) => {
    const start = a + 0.05;
    const p = seg(b, start, start + 0.3);
    const back = seg(b, start + 0.3, start + 0.8);
    if (p <= 0 || back >= 1 || start > ACTIVE + 0.3) return;
    const from = [PANEL.x + 20, PANEL.y + 160 + hash(i, 8) * 400];
    let x = lerp(from[0], target[0], inQuad(p));
    let y = lerp(from[1], target[1] - 40 + hash(i, 9) * 80, inQuad(p));
    if (back > 0) {
      x += back * (180 + hash(i, 10) * 200);
      y -= Math.sin(back * Math.PI) * 120 + back * 200 * (hash(i, 11) - 0.5);
    }
    ctx.globalAlpha = 1 - back;
    ctx.fillStyle = back > 0 ? '#FFD1D2' : RED;
    ctx.fillRect(x - 9, y - 9, 18, 18);
  });
  ctx.globalAlpha = 1;
}

function draw(ctx, t) {
  const b = t / BEAT;
  ctx.fillStyle = '#0E0F11';
  ctx.fillRect(0, 0, W, H);
  field(ctx, t, '#23252A', clamp(seg(b, 80, 81.5)));
  const glow = ctx.createRadialGradient(PANEL.x, PANEL.y + 300, 0, PANEL.x, PANEL.y + 300, 900);
  glow.addColorStop(0, alpha(BLURPLE, 0.1 + 0.2 * clamp(1 - Math.abs(b - ACTIVE - 0.3) * 2)));
  glow.addColorStop(1, alpha(BLURPLE, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  logo(ctx, b, 150, 300, 1.3);
  titles(ctx, b);
  feed(ctx, b);
  raid(ctx, b);
  hero(ctx, b, t);
  dots(ctx, seg(b, 94.4, 96), '#1D1B17', false);
}

export default { to: 96, draw };
