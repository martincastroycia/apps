var G = JSON.parse(window.__G);
var DIAS = ['lunes','martes','miercoles','jueves','viernes','sabado'];
var DNOM = {lunes:'lunes',martes:'martes',miercoles:'miércoles',jueves:'jueves',viernes:'viernes',sabado:'sábado'};
var MESN = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
function esc(t){ return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function fmt(n){ return '$ ' + Math.round(n).toLocaleString('es-AR'); }
function fcorta(iso){ if(!iso) return '-'; return iso.slice(8,10)+'/'+iso.slice(5,7)+'/'+iso.slice(2,4); }
var CB=[],CP={},CF=[];
function fijarCat(v){ var k=(G.cat&&G.cat[v.g])||null; CB=(k&&k.bc)||G.bc||[]; CP=(k&&k.pc)||G.pc||{}; CF=(k&&k.fc)||G.fc||[]; }
function rcan(f){ f=String(f||'').toUpperCase().trim(); if(f==='PORTAFOLIO BRANCA')return 'FRATELLI BRANCA'; if(f==='CELUSAL')return 'TIMBO SA (CELUSAL)'; if(f==='5 HISPANOS')return 'CINCO HISPANOS'; return (G.can&&G.can[f])||f; }
function okRg(c,n){ var r=c.rg; if(!r) return true; var f=rcan(n); var i; if(r.sin&&r.sin.length){ for(i=0;i<r.sin.length;i++) if(rcan(r.sin[i])===f) return false; } if(r.solo&&r.solo.length){ for(i=0;i<r.solo.length;i++) if(rcan(r.solo[i])===f) return true; return false; } return true; }
function focohtml(c){ if(!c.rg) return ''; var t=''; if(c.rg.foco) t='Hacé foco en <b>'+esc(c.rg.foco)+'</b>'; else if(c.rg.solo&&c.rg.solo.length) t='Solo comprale <b>'+c.rg.solo.map(esc).join(' · ')+'</b>'; if(c.rg.nota) t+=(t?' · ':'')+esc(c.rg.nota); if(!t) return ''; return '<div class="foco">★ '+t+'</div>'; }
function bnombre(c){ for(var i=0;i<(CB||[]).length;i++) if(String(CB[i].c)===String(c)) return CB[i].n; return 'Artículo '+c; }
/* El portafolio que le corresponde a ESTE cliente segun lo que es (kiosco,
   almacen, autoservicio...). Reemplazo al viejo bloque de 'X de 57', que le
   pedia Macallan a un kiosco y ademas mostraba menos de lo que el cliente
   realmente compra.
   v34: Branca vive SOLO aca arriba, en pfdia(). El recuadro que iba adentro
   de la ficha de cada cliente se saco entero: era la misma informacion en
   dos lugares. Y el cliente que nunca compro una botella de la familia no
   tiene portafolio (viene sin pf) y no figura en ningun lado. */
/* ABRIR EL CLIENTE SIN NAVEGAR.
   Antes cada renglon era un <a href=#cliN>. Adentro de la vista previa del
   panel el documento va por srcdoc, y ahi un salto con almohadilla no se
   resuelve contra la hoja sino contra la direccion del programa: al tocar un
   cliente, el marco del telefono cargaba EL PROGRAMA DE OFICINA adentro.
   Ahora no hay enlace: se busca el cliente, se abre y se lleva a la vista. */
function irCli(n){
  var e=document.getElementById('cli'+n); if(!e) return;
  try{ e.open=true; }catch(x){}
  try{ e.scrollIntoView({behavior:'smooth',block:'center'}); }catch(x){ e.scrollIntoView(); }
}
/* El logo de Branca, el que manda la fabrica. Va embebido en el archivo
   (no es un enlace) porque el vendedor abre la hoja sin internet.
   Va ENTERO, con el aguila: es el logo de la fabrica y no se recorta. Por eso
   va a 60 pixeles de alto y no a 44, para que el aguila se vea. Pesa 18 KB. */
var BOTELLA='<img class="pfimg" alt="Branca" src="data:image/png;base64,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">';
function pfdia(D, v){
  if(!D||!D.c||!D.c.length) return '';
  var T=(G&&G.pf)||null; if(!T||!T.sk||!T.sk.length) return '';
  var l=D.c.filter(function(c){ return c.pf && !c.pf.nu && c.pf.f && c.pf.f.length; });
  if(!l.length) return '';
  l=l.slice().sort(function(a,b){ return (b.p||0)-(a.p||0); });
  var pfix=0;
  var h='<details class="pfdia"><summary><span class="pfbot">'+BOTELLA+'</span><span><b>Hoy podés sumar '+l.length+(l.length===1?' cliente':' clientes')+'</b><span class="pfsub">les falta algo del portafolio de Branca</span></span></summary><div class="pfdl">';
  l.forEach(function(c){
   var n=c.pf.s.length, tot=c.pf.s.length+c.pf.f.length;
   var pc=Math.round(100*n/tot), col= pc>=80?'#198754':(pc>=50?'#b8860b':'#c0392b');
   h+='<div class="pfdi" onclick="irCli('+c.n+')">'
     + '<div class="pfdn">'+esc(c.c)+' <span class="pfchip" style="border-color:'+col+';color:'+col+'"><span class="pfpt" style="background:'+col+'"></span>'+n+'/'+tot+'</span></div>'
     + '<div class="pfdr">' + esc(c.pf.t) + '</div>'
     + '<div class="pfdf">Le falta: '+c.pf.f.slice(0,4).map(function(i){return esc(T.sk[i]||'');}).join(' · ')+(c.pf.f.length>4?' y '+(c.pf.f.length-4)+' más':'')+'</div>'
     + '<div class="pfdm">Compra '+fmt(c.p)+'/mes</div>'
     + prehtml(c, v, pfix++)
     + '</div>';
  });
  return h+'</div></details>';
}
/* ===== RELEVAMIENTO DE PRECIOS =====================================
   Solo existe si v.pre vino en los datos, y v.pre solo viaja si en la
   oficina esta PRENDIDO. Con la campana apagada, esta hoja es igual a la
   de siempre. Lo tomado queda en el telefono (funciona sin senal) y se
   manda al final en un texto, igual que el parte de los repositores. */
function preLee(){ try{ return JSON.parse(lsGet('rg_pre_'+quien)||'{}'); }catch(e){ return {}; } }
function preGuarda(o){ lsSet('rg_pre_'+quien, JSON.stringify(o)); }
function preSet(cli, cod, marca, campo, val){
  var P=preLee(), k=cli+'|'+cod+'|'+(marca||'');
  var z=P[k]||(P[k]={p:0,pr:'',m:marca||''});
  if(campo==='p'){ var n=Number(String(val).replace(/[^0-9,.]/g,'').replace(/\./g,'').replace(',','.'))||0; z.p=n; }
  else if(campo==='pr') z.pr=String(val||'').slice(0,24);
  else if(campo==='m'){ delete P[k]; k=cli+'|'+cod+'|'+String(val||''); P[k]=z; z.m=String(val||''); }
  if(!z.p && !z.pr && !z.m) delete P[k];
  preGuarda(P); preCont();
}
function preCuantos(){ var P=preLee(), n=0; for(var k in P) if(P[k] && P[k].p>0) n++; return n; }
function preCont(){ var e=document.getElementById('preN'); if(e) e.textContent=preCuantos(); var b=document.getElementById('preBar'); if(b) b.style.display=preCuantos()?'':'none'; }
function preFila(c, cod, nom, marca, i){
  var P=preLee(), z=P[c.n+'|'+cod+'|'+(marca||'')]||{p:0,pr:''};
  return '<div class="preF">'
   + '<span class="preN">'+esc(nom)+'</span>'
   + '<input class="preI" type="number" inputmode="decimal" placeholder="$" value="'+(z.p||'')+'" onchange="preSet('+c.n+',\''+cod+'\',\''+(marca||'')+'\',\'p\',this.value)">'
   + '<input class="prePr" placeholder="promo" value="'+esc(z.pr||'')+'" onchange="preSet('+c.n+',\''+cod+'\',\''+(marca||'')+'\',\'pr\',this.value)">'
   + '</div>';
}
function prehtml(c, v, ix){
  if(!v.pre || !v.pre.p || !v.pre.p.length) return '';
  /* solo a los primeros del dia: la lista ya viene ordenada por lo que
     compra cada uno, asi que son los que mas valen la pena */
  if(v.pre.m && ix >= v.pre.m) return '';
  var P=preLee(), hechos=0;
  v.pre.p.forEach(function(x){ if((P[c.n+'|'+x[0]+'|']||{}).p>0) hechos++; });
  var tot=v.pre.p.length;
  var h='<details class="preBox"'+(hechos?'':'')+'><summary><b>\ud83d\udcb2 Precios</b> <span class="preCh">'+hechos+'/'+tot+'</span>'
   + '<span class="preSub">'+esc(v.pre.n)+'</span></summary><div class="preIn">';
  h += '<div class="preTit">Lo que vale en este comercio</div>';
  v.pre.p.forEach(function(x, i){ h += preFila(c, x[0], x[1], '', i); });
  var marcas=(v.pre.c||[]);
  if(marcas.length){
   h += '<div class="preTit">La competencia</div>';
   var abiertos={};
   for(var k in P){ var pz=k.split('|'); if(pz[0]==String(c.n) && pz[2]) abiertos[pz[1]+'|'+pz[2]]=1; }
   for(var kk in abiertos){ var pp=kk.split('|'); var nm=''; v.pre.p.forEach(function(x){ if(x[0]==pp[0]) nm=x[1]; });
     h += preFila(c, pp[0], pp[1]+' \u00b7 '+nm, pp[1]); }
   h += '<div class="preAdd">'
     + '<select id="preP'+c.n+'">'+v.pre.p.map(function(x){ return '<option value="'+x[0]+'">'+esc(x[1])+'</option>'; }).join('')+'</select>'
     + '<select id="preM'+c.n+'">'+marcas.map(function(m){ return '<option>'+esc(m)+'</option>'; }).join('')+'<option value="__otra__">otra...</option></select>'
     + '<button class="preMas" onclick="preSumar('+c.n+')">+ agregar</button></div>';
  }
  h += '</div></details>';
  return h;
}
function preSumar(n){
  var a=document.getElementById('preP'+n), b=document.getElementById('preM'+n);
  if(!a||!b) return;
  var m=b.value;
  if(m==='__otra__'){ m=prompt('\u00bfQu\u00e9 marca?',''); if(!m) return; }
  preSet(n, a.value, m, 'pr', '');
  pintar();
}
function preTexto(){
  var P=preLee(), v=elVend(quien), l=[], hoy=hoyIso();
  var d=hoy.slice(8,10)+'/'+hoy.slice(5,7)+'/'+hoy.slice(2,4);
  for(var k in P){ var z=P[k]; if(!z||!(z.p>0)) continue; var q=k.split('|');
    l.push(q[0]+';'+q[1]+';'+z.p+';'+(z.pr||'')+';'+(q[2]||'')); }
  if(!l.length) return '';
  return 'PRECIOS \u00b7 '+quien+' \u00b7 '+d+'\n'+l.join('\n');
}
/* Mandar los precios AL SISTEMA, por el mismo buzon que el parte de los
   repositores. Si no hay internet queda en el telefono y se reintenta
   solo; si el telefono no puede con esto, sigue estando WhatsApp. */
var PREDB=null, PREAUTH=null;
function preFB(){
  if(PREDB) return true;
  try{
    if(typeof firebase === 'undefined') return false;
    try{ firebase.app(); }catch(e){ firebase.initializeApp(G0().fb); }
    PREDB = firebase.firestore();
    preSes()['catch'](function(){});
    return true;
  }catch(e){ return false; }
}
function G0(){ var v=elVend(quien); return (v&&v.pre)||{}; }
function preSes(){
  if(PREAUTH) return PREAUTH;
  PREAUTH=(async function(){
    try{ if(!firebase.auth().currentUser) await firebase.auth().signInAnonymously(); }
    catch(e){ PREAUTH=null; throw e; }
  })();
  return PREAUTH;
}
async function preGz(txt){
  var cs=new CompressionStream('gzip');
  var stm=new Blob([new TextEncoder().encode(txt)]).stream().pipeThrough(cs);
  return new Uint8Array(await new Response(stm).arrayBuffer());
}
async function preCif(txt,cod,id,sal){
  var mat=await crypto.subtle.importKey('raw',new TextEncoder().encode(cod),'PBKDF2',false,['deriveBits']);
  var bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode(sal+id),iterations:200000,hash:'SHA-256'},mat,256);
  var kb=new Uint8Array(bits);
  var key=await crypto.subtle.importKey('raw',kb,{name:'AES-GCM'},false,['encrypt']);
  var gz=await preGz(txt);
  var sem=new Uint8Array(kb.length+gz.length); sem.set(kb,0); sem.set(gz,kb.length);
  var iv=new Uint8Array(await crypto.subtle.digest('SHA-256',sem)).subarray(0,12);
  var ct=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv:iv},key,gz));
  var out=new Uint8Array(1+12+ct.length); out[0]=1; out.set(iv,1); out.set(ct,13);
  var s2=''; for(var i=0;i<out.length;i++) s2+=String.fromCharCode(out[i]);
  return btoa(s2);
}
function preTope(pr,ms,q){ return Promise.race([pr,new Promise(function(_,rj){ setTimeout(function(){ rj(new Error('tard\u00f3 demasiado ('+q+')')); },ms); })]); }
function prePendL(){ try{ return JSON.parse(lsGet('pre_pend')||'[]'); }catch(e){ return []; } }
function prePendSet(l){ lsSet('pre_pend', JSON.stringify(l)); }
async function preMandarUno(o){
  var P=G0();
  if(!preFB()) throw new Error('no cargaron los programas de Google');
  await preSes();
  var b64=await preCif(JSON.stringify({v:P.vnum, tipo:'precios', vend:o.vend, fecha:o.fecha, txt:o.txt}), P.cod, P.vnum, P.sal);
  await preTope(PREDB.collection(P.col).doc(o.id).set({
    v:P.vnum, b:b64, nf:0, estado:'nuevo',
    ts:firebase.firestore.FieldValue.serverTimestamp(), fecha_carga:new Date().toISOString()
  }), 30000, 'mandar');
}
async function preVaciar(){
  var l=prePendL();
  if(!l.length) return {n:0, falta:0};
  var q=[], n=0;
  for(var i=0;i<l.length;i++){
    try{ await preMandarUno(l[i]); n++; }catch(e){ l[i].err=String((e&&e.message)||e); q.push(l[i]); }
  }
  prePendSet(q);
  return {n:n, falta:q.length};
}
async function preAlSistema(){
  var t=preTexto(), P=G0();
  if(!t){ alert('Todav\u00eda no cargaste ning\u00fan precio.'); return; }
  if(!P.cod){ preMandar(); return; }                 /* hoja vieja: sigue por WhatsApp */
  var id=P.vnum+'-'+quien+'-'+hoyIso();
  var l=prePendL().filter(function(x){ return x.id!==id; });
  l.push({id:id, vend:String(quien), fecha:hoyIso(), txt:t});
  prePendSet(l);
  try{
    var R=await preVaciar();
    if(R.falta) alert('Qued\u00f3 guardado en el tel\u00e9fono: cuando haya se\u00f1al se manda solo. No hace falta que hagas nada.');
    else alert('\u2705 Los precios llegaron al sistema.');
  }catch(e){ alert('Qued\u00f3 guardado en el tel\u00e9fono y se reintenta solo.'); }
  pintar();
}
try{ window.addEventListener('online', function(){ if(prePendL().length) preVaciar().then(function(R){ if(R.n) pintar(); }); }); }catch(e){}
function preMandar(){
  var t=preTexto();
  if(!t){ alert('Todav\u00eda no cargaste ning\u00fan precio.'); return; }
  if(navigator.share){ navigator.share({text:t})['catch'](function(){ copiar(t); }); }
  else copiar(t);
}
function preBorrarTodo(){
  if(!confirm('\u00bfBorrar los precios que cargaste? Hacelo despu\u00e9s de mandarlos.')) return;
  lsSet('rg_pre_'+quien, '{}'); pintar();
}
function pfchip(c){
  var p=c.pf; if(!p||p.nu) return '';
  var n=p.s.length, tot=p.s.length+p.f.length; if(!tot) return '';
  var pc=Math.round(100*n/tot), col= pc>=80?'#198754':(pc>=50?'#b8860b':'#c0392b');
  var t = p.f.length ? ('Le faltan '+p.f.length+' de '+tot+' de Branca') : 'Tiene todo el portafolio';
  return ' <span class="pfchip" style="border-color:'+col+';color:'+col+'" title="'+esc(t)+'">' + '<b class="pfini">'+esc(p.l||'')+'</b>'
       + '<span class="pfpt" style="background:'+col+'"></span>' + n + '/' + tot + '</span>';
}
/* LOS QUE TODAVIA NO COMPRAN BRANCA. Van abajo de todo, como sugeridos
   para abrir: tienen rubro cargado y nunca llevaron una botella de la
   familia. El dia que compren algo suben solos a la ventana de arriba. */
