// QR rendering and export helpers using vendored qrcode-generator
export const QR_SIZES = [256, 512, 1024];
export const DEFAULT_FG = '#0f172a';
export const DEFAULT_BG = '#ffffff';

function createQR(text) {
  if (typeof window.qrcode !== 'function') {
    throw new Error('QR library not loaded');
  }
  const qr = window.qrcode(0, 'H');
  qr.addData(text, 'Byte');
  qr.make();
  return qr;
}

function geometry(qr, size) {
  const moduleCount = qr.getModuleCount();
  const cellSize = Math.max(1, Math.floor(size / (moduleCount + 8)));
  const offset = Math.floor((size - moduleCount * cellSize) / 2);
  return { moduleCount, cellSize, offset };
}

export function clearPreview(container) {
  container.innerHTML = '';
}

export function renderQR(container, text, options = {}) {
  container.innerHTML = '';
  if (!text) return { ok: false, reason: 'empty' };

  const size = options.size || 256;
  const fg = options.fg || DEFAULT_FG;
  const bg = options.bg || DEFAULT_BG;

  let qr;
  try {
    qr = createQR(text);
  } catch (err) {
    return { ok: false, reason: 'capacity' };
  }

  const { moduleCount, cellSize, offset } = geometry(qr, size);

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = fg;
  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (qr.isDark(r, c)) {
        ctx.fillRect(offset + c * cellSize, offset + r * cellSize, cellSize, cellSize);
      }
    }
  }
  container.appendChild(canvas);
  return { ok: true };
}

export function getCanvas(container) {
  return container.querySelector('canvas');
}

export function downloadPNG(container, filename = 'qr-code.png') {
  const canvas = getCanvas(container);
  if (!canvas) return false;
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return true;
}

export function buildSVG(text, options = {}) {
  if (!text) return null;
  const size = options.size || 256;
  const fg = options.fg || DEFAULT_FG;
  const bg = options.bg || DEFAULT_BG;

  let qr;
  try {
    qr = createQR(text);
  } catch (err) {
    return null;
  }

  const { moduleCount, cellSize, offset } = geometry(qr, size);

  let path = '';
  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (qr.isDark(r, c)) {
        const x = offset + c * cellSize;
        const y = offset + r * cellSize;
        path += `M${x},${y}h${cellSize}v${cellSize}h-${cellSize}z`;
      }
    }
  }

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`,
    `<rect width="100%" height="100%" fill="${bg}"/>`,
    `<path d="${path}" fill="${fg}"/>`,
    `</svg>`,
  ].join('');

  return svg;
}

export function downloadSVG(text, options = {}, filename = 'qr-code.svg') {
  const svg = buildSVG(text, options);
  if (!svg) return false;
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}
