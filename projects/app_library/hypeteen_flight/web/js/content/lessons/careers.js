/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* BEYOND 7 - AVIATION CAREERS */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,L}=H.dsl;
H.addLessons('careers',[
L('cr-many','Many ways to work in aviation',[
 cd('More than pilots','Aviation needs pilots, mechanics, air traffic controllers, dispatchers, engineers, flight attendants, airport managers, meteorologists and more. Every flight depends on a big team.'),
 cd('Find your fit','Some people like hands-on work, some like math, and some like helping people. Aviation has a place for each. Learning about many jobs can help you choose a path you will love.')],
 'Aviation is a team sport.',[
 mc('Who else works in aviation?',['Mechanics and controllers','Only pilots','Nobody','Only birds'],'Many roles.'),
 mc('Which job studies weather?',['Meteorologist','Mechanic','Dispatcher','Baggage handler'],'Weather expert.'),
 mc('Why learn about many jobs?',['To find your fit','To waste time','To avoid school','No reason'],'Choose well.'),
 tf('Every flight depends on a team.',true,'Yes.'),
 tf('Only pilots work in aviation.',false,'Many jobs exist.'),
 fl('A ___ keeps airplanes fixed.',['mechanic','mailer','mover','mapper'],'Mechanic.')]),
L('cr-amt','Aircraft mechanics',[
 cd('Keeping them flying','Aircraft maintenance technicians inspect, repair and test airplanes. They hold A&P certificates: Airframe and Powerplant. They follow detailed manuals and sign for their work.'),
 cd('A strong field','Skilled mechanics are in demand around the world. The work blends hands-on skill and problem solving. Mechanics can work in shops, airlines, flight schools and the military.')],
 'A&P = Airframe and Powerplant.',[
 mc('What does A&P stand for?',['Airframe and Powerplant','Air and Pilot','Altitude and Pressure','Approach and Pattern'],'Mechanic certificate.'),
 mc('What do mechanics do?',['Inspect and repair airplanes','Serve food','Draw maps','Sell tickets'],'Maintenance.'),
 mc('Where can they work?',['Airlines, shops, schools','Only space','Only boats','Nowhere'],'Many places.'),
 tf('Mechanics sign for their work.',true,'Responsibility.'),
 tf('Mechanics need no manuals.',false,'They follow them.'),
 fl('A mechanic’s certificate is called A&___.',['P','Q','R','S'],'A&P.')]),
L('cr-atc','Air traffic controllers',[
 cd('Directing the sky','Controllers guide aircraft in the air and on the ground. They work in towers, approach control centers and en-route centers. Their job is to keep airplanes safely apart and traffic moving.'),
 cd('Skills needed','Controllers need to stay calm, think fast and communicate clearly. They train for months at specialized academies. Their voices are the calm center of the system.')],
 'Calm voices that keep the sky orderly.',[
 mc('What do controllers do?',['Keep aircraft apart','Fix engines','Fly planes','Serve meals'],'Separation.'),
 mc('Where do they work?',['Towers and control centers','Only on planes','Only on ships','Only at home'],'Facilities.'),
 mc('Which skill matters most?',['Clear communication','Painting','Cooking','Singing'],'Radios.'),
 tf('Controllers train at specialized academies.',true,'Yes.'),
 tf('Controllers fly the airplanes.',false,'Pilots do.'),
 fl('ATC stands for air ___ control.',['traffic','travel','taxi','tower'],'Traffic.')]),
L('cr-eng','Aerospace engineers',[
 cd('Designing flight','Aerospace engineers design airplanes, spacecraft and engines. They use math, physics and computers. They test ideas with models, wind tunnels and simulations.'),
 cd('Many specialties','Some focus on wings and aerodynamics, others on structures, engines, electronics or software. A degree in engineering is usually needed. Curiosity about how things work is the starting point.')],
 'Math and physics make flight real.',[
 mc('What do aerospace engineers design?',['Aircraft and spacecraft','Clothes','Food','Furniture'],'Flying machines.'),
 mc('Which tool tests wing shapes?',['Wind tunnel','Washing machine','Oven','Piano'],'Airflow tests.'),
 mc('What helps start?',['Curiosity about how things work','Luck','Boredom','Speed'],'Curiosity.'),
 tf('Engineers use math and physics.',true,'Yes.'),
 tf('All engineers do the same job.',false,'Many specialties.'),
 fl('A wind ___ tests airflow.',['tunnel','tower','tank','tent'],'Tunnel.')]),
L('cr-fa','Flight attendants',[
 cd('Safety first','Flight attendants are trained to handle emergencies, first aid, evacuations and security issues. They also serve customers and keep the cabin comfortable. Their main job is safety.'),
 cd('A life of travel','The job involves travel, varied schedules and meeting people from many places. Attendants need teamwork, kindness and calm decision making.')],
 'Safety professionals who also serve.',[
 mc('What is the main job of flight attendants?',['Safety','Cooking','Driving','Painting'],'Safety.'),
 mc('What are they trained for?',['Emergencies and first aid','Only snacks','Nothing','Dancing'],'Serious training.'),
 mc('Which quality helps?',['Calm decision making','Impatience','Silence','Rushing'],'Calm.'),
 tf('They help evacuate airplanes.',true,'Yes.'),
 tf('They only serve drinks.',false,'Safety is first.'),
 fl('Flight ___ keep the cabin safe.',['attendants','animals','agents','artists'],'Attendants.')]),
L('cr-airport','Airport operations',[
 cd('Running an airport','Airports need managers, firefighters, maintenance crews, security staff, fuelers and ground handlers. Someone plows snow, checks lights and keeps runways clear.'),
 cd('Behind the scenes','Ramp workers load bags and guide airplanes. Operations staff watch for wildlife and debris. Keeping an airport safe takes a hundred small jobs done well.')],
 'Every airport is a small city.',[
 mc('Who guides airplanes on the ramp?',['Ground handlers','Passengers','Pilots only','Birds'],'Ramp crew.'),
 mc('Who clears snow from runways?',['Maintenance crews','Passengers','Nobody','Tower'],'Airport staff.'),
 mc('What do operations staff watch for?',['Wildlife and debris','Clouds only','Stars','Cars'],'Runway safety.'),
 tf('Airport firefighters are part of the team.',true,'Yes.'),
 tf('An airport needs only a runway.',false,'Many services.'),
 fl('Fuelers add ___ to airplanes.',['fuel','paint','flags','fans'],'Fuel.')]),
L('cr-met','Meteorologists',[
 cd('Forecasting skies','Aviation meteorologists study weather and write forecasts for pilots and airlines. They use satellites, radar and computer models. Their work helps avoid storms and plan fuel.'),
 cd('Science and service','Meteorology blends science and communication. The best forecasters explain risk clearly. Some work for the National Weather Service; others for airlines or private companies.')],
 'Weather experts help every flight.',[
 mc('What do aviation meteorologists do?',['Forecast weather for flights','Fly planes','Repair engines','Sell fuel'],'Weather.'),
 mc('Which tool do they use?',['Satellites and radar','Spoons','Rakes','Books only'],'Data.'),
 mc('Who employs them?',['Weather services and airlines','Nobody','Only schools','Only shops'],'Many places.'),
 tf('Forecasts help avoid storms.',true,'Yes.'),
 tf('Meteorologists never talk to pilots.',false,'They help them.'),
 fl('Satellites and ___ help forecasts.',['radar','rakes','rugs','rings'],'Radar.')]),
L('cr-cargo','Cargo pilots',[
 cd('Moving freight','Cargo airlines fly packages, food, medicine and machines around the world. Many cargo flights happen at night. The pilots follow the same training as passenger airline pilots.'),
 cd('Why it matters','Air cargo moves time-sensitive goods quickly, such as medicines and fresh flowers. Some cargo pilots enjoy fewer passengers and a different schedule.')],
 'Cargo keeps the world connected.',[
 mc('What do cargo airlines fly?',['Packages and freight','Only people','Only mail from the Moon','Nothing'],'Freight.'),
 mc('When do many cargo flights happen?',['At night','Never','Only noon','Only winter'],'Overnight networks.'),
 mc('Which cargo is time-sensitive?',['Medicine','Rocks','Sand','Bricks'],'Needs speed.'),
 tf('Cargo pilots receive airline-level training.',true,'Yes.'),
 tf('Cargo airlines are rare.',false,'They are large.'),
 fl('Air ___ carries freight.',['cargo','canoe','cabin','castle'],'Cargo.')]),
L('cr-corp','Corporate and business aviation',[
 cd('Business jets','Businesses use private jets and turboprops to save time and reach small airports. Corporate pilots fly executives, medical teams and others. Schedules can change quickly.'),
 cd('Skills needed','Corporate pilots need strong customer service, precise flying and flexibility. They often plan trips, handle fuel and manage the airplane. Reputation and trust matter.')],
 'Flexible schedules, high standards.',[
 mc('Why do businesses use private aircraft?',['Save time and reach small airports','To be slow','For free','To hide'],'Flexibility.'),
 mc('What skill helps corporate pilots?',['Customer service','Cooking','Laughing','Singing'],'Professional.'),
 mc('How do schedules change?',['Quickly','Never','Once a decade','Slowly'],'On short notice.'),
 tf('Corporate pilots often plan their own trips.',true,'Yes.'),
 tf('Corporate flying has fixed schedules.',false,'They vary.'),
 fl('Business jets reach ___ airports.',['small','tiny moon','sea','sand'],'Small.')]),
L('cr-medevac','Medical flying',[
 cd('Air ambulances','Medical flights carry patients, organs and medical teams. Helicopters and airplanes serve as air ambulances. The crew includes pilots and medical staff who work together.'),
 cd('High stakes','Medical pilots fly in demanding conditions with careful risk assessment. Good judgment includes saying no to a flight when weather is unsafe. A safe arrival always comes first.')],
 'Save lives, but only if the flight is safe.',[
 mc('What do air ambulances carry?',['Patients and medical teams','Only mail','Only fruit','Only sand'],'Medical help.'),
 mc('What aircraft are used?',['Helicopters and airplanes','Only balloons','Only boats','Only cars'],'Both.'),
 mc('When should a medical pilot decline?',['When weather is unsafe','Never','When hungry','When bored'],'Safety first.'),
 tf('Pilots and medical staff work together.',true,'Yes.'),
 tf('Medical flights ignore risk.',false,'They assess it.'),
 fl('An air ___ moves patients.',['ambulance','antenna','anchor','alarm'],'Ambulance.')]),
L('cr-start','Starting your path',[
 cd('Steps you can take','Read about aviation, visit airports, take an introductory flight, join Civil Air Patrol or a youth aviation club, and keep good grades in math and science. Many programs welcome young people.'),
 cd('Keep it up','Stay curious, ask questions, find mentors and be patient. Careers grow step by step. Training is an investment, so plan for costs and look for scholarships.')],
 'Start small, stay curious.',[
 mc('Which is a good first step?',['Visit an airport','Quit school','Avoid math','Wait'],'Explore.'),
 mc('What can help with costs?',['Scholarships','Wishing','Luck only','Nothing'],'Plan.'),
 mc('Who can guide you?',['Mentors','Nobody','Strangers only','Birds'],'Find mentors.'),
 tf('Math and science help in aviation.',true,'Yes.'),
 tf('Careers happen overnight.',false,'They take steps.'),
 fl('Find a ___ who flies.',['mentor','mascot','mover','monster'],'Mentor.')])
]);
})();
