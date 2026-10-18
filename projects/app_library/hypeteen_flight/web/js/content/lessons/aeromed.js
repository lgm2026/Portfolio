/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* PRIVATE PILOT 13 - AEROMEDICAL FACTORS */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,od,L}=H.dsl;
H.addLessons('aeromed',[
L('am-fit','Fit to fly',[
 cd('The IMSAFE check','Before every flight, a pilot checks themselves: Illness, Medication, Stress, Alcohol, Fatigue, Emotion. If any of these is a problem, don’t fly. You are part of the aircraft’s safety system.'),
 cd('Honest self-check','Pilots must be honest with themselves. A cold, a poor night’s sleep or a bad day can slow your thinking. Skipping a flight is a good decision, and a safe pilot makes it without shame.')],
 'IMSAFE: check yourself like you check the airplane.',[
 mc('What does the S in IMSAFE stand for?',['Stress','Speed','Sky','Sound'],'Stress.'),
 mc('What does the F stand for?',['Fatigue','Fuel','Flaps','Flight'],'Fatigue.'),
 mc('If you feel sick before a flight…',['Don’t fly','Fly anyway','Fly faster','Ignore it'],'Stay on the ground.'),
 tf('Pilots should check themselves before flying.',true,'IMSAFE.'),
 tf('Skipping a flight when unfit is a bad decision.',false,'It is a good one.'),
 od('Put the IMSAFE first three in order.',['Illness','Medication','Stress'],'I, M, S.')]),
L('am-hyp','Hypoxia',[
 cd('Not enough oxygen','Hypoxia means the body does not get enough oxygen. At higher altitudes the air is thinner, so there is less oxygen with each breath. Signs include headache, dizziness, tingling, blue lips and poor judgment, and the pilot may not notice.'),
 cd('Preventing it','Fly lower, or use supplemental oxygen. Rules require oxygen for the crew above 12,500 feet MSL after 30 minutes, and always above 14,000 feet. If symptoms start, descend to a lower altitude right away.')],
 'Feel odd up high? Go down.',[
 mc('What is hypoxia?',['Too little oxygen to the body','Too much sleep','Fear of heights','A cold'],'Oxygen shortage.'),
 mc('What should you do if symptoms start?',['Descend','Climb','Sleep','Ignore'],'Lower altitude.'),
 mc('Above what altitude is oxygen always required for the crew?',['14,000 feet','1,000 feet','5,000 feet','100 feet'],'14,000 MSL.'),
 tf('Hypoxia can cause poor judgment.',true,'And you may not notice.'),
 tf('Thin air has more oxygen per breath.',false,'It has less.'),
 fl('Fly lower or use ___ oxygen.',['supplemental','extra','free','spare'],'Supplemental.')]),
L('am-hyper','Hyperventilation',[
 cd('Too much breathing','Hyperventilation is breathing too fast or too deeply, often from stress or fear. It lowers carbon dioxide in the blood and causes dizziness, tingling and a feeling of unreality. It looks a lot like hypoxia.'),
 cd('Slow it down','Slow your breathing on purpose. Talk aloud or count, or breathe into a bag. Calm down and use your checklist. If you are not sure which problem you have, descend and consider oxygen.')],
 'Breathe slowly and talk it out.',[
 mc('What causes hyperventilation?',['Breathing too fast','Breathing too slow','Sleeping','Eating'],'Overbreathing.'),
 mc('What helps?',['Slow your breathing','Breathe faster','Hold on','Yell'],'Calm down.'),
 mc('What is similar to hyperventilation?',['Hypoxia','A sneeze','A smile','A joke'],'Similar symptoms.'),
 tf('Stress can trigger hyperventilation.',true,'Yes.'),
 tf('Hyperventilation raises carbon dioxide in the blood.',false,'It lowers carbon dioxide.'),
 fl('Slow your ___ to fix it.',['breathing','speed','radio','fuel'],'Breathing.')]),
L('am-co','Carbon monoxide',[
 cd('Silent danger','Carbon monoxide, or CO, is a gas you cannot see or smell. It can leak from a damaged exhaust into the cabin heater. It blocks oxygen in the blood. Signs include headache, drowsiness and dizziness.'),
 cd('Protect yourself','Install a CO detector in the cockpit. If you suspect CO, shut off the heater, open fresh-air vents, and land as soon as possible. Do not smoke and avoid flying when you have a bad cold, which can also reduce oxygen.')],
 'No smell, no sight: use a detector.',[
 mc('What is CO?',['Carbon monoxide','Cold oxygen','Cloud overhead','Cabin order'],'A gas.'),
 mc('Where might it come from?',['A damaged exhaust','The wing','The tire','The radio'],'Heater leaks.'),
 mc('What should you do if you suspect CO?',['Open fresh air and land','Close vents','Climb','Nap'],'Get fresh air.'),
 tf('You can smell carbon monoxide.',false,'You cannot.'),
 tf('A CO detector is a good idea.',true,'Cheap protection.'),
 fl('CO stands for carbon ___.',['monoxide','moist','mass','metal'],'Monoxide.')]),
L('am-ear','Ears and spatial disorientation',[
 cd('Inner ear tricks','The inner ear senses motion and balance. In clouds or at night, it can fool you. A gentle turn may feel like straight flight. Spatial disorientation is losing track of your attitude and position.'),
 cd('Trust the panel','The cure is to trust the instruments, not your body. Keep the attitude indicator in your scan. Avoid sharp head movements in turns, which can cause confusing signals. Pilots without instrument training should avoid clouds.')],
 'Your body can lie; the instruments don’t.',[
 mc('What is spatial disorientation?',['Losing track of attitude','Being lost on a map','Fear of heights','Hunger'],'Confusion.'),
 mc('What should you trust?',['The instruments','Your feelings','The seat','Luck'],'Instruments.'),
 mc('Which part of the body senses balance?',['The inner ear','The knee','The elbow','The nose'],'Vestibular system.'),
 tf('A gentle turn can feel like level flight.',true,'Yes.'),
 tf('Feelings are always right.',false,'They can be wrong.'),
 fl('Trust your ___ in clouds.',['instruments','hunch','ears','luck'],'Instruments.')]),
L('am-motion','Motion sickness',[
 cd('Feeling queasy','Motion sickness comes from a mismatch between what your eyes and ears sense. Bumpy air can trigger it. Signs include nausea, sweating and dizziness. It can distract a pilot or passenger.'),
 cd('What helps','Fresh air, looking at the horizon, and a calm approach help. Avoid heavy meals before flying. Pilots should not take medicine for motion sickness without approval, since many cause drowsiness. Landing may be the best answer.')],
 'Fresh air and horizon, and land if needed.',[
 mc('What helps motion sickness?',['Fresh air and looking at the horizon','Looking down','Reading','Spinning'],'Calm the senses.'),
 mc('What is a risk of motion sickness medicine?',['Drowsiness','Speed','Tall','Loud'],'Side effects.'),
 mc('What triggers it?',['Mixed signals from eyes and ears','Sunlight','Water','Radio'],'Mismatch.'),
 tf('Heavy meals can make it worse.',true,'Eat light.'),
 tf('A sick pilot is fine to keep flying.',false,'Land if needed.'),
 fl('Fresh ___ can help.',['air','paint','ink','sand'],'Air.')]),
L('am-alc','Alcohol and drugs',[
 cd('Bottle to throttle','Federal rules say no alcohol within 8 hours before flying. Blood alcohol must be below 0.04 percent. Many pilots wait longer. Alcohol hurts judgment and balance, and effects last longer than most people expect.'),
 cd('Medicines','Even over-the-counter medicines such as cold pills can make you drowsy. Ask your doctor or an aviation medical examiner before flying on any medicine. If you are not sure, don’t fly.')],
 'Eight hours bottle to throttle, and check medicines.',[
 mc('How many hours before flying is alcohol not allowed?',['8','1','2','0'],'Eight.'),
 mc('Who should you ask about a medicine?',['A doctor or aviation medical examiner','A friend','The tower','No one'],'Get medical advice.'),
 mc('What do cold pills sometimes cause?',['Drowsiness','Speed','Height','Color'],'Side effects.'),
 tf('Alcohol affects judgment for longer than you think.',true,'Yes.'),
 tf('Over-the-counter medicines are always safe for pilots.',false,'Check first.'),
 fl('The rule is eight hours bottle to ___.',['throttle','table','tire','tower'],'Throttle.')]),
L('am-fat','Fatigue and stress',[
 cd('Tired minds','Fatigue slows reaction time, narrows attention and harms memory. Sleep, rest and good food keep you sharp. Skipping rest to meet a schedule is a bad trade.'),
 cd('Stress','Stress from work, school or worries can cause errors in the cockpit. Good habits, such as a checklist and a plan, ease stress. If you are overloaded, delay the flight.')],
 'Rest and a calm mind are safety equipment.',[
 mc('What does fatigue do?',['Slows reaction time','Speeds you up','Adds power','Adds fuel'],'Tired minds slip.'),
 mc('What eases cockpit stress?',['Checklists and planning','Hurrying','Guessing','Skipping steps'],'Good habits.'),
 mc('What if you are overloaded?',['Delay the flight','Rush','Ignore it','Fly faster'],'Wait.'),
 tf('Sleep is part of flight safety.',true,'Yes.'),
 tf('Fatigue only affects the body, not the mind.',false,'It affects both.'),
 fl('Fatigue slows ___ time.',['reaction','flight','fuel','radio'],'Reaction.')]),
L('am-vis','Vision and scanning',[
 cd('See and avoid','Pilots must look outside for other traffic. Use short, overlapping scans from side to side and up and down. A small, steady spot on the windshield may be an airplane on a collision course.'),
 cd('Blind spots','Every eye has a blind spot. Wings, pillars and the nose can hide traffic. Move your head, make gentle turns to check below and above, and use sunglasses that cut glare without hiding colors.')],
 'Scan, don’t stare.',[
 mc('What is a motionless spot in the window?',['Possibly traffic on a collision course','A bird bath','A sticker','A rainbow'],'Constant bearing.'),
 mc('How should you scan?',['In short, overlapping sections','Stare straight','Close eyes','Look down'],'Section by section.'),
 mc('What can hide traffic?',['Wings and pillars','Radios','Seats','Tires'],'Blocked views.'),
 tf('Move your head to see around blind spots.',true,'Yes.'),
 tf('A pilot should stare at one point.',false,'Keep scanning.'),
 fl('See and ___ is a pilot duty.',['avoid','wave','sing','dream'],'See and avoid.')]),
L('am-dec','Scuba and flying',[
 cd('Pressure changes','Scuba diving adds nitrogen to the body. Flying too soon afterward can cause decompression sickness, or the bends, as the lower pressure lets bubbles form. It can cause pain and serious harm.'),
 cd('Wait times','The usual guidance is to wait at least 12 hours after a dive that did not need decompression stops and 24 hours after a dive with stops or multiple dives. Check the current guidance and be conservative.')],
 'After diving, wait before flying.',[
 mc('What is decompression sickness?',['Bubbles in the body from pressure change','A cold','Air sickness','A headache only'],'The bends.'),
 mc('How long is the minimum wait after a simple dive?',['12 hours','10 minutes','1 hour','No wait'],'At least 12.'),
 mc('Longer wait after…',['Multiple dives','Walking','Eating','Sleeping'],'24 hours.'),
 tf('Lower pressure aloft can release bubbles.',true,'Yes.'),
 tf('You can fly right after scuba diving.',false,'Wait.'),
 fl('Another name for decompression sickness is the ___.',['bends','blues','bumps','bites'],'The bends.')])
]);
})();
