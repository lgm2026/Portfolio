/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* Starts the app once the page has loaded (moved out of an inline <script> in r7 so the page runs under a CSP without 'unsafe-inline'). */
window.addEventListener('load',()=>window.APP.boot());
/* r7.4.1: no welcome page. The loading plate stays only while the assets load; the moment the engine is ready (it shows its START
   button) the app starts itself and the title screen is the first thing seen. Sound: a browser only lets audio play after a
   touch or a key, so the audio engine is woken by the first real tap or key press instead of by a START button. */
(function(){
 const start=()=>{ const b=document.getElementById('tapstart'); if(!b||b.style.display!=='block'||!b.onclick) return false; b.onclick(); return true; };
 const wake=()=>{ try{ if(window.AUDIO){ AUDIO.init(); AUDIO.resume(); } }catch(e){} };
 ['pointerdown','touchstart','keydown'].forEach(t=>document.addEventListener(t,wake,{capture:true,passive:true}));
 const poll=setInterval(()=>{ if(start()) clearInterval(poll); },50); setTimeout(()=>clearInterval(poll),60000);
})();
