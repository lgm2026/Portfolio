/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* HYPETEEN FLIGHT ACADEMY - LESSONS, PART 2: airports, talking on the radio, weather, navigation + charts.
   Facts follow the FAA AIM, AC 150/5340-1 (markings), AC 150/5340-18 (signs), 14 CFR 91 and the PHAK, written for cadets 10-14. */
(function(){
const H=G.HFQ;
const SIGNS3={f:'sign',s:[{k:'location',t:'B'},{k:'mandatory',t:'9-27'},{k:'direction',t:'A',arrow:'r'}]};

/* ============================ 5. AIRPORTS ============================ */
H.addLessons('airports',[
 {id:'apt-numbers',t:'Runway numbers',
  cards:[
   {t:'Numbers = direction',b:'A runway’s number is its magnetic compass direction, rounded to the nearest 10 degrees, with the last zero dropped. Runway 27 points about 270°: west.',fig:{f:'runway',num:'27',labels:true}},
   {t:'Two ends, two numbers',b:'Each end gets its own number, 180° apart. The other end of Runway 27 is Runway 9. Side-by-side runways add L, C or R for left, center and right, like 27L and 27R.'}],
  tip:'Add a zero to get the heading: 27 means about 270°.',
  qs:[
   {k:'mc',q:'Which way does Runway 18 point?',fig:{f:'runway',num:'18'},a:['About 180°: south','About 080°: east','About 360°: north','About 270°: west'],why:'Add a zero: 18 becomes 180°, which is south.'},
   {k:'mc',q:'What number is on the opposite end of Runway 27?',a:['9','18','36','27'],why:'The other end points the opposite way: 270° minus 180° is 090°, so Runway 9.'},
   {k:'mc',q:'What number is on the opposite end of Runway 36?',a:['18','9','27','3'],why:'360° minus 180° is 180°: Runway 18.'},
   {k:'tf',q:'Two side-by-side runways can be labeled with L and R.',t:true,why:'Parallel runways share a number and add L (left), C (center) or R (right).'},
   {k:'fill',q:'Runway 9 points toward the ___.',a:['east','west','north'],why:'9 means about 090°, which is east.'},
   {k:'mc',q:'At a big airport you hear “Runway 27L.” What does the L mean?',a:['The left one of two parallel runways','A long runway','Landing only','Lights are on'],why:'L is left, R is right, C is center when runways run side by side.'}]},
 {id:'apt-signs',t:'Markings + signs',
  cards:[
   {t:'Paint colors',b:'Runway markings are WHITE. Taxiway markings are YELLOW. If you see white paint under you, you are on a runway.',fig:{f:'runway',num:'9'}},
   {t:'Sign colors',b:'RED with white letters is a MANDATORY sign: stop and get permission. BLACK with yellow letters is a LOCATION sign: where you are. YELLOW with black letters is a DIRECTION sign: the way to go.',fig:{f:'sign',s:[{k:'mandatory',t:'9-27'},{k:'location',t:'B'},{k:'direction',t:'A',arrow:'r'}],labels:true}}],
  tip:'Red: stop and ask. Black: where you are. Yellow: which way to go.',
  qs:[
   {k:'tap',q:'Tap the sign that means STOP: a runway is ahead.',fig:SIGNS3,z:'mandatory',zl:'The red sign with white letters',why:'Red with white letters is a mandatory instruction sign. Here it guards Runway 9-27.'},
   {k:'mc',q:'What does this sign tell a pilot?',fig:{f:'sign',s:[{k:'location',t:'B'}]},a:['You are on Taxiway B','Turn toward Taxiway B','Stop right now','Runway B is closed'],why:'Black with a yellow letter and border is a location sign: you are on Taxiway B (Bravo).'},
   {k:'mc',q:'What does this sign mean?',fig:{f:'sign',s:[{k:'direction',t:'A',arrow:'r'}]},a:['Taxiway A is to the right','You are on Taxiway A','Stop at Taxiway A','Taxiway A is closed'],why:'Yellow with black letters and an arrow is a direction sign: it points the way to Taxiway A (Alfa).'},
   {k:'tf',q:'Runway markings are painted white.',t:true,why:'White for runways, yellow for taxiways.'},
   {k:'match',q:'Match each sign to what it means.',p:[['Red, white letters','Mandatory: stop'],['Black, yellow letters','Location: you are here'],['Yellow, black letters','Direction: go this way']],why:'The FAA uses the same colors at airports all over the country.'},
   {k:'fill',q:'Taxiway markings are painted ___.',a:['yellow','white','red'],why:'Yellow lines guide airplanes along taxiways.'}]},
 {id:'apt-hold',t:'Taxiways + hold-short lines',
  cards:[
   {t:'Taxiways',b:'Airplanes roll along TAXIWAYS to get to and from the runway. Taxiways have letter names like A (ALFA) and B (BRAVO), and a yellow centerline to follow.'},
   {t:'Hold short!',b:'Where a taxiway meets a runway, four yellow lines cross it: two SOLID and two DASHED. Stop on the SOLID side until you are cleared onto the runway. When leaving a runway, you cross from the dashed side.',fig:{f:'holdshort',labels:true}},
   {t:'Lights at night',b:'Runway edge lights are WHITE. Taxiway edge lights are BLUE. GREEN lights mark where the runway begins, and RED lights mark its far end. An airport’s rotating beacon flashes white and green.',fig:{f:'lights',labels:true}}],
  tip:'Solid side: stop and wait. Dashed side: cross and keep going.',
  qs:[
   {k:'tap',q:'Tap the side where an airplane must STOP and wait.',fig:'holdshort',z:'hold',zl:'The taxiway side, by the solid lines',why:'Airplanes hold on the side with the solid lines until they are cleared onto the runway.'},
   {k:'tf',q:'At a towered airport, a pilot needs a clearance to cross the hold-short line onto the runway.',t:true,why:'The tower must clear you to enter or cross a runway. Never guess.'},
   {k:'mc',q:'How many lines make up a runway hold-short marking?',a:['Four: two solid and two dashed','One white line','Three red lines','Two blue dots'],why:'Two solid yellow lines and two dashed yellow lines.'},
   {k:'tap',q:'Tap a TAXIWAY edge light.',fig:'lights',z:'tedge',zl:'The blue lights beside the taxiway',why:'Taxiway edge lights are blue.'},
   {k:'mc',q:'What color are runway edge lights?',a:['White','Blue','Green','Red'],why:'Runway edges glow white. (On some runways they turn yellow near the end.)'},
   {k:'fill',q:'The red sign beside a hold-short line is a ___ sign.',a:['mandatory','location','direction'],why:'Red mandatory signs mark places you may not go without permission.'},
   {k:'tf',q:'A taxiway’s centerline is painted white.',t:false,why:'Taxiway markings are yellow. White is for runways.'}]},
 {id:'apt-pattern',t:'The traffic pattern',
  cards:[
   {t:'A rectangle in the sky',b:'Airplanes fly a rectangle around the airport, the TRAFFIC PATTERN, so everyone lines up safely. The legs are UPWIND, CROSSWIND, DOWNWIND, BASE and FINAL.',fig:'pattern'},
   {t:'Left turns',b:'Unless the airport says otherwise, pattern turns are to the LEFT. Small airplanes usually fly the pattern about 1,000 feet above the ground, and pilots land INTO the wind.'}],
  tip:'Upwind, crosswind, downwind, base, final.',
  qs:[
   {k:'order',q:'Put the pattern legs in order, starting from takeoff.',s:['Upwind','Crosswind','Downwind','Base','Final'],why:'Take off on upwind, turn crosswind, fly downwind, turn base, then final to land.'},
   {k:'tap',q:'Tap the DOWNWIND leg.',fig:{f:'pattern',hide:['upwind','crosswind','downwind','base','final']},z:'downwind',zl:'The long leg opposite the runway',why:'Downwind runs parallel to the runway, flying the opposite way you will land.'},
   {k:'tap',q:'Tap FINAL approach.',fig:{f:'pattern',hide:['upwind','crosswind','downwind','base','final']},z:'final',zl:'The leg lined up with the runway, just before landing',why:'Final is the last leg, lined up with the runway.'},
   {k:'tf',q:'Standard traffic pattern turns are to the left.',t:true,why:'Left turns are standard unless the airport publishes right traffic.'},
   {k:'mc',q:'About how high is a typical traffic pattern for small airplanes?',a:['1,000 feet above the ground','100 feet','10,000 feet','50 feet'],why:'The FAA recommends about 1,000 feet above the ground for propeller airplanes.'},
   {k:'mc',q:'Airplanes like to take off and land…',a:['Into the wind','With the wind behind them','Across the wind','Only when there is no wind'],why:'A headwind means a slower ground speed, so takeoffs and landings use less runway.'}]}
]);

/* ============================ 6. TALKING ON THE RADIO ============================ */
H.addLessons('radio',[
 {id:'rad-phonetic',t:'The phonetic alphabet',
  cards:[
   {t:'Words for letters',b:'On a crackly radio, B, D and E can sound alike. So pilots use words: ALFA, BRAVO, CHARLIE, DELTA, ECHO… all the way to ZULU. Find the whole list on the Tower Radio page.'},
   {t:'Numbers too',b:'Numbers are said one digit at a time. A few are said differently: 9 is NINER, 3 is TREE and 5 is FIFE.'}],
  tip:'Alfa, Bravo, Charlie: every letter gets a word.',
  qs:[
   {k:'mc',q:'What is the phonetic word for the letter D?',a:['Delta','David','Dog','Dart'],why:'D is Delta.'},
   {k:'mc',q:'Which letter is TANGO?',a:['T','G','O','N'],why:'Tango is T.'},
   {k:'match',q:'Match each letter to its word.',p:[['A','Alfa'],['M','Mike'],['S','Sierra'],['Z','Zulu']],why:'Alfa, Mike, Sierra, Zulu.'},
   {k:'mc',q:'How do pilots say the number 9?',a:['Niner','Nein','Nana','Nine-oh'],why:'Niner keeps 9 from sounding like the German word for no.'},
   {k:'order',q:'Spell the word FLY in phonetic code.',s:['Foxtrot','Lima','Yankee'],why:'F is Foxtrot, L is Lima, Y is Yankee.'},
   {k:'mc',q:'Myrtle Beach’s airport code is KMYR. How is it said?',a:['Kilo Mike Yankee Romeo','King Mary Yellow Robert','Kite Moon Yacht River','Kilo Mike Yankee Radio'],why:'K Kilo, M Mike, Y Yankee, R Romeo.'},
   {k:'fill',q:'The phonetic word for the letter K is ___.',a:['Kilo','Kite','King'],why:'K is Kilo.'}]},
 {id:'rad-callsign',t:'Call signs',
  cards:[
   {t:'Airplane names',b:'Every U.S. aircraft has a registration number that starts with N, painted on its side. Pilots use it as their CALL SIGN, like “Cessna One Two Three Alfa Bravo” for N123AB.'},
   {t:'Shortcuts + airlines',b:'After the controller shortens it first, the pilot may use just the last three: “Cessna Three Alfa Bravo.” Airlines use a company word plus the flight number, like “United Four Twelve.”'}],
  tip:'N means U.S. The tail number is your name on the radio.',
  qs:[
   {k:'mc',q:'U.S. aircraft registration numbers start with which letter?',a:['N','U','A','X'],why:'Every U.S. registration starts with N.'},
   {k:'mc',q:'How would a pilot say N456TX?',a:['November Four Five Six Tango X-ray','Number four hundred fifty-six TX','Nancy Four Five Six Tex','N four fifty-six TX'],why:'Each letter and number is said separately, using phonetic words.'},
   {k:'tf',q:'Pilots use their aircraft’s registration number as a call sign.',t:true,why:'The registration is the airplane’s name on the radio.'},
   {k:'mc',q:'When may a pilot shorten the call sign?',a:['After the controller shortens it first','Anytime they want','Never','Only at night'],why:'The controller shortens it first, then the pilot may use the short version.'},
   {k:'fill',q:'Airline call signs use a company word plus the ___ number.',a:['flight','phone','seat'],why:'Like “United Four Twelve”: company plus flight number.'},
   {k:'tf',q:'Here at the academy, your call sign should be your real name.',t:false,why:'Always make one up. Real pilots use the airplane’s number, not their own name.'}]},
 {id:'rad-tower',t:'Talking to the tower',
  cards:[
   {t:'Four parts',b:'A good first call has four parts: WHO you are calling, WHO you are, WHERE you are and WHAT you want.'},
   {t:'An example',b:'“Myrtle Beach Tower, Cessna One Two Three Alfa Bravo, ten miles south, landing with information Kilo.” Information Kilo means the pilot heard the latest recorded airport weather, called ATIS (AY-tis).'},
   {t:'Listen first',b:'Before talking, listen so you do not cut someone off. Keep it short. When the tower gives an instruction, READ IT BACK so they know you heard it right.'}],
  tip:'Who, who, where, what.',
  qs:[
   {k:'order',q:'Put the parts of a first radio call in order.',s:['Who you are calling','Who you are','Where you are','What you want'],why:'Who, who, where, what.'},
   {k:'mc',q:'What is ATIS?',a:['A recorded broadcast of airport weather and info','A type of airplane','A runway light','The tower’s lunch break'],why:'ATIS repeats the airport’s weather and runway information so pilots can listen before calling.'},
   {k:'tf',q:'Pilots should listen before they talk, so they don’t block someone else.',t:true,why:'Only one person can talk on a frequency at a time.'},
   {k:'mc',q:'Why do pilots read back the tower’s instructions?',a:['So the controller can catch mistakes','To practice reading','To fill the silence','Because it sounds cool'],why:'A readback lets the controller hear any mix-up before it becomes a problem.'},
   {k:'mc',q:'In “Myrtle Beach Tower, Cessna 123AB, ten miles south, landing,” which part is WHERE?',a:['Ten miles south','Myrtle Beach Tower','Cessna 123AB','Landing'],why:'Ten miles south tells the controller where you are.'},
   {k:'fill',q:'“With information Kilo” means the pilot heard the latest ___ broadcast.',a:['ATIS','music','news'],why:'Each new ATIS recording gets the next phonetic letter.'}]},
 {id:'rad-words',t:'Radio words',
  cards:[
   {t:'Say it short',b:'Radio words keep messages short and clear. ROGER: I got your message. WILCO: I will comply. AFFIRMATIVE: yes. NEGATIVE: no.'},
   {t:'When you’re not sure',b:'SAY AGAIN: please repeat. UNABLE: I can’t do that. STANDBY: wait a moment. Asking is never wrong. Guessing is what causes mistakes.'}],
  tip:'Roger = got it. Wilco = will do.',
  qs:[
   {k:'match',q:'Match each radio word to its meaning.',p:[['Roger','I got your message'],['Wilco','I will comply'],['Affirmative','Yes'],['Negative','No']],why:'Short words, clear meanings.'},
   {k:'mc',q:'You didn’t hear the tower’s message. What do you say?',a:['Say again','Roger','Wilco','Affirmative'],why:'“Say again” asks them to repeat it.'},
   {k:'tf',q:'ROGER means yes.',t:false,why:'Roger only means “I received your message.” For yes, say AFFIRMATIVE.'},
   {k:'mc',q:'The tower asks you to do something you can’t do safely. You say…',a:['Unable','Wilco','Roger','Affirmative'],why:'“Unable” tells the controller you can’t do it, so they can give you another plan.'},
   {k:'fill',q:'To say “I will comply,” pilots say ___.',a:['Wilco','Roger','Over'],why:'Wilco is short for “will comply.”'},
   {k:'mc',q:'STANDBY means…',a:['Wait a moment','Yes','Stand up','Turn around'],why:'Standby: wait, I’ll get back to you.'}]}
]);

/* ============================ 7. WEATHER ============================ */
H.addLessons('weather',[
 {id:'wx-wind',t:'Wind + the windsock',
  cards:[
   {t:'Reading the sock',b:'A WINDSOCK shows wind direction and strength. The wind blows INTO the big open end, so the sock points AWAY from where the wind comes from.',fig:{f:'sock',kts:10,arrows:true}},
   {t:'How strong?',b:'The straighter it flies, the stronger the wind. A standard windsock stands straight out at about 15 knots. Wind is named for where it comes FROM: a north wind blows from the north.',fig:{f:'sock',kts:15,labels:true}}],
  tip:'The sock points downwind.',
  qs:[
   {k:'mc',q:'About how strong is this wind?',fig:{f:'sock',kts:15},a:['About 15 knots or more','Calm','About 2 knots','About 100 knots'],why:'A windsock standing straight out means about 15 knots or more.'},
   {k:'mc',q:'What does a limp, hanging windsock mean?',fig:{f:'sock',kts:0},a:['The wind is calm or very light','A storm is coming','The sock is broken','A strong wind is blowing'],why:'No wind, no push: the sock just hangs.'},
   {k:'mc',q:'The sock streams to the RIGHT. Where is the wind coming from?',fig:{f:'sock',kts:10},a:['From the left','From the right','From straight above','From the ground'],why:'The sock points away from the wind, so the wind is coming from the left.'},
   {k:'tf',q:'A “north wind” blows FROM the north.',t:true,why:'Winds are named for the direction they come from.'},
   {k:'fill',q:'Airplanes take off and land ___ the wind.',a:['into','behind','without'],why:'Facing the wind gives extra airflow over the wings at a slower ground speed.'},
   {k:'tf',q:'A windsock points toward where the wind is coming from.',t:false,why:'It points away from the wind, like a flag streaming downwind.'}]},
 {id:'wx-clouds',t:'Clouds and what they mean',
  cards:[
   {t:'Cloud families',b:'CUMULUS clouds are puffy heaps. STRATUS clouds are flat gray layers. CIRRUS clouds are thin, wispy streaks very high up.',fig:{f:'clouds',labels:true}},
   {t:'The storm cloud',b:'A CUMULONIMBUS is a giant thunderstorm cloud, often with a flat “anvil” top. It can hold lightning, hail and violent bumps. Pilots stay far away, often 20 miles or more.',fig:{f:'clouds',only:'cb'}}],
  tip:'Cumulus = puffy. Stratus = layer. Cirrus = wispy. Nimbus = rain.',
  qs:[
   {k:'tap',q:'Tap the THUNDERSTORM cloud (cumulonimbus).',fig:'clouds',z:'cb',zl:'The tall cloud with the anvil top',why:'The tall tower with a flat anvil top and lightning is a cumulonimbus.'},
   {k:'match',q:'Match each cloud to its look.',p:[['Cumulus','Puffy heaps'],['Stratus','Flat layers'],['Cirrus','High wisps'],['Cumulonimbus','Thunderstorm']],why:'Cloud names describe their shapes.'},
   {k:'mc',q:'What kind of cloud is this?',fig:{f:'clouds',only:'cirrus'},a:['Cirrus','Stratus','Cumulus','Cumulonimbus'],why:'Thin, wispy streaks high up are cirrus.'},
   {k:'tf',q:'Small airplanes should fly straight through thunderstorms to save time.',t:false,why:'Never. Thunderstorms can hold hail, lightning and turbulence strong enough to break an airplane. Go around them, far away.'},
   {k:'mc',q:'Which cloud-name part means rain?',a:['Nimbus','Cirrus','Cumulus','Stratus'],why:'Nimbus means rain cloud. Cumulonimbus is a rain-making cumulus.'},
   {k:'fill',q:'Flat, gray, layered clouds are called ___ clouds.',a:['stratus','cirrus','cumulus'],why:'Stratus means layer.'}]},
 {id:'wx-fronts',t:'Fronts',
  cards:[
   {t:'When air masses meet',b:'A FRONT is the boundary where a cold air mass meets a warm one. On weather maps, a COLD FRONT is a blue line with triangles. A WARM FRONT is a red line with half-circles.',fig:{f:'fronts',labels:true}},
   {t:'What they bring',b:'Cold fronts move fast and can bring a line of thunderstorms, followed by cooler, clearer air. Warm fronts move slowly and can bring wide areas of low clouds, drizzle and fog.'}],
  tip:'Blue triangles = cold. Red bumps = warm.',
  qs:[
   {k:'tap',q:'Tap the COLD front.',fig:'fronts',z:'cold',zl:'The blue line with triangles',why:'Cold fronts are drawn in blue with triangles pointing the way they move.'},
   {k:'mc',q:'On a weather map, a warm front is drawn as…',a:['A red line with half-circles','A blue line with triangles','A green dotted line','A black zigzag'],why:'Warm fronts are red, with half-circles on the side they are moving toward.'},
   {k:'tf',q:'Cold fronts can bring a line of thunderstorms.',t:true,why:'Cold air shoves warm air up fast, which can build storms along the front.'},
   {k:'mc',q:'What is a front?',a:['The boundary between two air masses','The nose of the airplane','A kind of cloud','The front row of a hangar'],why:'A front is where two different air masses meet.'},
   {k:'fill',q:'A ___ front often brings wide areas of low clouds and drizzle.',a:['warm','cold','dry'],why:'Warm fronts slide slowly over cold air, spreading layers of low cloud.'},
   {k:'tf',q:'Weather usually turns warmer and muggier right after a cold front passes.',t:false,why:'Behind the front, cooler, drier air moves in.'}]},
 {id:'wx-mins',t:'Visibility + weather minimums',
  cards:[
   {t:'See and be seen',b:'VISIBILITY is how far you can see, measured in STATUTE MILES. A CEILING is the height of the lowest cloud layer that covers most of the sky.'},
   {t:'The minimums',b:'Pilots flying by sight follow VFR (Visual Flight Rules), which need minimum weather. Near many towered airports, VFR needs at least a 1,000-foot ceiling and 3 miles of visibility. Below that, VFR pilots stay on the ground.'},
   {t:'Personal minimums',b:'Smart pilots also set PERSONAL MINIMUMS that are stricter than the rules, especially while they are new. Being legal is not always the same as being safe.'}],
  tip:'Ceiling 1,000, visibility 3: or stay on the ground.',
  qs:[
   {k:'mc',q:'Visibility for pilots is measured in…',a:['Statute miles','Gallons','Degrees','Knots'],why:'Visibility is reported in statute miles, the same miles used on roads.'},
   {k:'mc',q:'Basic VFR near a towered airport needs at least…',a:['A 1,000-foot ceiling and 3 miles visibility','A 100-foot ceiling and 1 mile','A perfectly clear sky','No minimums at all'],why:'1,000 and 3 are the basic VFR minimums in an airport’s controlled surface area.'},
   {k:'tf',q:'A ceiling is the height of the lowest cloud layer that covers most of the sky.',t:true,why:'Scattered clouds with big gaps do not make a ceiling. A broken or overcast layer does.'},
   {k:'tf',q:'Personal minimums must always match the official rules exactly.',t:false,why:'Personal minimums add a safety margin that fits your own experience.'},
   {k:'mc',q:'The ceiling is 600 feet at a towered airport. Can a VFR student pilot take off?',a:['No: it’s below the 1,000-foot minimum','Yes, anytime','Only if they fly fast','Only with the radio off'],why:'600 feet is below the 1,000-foot basic VFR ceiling, so the flight waits.'},
   {k:'fill',q:'VFR stands for Visual Flight ___.',a:['Rules','Radio','Range'],why:'Visual Flight Rules: flying by looking outside.'}]}
]);

/* ============================ 8. NAVIGATION + CHARTS ============================ */
H.addLessons('nav',[
 {id:'nav-sectional',t:'Reading a sectional chart',
  cards:[
   {t:'A map for pilots',b:'VFR pilots use a SECTIONAL CHART. It shows airports, terrain, towers, roads, lakes and airspace: the things you can see and need to know about from the air.',fig:{f:'sectional'}},
   {t:'Airport colors',b:'Airports with a control tower are printed in BLUE. Airports without a tower are MAGENTA, a pinkish purple. A dashed blue circle around an airport shows Class D airspace.',fig:{f:'sectional',labels:true}}],
  tip:'Blue airport: tower. Magenta airport: no tower.',
  qs:[
   {k:'tap',q:'Tap the airport that HAS a control tower.',fig:'sectional',z:'towered',zl:'The blue airport',why:'Towered airports are printed in blue.'},
   {k:'mc',q:'What color is an airport WITHOUT a control tower on a sectional?',a:['Magenta','Blue','Black','Green'],why:'Non-towered airports are magenta.'},
   {k:'tf',q:'Sectional charts show things like roads, lakes and tall towers that pilots can see from the air.',t:true,why:'Those landmarks help pilots find their way and avoid obstacles.'},
   {k:'mc',q:'Who mainly uses sectional charts?',a:['VFR pilots who navigate by looking outside','Submarine captains','Train conductors','Only airline pilots'],why:'Sectionals are made for pilots flying by sight.'},
   {k:'fill',q:'Airports with a control tower are printed in ___.',a:['blue','magenta','red'],why:'Blue means a tower. Magenta means no tower.'}]},
 {id:'nav-compass',t:'Compass headings',
  cards:[
   {t:'360 degrees',b:'Directions are measured in degrees around a circle. NORTH is 360° (or 0°), EAST is 090°, SOUTH is 180° and WEST is 270°.',fig:{f:'compass',labels:true}},
   {t:'Magnetic north',b:'A compass points to MAGNETIC NORTH, which is not quite the same place as the true North Pole. Charts show the difference, called VARIATION, so pilots can correct for it.'}],
  tip:'N 360, E 090, S 180, W 270.',
  qs:[
   {k:'match',q:'Match each direction to its heading.',p:[['North','360°'],['East','090°'],['South','180°'],['West','270°']],why:'Clockwise from north: 90, 180, 270, 360.'},
   {k:'mc',q:'Which way is the arrow pointing?',fig:{f:'compass',hdg:225},a:['Southwest (225°)','Northeast (045°)','Southeast (135°)','Northwest (315°)'],why:'Halfway between south (180°) and west (270°) is southwest: 225°.'},
   {k:'tf',q:'A magnetic compass points exactly at the true North Pole.',t:false,why:'It points to magnetic north. The difference is called variation.'},
   {k:'mc',q:'You fly 090° and turn around to fly back. What is your new heading?',a:['270°','180°','360°','090°'],why:'Turning around adds or subtracts 180°: 090° becomes 270°.'},
   {k:'fill',q:'Halfway between north and east is ___°.',a:['045','135','225'],why:'Half of 90 is 45: northeast.'},
   {k:'mc',q:'What is the difference between true north and magnetic north called?',a:['Variation','Altitude','Crosswind','Latitude'],why:'Charts print the local variation so pilots can convert between the two.'}]},
 {id:'nav-landmarks',t:'Flying by landmarks',
  cards:[
   {t:'Pilotage',b:'PILOTAGE (PIE-lot-ij) means finding your way by looking out the window and matching landmarks to the chart: rivers, highways, towns, lakes and railroads.'},
   {t:'Dead reckoning',b:'DEAD RECKONING means figuring out your position from heading, speed and time. Fly 100 knots for 30 minutes with no wind and you have gone about 50 nautical miles. Pilots use both methods together, even with GPS.'}],
  tip:'Pilotage: look. Dead reckoning: calculate.',
  qs:[
   {k:'mc',q:'Navigating by matching landmarks to your chart is called…',a:['Pilotage','Dead reckoning','Autopilot','Taxiing'],why:'Pilotage means navigating by what you can see.'},
   {k:'mc',q:'You fly 120 knots for 30 minutes with no wind. How far did you go?',a:['60 nautical miles','120 nautical miles','30 nautical miles','240 nautical miles'],why:'Half an hour at 120 knots is half of 120: 60 nautical miles.'},
   {k:'tf',q:'Dead reckoning uses heading, speed and time to figure out where you are.',t:true,why:'Direction plus speed plus time tells you your position.'},
   {k:'mc',q:'Which is the BEST landmark for pilotage?',a:['A big lake with a hook shape','A parked car','A single small tree','A cloud'],why:'Good landmarks are big, unique and don’t move.'},
   {k:'fill',q:'Navigating by heading, speed and time is called ___ reckoning.',a:['dead','fast','sky'],why:'Dead reckoning: the classic way sailors and pilots navigate.'}]},
 {id:'nav-xc',t:'Planning a cross-country',
  cards:[
   {t:'Plan the trip',b:'A CROSS-COUNTRY is a flight to another airport. Pilots draw their route, pick CHECKPOINTS to watch for, check the weather and airspace, and work out the time and fuel.'},
   {t:'Fuel to spare',b:'Pilots always carry extra fuel. For daytime VFR flights, the rules say enough to reach the destination plus 30 more minutes. At night it is 45 minutes.'},
   {t:'A Plan B',b:'Good pilots also pick an ALTERNATE airport, in case weather or a problem stops them from reaching the first one.'}],
  tip:'Route, weather, fuel, Plan B.',
  qs:[
   {k:'mc',q:'What is a cross-country flight?',a:['A flight to a different airport','A flight across one whole country','A loop around the traffic pattern','A flight with no plan'],why:'Any trip from one airport to another is a cross-country.'},
   {k:'mc',q:'Daytime VFR fuel rule: enough to reach your destination plus…',a:['30 more minutes','5 more minutes','No extra','3 more hours'],why:'30 minutes of extra fuel by day, 45 minutes at night.'},
   {k:'tf',q:'Pilots pick checkpoints along the route to make sure they’re on track.',t:true,why:'Checkpoints are landmarks you expect to see at certain times.'},
   {k:'order',q:'Put a cross-country day in order.',s:['Check weather and plan','Preflight the airplane','Take off','Watch for checkpoints','Land at the destination'],why:'Plan first, inspect the airplane, fly the route, then land.'},
   {k:'fill',q:'An ___ airport is your backup if you can’t land at the first one.',a:['alternate','extra','older'],why:'An alternate is your Plan B.'},
   {k:'tf',q:'At night, VFR pilots may carry less reserve fuel than in the daytime.',t:false,why:'45 minutes of reserve at night, compared with 30 by day.'}]}
]);
})();
