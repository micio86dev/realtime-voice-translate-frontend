declare const self: ServiceWorkerGlobalScope;

import { setupServiceWorker } from '@builder.io/qwik-city/service-worker';

setupServiceWorker();

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open('my-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/main.js',
        '/styles.css',
      ]);
    })
  );
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  const cacheWhitelist = ['my-cache'];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
