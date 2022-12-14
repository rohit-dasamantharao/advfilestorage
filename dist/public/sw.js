const cachename = "Adv-Fs"

addtocache = async ()=>{
    cache = await caches.open(cachename)
    await cache.addAll(["/css/style.css", "/js/index.js", "/", "/index.html", "/img/loading.gif", "manifest.json"]);
}

self.addEventListener("fetch", event => {
  if (event.request.method === "POST") {
    return;
  }
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        // It can update the cache to serve updated content on the next request
          return cachedResponse || fetch(event.request);
      }
    )
   )
 });

self.addEventListener("install", event => {
    self.skipWaiting();
    event.waitUntil( 
        addtocache()
    );
});
