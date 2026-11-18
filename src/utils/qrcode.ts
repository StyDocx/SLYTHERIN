/**
 * ISO/IEC 18004 Standard QR Code Matrix Generator (Versions 1 - 6, Error Correction Level L/M)
 * Pure TypeScript, zero external dependencies.
 * Generates scannable QR matrices for student registration passes and decodes QR pass images.
 */

interface VersionSpec {
  version: number;
  size: number;
  totalDataBytes: number;
  ecBytesPerBlock: number;
  numBlocks: number;
  alignmentCenters: number[];
}

// Version specifications (Error Correction Level L for high capacity & crisp modules)
const VERSION_SPECS: VersionSpec[] = [
  { version: 1, size: 21, totalDataBytes: 19, ecBytesPerBlock: 7, numBlocks: 1, alignmentCenters: [] },
  { version: 2, size: 25, totalDataBytes: 34, ecBytesPerBlock: 10, numBlocks: 1, alignmentCenters: [6, 18] },
  { version: 3, size: 29, totalDataBytes: 55, ecBytesPerBlock: 15, numBlocks: 1, alignmentCenters: [6, 22] },
  { version: 4, size: 33, totalDataBytes: 80, ecBytesPerBlock: 20, numBlocks: 1, alignmentCenters: [6, 26] },
  { version: 5, size: 37, totalDataBytes: 108, ecBytesPerBlock: 26, numBlocks: 1, alignmentCenters: [6, 30] },
  { version: 6, size: 41, totalDataBytes: 136, ecBytesPerBlock: 18, numBlocks: 2, alignmentCenters: [6, 34] },
];

// GF(256) Log/Exp tables with primitive polynomial 0x11D
const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);

(function initGaloisField() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) {
      x ^= 0x11d;
    }
  }
  for (let i = 255; i < 512; i++) {
    GF_EXP[i] = GF_EXP[i - 255];
  }
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

function getGeneratorPoly(degree: number): Uint8Array {
  let poly = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    const next = new Uint8Array(poly.length + 1);
    const root = GF_EXP[i];
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMul(poly[j], root);
    }
    poly = next;
  }
  return poly;
}

function computeReedSolomon(data: Uint8Array, ecLen: number): Uint8Array {
  const gen = getGeneratorPoly(ecLen);
  const rem = new Uint8Array(ecLen);
  for (let i = 0; i < data.length; i++) {
    const factor = data[i] ^ rem[0];
    for (let j = 0; j < ecLen - 1; j++) {
      rem[j] = rem[j + 1] ^ gfMul(gen[j + 1], factor);
    }
    rem[ecLen - 1] = gfMul(gen[ecLen], factor);
  }
  return rem;
}

function computeFormatBits(ecLevelBits: number, maskPattern: number): number {
  const data = ((ecLevelBits & 0x03) << 3) | (maskPattern & 0x07);
  let rem = data << 10;
  const poly = 0x537; // x^10 + x^8 + x^5 + x^4 + x^2 + x + 1
  for (let i = 14; i >= 10; i--) {
    if ((rem >> i) & 1) {
      rem ^= poly << (i - 10);
    }
  }
  return ((data << 10) | rem) ^ 0x5412;
}

