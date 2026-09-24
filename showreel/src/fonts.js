const root = './node_modules/';
const files = {
  display: '@fontsource-variable/anybody/files/anybody-latin-standard-normal.woff2',
  mono: '@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2',
  serif: '@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2',
  italic: '@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2',
  sans: '@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2',
};
const WIDTHS = Array.from({ length: 51 }, (_, i) => 50 + i * 2);

const fetchFont = async file => (await fetch(root + file)).arrayBuffer();

export async function loadFonts() {
  const [display, mono, serif, italic, sans] = await Promise.all(Object.values(files).map(fetchFont));
  const faces = [
    ...WIDTHS.map(w => new FontFace(`RD${w}`, display, { weight: '100 900', stretch: `${w}%` })),
    new FontFace('RMono', mono, { weight: '100 800' }),
    new FontFace('RSerif', serif),
    new FontFace('RSerif', italic, { style: 'italic' }),
    new FontFace('RSans', sans, { weight: '100 900' }),
  ];
  await Promise.all(faces.map(f => f.load()));
  faces.forEach(f => document.fonts.add(f));
}

const nearestWidth = w => WIDTHS[Math.round((Math.min(150, Math.max(50, w)) - 50) / 2)];

export const display = (size, weight = 800, width = 100) =>
  `${Math.round(Math.min(900, Math.max(100, weight)))} ${size}px RD${nearestWidth(width)}`;
export const mono = (size, weight = 400) => `${weight} ${size}px RMono`;
export const serif = (size, italic = true) => `${italic ? 'italic ' : ''}${size}px RSerif`;
export const sans = (size, weight = 500) => `${weight} ${size}px RSans`;
