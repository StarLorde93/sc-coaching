const CACHE_NAME = "sc-coaching-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/payment.html",
  "/admin.html",
  "/css/styles.css",
  "/js/firebase-config.js",
  "/js/main.js",
  "/js/payment.js",
  "/js/admin.js",
  "/assets/logo-sc.svg"
];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Activate
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// Fetch
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
