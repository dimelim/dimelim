import { BEAT, W, H } from '../time.js';
import { seg, lerp } from '../../../math.js';
import { outExpo, outQuint, inExpo, inQuad, inOutCubic } from '../../../ease.js';
import { night, text, muted, dim, rim, ginger, alpha } from '../palette.js';
import { geist, geistMono, newsreader } from '../../../fonts.js';
import { cat } from '../cat.js';

export const ROWS = [
  { n: '01', name: 'peekstore.com', tag: 'donde trabajo' },
  { n: '02', name: 'shielus.lat', tag: 'personal' },
  { n: '03', name: 'miniout', tag: 'código abierto' },
];
const TOP = 620;
const GAP = 130;
const X = 300;

function heading(ctx, b) {
  const p = outQuint(seg(b, 56, 56.7));
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 250, W, 190);
  ctx.clip();
  ctx.font = geist(140, 700);
  ctx.fillStyle = text;
  ctx.fillText('Mis', X - 12, 400 + (1 - p) * 190);
  const w = ctx.measureText('Mis ').width;
  ctx.font = newsreader(156, 400, true);
  ctx.fillStyle = ginger;
  const q = outQuint(seg(b, 56.25, 57));
  ctx.fillText('proyectos', X - 12 + w, 400 + (1 - q) * 190);
  ctx.restore();
}

function rows(ctx, b) {
  ROWS.forEach((r, i) => {
    const p = outExpo(seg(b, 56.6 + i * 0.35, 57.4 + i * 0.35));
    if (p <= 0) return;
    const y = TOP + i * GAP;
    ctx.globalAlpha = p;
    ctx.font = geistMono(26, 500);
    ctx.fillStyle = dim;
    ctx.fillText(r.n, X - 130, y);
    ctx.font = geist(76, 600);
    ctx.fillStyle = text;
    ctx.fillText(r.name, X + (1 - p) * 80, y);
    ctx.font = geistMono(26, 450);
    ctx.fillStyle = i === 0 ? ginger : muted;
    ctx.textAlign = 'right';
    ctx.fillText(r.tag, W - 300, y);
    ctx.textAlign = 'left';
    ctx.strokeStyle = rim;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(X - 130, y + 40);
    ctx.lineTo(lerp(X - 130, W - 300, p), y + 40);
    ctx.stroke();
    ctx.globalAlpha = 1;
  });
}

function hero(ctx, b, t) {
  const hops = [
    [57.4, 1650, TOP + 2 * GAP + 40],
    [58.2, 1450, TOP + GAP + 40],
    [59.0, 1260, TOP + 40],
  ];
  let x = 2100,
    y = TOP + 2 * GAP + 40,
    air = false,
    from = [2100, TOP + 2 * GAP + 40];
  for (const [at, hx, hy] of hops) {
    const p = seg(b, at - 0.45, at);
    if (p >= 1) {
      from = [hx, hy];
      [x, y] = from;
    } else if (p > 0) {
      x = lerp(from[0], hx, p);
      y = lerp(from[1], hy, p) - Math.sin(Math.PI * p) * 150;
      air = true;
      break;
    } else break;
  }
  const since = hops.map(h => b - h[0]).filter(d => d >= 0);
  const land = since.length ? Math.exp(-Math.min(...since) * 9) : 0;
  const waving = b > 59.4 && b < 62;
  cat(ctx, {
    x,
    y,
    s: 9,
    t,
    pose: waving ? 'wave' : 'sit',
    eyes: air || waving ? 'happy' : undefined,
    sx: 1 + 0.15 * land,
    sy: 1 - 0.18 * land + (air ? 0.1 : 0),
  });
}

function draw(ctx, t) {
  const b = t / BEAT;
  ctx.fillStyle = night;
  ctx.fillRect(0, 0, W, H);
  const zoom = inExpo(seg(b, 62.3, 64));
  ctx.font = geist(76, 600);
  const cx = X + ctx.measureText(ROWS[0].name).width / 2;
  const cy = TOP - 26;
  ctx.save();
  const k = Math.exp(Math.log(9) * zoom);
  ctx.translate(lerp(cx, W / 2, inOutCubic(seg(b, 62.3, 64))), lerp(cy, H / 2, inOutCubic(seg(b, 62.3, 64))));
  ctx.scale(k, k);
  ctx.translate(-cx, -cy);
  ctx.globalAlpha = 1 - inQuad(zoom);
  heading(ctx, b);
  ctx.globalAlpha = 1;
  rows(ctx, b);
  hero(ctx, b, t);
  ctx.restore();
  const cut = seg(b, 63.6, 64);
  if (cut > 0) {
    ctx.fillStyle = alpha(night, cut);
    ctx.fillRect(0, 0, W, H);
  }
}

export default { to: 64, draw };
