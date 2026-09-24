export const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
export const lerpRgb = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
export const css = ([r, g, b], a = 1) => `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a})`;
export const mix = (a, b, t) => css(lerpRgb(rgb(a), rgb(b), t));
export const alpha = (hex, a) => css(rgb(hex), a);
