import { BEAT, W, H } from '../time.js';
import { seg, lerp, decay } from '../../../math.js';
import { spring, outExpo, inOutCubic, inBack } from '../../../ease.js';
import { paper } from '../palette.js';
import { serif } from '../../../fonts.js';
import { stage, layer, reset, clear } from '../../../stage.js';
import { shader, texture } from '../../../gl.js';
import depth from './depth.js';

const BLOBS = [
  { r: 0.13, ax: 0.52, ay: 0.2, fx: 0.9, fy: 1.3, px: 0.0, py: 1.1 },
  { r: 0.1, ax: 0.47, ay: 0.27, fx: 1.2, fy: 0.8, px: 2.0, py: 0.3 },
  { r: 0.085, ax: 0.62, ay: 0.17, fx: 0.7, fy: 1.6, px: 4.1, py: 2.2 },
  { r: 0.11, ax: 0.36, ay: 0.3, fx: 1.5, fy: 1.1, px: 1.3, py: 4.0 },
  { r: 0.07, ax: 0.56, ay: 0.24, fx: 1.1, fy: 1.9, px: 5.0, py: 5.3 },
  { r: 0.09, ax: 0.26, ay: 0.21, fx: 1.8, fy: 0.9, px: 3.3, py: 1.7 },
];
const KICKS = [16, 17, 18, 19];
let fx, text, prev, setText, setPrev, source;

async function setup() {
  source = await (await fetch(new URL('./flow.frag', import.meta.url))).text();
}

function init() {
  fx = shader(Math.round(W * stage.scale), Math.round(H * stage.scale), source);
  text = layer();
  prev = layer();
  setText = texture(fx.gl, 0, 'textTex', fx.u);
  setPrev = texture(fx.gl, 1, 'prevTex', fx.u);
}

function blobs(b) {
  const s = (b - 16) * BEAT * 2;
  const kick = decay(b, KICKS, 5);
  const gather = inOutCubic(seg(b, 18.9, 19.6));
  const pop = 1 - inBack(seg(b, 19.65, 20), 2.6);
  return BLOBS.flatMap((o, i) => {
    const grow = spring(seg(b, 15.85 + i * 0.08, 16.7 + i * 0.08), 1.2, 5);
    const x = lerp(o.ax * Math.sin(o.fx * s + o.px), 0, gather);
    const y = lerp(o.ay * Math.sin(o.fy * s + o.py), 0, gather);
    return [x, y, o.r * grow * (1 + 0.22 * kick) * pop, 0];
  });
}

function word(b) {
  const c = text.ctx;
  reset(c);
  clear(c);
  const fade = 1 - seg(b, 19.25, 19.65);
  if (fade <= 0 || b < 15.9) return;
  c.font = serif(600);
  c.fillStyle = paper;
  const letters = [...'flow'];
  const widths = letters.map(l => c.measureText(l).width);
  let x = W / 2 - c.measureText('flow').width / 2;
  letters.forEach((l, i) => {
    const p = outExpo(seg(b, 16 + i * 0.07, 16.7 + i * 0.07));
    const y = 760 + 260 * (1 - p) + 14 * Math.sin(b * 1.7 + i * 1.3);
    c.globalAlpha = p * fade;
    c.fillText(l, x, y);
    x += widths[i];
  });
  c.globalAlpha = 1;
}

function draw(ctx, t) {
  if (!fx) init();
  const b = t / BEAT;
  const melt = seg(b, 15.5, 16);
  if (melt < 1) {
    reset(prev.ctx);
    depth.draw(prev.ctx, t);
    setPrev(prev.canvas);
  }
  word(b);
  setText(text.canvas);
  const { gl, u } = fx;
  gl.uniform1f(u('time'), t);
  gl.uniform1f(u('kick'), decay(b, KICKS, 4));
  gl.uniform1f(u('melt'), melt);
  gl.uniform4fv(u('blobs'), blobs(b));
  fx.render();
  ctx.drawImage(fx.canvas, 0, 0, W, H);
}

export default { to: 20, draw, setup };
