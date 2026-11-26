// Pure TypeScript QR Code generator (Model 2, Byte Mode, Zero External Dependencies)

export class QRCode {
  modules: boolean[][];
  size: number;

  constructor(size: number) {
    this.size = size;
    this.modules = Array.from({ length: size }, () => Array(size).fill(false));
  }

  isDark(row: number, col: number): boolean {
    return this.modules[row]?.[col] ?? false;
  }
}

// Galois Field GF(256) arithmetic
const EXP_TABLE = new Uint8Array(512);
const LOG_TABLE = new Uint8Array(256);

(function initGaloisField() {
  let val = 1;
  for (let i = 0; i < 255; i++) {
    EXP_TABLE[i] = val;
    EXP_TABLE[i + 255] = val;
    LOG_TABLE[val] = i;
    val = (val << 1) ^ (val & 0x80 ? 0x11d : 0);
  }
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return EXP_TABLE[LOG_TABLE[a] + LOG_TABLE[b]];
}

function rsGeneratorPoly(degree: number): Uint8Array {
  let poly = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    const next = new Uint8Array(poly.length + 1);
    const factor = EXP_TABLE[i];
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= gfMul(poly[j], factor);
      next[j + 1] ^= poly[j];
    }
    poly = next;
  }
  return poly;
}

function rsEncode(data: Uint8Array, numEc: number): Uint8Array {
  const gen = rsGeneratorPoly(numEc);
  const remainder = new Uint8Array(numEc);

  for (let i = 0; i < data.length; i++) {
    const lead = data[i] ^ remainder[0];
    remainder.copyWithin(0, 1);
    remainder[numEc - 1] = 0;
    if (lead !== 0) {
      for (let j = 0; j < numEc; j++) {
        remainder[j] ^= gfMul(gen[j], lead);
      }
    }
  }
  return remainder;
}

// Version table for ECC Level L
// [version, totalCodewords, dataCodewords, ecCodewords, alignmentCoords]
interface QrSpec {
  ver: number;
  size: number;
  totalBytes: number;
  dataBytes: number;
  ecBytes: number;
  align: number[];
}

const QR_SPECS: QrSpec[] = [
  { ver: 1, size: 21, totalBytes: 26, dataBytes: 19, ecBytes: 7, align: [] },
  { ver: 2, size: 25, totalBytes: 44, dataBytes: 34, ecBytes: 10, align: [6, 18] },
  { ver: 3, size: 29, totalBytes: 70, dataBytes: 55, ecBytes: 15, align: [6, 22] },
  { ver: 4, size: 33, totalBytes: 100, dataBytes: 80, ecBytes: 20, align: [6, 26] },
  { ver: 5, size: 37, totalBytes: 134, dataBytes: 108, ecBytes: 26, align: [6, 30] },
  { ver: 6, size: 41, totalBytes: 172, dataBytes: 136, ecBytes: 36, align: [6, 34] },
  { ver: 7, size: 45, totalBytes: 196, dataBytes: 156, ecBytes: 40, align: [6, 22, 38] },
  { ver: 8, size: 49, totalBytes: 242, dataBytes: 194, ecBytes: 48, align: [6, 24, 42] },
];

