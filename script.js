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

const comprehensiveColorDatabase = {
  'Black': '#000000', 'Charcoal': '#36454F', 'Dark Gray': '#2F4F4F', 'Gray': '#808080', 'Light Gray': '#D3D3D3', 'White': '#FFFFFF', 'Gainsboro': '#DCDCDC', 'Smoke White': '#F5F5F5',
  'Red': '#FF0000', 'Dark Red': '#8B0000', 'Crimson': '#DC143C', 'Firebrick': '#B22222', 'Indian Red': '#CD5C5C', 'Light Coral': '#F08080', 'Salmon': '#FA8072', 'Light Salmon': '#FFA07A', 'Dark Salmon': '#E9967A', 'Tomato': '#FF6347', 'Coral': '#FF7F50', 'Orange Red': '#FF4500', 'Orangish Red': '#FF5347', 'Scarlet': '#FF2400', 'Vermillion': '#E34234',
  'Orange': '#FFA500', 'Dark Orange': '#FF8C00', 'Light Orange': '#FFCC99', 'Orange Yellow': '#FFB347', 'Pumpkin': '#FF7518', 'Burnt Orange': '#CC5500', 'Orange Brown': '#CD7F32', 'Rust': '#B7410E',
  'Yellow': '#FFFF00', 'Gold': '#FFD700', 'Dark Goldenrod': '#B8860B', 'Goldenrod': '#DAA520', 'Light Goldenrod': '#FAFAD2', 'Pale Goldenrod': '#EEE8AA', 'Khaki': '#F0E68C', 'Dark Khaki': '#BDB76B', 'Yellow Green': '#9ACD32', 'Olive': '#808000', 'Olive Drab': '#6B8E23', 'Chartreuse': '#7FFF00', 'Lawn Green': '#7CFC00',
  'Green': '#008000', 'Dark Green': '#006400', 'Sea Green': '#2E8B57', 'Dark Sea Green': '#8FBC8F', 'Medium Sea Green': '#3CB371', 'Light Sea Green': '#20B2AA', 'Forest Green': '#228B22', 'Lime Green': '#32CD32', 'Lime': '#00FF00', 'Spring Green': '#00FF7F', 'Medium Spring Green': '#00FA9A', 'Light Green': '#90EE90', 'Pale Green': '#98FB98', 'Green Yellow': '#ADFF2F', 'Aqua': '#00FFFF', 'Cyan': '#00FFFF', 'Light Cyan': '#E0FFFF', 'Dark Cyan': '#008B8B', 'Turquoise': '#40E0D0', 'Dark Turquoise': '#00CED1', 'Medium Turquoise': '#48D1CC', 'Pale Turquoise': '#AFEEEE',
  'Mint': '#98FF98', 'Mint Cream': '#F5FFFA', 'Teal': '#008080', 'Dark Slate Gray': '#2F4F4F', 'Slate Gray': '#708090', 'Light Slate Gray': '#778899',
  'Blue': '#0000FF', 'Dark Blue': '#00008B', 'Navy': '#000080', 'Midnight Blue': '#191970', 'Cornflower Blue': '#6495ED', 'Royal Blue': '#4169E1', 'Medium Blue': '#0000CD', 'Dodger Blue': '#1E90FF', 'Deep Sky Blue': '#00BFFF', 'Sky Blue': '#87CEEB', 'Light Sky Blue': '#87CEFA', 'Steel Blue': '#4682B4', 'Light Steel Blue': '#B0C4DE', 'Light Blue': '#ADD8E6', 'Powder Blue': '#B0E0E6', 'Cadet Blue': '#5F9EA0', 'Dark Slate Blue': '#483D8B', 'Slate Blue': '#6A5ACD', 'Medium Slate Blue': '#7B68EE', 'Periwinkle': '#CCCCFF', 'Blue Violet': '#8A2BE2', 'Indigo': '#4B0082', 'Purple': '#800080', 'Dark Purple': '#301034', 'Medium Purple': '#9370DB', 'Blue Purple': '#6A5ACD', 'Orchid': '#DA70D6', 'Medium Orchid': '#BA55D3', 'Dark Orchid': '#9932CC', 'Violet': '#EE82EE', 'Dark Violet': '#9400D3', 'Magenta': '#FF00FF', 'Medium Violet Red': '#C71585', 'Plum': '#DDA0DD', 'Thistle': '#D8BFD8', 'Lavender': '#E6E6FA', 'Lavender Blush': '#FFF0F5',
  'Pink': '#FFC0CB', 'Deep Pink': '#FF1493', 'Hot Pink': '#FF69B4', 'Light Pink': '#FFB6C1', 'Pale Violet Red': '#DB7093', 'Rosy Brown': '#BC8F8F',
  'Brown': '#A52A2A', 'Dark Brown': '#654321', 'Saddle Brown': '#8B4513', 'Sienna': '#A0522D', 'Peru': '#CD853F', 'Burlywood': '#DEB887', 'Sandy Brown': '#F4A460', 'Chocolate': '#D2691E', 'Tan': '#D2B48C', 'Light Tan': '#FDBCB4', 'Wheat': '#F5DEB3', 'Bisque': '#FFE4C4', 'Peach Puff': '#FFDAB9', 'Navajo White': '#FFDEAD', 'Moccasin': '#FFE4B5',
  'Beige': '#F5F5DC', 'Linen': '#FAF0E6', 'Antique White': '#FAEBD7', 'Blanched Almond': '#FFEBCD', 'Cornsilk': '#FFF8DC', 'Light Goldenrod Yellow': '#FAFAD2', 'Light Yellow': '#FFFFE0', 'Ivory': '#FFFFF0', 'Floral White': '#FFFAF0', 'Old Lace': '#FDF5E6', 'Seashell': '#FFF5EE', 'Ghost White': '#F8F8FF', 'Honeydew': '#F0FFF0', 'Alice Blue': '#F0F8FF',
  'Maroon': '#800000', 'Dark Red': '#8B0000', 'Fire Brick': '#B22222', 'Brick Red': '#CB4154', 'Indian Red': '#CD5C5C',
  'Azure': '#F0FFFF', 'Rebecca Purple': '#663399', 'Spring Green': '#00FF7F', 'Sea Shell': '#FFF5EE', 'Lemon Chiffon': '#FFFACD', 'Mint Green': '#98FF98', 'Dark Mint': '#335C6D', 'Seafoam': '#93E9BE', 'Seafoam Green': '#93E9BE', 'Tea Green': '#D0F0C0', 'Honeydew': '#F0FFF0', 'Pale Turquoise': '#AFEEEE', 'Light Cyan': '#E0FFFF', 'Aquamarine': '#7FFFD4', 'Turquoise': '#40E0D0', 'Dark Turquoise': '#00CED1', 'Cadet Blue': '#5F9EA0', 'Light Sea Green': '#20B2AA', 'Dark Sea Green': '#8FBC8F', 'Medium Sea Green': '#3CB371', 'Sea Green': '#2E8B57', 'Forest Green': '#228B22', 'Green': '#008000', 'Dark Green': '#006400', 'Lime Green': '#32CD32', 'Lime': '#00FF00', 'Lawn Green': '#7CFC00', 'Chartreuse': '#7FFF00', 'Yellow Green': '#9ACD32', 'Medium Spring Green': '#00FA9A', 'Spring Green': '#00FF7F', 'Green Yellow': '#ADFF2F', 'Olive Green': '#6B8E23', 'Olive Drab': '#6B8E23', 'Olive': '#808000', 'Dark Khaki': '#BDB76B', 'Khaki': '#F0E68C', 'Pale Goldenrod': '#EEE8AA', 'Light Goldenrod Yellow': '#FAFAD2', 'Goldenrod': '#DAA520', 'Dark Goldenrod': '#B8860B', 'Gold': '#FFD700', 'Yellow': '#FFFF00', 'Light Yellow': '#FFFFE0', 'Lemon Chiffon': '#FFFACD', 'Papaya Whip': '#FFEFD5', 'Moccasin': '#FFE4B5', 'Navajo White': '#FFDEAD', 'Peach Puff': '#FFDAB9', 'Bisque': '#FFE4C4', 'Wheat': '#F5DEB3', 'Burlywood': '#DEB887', 'Tan': '#D2B48C', 'Sandy Brown': '#F4A460', 'Chocolate': '#D2691E', 'Peru': '#CD853F', 'Sienna': '#A0522D', 'Saddle Brown': '#8B4513', 'Brown': '#A52A2A', 'Dark Brown': '#654321', 'Maroon': '#800000', 'Firebrick': '#B22222', 'Coral': '#FF7F50', 'Tomato': '#FF6347', 'Orange Red': '#FF4500', 'Dark Orange': '#FF8C00', 'Orange': '#FFA500', 'Red': '#FF0000', 'Crimson': '#DC143C', 'Indian Red': '#CD5C5C', 'Light Coral': '#F08080', 'Salmon': '#FA8072', 'Dark Salmon': '#E9967A', 'Light Salmon': '#FFA07A', 'Pink': '#FFC0CB', 'Light Pink': '#FFB6C1', 'Hot Pink': '#FF69B4', 'Deep Pink': '#FF1493', 'Pale Violet Red': '#DB7093', 'Medium Violet Red': '#C71585', 'Magenta': '#FF00FF', 'Purple': '#800080', 'Dark Magenta': '#8B008B', 'Dark Violet': '#9400D3', 'Indigo': '#4B0082', 'Blue Violet': '#8A2BE2', 'Slate Blue': '#6A5ACD', 'Dark Slate Blue': '#483D8B', 'Medium Slate Blue': '#7B68EE', 'Medium Blue': '#0000CD', 'Royal Blue': '#4169E1', 'Blue': '#0000FF', 'Dark Blue': '#00008B', 'Navy': '#000080', 'Midnight Blue': '#191970', 'Cornflower Blue': '#6495ED', 'Dodger Blue': '#1E90FF', 'Deep Sky Blue': '#00BFFF', 'Sky Blue': '#87CEEB', 'Light Sky Blue': '#87CEFA', 'Steel Blue': '#4682B4', 'Light Steel Blue': '#B0C4DE', 'Light Blue': '#ADD8E6', 'Powder Blue': '#B0E0E6', 'Cadet Blue': '#5F9EA0', 'Dark Cyan': '#008B8B', 'Cyan': '#00FFFF', 'Teal': '#008080', 'Light Cyan': '#E0FFFF', 'Aquamarine': '#7FFFD4', 'Turquoise': '#40E0D0', 'Dark Turquoise': '#00CED1', 'Medium Turquoise': '#48D1CC', 'Pale Turquoise': '#AFEEEE', 'Light Sea Green': '#20B2AA', 'Dark Sea Green': '#8FBC8F', 'Medium Sea Green': '#3CB371', 'Sea Green': '#2E8B57', 'Forest Green': '#228B22', 'Green': '#008000', 'Dark Green': '#006400', 'Lime Green': '#32CD32', 'Lime': '#00FF00', 'Lawn Green': '#7CFC00', 'Chartreuse': '#7FFF00', 'Yellow Green': '#9ACD32', 'Medium Spring Green': '#00FA9A', 'Spring Green': '#00FF7F', 'Green Yellow': '#ADFF2F', 'Orchid': '#DA70D6', 'Medium Orchid': '#BA55D3', 'Dark Orchid': '#9932CC', 'Violet': '#EE82EE', 'Plum': '#DDA0DD', 'Thistle': '#D8BFD8', 'Lavender': '#E6E6FA', 'Lavender Blush': '#FFF0F5', 'Rosy Brown': '#BC8F8F', 'Light Gray': '#D3D3D3', 'Dark Gray': '#A9A9A9', 'Gray': '#808080', 'Dim Gray': '#696969', 'Light Slate Gray': '#778899', 'Slate Gray': '#708090', 'Dark Slate Gray': '#2F4F4F', 'Beige': '#F5F5DC', 'Linen': '#FAF0E6', 'Antique White': '#FAEBD7', 'Blanched Almond': '#FFEBCD', 'Cornsilk': '#FFF8DC', 'Light Goldenrod Yellow': '#FAFAD2', 'Light Yellow': '#FFFFE0', 'Ivory': '#FFFFF0', 'Floral White': '#FFFAF0', 'Old Lace': '#FDF5E6', 'Seashell': '#FFF5EE', 'Ghost White': '#F8F8FF', 'Honeydew': '#F0FFF0', 'Alice Blue': '#F0F8FF', 'Misty Rose': '#FFE4E1', 'Mint Cream': '#F5FFFA', 'Snow': '#FFFAFA', 'White Smoke': '#F5F5F5', 'Gainsboro': '#DCDCDC', 'Gray': '#808080', 'Dark Gray': '#A9A9A9', 'Dim Gray': '#696969', 'Light Gray': '#D3D3D3', 'Black': '#000000'
};

