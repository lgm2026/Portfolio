/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* BEYOND 8 - SPECIAL MISSIONS */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,L}=H.dsl;
H.addLessons('special',[
L('sp-show','Airshows',[
 cd('Flying for the crowd','Airshow pilots fly planned routines to entertain crowds. They practice each move many times and use a safe distance from spectators. A line on the ground marks the crowd line they never cross.'),
 cd('Teams','Formation teams such as the Blue Angels and Thunderbirds fly only a few feet apart. Their precision comes from years of training, strong teamwork and clear communication.')],
 'Practice, precision and a crowd line.',[
 mc('What marks the limit for airshow pilots?',['A crowd line','A cloud','A radio','A song'],'Safety.'),
 mc('How do teams fly so closely?',['Years of training','Luck','Magic','Speed only'],'Practice.'),
 mc('Name a military demonstration team.',['Blue Angels','Red Sox','Green Giants','Gold Cars'],'Navy team.'),
 tf('Airshow pilots practice routines many times.',true,'Yes.'),
 tf('They fly without plans.',false,'Routines are planned.'),
 fl('Airshow pilots stay behind the ___ line.',['crowd','color','cloud','coast'],'Crowd.')]),
L('sp-form','Formation flying',[
 cd('Close together','In formation, one airplane is the leader and the others hold position by watching it. The leader flies smooth and gives clear signals. Wingmen make small, gentle control inputs.'),
 cd('Rules of the sky','Formation flight needs training. Pilots agree on signals and plans before the flight. Everyone must know what to do if they lose sight of the leader.')],
 'Follow the leader, with a plan for trouble.',[
 mc('Who sets the plan?',['The leader','Nobody','Passengers','A guess'],'Lead.'),
 mc('What do wingmen do?',['Hold position by watching the leader','Sleep','Race','Hide'],'Visual flying.'),
 mc('What if a pilot loses sight of the leader?',['Follow the agreed plan','Panic','Keep guessing','Turn off the radio'],'Briefed.'),
 tf('Formation flying needs special training.',true,'Yes.'),
 tf('Wingmen make big control moves.',false,'Small gentle inputs.'),
 fl('The ___ flies at the front.',['leader','lunch','lamp','lake'],'Leader.')]),
L('sp-race','Air racing',[
 cd('Speed contests','Air racing pits pilots in timed courses marked by pylons. Racers fly at very low altitude, turn sharply and watch for others. The Reno Air Races famously featured fast warbirds.'),
 cd('Rules and safety','Pilots follow strict rules, minimum safety distances and course boundaries. Racing planes get special inspections. Today’s races focus on strong safety standards.')],
 'Speed, skill and strict rules.',[
 mc('What marks the course?',['Pylons','Clouds','Roads','Boats'],'Markers.'),
 mc('Who sets safety distances?',['Race rules','Chance','Fans','Wind'],'Rules.'),
 mc('Which are special for racing planes?',['Inspections','Menus','Bells','Flags only'],'Checks.'),
 tf('Racers fly fast and low.',true,'Yes.'),
 tf('Air racing has no rules.',false,'It has strict ones.'),
 fl('Racing courses use ___.',['pylons','paths','pools','pins'],'Pylons.')]),
L('sp-fire','Firefighting aircraft',[
 cd('Water and retardant','Aerial firefighters drop water or red fire retardant on wildfires. Planes called air tankers and helicopters with buckets help ground crews slow the fire. Spotter aircraft guide them.'),
 cd('Dangerous work','Flying low over fire is hard. Smoke, heat, turbulence and terrain add risk. Pilots train to manage these hazards, and coordination with ground crews is essential.')],
 'Teams in the air and on the ground.',[
 mc('What do air tankers drop?',['Water or retardant','Snow','Mail','Seeds'],'Fire control.'),
 mc('What guides the tankers?',['Spotter aircraft','Birds','Boats','Cars'],'Coordination.'),
 mc('What makes the work risky?',['Smoke, heat and turbulence','Cold','Music','Sunshine'],'Hazards.'),
 tf('Helicopters can carry water buckets.',true,'Yes.'),
 tf('Firefighting pilots work alone.',false,'They coordinate.'),
 fl('Fire ___ is the red drop.',['retardant','radio','rain','rope'],'Retardant.')]),
L('sp-sar','Search and rescue',[
 cd('Finding people','Search and rescue pilots look for missing people on land and at sea. Helicopters can hoist survivors, and airplanes search wide areas. Crews use special sensors and careful search patterns.'),
 cd('Civil Air Patrol','The Civil Air Patrol is a volunteer organization that helps with search and rescue and offers programs for young people, called cadets. It teaches leadership and aerospace skills.')],
 'Search patterns find people faster.',[
 mc('What do SAR crews do?',['Find and rescue people','Race','Sell tickets','Paint planes'],'Rescue.'),
 mc('Which group offers youth cadet programs?',['Civil Air Patrol','Bakery Club','Sailing Team','Chess Club'],'CAP.'),
 mc('How do crews search?',['With careful patterns','Randomly','By chance','Not at all'],'Systematic.'),
 tf('Helicopters can hoist survivors.',true,'Yes.'),
 tf('Search patterns are random.',false,'They are planned.'),
 fl('SAR stands for search and ___.',['rescue','repair','race','return'],'Rescue.')]),
L('sp-ag','Agricultural aviation',[
 cd('Crop dusters','Ag pilots apply seeds, fertilizer and crop protection to fields from low-flying aircraft. They fly just above the crops with precise swaths. It is one of the most skilled and demanding kinds of flying.'),
 cd('Wires and weather','Wires, towers and wind are major hazards. Ag pilots map obstacles before spraying and plan around wind to avoid drift. Strict rules protect people and the environment.')],
 'Low, precise and always watching for wires.',[
 mc('What do ag pilots apply?',['Seeds and crop products','Snow','Mail','Water balloons'],'Farm work.'),
 mc('Biggest hazard?',['Wires','Clouds','Mountains in the sky','Birds'],'Low flying.'),
 mc('Why consider wind?',['To avoid drift','For fun','To go faster','To save fuel'],'Control spray.'),
 tf('Ag flying needs strict rules.',true,'Yes.'),
 tf('Ag pilots fly high.',false,'They fly low.'),
 fl('Ag stands for ___.',['agricultural','airline','altitude','airborne'],'Agricultural.')]),
L('sp-heli','Helicopter work',[
 cd('Versatile lifters','Helicopters carry cargo on a hook, rescue people, film movies, patrol traffic and support construction. They can land almost anywhere and hover in place.'),
 cd('Special skills','Long-line work needs steady hands and good judgment. Pilots need to know weight, wind and altitude limits. Each job demands detailed planning.')],
 'Hover, haul and help.',[
 mc('What can helicopters do that airplanes cannot easily?',['Hover','Fly fast','Glide','Climb high'],'Stay in place.'),
 mc('What is long-line work?',['Carrying loads on a cable','Writing','Drawing','Racing'],'External loads.'),
 mc('Who uses helicopters?',['Rescue and construction crews','Nobody','Only toys','Only ships'],'Many jobs.'),
 tf('Helicopters can land in tight spots.',true,'Yes.'),
 tf('Helicopters have no weight limits.',false,'They do.'),
 fl('A helicopter can ___ in place.',['hover','swim','sleep','sing'],'Hover.')]),
L('sp-seaplane','Floatplane operations',[
 cd('Alaska and beyond','Floatplanes serve remote lakes where there are no roads. They carry people, supplies and mail. Floatplane pilots read water, wind and current to land and dock safely.'),
 cd('Local knowledge','Experienced pilots know each lake and its hazards, such as submerged logs, boats and shifting winds. They keep survival gear on board.')],
 'Know the lake before you land.',[
 mc('Why use floatplanes?',['Remote lakes lack roads','They are cheap','They are quiet','They are tiny'],'Access.'),
 mc('Which is a hazard on lakes?',['Submerged logs','Sidewalks','Elevators','Doors'],'Hidden dangers.'),
 mc('What must pilots read?',['Water, wind and current','Menus','Song lyrics','Comics'],'Conditions.'),
 tf('Floatplanes carry supplies and mail.',true,'Yes.'),
 tf('Floatplane pilots ignore local knowledge.',false,'It matters.'),
 fl('Float pilots read the ___.',['water','clock','menu','mail'],'Water.')]),
L('sp-photo','Aerial photography and survey',[
 cd('Pictures from above','Pilots fly cameras and sensors over land for maps, farms, construction sites and nature studies. They fly steady lines at a set altitude so the images overlap and can be stitched together.'),
 cd('Modern tools','GPS and computers plan the lines. Some survey flights use drones instead of airplanes. The goal is accurate data collected safely.')],
 'Straight, steady lines make good maps.',[
 mc('Why fly steady lines?',['Images overlap for maps','To save fuel','To be quiet','To look cool'],'Coverage.'),
 mc('What helps plan lines?',['GPS and computers','Coins','Dice','Luck'],'Planning.'),
 mc('Who else can collect aerial data?',['Drones','Nobody','Ships only','Cars only'],'UAS.'),
 tf('Survey flights collect accurate data.',true,'Yes.'),
 tf('Pilots fly random paths.',false,'They follow lines.'),
 fl('GPS helps plan flight ___.',['lines','lunches','lamps','legs only'],'Lines.')]),
L('sp-ski','Ski planes and polar flying',[
 cd('Snow and ice','Pilots in polar regions land on ice and snow using skis. They support scientists, explorers and remote communities. Whiteouts, cold and wind make it demanding.'),
 cd('Cold weather care','Engines need preheating. Pilots carry survival gear, extra fuel and communication tools. Planning for emergencies is part of every trip.')],
 'Cold, white and demanding.',[
 mc('What do polar airplanes land on?',['Snow and ice with skis','Sand','Water only','Roofs'],'Skis.'),
 mc('What is a whiteout?',['Lost horizon in snow','A sunny day','A cloud song','A runway light'],'Hard to see.'),
 mc('What do engines need?',['Preheating','Cooling','Painting','Shouting'],'Cold starts.'),
 tf('Pilots carry survival gear.',true,'Yes.'),
 tf('Polar flying is warm.',false,'It is cold.'),
 fl('Skis help land on ___.',['snow','sand','grass only','roads only'],'Snow.')]),
L('sp-warbird','Warbirds and vintage aircraft',[
 cd('Flying history','Restored vintage airplanes, called warbirds, are flown at airshows to honor history. Pilots need special training for these powerful machines. Volunteers and museums keep many of them flying.'),
 cd('Care required','Old airplanes need careful maintenance, rare parts and respect for their quirks. Many have tailwheels or large engines. Owners work hard to keep them safe.')],
 'Respect the history and the machine.',[
 mc('What are warbirds?',['Restored military aircraft','New jets','Balloons','Seabirds'],'History.'),
 mc('Who keeps them flying?',['Volunteers and museums','Nobody','Only aliens','Only kids'],'Care.'),
 mc('Why do they need special training?',['They are powerful and different','They are tiny','They are quiet','They are easy'],'Skills.'),
 tf('Rare parts make upkeep hard.',true,'Yes.'),
 tf('Vintage airplanes need no maintenance.',false,'They need lots.'),
 fl('Old military airplanes are called ___.',['warbirds','sea birds','pet birds','song birds'],'Warbirds.')]),
L('sp-drone','Humanitarian flying',[
 cd('Flights that help','Pilots volunteer to fly medical patients, deliver supplies after disasters and bring food to remote areas. Programs like Angel Flight connect patients with volunteer pilots.'),
 cd('Safe and ready','Volunteer missions follow the same safety rules. Pilots plan carefully and may need special training. Kind hearts and careful judgment make the best team.')],
 'Help others, keep the same safety rules.',[
 mc('What do humanitarian pilots do?',['Fly to help others','Race','Sell tickets','Paint'],'Service.'),
 mc('Which group links patients with volunteer pilots?',['Angel Flight','Sky Pizza','Star Bank','Moon Club'],'Volunteer network.'),
 mc('Do safety rules still apply?',['Yes','No','Never','Only at night'],'Always.'),
 tf('Disasters can need supply flights.',true,'Yes.'),
 tf('Volunteer pilots may skip planning.',false,'They plan carefully.'),
 fl('Volunteer pilots help people in ___.',['need','nothing','nature only','no one'],'Need.')])
]);
})();
