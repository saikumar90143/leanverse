self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const title = data.title || 'LeanVerse Notification';
    const options = {
      body: data.body || '',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      data: data.data || {},
      actions: data.actions || [],
      vibrate: [200, 100, 200]
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    console.error('Error parsing push data', err);
    event.waitUntil(
      self.registration.showNotification('LeanVerse', {
        body: event.data.text()
      })
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // If there's an action button clicked, we can check event.action
  let url = '/';
  if (event.action === 'explore') {
    url = '/dashboard';
  } else if (event.notification.data && event.notification.data.url) {
    url = event.notification.data.url;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
