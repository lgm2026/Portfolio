/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* STUDENT PILOT 4 - AIRPLANE SYSTEMS: electrical, pitot-static, gyros, compass, glass cockpits, radios, lights, flaps, cabin heat. */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,L}=H.dsl;
H.addLessons('systems',[
L('sys-elec','The electrical system',[
 cd('Battery and alternator','The battery starts the engine. After that, an alternator driven by the engine makes electricity for the radios, lights and instruments and recharges the battery. The master switch connects it all.'),
 cd('Breakers and fuses','Wires are protected by circuit breakers or fuses. If too much current flows, a breaker pops out to prevent a fire. The ammeter or load meter shows whether the alternator is keeping up.')],
 'Battery to start, alternator to run, breakers to protect.',[
 mc('What recharges the battery in flight?',['The alternator','The magneto','The compass','The tires'],'The alternator makes power once the engine is running.'),
 mc('What is the job of a circuit breaker?',['To stop too much current','To make current','To cool the engine','To start the engine'],'It trips to protect wires from overheating.'),
 mc('What does the master switch do?',['Connects the electrical system','Starts the oil','Opens the doors','Sets the altimeter'],'It links the battery and alternator to the airplane’s circuits.'),
 tf('The engine’s magnetos need the battery to make sparks.',false,'Magnetos make their own spark.'),
 tf('A popped circuit breaker is a signal to pay attention.',true,'It may mean a problem in that circuit.'),
 fl('The alternator is driven by the ___.',['engine','radio','wing','tire'],'It turns as the engine turns.')]),
L('sys-failure','If the electrical system fails',[
 cd('Signs of trouble','A discharge reading on the ammeter, a warning light, or dimming lights may mean the alternator has quit. The airplane is then running on battery power alone, and the battery will not last forever.'),
 cd('Save the battery','Turn off everything you do not need, tell someone where you are and what you plan to do, and land at a suitable airport. The engine will keep running because its magnetos do not depend on the battery.')],
 'Fly the airplane, shed the load, land sooner.',[
 mc('What does a discharge reading on the ammeter suggest?',['The alternator is not keeping up','The engine is perfect','Fuel is full','The tires are flat'],'The battery is supplying power instead.'),
 mc('Does the engine stop when the electrical system fails?',['Usually not, thanks to magnetos','Always','Only at night','Only in a climb'],'The ignition is independent of the electrical system.'),
 mc('What is a smart first step after an alternator failure?',['Turn off nonessential equipment','Turn on every light','Take off again','Ignore it'],'Reducing the load stretches the battery.'),
 tf('Battery power is limited.',true,'It will run out eventually.'),
 tf('The pilot should keep flying for hours with a failed alternator.',false,'Land soon while there is power for a safe landing.'),
 fl('Turning off extra equipment is called shedding the ___.',['load','road','code','node'],'Load shedding saves the battery.')]),
L('sys-pitot','The pitot-static system',[
 cd('Three instruments','The pitot tube catches moving air for the airspeed indicator. Static ports sense the still outside air pressure for the altimeter, the vertical speed indicator and also the airspeed indicator. Together this is the pitot-static system.'),
 cd('When it goes wrong','A blocked pitot tube can freeze the airspeed reading. A blocked static port can freeze the altimeter and vertical speed. Many airplanes have a pitot heater and an alternate static source for these problems.')],
 'Pitot for speed, static for height and climb.',[
 mc('Which instruments use the static ports?',['Altimeter and vertical speed','Tachometer','Compass','Oil gauge'],'Static pressure drives the altimeter and VSI.'),
 mc('What does the pitot tube catch?',['Moving air','Rain only','Radio waves','Fuel'],'Ram air pressure measures speed.'),
 mc('What is a pitot heater for?',['Preventing ice in the tube','Warming the cabin','Cooking','Charging the battery'],'Ice can block the tube.'),
 tf('A blocked static port can make the altimeter stick.',true,'The pressure no longer changes.'),
 tf('The tachometer is part of the pitot-static system.',false,'The tach is driven by the engine.'),
 fl('The ___ source is a backup for the static ports.',['alternate','secret','wooden','third'],'The alternate static source gives a backup.')]),
L('sys-gyro','Gyroscopic instruments',[
 cd('A spinning wheel','A gyroscope is a wheel that spins fast. Because of rigidity in space, it keeps pointing the same direction. The attitude indicator and heading indicator use gyros to show the airplane’s position even when you cannot see outside.'),
 cd('Powered two ways','Gyros are spun by suction from a vacuum pump or by electric motors. The turn coordinator uses a gyro that tips as the airplane turns. Gyros can drift slightly, so pilots reset the heading indicator to the compass.')],
 'A spinning gyro stays put, and the airplane turns around it.',[
 mc('What does a gyroscope keep doing?',['Pointing the same direction','Turning left','Making sound','Making fuel'],'Rigidity in space is its main property.'),
 mc('Which instrument uses a gyro to show nose position?',['Attitude indicator','Altimeter','Tachometer','Oil gauge'],'It shows pitch and bank.'),
 mc('How is a gyro spun?',['By vacuum or electric power','By hand','By wind only','By fuel'],'Some airplanes use suction, others electricity.'),
 tf('The heading indicator drifts and should be reset.',true,'Check it against the magnetic compass every 15 minutes or so.'),
 tf('Gyros never need power.',false,'They need power to keep spinning.'),
 fl('A gyro’s steady pointing is called ___ in space.',['rigidity','fluidity','humidity','velocity'],'Rigidity in space is the key property.')]),
L('sys-compass','The magnetic compass',[
 cd('Simple and reliable','The magnetic compass is a floating card that lines up with the Earth’s magnetic field. It needs no power. It is the backup for all other heading instruments, though it takes patience to read.'),
 cd('Known errors','Because of variation, the difference between true north and magnetic north, and deviation, caused by metal and electronics in the airplane, the compass needs correcting. It also lags and swings during turns and accelerations.')],
 'Read the compass in smooth, level flight.',[
 mc('Does the magnetic compass need electricity?',['No','Yes, always','Only at night','Only in clouds'],'It simply floats and lines up with Earth’s magnetic field.'),
 mc('What is magnetic variation?',['The difference between true and magnetic north','A kind of turn','A fuel mix','A radio band'],'Magnetic north is not at the same place as true north.'),
 mc('What causes deviation?',['Metal and electrical gear in the airplane','The sun','Clouds','The tires'],'Local magnetic fields push the card.'),
 tf('The compass is most trustworthy in smooth, level flight.',true,'It swings in turns and bumps.'),
 tf('The compass is perfect in every situation.',false,'It has known errors.'),
 fl('The compass is a ___ card that floats in fluid.',['magnetic','metal','mirror','map'],'The card is magnetized.')]),
L('sys-glass','Glass cockpits',[
 cd('Screens instead of dials','A glass cockpit uses flat screens to show instruments. The primary flight display shows attitude, airspeed, altitude and heading in one picture, and a multi-function display shows maps, engine data and weather.'),
 cd('Smart sensors','Instead of mechanical gyros, solid-state sensors form an attitude and heading system. That makes glass cockpits very reliable, but pilots still need to know the basics in case a screen fails.')],
 'Glass is great, but know the basics.',[
 mc('What does a PFD show?',['Primary flying instruments','Only the radio','Only the map','Only fuel'],'PFD stands for primary flight display.'),
 mc('What does an MFD usually show?',['Maps, engine and weather data','Only airspeed','Only the clock','Nothing'],'MFD means multi-function display.'),
 mc('What replaces mechanical gyros in many glass cockpits?',['Solid-state sensors','Wooden wheels','Mirrors','Flags'],'Electronic sensors are very reliable.'),
 tf('A glass cockpit can fail like any other equipment.',true,'Backup instruments and good basics matter.'),
 tf('Pilots with glass cockpits can forget the basics.',false,'Fundamentals remain essential.'),
 fl('A glass cockpit uses flat ___.',['screens','sails','skis','seals'],'Displays replace round dials.')]),
L('sys-radio','Radios, transponder and ADS-B',[
 cd('Talking and navigating','The com radio is for talking with the tower and other pilots. The nav radio helps with navigation signals. A transponder replies to radar with a four-digit code, and the standard code for VFR flying is 1200.'),
 cd('ADS-B','ADS-B Out broadcasts the airplane’s position from GPS so controllers and other aircraft can see it. ADS-B In brings traffic and weather into the cockpit. ADS-B Out is required in much of the airspace.')],
 'Com to talk, transponder to be seen, ADS-B to share position.',[
 mc('What is the standard VFR transponder code?',['1200','7700','0000','9999'],'1200 is the standard VFR squawk in the United States.'),
 mc('What does ADS-B Out do?',['Broadcasts the airplane’s position','Starts the engine','Controls flaps','Cools the cabin'],'It sends GPS position to controllers and other aircraft.'),
 mc('What is the com radio used for?',['Talking','Navigating only','Weighing the airplane','Heating'],'Com is short for communications.'),
 tf('A transponder replies to radar.',true,'It sends a code and altitude back.'),
 tf('1200 means an emergency.',false,'7700 is the emergency code.'),
 fl('The emergency transponder code is ___.',['7700','1200','0000','1111'],'7700 squawk means emergency.')]),
L('sys-lights','Lights and the ELT',[
 cd('Being seen','Airplanes carry position lights (red on the left wing, green on the right, white on the tail), strobes and a beacon so they can be seen. A landing light helps the pilot see and be seen on the way in.'),
 cd('The ELT','An emergency locator transmitter, or ELT, sends a distress signal if the airplane crashes. It helps rescuers find the wreck quickly. Most ELTs are triggered by an impact and can also be turned on by hand.')],
 'Red left, green right, white behind.',[
 mc('What color is the left wingtip light?',['Red','Green','White','Blue'],'Red on the left (port) side, green on the right.'),
 mc('What does an ELT do?',['Sends a distress signal after a crash','Fuels the plane','Steers the plane','Plays music'],'It helps rescuers find the airplane.'),
 mc('What are strobes for?',['Being seen','Heating','Fuel','Sound'],'Bright flashes make the airplane visible.'),
 tf('The right wingtip light is green.',true,'Green on the right.'),
 tf('An ELT is a radio for chatting.',false,'It is for emergencies.'),
 fl('Red on the left, green on the ___.',['right','back','top','front'],'Navigation lights follow this rule.')]),
L('sys-flaps','Flaps and trim systems',[
 cd('Flaps','Flaps are hinged surfaces on the trailing edge of the wing. Lowering them adds lift and drag so the airplane can fly slower and descend more steeply. They are used for takeoff and landing.'),
 cd('Trim','The trim system lets the pilot relieve control pressure so the airplane flies hands-off at a chosen attitude. A trim wheel or switch moves a small tab on the elevator, or the whole stabilizer.')],
 'Flaps add lift and drag. Trim takes the pressure off.',[
 mc('What do flaps add?',['Lift and drag','Fuel','Radio power','Weight only'],'Lowered flaps let the airplane fly slower.'),
 mc('What does trim do?',['Relieves control pressure','Starts the engine','Makes sparks','Charges the battery'],'Trim keeps your hands from tiring.'),
 mc('Where are flaps located?',['Trailing edge of the wing','Nose','Tires','Tail only'],'They hinge at the back of the wing.'),
 tf('Flaps are used during takeoff and landing.',true,'They help at low speeds.'),
 tf('Trim is used to turn the airplane.',false,'Trim relieves pressure, it does not steer.'),
 fl('Flaps make the airplane fly ___ without stalling.',['slower','faster','upside-down','higher'],'Flaps lower the stalling speed.')]),
L('sys-cabin','Cabin heat and carbon monoxide',[
 cd('Where cabin heat comes from','In many small airplanes, cabin heat comes from air warmed by the engine’s exhaust system. If there is a crack in the exhaust, carbon monoxide can leak into the cabin.'),
 cd('A silent danger','Carbon monoxide has no color and no smell. Headache, drowsiness, and dizziness can be signs. If you suspect it, turn off the heater, open the vents, and land as soon as you can. A detector in the cabin adds protection.')],
 'Headache and drowsy? Heat off, vents open, land.',[
 mc('Can you smell carbon monoxide?',['No, it has no smell','Yes, it smells like roses','Yes, strongly','Only at night'],'It is colorless and odorless.'),
 mc('What is a sign of carbon monoxide?',['Headache and drowsiness','Hunger','Bright lights','Ear popping only'],'These symptoms can start slowly.'),
 mc('What should you do if you suspect carbon monoxide?',['Heat off, vents open, land soon','Close all vents','Turn up the heater','Keep flying for hours'],'Fresh air and a quick landing protect you.'),
 tf('A carbon monoxide detector adds safety.',true,'Detectors give an early warning.'),
 tf('Carbon monoxide has a strong smell.',false,'It is dangerous because you cannot smell it.'),
 fl('Carbon monoxide has no color and no ___.',['smell','weight','sound','speed'],'You cannot notice it without a detector.')])
]);
})();