function pfsug(D){
  if(!D||!D.c||!D.c.length) return '';
  var T=(G&&G.pf)||null; if(!T||!T.sk||!T.sk.length) return '';
  var l=D.c.filter(function(c){ return c.pf && c.pf.nu; });
  if(!l.length) return '';
  l=l.slice().sort(function(a,b){ return (b.p||0)-(a.p||0); });
  var pfix=0;
  var h='<details class="sec pfsug"><summary><span class="fl">&#9656;</span><span class="tit">Todavía no le vendés Branca — para abrir</span><span class="cnt">'+l.length+'</span></summary><div class="pfdl">';
  l.forEach(function(c){
   h+='<div class="pfdi" onclick="irCli('+c.n+')">'
     + '<div class="pfdn">'+esc(c.c)+'</div>'
     + '<div class="pfdr">' + esc(c.pf.t) + '</div>'
     + '<div class="pfdf">Empezá por: '+c.pf.f.slice(0,3).map(function(i){return esc(T.sk[i]||'');}).join(' · ')+'</div>'
     + '<div class="pfdm">Compra '+fmt(c.p)+'/mes de otras cosas</div></div>';
  });
  return h+'</div></details>';
}
function cohtml(c){var z=c.co||{c:[],s:[]},a=z.c||[],s=z.s||[];if(!a.length&&!s.length)return '';var h='<div class="brbox"><div class="brtit"><span style="color:'+(a.length?'#198754':'#c0392b')+';margin-right:6px">●</span>COMBOS PARA OFRECER</div>';if(a.length)h+='<details class="brdet"><summary>Combos que ya compra <b>'+a.length+'</b></summary><div>'+a.map(function(n){return '<span class="brsi">'+esc(n)+'</span>';}).join('')+'</div></details>';if(s.length)h+='<details class="brdet" open><summary>Oportunidades <b>'+s.length+'</b></summary><div>'+s.map(function(x){return '<div><span class="brno">'+esc(x[0])+'</span><span class="brmeta">'+esc(x[1])+'</span></div>';}).join('')+'</div></details>';return h+'</div>';}
function uvhtml(c){var z=c.uv||{f:'',a:[]},a=z.a||[];if(!a.length)return '';return '<div class="brbox"><div class="brtit">ÚLTIMA VISITA / COMPRA · '+fcorta(z.f)+'</div><details class="brdet" open><summary>Artículos que llevó <b>'+a.length+'</b></summary><div>'+a.map(function(x){return '<div><span class="brsi">'+esc(x[0])+'</span><span class="brmeta">'+Number(x[1]||0).toLocaleString('es-AR')+' un. · '+fmt(x[2]||0)+'</span></div>';}).join('')+'</div></details></div>';}
function phtml(c,n){if(c.pr&&!Object.prototype.hasOwnProperty.call(c.pr,n))return '';var cat=(CP&&CP[n])||[],a=(c.pr&&c.pr[n])||[],t={},h='';a.forEach(function(x){t[String(x[0])]=1;});if(!cat.length)return '';function nom(k){for(var i=0;i<cat.length;i++)if(String(cat[i].c)===String(k))return cat[i].n;return k;}var f=cat.filter(function(x){return !t[String(x.c)];});h='<div class="brbox"><div class="brtit"><span style="color:'+(a.length?'#198754':'#c0392b')+';margin-right:6px">●</span>'+esc(n)+': <strong>'+a.length+' de '+cat.length+'</strong> artículos</div>';if(a.length)h+='<details class="brdet"><summary>Artículos que compra <b>'+a.length+'</b></summary><div>'+a.map(function(x){return '<span class="brsi">'+esc(nom(x[0]))+'</span>';}).join('')+'</div></details>';if(f.length)h+='<details class="brdet"><summary>Artículos que faltan vender <b>'+f.length+'</b></summary><div>'+f.map(function(x){return '<span class="brno">'+esc(x.n)+'</span>';}).join('')+'</div></details>';return h+'</div>';}
function fhtml(c){var a=c.ot||[],m={},bf={};a.forEach(function(x){m[x[0]]=x;});(c.fa||[]).forEach(function(x){bf[x[0]]=1;});var fs=(CF||[]).map(function(x){return x.n;}).filter(function(n){return ['PORTAFOLIO BRANCA','CELUSAL','5 HISPANOS','SIN STOCK'].indexOf(String(n).toUpperCase())<0 && okRg(c,n);}),h='<div class="brbox"><div class="brtit">RESTO DE LAS FAMILIAS</div>';fs.forEach(function(n){var x=m[n]||[n,[],[]],b=x[1]||[],s=x[2]||[],v=!!bf[n];h+='<details class="brdet"><summary><span style="color:'+(v?'#198754':'#c0392b')+';margin-right:6px">●</span>'+esc(n)+'</summary><div>';if(b.length)h+='<div class="brmeta">Artículos que compra</div>'+b.map(function(q){return '<span class="brsi">'+esc(q)+'</span>';}).join('');if(s.length)h+='<div class="brmeta">Sugerencias para vender</div>'+s.map(function(q){return '<span class="brno">'+esc(q)+'</span>';}).join('');if(!b.length&&!s.length)h+='<div class="brmeta">Todavía no compra esta familia.</div>';h+='</div></details>';});return h+'</div>';}
function dias(iso){ if(!iso) return null; var d=(Date.now()-new Date(iso+'T12:00:00').getTime())/86400000; return Math.floor(d); }
function esGenerico(nom){ var t=String(nom||'').toUpperCase().replace(/^\s+/,''); return /^(PARTICULAR|CONSUMIDOR|MOSTRADOR|VARIOS|CONTADO|SIN NOMBRE|CLIENTE OCASIONAL)\b/.test(t); }
function hoyIso(){ var d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function diaHoy(){ var g=new Date().getDay(); return g>=1 && g<=6 ? DIAS[g-1] : 'lunes'; }
function lsGet(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
function lsSet(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
var quien = (G.pre || lsGet('rg_quien_'+(G.titulo||'x')) || '');
var BL = G.bl || {obj:1,met:1,cmp:1,rk:1,pk:1,avi:1,top:1,bra:1};
var GM = G.arm || [];
var GC = G.arc ? 1 : 0;
var diaAct = diaHoy();
function marcas(vid){ try{ return JSON.parse(lsGet('rg_v_'+vid+'_'+hoyIso())) || {}; }catch(e){ return {}; } }
function guardaMarcas(vid, m){ lsSet('rg_v_'+vid+'_'+hoyIso(), JSON.stringify(m)); }
function agenda(vid){ try{ return JSON.parse(lsGet('rg_agenda_'+vid)) || {}; }catch(e){ return {}; } }
function guardaAgenda(vid,a){ lsSet('rg_agenda_'+vid,JSON.stringify(a)); }
function agendaFecha(n,f){ var a=agenda(quien); if(!a[n])a[n]={}; a[n].f=f; guardaAgenda(quien,a); pintar(); }
function agendaRefecha(n,f){ var a=agenda(quien); if(!a[n])a[n]={}; a[n].r=f; if(f)a[n].e='reagendado'; guardaAgenda(quien,a); pintar(); }
function agendaEstado(n,e){ var a=agenda(quien); if(!a[n])a[n]={}; a[n].e=e; guardaAgenda(quien,a); pintar(); }
function elVend(vid){ for(var i=0;i<G.vs.length;i++) if(String(G.vs[i].id)===String(vid)) return G.vs[i]; return null; }
function qshort(n){n=Number(n)||0;if(Math.abs(n)>=999500)return '$ '+(n/1000000).toLocaleString('es-AR',{maximumFractionDigits:1})+' M';if(Math.abs(n)>=1000)return '$ '+Math.round(n/1000).toLocaleString('es-AR')+' mil';return '$ '+Math.round(n).toLocaleString('es-AR');}
function qlit(n){return (Math.round((Number(n)||0)*10)/10).toLocaleString('es-AR',{maximumFractionDigits:1})+' L';}
function qest(real,meta,frac){var p=meta?real/meta:0;if(p>=frac*.90)return ['mok','moktxt'];if(p>=frac*.70)return ['mwarn','mwarntxt'];return ['mbad','mbadtxt'];}
function qbar(real,meta,frac){var p=meta?Math.round(real/meta*100):0,e=qest(real,meta,frac),h=Math.min(99,Math.round(frac*100));return '<div class="mbar"><i class="'+e[0]+'" style="width:'+Math.min(100,Math.max(0,p))+'%"></i><em style="left:'+h+'%"></em></div>';}
function qvol(n,k){n=Number(n)||0;return k==='CELUSAL'?(Math.round(n*10)/10).toLocaleString('es-AR',{maximumFractionDigits:1})+' t':Math.round(n).toLocaleString('es-AR')+' cj';}
function msgSem(id){ var t=String(id||''), s=0; for(var i=0;i<t.length;i++) s+=t.charCodeAt(i)*(i+3); return s; }
function msgHab(){
  var d = new Date();
  if(d.getDay() === 0) d = new Date(d.getTime() - 86400000);
  var t = Math.round((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()) - Date.UTC(2026,0,1))/86400000);
  if(t < 0) t = 0;
  var dom = t >= 3 ? Math.floor((t-3)/7)+1 : 0;
  return t - dom;
}
function msgIdx(n, sem){ if(!n) return 0; var k = (msgHab() + sem) % n; return k < 0 ? k + n : k; }
function msgHoy(v){
  if(!BL.msg || !v || !v.msg || !v.msg.length) return '';
  var t = v.msg[msgIdx(v.msg.length, msgSem(v.id))];
  if(!t) return '';
  return '<div class="mmsg"><span class="mmsgi">☀</span><div class="mmsgt">' + esc(t) + '</div></div>';
}
function rkhtml(v){if(!v.rf||!v.rf.length)return '';var h='<div class="rkf"><h3>Cómo vas contra tus compañeros</h3>'; v.rf.forEach(function(r){h+='<div class="rkl"><div class="rkn">'+esc(r.nom)+'</div>';  if(!r.cli){h+='<div class="rkp">Todavía no vendiste esta línea este mes. Ya la están vendiendo '+r.n+' de tus compañeros.</div>';}  else{h+='<div class="rkp">Cobertura: le vendiste a <b>'+r.cli+'</b> de tus '+r.cart+' clientes ('+r.cob+'%) · vas <b class="'+(r.pc<=3?'rkg':'')+'">'+r.pc+'° de '+r.n+'</b>';  h+=(r.pv?' · en volumen '+r.pv+'°':'')+'</div>';}  if(r.ob){var cu=Math.round(r.cli/r.ob*100),ok=r.cli>=(r.obh||r.ob);h+='<div class="rkp">Objetivo del mes: <b>'+r.ob+'</b> clientes · vas <b class="'+(ok?'rkg':'')+'">'+cu+'%</b>'+(r.cli>=r.ob?' · cumplido':' · te faltan <b>'+(r.ob-r.cli)+'</b>'+(r.obh&&r.obh<r.ob?' (a hoy deberías ir en '+r.obh+')':''))+'</div>';}  if(r.riv&&r.fa)h+='<div class="rks">'+(r.fa>1?'Te faltan <b>'+r.fa+'</b> clientes':'Te falta <b>1</b> cliente')+' para pasar a '+esc(String(r.riv).replace(/\.$/,''))+(r.sug&&r.sug.length?'. Empezá por: '+r.sug.map(esc).join(', '):'')+'</div>';  else if(r.sug&&r.sug.length&&r.pc>1)h+='<div class="rks">Todavía no le compraron: '+r.sug.map(esc).join(', ')+'</div>';  h+='</div>'});return h+'</div>'}
function ritvhtml(v){if(!BL.rit||!v.rit)return '';var r=v.rit,up=r.pc>=0; var h='<div class="rkf"><h3>Cómo venís este mes</h3><div class="rkl">'; h+='<div class="rkp">Venías a <b>'+fmt(r.i1)+' por día</b> ('+r.c1+' clientes) y en los últimos días vas a <b>'+fmt(r.i2)+'</b> ('+r.c2+' clientes) · <b class="'+(up?'rkg':'')+'" style="color:'+(up?'#1a7f4b':'#c0392b')+'">'+(up?'+':'')+r.pc+'%</b></div>'; h+='<div class="rks">Es contra vos mismo, no contra tus compañeros. Último día cargado: '+fcorta(r.ult)+'</div>'; return h+'</div></div>'}
function caevhtml(v){if(!BL.cae||!v.cae||!v.cae.length)return ''; var h='<div class="rkf"><h3>Tus clientes que están comprando menos que el año pasado</h3>'; if(v.cmp2){var c=v.cmp2,ok=c.pc>=0;  h+='<div class="rkl"><div class="rkp">Con los <b>'+c.n+' clientes que seguís atendiendo</b> vas <b style="color:'+(ok?'#1a7f4b':'#c0392b')+'">'+(ok?'+':'')+c.pc+'%</b> contra '+c.ant+' ('+fmt(c.b)+' contra '+fmt(c.a)+')';  h+=(c.nv?' · y abriste <b>'+c.nv+'</b> clientes nuevos por '+fmt(c.np):'')+'</div></div>';} v.cae.forEach(function(x){  h+='<div class="rkl"><div class="rkn">'+esc(x[0])+'</div><div class="rkp">El año pasado '+fmt(x[1])+' · este año <b>'+fmt(x[2])+'</b> · <b style="color:#c0392b">'+x[3]+'%</b></div></div>';}); return h+'<div class="rks">Cada uno de estos es un llamado para hacer.</div></div>'}
function cfbhtml(v){if(!BL.cfb||!v.cf||!v.cf.length)return '';var h=''; v.cf.forEach(function(x){var fab=x[0],cart=x[1],si=x[2],no=x[3];  var pc=cart?Math.round(si.length/cart*100):0;  h+='<div class="rkf"><h3>'+esc(fab)+'</h3>';  h+='<div class="rkl"><div class="rkp">Te compran <b>'+si.length+'</b> de tus '+cart+' clientes ('+pc+'%) · te faltan <b>'+no.length+'</b>'+(G.per?' · '+esc(G.per):'')+'</div></div>';  if(si.length){h+='<details class="cfb"><summary>Los que ya te compran <span>'+si.length+'</span></summary>';   si.forEach(function(c){h+='<div class="cfl"><b>'+esc(c[1])+'</b> <span>'+c[2]+(c[2]===1?' mes':' meses')+'</span></div>';});h+='</details>';}  if(no.length){h+='<details class="cfb"><summary>Los que todavía no te compran <span>'+no.length+'</span></summary>';   no.forEach(function(c){h+='<div class="cfl"><b>'+esc(c[1])+'</b> <span>'+fmt(c[2])+'/mes</span></div>';});h+='</details>';}  h+='</div>';});return h}
function n2(x){return (x/100).toFixed(2).replace('.',',');}
function arthtml(v){if(!BL.art||!v.ar||!v.ar.length)return ''; var h='<div class="rkf"><h3>Cuántos artículos te lleva cada cliente</h3>'; h+='<div class="rkp" style="margin-bottom:6px">El que compra un solo artículo de una línea es el que más fácil crece: ya te compra, solo hay que ofrecerle el resto.</div>'; v.ar.forEach(function(x){var nom=x[0],cat=x[1],pr=x[2],cli=x[3],uno=x[4],l=x[5];  var ult=pr.length-1,cer=GC?ult-1:ult;if(cer<0)cer=ult;  var ahora=pr[cer]||0,antes=0;for(var i=0;i<cer;i++){if(pr[i]){antes=pr[i];break;}}  var d=antes?Math.round((ahora-antes)/antes*100):0,col=d>0?'#1a7f4b':(d<0?'#c0392b':'#65726b');  h+='<div class="rkl"><div class="rkn">'+esc(nom)+'</div>';  h+='<div class="rkp">En '+(GM[cer]||'')+' tus clientes te llevaron <b>'+n2(ahora)+' artículos</b> de '+cat+' que tenés para ofrecer'   +(antes?' · en '+(GM[0]||'')+' eran '+n2(antes)+' · <b style="color:'+col+'">'+(d>0?'+':'')+d+'%</b>':'')+'</div>';  if(GC&&pr[ult])h+='<div class="rkp">En '+(GM[ult]||'')+' vas <b>'+n2(pr[ult])+'</b> (el mes todavía no terminó).</div>';  if(GM&&GM.length)h+='<div class="rks">'+GM.map(function(m,i){return m+' '+n2(pr[i]||0)+(GC&&i===ult?' (va)':'');}).join(' · ')+'</div>';  if(uno)h+='<div class="rkp"><b>'+uno+'</b> de tus '+cli+' clientes de esta línea se llevan <b>un solo artículo</b>.</div>';  if(l&&l.length){h+='<details class="cfb"><summary>A quién ofrecerle <span>'+l.length+'</span></summary>';   l.forEach(function(z){h+='<div class="cfl2"><b>'+esc(z[1])+'</b><div class="cfm">lleva '+esc(z[2])+'</div>'    +(z[3]&&z[3].length?'<div class="cfo">ofrecele: '+z[3].map(esc).join(' · ')+'</div>':'')+'</div>';});h+='</details>';}  h+='</div>';});return h+'</div>'}
function othtml(v){if(!BL.otr||!v.ot2||!v.ot2.length)return ''; var h='<div class="rkf"><h3>Otros clientes tuyos</h3>'; h+='<div class="rkp">Estos son tuyos pero no están en ningún día de la ruta, así que no te aparecen arriba. La mayoría hace rato que no compra. Si pasás cerca, acá los tenés.</div>'; h+='<details class="cfb"><summary>Verlos <span>'+v.ot2.length+'</span></summary>'; v.ot2.forEach(function(z){h+='<div class="cfl2"><b>'+esc(z[1])+'</b><div class="cfm">'+(z[2]?fmt(z[2])+'/mes':'')+(z[3]?' · última compra '+fcorta(z[3]):' · nunca compró')+'</div></div>';}); return h+'</details></div>'}
function pkhtml(v){if(!v.pk||!v.pk.length)return '';var h='<div class="rkf"><h3>Productos clave del mes</h3>'; v.pk.forEach(function(r){var pc=r.ca?Math.round(r.cl/r.ca*100):0;  h+='<div class="rkl"><div class="rkn">'+esc(r.n)+'</div><div class="rkp">Se lo vendiste a <b>'+r.cl+'</b> de tus '+r.ca+' clientes ('+pc+'%)</div>';  if(r.sug&&r.sug.length)h+='<div class="rks">Todavía no se lo compraron: '+r.sug.map(esc).join(', ')+'</div>';  h+='</div>'});return h+'</div>'}
function cmphtml(v){if(!v.cm||!v.cm.length)return '';var frac=v.o.frac||0,h='<div class="rkf camp"><h3>Campañas del mes</h3>'; v.cm.forEach(function(r){var p=r.m?Math.round(r.r/r.m*100):0,e=r.m?qest(r.r,r.m,frac):['mok','moktxt'];  h+='<div class="rkl"><div class="rkn">'+esc(r.n)+(r.t==='sku'&&r.mi?' <span style="font-weight:400">(mínimo '+r.mi+' artículos)</span>':'')+'</div>';  if(r.pe){h+='<div class="rkq">Arranca el <b>'+esc(r.dn)+' '+esc(r.d1)+'</b>'+(r.d2?' y va hasta el '+esc(r.d2):'')+'. Tu meta: <b>'+r.mt+'</b>. Todavía no cuenta nada: lo que vendas desde ese día es lo que suma.</div>';   if(r.pr)h+='<div><span class="premio">'+esc(r.pr)+'</span></div>'; h+='</div>'; return;}  if(r.m){h+='<div class="rkp">Llevás <b>'+r.rt+'</b> de <b>'+r.mt+'</b>'+(r.bs?' <span style="color:#65726b">('+esc(r.bs)+')</span>':'')+' · <b class="'+e[1]+'">'+p+'%</b>'+(r.r<r.m?' · te faltan <b>'+valTxtFalta(r)+'</b>':' · cumplida')+'</div>'+qbar(r.r,r.m,frac);}  else{h+='<div class="rkp">Llevás <b>'+r.rt+'</b> (sin meta cargada)</div>';}  if(r.pr)h+='<div><span class="premio">'+esc(r.pr)+'</span></div>';  if(r.m2){var p2=Math.round(r.r2/r.m2*100),e2=qest(r.r2,r.m2,frac),ok2=r.r2>=r.m2-0.0001;   h+='<div class="rkp">Y además un mínimo de <b>'+r.m2t+'</b>: llevás <b>'+r.r2t+'</b> · <b class="'+e2[1]+'">'+p2+'%</b>'     +(ok2?' · <b>cumplida</b>':'')+'</div>'+qbar(r.r2,r.m2,frac);   var okA=r.r>=r.m-0.0001;   h+='<div class="rks">'+(okA&&ok2?'Estás cobrando: cumplís las dos.':(okA||ok2?'Cumplís una de las dos. Se cobra con las <b>dos</b>.':'Se cobra cumpliendo las <b>dos</b>.'))+'</div>';}  if(r.dv){h+='<div class="rks">El número va <b>neto de devoluciones</b>: en el período se te devolvieron <b>'+r.dv+'</b> unidad'+(r.dv===1?'':'es')+' de la línea, y ya están descontadas.</div>';}  if(r.bo&&r.bo.m){var b=r.bo,pb=Math.round(b.t/b.m*100);   h+='<div class="bono'+(b.ll?' bonook':'')+'"><b>BONO DEL GRUPO</b> — '+esc(b.nm)+'<br>'     +'Entre todos llevan <b>'+b.t.toLocaleString('es-AR')+'</b> de <b>'+b.m.toLocaleString('es-AR')+'</b> cajas ('+pb+'%)'     +(b.ll?'. <b>Ya está</b>: se reparten '+qshort(b.mo)+' entre los '+b.n+' que llegaron'+(b.ca?', '+qshort(b.ca)+' cada uno':'')+'.'         :'. Faltan <b>'+b.fa.toLocaleString('es-AR')+'</b> cajas para destrabar '+qshort(b.mo)+'.')     +'</div>';}  if(r.nb)h+='<div class="rks">Cuenta como nuevo el cliente que '+esc(r.nb)+'.</div>';  if(r.bd&&r.bd.length){h+='<div class="rkb"><b>'+(r.bt?esc(r.bt):('Estás a 1 artículo de sumar '+r.bn+(r.bn===1?' cliente':' clientes')+':'))+'</b>';   r.bd.forEach(function(z){h+='<div class="rkbl">'+esc(z.c)+(z.f?' <span>→ '+esc(z.f)+'</span>':'')+(z.p?' <span>'+fmt(z.p)+'/mes</span>':'')+'</div>';});   if(r.bn>r.bd.length)h+='<div class="rkbl">y '+(r.bn-r.bd.length)+' más</div>'; h+='</div>';}  h+='</div>'});return h+'</div>'}
function valTxtFalta(r){var d=r.m-r.r;if(r.u==='art')return (Math.round(d*100)/100).toString().replace('.',',')+' art/cliente';if(r.u==='clientes')return Math.ceil(d)+' clientes';if(r.u==='$')return qshort(d);if(r.u==='t')return (Math.round(d*10)/10)+' t';if(r.u==='L')return Math.round(d)+' L';return Math.ceil(d)+' cj';}
function qhtml(v,D){var q=v.q;if(!q)return '';var frac=v.o.frac||0,hoy=Math.round(frac*100),h='<div class="metas"><div class="metah"><b>METAS COMERCIALES</b><span>Hoy deberías ir '+hoy+'%</span></div>',b=q.b||{};if(b.m>0){var p=Math.round((b.r||0)/b.m*100),e=qest(b.r||0,b.m,frac);h+='<div class="mb"><div class="mtop"><div class="mnom">FERNET BRANCA</div><div class="mpct '+e[1]+'">'+p+'%</div></div><div class="mval">'+qlit(b.r)+' / '+qlit(b.m)+' · faltan '+qlit(Math.max(0,b.m-b.r))+'</div>'+qbar(b.r,b.m,frac)+'</div>';var ds=[];[['vm','vr','Sernova'],['cm','cr','Carpano'],['vim','vir','Fabre'],['mm','mr','Brancamenta'],['tm','tr','Vittone'],['gm','gr','Gin Spirito']].forEach(function(x){var m=Number(b[x[0]])||0,r=Number(b[x[1]])||0;if(!m&&!r)return;if(!m){ds.push('<div class="mmini"><div class="mminit"><span>'+x[2]+'</span><b>—</b></div><div class="mminiv">'+qlit(r)+' (sin cuota)</div></div>');return;}var pp=Math.round(r/m*100),ee=qest(r,m,frac);ds.push('<div class="mmini"><div class="mminit"><span>'+x[2]+'</span><b class="'+ee[1]+'">'+pp+'%</b></div><div class="mminiv">'+qlit(r)+' / '+qlit(m)+'</div>'+qbar(r,m,frac)+'</div>');});if(ds.length)h+='<div class="mder">'+ds.join('')+'</div>';}h+=pfdia(D, v);var fs=[];(q.f||[]).forEach(function(x){var k=x[0],m=x[1],r=x[2],p=Math.round(r/m*100),e=qest(r,m,frac),nom=k==='FELPITA'?'FELPITA ★':k==='QUERUCLOR'?'QUERUCLOR ↑':k; var rit=m>0?(r/m)/Math.max(0.05,frac):9; fs.push({k:k,pri:(k==='FELPITA'||k==='QUERUCLOR')?0:1,rit:rit,ix:fs.length,html:'<div class="mfam '+(k==='FELPITA'?'prio':k==='QUERUCLOR'?'imp':'')+'"><div class="mfamt"><div class="mfamn">'+nom+'</div><div class="mfamp '+e[1]+'">'+p+'%</div></div><div class="mfamv">'+qvol(r,k)+' / '+qvol(m,k)+'</div>'+qbar(r,m,frac)+'</div>'});});
if(fs.length){fs.sort(function(a,b){if(a.pri!==b.pri)return a.pri-b.pri;if(a.rit!==b.rit)return a.rit-b.rit;return a.ix-b.ix;}); var TOP=5, arriba=fs.slice(0,TOP), resto=fs.slice(TOP);
 h+='<div class="mfams">'+arriba.map(function(z){return z.html;}).join('')+'</div>';
 if(resto.length){var ok=0;resto.forEach(function(z){if(z.rit>=1)ok++;});  h+='<details class="mfold"><summary>Ver las otras '+resto.length+(ok?' · '+ok+' al día':'')+'</summary><div class="mfams">'+resto.map(function(z){return z.html;}).join('')+'</div></details>';}}
return h+'</div>';}
var ESCS=[['ch',0.9,'A'],['no',1,'A'],['gr',1.15,'A']];
function escActual(){ var e=lsGet('rg_esc'); return (e==='ch'||e==='no')?e:'gr'; }
function aplicarEsc(){ var e=escActual(),z=1; ESCS.forEach(function(x){ if(x[0]===e) z=x[1]; }); try{ document.body.style.zoom = z; }catch(err){} }
function ponerEsc(e){ lsSet('rg_esc', e); pintar(); }
function escBarra(){ var a=escActual(); return '<div class="escbar"><span>Tamaño de letra:</span>'  + '<button class="escbtn'+(a==='ch'?' act':'')+'" style="font-size:12px" onclick="ponerEsc(\'ch\')">Chica</button>'  + '<button class="escbtn'+(a==='no'?' act':'')+'" style="font-size:14px" onclick="ponerEsc(\'no\')">Normal</button>'  + '<button class="escbtn'+(a==='gr'?' act':'')+'" style="font-size:16px" onclick="ponerEsc(\'gr\')">Grande</button></div>'; }
function reposicionHtml(c){
 var L = c.ln || []; if(!L.length) return '';
 var h = '<div class="repbox"><div class="reptit">Lo que le vendemos</div>';
 L.forEach(function(x){
  var d = x[2] ? dias(x[2]) : null;
  h += '<div class="repl"><span class="repn">'+esc(x[0])+'</span>'
     + (x[1] ? '<span class="repv">'+fmt(x[1])+' en el año</span>' : '')
     + '<span class="repf">'+(x[2] ? ('llevó el '+fcorta(x[2])+(d!==null?' · hace '+d+' días':'')) : '')+'</span></div>';
 });
 return h + '</div>'; }
function mapaHtml(dir,v){ if(!dir) return ''; return ' · <a class="comollegar" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(dir+' '+((v&&v.zn)||''))+'">cómo llegar</a>'; }
function diasRutaRestantes(v){
 var d=new Date(G.gen+'T12:00:00'); if(isNaN(d.getTime())) return 0;
 var an=d.getFullYear(), me=d.getMonth(), hoy=d.getDate();
 var fin=new Date(an,me+1,0).getDate(), n=0;
 var K={1:'lunes',2:'martes',3:'miercoles',4:'jueves',5:'viernes',6:'sabado'};
 for(var i=hoy;i<=fin;i++){ var w=new Date(an,me,i).getDay(); if(!w) continue;
  if(v.dias && !v.dias[K[w]]) continue; n++; }
 return n; }
function faltaHoyHtml(v){
 var falta=(v.o.meta||0)-(v.o.real||0);
 if(falta<=0) return '<div class="hoyfalta">Ya pasaste el objetivo del mes. Lo que sumes de acá en adelante es de más.</div>';
 var n=diasRutaRestantes(v); if(!n) return '';
 var pal = v.dias ? (n===1?'día de ruta':'días de ruta') : (n===1?'día hábil':'días hábiles');
 return '<div class="hoyfalta">Te faltan '+fmt(falta)+' y te quedan <b>'+n+'</b> '+pal+': <b>'+fmt(falta/n)+'</b> por día.</div>'; }
function cmpMesHtml(v){var o=v.o||{};if(!o.ant&&!o.antDia)return ''; var nm=MESN[(o.antMes||1)-1]; if(o.antDia>0){var d=o.real-o.antDia,pc=Math.round((o.real/o.antDia-1)*100);  return '<div class="cmpmes">A esta altura de '+nm+' ibas <b>'+fmt(o.antDia)+'</b> · <b class="'+(d>=0?'moktxt':'mbadtxt')+'">'+(d>=0?'+':'')+pc+'%</b></div>';} var p2=o.ant>0?Math.round(o.real/o.ant*100):0; return '<div class="cmpmes">En '+nm+' terminaste con <b>'+fmt(o.ant)+'</b> · llevás el <b>'+p2+'%</b> de eso</div>';}
var LOGO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAlmUlEQVR42u19e3RT15nvd86xnpZsSZEtP2RhbBPHBkzDw7khZApOoaSN8ZTEGGonLSEraUczt+29XSXpZG6bTjpNbqdt0ozXNKF5AZ6EkKEFGkKcYHNbAq0JSU3B1AHzMLJBtrFk6VjSkXx07h/yJ7YPR2/5QepvLS2DfXS0dX6/77n3/jYFABTMyt+s0LOPYJYAszJLgFmZJcCszBJgJovLzeqtVqv6ZhjrzTJOFGomv1xu1mC1WjNn+jilXhXllaabYJwzd3Ak8FarNbNlZ0vOzQD6yhUr74n0PWbaa0a6gJadLUYAgObmZo/ValW/+KsXH16+fLmbZdn+ivLKXJeb1c+0MVeUV+YCANxxx7J7FWrF+1se3hLQ63TrK8orc5ubmz0z1TXQM813utysvrGpcQiBr1pY5dRoNdvwmpovrGKztBpH/Vv1M5K8e/ftdQMA2Gw2urr6jt2uUe9FvU63niT0LAEiaH1zc7MnS6txIPAWS9E2jVbDsG6WZ90sv2hRFbNsydJtAAB/7/97w0x6kH/6qCMAALB+/f27zGZz0DkyAs6REVhQeauiuvqO3YXmuR69Trd+plmDcCAwnVr/k2eeVWRpNY6WnS3GgN//vCnPtHHY4QDWzfIarYYx6PUw/3O38/ieP7S1FdTW1fFZWo1jplgu1O6qhVVOAICOjg7KZrPRzpGRCdf29PRsz7klZ+uZ7q4BfN/frAUQaz1QYDflmTb29l7mWTfLWyxFzN2rangS/P5LFxkAgCytxjFTtGj5ncvVAABVC6s24u+qq6uFVatWwoL584O67OzwtaWlpQ9l6bKukNbgb5IA6OtbdrYYX3vl1RaLpWgbAEBv72XeYili7l23boLWI/gFc4p5lmXXudysHh/8dMvRY0c9AAAKufwe/J3DMcwAAMybV0YjEcj33Fp+226jMedVDB7x52eeAC43q2/Z2WIUa/2wI2TNFy2qYsTAk5o//vNXWVqNo7aujp8JBPjJM88qyP8j+Cg+jxfmzSujpayBa9R7saK8MvdMd9fAdJBgSmMAl5vVo99+8VcvPoxaP+xwgNjPS4EferghogwPO0yYLUynKSX9f5HZ7Bb/3efxwuW+vqD496dOn56gfJ92/7Xe4XTumervQ0/lg0K/jSZ/2OGAYYcDSktKEgIfAIBl2XWk/51uGXWz9fGCDwBhl2Drs3OkS5hqMtNTpfmoJcuWLN1WXDwnbPLvXlXDF8wpjl/zx0mD/varZz+9NhMCwLlziy16vYGPB3ySBAsqb1UgCUpLSx8yGnNe/UwRgNT8qoVVTlOeaWPflSth8CO9LxL4KJzfX2+1WtXUU08J05kNYBxy/vz5cvT98YCPYjabwySw9dk5kgRT8b3oyQafzI8tliIG/X2y4GNRKJLZnWrJ0mocFeWVuRWVlZsSBV9MAnQJSILm5mbPli3FspuSAJHAZ90sX/0/7nwtWfDJawUhuHo644C9W7bQAKH6f7LgA4TKxgAA5kLTDSR4+eWLgcnMDjImy+fjv8XgP7Bhw45Rn+/BVMBHU1tRWbnJarU+2tjUOERmGFMlrUqlEgDCQVsq4AMAjKeIYXegUGoajEaAM91dmzFVvCkswP69e5ksrcaxbMnSbQg+AEA84HNeLi7wxdH3E49v5abLDaAlSgX8CS5h3BIAACiUmga9Trd+suoEaSdAy84WY2NT49CLv3rxYbLAc/eqGj4e8D0+T9zg6/UGfjrdQHNzs6eivDI3QyZvOHv2XDBV8Ml5A5IEao1+J5JgRhOABB/z/HijfZ/XmxD4+LtxN6BubGocmuoCEEBoejodmi+eNBKLWqPfOaMtgNVqVdfW1fEtO1uMGq0mYfC9Pl9C4JNWAN0ALiSJNsaK8srcaK90FIDSBT5pBQAAXKPei+lOD9NGgOV3LldnaTUOlmX7DXo9sG6WLy0pgVTAdziGmVjga7QaZuXKlWuiAS4QJvtMd9dAtBf5/ngIkYj/T0bzxSRI9yxiWuYCpEx/PLV9srQrBX60z0TwS0tKoLPzJP/YNx6TYyYgVU+3VG28BQCg5nOK+wCur9xBWbRwoaZ4bgn1pz8df7fmC6tY8ful7mm1WtU+r29kssAPZM0TcqgByjkyEi4ZAwBkZaqK0xUPpEwAfDAtO1uMQIEdfx/J9KcTfNbN8nv27GEOtbcL80rKCsTAWa1W9aibrReE4Oqr9oFNAb+Xl8lVDBZfxACRgPT09GznxwL780wFR0YVVXzvyTev4T3bPmjXYFS+/K47+5KJ9GOBT84a4vXnLrpAKfNyAAB9tgvqGUEA1P7XXnm1BRdzLFpUxUjV98Vmnyztxgt+kcUCrJvlOzo6qNd37KCIB7ZjaGhwc0V5Ze4ddyy7l8nI+PWEIss44A88cD9tv2p/8/Dhw613Ll/OAACc7b3qHLKd1zZsbHjlrXPuIP3nVvjksp+Suc5SWJjxsI6mPFPBEdQ8q9Wq/q+WlrXuUc9bJlOhf+2aGtlkgY9jP9jaFvAFVAqlzMt5WEeTw+ncM60EIE2/RqvZhku4pLRfrPmJgo9a33aoLXiwtS1gt/fJyb+bTIX+1TV/900EvrXDRwMAeJfcI9QuyRRMlgXPff+eOf+G5Vupz7g27HgZU9X3h3nmSNuHwf0nRilLfzsgGcglXUZjzqvOkZFwanvPqlUUgpWMyZcCnySAzWajP+q8DEqZl/MFVIpcHeSn6gqSJgBW+554fCs3vnKXYd0sf++6dXFX9xIBHwAAzX2k6+5ZtYrq6jdCTj4tfO72pdTKNXfByspCXiWTbZ4Q+TJMTZDn21rfe+89TB9dblbP+Xxf8gYC4dm494d5BgCg/ZIDDr51XFCdOEQVZPaEXQQJPknEtWtqZGICcBw35PX5jMloPimnTp+mMR7gfOyuoaHBzdNGAFzVg9pvsRQxUuv30gH+j55+Zkys9WLJL6+nvvDouuCKmrvCD3+1gYm6aihTqdwBABCpSIUkEBMh6DzKRRqPyVTox8mdZDVfCnwkABkLpBoQMskS4Invf1/lco3QJpPpiFwhp/1+v7D88yuFdIPvcAwzP/3Z84Fo4GcbyqgNTz8vFG34CsU4BoXmt/8KGWYDNVengvNegS5V0RGtRmBsbFFgbGxRpL+f9wphMs3VqWD1XaWUsGwpeHsuM/aLp6VrA6Nu5sLFi2AwGCilUgk+jksb+LY+O5fBjPHXFdGZ7/F49k4pAVp2thiXLVs6/MiWRx7UaDV1qP25eflCusF/ofklLhr4VSsb4POPPCpQtqv0Ox1DwqdXAtTaDcuoVXOubx6KRoBYQhKg2+GljCoZPFqi4W/5fA1tUJupqxe6/KOjbsnvceXKFTAYDFQ6NT+DGePt9j65RpPFAwBkZMgXmPMLtg1dGxydMgK89vp2BWq/3+8XAABQ+6cS/PzyeupaeQ1c/t1B+vzZPhgrKAEx+AhiMiQgzT8AwF8GWHi1Zwjm6LX0agPDB269jb672ESd+PhkIBoJCvLzqXSAPzJ8TsDPQQKkagUSrgTu3bKFztJqHFULqzZqtJrQYMZ/xruQIx6f/9PndkAssw8AoDpxiMJoHwCgIEtJxQNmouADACCxnnjnNHz/kyEGAODedevgJ6/tVuSX10dUpBMffyykA3wyxiCvUSg1DVNWCh6fA5+wBl5c8k1kOlcq1Xvl1VejgoXgoyD4azcso9BURwI1FhGiXdPt8FKrjBoAADj41nFh609bhfeHeWZlZSH/wzefhWgkICt56QCfDDKxRDzpLoBc5WM0Gnf4/X4Bt265R5x0OsBvO9QWPPbHP+64b+3fdQ0MOm8Vm1YEX51zOwAA8NmVwBu0QFcWUqW5WnBzY6BVZFDXfGOUUSWL6NcjvSKND0nl5sagl6ZAUCkoYdANHxztgZLFJfRqA8NbvnwPffy3b0vGBKOjbiYYpP2WosKMdIBvNpuDZaVzmXM9F4IAADK5ar3b5fzxlEwG4QZNh2OYMehDZjHRhRxS4F/u7YXXd+yghoYGN1MU/b54IgQfAKZApMjysq7XHlw+IZolSFTwPnhftAIoW3/aKhzu6mNWGxj+Rwf/oBBbKHLsE+b8I4B/sLUtYOuzc9HABwjtOiLfp1YqFk0qAbDOzvn99QicfpwAic7li32+Qa+HF5pf4nTZ2TsAADK1mt1iU+kLqBQAALRueZgY/rL88ENqH2LTTgIx+Pg5JOEAAP7527+A94d5ZrWB4f/tqW/dUHvwBVQKD+toQlcgBb7NZqMPtrYFAGBC/BMJ/EWLFsHaNTUyvFahVJVOGgFwDhp/kqCmovkAABZLEfP22/8dtNv75A0NG6xINrPZHMQvLw580PwDAChqKiRB7nf5hH6XT+h2eKlEiYDvwXtIkewGBfnOE8L7wzxz77p18LUHH5wQ+CllXs7hdO7xsI4mqcKQzWajT3V9ysULfpHFAnq9HmruqaHxGrVGv3PSXQC5A1aj1TCpgo8ZxMHWtoA2U70BrczXH/ra10itx5/o+yNJ+xB7A0ikNYhGBvHfSeClwKcrCymSjINXgtTRn/8gCADwg6efFpYsXkwhiJyP3QUAkGcqOEIGhLHANxeaFCT41dXVQpHFAuh6715Vw5sLTYpYVdKUCYAbIMnoHweRCvilJSXw9tv/HQQAuHTZ1g4QWojBZGT82maz0SPD5wQp7Y8lUiQgtZkEWwy6WOtjaf6ELKnDR//g7d9TAAAPb97MI3n5scB+AIAz3V0DHtbRhHsDY4Gvy84GEnyNVsPwpnLQ6/WAM67kzuNEs4GMeM0/LrS4ar+6kfxbquADAPz2nWN0kHM04SwdrrMffzBy1H6x+MvyBVILI5FAHLSJwU2ESPHIBy/to1dVlkLGii9D1cojgv3MEY7jZbUAsGd8DmWPrc/O6bKzFfGALxir6DtKlLxGq2HM+YWgUAXC4GcqlTv4sbHfZxvKXrHbz8l12dm1ALBn0lwACWSy0T6CXzCnmD98+DCMDJ8TvtrYeDCcm45rf7xmLXDVBYGrroTcQjzAR3tPtM/zDH4C/++//jMIALCo9j7Bbu+TK5SahoryylwkOedjd0mBn20oo6KDrwiDr5LJNt9i0G9ZvWbNO8kWhRLaGFK1sGqjwzEMnNfPgz7+0i4Jvrhw9Jvf7gVddvYO9P24Dg+132Qq9PsCoCDSP0U0UMTRearanCj4GKf89p1jdPBzHwZX1NxFdy1eDLY+OwxeG3wWADYDAHhY13Pi6eRsQxlVVpwF8YKfk2NsAQjtT/zlCy/AiWGARGOBuCwArrk/+uGRGvL38ZZ2EXyDXj8B/D+0tzEnPv5YQP8Y8nNLfi7WimgS7OoTgl19QrzgpAo8eX/yc6Wkc//vqG6Hl+q57dEJViCUNnOdmPJKgW8xWwQEv7SkJCL4Ljerd7rddowDTKZCfyJxQFwEaGxqHNq7ZQudIZPfYF7i9fcGvR6wZgAAUDCnmG871BY0mQr9pPnPkMkbxM0TwoMl8n8pIsTrEtKh9bHABwC4dPIENbT/wITrxq1AKHMYJ74U+HkFeUC6SinwBweHGp1ut528/6RYAJwDsJgtgs/jBYVKzqQCPpn+cD52l9j8i9OkeEXKGqRCBHy/WOvjAT88t3CgY0IJm/TRnM/bAwBQVpwFC+bPD5rN5uC8eWW0GHy8Xgw+uXqpurpauB5DyWrTRgByE0KvrZeKZwNkPOD3X7rIfNR5GfixwH5cXobRf6oSiQhSgEYCXErjowHPjHRJj8V5lLP0t4M653aw2/vkvoBKQboBk6nQjxXPefPKaHK5e7zgk/WURCXuIHDUzdYzGRnjdX8/7wBp7Y8HfACAnvPnYWT4nDCvpOwIRsaCEFwdLfoPOo9y0dxAJLcglSrGYxni1XT5uSsRU1FfQKUYvBKcUBEEUMF1K8DuMpvNTQi+xVLEkDl+LPBxCt6g14PJVOjHWAMgvrWCCaWBOPnQa+ulUgEfAOByby+YTIX+P33UEYh3q5O4HhDtwUtpb7yAJnJtrDFITVxNKGePxwFFFgtotJqEwE+HJJQG+jzelMw+zhvo9XrA3bTiJdrxLKAkza78XGg6m5wUSodWk2Lpb4fBK0Eq6DzKiUnISYAtvgYtl8lU6PewjqasTNUNnyFO8+LVfHIuZtIJEMn/J6L5Ex7eeH0cmx9kyOQN4wGgPBES8NmVID93hZIigfqTVlMmd5IZVVTxmdzJpPzkBXv/Cveo563xukTMABWJ4GEdTX328c0btgvXlcDpBHEgSIKfqVTukMlk30XliBf88TkBIZFMIKkOIeQ8dLzgk3v/xeYvkeYHUnEABmBoDcQWIbRsuitpLdHrdJDMfESeqeAICXY0SQV83Is5qZNBqWi+GHyHw3HDzpkz3V0DUrtpxGyONC+ARLhOhpBv5unMHwBc3xyajCQzzRqveHxcJ35vEnyXm9VfG3a8PBlmP21zAfGATzZ+iJVqRlohk6ggEeTnrlD0mM/6wLx5t/SefCOpfoJomXwBlSLeF7q3eDdsmM3moBh8p9ttJzerRAJ/OEUipGQB4gEf9/5HG3DbB+2aRCJpz+AncRMBAKBDtQQAqJQaMitlXi7eFzn9Gw4kI1ggHJMYfHHNBC1pJPCTJQI9WeADwA3gi1mP/8Y2K2MB/65JsbNMxuevxwKJyVV7/4pkyJJnKjhC/g63l0vJwda2QCzwxZZUCvBkKqhJBYF6vYEvLSmJGFFLaT45aPHgxy1ARD9ht/fJsw1lILYCsVYHhYNNQbGyorzySDLf1TXqTcr/X7X3r1ArFT34/zlzSq8AAFy61JPv8XGduML6qr1/xfr198t+8fzzUcEnn2csbTeZCv19RNaRdgJg1Er6pXjBn6iYoUUSo4oqHqAL9u3fv+fW8ts22e035uq4MogMAj2Dn4BS5o1aHRx3F1YfgDW5b6qKeQW5epeQt8j/sLLbqaDzKKc3FoA6NP8xoVIXCAT+PR3gT4kFSFbzI0m8+fl4RiAAXJ9c8QVUCogQE4R8cvTMYSrFbu+Tm0yFfjI+YDJktTX31NBSAV8i4Iu7qKYtBsCZukytZvf1KHQ4ac3Hgc6bV0bjzBj6ZvSb8eTcEbTuhtLxTAAfyYrfC4s/LjerVyg1DWQOTzbSIJtnxVIih2OYwZQZC2xpDQLJSP3s2XNB0vwnqvmsm+X1egNvLjQpyMj8THfXgK3Pzs0UjU2XqHNuh6DzKEfm/gAAdyytli2ovFWBgXS0/kmTJXETIFJDRJKp5KClNF9sphbMnx/EKDs8Rco6mmJNoNyMQtYHyEDRbDYHyXgqWfDJTqXiFDRlAmDESqZpkSpRUoOO5p/EixfyTAVHxFvC4q0PTIfEGoN4OxuC43KzeiZDVkuW1ZMBH59tpIZUaSGAvbV1Qihss9no3t7LfLLgkw0g69ata7JarWqcFj7T3TXQ09OzPZna+0wUcYaCcc4Tj2/llixe/FCRxQL9ly4yyWo+LgQhZ1ET6R4WFwFMa9Z4AQAoin4/UiCYCPj4b2T/qJutJ6eF+bHA/nitwEyI7GNdg/6fLA+zLtdLZrM5WFpSkrLPZ90sj0WgRBUnIbORqdXsRlNz9uy5oCNCYSce8EnBdqsYaOL2qcm0AuLybbL3iTZG8S5hD+t6zmq1qq1WqzpDJm8Q7+5NNuBLNgOImwDYE6C5udmTZ8p9I54oPxb4Po83HLhkyOQNaP5xbYCHdTTFevDxZgtKmZdT59wO5IvWLVeQL/HfEyFFJBKQ0T/nY3d5fFxnc3Ozh3W5XgIIrQKKpkTx+v9kA8Ck0kCKot83m81Bm81GSwEdL/jixSX4UDDbQD8m9XDjAZ8EPZF1hKTvjocMWGsQjzPbUEZNSP1Y13MuN6sntV+8tzJRQf9PLqNPtHtowmkge+zo79ANdHR0UFINoBIFHwBgbvHcTXiQNKaEWZmqYqkmEdHAR+CTAT0WGWIRgSQBeS1qf5ZW42Bdrpdwe3c68nzWzfLYg4jcaJJ2AmBF8O2zZ69JzdunAj4AgFKtgmVLlm7L0mocT/7LPwfRFZAZQSzwEwGez66c8EqECLFy/QllagCoq8t8FCB0Wuryu1Zs0OsNvEGvT0uRp6Ojg0rW/AMk2COoorwyd+ja4GjVggXl7OjoQpfLRRkMesjOzgZsF5cM+AAAw8PDQl5eXmXtfbV9mx/e/GHDxg3C8ePHA3OKio9xgbFvazRZfCzwo4EtKHNAUOYAt6BKGCsoAd6gnfAaKyiBsYISoD0qCq+luUHJ+8ky8yHguSptgVShvoAZzBh/begSE/Cx1R3Hr/VbrVa1yWQ6otFqGLlCTkebKk9E9v/ud9SV8XMYPZ7RTZNmAbBUG2Ldif+Fuaf4rBypQx7iPU7N4RhmNFrNNnQFGBhmZaqKY5n8aFruL8sX8BVrDOS10axDNMIpZV7Obu+TazPVG7DsiwdopTOTSdX8AyQ5G3imu2vAlJc7pMvONpLBoOQkUQJn6Z09ey5YZLHQ466gEa3Ome6uAb1O16TWwE7SCkSaCkbQU33AeA9cbCre/YNRvnhMCMjQ0OAeAIDXXnm15baK2zb6vN60Aa/RaphUzX/CFgABAQDo7PzzN9EKkANJFvxwtnGoLVizdm39tWHHy1ghrCivzMX+OmTePpngS1kFKWtAjgHHRXbxHhwcaqxZu7a+YE4xny6zj9H/b985RmNslOzZAXQy2o/FGmxwYLPZ6GTNvlhsNhv91JNPUqM+34PL71yu3r93LyMmgVQNns+uBO+Se4R0gy8mAjalFFsCdAkk+C07W4w0w9RkKpU7+i9dZNI5s9d2qC2IU+KxaiZpJQBAaHIIizW67OwbYoFUj1C12Wz0v2z93lu1dXX80//6Y/qJx7dyWCQiSZCM1tOVhVS0Vzz3IEmQk08LlQVDEHQe5cTgHz121COTyb4LENoLmU7BdnKpaH/CWQDK8ePHAwAAc+eUXBMo+C4AgN/vp+bOLU4Z/LCfGx1dyI+N/e/n/+OFZw998AFfXV0tO/DuAafValX//g9/OJlBw5mM4FAdpSzK4BZUCbFAp3KyKConK/xdZXlZwGgU4VeQDRkUvI7KyaKEQXfEe44VlMCXbs+h8mVDwm/27gUa+E3Dw8PPkOD/5JlnFU632/7nj44vTpf5R+3/8OiRjJAG85t8Pt+ZKSUAWoED7x5wekbZU7cYjRt8HAcZTEYwOyuLcrndQirgY2xx4cIF+tjRo9/96c9+9otB+0D9po2bLj/+xOMjSAJzfsG2kcG/5Cou/7GiUBlkRrRzga4spOQLzZSgUkwAXQz4DQ+C+BsSAt+P9yMJ8eM7A8GO9n30b/buBW2megNqoRj803/+hEn3oo7/fPFl/+iomzGZCv0DA1ebUrlXSmcG4QlarlHvRXOhSZGpkvNzS+ZR6QCflAXz5wd/8fzzuQChc4knnhIqgF6nX6/W6HeaC02KntseFejKQkqWlwWrjJq09QVC+UmhDFZWFvLv7tsHP3r6mTE8saNlZ4txzRe/+MXW9957r7aujk83+Bj5tx1qC+JhWSTxkpWUF4ViigZg2j3q9TMAEEwn+Fjr/s63vjXw4Fcf/EptXd2HLTtbjLV1dXyodd0/qpubnXvyTAXFPT09zyr6/rXB1L9C/rnbl1KCOS/YePviUCt7l09oH2JvaBknFiRMY4mRKterBOwW+uUy4/67tPAlsgLnYR1NfbYLAxXllbm1dXUBADhQW1cHb7S02MlDs9MV+bNulj/Y2jYG482z+mwXpvfUMLQCzc3NHqMx59XS0tKHUGPTBb7YEvBjY4/8srl5n7Q1CDVKpBUFu8kswVSxQr6o9j4BACBQWhn+3IIsJUX2DCzIUlLlepUAAKCWMfvX5CivYRBHrtnvv3SRub/+q1yf7YKaNPmcz/elj453bE+3yUft3/76dsBDs+QMtQSLTNNqAcLR8C05WwHgIQQ32j6/ZMDXZWfDqdOn6QXz5//6n/7hm7v+/ee/eLe2ru7A4OBQI3n6l8Pp3GM0yraDTNOAc+R2+y44eXgXtWTxYgrJOd6RY2yVpYjpt1RNOFwqU6nccYtBvwXgehcuciyHDx+eMO/+wx8+9ZVAIFDTc+7s1ydjESea/kPt7RRRZOpMx71TPjsY1wqc6e4a+LT7r/UIphTINpuNThZ8/Gmz2egMmbzh8a1bX9uze/d/KJTKA7V1dbzLzepbdrYYK8orc8VVsWxDGbVk8WIK7yMYq8K9eNRKNcx3Xw5fi80XI4EPANDefjhceQv4/c+f/svJ7R1/PPb1dKd6pAUg075Uj4pLqwuI1xWk6xRNgBt3Ed+9YsVbX66tPQAAoFAqD9yxtFrmGvVeHN9SFrMFGwm+uP8e+Tm4du+RR62cY6j/zs1bHjlbtbDKmW5/L5afvXZQOHk4ZHDSZfrT7gJwuph0BeMmO6IrSPYIVbG88eabG3/5RlvDwjx4k6LojD991LGvZO7cXSZTYYO5MCvcdjVaFy6dVmvCdYnRNml2doae/TgIao1WMyngk1H/ycO7yKi/M52fk9atYeNWYECv09XfWn7b7vGFigoxkBzno7w+TkgH+K0dPjro/JSz29vlJwE2mkyF67O0mtf1Ot1+AGgQ+fyUwAcITVih/x91s/WTZfLJE1QIv78n3Z9Fp/Nmzc3NHizXftr913pzoUlh67NzpKaHjlBND/inTp+myWVXoYCvT45jwN/FC75U501yw4bD4YCDrW0B9P8rV65ck2xrlljgs26Wf6H5JW4y/P6kEQDrAghAT0/PdjEJ0nF+LoKPS6HFrdZxtxFqapHFAhZLUVTwxe1YxOCrlEro7OwEu71Pjmv7Ob+/Pt3mH8Enj8pN11HxU0IAJIHValUPDQ1uliLBZIK/oPJWxbra2vUA1+fIxQcsSIEvPjv4hq1atMCfPXsuqMvO3pHqid2xhARfzlBLJvOz6Mm6MQaFSAKA6B0sEj1LTwp8WrdcYTabgxkyeUPoNHBvz6nTp+lbMwNxg99/6SIjtU/P6+EY0vzjkTbpll/+8gUgwU9nxD+lBBAXidAcS5EgmZOzpcBfU60MB3xPPL6V8/i4TlufnSOBjAU+/lu897G39zJPmn801+nw+fjze1uf5HCJ11SAP2UEONPdNSBFAl12dlKnaCL4JlOhH80+CX6RxRI+3MrDOpowdUsGfPTxHR0dFGn+cTdTugI+sdmfCvCnjABIgqGhwc0kCcQxQSqnaJLRfmlJSfhwK87n7WluOZUS+MMOB5w6fZomK4zL71qxIR0B3+XeXpgu8KeUAChiEuCysnSAj9F+wZxi/raK2zZWlFfmenxcZ9B5lPufVuu6ZMBHTT3x8ccCdvaIt7l1LGk71BZ88v/8QMDWMVMN/rQQALMDclnXqa5POalScaLgk23rCuYU89/+zrfuw3RQEIKrBweHGhMF36DXQ0dHB2UyFfoRnFE3W5+K/2fdLL/99e0Tijx9tgvqqQY/7ZXARLKD8UJNE7Zh/ajzMjhHRsKlY5z8GBmO7xRNBJ/suYvv87Cu5zJk8o+8gcAGMfixGjGh+ScJm6j/R1+PWn+wtW3Mbu+jsbw7GRW+GWsBSHE4nXuyMlXFnI/dpZR5OVufnTvY2hZI5PzcSODfYtBv0Wg0+6xWq9rj4zoPtrYFEPREunDh3ns0/wAAq1bVJDSBhoEeaj1p8lNd0XNTE4AMDj2soylSVy8p8MkjVKXADwdr4yeecT521+HDh8P3jLcFG+552NSY3wUQ2hchPjwzHl//o6efGcPFHNNp8mccAUhrkKuDfIof3E5uuY6k+WSrWinwXW5Wf3dNTT/LsuuwKtjefjg8pRsP+Aa9Pnyw1csvXwwAhHZJY6PsSDk9Cfz3tj7JkVo/bvI3z5TnngEzSMZz7M16XWC/uEW7c2QEzGYzVFdXCxZLEaiV6hsOWZBayPHAhg13PfaNx17BjSw9588r4t2XP+xwwKmuTzky/YsWAIr8fGDchcnR16djDd9n1gKIrUGf7YKaDLwwPtizZw/T2dkpeYSqGHwAgFGf70HcX8j52F1th9qC+ji3Zl/u7QW7vU/ucDr34MlmlpK5d0tpO+tmebHGo7kfC/gzptvX3xQWQIoIDqdTrdfp1qNFONTeLhxqbweTqdD/T9ZHFXmmvDdlcvl7UuBjwFfzhVXsme4u4McC+20220OxDltg3SxvsRQxbYfagrrs7J1DQ4Nwx9JqGQBAYV7+Q+MWhGHdLN/R0UGdOn2aPvHxx6hMYeA9rOu5dK3dmyxJ25KwqRCSCGSGsGTxYqqnp2f7j59+uvHedetueN+7+/Z947FvPPaKWqlYpDcWHPu/zz4dVxOJ7219kvOwjqavNjYexLUOy++6sw9rFFi3J4NVzsfu8rCu52ZCgPeZIYBaqVhEPlC9TreeyZDVYq/haEevV1dXCx0dHdTLr7wsqyivzB28Nvhs3bp1TQ88cD8dKe0jN2CQ1Tm9Trd+/PCoCaLLzt7BjwX2cz5vz5w5pVfOdHcNiMc8S4A4gU70PQqlqpTJkNWKT+IWi5yhlsyZU3rlqr1/Be4iIv8unqXEqN0x1H9neHyarG/j52BDBgQ+0XHPFHJMGwGSATsWEQBCrWelLIM2U72B83l7FEpVqZQWSwn6cfFnhOoKiYM+EwkxpQRIJ+gkGFKgkH9nMmS1pKbqjQXHInX4vN7Snd2F78F7Rbp/ugkxlWSYMgKkAr4U2PGIGJRE7kMCn6ykQoqpIsFNQYBUSDBdkqpF+MwRYCpdwc0C8kyIBaY9C0h3MHgzynRmBDOyDvBZJcVMrAvcVJXAWUm/0LOPYJYAszJLgFmZJcCszBJgVmYJMCuzBJiVWQLMyiwBZmWWALMyS4BZ+azL/we2jQklN+WNHgAAAABJRU5ErkJggg==';
/* ---------- por que se cayo el cliente ----------
   Va adentro del cliente atrasado. No dice "anda a verlo": dice por que. */
function dejoHtml(c, v){
  var l = (v.dj && v.dj[c.n]) || [];
  if(!l.length) return '';
  var d = dias(c.u);
  var h = '<div class="dejo"><div class="dejotit">Dejó de llevar'
        + (d !== null ? ' · hace ' + d + ' días que no compra' : '') + '</div>';
  var porFam = {}, orden = [];
  l.forEach(function(x){
    var f = x[1] || 'Otros';
    if(!porFam[f]){ porFam[f] = []; orden.push(f); }
    porFam[f].push(x[0]);
  });
  orden.forEach(function(f){
    h += '<div class="dejol"><b>' + esc(f) + ':</b> ' + porFam[f].map(esc).join(' · ') + '</div>';
  });
  return h + '<div class="dejopie">Esto es lo que te compraba y dejó. Con eso arrancá la charla.</div></div>';
}
/* ---------- como cerro el mes pasado ----------
   Solo los primeros dias del mes. Despues estorba. */
function cierreHtml(v){
  if(!BL.cier || !v.cier) return '';
  var z = v.cier, pc = z.meta ? Math.round(z.real / z.meta * 100) : 0;
  var e = qest(z.real, z.meta, 1);
  var h = '<div class="cierre"><div class="ciertit">Cómo cerraste ' + MESN[z.mes - 1] + '</div>'
        + '<div class="cierbig ' + e[1] + '">' + fmt(z.real) + '</div>'
        + '<div class="ciersub">de ' + fmt(z.meta) + ' de objetivo · <b class="' + e[1] + '">' + pc + '%</b></div>'
        + qbar(z.real, z.meta, 1);
  if(z.ant > 0){
    var dif = z.real - z.ant, p2 = Math.round((z.real / z.ant - 1) * 100);
    h += '<div class="ciercmp">Contra ' + MESN[z.mes - 1] + ' del año pasado (' + fmt(z.ant) + '): '
       + '<b class="' + (dif >= 0 ? 'moktxt' : 'mbadtxt') + '">' + (dif >= 0 ? '+' : '') + p2 + '%</b>'
       + '<div class="ciernota">En pesos, sin descontar la inflación: mirá también las cajas y los litros.</div></div>';
  }
  return h + '</div>';
}
/* ---------- el pedido ya armado ----------
   Arranca con lo que se llevo la ultima vez, con las unidades. El vendedor
   toca + y - y se lo copia. Lo que toca queda en ESTE telefono nomas. */
function pedKey(n){ return 'rg_ped_' + (quien || 'x') + '_' + n; }
function pedidoDe(c){
  try{ var j = JSON.parse(lsGet(pedKey(c.n)) || 'null'); if(j) return j; }catch(e){}
  var o = {};
  ((c.uv && c.uv.a) || []).forEach(function(x){ o[x[0]] = Math.round(Number(x[1]) || 0); });
  return o;
}
function guardaPedido(c, o){ try{ lsSet(pedKey(c.n), JSON.stringify(o)); }catch(e){} }
function pedMas(n, art, d){
  var c = null, D = quien ? elVend(quien) : null;
  if(!D) return;
  (D.dias ? DIAS.map(function(k){ return D.dias[k] || {c:[]}; }) : [D.cartera]).forEach(function(z){
    (z.c || []).forEach(function(x){ if(String(x.n) === String(n)) c = x; });
    (z.p || []).forEach(function(x){ if(String(x.n) === String(n)) c = x; });
  });
  if(!c) return;
  var o = pedidoDe(c);
  o[art] = Math.max(0, (Number(o[art]) || 0) + d);
  guardaPedido(c, o);
  var e = document.getElementById('ped_' + n + '_' + btoa(unescape(encodeURIComponent(art))).replace(/[^A-Za-z0-9]/g, ''));
  if(e) e.textContent = o[art];
}
function pedidoHtml(c){
  var a = (c.uv && c.uv.a) || [];
  if(!BL.ped || !a.length) return '';
  /* OJO: en 163 clientes la fecha de uv es POSTERIOR a la ultima compra.
     Son los que estan en la cartera de dos vendedores: el otro le vendio y
     la ficha de este se quedo con esa fecha. Mostrar ahi 'lo que llevo el
     07/08' arriba de 'ultima compra 09/05' es una contradiccion en la cara
     del vendedor. Con la fecha rara, no se muestra el pedido. */
  if(c.uv.f && c.u && c.uv.f > c.u) return '';
  var o = pedidoDe(c);
  var h = '<div class="pedbox"><div class="pedtit">Pedido para hoy</div>'
        + '<div class="pednota">Arranca con lo que llevó el ' + fcorta(c.uv.f) + '. Tocá + o − y después copialo.</div>';
  a.forEach(function(x){
    var id = 'ped_' + c.n + '_' + btoa(unescape(encodeURIComponent(x[0]))).replace(/[^A-Za-z0-9]/g, '');
    h += '<div class="pedl"><span class="pedn">' + esc(x[0]) + '</span>'
       + '<span class="pedc"><button onclick="pedMas(\'' + c.n + '\',\'' + esc(x[0]).replace(/'/g, "\\'") + '\',-1)">−</button>'
       + '<b id="' + id + '">' + (Number(o[x[0]]) || 0) + '</b>'
       + '<button onclick="pedMas(\'' + c.n + '\',\'' + esc(x[0]).replace(/'/g, "\\'") + '\',1)">+</button></span></div>';
  });
  return h + '<button class="pedcop" onclick="copiarPedido(\'' + c.n + '\')">Copiar el pedido</button></div>';
}
function copiarPedido(n){
  var D = quien ? elVend(quien) : null, c = null;
  if(!D) return;
  (D.dias ? DIAS.map(function(k){ return D.dias[k] || {c:[]}; }) : [D.cartera]).forEach(function(z){
    (z.c || []).forEach(function(x){ if(String(x.n) === String(n)) c = x; });
  });
  if(!c) return;
  var o = pedidoDe(c), t = (c.c || '') + ' — pedido ' + fcorta(hoyIso()) + '\n';
  var hubo = 0;
  ((c.uv && c.uv.a) || []).forEach(function(x){
    var u = Number(o[x[0]]) || 0;
    if(u > 0){ t += '• ' + x[0] + ' x ' + u + '\n'; hubo++; }
  });
  if(!hubo){ alert('El pedido quedó en cero.'); return; }
  copiar(t);
}
function pintar(){
  if(PAN && (VISTA==='pan' || VISTA==='tv' || !G.vs || !G.vs.length)){ pintarPanel(); return; }
  try{ document.body.className = ''; document.body.style.background = ''; }catch(e){}
  var v = quien ? elVend(quien) : null;
  var h = '';
  var viejoDias = dias(G.gen);
  if(!v){
    h += '<div class="enc"><div class="encTxt"><h1>' + esc(G.titulo || 'Rutas') + '</h1>'       + '<div class="sub">Datos al ' + fcorta(G.gen) + ' · elegí tu nombre</div></div>'       + '<img class="logo" src="' + LOGO + '" alt=""></div>';
    G.vs.forEach(function(x){ h += '<button class="vbtn" onclick="elegir(\'' + x.id + '\')">' + esc(x.nom) + '</button>'; });
    document.body.innerHTML = h; return;
  }
  fijarCat(v);
  var tieneDias = !!v.dias;
  var D = tieneDias ? (v.dias[diaAct] || {c:[],p:[],x:[]}) : v.cartera;
  if(v.ag){ var aa=agenda(v.id), hh=hoyIso(); D={c:D.c.slice().sort(function(a,b){function pr(c){var z=aa[c.n]||{},f=z.r||z.f||'';if(z.e==='visitado')return 9;if(f===hh)return 0;if(f&&f<hh)return 1;if(f)return 2;return 3;}return pr(a)-pr(b);}),p:D.p,x:D.x}; }
  var mk = marcas(v.id);
  var titSec = tieneDias ? ('ruta del ' + DNOM[diaAct]) : 'tu cartera';
  h += '<div class="enc"><div class="encTxt"><h1>' + esc(v.nom) + ' — ' + titSec + '</h1></div>'     + '<img class="logo" src="' + LOGO + '" alt=""></div>';
  h += '<div class="sub">Datos al ' + fcorta(G.gen) + ' · ' + (D.c.length + D.p.length + D.x.length) + ' clientes</div>';
  h += ppestanas();
  h += msgHoy(v);
  if(PAN && PAN.cta) h += '<div class="pwrap" style="padding-bottom:0">' + ppanCuenta() + '</div>';
  if(G.rec) h += '<div class="recado"><b>Aviso:</b> ' + esc(G.rec) + '</div>';
  if(viejoDias !== null && viejoDias > 2) h += '<div class="viejo">⚠ Estos datos son del ' + fcorta(G.gen) + '. Abrí la app con señal y se actualiza sola.</div>';
  if(tieneDias){
    var tabs = '<div class="tabs">';
    DIAS.forEach(function(d){ tabs += '<button class="tab' + (d===diaAct?' act':'') + '" onclick="cambiaDia(\'' + d + '\')">' + DNOM[d].slice(0,3) + '</button>'; });
    h += tabs + '</div>';
  }
  var pct = v.o.meta > 0 ? Math.round(v.o.real/v.o.meta*100) : 0;
  var oe = qest(v.o.real, v.o.meta, v.o.frac);
  var ofr = oe[0]==='mok' ? 'Vas bien.' : oe[0]==='mwarn' ? 'Vas un poco abajo.' : 'Vas atrasado.';
  var oc = oe[0]==='mok' ? 'objok' : oe[0]==='mwarn' ? 'objwarn' : 'objbad';
  if(BL.obj) h += '<div class="obj ' + oc + '">'   + '<div class="objtop"><span class="objtit">Objetivo de ' + MESN[v.o.mes-1] + '</span>'   + '<span class="objpct ' + oe[1] + '">' + pct + '%</span></div>'   + '<div class="rango">' + fmt(v.o.real) + ' de ' + fmt(v.o.meta) + '</div>'   + '<div class="barra"><div class="barin ' + oe[0] + '" style="width:' + Math.min(pct,100) + '%"></div>'   + '<div class="raya" style="left:' + Math.round(v.o.frac*100) + '%"></div></div>'   + '<div class="rango"><span class="objest ' + oe[1] + '">' + ofr + '</span> La rayita marca dónde tendrías que ir hoy (' + Math.round(v.o.frac*100) + '%).</div>'   + faltaHoyHtml(v) + cmpMesHtml(v) + '</div>';
  h += cierreHtml(v);
  if(BL.cmp) h += cmphtml(v);
  if(BL.met) h += qhtml(v, D);
  if(BL.rk) h += rkhtml(v);
  if(BL.pk) h += pkhtml(v);
  h += ritvhtml(v);
  h += caevhtml(v);
  h += cfbhtml(v);
  h += arthtml(v);
  h += othtml(v);
  var atr = 0;
  D.c.forEach(function(c){ var d = dias(c.u); if(d !== null && d > v.al) atr++; });
  if(atr && BL.avi) h += '<div class="aviso">' + atr + (tieneDias ? ' de tu ruta de hoy' : ' de tu cartera') + ' hace más de ' + v.al + ' días que no te compran</div>';
  if(v.ag) h += '<div class="top3"><b>Agenda mensual:</b> abrí cada cliente, elegí su fecha y estado. Si no te atendió, marcá <b>No atendió</b> y después cambiá la fecha para reagendarlo.</div>';
  if(v.ag){ var ah=agenda(v.id), nh=D.c.filter(function(c){var z=ah[c.n]||{};return z.e!=='visitado'&&(z.r||z.f)===hoyIso();}).length; if(nh)h+='<div class="aviso">📅 '+nh+' cliente(s) agendado(s) para hoy aparecen primero.</div>'; }
  var conF = D.c.filter(function(c){ return c.fg; });
  if(conF.length){ h += '<details class="avisoF"><summary><b>🛒 '+conF.length+(conF.length===1?' cliente con la góndola vacía':' clientes con la góndola vacía')+'</b> <span>tocá para ver qué falta</span></summary>';
   conF.forEach(function(c){ h += '<div class="avisoFl"><b>'+esc(c.c)+'</b> — '+c.fg.f.map(esc).join(' · ')+'</div>'; });
   h += '</details>'; }
  var _arr = D.c.filter(function(c){ return !esGenerico(c.c); });
  if(_arr.length >= 3 && BL.top){
    h += '<div class="top3"><b>Arrancá por estos 3:</b> ';
    h += _arr.slice(0,3).map(function(c){ return esc(c.c); }).join(' · ') + '</div>';
  }
  h += '<div class="ley"><span><span class="sem sv"></span> Estable</span><span><span class="sem sa"></span> Comprando menos</span><span><span class="sem sr"></span> En picada</span><span><span class="sem sg"></span> Chico</span></div>';
  h += '<button class="resumen" onclick="resumir()">Copiar el resumen del día para mandar</button>';
  if(v.pre){ var pnd2=prePendL().length;
   h += '<div class="preBar" id="preBar"><b>\ud83d\udcb2 Precios tomados: <span id="preN">'+preCuantos()+'</span></b>'
    + (v.pre.cod ? '<button onclick="preAlSistema()">Mandar los precios</button>' : '<button onclick="preMandar()">Mandar los precios</button>')
    + (v.pre.cod ? '<button class="preSec" onclick="preMandar()">Por WhatsApp</button>' : '')
    + '<button class="preSec" onclick="preBorrarTodo()">Borrar</button>'
    + (pnd2 ? '<span class="rpest">\u26a0 '+pnd2+' env\u00edo(s) sin salir \u2014 se mandan solos cuando haya se\u00f1al</span>' : '')
    + '</div>'; }
  if(!tieneDias){
   D.c = D.c.slice().sort(function(a,b){
    var da = dias(a.u), db = dias(b.u);
    var oa = (da!==null && da > (a.cv||20)) ? 1 : 0, ob = (db!==null && db > (b.cv||20)) ? 1 : 0;
    if(oa !== ob) return ob - oa;
    return (b.p||0) - (a.p||0); });
   var atr = D.c.filter(function(c){ var x=dias(c.u); return x!==null && x > (c.cv||20); });
   if(atr.length){
    var gr = atr.slice().sort(function(a,b){ return (b.p||0)-(a.p||0); });
    var pl = gr.slice(0,5).map(function(c){ var x=dias(c.u); return esc(c.c)+' <b>'+fmt(c.p)+'/mes · '+(x-(c.cv||20))+' d de atraso</b>'; }).join('<br>');
    h += '<div class="tocavis"><b>Te toca visitar ' + atr.length + (atr.length===1?' cliente':' clientes') + '</b>'
       + '<div class="tocasub">Los que más te compran de esos:<br>' + pl + (atr.length>5 ? '<br>y ' + (atr.length-5) + ' más abajo' : '') + '</div></div>';
   }
  }
  h += '<details class="sec" id="hoy" open><summary><span class="fl">&#9656;</span><span class="tit">' + (tieneDias ? 'Tu ruta de hoy' : 'Tu cartera') + '</span><span class="cnt">' + D.c.length + '</span></summary>';
  h += '<div class="bwrap"><input class="busca" type="search" placeholder="Buscar cliente..." oninput="fil(this.value)"></div>';
  D.c.forEach(function(c, ix){
    var d = dias(c.u), tarde = d !== null && d > v.um;
    var m = mk[c.n] || {};
    var meta = tarde ? '<span class="cmeta rojo">' + d + ' d</span>' : '<span class="cmeta">' + fmt(c.p) + '/mes</span>';
    if(!tieneDias && d !== null){ var ci = c.cv || 20;
     meta = (d > ci) ? '<span class="cmeta rojo">atrasado ' + (d - ci) + ' d</span>'
                     : '<span class="cmeta">le toca en ' + (ci - d) + ' d</span>'; }
    if(v.ag){ var az=agenda(v.id)[c.n]||{}, af=az.r||az.f||''; if(az.e!=='visitado'&&af===hoyIso())meta='<span class="cmeta hoy">VISITAR HOY</span>'; else if(az.e!=='visitado'&&af&&af<hoyIso())meta='<span class="cmeta rojo">ATRASADO</span>'; }
    h += '<details class="cli' + (m.v ? ' vis' : '') + '" id="cli' + c.n + '" data-n="' + esc(c.c).toLowerCase() + '">';
    h += '<summary><span class="sem s' + c.s + '"></span>' + (ix < 3 ? '<span class="estr">★</span>' : '') + '<span class="cnom">' + esc(c.c) + (c.au ? ' <span class="nvo">nuevo</span>' : '') + (c.rg ? ' <span class="foq">★</span>' : '') + '</span>' + pfchip(c) + '<span class="tick">✓</span>' + meta + '</summary>';
    h += focohtml(c);
    if(c.fg) h += '<div class="falt">⚠ El repositor encontró faltando en góndola: <b>'+c.fg.f.map(esc).join(' · ')+'</b><div class="faltm">'+esc(c.fg.repo)+' · '+fcorta(c.fg.fecha)+'</div></div>';
    h += '<div class="cuerpo">';
    if(c.i) h += '<div class="dir">' + esc(c.i) + mapaHtml(c.i, v) + '</div>';
    h += '<div class="lin">Compra por mes: <strong>' + fmt(c.p) + '</strong></div>';
    h += '<div class="lin">Última compra: <span class="' + (tarde?'rojo':'') + '">' + fcorta(c.u) + (d!==null?' (hace ' + d + ' días)':'') + '</span></div>';
    if(c.f.length) h += '<div class="lin">Ofrecerle: ' + c.f.map(function(f){ return '<span class="chip">' + esc(f) + '</span>'; }).join('') + '</div>';
    h += dejoHtml(c, v);
    h += pedidoHtml(c);
    h += reposicionHtml(c);
    if(c.rp.length) h += '<div class="repo">Reponer: ' + c.rp.map(function(y){ return esc(y[0]) + ' ' + fmt(y[1]); }).join(' · ') + '</div>';
    h += uvhtml(c) + cohtml(c);
    h += phtml(c,'CELUSAL') + phtml(c,'5 HISPANOS') + fhtml(c);
    if(v.ag){ var ag=agenda(v.id), z=ag[c.n]||{}, opts=[['pendiente','Pendiente'],['visitado','Visitado'],['no_atendio','No atendió'],['reagendado','Reagendado']]; h += '<div class="agenda"><strong>Visita del mes</strong><label class="aglabel">Fecha prevista</label><div class="agfila"><input type="date" value="'+esc(z.f||'')+'" onchange="agendaFecha('+c.n+',this.value)"><select onchange="agendaEstado('+c.n+',this.value)">'+opts.map(function(o){return '<option value="'+o[0]+'"'+(z.e===o[0]?' selected':'')+'>'+o[1]+'</option>';}).join('')+'</select></div><label class="aglabel">Nueva fecha de reprogramación</label><div class="agfila"><input type="date" value="'+esc(z.r||'')+'" onchange="agendaRefecha('+c.n+',this.value)"></div></div>'; }
    if(!c.f.length && !c.rp.length) h += '<div class="fperd">Ya te compra todo lo que trabajamos</div>';
    h += '<div class="vfila"><label><input type="checkbox" ' + (m.v?'checked':'') + ' onchange="visita(' + c.n + ', this.checked)"> Visitado</label>';
    h += '<input class="nota" placeholder="Nota (compró, vuelvo, cerrado...)" value="' + esc(m.t || '') + '" onchange="nota(' + c.n + ', this.value)"></div>';
    h += '</div></details>';
  });
  h += '</details>';
  if(D.p.length){
    h += '<details class="sec"><summary><span class="fl">&#9656;</span><span class="tit">Perdidos ' + (tieneDias ? 'en tu ruta de hoy' : 'de tu cartera') + ' — recuperarlos</span><span class="cnt roja">' + D.p.length + '</span></summary>';
    D.p.forEach(function(q){
      h += '<details class="cli"><summary><span class="sem sr"></span><span class="cnom">' + esc(q.c) + '</span><span class="cmeta rojo">' + fcorta(q.u) + '</span></summary><div class="cuerpo">';
      if(q.i) h += '<div class="dir">' + esc(q.i) + mapaHtml(q.i, v) + '</div>';
      h += '<div class="lin">Compraba en total: <strong>' + fmt(q.t) + '</strong></div>';
      h += '<div class="lin">Última compra: <span class="rojo">' + fcorta(q.u) + '</span></div>';
      h += '<div class="lin">Le vendías: ' + q.ff.map(function(f){ return '<span class="chip">' + esc(f) + '</span>'; }).join('') + '</div>';
      h += '</div></details>';
    });
    h += '</details>';
  }
  if(D.x.length){
    h += '<details class="sec"><summary><span class="fl">&#9656;</span><span class="tit">' + (tieneDias ? 'En tu ruta' : 'En tu cartera') + ' pero sin compras en el año</span><span class="cnt gris">' + D.x.length + '</span></summary>';
    D.x.forEach(function(r){
      h += '<details class="cli"><summary><span class="sem sg"></span><span class="cnom">' + esc(r.c) + '</span></summary><div class="cuerpo">';
      if(r.i) h += '<div class="dir">' + esc(r.i) + mapaHtml(r.i, v) + '</div>';
      h += '<div class="fperd">No registra compras en el último año. Cliente para abrir de cero.</div></div></details>';
    });
    h += '</details>';
  }
  h += pfsug(D);
  h += escBarra();
  document.body.innerHTML = h;
  aplicarEsc();
}
function elegir(vid){ quien = vid; lsSet('rg_quien_'+(G.titulo||'x'), vid); pintar(); window.scrollTo(0,0); }
function cambiaDia(d){ diaAct = d; pintar(); window.scrollTo(0,0); }
function fil(q){ q = q.toLowerCase(); var t = document.querySelectorAll('#hoy details.cli'); for(var i=0;i<t.length;i++){ t[i].style.display = t[i].getAttribute('data-n').indexOf(q) >= 0 ? '' : 'none'; } }
function visita(n, si){ var m = marcas(quien); if(!m[n]) m[n] = {}; m[n].v = si ? 1 : 0; guardaMarcas(quien, m); var el = document.getElementById('cli' + n); if(el){ el.classList.toggle('vis', si); } }
function nota(n, t){ var m = marcas(quien); if(!m[n]) m[n] = {}; m[n].t = t; guardaMarcas(quien, m); }
function resumir(){
  var v = elVend(quien); if(!v) return;
  fijarCat(v);
  var tieneDias = !!v.dias;
  var D = tieneDias ? (v.dias[diaAct] || {c:[]}) : v.cartera;
  var m = marcas(quien);
  var vistos = D.c.filter(function(c){ return m[c.n] && m[c.n].v; });
  var txt = String(v.nom) + ' — ' + (tieneDias ? DNOM[diaAct] : 'cartera') + ' ' + fcorta(hoyIso()) + '\n';
  txt += 'Visitados: ' + vistos.length + ' de ' + D.c.length + '\n';
  D.c.forEach(function(c){ var k = m[c.n]; if(k && (k.v || k.t)) txt += '• ' + c.c + (k.v ? ' ✓' : '') + (k.t ? ' — ' + k.t : '') + '\n'; });
  if(navigator.share){ navigator.share({text: txt})['catch'](function(){ copiar(txt); }); }
  else copiar(txt);
}
function copiar(txt){
  if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(txt).then(function(){ alert('Copiado. Pegalo en el WhatsApp de Mariano.'); })['catch'](function(){ prompt('Copialo de acá:', txt); }); }
  else prompt('Copialo de acá:', txt);
}
/* ===== EL TABLERO ====================================================
   La segunda forma de la app. 206 y 308 lo tienen como pestaña al lado de
   su cartera; 800 y 802 no tienen cartera y entran directo acá. */
var PAN = G.pan || null;
var VISTA = lsGet('rg_vista_' + (G.pre || 'x')) || '';
if(!VISTA) VISTA = (PAN && (!G.vs || !G.vs.length)) ? 'pan' : 'yo';
var TVI = 0;
var TVC = 0;
var VERIMP = lsGet('rg_verimp') !== '0';
function verVista(x){ VISTA = x; lsSet('rg_vista_' + (G.pre || 'x'), x); pintar(); window.scrollTo(0,0); }
function tvTot(){ return 1 + PAN.vs.length + (pcaiTodos().length ? 1 : 0); }
function tvIr(i){ var n = tvTot(); TVI = ((i % n) + n) % n; TVC = 0; pintar(); window.scrollTo(0,0); }
function tvCai(i){ TVC = i; pintar(); window.scrollTo(0,0); }
function tvCaiIr(){ TVI = PAN.vs.length + 1; TVC = 0; verVista('tv'); }
function pmil(n){ return Math.round(Number(n)||0).toLocaleString('es-AR'); }
function plit(n){ n = Number(n)||0; return (Math.round(n*10)/10).toLocaleString('es-AR',{maximumFractionDigits:1}); }
function pvol(n,k){ return k==='CELUSAL' ? (Math.round(n*10)/10).toLocaleString('es-AR',{maximumFractionDigits:1})+' t' : pmil(n)+' cj'; }
function ppc(r,m){ return m ? Math.round(r/m*100) : 0; }
function pbar(r,m){ var e=qest(r,m,PAN.frac||1); return '<div class="pbar"><i class="'+e[0]+'" style="width:'+Math.min(100,Math.max(0,ppc(r,m)))+'%"></i><em style="left:'+Math.min(99,Math.round((PAN.frac||1)*100))+'%"></em></div>'; }
function pcol(r,m){ return qest(r,m,PAN.frac||1)[1]; }
/* la línea de Branca abierta: lo que no tiene cuota igual se muestra, porque
   vender 1.443 L de Vittone sin cuota cargada es información, no un cero. */
function pbrch(b, pes){
  var par = [['Carpano',b.cr,b.cm],['Sernova (vodka)',b.vr,b.vm],['Vinos',b.vir,b.vim],
             ['Brancamenta',b.mr,b.mm],['Vittone',b.tr,b.tm],['Gin',b.gr,b.gm]];
  par = par.filter(function(x){ return x[1] || x[2]; });
  if(!par.length) return '';
  var h = '<div class="pgrid">';
  par.forEach(function(x){
    if(x[2]) h += '<div class="pmini"><div class="pmtop"><span>'+esc(x[0])+'</span><b class="'+pcol(x[1],x[2])+'">'+ppc(x[1],x[2])+'%</b></div>'
              + '<div class="pmval">'+plit(x[1])+' / '+plit(x[2])+' L</div>'+pbar(x[1],x[2])+'</div>';
    else h += '<div class="pmini psinq"><div class="pmtop"><span>'+esc(x[0])+'</span><b class="pgris">sin cuota</b></div>'
              + '<div class="pmval">vendió <b>'+plit(x[1])+' L</b></div></div>';
  });
  return h + '</div>';
}
function pfamch(fs, pes){
  if(!fs || !fs.length) return '';
  var h = '<div class="pgrid">';
  fs.forEach(function(r){
    h += '<div class="pmini"><div class="pmtop"><span>'+esc(r[1])+'</span><b class="'+pcol(r[3],r[2])+'">'+ppc(r[3],r[2])+'%</b></div>'
       + '<div class="pmval">'+pvol(r[3],r[0])+' / '+pvol(r[2],r[0])+(r[4]?' · '+r[4]+' cli':'')+(pes&&r[5]?' · <b>'+qshort(r[5])+'</b>':'')+'</div>'+pbar(r[3],r[2])+'</div>';
  });
  return h + '</div>';
}
/* barras de un mes por mes. Un solo color y el último resaltado: pintarlas
   con semáforo hacía parecer malo cualquier mes que no fuera el pico. */
function pcols(serie, fmt, cls){
  if(!serie || serie.length < 2) return '';
  var mx = 0; serie.forEach(function(z){ if(z[1] > mx) mx = z[1]; });
  if(!mx) return '';
  var h = '<div class="pcols '+(cls||'')+'">';
  serie.forEach(function(z, i){
    var alt = Math.max(4, Math.round(z[1]/mx*100));
    h += '<div class="pcol"><span class="pcv">'+fmt(z[1])+'</span><i class="'+(i===serie.length-1?'pazul pact':'pazul')+'" style="height:'+alt+'%"></i>'
       + '<span class="pcm">'+MESN[+z[0].slice(5,7)-1].slice(0,3)+'</span></div>';
  });
  return h + '</div>';
}
function pcaidos(x){
  if(!x.cai || !x.cai.length) return '';
  var h = '<details class="pdet"><summary>'+x.cai.length+' clientes caídos <span class="pgris">(más de '+x.dias+' días sin comprar)</span></summary><div class="plista">';
  x.cai.forEach(function(z){
    h += '<div class="pl"><span>'+esc(z[0])+(z[3]&&z[3].length?' <i>'+z[3].map(esc).join(' · ')+'</i>':'')+'</span><b>'+(z[1]?fmt(z[1])+'/mes · ':'')+z[2]+' d</b></div>';
  });
  return h + '</div></details>';
}
function pbranca(x){
  var b = x.b;
  if(!b.m && !b.r) return '<div class="pln pgris">Sin cuota de Branca.</div>';
  var h = '<div class="psub">FERNET BRANCA <b class="'+pcol(b.r,b.m)+'">'+ppc(b.r,b.m)+'%</b> — '+plit(b.r)+' de '+plit(b.m)+' L · le compraron '+b.cob+' clientes</div>'
        + pbar(b.r,b.m) + pbrch(b);
  if(x.bl && x.bl.length > 1) h += '<div class="psub">LITROS MES POR MES</div>' + pcols(x.bl, function(v){ return pmil(v/1000)+'k'; });
  if(x.bca && x.bca.length){
    h += '<details class="pdet"><summary>Dejaron de comprar Branca <b>'+x.bca.length+'</b></summary><div class="plista">';
    x.bca.forEach(function(z){ h += '<div class="pl"><span>'+esc(z[0])+'</span><b>'+(z[1]?fmt(z[1])+'/mes':'')+'</b></div>'; });
    h += '</div></details>';
  }
  return h;
}
function pvend(x, conImp){
  var h = '<details class="pv"><summary><span class="pvn">'+esc(x.nom)+'</span><span class="pvv">'+qshort(x.real)+'</span>'
        + '<span class="pvp '+pcol(x.real,x.meta)+'">'+ppc(x.real,x.meta)+'%</span></summary><div class="pvb">'+pbar(x.real,x.meta);
  h += '<div class="pln">Objetivo <b>'+qshort(x.meta)+'</b> · lleva <b>'+qshort(x.real)+'</b> · '
     + (x.meta > x.real ? ('le faltan <b>'+qshort(x.meta-x.real)+'</b>') : '<b>cumplido</b>') + '</div>';
  if(x.antDia > 0){
    var d1 = x.real - x.antDia;
    h += '<div class="pln">A esta altura de '+MESN[(x.antMes||1)-1]+' iba <b>'+qshort(x.antDia)+'</b> · <b class="'+(d1>=0?'moktxt':'mbadtxt')+'">'+(d1>=0?'+':'')+Math.round((x.real/x.antDia-1)*100)+'%</b></div>';
  } else if(x.ant > 0){
    var d2 = x.real - x.ant;
    h += '<div class="pln">El mes pasado cerró en <b>'+qshort(x.ant)+'</b> · <b class="'+(d2>=0?'moktxt':'mbadtxt')+'">'+(d2>=0?'+':'')+Math.round((x.real/x.ant-1)*100)+'%</b></div>';
  }
  if(conImp) h += '<div class="pln pgris">Impuesto interno <b>'+qshort(x.int)+'</b> · IVA <b>'+qshort(x.real*0.21)+'</b> · total <b>'+qshort(x.real+x.int+x.real*0.21)+'</b></div>';
  var alta = x.atr > x.cart*0.35;
  h += '<div class="pchips"><span class="pch">'+x.cart+' clientes</span><span class="pch">'+x.act+' compraron este mes</span>'
     + '<span class="pch'+(alta?' prj':'')+'">'+(alta?'⚠ ':'')+x.atr+' caídos</span><span class="pch'+(x.per>10?' prj':'')+'">'+x.per+' perdidos</span></div>';
  h += pbranca(x);
  var cel = x.f.filter(function(r){ return r[0]==='CELUSAL'; });
  var res = x.f.filter(function(r){ return r[0]!=='CELUSAL'; });
  if(cel.length) h += '<div class="psub">CELUSAL</div>' + pfamch(cel);
  if(res.length) h += '<div class="psub">EL RESTO DE LAS LÍNEAS</div>' + pfamch(res);
  h += pcaidos(x);
  return h + '</div></details>';
}
/* el ranking de UNA línea: es lo primero que mira el supervisor */
function pfila1(x, campo){
  var r, m, ex, val;
  if(campo === 'branca'){ r = x.b.r; m = x.b.m; ex = x.b.cob + ' cli'; val = plit(r) + ' L'; }
  else {
    var z = x.f.filter(function(q){ return q[0] === campo; })[0];
    if(!z) return '';
    r = z[3]; m = z[2]; ex = z[4] + ' cli'; val = pvol(r, campo);
  }
  if(!m && !r) return '';
  return '<div class="prow"><span class="prn">'+esc(x.nom)+'</span><span class="prv">'+val+'</span>'
       + '<span class="prp '+pcol(r,m)+'">'+(m?ppc(r,m)+'%':'s/c')+'</span></div>'
       + '<div class="prb">'+pbar(r,m)+'<span class="pre">'+ex+'</span></div>';
}
function prank(campo, tit, nota){
  var xs = PAN.vs.filter(function(x){
    return campo === 'branca' ? (x.b.m || x.b.r) : x.f.some(function(q){ return q[0] === campo; });
  });
  function k(x){
    if(campo === 'branca') return x.b.m ? -(x.b.r/x.b.m) : 0;
    var z = x.f.filter(function(q){ return q[0] === campo; })[0];
    return (z && z[2]) ? -(z[3]/z[2]) : 0;
  }
  xs = xs.slice().sort(function(a,b){ return k(a) - k(b); });
  var h = '<div class="pcard"><div class="pct">'+tit+'</div>' + (nota ? '<div class="phint">'+nota+'</div>' : '');
  xs.forEach(function(x){ h += pfila1(x, campo); });
  var hechos = {}; xs.forEach(function(x){ hechos[x.id] = 1; });
  var sin = PAN.vs.filter(function(x){ return !hechos[x.id]; });
  if(sin.length) h += '<div class="pal"><b>Sin cuota cargada</b><div>' + sin.map(function(x){ return esc(x.nom); }).join(' · ') + '</div></div>';
  return h + '</div>';
}
/* ---- el tablero de Branca (308) ---- */
function ppanBranca(){
  var T = PAN.tot, b = T.b;
  var h = '<div class="pcard ptot ' + (qest(b.r,b.m,PAN.frac||1)[0]==='mok'?'pok':qest(b.r,b.m,PAN.frac||1)[0]==='mwarn'?'pwa':'pba') + '">'
        + '<div class="pctop"><span class="pct">Fernet Branca — la preventa</span><span class="pcpc '+pcol(b.r,b.m)+'">'+ppc(b.r,b.m)+'%</span></div>'
        + '<div class="pbig">'+plit(b.r)+' L</div>'
        + '<div class="psb">de '+plit(b.m)+' L de cuota (la suma de estos vendedores) · le compraron <b>'+b.cob+'</b> clientes</div>'
        + pbar(b.r,b.m) + '</div>';
  h += '<div class="pcard"><div class="pct">Toda la línea</div>' + pbrch(b) + '</div>';
  if(PAN.lem && PAN.lem.length > 2){
    h += '<div class="pcard"><div class="pct">Litros de Branca de la empresa, mes por mes</div>'
       + '<div class="phint">Sacado artículo por artículo. Es dato exacto.</div>'
       + pcols(PAN.lem, function(v){ return pmil(v/1000)+'k'; }, 'pc21') + '</div>';
  }
  /* la alerta: los grandes que hace más de N días que no compran Branca */
  var al = [];
  PAN.vs.forEach(function(x){ (x.bcli||[]).forEach(function(z){
    if(z[3] !== null && z[3] > PAN.dias) al.push([z[0], z[5], z[3], z[2], x.nom, z[4]]);
  }); });
  al.sort(function(a,b){ return b[1] - a[1]; });
  if(al.length){
    h += '<div class="pcard prjc"><div class="pct">⚠ No compran Branca hace más de '+PAN.dias+' días</div>'
       + '<div class="phint">'+al.length+' clientes. Los más grandes primero.</div>';
    al.slice(0,25).forEach(function(z){
      h += '<div class="prow"><span class="prn">'+esc(z[0])+'<i> · '+esc(z[4])+'</i></span><span class="prv mbadtxt"><b>'+z[2]+' d</b></span></div>'
         + '<div class="prs">'+(z[1]?fmt(z[1])+'/mes':'sin venta')+' · última Branca '+fcorta(z[3])+(z[5]&&z[5].length?' · llevaba '+z[5].map(function(k){return SUBN[k]||k;}).join(', '):'')+'</div>';
    });
    h += '</div>';
  }
  /* los que compran sólo Fernet: ahí está el Carpano y el Sernova que falta colocar */
  var solo = [];
  PAN.vs.forEach(function(x){ (x.bcli||[]).forEach(function(z){
    var tiene = (z[4]||[]).some(function(k){ return SUBLIN[k]; });
    if(!tiene) solo.push([z[0], z[1], z[5], x.nom]);
  }); });
  solo.sort(function(a,b){ return (b[1]-a[1]) || (b[2]-a[2]); });
  if(solo.length){
    h += '<div class="pcard"><div class="pct">Compran sólo Fernet y nada más de la línea</div>'
       + '<div class="phint">'+solo.length+' clientes. Acá está el Carpano, el Sernova y los vinos que faltan colocar.</div>';
    solo.slice(0,20).forEach(function(z){
      h += '<div class="prow"><span class="prn">'+esc(z[0])+'<i> · '+esc(z[3])+'</i></span><span class="prv">'+(z[1]?plit(z[1])+' L':'sin Branca este mes')+'</span></div>'
         + (z[2] ? '<div class="prs">'+fmt(z[2])+'/mes en total</div>' : '');
    });
    h += '</div>';
  }
  /* los que compraban y dejaron */
  var cai = [];
  PAN.vs.forEach(function(x){ (x.bca||[]).forEach(function(z){ cai.push([z[0], z[1], x.nom]); }); });
  cai.sort(function(a,b){ return b[1] - a[1]; });
  if(cai.length){
    h += '<div class="pcard prjc"><div class="pct">Compraban Branca y dejaron de comprar</div>'
       + '<div class="phint">'+cai.length+' clientes en toda la preventa.</div><div class="plista">';
    cai.slice(0,30).forEach(function(z){ h += '<div class="pl"><span>'+esc(z[0])+' <i>· '+esc(z[2])+'</i></span><b>'+(z[1]?fmt(z[1])+'/mes':'')+'</b></div>'; });
    h += '</div></div>';
  }
  h += '<div class="pcard"><div class="pct">Cómo va cada vendedor</div>';
  var conB = PAN.vs.filter(function(x){ return x.b.m; }).slice().sort(function(a,b){ return (b.b.r/b.b.m) - (a.b.r/a.b.m); });
  conB.forEach(function(x){
    h += '<details class="pv"><summary><span class="pvn">'+esc(x.nom)+'</span><span class="pvv">'+plit(x.b.r)+' L</span>'
       + '<span class="pvp '+pcol(x.b.r,x.b.m)+'">'+ppc(x.b.r,x.b.m)+'%</span></summary><div class="pvb">'+pbar(x.b.r,x.b.m)
       + '<div class="pln">Cuota <b>'+plit(x.b.m)+' L</b> · lleva <b>'+plit(x.b.r)+' L</b> · le compraron <b>'+x.b.cob+'</b> clientes</div>'
       + pbrch(x.b);
    if(x.bl && x.bl.length > 1) h += '<div class="psub">SUS LITROS MES POR MES</div>' + pcols(x.bl, function(v){ return pmil(v/1000)+'k'; });
    var act = (x.bcli||[]).filter(function(z){ return z[1]; });
    if(act.length){
      h += '<details class="pdet pok"><summary>Le compraron Branca este mes <b>'+act.length+'</b></summary><div class="plista">';
      act.slice(0,25).forEach(function(z){ h += '<div class="pl"><span>'+esc(z[0])+'</span><b>'+plit(z[1])+' L</b></div>'; });
      h += '</div></details>';
    }
    var vie = (x.bcli||[]).filter(function(z){ return z[3] !== null && z[3] > PAN.dias; })
                          .sort(function(a,b){ return b[5]-a[5]; });
    if(vie.length){
      h += '<details class="pdet"><summary>⚠ Sin Branca hace +'+PAN.dias+' días <b>'+vie.length+'</b></summary><div class="plista">';
      vie.slice(0,25).forEach(function(z){ h += '<div class="pl"><span>'+esc(z[0])+'</span><b>'+(z[5]?fmt(z[5])+' · ':'')+z[3]+' d</b></div>'; });
      h += '</div></details>';
    }
    h += '</div></details>';
  });
  var sinB = PAN.vs.filter(function(x){ return !x.b.m; });
  if(sinB.length) h += '<div class="pal"><b>Sin cuota de Branca cargada</b><div>'+sinB.map(function(x){return esc(x.nom);}).join(' · ')+'</div></div>';
  return h + '</div>';
}
/* ---- la cuenta propia del supervisor ---- */
function ppanCuenta(){
  var t = PAN.cta;
  if(!t) return '';
  var h = '<div class="pcard ptot pok"><div class="pctop"><span class="pct">'+esc(t.c)+'</span></div>'
        + '<div class="pbig">'+plit(t.L)+' L</div>'
        + '<div class="psb">de Branca'+(t.Lmes?' en '+MESN[+t.Lmes.slice(5,7)-1]:'')+' · '+t.v+' compras en el año</div>'
        + '<div class="pcmp">Última compra <b>'+fcorta(t.u)+'</b></div></div>';
  if(t.subs && t.subs.length){
    var tot = 0; t.subs.forEach(function(z){ tot += z[1]; });
    h += '<div class="pcard"><div class="pct">Litros, línea por línea</div>';
    t.subs.forEach(function(z){
      var p = tot ? Math.round(z[1]/tot*100) : 0;
      h += '<div class="prow"><span class="prn">'+esc(z[0])+'</span><span class="prv">'+plit(z[1])+' L</span><span class="prp pgris">'+p+'%</span></div>'
         + '<div class="pbar"><i class="pazul pact" style="width:'+Math.max(2,p)+'%"></i></div>';
    });
    h += '</div>';
  }
  if(t.bl && t.bl.length > 1){
    h += '<div class="pcard"><div class="pct">Mes por mes, en litros</div>' + pcols(t.bl, function(v){ return pmil(v/1000)+'k'; }) + '</div>';
  }
  if(t.arts && t.arts.length){
    h += '<div class="pcard"><div class="pct">Artículos de Branca que lleva</div>';
    t.arts.forEach(function(z){
      var c = z[4] > 45 ? 'mbadtxt' : z[4] > 21 ? 'mwarntxt' : 'moktxt';
      h += '<div class="prow"><span class="prn">'+esc(z[0])+'</span><span class="prv">'+pmil(z[1])+' un.</span></div>'
         + '<div class="prs">'+(z[2]?(SUBN[z[2]]||z[2])+' · ':'')+'última <b class="'+c+'">'+fcorta(z[3])+'</b>'+(z[4]!==null?' · hace '+z[4]+' d':'')+'</div>';
    });
    h += '</div>';
  }
  if((t.cayo && t.cayo.length) || (t.nuevo && t.nuevo.length)){
    h += '<div class="pcard"><div class="pct">Qué cambió en los últimos tres meses</div>';
    if(t.cayo.length) h += '<div class="pal"><b class="mbadtxt">Dejó de llevar ('+t.cayo.length+')</b><div>'+t.cayo.map(esc).join(' · ')+'</div></div>';
    if(t.nuevo.length) h += '<div class="pal"><b class="moktxt">Empezó a llevar ('+t.nuevo.length+')</b><div>'+t.nuevo.map(esc).join(' · ')+'</div></div>';
    h += '</div>';
  }
  if(t.sug && t.sug.length){
    h += '<div class="pcard"><div class="pct">Lo que habría que reponerle</div>';
    t.sug.forEach(function(z){ h += '<div class="prow"><span class="prn">'+esc(z[0])+'</span><span class="prv">'+fmt(z[2])+'</span></div><div class="prs">'+plit(z[1])+' unidades de reposición</div>'; });
    h += '</div>';
  }
  return h;
}
var SUBN = {branca:'Fernet', menta:'Brancamenta', carpano:'Carpano', vodka:'Sernova',
            vinos:'Vinos', vittone:'Vittone', gin:'Gin', sambuca:'Sambuca',
            candolini:'Candolini', strega:'Strega', borghetti:'Borghetti',
            puntemes:'Punt e Mes', fabre:'Vinos Fabre', antica:'Antica Formula'};
var SUBLIN = {carpano:1, vodka:1, vinos:1, menta:1, vittone:1, gin:1};
/* el recuadro grande de facturación. El desglose de IVA e impuesto interno
   sólo lo lleva el archivo de los dueños: a ningún vendedor le viaja. */
function ppanTotal(tit, sub){
  var T = PAN.tot, e = qest(T.real, T.meta, PAN.frac||1);
  var fr = e[0]==='mok' ? 'Van bien.' : e[0]==='mwarn' ? 'Van un poco abajo.' : 'Van atrasados.';
  var h = '<div class="pcard ptot ' + (e[0]==='mok'?'pok':e[0]==='mwarn'?'pwa':'pba') + '">'
        + '<div class="pctop"><span class="pct">'+tit+'</span><span class="pcpc '+e[1]+'">'+ppc(T.real,T.meta)+'%</span></div>'
        + '<div class="pbig">'+qshort(T.real)+'</div>'
        + '<div class="psb">de '+qshort(T.meta)+' de objetivo · '+sub+'</div>'
        + pbar(T.real, T.meta)
        + '<div class="pfr"><b class="'+e[1]+'">'+fr+'</b> La rayita marca dónde tendrían que ir hoy.</div>';
  if(T.antDia > 0){
    var d = T.real - T.antDia;
    h += '<div class="pcmp">A esta altura del mes pasado iban <b>'+qshort(T.antDia)+'</b> · <b class="'+(d>=0?'moktxt':'mbadtxt')+'">'+(d>=0?'+':'')+Math.round((T.real/T.antDia-1)*100)+'%</b></div>';
  } else if(T.ant > 0){
    h += '<div class="pcmp">El mes pasado cerraron en <b>'+qshort(T.ant)+'</b> · llevan el <b>'+Math.round(T.real/T.ant*100)+'%</b> de eso</div>';
  }
  if(PAN.imp){
    var I = PAN.imp;
    h += '<div class="pimp">'
       + '<div class="pil"><span>Importe facturado (sin impuestos)</span><b>'+qshort(I.base)+'</b></div>'
       + '<div class="pil"><span>+ Impuesto interno (Branca)</span><b>'+qshort(I.int)+'</b></div>'
       + '<div class="pil"><span>+ IVA 21%</span><b>'+qshort(I.iva)+'</b></div>'
       + '<div class="pil pit"><span>TOTAL DE PLATA</span><b>'+qshort(I.tot)+'</b></div>'
       + '<div class="pinota">El IVA se calcula sobre el importe, sin el interno; el interno va aparte. Este cuadro sale solamente acá.</div>'
       + '</div>';
  }
  return h + '</div>';
}
function ppanAlertas(){
  var xs = PAN.vs.slice();
  var ab = xs.filter(function(x){ return x.meta; }).sort(function(a,b){ return (a.real/a.meta) - (b.real/b.meta); }).slice(0,3);
  var at = xs.slice().sort(function(a,b){ return b.atr - a.atr; }).slice(0,3);
  var pe = xs.slice().sort(function(a,b){ return b.per - a.per; }).slice(0,3);
  return '<div class="pcard"><div class="pct">Lo que hay que mirar</div>'
    + '<div class="pal"><b>Los tres más abajo del objetivo</b><div>' + ab.map(function(x){ return esc(x.nom)+' <span class="mbadtxt">'+ppc(x.real,x.meta)+'%</span>'; }).join(' · ') + '</div></div>'
    + '<div class="pal"><b>Los que más clientes caídos tienen</b><div>' + at.map(function(x){ return esc(x.nom)+' <b>'+x.atr+'</b>'; }).join(' · ') + '</div></div>'
    + '<div class="pal"><b>Los que más clientes perdieron</b><div>' + pe.map(function(x){ return esc(x.nom)+' <b>'+x.per+'</b>'; }).join(' · ') + '</div></div>'
    + '</div>';
}
function ppanResto(){
  var T = PAN.tot;
  var ks = T.f.filter(function(z){ return z[0] !== 'CELUSAL'; })
               .sort(function(a,b){ return (a[2]?a[3]/a[2]:0) - (b[2]?b[3]/b[2]:0); });
  if(!ks.length) return '';
  var h = '<div class="pcard"><div class="pct">3º · El resto de las líneas</div>'
        + '<div class="phint">De la que peor viene a la que mejor. Tocá una para ver vendedor por vendedor.</div>';
  ks.forEach(function(z){
    h += '<details class="pv"><summary><span class="pvn">'+esc(z[1])+'</span><span class="pvv">'+pvol(z[3],z[0])+' / '+pvol(z[2],z[0])+'</span>'
       + '<span class="pvp '+pcol(z[3],z[2])+'">'+ppc(z[3],z[2])+'%</span></summary><div class="pvb">';
    PAN.vs.forEach(function(x){ h += pfila1(x, z[0]); });
    h += '</div></details>';
  });
  return h + '</div>';
}
/* ---- modo pantalla: uno por vez, letra grande, para el televisor.
   Lleva la cuota del vendedor en plata, en cajas y en litros —lo mismo que
   ve el en su hoja individual, asi que no es nada nuevo para el—, con un
   boton para taparla si ese dia no la quiere mostrar. Lo que NO va nunca
   es el total del grupo ni la comparacion de plata entre companeros. ---- */
function verImp(x){ VERIMP = x; lsSet('rg_verimp', x ? '1' : '0'); pintar(); }
function ptv(){
  if(TVI === 0) return ptvPortada();
  if(TVI > PAN.vs.length) return ptvCaidos();
  var n = PAN.vs.length, x = PAN.vs[TVI-1], b = x.b;
  var h = '<div class="ptv"><div class="ptvtop"><button class="ptvb" onclick="tvIr(' + (TVI-1) + ')">&#8592;</button>'
        + '<div class="ptvnom">' + esc(x.nom) + '</div><button class="ptvb" onclick="tvIr(' + (TVI+1) + ')">&#8594;</button></div>'
        + '<div class="ptvsub">' + TVI + ' de ' + n + ' · ' + MESN[(PAN.mes||1)-1]
        + ' · <button class="ptvimp" onclick="verImp(' + (VERIMP ? 'false' : 'true') + ')">'
        + (VERIMP ? 'ocultar los importes' : 'mostrar los importes') + '</button></div>';
  if(VERIMP && x.meta){
    var e = qest(x.real, x.meta, PAN.frac || 1);
    h += '<div class="ptvc"><div class="ptvt">SU CUOTA DEL MES</div>'
       + '<div class="ptvbig ' + e[1] + '">' + ppc(x.real, x.meta) + '%</div>'
       + '<div class="ptvv">' + fmt(x.real) + ' de ' + fmt(x.meta)
       + (x.meta > x.real ? ' · le faltan <b>' + fmt(x.meta - x.real) + '</b>' : ' · <b>cumplido</b>') + '</div>'
       + pbar(x.real, x.meta) + '</div>';
  }
  if(b.m || b.r){
    h += '<div class="ptvc"><div class="ptvt">FERNET BRANCA</div><div class="ptvbig ' + pcol(b.r,b.m) + '">' + ppc(b.r,b.m) + '%</div>'
       + '<div class="ptvv">' + plit(b.r) + ' de ' + plit(b.m) + ' litros'
       + (VERIMP && b.p ? ' · <b>' + fmt(b.p) + '</b>' : '') + '</div>' + pbar(b.r,b.m) + '</div>';
    h += '<div class="ptvc"><div class="ptvt">EL RESTO DE LA LÍNEA BRANCA</div>' + pbrch(b) + '</div>';
  }
  if(x.f.length) h += '<div class="ptvc"><div class="ptvt">LAS LÍNEAS</div>' + pfamch(x.f, VERIMP) + '</div>';
  h += '<div class="ptvc"><div class="ptvt">CLIENTES</div><div class="ptvchips">'
     + '<span class="ptvch">' + x.cart + ' en cartera</span><span class="ptvch pv2">' + x.act + ' compraron este mes</span>'
     + '<span class="ptvch' + (x.atr > x.cart*0.35 ? ' pr2' : '') + '">' + x.atr + ' caídos (+' + x.dias + ' días)</span>'
     + '<span class="ptvch">' + x.per + ' perdidos</span></div></div>';
  if(x.cai && x.cai.length){
    h += '<div class="ptvc"><div class="ptvt">A QUIÉN HAY QUE IR A BUSCAR</div><div class="ptvl">';
    x.cai.slice(0,12).forEach(function(z){ h += '<div class="ptvli"><span>' + esc(z[0]) + (z[4] ? ' <i style="font-style:normal;color:#9db6d4;font-size:.75em">última ' + fcorta(z[4]) + '</i>' : '') + '</span><b>' + (z[1] ? qshort(z[1]) + '/mes · ' : '') + z[2] + ' d</b></div>'; });
    h += '</div></div>';
  }
  h += '<div class="ptvnav">';
  h += '<button class="ptvn' + (TVI===0?' act':'') + '" onclick="tvIr(0)">⌂</button>';
  for(var i=1;i<=n;i++) h += '<button class="ptvn' + (i===TVI?' act':'') + '" onclick="tvIr(' + i + ')">' + i + '</button>';
  if(pcaiTodos().length) h += '<button class="ptvn ptvcaib' + (TVI>n?' act':'') + '" onclick="tvIr(' + (n+1) + ')">caídos</button>';
  h += '</div><button class="ptvsal" onclick="verVista(\'pan\')">Salir del modo pantalla</button></div>';
  return h;
}
function pfsem(f){ if(!f) return ''; var d=new Date(f+'T12:00:00');
  return ['domingo','lunes','martes','mi\u00e9rcoles','jueves','viernes','s\u00e1bado'][d.getDay()]+' '+parseInt(f.slice(8,10),10)+'/'+parseInt(f.slice(5,7),10); }
function pbuelin(){ return (PAN.msg || []).slice(1); }
function pbueidx(){ var L = pbuelin(); return L.length ? msgIdx(L.length, msgSem('sup' + (G.pre || ''))) : -1; }
function ppanPortada(){
  var B = PAN.bue; if(!B || !B.i) return '';
  var L = pbuelin(), k = pbueidx();
  var h = '<div class="pcard pbue"><div class="pbuet">La buena noticia</div>'
        + '<div class="pbueb">' + qshort(B.i) + '</div>'
        + '<div class="psb">es lo que hizo ' + (PAN.tipo === 'duenio' ? 'la empresa' : 'el grupo')
        + ' en los últimos ' + B.n + ' días de venta, con <b>' + pmil(B.cl) + '</b> clientes atendidos</div>';
  L.forEach(function(t, i){ if(i !== k) h += '<div class="pbuel">· ' + esc(t) + '</div>'; });
  return h + '</div>';
}
function ppanMsg(){
  var L = pbuelin(), k = pbueidx();
  if(k < 0 || !L[k]) return '';
  return '<div class="mmsg"><span class="mmsgi">☀</span><div class="mmsgt">' + esc(L[k]) + '</div></div>';
}
function ppfBarra(p){
  var c = p >= 80 ? 'pbueno' : (p >= 50 ? 'pmedio' : 'pflojo');
  return '<span class="ppfb"><i class="' + c + '" style="width:' + Math.max(2, p) + '%"></i></span>';
}
function ppfUno(x){
  var P = x.pf; if(!P) return '';
  var h = '<div class="ppfv"><div class="ppfvn">' + esc(x.nom)
        + ' <b>' + P.cob + '% del portafolio</b>' + ppfBarra(P.cob) + '</div>';
  h += '<div class="ppfd">' + pmil(P.n) + ' clientes categorizados'
     + (P.sin ? ' · <b class="mbadtxt">' + pmil(P.sin) + ' sin categoría</b>' : '')
     + ' · ' + pmil(P.full) + ' con todo lo que le toca'
     + (P.nu ? ' · ' + pmil(P.nu) + ' que todavía no compran Branca' : '')
     + (P.pr ? ' · ' + pmil(P.pr) + ' con lámina prestada' : '') + '</div>';
  if(P.sub && P.sub.length) h += '<div class="ppfd">' + P.sub.map(function(z){ return esc(z[0]) + ' ' + z[1]; }).join(' · ') + '</div>';
  if(P.fa && P.fa.length){
    h += '<div class="ppft">Lo que más le falta vender</div>';
    P.fa.forEach(function(z){
      h += '<div class="ppfl"><span>' + esc(z[0]) + '</span><b>' + pmil(z[1]) + ' clientes</b></div>';
    });
  }
  if(P.ti && P.ti.length) h += '<div class="ppfd" style="margin-top:6px">Lo que ya vende bien: '
     + P.ti.map(function(z){ return esc(z[0]) + ' (' + z[1] + ')'; }).join(', ') + '</div>';
  return h + '</div>';
}
function ppanPortafolio(){
  var L = (PAN.vs || []).filter(function(x){ return !!x.pf; });
  if(!L.length) return '';
  var n = 0, sin = 0, sum = 0, tot = {};
  L.forEach(function(x){
    n += x.pf.n; sin += x.pf.sin; sum += x.pf.cob * x.pf.n;
    (x.pf.fa || []).forEach(function(z){ tot[z[0]] = (tot[z[0]] || 0) + z[1]; });
  });
  var cob = n ? Math.round(sum / n) : 0;
  var G2 = []; Object.keys(tot).forEach(function(k){ G2.push([k, tot[k]]); });
  G2.sort(function(a,b){ return b[1]-a[1]; }); G2 = G2.slice(0, 6);
  var h = '<div class="pcard"><div class="pct">El portafolio de Branca, cómo viene cada uno</div>'
        + '<div class="phint">De los productos que la lámina de Branca le pide a cada cliente según su categoría, '
        + 'cuántos le está vendiendo. Es el mismo número que ve el vendedor en su hoja.</div>';
  h += '<div class="ppfres"><b>' + cob + '%</b> del portafolio cubierto en <b>' + pmil(n) + '</b> clientes categorizados'
     + (sin ? ' · <b class="mbadtxt">' + pmil(sin) + ' clientes sin categoría</b>, que no entran en ninguna cuenta' : '') + '</div>';
  if(G2.length){
    h += '<div class="ppft">Lo que más falta en todo el grupo</div>';
    G2.forEach(function(z){ h += '<div class="ppfl"><span>' + esc(z[0]) + '</span><b>' + pmil(z[1]) + ' clientes</b></div>'; });
  }
  L.forEach(function(x){ h += ppfUno(x); });
  return h + '</div>';
}
function pcaiTodos(){
  if(PAN._cai) return PAN._cai;
  var out = [];
  PAN.vs.forEach(function(x){ (x.cai || []).forEach(function(z){
    out.push({c:z[0], p:Number(z[1])||0, d:Number(z[2])||0, f:z[4]||'', v:x.nom, fa:z[3]||[]});
  }); });
  out.sort(function(a,b){ return (b.p - a.p) || (b.d - a.d); });
  PAN._cai = out;
  return out;
}
function ppanCaidos(){
  var L = pcaiTodos(); if(!L.length) return '';
  var plata = 0; L.forEach(function(z){ plata += z.p; });
  var h = '<div class="pcard prjc"><div class="pct">Clientes ca\u00eddos de todo el grupo</div>'
        + '<div class="phint">' + L.length + ' clientes que dejaron de comprar. Juntos compraban <b>' + qshort(plata) + ' por mes</b>. Del que m\u00e1s pesa al que menos.</div>'
        + '<button class="pbtn" onclick="tvCaiIr()">Verlos en la pantalla grande</button></div>';
  h += '<div class="pcard"><div class="pct">La lista completa</div>';
  L.forEach(function(z, i){
    h += '<div class="pcai"><span class="pcaipos">' + (i+1) + '</span>'
       + '<span class="pcain">' + esc(z.c) + ' <i>\u00b7 ' + esc(z.v) + '</i></span>'
       + '<span class="pcaiv mbadtxt">' + (z.p ? qshort(z.p) + '/mes' : '') + '</span></div>'
       + '<div class="pcaid">hace <b>' + z.d + ' d\u00edas</b> \u00b7 \u00faltima compra ' + fcorta(z.f) + (z.fa.length ? ' \u00b7 llevaba ' + z.fa.map(esc).join(', ') : '') + '</div>';
  });
  return h + '</div>';
}
function ptvCaidos(){
  var L = pcaiTodos(), pag = 10, tot = Math.ceil(L.length / pag) || 1;
  if(TVC >= tot) TVC = 0; if(TVC < 0) TVC = tot - 1;
  var plata = 0; L.forEach(function(z){ plata += z.p; });
  var h = '<div class="ptv"><div class="ptvtop"><button class="ptvb" onclick="tvIr(' + (TVI-1) + ')">&#8592;</button>'
        + '<div class="ptvnom">A qui\u00e9n hay que ir a buscar</div><button class="ptvb" onclick="tvIr(' + (TVI+1) + ')">&#8594;</button></div>'
        + '<div class="ptvsub">' + L.length + ' clientes ca\u00eddos \u00b7 compraban ' + qshort(plata) + ' por mes \u00b7 p\u00e1gina ' + (TVC+1) + ' de ' + tot + '</div>';
  h += '<div class="ptvc">';
  L.slice(TVC*pag, TVC*pag + pag).forEach(function(z, i){
    h += '<div class="ptvcail"><span class="ptvcaiv">' + (TVC*pag + i + 1) + '</span>'
       + '<span class="ptvcain">' + esc(z.c) + '<br><i>' + esc(z.v) + ' \u00b7 \u00faltima compra ' + fcorta(z.f) + '</i></span>'
       + '<span class="ptvcaid">' + z.d + ' d</span>'
       + '<span class="ptvcaiv">' + (z.p ? qshort(z.p) + '/mes' : '') + '</span></div>';
  });
  h += '</div>';
  if(tot > 1) h += '<div class="ptvnav"><button class="ptvgo" onclick="tvCai(' + (TVC-1) + ')">\u2190 anteriores</button>'
     + '<button class="ptvgo" onclick="tvCai(' + (TVC+1) + ')">siguientes \u2192</button></div>';
  h += '<button class="ptvsal" onclick="verVista(\'pan\')">Salir del modo pantalla</button></div>';
  return h;
}
function ptvPortada(){
  var B = PAN.bue;
  var h = '<div class="ptv"><div class="ptvtop"><button class="ptvb" onclick="tvIr(' + (TVI-1) + ')">&#8592;</button>'
        + '<div class="ptvnom">' + esc(PAN.tit) + '</div><button class="ptvb" onclick="tvIr(' + (TVI+1) + ')">&#8594;</button></div>'
        + '<div class="ptvsub">' + MESN[(PAN.mes||1)-1] + ' \u00b7 datos al ' + fcorta(PAN.gen) + '</div>';
  h += '<div class="ptvport">';
  if(B && B.i){
    h += '<div class="ptvportt">Lo que hizo ' + (PAN.tipo === 'duenio' ? 'la empresa' : 'el grupo') + '</div>'
       + '<div class="ptvportb">' + qshort(B.i) + '</div>'
       + '<div class="ptvports">en los \u00faltimos ' + B.n + ' d\u00edas de venta, con ' + pmil(B.cl) + ' clientes atendidos</div>';
    pbuelin().slice(0,4).forEach(function(t){ h += '<div class="ptvportl">' + esc(t) + '</div>'; });
  } else {
    h += '<div class="ptvportt">Arrancamos</div><div class="ptvports">Todav\u00eda no hay venta cargada de estos d\u00edas.</div>';
  }
  h += '</div>';
  h += '<div class="ptvnav"><button class="ptvgo" onclick="tvIr(1)">Empezar con los vendedores \u2192</button></div>';
  h += '<button class="ptvsal" onclick="verVista(\'pan\')">Salir del modo pantalla</button></div>';
  return h;
}
function ppestanas(){
  /* OJO: esto lo llama tambien la hoja del vendedor comun, que no tiene
     tablero. Sin el chequeo de PAN se caia la hoja de los 13 vendedores. */
  if(!PAN || !G.vs || !G.vs.length) return '';
  var yo = PAN.tipo === 'sup' ? 'Mi cartera' : 'Mi cartera';
  var ot = PAN.tipo === 'sup' ? 'Supervisión' : PAN.tipo === 'branca' ? 'Branca' : 'Tablero';
  return '<div class="tabs"><button class="tab'+(VISTA!=='pan'?' act':'')+'" onclick="verVista(\'yo\')">'+yo+'</button>'
       + '<button class="tab'+(VISTA==='pan'?' act':'')+'" onclick="verVista(\'pan\')">'+ot+'</button></div>';
}
function pintarPanel(){
  if(VISTA === 'tv'){ document.body.style.background = '#0d1f3a'; document.body.className = 'tvon';
    document.body.innerHTML = ptv(); aplicarEsc(); return; }
  document.body.style.background = ''; document.body.className = '';
  var h = '<div class="enc"><div class="encTxt"><h1>'+esc(PAN.tit)+'</h1>'
        + '<div class="sub">Datos al '+fcorta(PAN.gen)+'</div></div>'
        + '<img class="logo" src="'+LOGO+'" alt=""></div>';
  h += ppestanas();
  h += '<div class="pwrap">';
  if(G.rec) h += '<div class="recado"><b>Aviso:</b> '+esc(G.rec)+'</div>';
  h += ppanMsg();
  h += ppanPortada();
  if(PAN.tipo === 'branca'){
    h += ppanBranca();
    h += ppanPortafolio();
    h += ppanCaidos();
  } else {
    var n = PAN.vs.length;
    h += ppanTotal(PAN.tipo === 'duenio' ? 'Facturación de la empresa' : 'Facturación del grupo', n + ' vendedores');
    h += '<div class="pcard pazulc"><b>Para revisar con cada vendedor</b>'
       + '<div class="phint">Letra grande, uno por pantalla, sin la facturación de la empresa. Para el televisor o la computadora.</div>'
       + '<button class="pbtn" onclick="verVista(\'tv\')">Abrir modo pantalla</button></div>';
    if(PAN.cta) h += '<div class="pcard pazulc"><b>Tu cuenta más grande</b>'
       + '<div class="phint">'+esc(PAN.cta.c)+' — está en la pestaña de tu cartera, arriba de todo.</div></div>';
    h += prank('branca', '1º · BRANCA — cómo viene cada uno', 'Es lo que más factura. Primero esto.');
    h += prank('CELUSAL', '2º · CELUSAL — cómo viene cada uno', '');
    h += ppanResto();
    h += '<div class="pcard"><div class="pct">4º · Cada uno, con todo</div>'
       + '<div class="phint">Branca, Celusal, el resto de las líneas y sus clientes caídos.</div>';
    PAN.vs.forEach(function(x){ h += pvend(x, PAN.tipo === 'duenio'); });
    h += '</div>';
    if(PAN.lem && PAN.lem.length > 2){
      h += '<div class="pcard"><div class="pct">Litros de Branca de la empresa, mes por mes</div>'
         + '<div class="phint">Sacado artículo por artículo. Es dato exacto.</div>'
         + pcols(PAN.lem, function(v){ return pmil(v/1000)+'k'; }, 'pc21') + '</div>';
    }
    h += ppanPortafolio();
    h += ppanCaidos();
    h += ppanAlertas();
  }
  h += escBarra() + '</div>';
  document.body.innerHTML = h;
  aplicarEsc();
}
try{ pintar(); }catch(e){ document.body.innerHTML = '<div style=\'padding:20px;color:#c0392b;font-size:16px\'>No se pudo abrir el archivo en este tel\u00e9fono.<br><br>Prob\u00e1 abrirlo con <b>Safari</b> o <b>Chrome</b>: toc\u00e1 el archivo, despu\u00e9s el bot\u00f3n de compartir y \'Abrir en Safari\'.<br><br>(' + (e && e.message ? e.message : e) + ')</div>'; }
