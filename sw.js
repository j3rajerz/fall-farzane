/**
 * FAL FARZANEH — sw.js
 * سرویس‌ورکر سبک برای کارکرد آفلاین پوستهٔ برنامه (بخش ۵۳ سند).
 * از مسیرهای نسبی استفاده می‌کند تا با GitHub Pages در هر زیرمسیر سازگار باشد.
 */

const CACHE_NAME = "falfarzaneh-cache-v3";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  "./css/cosmic.css",
  "./css/cards.css",
  "./css/animations.css",
  "./css/responsive.css",
  "./css/kabbalah.css",
  "./data/cards.js",
  "./data/kabbalah-data.js",
  "./js/jalali-date.js",
  "./js/tarot-engine.js",
  "./js/personalization-engine.js",
  "./js/storage.js",
  "./js/readings.js",
  "./js/kabbalah.js",
  "./js/ui.js",
  "./js/app.js",
  "./assets/backgrounds/tarot-reader.webp"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .catch(() => { /* نصب نباید در صورت خطای شبکه متوقف شود */ })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          event.waitUntil(
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy))
          );
          return response;
        })
        .catch(() => cached);
    })
  );
});
