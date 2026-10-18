/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* BEYOND 4 - FLIGHT INSTRUCTOR */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,mt,od,L}=H.dsl;
H.addLessons('cfi',[
L('cf-role','Becoming an instructor',[
 cd('A CFI','A Certificated Flight Instructor, or CFI, teaches people to fly. A CFI must hold a commercial certificate, pass the knowledge tests and a practical test on teaching. Some CFIs teach for years; others use it to build hours.'),
 cd('Why instruct','Teaching builds deep knowledge, patience and communication. Many airline pilots began as CFIs. Students remember good instructors for a lifetime.')],
 'CFI = teacher of flying.',[
 mc('What does a CFI do?',['Teaches people to fly','Repairs engines','Directs traffic','Sells fuel'],'A CFI is a certificated flight instructor.'),
 mc('What must a CFI hold first?',['A commercial certificate','A boat license','A hat','A radio'],'Required.'),
 mc('What does teaching build?',['Deep knowledge and patience','Fuel','Speed','Weight'],'Skills.'),
 tf('Many airline pilots began as CFIs.',true,'Yes.'),
 tf('A CFI may not teach for pay.',false,'They may.'),
 fl('A CFI is a flight ___.',['instructor','invader','inspector','indexer'],'Instructor.')]),
L('cf-fundamentals','Fundamentals of instruction',[
 cd('How people learn','People learn by seeing, hearing and doing. Good teachers explain, show, then let the student try. The basic steps are preparation, presentation, application and review.'),
 cd('Learning levels','Learners go from rote (memorizing), to understanding, to application, to correlation (connecting ideas). A great flight lesson moves a student up these levels.')],
 'Explain, show, let them try, then review.',[
 mc('What are the four teaching steps?',['Preparation, presentation, application, review','Run, jump, swim, nap','Eat, sleep, play, work','Read, write, draw, sing'],'Lesson plan.'),
 mc('What is rote learning?',['Memorizing','Flying','Cooking','Teaching'],'Basic level.'),
 mc('What is correlation?',['Connecting ideas','Forgetting','Counting','Resting'],'Highest level.'),
 tf('People learn by doing.',true,'Yes.'),
 tf('Only lectures work.',false,'Hands-on helps.'),
 od('Put the four steps in order.',['Preparation','Presentation','Application','Review'],'P-P-A-R.')]),
L('cf-brief','Briefing and debriefing',[
 cd('Before the flight','A good instructor briefs before the lesson: what will be done, how, and why. The student then knows the goals and the standards. Short and clear is best.'),
 cd('After the flight','The debrief reviews what went well and what to improve. Instructors focus on a few key points. Kind, honest feedback builds skill and confidence.')],
 'Brief the plan; debrief the lessons.',[
 mc('What is a pre-flight briefing?',['Goals and plan for the lesson','A meal','A song','A nap'],'Clarity.'),
 mc('What does a debrief review?',['What went well and what to improve','Nothing','Prices','Colors'],'Feedback.'),
 mc('How should feedback be?',['Honest and kind','Harsh','Silent','Vague'],'Constructive.'),
 tf('Focus on a few key points after a flight.',true,'Yes.'),
 tf('Skip the debrief if the flight was fun.',false,'Always debrief.'),
 fl('A debrief happens ___ the flight.',['after','before','during only','never'],'After.')]),
L('cf-errors','Teaching from mistakes',[
 cd('Mistakes are data','Student errors show what they don’t yet understand. A good instructor asks why before correcting. Fixing the cause works better than scolding the mistake.'),
 cd('Safety nets','The instructor always watches, ready to take over. Students should feel safe to try. A calm tone helps learning, while fear blocks it.')],
 'Find the cause, keep the student calm.',[
 mc('What do student errors show?',['What they don’t understand yet','That they are bad','Nothing','Weather'],'Learning gaps.'),
 mc('What helps learning?',['A calm tone','Yelling','Silence','Panic'],'Calm.'),
 mc('Who is ready to take over?',['The instructor','The passenger','The tower','Nobody'],'Safety.'),
 tf('Fear blocks learning.',true,'Yes.'),
 tf('Scolding fixes the cause.',false,'Understanding does.'),
 fl('Fix the ___, not just the mistake.',['cause','color','case','coat'],'Cause.')]),
L('cf-signoff','Solo endorsements',[
 cd('Trusting a student','An instructor endorses a student to fly solo only when they are ready. The CFI checks skills, judgment and knowledge. Endorsements are written in the student’s logbook.'),
 cd('Responsibility','Signing a student off carries responsibility. The CFI sets limits, such as wind and weather, for the first solo. The goal is a safe, confident flight.')],
 'No endorsement until the student is ready.',[
 mc('Who endorses a student to solo?',['The CFI','The tower','A passenger','A friend'],'Instructor.'),
 mc('Where is the endorsement written?',['In the logbook','On the wing','In the sky','On a hat'],'Record.'),
 mc('What does the CFI set?',['Limits like wind','Songs','Colors','Names'],'Safe conditions.'),
 tf('The CFI checks skills and judgment.',true,'Yes.'),
 tf('Anyone can endorse a solo.',false,'Only an instructor.'),
 fl('Solo endorsements go in the student’s ___.',['logbook','lunchbox','locker','lap'],'Logbook.')]),
L('cf-spin','Spin training',[
 cd('A required skill','Flight instructor applicants must learn spin entry and recovery. A spin is a stall with yaw, causing a spiral descent. Recovery uses the PARE steps: Power off, Ailerons neutral, Rudder opposite, Elevator forward.'),
 cd('Why teach spins','Understanding spins teaches how to avoid them. Most spins start from a stall with uncoordinated flight. Staying coordinated and avoiding stalls prevents them.')],
 'PARE: Power, Ailerons, Rudder, Elevator.',[
 mc('What does P in PARE mean?',['Power off','Pitch up','Pull','Pedal'],'Reduce power.'),
 mc('What does R in PARE mean?',['Rudder opposite','Roll','Radio','Rest'],'Stop the yaw.'),
 mc('What causes a spin?',['A stall with yaw','Good weather','A radio call','Fuel'],'Uncoordinated stall.'),
 tf('Spin recovery needs forward elevator.',true,'Break the stall.'),
 tf('Spins are common in normal cruise.',false,'They follow stalls.'),
 mt('Match each PARE letter.',[['P','Power off'],['A','Ailerons neutral'],['R','Rudder opposite'],['E','Elevator forward']],'PARE.')]),
L('cf-ground','Ground instruction',[
 cd('Teaching on the ground','Instructors also teach ground school: weather, regulations, navigation and aerodynamics. They use diagrams, models and discussions. Good examples help students remember.'),
 cd('Checking understanding','Instructors ask open questions, such as “What would you do if…?” Real scenarios build judgment. Students should explain things in their own words.')],
 'Ask questions that build judgment.',[
 mc('What does ground school cover?',['Weather, rules, navigation','Cooking','Dance','Painting'],'Knowledge.'),
 mc('What kind of questions help?',['Open scenario questions','Yes/no only','No questions','Silly ones'],'Why and what if.'),
 mc('Why use examples?',['They help memory','They fill time','They are loud','No reason'],'Stories stick.'),
 tf('Students should explain in their own words.',true,'Yes.'),
 tf('Lecture alone is always best.',false,'Mix methods.'),
 fl('“What would you do ___?” is a good question.',['if','but','so','and'],'If.')]),
L('cf-cert','Certificates of instructors',[
 cd('Instructor ratings','A basic CFI can teach airplane students. Additional ratings let instructors teach instrument flying (CFII) or multi-engine airplanes (MEI). Each takes more training and testing.'),
 cd('Renewing','A CFI certificate must be kept up to date with renewal activities every 24 months. Instructors continue learning, since rules and technology change.')],
 'CFI, CFII, MEI: more doors for teachers.',[
 mc('What does CFII add?',['Instrument instruction','Multi-engine','Seaplane','Glider'],'Instrument.'),
 mc('What does MEI add?',['Multi-engine instruction','Mountain flying','Math','Music'],'Twin planes.'),
 mc('How often must a CFI renew?',['Every 24 months','Every day','Every 20 years','Never'],'Two years.'),
 tf('Instructors keep learning.',true,'Yes.'),
 tf('A CFI never needs renewal.',false,'It does.'),
 fl('CFII teaches ___ flying.',['instrument','island','ice','inland'],'Instrument.')])
]);
})();
