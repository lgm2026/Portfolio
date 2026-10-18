/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* HYPETEEN FLIGHT ACADEMY - SOUND: music for every place, aviation sound effects, and room ambience.
   Everything is synthesized (no audio files), through the shell's AUDIO v1.2 hooks:
     AUDIO.addSongs / addJingles / addSfx / addAmbience   (see audio.js)
   UI sounds are replaced with cockpit + radio ones: a push-to-talk click for taps, a cabin chime for right answers,
   a soft "say again" double-beep for misses, tire chirps on landing, a stall-horn buzz for locked things.
   Songs are 16-step bars (one token per 16th note): a note (C4), '=' holds, '.' rests. Drums: k s h o c. */
(function(){
const P=s=>s.trim().split(/\s+/);
const bars=(...b)=>P(b.join(' '));

/* ============================ MUSIC ============================ */
AUDIO.addSongs({
 /* CLEARED TO ENTER: the title + sign-in theme. D major, heroic. */
 title:{bpm:118,steps:4,ch:[
  {w:'tri',v:.2,p:bars(
   'D2 . . . D2 . A2 . D2 . D2 . A2 . F#2 .','B1 . . . B1 . F#2 . B1 . B1 . F#2 . D2 .','G1 . . . G1 . D2 . G1 . G1 . D2 . B1 .','A1 . . . A1 . E2 . A1 . A1 . E2 . C#2 .',
   'D2 . . . D2 . A2 . D2 . D2 . A2 . F#2 .','B1 . . . B1 . F#2 . B1 . B1 . F#2 . D2 .','E2 . . . E2 . B2 . E2 . E2 . B2 . G2 .','A1 . . . A1 . E2 . A1 . C#2 . E2 . A2 .')},
  {w:'square',v:.085,p:bars(
   'A4 = = = D5 = = = F#5 = = = E5 = D5 =','F#5 = = = = = D5 = B4 = = = = = . .','G4 = = = B4 = = = D5 = = = G5 = F#5 =','E5 = = = = = = = C#5 = = = A4 = = =',
   'A4 = = = D5 = = = F#5 = = = A5 = = =','B5 = = = A5 = F#5 = D5 = = = B4 = D5 =','E5 = = = G5 = = = F#5 = E5 = D5 = = =','C#5 = = = E5 = = = A5 = = = = = . .')},
  {w:'square',v:.04,p:bars(
   'D4 . F#4 . A4 . F#4 . D4 . F#4 . A4 . F#4 .','B3 . D4 . F#4 . D4 . B3 . D4 . F#4 . D4 .','G3 . B3 . D4 . B3 . G3 . B3 . D4 . B3 .','A3 . C#4 . E4 . C#4 . A3 . C#4 . E4 . C#4 .',
   'D4 . F#4 . A4 . F#4 . D4 . F#4 . A4 . F#4 .','B3 . D4 . F#4 . D4 . B3 . D4 . F#4 . D4 .','E3 . G3 . B3 . G3 . E3 . G3 . B3 . G3 .','A3 . C#4 . E4 . C#4 . A3 . C#4 . E4 . A4 .')}],
  dr:{v:.36,p:bars('c . h . s . h . k . h k s . h .','k . h . s . h . k . h k s . h .','k . h . s . h . k . h k s . h .','k . h . s . h . k k s . s s s .',
                   'c . h . s . h . k . h k s . h .','k . h . s . h . k . h k s . h .','k . h . s . h . k . h k s . h .','k . h . s . h . k . s s s . c .')}},
 /* PILOT'S LOUNGE: laid-back hangout, F major. */
 lounge:{bpm:96,steps:4,ch:[
  {w:'tri',v:.17,p:bars(
   'F2 . . . A2 . . . C3 . . . A2 . . .','D2 . . . F2 . . . A2 . . . F2 . . .','A#1 . . . D2 . . . F2 . . . D2 . . .','C2 . . . E2 . . . G2 . . . E2 . . .',
   'F2 . . . A2 . . . C3 . . . A2 . . .','A1 . . . C2 . . . E2 . . . C2 . . .','A#1 . . . D2 . . . F2 . . . D2 . . .','C2 . . . E2 . . . G2 . . . A#2 . . .')},
  {w:'square',v:.055,p:bars(
   '. . A4 = = . C5 = F5 = = = . . . .','. . F5 = E5 = D5 = = = = = . . . .','. . D5 = = . F5 = A#5 = = = A5 = G5 =','G5 = = = = = . . E5 = = = . . . .',
   '. . A4 = = . C5 = F5 = = = G5 = A5 =','A5 = = = G5 = E5 = C5 = = = = = . .','. . D5 = F5 = A#5 = A5 = G5 = F5 = D5 =','E5 = = = = = = = C5 = = = = = . .')},
  {w:'square',v:.03,p:bars(
   '. . A3 . . . C4 . . . A3 . . . C4 .','. . F3 . . . A3 . . . F3 . . . A3 .','. . D4 . . . F4 . . . D4 . . . F4 .','. . E4 . . . G4 . . . E4 . . . G4 .',
   '. . A3 . . . C4 . . . A3 . . . C4 .','. . C4 . . . E4 . . . C4 . . . E4 .','. . D4 . . . F4 . . . D4 . . . F4 .','. . E4 . . . G4 . . . E4 . . . G4 .')}],
  dr:{v:.28,p:bars('k . h . s . h h k . h . s . h .','k . h . s . h h k . h . s . h .','k . h . s . h h k . h . s . h .','k . h . s . h h k . h . s . h .',
                   'k . h . s . h h k . h . s . h .','k . h . s . h h k . h . s . h .','k . h . s . h h k . h . s . h .','k . h . s . h . k . h . s s o .')}},
 /* THE CLASSROOM + every lesson: calm and focused, C major. Quiet so it never competes with reading. */
 classroom:{bpm:88,steps:4,ch:[
  {w:'tri',v:.13,p:bars(
   'C2 = = = = = = = G2 = = = = = = =','G1 = = = = = = = D2 = = = = = = =','A1 = = = = = = = E2 = = = = = = =','F1 = = = = = = = C2 = = = = = = =',
   'C2 = = = = = = = G2 = = = = = = =','G1 = = = = = = = D2 = = = = = = =','F1 = = = = = = = C2 = = = = = = =','G1 = = = = = = = D2 = = = = = = =')},
  {w:'square',v:.028,p:bars(
   'C4 E4 G4 C5 G4 E4 C4 E4 G4 C5 G4 E4 C4 E4 G4 E4','B3 D4 G4 B4 G4 D4 B3 D4 G4 B4 G4 D4 B3 D4 G4 D4','A3 C4 E4 A4 E4 C4 A3 C4 E4 A4 E4 C4 A3 C4 E4 C4','A3 C4 F4 A4 F4 C4 A3 C4 F4 A4 F4 C4 A3 C4 F4 C4',
   'C4 E4 G4 C5 G4 E4 C4 E4 G4 C5 G4 E4 C4 E4 G4 E4','B3 D4 G4 B4 G4 D4 B3 D4 G4 B4 G4 D4 B3 D4 G4 D4','A3 C4 F4 A4 F4 C4 A3 C4 F4 A4 F4 C4 A3 C4 F4 C4','B3 D4 G4 B4 G4 D4 B3 D4 G4 B4 G4 D4 B3 D4 G4 D4')},
  {w:'tri',v:.06,p:bars(
   '. . . . E5 = = = . . . . G5 = = =','. . . . D5 = = = . . . . B4 = = =','. . . . C5 = = = . . . . E5 = = =','. . . . F5 = = = E5 = = = C5 = = =',
   '. . . . E5 = = = . . . . G5 = = =','. . . . D5 = = = G5 = = = F5 = = =','. . . . A5 = = = G5 = = = F5 = = =','E5 = = = = = = = D5 = = = = = = =')}],
  dr:{v:.12,p:bars('k . . . h . . . . . . . h . . .','. . . . h . . . . . . . h . . .')}},
 /* THE HANGAR: a mechanical groove, E minor, with an anvil "ping". */
 hangar:{bpm:104,steps:4,ch:[
  {w:'tri',v:.2,p:bars(
   'E2 . E2 . . E2 . . G2 . E2 . . D2 . .','C2 . C2 . . C2 . . E2 . C2 . . G1 . .','D2 . D2 . . D2 . . F#2 . D2 . . A1 . .','B1 . B1 . . B1 . . D#2 . B1 . . F#2 . .',
   'E2 . E2 . . E2 . . G2 . E2 . . D2 . .','C2 . C2 . . C2 . . E2 . C2 . . G1 . .','A1 . A1 . . A1 . . C2 . A1 . . E2 . .','B1 . B1 . . B1 . . D#2 . B1 . . F#2 . .')},
  {w:'square',v:.065,p:bars(
   'E4 . G4 . B4 = A4 . G4 . E4 . F#4 = G4 .','E4 . G4 . C5 = B4 . G4 . E4 . D4 = E4 .','F#4 . A4 . D5 = C5 . A4 . F#4 . E4 = F#4 .','D#4 . F#4 . B4 = A4 . F#4 . D#4 . B3 = = .',
   'E4 . G4 . B4 = A4 . G4 . E4 . F#4 = G4 .','E4 . G4 . C5 = B4 . G4 . E4 . D4 = E4 .','E4 . A4 . C5 = B4 . A4 . E4 . C4 = E4 .','F#4 . B4 . D#5 = = = F#5 = = = B4 = = .')},
  {w:'square',v:.022,p:bars('. . . . . . B5 . . . . . . . B5 .')}],
  dr:{v:.36,p:bars('k . h k s . h . k k h . s . o .','k . h k s . h . k k h . s . o .','k . h k s . h . k k h . s . o .','k . h k s . h . k k s . s s o .')}},
 /* VIEWING PLATFORM: wide open sky, A lydian (that raised D# sounds like lift-off). */
 platform:{bpm:76,steps:4,ch:[
  {w:'tri',v:.13,p:bars(
   'A1 = = = = = = = = = = = = = = =','D2 = = = = = = = = = = = = = = =','F#1 = = = = = = = = = = = = = = =','E2 = = = = = = = = = = = = = = =',
   'A1 = = = = = = = = = = = = = = =','D2 = = = = = = = = = = = = = = =','B1 = = = = = = = = = = = = = = =','E2 = = = = = = = = = = = = = = =')},
  {w:'square',v:.026,p:bars(
   'E5 . A5 . B5 . D#6 . E6 . D#6 . B5 . A5 .','F#5 . A5 . D6 . A5 . F#5 . A5 . E6 . A5 .','C#5 . F#5 . A5 . C#6 . A5 . F#5 . E5 . F#5 .','B4 . E5 . G#5 . B5 . G#5 . E5 . B4 . E5 .',
   'E5 . A5 . B5 . D#6 . E6 . D#6 . B5 . A5 .','F#5 . A5 . D6 . A5 . F#5 . A5 . E6 . A5 .','B4 . D5 . F#5 . B5 . F#5 . D5 . B4 . D5 .','B4 . E5 . G#5 . B5 . G#5 . E5 . B4 . E5 .')},
  {w:'tri',v:.07,p:bars(
   'E5 = = = = = = = C#5 = = = B4 = = =','A4 = = = = = = = F#4 = = = A4 = = =','C#5 = = = = = = = E5 = = = F#5 = = =','E5 = = = = = = = = = = = . . . .',
   'E5 = = = = = = = A5 = = = G#5 = = =','F#5 = = = = = = = D5 = = = E5 = = =','F#5 = = = D5 = = = B4 = = = D5 = = =','E5 = = = = = = = = = = = = = . .')}],
  dr:{v:.14,p:bars('k . . . . . . . . . . . h . . .')}},
 /* THE RUNWAY: driving, G major, with a propeller-pulse bass. */
 runway:{bpm:132,steps:4,ch:[
  {w:'tri',v:.2,p:bars(
   'G1 . G2 . G1 . G2 . G1 . G2 . G1 . G2 .','G1 . G2 . G1 . G2 . G1 . G2 . G1 . G2 .','C2 . C3 . C2 . C3 . C2 . C3 . C2 . C3 .','D2 . D3 . D2 . D3 . D2 . D3 . D2 . D3 .',
   'E2 . E3 . E2 . E3 . E2 . E3 . E2 . E3 .','C2 . C3 . C2 . C3 . C2 . C3 . C2 . C3 .','D2 . D3 . D2 . D3 . D2 . D3 . D2 . D3 .','D2 . D3 . D2 . D3 . D2 . D3 . D2 . D3 .')},
  {w:'square',v:.08,p:bars(
   'G4 = = . B4 = D5 = = = = . B4 = D5 =','G5 = = = = = F#5 = E5 = D5 = = = = .','E5 = = . G5 = E5 = C5 = = = = . . .','D5 = = . F#5 = A5 = = = = = = . . .',
   'B4 = = . E5 = G5 = = = = . F#5 = E5 =','E5 = = = C5 = = = G5 = = = E5 = = =','F#5 = = . A5 = D6 = = = = . C6 = B5 =','A5 = = = = = = = = = = = . . . .')},
  {w:'square',v:.035,p:bars(
   'D4 . D4 . D4 . D4 . B3 . B3 . B3 . B3 .','D4 . D4 . D4 . D4 . B3 . B3 . B3 . B3 .','E4 . E4 . E4 . E4 . C4 . C4 . C4 . C4 .','F#4 . F#4 . F#4 . F#4 . A4 . A4 . A4 . A4 .',
   'G4 . G4 . G4 . G4 . E4 . E4 . E4 . E4 .','E4 . E4 . E4 . E4 . C4 . C4 . C4 . C4 .','F#4 . F#4 . F#4 . F#4 . A4 . A4 . A4 . A4 .','F#4 . F#4 . F#4 . F#4 . A4 . A4 . A4 . A4 .')}],
  dr:{v:.4,p:bars('k . h . s . h . k . h k s . h h','k . h . s . h . k . h k s . h h','k . h . s . h . k . h k s . h h','k . h . s . h . k . h k s . h h',
                  'k . h . s . h . k . h k s . h h','k . h . s . h . k . h k s . h h','k . h . s . h . k . h k s . h h','k . s . s . s s s s s s c . c .')}},
 /* THE GAMES: bouncy, C major. Every mini game plays this unless it brings its own. */
 arcade:{bpm:140,steps:4,ch:[
  {w:'tri',v:.19,p:bars('C2 . . C2 . . G1 . C2 . . C2 . G1 A1 B1','A1 . . A1 . . E2 . A1 . . A1 . E2 D2 C2','F1 . . F1 . . C2 . F1 . . F1 . C2 D2 E2','G1 . . G1 . . D2 . G1 . . G1 . D2 E2 F#2')},
  {w:'square',v:.075,p:bars('E5 . G5 . C6 . G5 . E5 = = . D5 . C5 .','C5 . E5 . A5 . E5 . C5 = = . B4 . A4 .','A4 . C5 . F5 . C5 . A4 = = . G4 . F4 .','B4 . D5 . G5 . F5 . D5 = = = B4 = = .')},
  {w:'square',v:.03,p:bars('. . G4 . . . G4 . . . G4 . . . G4 .','. . E4 . . . E4 . . . E4 . . . E4 .','. . F4 . . . F4 . . . F4 . . . F4 .','. . D4 . . . D4 . . . F4 . . . F4 .')}],
  dr:{v:.38,p:bars('k . h . s . h k . k h . s . h .')}}
});

/* ============================ JINGLES ============================ */
AUDIO.addJingles({
 win:{bpm:150,steps:4,once:true,ch:[{w:'square',v:.13,p:P('G4 C5 E5 G5 . E5 G5 = = = . .')},{w:'tri',v:.2,p:P('C3 . C3 . . G2 C3 = = = . .')}],dr:{v:.4,p:P('k . s . . . c . . . . .')}},
 lose:{bpm:120,steps:4,once:true,ch:[{w:'square',v:.1,p:P('G4 . F4 . E4 . D4 = G4 = = . .')},{w:'tri',v:.18,p:P('C3 . B2 . A2 . G2 = C3 = = . .')}],dr:null},
 fanfare:{bpm:144,steps:4,once:true,ch:[{w:'square',v:.13,p:P('G4 . G4 . C5 . E5 . G5 = = . E5 = G5 = C6 = = = = = . .')},{w:'square',v:.06,p:P('E4 . E4 . G4 . C5 . E5 = = . C5 = E5 = G5 = = = = = . .')},{w:'tri',v:.22,p:P('C3 . C3 . E3 . G3 . C3 = = . G2 = C3 = C3 = G3 = C4 = . .')}],dr:{v:.45,p:P('k . k . s . k . k . s . c . . . k . s . c . . .')}},
 takeoff:{bpm:190,steps:4,once:true,ch:[{w:'square',v:.1,p:P('C4 D4 E4 G4 A4 C5 = = = .')},{w:'tri',v:.18,p:P('C2 . . . G2 . C3 = = .')}],dr:{v:.35,p:P('k . . . k . c . . .')}}
});

/* ============================ SOUND EFFECTS ============================ */
/* tiny builders that take a delay, so one effect can be a little sequence */
function osc(K,w,f0,f1,dt,dur,v,att){ const ac=K.ac, t=K.t+(dt||0), o=ac.createOscillator(), g=ac.createGain();
 o.type=w; o.frequency.setValueAtTime(f0,t); if(f1) o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur);
 g.gain.setValueAtTime(.0001,t); g.gain.linearRampToValueAtTime(v,t+(att||.004)); g.gain.exponentialRampToValueAtTime(.0005,t+dur);
 o.connect(g); g.connect(K.out); o.start(t); o.stop(t+dur+.03); return o; }
function bell(K,f,dt,v,dur){ osc(K,'sine',f,0,dt,dur||1.1,v); osc(K,'sine',f*2,0,dt,(dur||1.1)*.6,v*.28); osc(K,'sine',f*3.01,0,dt,(dur||1.1)*.3,v*.08); }
function click(K,dt,v){ const ac=K.ac, t=K.t+(dt||0), s=ac.createBufferSource(); s.buffer=AUDIO._noiseBuf; const f=ac.createBiquadFilter(); f.type='highpass'; f.frequency.value=2200;
 const g=ac.createGain(); g.gain.setValueAtTime(v||.25,t); g.gain.exponentialRampToValueAtTime(.001,t+.014); s.connect(f); f.connect(g); g.connect(K.out); s.start(t,Math.random()*.5); s.stop(t+.03); }
function rumble(K,dt,dur,f0,f1,v){ const ac=K.ac, t=K.t+(dt||0), s=ac.createBufferSource(); s.buffer=AUDIO._noiseBuf; s.loop=true; const f=ac.createBiquadFilter(); f.type='lowpass'; f.frequency.setValueAtTime(f0,t); f.frequency.exponentialRampToValueAtTime(f1,t+dur);
 const g=ac.createGain(); g.gain.setValueAtTime(.0001,t); g.gain.linearRampToValueAtTime(v,t+dur*.35); g.gain.exponentialRampToValueAtTime(.001,t+dur); s.connect(f); f.connect(g); g.connect(K.out); s.start(t); s.stop(t+dur+.05); }
const SFX={
 /* UI: a radio push-to-talk click with a breath of squelch */
 blip(K){ click(K,0,.22); K.band(.07,2600,1800,1.5,.04,.012); },
 ok(K){ click(K,0,.2); osc(K,'sine',1180,0,.01,.06,.06); osc(K,'sine',1580,0,.06,.07,.05); },
 back(K){ click(K,0,.18); osc(K,'sine',320,180,0,.06,.12); },
 /* answers: a cabin chime for right, a gentle "say again" double-beep for wrong */
 point(K){ bell(K,1318.5,0,.11,.9); },
 bigpoint(K){ bell(K,1046.5,0,.12,1); bell(K,1318.5,.16,.12,1.2); K.band(.5,500,2400,1.2,.05,.05); },
 pickup(K){ bell(K,1568,0,.1,.6); },
 thud(K){ osc(K,'square',392,0,0,.09,.05); osc(K,'square',311,0,.12,.13,.05); K.band(.16,1600,1200,1.2,.03,0); },
 buzzer(K){ osc(K,'sawtooth',1450,0,0,.32,.035,.02); osc(K,'sawtooth',1478,0,0,.32,.03,.02); },
 cheer(K){ [1046.5,1318.5,1568,2093].forEach((f,i)=>bell(K,f,i*.09,.09,.9)); },
 hole(K){ [880,1174.7,1568].forEach((f,i)=>bell(K,f,i*.07,.1,.7)); },
 swish(K){ K.band(.28,500,2200,1.1,.07,0); },
 /* aviation */
 squelch(K){ K.band(.2,2400,1700,1.1,.08,0); },
 radio(K){ K.band(.12,2400,2000,1.1,.06,0); for(let i=0;i<6;i++) osc(K,'square',260+Math.random()*220,0,.1+i*.07,.06,.012); K.band(.14,2200,1600,1.1,.06,.55); click(K,.68,.15); },
 chime2(K){ bell(K,1046.5,0,.12,1.2); bell(K,830.6,.42,.12,1.5); },
 chirp(K){ K.band(.09,3600,1500,7,.18,0); osc(K,'sine',2800,1300,0,.08,.05); K.band(.08,3400,1600,7,.14,.15); rumble(K,.15,.6,300,120,.05); },
 engine(K){ for(let i=0;i<3;i++) rumble(K,i*.16,.14,500,160,.12); osc(K,'sawtooth',38,74,.45,1.1,.07,.3); rumble(K,.45,1.2,260,700,.06); },
 takeoff(K){ osc(K,'sawtooth',55,120,0,1.7,.06,.5); rumble(K,0,1.8,300,1400,.09); },
 whoosh(K){ osc(K,'sawtooth',190,105,0,1.3,.035,.6); K.band(1.3,1100,320,1.4,.06,0); },
 gear(K){ osc(K,'sine',95,48,0,.16,.22); K.band(.06,800,600,2,.08,0); },
 stall(K){ osc(K,'sawtooth',1450,0,0,.6,.03,.02); osc(K,'sawtooth',1472,0,0,.6,.028,.02); },
 wind(K){ K.band(.9,420,900,1.2,.06,0); },
 /* game bits */
 clack(K){ osc(K,'sine',2600,1700,0,.035,.12); click(K,0,.1); },
 cushion(K){ osc(K,'sine',210,120,0,.07,.12); },
 pocket(K){ osc(K,'sine',320,110,0,.14,.16); K.band(.12,900,500,3,.06,.05); },
 putt(K){ osc(K,'sine',1900,1500,0,.025,.1); click(K,0,.08); },
 cup(K){ [0,.06,.13].forEach(d=>osc(K,'sine',1500-d*2000,0,d,.04,.06)); bell(K,1318.5,.2,.08,.6); },
 bag(K){ rumble(K,0,.14,500,180,.18); osc(K,'sine',110,68,0,.12,.16); },
 board(K){ osc(K,'sine',170,90,0,.11,.2); K.band(.05,900,700,2,.07,0); },
 paddle(K){ osc(K,'square',523,0,0,.035,.06); },
 wall(K){ osc(K,'square',330,0,0,.03,.05); },
 drop(K){ osc(K,'sine',150,90,0,.08,.16); },
 line(K){ [784,1046.5,1318.5,1568].forEach((f,i)=>bell(K,f,i*.05,.07,.5)); },
 rotate(K){ osc(K,'square',900,0,0,.02,.04); },
 throw(K){ K.band(.18,700,2200,1.5,.08,0); },
 tick(K){ osc(K,'square',1000,0,0,.02,.05); },
 card(K){ K.band(.06,3400,2800,2,.08,0); osc(K,'square',980,1300,0,.04,.04); }
};
for(const k in SFX) AUDIO.addSfx(k,SFX[k]);

/* Morse code, as heard from a radio beacon (VOR/NDB idents): AUDIO.morse('ABC') */
const MORSE={A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..'};
AUDIO.morse=function(txt){ if(!this.ac||!this.sfxOn) return 0; const u=.085; let t=0; const K={ac:this.ac,t:this.ac.currentTime+.05,out:this.sfxG};
 for(const ch of String(txt).toUpperCase()){ const m=MORSE[ch]; if(!m){ t+=u*4; continue; } for(const s of m){ const d=s==='.'?u:u*3; osc(K,'sine',1020,0,t,d,.06,.006); t+=d+u; } t+=u*2; }
 return t; };

/* ============================ AMBIENCE (follows MUSIC ON/OFF) ============================ */
function bed(ac,out,nb,type,freq,q,v){ const s=ac.createBufferSource(); s.buffer=nb; s.loop=true; const f=ac.createBiquadFilter(); f.type=type; f.frequency.value=freq; f.Q.value=q||.7; const g=ac.createGain(); g.gain.value=v; s.connect(f); f.connect(g); g.connect(out); s.start(0,Math.random()); return {s,f,g}; }
function every(lo,hi,fn){ let id=null, live=true; const go=()=>{ if(!live) return; id=setTimeout(()=>{ if(!live) return; try{ fn(); }catch(e){} go(); },(lo+Math.random()*(hi-lo))*1000); }; go(); return ()=>{ live=false; clearTimeout(id); }; }
const oneShot=(ac,out,name)=>{ const K={ac,t:ac.currentTime,out,band:(dur,f0,f1,q,v,dt)=>{ const s=ac.createBufferSource(); s.buffer=AUDIO._noiseBuf; const f=ac.createBiquadFilter(); f.type='bandpass'; f.Q.value=q||6; const t=ac.currentTime+(dt||0); f.frequency.setValueAtTime(f0,t); if(f1) f.frequency.exponentialRampToValueAtTime(Math.max(30,f1),t+dur); const g=ac.createGain(); g.gain.setValueAtTime(.0001,t); g.gain.linearRampToValueAtTime(v,t+Math.min(.02,dur*.2)); g.gain.exponentialRampToValueAtTime(.001,t+dur); s.connect(f); f.connect(g); g.connect(out); s.start(t,Math.random()*.5); s.stop(t+dur+.02); }}; SFX[name](K); };
AUDIO.addAmbience('lounge',(ac,out,nb)=>{ const r=bed(ac,out,nb,'lowpass',280,.7,.02); const stop=every(18,34,()=>oneShot(ac,out,'whoosh'));
 return {stop(){ stop(); try{ r.s.stop(); }catch(e){} }}; });
AUDIO.addAmbience('classroom',(ac,out,nb)=>{ const r=bed(ac,out,nb,'lowpass',180,.7,.014);
 return {stop(){ try{ r.s.stop(); }catch(e){} }}; });
AUDIO.addAmbience('hangar',(ac,out,nb)=>{ const r=bed(ac,out,nb,'lowpass',420,.7,.03);
 const stop=every(4,9,()=>{ const K={ac,t:ac.currentTime,out}; if(Math.random()<.5){ osc(K,'square',2400+Math.random()*600,0,0,.05,.012); osc(K,'square',3100,0,.09,.05,.008); } else { const s=bed(ac,out,nb,'bandpass',3000,1.4,0); const t=ac.currentTime; s.g.gain.setValueAtTime(.0001,t); s.g.gain.linearRampToValueAtTime(.02,t+.05); s.g.gain.exponentialRampToValueAtTime(.0005,t+.5); setTimeout(()=>{ try{ s.s.stop(); }catch(e){} },700); } });
 return {stop(){ stop(); try{ r.s.stop(); }catch(e){} }}; });
AUDIO.addAmbience('platform',(ac,out,nb)=>{ const r=bed(ac,out,nb,'bandpass',600,.9,.05);
 const lfo=ac.createOscillator(), lg=ac.createGain(); lfo.frequency.value=.09; lg.gain.value=260; lfo.connect(lg); lg.connect(r.f.frequency); lfo.start();
 const stop1=every(14,26,()=>oneShot(ac,out,'whoosh')), stop2=every(9,17,()=>oneShot(ac,out,'squelch'));
 return {stop(){ stop1(); stop2(); try{ r.s.stop(); lfo.stop(); }catch(e){} }}; });
AUDIO.addAmbience('runway',(ac,out,nb)=>{ // a propeller airplane idling on the ramp + wind + the odd departure
 const o=ac.createOscillator(); o.type='sawtooth'; o.frequency.value=34; const f=ac.createBiquadFilter(); f.type='lowpass'; f.frequency.value=210; const g=ac.createGain(); g.gain.value=.018;
 const am=ac.createOscillator(), amg=ac.createGain(); am.frequency.value=7.5; amg.gain.value=.008; am.connect(amg); amg.connect(g.gain);
 o.connect(f); f.connect(g); g.connect(out); o.start(); am.start();
 const w=bed(ac,out,nb,'bandpass',500,.8,.03);
 const stop=every(22,40,()=>oneShot(ac,out,'takeoff'));
 return {stop(){ stop(); try{ o.stop(); am.stop(); w.s.stop(); }catch(e){} }}; });

/* ============================ ROUND 4: the Tower, the Parking Stand, the Wash Rack ============================ */
AUDIO.addSongs({
 /* THE TOWER + CALL THE TOWER: calm concentration, A dorian, with a radar ping on every bar. */
 tower:{bpm:100,steps:4,ch:[
  {w:'tri',v:.16,p:bars(
   'A1 . . . A1 . . . E2 . . . A1 . . .','G1 . . . G1 . . . D2 . . . G1 . . .','F1 . . . F1 . . . C2 . . . F1 . . .','G1 . . . G1 . . . D2 . . . E2 . . .',
   'A1 . . . A1 . . . E2 . . . A1 . . .','G1 . . . G1 . . . D2 . . . G1 . . .','D2 . . . D2 . . . A2 . . . D2 . . .','E2 . . . E2 . . . B1 . . . E2 . . .')},
  {w:'square',v:.032,p:bars(
   'A3 . C4 . E4 . A4 . E4 . C4 . E4 . C4 .','G3 . B3 . D4 . G4 . D4 . B3 . D4 . B3 .','F3 . A3 . C4 . F4 . C4 . A3 . C4 . A3 .','G3 . B3 . D4 . G4 . D4 . B3 . E4 . B3 .',
   'A3 . C4 . E4 . A4 . E4 . C4 . E4 . C4 .','G3 . B3 . D4 . G4 . D4 . B3 . D4 . B3 .','D4 . F#4 . A4 . D5 . A4 . F#4 . A4 . F#4 .','E4 . G#4 . B4 . E5 . B4 . G#4 . B4 . G#4 .')},
  {w:'tri',v:.07,p:bars(
   '. . . . . . . . E5 = = = D5 = C5 =','B4 = = = = = = = . . . . . . . .','. . . . . . . . C5 = = = A4 = C5 =','D5 = = = = = = = B4 = = = = = = =',
   '. . . . . . . . E5 = = = G5 = E5 =','D5 = = = = = = = B4 = = = G4 = = =','A4 = = = D5 = = = F#5 = = = E5 = D5 =','E5 = = = = = = = . . . . . . . .')},
  {w:'sine',v:.05,p:bars('A6 . . . . . . . . . . . . . . .')}],
  dr:{v:.16,p:bars('k . . . h . . . k . . . h . . h','k . . . h . . . k . k . h . . .')}},
 /* THE PARKING STAND + WASH RACK: sunny ramp-side groove, G major. */
 ramp:{bpm:112,steps:4,ch:[
  {w:'tri',v:.18,p:bars(
   'G2 . . G2 . . D2 . G2 . . G2 . . B2 .','C2 . . C2 . . G2 . C2 . . C2 . . E2 .','D2 . . D2 . . A2 . D2 . . D2 . . F#2 .','G2 . . G2 . . D2 . E2 . . E2 . . D2 .',
   'G2 . . G2 . . D2 . G2 . . G2 . . B2 .','E2 . . E2 . . B1 . E2 . . E2 . . G2 .','C2 . . C2 . . G2 . D2 . . D2 . . A2 .','G2 . . D2 . . B1 . G1 . . . . . . .')},
  {w:'square',v:.06,p:bars(
   'B4 = D5 = . . G4 = . . B4 = D5 = E5 =','E5 = = = C5 = . . G4 = . . E4 = . .','F#4 = A4 = . . D5 = . . C5 = B4 = A4 =','B4 = = = = = . . G4 = = = . . . .',
   'B4 = D5 = . . G5 = . . F#5 = E5 = D5 =','E5 = = = B4 = . . G4 = . . B4 = . .','C5 = E5 = . . G5 = F#5 = = = E5 = D5 =','G4 = = = = = = = . . . . . . . .')},
  {w:'square',v:.025,p:bars('. . G4 . . . B4 . . . G4 . . . B4 .','. . E4 . . . G4 . . . E4 . . . G4 .','. . F#4 . . . A4 . . . F#4 . . . A4 .','. . G4 . . . B4 . . . G4 . . . D4 .')}],
  dr:{v:.3,p:bars('k . h . s . h k . k h . s . h .','k . h . s . h k . k h . s . o .')}}
});
const SFX4={
 ptt(K){ click(K,0,.26); K.band(.1,2600,1700,1.4,.06,.01); },
 shutter(K){ click(K,0,.3); click(K,.07,.22); osc(K,'square',1800,900,0,.05,.03); },
 spray(K){ K.band(.5,4200,3600,.8,.07,0); },
 scrub(K){ K.band(.12,1500,2400,1.6,.05,0); },
 brake(K){ osc(K,'sawtooth',2300,1900,0,.25,.018,.02); K.band(.25,3000,2400,3,.05,0); },
 lamp(K){ osc(K,'sine',660,0,0,.12,.07); click(K,0,.12); },
 radar(K){ bell(K,1760,0,.05,.5); },
 cover(K){ osc(K,'sine',520,780,0,.08,.08); click(K,0,.1); },
 drip(K){ osc(K,'sine',1400,600,0,.06,.06); }
};
for(const k in SFX4) AUDIO.addSfx(k,SFX4[k]);
AUDIO.addAmbience('tower',(ac,out,nb)=>{ // the hum of a tower cab, distant radio chatter, a radar ping
 const r=bed(ac,out,nb,'lowpass',240,.7,.02);
 const s1=every(5,11,()=>{ const K={ac,t:ac.currentTime,out,band:(dur,f0,f1,q,v,dt)=>{} }; oneShot(ac,out,'squelch'); for(let i=0;i<4+Math.floor(Math.random()*5);i++) osc(K,'square',300+Math.random()*260,0,.08+i*.06,.05,.006); });
 const s2=every(6,6.5,()=>{ const K={ac,t:ac.currentTime,out}; bell(K,1760,0,.022,.4); });
 return {stop(){ s1(); s2(); try{ r.s.stop(); }catch(e){} }}; });
AUDIO.addAmbience('wash',(ac,out,nb)=>{ // running water, drips, the odd airplane outside
 const r=bed(ac,out,nb,'bandpass',3200,.6,.018);
 const s1=every(1.5,4,()=>{ const K={ac,t:ac.currentTime,out}; osc(K,'sine',1300+Math.random()*500,500,0,.06,.02); });
 const s2=every(25,45,()=>oneShot(ac,out,'takeoff'));
 return {stop(){ s1(); s2(); try{ r.s.stop(); }catch(e){} }}; });

/* the Lounge jukebox: tap to cycle through every place's song */
const JUKE=[['lounge','LOUNGE SESSIONS'],['classroom','GROUND SCHOOL'],['hangar','HANGAR SHIFT'],['platform','PLATFORM SUNSET'],['tower','TOWER FREQUENCY'],['ramp','RAMP ROLL'],['runway','RUNWAY RUN'],['arcade','ARCADE NIGHT'],['title','FLIGHT ACADEMY THEME']];
(G.HFQ=G.HFQ||{}).jukebox=function(){ const i=JUKE.findIndex(j=>j[0]===AUDIO.curName), n=JUKE[(i+1)%JUKE.length]; AUDIO.play(n[0]); G.toast('JUKEBOX: '+n[1],G.C.info); return n[0]; };
})();
