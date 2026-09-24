/* Mis rutas — arranque de la aplicación.
   Pide el código una sola vez, baja el archivo del vendedor (que viaja
   cifrado), lo descifra en el teléfono y arranca el mismo programa que ya
   usaban en el archivo de WhatsApp.

   Cómo abre, en orden:
     1) muestra al toque la copia que ya tiene guardada  -> anda sin señal
     2) pregunta por v.json (48 bytes) si hay algo nuevo -> no gasta datos
     3) si hay, se baja el archivo nuevo y avisa con una barra verde        */

var LS_COD = "rutas_cod", LS_KEY = "rutas_key", LS_GEN = "rutas_gen", LS_VER = "rutas_ver", LS_SEL = "rutas_sel",
    LS_FZ = "rutas_forzar";
var C_DATOS = "rutas-datos";   /* el mismo nombre que usa sw.js */

function $(id){ return document.getElementById(id); }
function guardar(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
function leer(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
function borrar(k){ try{ localStorage.removeItem(k); }catch(e){} }

function b64aBytes(s){
  var b = atob(s), u = new Uint8Array(b.length);
  for(var i=0;i<b.length;i++) u[i] = b.charCodeAt(i);
  return u;
}
function bytesAb64(u){
  var s = "";
  for(var i=0;i<u.length;i+=8192) s += String.fromCharCode.apply(null, u.subarray(i,i+8192));
  return btoa(s);
}

/* El código es "4-XXXXXXXX": adelante el número de vendedor, atrás la
   clave. Con eso solo puede abrir SU archivo y el de nadie más. */
function partirCodigo(txt){
  var c = String(txt||"").toUpperCase().replace(/\s+/g,"").replace(/[^A-Z0-9-]/g,"");
  var i = c.indexOf("-");
  if(i < 1) return null;
  var id = c.slice(0,i), clave = c.slice(i+1);
  if(!/^[0-9]+$/.test(id) || clave.length < 4) return null;
  return { id:id, cod:c };
}

async function derivar(cod, id){
  var mat = await crypto.subtle.importKey("raw", new TextEncoder().encode(cod), "PBKDF2", false, ["deriveBits"]);
  var bits = await crypto.subtle.deriveBits(
    { name:"PBKDF2", salt:new TextEncoder().encode("castro-rutas:"+id), iterations:200000, hash:"SHA-256" },
    mat, 256);
  return new Uint8Array(bits);
}

/* formato del archivo: [1 byte version=1][12 bytes iv][resto cifrado] */
async function descifrar(buf, keyBytes){
  var u = new Uint8Array(buf);
  if(u.length < 14 || u[0] !== 1) throw new Error("formato");
  var k = await crypto.subtle.importKey("raw", keyBytes, {name:"AES-GCM"}, false, ["decrypt"]);
  var plano = await crypto.subtle.decrypt({name:"AES-GCM", iv:u.subarray(1,13)}, k, u.subarray(13));
  var st = new Blob([plano]).stream().pipeThrough(new DecompressionStream("gzip"));
  return await new Response(st).text();
}

function urlAbs(u){ return new URL(u, location.href).href; }

async function bajarDatos(id, keyBytes, soloCache){
  var url = "d/" + id + ".enc", r;
  if(soloCache){
    r = (typeof caches !== "undefined") ? await caches.match(urlAbs(url)) : null;
    if(!r) throw new Error("sin copia");
  }else{
    r = await fetch(url, {cache:"no-store"});
    if(!r.ok) throw new Error("http " + r.status);
    /* La copia la guardamos NOSOTROS, aca, y no se confia en que lo haga el
       service worker al interceptar el fetch.
       POR QUE: si el service worker no esta controlando la pagina en ese
       momento —recien instalado, o iOS que lo descarta cuando necesita
       lugar— la descarga no quedaba guardada en ningun lado. Al recargar se
       leia la copia VIEJA del cache, el cartel verde volvia a salir y el
       telefono se quedaba PARA SIEMPRE con los datos de antes.
       Es lo que le pasaba al 800 el 12/9/2026: el cartel decia "datos nuevos
       del 11/09" y la pantalla seguia diciendo "Datos al 09/09" por mas veces
       que lo tocara. Reproducido desregistrando el service worker: sin este
       guardado falla siempre; con este guardado anda igual con service worker
       o sin el. */
    try{
      if(typeof caches !== "undefined"){
        var c = await caches.open(C_DATOS);
        await c.put(urlAbs(url), r.clone());
      }
    }catch(e){}
  }
  return await descifrar(await r.arrayBuffer(), keyBytes);
}

/* v.json NO se guarda en el teléfono a propósito: si no contesta, es que
   no hay internet. Es la forma de saberlo sin bajar todo el archivo. */
async function bajarVersion(){
  var r = await fetch("v.json?t=" + Date.now(), {cache:"no-store"});
  if(!r.ok) throw new Error("http " + r.status);
  return await r.json();
}

/* El programa del vendedor hace body.innerHTML = ... cada vez que pinta, así
   que lo que colguemos del body desaparece. Estas barras van pegadas al
   <html> y en posición fija, por eso sobreviven. */
/* El sexto parametro pone la barra ARRIBA en vez de abajo.
   [stated] 19/9/2026: "el aviso de que hay informacion nueva que le aparece
   alla abajo, cambiarlo arriba". Abajo, contra el borde del telefono, el
   cartel verde queda fuera de la mirada: el vendedor entra, mira los numeros
   de arriba y trabaja con datos viejos sin enterarse.
   La barra de arriba TAPA el encabezado, asi que ademas se le empuja el
   cuerpo hacia abajo con un padding del alto real de la barra -medido, no
   adivinado, porque el texto envuelve en dos renglones en pantallas chicas-.
   La de "sin senal" NO se toca: esa es informativa y abajo esta bien. */
function barraAjustar(d){
  if(!d || d.getAttribute("data-arriba") !== "1") return;
  try{ document.body.style.paddingTop = d.offsetHeight + "px"; }catch(e){}
}
function barra(id, texto, fondo, letra, alTocar, arriba){
  var d = $(id);
  if(!d){
    d = document.createElement("div");
    d.id = id;
    d.style.cssText = "position:fixed;left:0;right:0;z-index:99999;padding:11px 14px;"
      + "text-align:center;font:600 14px/1.35 -apple-system,Segoe UI,Roboto,Arial,sans-serif;"
      + (arriba
         ? "top:0;box-shadow:0 2px 10px rgba(0,0,0,.18);padding-top:calc(11px + env(safe-area-inset-top))"
         : "bottom:0;box-shadow:0 -2px 10px rgba(0,0,0,.18);padding-bottom:calc(11px + env(safe-area-inset-bottom))");
    if(arriba) d.setAttribute("data-arriba", "1");
    document.documentElement.appendChild(d);
    if(arriba){ try{ window.addEventListener("resize", function(){ barraAjustar($(id)); }); }catch(e){} }
  }
  d.style.background = fondo; d.style.color = letra;
  d.textContent = texto;
  d.style.cursor = alTocar ? "pointer" : "default";
  d.onclick = alTocar || null;
  barraAjustar(d);
}
function sacarBarra(id){
  var d = $(id); if(!d) return;
  if(d.getAttribute("data-arriba") === "1"){ try{ document.body.style.paddingTop = ""; }catch(e){} }
  d.remove();
}

function linda(iso){ return String(iso||"").slice(0,10).split("-").reverse().join("/"); }
function genDe(json){ try{ return String(JSON.parse(json).gen||"").slice(0,10); }catch(e){ return ""; } }

function mostrarAlta(msg){
  $("cargando").classList.add("oculto");
  $("alta").classList.remove("oculto");
  if(msg){ var a = $("aviso"); a.className = "mal"; a.textContent = msg; }
  try{ $("cod").focus(); }catch(e){}
}

var YA_ARRANCO = false;
function arrancar(json){
  if(YA_ARRANCO) return;
  YA_ARRANCO = true;
  window.__G = json;
  guardar(LS_GEN, genDe(json));
  $("cargando").classList.add("oculto");
  $("alta").classList.add("oculto");
  var s = document.createElement("script");
  s.src = "runtime.js";
  document.body.appendChild(s);
}

/* Hay datos nuevos: los bajamos ya (así el teléfono los tiene guardados) y
   recién ahí le avisamos. Si no, al recargar volvería a salir lo viejo. */
async function traerNuevo(id, keyBytes, gen, ver, sel, hayDatos){
  try{
    await bajarDatos(id, keyBytes, false);
    var txt = hayDatos ? ("Hay datos nuevos del " + linda(gen) + " — tocá acá para actualizar")
                       : "Hay información nueva — tocá acá para actualizar";
    barra("bNuevo", txt, "#1f6b3b", "#ffffff", function(){
      /* se anotan recien acá: si no toca el cartel, mañana le vuelve a salir
         en vez de quedarse callado con lo viejo */
      guardar(LS_VER, ver || "");
      guardar(LS_SEL, sel || "");
      /* Red de seguridad: el proximo arranque NO usa la copia guardada, va
         derecho a internet. Asi tocar el cartel funciona aunque el guardado
         del cache haya fallado por lo que sea. Se usa una sola vez. */
      guardar(LS_FZ, "1");
      location.reload();
    }, 1);
  }catch(e){}
}

async function inicio(){
  if("serviceWorker" in navigator){
    /* [stated] 24/9/2026: «publique y en el telefono sigue sin aparecer».
       El programa se sirve de la copia guardada para abrir sin internet, asi
       que el dia que se publica algo nuevo la primera apertura todavia dibuja
       el programa viejo y recien se ve a la segunda. Con esto, cuando el
       service worker nuevo toma el control, la pagina se recarga UNA sola vez
       y ya se ve lo nuevo. El candado de sesion evita el ciclo infinito. */
    try{
      /* si NO habia un programa tomando el control, es la primera instalacion:
         ahi no hay nada viejo en pantalla y recargar seria al pedo */
      var _habia = !!navigator.serviceWorker.controller;
      navigator.serviceWorker.addEventListener("controllerchange", function(){
        if(!_habia) return;
        try{
          if(sessionStorage.getItem("rt_recarga") === "1") return;
          sessionStorage.setItem("rt_recarga", "1");
        }catch(e){}
        location.reload();
      });
    }catch(e){}
    try{ await navigator.serviceWorker.register("sw.js"); }catch(e){}
  }
  var cod = leer(LS_COD), keyB64 = leer(LS_KEY);
  if(!cod || !keyB64){ mostrarAlta(""); return; }
  var p = partirCodigo(cod);
  if(!p){ borrar(LS_COD); borrar(LS_KEY); mostrarAlta(""); return; }
  var keyBytes = b64aBytes(keyB64);

  /* si viene de tocar el cartel verde, esta vez no se usa la copia guardada */
  var forzar = leer(LS_FZ) === "1";
  if(forzar) borrar(LS_FZ);

  var abrio = false;
  if(forzar){
    try{ arrancar(await bajarDatos(p.id, keyBytes, false)); abrio = true; }catch(e){}
  }
  if(!abrio){
    try{ arrancar(await bajarDatos(p.id, keyBytes, true)); abrio = true; }catch(e){}
  }

  try{
    var v = await bajarVersion();
    sacarBarra("bSinSenal");
    if(!abrio){ arrancar(await bajarDatos(p.id, keyBytes, false)); return; }
    /* OJO: antes esto miraba SOLO v.gen, la fecha de los datos. Si Mariano
       cambiaba el programa y publicaba el mismo dia, la fecha no cambiaba y el
       telefono decia "no hay nada nuevo": se quedaba con el programa viejo para
       siempre. Ahora tambien mira v.ver, que cambia cuando cambia el programa. */
    var sel = (v.s && v.s[p.id]) || "";
    /* La PRIMERA vez, rutas_ver y rutas_sel estan en null: se anotan recien
       cuando se toca el cartel. Sin esto, al recien instalado le salia el
       cartel verde "Hay informacion nueva" de entrada, sin que hubiera nada
       nuevo. Se adoptan calladamente. */
    if(leer(LS_VER) === null && leer(LS_SEL) === null){
      guardar(LS_VER, v.ver || "");
      guardar(LS_SEL, sel || "");
    }
    var hayDatos = v.gen && v.gen !== leer(LS_GEN);
    var hayProg  = v.ver && v.ver !== leer(LS_VER);
    /* el sello es lo unico que cambia si Mariano toca las cuotas y publica de
       nuevo el mismo dia: ni la fecha ni la version se mueven en ese caso. */
    var hayMio   = sel && sel !== leer(LS_SEL);
    if(hayDatos || hayProg || hayMio) traerNuevo(p.id, keyBytes, v.gen, v.ver, sel, hayDatos);
  }catch(e){
    if(!abrio){ mostrarAlta("No se pudo abrir. Fijate si tenés internet y probá de nuevo."); return; }
    barra("bSinSenal", "Sin señal — estás viendo lo del " + linda(leer(LS_GEN))
          + ". Se actualiza solo cuando agarres internet.", "#fff5d6", "#6b5a12", null);
  }
}

async function probarCodigo(){
  var b = $("entrar"), a = $("aviso");
  var p = partirCodigo($("cod").value);
  if(!p){ a.className = "mal"; a.textContent = "Ese código no es válido. Tiene que ser como 4-XXXXXXXX."; return; }
  b.disabled = true; a.className = ""; a.textContent = "Comprobando…";
  try{
    var keyBytes = await derivar(p.cod, p.id);
    var json = await bajarDatos(p.id, keyBytes, false);
    guardar(LS_COD, p.cod);
    guardar(LS_KEY, bytesAb64(keyBytes));
    a.className = "bien"; a.textContent = "Listo.";
    arrancar(json);
  }catch(e){
    b.disabled = false;
    a.className = "mal";
    a.textContent = (String(e.message||e).indexOf("http") === 0)
      ? "Ese código no figura. Fijate que esté bien copiado."
      : "El código no abre los datos. Revisalo con Mariano.";
  }
}

var REVISANDO = false;
async function revisar(){
  if(REVISANDO || !YA_ARRANCO) return;
  REVISANDO = true;
  try{
    var cod = leer(LS_COD), keyB64 = leer(LS_KEY);
    if(!cod || !keyB64) return;
    var p = partirCodigo(cod);
    var v = await bajarVersion();
    sacarBarra("bSinSenal");
    /* OJO: esto llamaba a traerNuevo con TRES de los seis argumentos. El
       cartel salia con el texto generico ("Hay informacion nueva") aunque
       fueran datos nuevos, y al tocarlo guardaba rutas_ver y rutas_sel
       VACIOS, asi que al rato volvia a avisar de algo que ya estaba. Ahora
       mira lo mismo que el arranque y pasa todo. */
    var sel = (v.s && v.s[p.id]) || "";
    var hayDatos = v.gen && v.gen !== leer(LS_GEN);
    var hayProg  = v.ver && v.ver !== leer(LS_VER);
    var hayMio   = sel && sel !== leer(LS_SEL);
    if(hayDatos || hayProg || hayMio) await traerNuevo(p.id, b64aBytes(keyB64), v.gen, v.ver, sel, hayDatos);
  }catch(e){}
  finally{ REVISANDO = false; }
}

document.addEventListener("DOMContentLoaded", function(){
  $("entrar").addEventListener("click", probarCodigo);
  $("cod").addEventListener("keydown", function(e){ if(e.key === "Enter") probarCodigo(); });
  inicio();
});
document.addEventListener("visibilitychange", function(){
  if(document.visibilityState === "visible") revisar();
});
window.addEventListener("online", revisar);
