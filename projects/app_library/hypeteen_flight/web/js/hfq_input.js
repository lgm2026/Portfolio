/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* INPUT MODE (r7.4): which on-screen controls the airfield shows, decided by how the cadet is actually playing.
   - Not by screen width. A phone, a tablet with a keyboard case and a touchscreen laptop are all handled by what the cadet
     does: the last real input wins. A touch (or a pen) shows the thumb-stick; a mouse click or a movement key hides it.
   - Before any input, the primary pointer decides: a coarse pointer (a finger) starts in touch mode, a fine one (a mouse or a
     trackpad) in mouse mode. A touchscreen laptop therefore starts without the stick and shows it the moment it is touched.
   - Nothing essential is ever hidden: the USE button stays in every mode (it gains an "E" keycap for keyboards), dragging on
     the floor still steers with a mouse or a finger, and the arrow keys and W A S D always walk.
   - Settings > Controls can pin the stick on (some players steer more easily with it whatever they hold) or off.
   API: H.input.cur() -> 'touch' | 'mouse' | 'keys';  H.input.touchUI() -> show the stick?;  H.input.keyHints() -> {use, walk} or null;
        H.input.walkWords() / H.input.useWords() -> how the briefing should say it. Setting: G.save.settings.stick = 'auto' | 'on' | 'off'. */
(function(){
const H=G.HFQ=G.HFQ||{};
const mq=q=>{ try{ return !!(window.matchMedia&&window.matchMedia(q).matches); }catch(e){ return false; } };
const MOVE=/^(Arrow(Up|Down|Left|Right)|Key[WASDE])$/;
const I=H.input={
 mode:null,
 /* before any input: what the primary pointer is */
 initial(){ if(mq('(pointer: coarse)')) return 'touch'; if(mq('(pointer: fine)')) return 'mouse'; return (navigator.maxTouchPoints||0)>0?'touch':'mouse'; },
 cur(){ return I.mode||I.initial(); },
 pref(){ const s=G.save&&G.save.settings; const v=s&&s.stick; return v==='on'||v==='off'?v:'auto'; },
 setPref(v){ if(!G.save) return; G.save.settings.stick=(v==='on'||v==='off')?v:'auto'; G.persist(); },
 touchUI(){ const p=I.pref(); if(p==='on') return true; if(p==='off') return false; return I.cur()==='touch'; },
 /* keyboard legends: an E keycap on USE whenever the cadet is not on touch; the walk legend until they have walked a little with keys or mouse */
 keyHints(){
  if(I.cur()==='touch') return null;
  const s=G.save&&G.save.settings, sc=G.scene;
  if(s&&!s.keysLearned&&sc&&sc.walked>160&&G.sceneName==='world'){ s.keysLearned=1; G.persist(); }
  const walk=s&&s.keysLearned?null:(I.cur()==='keys'?'W A S D OR ARROW KEYS TO WALK • E TO USE':'W A S D TO WALK • OR CLICK THE FLOOR');
  return {use:'E',walk};
 },
 walkWords(){ return I.touchUI()?'drag your thumb on the floor, or on the stick at the bottom left':(I.cur()==='keys'?'press W A S D or the arrow keys':'press W A S D or the arrow keys, or click the floor where you want to go'); },
 useWords(){ return I.cur()==='touch'?'tap USE':'press E (or click USE)'; },
 useShort(){ return I.cur()==='touch'?'TAP USE':'PRESS E'; }
};
/* watch what the cadet really does (capture phase, so every screen counts, canvas or HTML) */
addEventListener('pointerdown',e=>{ I.mode=e.pointerType==='mouse'?'mouse':'touch'; },{capture:true,passive:true});
addEventListener('keydown',e=>{ const a=document.activeElement, typing=!!a&&((a.tagName==='INPUT'&&a.type!=='file'&&a.type!=='checkbox'&&a.type!=='radio')||a.tagName==='TEXTAREA');
 if(!typing&&MOVE.test(e.code)) I.mode='keys'; },{capture:true,passive:true});
})();
