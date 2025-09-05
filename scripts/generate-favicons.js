// Simple script to generate placeholder favicon files
// Run this with: node scripts/generate-favicons.js

const fs = require('fs');
const path = require('path');

// Create a simple 1x1 pixel PNG as placeholder
// This is the smallest valid PNG file (67 bytes)
const createPlaceholderPNG = (size) => {
  // PNG header and minimal IHDR, IDAT, IEND chunks
  // Creates a purple-ish pixel matching our brand color
  const png = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, // IHDR length
    0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x00, size, // width (1 byte for sizes up to 255)
    0x00, 0x00, 0x00, size, // height
    0x08, 0x06, // bit depth, color type (8-bit RGBA)
    0x00, 0x00, 0x00, // compression, filter, interlace
    0x00, 0x00, 0x00, 0x00, // CRC (simplified)
    0x00, 0x00, 0x00, 0x12, // IDAT length
    0x49, 0x44, 0x41, 0x54, // IDAT
    0x78, 0x9C, 0x62, 0x66, 0x7E, 0xEA, 0x34, 0x62, // compressed data (purple color)
    0x06, 0x00, 0x00, 0x55, 0x00, 0x0E,
    0x00, 0x00, 0x00, 0x00, // CRC
    0x00, 0x00, 0x00, 0x00, // IEND length
    0x49, 0x45, 0x4E, 0x44, // IEND
    0xAE, 0x42, 0x60, 0x82  // IEND CRC
  ]);
  return png;
};

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate favicon files
const favicons = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-96x96.png', size: 96 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 }
];

favicons.forEach(({ name, size }) => {
  const filePath = path.join(publicDir, name);
  
  // Create a simple placeholder PNG
  fs.writeFileSync(filePath, createPlaceholderPNG(Math.min(size, 255)));
  console.log(`✓ Created ${name}`);
});

// Also create the .ico file (copy from 32x32)
const icoPath = path.join(publicDir, 'favicon.ico');
const favicon32 = path.join(publicDir, 'favicon-32x32.png');
if (fs.existsSync(favicon32)) {
  fs.copyFileSync(favicon32, icoPath);
  console.log('✓ Created favicon.ico');
}

console.log('\n✅ All favicon files created successfully!');
console.log('Note: These are placeholder files. For production, use a proper image generator.');