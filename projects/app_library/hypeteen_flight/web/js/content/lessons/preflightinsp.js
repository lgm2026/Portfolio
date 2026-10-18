/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* STUDENT PILOT 2 - PREFLIGHT INSPECTION: the walkaround, section by section. */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,od,L}=H.dsl;
H.addLessons('preflightinsp',[
L('pf-why','Why the preflight matters',[
 cd('The pilot decides','Before every flight, the pilot in command must decide that the airplane is safe to fly. Nobody else can do it for you. The preflight inspection is how pilots check the airplane with their own eyes and hands.'),
 cd('Use the checklist','Every airplane has a checklist in its Pilot’s Operating Handbook. Follow it step by step. A checklist beats memory because it catches the little things that are easy to forget when you are in a hurry.')],
 'Checklist in hand, eyes on the airplane.',[
 mc('Who decides the airplane is safe to fly?',['The pilot in command','The passengers','The fuel truck driver','The tower'],'The pilot in command is responsible for the airplane’s condition.'),
 mc('What should a pilot use during a preflight?',['The checklist','A guess','A coin flip','A radio'],'The checklist makes sure nothing is skipped.'),
 mc('What does POH stand for?',['Pilot’s Operating Handbook','Plane Over Hangar','Prop On Hold','Power Of Heat'],'The POH is the airplane’s own manual.'),
 tf('A short checklist is better than trying to remember everything.',true,'Memory fails, especially when rushed.'),
 tf('Another person can be responsible for your preflight.',false,'The pilot in command is always responsible.'),
 fl('A preflight is done before ___ flight.',['every','one','some','no'],'Pilots preflight every time they fly.')]),
L('pf-cabin','Cabin check first',[
 cd('Papers and switches','Inside the cabin the pilot checks that the required documents are on board and that the switches are off. Then the master switch goes on briefly so the pilot can check fuel gauges, lights and flap operation.'),
 cd('Everything in reach','Make sure loose items are stowed and nothing can jam the controls. Check that the control wheel moves fully in every direction. Put the flaps down so you can inspect them.')],
 'Papers aboard, switches off, controls free.',[
 mc('What should the controls do during the cabin check?',['Move freely in every direction','Stay stuck','Be removed','Be painted'],'Free and correct movement is essential.'),
 mc('Why turn the master switch on briefly?',['To check gauges, lights and flaps','To start the engine','To charge your phone','To fill the tanks'],'The electrical system powers the gauges and lights.'),
 mc('What should be done with loose items?',['Stow them so they cannot jam the controls','Leave them on the floor','Throw them out','Tape them to the yoke'],'A loose item under a pedal could be dangerous.'),
 tf('The pilot checks the required papers are aboard.',true,'Required documents must be in the airplane.'),
 tf('Flaps never need checking.',false,'Pilots check that flaps move and look right.'),
 fl('The ___ switch connects the battery to the electrical system.',['master','radio','wing','tail'],'The master switch powers the airplane’s electrical system.')]),
L('pf-wing','Looking over the wing',[
 cd('Control surfaces','On each wing the pilot checks the aileron and the flap. Look for damage, loose hinges, and anything that does not move freely. Check that the wingtip and lights are not cracked.'),
 cd('Leading edge and skin','Run your eyes along the leading edge and the skin. Dents, cracks, loose rivets or ice could change how the wing works. Anything strange gets reported before flying.')],
 'Look for anything loose, cracked, bent or iced.',[
 mc('Which parts are checked on the wing?',['Aileron and flap','Tail rotor','Floats','Landing lights only'],'Ailerons and flaps are control surfaces on the wing.'),
 mc('What would a pilot report?',['Dents, cracks or loose parts','A clean wing','A smooth hinge','A bright light'],'Damage must be checked before flight.'),
 mc('Why do pilots check hinges?',['They hold moving surfaces on','They look nice','They add speed','They make sound'],'Loose hinges can let a surface come off.'),
 tf('Ice on the wing can change how the wing works.',true,'Ice spoils smooth airflow and adds weight.'),
 tf('You can ignore a loose rivet.',false,'Loose or missing fasteners are a warning sign.'),
 fl('The ___ is on the back of the wing and helps the airplane roll.',['aileron','spinner','tire','antenna'],'Ailerons are on the outer rear part of each wing.')]),
L('pf-nose','The nose and propeller',[
 cd('The prop','Check the propeller carefully for nicks, cracks, or bends. A damaged propeller can break apart in flight. Also look at the spinner, which should be tight and undamaged.'),
 cd('Cowling and intakes','Open the cowling inspection door to look for leaks, loose parts, and nests or debris in the air intakes. The nose tire, strut and nosewheel fairing get a look too.')],
 'The prop makes the thrust. Treat it with respect.',[
 mc('What should the propeller be free of?',['Nicks, cracks and bends','Paint','Shine','Dust'],'A damaged prop is dangerous.'),
 mc('Why check the air intakes?',['Blocked intakes starve the engine','They carry radio','They hold fuel','They store oil'],'The engine needs clear airflow.'),
 mc('What is the spinner?',['The cap over the propeller hub','A fuel cap','A kind of tire','A light'],'It streamlines the center of the propeller.'),
 tf('Propeller nicks can lead to cracks.',true,'Nicks create stress points.'),
 tf('You should stand in front of the prop when starting.',false,'Stay clear of the propeller arc.'),
 fl('The propeller makes ___.',['thrust','lift','drag','weight'],'The propeller pulls the airplane forward.')]),
L('pf-fuel','Checking the fuel',[
 cd('Enough and clean','Pilots check how much fuel is in the tanks by looking, not just trusting the gauge. Then they drain a small sample from each drain point into a clear cup to look for water, dirt, or the wrong color.'),
 cd('The right fuel','Small piston airplanes burn aviation gasoline. The common grade, 100LL, is dyed blue. Jet fuel is clear or straw colored and must never go in a piston engine. Caps must be tight.')],
 'See it, sample it, and make sure it is the right stuff.',[
 mc('What color is common 100LL aviation gasoline?',['Blue','Red','Orange','Purple'],'100LL avgas is dyed blue.'),
 mc('Why take a fuel sample?',['To check for water and dirt','To taste it','To fill the cup','To clean the wing'],'Contaminated fuel can stop an engine.'),
 mc('How should a pilot check fuel quantity?',['Look in the tank, not only the gauge','Ask a friend','Guess','Only listen'],'Gauges can be wrong; looking is the sure way.'),
 tf('Jet fuel is safe to use in a piston-engine airplane.',false,'The wrong fuel can damage the engine and cause a crash.'),
 tf('Water in the fuel is a reason to keep draining and checking.',true,'Pilots keep sampling until the fuel is clean.'),
 fl('The color of 100LL fuel is ___.',['blue','brown','pink','black'],'Blue dye marks aviation gasoline.')]),
L('pf-oil','Checking the oil',[
 cd('Dipstick','Pull the dipstick, wipe it, put it back, and pull again to read it. The level should fall between the minimum and maximum marks. Too little oil can destroy an engine.'),
 cd('Color and cap','Fresh oil is light and clear; oil that is very dark or has bits in it deserves attention. Make sure the oil filler cap and dipstick are fully seated when you finish.')],
 'Wipe, dip, read, seat the cap.',[
 mc('What does engine oil do?',['Lubricates and cools the engine','Powers the radio','Lights the cabin','Cleans the windows'],'Oil reduces friction and carries heat away.'),
 mc('Where should the dipstick reading be?',['Between the minimum and maximum marks','Above the top','Below the bottom','Anywhere'],'The safe range is marked on the stick.'),
 mc('What do you do right after pulling the dipstick the first time?',['Wipe it, then reinsert and read','Taste it','Throw it away','Ignore it'],'Wiping first gives a clear reading.'),
 tf('Too little oil can ruin an engine.',true,'Low oil can lead to overheating and failure.'),
 tf('The oil cap does not matter.',false,'A loose cap can let oil spill and starve the engine.'),
 fl('The tool for checking oil is the ___.',['dipstick','compass','yoke','flap'],'The dipstick shows the oil level.')]),
L('pf-pitot','Pitot tube and static ports',[
 cd('How airspeed is measured','The pitot tube is a small tube on the wing that catches moving air so the airspeed indicator can work. Pilots remove any cover and make sure the opening is clear of bugs, dirt, or ice.'),
 cd('Static ports','Small static ports sense the air pressure outside for the altimeter and other gauges. They must be clear too. A blocked pitot or static port can make instruments read wrong.')],
 'Clear tube, clear port, honest gauges.',[
 mc('What does the pitot tube help measure?',['Airspeed','Fuel','Oil','Time'],'The pitot tube senses the air hitting the airplane.'),
 mc('Why remove the pitot cover?',['So air can enter the tube','To keep it warm','To see better','To save paint'],'A cover blocks the airflow the airspeed indicator needs.'),
 mc('What can a blocked port cause?',['Wrong instrument readings','A better view','More lift','A quiet engine'],'The gauges rely on clear ports.'),
 tf('Bugs can block a pitot tube.',true,'Even tiny insects can cause a problem.'),
 tf('Pilots never need to look at pitot tubes.',false,'It is a standard part of the walkaround.'),
 fl('The ___ ports sense the air pressure outside.',['static','sonic','solid','solar'],'Static ports sense still air pressure.')]),
L('pf-tail','The tail section',[
 cd('Stabilizers and surfaces','At the tail the pilot checks the horizontal and vertical stabilizers, the elevator and the rudder. They must be secure, undamaged, and move freely. The trim tab and its hardware are checked too.'),
 cd('Lights and antennas','Look at the beacon, the tail light, and the antennas. Make sure the tie-down rope is removed and that nothing is wrapped around the tail. The airplane should be ready to fly cleanly.')],
 'Tail secure, surfaces free, ropes off.',[
 mc('Which surfaces are at the tail?',['Elevator and rudder','Aileron and flap','Landing gear','Propeller'],'The elevator and rudder are part of the tail.'),
 mc('What must be removed before taxi?',['Tie-down ropes and chocks','The tail','The seats','The doors'],'A tied-down airplane cannot move safely.'),
 mc('What does the elevator control?',['Pitch','Roll','Fuel','Radio'],'The elevator moves the nose up and down.'),
 tf('The rudder should move freely.',true,'Stiff controls are a problem.'),
 tf('Ropes can stay on during flight.',false,'Remove all tie-downs and chocks.'),
 fl('The vertical part of the tail is the ___ stabilizer.',['vertical','wide','soft','small'],'The vertical stabilizer holds the rudder.')]),
L('pf-gear','Tires, brakes and landing gear',[
 cd('Rolling gear','The tires should be properly inflated and free of cuts, bulges, or heavy wear. The struts hold the weight of the airplane, so they should not leak and should sit at the right height.'),
 cd('Brakes','Look at the brake lines and fittings for leaks. Brakes help you slow down and steer on the ground. A leaking brake line means the airplane should not fly until a mechanic fixes it.')],
 'Good tires and brakes get you home.',[
 mc('What should a tire be free of?',['Cuts and bulges','Rubber','Air','Treads'],'Damage can fail during landing.'),
 mc('What does a leaking brake line mean?',['A mechanic should fix it before flight','Nothing at all','The airplane is faster','The tank is full'],'Brakes are safety items.'),
 mc('What do landing gear struts do?',['Hold the airplane’s weight and absorb landings','Make noise','Create lift','Hold fuel'],'Struts carry the load and cushion landings.'),
 tf('Tires must be properly inflated.',true,'Low pressure can damage a tire and the wheel.'),
 tf('A bulging tire is fine to land on.',false,'A bulge can burst. Do not fly.'),
 fl('The ___ help you slow down on the ground.',['brakes','flaps','lights','gauges'],'Brakes are used on the runway and taxiway.')]),
L('pf-airworthy','Airworthy or not?',[
 cd('Airworthy means safe and legal','An airplane is airworthy when it matches its approved design and is in a condition for safe flight. Both must be true: it must be safe, and its paperwork and inspections must be current.'),
 cd('Write it up','If you find a problem, tell the owner or mechanic and write it down. Do not fly until it is fixed or an approved person decides it is okay. A small problem on the ground is better than a big one in the air.')],
 'If it is not right, it does not fly.',[
 mc('What does airworthy mean?',['Safe to fly and legally approved','Clean','New','Fast'],'An airplane must meet its design and be in safe condition.'),
 mc('What should you do if you find a problem?',['Report it and do not fly until fixed','Ignore it','Hide it','Fly anyway'],'Reporting protects the next pilot too.'),
 mc('Who can decide a problem is okay to fly with?',['An approved person such as a mechanic','Anyone nearby','A passenger','The airplane'],'The authority comes from rules and training.'),
 tf('A small issue on the ground is better than a big one in the air.',true,'Catch problems early.'),
 tf('Paperwork does not matter for airworthiness.',false,'Inspections and documents must be current too.'),
 fl('A problem found during preflight should be ___.',['reported','ignored','hidden','painted'],'Report it so it can be fixed.')]),
L('pf-flow','Putting the preflight together',[
 cd('A path around the plane','Most pilots walk around the airplane the same way every time: cabin, left wing, nose, right wing, tail. A steady path makes it easy to remember everything.'),
 cd('Be unhurried','Take your time. Good pilots never rush a preflight, because the airplane cannot tell how late you are. If something distracts you, start that section again.')],
 'Same path, same order, no rushing.',[
 mc('Why use the same path each time?',['It helps you remember everything','It is faster at night','It is required by law','It saves fuel'],'Habits reduce missed steps.'),
 mc('What if you are interrupted?',['Restart that section','Skip it','Hurry up','Call it done'],'Distractions can hide a missed step.'),
 mc('Which is a good attitude during preflight?',['Calm and careful','Quick and sloppy','Bored','Rushed'],'A calm pilot sees more.'),
 tf('A rushed preflight is a risky preflight.',true,'Hurrying hides problems.'),
 tf('The airplane cares how late you are for the flight.',false,'The airplane cannot tell you are late, so never rush a preflight.'),
 od('Put the walkaround in a sensible order.',['Cabin','Left wing','Nose','Right wing','Tail'],'Many pilots circle the plane in the same direction every time.')])
]);
})();
