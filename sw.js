/**
 * Service Worker - NAGOYA TRIP 2026
 * 
 * 策略：Network First (網路優先)
 * - 有網路時：從伺服器抓最新版本，同時更新快取
 * - 離線時：從快取中提供已下載的版本
 * 
 * 更新方式：修改 CACHE_VERSION 即可觸發所有使用者更新
 */

const CACHE_VERSION = 'nagoya-trip-v15';

const ASSETS_TO_CACHE = [
    '/nagoya-trip/',
    '/nagoya-trip/index.html',
    '/nagoya-trip/css/style.css',
    '/nagoya-trip/js/app.js',
    '/nagoya-trip/js/pages.js',
    '/nagoya-trip/js/schedule.js',
    '/nagoya-trip/js/map.js',
    '/nagoya-trip/js/notifications.js',
    '/nagoya-trip/js/drawer-tips.js',
    '/nagoya-trip/manifest.json',
    '/nagoya-trip/assets/icons/icon-192.png',
    '/nagoya-trip/assets/icons/icon-512.png',
    '/nagoya-trip/assets/icons/apple-touch-icon.png'
];

// 安裝事件：預先快取核心資源
self.addEventListener('install', (event) => {
    console.log('[SW] Installing version:', CACHE_VERSION);
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then((cache) => cache.addAll(ASSETS_TO_CACHE))
            .then(() => self.skipWaiting()) // 立即啟用，不等待舊版關閉
    );
});

// 啟用事件：清除所有舊版快取
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating version:', CACHE_VERSION);
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_VERSION)
                    .map((name) => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        }).then(() => self.clients.claim()) // 立即接管所有頁面
    );
});

// 攔截請求：Network First 策略
self.addEventListener('fetch', (event) => {
    const request = event.request;

    // 只處理 GET 請求
    if (request.method !== 'GET') return;

    // 忽略外部 API 請求 (Google Maps, Fonts, Lucide CDN 等)
    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    event.respondWith(
        fetch(request)
            .then((networkResponse) => {
                // 網路成功：更新快取並回傳最新版本
                if (networkResponse && networkResponse.status === 200) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_VERSION).then((cache) => {
                        cache.put(request, responseToCache);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // 網路失敗（離線）：從快取中回傳
                return caches.match(request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // 如果快取中也沒有，回傳離線頁面或空回應
                    if (request.destination === 'document') {
                        return caches.match('/nagoya-trip/index.html');
                    }
                    return new Response('', { status: 408, statusText: 'Offline' });
                });
            })
    );
});
