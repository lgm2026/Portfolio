/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* AUDIO ENGINE (from the RK Mobile Clubhouse, generalized).
   - 8-BIT: a tiny step sequencer (square / triangle / saw + noise drums). Songs are text grids, see SONGS below.
     Grammar: one token per step; a note like C4 / F#3 starts a note, '=' holds the previous one, '.' is a rest.
     Drums: k kick, s snare, h hat, o open hat, c crash.
   - RADIO: optional streamed songs (MP3/OGG) from CONFIG.audio.radio, played in turn through one <audio> element
     routed into WebAudio so MUSIC ON/OFF and fades work. Falls back to the 8-bit theme if a file can't play.
   - SFX: synthesized UI sounds (AUDIO.sfx('ok'|'back'|'blip'|'buzzer'|'cheer'|'point'|...)).
   API: AUDIO.play(name) | AUDIO.jingle('win'|'lose'|'fanfare') | AUDIO.stopMusic() | AUDIO.sfx(name)
   v1.2 (for renditions, so they never edit this file):
     AUDIO.addSongs({name:{bpm,steps,ch,dr}})   AUDIO.addJingles({...})
     AUDIO.addSfx(name, fn)    fn(K) where K={ac,t,out,tone,noise,arp,band}; a name here replaces a built-in one (e.g. 'blip')
     AUDIO.addAmbience(name, fn)   fn(ac,out) builds a looping bed and returns {stop(t)}; AUDIO.ambience(name|null) crossfades.
       Ambience follows MUSIC ON/OFF and pauses while the page is hidden. */
