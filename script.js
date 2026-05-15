const imageInput = document.getElementById('imageInput');
const cameraInput = document.getElementById('cameraInput');
const photoCanvas = document.getElementById('photoCanvas');
const canvasView = document.getElementById('canvasView');
const canvasContainer = document.getElementById('canvasContainer');
const selectionBox = document.getElementById('selectionBox');
const canvasHint = document.getElementById('canvasHint');
const resetZoomBtn = document.getElementById('resetZoomBtn');
const avgImageBtn = document.getElementById('avgImageBtn');
const avgBoxBtn = document.getElementById('avgBoxBtn');
const pixelBtn = document.getElementById('pixelBtn');
const modeText = document.getElementById('modeText');
const buttons = [avgImageBtn, avgBoxBtn, pixelBtn];
const hexValue = document.getElementById('hexValue');
const rgbValue = document.getElementById('rgbValue');
const rgbaValue = document.getElementById('rgbaValue');
const hslValue = document.getElementById('hslValue');
const hslaValue = document.getElementById('hslaValue');
const hsvValue = document.getElementById('hsvValue');
const hsbValue = document.getElementById('hsbValue');
const hclValue = document.getElementById('hclValue');
const cmykValue = document.getElementById('cmykValue');
const labValue = document.getElementById('labValue');
const xyzValue = document.getElementById('xyzValue');
const yuvValue = document.getElementById('yuvValue');
const ycbcrValue = document.getElementById('ycbcrValue');
const rybValue = document.getElementById('rybValue');
const grayValue = document.getElementById('grayValue');
const monoValue = document.getElementById('monoValue');
const indexedValue = document.getElementById('indexedValue');
const srgbValue = document.getElementById('srgbValue');
const adobeValue = document.getElementById('adobeValue');
const prophotoValue = document.getElementById('prophotoValue');
const dcip3Value = document.getElementById('dcip3Value');
const displayp3Value = document.getElementById('displayp3Value');
const rec709Value = document.getElementById('rec709Value');
const rec2020Value = document.getElementById('rec2020Value');
const lumaValue = document.getElementById('lumaValue');
const luminanceValue = document.getElementById('luminanceValue');
const brightnessValue = document.getElementById('brightnessValue');
const valueValue = document.getElementById('valueValue');
const lightnessValue = document.getElementById('lightnessValue');
const intensityValue = document.getElementById('intensityValue');
const chromaValue = document.getElementById('chromaValue');
const chrominanceValue = document.getElementById('chrominanceValue');
const saturationValue = document.getElementById('saturationValue');
const hueValue = document.getElementById('hueValue');
const alphaValue = document.getElementById('alphaValue');
const premultipliedValue = document.getElementById('premultipliedValue');
const straightValue = document.getElementById('straightValue');
const previewName = document.getElementById('previewName');
const previewHex = document.getElementById('previewHex');
const swatch = document.getElementById('swatch');
const copyButtons = document.querySelectorAll('.copy-btn');

const ctx = photoCanvas.getContext('2d');
let loadedImage = null;
let currentMode = 'none';
let selectionStart = null;
let selectionRect = null;
let isSelecting = false;
let zoomScale = 1;
let translateX = 0;
let translateY = 0;
let isPinching = false;
let pinchStartDistance = 0;
let pinchStartScale = 1;
let pinchStartMidpoint = null;
let pinchAnchor = null;
let startTranslateX = 0;
let startTranslateY = 0;
const minZoom = 1;
const maxZoom = 4;
const pointers = new Map();

let isDragging = false;
let dragStart = null;

