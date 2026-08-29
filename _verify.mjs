import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const URL = 'http://127.0.0.1:8765/';
mkdirSync('shots', { recursive: true });

const viewports = [
  { name: 'desk', width: 1440, height: 900 },
  { name: 'tab',  width: 900,  height: 1200 },
  { name: 'mob',  width: 390,  height: 844 },
];

function overlap(a, b) {
  if (!a || !b) return 0;
  const x = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
  const y = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
  return x * y;
}

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

const issues = [];

for (const vp of viewports) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
  page.on('pageerror', e => issues.push(`${vp.name} PAGEERROR: ${e.message}`));

  await page.goto(URL, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(2800);

  const info = await page.evaluate(() => {
    const stage = document.querySelector('.stage');
    const spacer = stage?.parentElement?.classList?.contains('pin-spacer') ? stage.parentElement : null;
    return {
      docH: document.documentElement.scrollHeight,
      winH: innerHeight,
      stageTop: spacer ? spacer.offsetTop : (stage?.offsetTop ?? -1),
      spacerH: spacer ? spacer.offsetHeight : (stage?.offsetHeight ?? -1),
      stCount: window.ScrollTrigger ? window.ScrollTrigger.getAll().length : -1,
      stageH: stage?.offsetHeight ?? -1,
    };
  });
  console.log(`\n=== ${vp.name} ${vp.width}x${vp.height} ===`);
  console.log(JSON.stringify(info));

  const stageLen = Math.max(1, info.spacerH - info.winH);
  const points = [
    { name: 'hero', p: -1 },
    { name: 's0',   p: 0.02 },
    { name: 's35',  p: 0.35 },
    { name: 's70',  p: 0.70 },
  ];

  for (const s of points) {
    const y = s.p < 0 ? 0 : Math.round(info.stageTop + stageLen * s.p);
    await page.evaluate(yy => window.scrollTo(0, yy), y);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `shots/${vp.name}-${s.name}.png` });

    const boxes = await page.evaluate(() => {
      const box = (el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || +cs.opacity === 0) return null;
        if (r.width < 2 || r.height < 2) return null;
        return { x: r.x, y: r.y, w: r.width, h: r.height };
      };
      const caps = Array.from(document.querySelectorAll('.cap'))
        .map(c => ({ t: c.querySelector('.cap__t')?.textContent, op: +c.style.opacity || 0, box: box(c) }))
        .filter(c => c.op > 0.15);
      return {
        topbar: box(document.querySelector('.topbar')),
        nav: box(document.querySelector('.topnav')),
        brand: box(document.querySelector('.brand')),
        meta: box(document.querySelector('.topmeta')),
        chrome: box(document.querySelector('.stage__chrome')),
        hud: box(document.querySelector('.stage__hud')),
        time: box(document.querySelector('.stage__time')),
        caps,
        details: box(document.querySelector('.details')),
        heroTitle: box(document.querySelector('.hero__title')),
      };
    });

    const pairs = [
      ['nav', 'hud'],
      ['nav', 'time'],
      ['brand', 'hud'],
      ['meta', 'time'],
      ['topbar', 'chrome'],
    ];
    for (const [A, B] of pairs) {
      const o = overlap(boxes[A], boxes[B]);
      if (o > 8) issues.push(`${vp.name} ${s.name}: ${A} overlaps ${B} by ${Math.round(o)}px`);
    }
    for (const cap of boxes.caps) {
      const oNav = overlap(boxes.nav, cap.box);
      const oBar = overlap(boxes.topbar, cap.box);
      if (oNav > 8) issues.push(`${vp.name} ${s.name}: nav overlaps cap "${cap.t}"`);
      if (oBar > 8) issues.push(`${vp.name} ${s.name}: topbar overlaps cap "${cap.t}"`);
      if (boxes.details && overlap(boxes.details, cap.box) > 40) {
        issues.push(`${vp.name} ${s.name}: cap "${cap.t}" overlaps details`);
      }
    }
    console.log(`  ${s.name} y=${y} caps=${boxes.caps.map(c => `${c.t}:${c.op.toFixed(2)}`).join('|') || '-'}`);
  }
  await page.close();
}

console.log('\n--- ISSUES ---');
if (!issues.length) console.log('none');
else issues.forEach(i => console.log(i));

await browser.close();
