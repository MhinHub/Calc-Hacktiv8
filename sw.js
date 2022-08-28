const cacheName = 'calc-v1';
const staticAssets = [
  './',
  './index.html',
  './style.css',
  './index.js',
  './storage.js',
];

self.addEventListener('install', async e => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  return self.skipWaiting();
});

self.addEventListener('activate', e => {
  self.clients.claim();
});


self.addEventListener('fetch', async e => {
  const req = e.request;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    e.respondWith(cacheFirst(req));
    // e.respondWith(networkFirst(req));
  } else {
    e.respondWith(networkAndCache(req));
  }
});

async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  return cached || fetch(req);
}

async function networkAndCache(req) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    await cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await cache.match(req);
    return cached;
  }
}

async function networkFirst(req) {
  // Check if this is a navigation request
  if (req.request.mode === 'navigate') {
    // Open the cache
    req.respondWith(caches.open(cacheName).then((cache) => {
      // Go to the network first
      return fetch(req.request.url).then((fetchedResponse) => {
        cache.put(req.request, fetchedResponse.clone());

        return fetchedResponse;
      }).catch(() => {
        // If the network is unavailable, get
        return cache.match(req.request.url);
      });
    }));
  } else {
    return;
  }
}