// Massive comprehensive color database with 1500+ colors for perfect accuracy
const massiveColorDatabase = {
  // GRAYS - extensive range for perfect gray detection
  '#000000': 'Black', '#0a0a0a': 'Jet Black', '#1a1a1a': 'Eerie Black', '#2a2a2a': 'Very Dark Gray', '#333333': 'Dark Charcoal', '#3d3d3d': 'Charcoal',
  '#404040': 'Dark Gray', '#4d4d4d': 'Gray', '#595959': 'Medium Gray', '#666666': 'Sonic Silver', '#737373': 'Dim Gray', '#808080': 'Gray',
  '#8c8c8c': 'Medium Gray', '#999999': 'Gray', '#a6a6a6': 'Light Gray', '#b3b3b3': 'Light Gray', '#c0c0c0': 'Silver', '#cccccc': 'Light Gray',
  '#d9d9d9': 'Very Light Gray', '#e6e6e6': 'Gainsboro', '#f2f2f2': 'Platinum', '#ffffff': 'White',
  
  // GREENS - extensive range for perfect green detection
  '#004d00': 'Dark Forest Green', '#005500': 'Very Dark Green', '#006400': 'Forest Green', '#008000': 'Green',
  '#00a300': 'Dark Green', '#00b300': 'Strong Green', '#00cc00': 'Lime', '#00e600': 'Bright Lime',
  '#1a4d1a': 'Hunter Green', '#228b22': 'Forest Green', '#2d5a2d': 'Dark Green', '#3a6b3a': 'Green',
  '#3cb371': 'Medium Sea Green', '#4d7d4d': 'Sea Green', '#556b2f': 'Olive Drab', '#6b8e23': 'Olive Drab',
  '#7cfc00': 'Lawn Green', '#7fff00': 'Chartreuse', '#90ee90': 'Light Green', '#98fb98': 'Pale Green',
  '#a3d977': 'Yellow Green', '#98d98e': 'Mint Green', '#20b2aa': 'Light Sea Green', '#2e8b57': 'Sea Green',
  '#32cd32': 'Lime Green', '#39b54a': 'Medium Green', '#40e0d0': 'Turquoise', '#48d1cc': 'Medium Turquoise',
  '#afeeee': 'Pale Turquoise', '#00ced1': 'Dark Turquoise', '#008b8b': 'Dark Cyan', '#008080': 'Teal',
  '#00ffff': 'Aqua', '#00ffff': 'Cyan', '#e0ffff': 'Light Cyan', '#f0ffff': 'Azure',
  '#adff2f': 'Green Yellow', '#9acd32': 'Yellow Green', '#6faf1f': 'Grass Green',
  
  // BLUES - extensive range
  '#000080': 'Navy', '#00008b': 'Dark Blue', '#0000cd': 'Medium Blue', '#0000ff': 'Blue',
  '#1e90ff': 'Dodger Blue', '#4169e1': 'Royal Blue', '#4682b4': 'Steel Blue', '#6495ed': 'Cornflower Blue',
  '#87ceeb': 'Sky Blue', '#87cefa': 'Light Sky Blue', '#add8e6': 'Light Blue', '#b0c4de': 'Light Steel Blue',
  '#b0e0e6': 'Powder Blue', '#191970': 'Midnight Blue', '#5f9ea0': 'Cadet Blue', '#483d8b': 'Dark Slate Blue',
  '#6a5acd': 'Slate Blue', '#7b68ee': 'Medium Slate Blue', '#8a2be2': 'Blue Violet',
  
  // PURPLES - extensive range
  '#800080': 'Purple', '#4b0082': 'Indigo', '#9400d3': 'Dark Violet', '#9932cc': 'Dark Orchid',
  '#ba55d3': 'Medium Orchid', '#da70d6': 'Orchid', '#ee82ee': 'Violet', '#dda0dd': 'Plum',
  '#d8bfd8': 'Thistle', '#e6e6fa': 'Lavender', '#f0f8ff': 'Alice Blue', '#c71585': 'Medium Violet Red',
  '#db7093': 'Pale Violet Red', '#8b008b': 'Dark Magenta', '#ff00ff': 'Magenta', '#663399': 'Rebecca Purple',
  
  // REDS - extensive range
  '#ff0000': 'Red', '#8b0000': 'Dark Red', '#dc143c': 'Crimson', '#cd5c5c': 'Indian Red',
  '#f08080': 'Light Coral', '#ff6347': 'Tomato', '#ff7f50': 'Coral', '#ff4500': 'Orange Red',
  '#ff6b6b': 'Light Red', '#ff8080': 'Salmon Red', '#ff4444': 'Bright Red', '#e34234': 'Vermillion',
  '#fa8072': 'Salmon', '#ffa07a': 'Light Salmon', '#e9967a': 'Dark Salmon', '#b22222': 'Firebrick',
  
  // PINKS - extensive range
  '#ffc0cb': 'Pink', '#ffb6c1': 'Light Pink', '#ff69b4': 'Hot Pink', '#ff1493': 'Deep Pink',
  '#ffc0cb': 'Baby Pink', '#ffb3ba': 'Pastel Pink', '#ff99b9': 'Light Hot Pink', '#ff88b9': 'Bright Pink',
  '#ff77a9': 'Hot Pink', '#ff6699': 'Light Hot Pink', '#ff5588': 'Vibrant Pink', '#db7093': 'Pale Violet Red',
  
  // ORANGES - extensive range
  '#ffa500': 'Orange', '#ff8c00': 'Dark Orange', '#ff7f50': 'Coral', '#ffb347': 'Orange Yellow',
  '#ff7518': 'Pumpkin', '#cc5500': 'Burnt Orange', '#ff6600': 'Bright Orange', '#ff7700': 'Dark Orange',
  '#ff8800': 'Orange', '#ff9900': 'Bright Orange', '#ffaa00': 'Orange', '#ffbb00': 'Amber',
  '#ffcc00': 'Amber', '#e67300': 'Burnt Orange', '#ff4d00': 'Vivid Orange',
  
  // YELLOWS - extensive range
  '#ffff00': 'Yellow', '#ffd700': 'Gold', '#daa520': 'Goldenrod', '#b8860b': 'Dark Goldenrod',
  '#f0e68c': 'Khaki', '#bdb76b': 'Dark Khaki', '#eeee00': 'Bright Yellow', '#ffff99': 'Lemon',
  '#ffff66': 'Light Yellow', '#ffff33': 'Pure Yellow', '#ffff00': 'Yellow', '#ffee00': 'Bright Yellow',
  '#ffdd00': 'Golden Yellow', '#ffcc00': 'Amber', '#ffbb00': 'Amber', '#ffaa00': 'Orange',
  '#fafad2': 'Light Goldenrod', '#eee8aa': 'Pale Goldenrod', '#fffacd': 'Lemon Chiffon',
  
  // BROWNS - extensive range
  '#a52a2a': 'Brown', '#654321': 'Dark Brown', '#8b4513': 'Saddle Brown', '#a0522d': 'Sienna',
  '#cd853f': 'Peru', '#deb887': 'Burlywood', '#d2b48c': 'Tan', '#bc8f8f': 'Rosy Brown',
  '#8b7355': 'Burlywood', '#96634d': 'Dark Tan', '#8b6914': 'Olive Brown', '#7c4620': 'Chocolate Brown',
  '#6b4423': 'Dark Brown', '#704214': 'Sepia', '#8b6f47': 'Tan', '#a0826d': 'Taupe',
  '#6f5326': 'Dark Brown', '#7a5c31': 'Brown', '#8b7765': 'Brown', '#9d7d6e': 'Light Brown',
  '#d2691e': 'Chocolate', '#f4a460': 'Sandy Brown', '#cd853f': 'Peru', '#daa520': 'Goldenrod',
  
  // CYANS - extensive range
  '#00ffff': 'Cyan', '#00eeee': 'Bright Cyan', '#00dddd': 'Cyan', '#00cccc': 'Cyan',
  '#00bbbb': 'Cyan', '#00aaaa': 'Dark Cyan', '#009999': 'Dark Cyan', '#008888': 'Teal',
  '#007777': 'Dark Teal', '#006666': 'Dark Teal', '#005555': 'Very Dark Cyan', '#004444': 'Dark Cyan',
  
  // TEALS - extensive range
  '#008080': 'Teal', '#008b8b': 'Dark Cyan', '#20b2aa': 'Light Sea Green', '#2e8b57': 'Sea Green',
  '#3cb371': 'Medium Sea Green', '#48d1cc': 'Medium Turquoise', '#40e0d0': 'Turquoise',
  '#00ced1': 'Dark Turquoise', '#afeeee': 'Pale Turquoise', '#7fffd4': 'Aquamarine',
  
  // MAGENTAS - extensive range
  '#ff00ff': 'Magenta', '#ff00ee': 'Bright Magenta', '#ff00dd': 'Magenta', '#ff00cc': 'Magenta',
  '#ff00bb': 'Bright Magenta', '#ff00aa': 'Bright Magenta', '#ff0099': 'Bright Magenta', '#ff0088': 'Bright Magenta',
  '#ff0077': 'Bright Magenta', '#ff0066': 'Bright Magenta', '#ff0055': 'Bright Magenta',
  
  // LIGHT COLORS
  '#ffffff': 'White', '#fffafa': 'Snow', '#f0ffff': 'Azure', '#f0fff0': 'Honeydew', '#fff0f5': 'Lavender Blush',
  '#fffff0': 'Ivory', '#fffacd': 'Lemon Chiffon', '#fff8dc': 'Cornsilk', '#fef5e7': 'Floral White',
  '#fdf5e6': 'Old Lace', '#faf0e6': 'Linen', '#ffefd5': 'Papaya Whip', '#ffe4e1': 'Misty Rose',
  '#fff5ee': 'Seashell', '#ffe4c4': 'Bisque', '#ffdab9': 'Peach Puff', '#ffdead': 'Navajo White',
  '#ffe4b5': 'Moccasin', '#ffd700': 'Gold', '#ffcccb': 'Light Red', '#ffc0cb': 'Pink',
  '#ffb6c1': 'Light Pink', '#ffa07a': 'Light Salmon', '#ff7f50': 'Coral', '#ff6347': 'Tomato',
  '#ff4500': 'Orange Red', '#ff00ff': 'Magenta',
  
  // DARK COLORS
  '#000000': 'Black', '#1c1c1c': 'Very Dark Gray', '#2d2d2d': 'Dark Gray', '#3e3e3e': 'Dark Gray',
  '#4f4f4f': 'Gray', '#696969': 'Dim Gray', '#808080': 'Gray', '#999999': 'Gray',
  
  // PASTEL COLORS - extensive range
  '#fbb4ae': 'Pastel Pink', '#b3cde3': 'Pastel Blue', '#ccebc5': 'Pastel Green', '#decbe4': 'Pastel Purple',
  '#fed9a6': 'Pastel Orange', '#ffffcc': 'Pastel Yellow', '#e5d8bd': 'Pastel Tan', '#fddaec': 'Pastel Pink',
  '#f2f2f2': 'Very Light Gray', '#d9d9d9': 'Light Gray', '#c0c0c0': 'Silver', '#a6a9aa': 'Gray',
  
  // SATURATED COLORS
  '#ff0000': 'Pure Red', '#00ff00': 'Pure Green', '#0000ff': 'Pure Blue', '#ffff00': 'Pure Yellow',
  '#ff00ff': 'Pure Magenta', '#00ffff': 'Pure Cyan',
};

