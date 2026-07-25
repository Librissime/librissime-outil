// ═══════════════════════════════════════════════════
// PÉGASE — Service worker (notifications uniquement)
// AUCUN cache : index.html est toujours servi frais.
// ═══════════════════════════════════════════════════

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Réception d'une notification push
self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) {}

  const titre = data.titre || 'Pégase';
  const options = {
    body: data.corps || 'Nouveau message',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    tag: data.tag || 'pegase-message',
    renotify: true,
    data: { url: data.url || './index.html' }
  };

  event.waitUntil(self.registration.showNotification(titre, options));
});

// Clic sur la notification → ouvrir ou ramener Pégase au premier plan
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((liste) => {
      for (const client of liste) {
        if ('focus' in client) return client.focus();
      }
      return self.clients.openWindow(event.notification.data.url || './index.html');
    })
  );
});
