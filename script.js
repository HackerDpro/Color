const imageInput = document.getElementById('imageInput');
const photoCanvas = document.getElementById('photoCanvas');
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
const cmykValue = document.getElementById('cmykValue');
const labValue = document.getElementById('labValue');
const xyzValue = document.getElementById('xyzValue');
const yuvValue = document.getElementById('yuvValue');
const ycbcrValue = document.getElementById('ycbcrValue');
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
const hclValue = document.getElementById('hclValue');
const rybValue = document.getElementById('rybValue');
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
let isPinching = false;
let pinchStartDistance = 0;
let pinchStartScale = 1;
const minZoom = 1;
const maxZoom = 4;
const pointers = new Map();

const cssColorNames = {
  AliceBlue: '#F0F8FF', AntiqueWhite: '#FAEBD7', Aqua: '#00FFFF', Aquamarine: '#7FFFD4', Azure: '#F0FFFF', Beige: '#F5F5DC', Bisque: '#FFE4C4', Black: '#000000', BlanchedAlmond: '#FFEBCD', Blue: '#0000FF', BlueViolet: '#8A2BE2', Brown: '#A52A2A', BurlyWood: '#DEB887', CadetBlue: '#5F9EA0', Chartreuse: '#7FFF00', Chocolate: '#D2691E', Coral: '#FF7F50', CornflowerBlue: '#6495ED', Cornsilk: '#FFF8DC', Crimson: '#DC143C', Cyan: '#00FFFF', DarkBlue: '#00008B', DarkCyan: '#008B8B', DarkGoldenRod: '#B8860B', DarkGray: '#A9A9A9', DarkGrey: '#A9A9A9', DarkGreen: '#006400', DarkKhaki: '#BDB76B', DarkMagenta: '#8B008B', DarkOliveGreen: '#556B2F', DarkOrange: '#FF8C00', DarkOrchid: '#9932CC', DarkRed: '#8B0000', DarkSalmon: '#E9967A', DarkSeaGreen: '#8FBC8F', DarkSlateBlue: '#483D8B', DarkSlateGray: '#2F4F4F', DarkSlateGrey: '#2F4F4F', DarkTurquoise: '#00CED1', DarkViolet: '#9400D3', DeepPink: '#FF1493', DeepSkyBlue: '#00BFFF', DimGray: '#696969', DimGrey: '#696969', DodgerBlue: '#1E90FF', FireBrick: '#B22222', FloralWhite: '#FFFAF0', ForestGreen: '#228B22', Fuchsia: '#FF00FF', Gainsboro: '#DCDCDC', GhostWhite: '#F8F8FF', Gold: '#FFD700', GoldenRod: '#DAA520', Gray: '#808080', Grey: '#808080', Green: '#008000', GreenYellow: '#ADFF2F', HoneyDew: '#F0FFF0', HotPink: '#FF69B4', IndianRed: '#CD5C5C', Indigo: '#4B0082', Ivory: '#FFFFF0', Khaki: '#F0E68C', Lavender: '#E6E6FA', LavenderBlush: '#FFF0F5', LawnGreen: '#7CFC00', LemonChiffon: '#FFFACD', LightBlue: '#ADD8E6', LightCoral: '#F08080', LightCyan: '#E0FFFF', LightGoldenRodYellow: '#FAFAD2', LightGray: '#D3D3D3', LightGrey: '#D3D3D3', LightGreen: '#90EE90', LightPink: '#FFB6C1', LightSalmon: '#FFA07A', LightSeaGreen: '#20B2AA', LightSkyBlue: '#87CEFA', LightSlateGray: '#778899', LightSlateGrey: '#778899', LightSteelBlue: '#B0C4DE', LightYellow: '#FFFFE0', Lime: '#00FF00', LimeGreen: '#32CD32', Linen: '#FAF0E6', Magenta: '#FF00FF', Maroon: '#800000', MediumAquaMarine: '#66CDAA', MediumBlue: '#0000CD', MediumOrchid: '#BA55D3', MediumPurple: '#9370DB', MediumSeaGreen: '#3CB371', MediumSlateBlue: '#7B68EE', MediumSpringGreen: '#00FA9A', MediumTurquoise: '#48D1CC', MediumVioletRed: '#C71585', MidnightBlue: '#191970', MintCream: '#F5FFFA', MistyRose: '#FFE4E1', Moccasin: '#FFE4B5', NavajoWhite: '#FFDEAD', Navy: '#000080', OldLace: '#FDF5E6', Olive: '#808000', OliveDrab: '#6B8E23', Orange: '#FFA500', OrangeRed: '#FF4500', Orchid: '#DA70D6', PaleGoldenRod: '#EEE8AA', PaleGreen: '#98FB98', PaleTurquoise: '#AFEEEE', PaleVioletRed: '#DB7093', PapayaWhip: '#FFEFD5', PeachPuff: '#FFDAB9', Peru: '#CD853F', Pink: '#FFC0CB', Plum: '#DDA0DD', PowderBlue: '#B0E0E6', Purple: '#800080', RebeccaPurple: '#663399', Red: '#FF0000', RosyBrown: '#BC8F8F', RoyalBlue: '#4169E1', SaddleBrown: '#8B4513', Salmon: '#FA8072', SandyBrown: '#F4A460', SeaGreen: '#2E8B57', SeaShell: '#FFF5EE', Sienna: '#A0522D', Silver: '#C0C0C0', SkyBlue: '#87CEEB', SlateBlue: '#6A5ACD', SlateGray: '#708090', SlateGrey: '#708090', Snow: '#FFFAFA', SpringGreen: '#00FF7F', SteelBlue: '#4682B4', Tan: '#D2B48C', Teal: '#008080', Thistle: '#D8BFD8', Tomato: '#FF6347', Turquoise: '#40E0D0', Violet: '#EE82EE', Wheat: '#F5DEB3', White: '#FFFFFF', WhiteSmoke: '#F5F5F5', Yellow: '#FFFF00', YellowGreen: '#9ACD32'
};

