// sw.js

const CACHE_NAME = 'offline-cache-v1';
const urlsToCache = [
  '/Timer/',
  '/Timer/index.html',
  '/Timer/sw.js',
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
      .then(response => response || fetch(event.request))
  );
});
