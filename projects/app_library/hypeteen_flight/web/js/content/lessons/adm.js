/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* PRIVATE PILOT 14 - DECISION MAKING AND RISK */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,mt,od,L}=H.dsl;
H.addLessons('adm',[
L('ad-why','Why pilots make decisions',[
 cd('Judgment is a skill','Most flying accidents involve human choices more than broken parts. Good judgment can be learned. Aeronautical decision making, or ADM, is a way of thinking that helps pilots pick the safest option.'),
 cd('Start early','Good decisions begin before the engine starts. Plan, check weather, check yourself and set personal limits. When trouble arrives, pilots with a plan can act faster and with a clearer head.')],
 'Good decisions start on the ground.',[
 mc('What is ADM?',['Aeronautical decision making','Air data monitor','Altitude diagram map','Auto drive mode'],'A thinking skill.'),
 mc('Most accidents involve…',['Human choices','Rainbows','Birds only','Magic'],'Decisions matter.'),
 mc('When do good decisions begin?',['Before the engine starts','At landing','Never','Next year'],'Plan ahead.'),
 tf('Judgment can be learned.',true,'Yes.'),
 tf('Only broken parts cause accidents.',false,'People matter most.'),
 fl('Make a plan ___ the flight.',['before','after','never','during only'],'Before.')]),
L('ad-pave','The PAVE checklist',[
 cd('Four risk areas','PAVE helps pilots look for risk before a flight. P is Pilot, A is Aircraft, V is enVironment, E is External pressures. Check each one to see if the flight is safe.'),
 cd('Using it','Under Pilot, use IMSAFE. Under Aircraft, ask about maintenance, fuel and equipment. Under enVironment, consider weather, terrain and airspace. Under External pressures, ask whether any pressure is pushing you to fly.')],
 'P-A-V-E: Pilot, Aircraft, enVironment, External pressures.',[
 mc('What does the P in PAVE stand for?',['Pilot','Plane','Power','Pitch'],'Pilot.'),
 mc('What does the E stand for?',['External pressures','Engine','Energy','Elevator'],'Pressures.'),
 mc('Which area includes weather?',['enVironment','Pilot','Aircraft','External'],'V.'),
 tf('PAVE is used before a flight.',true,'Yes.'),
 tf('Pressure to be on time is irrelevant.',false,'It matters.'),
 mt('Match each letter to its idea.',[['P','Pilot'],['A','Aircraft'],['V','enVironment'],['E','External pressures']],'PAVE.')]),
L('ad-imsafe','Personal minimums',[
 cd('Your own rules','Personal minimums are limits you set for yourself, such as minimum cloud height, visibility and wind. They are often stricter than the law. Write them down before you fly, when you are calm.'),
 cd('Stick to them','It is easy to bend rules when you want to go. Setting limits in advance keeps you from bargaining with yourself. As experience grows, you can adjust them slowly, with an instructor’s advice.')],
 'Write limits down before you want to break them.',[
 mc('What are personal minimums?',['Your own safety limits','Legal limits only','Fuel prices','Passenger counts'],'Self-set rules.'),
 mc('When do you set them?',['Before you fly, when calm','In flight','Never','After an accident'],'Plan ahead.'),
 mc('Who can help you adjust them?',['An instructor','A stranger','Nobody','A kite'],'Get advice.'),
 tf('Personal minimums can be stricter than the law.',true,'Yes.'),
 tf('It is fine to change them mid-flight when in a hurry.',false,'That defeats the point.'),
 fl('Write down your personal ___.',['minimums','snacks','songs','jokes'],'Minimums.')]),
L('ad-haz','Hazardous attitudes',[
 cd('Five attitudes','Pilots can fall into five dangerous thinking patterns: Anti-authority (“Don’t tell me”), Impulsivity (“Do something fast”), Invulnerability (“It won’t happen to me”), Macho (“I can do it”), and Resignation (“What’s the use?”).'),
 cd('Antidotes','Each has an antidote. For anti-authority: follow the rules. For impulsivity: not so fast, think first. For invulnerability: it could happen to me. For macho: taking chances is foolish. For resignation: I’m not helpless.')],
 'Spot the attitude, then say the antidote.',[
 mc('“It won’t happen to me” is…',['Invulnerability','Impulsivity','Resignation','Authority'],'Invulnerable.'),
 mc('The antidote for impulsivity is…',['Not so fast, think first','Go faster','Give up','Show off'],'Slow down.'),
 mc('“What’s the use?” is…',['Resignation','Macho','Impulsivity','Authority'],'Giving up.'),
 tf('Rules exist for a reason.',true,'Antidote to anti-authority.'),
 tf('Taking chances is a sign of skill.',false,'Taking chances is foolish.'),
 mt('Match the attitude to its phrase.',[['Macho','I can do it'],['Impulsive','Do something quick'],['Resigned','What’s the use?']],'Hazardous attitudes.')]),
L('ad-3p','The 3P model',[
 cd('Perceive, Process, Perform','The 3P model has three steps. Perceive the situation and what could go wrong. Process it by thinking about how big the risk is. Perform by choosing an action and then checking the result.'),
 cd('Loop it','After you act, perceive again. The loop continues through the flight. A pilot who keeps cycling through 3P adapts as conditions change, rather than holding to a plan that no longer fits.')],
 'See it, think it, do it, then check.',[
 mc('What is the first P?',['Perceive','Perform','Process','Plan'],'Perceive.'),
 mc('What happens in Process?',['Judge the risk','Land','Pack','Eat'],'Think it through.'),
 mc('What do you do after Perform?',['Check the result and perceive again','Stop','Sleep','Ignore'],'Loop.'),
 tf('3P is a repeating loop.',true,'Yes.'),
 tf('You decide once and never change.',false,'Adapt.'),
 od('Put 3P in order.',['Perceive','Process','Perform'],'In order.')]),
L('ad-pressure','External pressures',[
 cd('Pressure to go','Passengers, deadlines and events can push a pilot to fly when conditions are poor. This is called get-there-itis. It has led to many accidents. The plan should always allow for delay or cancellation.'),
 cd('Brave to cancel','Telling friends the flight might be delayed is a mature move. Have a backup plan, like a car or airline. A pilot is never a coward for staying on the ground. Safety comes first.')],
 'Plan for a no-go before the trip.',[
 mc('What is get-there-itis?',['Pressure to complete a trip no matter what','A disease','A game','A radio call'],'Rushing.'),
 mc('Which is a good habit?',['Have a backup plan','Promise to be on time','Hide problems','Ignore weather'],'Be ready to cancel.'),
 mc('Who benefits when a pilot cancels a risky flight?',['Everyone','No one','Only the tower','Only the pilot'],'Safety.'),
 tf('Canceling can be the right choice.',true,'Yes.'),
 tf('Passengers should decide whether to fly in bad weather.',false,'The pilot decides.'),
 fl('Always keep a ___ plan.',['backup','secret','silly','sleepy'],'Backup.')]),
L('ad-cfit','Risk matrix and 5 Ps',[
 cd('Likelihood and severity','A risk matrix compares how likely a problem is with how bad it would be. A rare problem with small effect is low risk. A likely problem with big effects is high risk. Reduce either one, or don’t go.'),
 cd('The five Ps','Another check is the 5 Ps: Plan, Plane, Pilot, Passengers, Programming. Look at each before a flight and during it. A weakness in any one can change the plan.')],
 'Lower the risk or stay home.',[
 mc('What two things does a risk matrix compare?',['Likelihood and severity','Speed and color','Price and weight','Time and fuel'],'How often and how bad.'),
 mc('What do you do about high risk?',['Reduce it or don’t go','Ignore it','Fly faster','Hope'],'Mitigate.'),
 mc('Which is one of the 5 Ps?',['Passengers','Pizza','Paint','Pillow'],'Passengers.'),
 tf('Rare and minor means low risk.',true,'Yes.'),
 tf('Likely and severe is low risk.',false,'It is high risk.'),
 fl('Likelihood and ___ define risk.',['severity','color','taste','weight'],'Severity.')]),
L('ad-crm','Resource management',[
 cd('Use every resource','Resources include people, equipment and information. Pilots use checklists, autopilot, charts, radio and ATC. Use a passenger to help watch for traffic. Ask for help when needed.'),
 cd('Task management','When busy, prioritize: aviate first, navigate second, communicate third. Don’t get stuck on one task. Delegate and slow down when workload rises. Good management keeps the airplane the first priority.')],
 'Aviate, navigate, communicate.',[
 mc('What is the first priority?',['Aviate','Navigate','Communicate','Snack'],'Fly the airplane.'),
 mc('Which is a resource?',['ATC','A song','A joke','A hat'],'People and tools.'),
 mc('What if workload is too high?',['Prioritize and slow down','Panic','Quit','Shout'],'Manage tasks.'),
 tf('Passengers can help watch for traffic.',true,'Yes.'),
 tf('Asking for help is a weakness.',false,'It is smart.'),
 od('Put the priorities in order.',['Aviate','Navigate','Communicate'],'A-N-C.')]),
L('ad-sa','Situational awareness',[
 cd('Know where you are','Situational awareness means knowing what is happening around you: position, altitude, weather, traffic, fuel, and what the airplane is doing. Losing it leads to mistakes.'),
 cd('Keep it','Check the map often. Listen to the radio. Look outside. Ask what changed. If you feel behind, slow the plan down or ask ATC for help. Tell yourself the picture out loud.')],
 'Always ask: where am I and what comes next?',[
 mc('What is situational awareness?',['Knowing what is happening around you','A game','A radio','A prize'],'Mental picture.'),
 mc('What helps?',['Checking the map often','Closing your eyes','Ignoring radio','Guessing'],'Stay engaged.'),
 mc('If you feel behind…',['Slow things down','Hurry','Hide','Quit'],'Reset.'),
 tf('Losing awareness leads to mistakes.',true,'Yes.'),
 tf('Fuel is not part of awareness.',false,'It is.'),
 fl('Know where you are and what comes ___.',['next','before','back','never'],'Next.')]),
L('ad-debrief','Learning from every flight',[
 cd('After the flight','Good pilots debrief. They ask what went well, what surprised them and what to do differently. Even a safe flight offers lessons. Write notes in a logbook.'),
 cd('Share lessons','Safety reports and stories from other pilots teach more than any one person can learn alone. Talk with instructors. Use accident reports to learn from others. A pilot who keeps learning stays safer.')],
 'Every flight teaches something.',[
 mc('What do pilots do in a debrief?',['Review the flight afterward','Start the engine','Pack the airplane','Park the airplane'],'Look back to learn.'),
 mc('Why read accident reports?',['To learn from others','To be scared','For fun','No reason'],'Share lessons.'),
 mc('Where can you keep notes?',['In a logbook','On the wing','On the radio','In the tank'],'Log it.'),
 tf('Even safe flights teach lessons.',true,'Yes.'),
 tf('Only bad flights need review.',false,'All do.'),
 fl('A pilot who keeps ___ stays safer.',['learning','guessing','hiding','resting'],'Learning.')])
]);
})();
