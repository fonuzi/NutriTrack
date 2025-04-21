// Service Worker for GymTrack PWA
const CACHE_NAME = 'gymtrack-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/index-CDYTKG2v.css',
  '/assets/index-D-zwYXQO.js'
];

// Install service worker and cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return the cached response if found
        if (response) {
          return response;
        }
        
        // Clone the request because it's a one-time use
        const fetchRequest = event.request.clone();
        
        // For API calls, just fetch from network without caching
        if (fetchRequest.url.includes('/api/')) {
          return fetch(fetchRequest);
        }
        
        // For non-API resources, try to fetch and cache
        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response because it's a one-time use
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          }
        );
      })
      .catch(() => {
        // Fallback for image requests
        if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
          return caches.match('/icons/icon-512x512.png');
        }
        
        // Fallback for other requests
        return caches.match('/');
      })
  );
});

// Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});