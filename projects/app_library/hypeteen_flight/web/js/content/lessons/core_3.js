/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* HYPETEEN FLIGHT ACADEMY - LESSONS, PART 3: airspace, rules of the sky, weight + performance, pilot decisions, types of aircraft.
   Facts follow the FAA AIM, 14 CFR 91 (91.113 right-of-way, 91.119 minimum altitudes, 91.151 fuel, 91.159 cruising
   altitudes, 91.209 lights), the PHAK (weight + balance, density altitude, ADM, hazardous attitudes) and the Airplane
   Flying Handbook (positive exchange of flight controls), written for cadets 10-14. */
(function(){
const H=G.HFQ;
const SKY={f:'airspace',quiz:true};

/* ============================ 9. AIRSPACE ============================ */
H.addLessons('airspace',[
 {id:'as-control',t:'Controlled vs. uncontrolled',
  cards:[
   {t:'The sky has lanes',b:'Airspace is the sky divided into sections. In CONTROLLED airspace, air traffic controllers help keep airplanes apart. In UNCONTROLLED airspace, pilots keep themselves apart by looking out.',fig:'airspace'},
   {t:'Letters for the sky',b:'The FAA names airspace with letters. Classes A, B, C, D and E are controlled. Class G is uncontrolled, and it is usually a thin layer near the ground, away from busy airports. The US has no Class F.'}],
  tip:'A, B, C, D and E are controlled. G means you’re on your own.',
  qs:[
   {k:'mc',q:'Which airspace class is uncontrolled?',a:['Class G','Class A','Class B','Class D'],why:'Class G is uncontrolled: air traffic control does not separate airplanes there.'},
   {k:'tap',q:'Tap the uncontrolled airspace near the ground.',fig:SKY,z:'G',zl:'Class G, the thin layer by the ground',why:'Class G usually sits close to the ground in places away from busy airports.'},
   {k:'tf',q:'In controlled airspace, air traffic controllers can help keep airplanes apart.',t:true,why:'That is what makes it “controlled”: controllers can give instructions and traffic warnings.'},
   {k:'fill',q:'Air traffic ___ help keep airplanes apart in controlled airspace.',a:['controllers','mechanics','passengers'],why:'Controllers work in towers and radar rooms.'},
   {k:'tf',q:'Even in controlled airspace, pilots must keep looking outside for other airplanes.',t:true,why:'When the weather lets you see, every pilot must see and avoid other aircraft, in any airspace.'},
   {k:'tf',q:'The United States uses Class F airspace.',t:false,why:'Some other countries use Class F, but the US skips it: A, B, C, D, E and G.'}]},
 {id:'as-classes',t:'Airspace classes',
  cards:[
   {t:'The upside-down wedding cake',b:'Around the busiest airports is CLASS B. It is shaped like an upside-down wedding cake: small at the bottom and wider higher up, so big jets have room to climb and descend.',fig:{f:'airspace',hl:'B'}},
   {t:'C and D',b:'CLASS C surrounds busy airports with a control tower and radar: a smaller, two-layer cake. CLASS D is a cylinder of airspace around a smaller airport with a control tower.',fig:{f:'airspace',hl:['C','D']}},
   {t:'A and E',b:'CLASS A starts at 18,000 feet above sea level, where airliners cruise. Only instrument (IFR) flights may fly there. CLASS E is the rest of the controlled sky.',fig:{f:'airspace',hl:'A'}}],
  tip:'B is the busiest. C is busy. D has a tower. A is way up high.',
  qs:[
   {k:'tap',q:'Tap CLASS B: the upside-down wedding cake.',fig:SKY,z:'B',zl:'The big layered shape over the busiest airport',why:'Class B gets wider as it goes up, like an upside-down wedding cake.'},
   {k:'mc',q:'Where does Class A airspace begin?',a:['18,000 feet above sea level','1,000 feet above the ground','At the runway','10 miles from an airport'],why:'Class A starts at 18,000 feet above mean sea level.'},
   {k:'tap',q:'Tap CLASS D: the airspace around a smaller airport with a tower.',fig:SKY,z:'D',zl:'The small cylinder over the towered airport',why:'Class D is a simple cylinder around an airport with a control tower.'},
   {k:'tf',q:'Pilots flying by looking outside (VFR) may cruise in Class A.',t:false,why:'Class A is for instrument (IFR) flights only.'},
   {k:'match',q:'Match each class to where you find it.',p:[['Class A','18,000 ft and up'],['Class B','Busiest airports'],['Class D','Towered airports'],['Class G','Near the ground']],why:'Each letter has its own shape and its own rules.'},
   {k:'mc',q:'Why is Class B shaped like an upside-down wedding cake?',a:['Jets need room to climb and descend','It looks nice on charts','Clouds form that shape','It follows the mountains'],why:'The layers spread out higher up, giving arriving and departing jets protected space.'},
   {k:'fill',q:'Class C surrounds busy airports with a control tower and ___.',a:['radar','no runways','grass strips'],why:'Class C airports have a tower and radar approach control.'}]},
 {id:'as-sua',t:'Special-use areas',
  cards:[
   {t:'Keep-out zones',b:'Some airspace has special rules. A PROHIBITED area is always off limits, like the sky over the White House in Washington, D.C. A RESTRICTED area can hold hidden dangers, like artillery firing, so you need permission when it is active.'},
   {t:'Military training',b:'In a MILITARY OPERATIONS AREA (MOA), military jets practice fast maneuvers. Other pilots may fly through, but they should be extra careful and ask ATC whether the jets are active.'},
   {t:'Temporary rules',b:'A TFR (temporary flight restriction) closes some sky for a while: a wildfire, a space launch, a big stadium event or the President’s visit. Pilots check for TFRs before every flight.'}],
  tip:'TFRs can pop up anywhere, any day. Check before every flight.',
  qs:[
   {k:'mc',q:'Which kind of area is ALWAYS off limits?',a:['A prohibited area','A military operations area','Class E airspace','Class G airspace'],why:'Prohibited means no flying there, ever, without special permission.'},
   {k:'mc',q:'What might be happening inside an active restricted area?',a:['Military artillery firing','Airline boarding','A farmers’ market','Nothing at all'],why:'Restricted areas can hold invisible hazards like artillery, missiles or rockets.'},
   {k:'tf',q:'A TFR can be set up over a wildfire so firefighting aircraft can work safely.',t:true,why:'Firefighting TFRs keep other aircraft, and drones, out of the way.'},
   {k:'fill',q:'MOA stands for Military ___ Area.',a:['Operations','Ocean','Orbit'],why:'Military Operations Area: where military aircraft train.'},
   {k:'match',q:'Match each area to what it means.',p:[['Prohibited','Never fly in'],['Restricted','Hidden dangers'],['MOA','Military training'],['TFR','Temporary closure']],why:'Special-use areas are printed on charts, and TFRs are announced before flight.'},
   {k:'tf',q:'Pilots only need to check for TFRs once a year.',t:false,why:'TFRs can appear any day, so pilots check before every flight.'}]},
 {id:'as-talk',t:'Who you talk to, where',
  cards:[
   {t:'Getting in',b:'CLASS B: you need a clearance first. ATC must say you are “cleared into the Class Bravo airspace.” CLASS C and D: you need two-way radio contact, which means ATC answers using your call sign.'},
   {t:'At the airport',b:'At a towered airport, GROUND control clears you to taxi, and the TOWER clears you to take off and land. At an airport with no tower, pilots announce where they are on a shared frequency called the CTAF.',fig:{f:'sectional',labels:true}},
   {t:'On the way',b:'APPROACH and DEPARTURE controllers use radar around busy airports. CENTER controllers watch big chunks of sky in between. FLIGHT SERVICE helps pilots with weather briefings and flight plans.'}],
  tip:'B needs a clearance. C and D need two-way radio contact.',
  qs:[
   {k:'mc',q:'Before entering Class B, a pilot must…',a:['Hear “cleared into the Class Bravo airspace”','Just fly in and look around','Turn off the radio','Climb above 18,000 feet'],why:'Class B is the only class (below Class A) that needs an actual clearance for VFR pilots.'},
   {k:'tf',q:'If a Class D tower answers using your call sign, two-way radio contact is made.',t:true,why:'Hearing your call sign back means contact is made, and you may enter.'},
   {k:'match',q:'Match each controller to their job.',p:[['Ground','Taxi'],['Tower','Takeoff + landing'],['Approach','Radar near airports'],['Flight Service','Weather briefings']],why:'Each controller handles one part of the trip.'},
   {k:'tap',q:'At which airport would you talk to a control tower?',fig:'sectional',z:'towered',zl:'The blue airport (it has a tower)',why:'On a sectional chart, towered airports are blue and non-towered airports are magenta.'},
   {k:'fill',q:'At an airport with no tower, pilots announce their position on the ___.',a:['CTAF','ATIS','ELT'],why:'CTAF stands for Common Traffic Advisory Frequency.'},
   {k:'order',q:'Put a towered-airport departure in order.',s:['Listen to ATIS','Call Ground to taxi','Call Tower at the runway','Take off','Talk to Departure'],why:'Weather first (ATIS), then Ground, then Tower, then Departure once you are in the air.'}]}
]);

/* ============================ 10. RULES OF THE SKY ============================ */
H.addLessons('rules',[
 {id:'ru-row',t:'Right-of-way',
  cards:[
   {t:'Who goes first?',b:'An aircraft IN DISTRESS (in trouble) has right-of-way over everyone. After that, whoever can move out of the way the least goes first: BALLOONS, then GLIDERS, then AIRSHIPS, then airplanes and helicopters.'},
   {t:'Meeting other airplanes',b:'Converging? The airplane on the RIGHT has the right-of-way. Head-on? BOTH turn right. Overtaking? The plane being passed has the right-of-way, and you pass it on its right side.',fig:'row'},
   {t:'Landing',b:'An airplane landing has right-of-way over airplanes flying or on the ground. If two are landing, the lower one goes first, but it must never cut in front of the other.'}],
  tip:'Converging: right has the right-of-way. Head-on: both turn right.',
  qs:[
   {k:'tap',q:'Two airplanes are converging. Tap the one that has the right-of-way.',fig:'row',z:'other',zl:'The plane on your right',why:'When two airplanes converge, the one on the right has the right-of-way. You give way, usually by passing behind it.'},
   {k:'mc',q:'Two airplanes are flying straight at each other. What should they do?',a:['Both turn to the right','Both turn to the left','Both climb','The bigger one keeps going'],why:'Head-on, each pilot turns right.'},
   {k:'order',q:'Rank right-of-way, starting with who goes first.',s:['Aircraft in distress','Balloon','Glider','Airplane'],why:'Distress first, then the aircraft least able to get out of the way.'},
   {k:'tf',q:'A glider has right-of-way over an airplane.',t:true,why:'A glider has no engine to climb away, so powered airplanes give way to it.'},
   {k:'mc',q:'You are catching up to a slower airplane. Who has the right-of-way?',a:['The slower airplane ahead','You, the faster one','Whoever is higher','Whoever has more passengers'],why:'The airplane being overtaken has the right-of-way.'},
   {k:'fill',q:'When overtaking, pass the other airplane on its ___ side.',a:['right','left','top'],why:'The overtaking pilot turns right and passes well clear on the other plane’s right.'},
   {k:'tf',q:'An airplane that is landing must give way to one taxiing on the ground.',t:false,why:'Landing aircraft have right-of-way over aircraft in flight or on the surface.'}]},
 {id:'ru-see',t:'See and avoid',
  cards:[
   {t:'Eyes outside',b:'Whenever the weather lets you see, every pilot must watch for other aircraft. It is called SEE AND AVOID, and it applies even when ATC is helping you.'},
   {t:'How to scan',b:'Your eyes only see sharply in a tiny area straight ahead. So scan in small steps: look at one slice of sky (about 10°) for about a second, then move to the next slice.'},
   {t:'Danger: no motion',b:'An airplane on a collision course seems to hang still in your window while it grows bigger. If another plane is not moving across your windshield but is getting bigger, act right away!',fig:'row'}],
  tip:'Not moving, but getting bigger? Move!',
  qs:[
   {k:'tf',q:'Pilots only need to look for traffic when ATC tells them to.',t:false,why:'See and avoid is every pilot’s job, all the time the weather allows.'},
   {k:'mc',q:'An airplane on a collision course with you looks like it is…',a:['Not moving, but getting bigger','Zooming across the windshield','Getting smaller','Flashing green'],why:'No movement across your view plus growing size means you are both heading for the same spot.'},
   {k:'mc',q:'How should a pilot scan the sky?',a:['In small steps, about a second each','One quick sweep','Only straight ahead','Only at the instruments'],why:'The FAA suggests slices of about 10°, looking at each for about a second.'},
   {k:'fill',q:'Pilots must see and ___ other aircraft.',a:['avoid','follow','race'],why:'See and avoid: spot them early and stay clear.'},
   {k:'tf',q:'A dirty windshield can hide other airplanes.',t:true,why:'Bugs and smudges can look like airplanes, or hide real ones. Clean windows are a safety item.'},
   {k:'mc',q:'Why scan in small slices instead of one big sweep?',a:['Eyes only see sharply in a small area','It is faster','So you don’t get dizzy','Because the window is small'],why:'In a fast sweep your eyes can miss a small airplane completely.'}]},
 {id:'ru-alt',t:'Cruising altitudes',
  cards:[
   {t:'East is odd',b:'Above 3,000 feet over the ground, VFR pilots pick their cruising altitude by direction. Flying EAST (courses 0° to 179°): an ODD thousand plus 500 feet, like 3,500 or 5,500.',fig:{f:'compass',hdg:90}},
   {t:'West is even',b:'Flying WEST (courses 180° to 359°): an EVEN thousand plus 500 feet, like 4,500 or 6,500. Airplanes going opposite ways end up about 1,000 feet apart.',fig:{f:'compass',hdg:270}},
   {t:'Not too low',b:'Over a city, airplanes stay at least 1,000 feet above the tallest obstacle nearby. Over open country, at least 500 feet above the ground. And always high enough to glide to a safe landing if the engine quits.'}],
  tip:'East is odd, west is even, plus 500.',
  qs:[
   {k:'mc',q:'VFR, above 3,000 feet, on a course of 090° (east). Which altitude fits the rule?',a:['5,500 feet','6,500 feet','5,000 feet','6,000 feet'],why:'East means an odd thousand plus 500: 5,500 fits.'},
   {k:'mc',q:'VFR, above 3,000 feet, on a course of 270° (west). Pick an altitude.',a:['4,500 feet','3,500 feet','4,000 feet','5,500 feet'],why:'West means an even thousand plus 500: 4,500 fits.'},
   {k:'tf',q:'The cruising altitude rule keeps VFR airplanes going opposite ways about 1,000 feet apart.',t:true,why:'Eastbound flies odd+500, westbound flies even+500: always 1,000 feet between them.'},
   {k:'fill',q:'East is odd, west is ___, plus 500.',a:['even','odd','north'],why:'Odd thousands for east, even thousands for west.'},
   {k:'mc',q:'Over a city, how high must an airplane stay above the tallest obstacle nearby?',a:['1,000 feet','100 feet','50 feet','10,000 feet'],why:'1,000 feet above the highest obstacle over congested areas, so there is room for an emergency.'},
   {k:'match',q:'Match each situation to its altitude rule.',p:[['Flying east','Odd thousands + 500'],['Flying west','Even thousands + 500'],['Below 3,000 ft above ground','The rule doesn’t apply']],why:'The direction rule starts at 3,000 feet above the ground.'}]},
 {id:'ru-lights',t:'Aircraft lights',
  cards:[
   {t:'Red, green, white',b:'At night, airplanes show POSITION LIGHTS: RED on the left wingtip, GREEN on the right wingtip and WHITE on the tail. They tell other pilots which way you are pointed.',fig:{f:'navlights',labels:true}},
   {t:'Reading the dark',b:'See both RED and GREEN? That airplane is pointed toward you. See only WHITE? It is flying away. Flashing ANTI-COLLISION lights (a beacon or strobes) help others spot you.'},
   {t:'When to turn them on',b:'Position lights must be on from sunset to sunrise. Many pilots turn lights on in the daytime too, so they are easier to see.'}],
  tip:'Red on the left wingtip, green on the right, white on the tail.',
  qs:[
   {k:'tap',q:'Tap where the RED position light goes.',fig:{f:'navlights',quiz:true},z:'left',zl:'The left wingtip',why:'Red is always on the left wingtip.'},
   {k:'tap',q:'Tap where the GREEN position light goes.',fig:{f:'navlights',quiz:true},z:'right',zl:'The right wingtip',why:'Green is always on the right wingtip.'},
   {k:'mc',q:'At night you see another airplane’s red AND green lights. It is…',a:['Pointed toward you','Flying away from you','Parked','Behind you'],why:'You can only see both wingtips at once from in front.'},
   {k:'mc',q:'You can only see a white light on another airplane. It is…',a:['Flying away from you','Coming right at you','Turning left','Out of fuel'],why:'The white light is on the tail, so you are looking at the back of the airplane.'},
   {k:'tf',q:'Position lights must be on from sunset to sunrise.',t:true,why:'That is the FAA rule for flying at night.'},
   {k:'fill',q:'The position light on the tail is ___.',a:['white','red','green'],why:'Red left, green right, white tail.'}]}
]);

/* ============================ 11. WEIGHT + PERFORMANCE ============================ */
H.addLessons('perf',[
 {id:'pf-weight',t:'Weight + balance',
  cards:[
   {t:'Not too heavy',b:'Every airplane has a MAXIMUM WEIGHT. An airplane that is too heavy needs more runway, climbs slowly and could even be damaged. Pilots add up people, bags and fuel before every flight.'},
   {t:'Fuel is heavy',b:'Avgas (aviation gasoline) weighs about 6 pounds per gallon. Filling a 40-gallon tank adds about 240 pounds: as much as a grown-up passenger and a big suitcase!'},
   {t:'The POH',b:'Each airplane’s Pilot’s Operating Handbook (POH) lists its weight limits and performance charts. Pilots use the book, not guesses.'}],
  tip:'Add it all up: people, bags and fuel. Every flight.',
  qs:[
   {k:'mc',q:'About how much does one gallon of avgas weigh?',a:['6 pounds','1 pound','20 pounds','60 pounds'],why:'Avgas weighs about 6 pounds per gallon.'},
   {k:'tf',q:'An overloaded airplane needs more runway to take off.',t:true,why:'More weight means it takes longer to reach flying speed, and the climb is slower too.'},
   {k:'mc',q:'Where does a pilot find an airplane’s weight limits?',a:['The Pilot’s Operating Handbook','The airport map','A weather report','The radio'],why:'Every airplane’s POH lists its limits.'},
   {k:'fill',q:'Pilots add up people, bags and ___ before every flight.',a:['fuel','paint','clouds'],why:'Fuel is one of the heaviest things on board.'},
   {k:'mc',q:'At 6 pounds per gallon, 40 gallons of avgas weigh about…',a:['240 pounds','40 pounds','4,000 pounds','24 pounds'],why:'40 × 6 = 240 pounds.'},
   {k:'tf',q:'With every seat full, it is always fine to fill the fuel tanks too.',t:false,why:'Not always! In many small airplanes, full seats plus full tanks is over the maximum weight. The pilot may carry less fuel and plan a shorter trip.'}]},
 {id:'pf-cg',t:'Center of gravity',
  cards:[
   {t:'The balance point',b:'The CENTER OF GRAVITY (CG) is the point where the airplane would balance, like a seesaw. Where you put people and bags moves the CG.',fig:{f:'cg',shift:'ok'}},
   {t:'Too far back',b:'If the CG is too far AFT (toward the tail), the airplane gets unstable, and a stall can be very hard to recover from. This is the most dangerous way to be out of balance.',fig:{f:'cg',shift:'aft'}},
   {t:'Too far forward',b:'If the CG is too far FORWARD, the nose is heavy, and it is hard to raise the nose for takeoff and landing. Every airplane has a safe CG range in its POH.',fig:{f:'cg',shift:'fwd'}}],
  tip:'Load inside the lines: not too heavy, not too far back.',
  qs:[
   {k:'mc',q:'What is the center of gravity?',a:['The point where the airplane balances','The middle of the runway','The heaviest passenger','The bottom of the wing'],why:'The CG is the airplane’s balance point.'},
   {k:'mc',q:'How is this airplane loaded?',fig:{f:'cg',shift:'aft',quiz:true},a:['Tail-heavy: CG too far aft','Nose-heavy: CG too far forward','Perfectly balanced','It weighs nothing'],why:'The heavy bags are far back, so the tail drops: the CG has moved aft.'},
   {k:'tf',q:'A CG far aft makes an airplane more stable.',t:false,why:'An aft CG makes the airplane less stable. That is why loading limits matter.'},
   {k:'fill',q:'CG stands for center of ___.',a:['gravity','gas','ground'],why:'Center of gravity: the balance point.'},
   {k:'mc',q:'Moving heavy bags from the back seat to the front seat moves the CG…',a:['Forward','Aft','Nowhere','Up into the wing'],why:'Weight moved forward pulls the balance point forward.'},
   {k:'mc',q:'Moment = weight × arm. A 100-pound bag sits 100 inches from the reference point. What is its moment?',a:['10,000 pound-inches','200 pound-inches','1,000 pound-inches','100 pound-inches'],why:'100 × 100 = 10,000. Pilots add up all the moments and divide by the total weight to find the CG.'},
   {k:'tf',q:'A nose-heavy airplane can be hard to flare for landing.',t:true,why:'With the CG far forward, it takes more effort to raise the nose.'}]},
 {id:'pf-da',t:'Hot days + high airports',
  cards:[
   {t:'Thin air',b:'Air gets THINNER (less dense) when it is HOT, when the airport is HIGH, and when it is HUMID. Thin air means the wing makes less lift and the engine makes less power.',fig:'hothigh'},
   {t:'Density altitude',b:'Pilots call this DENSITY ALTITUDE: the altitude the airplane “feels.” On a hot day, a mountain airport can feel thousands of feet higher than it really is.'},
   {t:'What changes',b:'High density altitude means a LONGER takeoff roll and a SLOWER climb. Pilots check the charts, and they may wait for cool morning air or carry less weight.'}],
  tip:'Hot, high and humid: plan for a long takeoff.',
  qs:[
   {k:'mc',q:'Which day gives an airplane the WORST performance?',a:['Hot and humid at a mountain airport','Cold and dry at the beach','A cool morning by the ocean','A winter day at sea level'],why:'Hot, high and humid all make the air thinner.'},
   {k:'tf',q:'Hot air is thinner than cold air.',t:true,why:'Warm air spreads out, so it is less dense.'},
   {k:'fill',q:'The altitude the airplane “feels” is called ___ altitude.',a:['density','cruising','pattern'],why:'Density altitude goes up on hot days and at high airports.'},
   {k:'mc',q:'On a hot day at a high airport, the takeoff roll will be…',a:['Longer','Shorter','The same','Zero'],why:'Less lift and less power mean more runway.'},
   {k:'tf',q:'Humid air helps an airplane climb faster.',t:false,why:'Humid air is actually a little less dense, so performance gets slightly worse.'},
   {k:'mc',q:'A smart pilot at a hot, high airport might…',a:['Take off in the cool morning with less weight','Load more bags for balance','Wait for the hottest part of the day','Pick the shortest runway'],why:'Cooler air and a lighter airplane both shorten the takeoff.'}]},
 {id:'pf-dist',t:'Takeoff + landing distance',
  cards:[
   {t:'Wind helps or hurts',b:'A HEADWIND means you reach flying speed after a shorter roll. A TAILWIND makes the takeoff and landing roll much LONGER. That is why pilots take off and land into the wind.'},
   {t:'The runway matters',b:'Tall GRASS, SOFT ground and an UPHILL slope all make takeoffs longer. A WET runway makes landings longer, because the brakes grip less.'},
   {t:'Check the chart',b:'The POH has takeoff and landing charts. Pilots look up the distance for the weight, temperature, airport height and wind, then make sure the runway is long enough with room to spare.'}],
  tip:'Headwind good, tailwind bad, and always leave room to spare.',
  qs:[
   {k:'mc',q:'Which wind gives the SHORTEST takeoff roll?',a:['A headwind','A tailwind','No wind','A gust from behind'],why:'A headwind gives you airspeed before you even start rolling.'},
   {k:'tf',q:'A tailwind makes the takeoff roll longer.',t:true,why:'With the wind behind you, you need more ground speed to reach flying speed.'},
   {k:'mc',q:'Which runway makes a takeoff longest?',a:['Tall, soft grass','Smooth, dry pavement','New concrete','A dry, downhill runway'],why:'Tall, soft grass drags on the wheels.'},
   {k:'fill',q:'Wet runways make landings longer because the brakes ___ less.',a:['grip','beep','glow'],why:'Water between the tires and the runway reduces braking.'},
   {k:'order',q:'Plan a takeoff: put the steps in order.',s:['Check weight and weather','Look up the POH chart','Compare it to the runway length','Decide: go or no-go'],why:'Gather the numbers, look up the distance, compare, then decide.'},
   {k:'tf',q:'Taking off uphill uses less runway than taking off downhill.',t:false,why:'Uphill means climbing while you accelerate, so it takes more runway.'}]}
]);

/* ============================ 12. PILOT DECISIONS ============================ */
H.addLessons('decisions',[
 {id:'dc-check',t:'Checklists',
  cards:[
   {t:'Every time',b:'Pilots use CHECKLISTS for every step: preflight, engine start, before takeoff and landing. Even airline captains with thousands of hours use them, because memory can slip.'},
   {t:'The walk-around',b:'Before each flight, pilots walk around the airplane: fuel amount and a fuel sample, oil, tires and every flight control. Then they remove the covers, chocks and tie-downs.',fig:'planeSide'},
   {t:'Emergencies too',b:'There are emergency checklists too. The first rule in any emergency: AVIATE (keep flying the airplane), NAVIGATE (know where you are going), COMMUNICATE (talk on the radio).'}],
  tip:'Aviate, navigate, communicate: in that order.',
  qs:[
   {k:'tf',q:'Experienced pilots can skip checklists once they know them by heart.',t:false,why:'Everyone uses checklists, every flight. Memory slips; checklists don’t.'},
   {k:'order',q:'In an emergency, put the priorities in order.',s:['Aviate','Navigate','Communicate'],why:'Fly the airplane first, then figure out where to go, then talk.'},
   {k:'mc',q:'Why do pilots drain a little fuel into a clear cup before flight?',a:['To check for water or the wrong fuel','To make the airplane lighter','To clean the wing','To warm the engine'],why:'Water sinks to the bottom of the cup, and the fuel’s color shows its type. 100LL avgas is dyed blue.'},
   {k:'mc',q:'What does AVIATE mean?',a:['Keep flying the airplane first','Call the tower first','Read the map first','Turn on the lights'],why:'No matter what happens, keep control of the airplane.'},
   {k:'fill',q:'Before flight, pilots remove the chocks, covers and tie-___.',a:['downs','ups','backs'],why:'Tie-downs hold a parked airplane to the ground. Forgetting one is a classic mistake.'},
   {k:'tf',q:'100LL avgas is dyed blue so pilots can recognize it.',t:true,why:'Each fuel grade has its own color, so the wrong fuel is easier to spot.'}]},
 {id:'dc-imsafe',t:'The IMSAFE check',
  cards:[
   {t:'Is the pilot ready?',b:'Before flying, pilots check THEMSELVES with IMSAFE: Illness, Medication, Stress, Alcohol, Fatigue and Emotion. If any letter is a problem, they don’t fly.',fig:'imsafe'},
   {t:'Honest answers',b:'Feeling sick, very tired or really upset slows your thinking. Some medicines make you drowsy. A good pilot is honest and says, “Not today.”'}],
  tip:'Checking yourself is part of the preflight.',
  qs:[
   {k:'order',q:'Put IMSAFE in order.',s:['Illness','Medication','Stress','Alcohol','Fatigue','Emotion'],why:'I-M-S-A-F-E: Illness, Medication, Stress, Alcohol, Fatigue, Emotion.'},
   {k:'mc',q:'In IMSAFE, what does the F stand for?',a:['Fatigue','Fuel','Flaps','Friends'],why:'F is Fatigue: being too tired to fly safely.'},
   {k:'tf',q:'A pilot who stayed up all night should fly anyway if the weather is nice.',t:false,why:'Fatigue slows your thinking as much as being sick does. Rest first.'},
   {k:'mc',q:'Why does Medication matter?',a:['Some medicines can make you sleepy or slow','Medicine makes the airplane heavier','Pilots can’t carry medicine','It doesn’t matter'],why:'Even everyday medicines can cause drowsiness. Pilots check with a doctor.'},
   {k:'fill',q:'IMSAFE is a check of the ___, not the airplane.',a:['pilot','engine','runway'],why:'The pilot is part of the preflight too.'},
   {k:'match',q:'Match each IMSAFE word to what it looks like.',p:[['Illness','Feeling sick'],['Fatigue','Very tired'],['Emotion','Really upset'],['Stress','Lots of worry']],why:'If any of these is true today, it is a no-go.'}]},
 {id:'dc-gonogo',t:'Go / no-go decisions',
  cards:[
   {t:'PAVE',b:'To decide whether to fly, pilots check PAVE: the Pilot, the Aircraft, the enVironment (weather, airports, terrain) and External pressures, like wanting to get home on time.'},
   {t:'Personal minimums',b:'Smart pilots set PERSONAL MINIMUMS: their own rules, stricter than the law, like “no flying when the wind is over 15 knots” until they have more practice.'},
   {t:'Thinking traps',b:'Watch for HAZARDOUS ATTITUDES. MACHO (“I can do it”) → “Taking chances is foolish.” INVULNERABILITY (“It won’t happen to me”) → “It could happen to me.” IMPULSIVITY (“Do it quick”) → “Not so fast. Think first.”'},
   {t:'Two more traps',b:'ANTI-AUTHORITY (“Don’t tell me”) → “Follow the rules. They are usually right.” RESIGNATION (“What’s the use?”) → “I’m not helpless. I can make a difference.”'}],
  tip:'It is always OK to say no-go.',
  qs:[
   {k:'order',q:'Put PAVE in order.',s:['Pilot','Aircraft','enVironment','External pressures'],why:'P-A-V-E: Pilot, Aircraft, enVironment, External pressures.'},
   {k:'match',q:'Match each trap to its antidote.',p:[['Macho','Taking chances is foolish'],['Invulnerability','It could happen to me'],['Impulsivity','Not so fast. Think first'],['Resignation','I can make a difference']],why:'Saying the antidote out loud helps a pilot catch the trap.'},
   {k:'tf',q:'Personal minimums can be stricter than the FAA rules.',t:true,why:'The law is the minimum. Good pilots add their own safety margin.'},
   {k:'mc',q:'Your friends are waiting, so you feel rushed to fly in bad weather. That is…',a:['An external pressure','A personal minimum','Good airmanship','A checklist item'],why:'Pressure from outside the cockpit is the E in PAVE.'},
   {k:'mc',q:'“It won’t happen to me” is which hazardous attitude?',a:['Invulnerability','Macho','Resignation','Anti-authority'],why:'Invulnerability. The antidote: “It could happen to me.”'},
   {k:'tf',q:'Staying on the ground in bad weather is a poor decision.',t:false,why:'A no-go decision is a smart decision.'}]},
 {id:'dc-crew',t:'Crew teamwork',
  cards:[
   {t:'Who is flying?',b:'When pilots hand over the controls, they say it three times: “You have the flight controls.” “I have the flight controls.” “You have the flight controls.” That way, nobody thinks the other pilot is flying.'},
   {t:'Speak up',b:'In a good crew, anyone who sees a problem says so, even a new pilot talking to a captain. This teamwork is called CREW RESOURCE MANAGEMENT, or CRM.'},
   {t:'Quiet cockpit',b:'During taxi, takeoff and landing, airline pilots keep the cockpit quiet except for flying talk. It is called a STERILE COCKPIT, and it helps them focus.'}],
  tip:'Say it, hear it, say it back.',
  qs:[
   {k:'mc',q:'After Pilot 2 says “I have the flight controls,” what does Pilot 1 say?',a:['“You have the flight controls.”','“Good luck!”','Nothing at all','“I have the flight controls.”'],why:'The third call confirms the handoff, so both pilots know who is flying.'},
   {k:'tf',q:'A new pilot should stay quiet even if they spot a problem the captain missed.',t:false,why:'Speaking up is a big part of CRM. Good captains want to hear it.'},
   {k:'fill',q:'CRM stands for Crew ___ Management.',a:['Resource','Radio','Runway'],why:'Crew Resource Management: using everyone and everything to fly safely.'},
   {k:'mc',q:'Why do pilots say the control handoff out loud, three times?',a:['So both know exactly who is flying','To test the radio','Just for tradition','To practice spelling'],why:'Airplanes have crashed when each pilot thought the other one was flying.'},
   {k:'tf',q:'A sterile cockpit means only flying talk during busy times like takeoff and landing.',t:true,why:'Fewer distractions when they matter most.'},
   {k:'mc',q:'Which is a good example of CRM?',a:['A copilot says, “Check the fuel. It looks low.”','The captain ignores everyone','Nobody uses checklists','The pilots stop talking to ATC'],why:'Sharing what you notice is teamwork in action.'}]}
]);

/* ============================ 13. TYPES OF AIRCRAFT ============================ */
H.addLessons('types',[
 {id:'ty-airplane',t:'Airplanes',
  cards:[
   {t:'Categories + classes',b:'The FAA sorts aircraft into CATEGORIES: airplane, rotorcraft, glider, lighter-than-air, powered-lift, powered parachute and weight-shift-control. Inside each are CLASSES, like single-engine land or multi-engine sea.',fig:{f:'craft',list:['airplane','heli','glider','balloon'],labels:true}},
   {t:'Shapes you’ll see',b:'HIGH-WING airplanes have the wing on top of the cabin; LOW-WING airplanes have it underneath. A TRICYCLE airplane has a nosewheel. A TAILWHEEL airplane, or taildragger, has a small wheel at the tail.'},
   {t:'Props + jets',b:'Small airplanes usually have PROPELLERS turned by piston engines, a lot like car engines. Airliners use JET engines. SEAPLANES have floats or a boat hull so they can land on water.'}],
  tip:'Category is the big family. Class is the kind inside it.',
  qs:[
   {k:'tap',q:'Tap the AIRPLANE.',fig:{f:'craft',list:['heli','glider','airplane','balloon']},z:'airplane',zl:'The airplane',why:'Airplanes have an engine, fixed wings and a tail.'},
   {k:'mc',q:'A small wheel at the tail instead of a nosewheel makes an airplane a…',a:['Taildragger','Seaplane','Glider','Jet'],why:'Tailwheel airplanes are nicknamed taildraggers.'},
   {k:'tf',q:'A seaplane can land on water.',t:true,why:'Floats or a boat-shaped hull let seaplanes use lakes and rivers as runways.'},
   {k:'match',q:'Match each word to what it means.',p:[['High-wing','Wing above the cabin'],['Low-wing','Wing below the cabin'],['Multi-engine','Two or more engines']],why:'Pilots describe airplanes by their shapes and engines.'},
   {k:'fill',q:'Inside each category, aircraft are sorted into ___.',a:['classes','teams','colors'],why:'For airplanes: single-engine land, single-engine sea, multi-engine land and multi-engine sea.'},
   {k:'mc',q:'Which of these is an airplane CLASS?',a:['Single-engine land','Rotorcraft','Lighter-than-air','Powered-lift'],why:'The other three are whole categories.'},
   {k:'tf',q:'Powered parachutes are not an FAA aircraft category.',t:false,why:'Powered parachutes, and weight-shift-control trikes, have categories of their own.'}]},
 {id:'ty-rotor',t:'Rotorcraft',
  cards:[
   {t:'Spinning wings',b:'ROTORCRAFT fly with spinning blades called rotors. A HELICOPTER powers its main rotor with an engine, so it can hover, fly sideways or backward, and land almost anywhere.',fig:{f:'craft',t:'heli',labels:true}},
   {t:'The tail rotor',b:'Spinning the main rotor tries to twist the helicopter’s body the other way. The TAIL ROTOR pushes against that twist, and the pilot’s pedals control it. That is how the pilot points the nose.',fig:{f:'craft',t:'heli',hl:'tail'}},
   {t:'Gyroplanes',b:'A GYROPLANE looks like a tiny helicopter, but its rotor isn’t powered in flight. Air flowing up through the rotor spins it, while a propeller pushes the gyroplane forward.',fig:{f:'craft',t:'gyro'}}],
  tip:'Helicopter: the engine spins the rotor. Gyroplane: the air spins it.',
  qs:[
   {k:'tap',q:'Tap the TAIL ROTOR.',fig:{f:'craft',t:'heli'},z:'tail',zl:'The small rotor at the back',why:'The tail rotor keeps the body from spinning and lets the pilot point the nose.'},
   {k:'mc',q:'What does a helicopter’s tail rotor do?',a:['Stops the body from twisting the wrong way','Makes the helicopter go faster','Lifts the helicopter','Holds the fuel'],why:'It pushes against the twist (torque) from the main rotor.'},
   {k:'tf',q:'A gyroplane’s rotor is turned by the engine in flight, just like a helicopter’s.',t:false,why:'A gyroplane’s rotor spins freely in the airflow. Its engine turns a propeller.'},
   {k:'mc',q:'Which aircraft can HOVER in one spot?',a:['Helicopter','Glider','Airliner','Seaplane'],why:'A helicopter’s powered rotor can hold it still in the air.'},
   {k:'fill',q:'Helicopters and gyroplanes are both ___.',a:['rotorcraft','gliders','airships'],why:'They are the two classes in the rotorcraft category.'},
   {k:'tf',q:'Helicopter pilots use foot pedals to control the tail rotor.',t:true,why:'The pedals change the tail rotor’s push, turning the nose left or right.'}]},
 {id:'ty-glider',t:'Gliders + balloons',
  cards:[
   {t:'Gliders',b:'Most GLIDERS have no engine. A tow plane or a ground winch pulls them up, then they let go and glide. Glider pilots climb by circling in THERMALS: columns of warm, rising air.',fig:{f:'craft',t:'glider'}},
   {t:'Balloons',b:'A HOT-AIR BALLOON rises because hot air is lighter than the cooler air around it. The pilot heats the air with a BURNER to go up, and lets it cool, or opens a vent, to come down.',fig:{f:'craft',t:'balloon'}},
   {t:'Steering a balloon',b:'Balloons have no steering wheel: they go where the wind blows! Pilots climb or descend to find winds blowing different ways. Balloons and airships are LIGHTER-THAN-AIR aircraft.'}],
  tip:'Gliders ride rising air. Balloons ride the wind.',
  qs:[
   {k:'mc',q:'How does a glider pilot climb without an engine?',a:['By circling in rising warm air','By flapping the wings','By turning on a burner','By dropping fuel'],why:'Thermals carry gliders up, sometimes thousands of feet.'},
   {k:'mc',q:'How does a balloon pilot go up?',a:['Heats the air with the burner','Pulls back on a yoke','Speeds up the propeller','Lets the air cool'],why:'Hotter air inside means more lift.'},
   {k:'tf',q:'A hot-air balloon pilot can steer left and right with a rudder.',t:false,why:'Balloons drift with the wind. Changing altitude is the only way to find a different direction.'},
   {k:'tap',q:'Tap the LIGHTER-THAN-AIR aircraft.',fig:{f:'craft',list:['glider','airplane','balloon','heli']},z:'balloon',zl:'The hot-air balloon',why:'A balloon floats because the hot air inside is lighter than the air around it.'},
   {k:'fill',q:'Columns of warm, rising air are called ___.',a:['thermals','contrails','runways'],why:'Glider pilots look for them under puffy cumulus clouds.'},
   {k:'mc',q:'Which of these is lighter-than-air?',a:['Airship','Glider','Gyroplane','Helicopter'],why:'Airships float on lighter-than-air gas, usually helium, and use engines to move.'}]},
 {id:'ty-pl',t:'Powered-lift',
  cards:[
   {t:'Best of both',b:'A POWERED-LIFT aircraft takes off and lands straight up like a helicopter, then flies forward on wings like an airplane.',fig:{f:'craft',t:'tiltrotor'}},
   {t:'Tiltrotors',b:'The V-22 OSPREY is a military TILTROTOR. Its big rotors point up for takeoff, then tilt forward to work like propellers for fast cruising.'},
   {t:'Air taxis',b:'Engineers are building electric air taxis called eVTOLs (electric Vertical Take-Off and Landing), and many of them are powered-lift. The FAA writes the rules for how they will share the sky safely.'}],
  tip:'Up like a helicopter, forward like an airplane.',
  qs:[
   {k:'mc',q:'What makes an aircraft “powered-lift”?',a:['It lifts off vertically and cruises on wings','It has no engine','It floats on hot air','It only flies at night'],why:'Vertical takeoff like a helicopter, wing-borne cruise like an airplane.'},
   {k:'tf',q:'The V-22 Osprey tilts its rotors forward to fly fast like an airplane.',t:true,why:'That is what makes it a tiltrotor.'},
   {k:'fill',q:'eVTOL stands for electric Vertical Take-Off and ___.',a:['Landing','Lift','Looping'],why:'Electric Vertical Take-Off and Landing.'},
   {k:'tap',q:'Tap the TILTROTOR.',fig:{f:'craft',list:['heli','tiltrotor','airplane','gyro']},z:'tiltrotor',zl:'The tiltrotor, with rotors on its wingtips',why:'Tiltrotors carry big rotors on the ends of their wings.'},
   {k:'match',q:'Match each aircraft to how it flies.',p:[['Helicopter','Engine spins the rotor'],['Gyroplane','Air spins the rotor'],['Tiltrotor','Rotors tilt forward'],['Glider','No engine']],why:'Every type solves the lift puzzle its own way.'},
   {k:'mc',q:'Why might a city want eVTOL air taxis?',a:['They can land on small pads, not runways','They never need any rules','They fly underground','They are free to ride'],why:'Taking off vertically means they could land on rooftops or small pads.'}]}
]);
})();
