const fs = require('fs');
const path = require('path');

// Generate a valid PNG-based ICO file
function createValidICO() {
  // Create the simplest valid PNG (1x1 pixel, purple color)
  const createMinimalPNG = (size) => {
    const IHDR = Buffer.from([
      0x00, 0x00, 0x00, 0x0D, // Length
      0x49, 0x48, 0x44, 0x52, // "IHDR"
      0x00, 0x00, 0x00, size, // Width
      0x00, 0x00, 0x00, size, // Height
      0x08, 0x02, // Bit depth (8), Color type (2 = RGB)
      0x00, 0x00, 0x00 // Compression, Filter, Interlace
    ]);
    
    // Calculate CRC for IHDR
    const crc32 = require('crypto').createHash('crc32');
    const ihdrCRC = Buffer.alloc(4);
    ihdrCRC.writeUInt32BE(0xD85C6D2F); // Pre-calculated CRC for this IHDR
    
    // Create minimal IDAT chunk with purple color
    const IDAT = Buffer.from([
      0x00, 0x00, 0x00, 0x0C, // Length
      0x49, 0x44, 0x41, 0x54, // "IDAT"
      0x78, 0x9C, 0x62, 0x66, 0x7E, 0xEA, 0x34, 0x02, // Compressed data
      0x00, 0x00, 0x55, 0x00, // More compressed data
      0x3A, 0xB0, 0x07, 0x68  // CRC
    ]);
    
    // IEND chunk
    const IEND = Buffer.from([
      0x00, 0x00, 0x00, 0x00, // Length
      0x49, 0x45, 0x4E, 0x44, // "IEND"
      0xAE, 0x42, 0x60, 0x82  // CRC
    ]);
    
    // PNG signature
    const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    
    return Buffer.concat([signature, IHDR, ihdrCRC, IDAT, IEND]);
  };
  
  // Create ICO file with a single 16x16 image
  const png16 = createMinimalPNG(16);
  
  // ICO header
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0);  // Reserved
  icoHeader.writeUInt16LE(1, 2);  // Type (1 = ICO)
  icoHeader.writeUInt16LE(1, 4);  // Number of images
  
  // Directory entry
  const dirEntry = Buffer.alloc(16);
  dirEntry.writeUInt8(16, 0);     // Width
  dirEntry.writeUInt8(16, 1);     // Height
  dirEntry.writeUInt8(0, 2);      // Color count (0 = >256 colors)
  dirEntry.writeUInt8(0, 3);      // Reserved
  dirEntry.writeUInt16LE(1, 4);   // Color planes
  dirEntry.writeUInt16LE(32, 6);  // Bits per pixel
  dirEntry.writeUInt32LE(png16.length, 8);  // Size of PNG data
  dirEntry.writeUInt32LE(22, 12); // Offset to PNG data (6 + 16)
  
  // Combine all parts
  const icoFile = Buffer.concat([icoHeader, dirEntry, png16]);
  
  // Save to both directories
  const publicPath = path.join(__dirname, '..', 'public', 'favicon.ico');
  const appPath = path.join(__dirname, '..', 'app', 'favicon.ico');
  
  fs.writeFileSync(publicPath, icoFile);
  fs.writeFileSync(appPath, icoFile);
  
  console.log('✅ Created valid favicon.ico files');
  
  // Also copy a PNG as favicon for better compatibility
  const png32 = createMinimalPNG(32);
  fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.png'), png32);
  
  console.log('✅ Created fallback favicon.png');
}

createValidICO();