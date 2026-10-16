/* Mecha Protocol service worker (Round 19). Cache-first offline play.
   Bump CACHE on every deploy so updates reach players. */
'use strict';

const CACHE = 'mecha-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/data.js',
  './js/mech.js',
  './js/grid.js',
  './js/ai.js',
  './js/sfx.js',
  './js/music.js',
  './js/tutorial.js',
  './js/perf.js',
  './js/i18n.js',
  './js/telemetry.js',
  './js/hangar.js',
  './js/game.js',
  './js/rng.js',
  './js/barks.js',
  './js/ai-dialogue.js',
  './js/save.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request)));
});
