/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* STUDENT PILOT 3 - ENGINE + FUEL: how a small piston engine works and how pilots look after it. */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,L}=H.dsl;
H.addLessons('engine',[
L('eng-four','The four-stroke cycle',[
 cd('Four steps, again and again','Most small airplane engines are piston engines. Each piston repeats four strokes: intake pulls in fuel and air, compression squeezes it, power is the spark that pushes the piston down, and exhaust pushes the burned gas out.'),
 cd('Turning the prop','The pistons turn a crankshaft, and the crankshaft turns the propeller. Many trainers use four horizontally opposed cylinders, which are laid flat on each side of the engine to keep it compact and smooth.')],
 'Intake, compression, power, exhaust.',[
 od_('Put the four strokes in order.'),
 mc('Which stroke pushes the piston down with force?',['Power','Intake','Compression','Exhaust'],'The burning mixture expands and drives the piston down during the power stroke.'),
 mc('What turns the propeller?',['The crankshaft','The tires','The flaps','The radio'],'The pistons turn the crankshaft, which is connected to the propeller.'),
 mc('What does the exhaust stroke do?',['Pushes burned gas out','Pulls fuel in','Squeezes the mix','Lights the spark'],'The piston rises and sends out the used gas.'),
 tf('A piston engine repeats the same four strokes over and over.',true,'The cycle never stops while the engine runs.'),
 fl('Fuel and air are squeezed in the ___ stroke.',['compression','intake','exhaust','power'],'Compression squeezes the mix so it burns with more force.')]),
L('eng-ign','Two magnetos',[
 cd('A spark that does not need the battery','Aircraft engines make their spark with magnetos. A magneto is a small generator driven by the engine itself, so it keeps working even if the battery or alternator fails. Each engine has two of them.'),
 cd('Two plugs, two systems','Each cylinder has two spark plugs, one for each magneto. If one system fails, the other keeps the engine running. Two plugs also burn the fuel more evenly and give a bit more power.')],
 'Two magnetos, two plugs, one safe engine.',[
 mc('What makes the spark in an aircraft engine?',['Magnetos','The radio','The landing light','The compass'],'Magnetos create the spark by themselves.'),
 mc('Why does a cylinder have two spark plugs?',['Backup and better burning','To look nice','To make noise','To save weight'],'If one fails, the other still works.'),
 mc('If the battery dies, the engine…',['Can keep running on magnetos','Stops at once','Explodes','Turns green'],'The magnetos do not rely on the battery.'),
 tf('Magnetos are driven by the engine itself.',true,'They make their own electricity as the engine turns.'),
 tf('Aircraft engines have only one ignition system.',false,'There are two independent systems.'),
 fl('Each cylinder has two spark ___.',['plugs','wings','tires','maps'],'Two plugs per cylinder give redundancy.')]),
L('eng-mix','Fuel and air: the mixture',[
 cd('A recipe','For an engine to run well, fuel and air must mix in the right amounts. Too much fuel is called rich. Too little is called lean. The pilot adjusts this with the mixture control.'),
 cd('Rich low, lean high','At sea level the pilot flies with a rich mixture. As the airplane climbs, the air gets thinner, so the pilot leans the mixture to match. For landing, the mixture goes back to full rich.')],
 'Rich on the ground, lean in the cruise, rich to land.',[
 mc('What is a rich mixture?',['More fuel for the amount of air','Less fuel','No fuel','No air'],'Rich means a higher proportion of fuel.'),
 mc('Which control adjusts the fuel-to-air amount?',['The mixture control','The throttle','The yoke','The flaps'],'The mixture lever sets the ratio.'),
 mc('Why do pilots lean the mixture at high altitude?',['The air is thinner','The fuel is heavier','The sun is hot','The prop is slow'],'Thin air carries less oxygen, so less fuel is needed.'),
 tf('The mixture is set full rich for landing.',true,'The pilot may need full power for a go-around.'),
 tf('Lean means more fuel than air.',false,'Lean means less fuel for the air.'),
 fl('At sea level pilots usually fly with a ___ mixture.',['rich','lean','square','blue'],'Rich is the default at low altitude.')]),
L('eng-throttle','Throttle and power',[
 cd('The throttle','The throttle controls how much power the engine makes. Push it in for more power, pull it out for less. In many trainers it also sets how fast the propeller turns, which you read on the tachometer in RPM.'),
 cd('Smooth, not sudden','Move the throttle smoothly. Quick changes can upset the engine and the airplane. Power changes also change the airplane’s pitch and its need for rudder, so smooth hands keep the flight steady.')],
 'In for more, out for less, always smooth.',[
 mc('What does pulling the throttle out do?',['Reduces power','Adds power','Lowers the flaps','Turns off the radio'],'Less throttle means less engine power.'),
 mc('Which gauge shows propeller speed?',['Tachometer','Altimeter','Compass','Airspeed indicator'],'The tach reads RPM, revolutions per minute.'),
 mc('How should the throttle be moved?',['Smoothly','Violently','Rarely','With eyes closed'],'Smooth inputs protect the engine and the flight.'),
 tf('RPM means revolutions per minute.',true,'It counts the spins of the engine each minute.'),
 tf('Throttle changes never affect the nose attitude.',false,'More power usually raises the nose; less lowers it.'),
 fl('The tachometer shows engine ___.',['RPM','fuel','altitude','heading'],'The tach reads RPM.')]),
L('eng-cool','Keeping the engine cool',[
 cd('Air does the work','Most small airplanes have air-cooled engines. Air flows through the cowling and over fins on the cylinders and carries heat away. Oil also helps cool the engine as it circulates.'),
 cd('Watch the temperatures','Gauges show oil temperature and, in some airplanes, cylinder head temperature. A climb at low speed gives less airflow, so engines run hotter. The pilot lowers the nose to cool it.')],
 'Hot engine? Lower the nose, add airflow.',[
 mc('How are most small airplane engines cooled?',['By air','By water in a radiator','By ice','By fans in the cabin'],'Moving air over the cylinders does the cooling.'),
 mc('What helps a hot engine cool down in a climb?',['Lowering the nose to speed up','Pulling back more','Closing the vents','Turning off the oil'],'More speed means more cooling air.'),
 mc('What else besides air cools the engine?',['Oil','Sunlight','Fuel only','The radio'],'Oil carries heat as it circulates.'),
 tf('Slow climbs help an engine run cooler.',false,'Less airflow over the engine means less cooling.'),
 tf('Cooling air enters through the cowling.',true,'The cowling channels air over the cylinders.'),
 fl('Cylinders have metal ___ to help shed heat.',['fins','flaps','floats','fuses'],'Cooling fins increase surface area.')]),
L('eng-oilsys','The oil system',[
 cd('More than lubrication','Oil lubricates moving parts, cools the engine, cleans away tiny particles, and seals the piston rings. Without enough oil, parts rub, heat up and can fail in minutes.'),
 cd('Gauges tell the story','The oil pressure gauge should rise soon after engine start. If it does not, shut the engine down. In flight, falling pressure or rising oil temperature are warnings to land at the nearest suitable airport.')],
 'No oil pressure after start? Shut it down.',[
 mc('What should oil pressure do after engine start?',['Rise soon','Stay at zero','Disappear','Flicker'],'If it does not rise within the time in the POH, stop the engine.'),
 mc('What is one of oil’s jobs?',['Lubricating moving parts','Lighting the cabin','Making radio calls','Adding lift'],'Oil reduces friction between parts.'),
 mc('What does falling oil pressure in flight suggest?',['A serious problem; land soon','Everything is fine','The mixture is lean','More lift'],'Low pressure can mean oil loss or pump trouble.'),
 tf('An engine can fail quickly without oil.',true,'Parts can overheat in minutes.'),
 tf('You can ignore the oil gauge after startup.',false,'It is a key warning gauge.'),
 fl('The oil ___ gauge shows how hard oil is being pumped.',['pressure','heading','vacuum','flap'],'Oil pressure is a critical gauge.')]),
L('eng-prop','The propeller',[
 cd('A spinning wing','A propeller is a set of twisted blades. Each blade is a small wing that makes thrust as it spins, pulling the airplane forward. The blade’s angle to the air is called pitch.'),
 cd('Fixed pitch','Trainers often have a fixed-pitch propeller whose angle never changes. It is a compromise between climbing and cruising. Bigger airplanes may have a constant-speed propeller that adjusts its pitch automatically.')],
 'A propeller is a wing that pulls you forward.',[
 mc('What does a propeller make?',['Thrust','Lift only','Weight','Drag only'],'It pulls the airplane through the air.'),
 mc('Each propeller blade works like…',['A small wing','A fan in your house','A parachute','A wheel'],'The blade is an airfoil.'),
 mc('What is a fixed-pitch propeller?',['Its blade angle never changes','It changes every minute','It folds up','It has no blades'],'The angle is set at the factory.'),
 tf('A propeller’s blades are twisted.',true,'The twist keeps the angle of attack right along the blade.'),
 tf('Propellers make lift only.',false,'They make thrust, a forward force.'),
 fl('The angle of a propeller blade is its ___.',['pitch','roll','yaw','trim'],'Pitch describes the blade angle.')]),
L('eng-fuelsys','The fuel system',[
 cd('Tanks and selector','Fuel is stored in tanks, often in the wings. A fuel selector valve lets the pilot choose left tank, right tank, both, or off. Fuel flows to the engine by gravity or by a pump, depending on the airplane.'),
 cd('Know how long you can fly','Fuel gauges can be unreliable, so pilots also compute how much fuel they need and how long they can fly. Some fuel in the tank is unusable. Running out of fuel is a preventable emergency.')],
 'Fuel gauges can lie. Do the math and look in the tank.',[
 mc('What does the fuel selector do?',['Chooses which tank feeds the engine','Opens the door','Sets the radio','Moves the flaps'],'The valve picks the tank, or shuts off fuel.'),
 mc('Why do pilots calculate fuel as well as read the gauges?',['Gauges can be inaccurate','Gauges are secret','Gauges are free','Gauges are loud'],'Gauges can read wrong, so planning backs them up.'),
 mc('What is unusable fuel?',['Fuel you cannot get to the engine','Fuel that is blue','New fuel','Spilled fuel'],'A little fuel stays in the tank and lines.'),
 tf('Running out of fuel is a preventable emergency.',true,'Good planning and checking prevents it.'),
 tf('The fuel gauge is always perfect.',false,'Gauges can be wrong.'),
 fl('A pilot can select the left tank, right tank, both or ___.',['off','up','back','red'],'The selector includes an off position.')]),
L('eng-grades','Fuel grades and mistakes',[
 cd('Know your fuel','Piston airplanes burn aviation gasoline. 100LL is blue. Jet-A is for turbine engines. Each fueling nozzle and cap is marked, and jet nozzles are larger so they do not fit piston fuel ports.'),
 cd('Fuel mistakes','Putting the wrong fuel in an airplane can cause engine failure. Pilots watch every fueling, check the caps, and sample fuel afterward. Mistakes happen when people rush or are distracted.')],
 'Right fuel, right airplane, every time.',[
 mc('What kind of fuel do small piston engines burn?',['Aviation gasoline','Jet-A','Diesel from a truck','Cooking oil'],'Avgas is for piston engines.'),
 mc('Why are jet fuel nozzles larger?',['So they cannot fit piston fuel ports','To pump faster','To look cool','To cost less'],'The size prevents mix-ups.'),
 mc('When are fueling mistakes most likely?',['When people are rushed or distracted','At lunch','At midnight only','Never'],'Distraction causes errors.'),
 tf('Wrong fuel can cause an engine to fail.',true,'It is a serious safety issue.'),
 tf('You never need to watch the fueling.',false,'Pilots supervise every fueling.'),
 fl('Aviation gasoline for small airplanes is called ___.',['avgas','jet-A','diesel','kerosene'],'Avgas stands for aviation gasoline.')]),
L('eng-runup','Start-up and run-up',[
 cd('Careful start','On start-up, the pilot sets the brakes, clears the prop, and follows the checklist. After the engine starts, the pilot checks oil pressure and sets a gentle RPM so the engine warms up gradually.'),
 cd('The run-up','Before takeoff the pilot runs the engine up to a higher RPM and tests the magnetos one at a time. A small drop in RPM is normal; a big drop is not. The pilot also checks instruments and controls.')],
 'Test it before you trust it.',[
 mc('What is the run-up?',['A check of the engine before takeoff','A race','A landing','A radio call'],'Pilots verify the engine and systems before leaving the ground.'),
 mc('What is tested one at a time during a mag check?',['The two magnetos','The two tires','The two doors','The two seats'],'Testing each shows if either has trouble.'),
 mc('What is normal during a mag check?',['A small RPM drop','No change ever','Engine stops','Fire'],'A small drop is expected on one magneto.'),
 tf('The brakes are set during the run-up.',true,'The airplane must not creep forward.'),
 tf('A pilot should take off even if the run-up shows a problem.',false,'Fix it first.'),
 fl('A check of each magneto is a ___ check.',['mag','map','mile','mix'],'Mag check is shorthand for magneto check.')])
]);
function od_(q){ return {k:'order',q,s:['Intake','Compression','Power','Exhaust'],why:'The four-stroke cycle is intake, compression, power, exhaust.'}; }
})();
