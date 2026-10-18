/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* MODULE TEMPLATE — copy this file to start a new screen.
   1. Copy to js/mod_<name>.js and change 'blank' below to your scene name.
   2. Add <script src="js/mod_<name>.js"></script> to index.html (under "modules").
   3. Add a card in rendition.js: {id:'<name>', label:'MY THING', icon:'star', scene:'<name>'}
   The rules every scene follows:
   - enter(args): set up state. args.back is where BACK goes. Create native fields here (G.field...).
   - update(dt):  read input ONLY here (G.backHit, G.clicked, G.navList, list.update...). Change scenes with G.go.
   - draw(c):     draw ONLY here. Draw the top bar LAST so lists scroll under it. Modals draw after everything.
   - exit(next):  drop subscriptions / timers. Native fields are removed for you on every scene change.
   - Coordinates are virtual: 270 wide, G.VH (480..600) tall. Colors come from G.C (CONFIG.theme).
   - Per-person data: G.save.mod.<name> (call G.persist() after changing it).  Shared data: G.data (see data.js). */
(function(){
const VW=G.VW, C=G.C;
G.scenes.blank={
 enter(a){
  this.back=a.back||G.homeScene();
  this.card=(G.CFG.cards||[]).find(c=>c.id===a.card)||(a.station?{label:a.station.label,icon:a.station.icon}:null)||{label:'MODULE SLOT'};
  this.st={f:0};
  this.taps=(G.save.mod.blank&&G.save.mod.blank.taps)||0;   // example per-person data
 },
 btns(){ return [{id:'tap',label:'TAP ME',sub:'SAVED PER PERSON: '+this.taps,kind:'primary',x:40,y:G.VH-130,w:VW-80,h:46}]; },
 update(dt){
  if(G.backHit()){ G.go(this.back); return; }
  const id=G.navList(this.st,this.btns());
  if(id==='tap'){ this.taps++; G.save.mod.blank={taps:this.taps}; G.persist(); }
 },
 draw(c){
  G.backdrop(.9);
  const y=G.VH*.26;
  c.beginPath(); c.arc(VW/2,y,34,0,7); c.fillStyle=G.rgba(C.accent,.14); c.fill();
  G.icon(this.card.icon||'grid',c,VW/2,y,34,C.accentText);
  G.txt(this.card.label,VW/2,y+50,11,C.ink,'center',VW-30,800);
  G.para('This screen is an empty module. Copy js/mod_blank.js to build what goes here.',VW/2,y+76,7,C.sub,'center',VW-60);
  G.drawBtns(this.btns(),this.st);
  G.topBar(this.card.label);
 }
};
})();
