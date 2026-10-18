/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* Paints the welcome page from CONFIG before anything else loads: CSS colors, font, text, logo, tab title. */
(function(){
const C=window.CONFIG, T=C.theme, root=document.documentElement.style;
const hexA=(h,a)=>{ const n=parseInt(h.slice(1),16); return 'rgba('+((n>>16)&255)+','+((n>>8)&255)+','+(n&255)+','+a+')'; };
const vars={bg:T.bg,glow:T.bgGlow,ink:T.ink,sub:T.sub,dim:T.dim,accent:T.accent,hi:T.accentHi,lo:T.accentLo,atext:T.accentText,on:T.onAccent,
 'accent-25':hexA(T.accent,.25),'accent-70':hexA(T.accent,.7),'hi-22':hexA(T.accentHi,.22),'hi-35':hexA(T.accentHi,.35),'hi-55':hexA(T.accentHi,.55),'hi-85':hexA(T.accentHi,.85),'hi-17':hexA(T.accentHi,.17)};
for(const k in vars) root.setProperty('--'+k,vars[k]);
const fam=(C.font&&C.font.family)||'system-ui';
root.setProperty('--font',"'"+fam+"', system-ui, sans-serif");
if(C.font&&C.font.local){   // fonts served by the app itself (no third-party request); the canvas weights are fetched up front
 const l=document.createElement('link'); l.rel='stylesheet'; l.href=C.font.local; document.head.appendChild(l);
 try{ if(document.fonts&&document.fonts.load){ l.onload=()=>{ [400,600,700,800].forEach(w=>document.fonts.load(w+' 16px \''+fam+'\'').catch(()=>{})); }; } }catch(e){}
}
if(C.font&&C.font.google){
 const l=document.createElement('link'); l.rel='stylesheet';
 l.href='https://fonts.googleapis.com/css2?family='+C.font.google.replace(/ /g,'+')+'&display=swap';
 document.head.appendChild(l);
}
document.title=C.pageTitle||C.name;
const tc=document.querySelector('meta[name=theme-color]'); if(tc) tc.content=T.bg;
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
$('b-title').textContent=C.name;
$('b-sub').innerHTML='<span>'+esc(C.subtitle||'')+'</span>'; if(!C.subtitle) $('b-sub').style.display='none';
const tg=C.tagline||[]; $('b-tag').innerHTML=tg.map(esc).join('<i>&bull;</i>'); if(!tg.length) $('b-tag').style.display='none';
$('b-what').textContent=C.blurb||''; if(!C.blurb) $('b-what').style.display='none';
$('b-welcome').innerHTML=(C.welcome||[]).map(p=>'<p>'+esc(p).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>')+'</p>').join(''); if(!(C.welcome||[]).length) $('b-welcome').style.display='none';
$('tapstart').textContent=C.startLabel||'START';
const a=(C.assets||[]).find(x=>x.name===C.logo);
if(a){ $('b-logo').src=a.src; $('b-logo').alt=C.name; } else $('b-hero').style.display='none';
})();
