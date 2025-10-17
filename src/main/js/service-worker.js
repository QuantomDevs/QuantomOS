const CACHE_NAME = 'quantom-cloud-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/index.css',
    '/js/index.js',
    '/config/manifest.json',
    '/images/favicon/favicon.ico',
    '/images/favicon/favicon.png',
    '/images/favicon/favicon-32x32.png',
    '/images/favicon/favicon-512x512.png',
    '/images/favicon/favicon-nobackground.png',
    '/wallpaper.jpeg',
    '/images/dock/dock-home.png',
    '/images/dock/dock-app-store.png',
    '/images/dock/dock-settings.png',
    '/images/dock/dock-files.png',
    // Fügen Sie hier weitere statische Assets hinzu, die gecacht werden sollen
    // Zum Beispiel:
    // '/icons/apps/app-icon-placeholder.svg',
    // '/icons/apps/books.svg',
    // ... und alle anderen Icons und Wallpaper-Bilder, die Sie cachen möchten
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then(async (response) => {
                // Wenn die Anfrage erfolgreich war, klone die Antwort und speichere sie im Cache
                const cache = await caches.open(CACHE_NAME);
                cache.put(event.request, response.clone());
                return response;
            })
            .catch(() => {
                // Wenn das Netzwerk fehlschlägt, versuche, die Ressource aus dem Cache zu holen
                return caches.match(event.request);
            })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
