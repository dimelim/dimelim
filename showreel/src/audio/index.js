import { DURATION } from '../time.js';
import { RATE, studio } from './studio.js';
import { score } from './score.js';
import { normalize, wav } from './wav.js';

export async function soundtrack() {
  const ctx = new OfflineAudioContext(2, Math.round(DURATION * RATE), RATE);
  const s = studio(ctx);
  score.forEach(part => part(s));
  return wav(normalize(await ctx.startRendering()));
}
