import { BEAT, DURATION } from './time.js';
import { rng } from '../../math.js';
import {
  kick,
  snare,
  clap,
  hat,
  bass,
  stab,
  arp,
  pad,
  pluck,
  bell,
  blip,
  tick,
  whoosh,
  riser,
  swell,
  impact,
  key,
  chip,
  thud,
  meow,
} from '../../audio/instruments.js';
import { TYPED } from './scenes/code.js';

const at = n => n * BEAT;
const hz = m => 440 * 2 ** ((m - 69) / 12);
const PROGRESSION = ['Bm', 'G', 'D', 'A'];
const CHORDS = { Bm: [57, 59, 62, 66], G: [55, 59, 62, 66], D: [57, 62, 66, 69], A: [57, 61, 64, 69] };
const ARPS = { Bm: [71, 74, 78, 81], G: [67, 71, 74, 78], D: [69, 74, 78, 81], A: [69, 73, 76, 81] };
const ROOTS = { Bm: 35, G: 31, D: 38, A: 33 };
const DMAJ9 = [50, 57, 61, 64, 66];
const GROOVE = [
  [16, 56],
  [64, 112],
];
const chord = beat => PROGRESSION[Math.floor(beat / 4) % 4];

function boing(s, t, v = 0.07) {
  chip(s, t, 280, 900, 0.16, v);
}

function hop(s, from, land, v = 0.06) {
  boing(s, at(from), v);
  thud(s, at(land), 0.5);
}

function drums(s, a, b) {
  for (let n = a; n < b; n++) {
    kick(s, at(n));
    s.pump(at(n));
    if (n % 2) clap(s, at(n), 0.75);
    hat(s, at(n + 0.5), 0.16, true);
    for (let k = 0; k < 4; k++) hat(s, at(n + k / 4), k % 2 ? 0.12 : 0.06);
  }
}

function harmony(s, a, b, { stabs = true, arps = true, bassline = true, level = 1 } = {}) {
  for (let bar = a; bar < b; bar += 4) {
    const name = chord(bar);
    if (bassline) for (let n = 0; n < 4; n++) bass(s, at(bar + n + 0.5), ROOTS[name], at(0.42));
    if (stabs)
      for (const cell of [0, 2])
        for (const off of [0, 0.75, 1.5]) stab(s, at(bar + cell + off), CHORDS[name], 0.75 * level);
    if (arps) {
      for (let k = 0; k < 16; k++) {
        const i = [0, 1, 2, 3, 2, 1, 2, 3][k % 8];
        arp(s, at(bar + k / 4), ARPS[name][i] + (k >= 8 ? 12 : 0), 0.042 * level, k % 2 ? 0.45 : -0.45);
      }
    }
  }
}

function intro(s) {
  pad(s, 0, at(12.2), DMAJ9, 0.05, 300, 2200, at(0.4));
  pad(s, at(12), at(16), [47, 54, 57, 62, 66], 0.055, 900, 5200, at(0.2));
  chip(s, at(0.45), 300, 700, 0.1, 0.06);
  for (let n = 4; n < 16; n += 2) kick(s, at(n), 0.55);
  for (let n = 8; n < 16; n += 0.5) hat(s, at(n), n % 1 ? 0.06 : 0.03);
  for (let n = 8; n < 12; n++) bass(s, at(n + 0.5), ROOTS[chord(n + 8)], at(0.42));
  const r = rng(3);
  TYPED.forEach(({ at: b, ch }, i) => ch !== ' ' && key(s, at(b), 0.05 + 0.03 * r() + (i % 2) * 0.01));
  whoosh(s, at(12.05), at(0.5), 400, 2400, 0.08);
  [...'$ npm run dev'].forEach((c, i) => c !== ' ' && key(s, at(12.4 + (i / 13) * 0.6), 0.06));
  thud(s, at(14.45), 0.7);
  key(s, at(14.45), 0.2);
  [
    [14.7, 81],
    [14.9, 86],
  ].forEach(([b, m]) => blip(s, at(b), hz(m), 0.08, 0.1));
  [74, 78, 81, 86].forEach((m, i) => bell(s, at(15.15 + i * 0.08), m, 0.05));
  boing(s, at(15.55), 0.08);
  [14, 14.5, 15, 15.25, 15.5, 15.625, 15.75, 15.875].forEach((n, i) => snare(s, at(n), 0.25 + i * 0.07));
  riser(s, at(12.5), at(15.95), 0.22);
  swell(s, at(16), at(1), 0.3);
}

