const fs = require('fs');
const path = require('path');

// Create a proper ICO file with multiple sizes
// This creates a valid ICO file structure
function createICO() {
  const publicDir = path.join(__dirname, '..', 'public');
  const appDir = path.join(__dirname, '..', 'app');
  
  // Read the SVG file
  const svgContent = fs.readFileSync(path.join(publicDir, 'favicon.svg'), 'utf8');
  
  // For now, we'll create a simple colored ICO as a placeholder
  // In production, you'd use a proper image library
  
  // ICO header for single 32x32 image
  const icoHeader = Buffer.from([
    0x00, 0x00,  // Reserved
    0x01, 0x00,  // Type (1 for ICO)
    0x01, 0x00,  // Number of images
    
    // Image directory entry
    0x20,        // Width (32px)
    0x20,        // Height (32px)
    0x00,        // Color palette (0 = no palette)
    0x00,        // Reserved
    0x01, 0x00,  // Color planes
    0x20, 0x00,  // Bits per pixel (32-bit RGBA)
    0x00, 0x10, 0x00, 0x00,  // Size of image data (4096 bytes for 32x32 RGBA)
    0x16, 0x00, 0x00, 0x00   // Offset to image data
  ]);
  
  // Create a 32x32 RGBA image with our brand colors
  const imageData = Buffer.alloc(4096);
  
  // Fill with gradient-like purple color (#667eea to #764ba2)
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 32; x++) {
      const index = (y * 32 + x) * 4;
      
      // Create a circular logo effect
      const centerX = 16;
      const centerY = 16;
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      
      if (distance < 14) {
        // Inside the circle - gradient from #667eea to #764ba2
        const gradientFactor = distance / 14;
        const r = Math.floor(102 + (118 - 102) * gradientFactor);
        const g = Math.floor(126 + (75 - 126) * gradientFactor);
        const b = Math.floor(234 + (162 - 234) * gradientFactor);
        
        imageData[index] = b;      // Blue
        imageData[index + 1] = g;  // Green
        imageData[index + 2] = r;  // Red
        imageData[index + 3] = 255; // Alpha
      } else {
        // Outside the circle - transparent
        imageData[index] = 0;      // Blue
        imageData[index + 1] = 0;  // Green
        imageData[index + 2] = 0;  // Red
        imageData[index + 3] = 0;  // Alpha
      }
    }
  }
  
  // Combine header and image data
  const icoFile = Buffer.concat([icoHeader, imageData]);
  
  // Save to both public and app directories
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoFile);
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoFile);
  
  console.log('✓ Created favicon.ico in both public/ and app/ directories');
}

// Also update the apple-touch-icon
function updateAppleIcon() {
  const publicDir = path.join(__dirname, '..', 'public');
  
  // Copy apple-touch-icon to proper name
  const sourceFile = path.join(publicDir, 'apple-touch-icon.png');
  const destFile = path.join(publicDir, 'apple-icon.png');
  const dest180File = path.join(publicDir, 'apple-icon-180x180.png');
  
  if (fs.existsSync(sourceFile)) {
    fs.copyFileSync(sourceFile, destFile);
    fs.copyFileSync(sourceFile, dest180File);
    console.log('✓ Created apple-icon.png files');
  }
}

// Run the functions
createICO();
updateAppleIcon();

console.log('\n✅ Favicon files updated!');
console.log('Clear your browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R) to see the new favicon.');