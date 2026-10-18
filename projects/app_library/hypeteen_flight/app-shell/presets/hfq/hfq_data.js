/* HYPETEEN FLIGHT QUARTERS - content (no logic here; hfq_*.js files read this).
   Edit names, lines, ranks and the curriculum here between rounds.
   G.HFQ   = academy content: ranks, call-sign words, the Ground School curriculum, the crew's looks
   G.WORLD = the four places you can walk (format documented at the top of mod_world.js) */
(function(){
const HFQ=G.HFQ={};

/* ---------- ranks: XP needed for each (placeholder ladder; rename freely) ---------- */
HFQ.ranks=[
 {n:'CADET',xp:0},
 {n:'CADET II',xp:60},
 {n:'SPOTTER',xp:150},
 {n:'NAVIGATOR',xp:300},
 {n:'FLIGHT ENGINEER',xp:500},
 {n:'WINGMATE',xp:800},
 {n:'SQUADRON ACE',xp:1200}
];

/* ---------- XP for things cadets do ---------- */
HFQ.xp={enroll:50,place:20,crew:25,unit:10,locker:15,news:5};

/* ---------- made-up call signs (FIRST + SECOND, 16 letters max) ---------- */
HFQ.callA=['SWIFT','BRAVE','LUCKY','SILVER','BLUE','ROCKET','SKY','STORM','SUNNY','COMET','TURBO','ZIPPY','NOVA','CLOUD','JET',
 'STAR','THUNDER','RAPID','BOLD','NIMBLE','STEADY','GOLDEN','ARCTIC','CRIMSON','ORBIT','MACH','HIGH','SONIC','QUICK','MIGHTY',
 'COPPER','MIDNIGHT','DAWN','SUMMIT','CANYON','PRAIRIE','HARBOR','RIDGE','DESERT','WILD'];
HFQ.callB=['FALCON','HAWK','EAGLE','OWL','SPARROW','ROBIN','OSPREY','CONDOR','KESTREL','HERON','PELICAN','SWALLOW','RAVEN','WREN',
 'PROP','RUDDER','WINGTIP','BEACON','COMPASS','ZEPHYR','BREEZE','ROTOR','GLIDER','SKIPPER','VECTOR','RADAR','PATHFINDER','SCOUT',
 'RANGER','PILOT','AILERON','TAILWIND','CONTRAIL','ALTITUDE','HANGAR','JETSTREAM','NAVIGATOR','STRATUS','CIRRUS','SPINNER'];

/* ---------- the cadet's look (the Locker) ---------- */
HFQ.look={
 suit:['#2f6fb5','#1f3a6a','#c23a3a','#2f8a4a','#e07a1a','#6a3fa0','#3a3f48','#d0a020'],
 skin:['#f6d6b8','#e8b98f','#d29a6a','#b07a4e','#8a5a36','#5e3a22'],
 hair:['#1a1410','#4a3020','#7a4a24','#c08a3a','#e8cf8a','#a83a20','#d9dae4','#3a5ad0'],
 style:[['short','SHORT'],['long','LONG'],['curly','CURLY'],['bun','BUN'],['pony','PONY'],['buzz','BUZZ']],
 hat:[['none','NONE'],['cap','CAP'],['headset','HEADSET'],['aviator','AVIATOR'],['helmet','HELMET']]
};
HFQ.defaultAv={suit:'#2f6fb5',skin:'#e8b98f',hair:'#4a3020',style:'short',hat:'none',hatCol:'#1d3a6a'};

/* ---------- GROUND SCHOOL: the curriculum. The learning game plugs into these units (see hfq_groundschool.js) ---------- */
HFQ.units=[
 {id:'flight',t:'HOW AIRPLANES FLY',s:'LIFT, WEIGHT, THRUST + DRAG',icon:'plane',topics:['The four forces','How a wing makes lift','Angle of attack','What a stall really is']},
 {id:'parts',t:'PARTS OF AN AIRPLANE',s:'NOSE TO TAIL',icon:'wrench',topics:['Fuselage, wings + tail','Ailerons, elevator + rudder','Flaps + trim','Landing gear + engine']},
 {id:'controls',t:'FLIGHT CONTROLS',s:'PITCH, ROLL + YAW',icon:'joy',topics:['The three axes','The yoke or stick','Rudder pedals','The throttle']},
 {id:'instruments',t:'COCKPIT INSTRUMENTS',s:'THE SIX-PACK',icon:'gauge',topics:['Airspeed indicator','Attitude indicator','Altimeter','Turn coordinator','Heading indicator','Vertical speed indicator']},
 {id:'airports',t:'AIRPORTS',s:'RUNWAYS, SIGNS + LIGHTS',icon:'flag',topics:['Runway numbers','Markings + signs','Taxiways + hold-short lines','The traffic pattern']},
 {id:'radio',t:'TALKING ON THE RADIO',s:'ALFA, BRAVO, CHARLIE',icon:'chat',topics:['The phonetic alphabet','Call signs','Talking to the tower','Radio words']},
 {id:'weather',t:'WEATHER',s:'WIND, CLOUDS + FRONTS',icon:'cloud',topics:['Wind + the windsock','Clouds and what they mean','Fronts','Visibility + weather minimums']},
 {id:'nav',t:'NAVIGATION + CHARTS',s:'MAPS FOR THE SKY',icon:'pin',topics:['Reading a sectional chart','Compass headings','Flying by landmarks','Planning a cross-country']},
 {id:'airspace',t:'AIRSPACE',s:'THE SKY HAS LANES',icon:'grid',topics:['Controlled vs. uncontrolled','Airspace classes','Special-use areas','Who you talk to, where']},
 {id:'rules',t:'RULES OF THE SKY',s:'SEE AND AVOID',icon:'check',topics:['Right-of-way','See and avoid','Cruising altitudes','Aircraft lights']},
 {id:'perf',t:'WEIGHT + PERFORMANCE',s:'HOW MUCH CAN WE CARRY?',icon:'list',topics:['Weight + balance','Center of gravity','Hot days + high airports','Takeoff + landing distance']},
 {id:'decisions',t:'PILOT DECISIONS',s:'CHECKLISTS + SAFETY',icon:'docs',topics:['Checklists','The IMSAFE check','Go / no-go decisions','Crew teamwork']},
 {id:'types',t:'TYPES OF AIRCRAFT',s:'CATEGORIES + CLASSES',icon:'star',topics:['Airplanes','Rotorcraft','Gliders + balloons','Powered-lift']}
];

/* ---------- the crew (placeholder names - swap in characters from the books) ---------- */
const CREW={
 instructor:{suit:'#2d3b55',suit2:'#1f2a3f',skin:'#c88c60',hair:'#2a2020',style:'short',hat:'cap',hatCol:'#2d3b55'},
 chief:{suit:'#2f5f8a',suit2:'#244a6a',skin:'#e0b080',hair:'#6b4a2a',style:'short',hat:'cap',hatCol:'#c03030'},
 tower:{suit:'#f2f2f2',suit2:'#2a3a5a',skin:'#8d5a3a',hair:'#1a1410',style:'curly',hat:'headset'},
 marshal:{suit:'#2a3a5a',suit2:'#1d2840',skin:'#e8c098',hair:'#d8b040',style:'pony',hat:'headset',vest:true,wands:true}
};

/* ============================ THE AIRFIELD ============================ */
G.WORLD={
 start:'lounge', bag:true, bagLabel:'FLIGHT BAG', bagIcon:'bag',
 rooms:{
  /* ---- PILOT'S LOUNGE: where every cadet starts ---- */
  lounge:{
   name:'PILOT’S LOUNGE', tab:{label:'LOUNGE',icon:'home'},
   w:520, h:400, wall:120, viewH:300, wallStyle:'windows', floor:'wood',
   palette:{wall:'#5a4030',floor:'#7a5236',trim:'#e8e2d6'},
   windows:[[130,80],[290,80]],
   spawn:[230,350],
   crowdSpots:[[150,320],[392,318],[100,250],[440,230]],
   stations:[
    {key:'gs',label:'GROUND SCHOOL',icon:'docs',wall:true,x:70,w:84,art:'chalk',go:{scene:'groundschool'}},
    {key:'toPlatform',label:'UP TO THE PLATFORM',icon:'search',wall:true,x:250,w:40,art:'stairs',go:{room:'platform',at:'down'}},
    {key:'news',label:'HANGAR NEWS',icon:'megaphone',wall:true,x:410,w:56,art:'cork',go:{scene:'board'}},
    {key:'trophy',label:'MY LOGBOOK',icon:'trophy',wall:true,x:477,w:44,art:'case',go:{scene:'logbook'}},
    {key:'locker',label:'MY LOCKER',icon:'user',foot:[22,170,74,184],h:52,art:'locker',go:{scene:'locker'}},
    {key:'squadron',label:'SQUADRON',icon:'roster',foot:[440,322,500,330],h:34,art:'sign',text:'CREW',go:{scene:'squadron'}},
    {key:'toHangar',label:'TO THE HANGAR',side:'R',y0:236,y1:300,go:{room:'hangar',at:'toLounge'}}
   ],
   decor:[
    {art:'couch',foot:[196,250,282,268],h:22,col:'#2f5f8a'},
    {art:'couch',foot:[300,250,386,268],h:22,col:'#2f5f8a'},
    {art:'table',foot:[256,292,326,306],h:12},
    {art:'plant',foot:[480,176,496,186],h:30},
    {art:'plant',foot:[26,330,42,340],h:30}
   ],
   npcs:[
    {id:'instructor',name:'INSTRUCTOR',role:'GROUND SCHOOL INSTRUCTOR',x:150,y:196,av:CREW.instructor,
     first:['Welcome to Flight Quarters, cadet! I’m your Ground School instructor.',
            'This is the Pilot’s Lounge. The chalkboard is GROUND SCHOOL - that’s where you learn how flying really works.',
            'Tap the floor to walk. Tap a person or a sign to go use it. The buttons at the bottom take you to the Hangar, the Viewing Platform and the Runway.'],
     lines:['Every pilot started exactly where you are: curious.',
            'Your LOGBOOK in the trophy case shows your rank, your XP and your badges.',
            'Ground school first, runway second. That’s how real pilots train too.',
            'Check HANGAR NEWS on the corkboard. That’s where announcements go up.']}
   ]
  },

  /* ---- THE HANGAR: airplanes, parts, the crew chief ---- */
  hangar:{
   name:'THE HANGAR', tab:{label:'HANGAR',icon:'wrench'},
   w:560, h:420, wall:130, viewH:310, wallStyle:'hangar', floor:'concrete',
   palette:{wall:'#59626f',floor:'#8a8f96'},
   opening:[200,360],
   leadLine:[280,136,280,250,300,300],
   spawn:[110,360],
   stations:[
    {key:'gallery',label:'AIRCRAFT GALLERY',icon:'plane',wall:true,x:96,w:110,art:'gallery',go:{page:'aircraft'}},
    {key:'toRunway',label:'OUT TO THE RUNWAY',icon:'flag',wall:true,x:280,w:150,art:'none',go:{room:'runway',at:'toHangar'}},
    {key:'parts',label:'PARTS OF AN AIRPLANE',icon:'wrench',wall:true,x:462,w:96,art:'partsboard',go:{scene:'groundschool',args:{unit:'parts'}}},
    {key:'preflight',label:'PREFLIGHT CHECK',icon:'check',foot:[190,286,370,298],h:58,art:'plane',go:{scene:'blank'}},
    {key:'cart',label:'TOOL CART',icon:'wrench',foot:[466,300,508,312],h:26,art:'cart',go:{talk:'chief'}},
    {key:'toLounge',label:'TO THE LOUNGE',side:'L',y0:250,y1:320,go:{room:'lounge',at:'toHangar'}}
   ],
   decor:[
    {art:'crate',foot:[30,176,62,196],h:20},
    {art:'crate',foot:[488,176,530,194],h:18},
    {art:'cone',foot:[150,380,186,386],h:12}
   ],
   npcs:[
    {id:'chief',name:'CREW CHIEF',role:'AIRCRAFT MECHANIC',x:420,y:252,av:CREW.chief,
     first:['Hey, cadet! I’m the crew chief. I keep these airplanes healthy.',
            'Before every flight, pilots do a PREFLIGHT walk-around. They check the fuel, the oil, the tires and every control surface.',
            'The gallery on the wall shows the different kinds of aircraft. Go take a look!'],
     lines:['See our trainer? It’s a high-wing airplane: the wing sits on top of the cabin.',
            'Ailerons, elevator, rudder: three controls that move an airplane around three axes.',
            'Never walk near a propeller, even when the engine is off. Treat every prop like it could start.']}
   ]
  },

  /* ---- VIEWING PLATFORM: watch the airfield, wind and radio ---- */
  platform:{
   name:'VIEWING PLATFORM', tab:{label:'PLATFORM',icon:'search'},
   w:480, h:360, wall:140, viewH:290, wallStyle:'sky', floor:'deck',
   palette:{floor:'#7b6a58'},
   spawn:[110,300],
   stations:[
    {key:'scope',label:'SPOTTER SCOPE',icon:'search',foot:[90,196,112,204],h:30,art:'scope',go:{scene:'blank'}},
    {key:'wx',label:'WEATHER BOARD',icon:'cloud',foot:[300,196,362,202],h:34,art:'sign',text:'WX',go:{scene:'blank'}},
    {key:'sock',label:'WINDSOCK',icon:'flag',foot:[420,186,430,194],h:62,art:'windsock',go:{page:'windsock'}},
    {key:'radio',label:'TOWER RADIO',icon:'chat',foot:[196,262,276,278],h:18,art:'radio',go:{page:'radio'}},
    {key:'down',label:'DOWN TO THE LOUNGE',side:'L',y0:226,y1:296,go:{room:'lounge',at:'toPlatform'}}
   ],
   decor:[
    {art:'rail',foot:[14,150,466,154],h:16}
   ],
   npcs:[
    {id:'tower',name:'TOWER',role:'AIR TRAFFIC CONTROLLER',x:330,y:286,av:CREW.tower,
     first:['Tower here! From up on this platform you can watch the whole airfield.',
            'Pilots and controllers talk on the radio with the phonetic alphabet: ALFA, BRAVO, CHARLIE...',
            'See the windsock? Airplanes like to take off and land INTO the wind.'],
     lines:['Say your call sign clearly. That’s how I know who’s talking.',
            'The fatter and straighter the windsock flies, the stronger the wind.',
            'ROGER means “I heard you.” WILCO means “I will comply.”']}
   ]
  },

  /* ---- THE RUNWAY: the games ---- */
  runway:{
   name:'THE RUNWAY', tab:{label:'RUNWAY',icon:'flag'},
   w:640, h:440, wall:110, viewH:300, wallStyle:'open', floor:'grass', tower:540,
   palette:{floor:'#5a8a44'},
   runway:{y0:148,y1:228,num:'27'},
   apron:[30,296,610,430],
   spawn:[320,400],
   stations:[
    {key:'landing',label:'LANDING CHALLENGE',icon:'plane',foot:[70,336,140,342],h:32,art:'sign',text:'LAND',go:{scene:'blank'}},
    {key:'taxi',label:'TAXI MAZE',icon:'pin',foot:[210,336,280,342],h:32,art:'sign',text:'TAXI',go:{scene:'blank'}},
    {key:'signals',label:'MARSHALLER SIGNALS',icon:'flag',foot:[350,336,420,342],h:32,art:'sign',text:'SIGNALS',go:{scene:'blank'}},
    {key:'race',label:'PREFLIGHT RACE',icon:'check',foot:[490,336,560,342],h:32,art:'sign',text:'RACE',go:{scene:'blank'}},
    {key:'toHangar',label:'BACK TO THE HANGAR',side:'L',y0:300,y1:380,go:{room:'hangar',at:'toRunway'}}
   ],
   decor:[
    {art:'cone',foot:[150,388,240,394],h:12},
    {art:'cone',foot:[420,388,510,394],h:12},
    {art:'holdshort',foot:[14,262,626,266],h:0}
   ],
   npcs:[
    {id:'marshal',name:'LINE CREW',role:'AIRCRAFT MARSHALLER',x:330,y:286,av:CREW.marshal,
     first:['Welcome to the flight line! I’m a marshaller. I guide airplanes with these orange wands.',
            'The big number on the runway tells you which way it points. Runway 27 points about 270 degrees - that’s west!',
            'Each sign out here is a runway game. The games are still being built, so check back soon!'],
     lines:['Every wand signal means something. Soon you’ll learn them in the Signals game.',
            'The yellow lines across the taxiway are HOLD-SHORT lines. Pilots stop there until they’re cleared onto the runway.',
            'Turn around and the same runway gets a new number: 27 one way, 9 the other!']}
   ]
  }
 }
};

/* ---------- extra art for this airfield ---------- */
const A=G.worldArt;
A.wall.gallery=function(c,s,R){   // three framed pictures: airplane, helicopter, balloon
 const w=s.w, x0=s.x-w/2, fw=(w-8)/3;
 for(let i=0;i<3;i++){ const x=x0+i*(fw+4), y=30, h=R.wall-62;
  c.fillStyle='#2a2420'; c.fillRect(x,y,fw,h); c.fillStyle='#d8ecff'; c.fillRect(x+3,y+3,fw-6,h-6);
  const cx=x+fw/2, cy=y+h/2; c.fillStyle='#2a3a5a';
  if(i===0){ c.fillRect(cx-12,cy-1.5,24,3); c.fillRect(cx-2,cy-9,3,18); c.fillRect(cx+9,cy-4,2,8); }
  if(i===1){ c.beginPath(); c.ellipse(cx-2,cy+2,8,5,0,0,7); c.fill(); c.fillRect(cx+4,cy,12,2); c.fillRect(cx-14,cy-6,24,1.6); c.fillRect(cx-3,cy-6,2,4); }
  if(i===2){ c.fillStyle='#d03a3a'; c.beginPath(); c.arc(cx,cy-3,8,0,7); c.fill(); c.fillStyle='#ffd24d'; c.fillRect(cx-1,cy-11,2,16); c.fillStyle='#8a5a3a'; c.fillRect(cx-3,cy+8,6,4); }
 }
};
A.wall.partsboard=function(c,s,R){   // a cutaway poster of a trainer with labeled callouts
 const w=s.w, x=s.x-w/2, y=26, h=R.wall-54;
 c.fillStyle='#e9eef4'; c.fillRect(x,y,w,h); c.strokeStyle='#2a3a5a'; c.lineWidth=1.2; c.strokeRect(x+1,y+1,w-2,h-2);
 const cx=s.x, cy=y+h/2+2; c.fillStyle='#2a3a5a';
 c.fillRect(cx-30,cy-2,56,4); c.fillRect(cx-6,cy-16,6,32); c.fillRect(cx+20,cy-8,3,16); c.fillRect(cx-32,cy-5,4,10);
 c.fillStyle='#d03a3a'; for(const [px,py] of [[cx-3,cy-14],[cx+21,cy-7],[cx-30,cy],[cx+26,cy]]){ c.beginPath(); c.arc(px,py,2.2,0,7); c.fill(); }
};
A.floor.rail=function(c,f,h){   // the platform railing
 c.fillStyle='#d8dde4'; for(let x=f[0]+4;x<f[2];x+=22) c.fillRect(x,f[1]-h,2.4,h+4);
 c.fillRect(f[0],f[1]-h,f[2]-f[0],2.6); c.fillRect(f[0],f[1]-h/2,f[2]-f[0],1.6);
};
A.floor.holdshort=function(c,f){   // runway hold-short marking: two solid + two dashed yellow lines
 const w=f[2]-f[0]; c.fillStyle='#ffc21a';
 c.fillRect(f[0],f[1]-6,w,1.6); c.fillRect(f[0],f[1]-3,w,1.6);
 for(let x=f[0];x<f[2];x+=10){ c.fillRect(x,f[1]+1,6,1.6); c.fillRect(x,f[1]+4,6,1.6); }
};
})();
