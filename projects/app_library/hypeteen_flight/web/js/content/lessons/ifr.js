/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* BEYOND 1 - INSTRUMENT FLYING (curious-cadet overview, not an FAA course) */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,mt,od,L}=H.dsl;
H.addLessons('ifr',[
L('if-what','What is IFR?',[
 cd('Flying by instruments','IFR means instrument flight rules. These rules let pilots fly in clouds and low visibility by trusting the instruments and air traffic control. VFR pilots must stay clear of clouds; IFR pilots can fly through them with proper training.'),
 cd('A separate rating','To fly IFR, a pilot earns an instrument rating. It takes extra training, a knowledge test and a practical test. The rating makes flights more reliable in poor weather, though it never makes it safe to ignore dangerous weather.')],
 'Instrument pilots fly in clouds by the book.',[
 mc('What does IFR stand for?',['Instrument flight rules','Inside fast route','Intense flying radio','Ice-free runway'],'Instrument rules.'),
 mc('What lets a pilot fly IFR?',['An instrument rating','A hat','A map only','A kite'],'Training.'),
 mc('Who helps IFR pilots?',['Air traffic control','Birds','Passengers only','Nobody'],'ATC.'),
 tf('IFR pilots can fly through clouds.',true,'With a rating.'),
 tf('An instrument rating makes all weather safe.',false,'It does not.'),
 fl('The opposite of IFR is ___.',['VFR','FBI','GPS','IMC'],'Visual flight rules.')]),
L('if-six','The six-pack',[
 cd('Core instruments','The basic instruments are airspeed indicator, attitude indicator, altimeter, turn coordinator, heading indicator and vertical speed indicator. Pilots call them the six-pack.'),
 cd('Cross-check','An instrument pilot scans them in a pattern, never staring at one. The attitude indicator is the main picture; the others show how well you are holding pitch, bank and power. Cross-checking catches small errors early.')],
 'Scan all six; don’t fixate on one.',[
 mc('How many instruments make up the six-pack?',['Six','Two','Ten','Twenty'],'The basics.'),
 mc('Which gives the main picture?',['Attitude indicator','Clock','Compass cover','Fuel gauge'],'Horizon.'),
 mc('What is a cross-check?',['Scanning instruments in a pattern','Looking out only','Closing eyes','Looking at one'],'Scan.'),
 tf('Fixating on one instrument is a mistake.',true,'Keep scanning.'),
 tf('The heading indicator shows altitude.',false,'It shows heading.'),
 mt('Match instrument to what it shows.',[['Altimeter','Altitude'],['ASI','Airspeed'],['VSI','Climb or descent rate']],'Basic six.')]),
L('if-imc','IMC and VMC',[
 cd('Weather categories','VMC means visual meteorological conditions: good enough to fly VFR. IMC means instrument meteorological conditions: clouds or low visibility where you need instruments. Weather reports use these terms.'),
 cd('Flight categories','Charts and reports color-code conditions: VFR green, marginal VFR blue, IFR red and low IFR magenta. Even an instrument pilot must watch limits. An instrument rating does not allow flight in thunderstorms or severe icing.')],
 'Know the difference between VMC and IMC.',[
 mc('What does IMC mean?',['Instrument meteorological conditions','Inside map code','Intense motor control','Ice and mist clouds'],'IMC.'),
 mc('Which color often marks IFR weather?',['Red','Green','Yellow','Pink'],'Red.'),
 mc('Which conditions allow VFR?',['VMC','IMC','Thunderstorms','Fog'],'VMC.'),
 tf('An instrument rating allows flight through thunderstorms.',false,'No.'),
 tf('Weather categories help pilots plan.',true,'Yes.'),
 fl('Good weather for VFR is ___.',['VMC','IMC','LIFR','IFR'],'VMC.')]),
L('if-hood','Foggles and hood work',[
 cd('Practicing blind','Student instrument pilots wear a hood or foggles, glasses that block the view outside. This simulates clouds. An instructor or safety pilot watches for traffic.'),
 cd('Safety pilot','A safety pilot sits beside you and keeps a lookout for other aircraft while you practice under the hood. They must be properly rated. Simulated instrument flight is never done alone.')],
 'A safety pilot always watches outside.',[
 mc('What do foggles do?',['Block the view outside','Add wind','Add lights','Cool the cabin'],'Simulate clouds.'),
 mc('Who watches for traffic?',['A safety pilot','Nobody','The hood','The seat'],'Lookout.'),
 mc('Is hood practice done alone?',['No','Yes','Always','Never mind'],'Safety first.'),
 tf('Foggles simulate clouds.',true,'Yes.'),
 tf('Safety pilots sleep during hood work.',false,'They keep watch.'),
 fl('A pilot who watches outside is a ___ pilot.',['safety','sleepy','side','sky'],'Safety.')]),
L('if-clear','IFR clearances',[
 cd('Permission to go','Before an IFR flight, a pilot files a flight plan and receives a clearance from ATC. It includes the route, an altitude and a transponder code. CRAFT is a way to remember the parts: Clearance limit, Route, Altitude, Frequency, Transponder.'),
 cd('Read it back','The pilot reads back the clearance to make sure it is right. If anything is unclear, ask. Errors in clearances can cause confusion in the system, so clarity is key.')],
 'CRAFT: Clearance, Route, Altitude, Frequency, Transponder.',[
 mc('What does the C in CRAFT mean?',['Clearance limit','Cloud','Clock','Compass'],'Where you can go.'),
 mc('What does the T mean?',['Transponder code','Tower','Time','Taxi'],'Squawk.'),
 mc('Why read back a clearance?',['To confirm it is correct','To be loud','To waste time','No reason'],'Accuracy.'),
 tf('ATC gives IFR clearances.',true,'Yes.'),
 tf('You should guess unclear parts.',false,'Ask.'),
 od('Put the first three CRAFT items in order.',['Clearance limit','Route','Altitude'],'C, R, A.')]),
L('if-sid','Departures and SIDs',[
 cd('Leaving the airport','IFR departures may follow a published procedure called a Standard Instrument Departure, or SID. A SID guides you from the airport to the enroute system and keeps you clear of terrain and other traffic.'),
 cd('Obstacle departure','Some airports have an obstacle departure procedure with a minimum climb rate. This keeps the airplane safely above terrain after takeoff. Pilots check it during planning to be sure the airplane can meet it.')],
 'Plan your departure before you taxi.',[
 mc('What is a SID?',['Standard Instrument Departure','Simple Ice Detector','Slow Ice Drop','Safe Ice Day'],'A departure route.'),
 mc('Why use a departure procedure?',['To clear terrain and traffic','To save fuel','To be quiet','To tour'],'Safe path.'),
 mc('When do you check it?',['During planning','After landing','Never','At night only'],'Before takeoff.'),
 tf('Some departures have a minimum climb rate.',true,'Yes.'),
 tf('SIDs are for landings.',false,'They are for departures.'),
 fl('A departure procedure keeps you clear of ___.',['terrain','sandwiches','songs','shade'],'Terrain.')]),
L('if-enroute','Enroute IFR',[
 cd('Airways','Airways are highways in the sky. Victor airways serve low altitudes; jet routes serve high altitudes. Charts show their names, the headings and minimum altitudes between navaids.'),
 cd('Minimum altitudes','A Minimum Enroute Altitude, MEA, guarantees navigation signals and obstacle clearance. A Minimum Obstruction Clearance Altitude, MOCA, guarantees obstacle clearance only. Pilots never fly below the minimum without permission.')],
 'Stay at or above the published minimum altitude.',[
 mc('What are Victor airways?',['Low-altitude airways','Rivers','Runways','Radio towers'],'Sky highways.'),
 mc('What does MEA protect?',['Signals and obstacle clearance','Fuel','Radios','Seats'],'Safe altitude.'),
 mc('What do jet routes serve?',['High altitudes','Low altitudes','Water only','Roads'],'Above 18,000.'),
 tf('Pilots must respect minimum altitudes.',true,'Yes.'),
 tf('Airways have no altitudes.',false,'They do.'),
 fl('MEA stands for minimum enroute ___.',['altitude','airspeed','arrival','area'],'Altitude.')]),
L('if-appr','Instrument approaches',[
 cd('Down through the clouds','An instrument approach guides the airplane from the enroute phase to a point where the pilot can see the runway. It is shown on an approach plate with headings, altitudes, and a decision point.'),
 cd('Types','A precision approach gives both left-right and glide path guidance, like an ILS. A non-precision approach gives only left-right guidance. Modern GPS approaches can provide both with WAAS.')],
 'ILS gives lateral and vertical guidance.',[
 mc('What does ILS give?',['Left-right and glide path guidance','Only weather','Only speed','Only time'],'Precision.'),
 mc('What shows approach details?',['An approach plate','A sandwich','A diary','A sign'],'Chart.'),
 mc('Non-precision gives…',['Left-right guidance only','Both','None','Weather'],'Lateral only.'),
 tf('GPS approaches exist.',true,'Many.'),
 tf('Approaches begin at the runway.',false,'They start far out.'),
 fl('ILS stands for instrument ___ system.',['landing','laughing','lifting','loading'],'Landing.')]),
L('if-da','Decision altitude and missed approach',[
 cd('The decision point','On an ILS, the pilot descends to the decision altitude, or DA. At DA, if the runway environment is in sight and the airplane is in position, continue to land. If not, execute a missed approach.'),
 cd('Go around by the book','A missed approach is a published procedure that climbs and turns to a holding or safe point. It is not a failure. The pilot decides before the approach to follow it if needed.')],
 'See the runway at DA or go missed.',[
 mc('What happens at DA with no runway in sight?',['Missed approach','Keep descending','Land anyway','Turn off radio'],'Go missed.'),
 mc('What is a missed approach?',['A published escape procedure','A wrong turn','A joke','A radio call'],'A safe plan.'),
 mc('When do you decide to go missed?',['Before the approach, with a plan','After landing','Never','Randomly'],'Be ready.'),
 tf('A missed approach is a normal option.',true,'Yes.'),
 tf('You may descend below DA without the runway.',false,'Not allowed.'),
 fl('DA stands for decision ___.',['altitude','airspeed','aircraft','arrival'],'Altitude.')]),
L('if-hold','Holding patterns',[
 cd('Waiting in the sky','A holding pattern is an oval racetrack flown to wait. ATC uses it to keep aircraft separated when delays occur. Standard holds use right turns; one leg takes about one minute at lower altitudes.'),
 cd('Entering','Pilots enter a hold in one of three ways: direct, parallel or teardrop, depending on the heading. They report entering the hold and follow the instructions given by ATC.')],
 'Hold = racetrack with standard right turns.',[
 mc('What is a holding pattern?',['An oval racetrack to wait','A landing','A parking spot','A taxiway'],'Waiting.'),
 mc('Standard hold turns are…',['Right','Left','Straight','Random'],'Right turns.'),
 mc('How many ways to enter a hold?',['Three','One','Ten','Zero'],'Direct, parallel, teardrop.'),
 tf('ATC uses holds to separate traffic.',true,'Yes.'),
 tf('Holds use left turns by default.',false,'Right turns.'),
 mt('Match the hold entry.',[['Direct','Join and turn'],['Parallel','Fly opposite, then cross'],['Teardrop','Angle out, then turn']],'Three types.')]),
L('if-ice','Ice and instrument flying',[
 cd('Danger in clouds','Clouds with freezing water can coat the wings with ice. Ice adds weight, hurts lift and can block instruments. Many small airplanes are not approved for flight in known icing.'),
 cd('Avoiding it','Check forecasts, pilot reports and freezing level before departure. If ice forms, leave the area right away: descend to warmer air, climb above clouds or turn back. Never rely on hope.')],
 'Leave icing quickly; never press on.',[
 mc('What does ice do to a wing?',['Reduces lift','Adds lift','Cools it','Speeds it'],'Hurts performance.'),
 mc('What should you do if ice forms?',['Leave the area','Stay','Climb in cloud forever','Ignore it'],'Escape.'),
 mc('Where do you look for icing info?',['Forecasts and pilot reports','Cookbooks','Cartoons','Posters'],'Weather sources.'),
 tf('Many small airplanes can’t fly in known icing.',true,'Yes.'),
 tf('A little ice is harmless.',false,'It is dangerous.'),
 fl('Freezing level is where water turns to ___.',['ice','steam','smoke','sand'],'Ice.')]),
L('if-trust','Trusting the gauges',[
 cd('The famous lesson','The most important instrument lesson is to believe the instruments over your body. In clouds, you will feel turns or climbs that are not there. Pilots who trust their feelings can lose control.'),
 cd('Practice','Instrument training builds trust through practice. Pilots learn to scan, interpret and act smoothly. Regular practice keeps skills current. Every instrument pilot must stay proficient.')],
 'Believe the instruments.',[
 mc('Whom should you believe in clouds?',['The instruments','Your body','A hunch','A friend'],'Gauges.'),
 mc('What keeps skills current?',['Regular practice','Luck','Waiting','Sleep'],'Proficiency.'),
 mc('What can feelings do in clouds?',['Mislead you','Help you','Fly for you','Fix engines'],'Illusions.'),
 tf('Instrument pilots must stay proficient.',true,'Yes.'),
 tf('You can trust your inner ear in clouds.',false,'You cannot.'),
 fl('Instrument skills need regular ___.',['practice','rest','snacks','paint'],'Practice.')])
]);
})();
