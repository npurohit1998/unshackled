const CACHE_NAME = 'unshackled-v1';
const ASSETS = ['./index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('./index.html')))
  );
});

// Daily check-in reminder (every 24h)
self.addEventListener('periodicsync', e => {
  if (e.tag === 'daily-checkin') {
    e.waitUntil(self.registration.showNotification('Unshackled', {
      body: "You're doing great! Check in to log your day 💪",
      icon: './icon-192.png',
      badge: './icon-192.png'
    }));
  }
});
