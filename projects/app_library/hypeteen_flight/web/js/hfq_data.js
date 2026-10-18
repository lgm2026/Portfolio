/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* HYPETEEN FLIGHT ACADEMY - content (no logic here; hfq_*.js files read this).
   Edit names, lines, ranks and the curriculum here between rounds.
   G.HFQ   = academy content: ranks, call-sign words, the Ground School curriculum, the crew's looks
   G.WORLD = the four places you can walk (format documented at the top of mod_world.js) */
(function(){
const HFQ=G.HFQ=G.HFQ||{};
HFQ.an=w=>{ w=String(w).trim(); return /^[AEIO]/i.test(w)||/^(8\d*|11|18)(\D|$)/.test(w)?'an':'a'; };   // "an AIRBUS", "an 8-question quiz"

/* ---------- ACADEMY PHASES: the seven HypeTeen Flight Academy books, each with three steps (I, II, III).
   xp = where the phase starts; its steps are spread evenly up to the next phase. Phase names are academy
   stages only - they never stand for a real pilot certificate or rating. ---------- */
HFQ.phases=[
 {n:'BALANCE BEFORE CONTROL',book:1,xp:0},
 {n:'CROSSWIND DECISIONS',book:2,xp:150},
 {n:'WEATHER MINIMUMS',book:3,xp:400},
 {n:'CROSS-COUNTRY',book:4,xp:800},
 {n:'SOLO',book:5,xp:1300},
 {n:'PILOT IN COMMAND',book:6,xp:2000},
 {n:'THE SKY WE SHARE',book:7,xp:2900,span:900}   // r7: the seventh book; every threshold below it is unchanged
];
HFQ.steps=['I','II','III'];
/* the flat ladder the rest of the app reads: one entry per phase step */
HFQ.ranks=[];
HFQ.phases.forEach((p,i)=>{
 const nx=HFQ.phases[i+1], span=nx?nx.xp-p.xp:p.span;
 HFQ.steps.forEach((st,k)=>HFQ.ranks.push({n:p.n+' '+st,phase:i,step:k,xp:p.xp+Math.round(span*k/HFQ.steps.length/10)*10}));
});

/* ---------- XP for things cadets do ---------- */
HFQ.xp={enroll:50,place:20,crew:25,unit:10,locker:15,news:5};

/* ---------- made-up call signs: one word, the way real ones are. Fun ones only. ---------- */
HFQ.callSigns=['AFTERBURNER','AIRBOSS','BANDIT','BARNSTORMER','BIRDDOG','BLAZE','BOGEY','BOLT','BOOMER','BUZZSAW','CANNONBALL','CHEVRON','CLOUDBURST','COMET',
 'CONTRAIL','CROSSWIND','CYCLONE','DAREDEVIL','DASH','DOWNWIND','DRIFTER','DUSTOFF','FIREBIRD','FLAPJACK','FLASH','FOXTROT','GREMLIN','GUSTO','HAWKEYE',
 'HOTSHOT','HURRICANE','JETLAG','JOLT','JUKEBOX','KESTREL','KITTYHAWK','LOOPER','MACH','MOONSHOT','NIMBUS','NOODLE','ORBIT','OSPREY','PANCAKE','PEANUT',
 'PICKLE','PINBALL','RAMJET','RASCAL','RIPCORD','ROCKET','ROTOR','RUDDER','SCRAMBLE','SKYLARK','SLIPSTREAM','SNAPROLL','SONIC','SPARKPLUG','SPITFIRE','SQUALL',
 'STARDUST','STRATUS','SUNDOG','SWOOP','TAILWIND','TALON','THROTTLE','THUNDERBOLT','TOPSPIN','TORQUE','TUMBLEWEED','TURBO','TWISTER','UPDRAFT','VECTOR',
 'VORTEX','WAFFLE','WINGNUT','WRENCH','YOKE','ZEPHYR','ZIPLINE','ZOOM','ZULU','BISCUIT','CORKSCREW','DOODLE','FIDGET','GIZMO','HICCUP','JITTERBUG','KABOOM',
 'MARMALADE','NOSEDIVE','OVERDRIVE','PIPSQUEAK','QUICKSILVER','RADAR','SKEDADDLE','SKYROCKET','SNOOZE','SPROCKET','TACO','WHIRLYBIRD','WINDSOCK','WOBBLE'];
HFQ.callA=['SWIFT','BRAVE','LUCKY','SILVER','ROCKET','SKY','STORM','COMET','TURBO','NOVA','CLOUD','JET','STAR','THUNDER','MACH','SONIC'];   // kept for older saves
HFQ.callB=['FALCON','HAWK','EAGLE','OSPREY','KESTREL','RAVEN','PROP','RUDDER','BEACON','COMPASS','ZEPHYR','ROTOR','GLIDER','VECTOR','RADAR','SCOUT'];

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
/* practice: the clubhouse game that drills the unit (the PRACTICE node on the Flight Path and the route's pill). Units without one fall back to the first built game that lists them in `learn`. */
HFQ.units=[
 {id:'flight',practice:'paper',t:'HOW AIRPLANES FLY',s:'LIFT, WEIGHT, THRUST + DRAG',icon:'plane',topics:['The four forces','How a wing makes lift','Angle of attack','What a stall really is']},
 {id:'parts',practice:'words',t:'PARTS OF AN AIRPLANE',s:'NOSE TO TAIL',icon:'wrench',topics:['Fuselage, wings + tail','Ailerons, elevator + rudder','Flaps + trim','Landing gear + engine']},
 {id:'controls',t:'FLIGHT CONTROLS',s:'PITCH, ROLL + YAW',icon:'joy',topics:['The three axes','The yoke or stick','Rudder pedals','The throttle']},
 {id:'instruments',practice:'gauges',t:'COCKPIT INSTRUMENTS',s:'THE SIX-PACK',icon:'gauge',topics:['Airspeed indicator','Attitude indicator','Altimeter','Turn coordinator','Heading indicator','Vertical speed indicator']},
 {id:'airports',practice:'taxi',t:'AIRPORTS',s:'RUNWAYS, SIGNS + LIGHTS',icon:'flag',topics:['Runway numbers','Markings + signs','Taxiways + hold-short lines','The traffic pattern']},
 {id:'radio',practice:'pairs',t:'TALKING ON THE RADIO',s:'ALFA, BRAVO, CHARLIE',icon:'chat',topics:['The phonetic alphabet','Call signs','Talking to the tower','Radio words']},
 {id:'weather',practice:'wx',t:'WEATHER',s:'WIND, CLOUDS + FRONTS',icon:'cloud',topics:['Wind + the windsock','Clouds and what they mean','Fronts','Visibility + weather minimums']},
 {id:'nav',practice:'darts',t:'NAVIGATION + CHARTS',s:'MAPS FOR THE SKY',icon:'pin',topics:['Reading a sectional chart','Compass headings','Flying by landmarks','Planning a cross-country']},
 {id:'airspace',t:'AIRSPACE',s:'THE SKY HAS LANES',icon:'grid',topics:['Controlled vs. uncontrolled','Airspace classes','Special-use areas','Who you talk to, where']},
 {id:'rules',t:'RULES OF THE SKY',s:'SEE AND AVOID',icon:'check',topics:['Right-of-way','See and avoid','Cruising altitudes','Aircraft lights']},
 {id:'perf',practice:'cargo',t:'WEIGHT + PERFORMANCE',s:'HOW MUCH CAN WE CARRY?',icon:'list',topics:['Weight + balance','Center of gravity','Hot days + high airports','Takeoff + landing distance']},
 {id:'decisions',practice:'preflight',t:'PILOT DECISIONS',s:'CHECKLISTS + SAFETY',icon:'docs',topics:['Checklists','The IMSAFE check','Go / no-go decisions','Crew teamwork']},
 {id:'types',practice:'spot',t:'TYPES OF AIRCRAFT',s:'CATEGORIES + CLASSES',icon:'star',topics:['Airplanes','Rotorcraft','Gliders + balloons','Powered-lift']}
];

/* ---------- STAGES (round 6.4): the course is four stages. DISCOVERY is the first look at flying (the original 13 units plus a Discovery Flight unit);
   STUDENT PILOT learns to fly the airplane; PRIVATE PILOT covers everything the private certificate asks; BEYOND is the road from there to the top.
   Units open in order inside a stage and a stage opens when the one before it is BRONZE; a stage marked free (BEYOND) is open to peek at from day one.
   New units list no topics: addLessons fills them in from the lesson titles. Practice only names a built game that fits. */
HFQ.stages=[
 {id:'discovery',t:'DISCOVERY',s:'YOUR FIRST LOOK AT FLYING'},
 {id:'student',t:'STUDENT PILOT',s:'LEARN TO FLY THE AIRPLANE, THEN SOLO'},
 {id:'private',t:'PRIVATE PILOT',s:'EVERYTHING THE CERTIFICATE ASKS',note:'FOR CURIOUS CADETS • NOT AN FAA COURSE'},
 {id:'beyond',t:'BEYOND',s:'FROM PRIVATE TO THE TOP OF THE SKY',free:true,note:'OPEN FROM DAY ONE: SEE WHAT IS POSSIBLE'}
];
HFQ.units.forEach(u=>{ u.stage='discovery'; });
[ // [stage, id, title, subtitle, icon, practice]
 ['discovery','discovery','YOUR DISCOVERY FLIGHT','YOUR FIRST TRIP TO THE SKY','plane','depart'],
 ['student','start','STARTING TRAINING','SCHOOLS, INSTRUCTORS + PLANS','user'],
 ['student','preflightinsp','PREFLIGHT INSPECTION','THE WALKAROUND','check','preflight'],
 ['student','engine','ENGINE + FUEL','WHAT KEEPS THE PROP TURNING','wrench'],
 ['student','systems','AIRPLANE SYSTEMS','ELECTRICAL, GYROS + AVIONICS','gear'],
 ['student','maneuvers','BASIC MANEUVERS','LEVEL, CLIMB, DESCEND + TURN','joy'],
 ['student','stalls','SLOW FLIGHT + STALLS','THE EDGE OF LIFT','chevrons'],
 ['student','landings','TAKEOFFS + LANDINGS','THE HARD PART, STEP BY STEP','plane','landing'],
 ['student','pattern','PATTERN + AIRPORT WORK','FLYING AROUND THE FIELD','flag','arrive'],
 ['student','radio2','RADIO IN DEPTH','SPEAK LIKE A PILOT','headset'],
 ['student','safety','FLYING SAFE','SEE IT, AVOID IT','check'],
 ['student','emergency','WHEN THINGS GO WRONG','ENGINE OUT + OTHER SURPRISES','bell'],
 ['student','solo','FIRST SOLO','THE BIGGEST DAY OF TRAINING','star'],
 ['private','ppl','PRIVATE PILOT BASICS','REQUIREMENTS + PRIVILEGES','medal'],
 ['private','regs','THE REGULATIONS','THE RULES BOOK, MADE EASY','docs'],
 ['private','aero','AERODYNAMICS DEEP DIVE','LOAD, STABILITY + WAKE','plane'],
 ['private','power','ENGINES + PROPELLERS','MIXTURE, CARB ICE + MORE','wrench'],
 ['private','wxtheory','WEATHER THEORY','WHY THE SKY DOES WHAT IT DOES','cloud','cloud'],
 ['private','wxsvc','WEATHER REPORTS','METARS, TAFS + BRIEFINGS','search','metar'],
 ['private','navplot','PLOTTING A COURSE','WIND, HEADINGS + FLIGHT LOGS','map','darts'],
 ['private','radionav','RADIO NAV + GPS','VOR, GPS + ADS-B','tower'],
 ['private','xc','CROSS-COUNTRY FLYING','A TRIP FROM A TO B','pin'],
 ['private','night','NIGHT FLYING','LIGHTS, ILLUSIONS + SAFETY','star'],
 ['private','charts','AIRSPACE + CHARTS PLUS','THE SECTIONAL, LINE BY LINE','grid'],
 ['private','loading','LOADING + PERFORMANCE','THE MATH OF A SAFE FLIGHT','list','cargo'],
 ['private','aeromed','THE HUMAN PILOT','BODY, EYES + EARS IN FLIGHT','heart'],
 ['private','adm','DECISIONS + RISK','PAVE, 3P + DECIDE','check'],
 ['private','adv','ADVANCED MANEUVERS','STEEP TURNS, SLIPS + SHORT FIELDS','chevrons'],
 ['private','maint','KEEPING IT AIRWORTHY','INSPECTIONS + PAPERWORK','wrench'],
 ['private','ride','THE PRACTICAL TEST','ORAL, FLIGHT + PREP','trophy'],
 ['beyond','ifr','INSTRUMENT RATING','FLYING IN THE CLOUDS','gauge'],
 ['beyond','advair','BIGGER + FASTER','MULTI-ENGINE + SMART TECH','plane'],
 ['beyond','comm','COMMERCIAL PILOT','FLYING FOR A LIVING','bag'],
 ['beyond','cfi','FLIGHT INSTRUCTOR','TEACHING OTHERS TO FLY','user'],
 ['beyond','airline','AIRLINE PILOT','ATP, 1,500 HOURS + THE LEFT SEAT','tower'],
 ['beyond','jet','JET AGE','HIGH, FAST + PRESSURIZED','chevrons'],
 ['beyond','heli','HELICOPTERS','HOVER, CYCLIC + COLLECTIVE','heli','spot'],   // r7.4
 ['beyond','careers','AVIATION CAREERS','MANY WAYS TO FLY FOR A LIVING','bag'],
 ['beyond','special','SPECIAL FLYING','AIRSHOWS, RESCUE + FIREFIGHTING','star'],
 ['beyond','mil','MILITARY + SPACE','TEST PILOTS + ASTRONAUTS','flag'],
 ['beyond','frontier','NEW FRONTIERS','DRONES, ELECTRIC + SUPERSONIC','gear'],
 ['beyond','history','AVIATION HISTORY','FROM KITTY HAWK TO TODAY','book'],
 ['beyond','master','MASTER PILOT','THE HABITS OF THE BEST','trophy']
].forEach(([stage,id,t,s,icon,practice])=>{ const u={id,stage,t,s,icon,topics:[]}; if(practice) u.practice=practice; HFQ.units.push(u); });

/* ---------- the crew (placeholder names - swap in characters from the books) ---------- */
const CREW={
 instructor:{suit:'#2d3b55',suit2:'#1f2a3f',skin:'#c88c60',hair:'#2a2020',style:'short',hat:'cap',hatCol:'#2d3b55'},
 chief:{suit:'#2f5f8a',suit2:'#244a6a',skin:'#e0b080',hair:'#6b4a2a',style:'short',hat:'cap',hatCol:'#c03030'},
 tower:{suit:'#f2f2f2',suit2:'#2a3a5a',skin:'#8d5a3a',hair:'#1a1410',style:'curly',hat:'headset'},
 marshal:{suit:'#2a3a5a',suit2:'#1d2840',skin:'#e8c098',hair:'#d8b040',style:'pony',hat:'headset',vest:true,wands:true},
 ops:{suit:'#e07a1a',suit2:'#3a3f48',skin:'#b07a4e',hair:'#1a1410',style:'buzz',hat:'cap',hatCol:'#3a3f48',vest:true},
 tech:{suit:'#2f8a4a',suit2:'#1f5a30',skin:'#f6d6b8',hair:'#a83a20',style:'bun',hat:'none'},
 spotter:{suit:'#6a3fa0',suit2:'#3a2a5a',skin:'#d29a6a',hair:'#1a1410',style:'long',hat:'cap',hatCol:'#ffc21a'},
 captain:{suit:'#1a2238',suit2:'#11182a',skin:'#c88c60',hair:'#d9dae4',style:'short',hat:'cap',hatCol:'#1a2238'},
 host:{suit:'#c8102e',suit2:'#7a0a1c',skin:'#f1c9a0',hair:'#3a2a1a',style:'curly',hat:'none'},
 librarian:{suit:'#4a6a3a',suit2:'#2e4a26',skin:'#d9a070',hair:'#6b4a2a',style:'bun',hat:'none'}
};

HFQ.crew=CREW;   // the crew's looks (the lessons' instructor tip uses CREW.instructor)

/* ============================ THE AIRFIELD ============================ */
G.WORLD={
 start:'lounge', bag:true, bagLabel:'FLIGHT BAG', bagIcon:'bag',
 /* the bottom bar: the AIRFIELD MAP (every place) + the four places cadets use most */
 tabs:[{id:'path',label:'PATH',icon:'road',scene:'path',args:{back:'world'}},'lounge','classroom','hangar'],
 /* the round MAP button in every room's top corner opens the airfield map (hfq_places.js) */
 mapBtn:{label:'MAP',icon:'map',scene:'map',args:{back:'world'}},
 /* Among Us style controls: drag on the floor (or the resting stick, bottom left) to walk; USE lights up beside anything you can use.
    r7.4: the resting stick shows for touch input only (hfq_input.js decides from what the cadet actually uses; Settings can pin it);
    keyboards get an E keycap on USE and a walk legend instead. */
 useBtn:true, stickHint:()=>!HFQ.input||HFQ.input.touchUI(), keyHints:()=>HFQ.input?HFQ.input.keyHints():null,
 /* CALL THE TOWER from anywhere (hfq_radio.js) */
 fab:{label:'CALL TOWER',short:'TOWER',round:true,icon:'headset',fn:room=>G.go('radio',{back:'world',from:room})},
 rooms:{
  /* ---- PILOT'S LOUNGE: the hangout (games, news, your locker, other cadets) ---- */
  lounge:{
   name:'PILOT’S LOUNGE', tab:{label:'LOUNGE',icon:'home'},
   w:520, h:400, wall:120, viewH:300, wallStyle:'windows', floor:'wood', music:'lounge', ambience:'lounge',
   palette:{wall:'#5a4030',floor:'#7a5236',trim:'#e8e2d6'},
   windows:[[110,68]],
   spawn:[230,350],
   crowdSpots:[[236,334],[392,318],[110,250],[440,230]],
   stations:[
    {key:'toClass',label:'TO THE CLASSROOM',icon:'docs',wall:true,x:70,w:44,art:'door',go:{room:'classroom',at:'toLounge'}},
    {key:'toGame',label:'TO THE GAME ROOM',icon:'joy',wall:true,x:200,w:44,art:'door',go:{room:'gameroom',at:'toLounge'}},
    {key:'toPlatform',label:'UP TO THE PLATFORM',icon:'search',wall:true,x:250,w:40,art:'stairs',go:{room:'platform',at:'down'}},
    {key:'crewboard',label:'CREW BOARD',icon:'roster',wall:true,x:330,w:96,art:'depboard',go:{scene:'crew',args:{tab:'feed'}}},
    {key:'news',label:'HANGAR NEWS',icon:'megaphone',wall:true,x:410,w:56,art:'cork',go:{scene:'board'}},
    {key:'trophy',label:'MY LOGBOOK',icon:'trophy',wall:true,x:477,w:44,art:'case',go:{scene:'logbook'}},
    {key:'locker',label:'MY LOCKER',icon:'user',foot:[16,214,68,228],h:52,art:'locker',go:{scene:'locker'}},
    {key:'jukebox',label:'JUKEBOX',icon:'music',foot:[330,214,360,226],h:46,art:'jukebox',go:{fn:()=>HFQ.jukebox&&HFQ.jukebox()}},
    {key:'squadron',label:'CADETS + KUDOS',icon:'roster',foot:[440,322,500,330],h:34,art:'sign',text:'CREW',go:{scene:'crew',args:{tab:'cadets'}}},
    {key:'toHangar',label:'TO THE HANGAR',side:'R',y0:236,y1:300,go:{room:'hangar',at:'toLounge'}},
    {key:'toRamp',label:'OUT TO THE PARKING STAND',side:'L',y0:244,y1:290,go:{room:'ramp',at:'toLounge'}}
   ],
   decor:[
    {art:'couch',foot:[196,250,282,268],h:22,col:'#2f5f8a'},
    {art:'couch',foot:[300,250,386,268],h:22,col:'#2f5f8a'},
    {art:'table',foot:[256,292,326,306],h:12},
    {art:'rug',foot:[80,296,200,350],h:0,noShadow:true},
    {art:'plant',foot:[502,180,518,190],h:30},
    {art:'plant',foot:[26,368,42,378],h:30}
   ],
   npcs:[
    {id:'captain',name:'CAPTAIN',role:'AIRLINE CAPTAIN',x:470,y:262,av:CREW.captain,
     first:['Hello, cadet. I fly airliners, and I started exactly where you are: curious about everything that flies.',
            'Every pilot keeps a LOGBOOK: every flight, every landing, every hour. Yours is in the trophy case here and in your Flight Bag.',
            'Log the flights you take as a PASSENGER too. Where you flew, what you flew in, what you saw out the window. That’s how a flying life starts.'],
     lines:['Window seat? Watch the wing. The flaps come out before landing, and the spoilers pop up when you touch down.',
            'Airline pilots read the ATIS before every flight, same as you do at the tower.',
            'A logbook is a story. Keep writing it.',
            'The CREW BOARD shows what every cadet on this device has been up to. Give some kudos!',
            'Two pilots fly every airliner: a captain and a first officer. We check each other’s work on every flight.']}
   ]
  },

  /* ---- THE GAME ROOM: off the Lounge. Every just-for-fun game lives here (the learning games stay out on the airfield) ---- */
  gameroom:{
   name:'THE GAME ROOM', mapLabel:'GAME ROOM',
   w:600, h:420, wall:120, viewH:300, wallStyle:'panel', floor:'carpet', music:'arcade', ambience:'lounge',
   palette:{wall:'#1b2140',floor:'#2b2446',trim:'#e8e2d6',slab:'#120f1c'},
   spawn:[80,200],
   crowdSpots:[[300,250],[180,250]],
   stations:[
    {key:'toLounge',label:'BACK TO THE LOUNGE',icon:'home',wall:true,x:40,w:44,art:'door',go:{room:'lounge',at:'toGame'}},
    {key:'darts',label:'COMPASS DARTS',icon:'pin',wall:true,x:120,w:34,art:'dartboard',go:{scene:'g_darts'}},
    {key:'neon',wall:true,x:330,w:170,art:'neon',noLabel:true},
    {key:'hoops',label:'HANGAR HOOPS',icon:'star',wall:true,x:470,w:50,art:'hoop',go:{scene:'g_hoops'}},
    {key:'scores',label:'HIGH SCORES',icon:'trophy',wall:true,x:556,w:70,art:'scores',go:{scene:'games'}},
    {key:'cargo',label:'CARGO STACK (ARCADE)',icon:'grid',foot:[196,180,228,190],h:50,art:'arcade',text:'CARGO',go:{scene:'g_cargo'}},
    {key:'radar4',label:'RADAR FOUR (ARCADE)',icon:'grid',foot:[238,180,270,190],h:50,art:'arcade',text:'RADAR',go:{scene:'g_radar4'}},
    {key:'skee',label:'SKEE-BALL',icon:'star',foot:[540,176,574,190],h:56,art:'skee',go:{scene:'g_skee'}},
    {key:'bags',label:'BAG TOSS (CORNHOLE)',icon:'flag',foot:[340,206,372,218],h:8,art:'cornhole',go:{scene:'g_bags'}},
    {key:'pool',label:'POOL TABLE',icon:'joy',foot:[60,290,180,326],h:14,art:'pool',go:{scene:'g_pool'}},
    {key:'hockey',label:'AIR HOCKEY',icon:'joy',foot:[230,296,350,326],h:14,art:'hockey',go:{scene:'g_hockey'}},
    {key:'pong',label:'PROP PONG (PING-PONG)',icon:'joy',foot:[400,296,510,322],h:10,art:'pingpong',go:{scene:'g_pong'}},
    {key:'golf',label:'MINI GOLF',icon:'flag',foot:[40,372,150,392],h:6,art:'putting',go:{scene:'g_golf'}},
    {key:'bowling',label:'CONE BOWLING',icon:'star',foot:[380,372,560,388],h:8,art:'lane',go:{scene:'g_bowling'}}
   ],
   decor:[
    {art:'cornhole',foot:[440,206,472,218],h:8},
    {art:'plant',foot:[584,250,598,260],h:30},
    {art:'stool',foot:[200,250,212,258],h:16},
    {art:'stool',foot:[360,250,372,258],h:16}
   ],
   npcs:[
    {id:'host',name:'HOST',role:'GAME ROOM HOST',x:430,y:250,av:CREW.host,
     first:['Welcome to the GAME ROOM! Pool, air hockey, skee-ball, bowling, hoops, darts, the arcade: it’s all here.',
            'These are just for fun. The LEARNING games are out on the airfield, where they belong: the tower, the runway, the parking stand.',
            'Game XP is capped every day, so Ground School is still the fastest way up. Now go set a high score!'],
     lines:['The HIGH SCORES board shows every game and your best. Tap it.',
            'Compass Darts is secretly a navigation lesson. Don’t tell anyone.',
            'Skee-Ball tip: pull back about halfway. Too hard and it flies over the board.',
            'In pool, the balls are ALFA through GOLF. Radio alphabet, even in here.',
            'Air hockey is first to five. The crew’s mallet is quick, so shoot at an angle.']}
   ]
  },

  /* ---- THE CLASSROOM: Ground School lives here ---- */
  classroom:{
   name:'GROUND SCHOOL CLASSROOM', tab:{label:'CLASS',icon:'docs'},
   w:520, h:400, wall:120, viewH:300, wallStyle:'panel', floor:'tile', music:'classroom', ambience:'classroom',
   palette:{wall:'#2f4a5e',floor:'#c4cbd3',trim:'#e8e2d6'},
   spawn:[262,352],
   stations:[
    {key:'library',label:'THE LIBRARY',icon:'book',wall:true,x:72,w:80,art:'bookshelf',go:{scene:'library'}},
    {key:'board',label:'GROUND SCHOOL',icon:'docs',wall:true,x:206,w:160,art:'whiteboard',go:{scene:'groundschool'}},
    {key:'patches',label:'PATCH WALL',icon:'medal',wall:true,x:372,w:84,art:'patchwall',go:{scene:'groundschool'}},
    {key:'review',label:'HANGAR FLYING',icon:'chat',wall:true,x:466,w:52,art:'cork',go:{fn:()=>HFQ.reviewOrToast()}},
    {key:'desk',label:'MY DESK: KEEP LEARNING',icon:'star',foot:[234,280,290,294],h:22,art:'mydesk',go:{fn:()=>HFQ.keepLearning()}},
    {key:'sim',label:'COCKPIT TRAINER: GAUGE READER',icon:'gauge',foot:[30,214,96,230],h:44,art:'sim',go:{scene:'g_gauges'}},
    {key:'pairs',label:'PHONETIC PAIRS',icon:'chat',foot:[30,318,96,334],h:14,art:'cardtable',go:{scene:'g_pairs'}},
    {key:'words',label:'WORD HUNT',icon:'docs',foot:[318,236,374,248],h:20,art:'puzzledesk',go:{scene:'g_words'}},
    {key:'chart',label:'CHART TABLE',icon:'pin',foot:[410,306,486,322],h:18,art:'charttable',go:{scene:'route',args:{unit:'nav',back:'world'}}},
    {key:'toLounge',label:'TO THE LOUNGE',side:'R',y0:236,y1:300,go:{room:'lounge',at:'toClass'}}
   ],
   decor:[
    {art:'desk',foot:[150,236,206,248],h:20,col:'#7a8a9a'},
    {art:'desk',foot:[150,300,206,312],h:20,col:'#7a8a9a'},
    {art:'desk',foot:[318,300,374,312],h:20,col:'#7a8a9a'},
    {art:'plant',foot:[492,176,508,186],h:30},
    {art:'plant',foot:[20,350,36,360],h:30}
   ],
   npcs:[
    {id:'instructor',name:'INSTRUCTOR',role:'GROUND SCHOOL INSTRUCTOR',x:182,y:198,av:CREW.instructor,
     first:['Welcome to the HypeTeen Flight Academy, cadet! I’m your Ground School instructor, and this is our classroom.',
            'The whiteboard is GROUND SCHOOL: 56 units and 512 lessons, from a first discovery flight to the top of the pilot world. Your desk picks up right where you left off.',
            'Drag on the floor to walk, and tap USE when it lights up beside something. The round MAP button shows the whole airfield: the Tower, the Parking Stand, the Wash Rack, the Runway, the Game Room and more.',
            'The FLIGHT PATH tab is your whole course in one line: lessons, books, drills and checkrides, unit by unit. Already know a unit? TEST OUT of it.',
            'And anywhere you go, CALL TOWER lets you talk on the radio, just like a real pilot.'],
     lines:['Every pilot started exactly where you are: curious.',
            'Sit at your desk to keep learning. Two lessons a day keeps your FLIGHT DAYS going.',
            'Ground school first, runway second. That’s how real pilots train too.',
            'Missed a question? HANGAR FLYING on the corkboard gives you another shot.',
            'Pass a unit’s checkride and your patch goes up on the PATCH WALL.']}
   ]
  },

  /* ---- THE HANGAR: airplanes, parts, the crew chief ---- */
  hangar:{
   name:'THE HANGAR', tab:{label:'HANGAR',icon:'wrench'},
   w:560, h:420, wall:130, viewH:310, wallStyle:'hangar', floor:'concrete', music:'hangar', ambience:'hangar',
   palette:{wall:'#59626f',floor:'#8a8f96'},
   opening:[200,360],
   leadLine:[280,136,280,250,300,300],
   spawn:[110,360],
   stations:[
    {key:'gallery',label:'AIRCRAFT GALLERY',icon:'plane',wall:true,x:96,w:110,art:'gallery',go:{scene:'fleet',args:{gallery:true}}},
    {key:'toRunway',label:'OUT TO THE RUNWAY',icon:'flag',wall:true,x:280,w:150,art:'none',go:{room:'runway',at:'toHangar'}},
    {key:'parts',label:'PARTS OF AN AIRPLANE',icon:'wrench',wall:true,x:462,w:96,art:'partsboard',go:{scene:'groundschool',args:{unit:'parts'}}},
    {key:'preflight',label:'MY AIRCRAFT',icon:'plane',foot:[190,286,370,298],h:58,art:'myplane',go:{scene:'fleet'}},
    {key:'cart',label:'TOOL CART',icon:'wrench',foot:[466,300,508,312],h:26,art:'cart',go:{scene:'inspect',args:{id:'toolcart'}}},      // r7.4: the cart and the bench open their own close-ups
    {key:'bench',label:'WORKBENCH',icon:'wrench',foot:[410,366,520,384],h:22,art:'workbench',go:{scene:'inspect',args:{id:'workbench'}}},   // (they used to start the Crew Chief's talk)
    {key:'toLounge',label:'TO THE LOUNGE',side:'L',y0:250,y1:320,go:{room:'lounge',at:'toHangar'}},
    {key:'toWash',label:'TO THE WASH RACK',side:'R',y0:318,y1:350,go:{room:'wash',at:'toHangar'}}
   ],
   decor:[
    {art:'crate',foot:[30,176,62,196],h:20},
    {art:'crate',foot:[488,176,530,194],h:18},
    {art:'cone',foot:[156,378,186,384],h:12},
    {art:'drum',foot:[40,250,58,262],h:24},
    {art:'drum',foot:[62,252,80,264],h:24}
   ],
   npcs:[
    {id:'chief',name:'CREW CHIEF',role:'AIRCRAFT MECHANIC',x:448,y:284,av:CREW.chief,
     first:['Hey, cadet! I’m the crew chief. I keep these airplanes healthy.',
            'Before every flight, pilots do a PREFLIGHT walk-around. They check the fuel, the oil, the tires and every control surface.',
            'The gallery on the wall shows the different kinds of aircraft. Go take a look!'],
     lines:['That’s YOUR airplane parked in the middle. Tap it to open your hangar and pick its paint.',
            'Every academy phase unlocks new aircraft for your hangar: bush planes, twins, gliders, helicopters, even jets.',
            'Ailerons, elevator, rudder: three controls that move an airplane around three axes.',
            'Never walk near a propeller, even when the engine is off. Treat every prop like it could start.']}
   ]
  },

  /* ---- VIEWING PLATFORM: watch the airfield, wind and radio ---- */
  platform:{
   name:'VIEWING PLATFORM', tab:{label:'PLATFORM',icon:'search'},
   w:480, h:360, wall:140, viewH:290, wallStyle:'sky', floor:'deck', music:'platform', ambience:'platform',
   palette:{floor:'#7b6a58'},
   spawn:[110,300],
   stations:[
    {key:'scope',label:'PLANE SPOTTER',icon:'search',foot:[90,196,112,204],h:30,art:'scope',go:{scene:'g_spot'}},
    {key:'cloud',label:'CLOUD SPOTTER',icon:'cloud',foot:[126,196,186,202],h:34,art:'sign',text:'CLOUDS',go:{scene:'g_cloud'}},
    {key:'wx',label:'TODAY’S WEATHER (ATIS)',icon:'cloud',foot:[300,196,362,202],h:34,art:'sign',text:'WX',go:{scene:'radio',args:{freq:'atis'}}},
    {key:'sock',label:'WINDSOCK',icon:'flag',foot:[420,186,430,194],h:62,art:'windsock',go:{page:'windsock'}},
    {key:'radio',label:'SCANNER RADIO',icon:'headset',foot:[196,262,276,278],h:18,art:'radio',go:{scene:'radio'}},
    {key:'toss',label:'PAPER PLANE TOSS',icon:'plane',foot:[232,190,264,198],h:16,art:'launch',go:{scene:'g_paper'}},
    {key:'down',label:'DOWN TO THE LOUNGE',side:'L',y0:226,y1:296,go:{room:'lounge',at:'toPlatform'}}
   ],
   decor:[
    {art:'rail',foot:[14,150,466,154],h:16}
   ],
   npcs:[
    {id:'spotter',name:'PLANE SPOTTER',role:'AVIATION ENTHUSIAST',x:196,y:234,av:CREW.spotter,
     first:['Hi! I’m a plane spotter. I come up here every day to watch what flies by.',
            'Spotters learn to name an aircraft from its shape: how many wings, how many engines, where the tail sits.',
            'Look through the scope and name what you see. Every aircraft you spot joins your hangar, so you can fly it as your avatar!'],
     lines:['Three wings stacked up? That’s a triplane. Two? A biplane.',
            'Count the engines first. Four under the wings means a big airliner or a bomber.',
            'Helicopters have a big rotor on top and a little one on the tail.',
            'A hump on top of the front? That’s the famous Boeing 747.',
            'Big round envelope, no wings? Lighter than air: a balloon or an airship.']}
   ]
  },

  /* ---- THE TOWER: the control tower cab, high above the field (radio + weather games) ---- */
  tower:{
   name:'THE TOWER', tab:{label:'TOWER',icon:'tower'},
   w:520, h:380, wall:150, viewH:300, wallStyle:'towercab', floor:'carpet', music:'tower', ambience:'tower',
   palette:{wall:'#26303c',floor:'#39414e'},
   spawn:[262,336],
   stations:[
    {key:'atis',label:'METAR DECODER',icon:'cloud',wall:true,x:130,w:84,art:'wxscreen',go:{scene:'g_metar'}},
    {key:'window',label:'WEATHER CALL',icon:'search',wall:true,x:262,w:96,art:'wxwindow',go:{scene:'g_wx'}},
    {key:'strips',label:'FLIGHT STRIPS (RADIO)',icon:'headset',wall:true,x:410,w:80,art:'strips',go:{scene:'radio'}},
    {key:'lightgun',label:'LIGHT GUN SIGNALS',icon:'flag',foot:[52,212,82,222],h:42,art:'lightgun',go:{scene:'g_lightgun'}},
    {key:'ground',label:'TAXI MAZE',icon:'pin',foot:[118,250,206,266],h:24,art:'console',text:'GND',go:{scene:'g_taxi'}},
    {key:'depart',label:'DEPARTURES',icon:'plane',foot:[218,250,306,266],h:24,art:'console',text:'TWR',go:{scene:'g_depart'}},
    {key:'arrive',label:'ARRIVALS',icon:'plane',foot:[318,250,406,266],h:24,art:'console',text:'APP',go:{scene:'g_arrive'}},
    {key:'down',label:'DOWN TO THE PARKING STAND',side:'L',y0:262,y1:330,go:{room:'ramp',at:'toTower'}}
   ],
   decor:[
    {art:'binos',foot:[440,212,462,220],h:30},
    {art:'plant',foot:[482,330,498,340],h:30}
   ],
   npcs:[
    {id:'tower',name:'TOWER',role:'AIR TRAFFIC CONTROLLER',x:330,y:306,av:CREW.tower,
     first:['Welcome to the tower cab! From up here we can see the whole airfield.',
            'GROUND control handles everything rolling on the taxiways. TOWER handles the runway and the airplanes flying the pattern.',
            'Every hour the weather goes out as a METAR, and the ATIS radio reads it out on a loop. Pilots listen before they call us.',
            'Try the consoles! And anywhere on the field, tap CALL TOWER to talk to me on the radio.'],
     lines:['Say your call sign clearly. That’s how I know who’s talking.',
            'Who you’re calling, who you are, where you are, what you want. That’s every first call.',
            'Always read back a HOLD SHORT instruction. It keeps airplanes off the runway until it’s their turn.',
            'If an airplane’s radio quits, I can still talk to it with the light gun: green, red and white flashes.',
            'ROGER means “I heard you.” WILCO means “I will comply.”',
            'Airplanes take off and land INTO the wind. That’s why the runway in use can change during the day.']}
   ]
  },

  /* ---- THE PARKING STAND: the ramp where airplanes park, fuel up and get their preflight ---- */
  ramp:{
   name:'PARKING STAND', tab:{label:'RAMP',icon:'pin'},
   w:640, h:440, wall:110, viewH:300, wallStyle:'open', floor:'apron', tower:86, music:'ramp', ambience:'runway',
   palette:{floor:'#7c8087'},
   spawn:[330,404],
   stations:[
    {key:'toRunway',label:'TAXI OUT TO THE RUNWAY',icon:'flag',wall:true,x:350,w:150,art:'none',go:{room:'runway',at:'toRamp'}},
    {key:'myplane',label:'PREFLIGHT RACE',icon:'check',foot:[240,262,400,274],h:58,art:'parkedplane',go:{scene:'g_preflight'}},
    {key:'fuel',label:'FUEL TRUCK',icon:'drop',foot:[470,196,566,212],h:34,art:'fueltruck',go:{scene:'inspect',args:{id:'fueltruck'}}},
    {key:'signals',label:'MARSHALLER SIGNALS',icon:'flag',foot:[96,346,150,352],h:30,art:'sign',text:'SIGNALS',sign:'info',go:{scene:'g_marshal'}},
    {key:'toTower',label:'TO THE TOWER',side:'L',y0:300,y1:370,go:{room:'tower',at:'down'}},
    {key:'toLounge',label:'INTO THE LOUNGE',side:'R',y0:300,y1:370,go:{room:'lounge',at:'toRamp'}}
   ],
   decor:[
    {art:'parked',id:'pa28',foot:[40,196,170,206],h:44},
    {art:'parked',id:'j3',foot:[470,370,590,380],h:44},
    {art:'cone',foot:[200,214,236,220],h:12}
   ],
   npcs:[
    {id:'marshal',name:'LINE CREW',role:'AIRCRAFT MARSHALLER + FUELER',x:186,y:318,av:CREW.marshal,
     first:['Welcome to the parking stand! Line crew parks the airplanes, fuels them and guides them in with these orange wands.',
            'Before every flight, pilots walk all the way around the airplane. That’s the PREFLIGHT. Your airplane is right there!',
            'The sign by me is the Signals game. Learn the wands and you can taxi in like a pro.'],
     lines:['Avgas for small airplanes is called 100LL, and it’s dyed BLUE so everyone can tell it apart.',
            'Before fueling, we clip a grounding wire to the airplane. It stops static sparks.',
            'Pilots drain a little fuel into a clear cup before flying. Water is heavier than fuel, so it sinks to the bottom.',
            'Chocks keep the wheels from rolling. Tie-down ropes keep the wind from moving the airplane.',
            'Every wand signal means something. STOP is arms crossed high over the head.',
            'Never walk through the propeller arc, even when the engine is off.']}
   ]
  },

  /* ---- THE WASH RACK: wash your aircraft (and learn what NOT to spray) ---- */
  wash:{
   name:'WASH RACK', tab:{label:'WASH',icon:'drop'},
   w:520, h:400, wall:130, viewH:300, wallStyle:'washbay', floor:'washpad', music:'ramp', ambience:'wash',
   palette:{wall:'#4a5a6a',floor:'#8e949b'},
   spawn:[262,356],
   stations:[
    {key:'washplane',label:'WASH DAY',icon:'drop',foot:[170,262,350,274],h:58,art:'washplane',go:{scene:'g_wash'}},
    {key:'shelf',label:'WASH SUPPLIES',icon:'list',wall:true,x:440,w:84,art:'shelf',go:{page:'wash'}},
    {key:'toHangar',label:'TO THE HANGAR',side:'L',y0:262,y1:330,go:{room:'hangar',at:'toWash'}}
   ],
   decor:[
    {art:'hosereel',foot:[40,182,72,192],h:30},
    {art:'bucket',foot:[392,330,408,338],h:12},
    {art:'cone',foot:[120,374,140,380],h:12}
   ],
   npcs:[
    {id:'tech',name:'LINE TECH',role:'WASH RACK TECHNICIAN',x:430,y:300,av:CREW.tech,
     first:['Hi! Welcome to the wash rack. A clean airplane is a faster, safer airplane.',
            'Rule one: cover the pitot tube and the static ports BEFORE you get anything wet. Water in them can make the airspeed and altitude gauges lie.',
            'Rule two: take the covers OFF when you’re done. Bright orange REMOVE BEFORE FLIGHT flags help you remember.'],
     lines:['Bugs on the leading edges add drag. Soak them, then wipe gently.',
            'Windshields are plastic, not glass. Use a soft cloth and a plastic cleaner. Never paper towels: they scratch.',
            'Wash from the top down so dirty water doesn’t run over clean paint.',
            'A wash is a great time to look closely for loose screws, oil leaks and dents.']}
   ]
  },

  /* ---- THE RUNWAY: the games ---- */
  runway:{
   name:'THE RUNWAY', tab:{label:'RUNWAY',icon:'flag'},
   w:640, h:440, wall:110, viewH:300, wallStyle:'open', floor:'grass', tower:540, music:'runway', ambience:'runway',
   palette:{floor:'#5a8a44'},
   runway:{y0:148,y1:228,num:'27'},
   apron:[30,296,610,430],
   spawn:[320,400],
   stations:[
    {key:'landing',label:'LANDING CHALLENGE',icon:'plane',foot:[70,336,140,342],h:32,art:'sign',text:'LAND',sign:'info',go:{scene:'g_landing'}},
    {key:'taxi',label:'TAXI MAZE',icon:'pin',foot:[210,336,280,342],h:32,art:'sign',text:'TAXI',sign:'info',go:{scene:'g_taxi'}},
    {key:'depart',label:'DEPARTURE (RADIO)',icon:'headset',foot:[350,336,420,342],h:32,art:'sign',text:'DEPART',sign:'info',go:{scene:'g_depart'}},
    {key:'arrive',label:'ARRIVAL (RADIO)',icon:'headset',foot:[490,336,560,342],h:32,art:'sign',text:'ARRIVE',sign:'info',go:{scene:'g_arrive'}},
    {key:'toHangar',label:'BACK TO THE HANGAR',side:'L',y0:300,y1:380,go:{room:'hangar',at:'toRunway'}},
    {key:'toRamp',label:'TO THE PARKING STAND',side:'R',y0:300,y1:380,go:{room:'ramp',at:'toRunway'}}
   ],
   decor:[
    {art:'cone',foot:[150,388,240,394],h:12},
    {art:'cone',foot:[420,388,510,394],h:12},
    {art:'holdshort',foot:[14,262,626,266],h:0},
    {art:'sign',foot:[86,284,134,290],h:24,text:'9-27',sign:'mandatory'}
   ],
   npcs:[
    {id:'ops',name:'AIRPORT OPS',role:'RUNWAY SAFETY OFFICER',x:330,y:286,av:CREW.ops,
     first:['Hi, I’m airport operations. I drive the runway every day, checking for anything that could hurt an airplane.',
            'The big number on the runway tells you which way it points. Runway 27 points about 270 degrees - that’s west!',
            'Each yellow sign out here is a runway game: landing, taxiing, and the radio calls for departure and arrival.'],
     lines:['Bits of junk on a runway are called FOD: foreign object debris. One small bolt can damage an engine.',
            'The yellow lines across the taxiway are HOLD-SHORT lines. Pilots stop there until they’re cleared onto the runway.',
            'Turn around and the same runway gets a new number: 27 one way, 9 the other!',
            'A red sign with white letters means STOP and get permission. That 9-27 sign guards the runway.',
            'At night, runway edge lights are white and taxiway edge lights are blue. Green marks where the runway starts.']}
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
/* ---- classroom + game props ---- */
A.wall.whiteboard=function(c,s,R){ const w=s.w, x=s.x-w/2, y=22, h=R.wall-50;
 G.MG.metal(c,x-3,y-3,w+6,h+6,'#9aa3ad',2); const wg=c.createLinearGradient(x,y,x+w,y+h); wg.addColorStop(0,'#ffffff'); wg.addColorStop(.5,'#eef2f5'); wg.addColorStop(1,'#dde3e8'); c.fillStyle=wg; c.fillRect(x,y,w,h); c.fillStyle='rgba(255,255,255,.5)'; c.beginPath(); c.moveTo(x+w*.1,y); c.lineTo(x+w*.3,y); c.lineTo(x+w*.05,y+h); c.lineTo(x,y+h*.8); c.closePath(); c.fill(); G.MG.metal(c,x-6,y+h+2,w+12,4,'#9aa3ad',1);
 c.strokeStyle='#2f6fb5'; c.lineWidth=1.2; c.beginPath(); c.moveTo(x+12,y+h*.7); c.quadraticCurveTo(x+w*.45,y+h*.18,x+w*.7,y+h*.42); c.stroke();
 c.fillStyle='#3a3f48'; c.fillRect(x+w*.5-12,y+h*.36-1.5,24,3); c.fillRect(x+w*.5-2,y+h*.36-7,3,14);
 c.strokeStyle='#c23a3a'; c.beginPath(); c.moveTo(x+w*.5,y+h*.36); c.lineTo(x+w*.5,y+h*.36-16); c.stroke(); c.strokeStyle='#2f8a4a'; c.beginPath(); c.moveTo(x+w*.5+14,y+h*.36); c.lineTo(x+w*.5+30,y+h*.36); c.stroke();
 G.txt('GROUND SCHOOL',x+w/2,y+h-14,6,'#1f3a6a','center',w-8,800); };
A.wall.patchwall=function(c,s,R){ const w=s.w, x=s.x-w/2, y=24, h=R.wall-54, H=G.HFQ, done=((G.save.mod.gs||{}).done)||{};
 c.fillStyle='#6b4a2a'; c.fillRect(x-3,y-3,w+6,h+6); c.fillStyle='#2a2730'; c.fillRect(x,y,w,h);
 // ten slots: the patches earned so far (the latest ten), padded with the next ones to win
 const got=H.units.filter(u=>done[u.id]).slice(-10), nxt=H.units.filter(u=>!done[u.id]).slice(0,10-got.length);
 got.concat(nxt).forEach((u,i)=>{ const cx=x+9+(i%5)*(w-18)/4, cy=y+10+Math.floor(i/5)*((h-20)/2); if(H.drawPatch) H.drawPatch(c,cx,cy,6.5,u,!!done[u.id]); }); };
A.wall.dartboard=function(c,s,R){ const cx=s.x, cy=R.wall/2-4, r=Math.min(s.w/2,R.wall/2-26);
 c.save(); c.shadowColor='rgba(0,0,0,.45)'; c.shadowBlur=6; c.shadowOffsetY=3; c.beginPath(); c.arc(cx,cy,r+3,0,7); c.fillStyle='#2a1c12'; c.fill(); c.restore();
 c.beginPath(); c.arc(cx,cy,r,0,7); c.fillStyle='#efe8d6'; c.fill();
 for(const [rr,col] of [[r*.78,'#c8102e'],[r*.56,'#1f3a6a'],[r*.3,'#c8102e']]){ c.beginPath(); c.arc(cx,cy,rr,0,7); c.strokeStyle=col; c.lineWidth=Math.max(1,r*.07); c.stroke(); }
 c.strokeStyle='#3a3f48'; c.lineWidth=.8; for(let d=0;d<360;d+=30){ const a=(d-90)*Math.PI/180; c.beginPath(); c.moveTo(cx+Math.cos(a)*r*.86,cy+Math.sin(a)*r*.86); c.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r); c.stroke(); }
 c.fillStyle='#c8102e'; c.beginPath(); c.moveTo(cx,cy-r*.9); c.lineTo(cx-r*.1,cy); c.lineTo(cx+r*.1,cy); c.closePath(); c.fill(); c.fillStyle='#111'; c.beginPath(); c.arc(cx,cy,r*.08,0,7); c.fill();
 G.txt('N',cx,cy-r-9,5,'#c8102e','center',undefined,800); };
A.wall.bookshelf=function(c,s,R){ const w=s.w, x=s.x-w/2, y=16, h=R.wall-40, MG=G.MG;
 MG.wood(c,x-3,y-3,w+6,h+6,'#5a3a22',2,true); c.fillStyle='#2a1c12'; c.fillRect(x,y,w,h);
 const rows=3, rh=h/rows, cols=['#c8102e','#1f3a6a','#2f8a4a','#ffc21a','#e07a1a','#6a3fa0','#e9edf2','#7a2a2a'];
 for(let r=0;r<rows;r++){ let bx=x+3; let i=r*3; while(bx<x+w-5){ const bw=4+((i*7)%4), bh=rh-6-((i*5)%5); const g=c.createLinearGradient(bx,0,bx+bw,0); const col=cols[i%cols.length]; g.addColorStop(0,G.shade(col,1.25)); g.addColorStop(1,G.shade(col,.7)); c.fillStyle=g; c.fillRect(bx,y+(r+1)*rh-3-bh,bw,bh); c.fillStyle='rgba(255,255,255,.35)'; c.fillRect(bx+1,y+(r+1)*rh-3-bh+3,bw-2,.8); bx+=bw+1.2; i++; }
  MG.wood(c,x-2,y+(r+1)*rh-3,w+4,3,'#7a5634',1); }
 };
A.wall.hoop=function(c,s,R){ const cx=s.x, w=s.w, y=28, bh=Math.min(30,R.wall*.26);
 c.fillStyle='rgba(0,0,0,.35)'; c.fillRect(cx-w/2+2,y+2,w,bh); c.fillStyle='#f4f4f2'; c.fillRect(cx-w/2,y,w,bh); c.strokeStyle='#c8102e'; c.lineWidth=2; c.strokeRect(cx-w*.22,y+bh*.3,w*.44,bh*.55); c.strokeStyle='#2a2d33'; c.lineWidth=1.2; c.strokeRect(cx-w/2+1,y+1,w-2,bh-2);
 c.fillStyle='#2a2d33'; c.fillRect(cx-2,y+bh*.85,4,6);
 c.strokeStyle='#ff7a2a'; c.lineWidth=2.6; c.beginPath(); c.ellipse(cx,y+bh*.88+4,w*.26,3.6,0,0,7); c.stroke();
 c.strokeStyle='rgba(255,255,255,.7)'; c.lineWidth=.8; for(let i=-3;i<=3;i++){ c.beginPath(); c.moveTo(cx+i*w*.08,y+bh*.88+6); c.lineTo(cx+i*w*.045,y+bh*.88+22); c.stroke(); } for(let k=1;k<4;k++){ c.beginPath(); c.moveTo(cx-w*.24+k*2,y+bh*.88+6+k*5); c.lineTo(cx+w*.24-k*2,y+bh*.88+6+k*5); c.stroke(); } };
/* ---- classroom + game props: real volumes on the 3/4 floor (f = projected footprint, wf = world footprint) ---- */
const V=G.V=G.V||{};   // filled in by mod_world.js (loaded after this file); only used while drawing
const onTop=(c,wf,h,fn)=>V.plane(c,h,q=>fn(q));                       // draw on a prop's top surface in world units
const dot=(c,x,y,h,r,col)=>{ const [X,Y]=V.P(x,y); G.MG.sphere(c,X,Y-h,r,col); };   // a small ball sitting on a surface h high
A.floor.mydesk=function(c,f,h,col,s,wf){ A.floor.desk(c,f,h,'#c9a36a',s,wf); onTop(c,wf,h,q=>{ q.fillStyle='#f4f6f8'; q.fillRect(wf[0]+8,wf[1]+3,16,8); q.fillStyle='#2f6fb5'; q.fillRect(wf[2]-22,wf[1]+3,12,7); }); dot(c,(wf[0]+wf[2])/2,wf[1]+6,h,4,'#ffc21a'); };
A.floor.sim=function(c,f,h,col,s,wf){ V.box(c,wf,h,'#3a3f48',{noEdge:true}); const a=V.P(wf[0],wf[3]), w=f[2]-f[0];   // the cockpit trainer: a console with a glass panel
 c.fillStyle='#1a1e24'; c.fillRect(a[0]+4,a[1]-h+3,w-8,16); for(let i=0;i<3;i++){ const gx=a[0]+12+i*((w-24)/2), gy=a[1]-h+11; c.beginPath(); c.arc(gx,gy,5,0,7); c.fillStyle='#e9edf2'; c.fill(); c.strokeStyle='#1a1e24'; c.lineWidth=1; c.beginPath(); c.moveTo(gx,gy); c.lineTo(gx+3,gy-3); c.stroke(); }
 c.fillStyle='#5a6a7a'; c.fillRect(a[0]+w/2-8,a[1]-h+23,16,4); c.fillRect(a[0]+w/2-2,a[1]-h+21,4,10); };
A.floor.charttable=function(c,f,h,col,s,wf){ A.floor.table(c,f,h,'#6b4a2a',s,wf); onTop(c,wf,h,q=>{ q.fillStyle='#e9e2c6'; q.fillRect(wf[0]+4,wf[1]+2,wf[2]-wf[0]-8,wf[3]-wf[1]-4); const w=wf[2]-wf[0];
 q.strokeStyle='#b0287f'; q.lineWidth=1; q.beginPath(); q.arc(wf[0]+w*.3,wf[1]+6,3,0,7); q.stroke(); q.strokeStyle='#2a5bd7'; q.beginPath(); q.arc(wf[0]+w*.7,wf[1]+8,3,0,7); q.stroke(); q.strokeStyle='#333'; q.beginPath(); q.moveTo(wf[0]+w*.3,wf[1]+6); q.lineTo(wf[0]+w*.7,wf[1]+8); q.stroke(); }); };
A.floor.pool=function(c,f,h,col,s,wf){ const w=wf[2]-wf[0];
 for(const [lx,ly] of [[wf[0]+3,wf[3]-7],[wf[2]-9,wf[3]-7],[wf[2]-9,wf[1]+1]]) V.box(c,[lx,ly,lx+6,ly+6],h*.5,'#2a1c12',{noEdge:true});
 V.box(c,wf,h,'#5a3a22',{h0:h*.45,rim:true});
 onTop(c,wf,h,q=>{ G.MG.felt(q,wf[0]+5,wf[1]+4,w-10,wf[3]-wf[1]-8,'#1f6a44',3); q.fillStyle='#0d1a14'; for(const [x,y] of [[wf[0]+6,wf[1]+5],[wf[0]+w/2,wf[1]+4],[wf[2]-6,wf[1]+5],[wf[0]+6,wf[3]-5],[wf[0]+w/2,wf[3]-4],[wf[2]-6,wf[3]-5]]){ q.beginPath(); q.arc(x,y,2.6,0,7); q.fill(); } });
 const cols=['#ffc21a','#2f6fb5','#c23a3a','#6a3fa0','#e07a1a','#2f8a4a','#7a2a2a','#1a1a1a'], d=wf[3]-wf[1];
 cols.forEach((col,i)=>{ const r=Math.floor((Math.sqrt(8*i+1)-1)/2), k=i-r*(r+1)/2; dot(c,wf[0]+w*.66+r*4.4,wf[1]+d/2+(k-r/2)*4.6,h,2.1,col); }); dot(c,wf[0]+w*.28,wf[1]+d/2,h,2.2,'#f4f4f2'); };
A.floor.arcade=function(c,f,h,col,s,wf){ const w=f[2]-f[0], x=f[0], top=f[3]-h, [a]=[V.P(wf[0],wf[3])];
 if(!G.rm()) V.plane(c,0,q=>{ const gl=q.createRadialGradient((wf[0]+wf[2])/2,wf[3]+6,2,(wf[0]+wf[2])/2,wf[3]+6,w*1.2); gl.addColorStop(0,'rgba(63,220,124,.3)'); gl.addColorStop(1,'rgba(63,220,124,0)'); q.fillStyle=gl; q.fillRect(wf[0]-w,wf[1],w*3,w*1.6); });
 V.box(c,wf,h,'#1f2f66',{noEdge:true}); c.fillStyle='#ffc21a'; c.fillRect(x,top,w,7); G.txt((s&&s.text)||'GAME',x+w/2,top+1.5,4.2,'#141008','center',w-2,800);
 c.fillStyle='#0b0b0c'; c.fillRect(x+4,top+10,w-8,18); c.fillStyle='#3fdc7c'; for(let i=0;i<4;i++) c.fillRect(x+6+i*5,top+22-(i%2)*4,4,4); c.fillStyle='#ff4a3d'; c.fillRect(x+w-12,top+14,4,4);
 c.fillStyle='#2a3a7a'; c.fillRect(x-2,top+30,w+4,6); c.fillStyle='#c23a3a'; c.beginPath(); c.arc(x+8,top+32,2.2,0,7); c.fill(); c.fillStyle='#ffc21a'; c.beginPath(); c.arc(x+w-8,top+32,2.2,0,7); c.fill(); };
A.floor.pingpong=function(c,f,h,col,s,wf){ const mx=(wf[0]+wf[2])/2;
 for(const [lx,ly] of [[wf[0]+6,wf[3]-6],[wf[2]-10,wf[3]-6],[wf[2]-10,wf[1]+2]]) V.box(c,[lx,ly,lx+4,ly+4],h-3,'#2a2d33',{noEdge:true});
 V.box(c,wf,h,'#1f5aa6',{h0:h-3,noEdge:true}); onTop(c,wf,h,q=>{ q.fillStyle='#f4f4f2'; q.fillRect(wf[0],wf[1],wf[2]-wf[0],1.4); q.fillRect(wf[0],wf[3]-1.4,wf[2]-wf[0],1.4); q.fillRect(wf[0],(wf[1]+wf[3])/2-.6,wf[2]-wf[0],1.2); });
 const n0=V.P(mx,wf[1]), n1=V.P(mx,wf[3]); c.fillStyle='rgba(233,237,242,.85)'; V.quad(c,[[n0[0],n0[1]-h-6],[n1[0],n1[1]-h-6],[n1[0],n1[1]-h],[n0[0],n0[1]-h]]); c.fill(); dot(c,wf[0]+(wf[2]-wf[0])*.3,wf[1]+6,h,2,'#ff8a1a'); };
A.floor.cornhole=function(c,f,h,col,s,wf){ const a=V.P(wf[0],wf[3]), b=V.P(wf[2],wf[3]), fa=V.P(wf[0],wf[1]), fb=V.P(wf[2],wf[1]);   // a board that slopes up toward the back
 V.box(c,[wf[0]+2,wf[1],wf[0]+6,wf[1]+4],h-2,'#6a4a2a',{noEdge:true}); V.box(c,[wf[2]-6,wf[1],wf[2]-2,wf[1]+4],h-2,'#6a4a2a',{noEdge:true});
 const g=c.createLinearGradient(0,fa[1]-h,0,a[1]); g.addColorStop(0,'#c9a26a'); g.addColorStop(1,'#8a6a3a'); c.fillStyle=g; V.quad(c,[[fa[0],fa[1]-h],[fb[0],fb[1]-h],[b[0],b[1]],[a[0],a[1]]]); c.fill();
 c.fillStyle='#3a3d42'; V.quad(c,[[(fa[0]+fb[0])/2-3,fa[1]-h],[(fa[0]+fb[0])/2+3,fa[1]-h],[(a[0]+b[0])/2+3,a[1]],[(a[0]+b[0])/2-3,a[1]]]); c.fill();
 c.fillStyle='#0b0b0c'; c.beginPath(); c.ellipse((fa[0]+fb[0])/2,fa[1]-h+6,3.4,2,0,0,7); c.fill(); c.fillStyle='#c23a3a'; c.fillRect(a[0]+4,a[1]-5,5,3); c.fillStyle='#2f6fb5'; c.fillRect(b[0]-10,b[1]-7,5,3); };
A.floor.putting=function(c,f,h,col,s,wf){ const w=wf[2]-wf[0], d=wf[3]-wf[1], hx=wf[2]-14, hy=wf[1]+d/2;   // a putting green laid on the floor, the flag standing up
 V.plane(c,0,q=>{ q.fillStyle='#2f6e2c'; G.rrect(wf[0],wf[1],w,d,6); q.fill(); G.MG.felt(q,wf[0]+3,wf[1]+2,w-6,d-4,'#4fa046',5); q.fillStyle='#0b0b0c'; q.beginPath(); q.ellipse(hx,hy,3,2.4,0,0,7); q.fill(); q.fillStyle='#f4f4f2'; q.beginPath(); q.arc(wf[0]+12,hy,1.8,0,7); q.fill(); });
 const [X,Y]=V.P(hx,hy); c.fillStyle='#e9edf2'; c.fillRect(X-.7,Y-22,1.4,22); c.fillStyle='#ff4a3d'; c.beginPath(); c.moveTo(X+.7,Y-22); c.lineTo(X+9,Y-19); c.lineTo(X+.7,Y-16); c.fill(); };
A.floor.hockey=function(c,f,h,col,s,wf){ const w=wf[2]-wf[0], d=wf[3]-wf[1], my=wf[1]+d/2;
 for(const [lx,ly] of [[wf[0]+8,wf[3]-7],[wf[2]-13,wf[3]-7],[wf[2]-13,wf[1]+2]]) V.box(c,[lx,ly,lx+5,ly+5],h*.6,'#1a1c20',{noEdge:true});
 V.box(c,wf,h,'#3a3f48',{h0:h*.55,noEdge:true}); onTop(c,wf,h,q=>{ const tg=q.createRadialGradient(wf[0]+w/2,my,4,wf[0]+w/2,my,w*.6); tg.addColorStop(0,'#f8fafc'); tg.addColorStop(1,'#cfd6de'); G.rrect(wf[0]+3,wf[1]+2,w-6,d-4,3); q.fillStyle=tg; q.fill();
  q.fillStyle='#c8102e'; q.fillRect(wf[0]+w/2-.7,wf[1]+2,1.4,d-4); q.strokeStyle='#c8102e'; q.lineWidth=1; q.beginPath(); q.arc(wf[0]+w/2,my,5,0,7); q.stroke(); q.fillStyle='#1a1c20'; q.fillRect(wf[0]+3,my-5,2,10); q.fillRect(wf[2]-5,my-5,2,10); });
 dot(c,wf[0]+w*.3,my+2,h,3.4,'#ffc21a'); dot(c,wf[0]+w*.72,my-2,h,3.4,'#2f6fb5'); dot(c,wf[0]+w*.5,my+3,h,1.8,'#1a1c20'); };
A.floor.skee=function(c,f,h,col,s,wf){ const w=wf[2]-wf[0], a=V.P(wf[0],wf[3]), b=V.P(wf[2],wf[3]), fa=V.P(wf[0],wf[1]), fb=V.P(wf[2],wf[1]), base=h*.45;
 V.box(c,wf,base,'#5a3a22',{noEdge:true}); const lg=c.createLinearGradient(0,a[1]-base,0,a[1]); lg.addColorStop(0,'#c9a26a'); lg.addColorStop(1,'#a67c48'); c.fillStyle=lg; c.fillRect(a[0]+2,a[1]-base+2,b[0]-a[0]-4,base-4);
 const bg=c.createLinearGradient(0,fa[1]-h,0,a[1]-base); bg.addColorStop(0,'#3f6a34'); bg.addColorStop(1,'#2f5a2a'); c.fillStyle=bg; V.quad(c,[[fa[0],fa[1]-h],[fb[0],fb[1]-h],[b[0],b[1]-base],[a[0],a[1]-base]]); c.fill();   // the sloped board
 const cx=(fa[0]+fb[0]+a[0]+b[0])/4, cy=(fa[1]-h+a[1]-base)/2-4; [.4,.28,.17,.08].forEach((k,i)=>{ c.beginPath(); c.ellipse(cx,cy,w*k,w*k*.5,0,0,7); c.fillStyle=['#55585e','#7c8087','#ffc21a','#f2f2f2'][i]; c.fill(); });
 c.fillStyle='rgba(255,255,255,.75)'; c.fillRect(cx-w*.3,cy-.5,w*.6,1); c.fillStyle='#ffc21a'; c.fillRect(fa[0]-2,fa[1]-h-6,fb[0]-fa[0]+4,6); G.txt('SKEE-BALL',(fa[0]+fb[0])/2,fa[1]-h-5.2,3.6,'#141008','center',w,800);
 for(const k of [.3,.5,.7]) dot(c,wf[0]+w*k,wf[3]-3,base,2.6,'#c9a26a'); };
A.floor.cardtable=function(c,f,h,col,s,wf){ for(const [lx,ly] of [[wf[0]+4,wf[3]-6],[wf[2]-8,wf[3]-6],[wf[2]-8,wf[1]+2]]) V.box(c,[lx,ly,lx+4,ly+4],h-4,'#2a2d33',{noEdge:true});
 V.box(c,wf,h,'#6b4a2a',{h0:h-4,rim:true}); onTop(c,wf,h,q=>{ G.MG.felt(q,wf[0]+3,wf[1]+3,wf[2]-wf[0]-6,wf[3]-wf[1]-6,'#1f6a44',3);
  for(const [kx,ky,col2] of [[.18,.3,'#f4f4f2'],[.36,.5,'#f4f4f2'],[.56,.3,'#2f6fb5'],[.74,.5,'#2f6fb5']]){ q.save(); q.translate(wf[0]+(wf[2]-wf[0])*kx,wf[1]+(wf[3]-wf[1])*ky); q.rotate((kx-.5)*.3); q.fillStyle='rgba(0,0,0,.3)'; q.fillRect(-3,-3,8,10); q.fillStyle=col2; q.fillRect(-4,-4,8,10); if(col2!=='#f4f4f2'){ q.fillStyle='#ffc21a'; q.fillRect(-2,-2,4,6); } q.restore(); } }); };
A.floor.lane=function(c,f,h,col,s,wf){ const w=wf[2]-wf[0], d=wf[3]-wf[1], my=wf[1]+d/2;   // a bowling lane painted on the floor; the cones stand at its far end
 V.plane(c,0,q=>{ const g=q.createLinearGradient(wf[0],0,wf[2],0); g.addColorStop(0,'#6a6e76'); g.addColorStop(1,'#55585e'); q.fillStyle=g; q.fillRect(wf[0],wf[1],w,d); q.fillStyle='#ffc21a'; q.fillRect(wf[0],wf[1],w,1.2); q.fillRect(wf[0],wf[3]-1.2,w,1.2); q.fillStyle='rgba(255,255,255,.4)'; for(let x=wf[0]+16;x<wf[2]-30;x+=12) q.fillRect(x,my-.5,6,1); });
 for(const [dx,dy] of [[0,0],[5,-3],[5,3],[10,-6],[10,0],[10,6]]){ const [X,Y]=V.P(wf[2]-18+dx,my+dy); c.fillStyle='#ff7a2a'; c.beginPath(); c.moveTo(X-2.2,Y); c.lineTo(X,Y-6.5); c.lineTo(X+2.2,Y); c.closePath(); c.fill(); c.fillStyle='#f4f4f2'; c.fillRect(X-1,Y-3.6,2,1); }
 dot(c,wf[0]+10,my,0,3,'#1f3a6a'); };
A.floor.holdshort=function(c,f,h,col,s,wf){ V.plane(c,0,q=>{ const w=wf[2]-wf[0]; q.fillStyle='#ffc21a';   // runway holding position marking: solid lines on the HOLDING side (toward the apron), dashed toward the runway
 for(let x=wf[0];x<wf[2];x+=10){ q.fillRect(x,wf[1]-6,6,1.6); q.fillRect(x,wf[1]-3,6,1.6); }
 q.fillRect(wf[0],wf[1]+1,w,1.6); q.fillRect(wf[0],wf[1]+4,w,1.6); }); };
/* ---- Game Room + lounge props ---- */
A.wall.neon=function(c,s,R){ const w=s.w, x=s.x-w/2, y=22, t=G.rm()?0:G.time, on=(t%7)>.3;   // a neon sign with a flicker
 c.save(); if(on){ c.shadowColor='#ff4fa3'; c.shadowBlur=14; } c.strokeStyle=on?'#ff7ac0':'#6a3050'; c.lineWidth=2.4; c.lineCap='round'; G.rrect(x+6,y,w-12,38,19); c.stroke(); c.restore();
 c.save(); if(on){ c.shadowColor='#4fd8ff'; c.shadowBlur=12; } G.txt('GAME ROOM',s.x,y+9,13,on?'#9fefff':'#2a4a58','center',w-20,800); c.restore();
 c.fillStyle='#3a3f48'; for(const px of [x+16,s.x,x+w-16]) c.fillRect(px-1,y+38,2,6); };
A.wall.scores=function(c,s,R){ const w=s.w, x=s.x-w/2, y=18, h=R.wall-46, H2=G.HFQ, best=(H2.GAMES||[]).map(g=>[g,H2.gameRec?H2.gameRec(g.id):null]).filter(q=>q[1]&&q[1].best!=null).sort((a,b)=>b[1].at-a[1].at).slice(0,5);
 c.fillStyle='#0b0b0c'; c.fillRect(x-3,y-3,w+6,h+6); c.fillStyle='#141a2a'; c.fillRect(x,y,w,h); c.fillStyle='#ffc21a'; c.fillRect(x,y,w,9); G.txt('HIGH SCORES',s.x,y+1.5,5,'#141008','center',w-4,800);
 if(!best.length) G.txt('PLAY A GAME!',s.x,y+h/2-2,4.6,'#9aa3ad','center',w-6,800); best.forEach(([g,r],i)=>{ G.txt(g.name,x+3,y+13+i*((h-14)/5),3.6,'#e9edf2','left',w*.62,700); G.txt(H2.fmtScore(g.id,r.best),x+w-3,y+13+i*((h-14)/5),3.6,'#ffd24d','right',w*.36,800); }); };
A.floor.jukebox=function(c,f,h,col,s,wf){ V.box(c,wf,h,'#7a2a2a',{noEdge:true}); const a=V.P(wf[0],wf[3]), w=f[2]-f[0], top=a[1]-h, t=G.rm()?0:G.time;
 const g=c.createLinearGradient(0,top,0,a[1]); g.addColorStop(0,'#b03a3a'); g.addColorStop(1,'#5a1a1a'); c.fillStyle=g; G.rrect(a[0],top,w,h,w*.45); c.fill();
 c.fillStyle='#ffd24d'; G.rrect(a[0]+4,top+4,w-8,h*.4,w*.35); c.fill(); c.fillStyle='#1a1e24'; G.rrect(a[0]+7,top+7,w-14,h*.3,w*.25); c.fill();
 for(let i=0;i<4;i++){ c.fillStyle=['#ff4fa3','#4fd8ff','#3fdc7c','#ffc21a'][(i+Math.floor(t*2))%4]; c.fillRect(a[0]+5+i*((w-10)/4),top+h*.52,(w-10)/4-2,3); }
 c.fillStyle='#2a2d33'; c.fillRect(a[0]+6,top+h*.66,w-12,h*.3); c.fillStyle='rgba(255,255,255,.2)'; for(let i=0;i<6;i++) c.fillRect(a[0]+8,top+h*.68+i*4,w-16,1); };
A.floor.rug=function(c,f,h,col,s,wf){ V.plane(c,0,q=>{ const w=wf[2]-wf[0], d=wf[3]-wf[1]; G.rrect(wf[0],wf[1],w,d,4); q.fillStyle='#7a2a2a'; q.fill(); G.rrect(wf[0]+5,wf[1]+5,w-10,d-10,3); q.fillStyle='#a63a3a'; q.fill(); q.fillStyle='#e8c070'; G.rrect(wf[0]+10,wf[1]+10,w-20,d-20,2); q.fill(); q.fillStyle='#a63a3a'; G.rrect(wf[0]+14,wf[1]+14,w-28,d-28,2); q.fill();
 q.fillStyle='#e8c070'; q.beginPath(); q.moveTo(wf[0]+w/2,wf[1]+d/2-9); q.lineTo(wf[0]+w/2-3,wf[1]+d/2+6); q.lineTo(wf[0]+w/2,wf[1]+d/2+3); q.lineTo(wf[0]+w/2+3,wf[1]+d/2+6); q.closePath(); q.fill(); }); };
A.floor.stool=function(c,f,h,col,s,wf){ const cx=(wf[0]+wf[2])/2, cy=(wf[1]+wf[3])/2; V.cyl(c,cx,cy,5,h,'#c8102e'); };
A.floor.workbench=function(c,f,h,col,s,wf){ V.box(c,wf,h,'#6b4a2a',{h0:h-5,rim:true}); for(const [lx,ly] of [[wf[0]+3,wf[3]-6],[wf[2]-7,wf[3]-6],[wf[2]-7,wf[1]+2]]) V.box(c,[lx,ly,lx+4,ly+4],h-5,'#3a3f48',{noEdge:true});
 onTop(c,wf,h,q=>{ q.fillStyle='#2a2d33'; q.fillRect(wf[0]+8,wf[1]+4,22,6); q.fillStyle='#9aa3ad'; q.fillRect(wf[0]+34,wf[1]+5,16,2); q.fillStyle='#c23a3a'; q.fillRect(wf[2]-30,wf[1]+6,14,6); q.fillStyle='#ffc21a'; q.beginPath(); q.arc(wf[2]-12,wf[1]+9,3,0,7); q.fill(); }); };
A.floor.drum=function(c,f,h,col,s,wf){ const cx=(wf[0]+wf[2])/2, cy=(wf[1]+wf[3])/2, r=(wf[2]-wf[0])/2; V.cyl(c,cx,cy,r,h,'#2f6fb5'); const [X,Y]=V.P(cx,cy); c.fillStyle='rgba(255,255,255,.18)'; c.fillRect(X-r,Y-h*.3,r*2,2); c.fillRect(X-r,Y-h*.7,r*2,2); G.txt('OIL',X,Y-h*.56,3.6,'#e9edf2','center',r*2,800); };
A.floor.puzzledesk=function(c,f,h,col,s,wf){ A.floor.desk(c,f,h,'#7a8a9a',s,wf); onTop(c,wf,h,q=>{ q.fillStyle='#f4f6f8'; q.fillRect(wf[0]+8,wf[1]+2,30,9); q.fillStyle='#2a2d33'; for(let i=0;i<5;i++) for(let j=0;j<2;j++) q.fillRect(wf[0]+10+i*5.6,wf[1]+3.5+j*3.6,1.4,1.4); q.fillStyle='#ffc21a'; q.fillRect(wf[2]-16,wf[1]+3,2,7); }); };
A.floor.launch=function(c,f,h){ const w=f[2]-f[0]; c.fillStyle='#7a6a5a'; c.fillRect(f[0]+w/2-2,f[1]-h+6,4,h-4); c.fillStyle='#9a8a7a'; c.fillRect(f[0],f[1]-h,w,6);
 c.fillStyle='#f4f4f2'; c.beginPath(); c.moveTo(f[0]+w/2+10,f[1]-h-4); c.lineTo(f[0]+w/2-10,f[1]-h-8); c.lineTo(f[0]+w/2-6,f[1]-h-3); c.lineTo(f[0]+w/2-10,f[1]-h+1); c.closePath(); c.fill(); };
A.floor.myplane=function(c,f){   // the cadet's own aircraft, parked in the hangar
 const w=(f[2]-f[0])+70, h=w/2, x=f[0]-35, y=f[3]+3-h*104/120, ac=G.HFQ.myAC?G.HFQ.myAC():{id:'c172'};
 if(G.HFQ.drawAC) G.HFQ.drawAC(c,ac.id,x,y,w,h,ac.paint,{ground:true,reflect:true,t:G.rm()?0:G.time});
};
/* the aircraft is painted 35 units past each end of its footprint and taller than the station: the whole drawing answers a tap */
HFQ.acPropBounds=(p,pad)=>{ const w=(p[2]-p[0])+2*pad, h=w/2; return [p[0]-pad+w*.06,p[3]+3-h*104/120+h*.1,p[2]+pad-w*.06,p[3]+4]; };
A.floor.myplane.bounds=p=>HFQ.acPropBounds(p,35);
A.floor.rail=function(c,f,h){   // the platform railing
 c.fillStyle='#d8dde4'; for(let x=f[0]+4;x<f[2];x+=22) c.fillRect(x,f[1]-h,2.4,h+4);
 c.fillRect(f[0],f[1]-h,f[2]-f[0],2.6); c.fillRect(f[0],f[1]-h/2,f[2]-f[0],1.6);
};
})();