export function generateQrMatrix(text: string): boolean[][] {
  const utf8 = new TextEncoder().encode(text);

  // Pick smallest version that fits utf8 byte payload (4 bits mode + 8 bits len + 8*N bits)
  let spec = VERSION_SPECS[VERSION_SPECS.length - 1];
  for (const candidate of VERSION_SPECS) {
    if (utf8.length + 2 <= candidate.totalDataBytes) {
      spec = candidate;
      break;
    }
  }

  // Build bit buffer
  const bitBuffer: number[] = [];
  const pushBits = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) {
      bitBuffer.push((val >> i) & 1);
    }
  };

  // Mode indicator: Byte mode (0100)
  pushBits(0b0100, 4);
  // Character count indicator (8 bits for versions 1-9 in byte mode)
  pushBits(utf8.length, 8);
  for (let i = 0; i < utf8.length; i++) {
    pushBits(utf8[i], 8);
  }

  // Terminator (up to 4 zero bits)
  const maxDataBits = spec.totalDataBytes * 8;
  const termLen = Math.min(4, maxDataBits - bitBuffer.length);
  pushBits(0, termLen);

  // Pad to byte boundary
  while (bitBuffer.length % 8 !== 0) {
    bitBuffer.push(0);
  }

  // Pad bytes (0xEC, 0x11 alternating)
  let padToggle = true;
  while (bitBuffer.length < maxDataBits) {
    pushBits(padToggle ? 0xec : 0x11, 8);
    padToggle = !padToggle;
  }

  // Convert bits to bytes
  const dataBytes = new Uint8Array(spec.totalDataBytes);
  for (let i = 0; i < spec.totalDataBytes; i++) {
    let b = 0;
    for (let bit = 0; bit < 8; bit++) {
      b = (b << 1) | bitBuffer[i * 8 + bit];
    }
    dataBytes[i] = b;
  }

  // Split into blocks and compute Reed-Solomon EC bytes
  const dataBlocks: Uint8Array[] = [];
  const ecBlocks: Uint8Array[] = [];
  const blockSize = Math.floor(spec.totalDataBytes / spec.numBlocks);
  let offset = 0;
  for (let b = 0; b < spec.numBlocks; b++) {
    const block = dataBytes.slice(offset, offset + blockSize);
    offset += blockSize;
    dataBlocks.push(block);
    ecBlocks.push(computeReedSolomon(block, spec.ecBytesPerBlock));
  }

  // Interleave data and EC codewords
  const codewords: number[] = [];
  for (let i = 0; i < blockSize; i++) {
    for (let b = 0; b < spec.numBlocks; b++) {
      codewords.push(dataBlocks[b][i]);
    }
  }
  for (let i = 0; i < spec.ecBytesPerBlock; i++) {
    for (let b = 0; b < spec.numBlocks; b++) {
      codewords.push(ecBlocks[b][i]);
    }
  }

  const size = spec.size;
  const modules: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const isFunction: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  const setFunctionModule = (r: number, c: number, dark: boolean) => {
    if (r >= 0 && r < size && c >= 0 && c < size) {
      modules[r][c] = dark;
      isFunction[r][c] = true;
    }
  };

  // Draw 7x7 Finder Pattern + 1-module white separator
  const drawFinder = (row: number, col: number) => {
    for (let dr = -1; dr <= 7; dr++) {
      for (let dc = -1; dc <= 7; dc++) {
        const r = row + dr;
        const c = col + dc;
        if (r < 0 || r >= size || c < 0 || c >= size) continue;
        const inOuter = dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6;
        const onOuterBorder = dr === 0 || dr === 6 || dc === 0 || dc === 6;
        const inInner = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
        setFunctionModule(r, c, inOuter && (onOuterBorder || inInner));
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    const dark = i % 2 === 0;
    setFunctionModule(6, i, dark);
    setFunctionModule(i, 6, dark);
  }

  // Alignment patterns
  const centers = spec.alignmentCenters;
  for (let i = 0; i < centers.length; i++) {
    for (let j = 0; j < centers.length; j++) {
      const cr = centers[i];
      const cc = centers[j];
      // Skip if overlapping finder patterns
      if (
        (cr <= 8 && cc <= 8) ||
        (cr <= 8 && cc >= size - 8) ||
        (cr >= size - 8 && cc <= 8)
      ) {
        continue;
      }
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const dist = Math.max(Math.abs(dr), Math.abs(dc));
          setFunctionModule(cr + dr, cc + dc, dist !== 1);
        }
      }
    }
  }

  // Dark module
  setFunctionModule(size - 8, 8, true);

  // Reserve format information areas
  for (let i = 0; i <= 8; i++) {
    if (!isFunction[8][i]) setFunctionModule(8, i, false);
    if (!isFunction[i][8]) setFunctionModule(i, 8, false);
  }
  for (let i = 0; i < 8; i++) {
    if (!isFunction[8][size - 1 - i]) setFunctionModule(8, size - 1 - i, false);
    if (!isFunction[size - 1 - i][8]) setFunctionModule(size - 1 - i, 8, false);
  }

  // Place data bits in upward/downward 2-column zigzag
  const allBits: number[] = [];
  for (const cw of codewords) {
    for (let b = 7; b >= 0; b--) {
      allBits.push((cw >> b) & 1);
    }
  }

  let bitIdx = 0;
  let upward = true;
  for (let rightCol = size - 1; rightCol >= 1; rightCol -= 2) {
    if (rightCol === 6) rightCol = 5; // Skip vertical timing column
    for (let step = 0; step < size; step++) {
      const r = upward ? size - 1 - step : step;
      for (let dc = 0; dc < 2; dc++) {
        const c = rightCol - dc;
        if (!isFunction[r][c]) {
          const dark = bitIdx < allBits.length ? allBits[bitIdx] === 1 : false;
          modules[r][c] = dark;
          bitIdx++;
        }
      }
    }
    upward = !upward;
  }

  // Apply Mask Pattern 0: (r + c) % 2 === 0
  const maskPattern = 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!isFunction[r][c] && (r + c) % 2 === 0) {
        modules[r][c] = !modules[r][c];
      }
    }
  }

  // Write Format Information (Level L = 01, Mask = 000)
  const formatBits = computeFormatBits(0b01, maskPattern);
  for (let i = 0; i <= 5; i++) {
    modules[8][i] = ((formatBits >> i) & 1) === 1;
  }
  modules[8][7] = ((formatBits >> 6) & 1) === 1;
  modules[8][8] = ((formatBits >> 7) & 1) === 1;
  modules[7][8] = ((formatBits >> 8) & 1) === 1;
  for (let i = 9; i < 15; i++) {
    modules[14 - i][8] = ((formatBits >> i) & 1) === 1;
  }

  for (let i = 0; i < 8; i++) {
    modules[8][size - 1 - i] = ((formatBits >> i) & 1) === 1;
  }
  for (let i = 8; i < 15; i++) {
    modules[size - 15 + i][8] = ((formatBits >> i) & 1) === 1;
  }

  return modules;
}

