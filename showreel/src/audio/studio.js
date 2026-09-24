import { rng } from '../math.js';

export const RATE = 48000;

const saturate = k => Float32Array.from({ length: 2048 }, (_, i) => Math.tanh((i / 1023.5 - 1) * k) / Math.tanh(k));

export function studio(ctx) {
  const r = rng(2026);
  const noise = ctx.createBuffer(2, RATE * 2, RATE);
  const ir = ctx.createBuffer(2, Math.round(RATE * 2.6), RATE);
  for (let c = 0; c < 2; c++) {
    noise.getChannelData(c).forEach((_, i, d) => (d[i] = r() * 2 - 1));
    let lp = 0;
    ir.getChannelData(c).forEach((_, i, d) => {
      lp += 0.35 * (r() * 2 - 1 - lp);
      d[i] = lp * Math.exp((-i / RATE) * 2.6);
    });
  }
  const master = ctx.createGain();
  master.gain.value = 0.45;
  const glue = ctx.createDynamicsCompressor();
  glue.threshold.value = -16;
  glue.ratio.value = 3.5;
  glue.attack.value = 0.004;
  glue.release.value = 0.18;
  const clip = ctx.createWaveShaper();
  clip.curve = saturate(1.4);
  const low = new BiquadFilterNode(ctx, { type: 'lowshelf', frequency: 80, gain: -2 });
  const air = new BiquadFilterNode(ctx, { type: 'peaking', frequency: 3000, Q: 0.7, gain: 6 });
  master.connect(low).connect(air).connect(glue).connect(clip).connect(ctx.destination);
  const bus = v => {
    const g = ctx.createGain();
    g.gain.value = v;
    g.connect(master);
    return g;
  };
  const verb = ctx.createConvolver();
  verb.buffer = ir;
  const send = ctx.createGain();
  send.connect(verb).connect(bus(0.45));
  const music = bus(1);
  return {
    ctx,
    r,
    noise,
    master,
    music,
    verb: send,
    drums: bus(1),
    sfx: bus(1),
    drive: saturate(3),
    pump: t => {
      music.gain.setValueAtTime(0.3, t);
      music.gain.linearRampToValueAtTime(1, t + 0.3);
    },
  };
}
