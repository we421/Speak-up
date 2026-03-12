import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

function createIcon(size: number, outputPath: string) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Purple gradient background (rounded rectangle effect)
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#6366f1');
  gradient.addColorStop(1, '#8b5cf6');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Draw speech bubble icon
  const padding = size * 0.25;
  const bubbleSize = size - (padding * 2);
  const startX = padding;
  const startY = padding + (bubbleSize * 0.1);

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(startX, startY, bubbleSize, bubbleSize * 0.8, bubbleSize * 0.2);
  ctx.fill();

  // Speech bubble tail
  ctx.beginPath();
  ctx.moveTo(startX + bubbleSize * 0.4, startY + bubbleSize * 0.8);
  ctx.lineTo(startX + bubbleSize * 0.5, startY + bubbleSize * 0.95);
  ctx.lineTo(startX + bubbleSize * 0.6, startY + bubbleSize * 0.8);
  ctx.fill();

  // Draw "S" for SpeakUp
  ctx.fillStyle = '#6366f1';
  ctx.font = `bold ${size * 0.4}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('S', size / 2, size / 2);

  // Save as PNG
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);

  console.log(`✓ Generated ${size}x${size} icon: ${outputPath}`);
  return outputPath;
}

async function main() {
  try {
    console.log('Creating app icons...\n');

    const iconsDir = '/home/z/my-project/public/icons';

    // Create required icon sizes
    createIcon(192, path.join(iconsDir, 'icon-192x192.png'));
    createIcon(512, path.join(iconsDir, 'icon-512x512.png'));
    createIcon(1024, path.join(iconsDir, 'icon-1024x1024.png'));

    console.log('\n✓ All icons generated successfully!');
  } catch (error) {
    console.error('Error creating icons:', error);
    process.exit(1);
  }
}

main();
