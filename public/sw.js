// Nombre y versión de caché
const CACHE_NAME = 'prontapp-v1';

// Recursos básicos para cachear inicialmente
const urlsToCache = [
  '/',
  '/offline'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Iniciando instalación');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Instalación completada');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Error en la instalación:', error);
        throw error;
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activando');

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activado');
        return self.clients.claim();
      })
  );
});

// Fetch
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request)
          .then(response => {
            if (response) {
              return response;
            }
            if (event.request.mode === 'navigate') {
              return caches.match('/offline');
            }
            return new Response('Recurso no encontrado', { status: 404 });
          });
      })
  );
});

// Actualizar el evento push en sw.js
self.addEventListener('push', (event) => {
  console.log('Push event recibido:', event);

  if (!event.data) {
    console.log('No hay datos en el evento push');
    return;
  }

  event.waitUntil(
    (async () => {
      try {
        // Verificar si las notificaciones están soportadas
        if (!self.Notification) {
          console.log('Notificaciones no soportadas en este contexto');
          return;
        }

        const data = event.data.text();
        console.log('Datos recibidos:', data);
        
        const payload = JSON.parse(data);
        console.log('Payload parseado:', payload);

        // Verificar el permiso de notificaciones
        if (Notification.permission !== 'granted') {
          console.log('Permiso de notificaciones no otorgado');
          return;
        }

        const notificationOptions = {
          body: payload.body,
          icon: '/icons/icon-192x192.png', // Ícono principal
          badge: '/icons/icon-96x96.png', // Ícono pequeño para la barra de notificaciones
          image: payload.image, // Imagen grande en la notificación (opcional)
          tag: payload.tag || 'prontapp-notification',
          requireInteraction: true,
          renotify: true,
          vibrate: [100, 50, 100],
          silent: false,
          timestamp: Date.now(),
          data: {
            url: payload.data?.url || '/',
            type: payload.type || 'general',
            id: payload.id
          },
          actions: [
            {
              action: 'view',
              title: payload.primaryAction || 'Ver ahora',
              icon: '/icons/eye-96x96.png'
            },
            {
              action: 'close',
              title: 'Cerrar',
              icon: '/icons/close-96x96.png'
            }
          ]
        };

        // Usar try/catch específico para mostrar la notificación
        try {
          await self.registration.showNotification(payload.title, notificationOptions);
          console.log('Notificación mostrada exitosamente');
        } catch (notificationError) {
          console.error('Error específico al mostrar la notificación:', notificationError);
          
          // Intentar una notificación más simple si la primera falla
          await self.registration.showNotification(payload.title, {
            body: payload.body,
            icon: '/icons/icon-192x192.png'
          });
        }

      } catch (error) {
        console.error('Error al procesar la notificación:', error);
      }
    })()
  );
});

// Click en notificación
self.addEventListener('notificationclick', (event) => {
  console.log('Notificación clickeada:', event);

  event.notification.close();

  if (event.action === 'close') return;

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    (async () => {
      const windowClients = await clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      });

      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          await client.focus();
          return;
        }
      }

      await clients.openWindow(urlToOpen);
    })()
  );
});
// Log inicial para confirmar carga
console.log('Service Worker: Archivo cargado');