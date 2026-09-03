/* Service worker: es lo que hace que la aplicación abra sin internet.
   Guarda el programa (que casi nunca cambia) y la última copia de los datos.
   VER lo pone el programa de Mariano al publicar: cuando cambia, el teléfono
   se baja el programa nuevo solo. */
var VER = "218829dc11f0";
var C_PROG = "rutas-prog-" + VER;
var C_DATOS = "rutas-datos";

var SHELL = ["./", "index.html", "estilo.css", "app.js", "runtime.js", "manifest.json", "icono-192.png", "icono-512.png", "icono-mask.png"];

self.addEventListener("install", function(e){
  e.waitUntil(caches.open(C_PROG).then(function(c){
    return c.addAll(SHELL);
  }).then(function(){ return self.skipWaiting(); }));
});

self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.map(function(k){
      if(k !== C_PROG && k !== C_DATOS) return caches.delete(k);
    }));
  }).then(function(){ return self.clients.claim(); }));
});

function esDatos(url){ return /\/d\/[^/]+\.enc$/.test(url); }

self.addEventListener("fetch", function(e){
  var req = e.request;
  if(req.method !== "GET") return;
  var url = new URL(req.url);
  if(url.origin !== location.origin) return;

  /* v.json queda afuera a propósito: es la señal de si hay internet.
     Si lo guardáramos, el teléfono creería que hay señal cuando no la hay. */
  if(/\/v\.json$/.test(url.pathname)) return;

  /* Los datos: primero internet (para tener lo del día), y si no hay señal
     sale la última copia guardada. */
  if(esDatos(url.pathname)){
    e.respondWith(
      fetch(req).then(function(r){
        if(r && r.ok){
          var copia = r.clone();
          caches.open(C_DATOS).then(function(c){ c.put(req.url, copia); });
        }
        return r;
      }).catch(function(){
        return caches.match(req.url);
      })
    );
    return;
  }

  /* El programa: primero lo guardado (abre al toque) y se actualiza atrás. */
  if(req.mode === "navigate"){
    e.respondWith(caches.match("index.html").then(function(c){ return c || fetch(req); }));
    return;
  }
  e.respondWith(caches.match(req).then(function(c){
    if(c){
      fetch(req).then(function(r){
        if(r && r.ok) caches.open(C_PROG).then(function(k){ k.put(req, r); });
      }).catch(function(){});
      return c;
    }
    return fetch(req);
  }));
});
