/* sw.js — Prontapp
   Estrategias:
   - /_next/static  => Cache First
   - /_next/image   => Network First; si 503/504, intenta fetch directo al ?url=...
   - Navegación     => Network First con fallback /offline
   - Misma-origen   => Stale-While-Revalidate
   - Ignora cross-origin por defecto
*/

const CACHE_VERSION = 'v2';
const RUNTIME_CACHE = `prontapp-runtime-${CACHE_VERSION}`;
const STATIC_CACHE = `prontapp-static-${CACHE_VERSION}`;
const OFFLINE_URL = '/offline';

// Precarga mínimo viable (shell/offline)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(['/', OFFLINE_URL])).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.map((n) => {
          if (![STATIC_CACHE, RUNTIME_CACHE].includes(n)) return caches.delete(n);
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Utilidades
const isSameOrigin = (url) => url.origin === self.location.origin;
const isNextStatic = (url) => isSameOrigin(url) && url.pathname.startsWith('/_next/static/');
const isNextImage = (url) => isSameOrigin(url) && url.pathname.startsWith('/_next/image');
const isHTMLNavigation = (event) => event.request.mode === 'navigate';

// Cache First para assets estáticos de Next
async function handleNextStatic(event, url) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(event.request);
  if (cached) return cached;

  const resp = await fetch(event.request);
  if (resp.ok) {
    cache.put(event.request, resp.clone());
  }
  return resp;
}

// Network First para navegación con fallback offline
async function handleNavigation(event) {
  try {
    const resp = await fetch(event.request);
    // No cacheamos HTML aquí (depende de tus headers/ISR). Deja que Next controle.
    return resp;
  } catch (err) {
    const cache = await caches.open(STATIC_CACHE);
    const offline = await cache.match(OFFLINE_URL);
    return offline || new Response('Sin conexión', { status: 503 });
  }
}

// Network First para /_next/image con bypass si 503/504
async function handleNextImage(event, url) {
  // 1) Intenta red normal al optimizador
  try {
    const resp = await fetch(event.request);
    if (resp.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(event.request, resp.clone());
      return resp;
    }
    // Si el optimizador respondió 5xx, prueba fallback directo a la URL original
    if (resp.status === 503 || resp.status === 504) {
      const direct = await fetchOriginalFromImageOptimizer(url);
      if (direct) return direct;
      // Si no hay fallback, intenta cache previo
      const cached = await caches.match(event.request);
      if (cached) return cached;
    }
    return resp; // 4xx/otros casos: devuelve tal cual
  } catch (err) {
    // offline/error de red: intenta cache o fallback a origen directo
    const cached = await caches.match(event.request);
    if (cached) return cached;

    const direct = await fetchOriginalFromImageOptimizer(url);
    if (direct) return direct;

    return new Response('Imagen no disponible', { status: 503 });
  }
}

// Descarga directa a la URL original (?url=...) y cachea si es OK
async function fetchOriginalFromImageOptimizer(url) {
  const originalUrl = url.searchParams.get('url');
  if (!originalUrl) return null;

  try {
    const req = new Request(originalUrl, { mode: 'no-cors' }); // evita CORS duro; la respuesta puede ser opaque
    const resp = await fetch(req);

    // Si es OK (o opaque), entregamos y cacheamos bajo la clave del request original de /_next/image
    if (resp && (resp.ok || resp.type === 'opaque')) {
      const cache = await caches.open(RUNTIME_CACHE);
      // guardamos con una copia del body
      cache.put(new Request(url.toString(), { method: 'GET' }), resp.clone());
      return resp;
    }
  } catch (e) {
    // ignora
  }
  return null;
}

// Stale-While-Revalidate simplificado para misma-origen (no HTML, no _next/**
async function handleSameOriginGeneric(event) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(event.request);
  const network = fetch(event.request)
    .then((resp) => {
      if (resp && resp.ok) cache.put(event.request, resp.clone());
      return resp;
    })
    .catch(() => null);

  // Devuelve cache inmediatamente si existe; si no, espera red
  return cached || (await network) || new Response('Recurso no disponible', { status: 503 });
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Ignora cross-origin por defecto (deja que el navegador maneje CORS/CDN)
  if (!isSameOrigin(url)) return;

  // Rutas especiales
  if (isNextStatic(url)) {
    event.respondWith(handleNextStatic(event, url));
    return;
  }

  if (isNextImage(url)) {
    event.respondWith(handleNextImage(event, url));
    return;
  }

  if (isHTMLNavigation(event)) {
    event.respondWith(handleNavigation(event));
    return;
  }

  // Genérico para misma-origen (CSS/JS propios, API GET, etc.)
  event.respondWith(handleSameOriginGeneric(event));
});

// Push & notification click (tu código original, sin cambios relevantes)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  event.waitUntil((async () => {
    if (!self.Notification) return;
    const payload = (() => { try { return JSON.parse(event.data.text()); } catch { return null; } })();
    if (!payload) return;
    if (Notification.permission !== 'granted') return;

    const options = {
      body: payload.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-96x96.png',
      image: payload.image,
      tag: payload.tag || 'prontapp-notification',
      requireInteraction: true,
      renotify: true,
      vibrate: [100, 50, 100],
      data: { url: payload.data?.url || '/', type: payload.type || 'general', id: payload.id },
      actions: [
        { action: 'view', title: payload.primaryAction || 'Ver ahora', icon: '/icons/eye-96x96.png' },
        { action: 'close', title: 'Cerrar', icon: '/icons/close-96x96.png' }
      ]
    };

    try {
      await self.registration.showNotification(payload.title, options);
    } catch {
      await self.registration.showNotification(payload.title, { body: payload.body, icon: '/icons/icon-192x192.png' });
    }
  })());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'close') return;
  const urlToOpen = event.notification.data?.url || '/';
  event.waitUntil((async () => {
    const clientsArr = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of clientsArr) {
      if (c.url === urlToOpen && 'focus' in c) { await c.focus(); return; }
    }
    await clients.openWindow(urlToOpen);
  })());
});

// Log de carga
console.log('Service Worker cargado (', CACHE_VERSION, ')');
