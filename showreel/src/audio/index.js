import { RATE, studio } from './studio.js';
import { normalize, wav } from './wav.js';

export async function soundtrack(score, duration) {
  const ctx = new OfflineAudioContext(2, Math.round(duration * RATE), RATE);
  const s = studio(ctx);
  score.forEach(part => part(s));
  return wav(normalize(await ctx.startRendering()));
}
