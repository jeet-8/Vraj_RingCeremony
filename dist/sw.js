/**
 * Service Worker with Versioned Cache & Auto-Claim
 * Ensures users always receive the freshest build without stale cache lockups.
 */

const BUILD_VERSION = 'vraj-ceremony-v20261122_1200';
const CACHE_NAME = `vraj-cache-${BUILD_VERSION}`;

// 1. Immediately activate upon installation
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// 2. Take immediate control and purge all obsolete caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => {
            console.log(`[SW] Deleting obsolete cache: ${key}`);
            return caches.delete(key);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch strategy: Network-first for navigation (HTML), Stale-while-revalidate for hashed assets
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Network-first for HTML pages so user always receives newest deploy
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Network-first for streaming audio / mp3
  if (request.destination === 'audio' || url.pathname.endsWith('.mp3')) {
    event.respondWith(fetch(request).catch(() => caches.match(request)));
    return;
  }

  // Stale-while-revalidate for static hashed JS/CSS/images
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
