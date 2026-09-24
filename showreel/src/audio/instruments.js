import { osc, noise, filter, env, out } from './nodes.js';

const hz = m => 440 * 2 ** ((m - 69) / 12);

export function kick(s, t, v = 1) {
  const o = osc(s, 'sine', 180, t, t + 0.6);
  o.frequency.exponentialRampToValueAtTime(55, t + 0.06);
  o.frequency.exponentialRampToValueAtTime(42, t + 0.5);
  const drive = s.ctx.createWaveShaper();
  drive.curve = s.drive;
  out(s, o.connect(drive).connect(env(s, t, 0.9 * v, 0.45)), s.drums);
  out(
    s,
    noise(s, t, t + 0.03)
      .connect(filter(s, 'highpass', 3000))
      .connect(env(s, t, 0.3 * v, 0.012, 0.0005)),
    s.drums,
  );
}

export function snare(s, t, v) {
  out(
    s,
    noise(s, t, t + 0.3)
      .connect(filter(s, 'bandpass', 2800, 0.5))
      .connect(env(s, t, 0.5 * v, 0.17)),
    s.drums,
    0.25,
  );
  const o = osc(s, 'triangle', 210, t, t + 0.15);
  o.frequency.exponentialRampToValueAtTime(160, t + 0.08);
  out(s, o.connect(env(s, t, 0.45 * v, 0.09)), s.drums);
}

export function clap(s, t, v) {
  const g = s.ctx.createGain();
  g.gain.setValueAtTime(0, t);
  for (const d of [0, 0.011, 0.022]) {
    g.gain.setValueAtTime(0.7 * v, t + d);
    g.gain.setTargetAtTime(0.1 * v, t + d + 0.001, 0.003);
  }
  g.gain.setValueAtTime(0.6 * v, t + 0.03);
  g.gain.setTargetAtTime(0, t + 0.03, 0.045);
  out(
    s,
    noise(s, t, t + 0.4)
      .connect(filter(s, 'bandpass', 1800, 0.7))
      .connect(g),
    s.drums,
    0.35,
  );
  out(
    s,
    noise(s, t, t + 0.1)
      .connect(filter(s, 'highpass', 5000))
      .connect(env(s, t, 0.25 * v, 0.06, 0.001)),
    s.drums,
    0.2,
  );
}

export function hat(s, t, v, open = false) {
  const n = noise(s, t, t + (open ? 0.4 : 0.08));
  out(
    s,
    n.connect(filter(s, 'highpass', open ? 5500 : 6500)).connect(env(s, t, v, open ? 0.28 : 0.045, 0.001)),
    s.drums,
    0.05,
    open ? 0.25 : -0.15,
  );
}

export function bass(s, t, midi, dur) {
  const lp = filter(s, 'lowpass', 2400, 6);
  lp.frequency.setValueAtTime(2400, t);
  lp.frequency.setTargetAtTime(180, t, 0.07);
  for (const [type, det] of [
    ['sawtooth', -6],
    ['square', 6],
  ])
    osc(s, type, hz(midi), t, t + dur + 0.15, det).connect(lp);
  const g = s.ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.3, t + 0.004);
  g.gain.setTargetAtTime(0.18, t + 0.004, 0.08);
  g.gain.setTargetAtTime(0, t + dur, 0.02);
  out(s, lp.connect(g), s.music);
  const sg = s.ctx.createGain();
  sg.gain.setValueAtTime(0, t);
  sg.gain.linearRampToValueAtTime(0.42, t + 0.006);
  sg.gain.setTargetAtTime(0, t + dur, 0.03);
  out(s, osc(s, 'sine', hz(midi) / 2, t, t + dur + 0.15).connect(sg), s.music);
}

export function stab(s, t, notes, v = 1, dur = 0.28) {
  const lp = filter(s, 'lowpass', 7000, 1.6);
  lp.frequency.setValueAtTime(7000, t);
  lp.frequency.setTargetAtTime(1600, t, 0.12);
  for (const m of notes) {
    for (const [det, pan] of [
      [-14, -0.6],
      [0, 0],
      [14, 0.6],
    ]) {
      const p = s.ctx.createStereoPanner();
      p.pan.value = pan;
      osc(s, 'sawtooth', hz(m), t, t + dur + 0.3, det)
        .connect(p)
        .connect(lp);
    }
  }
  out(s, lp.connect(env(s, t, 0.06 * v, dur, 0.003)), s.music, 0.3);
}

