/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* STUDENT PILOT 10 - FLYING SAFE: lookout, collision geometry, right-of-way, wake, runway incursions, birds, ground safety, low flying, distractions. */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,od,L}=H.dsl;
H.addLessons('safety',[
L('saf-look','Seeing and avoiding',[
 cd('Big sky, small airplanes','In good weather, pilots are responsible for seeing other aircraft and staying clear. This is called see and avoid. Even with radar and radios, the pilot’s eyes are the most important collision-avoidance tool.'),
 cd('How to scan','Do not stare at one spot. Look in sections, pausing for a second in each. Your eyes see sharply only in a tiny central spot, so moving them in steps helps you spot small, distant airplanes.')],
 'Scan in steps. Pause. Repeat.',[
 mc('What is see and avoid?',['Looking for aircraft and staying clear','A radio call','A kind of landing','A chart symbol'],'It’s the basic rule of VFR collision avoidance.'),
 mc('How should you scan?',['In steps, pausing in each section','Staring at one point','Eyes closed','Only at instruments'],'Eyes see best in a small central area.'),
 mc('What is the pilot’s best collision-avoidance tool?',['Eyes','Coffee','The radio only','Paint'],'Lookout is essential.'),
 tf('Radar replaces the need for looking outside.',false,'Radar helps but pilots must still look.'),
 tf('A small airplane can be hard to see far away.',true,'That’s why scanning technique matters.'),
 fl('Staring at one spot is a poor ___ technique.',['scan','taxi','radio','landing'],'Scan in steps instead.')]),
L('saf-bearing','The still target',[
 cd('A trick of geometry','An airplane that stays in the same place in your window while getting bigger is on a collision course with you. Because it is not moving across your view, it is easy to miss. Constant position and growing size are a warning.'),
 cd('What to do','If you spot a still target, check it carefully and make a clear, early change of direction. Do not wait. Small moving targets are less dangerous than ones that seem to hang motionless in your window.')],
 'No relative motion? Collision risk.',[
 mc('An airplane that stays in the same spot in your window and grows is…',['On a collision course','Passing safely','Landing','Too far to matter'],'No change in bearing means a collision course.'),
 mc('Which target is easiest to miss?',['One that doesn’t move in your window','One moving across quickly','A bright red one','One near the ground'],'Still targets blend into the view.'),
 mc('What should you do?',['Make a clear, early turn','Wait and see','Close the window','Call a friend'],'Act early.'),
 tf('A target that stays still can be dangerous.',true,'Constant bearing is the classic warning.'),
 tf('Targets crossing quickly are always the biggest risk.',false,'The still ones are riskier.'),
 fl('A collision course target has constant ___.',['bearing','color','speed','weight'],'Constant bearing and growing size.')]),
L('saf-row','Right-of-way in the air',[
 cd('Who goes first','When two aircraft are on a collision course head-on, both turn right. When they are converging, the aircraft on the right has the right-of-way. When overtaking, the faster one passes on the right. Aircraft landing have the right-of-way over those still in the air.'),
 cd('Less maneuverable aircraft','Aircraft that are harder to maneuver get priority. Balloons come first, then gliders, then airships, then aircraft towing others, then ordinary airplanes and helicopters. Everyone must still use good judgment to avoid collisions.')],
 'Head-on: right. Converging: yield to the right.',[
 mc('What do two airplanes do in a head-on conflict?',['Both turn right','Both turn left','Both climb','Both stop'],'Right is the standard.'),
 mc('In a converging conflict, who has the right-of-way?',['The aircraft on the right','The aircraft on the left','The faster one','The bigger one'],'The pilot on the other’s right has priority.'),
 mc('Which has priority?',['A balloon','A jet airliner','A cargo plane','A trainer'],'Less maneuverable aircraft have priority.'),
 tf('Landing aircraft have the right-of-way over those in flight.',true,'The lowest aircraft on final comes first.'),
 tf('Overtaking aircraft pass on the left.',false,'Pass to the right.'),
 od('Put these in order of right-of-way priority.',['Balloon','Glider','Airship','Airplane'],'Maneuverability sets priority.')]),
L('saf-wake','Wake turbulence',[
 cd('Invisible tornadoes','Every wing makes swirling air at the wingtips. Big, heavy airplanes in a clean configuration make the strongest ones, called wingtip vortices. They sink and drift with the wind and can flip a small airplane.'),
 cd('Staying clear','Stay above and upwind of a larger airplane’s path. Wait at least two minutes before taking off after a larger airplane. Land beyond where it touched down. A calm wind can leave vortices lingering on the runway.')],
 'Stay above, stay upwind, give it time.',[
 mc('What are wingtip vortices?',['Swirls of air from the wingtips','Radio noise','Cloud types','Engine sounds'],'Lift creates them.'),
 mc('How long should you normally wait to take off behind a larger airplane?',['At least two minutes','Two seconds','Two hours','No wait'],'Give vortices time to settle.'),
 mc('Where should you stay compared to a larger airplane’s path?',['Above and upwind','Below and downwind','Behind and level','Right behind'],'Vortices sink and drift.'),
 tf('Vortices sink behind the airplane.',true,'They descend several hundred feet.'),
 tf('Calm wind makes wake turbulence disappear.',false,'Calm wind can leave it hanging around.'),
 fl('Wake ___ is strongest behind a heavy aircraft.',['turbulence','radio','light','cloud'],'Larger airplanes make stronger wakes.')]),
L('saf-incursion','Runway incursions',[
 cd('What they are','A runway incursion is when an aircraft, vehicle or person is on a runway without permission. They are among the most serious airport hazards. Many involve confusion about where a pilot is or what the controller said.'),
 cd('How to prevent them','Read back hold short instructions, keep an airport diagram in your lap, and stay on the yellow line. If you are unsure where you are, stop and ask. Never cross a runway hold line without permission.')],
 'Unsure? Stop and ask.',[
 mc('What is a runway incursion?',['Being on a runway without permission','A radio failure','A fuel stop','A kind of landing'],'It is an unauthorized runway entry.'),
 mc('What should you do if unsure where you are on the airport?',['Stop and ask','Keep going','Take off','Turn off lights'],'Stopping is safe.'),
 mc('What helps you navigate the airport?',['An airport diagram','A paper plane','A mirror','A watch'],'The diagram shows taxiways and runways.'),
 tf('You must read back hold short instructions.',true,'It confirms understanding.'),
 tf('Crossing a hold line without permission is fine.',false,'Never do that.'),
 fl('An airport ___ shows taxiways and runways.',['diagram','recipe','poem','joke'],'A diagram helps you stay oriented.')]),
L('saf-birds','Birds and wildlife',[
 cd('Bird strikes','Birds are a real hazard, especially near airports and at low altitude. A bird strike can break a windshield or damage an engine or propeller. Most strikes happen below 3,000 feet.'),
 cd('Avoiding them','Scan ahead. Avoid flying through flocks. Birds usually dive when threatened, so the pilot who turns slightly above them can avoid contact. Report strikes after landing so airports can manage wildlife.')],
 'Look ahead, avoid flocks, report strikes.',[
 mc('Where do most bird strikes happen?',['Low altitude, near airports','Above 30,000 feet','On the ground only','At sea only'],'Birds live low.'),
 mc('How can a pilot avoid a flock?',['Turn or climb away if possible','Fly straight through','Turn off the radio','Slow down'],'Plan a path around.'),
 mc('Why report a bird strike?',['So airports can manage wildlife','For fun','To get a prize','No reason'],'Reports help future safety.'),
 tf('Birds can damage windshields.',true,'They can hit hard at flying speeds.'),
 tf('Birds always fly above airplanes.',false,'They fly at many altitudes.'),
 fl('A bird ___ happens when an airplane hits a bird.',['strike','game','dance','stop'],'Strike is the standard term.')]),
L('saf-ground','Safety around the airplane',[
 cd('Propeller respect','Always treat a propeller as if the engine could start. Never walk through the propeller arc, and never stand in front of one. Never touch a propeller; hand-starting is for specially trained people only.'),
 cd('Fueling and ground rules','Fueling needs no smoking, no open flames, and a grounded airplane to prevent sparks. Keep people away from the front of the airplane and from the propeller’s wash. Chock the wheels and set the brakes when parked.')],
 'Every prop is live until it is proven off.',[
 mc('How should you treat a propeller?',['As if the engine could start','As harmless','As a toy','As a fan'],'Respect it always.'),
 mc('What should be done when parking?',['Chock the wheels and set the brakes','Leave it in gear','Leave the door open','Tie to a tree'],'It prevents rolling.'),
 mc('Why ground an airplane while fueling?',['To prevent sparks from static','To warm the engine','To save fuel','To listen to music'],'Static can ignite fuel vapors.'),
 tf('You should never walk through a propeller arc.',true,'It is dangerous.'),
 tf('Smoking near fueling is fine if you are careful.',false,'No smoking, ever.'),
 fl('A propeller ___ is the circle the blades sweep.',['arc','line','shadow','tip'],'Stay out of it.')]),
L('saf-low','Flying low and minimum altitudes',[
 cd('Rules of altitude','Over a crowded area, a city or a gathering of people, pilots must stay at least 1,000 feet above the highest obstacle within 2,000 feet. Elsewhere the minimum is generally 500 feet above the ground, and not closer than 500 feet to any person, vehicle or structure over open water or sparse areas.'),
 cd('Hidden hazards','Towers, power lines and cables can be hard to see. They may be marked on charts and by lights, but guy wires are thin. Staying at a safe height and planning your route helps avoid them.')],
 'Stay high enough to see and avoid.',[
 mc('What is the general minimum altitude over open ground?',['500 feet above the ground','50 feet','5 feet','100 feet'],'Rules set safe minimums.'),
 mc('What is the minimum over a congested area?',['1,000 feet above the highest obstacle','10 feet','500 feet','No limit'],'Higher altitudes protect people on the ground.'),
 mc('Which is hard to see from the air?',['Power lines and guy wires','Big runways','Large lakes','Tall clouds'],'Thin wires are hard to spot.'),
 tf('Charts show towers and many obstacles.',true,'Check them when planning.'),
 tf('You can buzz people to say hello.',false,'Low flying near people is dangerous and illegal.'),
 fl('Low-flying hazards include power ___.',['lines','boats','roads','clouds'],'Wires are a major danger.')]),
L('saf-distract','Distractions and the sterile cockpit',[
 cd('Where accidents begin','Many accidents begin with a small distraction: a phone, a chat, a dropped pen. Even a few seconds of looking away can let an airplane drift or miss a call. Pilots plan to avoid being distracted at critical moments.'),
 cd('Sterile cockpit','During takeoff, landing and other busy times, only flying topics are discussed. This habit is called a sterile cockpit. Put phones in airplane mode, brief passengers, and stop other conversations if the workload rises.')],
 'Busy moments need quiet cockpits.',[
 mc('What is a sterile cockpit?',['Only flying talk in busy moments','A clean cockpit','A cockpit with no seats','A cockpit with alcohol'],'It reduces distraction.'),
 mc('When is a quiet cockpit most important?',['During takeoff and landing','During lunch','On the ground','Never'],'Those are busy phases.'),
 mc('What should be done with phones?',['Silence them','Play games','Make calls','Take photos only'],'Silence prevents distraction.'),
 tf('Small distractions can lead to big accidents.',true,'Awareness matters.'),
 tf('A passenger should talk constantly during landing.',false,'Brief them to stay quiet at busy times.'),
 fl('A sterile cockpit means only flying ___ at busy times.',['talk','jokes','songs','games'],'Keep conversation about the flight.')])
]);
})();
