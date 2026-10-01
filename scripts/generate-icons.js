import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height, r, g, b) {
  // Minimal uncompressed RGBA PNG generator
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type);
    const crcVal = crc32(Buffer.concat([typeBuf, data]));
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeInt32BE(crcVal, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  // Table-based CRC32
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[n] = c;
  }
  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) | 0;
  }

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // Raw image data with filter byte 0 at start of each scanline
  const rowLen = 1 + width * 4;
  const raw = Buffer.alloc(height * rowLen);
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.45;
  const innerR = Math.min(width, height) * 0.22;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLen;
    raw[rowOffset] = 0; // Filter None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Medical cross coordinates
      const inCrossH = Math.abs(dx) <= radius * 0.65 && Math.abs(dy) <= radius * 0.22;
      const inCrossV = Math.abs(dy) <= radius * 0.65 && Math.abs(dx) <= radius * 0.22;

      if (dist <= radius) {
        if (inCrossH || inCrossV) {
          // White cross
          raw[pxOffset] = 255;
          raw[pxOffset + 1] = 255;
          raw[pxOffset + 2] = 255;
          raw[pxOffset + 3] = 255;
        } else {
          // Teal background
          raw[pxOffset] = r;
          raw[pxOffset + 1] = g;
          raw[pxOffset + 2] = b;
          raw[pxOffset + 3] = 255;
        }
      } else {
        // Rounded corner teal
        if (Math.abs(dx) < radius * 1.05 && Math.abs(dy) < radius * 1.05) {
          raw[pxOffset] = r;
          raw[pxOffset + 1] = g;
          raw[pxOffset + 2] = b;
          raw[pxOffset + 3] = 255;
        } else {
          raw[pxOffset] = 13;
          raw[pxOffset + 1] = 148;
          raw[pxOffset + 2] = 136;
          raw[pxOffset + 3] = 255;
        }
      }
    }
  }

  const idatData = zlib.deflateSync(raw);
  const idat = chunk('IDAT', idatData);
  const iend = chunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, chunk('IHDR', ihdr), idat, iend]);
}

if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

fs.writeFileSync('public/pwa-192x192.png', createPNG(192, 192, 13, 148, 136));
fs.writeFileSync('public/pwa-512x512.png', createPNG(512, 512, 13, 148, 136));
fs.writeFileSync('public/pwa-maskable-512x512.png', createPNG(512, 512, 13, 148, 136));
fs.writeFileSync('public/apple-touch-icon.png', createPNG(180, 180, 13, 148, 136));
console.log('PWA PNG Icons generated successfully.');
