import { BEAT, W, H } from '../time.js';
import { seg, lerp } from '../../../math.js';
import { spring, outQuint, outBack, inQuad, outCubic } from '../../../ease.js';
import { night, text, muted, ginger, alpha } from '../palette.js';
import { geist, geistMono, newsreader } from '../../../fonts.js';
import { bubble } from '../ui.js';
import { cat } from '../cat.js';

const LEFT = 200;

function name(ctx, b) {
  let x = LEFT;
  [...'Lim'].forEach((ch, i) => {
    const p = seg(b, 120.05 + i * 0.1, 121.1 + i * 0.1);
    if (p <= 0) return;
    ctx.font = geist(250, lerp(300, 900, outQuint(p)));
    ctx.fillStyle = text;
    ctx.fillText(ch, x, 470 - (1 - spring(p, 1.6, 5)) * 300);
    ctx.font = geist(250, 900);
    x += ctx.measureText(ch).width;
  });
}

function lines(ctx, b) {
  const rows = [
    [120.8, geist(52, 500), text, 'Dev full-stack', 575],
    [121.3, geistMono(32, 450), text, 'github.com/dimelim', 690],
    [121.5, geistMono(32, 450), muted, 'discord · dimelim', 745],
    [122.2, newsreader(44, 400, true), ginger, 'Mirando hacia el futuro.', 860],
  ];
  for (const [at, font, color, str, y] of rows) {
    const p = outQuint(seg(b, at, at + 0.6));
    if (p <= 0) continue;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, y - 70, W, 90);
    ctx.clip();
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(str, LEFT + 10, y + (1 - p) * 80);
    if (str === 'Dev full-stack') {
      const w = ctx.measureText(`${str} `).width;
      ctx.font = geist(52, 700);
      ctx.fillStyle = ginger;
      ctx.fillText('/ Next.js', LEFT + 10 + w, y + (1 - p) * 80);
    }
    ctx.restore();
  }
}

function hero(ctx, b, t) {
  const fall = seg(b, 120.1, 120.6);
  if (fall <= 0) return;
  const x = 1440,
    y = lerp(-300, 880, inQuad(fall));
  const land = b > 120.6 ? Math.exp(-(b - 120.6) * 8) : 0;
  const waving = b > 121 && b < 124.5;
  cat(ctx, {
    x,
    y,
    s: 16,
    t,
    pose: waving ? 'wave' : 'sit',
    eyes: waving || b > 126 ? 'happy' : undefined,
    sx: 1 + 0.16 * land,
    sy: 1 - 0.2 * land,
  });
  bubble(ctx, x + 110, y - 380, 'miau', 7, outBack(seg(b, 121.2, 121.5), 3) * (1 - seg(b, 124.6, 124.8)));
}

function draw(ctx, t) {
  const b = t / BEAT;
  ctx.fillStyle = night;
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(1440, 700, 0, 1440, 700, 900);
  glow.addColorStop(0, alpha(ginger, 0.1 * outCubic(seg(b, 120, 121))));
  glow.addColorStop(1, alpha(ginger, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  name(ctx, b);
  lines(ctx, b);
  hero(ctx, b, t);
  const out = seg(b, 127.2, 128);
  if (out > 0) {
    ctx.fillStyle = alpha('#000000', out);
    ctx.fillRect(0, 0, W, H);
  }
}

export default { to: 128, draw };
