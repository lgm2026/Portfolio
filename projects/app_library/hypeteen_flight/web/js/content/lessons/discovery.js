/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* UNIT 14 - YOUR DISCOVERY FLIGHT (stage: DISCOVERY). What an introductory flight is, and what happens from the phone call to the logbook.
   Short forms: see H.dsl in hfq_lessons.js. a[0] is always the right answer. Facts follow the FAA Airplane Flying Handbook and the Pilot's Handbook of Aeronautical Knowledge, written for ages 10-14. */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,mt,od,L}=H.dsl;
H.addLessons('discovery',[
L('disc-what','What a discovery flight is',[
 cd('A taste of flying','A discovery flight, also called an introductory flight, is a short trip in a small airplane with a flight instructor. It usually lasts less than an hour in the air, and you get to hold the controls yourself.'),
 cd('No experience needed','You do not need to know anything first. The instructor flies the takeoff and the landing, explains each step, and keeps the airplane safe the whole time.')],
 'A discovery flight is a free sample of flying, not a test.',[
 mc('Who is in charge of the airplane on a discovery flight?',['The flight instructor','The passenger','Whoever sits on the left','The control tower'],'The certificated flight instructor is the pilot in command. You are there to learn and to try the controls.'),
 mc('About how long is a typical discovery flight in the air?',['Under an hour','Six hours','Three days','Ten minutes'],'Most discovery flights are 30 to 60 minutes in the air, with a briefing before and a talk after.'),
 tf('You must already know how to fly to take a discovery flight.',false,'No experience is needed. The whole idea is to try flying with an expert beside you.'),
 tf('The instructor usually handles the takeoff and landing on a discovery flight.',true,'The instructor does the hardest parts and hands you the controls once the airplane is safely in the air.'),
 fl('Another name for a discovery flight is an ___ flight.',['introductory','instrument','international','instructor'],'Schools call it an introductory flight, or an intro flight, because it introduces you to flying.'),
 mt('Match each person to their job.',[['Flight instructor','Teaches and is in charge'],['Student','Learns, tries the controls'],['Tower controller','Directs airport traffic']],'On a discovery flight the instructor is the pilot in command, you are the student, and the tower sequences airplanes at busy airports.')]),
L('disc-book','Booking your flight',[
 cd('Choose a flight school','Look for a flight school at a nearby airport. Ask how long the flight lasts, which airplane you will fly, and whether a parent or guardian can come along and watch.'),
 cd('Dress and bring','Wear comfortable clothes and closed-toe shoes. Bring sunglasses, a photo ID if the school asks for one, and a snack and water. Weather can cancel a flight, so be ready to pick another day.')],
 'Call ahead. A good school is happy to answer every question.',[
 mc('What kind of shoes are best for flying?',['Closed-toe shoes','Flip-flops','Heavy hiking boots','Bare feet'],'Your feet work the rudder pedals and brakes, so closed-toe shoes that grip are the safe choice.'),
 mc('Which question is smart to ask when you book?',['Which airplane will we fly?','What is the instructor’s favorite color?','Can I fly at midnight?','Can I skip the briefing?'],'Knowing the airplane, the length of the flight and who can come along helps you plan.'),
 tf('Bad weather can mean a discovery flight is moved to another day.',true,'Safety first. A good instructor will not fly if the weather is not right, and that is normal.'),
 tf('Flight schools never allow a parent or guardian to watch.',false,'Most schools welcome family. Ask when you book.'),
 fl('Sunglasses help because the ___ can be very bright up high.',['sun','radio','engine','map'],'Above the clouds the sunlight is strong, so sunglasses help you see and keep your eyes comfortable.'),
 od('Put the steps in order.',['Pick a flight school','Call and ask questions','Choose a day and time','Fly your discovery flight'],'You look, you ask, you schedule, and then you fly.')]),
L('disc-meet','Meet your instructor',[
 cd('A CFI','Your teacher is a CFI, a certificated flight instructor. A CFI has passed written and flying tests and holds an FAA certificate that lets them teach others to fly.'),
 cd('Ask anything','Instructors love questions. Ask how they learned, what they like best, and what you will do today. A good teacher explains things in plain words and never rushes you.')],
 'CFI means certificated flight instructor.',[
 mc('What does CFI stand for?',['Certificated Flight Instructor','Certified Fuel Inspector','Cadet Flight Inspector','Control Flight Instrument'],'A CFI is a pilot the FAA has certificated to teach flying.'),
 mc('What does a CFI hold that lets them teach?',['An FAA instructor certificate','A library card','A radio','A weather report'],'The FAA certificates instructors after written and flying tests.'),
 tf('It is fine to ask your instructor questions at any time.',true,'Good instructors want questions. Asking is part of learning.'),
 tf('An instructor should rush you so the flight ends quickly.',false,'A good instructor goes at your pace and explains each step.'),
 fl('The FAA stands for the Federal ___ Administration.',['Aviation','Airplane','Airport','Altitude'],'FAA means Federal Aviation Administration, the government agency that oversees flying in the United States.'),
 mc('Who decides if it is safe to fly that day?',['The pilot in command, the instructor','Whoever is excited','The passenger','The airplane'],'The pilot in command makes the final go or no-go decision.')]),
L('disc-brief','The pre-flight briefing',[
 cd('Talk before you fly','Before you leave the ground, the instructor explains the plan: where you will fly, what you will practice, and what to do if you feel unwell or uneasy. Nothing is a surprise once you are in the air.'),
 cd('Who has the controls?','Pilots use a clear three-step exchange. One says, “You have the flight controls.” The other answers, “I have the flight controls.” The first says it once more to confirm. Then everyone knows who is flying.')],
 'You have it. I have it. You have it. Say it every time.',[
 mc('Why do pilots say who has the controls out loud?',['So there is never any doubt who is flying','It sounds cool','The radio needs it','It is a rule for passengers only'],'A clear spoken handoff means no one ever thinks the other person is flying when they are not.'),
 mc('The pilot flying says “I have the flight controls.” What does that mean?',['The pilot has taken over flying','The pilot wants a snack','The airplane is for sale','The pilot is lost'],'It means that pilot is now flying the airplane.'),
 tf('The briefing happens after landing.',false,'The briefing comes before the flight so you know the plan.'),
 tf('You should tell the instructor if you feel uneasy or unwell.',true,'Speak up. The instructor can change the plan, and feeling better matters.'),
 fl('The exchange of controls is said ___ times in all.',['three','one','ten','zero'],'It is a three-step exchange: you have it, I have it, you have it.'),
 od('Put the control exchange in order.',['Giver: “You have the controls”','Taker: “I have the controls”','Giver confirms with the same words'],'The giver offers, the taker accepts, and the giver confirms.')]),
L('disc-walk','The walkaround',[
 cd('Look it over','Before every flight the pilot walks around the airplane and checks it. You look at the wings, tail, tires, propeller and control surfaces. Today your instructor shows you how and you can follow along.'),
 cd('Fuel and oil','Pilots check that there is enough fuel and oil. They also drain a small fuel sample to look for water or dirt. Chocks and tie-down ropes are removed so the airplane can move.')],
 'Walk around it. Touch it. Look at it. Then climb in.',[
 mc('Why do pilots walk around the airplane first?',['To check it is ready and safe to fly','To get exercise','To wave to people','To count the windows'],'The walkaround, or preflight inspection, finds problems on the ground, where they are easy to fix.'),
 mc('What is a fuel sample checked for?',['Water or dirt','Color of paint','Radio signals','Cabin temperature'],'Water or dirt in the fuel can stop an engine, so pilots look for it.'),
 mc('What do chocks do?',['Block the wheels so the airplane does not roll','Make the engine louder','Measure wind','Keep the cabin cool'],'Chocks are wedges placed against the tires so a parked airplane stays put.'),
 tf('The pilot can skip the walkaround if the airplane flew yesterday.',false,'Every flight starts with a fresh look, because things can change overnight.'),
 tf('Tie-down ropes hold a parked airplane to the ground.',true,'They keep the wind from moving or lifting a parked airplane.'),
 fl('A check of the airplane before flight is called a ___.',['preflight','postflight','midflight','replay'],'The preflight inspection is done before every flight.')]),
L('disc-seat','Getting settled in the cockpit',[
 cd('Seats and belts','Climb in carefully, using the step and handholds. Adjust your seat so you can reach the pedals and see out the windows. Fasten your seat belt and shoulder harness, and check that the doors are latched.'),
 cd('Headsets','You wear a headset. It protects your ears from engine noise and lets you talk with the instructor through a small microphone. A push-to-talk button is used for the radio.')],
 'Belt on, door latched, headset ready.',[
 mc('Why do pilots wear headsets?',['To protect ears and hear each other','To look stylish','To listen to music','To keep the sun out'],'The engine is loud. A headset protects hearing and lets everyone talk clearly.'),
 mc('Which should you do before the engine starts?',['Fasten your seat belt and harness','Open the door in flight','Take off your shoes','Unplug the headset'],'Belts and harnesses keep you secure, especially in bumps.'),
 tf('Doors should be latched before you taxi.',true,'A door that is not latched can pop open, so pilots check it first.'),
 tf('You should never adjust the seat.',false,'You should adjust it so you can reach the pedals and see out clearly.'),
 fl('The ___ is used to talk on the radio.',['microphone','altimeter','rudder','flap'],'A microphone built into the headset carries your voice to the radio.'),
 mt('Match each item to its job.',[['Seat belt','Keeps you secure'],['Headset','Protects ears, for talking'],['Pedals','Steer on the ground']],'Each piece of gear in the cockpit has a clear job.')]),
L('disc-start','Starting up and taxiing',[
 cd('Clear the propeller','Before the engine starts, the pilot looks around and calls “Clear prop!” so anyone nearby knows the propeller is about to spin. Then the pilot follows the checklist and starts the engine.'),
 cd('Taxiing','The airplane rolls to the runway on taxiways. Pilots steer with the rudder pedals and slow down with the brakes. They stay on the yellow centerlines and stop at the hold short line until they have permission.')],
 'Clear prop, then start. Yellow line, then hold short.',[
 mc('What does a pilot call before starting the engine?',['“Clear prop!”','“Ready or not!”','“Mayday!”','“Gate open!”'],'“Clear prop” warns people nearby that the propeller is about to turn.'),
 mc('What do pilots use to steer on the ground?',['Rudder pedals','The yoke only','The radio','The flaps'],'In most small airplanes the rudder pedals steer the nosewheel while taxiing.'),
 mc('What color is the line a pilot follows on a taxiway?',['Yellow','Green','Blue','Pink'],'Taxiway centerlines are painted yellow.'),
 tf('A pilot may cross the hold short line without permission.',false,'Pilots stop at the hold short line until the tower clears them to go.'),
 fl('Pilots follow a ___ to do things in the right order.',['checklist','daydream','guess','shortcut'],'A checklist makes sure nothing gets missed.'),
 od('Put these in order.',['Walk around the airplane','Climb in and buckle up','Call “Clear prop”','Start the engine'],'Check it, settle in, warn others, then start.')]),
L('disc-takeoff','The takeoff',[
 cd('Line up and go','At the runway the pilot does a final check, lines up on the centerline, and pushes the throttle in for full power. The airplane picks up speed as the instructor steers with the rudder pedals.'),
 cd('Rotate and climb','When the airplane reaches flying speed, about 55 knots in many small trainers, the pilot pulls back gently to rotate. The wheels leave the ground and the airplane climbs away into the sky.')],
 'Full power, track the centerline, rotate, climb.',[
 mc('What do pilots call lifting the nose at flying speed?',['Rotation','Rewind','Rotor','Retreat'],'Rotating means raising the nose so the wings can lift the airplane off the runway.'),
 mc('Which control gives the engine more power?',['The throttle','The yoke','The flaps lever','The brakes'],'Pushing the throttle in makes more power; pulling it out reduces it.'),
 mc('What keeps the airplane straight on the runway while it speeds up?',['The rudder pedals','The seat belt','The radio','The tires only'],'The pedals steer the nosewheel and the rudder keeps the nose pointed down the centerline.'),
 tf('The airplane lifts off because the wings make lift.',true,'Once it is going fast enough, the wings make enough lift to leave the ground.'),
 tf('The pilot pulls the nose up before the airplane has any speed.',false,'The pilot waits until flying speed so the wings can work.'),
 fl('A knot is a speed of one nautical ___ per hour.',['mile','meter','foot','second'],'Pilots measure speed in knots: nautical miles per hour.')]),
L('disc-handson','Your hands on the controls',[
 cd('Gentle is best','When the instructor says “You have the flight controls,” hold the yoke lightly. Tiny pressures are enough. Push a little forward and the nose lowers. Pull a little back and the nose rises.'),
 cd('Look outside','Pilots spend most of their time looking outside. Keep the horizon in sight and the nose just below it for level flight. Turn the yoke slightly to bank and the airplane begins a turn.')],
 'Light hands, eyes outside, small movements.',[
 mc('How should you hold the yoke?',['Lightly','As hard as you can','With one finger only','Never touch it'],'Small, light pressures are all it takes. A death grip makes flying harder.'),
 mc('What happens when you pull the yoke gently back?',['The nose rises','The nose drops','The engine stops','The airplane turns left'],'Pulling back raises the nose; pushing forward lowers it.'),
 mc('Where should a pilot mostly look?',['Outside, at the horizon','At the floor','At the sun','At the ceiling'],'The horizon is the pilot’s best reference for the airplane’s position.'),
 tf('Turning the yoke slightly makes the airplane bank into a turn.',true,'The ailerons tilt the wings and the airplane begins to turn.'),
 tf('You must move the controls a lot to make anything happen.',false,'Airplanes respond to small movements. Big ones are too much.'),
 fl('The line where the sky meets the ground is the ___.',['horizon','runway','border','pattern'],'The horizon is the pilot’s main visual reference.')]),
L('disc-view','The view from above',[
 cd('A new picture','From 3,000 feet, roads look like ribbons, cars like tiny dots, and fields like patchwork. Pilots recognize landmarks such as highways, rivers, towers and lakes to know where they are.'),
 cd('Looking for traffic','Pilots always look for other aircraft. Instructors tell you to scan the sky slowly and say what you see. Spotting traffic early is one of the most important habits you will ever learn.')],
 'Eyes up, scan, spot, say it out loud.',[
 mc('What are landmarks?',['Easy-to-recognize things on the ground','Rules of the sky','Parts of the engine','Airplane lights'],'Roads, rivers, lakes and towers help pilots figure out where they are.'),
 mc('Why do pilots scan the sky?',['To spot other aircraft','To count clouds for fun','To check the time','To find food'],'Looking out for traffic is called see and avoid, and it keeps everyone safe.'),
 mc('From 3,000 feet, cars on a road look like…',['Tiny dots','Big boxes','Giant buses','Invisible'],'Distance makes things look small.'),
 tf('Pilots can stop looking outside once they are up high.',false,'Pilots keep scanning the whole flight.'),
 tf('A river is a good landmark.',true,'Rivers are easy to see and rarely change.'),
 fl('Looking around the sky for traffic is called ___.',['scanning','daydreaming','resting','taxiing'],'Scanning means moving your eyes across the sky in a steady pattern.')]),
L('disc-feel','What flying feels like',[
 cd('Bumps are normal','Air is not always smooth. Warm air rises and cool air sinks, and the airplane may bump as it passes through. Small airplanes are built to handle far more bumpiness than you will ever feel.'),
 cd('Feeling your best','If your stomach feels odd, tell your instructor, look at the horizon, and open the air vent. Eat a light meal before you fly. Many pilots feel queasy on their first flights and then get used to it.')],
 'Bumps are just air. Look at the horizon and breathe.',[
 mc('What causes most bumps in the air?',['Rising and sinking air','The engine breaking','Ocean waves','Traffic'],'Air moves up and down as it warms and cools, and the airplane feels it as a bump.'),
 mc('What can help if you feel queasy?',['Look at the horizon and tell your instructor','Close your eyes tight','Eat a big meal','Read a book'],'Looking outside helps your eyes and inner ear agree.'),
 tf('Bumpy air means the airplane is falling apart.',false,'Small airplanes are built strong, and bumps are only moving air.'),
 tf('Many pilots feel queasy on early flights and then get used to it.',true,'Your body adapts as you fly more.'),
 fl('Warm air tends to ___.',['rise','sink','freeze','vanish'],'Warm air is lighter than cool air, so it rises.'),
 mc('What should you tell your instructor if you feel unwell?',['How you feel, right away','Nothing at all','Only after landing','Never'],'Speaking up lets the instructor help.')]),
L('disc-return','Coming back to land',[
 cd('Join the pattern','Near the airport the instructor joins the traffic pattern, the racetrack-shaped path airplanes follow. Everyone flies the same way, so pilots see one another and take turns landing.'),
 cd('The landing','On final approach the airplane lines up with the runway and descends. Just before touching down the instructor raises the nose to flare, which slows the descent so the wheels touch gently.')],
 'Join the pattern, line up, flare, touch down.',[
 mc('What is the traffic pattern?',['A racetrack path around the airport','A pattern on the seat','The radio schedule','A kind of cloud'],'It is a standard path that keeps all airplanes flowing in the same direction.'),
 mc('What is the flare?',['Raising the nose just before touchdown','A signal light','Turning off the engine','A kind of turn'],'The flare slows the descent so the airplane lands softly.'),
 mc('What is final approach?',['The last leg lined up with the runway','The last cloud','The end of the briefing','The final lap'],'On final, the airplane is lined up and descending to land.'),
 tf('All airplanes in the pattern fly the same direction.',true,'This keeps traffic predictable and safe.'),
 tf('The pilot lands without looking outside.',false,'Pilots keep their eyes on the runway.'),
 fl('The airplane lands on the ___.',['runway','taxiway','apron','hangar'],'Runways are for takeoffs and landings; taxiways are for rolling.')]),
L('disc-log','Debrief and logbook',[
 cd('Talk it over','After landing the instructor goes over the flight with you: what went well and what to try next time. This talk is called a debrief, and it is where a lot of learning happens.'),
 cd('The logbook','Pilots record every flight in a logbook: the date, the airplane, the time flown and what was practiced. Your instructor signs it. Even a discovery flight is a great first entry.')],
 'Debrief it, log it, and sign it.',[
 mc('What is a debrief?',['A talk about the flight afterward','A fuel check','A takeoff','A kind of cloud'],'A debrief reviews what happened so you can learn from it.'),
 mc('What goes in a logbook entry?',['Date, airplane and time flown','Your favorite food','The weather channel','Your shoe size'],'Logbooks track flight experience for pilots.'),
 mc('Who signs a student’s logbook entry for dual instruction?',['The flight instructor','The tower','A passenger','Nobody'],'The instructor’s signature shows the training took place.'),
 tf('A discovery flight can be your first logbook entry.',true,'Many pilots proudly keep their first entry.'),
 tf('Pilots never need to write anything down.',false,'Logbooks matter. They prove experience for certificates and ratings.'),
 fl('A pilot’s record of flights is a ___.',['logbook','storybook','cookbook','phone book'],'Every pilot keeps a logbook.')]),
L('disc-next','What comes next',[
 cd('Keep going or not','Plenty of people take one discovery flight just for fun. If you loved it, the next step is flying lessons. You can start lessons at any age, and you may fly solo only when you are old enough and ready.'),
 cd('Build on the ground','Between flights you can study ground school, read about flying, and learn the airport. This game is practice for the day you start. Every hour of study makes every flight easier.')],
 'The sky does not care how old you are, but the rules do.',[
 mc('Can you take flying lessons before you are old enough to solo?',['Yes, with an instructor','No, never','Only after 21','Only with a degree'],'You can fly with an instructor at any age. Solo has age and training requirements.'),
 mc('What helps most between flights?',['Studying ground school','Skipping lessons','Forgetting everything','Watching only videos'],'Studying keeps knowledge fresh and makes flying lessons go further.'),
 tf('Everyone who takes a discovery flight must become a pilot.',false,'Many people fly once for fun, and that is fine.'),
 tf('You can learn many pilot topics on the ground before you ever fly.',true,'Ground school can start any time.'),
 fl('Flying alone for the first time is called a ___ flight.',['solo','duo','dual','group'],'Solo means flying alone as the only person aboard.'),
 od('Order the path from a first flight to flying.',['Take a discovery flight','Start flying lessons','Study ground school','Fly your first solo'],'Most pilots try a flight, begin lessons, study along the way, and solo when their instructor says they are ready.')])
]);
})();
