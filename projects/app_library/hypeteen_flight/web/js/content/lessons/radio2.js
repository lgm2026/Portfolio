/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* STUDENT PILOT 9 - RADIO IN DEPTH: frequencies, call structure, numbers, readbacks, towered departures, flight following, lost comms, distress. */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,od,L}=H.dsl;
H.addLessons('radio2',[
L('rad-freq','Frequencies and the air band',[
 cd('The air band','Pilots talk on VHF radio frequencies between about 118 and 137 MHz. Each controller or airport uses its own frequency, like a channel. Tune the right one and you hear the right people.'),
 cd('Special frequencies','121.5 is the emergency frequency that controllers and many aircraft monitor. 122.8 is a common traffic and UNICOM frequency at many small airports. 122.75 is used by private pilots to talk to each other in the air.')],
 'Right channel, right people.',[
 mc('What is the international emergency frequency?',['121.5','122.8','118.0','123.45'],'121.5 is the emergency “guard” frequency.'),
 mc('What do pilots use to talk to each other and controllers?',['VHF radio','Cell phones','Text messages','Smoke signals'],'VHF air-band radios are used worldwide.'),
 mc('How is a frequency like a channel?',['Only people tuned to it hear you','Everyone hears everything','It is private to one person','It never changes'],'Each frequency is shared by those tuned to it.'),
 tf('Different controllers use different frequencies.',true,'Each job has its own channel.'),
 tf('Everyone listens on all frequencies at once.',false,'You hear only what you tune.'),
 fl('The emergency frequency is ___ megahertz.',['121.5','111.1','133.3','150.0'],'121.5 MHz is the emergency frequency.')]),
L('rad-call','The shape of a radio call',[
 cd('Four parts','A good call has four parts: who you are calling, who you are, where you are, and what you want. For example, “Hometown Tower, Cessna 345 Alfa Bravo, ten miles north with Information Delta, inbound to land.”'),
 cd('Think first','Before pressing the button, listen to be sure the frequency is clear, then think about what you will say. A short, clear message takes less time and makes fewer mistakes.')],
 'Listen, think, key the mic, speak.',[
 mc('What is the first part of a radio call?',['Who you are calling','Your age','Your snack','The fuel level'],'Name the person you want to talk to.'),
 mc('What should you do before keying the microphone?',['Listen for a clear frequency','Sing','Turn off the radio','Shout'],'Don’t step on other calls.'),
 mc('Why keep calls short?',['It saves airtime and avoids mistakes','It is required to rhyme','It saves fuel','It sounds fancy'],'A short call is easier to understand.'),
 tf('Where you are belongs in your call.',true,'Position helps the controller find you.'),
 tf('You should start talking before listening.',false,'Listen first.'),
 od('Put the call parts in order.',['Who you call','Who you are','Where you are','What you want'],'This pattern makes sense every time.')]),
L('rad-num','Saying numbers on the radio',[
 cd('Special pronunciations','Some numbers are said differently so they cannot be mistaken in static. Three is “tree,” five is “fife,” and nine is “niner.” Pilots say each digit of a heading or radio frequency separately.'),
 cd('Altitudes and headings','Altitudes are said as thousands and hundreds: 2,500 feet is “two thousand five hundred.” A heading is three digits: 090 is “zero niner zero.” A frequency like 122.8 is “one two two point eight.”')],
 'Tree, fife, niner. One digit at a time.',[
 mc('How is nine spoken on the radio?',['Niner','Nine','Neener','Nein'],'Niner avoids confusion with the German word nein.'),
 mc('How do you say 3 on the radio?',['Tree','Three','Free','Tri'],'“Tree” is the standard pronunciation.'),
 mc('How is a 090 heading spoken?',['Zero niner zero','Ninety','Nine-oh','Nought nine'],'Each digit is spoken.'),
 tf('Altitudes are said in thousands and hundreds.',true,'2,500 is two thousand five hundred.'),
 tf('You say 122.8 as “one-twenty-two point eight.”',false,'Say each digit: one two two point eight.'),
 fl('Five on the radio is said ___.',['fife','five','fiver','fivey'],'Fife helps the digit stay clear.')]),
L('rad-sign','Call signs',[
 cd('Tail numbers','Airplanes in the United States have an N-number on the tail, such as N345AB. On the radio, pilots say the type or manufacturer and the last numbers and letters, like “Cessna Three Four Five Alfa Bravo.”'),
 cd('Short form','After the controller uses a shortened version, the pilot may use it too, such as “Five Alfa Bravo.” Always use your full call sign for the first contact. If another airplane has a similar call sign, say it extra clearly.')],
 'Full call sign first, short only after the controller does.',[
 mc('What is an N-number?',['An airplane’s registration on its tail','A fuel grade','A frequency','A runway'],'U.S. aircraft registrations begin with N.'),
 mc('When can you shorten your call sign?',['After the controller does','Never','At first contact','Only at night'],'Let the controller lead.'),
 mc('How do you say 345AB with the type?',['Cessna Three Four Five Alfa Bravo','Cessna 345 A B','Plane A B','N Three Five'],'Say each digit and the phonetic letters.'),
 tf('Letters in a call sign use the phonetic alphabet.',true,'Alfa, Bravo, Charlie…'),
 tf('You always use the shortened call sign on first contact.',false,'Use the full call sign.'),
 fl('The letters “AB” are said “Alfa ___”.',['Bravo','Charlie','Delta','Echo'],'A is Alfa and B is Bravo.')]),
L('rad-readback','Readbacks',[
 cd('Confirm you understood','When a controller gives an instruction, the pilot repeats the important parts back. That is a readback. It lets the controller hear if there was a misunderstanding and fix it right away.'),
 cd('Always read back','Pilots must read back runway hold short instructions and runway assignments. They should also read back headings, altitudes, and frequencies. If they do not understand, they say “Say again.”')],
 'Read it back or say again.',[
 mc('What is a readback?',['Repeating an instruction to confirm it','A new instruction','A song','A weather report'],'It checks that both sides agree.'),
 mc('What should a pilot say if they did not understand?',['Say again','Roger roger','Nothing','Goodbye'],'Asking again is much safer than guessing.'),
 mc('Which must be read back?',['Hold short instructions','The weather','Radio volume','The snack order'],'Hold short instructions are a must.'),
 tf('Readbacks help catch mistakes.',true,'The controller can correct errors.'),
 tf('Guessing is better than saying “Say again.”',false,'Always ask.'),
 fl('If you don’t understand, say “Say ___.”',['again','later','goodbye','nothing'],'It asks for a repeat.')]),
L('rad-dep','Departing from a towered airport',[
 cd('The usual order','At a towered airport the pilot listens to ATIS, calls ground control for taxi instructions, taxies to the runway, completes the run-up, then calls tower when ready. The tower says when to line up and when you are cleared for takeoff.'),
 cd('Tower phrases','“Line up and wait” means taxi onto the runway and hold. “Cleared for takeoff” means you may go. “Hold short” means do not cross the line. Know what each phrase allows before you move.')],
 'Line up and wait is not a takeoff clearance.',[
 mc('What does “Line up and wait” mean?',['Taxi onto the runway and hold','Take off','Land','Turn back'],'You may enter the runway but not take off yet.'),
 mc('Who gives taxi instructions?',['Ground control','Tower','ATIS','The mechanic'],'Ground handles taxi.'),
 mc('What must you hear before taking off?',['Cleared for takeoff','Hello','Good morning','Stand by'],'Only that clearance allows takeoff.'),
 tf('You can take off after “Line up and wait.”',false,'You must wait for “Cleared for takeoff.”'),
 tf('Pilots listen to ATIS before calling ground.',true,'They know the weather and runway first.'),
 od('Put the departure order.',['Listen to ATIS','Call ground','Run-up','Call tower'],'This is the common order.')]),
L('rad-ff','Flight following',[
 cd('Extra eyes','Flight following is a free radar service for VFR pilots on a cross-country flight. Controllers see your transponder, give you a code, and point out nearby traffic. It does not replace your own lookout.'),
 cd('How it works','You call approach or center on the right frequency, give your position and request. The controller gives a squawk code. You stay in contact and receive traffic advisories as time and workload allow.')],
 'Flight following is help, not a substitute for looking.',[
 mc('What is flight following?',['A radar traffic advisory service','A game','A rule','A paid tour'],'It helps VFR pilots avoid traffic.'),
 mc('Does flight following replace your lookout?',['No','Yes','Sometimes','Always'],'You always keep looking outside.'),
 mc('What does the controller give you?',['A squawk code','A refund','A map','A parachute'],'The code makes your target visible.'),
 tf('Flight following is a free service.',true,'For VFR pilots it costs nothing.'),
 tf('You are never allowed to refuse flight following.',false,'It is optional and subject to workload.'),
 fl('The controller gives you a transponder ___.',['code','tune','cap','seat'],'You set the code and become a radar target.')]),
L('rad-class','Talking your way into airspace',[
 cd('Class D and C','To enter Class D airspace, around a towered airport, a pilot must establish two-way radio contact before entering. For Class C the same is true. The controller does not need to say “cleared”; contact is established when they use your call sign.'),
 cd('Class B','To enter Class B airspace, around the busiest airports, a pilot must get an explicit clearance. “Cessna 345AB, cleared into the Class Bravo airspace” means yes. Silence or “stand by” means stay out.')],
 'Class D and C need contact. Class B needs clearance.',[
 mc('What is needed to enter Class D?',['Two-way radio contact','Nothing','A visa','Fuel'],'You must establish communications.'),
 mc('What is needed to enter Class B?',['A clearance','Two-way contact only','Nothing','A transponder only'],'Class B requires a specific clearance.'),
 mc('Controller answers with only “Stand by.” Can you enter Class C?',['No, contact is not established','Yes','Only at night','Only if you hurry'],'They must use your call sign to confirm contact.'),
 tf('Contact is established when the controller uses your call sign.',true,'That shows they have you.'),
 tf('You can enter Class B without a clearance if it is quiet.',false,'Always need clearance.'),
 fl('Class B requires a ___.',['clearance','snack','map','kite'],'You must be cleared in.')]),
L('rad-lost','Lost communications',[
 cd('When the radio fails','If you lose radio contact, check the volume, headset and frequency, and try another radio. Squawk 7600 on the transponder to tell controllers you have a radio problem.'),
 cd('At a towered airport','At a towered airport, controllers may use light gun signals. A steady green means cleared to land, a flashing green means return for landing, a steady red means give way, and a flashing red means the airport is unsafe. Watch the tower.')],
 'Check it, squawk 7600, watch the tower’s lights.',[
 mc('Which transponder code means radio failure?',['7600','7700','1200','0000'],'7600 signals lost communications.'),
 mc('What does a steady green light gun signal mean in flight?',['Cleared to land','Go away','Stop','Emergency'],'Light gun signals replace radio.'),
 mc('What should you check first when the radio goes quiet?',['Volume, headset and frequency','Your shoes','The fuel color','The clock'],'Simple fixes first.'),
 tf('You can use light gun signals from the tower.',true,'They help when radios fail.'),
 tf('7600 means a mid-air emergency.',false,'7700 is for emergencies.'),
 fl('The code for a lost radio is ___.',['7600','1200','7500','2000'],'7600 means lost communications.')]),
L('rad-distress','Mayday and Pan-Pan',[
 cd('Distress and urgency','“Mayday, mayday, mayday” is the call for distress: you are in grave danger and need help now. “Pan-pan, pan-pan, pan-pan” is for urgency: a serious problem exists but you are not yet in immediate danger.'),
 cd('Aviate, navigate, communicate','First, fly the airplane. Then know where you are going. Then talk on the radio. Use 121.5 or the frequency you are on, give your call sign, your problem, and your intentions. Squawk 7700 if you can.')],
 'Aviate, navigate, communicate.',[
 mc('Which call is used for distress?',['Mayday','Pan-pan','Hello','Roger'],'Mayday means immediate danger.'),
 mc('What is the correct order of priorities?',['Aviate, navigate, communicate','Communicate, aviate, navigate','Navigate, communicate, aviate','Aviate, communicate, snack'],'Flying the airplane comes first.'),
 mc('Which transponder code signals an emergency?',['7700','1200','7600','0000'],'7700 is emergency.'),
 tf('Pan-pan is a call for urgency.',true,'It is less severe than Mayday.'),
 tf('You should talk on the radio before flying the airplane.',false,'Aviate first.'),
 fl('The distress call is “___, mayday, mayday.”',['Mayday','Hello','Goodbye','Stop'],'Say mayday three times.')])
]);
})();
