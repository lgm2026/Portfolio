/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* STUDENT PILOT 7 - TAKEOFFS + LANDINGS: normal and crosswind, aborts, approach, flare, go-arounds. */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,od,L}=H.dsl;
H.addLessons('landings',[
L('ld-before','Before you take off',[
 cd('Final checks','At the hold short line the pilot finishes the before-takeoff checklist: controls free and correct, flaps and trim set, mixture rich, fuel on, doors latched, belts fastened. Then the pilot checks that the approach and runway are clear.'),
 cd('The briefing to yourself','Pilots also say their plan out loud: “If the engine quits on the runway, I close the throttle and brake. If it quits in the air, I lower the nose and land ahead.” Deciding in advance saves precious seconds.')],
 'Plan the emergency before you need it.',[
 mc('Why brief yourself before takeoff?',['A plan saves time in an emergency','It sounds fancy','It is a radio rule','It fills the tanks'],'You react faster when you have already decided.'),
 mc('What should the controls be before takeoff?',['Free and correct','Locked','Removed','Loose'],'A control check confirms they move the right way.'),
 mc('Where does the before-takeoff checklist usually finish?',['At the hold short line','At the hangar','In the air','At the fuel pump'],'Pilots finish checks before entering the runway.'),
 tf('The pilot checks that the approach path is clear before lining up.',true,'Look for landing traffic.'),
 tf('Flaps and trim do not matter before takeoff.',false,'They must be set correctly.'),
 fl('The mixture is usually set to ___ for takeoff at low altitude.',['rich','lean','off','half'],'Rich mixture gives full power.')]),
L('ld-normal','The normal takeoff',[
 cd('Line up and go','Line up on the centerline. Push the throttle smoothly to full power while holding the yoke slightly back. Check the engine gauges and airspeed, and steer with the rudder to stay on the centerline.'),
 cd('Rotate and climb','At the rotation speed, ease the yoke back and lift off. Hold the climb attitude, trim, and accelerate to the best climb speed. Retract the flaps when safely above the ground and at a safe speed.')],
 'Power, track, rotate, climb.',[
 mc('How should the throttle be advanced?',['Smoothly to full power','Instantly and jerked','Halfway','Slowly to idle'],'Smooth power avoids upsetting the airplane.'),
 mc('What keeps the airplane on the centerline?',['Rudder','Flaps','Trim','Radio'],'Rudder steers on the ground.'),
 mc('When are the flaps raised after takeoff?',['When safely above the ground and at a safe speed','Before the engine starts','Never','Right at liftoff'],'Retract them after a stable climb is established.'),
 tf('The pilot checks the engine gauges during the takeoff roll.',true,'Gauges should read normal.'),
 tf('You pull back before the airplane has any speed.',false,'Wait for rotation speed.'),
 od('Put the takeoff in order.',['Line up on centerline','Full power','Rotate','Climb'],'The steps flow in this order.')]),
L('ld-abort','Rejecting a takeoff',[
 cd('A decision made early','If something looks wrong on the takeoff roll and there is still enough runway, the safe move is to abort: throttle to idle, brake, and keep the airplane straight. Decide ahead of time where you will stop.'),
 cd('Checkpoints','Many pilots pick a checkpoint on the runway where they must have reached flying speed. If they have not, they reject the takeoff. A runway behind you is the most useless thing in aviation.')],
 'No speed by the checkpoint? Stop.',[
 mc('What is the correct action for a rejected takeoff?',['Throttle idle, brake, stay straight','Pull up anyway','Add more power','Open the door'],'Stopping on the runway is safest if there is room.'),
 mc('What is a runway checkpoint for?',['To confirm you will reach flying speed','To time lunch','To park','To fuel'],'Not enough speed by the point means stop.'),
 mc('When should you decide whether to reject?',['Before the takeoff','After liftoff','During landing','Never'],'Deciding early avoids hesitation.'),
 tf('Runway behind you is useless once you take off.',true,'A famous pilot saying.'),
 tf('You should try to lift off even if the engine sputters at low speed with runway ahead.',false,'Stop while you still can.'),
 fl('Closing the throttle puts the engine at ___.',['idle','full','max','mid'],'Idle reduces power.')]),
L('ld-engine','Engine trouble after takeoff',[
 cd('Nose down first','If the engine quits just after takeoff, the first job is to lower the nose to keep flying speed. The best landing spot is usually straight ahead or slightly to either side. Do not try to turn back unless you have plenty of height.'),
 cd('Why not turn back','A turn back to the runway takes a lot of altitude, and the airplane is slow and low. Many accidents happen that way. Practice picking a straight-ahead landing option and flying it to the ground under control.')],
 'Nose down, pick a spot ahead, land under control.',[
 mc('What is the first step if the engine quits after takeoff?',['Lower the nose','Pull back','Turn around','Raise the flaps'],'Keep flying speed before anything else.'),
 mc('Where should you generally land?',['Straight ahead or nearly so','Back at the runway','Anywhere behind','On a road with traffic'],'A straight-ahead landing is safest at low altitude.'),
 mc('Why is turning back risky?',['It needs a lot of altitude','It is illegal','It saves fuel','It is noisy'],'The airplane is low and slow.'),
 tf('Keep the airplane under control all the way to the ground.',true,'A controlled landing is survivable.'),
 tf('Pull the nose up to stretch the glide.',false,'That risks a stall.'),
 fl('If the engine quits, lower the ___.',['nose','tail','landing gear','flaps up'],'Nose down preserves airspeed.')]),
L('ld-xwto','Crosswind takeoffs',[
 cd('Into the wind','In a crosswind, the wind pushes the airplane and its upwind wing tries to lift. The pilot holds aileron into the wind, more at the start, and eases it out as speed grows. The rudder keeps the nose straight.'),
 cd('Positive liftoff','Pilots lift off cleanly, then turn slightly into the wind to track the runway centerline. A crabbed climb keeps the airplane over the runway line while the wind blows from the side.')],
 'Aileron into the wind, rudder to stay straight.',[
 mc('Which way do you hold the aileron in a crosswind takeoff?',['Into the wind','Away from the wind','Neutral','Down'],'It keeps the upwind wing from lifting.'),
 mc('Which control keeps the airplane straight on the runway?',['Rudder','Throttle','Flaps','Trim'],'Rudder steers the nose.'),
 mc('Is the aileron input larger at the start or the end?',['At the start','At the end','Same all the way','None'],'You ease it out as airspeed grows.'),
 tf('A crabbed climb can track the runway line in a crosswind.',true,'The nose points slightly into the wind.'),
 tf('You ignore crosswinds on takeoff.',false,'They need careful control.'),
 fl('A wind from the side is a ___ wind.',['cross','head','tail','up'],'Crosswind blows across the runway.')]),
L('ld-appr','The stabilized approach',[
 cd('Airspeed and descent','A normal approach has a steady speed, a steady descent, and a straight line to the runway. Pitch controls airspeed. Power controls the rate of descent. Pilots aim to be stable by about 500 feet above the ground.'),
 cd('Final approach speed','Pilots fly the approach at a speed about 30 percent above the stall speed with landing flaps, written 1.3 Vso. The POH lists the exact speed for each airplane, and it adds a margin for safety.')],
 'Pitch for speed. Power for descent.',[
 mc('On the approach, what does pitch control?',['Airspeed','Altitude directly','Fuel','Radio'],'In an approach, the nose sets the speed.'),
 mc('What does power mainly control on final?',['Descent rate','Compass heading','Cabin temperature','Radio volume'],'More power, less descent.'),
 mc('Final approach speed is roughly…',['About 1.3 times the landing stall speed','10 times stall speed','Half stall speed','Zero'],'1.3 Vso is a common guideline.'),
 tf('A stable approach should be set by about 500 feet.',true,'Stable means speed, descent and line are steady.'),
 tf('Landing at top speed is the safest approach.',false,'Slow, steady speeds are safest.'),
 fl('A steady, controlled approach is called a ___ approach.',['stabilized','sudden','secret','shaky'],'Stabilized approaches are the target.')]),
L('ld-flare','The flare and touchdown',[
 cd('Round out','Just above the runway, the pilot gently raises the nose in the flare, also called the round-out. It slows the descent so the airplane settles with a soft touch. Look down the runway, not at the nose.'),
 cd('Main wheels first','Power goes to idle, the nose is held up, and the main wheels touch first. Then the nose wheel lowers gently. Smooth landings come from patient hands and eyes looking ahead down the runway.')],
 'Eyes down the runway, hands patient.',[
 mc('What does the flare do?',['Slows the descent for a soft touchdown','Speeds up the descent','Starts the engine','Turns the airplane'],'It reduces the sink rate near the ground.'),
 mc('Which wheels should touch first?',['Main wheels','Nose wheel','Tail','Wingtips'],'The nose wheel is lowered gently afterward.'),
 mc('Where should you look in the flare?',['Down the runway','At the nose','At the instruments','At your feet'],'Looking far ahead gives depth.'),
 tf('Another name for the flare is the round-out.',true,'They are the same thing.'),
 tf('You should look straight down at the runway edge.',false,'Look far down the runway.'),
 fl('Power is usually at ___ at touchdown.',['idle','full','half','climb'],'Idle lets the airplane settle.')]),
L('ld-aim','The aiming point',[
 cd('A fixed spot','Choose a spot on the runway to aim for, usually the first white markings. If the spot stays in the same place in your windshield, you will hit it. If it moves up, you are heading short. If it moves down, you are going long.'),
 cd('Fix the picture','Correct early with small power and pitch changes. Do not chase the runway with big moves near the ground. A good approach looks steady all the way down.')],
 'Hold the picture, keep the spot still.',[
 mc('If the aiming point moves up in the windshield, you will land…',['Short','Long','On target','Never'],'It means you are undershooting.'),
 mc('If the aiming point moves down in the windshield, you will land…',['Long','Short','On target','In the pattern'],'You are overshooting.'),
 mc('If the spot stays in the same place…',['You will reach it','You will miss it','You will stall','You will turn'],'A fixed spot means a steady line.'),
 tf('Correct early with small changes.',true,'Late corrections near the ground are risky.'),
 tf('You should chase the runway with big movements.',false,'Small, early corrections are better.'),
 fl('A spot that does not move in the windshield is a ___ picture.',['steady','shaky','wet','dirty'],'A steady picture means a steady approach.')]),
L('ld-xwld','Crosswind landings',[
 cd('Crab or slip','Two methods keep the airplane over the centerline: the crab keeps the nose into the wind on final, and the wing-low method lowers the upwind wing and uses opposite rudder to keep the nose straight.'),
 cd('Touchdown','Before touchdown the nose must line up with the runway. In the wing-low method, the upwind main wheel touches first, then the other. Keep aileron into the wind during rollout as the airplane slows.')],
 'Wing low, rudder straight, upwind wheel first.',[
 mc('In the wing-low method, which wheel touches first?',['Upwind main wheel','Downwind main wheel','Nose wheel','Tail'],'The lowered wing is on the windward side.'),
 mc('How is the nose kept lined up with the runway in the wing-low method?',['Opposite rudder','Full flaps','Idle power','Open door'],'Rudder stops the turn.'),
 mc('What must you do with the ailerons during rollout?',['Hold into the wind','Neutral','Away from the wind','Pull them out'],'Wind can lift the upwind wing as speed drops.'),
 tf('A crosswind landing needs careful control.',true,'Practice makes it smooth.'),
 tf('The nose should point off the runway at touchdown.',false,'It should line up with the runway.'),
 fl('Crab and wing-low are two ways to handle a ___.',['crosswind','headwind','tailwind','rainstorm'],'Both counter side winds.')]),
L('ld-go','The go-around',[
 cd('When in doubt','A go-around is when the pilot abandons the landing and flies away to try again. Reasons include an unstable approach, a bad bounce, traffic on the runway, or the tower’s instruction. A go-around is a skill, not a failure.'),
 cd('The steps','Apply full power, level the nose, retract flaps in stages, and climb away to the traffic pattern. Keep the wings level and use rudder to stay straight. Decide early; it is easier from higher up.')],
 'Full power, pitch to climb, clean up, climb away.',[
 mc('What is the first thing to do for a go-around?',['Apply full power','Pull the mixture','Lower flaps','Brake'],'Power stops the descent.'),
 mc('Is a go-around a failure?',['No, it is a safe choice','Yes, always','Only on Tuesdays','Only for students'],'Good pilots go around whenever it is not right.'),
 mc('Which is a reason for a go-around?',['An unstable approach','A clear runway','A smooth landing','A blue sky'],'Unstable approaches should end in go-arounds.'),
 tf('Flaps are retracted in stages during a go-around.',true,'Avoid sinking by changing them slowly.'),
 tf('You should wait until the last second to decide.',false,'Decide early.'),
 od('Put the go-around in order.',['Full power','Pitch to climb','Retract flaps in stages','Climb away'],'Power first, then pitch, then clean up.')]),
L('ld-bounce','Bounces and balloons',[
 cd('Bounced landing','A bounce happens when the airplane touches down too fast or too hard and springs back into the air. A small bounce can be cushioned with a bit of power and back pressure. A big bounce calls for a go-around.'),
 cd('Ballooning','If the airplane rises during the flare, it is ballooning. It usually comes from flaring too early or too much. Lower the nose a little and add power to settle, or go around if it is not right.')],
 'A big bounce means go around.',[
 mc('What is the best response to a high, hard bounce?',['Go around','Pull back hard','Cut the engine','Open the door'],'A big bounce is a go-around.'),
 mc('What is ballooning?',['Rising in the flare','A kind of cloud','Landing gear trouble','A radio problem'],'The airplane climbs when it should settle.'),
 mc('What often causes ballooning?',['Flaring too early or too much','Landing too slowly','A full tank','A cold day'],'Too much pull raises the nose too soon.'),
 tf('A small bounce can sometimes be saved.',true,'With gentle control.'),
 tf('You should push the yoke forward hard in a bounce.',false,'That can make the nose wheel hit hard.'),
 fl('A big bounce calls for a go-___.',['around','under','over','through'],'Go-around is the safe answer.')]),
L('ld-roll','The landing roll',[
 cd('Stay straight','After touchdown, keep flying the airplane. Use rudder to track the centerline, lower the nose gently, and keep the controls in the right position for the wind. Slow with the brakes once the nose wheel is down.'),
 cd('Clear the runway','When the airplane has slowed, turn off the runway at a taxiway and stop beyond the hold short line before doing the after-landing checklist. Then call the tower when told to, and taxi to parking.')],
 'Keep flying until the airplane is parked.',[
 mc('Which control keeps the airplane straight on rollout?',['Rudder','Throttle','Flaps','Trim'],'Rudder steers the airplane.'),
 mc('When do you do the after-landing checklist?',['After you have cleared the runway','Before touching down','While on short final','Before takeoff'],'Don’t do paperwork on the runway.'),
 mc('When do you brake on rollout?',['Once the nose wheel is down','Before touching down','Never','During the flare'],'Brake gently when the airplane is under control.'),
 tf('Pilots keep flying the airplane until it is stopped.',true,'The job isn’t over at touchdown.'),
 tf('You can stop on the runway to do your checklist.',false,'Clear the runway first.'),
 fl('You stop beyond the hold short ___.',['line','door','tank','tower'],'Clear the runway completely before stopping.')])
]);
})();
