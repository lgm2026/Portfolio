/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* PRIVATE PILOT 3 - AERODYNAMICS DEEP DIVE: lift, drag, load factor, stability, adverse yaw, left-turning tendencies, ground effect, wings, flaps, glide, V-speeds. */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,mt,L}=H.dsl;
H.addLessons('aero',[
L('aero-lift','Two ways to explain lift',[
 cd('Pressure','A wing is curved on top and flatter below. Air flowing over the top speeds up and its pressure drops, while the higher pressure below pushes up. Daniel Bernoulli’s principle describes this link between speed and pressure.'),
 cd('Pushing air down','The wing also deflects air downward. Newton’s third law says that pushing air down pushes the wing up. Both explanations are true views of the same event. The pressure difference and the downward flow of air are two sides of lift.')],
 'Lift is pressure and a downward push of air.',[
 mc('What does the wing do to the air to make lift?',['Pushes it downward','Pulls it forward','Heats it','Slows it to a stop'],'Newton’s law: the air is pushed down, the wing goes up.'),
 mc('What does air do over the curved top of a wing?',['Speeds up and drops in pressure','Slows and rises in pressure','Stops','Spins backwards'],'Faster air has lower pressure.'),
 mc('Which scientist’s principle links speed and pressure?',['Bernoulli','Edison','Franklin','Tesla'],'Bernoulli’s principle.'),
 tf('Both pressure and downward deflection explain lift.',true,'They describe the same thing.'),
 tf('Lift is made only by the engine.',false,'The wing makes lift.'),
 fl('Faster air has lower ___.',['pressure','weight','color','mass'],'Bernoulli’s principle.')]),
L('aero-aoa','Angle of attack and lift',[
 cd('More angle, more lift','As you raise the angle of attack, the wing makes more lift, up to a point. At the critical angle, about 15 to 18 degrees for many wings, the airflow separates and lift drops sharply. That is the stall.'),
 cd('Same angle, any speed','The wing stalls at the same critical angle at any airspeed or attitude. The airspeed at which it happens, the stall speed, depends on weight, load and other factors. The angle itself is the true cause.')],
 'Critical angle: the stall, at any speed.',[
 mc('What happens at the critical angle of attack?',['The wing stalls','Lift doubles','The engine speeds up','The flaps open'],'Airflow separates.'),
 mc('What is about the critical angle for many wings?',['15 to 18 degrees','1 to 2 degrees','45 to 50 degrees','90 degrees'],'Fifteen to eighteen degrees is common.'),
 mc('What changes with weight and load?',['Stall speed','Critical angle','Gravity','Time'],'The critical angle stays the same.'),
 tf('The angle where a wing stalls is nearly constant.',true,'The speed varies, the angle does not.'),
 tf('You can only stall at low speed.',false,'You can stall at any speed.'),
 fl('The angle between the wing and the oncoming air is angle of ___.',['attack','bank','flight','climb'],'Angle of attack.')]),
L('aero-drag','Drag: parasite and induced',[
 cd('Two families','Parasite drag comes from pushing the airplane through the air and rises with speed. It includes form drag from the airplane’s shape, skin friction from rough surfaces, and interference drag where parts meet.'),
 cd('Induced drag','Induced drag is the price of making lift. It is greatest at slow speeds and high angles of attack. At a certain speed, the two kinds of drag add up to the lowest total drag. That is the speed for the best glide.')],
 'Parasite drag grows with speed. Induced drag grows when slow.',[
 mc('When is induced drag greatest?',['Slow speed, high angle of attack','High speed','In a dive','On the ground'],'Making lots of lift at low speed costs induced drag.'),
 mc('What happens to parasite drag as speed increases?',['It increases','It decreases','It disappears','It stays zero'],'Faster means more air resistance.'),
 mc('At what speed is total drag lowest?',['Where parasite and induced drag are equal','At stall speed','At top speed','At takeoff'],'This is the best glide speed.'),
 tf('Skin friction is a type of parasite drag.',true,'Smooth surfaces reduce it.'),
 tf('Induced drag shrinks as you slow down.',false,'It grows when slow.'),
 mt('Match the drag type to its cause.',[['Form drag','Shape of the airplane'],['Skin friction','Rough surfaces'],['Induced drag','Making lift']],'Each type has a source.')]),
L('aero-load','Load factor and g',[
 cd('Pulling g','Load factor is how many times the airplane’s weight the wings must lift. In straight and level flight it is 1 g. In a level turn, it increases with bank: about 1.4 g at 45 degrees and 2 g at 60 degrees.'),
 cd('Why it matters','Higher load factors raise stall speed and stress the airplane. Normal category airplanes are built to handle at least 3.8 g. Smooth, gentle control inputs and avoiding steep turns in rough air keep loads safe.')],
 'More bank, more g.',[
 mc('What is the load factor in level flight?',['1 g','0 g','10 g','100 g'],'The wing carries its normal weight.'),
 mc('About what load factor does a 60-degree level turn create?',['2 g','0.2 g','20 g','200 g'],'Two g.'),
 mc('What does a higher load factor do to stall speed?',['Raises it','Lowers it','Nothing','Doubles lift'],'Stall speed increases.'),
 tf('Normal category airplanes are designed for at least 3.8 g.',true,'There is a structural margin.'),
 tf('A steep bank has the same load as level flight.',false,'It has a higher load factor.'),
 fl('Load factor is measured in ___.',['g','knots','degrees','feet'],'Load factor is in g units.')]),
L('aero-stable','Stability',[
 cd('Static and dynamic','An airplane is statically stable if, when disturbed, it tends to return toward its original position. It is dynamically stable if it also settles back over time, instead of swinging back and forth forever.'),
 cd('Why stability helps','Most training airplanes are stable on purpose. That makes them easy to fly and safe for beginners. Fighter jets are made less stable to maneuver quickly. A stable airplane needs gentle corrections and forgives mistakes.')],
 'Stable airplanes return to where they started.',[
 mc('What does static stability mean?',['The airplane tends to return after a disturbance','It never moves','It is heavy','It is parked'],'It returns toward the original state.'),
 mc('Why are trainers stable?',['Easy and forgiving to fly','They are slow only','They are cheap','They are loud'],'Stability helps beginners.'),
 mc('Which airplane is made less stable on purpose?',['A fighter jet','A glider','A trainer','A cargo plane'],'Less stability allows fast maneuvering.'),
 tf('Dynamic stability means oscillations die out over time.',true,'It settles down.'),
 tf('All airplanes are equally stable.',false,'Design choices change it.'),
 fl('Static stability returns the airplane toward its ___ position.',['original','highest','lowest','final'],'It returns to where it was.')]),
L('aero-adverse','Adverse yaw',[
 cd('Why the nose swings the wrong way','When you roll into a turn, the aileron on the rising wing goes down. It makes extra lift and extra drag. That drag holds the rising wing back, so the nose yaws opposite to the turn. This is adverse yaw.'),
 cd('The rudder fixes it','Pilots use rudder in the direction of the turn to keep the nose pointed along the flight path. Many airplanes have ailerons designed to reduce adverse yaw. Still, coordinated rudder use is needed, especially at slow speeds.')],
 'Roll left, rudder left.',[
 mc('Which way does adverse yaw swing the nose?',['Opposite to the turn','Into the turn','Up','Down'],'The nose swings the wrong way.'),
 mc('What fixes adverse yaw?',['Rudder in the direction of the turn','More power','Flaps','Landing gear'],'Coordinate with the rudder.'),
 mc('When is adverse yaw strongest?',['At slow speeds','At high speeds','In cruise','In a dive'],'Slow speeds need more rudder.'),
 tf('Ailerons create more drag on the wing that goes up.',true,'The down aileron adds drag.'),
 tf('Adverse yaw helps a turn.',false,'It works against the turn.'),
 fl('Adverse ___ is the nose swinging opposite the turn.',['yaw','pitch','roll','trim'],'Adverse yaw.')]),
L('aero-left','Left-turning tendencies',[
 cd('Four effects','In a single-engine airplane with a propeller that turns clockwise seen from the cockpit, four effects pull the nose left at high power and low speed: torque reaction, P-factor, spiraling slipstream and gyroscopic precession.'),
 cd('What to do','Right rudder offsets all of them, especially on takeoff and climb. The effects are strongest at full power and a high nose, like takeoff. As speed increases and the nose lowers, less right rudder is needed.')],
 'Full power, high nose, right rudder.',[
 mc('Which rudder is used at takeoff to offset left-turning tendencies?',['Right','Left','Neither','Both'],'Right rudder.'),
 mc('How many main left-turning tendencies are there?',['Four','One','Ten','Zero'],'Torque, P-factor, slipstream and precession.'),
 mc('When are the effects strongest?',['High power, low speed','Cruise','Glide','Taxi'],'Takeoff and climb.'),
 tf('P-factor is one of the left-turning tendencies.',true,'The descending blade makes more thrust.'),
 tf('The effects become stronger as speed increases a lot.',false,'They weaken at higher speed.'),
 fl('Torque makes the airplane roll the ___ way as the propeller.',['opposite','same','vertical','sideways'],'Newton’s third law.')]),
L('aero-ground','Ground effect',[
 cd('Cushion of air','Within about one wingspan above the ground, the ground interferes with the wingtip vortices. The airplane makes less induced drag and more lift, so it seems to float. This is ground effect.'),
 cd('Takeoff and landing','On landing, ground effect makes the airplane float when it is too fast. On takeoff, an airplane can lift off before it reaches safe flying speed, then settle back if it climbs out of ground effect too soon. Always accelerate to the right speed.')],
 'Ground effect floats you in and fools you out.',[
 mc('What is ground effect?',['Reduced drag and extra lift near the ground','A noise','A tire problem','A radio effect'],'The ground changes the airflow.'),
 mc('How close to the ground does it act?',['Within about one wingspan','Within 1,000 feet','At 10,000 feet','Only on grass'],'About one wingspan or less.'),
 mc('What can happen on takeoff?',['Liftoff below safe flying speed','Faster climb forever','Engine failure','Radio noise'],'The airplane may settle back.'),
 tf('Ground effect makes airplanes float on landing.',true,'Excess speed causes float.'),
 tf('Ground effect increases drag.',false,'It decreases induced drag.'),
 fl('Ground ___ is the lift boost near the surface.',['effect','speed','power','radio'],'Ground effect.')]),
L('aero-wing','Wing design',[
 cd('Aspect ratio and shape','Aspect ratio is the wing’s length compared to its width. Long, narrow wings, like a glider’s, make less induced drag. Short, wide wings are strong and good for maneuvering. Wing shape and taper also change how the lift is spread.'),
 cd('Washout','Many wings are twisted slightly so the tips have a lower angle than the roots. That is washout. It makes the roots stall first, so the ailerons near the tips keep working and the pilot can still control the roll during a stall.')],
 'Long wings are efficient. Washout keeps the ailerons alive.',[
 mc('Which wing has high aspect ratio?',['A long narrow glider wing','A short stubby wing','A paper plane','A tire'],'Gliders use long narrow wings.'),
 mc('What is washout?',['A twist so the tips have a lower angle','A car wash','A kind of cloud','A radio fault'],'It helps control during a stall.'),
 mc('Where does the stall start with washout?',['Near the roots','At the tips','At the nose','In the tail'],'Roots stall first.'),
 tf('Washout helps keep aileron control in a stall.',true,'The tips stay flying longer.'),
 tf('Short wings always make less induced drag.',false,'Long wings are better for that.'),
 fl('A glider’s wing has a high aspect ___.',['ratio','color','price','seat'],'Aspect ratio.')]),
L('aero-flaps','Flaps and lift',[
 cd('Types of flaps','Plain flaps hinge down at the back of the wing. Split flaps drop only the lower surface. Slotted flaps let air flow through a slot to keep it smooth. Fowler flaps slide back and down, adding both area and curve.'),
 cd('What flaps do','Flaps raise the maximum lift the wing can make, so the stall speed is lower. They also add drag, so you can descend steeper without gaining speed. Too much flap on takeoff can reduce climb, so use only the setting your airplane’s manual calls for.')],
 'Flaps add lift and drag.',[
 mc('What is the main effect of flaps?',['More lift and more drag','Less lift','More speed','Less drag'],'Flaps let the airplane fly slower.'),
 mc('Which flap slides back and down?',['Fowler','Split','Plain','Slotted'],'Fowler flaps also increase wing area.'),
 mc('What do flaps do to stall speed?',['Lower it','Raise it','Nothing','Triple it'],'The wing can fly slower.'),
 tf('Too much flap on takeoff can hurt climb performance.',true,'Drag rises.'),
 tf('Flaps work only on the ground.',false,'They are used in flight.'),
 fl('Flaps add lift and ___.',['drag','speed','fuel','radio'],'Drag too.')]),
L('aero-glide','Gliding and best glide',[
 cd('Lift over drag','An airplane’s glide ratio equals its lift divided by its drag, called L over D. At best glide speed, L/D is at its maximum. Fly any other speed and you glide a shorter distance.'),
 cd('Weight and wind','A heavier airplane glides at a faster speed but covers the same distance in still air. A headwind shortens the glide over the ground, and a tailwind lengthens it. Pilots memorize the best glide speed for their airplane.')],
 'Best glide speed is best L over D.',[
 mc('What is L over D?',['Lift divided by drag','Length over distance','Landing over departure','Load over drag'],'It is the glide ratio.'),
 mc('Does a heavier airplane glide farther in still air?',['No, same distance but faster','Yes, much','It cannot glide','Twice as far'],'The ratio stays the same; the speed is higher.'),
 mc('What shortens the glide over the ground?',['A headwind','A tailwind','Clear skies','Blue paint'],'Headwind slows ground speed.'),
 tf('Pilots memorize best glide speed.',true,'It is a vital number.'),
 tf('Flying faster than best glide increases the distance.',false,'It shortens it.'),
 fl('Best glide gives the maximum lift over ___ ratio.',['drag','dust','distance','direction'],'L over D.')]),
L('aero-vs','V-speeds and the airspeed arcs',[
 cd('The color arcs','The airspeed indicator has colored arcs. The white arc is the flap operating range. The green arc is normal operation. The yellow arc is caution: fly in it only in smooth air. The red line is Vne, the speed never to exceed.'),
 cd('Key speeds','Vs0 is the stall speed with landing flaps and Vs1 without. Vfe is the highest speed with flaps out. Vno is the top of the green arc. Va is the maneuvering speed, which goes down as weight goes down. Vx and Vy are the best climb speeds.')],
 'White flaps, green normal, yellow caution, red never.',[
 mc('What is Vne?',['The never-exceed speed','The best climb speed','The stall speed','The flaps-up speed'],'It is the red line on the airspeed indicator.'),
 mc('What is the green arc?',['Normal operating range','Flap range','Danger','Landing only'],'It runs from Vs1 to Vno.'),
 mc('What is the yellow arc?',['Smooth air only','Always safe','Forbidden','Flaps only'],'It’s the caution range.'),
 tf('Va goes down when the airplane is lighter.',true,'Lower weight means lower Va.'),
 tf('The white arc is for cruise.',false,'It is for flaps.'),
 mt('Match each speed to its meaning.',[['Vne','Never exceed'],['Vfe','Max with flaps out'],['Vs0','Stall in landing setup']],'Know your V-speeds.')])
]);
})();