export function arp(s, t, midi, v, pan) {
  const lp = filter(s, 'lowpass', 3200, 3);
  lp.frequency.setValueAtTime(3200, t);
  lp.frequency.setTargetAtTime(1200, t, 0.05);
  const o = osc(s, 'square', hz(midi), t, t + 0.25);
  out(s, o.connect(lp).connect(env(s, t, v, 0.14, 0.002)), s.music, 0.3, pan);
}

export function pad(s, t0, t1, notes, v, c0, c1, release = 0.25) {
  const lp = filter(s, 'lowpass', c0, 0.8);
  lp.frequency.setValueAtTime(c0, t0);
  lp.frequency.exponentialRampToValueAtTime(c1, t1);
  notes.forEach(m => {
    [-16, -5, 6, 17].forEach((det, k) => {
      const p = s.ctx.createStereoPanner();
      p.pan.value = k % 2 ? 0.7 : -0.7;
      osc(s, 'sawtooth', hz(m), t0, t1 + 0.05, det)
        .connect(p)
        .connect(lp);
    });
  });
  const g = s.ctx.createGain();
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(v, t0 + 0.35);
  g.gain.setValueAtTime(v, t1 - release);
  g.gain.linearRampToValueAtTime(0, t1);
  out(s, lp.connect(g), s.music, 0.45);
}

export function pluck(s, t, midi, v = 0.2) {
  out(s, osc(s, 'sine', hz(midi), t, t + 0.8).connect(env(s, t, v, 0.5)), s.sfx, 0.35);
  out(s, osc(s, 'triangle', hz(midi) * 2, t, t + 0.4).connect(env(s, t, v * 0.35, 0.18)), s.sfx, 0.35);
  out(s, osc(s, 'sine', hz(midi) * 4, t, t + 0.2).connect(env(s, t, v * 0.3, 0.06)), s.sfx, 0.35);
}

export function bell(s, t, midi, v = 0.15) {
  for (const [k, a, d] of [
    [1, 1, 1.4],
    [2.01, 0.45, 0.9],
    [3.02, 0.25, 0.6],
    [4.23, 0.15, 0.4],
    [5.41, 0.08, 0.25],
  ]) {
    out(s, osc(s, 'sine', hz(midi) * k, t, t + d + 0.2).connect(env(s, t, v * a, d, 0.001)), s.sfx, 0.5);
  }
}

export function blip(s, t, freq, v, dur = 0.08, pan = 0, send = 0.2) {
  out(s, osc(s, 'sine', freq, t, t + dur + 0.05).connect(env(s, t, v, dur, 0.001)), s.sfx, send, pan);
}

export function tick(s, t, v) {
  blip(s, t, 2600, v, 0.03, 0, 0.1);
  blip(s, t, 1300, v * 0.6, 0.05, 0, 0.1);
}

export function whoosh(s, t, dur, f0, f1, v, p0 = 0, p1 = 0) {
  const f = filter(s, 'bandpass', f0, 1.3);
  f.frequency.setValueAtTime(f0, t);
  f.frequency.exponentialRampToValueAtTime(f1, t + dur);
  const g = s.ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(v, t + dur * 0.65);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  const p = s.ctx.createStereoPanner();
  p.pan.setValueAtTime(p0, t);
  p.pan.linearRampToValueAtTime(p1, t + dur);
  out(
    s,
    noise(s, t, t + dur + 0.05)
      .connect(f)
      .connect(g)
      .connect(p),
    s.sfx,
    0.2,
  );
}

