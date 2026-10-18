/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* BEYOND - HELICOPTERS (r7.4). How a helicopter flies and how to be safe around one, for curious cadets. Not flight training.
   Sources: FAA Helicopter Flying Handbook (FAA-H-8083-21B, 2019): the parts and the transmission, blade pitch and the rotor
   disk, torque and anti-torque systems (tail rotor, NOTAR, Fenestron, tandem and coaxial rotors), the cyclic, collective,
   pedals and swashplate, ground effect (within about one rotor diameter), effective translational lift (about 16 to 24 knots),
   dissymmetry of lift, blade flapping and retreating blade stall, autorotation and the freewheeling unit, the height-velocity
   diagram, dynamic rollover (a smooth collective reduction), settling with power / vortex ring state.
   FAA Advisory Circular 91-32B, Safety In and Around Helicopters (approach from the front or side in the pilot's view, after
   the pilot's signal; crouch under the rotor; keep away from the tail rotor; hold loose items; carry long objects flat at or
   below the waist; the downslope side). 14 CFR 61.83 (16 to solo a helicopter), 61.103 (17 for the private certificate),
   61.109(c) (40 hours: 20 with an instructor, 10 solo), 61.129(c) (150 hours for commercial); these are the Part 61 minimums
   (a Part 141 school's course can need fewer hours), which the lesson says. Pitch is the angle the blade is set at (the
   angle of attack, which the air meets the blade at, is not named here).
   History, checked October 2026 against the encyclopedia entries and their cited sources: Leonardo da Vinci's aerial screw
   (late 1400s); Juan de la Cierva's autogiro (Getafe, Spain, 1923, flown by Alejandro Gomez Spencer; Cierva designed it) and the flapping hinge; the Focke-Wulf Fw 61 (first free
   flight June 26, 1936, side-by-side rotors); the Sikorsky VS-300 (first flight September 14, 1939, flown by Igor Sikorsky;
   the first successful helicopter with a single tail rotor for anti-torque); the Sikorsky R-4 (the first helicopter in
   large-scale production; the first helicopter combat rescue, April 1944, in Burma); the Bell 47 (the first helicopter
   certified for civilian use, March 1946). Most American helicopter rotors turn counterclockwise seen from above. */
