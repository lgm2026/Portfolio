/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* PRIVATE PILOT 16 - MAINTENANCE AND OWNERSHIP */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,L}=H.dsl;
H.addLessons('maint',[
L('mt-resp','Who keeps it airworthy',[
 cd('Owner and pilot','The owner or operator is responsible for keeping the airplane airworthy. The pilot in command must also make sure the airplane is safe before each flight. Both share the duty.'),
 cd('Airworthy means','Airworthy means the airplane meets its approved design and is in condition for safe flight. If something is broken or missing, it may not be airworthy. When unsure, ask a mechanic.')],
 'If in doubt, ask a mechanic.',[
 mc('Who must keep the plane airworthy?',['The owner or operator','The tower','Passengers','Nobody'],'Owner.'),
 mc('Who checks it before each flight?',['The pilot in command','The weather','A passenger','The map'],'Preflight.'),
 mc('Airworthy means…',['Safe and meeting its design','New','Pretty','Fast'],'Condition and design.'),
 tf('If unsure, ask a mechanic.',true,'Yes.'),
 tf('A broken part never matters.',false,'It can matter.'),
 fl('The pilot in command checks airworthiness before ___.',['flight','lunch','sleep','school'],'Flight.')]),
L('mt-docs','Required documents: ARROW',[
 cd('What must be on board','Pilots remember ARROW: Airworthiness certificate, Registration, Radio station license (for international flights), Operating limitations and Weight and balance data. These show the airplane is legal and safe.'),
 cd('Personal documents','Pilots must carry their pilot certificate, a photo ID and a medical certificate when required. Student pilots also need an endorsement. Keep all the papers together and current.')],
 'ARROW lists the airplane’s papers.',[
 mc('What does the first A in ARROW stand for?',['Airworthiness certificate','Altitude','Airspeed','Airway'],'Airworthiness.'),
 mc('What does the second R stand for?',['Radio license','Runway','Route','Rudder'],'Radio.'),
 mc('What does the W stand for?',['Weight and balance','Wind','Water','Weather'],'Weight and balance.'),
 tf('The registration must be on board.',true,'Yes.'),
 tf('You need no ID while piloting.',false,'Carry photo ID.'),
 fl('The O in ARROW is for operating ___.',['limitations','lights','lines','levels'],'Limitations.')]),
L('mt-inspect','Required inspections',[
 cd('Annual inspection','Every airplane needs an annual inspection every 12 months by a certified mechanic. Airplanes used for flight instruction or rental also need a 100-hour inspection. Each inspection must be signed in the logbook.'),
 cd('Other checks','Other checks include the altimeter and static system test every 24 months, the transponder check every 24 months, and the ELT inspection every 12 months. The emergency locator transmitter helps rescuers find a crash.')],
 'Annual, 100-hour, and 24-month checks.',[
 mc('How often is an annual inspection?',['12 months','12 days','12 years','Never'],'Yearly.'),
 mc('Which airplanes need 100-hour inspections?',['Rented or used for instruction','Private only','Never flown','None'],'Flight school planes.'),
 mc('How often is the transponder check?',['24 months','2 days','2 weeks','10 years'],'24 calendar months.'),
 tf('The ELT helps rescuers.',true,'Locator.'),
 tf('Inspections need no records.',false,'They are logged.'),
 fl('ELT stands for emergency locator ___.',['transmitter','tank','tower','tire'],'Transmitter.')]),
L('mt-logs','Logbooks',[
 cd('Airplane records','Maintenance logbooks record inspections, repairs and changes. Airworthiness directives, or ADs, must be tracked. A good logbook tells the airplane’s story and proves it is legal.'),
 cd('Pilot logbook','A pilot also keeps a personal logbook with flight time, landings, training and endorsements. It shows experience and proves currency. Fill it in right after each flight so details are fresh.')],
 'Records prove the story.',[
 mc('What do maintenance logs record?',['Inspections and repairs','Songs','Recipes','Jokes'],'The airplane’s history.'),
 mc('What are ADs?',['Airworthiness directives','Air dances','Altitude data','Airport dots'],'Mandatory fixes.'),
 mc('When do you fill in your logbook?',['Soon after each flight','Years later','Never','Only on holidays'],'Fresh details.'),
 tf('Logbooks help prove currency.',true,'Yes.'),
 tf('ADs are optional suggestions.',false,'They are required.'),
 fl('AD stands for airworthiness ___.',['directive','dial','door','dock'],'Directive.')]),
L('mt-mel','Inoperative equipment',[
 cd('When something is broken','Some airplanes can fly with inoperative equipment under rules, if the item is not required. The pilot must follow the process: check the equipment list, tag it inoperative and decide if it affects safety.'),
 cd('Use judgment','A broken item that is not required may still matter. A failed landing light is a bigger problem at night. If the item is needed for the flight, fix it first. Don’t fly just because it is allowed.')],
 'Legal is not always safe.',[
 mc('What must you do with an inoperative item?',['Tag it and decide if it affects safety','Hide it','Ignore it','Paint it'],'Follow the process.'),
 mc('Which broken item matters more at night?',['Landing light','Cup holder','Clock cover','Floor mat'],'Lights.'),
 mc('If the item is required…',['Fix it first','Fly','Guess','Hurry'],'Repair.'),
 tf('Legal does not always mean safe.',true,'Think.'),
 tf('You can fly with any broken part.',false,'No.'),
 fl('An item you cannot use is ___.',['inoperative','inspired','invited','insured'],'Inoperative.')]),
L('mt-pm','Preventive maintenance',[
 cd('What pilots can do','Pilots who own their airplane may perform certain simple tasks called preventive maintenance. Examples include changing a tire, adding oil, replacing a landing light bulb and servicing batteries. They must record the work.'),
 cd('Know your limits','Anything beyond the allowed list needs a licensed mechanic. Doing work beyond your skill is unsafe. Learning how your airplane works helps you spot problems and ask better questions.')],
 'Simple jobs yes; complex jobs, call a mechanic.',[
 mc('Which is preventive maintenance?',['Adding oil','Engine overhaul','Wing repair','Prop change'],'Simple tasks.'),
 mc('Who does work beyond the list?',['A licensed mechanic','A passenger','A friend','Anyone'],'A mechanic.'),
 mc('What must you do after preventive maintenance?',['Record it','Forget it','Hide it','Sing'],'Log it.'),
 tf('Changing a light bulb can be preventive maintenance.',true,'Yes.'),
 tf('Pilots may do any repair.',false,'Only limited ones.'),
 fl('Add ___ is an easy task.',['oil','wings','tails','engines'],'Oil.')]),
L('mt-squawk','Squawks and reporting',[
 cd('Speak up','A squawk is a pilot’s note about a problem. If a gauge sticks or a noise is odd, report it to the owner or mechanic. Small problems found early are cheaper and safer to fix.'),
 cd('Document it','Write down what happened, when and under what conditions. Clear notes help the mechanic. Never assume the next pilot will notice the issue.')],
 'Report it so the next flight is safe.',[
 mc('What is a squawk?',['A note about a problem','A bird call','A song','A radio'],'Report it.'),
 mc('Why report early?',['Small problems are easier to fix','To be loud','To annoy','No reason'],'Cheaper and safer.'),
 mc('What should notes include?',['What, when, and conditions','Jokes','Menus','Colors'],'Details.'),
 tf('Don’t assume the next pilot will notice.',true,'Write it down.'),
 tf('Ignoring a noise is good practice.',false,'Report it.'),
 fl('A pilot’s problem note is a ___.',['squawk','song','sail','stamp'],'Squawk.')]),
L('mt-hangar','Storing and securing',[
 cd('Tie-downs and chocks','Outdoors, airplanes are tied to the ground with ropes and chocks block the wheels. Wind can lift or push an airplane. Control locks hold the controls steady. Pitot covers keep bugs out of the tube.'),
 cd('Before you go','Remove covers and locks before flight, and check there are no stray tools or ropes. Leaving a cover on a pitot tube can cause false airspeed. Walk around the airplane one last time.')],
 'Remove every cover, rope and lock.',[
 mc('What blocks the wheels?',['Chocks','Clouds','Keys','Wings'],'Chocks.'),
 mc('Why use a pitot cover?',['Keeps bugs out','Looks nice','Holds fuel','Adds speed'],'Protection.'),
 mc('What if a pitot cover stays on?',['Airspeed reading is wrong','Better speed','More fuel','Nothing'],'It blocks air.'),
 tf('Control locks should be removed before flight.',true,'Yes.'),
 tf('Ropes can stay tied during flight.',false,'Remove them.'),
 fl('Tie-downs keep the airplane ___.',['secure','heavy','light','fast'],'Secure.')]),
L('mt-fuelq','Fuel quality',[
 cd('Sump the tanks','Water and dirt in fuel can stop an engine. Pilots drain a small sample from the sumps, the low points in the tanks, and look at it in a clear cup. Fuel should be clear and have no water or particles.'),
 cd('Right fuel, right color','100LL avgas is blue. Jet-A is clear or straw colored and must never go into a piston airplane. Use the right fuel and watch the fuel truck markings. Wrong fuel can cause engine failure.')],
 'Check color, clear, and no water.',[
 mc('What color is 100LL avgas?',['Blue','Red','Black','Green'],'Blue.'),
 mc('Why sump the tanks?',['To find water or dirt','To weigh it','To warm it','To empty it'],'Check quality.'),
 mc('Should jet fuel go into a piston airplane?',['No','Yes','Sometimes','Always'],'It can cause failure.'),
 tf('Water in fuel can stop an engine.',true,'Yes.'),
 tf('Fuel sample should look cloudy.',false,'It should be clear.'),
 fl('Water settles at the low ___.',['point','wing','tail','tank cap'],'Low point.')]),
L('mt-own','Owning vs renting',[
 cd('Costs and choices','Renting from a flight school has lower upfront cost and no maintenance duties. Owning gives freedom and a familiar airplane but costs insurance, storage, upkeep and inspections. Some pilots share ownership through flying clubs or partnerships.'),
 cd('Try before you buy','New pilots often rent first to learn what they like. A pre-buy inspection by a mechanic checks a used airplane before purchase. Look at records, engine hours and past damage.')],
 'Rent first, inspect before you buy.',[
 mc('What is a benefit of renting?',['Lower upfront cost','More work','More paper','More noise'],'Easier start.'),
 mc('What is a pre-buy inspection?',['A mechanic checks an airplane before purchase','A walk','A race','A sale'],'Smart step.'),
 mc('What is a flying club?',['Members share airplanes','A band','A cafe','A zoo'],'Shared ownership.'),
 tf('Owning includes insurance and storage costs.',true,'Yes.'),
 tf('Owning has no maintenance duties.',false,'It does.'),
 fl('A shared airplane group is a flying ___.',['club','cave','cart','cap'],'Club.')])
]);
})();
