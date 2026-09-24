# Motion reels

Videos generated entirely in code: Canvas 2D, GLSL and Web Audio, rendered headless with Playwright and encoded with ffmpeg. The engine in `src/` is shared; each reel lives in `src/reels/<name>/` with its own timeline, scenes and score.

| Reel | Length | Output |
| --- | --- | --- |
| `claude` | 15 s · 1080p60 | `claude.mp4` |

```sh
npm install
npx playwright install chromium
npm run preview -- claude   # build/claude-preview.mp4, half resolution, no motion blur
npm run build -- claude     # claude.mp4, full quality, 8-sample motion blur
```