const namedColors = Object.entries(cssColorNames).map(([name, hex]) => ({ name, rgb: hexToRgb(hex) }));

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

function getNearestColorName({ r, g, b }) {
  let best = { name: 'Unknown', distance: Infinity };
  namedColors.forEach(color => {
    const dr = r - color.rgb.r;
    const dg = g - color.rgb.g;
    const db = b - color.rgb.b;
    const distance = dr * dr + dg * dg + db * db;
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

  hexValue.textContent = hex;
  rgbValue.textContent = `rgb(${r}, ${g}, ${b})`;
  rgbaValue.textContent = `rgba(${r}, ${g}, ${b}, 1)`;
  hslValue.textContent = `hsl(${hslH}, ${hslS}%, ${hslL}%)`;
  hslaValue.textContent = `hsla(${hslH}, ${hslS}%, ${hslL}%, 1)`;
  hsvValue.textContent = `hsv(${hsvH}, ${hsvS}%, ${hsvV}%)`;
  hsbValue.textContent = `hsb(${hsvH}, ${hsvS}%, ${hsvV}%)`;
  cmykValue.textContent = `${c}%, ${m}%, ${y}%, ${k}%`;
  labValue.textContent = `${labL.toFixed(2)}, ${labA.toFixed(2)}, ${labB.toFixed(2)}`;
  xyzValue.textContent = `${xyzX.toFixed(2)}, ${xyzY.toFixed(2)}, ${xyzZ.toFixed(2)}`;
  yuvValue.textContent = `${yuvY}, ${yuvU}, ${yuvV}`;
  ycbcrValue.textContent = `${ycbcrY}, ${ycbcrCb}, ${ycbcrCr}`;
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
  hclValue.textContent = `${hclH}°, ${hclC}, ${hclL}`;
  rybValue.textContent = rgbToRyb(r, g, b);
  previewName.textContent = getNearestColorName({ r, g, b });
  previewHex.textContent = hex;
  swatch.style.background = hex;
}

function updateCanvasTransform() {
  photoCanvas.style.transform = `scale(${zoomScale})`;
  resetZoomBtn.classList.toggle('hidden', zoomScale <= 1);
}

function resetZoom() {
  zoomScale = 1;
  updateCanvasTransform();
}

function resetMode() {
  currentMode = 'none';
  selectionBox.classList.add('hidden');
  modeText.textContent = 'Choose a tool and interact with the image after upload.';
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
    modeText.textContent = 'Draw a box on the image to average that area.';
  } else if (mode === 'pixel') {
    pixelBtn.classList.add('active-btn');
    modeText.textContent = 'Tap or click a pixel on the image to see its color.';
  } else if (mode === 'image') {
    avgImageBtn.classList.add('active-btn');
    modeText.textContent = 'Processing the average color of the entire image.';
  } else {
    modeText.textContent = 'Choose a tool and interact with the image after upload.';
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

function pointerToCanvasPosition(event) {
  const rect = photoCanvas.getBoundingClientRect();
  const clientX = event.clientX;
  const clientY = event.clientY;
  if (clientX == null || clientY == null) return null;
  const x = Math.round((clientX - rect.left) / zoomScale);
  const y = Math.round((clientY - rect.top) / zoomScale);
  return { x, y };
}

function pointerDistance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

photoCanvas.addEventListener('pointerdown', event => {
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  photoCanvas.setPointerCapture(event.pointerId);
  if (pointers.size === 2) {
    isPinching = true;
    const points = Array.from(pointers.values());
    pinchStartDistance = pointerDistance(points[0], points[1]);
    pinchStartScale = zoomScale;
    return;
  }

  if (currentMode !== 'box' || !loadedImage || isPinching) return;
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

  if (isPinching && pointers.size === 2) {
    const points = Array.from(pointers.values());
    const newDistance = pointerDistance(points[0], points[1]);
    const nextScale = clamp(pinchStartScale * (newDistance / pinchStartDistance), minZoom, maxZoom);
    if (nextScale !== zoomScale) {
      zoomScale = nextScale;
      updateCanvasTransform();
    }
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
  photoCanvas.releasePointerCapture(event.pointerId);

  if (isPinching && pointers.size < 2) {
    isPinching = false;
    pinchStartDistance = 0;
  }

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

  if (currentMode === 'pixel' && loadedImage && !isPinching && pointers.size === 0) {
    const pos = pointerToCanvasPosition(event);
    if (!pos) return;
    const x = Math.min(Math.max(0, pos.x), photoCanvas.width - 1);
    const y = Math.min(Math.max(0, pos.y), photoCanvas.height - 1);
    processPixel(x, y);
  }
});

photoCanvas.addEventListener('pointercancel', event => {
  if (currentMode === 'box' && isSelecting) {
    isSelecting = false;
    selectionBox.classList.add('hidden');
  }
  pointers.delete(event.pointerId);
  photoCanvas.releasePointerCapture(event.pointerId);
  if (isPinching && pointers.size < 2) {
    isPinching = false;
    pinchStartDistance = 0;
  }
});

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

imageInput.addEventListener('change', event => {
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
});

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