// Cache for color names to avoid excessive API calls
const colorNameCache = new Map();

// Get color name from ntc.js (Name That Color) API - uses millions of trained color names
async function getNearestColorNameOnline(hex) {
  // Check cache first
  if (colorNameCache.has(hex)) {
    return colorNameCache.get(hex);
  }

  try {
    // Call ntc.js API (Name That Color) which has millions of color names
    const response = await fetch(`https://chir.mnuchin.com/ntc.js?hex=${hex}&json`);
    const data = await response.json();
    const name = data.name || data.n_closest_name || 'Unknown';
    colorNameCache.set(hex, name);
    return name;
  } catch (error) {
    console.warn('ntc.js API unavailable, using fallback names', error);
    // Fallback to local database if API fails
    return getNearestColorNameLocal(hex);
  }
}

// Fallback: Local color naming using LAB color space distance
function getNearestColorNameLocal(hex) {
  // Parse hex to RGB
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  // Create local database if not exists
  if (!window.namedColors) {
    window.namedColors = Object.entries(comprehensiveColorDatabase).map(([name, hex]) => {
      const rgb = hexToRgb(hex);
      return { name, rgb, lab: rgbToLab(rgb.r, rgb.g, rgb.b) };
    });
  }

  const lab1 = rgbToLab(r, g, b);
  let best = { name: 'Unknown', distance: Infinity };
  window.namedColors.forEach(color => {
    const distance = deltaE2000(lab1, color.lab);
    if (distance < best.distance) {
      best = { name: color.name, distance };
    }
  });
  return best.name;
}

const namedColors = Object.entries(comprehensiveColorDatabase).map(([name, hex]) => {
  const rgb = hexToRgb(hex);
  return { name, rgb, lab: rgbToLab(rgb.r, rgb.g, rgb.b) };
});

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

function getNearestColorName({ r, g, b }) {
  const lab1 = rgbToLab(r, g, b);
  let best = { name: 'Unknown', distance: Infinity };
  namedColors.forEach(color => {
    const distance = deltaE2000(lab1, color.lab);
    if (distance < best.distance) {
      best = { name: color.name, distance };
    }
  });
  return best.name;
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