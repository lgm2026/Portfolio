/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* PRIVATE PILOT 17 - PRACTICE CHECKRIDE (practice only, not an FAA test) */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,od,L}=H.dsl;
H.addLessons('ride',[
L('rd-path','The road to a license',[
 cd('Requirements overview','To earn a private pilot certificate in the U.S., a student must be at least 17, speak English, pass a medical exam, pass a knowledge test, log required training time and pass a practical test. Student pilots can start training before 17 and solo at 16.'),
 cd('Flight time','The minimum is 40 hours of flight time, including 20 with an instructor and 10 solo. Most students take longer, often 60 to 70 hours. Practice, steady lessons and good study habits matter more than the number.')],
 'Minimum is 40 hours; most take more.',[
 mc('What is the minimum age for a private certificate?',['17','12','25','30'],'Seventeen.'),
 mc('What is the minimum flight time?',['40 hours','4 hours','400 hours','4,000 hours'],'Forty.'),
 mc('Typical students take…',['60 to 70 hours','5 hours','1 hour','1,000 hours'],'More than the minimum.'),
 tf('A student can solo at 16.',true,'Yes.'),
 tf('Everyone finishes in exactly 40 hours.',false,'Most need more.'),
 fl('A knowledge test and a ___ test are required.',['practical','radio','cooking','paper'],'Practical.')]),
L('rd-med','Medical certificates',[
 cd('Why a medical','A medical certificate shows a pilot is healthy enough to fly. An aviation medical examiner performs the exam. It checks vision, hearing, heart and general health.'),
 cd('Classes','There are first, second and third class medicals, and BasicMed in certain cases. A private pilot usually needs a third class. Getting a medical early shows if there are any issues before spending lots on training.')],
 'Get the medical early.',[
 mc('Who gives the exam?',['An aviation medical examiner','Anyone','The tower','A friend'],'AME.'),
 mc('Which class does a private pilot usually need?',['Third class','First class','No class','Fifth class'],'Third.'),
 mc('Why get one early?',['To know about issues','To be fast','To be tall','No reason'],'Plan wisely.'),
 tf('The exam checks vision and hearing.',true,'Yes.'),
 tf('Pilots never need medicals.',false,'Usually they do.'),
 fl('AME stands for aviation medical ___.',['examiner','engine','expert','editor'],'Examiner.')]),
L('rd-know','The knowledge test',[
 cd('A written exam','The knowledge test is a computer exam of multiple-choice questions on regulations, weather, navigation, aerodynamics and more. Students study with a ground school or a home course, then take it at an approved testing center.'),
 cd('Passing score','A passing score is 70 percent. The score report lists subjects missed, which the instructor reviews before the practical test. Study tools such as practice tests and apps can help.')],
 'Study, practice tests, then review misses.',[
 mc('What is the passing score?',['70 percent','7 percent','170 percent','No score'],'Seventy.'),
 mc('How is the test taken?',['On a computer','In a plane','In a car','Outdoors'],'Testing center.'),
 mc('What topic is on the test?',['Weather and navigation','Cooking','Drawing','Dance'],'Many subjects.'),
 tf('The instructor reviews missed subjects.',true,'Yes.'),
 tf('The test is only about flying skills.',false,'It is a written test.'),
 fl('The knowledge test is taken at an approved ___ center.',['testing','shopping','dance','sailing'],'Testing.')]),
L('rd-prac','The practical test',[
 cd('The checkride','The practical test, nicknamed the checkride, is given by a designated pilot examiner. It has two parts: an oral exam on the ground and a flight test. The examiner checks you can fly safely and make good decisions.'),
 cd('Practice only here','This lesson and the others in HFQ are practice for curious cadets. They are not the real test and not an FAA course. A real checkride happens only with a certified instructor and a designated examiner.')],
 'Oral first, then the flight.',[
 mc('Who gives the checkride?',['A designated pilot examiner','A friend','A teacher','A random person'],'DPE.'),
 mc('What are the two parts?',['Oral and flight','Read and write','Run and swim','Eat and sleep'],'Ground and air.'),
 mc('What is a checkride testing?',['Skill and decisions','Speed only','Luck','Looks'],'Both.'),
 tf('HFQ checkrides are practice only.',true,'Not an FAA test.'),
 tf('The oral is held in the air.',false,'On the ground.'),
 od('Put the checkride in order.',['Preparation','Oral exam','Flight test'],'Prepare, oral, fly.')]),
L('rd-oral','Oral exam topics',[
 cd('What you may be asked','The examiner asks about regulations, weather, charts, airspace, performance, weight and balance, aircraft systems and decision making. The questions follow the Airman Certification Standards, or ACS.'),
 cd('How to prepare','Practice answering out loud. Be honest if you don’t know and show where you would look it up. Pilots are not expected to memorize everything; they are expected to know how to find and use information.')],
 'Know where to look it up.',[
 mc('What standards guide the test?',['The ACS','A cookbook','A map','A comic'],'Airman Certification Standards.'),
 mc('What if you don’t know an answer?',['Show where to find it','Guess wildly','Leave','Hide'],'Honesty.'),
 mc('Practice answering…',['Out loud','Silently','Never','In the dark'],'Say it.'),
 tf('The oral covers weather and airspace.',true,'Many topics.'),
 tf('You must memorize every rule.',false,'Know how to find them.'),
 fl('ACS stands for Airman Certification ___.',['Standards','Songs','Sets','Seats'],'Standards.')]),
L('rd-maneuvers','Flight test maneuvers',[
 cd('What you fly','On the flight test, you do takeoffs and landings, steep turns, slow flight, stalls, ground reference maneuvers, navigation, an emergency approach and more. You must stay within standards for altitude, heading and speed.'),
 cd('Smooth and safe','The examiner watches for good decisions as much as perfect numbers. If you make an error, correct it calmly. Talk through what you are doing. A go-around is a good decision, not a failure.')],
 'Decisions matter as much as precision.',[
 mc('What does the examiner watch for?',['Decisions and skill','Speed only','Looks','Noise'],'Both.'),
 mc('Is a go-around a failure?',['No, it is a good decision','Yes','Always','Never allowed'],'Safe choice.'),
 mc('What should you do after a mistake?',['Correct calmly','Panic','Quit','Argue'],'Stay cool.'),
 tf('You must stay within altitude and heading standards.',true,'Yes.'),
 tf('Talking through your actions is not allowed.',false,'It helps.'),
 fl('The emergency ___ is flown with a simulated engine failure.',['approach','nap','song','dance'],'Approach.')]),
L('rd-cross','Cross-country on the test',[
 cd('Plan a trip','The examiner often gives you a cross-country to plan. You choose a route, find wind and weather, compute headings and fuel, and fly it. Part of the test may include diverting to another airport.'),
 cd('Divert','To divert, estimate the heading and distance to the new airport, note the time, and turn. You do not need a perfect answer. Use quick rules like 1 minute equals the distance at your ground speed.')],
 'Plan well, then stay flexible.',[
 mc('What does a divert mean?',['Go to another airport','Land in a field','Stop flying','Wave'],'New destination.'),
 mc('What do you compute for the plan?',['Heading and fuel','Songs','Colors','Names'],'Navigation.'),
 mc('What helps a divert?',['Quick estimates','Perfect math only','Silence','Luck'],'Estimate.'),
 tf('Weather affects the plan.',true,'Yes.'),
 tf('You never need to change the plan.',false,'Flexibility counts.'),
 fl('A change of destination is a ___.',['diversion','dinner','dance','dream'],'Diversion.')]),
L('rd-fail','If a test doesn’t go well',[
 cd('It is okay','Not every checkride ends in a pass. If a task is missed, the examiner gives a notice and the student studies and tries again. Most pilots who retest pass. A retest isn’t a mark of shame.'),
 cd('Learn and move on','Review what happened, work with the instructor on the weak area, and retake only the failed tasks. Persistence is a pilot skill. Many famous pilots took a second try.')],
 'A retest is a step, not a stop.',[
 mc('What happens after a missed task?',['Study and retest','Never fly','Pay a fine only','Move away'],'Try again.'),
 mc('What is retaken?',['Only the failed tasks','Everything','Nothing','The medical'],'Focused retest.'),
 mc('Is persistence a pilot skill?',['Yes','No','Only sometimes','Never'],'Yes.'),
 tf('Retesting is common.',true,'It is okay.'),
 tf('A retest means you can never be a pilot.',false,'Not at all.'),
 fl('Work with your ___ on the weak area.',['instructor','cat','friend only','tower'],'Instructor.')]),
L('rd-priv','Privileges and limits',[
 cd('What you can do','A private pilot can carry passengers, fly for fun and share expenses with passengers. Private pilots can fly in day or night VFR with the right currency, and can add ratings.'),
 cd('What you cannot do','A private pilot cannot fly for pay or hire, and cannot carry people or cargo for compensation. A commercial certificate is needed for that. Sharing costs is allowed only under limited rules.')],
 'Private means no pay for flying.',[
 mc('May a private pilot fly for hire?',['No','Yes','Always','Sometimes'],'Needs commercial.'),
 mc('May they carry passengers?',['Yes','No','Never','Only dogs'],'With currency.'),
 mc('What certificate allows flying for pay?',['Commercial','Student','Sport only','None'],'Commercial.'),
 tf('Private pilots may share some expenses.',true,'Limited rules.'),
 tf('A private pilot can run an airline.',false,'It needs more ratings.'),
 fl('Flying for pay needs a ___ certificate.',['commercial','private','student','free'],'Commercial.')]),
L('rd-next','After you earn it',[
 cd('A license to learn','A private certificate is not the finish. It is a license to learn. New pilots build time, learn new airports, practice in different weather and fly with experienced pilots.'),
 cd('Next ratings','Common next steps are the instrument rating, a commercial certificate, a multi-engine rating and a flight instructor certificate. Each opens new doors. Every great pilot began as a beginner.')],
 'The license is a start.',[
 mc('Which rating allows flight in clouds?',['Instrument rating','Sport rating','Floats rating','Lunch rating'],'IFR.'),
 mc('What is a private certificate often called?',['A license to learn','The end','A toy','A game'],'Keep learning.'),
 mc('What comes next after private for a career?',['Commercial','Nothing','A nap','A hobby only'],'Often.'),
 tf('New pilots should keep learning.',true,'Yes.'),
 tf('Learning ends at the checkride.',false,'It continues.'),
 fl('A certificate is a license to ___.',['learn','quit','sleep','guess'],'Learn.')])
]);
})();
