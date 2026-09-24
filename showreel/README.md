# Claude — Motion Showreel

15 s · 1920×1080 · 60 fps · 128 BPM. Every frame and every sound is generated in code: Canvas 2D, a GLSL shader and Web Audio, rendered headless with Playwright and encoded with ffmpeg.

```sh
npm install
npx playwright install chromium
npm run preview   # build/preview.mp4, half resolution, no motion blur
npm run build     # showreel.mp4, full quality, 8-sample motion blur
```