function hello(s) {
  impact(s, at(16), 1.1);
  thud(s, at(16.95), 0.6);
  meow(s, at(17.6), 0.07);
  whoosh(s, at(18), at(0.5), 600, 3000, 0.08);
  chip(s, at(19), 1400, 500, 0.12, 0.05);
  [...'@dimelim  ·  Colombia'].forEach((c, i) => c !== ' ' && key(s, at(20 + (i / 21) * 1.2), 0.04));
  boing(s, at(30));
  whoosh(s, at(30.6), at(1.3), 300, 5000, 0.2);
  swell(s, at(32), at(0.6), 0.2);
}

function stack(s) {
  thud(s, at(32.37), 0.6);
  [74, 76, 78, 81, 83, 86].forEach((m, i) => {
    const a = 32.25 + i;
    if (i) boing(s, at(a - 0.42), 0.05);
    chip(s, at(a), hz(m), hz(m), 0.12, 0.06, i % 2 ? 0.3 : -0.3);
    thud(s, at(a + 0.06), 0.45);
  });
  [86, 90, 93].forEach((m, i) => bell(s, at(39.45 + i * 0.1), m, 0.05));
  whoosh(s, at(47.8), at(1.4), 300, 4000, 0.14);
  [74, 78, 81, 86, 90].forEach((m, i) => chip(s, at(48 + i * 0.14), hz(m), hz(m), 0.1, 0.04));
  swell(s, at(54.2), at(1), 0.25);
  thud(s, at(54.2), 0.6);
  whoosh(s, at(54.4), at(1.6), 4000, 300, 0.16);
}

function work(s) {
  pad(s, at(56), at(64), [47, 54, 59, 62, 66], 0.06, 700, 2600, at(0.3));
  harmony(s, 56, 64, { stabs: false, bassline: false, level: 0.6 });
  for (let n = 56; n < 64; n += 0.5) hat(s, at(n), n % 1 ? 0.05 : 0.025);
  [56.6, 56.95, 57.3].forEach(b => tick(s, at(b), 0.08));
  [
    [57.4, 57.4],
    [58.2, 58.2],
    [59.0, 59.0],
  ].forEach(([land]) => hop(s, land - 0.45, land, 0.05));
  riser(s, at(62.2), at(63.95), 0.22);
  swell(s, at(64), at(1.2), 0.3);
}

function peekstore(s) {
  impact(s, at(64));
  [...'peekstore.com'].forEach((c, i) => key(s, at(64.3 + (i / 13) * 0.8), 0.05));
  [65.2, 65.5, 65.7, 66.1, 66.4, 66.52, 66.64, 66.76].forEach((b, i) =>
    blip(s, at(b), hz(79 + (i % 4) * 2), 0.04, 0.05),
  );
  [67.4, 70.6].forEach(b => chip(s, at(b), 400, 900, 0.1, 0.05));
  [68.6, 71.7].forEach(b => chip(s, at(b), 900, 350, 0.12, 0.04));
  [74, 78, 81].forEach((m, i) => bell(s, at(70 + i * 0.1), m + 12, 0.035));
  tick(s, at(73.5), 0.12);
  hop(s, 74.6, 75.2);
  whoosh(s, at(78.6), at(1.4), 6000, 800, 0.16);
  riser(s, at(78.4), at(79.95), 0.18);
}

