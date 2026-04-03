const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920 });

  const filePath = `file:///${path.resolve(__dirname, 'video.html').replace(/\\/g, '/')}`;
  console.log('Loading page:', filePath);
  await page.goto(filePath, { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait for animation to start
  await new Promise(r => setTimeout(r, 2000));

  const framesDir = path.join(__dirname, 'frames');
  if (!fs.existsSync(framesDir)) fs.mkdirSync(framesDir, { recursive: true });

  const FPS = 30;
  const DURATION = 34; // seconds (30s video + buffer)
  const TOTAL_FRAMES = FPS * DURATION;

  console.log(`Capturing ${TOTAL_FRAMES} frames at ${FPS}fps...`);

  // Progress tracking for elements using their computed style
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    // Take every 2nd frame to speed up (15fps effective, will interpolate)
    if (i % 2 !== 0 && i > 30 && i < TOTAL_FRAMES - 30) {
      // Copy previous frame
      const prevNum = String(i - 1).padStart(5, '0');
      const curNum = String(i).padStart(5, '0');
      fs.copyFileSync(
        path.join(framesDir, `frame_${prevNum}.png`),
        path.join(framesDir, `frame_${curNum}.png`)
      );
      continue;
    }

    await page.screenshot({
      path: path.join(framesDir, `frame_${String(i).padStart(5, '0')}.png`),
      type: 'png'
    });

    // Advance time by simulating page time
    await page.evaluate((frameNum) => {
      // Scroll or trigger next frame if needed
      window.__frameOffset = (window.__frameOffset || 0) + 1000 / 15;
    }, i);

    if (i % 30 === 0) {
      console.log(`Progress: ${i}/${TOTAL_FRAMES} frames (${Math.round(i/TOTAL_FRAMES*100)}%)`);
    }
  }

  console.log('All frames captured!');
  console.log(`Frames saved to: ${framesDir}`);

  await browser.close();

  // Generate FFmpeg command for user to run
  const ffmpegCmd = `ffmpeg -framerate 30 -i frames/frame_%05d.png -c:v libx264 -pix_fmt yuv420p -crf 18 -preset slow output.mp4`;
  console.log('\nTo create video, run:');
  console.log(ffmpegCmd);
  console.log('\nOr install ffmpeg-static: npm install ffmpeg-static');
})();
