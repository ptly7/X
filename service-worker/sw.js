// Service Worker for Patel Productivity Suite
const CACHE_NAME = 'patel-productivity-suite-v1';

// Files to cache
const filesToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/light-mode.css',
  '/css/dark-mode.css',
  '/js/app.js',
  '/js/db.js',
  '/js/utils.js',
  '/js/ui.js',
  '/js/ai.js',
  '/js/ai-integration.js',
  '/manifest.json',
  '/assets/logo.svg',
  '/assets/patelbot-avatar.svg',
  '/modules/task-manager/index.js',
  '/modules/calendar/index.js',
  '/modules/notes/index.js',
  '/modules/finance/index.js',
  '/modules/habits/index.js',
  '/modules/focus/index.js',
  '/modules/research/index.js',
  '/modules/networking/index.js',
  '/modules/file-manager/index.js',
  '/modules/health/index.js',
  '/modules/patelbot/index.js',
  '/assets/icons/icon-72x72.png',
  '/assets/icons/icon-96x96.png',
  '/assets/icons/icon-128x128.png',
  '/assets/icons/icon-144x144.png',
  '/assets/icons/icon-152x152.png',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-384x384.png',
  '/assets/icons/icon-512x512.png'
];

// Install event - cache files
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing Service Worker...');
  
  // Skip waiting to ensure the new service worker activates immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching app shell and content');
        return cache.addAll(filesToCache);
      })
      .catch(error => {
        console.error('[Service Worker] Error during cache.addAll():', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating Service Worker...');
  
  // Claim clients to ensure the service worker controls all clients immediately
  self.clients.claim();
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Handle API requests differently (don't cache)
  if (event.request.url.includes('/api/')) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // For all other requests, try cache first, then network
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response from cache
        if (response) {
          return response;
        }
        
        // Clone the request because it's a one-time use stream
        const fetchRequest = event.request.clone();
        
        // Make network request
        return fetch(fetchRequest)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response because it's a one-time use stream
            const responseToCache = response.clone();
            
            // Add the new file to cache
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(error => {
            console.error('[Service Worker] Fetch failed:', error);
            
            // For HTML requests, return the offline page
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/index.html');
            }
            
            // For other requests, just return the error
            throw error;
          });
      })
  );
});

// Handle background sync for offline data
self.addEventListener('sync', event => {
  console.log('[Service Worker] Background Sync event:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

// Function to sync data when online
async function syncData() {
  try {
    // In a real app, this would sync data with a server
    // For this offline-only app, we'll just log the sync attempt
    console.log('[Service Worker] Syncing data...');
    
    // Notify all clients that sync is complete
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        timestamp: new Date().toISOString()
      });
    });
    
    return true;
  } catch (error) {
    console.error('[Service Worker] Sync failed:', error);
    return false;
  }
}

// Handle push notifications
self.addEventListener('push', event => {
  console.log('[Service Worker] Push received:', event);
  
  let title = 'Patel Productivity Suite';
  let options = {
    body: 'Something requires your attention.',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/icon-72x72.png'
  };
  
  // Try to parse the data from the push event
  if (event.data) {
    try {
      const data = event.data.json();
      title = data.title || title;
      options.body = data.body || options.body;
      options.tag = data.tag;
      options.data = data;
    } catch (error) {
      console.error('[Service Worker] Error parsing push data:', error);
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notification click:', event);
  
  event.notification.close();
  
  // Get notification data
  const data = event.notification.data;
  
  // Default URL to open
  let url = '/';
  
  // If we have data with a specific URL, use that
  if (data && data.url) {
    url = data.url;
  }
  
  // Open or focus the app
  event.waitUntil(
    clients.matchAll({
      type: 'window'
    }).then(windowClients => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If no window/tab is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Log service worker lifecycle events
self.addEventListener('message', event => {
  console.log('[Service Worker] Message received:', event.data);
  
  // Handle specific messages
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[Service Worker] Service Worker registered');
