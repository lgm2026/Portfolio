/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* STUDENT PILOT 5 - BASIC MANEUVERS: the four fundamentals and the habits that make them smooth. */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,mt,od,L}=H.dsl;
H.addLessons('maneuvers',[
L('man-four','The four fundamentals',[
 cd('Four building blocks','Every flight is made of four basic maneuvers: straight-and-level flight, turns, climbs, and descents. Master these and you can combine them to fly anywhere. Everything else in flying is built from them.'),
 cd('Control and performance','Pilots control the airplane with attitude and power. Attitude is where the nose and wings sit compared to the horizon. Power sets the speed and climb or descent. Together they give the performance you want.')],
 'Attitude plus power equals performance.',[
 mc('Which is one of the four fundamentals?',['Turns','Takeoff checklist','Radio calls','Fueling'],'The four are straight-and-level, turns, climbs and descents.'),
 mc('What combination controls performance?',['Attitude and power','Color and size','Fuel and tires','Radio and lights'],'Where the nose points and how much power you use sets what the airplane does.'),
 mc('What is attitude?',['The airplane’s position compared to the horizon','The pilot’s mood','The altitude','The speed'],'It describes pitch and bank.'),
 tf('A turn is one of the basic fundamentals.',true,'Turns are one of the four.'),
 tf('Takeoff and landing are two of the four fundamentals.',false,'They combine the fundamentals.'),
 od('Put the four fundamentals in the order a new student often meets them.',['Straight-and-level','Turns','Climbs','Descents'],'Many instructors teach them in this order.')]),
L('man-attitude','Attitude flying',[
 cd('Pitch, bank, power','Pilots control the airplane by setting a pitch attitude, a bank attitude and a power setting. A certain pitch attitude with a certain power gives a certain airspeed and climb or descent.'),
 cd('Use the horizon','Look at where the cowling meets the horizon to set pitch. Look at the wing tips to see bank. When you know the picture for level flight, you can see every small change right away.')],
 'Learn the picture. Spot the change. Fix it small.',[
 mc('What gives the picture of pitch?',['The nose or cowling against the horizon','The altimeter only','The radio','The seat'],'Referencing the horizon is the fastest way to see pitch.'),
 mc('What does bank refer to?',['The tilt of the wings','The nose height','The speed','The fuel'],'Bank is the tilt of the wings left or right.'),
 mc('How big should corrections be?',['Small','Huge','None','Violent'],'Small corrections stay ahead of the airplane.'),
 tf('Learning the picture of level flight makes every change easier to see.',true,'A trained eye notices small differences.'),
 tf('You can fly well without looking outside.',false,'The visual horizon is the key reference.'),
 fl('The tilt of the wings is called ___.',['bank','pitch','yaw','trim'],'Bank describes roll attitude.')]),
L('man-level','Straight-and-level flight',[
 cd('Holding steady','To fly straight and level you keep the wings level with the horizon and the nose at a steady spot. Altitude stays the same when pitch and power are right. Trim lets you fly with a light touch.'),
 cd('Spotting drift','If the altitude creeps up or down or the heading wanders, make a small correction and wait to see the result. Chasing the gauges with big movements only creates new errors.')],
 'Small, patient corrections win.',[
 mc('What does straight-and-level mean?',['Constant heading and altitude','Going upward','Going down','Spinning'],'It means no turning, climbing or descending.'),
 mc('How should you fix a small altitude drift?',['A small pitch correction','A huge pull','Turn the radio on','Close your eyes'],'Small corrections work best.'),
 mc('What helps you fly with a light touch?',['Trim','More fuel','A louder engine','Flaps down'],'Trim removes the pressure so your hands relax.'),
 tf('Chasing the gauges with big movements causes more errors.',true,'Overcontrolling makes things worse.'),
 tf('Altitude only stays constant if you never touch the controls.',false,'Pilots make constant tiny corrections.'),
 fl('Setting ___ lets the airplane fly itself for a moment.',['trim','flaps','radio','lights'],'Properly trimmed airplanes hold their attitude.')]),
L('man-turn','How a turn works',[
 cd('Roll first','To turn, the pilot rolls the airplane with the ailerons so the wing lift tilts. A tilted lift force has a sideways part, and that pulls the airplane around. The rudder keeps the nose pointing the way the airplane is going.'),
 cd('Back pressure','In a turn some of the lift is used sideways, so the pilot adds a bit of back pressure on the yoke to stay level. To roll out, the pilot applies opposite aileron and relaxes the extra back pressure.')],
 'Roll in, pull a little, roll out.',[
 mc('What makes an airplane turn?',['Tilting the lift with bank','The tail light','The tires','The seat'],'The sideways part of lift pulls the airplane around.'),
 mc('Which control rolls the airplane?',['Ailerons','Elevator','Rudder only','Flaps'],'Ailerons make the airplane roll.'),
 mc('Why add back pressure in a turn?',['To keep from losing altitude','To go faster','To light the engine','To help the radio'],'Less of the lift is pointing up, so the nose needs to rise slightly.'),
 tf('The rudder is used to keep the turn coordinated.',true,'The rudder keeps the nose from slipping or skidding.'),
 tf('You do nothing to roll out of a turn.',false,'Opposite aileron brings the wings level.'),
 fl('Turning begins by ___ the wings.',['banking','folding','washing','locking'],'Banking tilts the wings.')]),
L('man-rate','How steep and how fast',[
 cd('Shallow, medium, steep','Bank angles are called shallow (under about 20 degrees), medium (about 20 to 45) and steep (more than 45). The steeper the bank, the faster the airplane turns, but the more back pressure and load it needs.'),
 cd('Standard rate','A standard-rate turn changes heading by 3 degrees per second, which makes a full circle in two minutes. The turn coordinator shows it. Instrument pilots use standard rate turns all the time.')],
 'Standard rate is three degrees per second.',[
 mc('How many degrees per second is a standard-rate turn?',['3','30','0.3','90'],'3 degrees per second makes 360 degrees in two minutes.'),
 mc('How long does a standard-rate full circle take?',['2 minutes','2 seconds','20 minutes','1 hour'],'360 divided by 3 is 120 seconds.'),
 mc('What happens when you steepen the bank?',['It turns faster and needs more back pressure','The turn gets slower','Nothing','The engine stops'],'More bank gives a higher turn rate and more load.'),
 tf('A steep bank is more than about 45 degrees.',true,'Steep turns are a practiced maneuver.'),
 tf('A shallow bank makes the quickest turn.',false,'Steeper bank makes the faster turn.'),
 fl('A standard rate turn is ___ degrees per second.',['3','13','30','300'],'It completes a full circle in two minutes.')]),
L('man-climb','Climbing',[
 cd('Pitch up, power up','To climb, raise the nose to the climb attitude and add power. Once the airplane settles at its climb speed, trim it. The airplane continues to climb without more effort.'),
 cd('Two best speeds','Vx gives the steepest climb, which clears obstacles close to the runway. Vy gives the fastest climb, which gains the most altitude per minute. Vx is slower than Vy.')],
 'Vx for obstacles, Vy for time.',[
 mc('Which speed gives the steepest climb?',['Vx','Vy','Va','Vne'],'Vx is best angle of climb.'),
 mc('Which speed gives the most altitude per minute?',['Vy','Vx','Vso','Vne'],'Vy is best rate of climb.'),
 mc('Which is slower?',['Vx','Vy','They are equal','Vne'],'Vx is lower than Vy.'),
 tf('You can trim the airplane in a climb.',true,'Trim removes the pressure.'),
 tf('Climbing needs less power than level flight.',false,'Climbs need extra power.'),
 mt('Match the speed to its use.',[['Vx','Steepest climb'],['Vy','Fastest climb'],['Vne','Never exceed']],'Pilots memorize these V-speeds for their airplane.')]),
L('man-descent','Descending',[
 cd('Power down','To descend, reduce power and let the nose lower to hold the airspeed you want. The airplane trades altitude for speed. A normal descent is planned so you arrive at the right place at the right height.'),
 cd('Keep it under control','Watch airspeed and keep the engine warm by not leaving the throttle all the way back for long. Add power before you level off. A stabilized descent is smooth and controlled.')],
 'Power back, nose down, speed steady.',[
 mc('How do you start a descent?',['Reduce power','Add full power','Raise the flaps','Turn off the engine'],'Less power means the airplane settles into a descent.'),
 mc('When should power be added in a descent?',['Before leveling off','After landing','Never','After the engine stops'],'Adding power early prevents sinking below your altitude.'),
 mc('An airplane in a descent trades…',['Altitude for speed','Speed for fuel','Fuel for lift','Weight for time'],'Potential energy becomes speed.'),
 tf('A stabilized descent is smooth and controlled.',true,'This is the goal.'),
 tf('The engine always needs to be turned off for descent.',false,'Power is reduced, not off.'),
 fl('When power is reduced the nose will ___.',['lower','rise','spin','vanish'],'Without the extra thrust the nose tends to lower.')]),
L('man-levelout','Leveling off',[
 cd('Lead the altitude','Airplanes do not stop on a dime. To level off at an altitude, start the change early. A common rule is to begin leveling about 10 percent of your vertical speed before the target. In a 500 feet per minute climb, that is 50 feet.'),
 cd('The steps','Lower the nose to level flight, let the speed build, then reduce power to cruise and trim. In a descent, add power first, then raise the nose. Always cross-check the altimeter as you finish.')],
 'Lead the target, then trim.',[
 mc('When should you start leveling off?',['A little before the target altitude','Exactly at the target','After passing it','Never'],'The airplane needs a moment to stop climbing.'),
 mc('How early in a 500 feet per minute climb is a rule of thumb?',['About 50 feet','About 5 feet','About 5,000 feet','About 500 feet'],'10 percent of the vertical speed.'),
 mc('What do you do first when leveling off from a descent?',['Add power','Pull the mixture','Open the door','Do nothing'],'Power first prevents the speed from dropping.'),
 tf('You check the altimeter while leveling off.',true,'The altimeter confirms the altitude.'),
 tf('You can ignore trim after leveling off.',false,'Trim keeps the flight relaxed.'),
 fl('Leveling off starts ___ you reach the altitude.',['before','after','during landing','never'],'Anticipate the change.')]),
L('man-trim','Trim: the lazy pilot’s friend',[
 cd('Why trim','Holding a steady force on the yoke tires your hand and makes your flying jerky. Trim lets you set the airplane to fly at a speed with no control pressure. It is not for making big changes but for relaxing your hands.'),
 cd('Trim after changes','Whenever you change power, pitch, or flaps, retrim. A well-trimmed airplane flies itself, leaving the pilot free to look around, talk on the radio and plan ahead.')],
 'Fly it, then trim it.',[
 mc('What is trim for?',['Removing control pressure','Adding power','Starting the engine','Steering on the ground'],'Trim eases the pressure on your hands.'),
 mc('When should you retrim?',['After changing power or pitch','Never','Only in landing','Only on the ground'],'New speeds need new trim.'),
 mc('What does a trimmed airplane let the pilot do?',['Look outside and plan ahead','Take a nap','Leave the cockpit','Stop flying'],'Free hands, free attention.'),
 tf('Trim is a way to make big changes in pitch.',false,'Fly first, then trim to relieve the pressure.'),
 tf('A well-trimmed airplane holds its attitude on its own.',true,'That is its job.'),
 fl('You ___ the airplane after changing power.',['retrim','repaint','refuel','rename'],'Retrim to hold the new attitude.')]),
L('man-coord','Coordinated flight',[
 cd('The ball','The turn coordinator has a ball in a curved tube. When the ball is centered, the flight is coordinated: the nose is pointing the way the airplane is going. A ball off to one side means slip or skid.'),
 cd('Step on the ball','If the ball is off to the left, press the left rudder pedal. If it is to the right, press the right. A saying pilots use: “step on the ball.” Good coordination is smoother, safer and more comfortable for passengers.')],
 'Step on the ball.',[
 mc('What does a centered ball show?',['Coordinated flight','An engine fire','A stall','A radio call'],'The airplane is not slipping or skidding.'),
 mc('If the ball is to the right, which pedal do you press?',['Right','Left','Neither','Both'],'Step on the ball.'),
 mc('Which control mainly fixes the ball?',['Rudder','Throttle','Flaps','Trim'],'The rudder swings the nose to center the ball.'),
 tf('Coordination makes flight smoother.',true,'Passengers notice.'),
 tf('The ball only matters at night.',false,'It matters all the time.'),
 fl('Good flying keeps the ___ centered.',['ball','needle','tach','clock'],'A centered ball means coordinated flight.')]),
L('man-scan','The scan and clearing turns',[
 cd('Outside, inside, outside','New pilots learn to look outside first, then glance at the instruments, then look outside again. Most of the time, your eyes should be outside looking for traffic and the horizon. The instruments just back up what you see.'),
 cd('Clear the area','Before any practice maneuver, make clearing turns by looking left, right, above and below. Make sure the area is free of other aircraft. Once you have checked, announce on the radio and begin.')],
 'Look, check, look again.',[
 mc('What is a clearing turn for?',['Checking for other aircraft','Cleaning the windshield','Slowing down','Fueling'],'It lets you see the area you are about to use.'),
 mc('What is a good scan pattern?',['Outside, instruments, outside','Only instruments','Only the floor','Only the sun'],'Eyes outside most of the time.'),
 mc('When should you clear the area?',['Before practice maneuvers','Only after landing','Only at night','Never'],'It prevents collisions.'),
 tf('Pilots look outside for traffic constantly.',true,'See and avoid is a pilot’s duty.'),
 tf('The instruments should be stared at the whole time.',false,'Eyes outside matter most in visual flight.'),
 fl('Before a maneuver, make a ___ turn to look for traffic.',['clearing','circling','cooling','closing'],'Clearing turns give you a view of the whole area.')]),
L('man-ground','Reading the wind from the ground',[
 cd('Drift','The air moves over the ground. An airplane in the air moves with that air, so a wind from the side pushes it off its track. That sideways push is called drift. Pilots watch the ground to see it.'),
 cd('Ground reference maneuvers','Flying patterns like rectangular courses and turns around a point teaches you to see the wind and correct for it. These skills help you fly accurate traffic patterns and cross-country courses.')],
 'Watch the ground, see the wind.',[
 mc('What is drift?',['Sideways movement from the wind','A kind of climb','A radio call','A fuel leak'],'The wind pushes the airplane off its track.'),
 mc('Why practice ground reference maneuvers?',['To learn to see and correct for wind','To burn fuel','To land faster','To avoid rules'],'Wind awareness improves every flight.'),
 mc('What should the pilot do to stay on track in a crosswind?',['Point the nose slightly into the wind','Point away from the wind','Ignore it','Stop the engine'],'A crab angle into the wind holds the track.'),
 tf('A wind from the side can push an airplane off course.',true,'The airplane moves with the air.'),
 tf('The ground stays at the same speed relative to the airplane in any wind.',false,'Wind changes ground speed and track.'),
 fl('The sideways push of the wind on an airplane is ___.',['drift','rate','pitch','lift'],'Pilots correct for drift.')])
]);
})();
