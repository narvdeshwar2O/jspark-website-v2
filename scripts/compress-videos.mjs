import { execSync } from 'node:child_process';
import ffmpeg from '@ffmpeg-installer/ffmpeg';
import fs from 'node:fs';
import path from 'node:path';

const assetsDir = path.resolve('public/assets');

// List of target videos to compress for mobile
const targets = [
  { input: '1.mp4', output: '1_mobile.mp4', scale: '1280:-2', crf: '28' },
  { input: 'opshydra_gif.mp4', output: 'opshydra_gif_mobile.mp4', scale: '1280:-2', crf: '28' },
  { input: 'opsmind.mp4', output: 'opsmind_mobile.mp4', scale: '1280:-2', crf: '28' },
  { input: 'opsunity.mp4', output: 'opsunity_mobile.mp4', scale: '1280:-2', crf: '28' },
  { input: 'opsvision.mp4', output: 'opsvision_mobile.mp4', scale: '1280:-2', crf: '28' },
  { input: 'opsvision_long.mp4', output: 'opsvision_long_mobile.mp4', scale: '1280:-2', crf: '28' }
];

console.log('Using FFmpeg at:', ffmpeg.path);

for (const target of targets) {
  const inPath = path.join(assetsDir, target.input);
  const outPath = path.join(assetsDir, target.output);

  if (!fs.existsSync(inPath)) {
    console.log(`Skipping missing input: ${target.input}`);
    continue;
  }

  const originalSizeMB = (fs.statSync(inPath).size / (1024 * 1024)).toFixed(2);
  console.log(`\nCompressing ${target.input} (${originalSizeMB} MB) -> ${target.output}...`);

  // H.264 video, AAC / no-audio, faststart for instant playback on mobile stream, preset faster
  const cmd = `"${ffmpeg.path}" -y -i "${inPath}" -vf "scale=${target.scale}" -c:v libx264 -crf ${target.crf} -preset faster -an -movflags +faststart "${outPath}"`;
  
  try {
    const startTime = Date.now();
    execSync(cmd, { stdio: 'inherit' });
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    const newSizeMB = (fs.statSync(outPath).size / (1024 * 1024)).toFixed(2);
    console.log(`✓ Created ${target.output}: ${newSizeMB} MB in ${duration}s (Reduced by ${((1 - newSizeMB / originalSizeMB) * 100).toFixed(1)}%)`);
  } catch (err) {
    console.error(`Error compressing ${target.input}:`, err.message);
  }
}

console.log('\nAll mobile video compressions complete!');