export function generateQrMatrix(text: string): QRCode {
  const utf8Bytes = new TextEncoder().encode(text);
  const textLen = utf8Bytes.length;

  // Find minimal version that fits textLen bytes in Byte Mode (4 bits mode + 8/16 bits len)
  const spec = QR_SPECS.find((s) => s.dataBytes >= textLen + (s.ver < 10 ? 2 : 3));
  if (!spec) {
    throw new Error('Text exceeds supported QR code capacity');
  }

  // 1. Bit Buffer encoding (Byte Mode: 0100)
  const bits: number[] = [];
  function pushBits(val: number, len: number) {
    for (let i = len - 1; i >= 0; i--) {
      bits.push((val >> i) & 1);
    }
  }

  pushBits(0b0100, 4); // Byte mode indicator
  pushBits(textLen, spec.ver < 10 ? 8 : 16); // Character count

  for (let i = 0; i < textLen; i++) {
    pushBits(utf8Bytes[i], 8);
  }

  // Terminator (up to 4 zeroes)
  const maxBits = spec.dataBytes * 8;
  const termLen = Math.min(4, maxBits - bits.length);
  for (let i = 0; i < termLen; i++) bits.push(0);

  // Pad to byte boundary
  while (bits.length % 8 !== 0) bits.push(0);

  // Pad bytes 0xEC (236), 0x11 (17)
  const padBytes = [0xec, 0x11];
  let padIdx = 0;
  while (bits.length < maxBits) {
    pushBits(padBytes[padIdx % 2], 8);
    padIdx++;
  }

  // Convert bits to data codewords
  const dataCodewords = new Uint8Array(spec.dataBytes);
  for (let i = 0; i < spec.dataBytes; i++) {
    let b = 0;
    for (let bit = 0; bit < 8; bit++) {
      b = (b << 1) | bits[i * 8 + bit];
    }
    dataCodewords[i] = b;
  }

  // Compute Reed-Solomon Error Correction
  const ecCodewords = rsEncode(dataCodewords, spec.ecBytes);

  // Combine data + ec
  const allCodewords = new Uint8Array(spec.totalBytes);
  allCodewords.set(dataCodewords, 0);
  allCodewords.set(ecCodewords, dataCodewords.length);

  // 2. Build Matrix
  const size = spec.size;
  const qr = new QRCode(size);
  const isFunction = Array.from({ length: size }, () => Array(size).fill(false));

  function setFunctionModule(r: number, c: number, dark: boolean) {
    if (r >= 0 && r < size && c >= 0 && c < size) {
      qr.modules[r][c] = dark;
      isFunction[r][c] = true;
    }
  }

  // Finder patterns (7x7) + Separators
  function drawFinder(top: number, left: number) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const row = top + r;
        const col = left + c;
        if (row < 0 || row >= size || col < 0 || col >= size) continue;
        const isCore = (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
                       (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
                       (r >= 2 && r <= 4 && c >= 2 && c <= 4);
        setFunctionModule(row, col, isCore);
      }
    }
  }

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    setFunctionModule(6, i, i % 2 === 0);
    setFunctionModule(i, 6, i % 2 === 0);
  }

  // Alignment patterns
  if (spec.align.length > 0) {
    for (const r of spec.align) {
      for (const c of spec.align) {
        if (isFunction[r][c]) continue; // Skip finders
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const isBorder = Math.abs(dr) === 2 || Math.abs(dc) === 2 || (dr === 0 && dc === 0);
            setFunctionModule(r + dr, c + dc, isBorder);
          }
        }
      }
    }
  }

  // Dark module
  setFunctionModule(size - 8, 8, true);

  // Reserve format information areas
  for (let i = 0; i < 9; i++) {
    if (!isFunction[8][i]) isFunction[8][i] = true;
    if (!isFunction[i][8]) isFunction[i][8] = true;
  }
  for (let i = size - 8; i < size; i++) {
    if (!isFunction[8][i]) isFunction[8][i] = true;
    if (!isFunction[i][8]) isFunction[i][8] = true;
  }

  // 3. Place Data Modules with Mask 0 ((r + c) % 2 == 0)
  let bitPtr = 0;
  const totalDataBits = allCodewords.length * 8;
  let dir = -1; // -1: up, +1: down

  for (let rightCol = size - 1; rightCol > 0; rightCol -= 2) {
    if (rightCol === 6) rightCol--; // Skip vertical timing column

    const startRow = dir === -1 ? size - 1 : 0;
    const endRow = dir === -1 ? -1 : size;

    for (let r = startRow; r !== endRow; r += dir) {
      for (let c = rightCol; c >= rightCol - 1; c--) {
        if (!isFunction[r][c]) {
          let dark = false;
          if (bitPtr < totalDataBits) {
            const byteIdx = bitPtr >> 3;
            const bitIdx = 7 - (bitPtr & 7);
            dark = ((allCodewords[byteIdx] >> bitIdx) & 1) === 1;
            bitPtr++;
          }
          // Mask 0: (r + c) % 2 === 0
          if ((r + c) % 2 === 0) {
            dark = !dark;
          }
          qr.modules[r][c] = dark;
        }
      }
    }
    dir = -dir;
  }

  // 4. Format information (ECC Level L = 01, Mask 0 = 000 -> 01000)
  // Mask 0 Level L format bits (with BCH 15,5 and XOR mask 0x5412):
  // 01000 -> 0x08 -> BCH -> 0x77C4 ^ 0x5412 = 0x23D6 -> 0b010001111010110
  const formatBits = 0b010001111010110;

  for (let i = 0; i < 15; i++) {
    const bit = ((formatBits >> (14 - i)) & 1) === 1;

    // Top-left
    if (i <= 5) setFunctionModule(8, i, bit);
    else if (i === 6) setFunctionModule(8, 7, bit);
    else if (i === 7) setFunctionModule(8, 8, bit);
    else if (i === 8) setFunctionModule(7, 8, bit);
    else setFunctionModule(14 - i, 8, bit);

    // Split bottom-left and top-right
    if (i < 8) {
      setFunctionModule(size - 1 - i, 8, bit);
    } else {
      setFunctionModule(8, size - 15 + i, bit);
    }
  }

  return qr;
}

export function drawQrToCanvas(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  sizePx: number,
  darkColor = '#100303',
  lightColor = '#FBF5F9'
): void {
  try {
    const qr = generateQrMatrix(text);
    const count = qr.size;
    const quietZone = 2;
    const totalGrid = count + quietZone * 2;
    const cellSize = sizePx / totalGrid;

    ctx.save();

    // Background quiet zone
    ctx.fillStyle = lightColor;
    ctx.fillRect(x, y, sizePx, sizePx);

    // Dark modules
    ctx.fillStyle = darkColor;
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (qr.isDark(r, c)) {
          const px = x + (c + quietZone) * cellSize;
          const py = y + (r + quietZone) * cellSize;
          ctx.fillRect(Math.round(px), Math.round(py), Math.ceil(cellSize), Math.ceil(cellSize));
        }
      }
    }

    ctx.restore();
  } catch (err) {
    console.warn('QR code generation error:', err);
  }
}
