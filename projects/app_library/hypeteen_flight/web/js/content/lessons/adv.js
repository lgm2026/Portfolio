/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* PRIVATE PILOT 15 - ADVANCED AIRPLANES AND SPECIAL SKILLS */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,L}=H.dsl;
H.addLessons('adv',[
L('av-retract','Retractable gear',[
 cd('Gear up for speed','Some airplanes pull their wheels up after takeoff to reduce drag. This makes them faster. It also adds a gear system that must be checked before every landing.'),
 cd('GUMP check','Many pilots use GUMP before landing: Gas, Undercarriage, Mixture, Prop. Confirm three green lights for the gear. Forgetting the gear is a common mistake, so make the check a habit on every approach.')],
 'Down and locked before you land.',[
 mc('Why do some airplanes retract their gear?',['Less drag','More noise','More weight','Less speed'],'Speed.'),
 mc('What does the U in GUMP stand for?',['Undercarriage','Up','Under','Unit'],'Gear.'),
 mc('When do you check the gear?',['Before every landing','Never','Only at night','After landing'],'Habit.'),
 tf('Three green lights show the gear is down and locked.',true,'Usually.'),
 tf('Forgetting the gear is impossible.',false,'It happens.'),
 fl('GUMP includes Gas, Undercarriage, Mixture and ___.',['Prop','Pitot','Pump','Pad'],'Prop.')]),
L('av-cs','Constant-speed propellers',[
 cd('Adjustable blades','A constant-speed propeller changes the angle of its blades to hold the engine at a set RPM. The pilot sets RPM with the prop control and power with the throttle. It works like gears on a bike.'),
 cd('Manifold pressure','Because power is set by two controls, you watch manifold pressure and RPM. Reduce throttle before reducing RPM, and raise RPM before raising throttle. This keeps the engine from being overworked.')],
 'Throttle for power, prop for RPM.',[
 mc('What does a constant-speed prop hold?',['Engine RPM','Altitude','Heading','Fuel'],'RPM.'),
 mc('What does the throttle set?',['Manifold pressure','Heading','Frequency','Wind'],'Power.'),
 mc('It works like…',['Gears on a bike','A kite','A balloon','A sled'],'Changes blade angle.'),
 tf('The pilot controls blade angle through a governor.',true,'Yes.'),
 tf('The prop control sets altitude.',false,'It sets RPM.'),
 fl('MP stands for manifold ___.',['pressure','power','prop','pitch'],'Pressure.')]),
L('av-turbo','Turbocharging',[
 cd('More air','A turbocharger uses exhaust gas to spin a compressor that forces extra air into the engine. This keeps power high at altitude where the air is thin. Turbo engines can fly higher and faster.'),
 cd('Care required','Turbo engines run hot and need gentle handling. Watch temperatures, avoid sudden power changes and allow a cool-down before shut-down. Ask your instructor for the airplane’s specific rules.')],
 'Extra air, extra care.',[
 mc('What does a turbocharger do?',['Forces more air into the engine','Cools the cabin','Brakes the wheels','Lights the runway'],'Boost.'),
 mc('What spins the compressor?',['Exhaust gas','Wind','Fuel','Radio'],'Hot gas.'),
 mc('Why is care needed?',['It runs hot','It is quiet','It is light','It is pretty'],'Heat.'),
 tf('Turbos help at high altitude.',true,'Thin air.'),
 tf('Sudden power changes are good for turbos.',false,'Be gentle.'),
 fl('A turbocharger is driven by ___ gas.',['exhaust','cabin','fuel','wing'],'Exhaust.')]),
L('av-glass','Glass cockpits',[
 cd('Screens instead of dials','A glass cockpit uses digital screens for flight and engine information. A primary flight display shows attitude, speed and altitude. A multifunction display shows maps, weather and engine data.'),
 cd('New skills','Screens bring benefits, like moving maps, but also traps. Pilots can fixate on buttons. Learn the system well, keep scanning outside, and know how to fly if a screen fails.')],
 'Master the screens and still look outside.',[
 mc('Which glass-cockpit screen shows speed and altitude?',['The primary flight display','The engine page only','The checklist page only','The weather map only'],'The PFD carries the basic flight instruments.'),
 mc('What does an MFD show?',['Maps and engine data','Sandwiches','Cars','Stars only'],'Multifunction.'),
 mc('What is a risk of glass cockpits?',['Head-down fixation','Being too light','Being too quiet','Having wings'],'Look outside.'),
 tf('Pilots should still know how to fly if a screen fails.',true,'Backup skills.'),
 tf('Screens remove the need to look outside.',false,'Always look out.'),
 fl('PFD stands for primary flight ___.',['display','dial','door','drive'],'Display.')]),
L('av-auto','Autopilot basics',[
 cd('A helper','An autopilot is a system that helps fly the airplane. A simple one holds wings level; a better one holds altitude and follows a route. It reduces workload, but the pilot stays responsible.'),
 cd('Stay in charge','Always know what mode it is in and what it will do next. If it does something unexpected, disconnect it and fly by hand. Practice hand-flying so skills do not fade.')],
 'The pilot is always in command.',[
 mc('Who is responsible when the autopilot is on?',['The pilot','The autopilot','Nobody','The tower'],'Pilot in command.'),
 mc('What should you do if it acts strangely?',['Disconnect and hand-fly','Ignore it','Panic','Sleep'],'Take over.'),
 mc('Why hand-fly sometimes?',['Keep your skills sharp','Be slow','Use fuel','Be loud'],'Practice.'),
 tf('Know the autopilot’s mode.',true,'Mode awareness.'),
 tf('An autopilot can replace the pilot.',false,'It cannot.'),
 fl('Autopilot reduces ___.',['workload','weight','wings','wind'],'Workload.')]),
L('av-hp','High-performance airplanes',[
 cd('More power','A high-performance airplane has an engine over 200 horsepower. It flies faster and climbs better, but needs more training and attention. Pilots need special instruction before carrying passengers.'),
 cd('Complex too','A complex airplane has retractable gear, flaps and a controllable propeller. An advanced airplane adds more systems. Training builds the skills to manage speed, altitude and systems all at once.')],
 'More capability, more training.',[
 mc('What is the horsepower mark for high-performance?',['More than 200','More than 20','More than 2','More than 2,000'],'Over 200.'),
 mc('Which is part of a complex airplane?',['Retractable gear','Pedals only','A kite','Floats only'],'Gear, flaps, prop.'),
 mc('What is needed first?',['Special instruction','A snack','A nap','A hat'],'Training.'),
 tf('High-performance airplanes need more training.',true,'Yes.'),
 tf('Anyone can fly them without instruction.',false,'Training needed.'),
 fl('Complex airplanes have retractable ___.',['gear','seats','doors','lights'],'Gear.')]),
L('av-tw','Tailwheel airplanes',[
 cd('Two wheels forward','A tailwheel airplane, or taildragger, has two main wheels forward and a small wheel at the tail. It looks classic and is good for rough fields. It needs good footwork, especially on landing.'),
 cd('Ground loops','The center of gravity is behind the main wheels, so a swerve can grow quickly. This is a ground loop. Pilots keep the airplane straight with rudder and fly it all the way to a stop.')],
 'Keep it straight with the rudder.',[
 mc('Where is the third wheel on a taildragger?',['At the tail','At the nose','On the wing','Inside'],'Tail.'),
 mc('What is a ground loop?',['An uncontrolled swerve on the ground','A flying loop','A radio call','A taxi sign'],'A swerve.'),
 mc('What controls it?',['Rudder','Radio','Flaps','Fuel'],'Footwork.'),
 tf('Tailwheel pilots need good rudder skill.',true,'Yes.'),
 tf('Tailwheel planes are easier to land than tricycle gear.',false,'They take more skill.'),
 fl('A tailwheel plane is a ___.',['taildragger','twin','balloon','glider'],'Taildragger.')]),
L('av-seaplane','Seaplanes',[
 cd('Landing on water','A seaplane has floats and can land on lakes and rivers. A sea rating adds skills such as reading the water, docking and step taxi. There are no brakes, so the pilot uses wind and current.'),
 cd('Water rules','Water has its own rules: boats have right of way, and a smooth glassy surface is tricky because depth perception is lost. Pilots use a special approach for glassy water, with a steady power-on descent.')],
 'No brakes: plan with wind and current.',[
 mc('What does a seaplane have?',['Floats','Skis only','Wheels only','Tracks'],'Floats.'),
 mc('Why is glassy water hard?',['Depth perception is poor','It is slippery','It is loud','It is cold'],'No texture.'),
 mc('Who has the right of way on water?',['Boats','Seaplanes','Nobody','Birds'],'Be careful.'),
 tf('Seaplanes lack wheel brakes.',true,'Use wind and current.'),
 tf('A sea rating needs no training.',false,'It needs training.'),
 fl('Seaplanes use ___ instead of wheels.',['floats','skis','legs','tracks'],'Floats.')]),
L('av-glider','Gliders',[
 cd('Flying without an engine','A glider has no engine. It gets launched by tow plane or winch, then rides rising air called thermals to stay up. Pilots can fly for hours and hundreds of miles.'),
 cd('Skills for any pilot','Glider flying teaches energy management, feel for the airplane and judgment. Many airline pilots started in gliders. The first controls you learn are the same: stick, rudder and spoilers.')],
 'Gliders teach feel and energy management.',[
 mc('How do gliders stay up?',['Rising air','Engines','Rockets','Balloons'],'Thermals.'),
 mc('How are gliders launched?',['Tow plane or winch','Boat','Truck only','Car only'],'Tow or winch.'),
 mc('What do gliders teach?',['Energy management','Cooking','Typing','Painting'],'Great skills.'),
 tf('Gliders can fly for hours.',true,'Good conditions.'),
 tf('Gliders have powerful engines.',false,'No engine.'),
 fl('Rising warm air is called a ___.',['thermal','thunder','tide','tail'],'Thermal.')]),
L('av-balloon','Balloons and rotorcraft',[
 cd('Lighter than air','A hot-air balloon rises when the air inside is heated and falls as it cools. Pilots steer by changing altitude to find winds going in different directions. Balloon pilots need their own rating.'),
 cd('Helicopters','A helicopter lifts with spinning blades. It can hover and land in small places. Controls include the collective, cyclic and pedals. Helicopter pilots also need a separate rating and training.')],
 'Different aircraft, different ratings.',[
 mc('How does a balloon rise?',['Heated air inside','A motor','A wing','Wind only'],'Hot air.'),
 mc('How does a balloon pilot steer?',['By changing altitude','Using a rudder','Using a wheel','Using a tail'],'Different winds.'),
 mc('Which can hover?',['A helicopter','An airplane','A glider','A kite'],'Rotor lift.'),
 tf('Helicopters need a separate rating.',true,'Yes.'),
 tf('Balloons steer with a rudder.',false,'They use wind layers.'),
 fl('The helicopter’s lift comes from spinning ___.',['blades','wheels','wings','tails'],'Rotor blades.')])
]);
})();
