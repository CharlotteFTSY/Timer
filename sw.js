const CACHE_NAME = 'offline-cache-v2';
const urlsToCache = [
  '/Timer/index.html',
  '/Timer/sw.js',
  '/Timer/',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => cacheName.startsWith('offline-cache-') && cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    })
    .then(() => {
      // Claim clients to ensure that updates are applied immediately
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.match(event.request)
          .then(response => {
            const fetchPromise = fetch(event.request)
              .then(networkResponse => {
                if (networkResponse.status === 200) {
                  cache.put(event.request, networkResponse.clone());
                }
                return networkResponse;
              })
              .catch(() => {
                // Handle fetch errors
              });

            return response || fetchPromise;
          });
      })
  );
});
