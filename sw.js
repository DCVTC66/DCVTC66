const CACHE_NAME = "dcvtc66-v14"; // ✅ augmente le numéro à chaque changement

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/styles.css?v=10",   // ✅ doit matcher ton index (v=10)
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

// Fetch
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== "GET") return;

  // Pages
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

  // Assets même origine
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