export function riser(s, t0, t1, v) {
  const f = filter(s, 'bandpass', 300, 2.5);
  f.frequency.setValueAtTime(300, t0);
  f.frequency.exponentialRampToValueAtTime(9000, t1);
  const g = s.ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(v, t1);
  out(s, noise(s, t0, t1).connect(f).connect(g), s.sfx, 0.15);
  const o = osc(s, 'sawtooth', hz(53), t0, t1);
  o.frequency.exponentialRampToValueAtTime(hz(77), t1);
  const og = s.ctx.createGain();
  og.gain.setValueAtTime(0.0001, t0);
  og.gain.exponentialRampToValueAtTime(v * 0.25, t1);
  out(s, o.connect(filter(s, 'lowpass', 2000)).connect(og), s.sfx, 0.2);
}

export function swell(s, t1, dur, v) {
  const g = s.ctx.createGain();
  g.gain.setValueAtTime(0.0001, t1 - dur);
  g.gain.exponentialRampToValueAtTime(v, t1);
  out(
    s,
    noise(s, t1 - dur, t1)
      .connect(filter(s, 'highpass', 1800))
      .connect(g),
    s.sfx,
    0.1,
  );
}

export function impact(s, t, v = 1) {
  kick(s, t, 1.1 * v);
  const o = osc(s, 'sine', 70, t, t + 1.6);
  o.frequency.exponentialRampToValueAtTime(28, t + 1.4);
  out(s, o.connect(env(s, t, 0.6 * v, 1.3, 0.004)), s.drums);
  out(
    s,
    noise(s, t, t + 2)
      .connect(filter(s, 'highpass', 3500))
      .connect(env(s, t, 0.3 * v, 1.6, 0.001)),
    s.sfx,
    0.4,
  );
}

export function glide(s, t0, t1, curve, v) {
  const o = osc(s, 'sine', curve[0], t0, t1 + 0.1);
  o.frequency.setValueCurveAtTime(Float32Array.from(curve), t0, t1 - t0);
  const g = s.ctx.createGain();
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(v, t0 + 0.04);
  g.gain.setValueAtTime(v, t1 - 0.05);
  g.gain.linearRampToValueAtTime(0, t1);
  out(s, o.connect(g), s.sfx, 0.35);
}

export function bubble(s, t, f0, v, pan) {
  const o = osc(s, 'sine', f0, t, t + 0.15);
  o.frequency.exponentialRampToValueAtTime(f0 * 2.6, t + 0.07);
  out(s, o.connect(env(s, t, v, 0.09)), s.sfx, 0.35, pan);
}

export function key(s, t, v) {
  out(
    s,
    noise(s, t, t + 0.05)
      .connect(filter(s, 'bandpass', 3200, 1.2))
      .connect(env(s, t, v, 0.025, 0.0005)),
    s.sfx,
    0.05,
  );
  out(s, osc(s, 'sine', 190, t, t + 0.06).connect(env(s, t, v * 0.6, 0.035)), s.sfx);
}

export function chip(s, t, from, to, dur, v, pan = 0) {
  const o = osc(s, 'square', from, t, t + dur + 0.05);
  o.frequency.exponentialRampToValueAtTime(to, t + dur);
  out(s, o.connect(filter(s, 'lowpass', 5000)).connect(env(s, t, v, dur, 0.002)), s.sfx, 0.15, pan);
}

export function thud(s, t, v) {
  const o = osc(s, 'sine', 140, t, t + 0.25);
  o.frequency.exponentialRampToValueAtTime(50, t + 0.18);
  out(s, o.connect(env(s, t, v, 0.2)), s.drums);
  out(
    s,
    noise(s, t, t + 0.08)
      .connect(filter(s, 'lowpass', 900))
      .connect(env(s, t, v * 0.5, 0.06)),
    s.drums,
  );
}

export function meow(s, t, v) {
  const o = osc(s, 'square', 700, t, t + 0.5);
  o.frequency.setValueCurveAtTime(Float32Array.from([700, 1150, 1300, 1200, 950, 760]), t, 0.42);
  const f = filter(s, 'lowpass', 2600, 2);
  const g = s.ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(v, t + 0.03);
  g.gain.setValueAtTime(v, t + 0.3);
  g.gain.linearRampToValueAtTime(0, t + 0.44);
  out(s, o.connect(f).connect(g), s.sfx, 0.25);
}
