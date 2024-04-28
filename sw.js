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
    fetch(event.request)
      .then(response => {
        // 检查是否成功获取到资源，如果成功则将资源添加到缓存中并返回给页面
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });

        return response;
      })
      .catch(() => {
        // 如果网络请求失败，则从缓存中返回匹配的资源
        return caches.match(event.request);
      })
  );
});

// 当新的 Service Worker 安装完成后，立即激活新的 Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});
