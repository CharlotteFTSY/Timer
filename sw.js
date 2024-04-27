// sw.js

const CACHE_NAME = 'offline-cache-v1';
const urlsToCache = [
  '/Timer/index.html',
  '/Timer/sw.js',
  '/Timer/',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()) // 跳过等待状态，立即激活新的 Service Worker
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
