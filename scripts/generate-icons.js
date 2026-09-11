import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createCRC32Table() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) {
        c = 0xedb88320 ^ (c >>> 1);
      } else {
        c = c >>> 1;
      }
    }
    table[n] = c >>> 0;
  }
  return table;
}

const crcTable = createCRC32Table();
function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(8 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

function generatePng(size = 256) {
  const width = size;
  const height = size;
  const rawData = Buffer.alloc(height * (1 + width * 4));

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + width * 4);
    rawData[rowOffset] = 0; // None filter

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;

      // Distance from center
      const cx = width / 2;
      const cy = height / 2;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Rounded squircle container
      const cornerRadius = size * 0.22;
      const ax = Math.max(Math.abs(dx) - (cx - cornerRadius), 0);
      const ay = Math.max(Math.abs(dy) - (cy - cornerRadius), 0);
      const cornerDist = Math.sqrt(ax * ax + ay * ay);

      if (cornerDist > cornerRadius) {
        // Transparent outside
        rawData[pixelOffset] = 0;
        rawData[pixelOffset + 1] = 0;
        rawData[pixelOffset + 2] = 0;
        rawData[pixelOffset + 3] = 0;
        continue;
      }

      // Deep obsidian studio background (#0B0F19 to #1A2333)
      const grad = (y / height);
      let r = Math.round(11 + grad * 15);
      let g = Math.round(15 + grad * 20);
      let b = Math.round(25 + grad * 35);
      let a = 255;

      // Draw NEXORA 'N' geometric logo
      // Left vertical pillar: x between size * 0.28 and 0.38, y between 0.22 and 0.78
      const isLeftCol = x >= size * 0.26 && x <= size * 0.38 && y >= size * 0.22 && y <= size * 0.78;
      // Right vertical pillar: x between size * 0.62 and 0.74, y between 0.22 and 0.78
      const isRightCol = x >= size * 0.62 && x <= size * 0.74 && y >= size * 0.22 && y <= size * 0.78;
      // Diagonal: y between 0.22 and 0.78, x connects left-top to right-bottom
      const diagT = (y - size * 0.22) / (size * 0.56);
      const diagCenterX = size * 0.32 + diagT * (size * 0.36);
      const isDiag = diagT >= 0 && diagT <= 1 && Math.abs(x - diagCenterX) <= size * 0.065;

      if (isLeftCol) {
        // Cyan accent #0EA5E9
        r = 14; g = 165; b = 233;
      } else if (isDiag) {
        // Indigo / Emerald gradient #6366F1 to #10B981
        const t = (x / width);
        r = Math.round(99 * (1 - t) + 16 * t);
        g = Math.round(102 * (1 - t) + 185 * t);
        b = Math.round(241 * (1 - t) + 129 * t);
      } else if (isRightCol) {
        // Emerald #10B981
        r = 16; g = 185; b = 129;
      } else if (dist < size * 0.38 && dist > size * 0.36) {
        // Subtle orbital guideline
        r = Math.min(255, r + 40);
        g = Math.min(255, g + 50);
        b = Math.min(255, b + 70);
      }

      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  // PNG Header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bit depth
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // IDAT chunk
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);

  // IEND chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeIco(pngBuffer) {
  // ICO header: 6 bytes
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(1, 4); // 1 image

  // Image entry: 16 bytes
  const entry = Buffer.alloc(16);
  entry.writeUInt8(0, 0); // 256px = 0
  entry.writeUInt8(0, 1); // 256px = 0
  entry.writeUInt8(0, 2); // colors (0 for 256+)
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(pngBuffer.length, 8); // size of image data
  entry.writeUInt32LE(22, 12); // offset (6 + 16 = 22)

  return Buffer.concat([header, entry, pngBuffer]);
}

const png256 = generatePng(256);
const ico = makeIco(png256);

fs.mkdirSync('public', { recursive: true });
fs.mkdirSync('build', { recursive: true });

fs.writeFileSync(path.join('public', 'icon.png'), png256);
fs.writeFileSync(path.join('public', 'icon.ico'), ico);
fs.writeFileSync(path.join('build', 'icon.png'), png256);
fs.writeFileSync(path.join('build', 'icon.ico'), ico);

console.log('Successfully generated public/icon.png, public/icon.ico, build/icon.png, build/icon.ico');