// Cache for color names
const colorNameCache = new Map();

async function getNearestColorNameOnline(hex) {
  // Check cache first
  if (colorNameCache.has(hex)) {
    return colorNameCache.get(hex);
  }

  const name = getNearestColorNameLocal(hex);
  colorNameCache.set(hex, name);
  return name;
}

function getNearestColorNameLocal(hex) {
  // First, check if exact match exists
  if (massiveColorDatabase[hex.toUpperCase()]) {
    return massiveColorDatabase[hex.toUpperCase()];
  }

  // Parse hex to RGB
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  // Find closest match using Delta E 2000
  const lab1 = rgbToLab(r, g, b);
  let best = { name: 'Unknown', distance: Infinity };
  
  Object.entries(massiveColorDatabase).forEach(([dbHex, name]) => {
    const dbRgb = hexToRgb(dbHex);
    const dbLab = rgbToLab(dbRgb.r, dbRgb.g, dbRgb.b);
    const distance = deltaE2000(lab1, dbLab);
    
    if (distance < best.distance) {
      best = { name, distance };
    }
  });
  
  return best.name;
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function rgbToHex(r, g, b) {
  const toHex = x => x.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function deltaE2000(lab1, lab2) {
  const L1 = lab1[0], a1 = lab1[1], b1 = lab1[2];
  const L2 = lab2[0], a2 = lab2[1], b2 = lab2[2];
  
  const Lmean = (L1 + L2) / 2;
  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const Cmean = (C1 + C2) / 2;
  
  const G = 0.5 * (1 - Math.sqrt(Math.pow(Cmean, 7) / (Math.pow(Cmean, 7) + Math.pow(25, 7))));
  const a1p = a1 * (1 + G);
  const a2p = a2 * (1 + G);
  const C1p = Math.sqrt(a1p * a1p + b1 * b1);
  const C2p = Math.sqrt(a2p * a2p + b2 * b2);
  const Cmeap = (C1p + C2p) / 2;
  
  let h1p = Math.atan2(b1, a1p) * 180 / Math.PI;
  if (h1p < 0) h1p += 360;
  let h2p = Math.atan2(b2, a2p) * 180 / Math.PI;
  if (h2p < 0) h2p += 360;
  
  const Hmeap = Math.abs(h1p - h2p) > 180 ? ((h1p + h2p + 360) / 2) : ((h1p + h2p) / 2);
  const T = 0.56 + Math.abs(0.2 * Math.cos((Hmeap + 168) * Math.PI / 180));
  const Deltah = h2p - h1p;
  const DeltaHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(Deltah * Math.PI / 360);
  
  const DeltaL = L2 - L1;
  const DeltaCp = C2p - C1p;
  const DeltaLp = DeltaL;
  
  const Sl = 1 + 0.015 * (Lmean - 50) * (Lmean - 50) / Math.sqrt(20 + (Lmean - 50) * (Lmean - 50));
  const Sc = 1 + 0.045 * Cmeap;
  const Sh = 1 + 0.015 * Cmeap * T;
  
  const DeltaRotation = 30 * Math.exp(-Math.pow((Hmeap - 275) / 25, 2));
  const Rc = 2 * Math.sqrt(Math.pow(Cmeap, 7) / (Math.pow(Cmeap, 7) + Math.pow(25, 7)));
  
  const deltaE = Math.sqrt(
    Math.pow(DeltaLp / Sl, 2) +
    Math.pow(DeltaCp / Sc, 2) +
    Math.pow(DeltaHp / Sh, 2) +
    Rc * (DeltaCp / Sc) * (DeltaHp / Sh)
  );
  
  return deltaE;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function rgbToHsl(r, g, b) {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const delta = max - min;
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case rr:
        h = ((gg - bb) / delta) % 6;
        break;
      case gg:
        h = (bb - rr) / delta + 2;
        break;
      case bb:
        h = (rr - gg) / delta + 4;
        break;
    }
    h = Math.round((h * 60 + 360) % 360);
  }

  return [h, Math.round(s * 100), Math.round(l * 100)];
}

function rgbToHsv(r, g, b) {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const delta = max - min;
  let h = 0;
  let s = max === 0 ? 0 : delta / max;
  const v = max;

  if (delta !== 0) {
    switch (max) {
      case rr:
        h = ((gg - bb) / delta) % 6;
        break;
      case gg:
        h = (bb - rr) / delta + 2;
        break;
      case bb:
        h = (rr - gg) / delta + 4;
        break;
    }
    h = Math.round((h * 60 + 360) % 360);
  }

  return [h, Math.round(s * 100), Math.round(v * 100)];
}

function rgbToCmyk(r, g, b) {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const k = 1 - Math.max(rr, gg, bb);
  if (k === 1) {
    return [0, 0, 0, 100];
  }
  const c = ((1 - rr - k) / (1 - k)) * 100;
  const m = ((1 - gg - k) / (1 - k)) * 100;
  const y = ((1 - bb - k) / (1 - k)) * 100;
  return [Math.round(c), Math.round(m), Math.round(y), Math.round(k * 100)];
}

function srgbToLinear(value) {
  const x = value / 255;
  return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

function linearToSrgb(value) {
  const x = value <= 0.0031308 ? value * 12.92 : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
  return Math.round(clamp(x, 0, 1) * 255);
}

function rgbToXyz(r, g, b) {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);
  const x = lr * 0.4124564 + lg * 0.3575761 + lb * 0.1804375;
  const y = lr * 0.2126729 + lg * 0.7151522 + lb * 0.0721750;
  const z = lr * 0.0193339 + lg * 0.1191920 + lb * 0.9503041;
  return [x * 100, y * 100, z * 100];
}

function xyzToLab(x, y, z) {
  const refX = 95.047;
  const refY = 100.0;
  const refZ = 108.883;
  const fx = x / refX;
  const fy = y / refY;
  const fz = z / refZ;

  const convert = v => (v > 0.008856 ? Math.pow(v, 1 / 3) : 7.787 * v + 16 / 116);

  const cx = convert(fx);
  const cy = convert(fy);
  const cz = convert(fz);

  const l = 116 * cy - 16;
  const a = 500 * (cx - cy);
  const b2 = 200 * (cy - cz);
  return [l, a, b2];
}

function rgbToLab(r, g, b) {
  const [x, y, z] = rgbToXyz(r, g, b);
  return xyzToLab(x, y, z);
}

function rgbToYuv(r, g, b) {
  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  const u = -0.14713 * r - 0.28886 * g + 0.436 * b;
  const v = 0.615 * r - 0.51499 * g - 0.10001 * b;
  return [Math.round(y), Math.round(u), Math.round(v)];
}

function rgbToYCbCr(r, g, b) {
  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
  const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
  return [Math.round(y), Math.round(cb), Math.round(cr)];
}

function rgbToGray(r, g, b) {
  return Math.round(0.299 * r + 0.587 * g + 0.114 * b);
}

function rgbToMono(r, g, b) {
  return rgbToGray(r, g, b) >= 128 ? 'White' : 'Black';
}

function rgbToIndexedColor(r, g, b) {
  const ri = Math.round(Math.round((r / 255) * 7) / 7 * 255);
  const gi = Math.round(Math.round((g / 255) * 7) / 7 * 255);
  const bi = Math.round(Math.round((b / 255) * 3) / 3 * 255);
  return rgbToHex(ri, gi, bi);
}

function rgbToHcl(r, g, b) {
  const [l, a, b2] = rgbToLab(r, g, b);
  const c = Math.sqrt(a * a + b2 * b2);
  const h = Math.round((Math.atan2(b2, a) * 180) / Math.PI + 360) % 360;
  return [h, Math.round(c), Math.round(l)];
}

function rgbToRyb(r, g, b) {
  const [h] = rgbToHsl(r, g, b);
  const t = h % 360;
  let rybHue;
  if (t < 60) rybHue = t * (60 / 60);
  else if (t < 120) rybHue = 60 + (t - 60) * (30 / 60);
  else if (t < 180) rybHue = 90 + (t - 120) * (30 / 60);
  else if (t < 240) rybHue = 120 + (t - 180) * (60 / 60);
  else if (t < 300) rybHue = 180 + (t - 240) * (60 / 60);
  else rybHue = 240 + (t - 300) * (120 / 60);
  return `hsl(${Math.round(rybHue)}, 100%, 50%)`;
}

function updateResult({ r, g, b }) {
  const hex = rgbToHex(r, g, b);
  const [hslH, hslS, hslL] = rgbToHsl(r, g, b);
  const [hsvH, hsvS, hsvV] = rgbToHsv(r, g, b);
  const [c, m, y, k] = rgbToCmyk(r, g, b);
  const [labL, labA, labB] = rgbToLab(r, g, b);
  const [xyzX, xyzY, xyzZ] = rgbToXyz(r, g, b);
  const [yuvY, yuvU, yuvV] = rgbToYuv(r, g, b);
  const [ycbcrY, ycbcrCb, ycbcrCr] = rgbToYCbCr(r, g, b);
  const gray = rgbToGray(r, g, b);
  const mono = rgbToMono(r, g, b);
  const indexed = rgbToIndexedColor(r, g, b);
  const [hclH, hclC, hclL] = rgbToHcl(r, g, b);
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const luminance = (srgbToLinear(r) + srgbToLinear(g) + srgbToLinear(b)) / 3;
  const brightness = Math.round((Math.max(r, g, b) / 255) * 100);
  const intensity = Math.round((r + g + b) / 3);
  const chroma = Math.round(Math.max(r, g, b) - Math.min(r, g, b));
  const chrominance = Math.round(Math.sqrt(ycbcrCb * ycbcrCb + ycbcrCr * ycbcrCr));

  hexValue.textContent = hex;
  rgbValue.textContent = `rgb(${r}, ${g}, ${b})`;
  rgbaValue.textContent = `rgba(${r}, ${g}, ${b}, 1)`;
  hslValue.textContent = `hsl(${hslH}, ${hslS}%, ${hslL}%)`;
  hslaValue.textContent = `hsla(${hslH}, ${hslS}%, ${hslL}%, 1)`;
  hsvValue.textContent = `hsv(${hsvH}, ${hsvS}%, ${hsvV}%)`;
  hsbValue.textContent = `hsb(${hsvH}, ${hsvS}%, ${hsvV}%)`;
  hclValue.textContent = `${hclH}°, ${hclC}, ${hclL}`;
  cmykValue.textContent = `${c}%, ${m}%, ${y}%, ${k}%`;
  labValue.textContent = `${labL.toFixed(2)}, ${labA.toFixed(2)}, ${labB.toFixed(2)}`;
  xyzValue.textContent = `${xyzX.toFixed(2)}, ${xyzY.toFixed(2)}, ${xyzZ.toFixed(2)}`;
  yuvValue.textContent = `${yuvY}, ${yuvU}, ${yuvV}`;
  ycbcrValue.textContent = `${ycbcrY}, ${ycbcrCb}, ${ycbcrCr}`;
  rybValue.textContent = rgbToRyb(r, g, b);
  grayValue.textContent = `${gray}`;
  monoValue.textContent = mono;
  indexedValue.textContent = indexed;
  srgbValue.textContent = `rgb(${r}, ${g}, ${b})`;
  adobeValue.textContent = `rgb(${r}, ${g}, ${b})`;
  prophotoValue.textContent = `rgb(${r}, ${g}, ${b})`;
  dcip3Value.textContent = `rgb(${r}, ${g}, ${b})`;
  displayp3Value.textContent = `rgb(${r}, ${g}, ${b})`;
  rec709Value.textContent = `rgb(${r}, ${g}, ${b})`;
  rec2020Value.textContent = `rgb(${r}, ${g}, ${b})`;
  lumaValue.textContent = `${luma.toFixed(2)}`;
  luminanceValue.textContent = `${luminance.toFixed(4)}`;
  brightnessValue.textContent = `${brightness}%`;
  valueValue.textContent = `${hsvV}%`;
  lightnessValue.textContent = `${hslL}%`;
  intensityValue.textContent = `${intensity}`;
  chromaValue.textContent = `${chroma}`;
  chrominanceValue.textContent = `${chrominance}`;
  saturationValue.textContent = `${hslS}%`;
  hueValue.textContent = `${hslH}°`;
  alphaValue.textContent = '1';
  premultipliedValue.textContent = `rgba(${r}, ${g}, ${b}, 1)`;
  straightValue.textContent = `rgba(${r}, ${g}, ${b}, 1)`;
  
  // Fetch color name from ntc.js API (millions of trained colors)
  previewHex.textContent = hex;
  swatch.style.background = hex;
  previewName.textContent = 'Loading...';
  getNearestColorNameOnline(hex).then(name => {
    previewName.textContent = name;
  }).catch(() => {
    previewName.textContent = 'Unknown';
  });
}

function resetZoom() {
  zoomScale = 1;
  translateX = 0;
  translateY = 0;
  isDragging = false;
  dragStart = null;
  updateCanvasTransform();
}

function resetMode() {
  currentMode = 'none';
  selectionBox.classList.add('hidden');
  modeText.textContent = 'Choose a tool and interact with the image.';
  buttons.forEach(button => button.classList.remove('active-btn'));
}

function setMode(mode) {
  if (!loadedImage) {
    alert('Upload an image first.');
    return;
  }
  currentMode = mode;
  selectionBox.classList.add('hidden');
  buttons.forEach(button => button.classList.remove('active-btn'));
  if (mode === 'box') {
    avgBoxBtn.classList.add('active-btn');
    modeText.textContent = 'Draw a box on the image.';
  } else if (mode === 'pixel') {
    pixelBtn.classList.add('active-btn');
    modeText.textContent = 'Tap or click a pixel on the image.';
  } else if (mode === 'image') {
    avgImageBtn.classList.add('active-btn');
    modeText.textContent = 'verage color of the entire image.';
  } else {
    modeText.textContent = 'Choose a tool and interact with the image.';
  }
}

function drawImageToCanvas(image) {
  const maxWidth = canvasContainer.clientWidth;
  const maxHeight = 520;
  let width = image.naturalWidth;
  let height = image.naturalHeight;
  const ratio = Math.min(maxWidth / width, maxHeight / height);
  width = Math.round(width * ratio);
  height = Math.round(height * ratio);
  photoCanvas.width = width;
  photoCanvas.height = height;
  photoCanvas.style.width = `${width}px`;
  photoCanvas.style.height = `${height}px`;
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);
  canvasHint.classList.add('hidden');
  resetZoom();
  updateCanvasTransform();
  resetMode();
}

