import { chromium } from 'playwright';

const URL = 'http://127.0.0.1:8765/';
const OUT = process.argv[2] || 'shots';

const shots = [
  { name: '01-hero',   p: -1 },   // hero, no scroll
  { name: '02-stage-0',  p: 0.00 },
  { name: '03-stage-25', p: 0.25 },
  { name: '04-stage-50', p: 0.50 },
  { name: '05-stage-75', p: 0.75 },
  { name: '06-stage-95', p: 0.95 },
];

const browser = await chromium.launch({
  args: [
    '--enable-unsafe-swiftshader',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--autoplay-policy=no-user-gesture-required',
  ],
});
const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });

const errors = [];
const allLogs = [];
page.on('console', m => { allLogs.push(`[${m.type()}] ${m.text()}`); if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });
page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
page.on('requestfailed', r => errors.push('REQFAIL: ' + r.url() + ' ' + r.failure()?.errorText));
page.on('response', r => { if (r.status() === 404) errors.push('404: ' + r.url()); });

await page.goto(URL, { waitUntil: 'load', timeout: 60000 });
await page.waitForTimeout(3500);   // let video metadata + fonts settle

// Find total document height and the stage's scroll range
const info = await page.evaluate(() => {
  const st = window.ScrollTrigger;
  const stage = document.querySelector('.stage');
  const spacer = stage ? (stage.parentElement.classList.contains('pin-spacer') ? stage.parentElement : null) : null;
  return {
    docH: document.documentElement.scrollHeight,
    winH: window.innerHeight,
    stageTop: spacer ? spacer.offsetTop : (stage ? stage.offsetTop : -1),
    spacerH: spacer ? spacer.offsetHeight : -1,
    hasST: !!st,
    stCount: st ? st.getAll().length : -1,
    videoDur: document.getElementById('vid').duration,
    videoReady: document.getElementById('vid').readyState,
  };
});
console.log('PAGE INFO:', JSON.stringify(info, null, 2));

const stageTop    = info.stageTop;
const stageLength = info.spacerH > 0 ? (info.spacerH - info.winH) : (info.winH * 5);

for (const s of shots) {
  let y;
  if (s.p < 0) y = 0;
  else y = Math.round(stageTop + stageLength * s.p);
  await page.evaluate(yy => window.scrollTo(0, yy), y);
  await page.waitForTimeout(1400);   // let scrub settle
  await page.screenshot({ path: `${OUT}/${s.name}.png` });
  console.log(`shot ${s.name} @ y=${y}`);
}

// report errors
if (errors.length) {
  console.log('\n--- ERRORS ---');
  errors.forEach(e => console.log(e));
} else {
  console.log('\nNo console/page errors.');
}
console.log('\n--- ALL CONSOLE LOGS ---');
allLogs.forEach(l => console.log(l));

// check caption opacities at a mid scroll
const cap = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('.cap')).map(c => ({
    i: c.dataset.i,
    op: c.style.opacity,
    t: c.querySelector('.cap__t')?.textContent?.trim(),
  }));
});
console.log('CAPTIONS @ end:', JSON.stringify(cap));

await browser.close();
