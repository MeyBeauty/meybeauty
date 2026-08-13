// Service Worker pour Mey Beauty - Cache et Performance
const CACHE_NAME = 'meybeauty-v2-zoom';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.png',
  '/apple-touch-icon.png'
];

// Installation: Mise en cache des assets statiques
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activation: Nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch: Stratégie Cache-First pour les assets, Network-First pour l'API
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ne pas intercepter les requêtes non GET
  if (request.method !== 'GET') {
    return;
  }

  // Stratégie Cache-First pour les assets statiques (JS, CSS, images)
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2)$/)) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(request).then((fetchResponse) => {
          // Ne pas mettre en cache les réponses d'erreur
          if (!fetchResponse || fetchResponse.status !== 200) {
            return fetchResponse;
          }
          const responseToCache = fetchResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return fetchResponse;
        });
      })
    );
    return;
  }

  // Stratégie Network-First pour les requêtes API (Firestore)
  if (url.hostname.includes('googleapis.com') || url.hostname.includes('firebase')) {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request);
      })
    );
    return;
  }

  // Default: Network avec fallback sur cache
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});
