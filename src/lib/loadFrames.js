const CACHE_NAME = 'nazeline-luna-frames-v2';

export function frameUrl(manifest, index) {
  const n = String(index).padStart(manifest.pad, '0');
  return `${manifest.dir}/${manifest.prefix}${n}.${manifest.ext}`;
}

async function openCache() {
  try {
    return await caches.open(CACHE_NAME);
  } catch {
    return null;
  }
}

async function blobFromCache(cache, url) {
  if (!cache) return null;
  try {
    const hit = await cache.match(url);
    return hit ? await hit.blob() : null;
  } catch {
    return null;
  }
}

async function fetchAndCache(cache, url, signal) {
  const res = await fetch(url, { cache: 'force-cache', signal });
  if (!res.ok) throw new Error(`Failed to fetch ${url} (${res.status})`);
  if (cache) {
    try {
      await cache.put(url, res.clone());
    } catch {
      /* private mode / quota */
    }
  }
  return res.blob();
}

async function toBitmap(blob) {
  if (typeof createImageBitmap === 'function') {
    return createImageBitmap(blob);
  }
  const obj = URL.createObjectURL(blob);
  const img = new Image();
  img.decoding = 'async';
  img.src = obj;
  await img.decode();
  URL.revokeObjectURL(obj);
  return img;
}

/**
 * Load the scroll sequence from index 0 upward so early frames can paint
 * immediately. A small number of requests stay in flight; each completed
 * file is stored in Cache Storage for later visits.
 */
export async function loadFramesSequential(manifest, { onFrame, signal, concurrency = 6 } = {}) {
  const frames = new Array(manifest.count);
  const cache = await openCache();
  let cursor = 0;

  async function loadOne(i) {
    const url = frameUrl(manifest, i);
    let blob = await blobFromCache(cache, url);
    if (!blob) blob = await fetchAndCache(cache, url, signal);
    const bitmap = await toBitmap(blob);
    frames[i] = bitmap;
    onFrame?.(i, bitmap, frames);
  }

  async function worker() {
    while (cursor < manifest.count) {
      if (signal?.aborted) return;
      const i = cursor++;
      try {
        await loadOne(i);
      } catch (err) {
        if (signal?.aborted) return;
        console.warn(err);
      }
    }
  }

  const n = Math.min(Math.max(1, concurrency), manifest.count);
  await Promise.all(Array.from({ length: n }, () => worker()));
  return frames;
}
