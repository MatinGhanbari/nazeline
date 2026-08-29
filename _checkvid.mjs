import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
mkdirSync('shots', { recursive: true });

const browser = await chromium.launch({
  args: [
    '--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader',
    '--enable-webgl','--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required',
  ],
});

const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const errs = [];
page.on('pageerror', e => errs.push(e.message));
page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });

await page.goto('http://127.0.0.1:8765/', { waitUntil: 'load', timeout: 60000 });
await page.waitForTimeout(3500);

const info = await page.evaluate(() => {
  const v = document.getElementById('vid');
  const stage = document.querySelector('.stage');
  const spacer = stage?.parentElement?.classList?.contains('pin-spacer') ? stage.parentElement : null;
  return {
    ready: v.readyState,
    dur: v.duration,
    src: v.currentSrc,
    err: v.error ? v.error.code : null,
    w: v.videoWidth,
    h: v.videoHeight,
    stageTop: spacer ? spacer.offsetTop : stage.offsetTop,
    spacerH: spacer ? spacer.offsetHeight : stage.offsetHeight,
    winH: innerHeight,
  };
});
console.log('VIDEO', JSON.stringify(info, null, 2));

const y = Math.round(info.stageTop + 40);
await page.evaluate(yy => window.scrollTo(0, yy), y);
await page.waitForTimeout(1600);
await page.screenshot({ path: 'shots/fix-desk-s0.png' });

const y2 = Math.round(info.stageTop + (info.spacerH - info.winH) * 0.35);
await page.evaluate(yy => window.scrollTo(0, yy), y2);
await page.waitForTimeout(1400);
await page.screenshot({ path: 'shots/fix-desk-s35.png' });

const pageM = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
await pageM.goto('http://127.0.0.1:8765/', { waitUntil: 'load', timeout: 60000 });
await pageM.waitForTimeout(3000);
const infoM = await pageM.evaluate(() => {
  const stage = document.querySelector('.stage');
  const spacer = stage?.parentElement?.classList?.contains('pin-spacer') ? stage.parentElement : null;
  return { stageTop: spacer ? spacer.offsetTop : stage.offsetTop, spacerH: spacer ? spacer.offsetHeight : stage.offsetHeight, winH: innerHeight };
});
await pageM.evaluate(yy => window.scrollTo(0, yy), Math.round(infoM.stageTop + 20));
await pageM.waitForTimeout(1400);
await pageM.screenshot({ path: 'shots/fix-mob-s0.png' });

if (errs.length) { console.log('ERRS'); errs.forEach(e => console.log(e)); }
else console.log('no page errors');
await browser.close();
