const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Source image
const SOURCE_IMAGE = path.join(__dirname, '..', 'public', 'linguadao-profile.png');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const APP_DIR = path.join(__dirname, '..', 'app');

// Icon sizes to generate
const iconSizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-96x96.png', size: 96 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'apple-icon.png', size: 180 },
  { name: 'apple-icon-180x180.png', size: 180 },
];

// Generate icons
async function generateIcons() {
  console.log('🎨 Generating LinguaDAO icons from profile image...\n');

  // Check if source image exists
  if (!fs.existsSync(SOURCE_IMAGE)) {
    console.error('❌ Source image not found:', SOURCE_IMAGE);
    process.exit(1);
  }

  // Generate each icon size
  for (const { name, size } of iconSizes) {
    const outputPath = path.join(PUBLIC_DIR, name);
    
    try {
      await sharp(SOURCE_IMAGE)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generated ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`❌ Failed to generate ${name}:`, error.message);
    }
  }

  // Generate favicon.ico from 32x32
  try {
    const favicon32Path = path.join(PUBLIC_DIR, 'favicon-32x32.png');
    const faviconIcoPath = path.join(PUBLIC_DIR, 'favicon.ico');
    const appFaviconPath = path.join(APP_DIR, 'favicon.ico');
    
    // Copy 32x32 as .ico (browsers will handle it)
    await sharp(SOURCE_IMAGE)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFile(faviconIcoPath);
    
    // Copy to app directory as well
    fs.copyFileSync(faviconIcoPath, appFaviconPath);
    
    console.log('✅ Generated favicon.ico (32x32)');
    console.log('✅ Copied favicon.ico to app directory');
  } catch (error) {
    console.error('❌ Failed to generate favicon.ico:', error.message);
  }

  // Generate Open Graph and Twitter images (using the cover image if available)
  const coverImage = path.join(PUBLIC_DIR, 'linguadao-cover.png');
  
  if (fs.existsSync(coverImage)) {
    // Generate OG image (1200x630)
    try {
      await sharp(coverImage)
        .resize(1200, 630, {
          fit: 'cover',
          position: 'center'
        })
        .png()
        .toFile(path.join(PUBLIC_DIR, 'og-image.png'));
      
      console.log('✅ Generated og-image.png (1200x630)');
    } catch (error) {
      console.error('❌ Failed to generate og-image.png:', error.message);
    }

    // Generate Twitter image (1200x600)
    try {
      await sharp(coverImage)
        .resize(1200, 600, {
          fit: 'cover',
          position: 'center'
        })
        .png()
        .toFile(path.join(PUBLIC_DIR, 'twitter-image.png'));
      
      console.log('✅ Generated twitter-image.png (1200x600)');
    } catch (error) {
      console.error('❌ Failed to generate twitter-image.png:', error.message);
    }
  } else {
    // Use profile image for OG/Twitter if cover not available
    try {
      await sharp(SOURCE_IMAGE)
        .resize(1200, 630, {
          fit: 'contain',
          background: { r: 10, g: 10, b: 10, alpha: 1 }
        })
        .png()
        .toFile(path.join(PUBLIC_DIR, 'og-image.png'));
      
      await sharp(SOURCE_IMAGE)
        .resize(1200, 600, {
          fit: 'contain',
          background: { r: 10, g: 10, b: 10, alpha: 1 }
        })
        .png()
        .toFile(path.join(PUBLIC_DIR, 'twitter-image.png'));
      
      console.log('✅ Generated og-image.png and twitter-image.png from profile');
    } catch (error) {
      console.error('❌ Failed to generate social images:', error.message);
    }
  }

  // Generate screenshot placeholders
  try {
    await sharp(SOURCE_IMAGE)
      .resize(400, 300, {
        fit: 'contain',
        background: { r: 10, g: 10, b: 10, alpha: 1 }
      })
      .png()
      .toFile(path.join(PUBLIC_DIR, 'screenshot-1.png'));
    
    await sharp(SOURCE_IMAGE)
      .resize(400, 300, {
        fit: 'contain',
        background: { r: 10, g: 10, b: 10, alpha: 1 }
      })
      .png()
      .toFile(path.join(PUBLIC_DIR, 'screenshot-2.png'));
    
    console.log('✅ Generated screenshot placeholders');
  } catch (error) {
    console.error('❌ Failed to generate screenshots:', error.message);
  }

  console.log('\n🎉 All icons generated successfully!');
  console.log('💡 Clear your browser cache and restart the dev server to see the new icons.');
}

// Run the generation
generateIcons().catch(console.error);