/**
 * Service Worker - キャッシュ戦略とオフライン対応
 */

const CACHE_NAME = 'portfolio-v1.0.0';
const DYNAMIC_CACHE_NAME = 'portfolio-dynamic-v1.0.0';

// キャッシュするリソース（Critical Path）
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/responsive.css',
  '/css/animations.css',
  '/css/critical.css',
  '/js/main.js',
  '/js/modules/navigation.js',
  '/js/modules/lazyload.js',
  '/js/modules/scroll.js',
  '/js/modules/projects.js',
  '/js/modules/skills.js',
  '/js/modules/form.js',
  '/js/modules/animations.js',
  '/js/modules/footer.js',
  '/data/projects.json',
  '/data/skills.json'
];

// 画像などの動的リソース用のキャッシュパターン
const CACHE_PATTERNS = {
  images: /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i,
  fonts: /\.(woff|woff2|ttf|otf|eot)$/i,
  api: /\/api\//,
  external: /^https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com)/
};

/**
 * Service Worker インストール
 */
self.addEventListener('install', event => {
  console.log('SW: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('SW: Installation complete');
        // 新しいSWをすぐにアクティブにする
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('SW: Installation failed', error);
      })
  );
});

/**
 * Service Worker アクティベーション
 */
self.addEventListener('activate', event => {
  console.log('SW: Activating...');
  
  event.waitUntil(
    Promise.all([
      // 古いキャッシュを削除
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('SW: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // 新しいSWをすべてのタブで即座に制御開始
      self.clients.claim()
    ]).then(() => {
      console.log('SW: Activation complete');
    })
  );
});

/**
 * フェッチイベント - キャッシュ戦略の実装
 */
self.addEventListener('fetch', event => {
  const { request } = event;
  const { url, method } = request;
  
  // GET リクエストのみ処理
  if (method !== 'GET') return;
  
  // キャッシュ戦略を選択
  if (STATIC_ASSETS.includes(new URL(url).pathname)) {
    // 静的リソース: Cache First
    event.respondWith(cacheFirst(request));
  } else if (CACHE_PATTERNS.images.test(url)) {
    // 画像: Cache First with Network Fallback
    event.respondWith(cacheFirstWithNetworkFallback(request));
  } else if (CACHE_PATTERNS.fonts.test(url) || CACHE_PATTERNS.external.test(url)) {
    // フォント・外部リソース: Cache First (長期キャッシュ)
    event.respondWith(cacheFirstLongTerm(request));
  } else if (url.includes('/api/') || url.includes('.json')) {
    // API・データ: Network First
    event.respondWith(networkFirst(request));
  } else {
    // その他: Stale While Revalidate
    event.respondWith(staleWhileRevalidate(request));
  }
});

/**
 * Cache First 戦略
 */
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('SW: Cache First failed', error);
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

/**
 * Cache First with Network Fallback 戦略
 */
async function cacheFirstWithNetworkFallback(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      
      // 動的キャッシュのサイズ制限（最大50MB）
      await trimCache(DYNAMIC_CACHE_NAME, 50);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // フォールバック画像を返す
    return caches.match('/assets/images/fallback.svg') || 
           new Response('Image not available', { status: 404 });
  }
}

/**
 * Cache First Long Term 戦略（フォント用）
 */
async function cacheFirstLongTerm(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response('Resource not available', { status: 404 });
  }
}

/**
 * Network First 戦略
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('Data not available', { status: 503 });
  }
}

/**
 * Stale While Revalidate 戦略
 */
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const networkFetch = fetch(request).then(response => {
    if (response.ok) {
      const cache = caches.open(DYNAMIC_CACHE_NAME);
      cache.then(c => c.put(request, response.clone()));
    }
    return response;
  }).catch(() => null);
  
  return cachedResponse || networkFetch || 
         new Response('Content not available', { status: 404 });
}

/**
 * キャッシュサイズ制限
 */
async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxItems) {
    // 古いキャッシュから削除（FIFO）
    const deletePromises = keys
      .slice(0, keys.length - maxItems)
      .map(key => cache.delete(key));
    
    await Promise.all(deletePromises);
  }
}

/**
 * バックグラウンド同期（将来的な拡張用）
 */
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('SW: Background sync triggered');
    event.waitUntil(
      // バックグラウンドタスクを実行
      doBackgroundSync()
    );
  }
});

/**
 * プッシュ通知（将来的な拡張用）
 */
self.addEventListener('push', event => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/assets/images/icon-192.png',
      badge: '/assets/images/badge-72.png',
      actions: [
        {
          action: 'open',
          title: 'View Portfolio'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification('Portfolio Update', options)
    );
  }
});

/**
 * 通知クリック処理
 */
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

/**
 * バックグラウンド同期処理
 */
async function doBackgroundSync() {
  try {
    // フォーム送信データの同期など
    console.log('SW: Background sync completed');
  } catch (error) {
    console.error('SW: Background sync failed', error);
    throw error;
  }
}