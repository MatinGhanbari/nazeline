/* =========================================================
   NazeLine — main.js
   Scroll-pinned stage: visible video + alternating captions.
   ========================================================= */

const gsap          = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
gsap.registerPlugin(ScrollTrigger);

const STACK_BP = 840;
const SCRUB_VH = 5;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

function faNum(n){
  return n.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d]);
}
function formatTime(s){
  const m = Math.floor(s / 60), r = Math.max(0, Math.round(s - m * 60));
  return (m < 10 ? '۰' : '') + faNum(m) + ':' + (r < 10 ? '۰' : '') + faNum(r);
}

/* ----------------------------------------------------------
   Video — shown as a real <video>, scrubbed with a seek queue
---------------------------------------------------------- */
const video = document.getElementById('vid');
const media = document.getElementById('stageMedia');
video.muted = true;
video.playsInline = true;
video.preload = 'auto';

let videoReady = false;
let videoDur   = 0;
let scrollP    = 0;
let targetTime = 0;
let seeking    = false;
let pendingSeek = null;
let playLock   = false;

function setupVideo(){
  if (videoReady) return;
  if (!video.duration || !isFinite(video.duration)) return;
  videoReady = true;
  videoDur   = video.duration;
  const tEl = document.getElementById('timeDur');
  if (tEl) tEl.textContent = formatTime(videoDur);
}

function onSeeked(){
  seeking = false;
  if (pendingSeek != null) {
    const t = pendingSeek;
    pendingSeek = null;
    startSeek(t);
  }
}

function startSeek(t){
  if (!videoReady) return;
  const next = clamp(t, 0, Math.max(0, videoDur - 0.04));
  if (Math.abs(video.currentTime - next) < 1 / 36) return;
  if (seeking) {
    pendingSeek = next;
    return;
  }
  seeking = true;
  try { video.currentTime = next; } catch (e) { seeking = false; }
}

async function ensurePlay(){
  if (!video.paused || playLock) return;
  playLock = true;
  try { await video.play(); } catch (e) {}
  playLock = false;
}

function syncVideoToScroll(){
  if (!videoReady || videoDur <= 0) return;
  targetTime = scrollP * (videoDur - 0.04);
  const diff = targetTime - video.currentTime;

  if (diff > 0.05 && diff < 0.9 && !seeking) {
    video.playbackRate = clamp(0.45 + diff * 2.6, 0.4, 2.15);
    ensurePlay();
    return;
  }

  if (Math.abs(diff) <= 0.05) {
    if (!video.paused) video.pause();
    video.playbackRate = 1;
    return;
  }

  if (!video.paused) video.pause();
  video.playbackRate = 1;
  startSeek(targetTime);
}

video.addEventListener('loadeddata', setupVideo);
video.addEventListener('canplay',    setupVideo);
video.addEventListener('seeked',     onSeeked);
video.addEventListener('durationchange', () => {
  if (isFinite(video.duration) && video.duration > 0) {
    videoDur = video.duration;
    const tEl = document.getElementById('timeDur');
    if (tEl) tEl.textContent = formatTime(videoDur);
  }
});
video.load();

/* ----------------------------------------------------------
   Captions
---------------------------------------------------------- */
const caps = Array.from(document.querySelectorAll('.cap'));
const railTicks = Array.from(document.querySelectorAll('.stage__rail-track span'));

function activeCaption(p){
  const n = caps.length;
  return Math.min(n - 1, Math.max(0, Math.floor(p * n)));
}

function captionSide(p){
  return (activeCaption(p) % 2 === 0) ? -1 : 1;
}

function setCapVisible(i, vis){
  const el = caps[i];
  if (!el) return;
  const stacked = window.innerWidth < STACK_BP;
  const from = (i % 2 === 0) ? -1 : 1;
  const o = vis ? 1 : 0;
  const slide = (1 - o) * (stacked ? 48 : 32) * from;
  el.style.opacity = String(o);
  el.style.transform = stacked
    ? `translate3d(${slide}px, 0, 0)`
    : `translate3d(${slide}px, -50%, 0)`;
  el.style.pointerEvents = vis ? 'auto' : 'none';
}

let shownIdx = -1;
let swapTimer = 0;

function updateCaptions(p){
  const target = activeCaption(p);
  railTicks.forEach((t, i) => t.classList.toggle('is-on', i === target));

  if (shownIdx === -1) {
    caps.forEach((_, i) => setCapVisible(i, i === target));
    shownIdx = target;
    return;
  }

  if (target === shownIdx) return;

  clearTimeout(swapTimer);
  const next = target;
  caps.forEach((_, i) => setCapVisible(i, false));
  shownIdx = next;
  swapTimer = setTimeout(() => {
    setCapVisible(next, true);
  }, 170);
}

/* ----------------------------------------------------------
   Video slide (makes room for left / right captions)
---------------------------------------------------------- */
const motion = { x: 0, targetX: 0 };

function shiftAmount(){
  if (window.innerWidth < STACK_BP) return 0;
  return Math.round(Math.min(40, window.innerWidth * 0.026));
}

/* ----------------------------------------------------------
   Scroll
---------------------------------------------------------- */
function initScroll(){
  /* Stage stays put; details later slides over it.
     Extra scroll lives in .stage__pin-space so the video can scrub
     before the next section covers this one. */
  ScrollTrigger.create({
    trigger: '.stage',
    start:   'top top',
    endTrigger: '.details',
    end:     'top top',
    pin:     true,
    pinSpacing: false,
    scrub:   1.1,
    anticipatePin: 1,
    onUpdate(self){
      const h = window.innerHeight || 1;
      const p = clamp((self.scroll() - self.start) / (h * SCRUB_VH), 0, 1);
      scrollP = p;
      motion.targetX = reduceMotion ? 0 : -(captionSide(p)) * shiftAmount();
      updateCaptions(p);
      const tEl = document.getElementById('timeNow');
      if (tEl && videoDur) tEl.textContent = formatTime(p * videoDur);
    },
  });
}

let booted = false;
function bootstrap(){
  if (booted) return;
  booted = true;
  initScroll();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
  ScrollTrigger.refresh();
}
if (video.readyState >= 2) bootstrap();
video.addEventListener('loadeddata',     bootstrap, { once: true });
video.addEventListener('canplay',        bootstrap, { once: true });
video.addEventListener('durationchange', bootstrap, { once: true });
setTimeout(() => { if (!booted) bootstrap(); }, 800);

function tick(){
  syncVideoToScroll();
  const k = reduceMotion ? 1 : 0.08;
  motion.x += (motion.targetX - motion.x) * k;
  if (media) media.style.transform = `translate3d(${motion.x}px, 0, 0)`;
  requestAnimationFrame(tick);
}
tick();

function prime(){
  ensurePlay();
  window.removeEventListener('pointerdown', prime);
  window.removeEventListener('touchstart', prime);
  window.removeEventListener('keydown', prime);
}
window.addEventListener('pointerdown', prime, { once: true });
window.addEventListener('touchstart',  prime, { once: true });
window.addEventListener('keydown',     prime, { once: true });
window.addEventListener('resize', () => { ScrollTrigger.refresh(); });
