/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* HYPETEEN FLIGHT ACADEMY - LESSONS, PART 1: how airplanes fly, parts of an airplane, flight controls, cockpit instruments.
   Format: see the top of hfq_lessons.js. Facts follow the FAA Pilot's Handbook of Aeronautical Knowledge (PHAK) and the AIM,
   written for cadets 10-14. a[0] is always the right answer (options shuffle at play time). */
(function(){
const H=G.HFQ;

/* ============================ 1. HOW AIRPLANES FLY ============================ */
H.addLessons('flight',[
 {id:'flight-forces',t:'The four forces',
  cards:[
   {t:'Four forces',b:'Every airplane in flight is pushed and pulled by four forces. LIFT pushes up, WEIGHT pulls down, THRUST pushes forward and DRAG holds it back.',fig:'forces'},
   {t:'In balance',b:'When lift equals weight and thrust equals drag, the airplane cruises straight and level at a steady speed. Change one force and the airplane changes what it is doing.'}],
  tip:'Lift up, weight down, thrust go, drag slow.',
  qs:[
   {k:'tap',q:'Tap the force that pulls the airplane toward the ground.',fig:{f:'forces',hide:['lift','weight','thrust','drag']},z:'weight',zl:'Weight (the arrow pointing down)',why:'Weight is gravity pulling the airplane down toward the earth.'},
   {k:'mc',q:'Which force does the propeller or jet engine make?',a:['Thrust','Lift','Drag','Weight'],why:'Engines and propellers make thrust, the force that pushes the airplane forward.'},
   {k:'match',q:'Match each force to the way it acts.',p:[['Lift','Up'],['Weight','Down'],['Thrust','Forward'],['Drag','Backward']],why:'Lift up, weight down, thrust forward, drag back.'},
   {k:'tf',q:'In steady, level flight, lift and weight are balanced.',t:true,why:'When lift equals weight, the airplane holds its altitude.'},
   {k:'fill',q:'The force that tries to slow the airplane down is ___.',a:['drag','lift','thrust'],why:'Drag is air resistance. It pulls back against the airplane as it moves.'},
   {k:'mc',q:'A pilot adds power but holds the same altitude. What happens?',a:['The airplane speeds up','The airplane gets heavier','The wings stop making lift','The airplane slows down'],why:'More thrust than drag makes the airplane speed up until drag catches up with thrust again.'}]},
 {id:'flight-wing',t:'How a wing makes lift',
  cards:[
   {t:'The wing’s shape',b:'A wing’s cross-section is called an AIRFOIL. It has a rounded front, the LEADING EDGE, and a thin back, the TRAILING EDGE.',fig:{f:'wing',aoa:4,labels:true}},
   {t:'Pushing air down',b:'As the wing moves, it bends the passing air downward. The air pressure above the wing drops lower than the pressure below it. That difference pushes the wing up. That push is LIFT.'},
   {t:'More speed, more lift',b:'The faster air flows over the wing, the more lift it can make. That is why airplanes race down a long runway before they lift off.'}],
  tip:'Wings push air down, so the air pushes the wing up.',
  qs:[
   {k:'mc',q:'What is the cross-section shape of a wing called?',a:['An airfoil','A propeller','A fuselage','A rudder'],why:'An airfoil is the special curved shape that makes lift when air flows over it.'},
   {k:'tap',q:'Tap the LEADING EDGE of the wing.',fig:{f:'wing',aoa:4},z:'lead',zl:'The rounded front edge',why:'The leading edge is the rounded front edge that meets the air first.'},
   {k:'tf',q:'When a wing makes lift, the air pressure on top is lower than the pressure underneath.',t:true,why:'Lower pressure above and higher pressure below adds up to an upward push: lift.'},
   {k:'mc',q:'Why does an airplane race down the runway before it lifts off?',a:['Its wings need speed to make enough lift','To warm up the tires','To burn extra fuel','So the tower can see it'],why:'Lift grows with speed. Once the wings make more lift than the airplane weighs, it flies.'},
   {k:'fill',q:'The thin back edge of a wing is the ___ edge.',a:['trailing','leading','outer'],why:'Leading edge in front, trailing edge in back.'},
   {k:'tf',q:'A wing can make lift even when no air flows over it.',t:false,why:'No airflow, no lift. That is why airplanes need airspeed to fly.'}]},
 {id:'flight-aoa',t:'Angle of attack',
  cards:[
   {t:'Meeting the air',b:'The ANGLE OF ATTACK is the angle between the wing and the air flowing toward it. Pilots call that oncoming air the RELATIVE WIND.',fig:{f:'wing',aoa:9,angle:true}},
   {t:'More angle, more lift (to a point)',b:'Raising the nose increases the angle of attack and makes more lift. But every wing has a limit, called the CRITICAL ANGLE OF ATTACK.'}],
  tip:'Angle of attack is how the wing meets the wind.',
  qs:[
   {k:'mc',q:'Angle of attack is the angle between the wing and…',a:['the oncoming air (relative wind)','the ground','the horizon','the propeller'],why:'It is measured against the air flowing toward the wing, not against the ground or the horizon.'},
   {k:'tf',q:'Increasing the angle of attack makes more lift, up to a limit.',t:true,why:'More angle means more lift, until the wing reaches its critical angle of attack.'},
   {k:'mc',q:'What is the limit called where the wing stops making enough lift?',a:['The critical angle of attack','The maximum altitude','The top speed','The cruise angle'],why:'Go past the critical angle of attack and the wing stalls.'},
   {k:'tap',q:'Tap the RELATIVE WIND arrows.',fig:{f:'wing',aoa:9,angle:true,quiz:true},z:'wind',zl:'The blue arrows coming from the left',why:'The relative wind is the airflow coming at the wing, shown by the blue arrows.'},
   {k:'fill',q:'Raising the airplane’s nose usually ___ the angle of attack.',a:['increases','decreases','removes'],why:'Tilting the wing up into the oncoming air increases the angle of attack.'},
   {k:'tf',q:'Angle of attack is exactly the same as how high the nose points above the horizon.',t:false,why:'Nose-versus-horizon is called pitch. Angle of attack compares the wing with the oncoming air, and the two are often different.'}]},
 {id:'flight-stall',t:'What a stall really is',
  cards:[
   {t:'A stall is not the engine',b:'In flying, a STALL means the wing has gone past its critical angle of attack. The smooth air over the top breaks away and the wing loses much of its lift. The engine can be running perfectly!',fig:{f:'wing',aoa:18,stall:true}},
   {t:'The fix',b:'To recover, the pilot LOWERS THE NOSE to reduce the angle of attack, LEVELS THE WINGS, then ADDS POWER as needed. Pilots practice stalls with an instructor, high above the ground.'}],
  tip:'Stall? Lower the nose first.',
  qs:[
   {k:'tf',q:'An airplane stall means the engine quit.',t:false,why:'An aerodynamic stall is about the wing going past its critical angle of attack. The engine can be running fine.'},
   {k:'mc',q:'What causes a wing to stall?',a:['Going past the critical angle of attack','Flying too high','Running low on fuel','Turning on the lights'],why:'Too much angle of attack makes the airflow over the wing break away.'},
   {k:'order',q:'Put the stall recovery steps in order.',s:['Lower the nose','Level the wings','Add power as needed'],why:'Reduce the angle of attack first, then level the wings, then add power as needed.'},
   {k:'tf',q:'A wing can stall at any airspeed if the angle of attack is too high.',t:true,why:'Stalls are about angle, not speed. A steep, tight turn can stall a wing even when it is going fast.'},
   {k:'mc',q:'What is the FIRST thing to do to recover from a stall?',a:['Lower the nose','Pull back harder','Turn off the engine','Lower the landing gear'],why:'Lowering the nose reduces the angle of attack, which lets smooth airflow and lift come back.'},
   {k:'tap',q:'Tap where the airflow has broken away from the wing.',fig:{f:'wing',aoa:18,stall:true},z:'top',zl:'Above the top of the wing',why:'In a stall, the air over the top of the wing stops flowing smoothly and tumbles.'}]}
]);

/* ============================ 2. PARTS OF AN AIRPLANE ============================ */
H.addLessons('parts',[
 {id:'parts-big',t:'Fuselage, wings + tail',
  cards:[
   {t:'Five big parts',b:'A training airplane has five major parts: the FUSELAGE (the body), the WINGS, the EMPENNAGE (the tail), the POWERPLANT (engine and propeller) and the LANDING GEAR.',fig:{f:'planeSide',labels:true}},
   {t:'The tail',b:'The tail is called the EMPENNAGE (EM-pen-nij). It has a VERTICAL STABILIZER, the fin, and a HORIZONTAL STABILIZER. Like the feathers on an arrow, they keep the airplane flying straight.',fig:{f:'planeSide',hl:['fin','rudder','hstab','elevator'],labels:['fin','hstab']}}],
  tip:'Body, wings, tail, engine, gear.',
  qs:[
   {k:'tap',q:'Tap the FUSELAGE.',fig:'planeSide',z:'fuselage',zl:'The body of the airplane',why:'The fuselage is the main body, where the pilot and passengers sit.'},
   {k:'mc',q:'What is the airplane’s tail section called?',a:['The empennage','The cockpit','The cowling','The fuselage'],why:'The empennage is the whole tail: the stabilizers, the elevator and the rudder.'},
   {k:'tap',q:'Tap the VERTICAL STABILIZER (the fin).',fig:'planeSide',z:'fin',zl:'The tall fin on the tail',why:'The vertical stabilizer is the tall fin. It keeps the nose from swinging side to side.'},
   {k:'tf',q:'The tail’s stabilizers help keep the airplane flying straight.',t:true,why:'Like arrow feathers, the stabilizers keep the airplane pointed where it is going.'},
   {k:'match',q:'Match each part to what it is.',p:[['Fuselage','The body'],['Wings','Make lift'],['Empennage','The tail'],['Powerplant','Engine + propeller']],why:'Body, wings, tail, engine. Plus the landing gear makes five.'},
   {k:'fill',q:'The airplane’s main body is the ___.',a:['fuselage','empennage','aileron'],why:'Fuselage comes from a French word for a spindle shape.'}]},
 {id:'parts-surfaces',t:'Ailerons, elevator + rudder',
  cards:[
   {t:'Control surfaces',b:'Hinged panels move to steer the airplane. AILERONS are on the outer back edge of each wing. The ELEVATOR is on the horizontal tail. The RUDDER is on the vertical tail.',fig:{f:'planeTop',hl:['aileron','elevator','rudder'],labels:['aileron','elevator','rudder']}},
   {t:'Working in pairs',b:'The two ailerons move in opposite directions. When one goes up, the other goes down. That tips the wings into a bank.'}],
  tip:'Ailerons on the wings. Elevator and rudder on the tail.',
  qs:[
   {k:'tap',q:'Tap an AILERON.',fig:'planeTop',z:'aileron',zl:'The outer back edge of a wing',why:'Ailerons sit on the outer trailing edge of each wing, near the wingtips.'},
   {k:'tap',q:'Tap the ELEVATOR.',fig:'planeTop',z:'elevator',zl:'The back edge of the horizontal tail',why:'The elevator is the hinged back part of the horizontal tail.'},
   {k:'tap',q:'Tap the RUDDER.',fig:'planeSide',z:'rudder',zl:'The back part of the tall tail fin',why:'The rudder is the hinged back part of the vertical stabilizer.'},
   {k:'tf',q:'When the left aileron goes up, the right aileron goes down.',t:true,why:'Ailerons always move opposite each other. That is what rolls the airplane.'},
   {k:'mc',q:'Where is the elevator?',a:['On the horizontal part of the tail','On the tip of each wing','Under the engine','Inside the cockpit'],why:'The elevator hangs off the back of the horizontal stabilizer.'},
   {k:'match',q:'Match each control surface to where it lives.',p:[['Ailerons','Outer wing edges'],['Elevator','Horizontal tail'],['Rudder','Vertical tail']],why:'Wings have ailerons. The tail has the elevator and rudder.'}]},
 {id:'parts-flaps',t:'Flaps + trim',
  cards:[
   {t:'Flaps',b:'FLAPS are panels on the inner back edge of the wings, near the body. Lowering them adds lift AND drag, so the airplane can fly slower and come down at a steeper angle for landing.',fig:{f:'planeTop',hl:'flap',labels:['flap']}},
   {t:'Trim',b:'A TRIM TAB is a small adjustable panel, often on the elevator. Pilots set the trim so they do not have to keep pushing or pulling on the controls. It takes the pressure off their hands.'}],
  tip:'Flaps for slow and steep. Trim for relaxed hands.',
  qs:[
   {k:'tap',q:'Tap a FLAP.',fig:'planeTop',z:'flap',zl:'The inner back edge of a wing',why:'Flaps sit on the inner trailing edge of each wing, close to the fuselage.'},
   {k:'mc',q:'What do flaps add when they are lowered?',a:['Lift and drag','Only speed','Fuel','Weight'],why:'Flaps add lift and drag, which lets the airplane fly slower and descend steeper.'},
   {k:'tf',q:'Flaps help an airplane land at a slower speed.',t:true,why:'Slower landings need less runway and are gentler on the airplane.'},
   {k:'mc',q:'What does trim help a pilot do?',a:['Hold the controls without pushing or pulling','Start the engine','Talk on the radio','Turn on the lights'],why:'Trim takes away the steady pressure the pilot would otherwise have to hold.'},
   {k:'fill',q:'Flaps sit on the back edge of the wing, near the ___.',a:['fuselage','wingtip','propeller'],why:'Flaps are inboard, near the fuselage. Ailerons are outboard, near the wingtips.'},
   {k:'tf',q:'Flaps are a primary flight control, like the ailerons.',t:false,why:'Flaps are secondary controls. The primary controls are the ailerons, elevator and rudder.'}]},
 {id:'parts-gear',t:'Landing gear + engine',
  cards:[
   {t:'Landing gear',b:'Most trainers have TRICYCLE gear: two main wheels plus a nose wheel. Older TAILDRAGGERS have a small wheel under the tail instead.',fig:{f:'planeSide',hl:'gear',labels:['gear']}},
   {t:'The powerplant',b:'The engine turns the PROPELLER, which bites into the air and pulls the airplane forward. The COWLING is the cover around the engine.',fig:{f:'planeSide',hl:['engine','prop'],labels:['prop','engine']}}],
  tip:'Gear holds you up on the ground. The prop pulls you through the air.',
  qs:[
   {k:'tap',q:'Tap the PROPELLER.',fig:'planeSide',z:'prop',zl:'The spinning blades on the nose',why:'The propeller is on the nose. The engine spins it to make thrust.'},
   {k:'mc',q:'Tricycle landing gear has…',a:['Two main wheels and a nose wheel','Three wheels under the tail','Skis instead of wheels','One big wheel'],why:'Two mains plus a nose wheel make three, like a tricycle.'},
   {k:'tap',q:'Tap the LANDING GEAR.',fig:'planeSide',z:'gear',zl:'The wheels under the airplane',why:'The landing gear is the wheels and legs that hold the airplane up on the ground.'},
   {k:'tf',q:'A taildragger has its small wheel under the tail.',t:true,why:'That is where the name comes from: the tail sits low, near the ground.'},
   {k:'mc',q:'What is the cover around the engine called?',a:['The cowling','The canopy','The fuselage','The flap'],why:'The cowling protects the engine and helps guide cooling air around it.'},
   {k:'tf',q:'It is safe to walk close to a propeller as long as the engine is off.',t:false,why:'Always treat a propeller as if it could start. Stay clear of the propeller arc.'}]}
]);

/* ============================ 3. FLIGHT CONTROLS ============================ */
H.addLessons('controls',[
 {id:'ctl-axes',t:'The three axes',
  cards:[
   {t:'Three ways to rotate',b:'An airplane can rotate three ways. ROLL tips the wings, PITCH moves the nose up and down, and YAW swings the nose left and right.',fig:'axes'},
   {t:'The axes',b:'Each motion turns around an imaginary line called an AXIS. Roll turns around the LONGITUDINAL axis (nose to tail), pitch around the LATERAL axis (wingtip to wingtip) and yaw around the VERTICAL axis. All three cross at the CENTER OF GRAVITY.'}],
  tip:'Roll tips the wings. Pitch nods the nose. Yaw shakes it side to side.',
  qs:[
   {k:'match',q:'Match each motion to what the airplane does.',p:[['Roll','Wings tip'],['Pitch','Nose up or down'],['Yaw','Nose left or right']],why:'Roll, pitch and yaw are the three ways an airplane rotates.'},
   {k:'mc',q:'Nodding your head “yes” is like which motion?',a:['Pitch','Roll','Yaw'],why:'Pitch moves the nose up and down, just like nodding.'},
   {k:'mc',q:'Shaking your head “no” is like which motion?',a:['Yaw','Pitch','Roll'],why:'Yaw swings the nose left and right, like shaking your head.'},
   {k:'tap',q:'An airplane ROLLS around one of these axes. Tap it.',fig:{f:'axes',quiz:true},z:'long',zl:'The longitudinal axis, running nose to tail',why:'The longitudinal axis runs nose to tail. The airplane rolls around it.'},
   {k:'tf',q:'All three axes pass through the airplane’s center of gravity.',t:true,why:'The center of gravity is the balance point, and every rotation happens around it.'},
   {k:'fill',q:'Roll happens around the ___ axis.',a:['longitudinal','lateral','vertical'],why:'Roll is around the longitudinal axis, the nose-to-tail line.'}]},
 {id:'ctl-yoke',t:'The yoke or stick',
  cards:[
   {t:'Hands on the yoke',b:'The YOKE (or a STICK in some airplanes) works the ailerons and the elevator. Turn it left and the airplane rolls left. Turn it right and it rolls right.',fig:{f:'cockpit',hl:'yoke'}},
   {t:'Push and pull',b:'Pull the yoke back and the elevator raises the nose. Push it forward and the nose goes down. Pilots joke: pull back and the houses get smaller, push forward and they get bigger!'}],
  tip:'Turn to roll. Pull to raise the nose, push to lower it.',
  qs:[
   {k:'mc',q:'What happens when the pilot pulls the yoke back?',a:['The nose pitches up','The airplane rolls left','The engine gets louder','The flaps go down'],why:'Pulling back raises the elevator’s back edge, which pushes the tail down and the nose up.'},
   {k:'mc',q:'Turning the yoke to the right makes the airplane…',a:['Roll (bank) to the right','Pitch down','Speed up','Yaw to the left'],why:'Turning the yoke moves the ailerons, which roll the airplane the same way you turn.'},
   {k:'tap',q:'Tap the YOKE.',fig:'cockpit',z:'yoke',zl:'The steering handles in front of the pilot',why:'The yoke is the pair of handles the pilot holds.'},
   {k:'tf',q:'The yoke controls the ailerons and the elevator.',t:true,why:'Turn it for the ailerons (roll). Push or pull it for the elevator (pitch).'},
   {k:'match',q:'Match each yoke move to what happens.',p:[['Turn yoke left','Roll left'],['Pull yoke back','Nose up'],['Push yoke forward','Nose down']],why:'Turning rolls. Pulling and pushing pitch the nose.'},
   {k:'tf',q:'In the air, airplanes turn using only the rudder.',t:false,why:'Banking tilts the lift so it pulls the airplane around the turn. The rudder helps keep the turn smooth.'}]},
 {id:'ctl-pedals',t:'Rudder pedals',
  cards:[
   {t:'Feet fly too',b:'Pilots work the RUDDER with two pedals at their feet. Push the left pedal and the nose yaws left. Push the right pedal and it yaws right.',fig:{f:'cockpit',hl:'pedals',labels:true}},
   {t:'On the ground',b:'On the ground, the pedals also steer the nose wheel. In many trainers, pressing the TOPS of the pedals works the brakes, each side on its own.'}],
  tip:'Left pedal, nose left. Right pedal, nose right.',
  qs:[
   {k:'mc',q:'Pushing the right rudder pedal makes the nose…',a:['Yaw to the right','Yaw to the left','Pitch up','Roll to the left'],why:'The rudder swings the nose toward the pedal you push.'},
   {k:'tap',q:'Tap the RUDDER PEDALS.',fig:'cockpit',z:'pedals',zl:'The two pedals on the floor',why:'The rudder pedals are on the floor, where the pilot’s feet rest.'},
   {k:'tf',q:'On the ground, the rudder pedals help steer the airplane.',t:true,why:'The pedals steer the nose wheel while taxiing.'},
   {k:'mc',q:'How do many small airplanes brake on the ground?',a:['By pressing the tops of the rudder pedals','By pulling the yoke back','By lowering the flaps','By spinning the propeller backward'],why:'Toe brakes on top of the pedals slow each main wheel.'},
   {k:'fill',q:'The rudder controls ___.',a:['yaw','pitch','roll'],why:'Rudder means yaw: the nose swinging left and right.'},
   {k:'tf',q:'The rudder is the main way an airplane turns in the air, like a car’s steering wheel.',t:false,why:'Airplanes turn by banking with the ailerons. The rudder helps keep the turn smooth and coordinated.'}]},
 {id:'ctl-throttle',t:'The throttle',
  cards:[
   {t:'Power control',b:'The THROTTLE controls engine power. Push it in for more power and pull it out for less. In many trainers it is a black knob.',fig:{f:'cockpit',hl:'throttle',labels:true}},
   {t:'The red knob',b:'Next to the throttle is a red knob: the MIXTURE. It sets how much fuel mixes with the air going into the engine. Pulling it all the way out shuts the engine down.'},
   {t:'Pitch + power',b:'Pitch and power work together. More power with the nose held level makes the airplane speed up. More power with the nose raised helps it climb.'}],
  tip:'Push in to go, pull out to slow.',
  qs:[
   {k:'mc',q:'What does pushing the throttle in do?',a:['Adds engine power','Lowers the flaps','Turns on the radio','Raises the nose'],why:'Throttle in means more power. Throttle out means less.'},
   {k:'tap',q:'Tap the THROTTLE.',fig:'cockpit',z:'throttle',zl:'The black knob',why:'In many trainers the throttle is the black knob.'},
   {k:'mc',q:'In many trainers, what color is the mixture knob?',a:['Red','Black','Blue','Green'],why:'The mixture knob is red, so pilots never mix it up with the throttle.'},
   {k:'tf',q:'Pulling the throttle out reduces power.',t:true,why:'Out is less power, in is more power.'},
   {k:'fill',q:'The ___ knob shuts the engine down when it is pulled all the way out.',a:['mixture','throttle','trim'],why:'Pulling the mixture all the way out starves the engine of fuel and stops it.'},
   {k:'match',q:'Match each control to its job.',p:[['Throttle','Engine power'],['Mixture','Fuel-air mix'],['Yoke','Roll + pitch'],['Rudder pedals','Yaw']],why:'Hands on the yoke and throttle, feet on the pedals.'}]}
]);

/* ============================ 4. COCKPIT INSTRUMENTS ============================ */
H.addLessons('instruments',[
 {id:'inst-asi',t:'Airspeed indicator',
  cards:[
   {t:'The six-pack',b:'Most trainers have six main flight instruments, nicknamed the SIX-PACK. The top row shows AIRSPEED, ATTITUDE and ALTITUDE.',fig:{f:'sixpack',labels:true}},
   {t:'How fast?',b:'The AIRSPEED INDICATOR shows how fast the airplane moves through the air, usually in KNOTS. Air rams into a small forward-facing tube, usually under a wing, called the PITOT TUBE (PEE-toe).',fig:{f:'gauge',g:'asi',v:100}},
   {t:'Colored arcs',b:'GREEN is the normal range. WHITE is where flaps can be used. YELLOW means caution: smooth air only. The RED LINE is the never-exceed speed.'}],
  tip:'Pitot tube: air pushes in, speed shows up.',
  qs:[
   {k:'mc',q:'What airspeed does this show?',fig:{f:'gauge',g:'asi',v:100},a:['100 knots','60 knots','140 knots','10 knots'],why:'The needle points at 100, so the airplane is flying 100 knots.'},
   {k:'mc',q:'What does the red line on the airspeed indicator mean?',a:['Never fly faster than this','Normal cruising speed','Use the flaps here','Low on fuel'],why:'The red line is the never-exceed speed. Going faster could damage the airplane.'},
   {k:'tap',q:'Tap the AIRSPEED INDICATOR.',fig:'sixpack',z:'asi',zl:'Top row, left',why:'Airspeed is the top-left instrument in the six-pack.'},
   {k:'mc',q:'Which tube measures the air rushing at the airplane?',a:['The pitot tube','The fuel tube','The exhaust pipe','The vent tube'],why:'The pitot tube faces forward and feels the ramming air.'},
   {k:'match',q:'Match each marking to what it means.',p:[['Green arc','Normal range'],['White arc','Flap range'],['Yellow arc','Caution: smooth air'],['Red line','Never exceed']],why:'Green normal, white flaps, yellow caution, red never.'},
   {k:'tf',q:'Airplane airspeed is often measured in knots.',t:true,why:'A knot is one nautical mile per hour, a little faster than one mile per hour.'}]},
 {id:'inst-ai',t:'Attitude indicator',
  cards:[
   {t:'The artificial horizon',b:'The ATTITUDE INDICATOR shows the airplane’s nose and wings compared with the horizon. Blue is sky, brown is ground, and the little orange airplane symbol is you.',fig:{f:'gauge',g:'ai'}},
   {t:'Inside a cloud',b:'A spinning GYROSCOPE inside keeps it steady. When pilots cannot see outside, like inside a cloud, this instrument still shows which way is up.',fig:{f:'gauge',g:'ai',bank:20}}],
  tip:'Blue on top, brown below: you’re right side up.',
  qs:[
   {k:'mc',q:'What is this airplane doing?',fig:{f:'gauge',g:'ai',bank:20},a:['Banking to the right','Banking to the left','Flying upside down','Diving straight down'],why:'The right wing of the little airplane dips below the horizon line, so it is banking right.'},
   {k:'mc',q:'What is this airplane doing?',fig:{f:'gauge',g:'ai',pitch:10},a:['Nose up, like in a climb','Nose down, like in a dive','Banking left','Flying upside down'],why:'The little airplane sits above the horizon line, in the blue. The nose is pitched up.'},
   {k:'tap',q:'Tap the ATTITUDE INDICATOR.',fig:'sixpack',z:'ai',zl:'Top row, middle',why:'The attitude indicator sits top-center, right in front of the pilot.'},
   {k:'tf',q:'On the attitude indicator, brown means sky and blue means ground.',t:false,why:'Sky up, ground down: blue and brown.'},
   {k:'mc',q:'What spins inside the attitude indicator to keep it steady?',a:['A gyroscope','A propeller','A fan belt','A compass needle'],why:'A gyroscope resists tipping, so it stays level while the airplane moves around it.'},
   {k:'tf',q:'The attitude indicator is extra important when pilots can’t see the real horizon.',t:true,why:'In clouds or darkness, it becomes the pilot’s horizon.'}]},
 {id:'inst-alt',t:'Altimeter',
  cards:[
   {t:'How high?',b:'The ALTIMETER shows altitude in feet above sea level. It works like a barometer: air pressure drops as you climb, and the altimeter turns that pressure into feet.',fig:{f:'gauge',g:'alt',v:2500}},
   {t:'Reading the hands',b:'The LONG hand counts HUNDREDS of feet. The SHORT hand counts THOUSANDS. A thin pointer counts TEN-THOUSANDS. This one reads 2,500 feet.'},
   {t:'Set it right',b:'Weather changes air pressure, so pilots dial in the local ALTIMETER SETTING before they fly. Then the altimeter shows the airport’s correct elevation while still on the ground.'}],
  tip:'Long hand: hundreds. Short hand: thousands.',
  qs:[
   {k:'mc',q:'What altitude does this altimeter show?',fig:{f:'gauge',g:'alt',v:2500},a:['2,500 feet','5,200 feet','250 feet','25,000 feet'],why:'Short hand between 2 and 3 (2,000s), long hand on 5 (500): 2,500 feet.'},
   {k:'mc',q:'And this one?',fig:{f:'gauge',g:'alt',v:1200},a:['1,200 feet','2,100 feet','12,000 feet','200 feet'],why:'Short hand just past 1 (1,000s), long hand on 2 (200): 1,200 feet.'},
   {k:'tap',q:'Tap the ALTIMETER.',fig:'sixpack',z:'alt',zl:'Top row, right',why:'The altimeter is the top-right instrument in the six-pack.'},
   {k:'tf',q:'Air pressure gets lower as you climb higher.',t:true,why:'There is less air above you the higher you go, so the pressure drops.'},
   {k:'mc',q:'Why do pilots set the altimeter before flying?',a:['Weather changes the air pressure','To make it glow at night','To measure their speed','To pick a radio channel'],why:'Pressure changes with the weather, so the setting has to match today’s air.'},
   {k:'fill',q:'The altimeter’s long hand counts ___ of feet.',a:['hundreds','thousands','tens'],why:'Long hand hundreds, short hand thousands.'}]},
 {id:'inst-tc',t:'Turn coordinator',
  cards:[
   {t:'Turn and ball',b:'The TURN COORDINATOR shows how fast the airplane is turning. When the little airplane’s wing lines up with the L or R mark, that is a STANDARD-RATE TURN: a full circle in 2 minutes.',fig:{f:'gauge',g:'tc',turn:1}},
   {t:'Step on the ball',b:'The ball in the curved glass tube shows coordination. If it slides to one side, the pilot presses the rudder pedal on that same side to center it. Pilots say: STEP ON THE BALL.',fig:{f:'gauge',g:'tc',turn:0,ball:-1}}],
  tip:'Step on the ball.',
  qs:[
   {k:'mc',q:'This airplane is…',fig:{f:'gauge',g:'tc',turn:1},a:['Turning right at standard rate','Turning left','Climbing','Flying upside down'],why:'The little airplane’s right wing is on the R mark: a standard-rate right turn.'},
   {k:'mc',q:'A standard-rate turn makes a full 360° circle in…',a:['2 minutes','10 seconds','1 hour','30 minutes'],why:'Standard rate is 3 degrees per second. 360 degrees takes 120 seconds: 2 minutes.'},
   {k:'mc',q:'The ball has slid to the LEFT. Which rudder pedal centers it?',fig:{f:'gauge',g:'tc',turn:0,ball:-1},a:['The left pedal','The right pedal','Neither: pull the yoke'],why:'Step on the ball: press the pedal on the same side the ball has slid to.'},
   {k:'tap',q:'Tap the TURN COORDINATOR.',fig:'sixpack',z:'tc',zl:'Bottom row, left',why:'The turn coordinator is bottom-left in the six-pack.'},
   {k:'tf',q:'A centered ball means the turn is coordinated.',t:true,why:'Ball in the middle means the rudder and bank are working together.'},
   {k:'fill',q:'To fix an uncoordinated turn, step on the ___.',a:['ball','brakes','throttle'],why:'Pilots step on the rudder pedal on the side the ball has slid to.'}]},
 {id:'inst-hi',t:'Heading indicator',
  cards:[
   {t:'Which way?',b:'The HEADING INDICATOR is a steady compass card driven by a gyroscope. The number at the top is your HEADING. Numbers mean tens of degrees: 3 is 030°, 12 is 120°.',fig:{f:'gauge',g:'hi',v:90}},
   {t:'Keep it matched',b:'Its gyro slowly drifts, so pilots check it against the magnetic compass, about every 15 minutes in level flight, and reset it.'}],
  tip:'N = 360, E = 090, S = 180, W = 270.',
  qs:[
   {k:'mc',q:'Which way is this airplane heading?',fig:{f:'gauge',g:'hi',v:90},a:['East','North','South','West'],why:'E is under the top mark, so the heading is 090°: east.'},
   {k:'mc',q:'And now?',fig:{f:'gauge',g:'hi',v:270},a:['West','East','North','South'],why:'W is at the top: a heading of 270°, west.'},
   {k:'tap',q:'Tap the HEADING INDICATOR.',fig:'sixpack',z:'hi',zl:'Bottom row, middle',why:'The heading indicator is bottom-center in the six-pack.'},
   {k:'tf',q:'The heading indicator must be checked against the magnetic compass now and then.',t:true,why:'Its gyro drifts, so pilots reset it to match the compass.'},
   {k:'mc',q:'On the heading indicator, the number 18 means…',a:['180°: south','18 knots','1,800 feet','18 minutes'],why:'Add a zero: 18 means 180 degrees, which is south.'},
   {k:'fill',q:'A heading of 360° (or 0°) points ___.',a:['north','east','south'],why:'360 and 0 are the same direction: north.'}]},
 {id:'inst-vsi',t:'Vertical speed indicator',
  cards:[
   {t:'Up or down?',b:'The VERTICAL SPEED INDICATOR (VSI) shows how fast you are climbing or descending, in FEET PER MINUTE. Needle above zero means climbing. Below zero means descending.',fig:{f:'gauge',g:'vsi',v:500}},
   {t:'Three and three',b:'Three instruments run on air pressure: airspeed, altimeter and VSI. Three use spinning gyros: attitude, heading and turn coordinator.',fig:{f:'sixpack',labels:true}}],
  tip:'Three from pressure, three from spin.',
  qs:[
   {k:'mc',q:'What is this airplane doing?',fig:{f:'gauge',g:'vsi',v:500},a:['Climbing 500 feet per minute','Descending 500 feet per minute','Flying 500 knots','Holding level at 500 feet'],why:'The needle is above zero on the 5 (×100): climbing 500 feet per minute.'},
   {k:'mc',q:'And this one?',fig:{f:'gauge',g:'vsi',v:-1000},a:['Descending 1,000 feet per minute','Climbing 1,000 feet per minute','Holding level','Flying 1,000 knots'],why:'The needle is below zero on the 10 (×100): descending 1,000 feet per minute.'},
   {k:'tap',q:'Tap the VERTICAL SPEED INDICATOR.',fig:'sixpack',z:'vsi',zl:'Bottom row, right',why:'The VSI is the bottom-right instrument.'},
   {k:'match',q:'Match each instrument to the question it answers.',p:[['Airspeed','How fast?'],['Altimeter','How high?'],['VSI','Climbing or descending?'],['Heading','Which way?']],why:'Each instrument answers one simple question.'},
   {k:'mc',q:'Which instrument uses a gyroscope?',a:['Attitude indicator','Altimeter','Airspeed indicator','Vertical speed indicator'],why:'Attitude, heading and turn coordinator use gyros. The other three use air pressure.'},
   {k:'tf',q:'A VSI needle pointing at zero means the airplane is holding its altitude.',t:true,why:'Zero vertical speed: not climbing, not descending.'}]}
]);
})();
