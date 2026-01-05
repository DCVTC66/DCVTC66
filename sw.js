const CACHE_NAME = "dcvtc66-v5"; // augmente le numéro à chaque changement

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/styles.css",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/offline.html"
];

// Installation
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        await cache.addAll(FILES_TO_CACHE);
      } catch (e) {
        // Si offline.html n'existe pas, on évite de casser l'installation
        await cache.addAll(FILES_TO_CACHE.filter((f) => f !== "/offline.html"));
      }
    })
  );
  self.skipWaiting();
});

// Activation
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null)))
    )
  );
  self.clients.claim();
});

// Fetch :
// - Navigation (page) => "network-first" + fallback cache + fallback offline
// - Assets (css, images, manifest) => "cache-first" + fallback network
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Ignore les requêtes non GET
  if (req.method !== "GET") return;

  // Pour les pages (navigation)
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("/index.html", copy));
          return res;
        })
        .catch(async () => {
          const cached = await caches.match("/index.html");
          return cached || caches.match("/offline.html") || Response.error();
        })
    );
    return;
  }

  // Pour les assets du site (même origine)
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req)
          .then((res) => {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
            return res;
          })
          .catch(() => caches.match("/offline.html"));
      })
    );
  }
});
