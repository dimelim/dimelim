import { FPS, DURATION, BEAT, IMPACTS } from './time.js';
import { decay } from '../../math.js';
import { draw, setup } from './timeline.js';
import { score } from './score.js';

export default {
  fps: FPS,
  duration: DURATION,
  draw,
  setup,
  score,
  grain: 0.035,
  hit: t => decay(t / BEAT, IMPACTS, 5),
};
