/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* STUDENT PILOT 8 - PATTERN + AIRPORT WORK: the traffic pattern, towered and non-towered airports, lights and signs. */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,mt,od,L}=H.dsl;
H.addLessons('pattern',[
L('pat-legs','The five legs',[
 cd('A rectangle in the sky','The traffic pattern is a rectangle flown around the runway. It has five legs: the upwind leg after takeoff, the crosswind leg, the downwind leg parallel to the runway, the base leg, and final approach to land.'),
 cd('Left turns','Unless a sign or chart says otherwise, all turns in the pattern are to the left. Everyone flying the same way means pilots know where to look for each other and who goes next.')],
 'Upwind, crosswind, downwind, base, final.',[
 od('Put the pattern legs in order.',['Upwind','Crosswind','Downwind','Base','Final'],'This is the order you fly them.'),
 mc('Which direction are pattern turns normally?',['Left','Right','Either','Straight'],'Standard patterns are left-hand.'),
 mc('Which leg runs parallel to the runway, opposite your landing direction?',['Downwind','Upwind','Crosswind','Final'],'You fly downwind with the wind behind you in the pattern.'),
 tf('Everyone in the pattern flies the same direction.',true,'This keeps traffic organized.'),
 tf('Final approach is the first leg.',false,'Upwind is the first leg.'),
 fl('The leg just before landing is the ___ approach.',['final','upwind','crosswind','base'],'Final is the last leg.')]),
L('pat-alt','Pattern altitude and speed',[
 cd('Same height','Most airports have a standard pattern altitude, often 1,000 feet above the ground, though some use 800 or 1,500. Flying the same altitude keeps airplanes at the same level so pilots know where to look.'),
 cd('Spacing','Pilots watch the airplane ahead and space themselves behind it. If they are too close, they extend the downwind or fly a wider pattern. Slower airplanes fly a tighter pattern and faster ones a wider one.')],
 'Same height, same direction, good spacing.',[
 mc('What is a common pattern altitude?',['1,000 feet above the ground','10,000 feet','100 feet','50,000 feet'],'Many airports use 1,000 feet AGL.'),
 mc('What can a pilot do to space behind another airplane?',['Extend the downwind','Climb to 10,000','Skip the pattern','Land on the taxiway'],'A longer downwind adds space.'),
 mc('Where can you find the pattern altitude?',['The airport’s chart listing','The tire','The oil gauge','The seat'],'Charts and airport guides list it.'),
 tf('Everyone flying at the same altitude helps pilots know where to look.',true,'Predictability is safety.'),
 tf('You can choose any altitude you like.',false,'The airport’s published altitude should be used.'),
 fl('AGL stands for above ___ level.',['ground','gas','gauge','glide'],'AGL means above ground level.')]),
L('pat-enter','Entering the pattern',[
 cd('Check the wind first','Before entering, the pilot checks the windsock or the airport weather to choose the active runway. Landing into the wind is best. The pilot then joins the pattern in a predictable way.'),
 cd('The 45-degree entry','The standard entry is a 45-degree angle to the downwind leg, at pattern altitude, abeam the midpoint of the runway. Entering from this angle gives the best view of other traffic and fits in smoothly.')],
 'Wind check, then a 45-degree entry to downwind.',[
 mc('How do you pick which runway to use?',['The one most into the wind','The longest','The newest','Any'],'Landing into the wind lowers speed over the ground.'),
 mc('What is the standard way to join the pattern?',['45-degree entry to downwind','Straight to final','Cross the runway low','Upside down'],'It is predictable and visible.'),
 mc('Where do you enter along the downwind leg?',['Around the midpoint of the runway','At the far end','Anywhere','Over the hangar'],'Midfield gives the best view.'),
 tf('Check the windsock before choosing a runway.',true,'The wind direction decides.'),
 tf('You can enter without looking for traffic.',false,'Always look for other airplanes.'),
 fl('The wind direction is shown by the ___.',['windsock','compass','tachometer','clock'],'Windsock points where the wind blows to.')]),
L('pat-ctaf','Non-towered airports',[
 cd('No tower','Many small airports have no control tower. Pilots there talk to each other on a common frequency called CTAF, the Common Traffic Advisory Frequency. They report where they are and what they plan to do.'),
 cd('Self-announce','Calls follow a pattern: who you’re talking to, who you are, where you are, and what you intend. For example, “Hometown traffic, Cessna 123AB, entering left downwind for Runway 27, Hometown.” Say the airport name at the beginning and end.')],
 'Say who, where and what, then watch for answers.',[
 mc('What does CTAF stand for?',['Common Traffic Advisory Frequency','Control Tower Air Flight','Cleared To Arrive First','Cabin Temperature And Fuel'],'It’s the shared frequency at non-towered airports.'),
 mc('Who controls traffic at a non-towered airport?',['The pilots, by looking and talking','The tower','The fuel truck','Nobody exists'],'Pilots self-announce and see and avoid.'),
 mc('What should a radio call include?',['Where you are and what you plan to do','Your favorite food','The weather channel','A joke'],'Position and intentions are key.'),
 tf('You should say the airport name at the start and end of a CTAF call.',true,'It helps other pilots know it’s for them.'),
 tf('If you hear nothing, nobody is there.',false,'Not every airplane has a radio. Keep watching.'),
 fl('At a non-towered airport pilots ___ their position on the radio.',['announce','hide','delete','paint'],'Self-announcing helps everyone.')]),
L('pat-tower','Towered airports',[
 cd('Controllers in the tower','At airports with a control tower, controllers direct takeoffs, landings and taxiing. Different positions handle different jobs: ground control for taxiing, tower for runways, and sometimes clearance delivery for flight plans.'),
 cd('Wait for permission','Pilots must receive a clearance before entering a runway or taking off or landing. Hearing “cleared for takeoff” or “cleared to land” gives permission. Without it, the answer is to wait or ask.')],
 'No clearance, no runway.',[
 mc('Who tells you to taxi at a towered airport?',['Ground control','Tower only','Nobody','The fuel truck'],'Ground handles taxiing.'),
 mc('What do you need to land at a towered airport?',['A landing clearance','A snack','A passenger','A parachute'],'Controllers sequence the traffic.'),
 mc('What if you aren’t sure about an instruction?',['Ask the controller to repeat','Guess','Ignore it','Hang up'],'Clarify immediately.'),
 tf('Controllers sequence takeoffs and landings.',true,'This prevents conflicts.'),
 tf('A pilot may enter the runway without permission.',false,'Always wait for clearance.'),
 mt('Match the position to its job.',[['Ground control','Taxiing'],['Tower','Runways'],['ATIS','Recorded airport info']],'Each voice has its role.')]),
L('pat-atis','ATIS: the recorded broadcast',[
 cd('What ATIS says','ATIS, the Automatic Terminal Information Service, is a recorded message that repeats the airport’s weather and key information: wind, visibility, sky, temperature, altimeter, active runways and warnings.'),
 cd('The information letter','Each update gets a new letter from the phonetic alphabet, such as “Information Charlie.” Pilots listen first, then tell the controller they have the current letter when they call. It saves radio time for everyone.')],
 'Listen to ATIS, then say the letter.',[
 mc('What does ATIS give pilots?',['Weather and airport information','A taxi ride','Fuel','A parking space'],'It is a recorded airport briefing.'),
 mc('What does “Information Charlie” mean?',['The current ATIS version is C','A person named Charlie','Airport Charlie','A cloud type'],'The letter marks the current update.'),
 mc('Why listen to ATIS before calling the tower?',['It saves radio time','It is a game','It is required to taxi','It charges the battery'],'You already know the basics.'),
 tf('ATIS letters come from the phonetic alphabet.',true,'Alfa, Bravo, Charlie and so on.'),
 tf('ATIS is live conversation with a controller.',false,'It is a recording.'),
 fl('ATIS gives the active ___ in use.',['runways','spoons','books','roads'],'The active runways are listed.')]),
L('pat-signs','Signs and markings at the hold line',[
 cd('Hold short lines','A taxiway meets a runway at a hold short marking: two solid yellow lines and two dashed ones. The solid lines are on the side where airplanes wait. Do not cross without clearance. A red sign with white numbers marks the runway ahead.'),
 cd('Reading signs','Yellow signs with black letters show taxiways and directions. Red signs with white letters show runways and holds. Black signs with yellow letters show your location. Learning the colors lets you navigate the airport.')],
 'Yellow means taxiway, red means stop and check.',[
 mc('What is the pilot required to do at a hold short line?',['Wait for clearance','Cross quickly','Take off','Turn off the engine'],'Never cross a runway hold line without permission.'),
 mc('What color sign marks a runway entrance?',['Red with white letters','Green','Blue','Orange'],'Red signs mean stop and think.'),
 mc('What do black signs with yellow letters show?',['Your location','A runway','A fuel stop','An exit to the road'],'They show where you are.'),
 tf('The solid lines of the hold marking are on the side where you wait.',true,'Pay attention to the lines.'),
 tf('Taxiway signs are red.',false,'Taxiway directional signs are yellow.'),
 fl('A yellow sign with black letters shows a ___.',['taxiway','runway','hangar','tower'],'Yellow with black means taxiway directions.')]),
L('pat-lights','Airport lighting',[
 cd('Light colors','Runway edges are marked with white lights. The ends show green on the threshold and red at the far end. Taxiways have blue edge lights and some have green centerline lights, so you never confuse them with a runway at night.'),
 cd('The beacon','A rotating beacon shows where the airport is at night. A white and green flash means a lighted civilian land airport. Pilots can also turn on the runway lights using the radio at some airports.')],
 'White on runway edges, blue on taxiways, green and white beacon.',[
 mc('What color are taxiway edge lights?',['Blue','White','Red','Green'],'Blue marks taxiways.'),
 tf('Runway edge lights are blue.',false,'Runways use white edge lights. Blue is for taxiways.'),
 mc('A white and green flashing beacon shows…',['A lighted land airport','A military base','A hospital','A water landing'],'It’s the standard civilian airport beacon.'),
 tf('Blue lights mark taxiway edges.',true,'They help tell taxiways from runways.'),
 tf('The beacon only matters in the daytime.',false,'It guides pilots at night.'),
 fl('Taxiway edge lights are ___.',['blue','red','white','yellow'],'Blue taxiway lights.')]),
L('pat-papi','Visual glide path lights',[
 cd('PAPI lights','A PAPI is a row of four lights beside the runway that shows whether you are on the right glide path. Two white and two red lights mean you are on the glide path. More white means too high. More red means too low.'),
 cd('Remember the colors','Think of red as the ground and white as the sky. More white lights mean you are too high, so descend. More red lights mean you are too low, so climb back up to the path right away, adding power if needed.')],
 'Two red, two white means on path.',[
 mc('What does two white and two red lights mean?',['On the glide path','Too high','Too low','Fly away'],'The PAPI shows an ideal approach.'),
 mc('What does all white mean?',['Too high','Too low','On path','Land'],'All white is high.'),
 mc('What does all red mean?',['Too low','Too high','On path','Climb'],'All red means far below the path.'),
 tf('A PAPI sits beside the runway.',true,'It is usually on the left side.'),
 tf('PAPI means Pilot Always Presses Idle.',false,'It stands for Precision Approach Path Indicator.'),
 fl('More red lights on a PAPI means you are too ___.',['low','high','fast','slow'],'Red means low.')]),
L('pat-wind','Reading the wind at the airport',[
 cd('Windsock','The windsock points away from the wind direction, and the more it stands out, the stronger the wind. Many airports have a segmented circle with the windsock and arrows that show the traffic pattern direction.'),
 cd('Using the wind','Landing into the wind slows your ground speed, shortens the landing roll and makes you easier to control. When the wind is across the runway, use the crosswind techniques you learned.')],
 'Wind sock out and full means a strong wind.',[
 mc('Which way does a windsock point?',['Toward where the wind is going','Toward where the wind is from','Up','Down'],'The tail points downwind.'),
 mc('What does a fully extended windsock mean?',['Strong wind','No wind','A broken sock','Rain'],'More extension means stronger wind.'),
 mc('Why land into the wind?',['Slower ground speed and shorter roll','Faster arrival','To save paint','No reason'],'Less ground speed gives shorter landing.'),
 tf('A limp windsock suggests calm wind.',true,'It hangs down in little wind.'),
 tf('The windsock points toward the wind’s source.',false,'It points away from it.'),
 fl('A windsock shows the wind direction and ___.',['strength','color','price','name'],'Its position tells you how strong.')]),
L('pat-leave','Leaving the pattern and the airport',[
 cd('Departing','To leave the airport, a pilot can climb straight out or exit with a 45-degree turn after passing pattern altitude. Make a radio call to say where you are going, and keep looking for traffic.'),
 cd('Arriving at another airport','At a new airport, listen to the weather or CTAF first, know the runway in use, and join the pattern. Learn from the airport chart and from the Chart Supplement before you go.')],
 'Plan the departure, announce it, keep watching.',[
 mc('What should a pilot do before leaving the pattern?',['Make a radio call and look for traffic','Turn off the radio','Dive','Close the window'],'Announce your plans.'),
 mc('What should you do before arriving at a new airport?',['Learn about it and listen to the radio','Wing it','Turn off the radio','Sleep'],'Preparation prevents surprises.'),
 mc('Where can you find airport details?',['The Chart Supplement','A cereal box','The tires','The seat'],'The Chart Supplement lists airports.'),
 tf('Pilots continue to scan for traffic after leaving.',true,'Always keep watching.'),
 tf('You never need to learn about a new airport first.',false,'Do your homework.'),
 fl('A pilot departs the pattern after climbing to pattern ___.',['altitude','speed','light','radio'],'Stay in the pattern altitude until clear.')])
]);
})();
