const CACHE_NAME = "dcvtc66-v12"; // 🚀 Augmente ce numéro à chaque modification de ton CSS ou HTML

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/styles.css",     // 🔄 Nettoyé : plus besoin de gérer le ?v= ici, le numéro de version du cache au-dessus suffit !
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/offline.html"
];

// 1. Installation du Service Worker et mise en cache initiale
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        return await cache.addAll(FILES_TO_CACHE);
      } catch (e) {
        console.warn("Échec de la mise en cache complète, tentative de secours sans offline.html...", e);
        try {
          return await cache.addAll(FILES_TO_CACHE.filter((f) => f !== "/offline.html"));
        } catch (err) {
          console.error("Échec critique de la mise en cache initiale :", err);
        }
      }
    })
  );
  self.skipWaiting();
});

// 2. Activation et nettoyage des anciens caches (très important pour v11 -> v12)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Nettoyage de l'ancien cache :", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// 3. Interception des requêtes (Fetch)
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // On ignore tout ce qui n'est pas une requête GET (ex: les requêtes POST du formulaire)
  if (req.method !== "GET") return;

  // STRATÉGIE 1 : Pages principales (Navigation HTML) -> Réseau en premier
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put("/index.html", copy));
          }
          return res;
        })
        .catch(async () => {
          // Si pas de réseau, on cherche l'index en cache, sinon la page hors-ligne dédiée
          const cached = await caches.match("/index.html");
          const offline = await caches.match("/offline.html");
          return cached || offline || Response.error();
        })
    );
    return;
  }

  // STRATÉGIE 2 : Ressources statiques (CSS, Images, Manifest) -> Cache en premier
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached; // Si le fichier est déjà dans le cache, on le sert directement

        return fetch(req)
          .then((res) => {
            // Si le fichier est récupéré sur le réseau, on le stocke pour la prochaine fois
            if (res.status === 200) {
              const copy = res.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
            }
            return res;
          })
          .catch(() => {
            // Si une image ou un asset est manquant hors-ligne, on renvoie une erreur propre
            return new Response("Ressource indisponible hors-ligne", { status: 503, statusText: "Service Unavailable" });
          });
      })
    );
  }
});
