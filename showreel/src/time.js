export const W = 1920;
export const H = 1080;
export const FPS = 60;
export const BPM = 128;
export const BEAT = 60 / BPM;
export const DURATION = BEAT * 32;
export const FRAMES = Math.round(DURATION * FPS);
export const IMPACTS = [4, 8, 12, 16, 20, 24, 28];
export const ROLL = [
  5, 5.5, 6, 6.25, 6.5, 6.75, 7, 7.125, 7.25, 7.375, 7.5, 7.5625, 7.625, 7.6875, 7.75, 7.8125, 7.875, 7.9375,
];
