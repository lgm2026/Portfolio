/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* BEYOND 12 - MASTER PILOT */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,od,L}=H.dsl;
H.addLessons('master',[
L('ms-humble','Humility',[
 cd('The best keep learning','The best pilots stay humble. They know no one has seen it all. They ask questions, admit mistakes and welcome feedback. Humility keeps the learning going for a whole career.'),
 cd('Learning from others','Great pilots read accident reports, talk with other pilots and learn from mistakes that are not their own. They know that shared knowledge saves lives.')],
 'Humble pilots keep learning.',[
 mc('What do the best pilots do?',['Keep learning','Stop studying','Brag','Hide mistakes'],'Humble.'),
 mc('How do they learn from others?',['Read reports and talk','Ignore them','Guess','Skip'],'Shared knowledge.'),
 mc('What does humility keep going?',['Learning','Noise','Speed','Fuel'],'Growth.'),
 tf('Admitting mistakes is a strength.',true,'Yes.'),
 tf('Great pilots know everything.',false,'No one does.'),
 fl('Humble pilots welcome ___.',['feedback','flattery','fights','fads'],'Feedback.')]),
L('ms-prep','Preparation',[
 cd('Most flights are won on the ground','Master pilots prepare thoroughly: weather, route, airplane, fuel and alternates. They brief themselves before every flight, as if teaching someone else.'),
 cd('Plan B','They always have a backup plan. They think, “If this goes wrong, I will…” This habit makes surprises far easier to handle.')],
 'Always have a Plan B.',[
 mc('When does good flying start?',['On the ground, with preparation','After takeoff','At landing','Never'],'Plan.'),
 mc('What do masters always have?',['A backup plan','A secret','A shortcut','A nap'],'Plan B.'),
 mc('How do they brief themselves?',['As if teaching someone','Not at all','Quickly','Randomly'],'Thorough.'),
 tf('Surprises are easier with a backup plan.',true,'Yes.'),
 tf('Preparation is a waste of time.',false,'It is essential.'),
 fl('If this goes wrong, I will ___.',['divert','dance','doze','dive'],'Have a plan.')]),
L('ms-checks','Discipline with checklists',[
 cd('Never skip them','The best pilots use checklists every time, even on a routine flight. They know the most dangerous moment is when they feel too comfortable.'),
 cd('Routine saves lives','Checklists catch missing steps that memory forgets. Even astronauts and airline captains with thousands of hours use them.')],
 'Experts use checklists too.',[
 mc('Who uses checklists?',['Even experts','Only beginners','Nobody','Only students'],'Everyone.'),
 mc('When are checklists skipped?',['Never','On easy days','At night','On weekends'],'Always use them.'),
 mc('What do they catch?',['Missed steps','Fish','Rain','Ghosts'],'Memory slips.'),
 tf('Feeling too comfortable can be risky.',true,'Yes.'),
 tf('Checklists are for beginners only.',false,'All pilots use them.'),
 fl('Checklists catch missed ___.',['steps','sunsets','snacks','songs'],'Steps.')]),
L('ms-stay','Staying ahead of the airplane',[
 cd('Think ahead','Masters think a few steps ahead. They ask, “What is next? What could change?” They set up for the approach early and brief each phase before it starts.'),
 cd('Never behind','If you feel behind the airplane, slow down: reduce speed, simplify tasks, ask for help or hold. Catching up is a calm, deliberate act, not a rush.')],
 'Stay ahead; if behind, slow down.',[
 mc('What do masters ask?',['What is next?','What is for lunch?','Who is watching?','Why me?'],'Think ahead.'),
 mc('If you feel behind…',['Slow down and simplify','Rush','Panic','Quit'],'Reset.'),
 mc('When do they set up the approach?',['Early','At the last second','Never','After landing'],'Prepared.'),
 tf('Briefing each phase helps.',true,'Yes.'),
 tf('Hurrying fixes being behind.',false,'It makes it worse.'),
 fl('Stay ___ of the airplane.',['ahead','below','behind','beside'],'Ahead.')]),
L('ms-fly','Hand-flying skill',[
 cd('Stick and rudder','Master pilots keep their basic skills sharp. They practice stalls, slow flight, crosswind landings and emergency procedures. Strong basics make advanced flying easier.'),
 cd('Smoothness','Smooth control inputs are a sign of skill. Great pilots plan their movements, keep the airplane trimmed and make small corrections early.')],
 'Smooth is fast; basics are everything.',[
 mc('What do masters practice?',['The basics','Only tricks','Nothing','Only talking'],'Strong foundation.'),
 mc('What shows skill?',['Smooth inputs','Big jerks','Noise','Speed'],'Finesse.'),
 mc('When do they correct?',['Early and small','Late and big','Never','At random'],'Smooth.'),
 tf('Basics make advanced flying easier.',true,'Yes.'),
 tf('Trim is unimportant.',false,'It helps smooth flight.'),
 fl('Great pilots keep the airplane ___.',['trimmed','tangled','tired','tilted'],'Trimmed.')]),
L('ms-comm','Clear communication',[
 cd('Say it clearly','Master pilots speak with clarity and confidence, on the radio and with passengers. They use standard phrases, listen carefully and read back instructions.'),
 cd('Ask when unsure','If something is unclear, they say “Say again” or “Unable.” There is no shame in asking. Misunderstandings cause errors, and clarity prevents them.')],
 'When in doubt, ask.',[
 mc('What do masters say when unsure?',['Say again','Nothing','Yes','Maybe'],'Clarify.'),
 mc('What is a read-back?',['Repeating instructions','Reading a book','Silence','A song'],'Confirm.'),
 mc('Why use standard phrases?',['Clarity','Fun','Speed only','Mystery'],'Fewer errors.'),
 tf('Asking questions is smart.',true,'Yes.'),
 tf('Guessing is better than asking.',false,'Ask.'),
 fl('“Say ___” asks for a repeat.',['again','later','never','less'],'Again.')]),
L('ms-limits','Knowing your limits',[
 cd('Honest self-assessment','Master pilots know what they can and cannot do. They set personal limits and respect them. They know that skill, experience and conditions all matter.'),
 cd('Strength to say no','Sometimes the best flying decision is not to fly. Masters cancel, delay or divert without hesitation when the risk is too high.')],
 'Saying no can be the master move.',[
 mc('What do masters respect?',['Their limits','Nothing','Only speed','Luck'],'Wise.'),
 mc('Sometimes the best decision is…',['Not to fly','Always to fly','To guess','To hurry'],'No-go.'),
 mc('What do they do when risk is high?',['Cancel, delay or divert','Press on','Hide','Quit'],'Act early.'),
 tf('Skill, experience and conditions all matter.',true,'Yes.'),
 tf('Saying no is a sign of weakness.',false,'It is wisdom.'),
 fl('Respect your personal ___.',['limits','lunch','luck','lights'],'Limits.')]),
L('ms-calm','Staying calm',[
 cd('Calm under pressure','When something goes wrong, masters stay calm. They fly the airplane first, think clearly and follow their training. A calm pilot makes better decisions.'),
 cd('Practice calm','They practice emergencies often so responses feel natural. Deep breaths, simple steps and teamwork help. Calm is a skill that can be learned.')],
 'Calm is a trained skill.',[
 mc('What is the first step in trouble?',['Fly the airplane','Panic','Call a friend','Quit'],'Aviate.'),
 mc('How is calm built?',['Practice','Luck','Silence','Hurry'],'Training.'),
 mc('What helps?',['Deep breaths and simple steps','Yelling','Guessing','Giving up'],'Steady.'),
 tf('Calm pilots decide better.',true,'Yes.'),
 tf('Calm cannot be learned.',false,'It can.'),
 fl('Calm is a ___ that can be practiced.',['skill','secret','story','shirt'],'Skill.')]),
L('ms-team','Respecting the team',[
 cd('No pilot flies alone','Even a solo pilot relies on mechanics, controllers, dispatchers and others. Masters say thank you, listen to the ground crew and treat everyone with respect.'),
 cd('Leadership','A great captain makes everyone feel safe to speak up. Leaders give credit, share blame and set a tone of professionalism.')],
 'Great pilots are great teammates.',[
 mc('Who does a solo pilot rely on?',['Many people','Nobody','Only birds','Only stars'],'The team.'),
 mc('What does a great captain do?',['Makes others feel safe to speak up','Stays silent','Yells','Hides'],'Leadership.'),
 mc('What should pilots say to ground crew?',['Thank you','Hurry','Nothing','Go away'],'Respect.'),
 tf('Leaders give credit.',true,'Yes.'),
 tf('Masters ignore the ground crew.',false,'They respect them.'),
 fl('No pilot flies ___.',['alone','away','along','around'],'Alone.')]),
L('ms-give','Giving back',[
 cd('Pass it on','Master pilots mentor others. They share knowledge, volunteer for youth programs and support aviation in their communities. Teaching others is a way to say thanks.'),
 cd('Join in','Groups like the Experimental Aircraft Association (EAA), Civil Air Patrol and local flying clubs offer ways to learn and give back. Young people are welcomed.')],
 'Share what you learn.',[
 mc('What do master pilots do for others?',['Mentor and share','Hide knowledge','Compete only','Quit'],'Give back.'),
 mc('Which group offers youth programs?',['EAA','Chess Club','Garden Club','Book Club'],'Aviation group.'),
 mc('Why teach others?',['A way to say thanks','To waste time','For nothing','For noise'],'Pay it forward.'),
 tf('Young people are welcome in many aviation groups.',true,'Yes.'),
 tf('Masters keep knowledge secret.',false,'They share.'),
 fl('Pilots should ___ it forward.',['pay','pull','push','paint'],'Pay.')]),
L('ms-path','Your flight path',[
 cd('From first look to the top','You can start with a discovery flight, train for a student certificate, earn a private pilot certificate, then add instrument, commercial and ATP ratings. At every step, learning and safety come first.'),
 cd('The master habits','Be humble, prepare, follow checklists, stay ahead, keep skills sharp, communicate clearly, know your limits, stay calm and respect your team. These habits make a great pilot at any level.')],
 'Discovery to master: one step at a time.',[
 mc('What is the first step?',['A discovery flight','An airline job','A type rating','A parachute'],'Start.'),
 mc('Which certificate comes after student?',['Private','ATP','Moon','Boat'],'Next.'),
 mc('What comes first at every step?',['Safety and learning','Speed','Status','Luck'],'Priorities.'),
 tf('Great habits help at any level.',true,'Yes.'),
 tf('You can skip the basics.',false,'Never.'),
 od('Put the path in order.',['Discovery flight','Private pilot','Commercial','Airline Transport Pilot'],'Climb the ladder.')])
]);
})();
