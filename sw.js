/* Economía en las Noticias: funciona sin conexión.
   La página y los íconos se guardan al instalar; datos.json se pide primero a la red
   y, si no hay conexión, se usa la última copia guardada. */
const VERSION = 'enp-v21';
const BASE = ['./', 'index.html', 'manifest.webmanifest', 'iconos/icono-180.png', 'iconos/icono-192.png', 'iconos/icono-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(BASE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const same = url.origin === self.location.origin;
  const fonts = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!same && !fonts) return;

  // Datos y página: primero la red (para tener siempre lo último), si falla la copia guardada.
  if (same && (url.pathname.endsWith('datos.json') || url.pathname.endsWith('archivo.json') || req.mode === 'navigate' || url.pathname.endsWith('index.html'))) {
    e.respondWith(
      fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('index.html')))
    );
    return;
  }

  // Íconos y fuentes: la copia guardada y, de paso, se actualiza en segundo plano.
  e.respondWith(
    caches.match(req).then(cached => {
      const net = fetch(req).then(res => {
        if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => cached);
      return cached || net;
    })
  );
});
