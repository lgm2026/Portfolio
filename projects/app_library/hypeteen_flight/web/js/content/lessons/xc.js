/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* PRIVATE PILOT 9 - CROSS-COUNTRY FLYING: planning, go/no-go, charts en route, departing, cruising, fuel stops, flight plans, arriving, after landing. */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,od,L}=H.dsl;
H.addLessons('xc',[
L('xc-plan','Planning the route',[
 cd('Pick a good route','The straight line is not always the best route. Look at terrain, airspace, weather, and where you can land if something goes wrong. Choose checkpoints, and avoid restricted areas and busy Class B airspace unless you plan to enter properly.'),
 cd('Alternates and margins','Pick airports along the route you could use if needed, and an alternate at your destination. Give yourself margins in fuel, time and weather. A good plan has choices built in, so no single problem leaves you stuck.')],
 'A good plan has options.',[
 mc('Is a straight line always the best route?',['No, terrain and airspace matter','Yes always','Only at night','Only with a tailwind'],'Plan for safety first.'),
 mc('What are alternates for?',['A backup airport if you cannot land','A radio setting','An extra seat','A fuel type'],'They give options.'),
 mc('What should you leave in the plan?',['Margins for fuel, time and weather','Nothing extra','More speed','Less checking'],'Margins protect you.'),
 tf('Good plans have options built in.',true,'It helps if problems occur.'),
 tf('You should plan only for perfect weather.',false,'Plan for the unexpected.'),
 fl('A backup airport is an ___.',['alternate','accident','arrival','approach'],'Alternate.')]),
L('xc-go','The go/no-go decision',[
 cd('Check yourself and the plane','Before leaving, ask three questions. Am I ready? Is the airplane ready? Is the weather okay for this flight? The IMSAFE checklist helps check yourself: Illness, Medication, Stress, Alcohol, Fatigue, Emotion.'),
 cd('Be willing to say no','Weather changes. Plans change. Experienced pilots cancel or delay often, and they do not regret it. The best pilots are the ones who live to fly another day. If you wouldn’t take your family on this flight, don’t take it yourself.')],
 'If in doubt, stay out.',[
 mc('What does IMSAFE help check?',['The pilot’s fitness','The airplane’s fuel','The weather','The runway'],'It is a personal checklist.'),
 mc('What does the F in IMSAFE stand for?',['Fatigue','Fuel','Flap','Flight'],'Fatigue.'),
 mc('What is a wise attitude toward cancelling?',['No regret; it keeps you safe','Never cancel','Cancel only in rain','Always push on'],'Safety first.'),
 tf('Good pilots cancel or delay when needed.',true,'It is a skill.'),
 tf('You must complete every planned flight.',false,'Plans can change.'),
 od('Put these questions in the order often asked.',['Am I ready?','Is the airplane ready?','Is the weather OK?'],'Pilot, plane, weather.')]),
L('xc-chart','Using the sectional en route',[
 cd('Orient the chart','Hold the chart so the direction you are flying is up, or at least keep it aligned with the ground. Fold it so your route and the next 50 miles are visible. Mark your course line and checkpoints before you go.'),
 cd('Match chart to ground','Check your position often. Find a landmark on the ground, then find it on the chart; not the other way around. If something doesn’t match, slow down and reconsider. Know which side of the course line features should appear.')],
 'Ground to chart, not chart to ground.',[
 mc('Which direction should the chart face?',['Aligned with your direction of flight','Upside down','Sideways always','Folded away'],'It helps you match things.'),
 mc('What should you do when the ground doesn’t match the chart?',['Slow down and reconsider','Speed up','Dive','Ignore it'],'Do not force a match.'),
 mc('Which order is best for checking position?',['Find it on the ground, then on the chart','Find the chart feature, then look for it','Neither','Guess'],'Ground to chart.'),
 tf('Marking your route helps in flight.',true,'It saves time.'),
 tf('You can fold the chart any way you want.',false,'Fold so the route is visible.'),
 fl('Sectional charts show ___ and airspace.',['terrain','menus','songs','recipes'],'Terrain.')]),
L('xc-depart','The departure',[
 cd('Leaving the pattern','After takeoff, climb to a safe altitude, leave the pattern, and turn onto your first heading. Note the time you took off. Check your heading against the compass. Level off at the planned cruising altitude, lean the mixture, and set cruise power.'),
 cd('Find the first checkpoint','Look for the first landmark on your route and confirm the time and heading. If it is not where expected, check the compass and wind. Early confirmation sets the rhythm for the whole flight and builds confidence.')],
 'Note the time, check the heading, find checkpoint one.',[
 mc('What should you note after takeoff?',['The time','The color of the cabin','The flight number','Nothing'],'You need it for ETAs.'),
 mc('What should you confirm early in the flight?',['Heading and the first checkpoint','Only the radio','Only the mixture','Your lunch'],'Early checks help.'),
 mc('What is done at the planned altitude?',['Set cruise power and lean as needed','Turn off the engine','Dive','Call mayday'],'Configure for cruise.'),
 tf('You compare the compass and the heading indicator.',true,'It confirms heading.'),
 tf('It is fine to skip checkpoints.',false,'Checkpoints keep you oriented.'),
 fl('Takeoff time is used to figure ___.',['ETAs','colors','prices','names'],'Estimated times of arrival.')]),
L('xc-cruise','Cruising and checkpoints',[
 cd('Time, heading, altitude','In cruise, pilots keep checking the time, heading and altitude, and cross-check the ground and the chart. At each checkpoint, note the time, compute ground speed, and update the arrival time and fuel.'),
 cd('Stay ahead','Use quiet time to listen to weather, review the next airport, and look for traffic. Eat and drink something, because comfort helps judgment. Don’t let the plan run you; adjust it as the real wind and weather show up.')],
 'At every checkpoint: time, speed, fuel.',[
 mc('What do you do at each checkpoint?',['Note the time and update ground speed','Land','Turn off the radio','Climb 5,000 feet'],'Update your plan.'),
 mc('What helps judgment during a long flight?',['Eating and drinking','Skipping breaks','Closing the shades','Silence only'],'Comfort keeps you sharp.'),
 mc('How should you treat the plan?',['Adjust it as conditions change','Never change it','Ignore it','Throw it out'],'Plans adapt.'),
 tf('Cruise is a good time to listen to weather.',true,'Use the quiet time.'),
 tf('You can stop looking outside in cruise.',false,'Scan always.'),
 fl('At checkpoints you compute your ground ___.',['speed','color','price','seat'],'Ground speed.')]),
L('xc-stop','Fuel stops',[
 cd('When to stop','Stop for fuel when the legal reserve would be too thin, or when the weather ahead is uncertain. A fuel stop is also a break for the pilot. Plan stops at airports with services and runways you can handle.'),
 cd('At the airport','Ask for the right fuel and watch it go in. Check the caps and sample the fuel afterward. Check the weather again before you go. Stopping for fuel usually costs less time than people think and is much less expensive than an emergency.')],
 'Stop early rather than stretch.',[
 mc('When is a fuel stop wise?',['When reserves would be thin','Never','Only at night','Only on a Tuesday'],'Do not stretch it.'),
 mc('What do you do after fueling?',['Check caps and sample the fuel','Take off immediately','Skip checks','Change seats'],'Verify it.'),
 mc('Besides fuel, what is a stop good for?',['A break and a weather check','Nothing','Radio practice only','A haircut'],'Rest and update.'),
 tf('Watch the fueling to make sure the right grade goes in.',true,'Mistakes can be deadly.'),
 tf('Fuel stops waste too much time to bother with.',false,'Stops are cheaper than emergencies.'),
 fl('Always sample fuel for ___.',['water','color of the sky','speed','lunch'],'Water and dirt.')]),
L('xc-fp','The VFR flight plan',[
 cd('What it is','A VFR flight plan is a record of where you intend to fly, filed with Flight Service. If you do not arrive and do not close the plan, a search can begin. It is not required for most VFR flights but is a smart safety net.'),
 cd('Open and close','File it before you go, ask to have it activated after takeoff, and close it when you land. If you forget to close it, people will start looking for you after a time. Closing it is as important as opening it.')],
 'Open it, close it, or someone will come looking.',[
 mc('What happens if you don’t close a VFR flight plan?',['A search can begin','Nothing','You win a prize','The airplane flies itself'],'Flight Service will look for you.'),
 mc('Is a VFR flight plan required for most VFR flights?',['No, but it is a good idea','Yes always','Only at night','Only in clouds'],'It is optional but useful.'),
 mc('Who receives your flight plan?',['Flight Service','Your friend only','The weather','The fuel truck'],'It goes to Flight Service.'),
 tf('You must close the plan when you land.',true,'Or call to close.'),
 tf('A flight plan is the same as a clearance.',false,'It is not a clearance.'),
 fl('A VFR flight plan is a safety ___.',['net','nap','lamp','map'],'A safety net.')]),
L('xc-radio','Radios on a trip',[
 cd('Listen and talk','En route, pilots monitor the right frequencies and use ATC services like flight following. When near an airport, listen to the ATIS, AWOS or CTAF before you get close. Hearing other pilots tells you who is in the pattern before you get there.'),
 cd('Keep it organized','Write down the frequencies ahead of time and keep them where you can see them. A small kneeboard works well. When the radio is busy, wait, listen, and speak clearly when your turn comes. Keep it short.')],
 'Write down frequencies before you need them.',[
 mc('Why listen before reaching an airport?',['To learn the weather and traffic','To waste time','To confuse others','To save fuel'],'You arrive better prepared.'),
 mc('What helps organize frequencies?',['A kneeboard','A hat','A sandwich','A mirror'],'Handy notes.'),
 mc('What do you do when the frequency is busy?',['Wait and listen','Talk over others','Turn it off','Shout'],'Wait for a gap.'),
 tf('Writing frequencies ahead of time reduces workload.',true,'You can focus on flying.'),
 tf('Radio calls should be as long as possible.',false,'Keep them short.'),
 fl('A pilot’s notes board is a ___.',['kneeboard','headboard','skateboard','dashboard'],'Kneeboard.')]),
L('xc-arrive','Arriving at an unfamiliar airport',[
 cd('Get the picture','Before you arrive, get the weather, review the airport diagram, runway lengths, frequencies, and NOTAMs. Listen for traffic. Fly high enough to see the runway, and look for the windsock and the pattern direction.'),
 cd('No hurry','Join the pattern as published and fly it carefully. If you aren’t sure which runway to use or how to get to parking, ask. Nobody minds a question, and everyone minds an incident. After landing, taxi slowly and follow the airport diagram.')],
 'New airport, extra caution.',[
 mc('What should you review before landing at a new airport?',['The airport diagram and NOTAMs','Only the fuel price','Only the restaurant','Only the color of the hangar'],'Preparation matters.'),
 mc('If unsure how to taxi to parking, what do you do?',['Ask','Guess fast','Cross runways','Stop on the runway'],'Ask for help.'),
 mc('Where do you look for pattern direction?',['The segmented circle and windsock','The tires','The cockpit floor','The ceiling'],'The visual pattern indicators.'),
 tf('Nobody minds a question.',true,'Safety first.'),
 tf('You should rush at a new airport.',false,'Slow and careful.'),
 fl('An airport ___ shows taxiways and runways.',['diagram','poem','menu','joke'],'Diagram.')]),
L('xc-after','After the flight',[
 cd('Shut down and secure','Complete the after-landing and shutdown checklists. Tie down the airplane, chock the wheels, close the flight plan, and lock up. Write any problems in the maintenance log so the next pilot and the mechanics know.'),
 cd('Log and learn','Fill in the logbook with the time, route and notes. Think about what went well and what you would change. The best pilots review every flight and keep improving, even after thousands of hours.')],
 'Secure it, log it, learn from it.',[
 mc('What should you do about a problem you noticed?',['Write it in the maintenance log','Ignore it','Hide it','Blame others'],'Report it.'),
 mc('What else do you do after landing?',['Tie down and close the flight plan','Leave the engine running','Leave the doors open','Nothing'],'Secure the airplane.'),
 mc('Why review each flight?',['To improve','To brag','To waste time','To confuse'],'Learning never stops.'),
 tf('Pilots log the flight after landing.',true,'Keep accurate records.'),
 tf('The best pilots stop learning once certified.',false,'They keep improving.'),
 fl('A ___ lists problems for the mechanics.',['squawk sheet','menu','map','toy'],'A squawk sheet.')])
]);
})();
