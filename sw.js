importScripts('https://cdn.jsdelivr.net/npm/pouchdb@8.0.1/dist/pouchdb.min.js');
importScripts('/assets/js/utils/db.utils.js');
importScripts('/assets/js/utils/sw.utils.js');



const STATIC_CACHE = 'staticv1';
const INMUTABLE_CACHE = 'inmutablev1';
const DYNAMIC_CACHE = 'dynamicv1';

const APP_SHELL = [
    '/index.html',
    '/assets/css/style.css',
    '/assets/img/img-404.png',
    '/assets/img/not-found.svg',
    '/assets/img/report.ico',
    '/assets/img/reports.png',
    '/assets/js/main.js',
    '/assets/js/admin/admin.home.controller.js',
    '/assets/js/admin/admin.users.controller.js',
    '/assets/js/auth/signin.js',
    '/assets/js/axios/axios-instance.js',
    '/assets/js/toast/toasts.js',
    '/pages/auth/register.html',
    '/pages/admin/home.html',
    '/pages/admin/users.html',
    '/pages/attendant/home.html',
    '/pages/docent/home.html',
    '/pages/docent/incidences.html',
];

const APP_SHELL_INMUTABLE = [
    '/assets/js/jquery-3.7.1.min.js',
    '/assets/vendor/bootstrap/css/bootstrap.min.css',
    '/assets/vendor/bootstrap/js/bootstrap.min.js',
    '/assets/vendor/bootstrap-icons/bootstrap-icons.min.css',
    '/assets/vendor/bootstrap-icons/fonts/bootstrap-icons.woff',
    '/assets/vendor/bootstrap-icons/fonts/bootstrap-icons.woff2',
    '/assets/vendor/boxicons/css/boxicons.min.css',
    '/assets/vendor/boxicons/fonts/boxicons.eot',
    '/assets/vendor/boxicons/fonts/boxicons.svg',
    '/assets/vendor/boxicons/fonts/boxicons.ttf',
    '/assets/vendor/boxicons/fonts/boxicons.woff',
    '/assets/vendor/boxicons/fonts/boxicons.woff2',
]

const clear = (cacheName, items=50) =>{
    caches.open(cacheName).then((cache) =>{
        return cache.keys().then((keys) =>{
            if(keys.length > items)
            cache.delete(keys[0]).then(clear(cacheName, items))
        })
    })
}

//La instalacion y activación

self.addEventListener('install', e=>{
    console.log("Instalando");

    const staticCache = caches.open(STATIC_CACHE)
    .then(cache =>{+
        cache.addAll(APP_SHELL);
    })
    const inmutableCache =  caches.open(INMUTABLE_CACHE)
    .then(cache =>{
        cache.addAll(APP_SHELL_INMUTABLE);
    })
    e.waitUntil(Promise.all([staticCache, inmutableCache]))
    //e.skipWaiting();
})
self.addEventListener('activate', e=>{
    const clearCache = caches.keys().then((keys) =>{
        //forof /forEach
        keys.forEach((key) =>{
            if(key !== STATIC_CACHE && key.includes('static'))
            return caches.delete(key)
        })
    })
    e.waitUntil(clearCache);
})

self.addEventListener('fetch', (e) =>{
    //Verificar el POST '/api/user' -> POST

})