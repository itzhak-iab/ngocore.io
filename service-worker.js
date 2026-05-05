// One-shot self-destruct SW: clears all caches, unregisters itself, then exits.
// After this runs once, the browser has NO service worker — pure native behavior.
// Does NOT force-reload (which would break OAuth in-flight).
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const names = await caches.keys();
      await Promise.all(names.map(n => caches.delete(n)));
    } catch (e) {}
    try {
      await self.registration.unregister();
    } catch (e) {}
    try { await self.clients.claim(); } catch (e) {}
  })());
});

// Pass-through — never intercept. If page is loading via SW, just let browser handle it.
self.addEventListener('fetch', (event) => {
  // no-op
});
