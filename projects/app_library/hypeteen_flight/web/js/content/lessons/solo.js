/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* STUDENT PILOT 12 - FIRST SOLO: readiness, pre-solo knowledge, endorsements, limits, nerves, the shirt-tail tradition, logging, the first solo cross-country. */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,od,L}=H.dsl;
H.addLessons('solo',[
L('sol-ready','What makes a student ready to solo',[
 cd('The instructor decides','Solo is not a prize for hours flown. It is a safety decision. The instructor watches the student fly and judges whether they can handle takeoffs, landings, the pattern, radio calls and surprises without help.'),
 cd('Signs of readiness','A student is ready when landings are safe and consistent, the airplane is flown on speed and on the centerline, go-arounds are quick, and the student makes good decisions, such as when to wait for better weather.')],
 'Solo is earned by judgment, not by hours.',[
 mc('Who decides when a student is ready to solo?',['The flight instructor','The student alone','The tower','A friend'],'The instructor makes the decision and signs the endorsement.'),
 mc('Which skill is a sign of readiness?',['Consistent safe landings','Fast talking','Wearing sunglasses','Loud engine start'],'Consistency is the key.'),
 mc('Is solo based only on hours flown?',['No, on judgment and skill','Yes, entirely','Only in winter','Only for adults'],'Skill matters more than the clock.'),
 tf('A student should be able to do a go-around quickly.',true,'It is a safety skill.'),
 tf('Everyone solos after exactly ten hours.',false,'Every student is different.'),
 fl('The ___ decides if a student is ready.',['instructor','weather','tower','passenger'],'The instructor judges readiness.')]),
L('sol-know','The pre-solo knowledge test',[
 cd('Show you know the rules','Before soloing, a student must pass a written pre-solo knowledge test about the rules, the airport, and the airplane. The instructor reviews the answers and talks over anything missed.'),
 cd('What it covers','Topics include the regulations that apply to student pilots, flight rules in the traffic pattern, the airplane’s limits and systems, and the airport where the student will fly. It proves you are prepared, not just able to fly.')],
 'Know the rules before you fly alone.',[
 mc('What must a student pass before the first solo?',['A pre-solo knowledge test','A speed trial','A cooking test','A swim test'],'It shows you know the rules and procedures.'),
 mc('Who reviews the test with the student?',['The instructor','A stranger','The tower','Nobody'],'The instructor goes over missed items.'),
 mc('What is it about?',['Rules, the airport and the airplane','Sports','Movies','Cars'],'Knowledge for safe solo.'),
 tf('The test proves you are prepared.',true,'Knowledge is part of readiness.'),
 tf('You can skip the test if you fly well.',false,'It is required.'),
 fl('The ___ test is taken before solo.',['knowledge','taste','speed','memory'],'Pre-solo knowledge test.')]),
L('sol-endorse','Endorsements',[
 cd('A signature from your instructor','An endorsement is a written statement in your logbook, signed by your instructor, that says you have been trained and are ready for a specific step. Your first solo needs an endorsement for the make and model of airplane.'),
 cd('Stays current for 90 days','A solo endorsement for a specific airplane is valid for 90 days. After that, the instructor must check you out again and renew it. The student pilot certificate also needs to carry the right endorsements.')],
 'No endorsement, no solo.',[
 mc('What is an endorsement?',['A signed statement in your logbook','A kind of radio call','A tire check','A weather report'],'It records the instructor’s approval.'),
 mc('How long is a solo endorsement valid?',['90 days','90 minutes','9 years','9 hours'],'It must be renewed every 90 days.'),
 mc('What does the endorsement specify?',['The make and model of airplane','The weather','Your lunch','The tower'],'It’s for a specific type of airplane.'),
 tf('Only the instructor can sign it.',true,'A flight instructor signs endorsements.'),
 tf('One endorsement works for any airplane forever.',false,'It’s specific and expires.'),
 fl('A solo endorsement lasts ___ days.',['90','9','900','9000'],'Ninety days.')]),
L('sol-limits','Rules for student pilots',[
 cd('What a student may not do','Student pilots may not carry passengers. They may not fly for pay or hire, or in a way that carries people or property for compensation. They may not fly in conditions their instructor has not approved.'),
 cd('Within limits','The instructor can set limits for wind, visibility and cloud height, as well as the area for solo flying. These limits are written in the logbook. Student pilots stay inside them and say “no” when in doubt.')],
 'No passengers. Stay within your endorsed limits.',[
 mc('Can a student pilot carry passengers?',['No','Yes, always','Only on weekends','Only friends'],'Passengers are not allowed for student pilots.'),
 mc('Who sets a student’s solo limits?',['The instructor','The student','The tower','A mechanic'],'Limits are endorsed in the logbook.'),
 mc('What should a student do in doubt?',['Say no and ask','Go anyway','Skip the checklist','Fly lower'],'When in doubt, don’t.'),
 tf('Student pilots may not fly for pay.',true,'They cannot carry people or property for compensation.'),
 tf('A student can choose any weather limits they want.',false,'The instructor approves the limits.'),
 fl('A student pilot may not carry ___.',['passengers','a map','a headset','water'],'No passengers.')]),
L('sol-weather','Solo weather limits',[
 cd('Conservative limits','For the first solos, instructors set strict weather limits. For example, a limit may be a maximum wind speed, a maximum crosswind, and a minimum ceiling and visibility that are better than the legal minimum.'),
 cd('Personal minimums','A personal minimum is a rule you set for yourself. If the weather is outside it, you don’t fly. Pilots write them down and review them as they gain experience. They are made before the flight, when you are calm, not in the moment.')],
 'Decide your limits on the ground.',[
 mc('What is a personal minimum?',['A limit you set for yourself','A kind of aircraft','A radio code','A fuel grade'],'It’s your own weather rule.'),
 mc('When are personal minimums set?',['Before the flight','During the landing','After a crash','Never'],'Decide while calm.'),
 mc('How are student weather limits compared to the legal minimum?',['More conservative','Looser','The same','Unrelated'],'Instructors set cautious limits.'),
 tf('Writing down personal minimums helps.',true,'It makes the decision easier.'),
 tf('You can raise your limits mid-flight when you feel brave.',false,'Don’t change them in the moment.'),
 fl('Weather decisions should be made ___ the flight.',['before','during','after','instead of'],'Before the flight.')]),
L('sol-pattern','Your first solo flight',[
 cd('Three trips around','The first solo is usually three takeoffs and landings in the traffic pattern at a familiar airport. The instructor watches from the ground or listens on the radio, and then steps out and signs you off.'),
 cd('A different airplane','Without the instructor’s weight, the airplane is lighter. It will leap off the runway sooner and climb more steeply. It may float a little on landing. Knowing this in advance keeps it from being a surprise.')],
 'The empty seat makes the airplane lighter.',[
 mc('What does the first solo usually include?',['Three takeoffs and landings in the pattern','A trip across the country','An hour in clouds','A night flight'],'A short, familiar flight.'),
 mc('How does the airplane change without the instructor?',['It is lighter and climbs better','It is heavier','It is slower','It is louder'],'Less weight means more performance.'),
 mc('Where is the instructor during solo?',['On the ground, watching','In the back seat','At home','Asleep'],'They monitor from the field.'),
 tf('The airplane may float more on landing when light.',true,'Less weight, more float.'),
 tf('The first solo is a long cross-country trip.',false,'It is a short pattern flight.'),
 od('Put the first solo in order.',['Instructor gets out','Taxi to the runway','Takeoff and pattern','Three landings'],'It starts with the instructor stepping out.')]),
L('sol-nerves','Nerves and confidence',[
 cd('Everyone feels it','Feeling nervous before a solo is normal. Pilots turn that energy into focus by following their checklist and routine. Breathe slowly, review the plan, and remember that you have done each step many times.'),
 cd('Trust your training','You do not need to be perfect. You only need to fly safely and make good decisions, including a go-around. If something feels wrong, do what you practiced. Your instructor would not send you if you were not ready.')],
 'Breathe, trust your training, follow the checklist.',[
 mc('Is it normal to feel nervous before the first solo?',['Yes','No, never','Only for boys','Only for adults'],'Nerves are normal.'),
 mc('What helps turn nerves into focus?',['A checklist and routine','Skipping steps','Rushing','Skipping the briefing'],'Routine calms the mind.'),
 mc('What if something feels wrong?',['Do what you practiced','Panic','Quit mid-air','Close your eyes'],'Rely on training.'),
 tf('You must fly perfectly on the first solo.',false,'Safe and sensible is the goal.'),
 tf('Your instructor believes you are ready.',true,'They would not endorse you otherwise.'),
 fl('Slow ___ helps calm nerves.',['breathing','talking','driving','typing'],'Breathing slowly calms you.')]),
L('sol-shirt','The shirt-tail tradition',[
 cd('A pilot custom','After a student’s first solo, many flight schools follow an old tradition: the instructor cuts off the back of the student’s shirt. Long ago, instructors sat behind students and tugged on their shirts to get their attention. Now the student no longer needs the tug.'),
 cd('A keepsake','The shirt-tail is usually signed and decorated with the date, the airplane and the student’s name, then hung on the wall at the flight school. It is one of aviation’s favorite traditions and a nice reminder of that day.')],
 'First solo? Out comes the scissors.',[
 mc('What is the shirt-tail tradition?',['Cutting the back off the student’s shirt','Washing the airplane','Painting the tail','Kissing the runway'],'A celebration of the first solo.'),
 mc('Where does the shirt-tail usually end up?',['On the flight school wall','In the trash','In the cockpit','On the runway'],'It becomes a keepsake.'),
 mc('Why did instructors tug shirts in the old days?',['To get the student’s attention','To fix the seat','To clean','To start the engine'],'They sat behind the student.'),
 tf('The tradition is a celebration.',true,'It marks the milestone.'),
 tf('Every school must do it by law.',false,'It is only a tradition.'),
 fl('The shirt-___ is cut after the first solo.',['tail','sleeve','pocket','button'],'Shirt-tail.')]),
L('sol-log','Logging your time',[
 cd('Pilot-in-command time','When you fly alone as a student pilot, you can log that time as solo and as pilot in command, the person responsible for the flight. Time with an instructor is dual instruction received. Both count toward certificates.'),
 cd('Write it right','A good log has the date, the aircraft type and registration, route, total time, and the type of time. A tidy logbook tells the story of your training and is checked by the examiner at your checkride.')],
 'If it is not in the logbook, it did not happen.',[
 mc('What kind of time is flying alone as a student?',['Solo and PIC time','Dual received','Passenger time','Taxi time'],'You are the pilot in command.'),
 mc('What is flying with an instructor called?',['Dual received','Solo','Passenger','Night'],'Dual instruction received.'),
 mc('Who checks your logbook at the practical test?',['The examiner','The tower','A passenger','Nobody'],'The examiner checks requirements.'),
 tf('Logbook entries need a date and aircraft.',true,'Details matter.'),
 tf('You can skip logging as long as you remember.',false,'Write it down.'),
 fl('PIC means pilot in ___.',['command','control','charge','crew'],'Pilot in command.')]),
L('sol-xc','The first solo cross-country',[
 cd('A trip alone','After more training, students make solo cross-country flights. They plan the route, check the weather, and fly to other airports on their own. Each trip needs an endorsement from the instructor for the route and weather conditions.'),
 cd('The long solo','For the private certificate, a student must complete one long solo cross-country of at least 150 nautical miles total, with full-stop landings at three points and a straight-line distance of more than 50 nautical miles between two of them.')],
 'Plan it, brief it, fly it, log it.',[
 mc('What must a student have before a solo cross-country?',['An instructor’s endorsement','A passenger','A camera','A new airplane'],'The instructor reviews and approves.'),
 mc('What is the length of the long solo for a private certificate?',['At least 150 nautical miles total','10 miles','1,000 miles','5 miles'],'It includes three points of landing.'),
 mc('How many landing points must the long solo include?',['Three','One','Ten','Two hundred'],'Full-stop landings at three points.'),
 tf('The student plans the route and checks the weather.',true,'That’s part of the training.'),
 tf('A cross-country flight must always be flown in clouds.',false,'Student cross-countries are in visual conditions.'),
 fl('A trip from one airport to another is a ___.',['cross-country','circle','loop','swap'],'Cross-country means flight to another airport.')])
]);
})();
