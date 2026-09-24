import { RATE } from './studio.js';

export function normalize(buffer) {
  const channels = [0, 1].map(c => buffer.getChannelData(c));
  const peak = Math.max(...channels.map(d => d.reduce((m, v) => Math.max(m, Math.abs(v)), 0)));
  const k = 0.85 / peak;
  channels.forEach(d => d.forEach((v, i) => (d[i] = v * k)));
  return channels;
}

export function wav([left, right]) {
  const n = left.length;
  const view = new DataView(new ArrayBuffer(44 + n * 4));
  const text = (o, s) => [...s].forEach((c, i) => view.setUint8(o + i, c.charCodeAt(0)));
  text(0, 'RIFF');
  view.setUint32(4, 36 + n * 4, true);
  text(8, 'WAVEfmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 2, true);
  view.setUint32(24, RATE, true);
  view.setUint32(28, RATE * 4, true);
  view.setUint16(32, 4, true);
  view.setUint16(34, 16, true);
  text(36, 'data');
  view.setUint32(40, n * 4, true);
  for (let i = 0; i < n; i++) {
    view.setInt16(44 + i * 4, Math.round(Math.max(-1, Math.min(1, left[i])) * 32767), true);
    view.setInt16(46 + i * 4, Math.round(Math.max(-1, Math.min(1, right[i])) * 32767), true);
  }
  return view.buffer;
}
