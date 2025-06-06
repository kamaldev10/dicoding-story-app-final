import { precacheAndRoute, cleanupOutdatedCaches, matchPrecache } from 'workbox-precaching';
import { registerRoute, setCatchHandler } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Ganti dengan URL basis API Anda
const { BASE_URL } = '/src/scripts/config.js';

// 1. Precache App Shell (otomatis dari manifest Webpack)
precacheAndRoute(self.__WB_MANIFEST || []);

// 2. Bersihkan cache lama
cleanupOutdatedCaches();

// 3. Strategi caching untuk berbagai jenis aset
// Halaman HTML (Navigasi)
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new StaleWhileRevalidate({ cacheName: 'html-cache' }),
);

// Aset statis (CSS, JS)
registerRoute(
  ({ request }) => request.destination === 'style' || request.destination === 'script',
  new StaleWhileRevalidate({ cacheName: 'static-resources-cache' }),
);

// Gambar
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 }), // 30 hari
    ],
  }),
);

// Data dari API
registerRoute(
  ({ url }) => url.href.startsWith(`${BASE_URL}/stories`),
  new NetworkFirst({
    cacheName: 'api-data-cache',
    plugins: [
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 }), // 1 hari
    ],
  }),
);

// 4. Offline Fallback Handler
setCatchHandler(async ({ request }) => {
  if (request.destination === 'navigate') {
    return matchPrecache('offline.html'); // Pastikan 'offline.html' ada di build output Anda
  }
  if (request.destination === 'image') {
    // Ganti dengan path ke placeholder image Anda
    return matchPrecache('/images/placeholder.svg');
  }
  return Response.error();
});

// 5. Event listener untuk Push Notification (sudah benar)
self.addEventListener('push', function (event) {
  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    data = {
      title: 'Notifikasi',
      options: {
        body: 'Ada notifikasi baru.',
      },
    };
  }

  const title = data.title || 'Notifikasi';
  const options = data.options || {
    body: 'Ada notifikasi baru.',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
