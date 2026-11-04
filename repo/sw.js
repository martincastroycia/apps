/* v230: [stated] 5/11/2026 Jorge no podia entrar: «Se ha interrumpido la conexion · ERR_NETWORK_CHANGED» -> «y no se puede solucionar?».
   La app del repositor se bajaba entera cada vez que se abria: si la senal cambiaba en ese momento, no abria.
   Ahora primero prueba internet (8 s) para tener lo del dia y, si no hay o falla, abre la ultima copia guardada. */
var C = "repo-app";
var SHELL = ["./", "index.html", "manifest.json", "icono-192.png", "icono-512.png", "icono-mask.png"];
self.addEventListener("install", function(e){
  e.waitUntil(caches.open(C).then(function(c){
    return Promise.all(SHELL.map(function(u){ return fetch(u, {cache:"reload"}).then(function(r){ if(r && r.ok) return c.put(u, r); }).catch(function(){}); }));
  }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener("activate", function(e){ e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", function(e){
  var q = e.request;
  if(q.method !== "GET") return;
  var u = new URL(q.url);
  if(u.origin !== location.origin || q.url.indexOf(self.registration.scope) !== 0) return;
  var clave = (q.mode === "navigate" || /\/(index\.html)?$/.test(u.pathname)) ? "index.html" : u.pathname.split("/").pop();
  e.respondWith(
    Promise.race([
      fetch(q, {cache:"no-store"}).then(function(r){
        if(r && r.ok){ var cp = r.clone(); caches.open(C).then(function(c){ c.put(clave, cp); }); }
        return r;
      }),
      new Promise(function(res, rej){ setTimeout(function(){ rej(new Error("lento")); }, 8000); })
    ])['catch'](function(){
      return caches.open(C).then(function(c){ return c.match(clave).then(function(m){ return m || c.match("index.html"); }); });
    })
  );
});
