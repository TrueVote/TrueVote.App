// public/service-worker.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('true-vote-cache').then((cache) => {
      return cache.addAll(['/static/TrueVote_Logo.svg', '/index.html']); // Add your other app resources here
    }),
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});
