/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* BEYOND 9 - MILITARY + SPACE */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,od,L}=H.dsl;
H.addLessons('mil',[
L('ml-path','Military flight training',[
 cd('Becoming a military pilot','Military pilots train through programs run by the Air Force, Navy, Marine Corps, Army and Coast Guard. Candidates usually earn a college degree, pass physical and aptitude tests, and complete rigorous flight training.'),
 cd('Tracks','Training starts with basic flying, then branches into tracks such as jets, helicopters or transports. Students earn wings after passing each phase. Military service also teaches leadership.')],
 'Wings are earned phase by phase.',[
 mc('Which branch trains pilots?',['Air Force','Chess Club','Library','Zoo'],'Armed services.'),
 mc('What do students earn after training?',['Wings','Wheels','Whistles','Webs'],'Pilot wings.'),
 mc('Which can they specialize in?',['Jets, helicopters or transports','Cooking only','Painting only','Nothing'],'Tracks.'),
 tf('Candidates pass physical and aptitude tests.',true,'Yes.'),
 tf('Military flight training is easy.',false,'It is rigorous.'),
 fl('Pilots earn their ___.',['wings','shoes','keys','stars'],'Wings.')]),
L('ml-fighter','Fighter pilots',[
 cd('High performance','Fighter pilots fly fast, agile jets. They experience high G-forces, which push blood away from the brain. Pilots wear G-suits and learn breathing and muscle-tensing techniques to stay conscious.'),
 cd('Teamwork','Even in single-seat jets, fighter pilots work as part of a flight of aircraft. They rely on wingmen, controllers and maintainers. Briefings and debriefings are thorough.')],
 'G-forces demand training and fitness.',[
 mc('What is a G-force?',['Force from acceleration','A radio code','A fuel type','A cloud'],'Feels like extra weight.'),
 mc('What helps pilots handle G?',['G-suits and training','Sleeping','Cooking','Singing'],'Preparation.'),
 mc('Do fighter pilots work alone?',['No, they work as a team','Yes always','Never fly','Only on weekends'],'Wingmen and crews.'),
 tf('High G can push blood from the brain.',true,'Yes.'),
 tf('Debriefs are skipped.',false,'They are thorough.'),
 fl('A G-___ helps with high G.',['suit','sock','seat','sign'],'Suit.')]),
L('ml-heli','Military helicopters',[
 cd('Versatile machines','Military helicopters transport troops, carry cargo, search and rescue, and provide medical evacuation. Pilots fly low and close to terrain, which requires great skill.'),
 cd('Crew','Helicopter crews often include a pilot, co-pilot, crew chief and medics. The crew chief checks the aircraft and helps with loading. Teamwork is essential in rough conditions.')],
 'Low-level flying needs great skill.',[
 mc('What is MEDEVAC?',['Medical evacuation','Mountain eagle','Military education','Moon express'],'Medical flights.'),
 mc('Who checks the aircraft?',['Crew chief','Passenger','Cook','Driver'],'Crew.'),
 mc('Why is low-level flying hard?',['Close to terrain','Too slow','Too loud','Too wide'],'Obstacles.'),
 tf('Helicopters can do search and rescue.',true,'Yes.'),
 tf('Helicopter crews are always one person.',false,'Several members.'),
 fl('Crew ___ helps load and check.',['chief','cook','clerk','clown'],'Chief.')]),
L('ml-carrier','Carrier aviation',[
 cd('Runway at sea','Navy pilots land on aircraft carriers, short runways on moving ships. They use arresting wires to stop. Landing Signal Officers help guide approaches. It is one of aviation’s toughest challenges.'),
 cd('Launch','Aircraft launch with catapults that accelerate them to flying speed in about two seconds. Deck crews in colored shirts handle the airplanes and work with great care.')],
 'A short runway that moves.',[
 mc('What stops a landing airplane on a carrier?',['Arresting wires','Rubber bands','Brakes only','Wind only'],'Tailhook catches a wire.'),
 mc('What launches aircraft?',['Catapults','Springs on wings','Boats','Balloons'],'Steam or electric.'),
 mc('Who guides pilots in?',['Landing Signal Officers','Cooks','Divers','Tourists'],'LSOs.'),
 tf('Carrier runways are short.',true,'Yes.'),
 tf('Carrier landings are easy.',false,'They are very hard.'),
 fl('The carrier deck is a floating ___.',['runway','road','river','roof'],'Runway.')]),
L('ml-tanker','Aerial refueling',[
 cd('Gas stations in the sky','Tanker aircraft refuel other aircraft in flight. A boom or hose connects the tanker to the receiver. It extends range so aircraft can fly long missions without landing.'),
 cd('Precision flying','The receiving pilot flies in tight formation behind the tanker. Boom operators or hose systems guide the connection. It requires calm, steady skill.')],
 'Precise flying in formation.',[
 mc('What is a tanker?',['An airplane that refuels others','A boat','A truck','A balloon'],'Aerial refueling.'),
 mc('What does refueling extend?',['Range','Wings','Weight','Radio'],'Longer missions.'),
 mc('How do aircraft connect?',['A boom or hose','A rope','A chain','A bridge'],'Fuel line.'),
 tf('Refueling needs precise flying.',true,'Yes.'),
 tf('Tankers carry no fuel.',false,'They carry lots.'),
 fl('A ___ delivers fuel in the air.',['tanker','tractor','trailer','tugboat'],'Tanker.')]),
L('ml-test','Test pilots',[
 cd('Trying new aircraft','Test pilots fly new or modified airplanes to see how they perform. They push limits carefully, record data and report problems. Engineers plan each test flight in detail.'),
 cd('Famous schools','Test pilot schools such as the U.S. Air Force Test Pilot School and the U.S. Naval Test Pilot School train experienced pilots in engineering and test methods.')],
 'Careful planning, careful data.',[
 mc('What do test pilots do?',['Try and evaluate new aircraft','Sell tickets','Cook meals','Direct traffic'],'Evaluation.'),
 mc('Who plans the tests?',['Pilots and engineers','Birds','Passengers','Nobody'],'Teamwork.'),
 mc('What do they record?',['Data','Songs','Recipes','Jokes'],'Results.'),
 tf('Test flights are planned in detail.',true,'Yes.'),
 tf('Test pilots fly without plans.',false,'Very planned.'),
 fl('A test ___ evaluates aircraft.',['pilot','pirate','painter','plumber'],'Pilot.')]),
L('ml-yeager','Breaking the sound barrier',[
 cd('Chuck Yeager','On October 14, 1947, test pilot Chuck Yeager flew the Bell X-1 faster than the speed of sound. It was launched from the bomb bay of a B-29. The flight proved that supersonic flight was possible.'),
 cd('Beyond','Many pilots and engineers contributed to this effort. The X-1 program led to faster jets, new wing shapes and later spaceflight research.')],
 'First supersonic flight: 1947.',[
 mc('Who flew the Bell X-1 past Mach 1?',['Chuck Yeager','Neil Armstrong','Amelia Earhart','Orville Wright'],'1947.'),
 mc('What carried the X-1 aloft?',['A B-29','A balloon','A helicopter','A boat'],'Mother ship.'),
 mc('What did the flight prove?',['Supersonic flight was possible','Planes can’t fly','The Earth is flat','Nothing'],'Breakthrough.'),
 tf('Many people contributed to the effort.',true,'Yes.'),
 tf('The X-1 took off from a runway under its own power.',false,'It was air-launched.'),
 fl('Mach 1 is the speed of ___.',['sound','light','wind','sleep'],'Sound.')]),
L('ml-xplane','X-planes',[
 cd('Experimental aircraft','X-planes are experimental aircraft built to test new ideas. The X-15 reached the edge of space. Other X-planes tested new wings, engines and control systems.'),
 cd('Lasting lessons','Lessons from X-planes shaped airliners, spacecraft and fighters. Many safety improvements started as test results from these brave flights.')],
 'Experimental craft push the limits.',[
 mc('What are X-planes?',['Experimental aircraft','Cargo planes','Toy planes','Seaplanes'],'Test machines.'),
 mc('Which reached the edge of space?',['X-15','Cessna 172','Piper Cub','Comet'],'Rocket plane.'),
 mc('What did they influence?',['Airliners and spacecraft','Cars only','Boats only','Food'],'Wide impact.'),
 tf('Test results improved safety.',true,'Yes.'),
 tf('X-planes are common airliners.',false,'They are experimental.'),
 fl('X-planes test new ___.',['ideas','ink','ice','inns'],'Ideas.')]),
L('ml-nasa','NASA pilots and astronauts',[
 cd('Pilots in space','Many astronauts begin as military or test pilots. They fly the Space Shuttle, once landed like a glider, and now fly spacecraft. NASA also chooses scientists and engineers as astronauts.'),
 cd('Training','Astronaut candidates train in survival, spacewalks, robotics and flying T-38 jets. Teamwork and calm under pressure matter most.')],
 'Astronauts train like pilots and scientists.',[
 mc('Where do many astronauts start?',['As pilots','As chefs','As clowns','As drivers'],'Many do.'),
 mc('Which jet do astronauts train in?',['T-38','Cub','Comet','Cessna'],'T-38 Talon.'),
 mc('Who else becomes an astronaut?',['Scientists and engineers','Nobody','Only birds','Only kids'],'Diverse backgrounds.'),
 tf('The Space Shuttle landed like a glider.',true,'Unpowered landings.'),
 tf('Astronauts avoid teamwork.',false,'Teamwork is vital.'),
 fl('NASA stands for National Aeronautics and Space ___.',['Administration','Association','Academy','Arena'],'Administration.')]),
L('ml-apollo','Apollo and the Moon',[
 cd('First steps','On July 20, 1969, Apollo 11 landed on the Moon. Neil Armstrong and Buzz Aldrin walked on the surface while Michael Collins orbited above in the command module.'),
 cd('Pilot skills','Armstrong, a former test pilot, took manual control of the lunar module to avoid boulders and land safely. Pilot judgment helped save the mission.')],
 'Apollo 11: July 20, 1969.',[
 mc('Which mission first landed on the Moon?',['Apollo 11','Gemini 3','Mercury 1','Voyager'],'1969.'),
 mc('Who stayed in orbit?',['Michael Collins','Neil Armstrong','Buzz Aldrin','Chuck Yeager'],'Command module pilot.'),
 mc('What did Armstrong avoid?',['Boulders','Clouds','Rain','Wires'],'Manual landing.'),
 tf('Armstrong was a test pilot.',true,'Yes.'),
 tf('Apollo 11 landed in 1959.',false,'It was 1969.'),
 od('Put these in order.',['Launch','Moon landing','Return to Earth'],'Mission order.')]),
L('ml-shuttle','The Space Shuttle',[
 cd('A winged spacecraft','The Space Shuttle launched like a rocket, orbited Earth and landed like an airplane. It flew 135 missions from 1981 to 2011. It carried satellites, built the International Space Station and launched the Hubble Space Telescope.'),
 cd('Landing','The shuttle glided without engines, landing at about 200 knots. Commanders practiced in a special training jet that flew the same steep glide path.')],
 'Rocket up, glider down.',[
 mc('How did the shuttle land?',['Like a glider','By parachute only','By helicopter','By boat'],'Unpowered.'),
 mc('How many missions did it fly?',['135','13','1,350','3'],'1981–2011.'),
 mc('What did it help build?',['The International Space Station','The Eiffel Tower','The Panama Canal','A bridge'],'ISS.'),
 tf('It carried satellites.',true,'Yes.'),
 tf('The shuttle used jet engines to land.',false,'It glided.'),
 fl('The shuttle launched like a ___.',['rocket','kite','bike','boat'],'Rocket.')]),
L('ml-iss','Life on the Space Station',[
 cd('A lab in orbit','The International Space Station orbits Earth about every 90 minutes at 17,500 miles per hour. Crews from many countries live and work there, doing experiments in weightlessness.'),
 cd('Daily routine','Astronauts exercise two hours daily to keep muscles and bones strong. They eat, sleep and work in microgravity. Spacewalks need careful planning and teamwork.')],
 'Teamwork from many nations.',[
 mc('How long does the ISS take to orbit once?',['About 90 minutes','About 90 days','About 9 seconds','About 9 hours'],'Fast orbit.'),
 mc('Why exercise daily?',['Keep muscles and bones strong','To get tired','To be tall','To be loud'],'Microgravity.'),
 mc('Who lives on the ISS?',['Crews from many countries','Only one nation','Nobody','Only robots'],'International.'),
 tf('The ISS is a science lab.',true,'Yes.'),
 tf('Astronauts feel normal gravity on the ISS.',false,'They float.'),
 fl('The ISS is an international space ___.',['station','shop','school','show'],'Station.')])
]);
})();