function shield(s) {
  impact(s, at(80));
  whoosh(s, at(80.1), at(0.9), 500, 3500, 0.12);
  [82.4, 82.52, 82.64, 82.76, 82.88].forEach(b => tick(s, at(b), 0.06));
  chip(s, at(82.8), 300, 700, 0.1, 0.05);
  const r = rng(11);
  for (let i = 0; i < 22; i++) {
    const b = 84 + i * 0.1;
    chip(s, at(b), i % 2 ? 1500 : 1180, i % 2 ? 1500 : 1180, 0.05, 0.035, r() * 1.4 - 0.7);
    if (b + 0.35 < 86.3) chip(s, at(b + 0.35), 1800, 600, 0.08, 0.025, 0.3);
  }
  impact(s, at(86), 0.9);
  stab(s, at(86), [62, 66, 69, 74], 1.4, 0.6);
  chip(s, at(86), 300, 1200, 0.3, 0.05);
  [81, 86, 90].forEach((m, i) => bell(s, at(86.3 + i * 0.09), m, 0.05));
  whoosh(s, at(94.4), at(1.6), 800, 6000, 0.16);
  riser(s, at(94.2), at(95.95), 0.18);
}

function miniout(s) {
  impact(s, at(96), 0.8);
  whoosh(s, at(96.1), at(0.8), 500, 3000, 0.1);
  whoosh(s, at(96.8), at(0.8), 300, 2000, 0.08);
  chip(s, at(99), 300, 700, 0.1, 0.05);
  const note = 'parcial de cálculo el viernes';
  [...note].forEach((c, i) => c !== ' ' && blip(s, at(99.8 + (i / note.length) * 2.5), 2400, 0.03, 0.02));
  [102.6, 102.85].forEach((b, i) => chip(s, at(b), 500 + i * 200, 1100 + i * 200, 0.1, 0.05));
  tick(s, at(104.2), 0.14);
  whoosh(s, at(104.2), at(0.5), 3000, 500, 0.08);
  chip(s, at(106.1), 200, 520, 0.18, 0.05);
  [90, 93, 98].forEach((m, i) => bell(s, at(106.4 + i * 0.08), m, 0.04));
  [106.2, 106.35, 106.5, 106.65].forEach(b => tick(s, at(b), 0.05));
  riser(s, at(110.2), at(111.95), 0.2);
  swell(s, at(112), at(1), 0.28);
}

function vision(s) {
  impact(s, at(112), 0.9);
  pad(s, at(112), at(120), [47, 54, 57, 62, 66, 69], 0.06, 800, 7000, at(0.2));
  for (let n = 112; n < 120; n++) {
    kick(s, at(n), 0.9);
    s.pump(at(n));
    hat(s, at(n + 0.5), 0.14, true);
  }
  harmony(s, 112, 120, { stabs: false, level: 0.8 });
  chip(s, at(113.2), 300, 700, 0.1, 0.05);
  chip(s, at(115.6), 1600, 300, 0.4, 0.05);
  impact(s, at(116), 0.6);
  [74, 78, 81, 86, 90].forEach((m, i) => chip(s, at(116.1 + i * 0.09), hz(m), hz(m), 0.08, 0.04));
  [
    116, 116.5, 117, 117.5, 118, 118.25, 118.5, 118.75, 119, 119.125, 119.25, 119.375, 119.5, 119.625, 119.75, 119.875,
  ].forEach((n, i) => snare(s, at(n), 0.2 + i * 0.045));
  riser(s, at(116), at(119.95), 0.26);
  swell(s, at(120), at(1.2), 0.35);
}

function finale(s) {
  impact(s, at(120), 1.3);
  pad(s, at(120), DURATION, [38, 50, 57, 61, 64, 66, 69], 0.08, 5000, 500, at(4));
  [74, 78, 81, 85, 88, 90].forEach((m, i) => bell(s, at(120 + i * 0.125), m, 0.06));
  thud(s, at(120.6), 0.7);
  meow(s, at(121.2), 0.08);
  [120.8, 121.3, 121.5, 122.2].forEach(b => tick(s, at(b), 0.05));
  for (let k = 0; k < 16; k++) pluck(s, at(122 + k / 2), ARPS.D[[0, 1, 2, 3, 2, 1, 2, 3][k % 8]], 0.05 * (1 - k / 18));
}

function groove(s) {
  for (const [a, b] of GROOVE) {
    drums(s, a, b);
    harmony(s, a, b);
  }
}

function fade(s) {
  const g = s.master.gain;
  g.setValueAtTime(0.45, DURATION - 0.6);
  g.linearRampToValueAtTime(0, DURATION);
}

export const score = [intro, hello, groove, stack, work, peekstore, shield, miniout, vision, finale, fade];