(function(){
const NOTE_IDX = {C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11};
function freqOf(n){
  const m = /^([A-G][#b]?)(-?\d)$/.exec(n); if(!m) return 0;
  const semi = NOTE_IDX[m[1]] + (parseInt(m[2],10)+1)*12;
  return 440*Math.pow(2,(semi-69)/12);
}
function P(s){ return s.trim().split(/\s+/); }

/* ---------------- songs (add more, or put {name:{...}} in CONFIG.audio.songs) ---------------- */
const SONGS = Object.assign({
theme:{ bpm:112, steps:4, ch:[
 {w:'tri',v:.18,p:P(`C3 . . . C3 . G2 . A2 . . . A2 . E2 .
                     F2 . . . F2 . C3 . G2 . . . G2 . B2 .`)},
 {w:'square',v:.08,p:P(`E4 = G4 = C5 = = . B4 = A4 = G4 = = .
                        A4 = = . G4 = F4 = D4 = = . = . . .`)},
 {w:'square',v:.05,p:P(`C4 . E4 . G4 . E4 . A3 . C4 . E4 . C4 .
                        F3 . A3 . C4 . A3 . G3 . B3 . D4 . B3 .`)}],
 dr:{v:.38,p:P(`k . h . s . h . k . h k s . h o
               k . h . s . h . k k h . s h h c`)}}
}, (window.CONFIG&&CONFIG.audio&&CONFIG.audio.songs)||{});
const JINGLES = {
win:  {bpm:150,steps:4,once:true,ch:[{w:'square',v:.14,p:P('C4 E4 G4 C5 . G4 C5 = = = . .')},{w:'tri',v:.2,p:P('C3 C3 G3 G3 . G2 C3 = = = . .')}],dr:{v:.4,p:P('k . s . . . c . . . . .')}},
lose: {bpm:110,steps:4,once:true,ch:[{w:'square',v:.12,p:P('E4 . Eb4 . D4 . C#4 = = = . .')},{w:'tri',v:.2,p:P('A2 . G#2 . G2 . F#2 = = = . .')}],dr:null},
fanfare:{bpm:140,steps:4,once:true,ch:[{w:'square',v:.14,p:P('G4 . G4 . A4 . B4 . C5 = = . E5 = = = G5 = = = = = . .')},{w:'tri',v:.22,p:P('G2 . E2 . F2 . G2 . C3 = = . C3 = = = C3 = G3 = C4 = . .')}],dr:{v:.45,p:P('k . k . s . k . k . s . c . . . k . s . c . . .')}}
};

/* ---------------- the radio (from CONFIG.audio.radio: [{key,t,d,src}]) ---------------- */
const ROCK = {}, RADIO = [];
for(const s of ((window.CONFIG&&CONFIG.audio&&CONFIG.audio.radio)||[])){ ROCK[s.key]={t:s.t||s.key.toUpperCase(),src:s.src,d:s.d||''}; RADIO.push(s.key); }

const CUSTOM_SFX = {}, AMBI = {};
const AUDIO = {
  ac:null, master:null, musicG:null, sfxG:null, ambG:null, _amb:null, _ambName:null,
  musicOn:true, sfxOn:true, curName:null, _timer:null, _step:0, _nextT:0, _song:null, _active:[],
  ROCK, RADIO, rockGain:.85, _el:null, _elNode:null, _elG:null, _file:null, _radio:false, _radioI:0, _pauseT:null, _failed:false,
  init(){
    if(this.ac) return;
    const AC = window.AudioContext||window.webkitAudioContext; if(!AC) return;
    this.ac = new AC();
    this.master = this.ac.createGain(); this.master.gain.value=.9; this.master.connect(this.ac.destination);
    this.musicG = this.ac.createGain(); this.musicG.connect(this.master);
    this.sfxG = this.ac.createGain(); this.sfxG.connect(this.master);
    this.ambG = this.ac.createGain(); this.ambG.gain.value=1; this.ambG.connect(this.master);
    document.addEventListener('visibilitychange',()=>{ if(document.hidden) this._ambStop(.2,true); else if(this._ambName) this.ambience(this._ambName,true); });
    this._noiseBuf = this._mkNoise();
    this.setMusic(this.musicOn); this.setSfx(this.sfxOn);
    if(this._el) this._ensureEl();
    if(this._ambName) this.ambience(this._ambName,true);   // preloaded at boot: wire it into the mix now
  },
  resume(){ if(this.ac && this.ac.state==='suspended') this.ac.resume(); },
  isRock(name){ return (name==='radio'&&RADIO.length>0)||!!ROCK[name]; },
  /* what the title + dashboard play: the radio if it has songs, else CONFIG.audio.menuMusic */
  menuMusic(){ return RADIO.length?'radio':((window.CONFIG&&CONFIG.audio&&CONFIG.audio.menuMusic)||'theme'); },
  has(name){ return !!SONGS[name]||this.isRock(name); },
  trackTitle(name){ return name==='radio'?'RADIO':(ROCK[name]?ROCK[name].t:name); },
  /* is this rock song (or the radio) what's playing right now? */
  playing(name){
    if(!this._el||this._el.paused||!this.isRock(this.curName)) return false;
    if(name==='radio') return this.curName==='radio';
    return this._file===name;
  },
  setMusic(on){ this.musicOn=on; if(this.musicG) this.musicG.gain.value = on?1:0; if(this.ambG) this.ambG.gain.value = on?1:0; if(this._el&&!this._elG) this._el.muted=!on; },
  /* ---- v1.2 registries ---- */
  addSongs(o){ Object.assign(SONGS,o||{}); },
  addJingles(o){ Object.assign(JINGLES,o||{}); },
  addSfx(name,fn){ CUSTOM_SFX[name]=fn; },
  addAmbience(name,fn){ AMBI[name]=fn; },
  /* ---- ambience: one looping bed at a time, crossfaded ---- */
  ambience(name,force){
    if(!force&&name===this._ambName&&(this._amb||!this.ac)) return;
    this._ambName=name||null;
    if(!this.ac||document.hidden) return;
    this._ambStop(.8);
    const fn=name&&AMBI[name]; if(!fn) return;
    const g=this.ac.createGain(), now=this.ac.currentTime; g.gain.setValueAtTime(.0001,now); g.gain.linearRampToValueAtTime(1,now+1.2); g.connect(this.ambG);
    let h=null; try{ h=fn(this.ac,g,this._noiseBuf); }catch(e){ h=null; }
    this._amb={g,h};
  },
  _ambStop(t,keepName){
    const a=this._amb; if(!a) return; this._amb=null; if(!keepName&&!this._ambName) this._ambName=null;
    const now=this.ac.currentTime; a.g.gain.cancelScheduledValues(now); a.g.gain.setValueAtTime(Math.max(.0001,a.g.gain.value),now); a.g.gain.linearRampToValueAtTime(.0001,now+t);
    setTimeout(()=>{ try{ a.h&&a.h.stop&&a.h.stop(); }catch(e){} try{ a.g.disconnect(); }catch(e){} },t*1000+80);
  },
  /* ---- the radio: one streaming <audio> element routed through the music bus (so MUSIC ON/OFF and fades work) ---- */
  preload(){ if(!RADIO.length) return; const el=this._ensureEl(); if(!el.getAttribute('src')){ el.preload='auto'; el.src=ROCK[RADIO[0]].src; } },
  _ensureEl(){
    if(!this._el){
      const el=new Audio(); el.preload='auto'; el.setAttribute('playsinline',''); el.setAttribute('webkit-playsinline','');
      el.addEventListener('ended',()=>this._onEnded());
      el.addEventListener('error',()=>this._onError());
      this._el=el;
    }
    if(this.ac&&!this._elNode&&!this._elTried){
      this._elTried=true;
      try{
        this._elNode=this.ac.createMediaElementSource(this._el);
        this._elG=this.ac.createGain(); this._elG.gain.value=0;
        this._elNode.connect(this._elG); this._elG.connect(this.musicG);
      }catch(e){ this._elNode=null; this._elG=null; }
    }
    return this._el;
  },
  _fileVol(v,t){
    if(this._elG&&this.ac){ const g=this._elG.gain, now=this.ac.currentTime; g.cancelScheduledValues(now); g.setValueAtTime(Math.max(.0001,g.value),now); g.linearRampToValueAtTime(Math.max(.0001,v),now+(t||.01)); }
    else if(this._el){ try{ this._el.volume=Math.max(0,Math.min(1,v)); }catch(e){} }
  },
  _playFile(key,radio){
    const R=ROCK[key]; if(!R) return;
    const el=this._ensureEl();
    clearTimeout(this._pauseT); this._stopSeq();
    const same=this._file===key&&(el.getAttribute('src')||'')===R.src&&!el.ended;
    this._file=key; this._radio=!!radio; this.curName=radio?'radio':key; this._failed=false;
    if(!same){ el.src=R.src; }
    el.loop=!radio; el.muted=!this._elG&&!this.musicOn;
    if(this._elG){ const g=this._elG.gain, now=this.ac.currentTime; g.cancelScheduledValues(now); g.setValueAtTime(.0001,now); g.linearRampToValueAtTime(this.rockGain,now+(same?.45:.2)); }
    else this._fileVol(this.rockGain);
    try{ const p=el.play(); if(p&&p.catch) p.catch(()=>{}); }catch(e){}
  },
  _pauseFile(t){
    if(!this._el||this._el.paused) return;
    t=t||.35; this._fileVol(0,t);
    clearTimeout(this._pauseT);
    this._pauseT=setTimeout(()=>{ try{ this._el.pause(); }catch(e){} },t*1000+60);
  },
  _onEnded(){ if(this.curName==='radio'){ this._radioI=(this._radioI+1)%RADIO.length; this._playFile(RADIO[this._radioI],true); } },
  /* no network / no MP3 support: fall back to the 8-bit theme */
  _onError(){
    if(!this.isRock(this.curName)||!this.ac) return;
    const keep=this.curName; this._failed=true; this._file=null;
    this._playSeq('theme'); this.curName=keep;
  },
  setSfx(on){ this.sfxOn=on; if(this.sfxG) this.sfxG.gain.value = on?1:0; },
  _mkNoise(){
    const len = this.ac.sampleRate*1.2, b=this.ac.createBuffer(1,len,this.ac.sampleRate), d=b.getChannelData(0);
    for(let i=0;i<len;i++) d[i]=Math.random()*2-1; return b;
  },
  /* ---- what to play: the radio / a rock song (streamed) or an 8-bit track (sequenced) ---- */
  play(name){
    if(!this.ac){ this.curName=name; return; }
    if(this.isRock(name)){
      if(name==='radio'){
        if(this.curName==='radio'&&(this._failed||(this._el&&!this._el.paused))) return;
        this._playFile(this._radio&&this._file?this._file:RADIO[this._radioI],true);   // pick up where the radio left off
        return;
      }
      if(this.curName===name&&this._el&&!this._el.paused) return;
      this._playFile(name,false); return;
    }
    if(this.curName===name && this._timer && !SONGS[name]?.once) return;
    this._pauseFile(.3);
    this._playSeq(name);
  },
  /* ---- sequencer ---- */
  _playSeq(name){
    this._stopSeq(); this.curName=name;
    const song = SONGS[name]||JINGLES[name]; if(!song) return;
    this._song=song; this._step=0; this._nextT=this.ac.currentTime+.06;
    this._timer=setInterval(()=>this._tick(),30);
  },
  jingle(name){
    const j=JINGLES[name]; if(!j||!this.ac) return;
    if(this.isRock(this.curName)&&this._el&&!this._el.paused){   // over the radio: duck it, play the jingle, bring it back up
      this._fileVol(this.rockGain*.22,.08); this._stopSeq(); this._song=j; this._step=0; this._nextT=this.ac.currentTime+.05;
      this._timer=setInterval(()=>{
        if(this._song&&this._step>=this._patLen(this._song)){ this._stopSeq(); if(this.isRock(this.curName)) this._fileVol(this.rockGain,.8); return; }
        this._tick();
      },30);
      return;
    }
    const prev=this.curName; this.stopMusic(); this._song=j; this.curName='__j';
    this._step=0; this._nextT=this.ac.currentTime+.05;
    this._timer=setInterval(()=>{
      if(this._song&&this._step>=this._patLen(this._song)){ this.stopMusic(); if(prev&&SONGS[prev]) this.play(prev); return; }
      this._tick();
    },30);
  },
  _patLen(s){ let m=0; for(const c of s.ch) m=Math.max(m,c.p.length); if(s.dr) m=Math.max(m,s.dr.p.length); return m; },
  _stopSeq(){
    if(this._timer){ clearInterval(this._timer); this._timer=null; }
    this._song=null;
  },
  stopMusic(){ this._stopSeq(); this._pauseFile(.2); this.curName=null; },
  _tick(){
    const s=this._song; if(!s) return;
    const spb = 60/s.bpm/s.steps, ahead=.14, len=this._patLen(s);
    while(this._nextT < this.ac.currentTime+ahead){
      const st=this._step%len;
      if(s.once && this._step>=len){ return; }
      for(const c of s.ch){
        const n=c.p[st%c.p.length];
        if(n && n!=='.' && n!=='='){
          let dur=spb; for(let k=1;k<64;k++){ const nx=c.p[(st+k)%c.p.length]; if(nx==='=') dur+=spb; else break; }
          this._note(c, freqOf(n), this._nextT, dur*.92);
        }
      }
      if(s.dr){
        const d=s.dr.p[st%s.dr.p.length];
        if(d && d!=='.') this._drum(d, this._nextT, s.dr.v);
      }
      this._nextT+=spb; this._step++;
    }
  },
  _note(c, f, t, dur){
    if(!f) return;
    const o=this.ac.createOscillator(), g=this.ac.createGain();
    o.type = c.w==='tri'?'triangle':(c.w==='saw'?'sawtooth':'square');
    o.frequency.setValueAtTime(f,t);
    g.gain.setValueAtTime(0,t);
    g.gain.linearRampToValueAtTime(c.v,t+.004);
    g.gain.setValueAtTime(c.v,t+Math.max(.004,dur*.6));
    g.gain.linearRampToValueAtTime(.0001,t+dur);
    o.connect(g); g.connect(this.musicG);
    o.start(t); o.stop(t+dur+.02);
  },
  _drum(d,t,v){
    const ac=this.ac;
    if(d==='k'){
      const o=ac.createOscillator(),g=ac.createGain();
      o.type='sine'; o.frequency.setValueAtTime(130,t); o.frequency.exponentialRampToValueAtTime(42,t+.1);
      g.gain.setValueAtTime(v,t); g.gain.exponentialRampToValueAtTime(.001,t+.13);
      o.connect(g); g.connect(this.musicG); o.start(t); o.stop(t+.15); return;
    }
    const src=ac.createBufferSource(); src.buffer=this._noiseBuf;
    const g=ac.createGain(), f=ac.createBiquadFilter();
    let dur=.05;
    if(d==='s'){ f.type='bandpass'; f.frequency.value=1900; dur=.09; }
    else if(d==='h'){ f.type='highpass'; f.frequency.value=7500; dur=.03; }
    else if(d==='o'){ f.type='highpass'; f.frequency.value=6500; dur=.11; }
    else { f.type='highpass'; f.frequency.value=5200; dur=.34; v*=.9; }
    g.gain.setValueAtTime(v*.8,t); g.gain.exponentialRampToValueAtTime(.001,t+dur);
    src.connect(f); f.connect(g); g.connect(this.musicG);
    src.start(t); src.stop(t+dur+.02);
  },
  /* ---- sfx ---- */
  sfx(name){
    if(!this.ac||!this.sfxOn) return;
    const t=this.ac.currentTime, ac=this.ac;
    const tone=(w,f0,f1,dur,v=.18)=>{
      const o=ac.createOscillator(),g=ac.createGain();
      o.type=w; o.frequency.setValueAtTime(f0,t);
      if(f1) o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur);
      g.gain.setValueAtTime(v,t); g.gain.exponentialRampToValueAtTime(.001,t+dur);
      o.connect(g); g.connect(this.sfxG); o.start(t); o.stop(t+dur+.02);
    };
    const noise=(dur,hp,v=.2)=>{
      const s=ac.createBufferSource(); s.buffer=this._noiseBuf;
      const f=ac.createBiquadFilter(); f.type='highpass'; f.frequency.value=hp;
      const g=ac.createGain(); g.gain.setValueAtTime(v,t); g.gain.exponentialRampToValueAtTime(.001,t+dur);
      s.connect(f); f.connect(g); g.connect(this.sfxG); s.start(t); s.stop(t+dur+.02);
    };
    const arp=(ns,step=.07,v=.15,w='square')=>{
      ns.forEach((f,i)=>{
        const o=ac.createOscillator(),g=ac.createGain(),tt=t+i*step;
        o.type=w; o.frequency.value=f;
        g.gain.setValueAtTime(v,tt); g.gain.exponentialRampToValueAtTime(.001,tt+step*1.4);
        o.connect(g); g.connect(this.sfxG); o.start(tt); o.stop(tt+step*1.5);
      });
    };
    const band=(dur,f0,f1,q=6,v=.2,dt=0)=>{
      const s=ac.createBufferSource(); s.buffer=this._noiseBuf;
      const f=ac.createBiquadFilter(); f.type='bandpass'; f.Q.value=q; f.frequency.setValueAtTime(f0,t+dt); if(f1) f.frequency.exponentialRampToValueAtTime(Math.max(30,f1),t+dt+dur);
      const g=ac.createGain(); g.gain.setValueAtTime(.0001,t+dt); g.gain.linearRampToValueAtTime(v,t+dt+Math.min(.02,dur*.2)); g.gain.exponentialRampToValueAtTime(.001,t+dt+dur);
      s.connect(f); f.connect(g); g.connect(this.sfxG); s.start(t+dt,Math.random()*.5); s.stop(t+dt+dur+.02);
    };
    if(CUSTOM_SFX[name]){ try{ CUSTOM_SFX[name]({ac,t,out:this.sfxG,tone,noise,arp,band}); }catch(e){} return; }
    switch(name){
      case 'blip': tone('square',620,0,.045,.1); break;
      case 'ok': arp([523,784],.05); break;
      case 'back': tone('square',392,250,.07,.12); break;
      case 'point': tone('square',880,1320,.07,.12); break;
      case 'bigpoint': arp([659,880,1175,1760],.045); break;
      case 'pickup': arp([784,1175],.04); break;
      case 'hurt': tone('square',240,90,.22,.22); noise(.15,900,.15); break;
      case 'crash': noise(.4,350,.3); tone('sawtooth',160,45,.35,.22); break;
      case 'nearmiss': tone('square',1400,900,.06,.08); break;
      case 'horn': tone('square',330,330,.18,.14); tone('square',415,415,.18,.12); break;
      case 'swish': noise(.14,2800,.12); break;
      case 'thud': tone('sine',150,60,.1,.3); noise(.05,500,.12); break;
      case 'board': tone('sine',220,110,.09,.25); break;
      case 'hole': arp([587,880,1175],.05,.18); break;
      case 'card': noise(.06,3400,.14); tone('square',980,1300,.04,.07); break;
      case 'wrench': tone('square',1100,700,.05,.1); noise(.04,4500,.1); break;
      case 'buzzer': tone('sawtooth',130,110,.3,.22); break;
      case 'tick': tone('square',1000,0,.02,.06); break;
      case 'cheer': arp([523,659,784,1047,1319],.055,.14); noise(.3,1500,.07); break;
      case 'stir': noise(.08,1200,.08); break;
      case 'rev': tone('sawtooth',70,220,.5,.2); noise(.3,300,.08); break;
      case 'heart': arp([880,660],.07,.14); break;
    }
  },
};
window.AUDIO=AUDIO;
})();
