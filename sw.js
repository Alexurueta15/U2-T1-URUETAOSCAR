console.log("SW: hola desde sw");
const CACHE_STATIC_NAME = 'static-cache';
const CACHE_DYNAMIC_NAME = 'dynamic-cache';
const CACHE_INMUTABLE_NAME = 'inmutable-cache';


function cleanCache(cacheName, sizeItems) {
    caches.open(cacheName)
        .then(cache => {
            cache.keys().then(keys => {
                console.log(keys);
                if (keys.length > sizeItems) {
                    cache.delete(keys[0]).then(() => cleanCache(cacheName, sizeItems));
                }
            });
        });
}


self.addEventListener('install', evt => {
    console.log("nuevo sw");

    //crear cache y almacenar appshell
    const promiseCache = caches.open(CACHE_STATIC_NAME)
        .then(cache => {
            return cache.addAll([
                'index.html',
                'img/p1.png',
                'img/p2.png',
                'img/p3.png',
                'img/p4.png',
                'js/app.js'
            ]);
        });

    const inmutableCache = caches.open(CACHE_INMUTABLE_NAME)
        .then(cache => {
            return cache.addAll([
                'https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.min.js',
                'https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js',
                'https://code.jquery.com/jquery-3.5.1.min.js',
                'https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css',
            ]);
        });

    evt.waitUntil(Promise.all([promiseCache, inmutableCache]));
});

self.addEventListener('fetch', evt => {
    // primero busca en cache, en caso de non encontrar va a la red.
    const respuestaCache = caches.match(evt.request)
        .then(value => {
            //si la request existe en cache
            if (value) {
                //respondemos con cache
                return value;
            } else {
                //vas a la red
                console.log("no está en caché", evt.request.url)
                return fetch(evt.request).then(resp => {
                    //guardo la respuesta en cache
                    caches.open(CACHE_DYNAMIC_NAME).then(cache => {
                        cache.put(evt.request, resp).then(() => cleanCache(CACHE_DYNAMIC_NAME, 5));
                    });
                    //retorno la respuesta
                    return resp.clone();
                });
            }
        });

    evt.respondWith(respuestaCache);
});
