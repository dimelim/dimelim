import { W, H } from './time.js';

export const stage = { scale: 1 };

export function layer() {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(W * stage.scale);
  canvas.height = Math.round(H * stage.scale);
  return { canvas, ctx: canvas.getContext('2d') };
}

export function reset(ctx) {
  ctx.setTransform(stage.scale, 0, 0, stage.scale, 0, 0);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  ctx.filter = 'none';
  ctx.setLineDash([]);
  ctx.letterSpacing = '0px';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

export function clear(ctx) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
}
