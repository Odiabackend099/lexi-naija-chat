const CACHE_NAME = 'lexipay-ai-v1.0.0';
const STATIC_CACHE = 'lexipay-static-v1.0.0';
const DYNAMIC_CACHE = 'lexipay-dynamic-v1.0.0';

// Assets to cache for offline functionality
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/index.css',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/apple-touch-icon.png',
  'https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap',
  'https://fonts.gstatic.com/s/sora/v11/xMQOuFFYT2XODT7HrKQN.woff2',
  'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2'
];

// Nigerian-specific API endpoints to cache
const API_ENDPOINTS = [
  '/health',
  '/api/banks',
  '/api/rates'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('LexiPay AI Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('LexiPay AI: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('LexiPay AI Service Worker: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE) {
              console.log('LexiPay AI: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Fetch Strategy - Network First with Cache Fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip chrome-extension and other non-http requests  
  if (!request.url.startsWith('http')) return;
  
  // Handle different request types
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isAPIRequest(request)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigation(request));
  } else {
    event.respondWith(handleDynamicContent(request));
  }
});

// Check if request is for static asset
function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|woff2?|ttf|eot)$/) ||
         STATIC_ASSETS.includes(url.pathname);
}

// Check if request is for API
function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/') || 
         url.pathname.startsWith('/functions/') ||
         API_ENDPOINTS.includes(url.pathname);
}

// Check if request is navigation
function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

// Handle static assets - Cache First
async function handleStaticAsset(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Update cache in background for next time
      fetch(request).then((response) => {
        if (response.ok) {
          cache.put(request, response.clone());
        }
      }).catch(() => {}); // Silently fail background updates
      
      return cachedResponse;
    }
    
    // Not in cache, fetch and cache
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
    
  } catch (error) {
    console.log('LexiPay AI: Static asset fetch failed:', error);
    
    // Return offline fallback for images
    if (request.url.match(/\.(png|jpg|jpeg|svg|gif)$/)) {
      return new Response(`
        <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f0f0f0"/>
          <text x="50%" y="50%" text-anchor="middle" fill="#666">LexiPay AI</text>
        </svg>
      `, { headers: { 'Content-Type': 'image/svg+xml' } });
    }
    
    throw error;
  }
}

// Handle API requests - Network First with Nigerian optimization
async function handleAPIRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    // Optimized timeout for Nigerian networks (10 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(request, { 
      signal: controller.signal,
      // Add Nigerian-specific headers
      headers: {
        ...request.headers,
        'X-Country': 'NG',
        'X-Timezone': 'Africa/Lagos'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      // Cache successful API responses (except POST/PUT/DELETE)
      if (request.method === 'GET') {
        cache.put(request, response.clone());
      }
    }
    
    return response;
    
  } catch (error) {
    console.log('LexiPay AI: API request failed, trying cache:', error);
    
    // Try cache fallback
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      // Add offline indicator header
      const headers = new Headers(cachedResponse.headers);
      headers.set('X-Served-From', 'cache');
      headers.set('X-Offline', 'true');
      
      return new Response(cachedResponse.body, {
        status: cachedResponse.status,
        statusText: cachedResponse.statusText,
        headers
      });
    }
    
    // Return Nigerian-friendly offline response
    return new Response(JSON.stringify({
      error: 'No internet connection',
      message: 'Please check your network connection and try again',
      offline: true,
      support: 'Contact us on WhatsApp: +234 810 578 6326'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle navigation - Network First with App Shell fallback
async function handleNavigation(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
    
  } catch (error) {
    console.log('LexiPay AI: Navigation failed, serving app shell');
    
    // Serve cached app shell
    const cache = await caches.open(STATIC_CACHE);
    return await cache.match('/') || 
           await cache.match('/index.html') ||
           createOfflinePage();
  }
}

// Handle dynamic content
async function handleDynamicContent(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
    
  } catch (error) {
    const cachedResponse = await cache.match(request);
    return cachedResponse || createOfflinePage();
  }
}

// Create offline page
function createOfflinePage() {
  const offlineHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Offline - LexiPay AI</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          background: linear-gradient(135deg, #0A0A0A, #002F6C);
          color: white;
          margin: 0;
          padding: 20px;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .container {
          max-width: 400px;
          padding: 40px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.2);
        }
        h1 { margin: 0 0 20px; }
        .whatsapp-btn {
          background: #25D366;
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>You're Offline</h1>
        <p>LexiPay AI needs an internet connection to work properly.</p>
        <p>Please check your network and try again.</p>
        <a href="https://wa.me/2348105786326?text=Hi%2C%20I%27m%20having%20connection%20issues%20with%20LexiPay%20AI" 
           class="whatsapp-btn">
          Contact Support on WhatsApp
        </a>
        <p style="margin-top: 20px; font-size: 14px; opacity: 0.8;">
          <strong>LexiPay AI</strong><br>
          Powered by ODIA.Dev
        </p>
      </div>
    </body>
    </html>
  `;
  
  return new Response(offlineHTML, {
    headers: { 'Content-Type': 'text/html' }
  });
}

// Background sync for WhatsApp messages
self.addEventListener('sync', (event) => {
  if (event.tag === 'whatsapp-message') {
    event.waitUntil(syncWhatsAppMessages());
  }
});

async function syncWhatsAppMessages() {
  try {
    // Get queued messages from IndexedDB
    const messages = await getQueuedMessages();
    
    for (const message of messages) {
      try {
        await fetch('/api/whatsapp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(message)
        });
        
        // Remove from queue on success
        await removeQueuedMessage(message.id);
        
      } catch (error) {
        console.log('Failed to sync message:', message.id);
      }
    }
  } catch (error) {
    console.log('Background sync failed:', error);
  }
}

// Push notification handler
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'New update from LexiPay AI',
    icon: '/android-chrome-192x192.png',
    badge: '/android-chrome-192x192.png',
    vibrate: [200, 100, 200],
    tag: 'lexipay-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'open-whatsapp',
        title: 'Open WhatsApp',
        icon: '/whatsapp-icon.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('LexiPay AI', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open-whatsapp') {
    event.waitUntil(
      clients.openWindow('https://wa.me/2348105786326')
    );
  } else if (!event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper functions for IndexedDB
async function getQueuedMessages() {
  // Simplified - in production, use IndexedDB
  return [];
}

async function removeQueuedMessage(id) {
  // Simplified - in production, use IndexedDB
  return true;
}