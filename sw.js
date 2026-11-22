/* ==========================================================================
   NihongoPrep Service Worker — Offline-First PWA Asset Cache
   ========================================================================== */
const CACHE_NAME = 'nihongoprep-n5-v2';

const CORE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './js/data/vocab.js',
  './js/data/grammar.js',
  './js/data/kanji.js',
  './js/data/listening.js',
  './js/data/exam.js',
  './js/store.js',
  './js/audio.js',
  './js/components/dashboard.js',
  './js/components/vocabView.js',
  './js/components/grammarView.js',
  './js/components/kanjiView.js',
  './js/components/listeningView.js',
  './js/components/drillView.js',
  './js/components/examView.js',
  './js/app.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Only handle same-origin app assets with cache-first + background refresh
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        const fetchPromise = fetch(event.request)
          .then(networkRes => {
            if (networkRes && networkRes.status === 200) {
              const copy = networkRes.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
            }
            return networkRes;
          })
          .catch(() => cached);

        return cached || fetchPromise;
      })
    );
  }
});
