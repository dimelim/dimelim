import { W, H, stage, reset } from './stage.js';
import { loadFonts } from './fonts.js';
import { finish } from './post.js';
import { soundtrack } from './audio/index.js';

let reel, canvas, ctx, lo, hi, samples, shutter;

async function init(opts = {}) {
  reel = (await import(`./reels/${opts.reel}/index.js`)).default;
  stage.scale = opts.scale ?? 1;
  samples = opts.samples ?? 1;
  shutter = opts.shutter ?? 0.5;
  canvas = document.createElement('canvas');
  canvas.width = Math.round(W * stage.scale);
  canvas.height = Math.round(H * stage.scale);
  document.body.append(canvas);
  ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
  lo = new Uint32Array(canvas.width * canvas.height);
  hi = new Uint32Array(canvas.width * canvas.height);
  await Promise.all([loadFonts(), reel.setup()]);
}

const info = () => ({ fps: reel.fps, frames: Math.round(reel.duration * reel.fps) });

function renderAt(t) {
  reset(ctx);
  reel.draw(ctx, Math.min(Math.max(t, 0), reel.duration - 1e-6));
}

function accumulate(t) {
  lo.fill(0);
  hi.fill(0);
  for (let k = 0; k < samples; k++) {
    renderAt(t + ((k + 0.5) / samples - 0.5) * (shutter / reel.fps));
    const px = new Uint32Array(ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer);
    for (let i = 0; i < px.length; i++) {
      const v = px[i];
      lo[i] += v & 0xff00ff;
      hi[i] += (v >>> 8) & 0xff00ff;
    }
  }
  const img = ctx.createImageData(canvas.width, canvas.height);
  const out = new Uint32Array(img.data.buffer);
  const half = samples >> 1;
  for (let i = 0; i < out.length; i++) {
    const l = lo[i],
      h = hi[i];
    out[i] =
      (((l & 0xffff) + half) / samples) |
      0 |
      (((((h & 0xffff) + half) / samples) | 0) << 8) |
      (((((l >>> 16) + half) / samples) | 0) << 16) |
      0xff000000;
  }
  ctx.putImageData(img, 0, 0);
}

function frame(i) {
  const t = i / reel.fps;
  if (samples > 1) accumulate(t);
  else renderAt(t);
  finish(ctx, i, reel.hit(t));
  return canvas.toDataURL('image/png');
}

async function audio() {
  const bytes = new Uint8Array(await soundtrack(reel.score, reel.duration));
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

window.reel = { init, info, frame, audio };
