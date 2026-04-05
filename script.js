const imageInput = document.getElementById('imageInput');
const photoCanvas = document.getElementById('photoCanvas');
const canvasContainer = document.getElementById('canvasContainer');
const selectionBox = document.getElementById('selectionBox');
const canvasHint = document.getElementById('canvasHint');
const avgImageBtn = document.getElementById('avgImageBtn');
const avgBoxBtn = document.getElementById('avgBoxBtn');
const pixelBtn = document.getElementById('pixelBtn');
const modeText = document.getElementById('modeText');
const buttons = [avgImageBtn, avgBoxBtn, pixelBtn];
const hexValue = document.getElementById('hexValue');
const rgbValue = document.getElementById('rgbValue');
const nameValue = document.getElementById('nameValue');
const swatch = document.getElementById('swatch');

const ctx = photoCanvas.getContext('2d');
let loadedImage = null;
let currentMode = 'none';
let selectionStart = null;
let selectionRect = null;
let isSelecting = false;

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

function updateResult({ r, g, b }) {
  const hex = rgbToHex(r, g, b);
  hexValue.textContent = hex;
  rgbValue.textContent = `rgb(${r}, ${g}, ${b})`;
  nameValue.textContent = getNearestColorName({ r, g, b });
  swatch.style.background = hex;
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
  resetMode();
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
  resetMode();
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
  const clientX = event.clientX ?? event.touches?.[0]?.clientX;
  const clientY = event.clientY ?? event.touches?.[0]?.clientY;
  if (clientX == null || clientY == null) return null;
  const x = Math.round(clientX - rect.left);
  const y = Math.round(clientY - rect.top);
  return { x, y };
}

photoCanvas.addEventListener('pointerdown', event => {
  if (currentMode !== 'box') return;
  if (!loadedImage) return;
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
  photoCanvas.setPointerCapture(event.pointerId);
});

photoCanvas.addEventListener('pointermove', event => {
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
  if (currentMode === 'box' && isSelecting) {
    isSelecting = false;
    const pos = pointerToCanvasPosition(event);
    if (!pos || !selectionRect) return;
    photoCanvas.releasePointerCapture(event.pointerId);
    const clamped = clampRect(selectionRect);
    processAverageBox(clamped.x, clamped.y, clamped.width, clamped.height);
    return;
  }

  if (currentMode === 'pixel' && loadedImage) {
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
    photoCanvas.releasePointerCapture(event.pointerId);
  }
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
