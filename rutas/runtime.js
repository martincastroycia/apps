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
function bhtml(c){ if(c.br&&c.br.off) return ''; var cat=CB||[], a=(c.br&&c.br.a)||[], tiene={}, h=''; a.forEach(function(x){tiene[String(x[0])]=1;}); if(!cat.length)return ''; h='<div class="brbox"><div class="brtit"><span style="color:'+(a.length?'#198754':'#c0392b')+';margin-right:6px">●</span>PORTAFOLIO BRANCA: <strong>'+a.length+' de '+cat.length+'</strong> cubiertos</div>'; if(a.length)h+='<details class="brdet"><summary>Artículos que compra <b>'+a.length+'</b></summary><div>'+a.map(function(x){return '<span class="brsi">'+esc(bnombre(x[0]))+'</span>';}).join('')+'</div></details>'; var f=cat.filter(function(x){return !tiene[String(x.c)];}); if(f.length)h+='<details class="brdet"><summary>Artículos que faltan vender <b>'+f.length+'</b></summary><div>'+f.map(function(x){return '<span class="brno">'+esc(x.n)+'</span>';}).join('')+'</div></details>'; if(c.br&&c.br.ult)h+='<div class="brmeta">Última compra Branca: '+fcorta(c.br.ult)+'</div>'; return h+'</div>'; }
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
function qshort(n){n=Number(n)||0;if(Math.abs(n)>=1000000)return '$ '+(n/1000000).toLocaleString('es-AR',{maximumFractionDigits:1})+' M';if(Math.abs(n)>=1000)return '$ '+Math.round(n/1000).toLocaleString('es-AR')+' mil';return '$ '+Math.round(n).toLocaleString('es-AR');}
function qlit(n){return (Math.round((Number(n)||0)*10)/10).toLocaleString('es-AR',{maximumFractionDigits:1})+' L';}
function qest(real,meta,frac){var p=meta?real/meta:0;if(p>=frac*.90)return ['mok','moktxt'];if(p>=frac*.70)return ['mwarn','mwarntxt'];return ['mbad','mbadtxt'];}
function qbar(real,meta,frac){var p=meta?Math.round(real/meta*100):0,e=qest(real,meta,frac),h=Math.min(99,Math.round(frac*100));return '<div class="mbar"><i class="'+e[0]+'" style="width:'+Math.min(100,Math.max(0,p))+'%"></i><em style="left:'+h+'%"></em></div>';}
function qvol(n,k){n=Number(n)||0;return k==='CELUSAL'?(Math.round(n*10)/10).toLocaleString('es-AR',{maximumFractionDigits:1})+' t':Math.round(n).toLocaleString('es-AR')+' cj';}
function rkhtml(v){if(!v.rf||!v.rf.length)return '';var h='<div class="rkf"><h3>Cómo vas contra tus compañeros</h3>'; v.rf.forEach(function(r){h+='<div class="rkl"><div class="rkn">'+esc(r.nom)+'</div>';  if(!r.cli){h+='<div class="rkp">Todavía no vendiste esta línea este mes. Ya la están vendiendo '+r.n+' de tus compañeros.</div>';}  else{h+='<div class="rkp">Cobertura: le vendiste a <b>'+r.cli+'</b> de tus '+r.cart+' clientes ('+r.cob+'%) · vas <b class="'+(r.pc<=3?'rkg':'')+'">'+r.pc+'° de '+r.n+'</b>';  h+=(r.pv?' · en volumen '+r.pv+'°':'')+'</div>';}  if(r.ob){var cu=Math.round(r.cli/r.ob*100),ok=r.cli>=(r.obh||r.ob);h+='<div class="rkp">Objetivo del mes: <b>'+r.ob+'</b> clientes · vas <b class="'+(ok?'rkg':'')+'">'+cu+'%</b>'+(r.cli>=r.ob?' · cumplido':' · te faltan <b>'+(r.ob-r.cli)+'</b>'+(r.obh&&r.obh<r.ob?' (a hoy deberías ir en '+r.obh+')':''))+'</div>';}  if(r.riv&&r.fa)h+='<div class="rks">'+(r.fa>1?'Te faltan <b>'+r.fa+'</b> clientes':'Te falta <b>1</b> cliente')+' para pasar a '+esc(String(r.riv).replace(/\.$/,''))+(r.sug&&r.sug.length?'. Empezá por: '+r.sug.map(esc).join(', '):'')+'</div>';  else if(r.sug&&r.sug.length&&r.pc>1)h+='<div class="rks">Todavía no le compraron: '+r.sug.map(esc).join(', ')+'</div>';  h+='</div>'});return h+'</div>'}
function ritvhtml(v){if(!BL.rit||!v.rit)return '';var r=v.rit,up=r.pc>=0; var h='<div class="rkf"><h3>Cómo venís este mes</h3><div class="rkl">'; h+='<div class="rkp">Venías a <b>'+fmt(r.i1)+' por día</b> ('+r.c1+' clientes) y en los últimos días vas a <b>'+fmt(r.i2)+'</b> ('+r.c2+' clientes) · <b class="'+(up?'rkg':'')+'" style="color:'+(up?'#1a7f4b':'#c0392b')+'">'+(up?'+':'')+r.pc+'%</b></div>'; h+='<div class="rks">Es contra vos mismo, no contra tus compañeros. Último día cargado: '+fcorta(r.ult)+'</div>'; return h+'</div></div>'}
function caevhtml(v){if(!BL.cae||!v.cae||!v.cae.length)return ''; var h='<div class="rkf"><h3>Tus clientes que están comprando menos que el año pasado</h3>'; if(v.cmp2){var c=v.cmp2,ok=c.pc>=0;  h+='<div class="rkl"><div class="rkp">Con los <b>'+c.n+' clientes que seguís atendiendo</b> vas <b style="color:'+(ok?'#1a7f4b':'#c0392b')+'">'+(ok?'+':'')+c.pc+'%</b> contra '+c.ant+' ('+fmt(c.b)+' contra '+fmt(c.a)+')';  h+=(c.nv?' · y abriste <b>'+c.nv+'</b> clientes nuevos por '+fmt(c.np):'')+'</div></div>';} v.cae.forEach(function(x){  h+='<div class="rkl"><div class="rkn">'+esc(x[0])+'</div><div class="rkp">El año pasado '+fmt(x[1])+' · este año <b>'+fmt(x[2])+'</b> · <b style="color:#c0392b">'+x[3]+'%</b></div></div>';}); return h+'<div class="rks">Cada uno de estos es un llamado para hacer.</div></div>'}
function cfbhtml(v){if(!BL.cfb||!v.cf||!v.cf.length)return '';var h=''; v.cf.forEach(function(x){var fab=x[0],cart=x[1],si=x[2],no=x[3];  var pc=cart?Math.round(si.length/cart*100):0;  h+='<div class="rkf"><h3>'+esc(fab)+'</h3>';  h+='<div class="rkl"><div class="rkp">Te compran <b>'+si.length+'</b> de tus '+cart+' clientes ('+pc+'%) · te faltan <b>'+no.length+'</b>'+(G.per?' · '+esc(G.per):'')+'</div></div>';  if(si.length){h+='<details class="cfb"><summary>Los que ya te compran <span>'+si.length+'</span></summary>';   si.forEach(function(c){h+='<div class="cfl"><b>'+esc(c[1])+'</b> <span>'+c[2]+(c[2]===1?' mes':' meses')+'</span></div>';});h+='</details>';}  if(no.length){h+='<details class="cfb"><summary>Los que todavía no te compran <span>'+no.length+'</span></summary>';   no.forEach(function(c){h+='<div class="cfl"><b>'+esc(c[1])+'</b> <span>'+fmt(c[2])+'/mes</span></div>';});h+='</details>';}  h+='</div>';});return h}
function n2(x){return (x/100).toFixed(2).replace('.',',');}
function arthtml(v){if(!BL.art||!v.ar||!v.ar.length)return ''; var h='<div class="rkf"><h3>Cuántos artículos te lleva cada cliente</h3>'; h+='<div class="rkp" style="margin-bottom:6px">El que compra un solo artículo de una línea es el que más fácil crece: ya te compra, solo hay que ofrecerle el resto.</div>'; v.ar.forEach(function(x){var nom=x[0],cat=x[1],pr=x[2],cli=x[3],uno=x[4],l=x[5];  var ult=pr.length-1,cer=GC?ult-1:ult;if(cer<0)cer=ult;  var ahora=pr[cer]||0,antes=0;for(var i=0;i<cer;i++){if(pr[i]){antes=pr[i];break;}}  var d=antes?Math.round((ahora-antes)/antes*100):0,col=d>0?'#1a7f4b':(d<0?'#c0392b':'#65726b');  h+='<div class="rkl"><div class="rkn">'+esc(nom)+'</div>';  h+='<div class="rkp">En '+(GM[cer]||'')+' tus clientes te llevaron <b>'+n2(ahora)+' artículos</b> de '+cat+' que tenés para ofrecer'   +(antes?' · en '+(GM[0]||'')+' eran '+n2(antes)+' · <b style="color:'+col+'">'+(d>0?'+':'')+d+'%</b>':'')+'</div>';  if(GC&&pr[ult])h+='<div class="rkp">En '+(GM[ult]||'')+' vas <b>'+n2(pr[ult])+'</b> (el mes todavía no terminó).</div>';  if(GM&&GM.length)h+='<div class="rks">'+GM.map(function(m,i){return m+' '+n2(pr[i]||0)+(GC&&i===ult?' (va)':'');}).join(' · ')+'</div>';  if(uno)h+='<div class="rkp"><b>'+uno+'</b> de tus '+cli+' clientes de esta línea se llevan <b>un solo artículo</b>.</div>';  if(l&&l.length){h+='<details class="cfb"><summary>A quién ofrecerle <span>'+l.length+'</span></summary>';   l.forEach(function(z){h+='<div class="cfl2"><b>'+esc(z[1])+'</b><div class="cfm">lleva '+esc(z[2])+'</div>'    +(z[3]&&z[3].length?'<div class="cfo">ofrecele: '+z[3].map(esc).join(' · ')+'</div>':'')+'</div>';});h+='</details>';}  h+='</div>';});return h+'</div>'}
function othtml(v){if(!BL.otr||!v.ot2||!v.ot2.length)return ''; var h='<div class="rkf"><h3>Otros clientes tuyos</h3>'; h+='<div class="rkp">Estos son tuyos pero no están en ningún día de la ruta, así que no te aparecen arriba. La mayoría hace rato que no compra. Si pasás cerca, acá los tenés.</div>'; h+='<details class="cfb"><summary>Verlos <span>'+v.ot2.length+'</span></summary>'; v.ot2.forEach(function(z){h+='<div class="cfl2"><b>'+esc(z[1])+'</b><div class="cfm">'+(z[2]?fmt(z[2])+'/mes':'')+(z[3]?' · última compra '+fcorta(z[3]):' · nunca compró')+'</div></div>';}); return h+'</details></div>'}
function pkhtml(v){if(!v.pk||!v.pk.length)return '';var h='<div class="rkf"><h3>Productos clave del mes</h3>'; v.pk.forEach(function(r){var pc=r.ca?Math.round(r.cl/r.ca*100):0;  h+='<div class="rkl"><div class="rkn">'+esc(r.n)+'</div><div class="rkp">Se lo vendiste a <b>'+r.cl+'</b> de tus '+r.ca+' clientes ('+pc+'%)</div>';  if(r.sug&&r.sug.length)h+='<div class="rks">Todavía no se lo compraron: '+r.sug.map(esc).join(', ')+'</div>';  h+='</div>'});return h+'</div>'}
function cmphtml(v){if(!v.cm||!v.cm.length)return '';var frac=v.o.frac||0,h='<div class="rkf camp"><h3>Campañas del mes</h3>'; v.cm.forEach(function(r){var p=r.m?Math.round(r.r/r.m*100):0,e=r.m?qest(r.r,r.m,frac):['mok','moktxt'];  h+='<div class="rkl"><div class="rkn">'+esc(r.n)+(r.t==='sku'&&r.mi?' <span style="font-weight:400">(mínimo '+r.mi+' artículos)</span>':'')+'</div>';  if(r.pe){h+='<div class="rkq">Arranca el <b>'+esc(r.dn)+' '+esc(r.d1)+'</b>'+(r.d2?' y va hasta el '+esc(r.d2):'')+'. Tu meta: <b>'+r.mt+'</b>. Todavía no cuenta nada: lo que vendas desde ese día es lo que suma.</div>';   if(r.pr)h+='<div class="rks">'+esc(r.pr)+'</div>'; h+='</div>'; return;}  if(r.m){h+='<div class="rkp">Llevás <b>'+r.rt+'</b> de <b>'+r.mt+'</b>'+(r.bs?' <span style="color:#65726b">('+esc(r.bs)+')</span>':'')+' · <b class="'+e[1]+'">'+p+'%</b>'+(r.r<r.m?' · te faltan <b>'+valTxtFalta(r)+'</b>':' · cumplida')+'</div>'+qbar(r.r,r.m,frac);}  else{h+='<div class="rkp">Llevás <b>'+r.rt+'</b> (sin meta cargada)</div>';}  if(r.nb)h+='<div class="rks">Cuenta como nuevo el cliente que '+esc(r.nb)+'.</div>';  if(r.bd&&r.bd.length){h+='<div class="rkb"><b>'+(r.bt?esc(r.bt):('Estás a 1 artículo de sumar '+r.bn+(r.bn===1?' cliente':' clientes')+':'))+'</b>';   r.bd.forEach(function(z){h+='<div class="rkbl">'+esc(z.c)+(z.f?' <span>→ '+esc(z.f)+'</span>':'')+(z.p?' <span>'+fmt(z.p)+'/mes</span>':'')+'</div>';});   if(r.bn>r.bd.length)h+='<div class="rkbl">y '+(r.bn-r.bd.length)+' más</div>'; h+='</div>';}  if(r.pr)h+='<div class="rks">'+esc(r.pr)+'</div>';  h+='</div>'});return h+'</div>'}
function valTxtFalta(r){var d=r.m-r.r;if(r.u==='art')return (Math.round(d*100)/100).toString().replace('.',',')+' art/cliente';if(r.u==='clientes')return Math.ceil(d)+' clientes';if(r.u==='$')return qshort(d);if(r.u==='t')return (Math.round(d*10)/10)+' t';if(r.u==='L')return Math.round(d)+' L';return Math.ceil(d)+' cj';}
function qhtml(v){var q=v.q;if(!q)return '';var frac=v.o.frac||0,hoy=Math.round(frac*100),h='<div class="metas"><div class="metah"><b>METAS COMERCIALES</b><span>Hoy deberías ir '+hoy+'%</span></div>',b=q.b||{};if(b.m>0){var p=Math.round((b.r||0)/b.m*100),e=qest(b.r||0,b.m,frac);h+='<div class="mb"><div class="mtop"><div class="mnom">FERNET BRANCA</div><div class="mpct '+e[1]+'">'+p+'%</div></div><div class="mval">'+qlit(b.r)+' / '+qlit(b.m)+' · faltan '+qlit(Math.max(0,b.m-b.r))+'</div>'+qbar(b.r,b.m,frac)+'</div>';var ds=[];[['vm','vr','Sernova'],['cm','cr','Carpano'],['vim','vir','Fabre'],['mm','mr','Brancamenta'],['tm','tr','Vittone'],['gm','gr','Gin Spirito']].forEach(function(x){var m=Number(b[x[0]])||0,r=Number(b[x[1]])||0;if(!m&&!r)return;if(!m){ds.push('<div class="mmini"><div class="mminit"><span>'+x[2]+'</span><b>—</b></div><div class="mminiv">'+qlit(r)+' (sin cuota)</div></div>');return;}var pp=Math.round(r/m*100),ee=qest(r,m,frac);ds.push('<div class="mmini"><div class="mminit"><span>'+x[2]+'</span><b class="'+ee[1]+'">'+pp+'%</b></div><div class="mminiv">'+qlit(r)+' / '+qlit(m)+'</div>'+qbar(r,m,frac)+'</div>');});if(ds.length)h+='<div class="mder">'+ds.join('')+'</div>';}var fs=[];(q.f||[]).forEach(function(x){var k=x[0],m=x[1],r=x[2],cm=x[3],cr=x[4],p=Math.round(r/m*100),e=qest(r,m,frac),nom=k==='FELPITA'?'FELPITA ★':k==='QUERUCLOR'?'QUERUCLOR ↑':k;fs.push('<div class="mfam '+(k==='FELPITA'?'prio':k==='QUERUCLOR'?'imp':'')+'"><div class="mfamt"><div class="mfamn">'+nom+'</div><div class="mfamp '+e[1]+'">'+p+'%</div></div><div class="mfamv">'+qvol(r,k)+' / '+qvol(m,k)+'</div>'+qbar(r,m,frac)+'</div>');});if(fs.length)h+='<div class="mfams">'+fs.join('')+'</div>';return h+'</div>';}
function pintar(){
  var v = quien ? elVend(quien) : null;
  var h = '';
  var viejoDias = dias(G.gen);
  if(!v){
    h += '<h1>' + esc(G.titulo || 'Rutas') + '</h1><div class="sub">Datos al ' + fcorta(G.gen) + ' · elegí tu nombre</div>';
    G.vs.forEach(function(x){ h += '<button class="vbtn" onclick="elegir(\'' + x.id + '\')">' + esc(x.nom) + '</button>'; });
    document.body.innerHTML = h; return;
  }
  fijarCat(v);
  var tieneDias = !!v.dias;
  var D = tieneDias ? (v.dias[diaAct] || {c:[],p:[],x:[]}) : v.cartera;
  if(v.ag){ var aa=agenda(v.id), hh=hoyIso(); D={c:D.c.slice().sort(function(a,b){function pr(c){var z=aa[c.n]||{},f=z.r||z.f||'';if(z.e==='visitado')return 9;if(f===hh)return 0;if(f&&f<hh)return 1;if(f)return 2;return 3;}return pr(a)-pr(b);}),p:D.p,x:D.x}; }
  var mk = marcas(v.id);
  var titSec = tieneDias ? ('ruta del ' + DNOM[diaAct]) : 'tu cartera';
  h += '<h1>' + esc(v.nom) + ' — ' + titSec + '</h1>';
  h += '<div class="sub">Datos al ' + fcorta(G.gen) + ' · ' + (D.c.length + D.p.length + D.x.length) + ' clientes</div>';
  if(viejoDias !== null && viejoDias > 2) h += '<div class="viejo">⚠ Estos datos son del ' + fcorta(G.gen) + '. Abrí la app con señal y se actualiza sola.</div>';
  if(tieneDias){
    var tabs = '<div class="tabs">';
    DIAS.forEach(function(d){ tabs += '<button class="tab' + (d===diaAct?' act':'') + '" onclick="cambiaDia(\'' + d + '\')">' + DNOM[d].slice(0,3) + '</button>'; });
    h += tabs + '</div>';
  }
  var pct = v.o.meta > 0 ? Math.round(v.o.real/v.o.meta*100) : 0;
  if(BL.obj) h += '<div class="obj"><strong>Objetivo de ' + MESN[v.o.mes-1] + ':</strong> ' + fmt(v.o.meta) + '<div class="barra"><div class="barin" style="width:' + Math.min(pct,100) + '%"></div><div class="raya" style="left:' + Math.round(v.o.frac*100) + '%"></div></div>' + '<div class="rango">Llevás ' + fmt(v.o.real) + ' (' + pct + '%). La rayita marca dónde tendrías que ir hoy (' + Math.round(v.o.frac*100) + '%).</div></div>';
  if(BL.cmp) h += cmphtml(v);
  if(BL.met) h += qhtml(v);
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
  h += '<details class="sec" id="hoy" open><summary><span class="fl">&#9656;</span><span class="tit">' + (tieneDias ? 'Tu ruta de hoy' : 'Tu cartera') + '</span><span class="cnt">' + D.c.length + '</span></summary>';
  h += '<div class="bwrap"><input class="busca" type="search" placeholder="Buscar cliente..." oninput="fil(this.value)"></div>';
  D.c.forEach(function(c, ix){
    var d = dias(c.u), tarde = d !== null && d > v.um;
    var m = mk[c.n] || {};
    var meta = tarde ? '<span class="cmeta rojo">' + d + ' d</span>' : '<span class="cmeta">' + fmt(c.p) + '/mes</span>';
    if(v.ag){ var az=agenda(v.id)[c.n]||{}, af=az.r||az.f||''; if(az.e!=='visitado'&&af===hoyIso())meta='<span class="cmeta hoy">VISITAR HOY</span>'; else if(az.e!=='visitado'&&af&&af<hoyIso())meta='<span class="cmeta rojo">ATRASADO</span>'; }
    h += '<details class="cli' + (m.v ? ' vis' : '') + '" id="cli' + c.n + '" data-n="' + esc(c.c).toLowerCase() + '">';
    h += '<summary><span class="sem s' + c.s + '"></span>' + (ix < 3 ? '<span class="estr">★</span>' : '') + '<span class="cnom">' + esc(c.c) + (c.au ? ' <span class="nvo">nuevo</span>' : '') + (c.rg ? ' <span class="foq">★</span>' : '') + '</span><span class="tick">✓</span>' + meta + '</summary>';
    h += focohtml(c);
    if(c.fg) h += '<div class="falt">⚠ El repositor encontró faltando en góndola: <b>'+c.fg.f.map(esc).join(' · ')+'</b><div class="faltm">'+esc(c.fg.repo)+' · '+fcorta(c.fg.fecha)+'</div></div>';
    h += '<div class="cuerpo">';
    if(c.i) h += '<div class="dir">' + esc(c.i) + '</div>';
    h += '<div class="lin">Compra por mes: <strong>' + fmt(c.p) + '</strong></div>';
    h += '<div class="lin">Última compra: <span class="' + (tarde?'rojo':'') + '">' + fcorta(c.u) + (d!==null?' (hace ' + d + ' días)':'') + '</span></div>';
    if(c.f.length) h += '<div class="lin">Ofrecerle: ' + c.f.map(function(f){ return '<span class="chip">' + esc(f) + '</span>'; }).join('') + '</div>';
    if(c.rp.length) h += '<div class="repo">Reponer: ' + c.rp.map(function(y){ return esc(y[0]) + ' ' + fmt(y[1]); }).join(' · ') + '</div>';
    h += uvhtml(c) + bhtml(c) + cohtml(c);
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
      if(q.i) h += '<div class="dir">' + esc(q.i) + '</div>';
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
      if(r.i) h += '<div class="dir">' + esc(r.i) + '</div>';
      h += '<div class="fperd">No registra compras en el último año. Cliente para abrir de cero.</div></div></details>';
    });
    h += '</details>';
  }
  document.body.innerHTML = h;
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
try{ pintar(); }catch(e){ document.body.innerHTML = '<div style=\'padding:20px;color:#c0392b;font-size:16px\'>No se pudo abrir el archivo en este tel\u00e9fono.<br><br>Prob\u00e1 abrirlo con <b>Safari</b> o <b>Chrome</b>: toc\u00e1 el archivo, despu\u00e9s el bot\u00f3n de compartir y \'Abrir en Safari\'.<br><br>(' + (e && e.message ? e.message : e) + ')</div>'; }
