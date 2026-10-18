/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* STUDENT PILOT 11 - WHEN THINGS GO WRONG: engine failure, glide, landing fields, fires, door, carb ice, lost, inadvertent clouds, forced landings. */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,od,L}=H.dsl;
H.addLessons('emergency',[
L('em-calm','The emergency mindset',[
 cd('Fly first','In any emergency the first job is to keep flying the airplane. Pilots remember three words in order: aviate, navigate, communicate. Keep control, decide where you are going, then talk to someone who can help.'),
 cd('Practice makes calm','Pilots practice emergencies with instructors so the steps feel familiar. A calm pilot thinks clearly. Use the checklist for the details, and remember the few steps that cannot wait, called memory items.')],
 'Aviate. Navigate. Communicate.',[
 mc('What is the first priority in any emergency?',['Fly the airplane','Call the tower','Look at the map','Take a photo'],'Aviate comes first.'),
 mc('What are memory items?',['Steps pilots know by heart for urgent problems','Photos','Radio frequencies','Passenger names'],'Some steps cannot wait for a checklist.'),
 mc('Why practice emergencies with an instructor?',['So the steps feel familiar','For fun only','To waste fuel','To scare people'],'Practice builds calm.'),
 tf('A calm pilot thinks more clearly.',true,'Panic wastes time.'),
 tf('You should communicate before you aviate.',false,'Flying comes first.'),
 od('Put these in the right order.',['Aviate','Navigate','Communicate'],'Fly, decide where, then talk.')]),
L('em-engine','If the engine quits',[
 cd('Glide speed first','Right away, lower the nose and set the best glide speed from the checklist, then trim. The airplane becomes a glider, and it can glide a long way. Pick a place to land and head toward it.'),
 cd('The restart steps','If there is time, try to restart: fuel selector on the fullest tank, mixture rich, carb heat on, check the magnetos, and primer in. If nothing works, stay with the landing plan and call Mayday.')],
 'Glide speed, pick a field, try a restart, declare.',[
 mc('What is the first action after engine failure?',['Set best glide speed','Open the door','Turn off the radio','Climb'],'Speed is life.'),
 mc('What should be set to rich when trying a restart?',['The mixture','The compass','The flaps','The trim'],'Rich mixture helps the engine restart.'),
 mc('If the restart fails, what do you do?',['Land on the chosen field','Keep trying until the ground','Stall it','Spin it'],'Stay committed to a safe landing.'),
 tf('An airplane without power can still glide.',true,'It becomes a glider.'),
 tf('You should pull back hard to stretch the glide.',false,'That slows too much and risks a stall.'),
 fl('The best glide ___ gives the farthest distance.',['speed','color','angle of bank','radio'],'Fly at that speed.')]),
L('em-glide','How far can you glide?',[
 cd('Glide ratio','A glide ratio tells how far you go forward for each foot you drop. Many trainers have a ratio near 9 to 1. That means about 9 feet forward for every foot of altitude, or about 1.5 nautical miles for each 1,000 feet.'),
 cd('A circle of options','From 4,000 feet above the ground, that is a circle with a radius of about 6 nautical miles. Wind changes the circle: a headwind shrinks it and a tailwind stretches it. Always look for several good options.')],
 'Altitude is your range.',[
 mc('What does a 9-to-1 glide ratio mean?',['9 feet forward per foot of altitude','9 miles per gallon','9 knots','9 degrees'],'It is the distance gained per height lost.'),
 mc('About how far can a 9-to-1 trainer glide from 4,000 feet above the ground?',['About 6 nautical miles','About 60 miles','About 100 feet','About 600 miles'],'1.5 nm per 1,000 feet times 4.'),
 mc('How does a headwind change the glide?',['It shortens it','It lengthens it','No change','It stops it'],'Ground distance is shorter.'),
 tf('More altitude means more landing options.',true,'Height gives range.'),
 tf('Wind never changes how far you glide.',false,'It changes your distance over the ground.'),
 fl('Distance divided by height lost is the glide ___.',['ratio','angle','dip','trim'],'The glide ratio.')]),
L('em-field','Choosing a landing spot',[
 cd('The seven S’s','A handy list for picking a field is size, shape, surroundings, slope, surface, stock and sun. Check that it is big enough, long and wide, clear of wires and trees, flat or uphill, firm and smooth, free of animals and people, and not with the sun in your eyes.'),
 cd('Into the wind','Land into the wind if you can. It slows your ground speed. Choose a field you can reach with altitude to spare, plan a pattern to it, and commit. Roads and open pastures are common choices.')],
 'Size, shape, surroundings, slope, surface, stock, sun.',[
 mc('Which is one of the seven S’s?',['Slope','Soup','Sandwich','Satellite'],'Slope matters for landing.'),
 mc('Which direction is best to land?',['Into the wind','With the wind','Across the wind','Backwards'],'Into the wind gives the slowest ground speed.'),
 mc('Which surface is best?',['Firm and smooth','Soft and rocky','Wet sand','Swamp'],'A firm smooth surface helps.'),
 tf('A short, clear pasture could be a good option.',true,'It depends on the size and wires.'),
 tf('You should choose a field you cannot reach.',false,'Pick one you can make.'),
 od('Put these in the usual order.',['Pick a field','Plan the pattern','Fly the pattern','Land into the wind'],'Plan, then act.')]),
L('em-fire','Fire in the engine',[
 cd('In flight','An engine fire is serious. Pilots shut off the fuel by closing the fuel selector, pulling the mixture to idle cutoff, and turning off the master switch. Cabin heat is turned off. Then they land right away, using a steep descent to blow the flames away from the airplane.'),
 cd('On the ground','If a fire starts during engine start, keep the engine cranking if you can so it pulls the fire into the engine. If it keeps burning, shut down, evacuate, and use an extinguisher if the situation is safe.')],
 'Fuel off, mixture off, land now.',[
 mc('What do you do first with the fuel in an engine fire?',['Shut it off','Add more','Switch tanks','Taste it'],'No fuel means no fire.'),
 mc('What should the pilot do with the cabin heat?',['Turn it off','Turn it on high','Open the door','Ignore it'],'Do not feed hot air or smoke into the cabin.'),
 mc('After shutting off fuel in flight, what next?',['Land as soon as possible','Fly on for an hour','Restart','Climb'],'Get on the ground quickly.'),
 tf('Pilots follow the airplane’s own emergency checklist.',true,'Procedures differ.'),
 tf('You should add fuel to put out the fire.',false,'Never.'),
 fl('The mixture goes to idle ___ to stop fuel.',['cutoff','rich','lean','full'],'Idle cutoff shuts off fuel flow.')]),
L('em-elec','Smoke and electrical fire',[
 cd('Smell and smoke','A burning smell, smoke, or sparks in the cabin may be an electrical problem. The pilot turns off the master switch and any electrical items, opens the vents, and uses the checklist. An extinguisher in the cabin is for this.'),
 cd('Land soon','Without the electrical system, the engine keeps running because magnetos are separate. The plan is to put the airplane on the ground quickly and safely. Keep the fire extinguisher where you can reach it.')],
 'Master off, vents open, land soon.',[
 mc('What is the first step for electrical smoke?',['Master switch off','Master switch on','Add oil','Open the fuel'],'Cut power to the source.'),
 mc('Why can the engine keep running without the master switch?',['Magnetos make their own spark','Wind is spinning it','It cannot','A battery inside the tire'],'Ignition is separate.'),
 mc('Where should the fire extinguisher be?',['Within reach','In the hangar','In the trunk','At home'],'It must be handy.'),
 tf('Opening vents can clear smoke.',true,'It brings fresh air.'),
 tf('Electrical fires are fine to ignore.',false,'Treat them as an emergency.'),
 fl('Without the master on, the airplane loses ___ power.',['electrical','engine','wing','gravity'],'The magnetos still make spark.')]),
L('em-door','A door pops open',[
 cd('Stay calm','A door popping open is noisy and scary, but it rarely hurts the flying qualities. The pilot’s only job is to keep flying the airplane. Do not try to grab the door and let go of the controls.'),
 cd('The plan','Slow down to a safe speed, fly the airplane, and land. Passengers should stay buckled. Closing the door in flight is hard and not worth risking control. A latch check before takeoff prevents it.')],
 'Fly first. The door can wait.',[
 mc('What do you do first when a door opens?',['Keep flying the airplane','Grab the door','Jump','Turn off the engine'],'Aviate.'),
 mc('How can you prevent it?',['Check the latch before takeoff','Open it on purpose','Remove the door','Ignore the latch'],'Preflight checks matter.'),
 mc('Should you try to close the door in flight?',['Not if it risks control','Always','Yes, immediately','Only in a turn'],'Land first.'),
 tf('The airplane usually still flies normally with an open door.',true,'It’s noisy, not usually dangerous.'),
 tf('Letting go of the yoke to fix a door is smart.',false,'Never leave the controls.'),
 fl('Check the door ___ before takeoff.',['latch','color','paint','window'],'A good latch check prevents it.')]),
L('em-carb','Carburetor ice',[
 cd('Ice from cold air','In a carbureted engine, air speeds up and cools as it passes through. Moisture in the air can freeze inside, even on a warm day. Ice blocks the airflow and the engine loses power or runs roughly.'),
 cd('Carb heat','Carburetor heat sends warm air through the carburetor and melts ice. Apply it fully at the first sign of trouble: a drop in RPM or a rough engine. Many pilots use it when reducing power to prevent ice.')],
 'Rough engine? Carb heat on.',[
 mc('What does carburetor heat do?',['Melts ice in the carburetor','Cools the cabin','Charges the battery','Warms the oil'],'Heated air removes ice.'),
 mc('What is a sign of carburetor ice?',['A drop in RPM','A brighter sky','A tight seat belt','Louder radio'],'The engine loses power.'),
 mc('Can carb ice form on a warm day?',['Yes','No','Only at night','Only in winter'],'Cooling in the carburetor can make ice even in warm weather.'),
 tf('Apply carb heat fully, not a little.',true,'Partial heat can make ice worse.'),
 tf('Carb ice only happens in snow.',false,'It can happen with moist air in warm temperatures.'),
 fl('The control that melts carb ice is carb ___.',['heat','light','tune','map'],'Carb heat.')]),
L('em-lost','If you are lost',[
 cd('Stay calm and fly','Getting lost is common and fixable. Keep flying the airplane, fly a steady heading, and do not panic. Look for landmarks and compare them with your chart. Climb if you can, because height helps radio and sight.'),
 cd('The five C’s','A helpful list: Climb for a better view and radio range. Communicate by calling a controller or flight service. Confess that you are lost. Comply with the advice. Conserve fuel by flying efficiently.')],
 'Climb, communicate, confess, comply, conserve.',[
 mc('Which is one of the five C’s?',['Climb','Cook','Cry','Cancel'],'Climb is first.'),
 mc('What should you do if you cannot find your position?',['Ask for help on the radio','Fly faster','Stop looking','Land anywhere'],'Controllers have radar and can help.'),
 mc('Why climb?',['Better radio range and view','To save fuel','To go faster','To land'],'Height helps.'),
 tf('It is fine to confess that you are lost.',true,'Asking early saves time and fuel.'),
 tf('Panic helps a lost pilot find the way.',false,'Stay calm.'),
 fl('Lost pilots should ___ the airplane first.',['fly','paint','park','sell'],'Aviate.')]),
L('em-imc','Flying into clouds by mistake',[
 cd('Why it is deadly','Without instrument training, a pilot who flies into clouds loses the horizon. The body’s sense of balance becomes unreliable, and the airplane can end up in a spiral dive within a minute or two. It is a leading cause of fatal accidents.'),
 cd('What to do','Trust the instruments, not your body. Make a gentle 180-degree turn to get back to clear air, using the attitude indicator and turn coordinator. Ask for help on the radio. The best plan is to avoid it by checking weather and turning around early.')],
 'Trust the instruments. Turn around gently.',[
 mc('Why is flying into clouds without training dangerous?',['You lose the horizon','The clouds are heavy','The engine stops','The radio breaks'],'Spatial disorientation sets in fast.'),
 mc('What should you trust in clouds?',['The instruments','Your feelings','The clock','A coin toss'],'The body can lie.'),
 mc('What maneuver can get you out?',['A gentle 180-degree turn','A steep dive','A hard climb','A stall'],'Turning back to clear air is the standard plan.'),
 tf('The best answer is to avoid the situation by planning.',true,'Check the weather and turn around early.'),
 tf('You can trust your inner ear in the clouds.',false,'You cannot.'),
 fl('Losing your sense of position in clouds is spatial ___.',['disorientation','direction','distance','dimension'],'Disorientation is the name.')]),
L('em-force','Forced landings and the aftermath',[
 cd('Before touching down','Tell passengers to brace, unlatch the doors, and tighten belts. Shut off fuel, master and magnetos once you are sure you will reach the field. Touch down at the lowest safe speed, in control, and as flat as you can.'),
 cd('After landing','Get everyone out and away from the airplane. The ELT may already be sending a signal. Stay together, stay with the airplane unless you are in danger, and call for help. Survivors are found by staying visible and organized.')],
 'Brace, unlatch, shut down, get out.',[
 mc('What should passengers do before a forced landing?',['Brace','Stand up','Open the window','Take photos'],'Bracing helps protect them.'),
 mc('Why unlatch doors?',['They can jam after impact','To let in air','To be polite','To wave'],'Doors can jam as the structure bends.'),
 mc('What device sends a signal after a crash?',['ELT','Tachometer','Altimeter','Compass'],'ELT stands for emergency locator transmitter.'),
 tf('Staying with the airplane is usually the safest plan.',true,'It is easier to find and gives shelter.'),
 tf('You should wander far from the wreck right away.',false,'Stay together.'),
 fl('Survivors usually wait near the ___.',['airplane','road far away','river','mountain'],'Rescuers look near the wreck.')])
]);
})();
