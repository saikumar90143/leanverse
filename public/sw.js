/**
 * LeanVerse Service Worker — Minimal App Shell Cache
 * Caches the main Next.js pages for offline access.
 */

const CACHE_NAME = 'leanverse-v1';

const PRECACHE_URLS = [
  '/',
  '/workout-tracker',
  '/diet-planner',
  '/workout-planner',
  '/manifest.json',
];

// Install: cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use addAll with individual error handling so one failure doesn't break all
      return Promise.allSettled(
        PRECACHE_URLS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn(`[SW] Failed to cache ${url}:`, err);
          })
        )
      );
    })
  );
  // Activate immediately without waiting for old SW to finish
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: Network-first for HTML/navigation, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Skip Next.js internal routes and API routes
  if (
    request.url.includes('/_next/') ||
    request.url.includes('/api/') ||
    request.url.includes('/__nextjs')
  ) {
    // For Next.js static chunks: cache-first
    if (request.url.includes('/_next/static/')) {
      event.respondWith(
        caches.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((c) => c.put(request, clone));
            }
            return response;
          }).catch(() => new Response('Offline', { status: 503 }));
        })
      );
    }
    return;
  }

  // Navigation requests: network-first with cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((c) => c.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then(
            (cached) => cached || caches.match('/') || new Response('Offline', { status: 503 })
          );
        })
    );
    return;
  }
});
