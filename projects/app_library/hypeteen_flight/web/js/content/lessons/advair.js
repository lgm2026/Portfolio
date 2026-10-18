/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* BEYOND 2 - ADVANCED RATINGS */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,L}=H.dsl;
H.addLessons('advair',[
L('ad2-adsb','ADS-B Out and In',[
 cd('Broadcasting your position','ADS-B Out sends an airplane’s GPS position, altitude and speed to ATC and nearby aircraft. Many airspaces require it. It gives controllers a precise picture and helps search and rescue.'),
 cd('Receiving: ADS-B In','ADS-B In lets a pilot see nearby traffic and get free weather on a tablet or panel display. It improves awareness, but it does not see every aircraft, so pilots must still look outside.')],
 'Out broadcasts, In receives; still look outside.',[
 mc('What does ADS-B Out do?',['Sends your position to others','Receives weather','Lights the runway','Fuels the plane'],'Broadcast.'),
 mc('What does ADS-B In provide?',['Traffic and weather','Fuel','Wings','Wheels'],'Reception.'),
 mc('Does ADS-B show every aircraft?',['No','Yes','Always','Only birds'],'Some are not equipped.'),
 tf('ADS-B uses GPS position.',true,'Yes.'),
 tf('With ADS-B you can stop looking outside.',false,'Keep looking.'),
 fl('ADS-B Out sends your ___.',['position','lunch','mood','song'],'Position.')]),
L('ad2-multi','Multi-engine rating',[
 cd('Two engines','A multi-engine rating lets a pilot fly airplanes with more than one engine. Extra engines offer redundancy and more power. The training focuses on handling an engine failure.'),
 cd('Critical engine','If one engine fails, the airplane yaws toward the dead engine. The critical engine is the one whose failure hurts performance most. Pilots learn to feather the propeller, keep control and fly safely on the remaining engine.')],
 'Two engines add skill, not just safety.',[
 mc('What does a multi-engine rating allow?',['Flying twin-engine airplanes','Flying gliders','Flying balloons','Flying kites'],'More engines.'),
 mc('What happens when one engine fails?',['The plane yaws toward the dead engine','The plane stops','The plane climbs','Nothing'],'Asymmetric thrust.'),
 mc('What does feathering do?',['Reduces drag from the dead propeller','Adds fuel','Cools the cabin','Lights up'],'Blades turn edge-on.'),
 tf('A second engine is not a guarantee.',true,'Skills still matter.'),
 tf('Twin pilots never worry about engine failure.',false,'They train for it.'),
 fl('A twin-engine airplane has ___ engines.',['two','one','nine','zero'],'Two.')]),
L('ad2-tcas','Collision avoidance systems',[
 cd('TCAS','Larger aircraft carry TCAS, a system that talks to other aircraft’s transponders. It warns the crew of nearby traffic. If a collision risk grows, it gives a resolution advisory such as CLIMB or DESCEND.'),
 cd('Obey the advisory','When TCAS gives a resolution advisory, pilots follow it right away, even if air traffic control says something different. Quick, coordinated action keeps airplanes apart.')],
 'Follow the TCAS resolution advisory.',[
 mc('What does TCAS warn about?',['Nearby traffic','Weather only','Low fuel','Radio noise'],'Traffic.'),
 mc('What is a resolution advisory?',['A command like CLIMB or DESCEND','A song','A weather report','A map'],'Avoidance.'),
 mc('If TCAS and ATC disagree…',['Follow TCAS','Follow ATC','Ignore both','Panic'],'Follow TCAS.'),
 tf('TCAS works with transponders.',true,'Yes.'),
 tf('Pilots may ignore TCAS commands.',false,'Follow them.'),
 fl('TCAS helps avoid mid-air ___.',['collisions','clouds','coffee','calls'],'Collisions.')]),
L('ad2-type','Type ratings',[
 cd('Special training','Large or turbine-powered airplanes need a type rating, a certification for that specific model. Pilots study its systems and perform check flights, often in a full-motion simulator.'),
 cd('Airline pilots','An airline pilot may hold a type rating for the Boeing 737 or Airbus A320. If they move to a new type, they train again. Type ratings show a pilot has mastered a particular machine.')],
 'Each big jet has its own rating.',[
 mc('What is a type rating?',['Certification for a specific aircraft model','A typing test','A color code','A map'],'Specific model.'),
 mc('Where do pilots often train for it?',['A full-motion simulator','A library','A park','A boat'],'Simulators.'),
 mc('When is it needed?',['For large or turbine aircraft','For every plane','Never','For kites'],'Heavy and jet.'),
 tf('Changing aircraft types needs new training.',true,'Yes.'),
 tf('One rating covers all airplanes.',false,'Each type needs its own.'),
 fl('A type rating covers one ___ of airplane.',['model','color','price','flag'],'Model.')]),
L('ad2-sim','Flight simulators',[
 cd('Safe practice','Simulators let pilots practice emergencies that would be too dangerous in real flight. Engine fires, system failures and storms can be recreated safely. Airlines train and test pilots in them every year.'),
 cd('Levels','Simulators range from simple desktop programs to full-motion machines on hydraulic legs. Approved devices can count toward training hours. They save fuel and make learning safer.')],
 'Sims let pilots practice the dangerous stuff safely.',[
 mc('Why use simulators?',['To practice emergencies safely','To waste time','To cook','To paint'],'Safety.'),
 mc('What moves a full-motion simulator?',['Hydraulic legs','Wheels','Wings','Sails'],'Motion.'),
 mc('Who uses them?',['Airline pilots','Nobody','Only kids','Only birds'],'Yearly training.'),
 tf('Some simulators can count for training time.',true,'If approved.'),
 tf('Simulators are real airplanes.',false,'They are not.'),
 fl('A simulator saves ___.',['fuel','paint','time zones','birds'],'Fuel.')]),
L('ad2-night','Night and mountain flying',[
 cd('Special skills','Mountain flying has unique challenges: strong winds, downdrafts, high density altitude and limited landing spots. Pilots take special training to fly safely in the mountains.'),
 cd('Smart habits','Cross ridges at an angle so you can turn away. Fly in the morning when the air is smoother. Leave margins for altitude. A mountain checkout from an experienced instructor is a smart step.')],
 'Cross ridges at an angle and fly early.',[
 mc('Why cross a ridge at an angle?',['So you can turn away easily','To go faster','To see more','To burn fuel'],'Escape route.'),
 mc('When is mountain air usually smoother?',['Morning','Afternoon','Noon','Midnight'],'Early.'),
 mc('Which is a mountain hazard?',['Downdrafts','Clouds only','Flat land','Sandwiches'],'Strong winds.'),
 tf('Density altitude is high in the mountains.',true,'Thin air.'),
 tf('Mountain flying needs no extra training.',false,'Get a checkout.'),
 fl('Cross ridges at an ___.',['angle','altitude','airport','arch'],'Angle.')]),
L('ad2-upset','Upset recovery',[
 cd('Unusual attitudes','An upset is an unexpected, extreme attitude, such as a steep bank or nose-high or nose-low. Wake turbulence, mistakes or ice can cause it. Training teaches calm recovery.'),
 cd('General steps','Recognize it, reduce angle of attack if stalled, level the wings and recover pitch smoothly while watching speed. The exact steps vary by airplane. Upset training with an instructor builds confidence.')],
 'Stay calm, unload the wing, level, then recover.',[
 mc('What is an upset?',['An unexpected extreme attitude','A bad meal','A late flight','A noise'],'Unusual attitude.'),
 mc('What helps with recovery?',['Training with an instructor','Luck','Guessing','Waiting'],'Practice.'),
 mc('What should come first if stalled?',['Reduce angle of attack','Pull harder','Ignore','Pray'],'Unload.'),
 tf('Procedures vary by airplane.',true,'Yes.'),
 tf('Pulling harder always helps.',false,'It can worsen a stall.'),
 fl('An upset is an unusual ___.',['attitude','appetite','arrival','article'],'Attitude.')]),
L('ad2-bush','Bush flying',[
 cd('Rough strips','Bush pilots land on short, rough strips, gravel bars, lakes and snow. Their airplanes have big tires, floats or skis. They use skills for short takeoffs and landings.'),
 cd('Judgment first','Remote flying means help is far away. Bush pilots plan for weather, fuel and survival gear. They look at the strip from above before landing and make smart choices every time.')],
 'Look before you land and carry survival gear.',[
 mc('What do bush pilots land on?',['Rough strips and lakes','Only paved runways','Only cities','Roofs'],'Remote places.'),
 mc('What helps them land?',['Big tires, floats or skis','Skates','Sails','Wheels only'],'Special gear.'),
 mc('What do they do before landing?',['Look at the strip from above','Close eyes','Guess','Nap'],'Check first.'),
 tf('Survival gear is smart for remote flights.',true,'Yes.'),
 tf('Help is always nearby for bush pilots.',false,'It is not.'),
 fl('Floats let a plane land on ___.',['water','sand only','roofs','roads'],'Water.')]),
L('ad2-data','Datalink weather',[
 cd('Weather in the cockpit','Datalink weather sends radar pictures, METARs and forecasts to a display in the airplane. It helps pilots see storms and changes along the route. Free ADS-B weather works at many altitudes.'),
 cd('Old data','Datalink radar images can be several minutes old. Storms move and grow. Use datalink for strategic planning, such as staying far from storms, not for threading gaps between cells.')],
 'Datalink is for staying away, not squeezing through.',[
 mc('What does datalink weather show?',['Radar and reports in the cockpit','Fuel prices','Songs','Maps of cities'],'Weather updates.'),
 mc('How old can datalink radar be?',['Several minutes','Seconds','Never old','Years'],'It lags.'),
 mc('What is it best for?',['Strategic planning','Threading gaps in storms','Navigating by feel','Fuel buying'],'Stay far away.'),
 tf('Storms can change faster than the display updates.',true,'Yes.'),
 tf('Datalink radar is live to the second.',false,'It is delayed.'),
 fl('Datalink weather is delayed, so stay ___ from storms.',['far','close','near','beside'],'Far.')]),
L('ad2-proficiency','Staying proficient',[
 cd('Currency vs proficiency','Currency means meeting the legal minimum. Proficiency means flying well. A pilot can be current but rusty. Flying often and with an instructor keeps skills sharp.'),
 cd('Flight reviews','Every pilot needs a flight review every 24 calendar months. It includes ground and flight time with an instructor. Many pilots do extra training each year, such as the FAA WINGS program.')],
 'Current is legal; proficient is skilled.',[
 mc('How often is a flight review?',['Every 24 months','Every day','Every 10 years','Never'],'Two years.'),
 mc('What is proficiency?',['Flying well','Having a license only','Owning a plane','Having a hat'],'Skill.'),
 mc('What helps keep skills sharp?',['Flying often','Waiting','Resting only','Guessing'],'Practice.'),
 tf('A current pilot can still be rusty.',true,'Yes.'),
 tf('Currency and proficiency are the same.',false,'They differ.'),
 fl('A flight ___ is required every 24 months.',['review','race','rest','route'],'Review.')])
]);
})();
