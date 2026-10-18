/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* PRIVATE PILOT 1 - PRIVATE PILOT BASICS: what the certificate allows and what it takes (14 CFR Part 61). Practice only: this game never grants a real certificate. */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,od,L}=H.dsl;
H.addLessons('ppl',[
L('ppl-what','What a private pilot can do',[
 cd('Flying for fun and travel','A private pilot certificate lets you fly an airplane on your own, carry passengers, and use it for personal trips, family visits and sightseeing. It is the most popular pilot certificate and the foundation for all the others.'),
 cd('No pay for flying','A private pilot cannot be paid to fly. Passengers may share the real costs of a flight, like fuel and rental, but the pilot must pay at least their own equal share. Getting paid to fly takes a commercial pilot certificate.')],
 'Private means personal, not for pay.',[
 mc('Which describes a private pilot?',['Flies for personal reasons, not for pay','Flies for an airline','Flies only at night','Flies only alone'],'Private pilots fly for fun and personal travel.'),
 mc('Can a private pilot carry passengers?',['Yes','Never','Only family','Only children'],'Passengers are allowed once the pilot meets the rules.'),
 mc('What certificate allows you to be paid to fly?',['Commercial','Student','Private','Sport'],'Commercial pilots can be paid.'),
 tf('Passengers may share the pro-rata costs of fuel and rental.',true,'The pilot pays their equal share too.'),
 tf('A private pilot can run an airline.',false,'That requires higher certificates.'),
 fl('A private pilot cannot fly for ___.',['pay','fun','travel','lessons'],'Compensation is not allowed.')]),
L('ppl-age','Who can apply',[
 cd('Age and language','To earn a private pilot certificate for airplanes you must be at least 17 years old. For gliders and balloons, 16. You must be able to read, speak, write and understand English.'),
 cd('Medical and tests','You also need a medical qualification, a passing score on the knowledge test, and a passing practical test with an examiner. And you need the required training and experience, recorded in your logbook and signed by your instructor.')],
 'Seventeen for airplanes, sixteen for gliders and balloons.',[
 mc('How old must you be for a private airplane certificate?',['17','12','21','30'],'The minimum age is 17.'),
 mc('How old for a glider or balloon private certificate?',['16','10','21','25'],'Gliders and balloons allow 16.'),
 mc('Which language ability is required?',['Read, speak, write and understand English','French only','Sign language','None'],'Aviation English is required.'),
 tf('You must pass a practical test with an examiner.',true,'The checkride is required.'),
 tf('You can get a private certificate at age 13.',false,'The minimum age is 16 or 17.'),
 fl('The minimum age for an airplane private pilot is ___.',['17','13','25','40'],'Seventeen.')]),
L('ppl-hours','Minimum hours',[
 cd('The 40-hour rule','The FAA requires at least 40 hours of flight time for the private certificate. That includes at least 20 hours with an instructor and 10 hours of solo flying. Most students take more than 40 to reach the standard, often 60 to 70.'),
 cd('Skill, not just time','The minimum is only a floor. What matters is meeting the standards in the practical test. Flying often and studying well can shorten the path. Schools with an approved Part 141 course can have lower minimums.')],
 'Forty is the minimum. Skill is the test.',[
 mc('What is the FAA minimum total flight time for a private certificate under Part 61?',['40 hours','4 hours','400 hours','4,000 hours'],'Forty hours of experience are required.'),
 mc('How many hours of solo flying are required?',['10','1','50','200'],'Ten hours of solo.'),
 mc('How many hours do most students actually need?',['More than the minimum','Fewer','Exactly 40','None'],'Most take 60 to 70.'),
 tf('The minimum hours are a floor, not a goal.',true,'Skill is what counts.'),
 tf('If you reach 40 hours, the certificate is automatic.',false,'You must pass the tests.'),
 fl('At least 20 hours must be dual from a flight ___.',['instructor','student','engineer','mechanic'],'Training with an instructor.')]),
L('ppl-dual','Required training topics',[
 cd('Special training hours','Within the 40 hours, the rules require 3 hours of cross-country training, 3 hours at night, 3 hours of instrument training, and 3 hours of test preparation within 2 months of the practical test.'),
 cd('Night flying','The night training must include one cross-country flight of more than 100 nautical miles and 10 takeoffs and landings to a full stop, each with a flight in the traffic pattern. Every pilot learns to handle the dark.')],
 'Three, three, three, three: cross-country, night, instrument, test prep.',[
 mc('How many hours of night training are required?',['3','30','0.3','300'],'Three hours of night.'),
 mc('How many hours of instrument training are required?',['3','1','30','60'],'Three hours of instrument flying.'),
 mc('How many night takeoffs and landings are required?',['10','1','100','2'],'Ten full-stop landings.'),
 tf('Test preparation time must be recent, within two calendar months.',true,'It keeps the training fresh.'),
 tf('Night training is optional.',false,'It is required for the certificate.'),
 fl('The night cross-country must be over ___ nautical miles.',['100','10','1','1,000'],'More than 100 nautical miles.')]),
L('ppl-solo','Required solo flying',[
 cd('Ten hours alone','At least 10 of the 40 hours must be solo, including 5 hours of solo cross-country. Solo time builds confidence and judgment. Pilots learn to rely on themselves.'),
 cd('Special solo flights','A long solo cross-country of at least 150 nautical miles with landings at three points is required, and so are 3 solo takeoffs and landings at an airport with a control tower.')],
 'Ten hours solo, five cross-country, one long trip.',[
 mc('How much solo cross-country time is required?',['5 hours','5 minutes','50 hours','500 hours'],'Five hours of solo cross-country.'),
 mc('How many landing points on the long solo cross-country?',['Three','One','Ten','Two hundred'],'Three points.'),
 mc('Where must the 3 solo takeoffs and landings be?',['At a towered airport','In a field','At sea','At night'],'This builds tower communication skills.'),
 tf('Solo flights build judgment.',true,'You make every decision.'),
 tf('You only need one solo flight, ever.',false,'Ten hours are required.'),
 fl('Solo flight builds ___ and judgment.',['confidence','traffic','weight','fuel'],'It builds self-reliance.')]),
L('ppl-priv','Privileges and limits',[
 cd('What the certificate allows','With a private pilot certificate you can fly a single-engine land airplane (or whatever category and class you earned) in good weather, day or night, as pilot in command and with passengers, as long as you stay current and within your ratings.'),
 cd('Limits','You may not fly for pay, carry people or property for hire, or fly in clouds without an instrument rating. You may fly charity flights for certain nonprofit events and pay your share of costs, but you cannot make a business of flying.')],
 'Good weather, personal trips, pay your share.',[
 mc('Can a private pilot fly in clouds without more training?',['No, an instrument rating is needed','Yes','Only at night','Only low'],'Clouds require instrument flying skills.'),
 mc('Which is a limit of the private certificate?',['No flying for pay','No flying at all','Daytime only','Sunday only'],'Compensation is prohibited.'),
 mc('What must a private pilot do to carry passengers?',['Stay current','Own the airplane','Be 30','Have a degree'],'Currency rules protect passengers.'),
 tf('A private pilot may act as pilot in command with passengers.',true,'Once current and qualified.'),
 tf('A private pilot may charge for rides.',false,'That is flying for hire.'),
 fl('Flying without an instrument rating means staying out of ___.',['clouds','sunlight','airports','towers'],'You must stay in visual conditions.')]),
L('ppl-ratings','Category, class and type',[
 cd('Category and class','A category is a broad group of aircraft, such as airplane, rotorcraft, glider or lighter-than-air. A class is a smaller group inside a category, like single-engine land, multi-engine land or single-engine sea.'),
 cd('Type ratings','A type rating is for specific large or turbojet aircraft, like a particular jet airliner. You need one to be pilot in command of those aircraft. A private certificate with a different class needs additional training for that class.')],
 'Category, then class, then type.',[
 mc('Which is a category?',['Airplane','Single-engine land','Boeing 737','Cessna 172'],'Airplane is a category.'),
 mc('Which is a class?',['Single-engine land','Glider','Rotorcraft','Airship'],'Single-engine land is a class.'),
 mc('When is a type rating needed?',['For large or turbojet aircraft','For all airplanes','For none','Only for gliders'],'Large and jet aircraft need type ratings.'),
 tf('A rotorcraft is a different category from an airplane.',true,'Categories are broad groups.'),
 tf('A single-engine land certificate lets you fly any airplane.',false,'Different classes need different ratings.'),
 od('Put these from broad to specific.',['Category','Class','Type'],'Broad to narrow.')]),
L('ppl-curr','Staying current',[
 cd('Flight review','A pilot must complete a flight review with an instructor at least every 24 calendar months. It includes one hour of ground training and one hour of flight training. It keeps skills sharp and updates knowledge.'),
 cd('Carrying passengers','To carry passengers, a pilot must have made three takeoffs and landings in the previous 90 days in the same category and class. To carry passengers at night, those landings must be full-stop landings at night.')],
 'Review every two years, three landings every 90 days.',[
 mc('How often is a flight review required?',['Every 24 calendar months','Every 24 hours','Every 24 years','Never'],'Every two years.'),
 mc('How many takeoffs and landings are needed to carry passengers?',['Three in 90 days','One in 90 years','Ten in a day','Two in a minute'],'Three in the previous 90 days.'),
 mc('What kind of landings are needed for night passengers?',['Full-stop at night','Touch-and-go in daytime','Water landings','None'],'Night currency needs full-stop landings at night.'),
 tf('A flight review includes both ground and flight time.',true,'One hour of each.'),
 tf('Once you pass your checkride, you never need to train again.',false,'You need a review every two years.'),
 fl('The flight review is every 24 calendar ___.',['months','days','weeks','hours'],'Twenty-four calendar months.')]),
L('ppl-med','Medical certificates',[
 cd('Three classes','The FAA offers first-, second- and third-class medical certificates, each with stricter standards for higher pilot jobs. A private pilot needs a third-class medical at minimum, or may use BasicMed under certain rules.'),
 cd('How long it lasts','A third-class medical lasts five years if you were under 40 when it was issued, and two years if you were 40 or older. Pilots must not fly if they are unfit, even with a valid medical.')],
 'Third class for private. Never fly unfit.',[
 mc('What class medical does a private pilot need at minimum?',['Third class','First class','No medical','Fourth class'],'Third-class is for private pilots.'),
 mc('How long does a third-class medical last if you were under 40?',['Five years','Five days','Fifty years','One hour'],'Five years under 40.'),
 mc('What alternative exists for some private pilots?',['BasicMed','Basic Training','BasicFuel','BasicPlan'],'BasicMed offers another route.'),
 tf('A pilot should not fly if feeling unfit, even with a valid medical.',true,'Fit-to-fly is a daily decision.'),
 tf('A medical certificate means you can fly while sick.',false,'You still must be fit.'),
 fl('A first-class medical is for ___ pilots.',['airline','student','balloon','glider'],'The highest standard is for airline pilots.')]),
L('ppl-tests','The two tests',[
 cd('Knowledge test','The written knowledge test is taken at an approved testing center. For the private pilot airplane test, it has 60 multiple-choice questions, takes up to two and a half hours, and requires a score of at least 70 percent.'),
 cd('Practical test','The practical test, or checkride, has two parts: an oral exam and a flight. It is given by an examiner and follows the Airman Certification Standards, or ACS. Passing both earns a temporary certificate, and the plastic one comes by mail.')],
 'Written first, then the oral and flight.',[
 mc('What score passes the knowledge test?',['At least 70 percent','At least 7 percent','At least 100 percent','Any score'],'Seventy percent.'),
 mc('How many questions are on the private pilot airplane knowledge test?',['60','6','600','6,000'],'Sixty questions.'),
 mc('What is the ACS?',['Airman Certification Standards','Air Control System','Aviation Cargo Service','Aircraft Check Sheet'],'It lists what you must know and do.'),
 tf('The practical test has an oral and a flight part.',true,'Both are required.'),
 tf('The knowledge test is given in the airplane.',false,'It is taken at a testing center.'),
 fl('Another name for the practical test is the ___.',['checkride','crossword','quiz','camp'],'Pilots call it a checkride.')])
]);
})();
