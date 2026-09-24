import { BEAT, DURATION, ROLL } from '../time.js';
import { rng } from '../math.js';
import { bezier } from '../ease.js';
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
  glide,
  bubble,
} from './instruments.js';

const at = n => n * BEAT;
const ease = bezier(0.7, 0, 0.2, 1);
const CHORDS = { Fm: [53, 56, 60, 63, 67], Db: [49, 53, 56, 60], Ab: [56, 60, 63, 67], Eb: [51, 55, 58, 63, 65] };
const ROOTS = { Fm: 41, Db: 37, Ab: 44, Eb: 39 };
const PROGRESSION = ['Fm', 'Db', 'Ab', 'Eb', 'Fm'];

const curve = (n, f) => Array.from({ length: n }, (_, i) => f(i / (n - 1)));

function intro(s) {
  pad(s, 0, at(4.02), [41, ...CHORDS.Fm], 0.045, 280, 1800);
  [0, 1, 2, 3].forEach(n => tick(s, at(n), 0.22));
  glide(
    s,
    at(0.35),
    at(1.15),
    curve(32, x => 280 + 600 * x),
    0.035,
  );
  pluck(s, at(0.6), 84, 0.1);
  pluck(s, at(0.7), 91, 0.08);
  blip(s, at(1.0), 1320, 0.12, 0.1);
  glide(
    s,
    at(1.15),
    at(2.75),
    curve(64, x => 330 * 4 ** ease(x)),
    0.06,
  );
  bell(s, at(2.75), 89, 0.12);
  whoosh(s, at(2.95), at(0.7), 500, 3000, 0.22, 0.6, 0);
  swell(s, at(4), at(0.9), 0.3);
}

function build(s) {
  impact(s, at(4));
  pad(s, at(4), at(6.02), [41, ...CHORDS.Fm], 0.06, 700, 2600);
  pad(s, at(6), at(7.85), [39, ...CHORDS.Eb], 0.07, 1000, 6000);
  ROLL.forEach((n, i) => snare(s, at(n), 0.3 + (0.7 * i) / ROLL.length));
  riser(s, at(4.5), at(7.95), 0.28);
  swell(s, at(8), at(1.5), 0.35);
  whoosh(s, at(7.4), at(0.6), 200, 6000, 0.3);
}

function groove(s) {
  for (let n = 8; n < 28; n++) {
    kick(s, at(n));
    s.pump(at(n));
    if (n % 2) clap(s, at(n), 0.8);
    hat(s, at(n + 0.5), 0.18, true);
    for (let k = 0; k < 4; k++) if (n + k / 4 < 27.75) hat(s, at(n + k / 4), k % 2 ? 0.1 : 0.05);
  }
  PROGRESSION.forEach((name, i) => {
    const bar = 8 + i * 4;
    for (let n = 0; n < 4; n++) bass(s, at(bar + n + 0.5), ROOTS[name], at(0.42));
    for (const cell of [0, 2]) for (const off of [0, 0.75, 1.5]) stab(s, at(bar + cell + off), CHORDS[name]);
  });
  const ARPS = [
    [12, [73, 77, 80, 84]],
    [16, [68, 72, 75, 79]],
  ];
  for (const [bar, notes] of ARPS) {
    for (let k = 0; k < 16; k++) {
      const i = [0, 1, 2, 3, 2, 1, 2, 3][k % 8];
      arp(s, at(bar + k / 4), notes[i] + (k >= 8 ? 12 : 0), 0.035, k % 2 ? 0.4 : -0.4);
    }
  }
}