/**
 * Generates a high-resolution PNG Data URL of the student's Luxury Slytherin Event QR Pass,
 * embedding a fast-decode color signature bar at the bottom so uploaded pass images decode
 * instantaneously even on browsers without native BarcodeDetector.
 */
export function renderQrPassPngDataUrl(params: {
  qrPayload: string;
  passId: string;
  studentName: string;
  registrationNo: string;
  track: string;
  eventsCount: number;
}): string {
  const matrix = generateQrMatrix(params.qrPayload);
  const canvas = document.createElement('canvas');
  const W = 520;
  const H = 680;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Deep Emerald / Midnight Background
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#042E23');
  grad.addColorStop(0.5, '#051F17');
  grad.addColorStop(1, '#07110D');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Double Antique Gold Frame
  ctx.strokeStyle = '#C6A15B';
  ctx.lineWidth = 3;
  ctx.strokeRect(16, 16, W - 32, H - 32);
  ctx.strokeStyle = 'rgba(229, 204, 145, 0.45)';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(24, 24, W - 48, H - 48);

  // Header Typography
  ctx.fillStyle = '#E5CC91';
  ctx.font = '700 18px Cinzel, Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('SLYTHERIN — THE HOUSE EVENT', W / 2, 62);

  ctx.fillStyle = '#F5EBD5';
  ctx.font = '600 13px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(`OFFICIAL ENTRY & FOOD PASS • ${params.track.toUpperCase()}`, W / 2, 86);

  // White Quiet-Zone Box for Maximum Camera Scanner Contrast
  const qrBoxSize = 320;
  const qrBoxX = (W - qrBoxSize) / 2;
  const qrBoxY = 108;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize);
  ctx.strokeStyle = '#C6A15B';
  ctx.lineWidth = 2;
  ctx.strokeRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize);

  const quietModules = 4;
  const totalModules = matrix.length + quietModules * 2;
  const cellSize = qrBoxSize / totalModules;

  ctx.fillStyle = '#051A13';
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix.length; c++) {
      if (matrix[r][c]) {
        const x = Math.round(qrBoxX + (c + quietModules) * cellSize);
        const y = Math.round(qrBoxY + (r + quietModules) * cellSize);
        const w = Math.ceil(cellSize);
        const h = Math.ceil(cellSize);
        ctx.fillRect(x, y, w, h);
      }
    }
  }

  // Participant Metadata Below QR
  ctx.fillStyle = '#E5CC91';
  ctx.font = '700 22px Cinzel, Georgia, serif';
  ctx.fillText(params.studentName.toUpperCase(), W / 2, 468);

  ctx.fillStyle = '#F5EBD5';
  ctx.font = '600 17px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(`Reg. No: ${params.registrationNo}   |   Pass ID: ${params.passId}`, W / 2, 498);

  ctx.fillStyle = '#C6A15B';
  ctx.font = '600 15px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(
    `${params.track} (${params.eventsCount} Event${params.eventsCount === 1 ? '' : 's'} Registered)`,
    W / 2,
    526
  );

  ctx.fillStyle = 'rgba(229, 204, 145, 0.75)';
  ctx.font = 'italic 14px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('Present this QR code at the Attendance Desk & Food Counter (Single Use Each)', W / 2, 560);

  // Encode binary barcode strip at y=600..616 for instant offline image-upload decoding
  const payloadBytes = new TextEncoder().encode(params.qrPayload);
  const stripX = 40;
  const stripY = 600;
  const bits: number[] = [1, 0, 1, 0, 1, 1, 0, 0]; // magic header 0xAC
  bits.push(...Array.from({ length: 8 }, (_, i) => (payloadBytes.length >> (7 - i)) & 1));
  for (const b of payloadBytes) {
    for (let i = 7; i >= 0; i--) {
      bits.push((b >> i) & 1);
    }
  }
  const bitW = Math.max(2, Math.floor((W - 80) / bits.length));
  for (let i = 0; i < bits.length; i++) {
    ctx.fillStyle = bits[i] ? '#E5CC91' : '#07110D';
    ctx.fillRect(stripX + i * bitW, stripY, bitW, 8);
  }

  return canvas.toDataURL('image/png');
}

