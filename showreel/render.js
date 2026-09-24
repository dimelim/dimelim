import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { once } from 'node:events';
import { spawn } from 'node:child_process';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import ffmpeg from 'ffmpeg-static';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const ARGS = process.argv.slice(2);
const PREVIEW = ARGS.includes('--preview');
const REEL = ARGS.find(arg => !arg.startsWith('--')) ?? 'claude';
const OPTIONS = { reel: REEL, ...(PREVIEW ? { scale: 0.5, samples: 1 } : { scale: 1, samples: 8 }) };
const OUT = path.join(ROOT, PREVIEW ? `build/${REEL}-preview.mp4` : `${REEL}.mp4`);
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2' };

function serve() {
  const server = http.createServer(async (req, res) => {
    const file = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'text/plain' }).end(body);
    } catch {
      res.writeHead(404).end();
    }
  });
  return new Promise(resolve => server.listen(0, () => resolve(server)));
}

async function open(browser, url) {
  const page = await browser.newPage();
  page.on('pageerror', error => {
    console.error(error);
    process.exit(1);
  });
  await page.goto(url);
  await page.waitForFunction(() => window.reel);
  return page;
}

function encoder(audio, fps) {
  const args = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-i', audio];
  const video = ['-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p'];
  const sound = ['-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', '-shortest', OUT];
  return spawn(ffmpeg, [...args, ...video, ...sound], { stdio: ['pipe', 'inherit', 'inherit'] });
}

function sequencer(stream) {
  const ready = new Map();
  let next = 0;
  return async (index, png) => {
    ready.set(index, png);
    while (ready.has(next)) {
      const chunk = ready.get(next);
      ready.delete(next++);
      if (!stream.write(chunk)) await once(stream, 'drain');
    }
  };
}

const server = await serve();
const url = `http://localhost:${server.address().port}/index.html`;
const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-accelerated-2d-canvas'],
});
await mkdir(path.join(ROOT, 'build'), { recursive: true });

const audio = path.join(ROOT, `build/${REEL}.wav`);
const composer = await open(browser, url);
await composer.evaluate(options => window.reel.init(options), { reel: REEL, scale: 0.1 });
const { fps, frames } = await composer.evaluate(() => window.reel.info());
await writeFile(audio, Buffer.from(await composer.evaluate(() => window.reel.audio()), 'base64'));
await composer.close();

const ffmpegProcess = encoder(audio, fps);
const deliver = sequencer(ffmpegProcess.stdin);
const workers = os.cpus().length;
const started = Date.now();
let done = 0;

await Promise.all(
  Array.from({ length: workers }, async (_, worker) => {
    const page = await open(browser, url);
    await page.evaluate(options => window.reel.init(options), OPTIONS);
    for (let frame = worker; frame < frames; frame += workers) {
      const data = await page.evaluate(i => window.reel.frame(i), frame);
      await deliver(frame, Buffer.from(data.slice(data.indexOf(',') + 1), 'base64'));
      if (++done % 60 === 0) console.log(`${done}/${frames} frames · ${Math.round((Date.now() - started) / 1000)}s`);
    }
    await page.close();
  }),
);

ffmpegProcess.stdin.end();
await once(ffmpegProcess, 'close');
await browser.close();
server.close();
console.log(OUT);
