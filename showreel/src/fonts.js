const root = './node_modules/';
const WIDTHS = Array.from({ length: 51 }, (_, i) => 50 + i * 2);
const FACES = [
  ['RMono', '@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2', { weight: '100 800' }],
  ['RSerif', '@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2', {}],
  ['RSerif', '@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2', { style: 'italic' }],
  ['RSans', '@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2', { weight: '100 900' }],
  ['RGeist', '@fontsource-variable/geist/files/geist-latin-wght-normal.woff2', { weight: '100 900' }],
  ['RGeistMono', '@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2', { weight: '100 900' }],
  ['RNews', '@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2', { weight: '200 800' }],
  [
    'RNews',
    '@fontsource-variable/newsreader/files/newsreader-latin-wght-italic.woff2',
    { weight: '200 800', style: 'italic' },
  ],
  ['RFig', '@fontsource-variable/figtree/files/figtree-latin-wght-normal.woff2', { weight: '300 900' }],
  [
    'RJakarta',
    '@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2',
    { weight: '200 800' },
  ],
  ['RPixel', '@fontsource-variable/pixelify-sans/files/pixelify-sans-latin-wght-normal.woff2', { weight: '400 700' }],
];
const DISPLAY = '@fontsource-variable/anybody/files/anybody-latin-standard-normal.woff2';

const fetchFont = async file => (await fetch(root + file)).arrayBuffer();

export async function loadFonts() {
  const display = await fetchFont(DISPLAY);
  const faces = [
    ...WIDTHS.map(w => new FontFace(`RD${w}`, display, { weight: '100 900', stretch: `${w}%` })),
    ...(await Promise.all(
      FACES.map(async ([family, file, options]) => new FontFace(family, await fetchFont(file), options)),
    )),
  ];
  await Promise.all(faces.map(f => f.load()));
  faces.forEach(f => document.fonts.add(f));
}

const nearestWidth = w => WIDTHS[Math.round((Math.min(150, Math.max(50, w)) - 50) / 2)];
const clampWeight = (w, lo, hi) => Math.round(Math.min(hi, Math.max(lo, w)));

export const display = (size, weight = 800, width = 100) =>
  `${clampWeight(weight, 100, 900)} ${size}px RD${nearestWidth(width)}`;
export const mono = (size, weight = 400) => `${weight} ${size}px RMono`;
export const serif = (size, italic = true) => `${italic ? 'italic ' : ''}${size}px RSerif`;
export const sans = (size, weight = 500) => `${weight} ${size}px RSans`;
export const geist = (size, weight = 600) => `${clampWeight(weight, 100, 900)} ${size}px RGeist`;
export const geistMono = (size, weight = 400) => `${clampWeight(weight, 100, 900)} ${size}px RGeistMono`;
export const newsreader = (size, weight = 500, italic = false) =>
  `${italic ? 'italic ' : ''}${clampWeight(weight, 200, 800)} ${size}px RNews`;
export const figtree = (size, weight = 400) => `${clampWeight(weight, 300, 900)} ${size}px RFig`;
export const jakarta = (size, weight = 600) => `${clampWeight(weight, 200, 800)} ${size}px RJakarta`;
export const pixel = (size, weight = 500) => `${clampWeight(weight, 400, 700)} ${size}px RPixel`;