/**
 * Decodes a QR Pass image or camera frame using:
 * 1) Native window.BarcodeDetector('qr_code') if supported by the browser
 * 2) Embedded pass barcode strip if scanning a downloaded Slytherin Pass PNG
 */
export async function decodeQrFromImageSource(
  source: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement | ImageBitmap
): Promise<string | null> {
  // 1. Try Native BarcodeDetector API (Chrome, Edge, macOS, Android)
  if ('BarcodeDetector' in window) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const DetectorClass = (window as any).BarcodeDetector;
      const detector = new DetectorClass({ formats: ['qr_code'] });
      const results = await detector.detect(source);
      if (results && results.length > 0 && results[0].rawValue) {
        return String(results[0].rawValue).trim();
      }
    } catch {
      // Fall through to canvas strip decoder
    }
  }

  // 2. Fallback: Check embedded pass strip on uploaded 520x680 Pass PNG
  try {
    const canvas = document.createElement('canvas');
    const w =
      source instanceof HTMLVideoElement
        ? source.videoWidth
        : source instanceof HTMLImageElement
          ? source.naturalWidth
          : source.width;
    const h =
      source instanceof HTMLVideoElement
        ? source.videoHeight
        : source instanceof HTMLImageElement
          ? source.naturalHeight
          : source.height;
    if (w === 520 && h === 680) {
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(source, 0, 0);
        const imgData = ctx.getImageData(0, 604, w, 1).data;
        // Try bitW from 2 to 8
        for (let bitW = 2; bitW <= 8; bitW++) {
          const readBit = (idx: number) => {
            const px = 40 + idx * bitW + Math.floor(bitW / 2);
            if (px >= w) return 0;
            const r = imgData[px * 4];
            return r > 100 ? 1 : 0;
          };
          let header = 0;
          for (let i = 0; i < 8; i++) header = (header << 1) | readBit(i);
          if (header === 0xac) {
            let len = 0;
            for (let i = 8; i < 16; i++) len = (len << 1) | readBit(i);
            if (len > 0 && len < 120) {
              const out = new Uint8Array(len);
              for (let b = 0; b < len; b++) {
                let val = 0;
                for (let bit = 0; bit < 8; bit++) {
                  val = (val << 1) | readBit(16 + b * 8 + bit);
                }
                out[b] = val;
              }
              return new TextDecoder().decode(out);
            }
          }
        }
      }
    }
  } catch {
    // Ignore
  }

  return null;
}

