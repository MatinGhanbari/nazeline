import { chromium } from 'playwright';

const URL = 'http://127.0.0.1:8765/';

const browser = await chromium.launch({
  args: [
    '--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader',
    '--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required',
  ],
});
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const errs = [];
page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
page.on('console', m => { if (m.type()==='error') errs.push('CONSOLE: '+m.text()); });

await page.goto(URL, { waitUntil: 'load', timeout: 60000 });
await page.waitForTimeout(3500);

// expose internals for diagnosis
const info = await page.evaluate(() => {
  const stage = document.querySelector('.stage');
  const spacer = stage?.parentElement?.classList?.contains('pin-spacer') ? stage.parentElement : null;
  return {
    docH: document.documentElement.scrollHeight,
    winH: innerHeight,
    stageTop: spacer ? spacer.offsetTop : -1,
    spacerH: spacer ? spacer.offsetHeight : -1,
    stCount: window.ScrollTrigger ? window.ScrollTrigger.getAll().length : -1,
  };
});
console.log('INFO', JSON.stringify(info));

const stageTop = info.stageTop;
const stageLen = info.spacerH - info.winH;

// ASCII luminance map of the canvas, 60x22 cells
async function asciiMap(label){
  const out = await page.evaluate(() => {
    const cv = document.getElementById('c');
    const W = 60, H = 22;
    const tmp = document.createElement('canvas');
    tmp.width = W; tmp.height = H;
    const ctx = tmp.getContext('2d');
    ctx.drawImage(cv, 0, 0, W, H);
    const d = ctx.getImageData(0,0,W,H).data;
    const ramp = ' .:-=+*#%@';
    let rows = [];
    for (let y=0; y<H; y++){
      let r = '';
      for (let x=0; x<W; x++){
        const i = (y*W+x)*4;
        const a = d[i+3]/255;
        // build alpha map: where the plane is opaque, mark with '#'
        r += a > 0.85 ? '#' : a > 0.5 ? '+' : a > 0.15 ? '.' : ' ';
      }
      rows.push(r);
    }
    return rows.join('\n');
  });
  console.log(`\n=== ${label} === canvas alpha map (60x22) ===`);
  console.log(out);
}

for (const p of [0.0, 0.25, 0.5, 0.75, 0.95]) {
  const y = Math.round(stageTop + stageLen * p);
  await page.evaluate(yy => window.scrollTo(0, yy), y);
  await page.waitForTimeout(1600);
  const st = await page.evaluate(() => {
    const v = document.getElementById('vid');
    const caps = Array.from(document.querySelectorAll('.cap')).map(c => +c.style.opacity || 0);
    const rail = Array.from(document.querySelectorAll('.stage__rail-track span')).map(t => t.classList.contains('is-on')?1:0);
    return { vTime: +v.currentTime.toFixed(2), vPaused: v.paused, caps: caps.map(n=>n.toFixed(2)), rail };
  });
  console.log(`\n--- progress ${p} (y=${y}) | video.t=${st.vTime} paused=${st.vPaused} caps=[${st.caps}] rail=[${st.rail}]`);
  await asciiMap(`p=${p}`);
}

if (errs.length){ console.log('\nERRORS:'); errs.forEach(e=>console.log(e)); }
else console.log('\nno errors');
await browser.close();
