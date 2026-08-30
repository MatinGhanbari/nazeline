import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { loadFramesSequential } from '../lib/loadFrames.js';

gsap.registerPlugin(ScrollTrigger);

const STACK_BP = 840;
const SCRUB_VH = 5;
const LERP = 0.16;
const LERP_CATCHUP = 0.28;

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function faNum(n) {
  return n.toString().replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d]);
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const r = Math.max(0, Math.round(s - m * 60));
  return (m < 10 ? '۰' : '') + faNum(m) + ':' + (r < 10 ? '۰' : '') + faNum(r);
}

function nearestFrame(frames, idx) {
  if (!frames?.length) return null;
  if (frames[idx]) return { img: frames[idx], i: idx };
  for (let d = 1; d < frames.length; d++) {
    if (idx - d >= 0 && frames[idx - d]) return { img: frames[idx - d], i: idx - d };
    if (idx + d < frames.length && frames[idx + d]) return { img: frames[idx + d], i: idx + d };
  }
  return null;
}

/**
 * Pin the stage and scrub a cached WebP sequence instead of a video.
 * Display progress is lerped so up/down scrolling stays even.
 */
export function useStage(refs) {
  useEffect(() => {
    const canvas = refs.canvas.current;
    const media = refs.media.current;
    const timeNow = refs.timeNow.current;
    const timeDur = refs.timeDur.current;
    const stage = refs.stage.current;
    const details = refs.details.current;
    if (!canvas || !media || !stage || !details) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const caps = Array.from(stage.querySelectorAll('.cap'));
    const railTicks = Array.from(stage.querySelectorAll('.stage__rail-track span'));
    const loadBar = stage.querySelector('.stage__load');

    let manifest = null;
    let frames = [];
    let scrollP = 0;
    let displayP = 0;
    let shownIdx = -1;
    let swapTimer = 0;
    let booted = false;
    let rafId = 0;
    let drawnIdx = -1;
    let dirty = true;
    const motion = { x: 0, targetX: 0 };
    const ac = new AbortController();

    function paint(img) {
      if (canvas.width !== img.width || canvas.height !== img.height) {
        canvas.width = img.width;
        canvas.height = img.height;
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.classList.add('is-on');
    }

    function setLoad(p, done) {
      if (!loadBar) return;
      loadBar.style.setProperty('--p', String(clamp(p, 0, 1)));
      loadBar.classList.toggle('is-done', !!done);
    }

    function activeCaption(p) {
      const n = caps.length;
      return Math.min(n - 1, Math.max(0, Math.floor(p * n)));
    }

    function captionSide(p) {
      return activeCaption(p) % 2 === 0 ? -1 : 1;
    }

    function setCapVisible(i, vis) {
      const el = caps[i];
      if (!el) return;
      const stacked = window.innerWidth < STACK_BP;
      const from = i % 2 === 0 ? -1 : 1;
      const o = vis ? 1 : 0;
      const slide = (1 - o) * (stacked ? 48 : 32) * from;
      el.style.opacity = String(o);
      el.style.transform = stacked
        ? `translate3d(${slide}px, 0, 0)`
        : `translate3d(${slide}px, -50%, 0)`;
      el.style.pointerEvents = vis ? 'auto' : 'none';
    }

    function updateCaptions(p) {
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
      swapTimer = window.setTimeout(() => {
        setCapVisible(next, true);
      }, 170);
    }

    function shiftAmount() {
      if (window.innerWidth < STACK_BP) return 0;
      return Math.round(Math.min(40, window.innerWidth * 0.026));
    }

    function initScroll() {
      ScrollTrigger.create({
        trigger: stage,
        start: 'top top',
        endTrigger: details,
        end: 'top top',
        pin: true,
        pinSpacing: false,
        scrub: 1,
        anticipatePin: 1,
        onUpdate(self) {
          const h = window.innerHeight || 1;
          const p = clamp((self.scroll() - self.start) / (h * SCRUB_VH), 0, 1);
          scrollP = p;
          motion.targetX = reduceMotion ? 0 : -captionSide(p) * shiftAmount();
          updateCaptions(p);
        },
      });
    }

    function bootstrap() {
      if (booted) return;
      booted = true;
      initScroll();
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
      ScrollTrigger.refresh();
    }

    bootstrap();

    (async () => {
      try {
        const res = await fetch('/assets/frames/manifest.json', { cache: 'force-cache' });
        if (!res.ok) throw new Error('sequence manifest missing');
        manifest = await res.json();
        if (timeDur) timeDur.textContent = formatTime(manifest.duration);
        canvas.width = manifest.width;
        canvas.height = manifest.height;
        let loaded = 0;
        await loadFramesSequential(manifest, {
          signal: ac.signal,
          onFrame(_i, _bitmap, all) {
            frames = all;
            dirty = true;
            loaded += 1;
            setLoad(loaded / manifest.count, loaded >= manifest.count);
          },
        });
        setLoad(1, true);
      } catch (err) {
        if (!ac.signal.aborted) console.warn(err);
      }
    })();

    function tick() {
      const gap = scrollP - displayP;
      const k = reduceMotion ? 1 : Math.abs(gap) > 0.16 ? LERP_CATCHUP : LERP;
      displayP += gap * k;
      if (Math.abs(scrollP - displayP) < 0.0004) displayP = scrollP;

      const n = Math.max(1, (manifest?.count || 1) - 1);
      const targetIdx = Math.round(clamp(displayP, 0, 1) * n);
      const hit = nearestFrame(frames, targetIdx);
      if (hit && (hit.i !== drawnIdx || dirty)) {
        paint(hit.img);
        drawnIdx = hit.i;
        dirty = false;
      }

      const mk = reduceMotion ? 1 : 0.08;
      motion.x += (motion.targetX - motion.x) * mk;
      media.style.transform = `translate3d(${motion.x}px, 0, 0)`;

      if (timeNow && manifest) {
        timeNow.textContent = formatTime(displayP * manifest.duration);
      }

      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);

    return () => {
      ac.abort();
      clearTimeout(swapTimer);
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      frames.forEach((img) => {
        if (img && typeof img.close === 'function') img.close();
      });
    };
  }, [refs]);
}
