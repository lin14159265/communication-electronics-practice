const CACHE_NAME = 'ce-practice-v3';
const ASSETS = [
  "index.html",
  "styles.css",
  "app.js",
  "questions.js",
  "manifest.webmanifest",
  "icon.svg",
  "assets/img_001eb421a9f2.png",
  "assets/img_03877ddcd255.jpg",
  "assets/img_07682c896597.jpg",
  "assets/img_18a1e87de339.png",
  "assets/img_3cdc1f00de51.png",
  "assets/img_47856b4103af.png",
  "assets/img_60447fd57e2b.jpg",
  "assets/img_6b4a052781a1.png",
  "assets/img_7348ab4aa45f.jpg",
  "assets/img_744cb4bb6177.jpg",
  "assets/img_74e037847591.jpg",
  "assets/img_833b3f165a12.jpg",
  "assets/img_8c37551e36ca.png",
  "assets/img_94c1a77915a1.jpg",
  "assets/img_96c04249bd85.png",
  "assets/img_a565c0e21bc5.png",
  "assets/img_a7a65b2d4c35.png",
  "assets/img_af4b9bfc4542.png",
  "assets/img_af614a210564.png",
  "assets/img_c3afb3374f26.png",
  "assets/img_c43562aa1026.jpg",
  "assets/img_c8649cfbd607.jpg",
  "assets/img_d035fb613b12.png",
  "assets/img_d0d85f125778.png",
  "assets/img_d534f2dea72d.png",
  "assets/img_d60686dfee75.jpg",
  "assets/img_d6687b52eb5e.png",
  "assets/img_d7263ffc61d5.png",
  "assets/img_d89e4f1c14b0.png",
  "assets/img_f0654e96376a.jpg",
  "assets/img_f3b932d6ba8d.jpg",
  "assets/img_f5b0037a9c55.jpg",
  "assets/img_f5e41cb4a5e2.png",
  "assets/img_f7f2ab311a49.png"
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(resp => {
    const copy = resp.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
    return resp;
  }).catch(() => caches.match('index.html'))));
});
