/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* STUDENT PILOT 1 - STARTING TRAINING: schools, instructors, airplanes, syllabus, ground school, simulators, costs, medicals, the student certificate, study habits. */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,od,L}=H.dsl;
H.addLessons('start',[
L('st-schools','Choosing a flight school',[
 cd('Two kinds of schools','Under the FAA’s rules, a school can train under Part 61 or Part 141. Part 61 is flexible: the instructor builds your plan around you. Part 141 follows an FAA-approved course with a set outline, and it can need fewer hours.'),
 cd('Visit first','Visit before you sign up. Look at the airplanes, meet the instructors, and ask how often you can fly. A good school is open about costs, safety and how its students do.')],
 'Visit the school, meet the instructors, then decide.',[
 mc('Which kind of school follows an FAA-approved course outline?',['Part 141','Part 21','Part 5','Part 99'],'Part 141 schools teach from an FAA-approved syllabus.'),
 mc('Which describes Part 61 training?',['Flexible, built around the student','Always twice as long','Only for airlines','Only for helicopters'],'Part 61 lets the instructor tailor the plan to the student.'),
 mc('What is smart to do before choosing a school?',['Visit and meet the instructors','Pick the closest sign','Pay for everything up front','Skip the questions'],'Seeing the place and meeting the people helps you choose well.'),
 tf('You can ask a flight school about its costs.',true,'Good schools are open about costs.'),
 tf('All flight schools are exactly the same.',false,'Schools differ in airplanes, instructors, schedules and style.'),
 fl('Part 141 schools follow an FAA-___ course.',['approved','banned','secret','random'],'The FAA approves the syllabus of a Part 141 school.')]),
L('st-cfi','Working with your instructor',[
 cd('A good match','A good instructor is patient, explains clearly, and puts safety first. You learn best from someone you trust. If it is not a good fit, it is fine to ask for a different instructor.'),
 cd('Your part','Show up prepared, ask when you are unsure, and say when something feels too fast. You and your instructor are a team, and the goal is a safe, confident pilot.')],
 'Be prepared, ask questions, speak up.',[
 mc('What makes a good flight instructor?',['Patient, clear, safety-minded','Always in a hurry','Never answers questions','Likes risky stunts'],'Good teaching is patient and clear, with safety first.'),
 mc('What should you do if a lesson moves too fast?',['Say so','Pretend it is fine','Quit flying forever','Stay silent'],'Your instructor can only help if you speak up.'),
 mc('You and your instructor are best described as…',['A team','Rivals','Strangers','Opponents'],'Training works best as teamwork.'),
 tf('It is okay to switch instructors if the fit is poor.',true,'A good fit matters, and good schools understand.'),
 tf('Showing up without studying works just as well.',false,'Preparation makes the lesson count.'),
 fl('A good instructor puts ___ first.',['safety','speed','style','snacks'],'Safety comes first in every flight.')]),
L('st-planes','Training airplanes',[
 cd('Common trainers','Many students learn in small, simple airplanes such as the Cessna 152 and 172, the Piper Cherokee family, or the Diamond DA20 and DA40. They are forgiving, easy to maintain and designed for teaching.'),
 cd('Same lessons, different cockpits','Whether it has two seats or four, steam gauges or a glass screen, every trainer teaches the same skills. When you move to a new type, a short checkout gets you ready.')],
 'The airplane matters less than the lessons.',[
 mc('Which is a common training airplane?',['Cessna 172','Boeing 747','Space shuttle','Concorde'],'The Cessna 172 is one of the most popular trainers ever built.'),
 mc('Why are trainers popular?',['Simple, forgiving and easy to maintain','Very fast','Very noisy','Hard to fly'],'Trainers are designed to teach.'),
 mc('What do you get when you move to a different airplane type?',['A checkout from an instructor','A new name','A free trip','A promotion'],'A checkout is a short lesson to learn a new airplane.'),
 tf('The skills you learn only work in one kind of airplane.',false,'Basic flying skills carry over to other airplanes.'),
 tf('Some trainers have two seats and others have four.',true,'Both are common.'),
 fl('A new-airplane lesson with an instructor is a ___.',['checkout','checkup','checkmate','checkbook'],'A checkout makes sure you are ready for that type.')]),
L('st-syllabus','A lesson from start to finish',[
 cd('Brief, fly, debrief','A normal lesson has three parts. First comes a briefing, where you review the plan. Then you fly. Afterward comes a debrief, where the instructor tells you what went well and what to improve.'),
 cd('A syllabus is a map','A syllabus lists the lessons in order, from the first flight to the final test. It helps you see where you are and what is next, and it keeps training organized.')],
 'Brief it, fly it, debrief it.',[
 mc('What is the correct order of a lesson?',['Brief, fly, debrief','Debrief, fly, brief','Fly, brief, nap','Fly only'],'You plan, you do, you review.'),
 mc('What does a syllabus do?',['Lists the lessons in order','Fuels the airplane','Tells jokes','Washes the airplane'],'It is a roadmap for training.'),
 mc('When does the instructor tell you what to improve?',['In the debrief','Never','During takeoff','Before you arrive'],'The debrief is for feedback.'),
 tf('The briefing happens before the flight.',true,'It sets the plan.'),
 tf('Every lesson is exactly the same.',false,'The syllabus builds from simple to harder.'),
 od('Put a lesson in order.',['Briefing','Preflight','Flight','Debrief'],'Plan, check the airplane, fly, then talk it over.')]),
L('st-ground','Learning on the ground',[
 cd('Ground school','Ground school teaches the knowledge pilots need: rules, weather, navigation, aircraft systems and decision-making. You can learn it in a classroom, an online course, or by studying with your instructor.'),
 cd('Why it matters','The more you know on the ground, the more you can focus on flying. Studying the next lesson before you fly makes you sharper in the airplane and saves time and money.')],
 'What you learn on the ground, you use in the air.',[
 mc('What does ground school teach?',['Rules, weather, navigation and more','Only how to taxi','Only how to cook','Only how to repair engines'],'Ground school covers the knowledge side of flying.'),
 mc('How can you do ground school?',['Classroom, online or with an instructor','Only in a classroom','Only online','Only by guessing'],'There are many ways to learn the same material.'),
 mc('Why study before a flight?',['You can focus better in the air','It is a rule for passengers','It tires you out','It lowers fuel use'],'Prepared students learn faster.'),
 tf('Ground school replaces flying lessons completely.',false,'Pilots need both ground knowledge and flying skills.'),
 tf('Studying ahead can save time and money.',true,'You get more from every flight hour.'),
 fl('Weather, rules and navigation are taught in ___ school.',['ground','night','air','tower'],'Ground school is the classroom side.')]),
L('st-sim','Simulators and training devices',[
 cd('Flying on the ground','A flight simulator copies the cockpit and the feel of flying, but the pilot stays on the ground. Instructors use simulators to practice procedures, radio calls and emergencies with no risk.'),
 cd('Home practice','You can also practice at home with a computer flight simulator. It will not replace real lessons, but it helps you learn the panel, the radio and the checklists between flights.')],
 'A simulator is practice without risk.',[
 mc('What is a flight simulator?',['A device that copies flying on the ground','A real airplane','A kind of radio','A weather chart'],'It lets pilots practice without leaving the ground.'),
 mc('What is a simulator especially good for?',['Practicing procedures and emergencies safely','Replacing every real flight','Speeding up the airplane','Making real fuel'],'Dangerous situations are safe to practice in a sim.'),
 mc('Can a home computer simulator help you learn?',['Yes, for panels and checklists','No, it is harmful','Only for adults','Only in winter'],'It is a helpful extra, not a replacement.'),
 tf('A simulator can be used to practice radio calls.',true,'Radio practice is easy in a sim.'),
 tf('A computer game can replace all real flight training.',false,'Real flying has feel and judgement a game cannot fully teach.'),
 fl('Practicing in a simulator carries no ___.',['risk','cost','sound','light'],'Mistakes in a sim cannot hurt anyone.')]),
L('st-cost','Time and cost',[
 cd('Real commitment','Learning to fly takes time and money. You pay for the airplane, the instructor, fuel, books and tests. Most students pay as they go, a little at a time, and plan carefully so flights stay regular.'),
 cd('Regular beats rare','Flying often, such as two or three times a week, helps you remember what you learned. Long gaps mean you spend time and money re-learning, so a steady schedule is smart.')],
 'Fly regularly, plan ahead, and stay patient.',[
 mc('Which schedule helps you remember best?',['Flying often and regularly','Once every few months','Only on holidays','Only in winter'],'Regular practice builds skill faster.'),
 mc('What do students usually pay for?',['Airplane, instructor, fuel and tests','Only the airplane','Nothing','Only the books'],'Several costs add up during training.'),
 mc('What helps a student manage costs?',['Planning and preparing for each lesson','Skipping weather checks','Buying a jet','Ignoring the schedule'],'Prepared students waste less time.'),
 tf('Training costs real money and time.',true,'It is a serious commitment, and it is worth planning.'),
 tf('Long gaps between lessons have no effect.',false,'Skills fade, so you repeat material.'),
 fl('Long breaks mean you re-___ what you learned.',['learn','burn','return','earn'],'You often have to review what you forgot.')]),
L('st-med','The aviation medical',[
 cd('A health check for pilots','Pilots need to be healthy enough to fly safely. An FAA-approved doctor called an Aviation Medical Examiner, or AME, checks things like vision, hearing and general health before issuing a medical certificate.'),
 cd('Honesty matters','Pilots must answer medical questions honestly. If you have a concern, it is best to talk to an AME early, before you spend a lot on training. Staying healthy is part of being a pilot.')],
 'Be healthy, be honest, and ask an AME early.',[
 mc('What does AME stand for?',['Aviation Medical Examiner','Airplane Maintenance Expert','Air Mail Express','Altitude Measuring Engine'],'An AME is a doctor authorized by the FAA.'),
 mc('Which is checked in an aviation medical?',['Vision and hearing','Shoe size','Favorite song','Hair color'],'Vision and hearing are important for safe flying.'),
 mc('When is it smart to ask an AME about a health concern?',['Early','Never','After your checkride','Only on weekends'],'Finding out early saves surprises.'),
 tf('Pilots must answer medical questions truthfully.',true,'Honesty is required and it keeps flying safe.'),
 tf('A medical certificate is just a library card.',false,'It shows a pilot meets health standards for flying.'),
 fl('The doctor who gives pilot medicals is an ___.',['AME','ATC','APU','AFM'],'AME means Aviation Medical Examiner.')]),
L('st-cert','The student pilot certificate',[
 cd('Your first certificate','Before you fly solo, you need a student pilot certificate from the FAA. Your instructor helps you apply online. To solo an airplane you must be at least 16 years old. For a glider or balloon the age is 14.'),
 cd('Dual and solo','Time with an instructor is called dual instruction. Time flying alone is solo time. Both go in your logbook, and the instructor signs endorsements that say you are ready for each step.')],
 'Sixteen for an airplane solo. Fourteen for a glider or balloon.',[
 mc('How old must you be to solo an airplane?',['16','12','21','30'],'The minimum age to solo an airplane is 16.'),
 mc('How old must you be to solo a glider or balloon?',['14','10','25','40'],'Gliders and balloons allow solo at 14.'),
 mc('What is time with an instructor called?',['Dual instruction','Solo time','Taxi time','Rest time'],'Dual means you fly with an instructor.'),
 tf('The instructor helps you apply for your student certificate.',true,'The application is done with your instructor.'),
 tf('You can solo an airplane at age 10.',false,'The minimum age is 16 for an airplane.'),
 fl('Flying alone is called ___ time.',['solo','team','dual','group'],'Solo means you are the only person aboard.')]),
L('st-study','Study habits for pilots',[
 cd('Chair flying','Chair flying means sitting in a chair and “flying” the lesson in your mind: touching the imaginary controls and saying the checklist and radio calls aloud. It is free, and it works.'),
 cd('Make it stick','Short, regular study beats a big cram. Make flash cards, review what you missed, and explain topics to a friend. When you can teach something, you really know it.')],
 'Short and often beats long and rare.',[
 mc('What is chair flying?',['Practicing a flight in your mind','Flying a chair','A kind of airplane','Sitting in the tower'],'Rehearsing the flight mentally builds skills.'),
 mc('Which study style works better?',['Short sessions, often','One huge night before','No study at all','Only watching'],'Spacing out your study helps memory.'),
 mc('Which is a great way to test what you know?',['Explain it to someone else','Hide the book','Skip the quiz','Guess'],'Teaching shows what you know and what you do not.'),
 tf('Flash cards can help you remember.',true,'Active recall is a strong way to learn.'),
 tf('You should only study the night before a flight.',false,'Regular study works better.'),
 fl('Imagining a flight while sitting still is ___ flying.',['chair','cloud','night','solo'],'Chair flying is a classic pilot practice.')])
]);
})();
