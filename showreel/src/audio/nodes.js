export function osc(s, type, freq, t0, t1, detune = 0) {
  const o = s.ctx.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  o.detune.value = detune;
  o.start(t0);
  o.stop(t1);
  return o;
}

export function noise(s, t0, t1) {
  const n = s.ctx.createBufferSource();
  n.buffer = s.noise;
  n.loop = true;
  n.start(t0, s.r() * 1.9);
  n.stop(t1);
  return n;
}

export function filter(s, type, freq, q = 0.7) {
  const f = s.ctx.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  f.Q.value = q;
  return f;
}

export function env(s, t, peak, decay, attack = 0.002) {
  const g = s.ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(peak, t + attack);
  g.gain.setTargetAtTime(0, t + attack, decay / 4);
  return g;
}

export function out(s, node, bus, send = 0, pan = 0) {
  let n = node;
  if (pan) {
    const p = s.ctx.createStereoPanner();
    p.pan.value = pan;
    n = n.connect(p);
  }
  n.connect(bus);
  if (send) {
    const g = s.ctx.createGain();
    g.gain.value = send;
    n.connect(g).connect(s.verb);
  }
}
