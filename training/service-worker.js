const CACHE_NAME = 'sto-v3-cache-1';
const urlsToCache = [
  '/training/',
  '/training/index.html',
  '/training/style.css',
  '/training/app.js',
  '/training/manifest.webmanifest',
  '/training/icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});