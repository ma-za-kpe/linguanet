const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertSvgToPng() {
  const publicDir = path.join(__dirname, '..', 'public');
  
  // Convert profile image
  console.log('Converting profile image...');
  const profileSvg = fs.readFileSync(path.join(publicDir, 'linguadao-profile.svg'));
  await sharp(profileSvg)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'linguadao-profile.png'));
  console.log('✅ Profile image converted to PNG');
  
  // Convert cover photo
  console.log('Converting cover photo...');
  const coverSvg = fs.readFileSync(path.join(publicDir, 'linguadao-cover.svg'));
  await sharp(coverSvg)
    .resize(1500, 500)
    .png()
    .toFile(path.join(publicDir, 'linguadao-cover.png'));
  console.log('✅ Cover photo converted to PNG');
  
  console.log('\n🎉 Both images successfully converted to PNG format!');
  console.log('Files created:');
  console.log('  - /public/linguadao-profile.png (512x512)');
  console.log('  - /public/linguadao-cover.png (1500x500)');
}

convertSvgToPng().catch(err => {
  console.error('Error converting SVG to PNG:', err);
  process.exit(1);
});