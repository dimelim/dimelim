export const ink = '#0E0E11';
export const paper = '#F3EEE6';
export const coral = '#FF6A3D';
export const blue = '#2E3CFF';
export const navy = '#101A8C';
export const sky = '#9DA6FF';
export const lime = '#D6FF3D';
export const pink = '#FF5C9E';
export const violet = '#6F4BFF';

export const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
export const lerpRgb = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
export const css = ([r, g, b], a = 1) => `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a})`;
export const mix = (a, b, t) => css(lerpRgb(rgb(a), rgb(b), t));
export const alpha = (hex, a) => css(rgb(hex), a);
