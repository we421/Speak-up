import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

async function generateAppIcon(size: string, outputPath: string) {
  const zai = await ZAI.create();

  const response = await zai.images.generations.create({
    prompt: 'Simple modern app icon for English learning app, purple gradient background with white speech bubble icon, clean minimal design, professional app icon, high quality',
    size: size as any
  });

  const imageBase64 = response.data[0].base64;
  const buffer = Buffer.from(imageBase64, 'base64');

  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, buffer);
  console.log(`✓ Generated ${size} icon: ${outputPath}`);

  return outputPath;
}

async function main() {
  try {
    console.log('Generating app icons...\n');

    // Generate 1024x1024 image (we'll use this as base)
    const largeIcon = await generateAppIcon('1024x1024', '/home/z/my-project/public/icons/icon-1024x1024.png');

    console.log('\n✓ Icons generated successfully!');
    console.log(`Large icon: ${largeIcon}`);
    console.log('\nNote: PWABuilder will automatically resize 1024x1024 to required sizes.');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

main();
