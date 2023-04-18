const cacheNamespace = 'Dongrami';
const cacheVersion = 'v1';
const cacheName = `${cacheNamespace}-${cacheVersion}`;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(cacheName));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key === cacheName) {
            return;
          }
          return caches.delete(key);
        })
      );
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    (async () => {
      const cache = await caches.open(cacheName);
      const response = await cache.match(e.request);

      if (response) {
        return response;
      }

      const webResponse = await fetch(e.request);
      cache.add(e.request, webResponse.clone());

      console.log(`[Service Worker] Cached ${e.request.url}`);

      return webResponse;
    })()
  );
});