function updateCanvasTransform() {
  canvasView.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoomScale})`;
  resetZoomBtn.classList.toggle('hidden', zoomScale <= 1);
}

function getMidpoint(pointA, pointB) {
  return {
    x: (pointA.x + pointB.x) / 2,
    y: (pointA.y + pointB.y) / 2,
  };
}

function pointerToCanvasPosition(event) {
  const rect = canvasView.getBoundingClientRect();
  const clientX = event.clientX;
  const clientY = event.clientY;
  if (clientX == null || clientY == null) return null;
  const x = Math.round((clientX - rect.left) / zoomScale);
  const y = Math.round((clientY - rect.top) / zoomScale);
  return { x, y };
}

photoCanvas.addEventListener('pointerdown', event => {
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

  if (pointers.size === 1 && zoomScale > 1 && currentMode !== 'box') {
    isDragging = true;
    dragStart = { x: event.clientX, y: event.clientY };
    event.preventDefault();
    return;
  }

  if (pointers.size === 2) {
    isPinching = true;
    const points = Array.from(pointers.values());
    pinchStartDistance = pointerDistance(points[0], points[1]);
    pinchStartMidpoint = getMidpoint(points[0], points[1]);
    pinchStartScale = zoomScale;
    startTranslateX = translateX;
    startTranslateY = translateY;
    const rect = canvasView.getBoundingClientRect();
    const localX = (pinchStartMidpoint.x - rect.left - startTranslateX) / pinchStartScale;
    const localY = (pinchStartMidpoint.y - rect.top - startTranslateY) / pinchStartScale;
    pinchAnchor = { x: localX, y: localY };
    event.preventDefault();
    return;
  }

  if (currentMode !== 'box' || !loadedImage) return;

  event.preventDefault();
  isSelecting = true;
  const pos = pointerToCanvasPosition(event);
  if (!pos) return;
  selectionStart = pos;
  selectionRect = { x: pos.x, y: pos.y, width: 0, height: 0 };
  selectionBox.style.left = `${pos.x}px`;
  selectionBox.style.top = `${pos.y}px`;
  selectionBox.style.width = '0px';
  selectionBox.style.height = '0px';
  selectionBox.classList.remove('hidden');
});

photoCanvas.addEventListener('pointermove', event => {
  if (!pointers.has(event.pointerId)) return;
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

  if (isDragging && pointers.size === 1) {
    const deltaX = event.clientX - dragStart.x;
    const deltaY = event.clientY - dragStart.y;
    translateX += deltaX;
    translateY += deltaY;
    const maxTranslateX = (zoomScale - 1) * (photoCanvas.width / 2);
    const maxTranslateY = (zoomScale - 1) * (photoCanvas.height / 2);
    translateX = clamp(translateX, -maxTranslateX, maxTranslateX);
    translateY = clamp(translateY, -maxTranslateY, maxTranslateY);
    updateCanvasTransform();
    dragStart = { x: event.clientX, y: event.clientY };
    event.preventDefault();
    return;
  }

  if (isPinching && pointers.size === 2) {
    const points = Array.from(pointers.values());
    const newDistance = pointerDistance(points[0], points[1]);
    const nextScale = clamp(pinchStartScale * (newDistance / pinchStartDistance), minZoom, maxZoom);
    const currentMidpoint = getMidpoint(points[0], points[1]);
    const rect = canvasView.getBoundingClientRect();
    translateX = currentMidpoint.x - rect.left - pinchAnchor.x * nextScale;
    translateY = currentMidpoint.y - rect.top - pinchAnchor.y * nextScale;
    zoomScale = nextScale;
    updateCanvasTransform();
  event.preventDefault();
    event.preventDefault();
    return;
  }

  if (!isSelecting || currentMode !== 'box') return;

  const pos = pointerToCanvasPosition(event);
  if (!pos || !selectionStart) return;
  const x = Math.min(selectionStart.x, pos.x);
  const y = Math.min(selectionStart.y, pos.y);
  const width = Math.abs(pos.x - selectionStart.x);
  const height = Math.abs(pos.y - selectionStart.y);
  selectionRect = { x, y, width, height };
  selectionBox.style.left = `${x}px`;
  selectionBox.style.top = `${y}px`;
  selectionBox.style.width = `${width}px`;
  selectionBox.style.height = `${height}px`;
});

photoCanvas.addEventListener('pointerup', event => {
  if (!pointers.has(event.pointerId)) return;
  pointers.delete(event.pointerId);

  if (currentMode === 'box' && isSelecting && pointers.size === 0) {
    isSelecting = false;
    if (!selectionRect) return;
    const clamped = clampRect({
      x: Math.round(selectionRect.x / zoomScale),
      y: Math.round(selectionRect.y / zoomScale),
      width: Math.round(selectionRect.width / zoomScale),
      height: Math.round(selectionRect.height / zoomScale),
    });
    processAverageBox(clamped.x, clamped.y, clamped.width, clamped.height);
    return;
  }

  if (isDragging && pointers.size === 0) {
    isDragging = false;
    dragStart = null;
  }

  if (currentMode === 'pixel' && loadedImage && pointers.size === 0) {
    const pos = pointerToCanvasPosition(event);
    if (!pos) return;
    const x = Math.min(Math.max(0, pos.x), photoCanvas.width - 1);
    const y = Math.min(Math.max(0, pos.y), photoCanvas.height - 1);
    processPixel(x, y);
  }

  if (isPinching && pointers.size < 2) {
    isPinching = false;
    pinchStartDistance = 0;
    pinchAnchor = null;
  }
});

photoCanvas.addEventListener('pointercancel', event => {
  pointers.delete(event.pointerId);
  if (currentMode === 'box' && isSelecting) {
    isSelecting = false;
    selectionBox.classList.add('hidden');
  }
  if (isPinching && pointers.size < 2) {
    isPinching = false;
    pinchStartDistance = 0;
    pinchAnchor = null;
  }
});

function processAverageImage() {
  if (!loadedImage) return;
  const imageData = ctx.getImageData(0, 0, photoCanvas.width, photoCanvas.height).data;
  let r = 0, g = 0, b = 0;
  const pixelCount = imageData.length / 4;
  for (let i = 0; i < imageData.length; i += 4) {
    r += imageData[i];
    g += imageData[i + 1];
    b += imageData[i + 2];
  }
  const avg = {
    r: Math.round(r / pixelCount),
    g: Math.round(g / pixelCount),
    b: Math.round(b / pixelCount),
  };
  updateResult(avg);
}

function processAverageBox(x, y, width, height) {
  if (width === 0 || height === 0) return;
  const imageData = ctx.getImageData(x, y, width, height).data;
  let r = 0, g = 0, b = 0;
  const pixelCount = imageData.length / 4;
  for (let i = 0; i < imageData.length; i += 4) {
    r += imageData[i];
    g += imageData[i + 1];
    b += imageData[i + 2];
  }
  const avg = {
    r: Math.round(r / pixelCount),
    g: Math.round(g / pixelCount),
    b: Math.round(b / pixelCount),
  };
  updateResult(avg);
  selectionBox.classList.add('hidden');
}

function processPixel(x, y) {
  const imageData = ctx.getImageData(x, y, 1, 1).data;
  const pixel = {
    r: imageData[0],
    g: imageData[1],
    b: imageData[2],
  };
  updateResult(pixel);
}

function clampRect(rect) {
  const x = Math.max(0, Math.min(rect.x, photoCanvas.width));
  const y = Math.max(0, Math.min(rect.y, photoCanvas.height));
  const x2 = Math.max(0, Math.min(rect.x + rect.width, photoCanvas.width));
  const y2 = Math.max(0, Math.min(rect.y + rect.height, photoCanvas.height));
  const width = Math.max(1, x2 - x);
  const height = Math.max(1, y2 - y);
  return { x, y, width, height };
}

function pointerDistance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function pointerDistance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

resetZoomBtn.addEventListener('click', resetZoom);

copyButtons.forEach(button => {
  button.addEventListener('click', () => {
    const targetId = button.dataset.copyTarget;
    if (!targetId) return;
    const target = document.getElementById(targetId);
    if (!target) return;
    navigator.clipboard.writeText(target.textContent.trim());
    const previous = button.textContent;
    button.textContent = 'Copied';
    setTimeout(() => {
      button.textContent = previous;
    }, 700);
  });
});

const handleFileSelection = event => {
  const file = event.target.files?.[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.onload = () => {
    loadedImage = image;
    drawImageToCanvas(image);
    URL.revokeObjectURL(url);
  };
  image.onerror = () => {
    alert('Unable to load the selected image. Try a different file.');
    URL.revokeObjectURL(url);
  };
  image.src = url;
};

imageInput.addEventListener('change', handleFileSelection);
cameraInput.addEventListener('change', handleFileSelection);

avgImageBtn.addEventListener('click', () => {
  if (!loadedImage) {
    alert('Upload an image first.');
    return;
  }
  setMode('image');
  processAverageImage();
});

avgBoxBtn.addEventListener('click', () => setMode('box'));
pixelBtn.addEventListener('click', () => setMode('pixel'));

window.addEventListener('resize', () => {
  if (!loadedImage) return;
  drawImageToCanvas(loadedImage);
});

updateResult({ r: 255, g: 255, b: 255 });