function form(s) {
  impact(s, at(8), 1.1);
  [72, 75, 77, 80].forEach((m, i) => pluck(s, at(8 + i), m, 0.16));
  [9, 10, 11].forEach(n =>
    glide(
      s,
      at(n),
      at(n + 0.3),
      curve(16, x => 400 * 2 ** (x * 1.5)),
      0.04,
    ),
  );
  [
    [8.5, -0.8, 0.8],
    [9.5, 0.8, -0.8],
    [10.5, -0.8, 0.8],
  ].forEach(([n, a, c]) => whoosh(s, at(n), at(0.45), 800, 4000, 0.16, a, c));
  whoosh(s, at(11.45), at(0.55), 300, 5000, 0.2);
}

function depth(s) {
  impact(s, at(12));
  whoosh(s, at(12), at(1.2), 3000, 200, 0.18);
  [13, 14, 15].forEach(n => blip(s, at(n), 1046.5, 0.07, 0.4, 0, 0.8));
  whoosh(s, at(13.9), at(0.7), 400, 6000, 0.3, -0.9, 0.9);
  glide(
    s,
    at(15.4),
    at(16),
    curve(32, x => 900 * 0.2 ** x * (1 + 0.06 * Math.sin(x * 40))),
    0.06,
  );
}

function flow(s) {
  impact(s, at(16));
  const r = rng(5);
  for (let i = 0; i < 12; i++) bubble(s, at(16.3 + r() * 3), 300 + r() * 500, 0.08, r() * 1.6 - 0.8);
  glide(
    s,
    at(18.9),
    at(19.6),
    curve(24, x => 700 * 0.4 ** x),
    0.05,
  );
  swell(s, at(20), at(0.4), 0.3);
}

function systems(s) {
  impact(s, at(20));
  const r = rng(9);
  for (let i = 0; i < 44; i++)
    blip(s, at(20.1 + r() ** 1.3 * 1.9), 2000 + r() * 5000, 0.03 + r() * 0.03, 0.05, r() * 2 - 1, 0.3);
  blip(s, at(22), 880, 0.14, 0.12);
  blip(s, at(22), 1760, 0.1, 0.08);
  for (let k = 0; k < 16; k++) pluck(s, at(22.25 + k / 12), [75, 82, 87, 91][k % 4], 0.04);
  glide(
    s,
    at(23.3),
    at(24),
    curve(24, x => 200 * 10 ** x),
    0.05,
  );
  swell(s, at(24), at(0.8), 0.35);
}

function type(s) {
  impact(s, at(24));
  for (let j = 0; j < 6; j++) tick(s, at(24 + j * 0.04), 0.12);
  [75, 77, 79, 80, 82, 84].forEach((m, i) => {
    pluck(s, at(24.5 + 0.5 * i), m, 0.14);
    whoosh(s, at(24.3 + 0.5 * i), at(0.3), 1500, 5000, 0.07);
  });
  [26, 26.5, 27, 27.25, 27.5, 27.5625, 27.625, 27.6875].forEach((n, i) => snare(s, at(n), 0.3 + i * 0.08));
  riser(s, at(25.5), at(27.72), 0.22);
  whoosh(s, at(26.75), at(0.35), 400, 5000, 0.18);
}

function finale(s) {
  impact(s, at(28), 1.3);
  pad(s, at(28), DURATION, [29, 41, 48, 56, 60, 67], 0.085, 5000, 500, at(3.5));
  [72, 77, 80, 84, 89, 92].forEach((m, i) => bell(s, at(28 + i * 0.125), m, 0.1));
  bell(s, at(28.8), 96, 0.05);
  const line = 'AVAILABLE FOR NEW PROJECTS';
  [...line].forEach((c, k) => c !== ' ' && tick(s, at(29.2 + (k + 0.5) / line.length), 0.04));
}

function gate(s) {
  const g = s.master.gain;
  g.setValueAtTime(0.45, at(27.74));
  g.linearRampToValueAtTime(0, at(27.76));
  g.setValueAtTime(0.45, at(28) - 0.002);
  g.setValueAtTime(0.45, DURATION - 0.5);
  g.linearRampToValueAtTime(0, DURATION);
}

export const score = [intro, build, groove, form, depth, flow, systems, type, finale, gate];