(function(){
const H=G.HFQ;
H.addLessons('heli',[
 {id:'he-parts',t:'Meet the helicopter',
  cards:[
   {t:'Spinning wings',b:'A helicopter’s MAIN ROTOR is a set of long, thin wings that spin around a pole called the MAST. Each blade is shaped like an airplane wing, so spinning blades make lift. That lets a helicopter rise straight up and HOVER.',fig:{f:'heli',labels:['rotor','mast']}},
   {t:'Nose to tail',b:'The CABIN holds the pilot and passengers. Behind it, the ENGINE and a gearbox called the TRANSMISSION turn the rotor. The TAIL BOOM reaches back to a small TAIL ROTOR. Many light helicopters sit on SKIDS instead of wheels.',fig:{f:'heli',labels:['cabin','boom','tailrotor','skids']}},
   {t:'The transmission',b:'A helicopter’s engine spins much faster than its rotor should. The TRANSMISSION is a set of gears that slows the turning down to the right rotor speed. It also sends power down a long shaft to the tail rotor.'}],
  tip:'Rotor on top, tail rotor in back, skids below.',
  qs:[
   {k:'tap',q:'Tap the MAIN ROTOR.',fig:{f:'heli'},z:'rotor',zl:'The long blades on top',why:'The main rotor’s spinning blades make the lift.'},
   {k:'tap',q:'Tap this helicopter’s TAIL ROTOR.',fig:{f:'heli'},z:'tailrotor',zl:'The small rotor at the end of the tail',why:'The tail rotor keeps the helicopter pointed where the pilot wants.'},
   {k:'mc',q:'What are a helicopter’s rotor blades?',a:['Spinning wings','Fans that cool the engine','Brakes for landing','Radio antennas'],why:'Each blade has a wing shape, called an airfoil. Spinning it through the air makes lift.'},
   {k:'fill',q:'The ___ slows the engine’s fast turning down to rotor speed.',a:['transmission','windsock','altimeter'],why:'Its gears turn fast engine spinning into slower, stronger rotor turning.'},
   {k:'tf',q:'Many light helicopters land on skids instead of wheels.',t:true,why:'Skids are simple and light, and they work on grass or dirt.'},
   {k:'tf',q:'The tail boom holds up the main rotor.',t:false,why:'The mast holds the main rotor. The tail boom reaches back to the tail rotor.'},
   {k:'match',q:'Match each part to its job.',p:[['Main rotor','Makes lift'],['Tail rotor','Keeps the nose straight'],['Skids','Landing gear'],['Cabin','Holds the people']],why:'Every part has a job to do.'}]},
 {id:'he-lift',t:'How a rotor lifts',
  cards:[
   {t:'Blade pitch',b:'Each rotor blade is set at a small angle called its PITCH. More pitch makes the blade bite more air and make more lift, up to a point. Speed matters too: blades moving faster through the air make more lift.'},
   {t:'A steady spin',b:'In most helicopters, the rotor turns at an almost steady speed. To climb or descend, the pilot changes the pitch of the blades instead. More pitch: more lift. Less pitch: less lift.'},
   {t:'The rotor disk',b:'Spinning blades sweep out a circle called the ROTOR DISK. Its lift points straight out of the disk. Tilt the disk, and part of the lift pulls the helicopter that way.',fig:{f:'heliDisk'}}],
  tip:'Pitch changes how much lift. Tilt changes which way.',
  qs:[
   {k:'mc',q:'In most helicopters, how does the pilot get more lift?',a:['Adds pitch to the blades','Spins the rotor backward','Folds the blades','Lowers the skids'],why:'The rotor keeps an almost steady speed, so more pitch means more lift.'},
   {k:'tap',q:'Tap the helicopter that is flying FORWARD.',fig:{f:'heliDisk'},z:'fwd',zl:'The one with its rotor disk tilted forward',why:'Tilting the disk forward points part of the lift ahead.'},
   {k:'fill',q:'The angle a rotor blade is set at is its ___.',a:['pitch','heading','color'],why:'Pilots change blade pitch to change lift.'},
   {k:'tf',q:'Tilting the rotor disk forward helps pull the helicopter forward.',t:true,why:'Part of the lift now points ahead.'},
   {k:'tf',q:'A helicopter rotor lifts by heating the air, like a balloon.',t:false,why:'Rotor blades are spinning wings. They lift the way wings do.'},
   {k:'mc',q:'What is the rotor disk?',a:['The circle the spinning blades sweep','A round brake plate on top of the mast','The spinning fan inside the tail fin','A flat wheel the skids roll on'],why:'The disk is the circle you see when the blades spin.'}]},
 {id:'he-ctrl',t:'Cyclic, collective + pedals',
  cards:[
   {t:'The cyclic',b:'The CYCLIC is the stick in front of the pilot. It tilts the rotor disk, and the helicopter moves the way the disk tilts: forward, backward or sideways.',fig:{f:'heliCtl',hl:'cyclic'}},
   {t:'The collective',b:'The COLLECTIVE is a lever at the pilot’s left side. Raising it adds pitch to ALL the main rotor blades at once, so the helicopter climbs. Lowering it takes pitch away. Many have a twist-grip throttle on the end.',fig:{f:'heliCtl',hl:'collective'}},
   {t:'The pedals',b:'The ANTI-TORQUE PEDALS change the pitch of the tail rotor blades. Push the left pedal and the nose turns left. Push the right pedal and it turns right.',fig:{f:'heliCtl',hl:'pedals'}},
   {t:'The swashplate',b:'How does a stick move spinning blades? Through the SWASHPLATE, a pair of plates around the mast: one stays still and one spins with the rotor. The collective slides it up and down. The cyclic tilts it. Rods called pitch links carry each move to the blades.'}],
  tip:'Cyclic: which way. Collective: up or down. Pedals: where the nose points.',
  qs:[
   {k:'tap',q:'Tap the COLLECTIVE.',fig:{f:'heliCtl'},z:'collective',zl:'The lever at the pilot’s left side',why:'The collective raises and lowers the pitch of all the main rotor blades together.'},
   {k:'tap',q:'Tap the CYCLIC.',fig:{f:'heliCtl'},z:'cyclic',zl:'The stick in front of the pilot',why:'The cyclic tilts the rotor disk.'},
   {k:'match',q:'Match each control to what it does.',p:[['Cyclic','Tilts the rotor disk'],['Collective','Climb or descend'],['Pedals','Points the nose']],why:'Helicopter pilots use all three at once.'},
   {k:'mc',q:'Which control changes the pitch of ALL the main blades together?',a:['The collective','The cyclic stick','The anti-torque pedals','The tail rotor gearbox'],why:'Collective means all together.'},
   {k:'tf',q:'Pushing the right pedal turns the nose to the right.',t:true,why:'The pedals change the tail rotor’s push, and the nose follows.'},
   {k:'tf',q:'The cyclic is the lever beside the pilot’s seat that makes the helicopter climb.',t:false,why:'That is the collective. The cyclic is the stick in front of the pilot.'},
   {k:'fill',q:'The ___ carries the pilot’s control moves up to the spinning blades.',a:['swashplate','skid','windshield'],why:'One plate stays still, one spins, and pitch links carry each move to the blades.'}]},
 {id:'he-torque',t:'Torque + the tail rotor',
  cards:[
   {t:'Equal and opposite',b:'When the engine turns the main rotor one way, the helicopter’s body tries to turn the other way. That twist is TORQUE. It comes from Newton’s third law: for every action there is an equal and opposite reaction.',fig:{f:'heliTorque'}},
   {t:'The tail rotor pushes back',b:'The TAIL ROTOR, far out on the tail boom, pushes sideways against the torque. On most American helicopters, the main rotor turns counterclockwise seen from above, so the body tries to turn clockwise.',fig:{f:'heliTorque',hl:'tail'}},
   {t:'More power, more pedal',b:'More power to the main rotor makes more torque. So when the pilot raises the collective to climb, the pilot also adds pedal to keep the nose from swinging. Lower the collective, and less pedal is needed.'}],
  tip:'The rotor spins one way, the body wants to spin the other. The tail rotor says no.',
  qs:[
   {k:'mc',q:'Why does a single-rotor helicopter need a tail rotor?',a:['To stop torque from spinning the body','To push the helicopter forward faster','To lift the heavy tail off the ground','To blow cooling air over the engine'],why:'Without it, the body would turn the opposite way from the rotor.'},
   {k:'tap',q:'Tap the part that fights torque.',fig:{f:'heliTorque'},z:'tail',zl:'The tail rotor, out on the tail',why:'The tail rotor pushes the tail sideways against the twist.'},
   {k:'tf',q:'Torque is explained by Newton’s third law.',t:true,why:'For every action there is an equal and opposite reaction.'},
   {k:'tf',q:'If the main rotor turns counterclockwise, the body tries to turn counterclockwise too.',t:false,why:'The body tries to turn the opposite way: clockwise.'},
   {k:'fill',q:'The twist from turning the main rotor is called ___.',a:['torque','thrust','drag'],why:'Torque is a twisting force.'},
   {k:'mc',q:'The pilot raises the collective to climb. What else changes?',a:['More anti-torque pedal is needed','The cyclic must be pulled all the way back','The tail rotor is switched off','Nothing: the nose stays straight by itself'],why:'More power makes more torque, so the tail rotor must push harder.'}]},
 {id:'he-types',t:'Other ways to beat torque',
  cards:[
   {t:'Two rotors',b:'Two main rotors that turn opposite ways cancel each other’s torque. The CH-47 Chinook has one rotor at each end (TANDEM). Many Kamov helicopters stack two rotors on one mast (COAXIAL).',fig:{f:'heliTypes',list:['tandem','coaxial'],labels:true}},
   {t:'NOTAR',b:'The MD 520N has NO TAil Rotor (NOTAR). A fan inside the boom blows air out along the tail and through a nozzle at the end, and that air does the tail rotor’s job.',fig:{f:'heliTypes',list:['notar','single'],labels:true}},
   {t:'Fenestron',b:'Many Airbus helicopters hide a small tail rotor with many blades inside a round tunnel in the tail fin. It is called a FENESTRON. The fin keeps the spinning blades away from people.',fig:{f:'heliTypes',list:['fenestron','single'],labels:true}}],
  tip:'Two rotors turning opposite ways cancel each other’s twist.',
  qs:[
   {k:'tap',q:'Tap the TANDEM helicopter.',fig:{f:'heliTypes',labels:true},z:'tandem',zl:'The one with a rotor at each end',why:'Tandem means one behind the other.'},
   {k:'tap',q:'Tap the COAXIAL helicopter.',fig:{f:'heliTypes'},z:'coaxial',zl:'The one with two rotors stacked on one mast',why:'Coaxial means sharing one axis: the rotors are stacked.'},
   {k:'mc',q:'Why does the Chinook need no tail rotor?',a:['Its two rotors turn opposite ways','It only flies straight ahead at high speed','Its engines are mounted on the tail','Its long body is too heavy to spin'],why:'Turning opposite ways cancels the torque.'},
   {k:'tf',q:'NOTAR stands for NO TAil Rotor.',t:true,why:'Air blown along the tail boom does the job instead.'},
   {k:'tf',q:'A coaxial helicopter has one rotor at the nose and one at the tail.',t:false,why:'That is a tandem. Coaxial rotors are stacked on one mast.'},
   {k:'match',q:'Match each design to a helicopter.',p:[['Tandem rotors','CH-47 Chinook'],['Coaxial rotors','Kamov Ka-32'],['NOTAR','MD 520N'],['Fenestron','Airbus H135']],why:'You can meet all four in Plane Spotter.'}]},
 {id:'he-hover',t:'Hovering + ground effect',
  cards:[
   {t:'Holding still',b:'In a HOVER, a helicopter holds one spot over the ground. The pilot makes small, steady moves with all three controls at once. It takes lots of practice: some pilots call hovering the hardest part of helicopter flying.'},
   {t:'Ground effect',b:'Close to the ground, within about one rotor diameter, the ground gets in the way of the air the rotor pushes down. The rotor works better, so hovering takes less power. This is hovering IN GROUND EFFECT (IGE).',fig:{f:'heliGround',hl:'ige'}},
   {t:'Out of ground effect',b:'Higher up, the cushion is gone, and over tall grass or water it is weaker. Hovering OUT OF GROUND EFFECT (OGE) takes more power. On a hot day at a high airport, a heavy helicopter might not have enough.',fig:{f:'heliGround',hl:'oge'}}],
  tip:'Near the ground, the air cushions you. Up high, you pay for every bit of lift.',
  qs:[
   {k:'mc',q:'About how high does ground effect reach?',a:['About one rotor diameter','About one mile','Only touching the ground','Up to the clouds'],why:'It works within about one rotor diameter of the surface.'},
   {k:'tap',q:'Tap the helicopter hovering OUT of ground effect.',fig:{f:'heliGround'},z:'oge',zl:'The one high above the ground',why:'High above the ground, there is no air cushion.'},
   {k:'tf',q:'Hovering in ground effect takes less power than hovering out of ground effect.',t:true,why:'The ground cushions the air the rotor pushes down.'},
   {k:'tf',q:'Ground effect is strongest over tall grass and water.',t:false,why:'It is strongest over firm, smooth ground. Grass and water weaken it.'},
   {k:'fill',q:'Holding one spot in the air is called a ___.',a:['hover','stall','glide'],why:'Hovering is a helicopter’s special skill.'},
   {k:'mc',q:'Why is hovering hard on a hot day at a high airport?',a:['Thin air gives less lift for the power','Hot skids stick to the ground','The rotor blades grow longer in the heat','Radios stop working when it is hot'],why:'Hot, high air is thin, so the rotor and the engine both do less.'}]},
 {id:'he-etl',t:'Translational lift',
  cards:[
   {t:'Clean air',b:'In a hover, the rotor keeps meeting the swirling air it just pushed down. As the helicopter speeds up, the rotor moves into clean, undisturbed air and works much better. That extra lift is TRANSLATIONAL LIFT.',fig:{f:'heliETL'}},
   {t:'16 to 24 knots',b:'At about 16 to 24 knots, the rotor outruns its old swirls. Pilots call this EFFECTIVE TRANSLATIONAL LIFT (ETL). The helicopter suddenly gets more lift for the same power and tends to climb.',fig:{f:'heliETL',hl:'fwd'}},
   {t:'Why takeoffs go forward',b:'That is why helicopters usually take off by moving forward and speeding up, not by climbing straight up. Flying forward through ETL takes less power than climbing in a high hover.'}],
  tip:'Speed buys clean air, and clean air buys lift.',
  qs:[
   {k:'mc',q:'At about what speed does ETL happen?',a:['16 to 24 knots','1 to 2 knots','150 to 200 knots','Only at zero knots'],why:'About 16 to 24 knots, says the FAA’s Helicopter Flying Handbook.'},
   {k:'tap',q:'Tap the rotor that is flying in CLEAN air.',fig:{f:'heliETL'},z:'fwd',zl:'The helicopter moving forward',why:'Moving forward, the rotor meets undisturbed air.'},
   {k:'tf',q:'Translational lift comes from the rotor moving into clean, undisturbed air.',t:true,why:'It leaves its own swirling downwash behind.'},
   {k:'tf',q:'Climbing straight up in a high hover takes less power than speeding up forward.',t:false,why:'Flying forward through ETL is easier on power.'},
   {k:'fill',q:'ETL stands for Effective ___ Lift.',a:['Translational','Tail','Total'],why:'Translational means moving from place to place.'},
   {k:'mc',q:'Why do helicopters usually take off moving forward?',a:['Speed adds lift for the same power','Rules say every takeoff must be forward','The skids need a runway to roll on','The rotor can only spin when moving'],why:'Translational lift makes the climb easier.'}]},
 {id:'he-sides',t:'Two sides of the rotor',
  cards:[
   {t:'One side is faster',b:'In forward flight, the blade sweeping toward the nose (ADVANCING) meets the air faster than the blade sweeping back (RETREATING). Tips turning at 400 knots on a helicopter flying 100 knots meet 500 knots on one side, but only 300 on the other.',fig:{f:'heliDissym'}},
   {t:'Blades that flap',b:'More speed would mean more lift on the advancing side, and the helicopter would roll. Pilots call that DISSYMMETRY OF LIFT. So the blades FLAP: the advancing blade rises and takes a smaller bite of air, and the retreating blade drops and takes a bigger bite. The lift evens out.'},
   {t:'A speed limit',b:'Fly too fast and the retreating blade must bite so steeply that it stalls. This RETREATING BLADE STALL is a main reason helicopters have a top speed, called VNE: the never-exceed speed.',fig:{f:'heliDissym',hl:'retreat'}}],
  tip:'Advancing side: more speed. Retreating side: more angle. Flapping evens it out.',
  qs:[
   {k:'mc',q:'Which blade meets the air faster in forward flight?',a:['The advancing blade','The retreating blade','They are always the same','The tail rotor blade'],why:'It adds the helicopter’s speed to its own.'},
   {k:'tap',q:'Tap the RETREATING side of the rotor disk.',fig:{f:'heliDissym'},z:'retreat',zl:'The side where the blades sweep backward',why:'There, the helicopter’s speed is taken away from the blade’s speed.'},
   {k:'tf',q:'Dissymmetry of lift means one side of the rotor disk would make more lift than the other.',t:true,why:'The faster advancing side would make more.'},
   {k:'mc',q:'What evens out the lift on both sides?',a:['Blade flapping','Bigger skids','Turning off the tail rotor','Flying backward'],why:'Flapping changes each blade’s angle as it goes around.'},
   {k:'tf',q:'Retreating blade stall happens in a hover with no wind.',t:false,why:'It happens at high forward speed.'},
   {k:'fill',q:'A helicopter’s never-exceed speed is called ___.',a:['VNE','ETL','IGE'],why:'V stands for velocity, and NE for never exceed.'}]},
 {id:'he-auto',t:'Autorotation',
  cards:[
   {t:'If the engine stops',b:'A FREEWHEELING UNIT lets the rotor keep spinning even if the engine quits. The pilot lowers the collective right away. Flatter blades keep the rotor spinning fast, and a fast rotor is what the pilot needs for the landing.'},
   {t:'Air spins the rotor',b:'Gliding down, air flows UP through the rotor and keeps it turning, like a maple seed spinning to the ground. This is AUTOROTATION. The pilot can glide forward and steer to a landing spot.',fig:{f:'heliAuto',hl:'flow'}},
   {t:'The flare',b:'Near the ground, the pilot eases the cyclic back to FLARE, slowing the fall and the forward speed. Then the pilot raises the collective, using the rotor’s spin to cushion the touchdown.',fig:{f:'heliAuto'}},
   {t:'Practice and planning',b:'Helicopter pilots practice autorotations in training. Helicopter flight manuals include a HEIGHT-VELOCITY DIAGRAM that shows mixes of height and airspeed to avoid, because from there a safe autorotation may not be possible.'}],
  tip:'Engine out: collective down, glide, flare, cushion.',
  qs:[
   {k:'order',q:'Put an autorotation in order.',s:['Lower the collective','Glide to a landing spot','Flare with the cyclic','Raise the collective to cushion'],why:'Down, glide, flare, cushion.'},
   {k:'tap',q:'Tap the air flowing UP through the rotor.',fig:{f:'heliAuto'},z:'flow',zl:'The upward arrows through the rotor',why:'In autorotation, air flowing up keeps the rotor turning.'},
   {k:'mc',q:'What lets the rotor keep spinning when the engine stops?',a:['The freewheeling unit','A backup battery motor','The tail rotor gearbox','The anti-torque pedals'],why:'It lets the rotor turn freely while the engine is stopped.'},
   {k:'tf',q:'In an autorotation, air flowing up through the rotor keeps it spinning.',t:true,why:'Like a maple seed spinning down.'},
   {k:'tf',q:'If the engine quits, a helicopter falls like a rock because it cannot glide.',t:false,why:'It can glide down in an autorotation and land.'},
   {k:'fill',q:'The height-velocity diagram shows mixes of height and ___ to avoid.',a:['airspeed','fuel','heading'],why:'From some heights and speeds, a safe autorotation may not be possible.'}]},
 {id:'he-safe',t:'Safe around helicopters',
  cards:[
   {t:'Walk up the right way',b:'Go to a running helicopter only when the pilot signals you. Approach from the front or side, where the pilot can see you, never from behind. Crouch low under the main rotor, and stay far from the tail rotor.',fig:{f:'heliSafe'}},
   {t:'Hold on to your stuff',b:'Rotor wash is a strong wind. Hold on to hats and loose things, and never chase anything that blows away. Carry long things flat, at or below your waist, never on your shoulder. On a slope, walk up from the downhill side.'},
   {t:'Dynamic rollover',b:'If a skid catches on the ground as a helicopter lifts off, it can pivot around that skid and roll onto its side. This is DYNAMIC ROLLOVER. Smoothly lowering the collective is the best way to stop it.',fig:{f:'heliRoll'}},
   {t:'Settling with power',b:'Descending steeply at a slow airspeed with power on, a helicopter can sink into its own downwash. This is SETTLING WITH POWER, also called vortex ring state. Pilots watch their rate of descent to avoid it, and fly out of the sinking air to escape it.'}],
  tip:'Front or side, in the pilot’s view. Crouch low. Never near the tail rotor.',
  qs:[
   {k:'tap',q:'Tap the DANGER zone around a running helicopter.',fig:{f:'heliSafe'},z:'tail',zl:'The area around the tail rotor',why:'A spinning tail rotor is hard to see. Never go near it.'},
   {k:'mc',q:'How should you walk up to a running helicopter?',a:['From the front, after the pilot signals','From behind, so you stay out of the way','From any side, running to be quick','Under the tail boom, where it is shady'],why:'Stay where the pilot can see you.'},
   {k:'tf',q:'Carry a long pole upright over your shoulder near a helicopter.',t:false,why:'Carry long things flat, at or below your waist, so they stay clear of the rotor.'},
   {k:'tap',q:'Tap the PIVOT POINT that starts this rollover.',fig:{f:'heliRoll'},z:'pivot',zl:'The skid stuck on the ground',why:'The helicopter rolls around the stuck skid.'},
   {k:'fill',q:'On a slope, walk up to a helicopter from the ___ side.',a:['downhill','uphill','tail'],why:'On the uphill side, the rotor is closer to the ground.'},
   {k:'mc',q:'What is the best way to stop dynamic rollover?',a:['Smoothly lower the collective','Raise the collective quickly','Push full right pedal','Pull the cyclic all the way back'],why:'Less lift lets the helicopter settle back down level.'},
   {k:'tf',q:'Settling with power can happen when descending fast at a slow airspeed.',t:true,why:'The rotor sinks into its own downwash. Flying forward gets it into clean air.'}]},
 {id:'he-history',t:'Helicopter history',
  cards:[
   {t:'Early dreams',b:'In the late 1400s, Leonardo da Vinci sketched an “aerial screw.” In 1923, Juan de la Cierva’s autogiro flew in Spain. His rotor ideas, like hinges that let the blades flap, helped make helicopters possible.'},
   {t:'The first real ones',b:'Germany’s Focke-Wulf Fw 61 flew in 1936 with two rotors side by side. In 1939, Igor Sikorsky first flew his VS-300 in the United States. It was the first successful helicopter with one main rotor and a tail rotor, the layout most helicopters use today.'},
   {t:'Into service',b:'Sikorsky’s R-4 became the first helicopter built in large numbers. In April 1944, an R-4 flew the first helicopter combat rescue, in Burma. In 1946, the Bell 47 became the first helicopter certified for civilian use.'}],
  tip:'From da Vinci’s sketch to Sikorsky’s VS-300: about 450 years.',
  qs:[
   {k:'order',q:'Put these in order, oldest first.',s:['Da Vinci sketches an aerial screw','Cierva’s autogiro flies','Sikorsky’s VS-300 flies','The Bell 47 is certified'],why:'The late 1400s, 1923, 1939, 1946.'},
   {k:'mc',q:'Who first flew the VS-300 in 1939?',a:['Igor Sikorsky','Orville Wright','Amelia Earhart','Chuck Yeager'],why:'Sikorsky designed it and flew it himself.'},
   {k:'tf',q:'The Sikorsky R-4 was the first helicopter built in large numbers.',t:true,why:'It went into large-scale production during World War II.'},
   {k:'tf',q:'The first helicopter combat rescue happened in 1990.',t:false,why:'It happened in April 1944, in Burma, in a Sikorsky R-4.'},
   {k:'mc',q:'Which layout did the VS-300 prove?',a:['One main rotor plus a tail rotor','Two rotors side by side on outriggers','Two rotors stacked on a single mast','Rotors on the tips of a fixed wing'],why:'Most helicopters still use it.'},
   {k:'fill',q:'In 1946, the Bell ___ became the first helicopter certified for civilian use.',a:['47','747','206'],why:'Thousands of Bell 47s were built.'}]},
 {id:'he-jobs',t:'Helicopter careers',
  cards:[
   {t:'Jobs for a hover',b:'Helicopters fly patients to hospitals, lift people from cliffs and the sea, drop water on wildfires, carry crews to oil platforms offshore, lift heavy loads on a hook, and film news and movies from the sky.'},
   {t:'Learning to fly one',b:'In the U.S., under the usual FAA training rules (Part 61), a private pilot certificate for helicopters takes at least 40 hours of flight time, including 20 hours with an instructor and 10 hours solo. You can fly solo at 16 and earn the private certificate at 17.'},
   {t:'Going pro',b:'Under the same rules, a commercial helicopter certificate takes at least 150 hours of flight time. Many new helicopter pilots then teach as flight instructors to build experience before jobs like air ambulance or firefighting.'}],
  tip:'Under Part 61: 40 hours to a private helicopter certificate, 150 to go commercial.',
  qs:[
   {k:'mc',q:'How old must you be to fly a helicopter solo in the U.S.?',a:['16','10','21','30'],why:'Student pilots must be 16 to solo a helicopter.'},
   {k:'mc',q:'Under the usual FAA rules, what is the minimum flight time for a private helicopter certificate?',a:['40 hours','4 hours','400 hours','4,000 hours'],why:'At least 40 hours under Part 61, with 20 hours of instruction and 10 hours solo.'},
   {k:'match',q:'Match each job to what the helicopter does.',p:[['Air ambulance','Flies patients to care'],['Firefighting','Drops water on fires'],['Offshore','Carries crews to platforms'],['Sky crane','Lifts loads on a hook']],why:'Hovering makes all of these possible.'},
   {k:'tf',q:'Helicopters can lift people out of the sea.',t:true,why:'Rescue crews use a hoist while the helicopter hovers.'},
   {k:'tf',q:'A commercial helicopter certificate needs only 10 hours of flying.',t:false,why:'It needs at least 150 hours of flight time under Part 61.'},
   {k:'fill',q:'Under Part 61, a commercial helicopter certificate needs at least ___ hours.',a:['150','15','1,500'],why:'At least 150 hours of flight time, and many pilots fly far more before their first job.'}]}
]);
})();
