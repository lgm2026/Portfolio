/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* BEYOND 3 - COMMERCIAL PILOT */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,L}=H.dsl;
H.addLessons('comm',[
L('cm-what','Flying for a living',[
 cd('Paid pilots','A commercial pilot is paid to fly. Jobs include tours, banner towing, pipeline patrol, aerial photography, skydive drops, charter flights and ferrying airplanes. The commercial certificate is the first step in a paid career.'),
 cd('Requirements','The usual rules call for 250 hours of flight time, a second-class medical, and a practical test. The commercial test is stricter than the private one. The certificate adds responsibility, since passengers and customers depend on you.')],
 'Commercial = paid to fly.',[
 mc('What does a commercial pilot do?',['Flies for pay','Flies for fun only','Fixes planes','Sells tickets'],'Paid flying.'),
 mc('Which is a commercial flying job?',['Banner towing','Napping','Painting','Singing'],'Paid flights.'),
 mc('How many hours are usually required?',['250','25','2','2,500'],'Under the common rule.'),
 tf('The commercial test is stricter than private.',true,'Yes.'),
 tf('A private pilot may fly for hire.',false,'Not without commercial.'),
 fl('Commercial pilots must hold a second-class ___.',['medical','menu','map','mark'],'Medical.')]),
L('cm-chand','Chandelles',[
 cd('A climbing turn','A chandelle is a maximum-performance climbing turn of 180 degrees. The pilot trades speed for height while turning smoothly. It ends just above stall speed with the wings level.'),
 cd('Skills it teaches','Chandelles teach coordination and control at low speeds. The pilot must keep a steady bank and pitch and use rudder correctly. Smooth control is more important than speed.')],
 'Smooth climbing turn, finishing just above stall speed.',[
 mc('How many degrees does a chandelle turn?',['180','90','360','45'],'A half circle.'),
 mc('What is traded in a chandelle?',['Speed for height','Fuel for speed','Weight for lift','Time for sleep'],'Energy trade.'),
 mc('What does it teach?',['Coordination at low speed','Cooking','Typing','Reading'],'Control.'),
 tf('A chandelle ends with wings level.',true,'Yes.'),
 tf('A chandelle is a straight dive.',false,'It is a climbing turn.'),
 fl('A chandelle is a climbing ___.',['turn','dive','slide','jump'],'Turn.')]),
L('cm-lazy','Lazy eights',[
 cd('A figure on the sky','A lazy eight is a gentle maneuver that traces a figure eight on its side. The nose rises and falls while the airplane turns left and right. Speed and altitude change smoothly.'),
 cd('Why it matters','Lazy eights test a pilot’s control feel at changing airspeeds. They require constant adjustments of pitch, bank and rudder. Good ones look relaxed and smooth.')],
 'Smooth and symmetrical is the goal.',[
 mc('What shape does a lazy eight trace?',['A sideways eight','A circle','A square','A triangle'],'Figure eight.'),
 mc('What changes smoothly?',['Pitch, bank and speed','Nothing','Only radio','Only fuel'],'Constantly.'),
 mc('Does it need constant adjustments?',['Yes','No','Never','Sometimes'],'Many inputs.'),
 tf('Good lazy eights look relaxed.',true,'Yes.'),
 tf('A lazy eight is fast and sharp.',false,'It is gentle.'),
 fl('A lazy ___ is a gentle figure.',['eight','four','nine','ten'],'Eight.')]),
L('cm-eight','Eights on pylons',[
 cd('Pylon turns','Eights on pylons ask the pilot to fly figure eights around two points on the ground, keeping the wing tip pointed at each point. The right altitude changes with ground speed, called pivotal altitude.'),
 cd('Wind effect','In a wind, the ground speed changes around the turn. The pilot climbs or descends slightly to keep the wing tip on the point. It trains judgment of wind and altitude.')],
 'Altitude changes with ground speed.',[
 mc('What are you pointing at?',['A point on the ground','The sun','A cloud','A bird'],'The pylon.'),
 mc('What changes the correct altitude?',['Ground speed','Color','Sound','Taste'],'Pivotal altitude.'),
 mc('If you drift away from the point…',['Adjust altitude','Do nothing','Quit','Stall'],'Climb or descend.'),
 tf('Wind affects pylon eights.',true,'Yes.'),
 tf('The altitude never changes.',false,'It changes.'),
 fl('Pivotal ___ depends on ground speed.',['altitude','airport','attitude','arrival'],'Altitude.')]),
L('cm-steep','Steep spirals',[
 cd('Descending circles','A steep spiral is a descending turn around a point on the ground with a steady radius. The pilot adjusts the bank as the wind changes. It is used to lose altitude while staying near a point.'),
 cd('Emergency use','A steep spiral can help lose altitude over a landing field in an emergency. Pilots must stay within speed limits and avoid too much bank. Smooth technique matters.')],
 'Circle around a point while descending.',[
 mc('What is a steep spiral?',['A descending turn around a point','A climb','A takeoff','A straight line'],'Circles down.'),
 mc('What does the bank change with?',['The wind','The radio','The song','The color'],'Wind.'),
 mc('When might it help?',['Losing altitude over a field','Climbing','Dancing','Sleeping'],'Emergencies.'),
 tf('The radius should stay constant.',true,'Yes.'),
 tf('You can use unlimited bank.',false,'Respect limits.'),
 fl('A steep ___ is a descending turn.',['spiral','square','sphere','spot'],'Spiral.')]),
L('cm-charter','Charter flying',[
 cd('Air taxi','Charter flights carry passengers or cargo for hire on demand. Rules for charter, called Part 135, are stricter than for private flying. Pilots follow detailed operating procedures and training.'),
 cd('Customer service','Charter pilots must be reliable and professional. They plan fuel, weather and alternates carefully. Customers trust them to make safe decisions, even if that means a delay.')],
 'Charter is for hire, with stricter rules.',[
 mc('What is charter flying?',['Flying passengers for hire on demand','Flying for fun','Flying models','Flying kites'],'On demand.'),
 mc('Which rules apply?',['Part 135','Part 1','Part 10','Part 0'],'Commuter and on-demand.'),
 mc('What must charter pilots do?',['Make safe decisions, even delays','Fly in any weather','Skip checks','Hurry'],'Safety first.'),
 tf('Charter pilots plan alternates.',true,'Yes.'),
 tf('Charter has the same rules as private flying.',false,'Stricter.'),
 fl('Charter rules are in Part ___.',['135','1','5','50'],'135.')]),
L('cm-tour','Tour and sightseeing',[
 cd('Showing the view','Tour pilots fly passengers over cities, canyons or volcanoes. They need local knowledge, weather judgment and smooth flying. Many tours fly helicopters or small airplanes.'),
 cd('Rules for tours','Tours often must follow minimum altitudes and special routes to protect people and nature. Pilots narrate while flying and keep safety first. Good tour pilots love teaching others to see the world.')],
 'Great views, strict rules.',[
 mc('What do tour pilots show passengers?',['Scenic places','Their sandwiches','Movies','Tickets'],'Sightseeing.'),
 mc('Why follow special routes?',['To protect people and nature','To get lost','To save time','To be loud'],'Rules.'),
 mc('What do tour pilots need?',['Local knowledge','Nothing','A parrot','A tent'],'Know the area.'),
 tf('Some tours use helicopters.',true,'Yes.'),
 tf('Tour pilots ignore altitude limits.',false,'They follow them.'),
 fl('Tours show ___ views.',['scenic','secret','silent','sleepy'],'Scenic.')]),
L('cm-banner','Banner towing and aerial work',[
 cd('Special jobs','Some commercial pilots tow banners, photograph land, survey pipelines, spot wildlife or spray crops. These jobs often take place low and slow, so they require high skill and caution.'),
 cd('Risks and rules','Low-level flying brings wires, towers and birds. Pilots follow minimum altitude rules for their work and use special waivers. Each job needs training for its hazards.')],
 'Special jobs need special training.',[
 mc('Which is an aerial job?',['Pipeline patrol','Cooking','Baking','Singing'],'Looking at pipelines.'),
 mc('What is a risk of low flying?',['Wires and towers','Sunburn','Boredom','Rain only'],'Obstacles.'),
 mc('How do pilots handle risks?',['Training and rules','Luck','Speed','Silence'],'Prepare.'),
 tf('Banner towing is low and slow.',true,'Yes.'),
 tf('Aerial work has no hazards.',false,'It does.'),
 fl('Some pilots tow a ___ behind the plane.',['banner','boat','bus','bed'],'Banner.')]),
L('cm-ferry','Ferry and delivery',[
 cd('Moving airplanes','Ferry pilots deliver airplanes from one place to another, sometimes across oceans. Long trips need extra fuel tanks, survival gear and careful planning of weather and fuel stops.'),
 cd('Planning ahead','They file flight plans, check customs rules and prepare for emergencies. A ferry flight can take days. Good planning matters most when no help is nearby.')],
 'Plan fuel, weather and rescue gear.',[
 mc('What do ferry pilots do?',['Deliver airplanes','Sell tickets','Fix engines','Paint planes'],'Deliveries.'),
 mc('What do ocean flights need?',['Extra fuel and survival gear','Sandwiches only','A tent only','Nothing'],'Preparation.'),
 mc('Why plan carefully?',['Help is far away','It is fun','No reason','To be slow'],'Safety.'),
 tf('Ferry flights can last days.',true,'Yes.'),
 tf('Ferry pilots skip flight plans.',false,'They file them.'),
 fl('Ferry pilots move ___ between places.',['airplanes','trains','buses','boats'],'Airplanes.')]),
L('cm-pro','Professionalism',[
 cd('The professional pilot','Paid pilots earn trust through preparation, honesty and calm judgment. They arrive early, brief clearly, follow checklists and speak up about safety concerns. Passengers rely on them.'),
 cd('Good habits','Professionals keep records, study regularly, take care of themselves and respect others. They treat every flight as important, no matter how routine. That habit keeps people safe.')],
 'Prepared, honest, calm, every flight.',[
 mc('What builds trust?',['Preparation and honesty','Bragging','Rushing','Guessing'],'Professional habits.'),
 mc('How should a pilot treat routine flights?',['As important','As boring','As skipped','As jokes'],'Each one counts.'),
 mc('What should pilots do with safety concerns?',['Speak up','Hide them','Ignore them','Wait'],'Communicate.'),
 tf('Professionals use checklists.',true,'Yes.'),
 tf('A professional skips study after getting a license.',false,'They keep learning.'),
 fl('Professionals are prepared and ___.',['honest','hasty','hidden','hungry'],'Honest.')])
]);
})();
