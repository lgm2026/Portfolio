/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* BEYOND 5 - AIRLINE PILOT */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,od,L}=H.dsl;
H.addLessons('airline',[
L('al-path','Paths to the airlines',[
 cd('Several routes','Airline pilots come from flight schools, university aviation programs, the military and flight instructing. Whatever the route, they earn ratings and build hours. Many start at regional airlines and move up.'),
 cd('The 1,500-hour rule','In the U.S., most airline pilots need an ATP certificate, which usually requires 1,500 hours. Some approved university programs and military service reduce this to as few as 1,000 or 1,250 hours.')],
 'Many roads lead to the airlines.',[
 mc('How many hours does an ATP usually need?',['1,500','150','15','15,000'],'Standard.'),
 mc('Where do many new airline pilots start?',['Regional airlines','Space','A boat','A bus'],'Smaller carriers.'),
 mc('Which can lower the hour requirement?',['Approved programs or military service','Wishing','Sleeping','Cooking'],'Some pathways.'),
 tf('Airline pilots can come from the military.',true,'Yes.'),
 tf('There is only one path.',false,'Many exist.'),
 fl('Many pilots build hours as flight ___.',['instructors','inspectors','islanders','inventors'],'Instructors.')]),
L('al-seat','Captain and first officer',[
 cd('Two pilots','Airliners have two pilots. The captain is in command and sits on the left. The first officer, also called the co-pilot, sits on the right. Both are fully trained to fly the airplane.'),
 cd('Pilot flying, pilot monitoring','On each leg, one pilot is the pilot flying and the other is the pilot monitoring. They swap roles. The monitoring pilot checks the flying pilot’s actions, handles radios and catches mistakes.')],
 'Two qualified pilots, always cross-checking.',[
 mc('Who is in command?',['The captain','The first officer','The passenger','The tower'],'Left seat.'),
 mc('What is a co-pilot also called?',['First officer','Copilot only','Cabin boss','Tower chief'],'First officer.'),
 mc('What does the pilot monitoring do?',['Checks and handles radios','Sleeps','Eats','Waits'],'Teamwork.'),
 tf('Both pilots are fully trained to fly.',true,'Yes.'),
 tf('The first officer is a passenger.',false,'They are a pilot.'),
 fl('The captain sits in the ___ seat.',['left','right','back','top'],'Left.')]),
L('al-crew','Cockpit teamwork',[
 cd('Crew resource management','Crew resource management, or CRM, teaches pilots to communicate, share workload and speak up. It began after accidents showed that teamwork failures caused many crashes. It is now taught worldwide.'),
 cd('Speak up','In good CRM, any crew member can raise a concern. The captain listens. Callouts like “Check” and “Standby” keep the team on the same page. A respectful culture saves lives.')],
 'Anyone can speak up; everyone listens.',[
 mc('What does CRM stand for?',['Crew resource management','Cloud radar monitor','Cabin radio mode','Captain rest method'],'Teamwork.'),
 mc('Why was CRM developed?',['Teamwork failures caused accidents','For fun','For speed','For snacks'],'Safety lessons.'),
 mc('Who can raise concerns?',['Any crew member','Only the captain','Nobody','Only passengers'],'Everyone.'),
 tf('The captain should listen to concerns.',true,'Yes.'),
 tf('First officers must stay silent.',false,'They should speak up.'),
 fl('CRM improves ___ in the cockpit.',['communication','cooking','color','cargo'],'Communication.')]),
L('al-check','Checklists and callouts',[
 cd('Challenge and response','Airline pilots use checklists for every phase. One pilot reads the item and the other responds after checking. This catches errors that a single person might miss.'),
 cd('Standard callouts','Standard words keep communication clear. “Positive rate” means climbing. “Gear up” gets the wheels retracted. “Rotate” says to lift the nose on takeoff. Everyone knows what each phrase means.')],
 'Same words, same meaning, every time.',[
 mc('What is challenge and response?',['One reads, the other checks and answers','Both guess','Both nap','Neither speaks'],'Teamwork.'),
 mc('What does “Rotate” mean on takeoff?',['Lift the nose','Turn the airplane','Stop','Spin'],'Takeoff call.'),
 mc('Why use standard words?',['To avoid confusion','To be fancy','To talk more','No reason'],'Clarity.'),
 tf('Checklists catch errors.',true,'Yes.'),
 tf('Callouts are different every flight.',false,'They are standard.'),
 fl('“Positive ___” means the airplane is climbing.',['rate','rule','root','room'],'Positive rate.')]),
L('al-sched','A pilot’s schedule',[
 cd('Trips and layovers','Airline pilots fly trips that may last several days. They stay in hotels between flights, called layovers. Schedules are built around legal limits on duty time and required rest.'),
 cd('Seniority','Pilots are ranked by how long they have worked at the airline. Seniority decides who gets better schedules, bigger airplanes and the captain’s seat. Newer pilots often fly less preferred trips.')],
 'Rest rules and seniority shape the schedule.',[
 mc('What is a layover?',['Time away between flights','A runway','A seat','A radio'],'Rest stop.'),
 mc('What decides schedule choices?',['Seniority','Weather','Colors','Luck'],'Time at the airline.'),
 mc('Why are rest rules needed?',['To fight fatigue','To waste time','For fun','For paint'],'Safety.'),
 tf('Pilots have limits on duty time.',true,'Yes.'),
 tf('All pilots get the same schedule.',false,'Seniority matters.'),
 fl('Pilots rank by ___.',['seniority','height','color','size'],'Seniority.')]),
L('al-dispatch','Dispatchers',[
 cd('The partner on the ground','Aircraft dispatchers share responsibility for each flight. They plan routes, check weather and decide fuel with the captain. They watch flights and help if something changes.'),
 cd('Working together','Before departure, pilots and dispatchers review the plan. If weather gets worse, they may change the route or divert. Both must agree the flight is safe to depart.')],
 'Pilot and dispatcher share the plan.',[
 mc('What does a dispatcher do?',['Plans flights and watches weather','Cleans seats','Serves food','Loads bags'],'Flight planning.'),
 mc('Who decides fuel?',['Captain and dispatcher','Passengers','Nobody','Tower'],'Shared decision.'),
 mc('What if weather worsens?',['Change the plan','Ignore it','Hide it','Hope'],'Adjust.'),
 tf('Dispatchers share responsibility.',true,'Yes.'),
 tf('A dispatcher sits in the cockpit.',false,'They work on the ground.'),
 fl('Dispatchers help ___ the route.',['plan','paint','pack','play'],'Plan.')]),
L('al-fuel','Fuel planning for airliners',[
 cd('Extra fuel','Airlines carry fuel for the trip plus extra: a reserve, fuel for an alternate airport, and contingency fuel for surprises. Extra weight costs money, so planners calculate carefully.'),
 cd('Captain’s decision','If conditions look worse than expected, the captain can add more fuel. Running low is never acceptable. A declared fuel emergency tells ATC the airplane needs priority.')],
 'Trip + alternate + reserve + contingency.',[
 mc('Which fuel is extra for surprises?',['Contingency','Cargo','Cabin','Cargo bay'],'Contingency.'),
 mc('What can the captain do?',['Add more fuel','Cut fuel','Hide fuel','Spill fuel'],'Authority.'),
 mc('What does a fuel emergency tell ATC?',['The airplane needs priority','Nothing','It is hungry','It is late'],'Declare it.'),
 tf('Extra fuel costs money.',true,'It adds weight.'),
 tf('Running low is acceptable.',false,'Never.'),
 fl('An alternate is a backup ___.',['airport','airline','alarm','arm'],'Airport.')]),
L('al-auto','Automation in airliners',[
 cd('Flight management','Airliners have flight management systems and autopilots that fly routes with great precision. Pilots program the route, monitor progress and take over when needed. Most of a trip is flown by automation.'),
 cd('Staying sharp','Pilots must not become too dependent on automation. Airlines require manual flying practice and training. If the automation fails, pilots need to fly by hand without fuss.')],
 'Automation helps; pilots must still fly.',[
 mc('What flies much of a long trip?',['Automation','Passengers','Wind','Luck'],'Autopilot.'),
 mc('What must pilots practice?',['Manual flying','Cooking','Dancing','Singing'],'Skills.'),
 mc('What is FMS?',['Flight management system','Fast mail service','Fuel mixing system','Fan mode setup'],'The route computer.'),
 tf('Pilots monitor the automation.',true,'Yes.'),
 tf('Pilots never need to hand-fly.',false,'They do.'),
 fl('FMS stands for flight ___ system.',['management','metal','mix','map'],'Management.')]),
L('al-weather','Weather for airline pilots',[
 cd('Weather radar','Airliners have weather radar in the nose. It shows heavy rain and storms ahead. Pilots steer around the worst parts, usually staying 20 miles or more from severe storms.'),
 cd('Turbulence','Turbulence can injure unbelted people. Pilots tell flight attendants and passengers to be seated when it is expected. Reports from other pilots, called PIREPs, help find smoother altitudes.')],
 'Go around storms; keep belts fastened.',[
 mc('Where is weather radar?',['In the nose','In the tail','In the seat','In the wheel'],'Looks ahead.'),
 mc('How far do pilots avoid severe storms?',['20 miles or more','2 feet','Zero','1 inch'],'A wide margin.'),
 mc('What helps find smoother air?',['PIREPs','Songs','Maps of cities','Movies'],'Pilot reports.'),
 tf('Keep seat belts fastened when seated.',true,'Yes.'),
 tf('Pilots fly through severe storms.',false,'They go around.'),
 fl('PIREP stands for pilot ___.',['report','race','rest','rule'],'Report.')]),
L('al-emerg','Emergencies in the air',[
 cd('Training for the worst','Airline pilots train yearly in simulators for engine fires, depressurization, hydraulic failure and more. They practice using checklists and working as a team until responses are automatic.'),
 cd('Aviate, navigate, communicate','Even in a big emergency, the first job is to fly the airplane. Next comes navigating to a safe place, then telling ATC and the crew. Calm teamwork saves lives.')],
 'Fly first, then talk.',[
 mc('What is the first job in an emergency?',['Fly the airplane','Call the tower','Eat','Hide'],'Aviate.'),
 mc('Where do pilots train for emergencies?',['Simulators','Parks','Cars','Boats'],'Safe practice.'),
 mc('What follows navigate?',['Communicate','Quit','Sleep','Dance'],'A-N-C.'),
 tf('Training makes responses automatic.',true,'Yes.'),
 tf('Pilots train only once in their career.',false,'Yearly.'),
 od('Put the priorities in order.',['Aviate','Navigate','Communicate'],'ANC.')]),
L('al-land','Landing a big airliner',[
 cd('Stabilized approach','Airliners must be stable on approach: right speed, configuration and glide path by 1,000 feet in clouds or 500 feet in clear weather. If not stable, they go around. This rule prevents many accidents.'),
 cd('Reverse thrust and brakes','After touchdown, pilots use spoilers, wheel brakes and reverse thrust to slow down. Long runways and anti-skid brakes help. Wet runways need extra care.')],
 'Not stable? Go around.',[
 mc('What do pilots do if the approach is not stable?',['Go around','Land anyway','Stop','Wait'],'Rule.'),
 mc('What helps slow after touchdown?',['Spoilers, brakes, reverse thrust','Wind','Fuel','Radios'],'Stopping tools.'),
 mc('What needs extra care?',['Wet runways','Dry runways','Sunny days','Calm nights'],'Longer stopping.'),
 tf('Stabilized approaches improve safety.',true,'Yes.'),
 tf('Wet runways are the same as dry.',false,'Stopping takes longer.'),
 fl('A go-around is the safe ___.',['choice','chair','chart','chase'],'Choice.')]),
L('al-pax','Customers and cabin crew',[
 cd('The whole team','Flights need pilots, flight attendants, ground crew, mechanics and dispatchers. Flight attendants are safety professionals trained for emergencies, medical events and evacuations.'),
 cd('Communication','The captain makes announcements and keeps the cabin informed about delays, turbulence or changes. Respect and clear words keep passengers calm and safe.')],
 'The cabin crew are part of the safety team.',[
 mc('What are flight attendants?',['Safety professionals','Only servers','Pilots','Mechanics'],'Trained for emergencies.'),
 mc('Who makes announcements?',['The captain','The tower','Passengers','Mechanics'],'Information.'),
 mc('Who else is on the team?',['Mechanics and dispatchers','Nobody','Only pilots','Only birds'],'Many people.'),
 tf('Cabin crew train for evacuations.',true,'Yes.'),
 tf('Flight attendants do no safety work.',false,'They do.'),
 fl('The captain keeps the ___ informed.',['cabin','cat','cart','cave'],'Cabin.')])
]);
})();
