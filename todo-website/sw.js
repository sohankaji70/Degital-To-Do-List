self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('todo-cache').then(cache => {
            return cache.addAll([
                './',
                './index.html',
                './style.css',
                './script.js',
                './tick.mp3'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
