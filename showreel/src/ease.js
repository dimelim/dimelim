export const inQuad = x => x * x;
export const outQuad = x => 1 - (1 - x) ** 2;
export const inCubic = x => x ** 3;
export const outCubic = x => 1 - (1 - x) ** 3;
export const inOutCubic = x => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2);
export const inQuart = x => x ** 4;
export const outQuart = x => 1 - (1 - x) ** 4;
export const inQuint = x => x ** 5;
export const outQuint = x => 1 - (1 - x) ** 5;
export const inOutQuint = x => (x < 0.5 ? 16 * x ** 5 : 1 - (-2 * x + 2) ** 5 / 2);
export const inExpo = x => (x <= 0 ? 0 : 2 ** (10 * x - 10));
export const outExpo = x => (x >= 1 ? 1 : 1 - 2 ** (-10 * x));
export const inOutExpo = x =>
  x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? 2 ** (20 * x - 10) / 2 : (2 - 2 ** (-20 * x + 10)) / 2;
export const outBack = (x, s = 1.70158) => 1 + (s + 1) * (x - 1) ** 3 + s * (x - 1) ** 2;
export const inBack = (x, s = 1.70158) => (s + 1) * x ** 3 - s * x ** 2;
export const spring = (x, freq = 2.2, damp = 5.5) =>
  x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.exp(-damp * x) * Math.cos(Math.PI * 2 * freq * x);

export function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1,
    bx = 3 * (x2 - x1) - cx,
    ax = 1 - cx - bx;
  const cy = 3 * y1,
    by = 3 * (y2 - y1) - cy,
    ay = 1 - cy - by;
  const sx = u => ((ax * u + bx) * u + cx) * u;
  const sy = u => ((ay * u + by) * u + cy) * u;
  const dx = u => (3 * ax * u + 2 * bx) * u + cx;
  const solve = x => {
    let u = x;
    for (let i = 0; i < 8; i++) {
      const e = sx(u) - x;
      const d = dx(u);
      if (Math.abs(e) < 1e-7) return u;
      if (Math.abs(d) < 1e-6) break;
      u -= e / d;
    }
    let lo = 0,
      hi = 1;
    u = x;
    while (hi - lo > 1e-7) {
      if (sx(u) < x) lo = u;
      else hi = u;
      u = (lo + hi) / 2;
    }
    return u;
  };
  return x => (x <= 0 ? 0 : x >= 1 ? 1 : sy(solve(x)));
}
