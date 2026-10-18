/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* PRIVATE PILOT 12 - WEIGHT, BALANCE, PERFORMANCE */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,od,L}=H.dsl;
H.addLessons('loading',[
L('ld-weight','Why weight matters',[
 cd('Heavier is harder','A heavier airplane needs more speed to take off, a longer runway, and climbs more slowly. It also stalls at a higher speed and has less reserve. Each airplane has a maximum weight set by the maker.'),
 cd('Weight terms','Empty weight is the airplane with fixed equipment and oil. Useful load is what you can add: pilot, passengers, bags and fuel. Gross weight is the total at any moment. Never exceed maximum gross weight.')],
 'Stay at or below maximum weight.',[
 mc('What does useful load include?',['People, bags and fuel','Wings','Engine','Tires'],'What you can add.'),
 mc('Heavier airplanes need…',['A longer takeoff run','A shorter run','No runway','Less fuel'],'More distance.'),
 mc('Who sets maximum weight?',['The manufacturer','The tower','Passengers','The weather'],'In the manual.'),
 tf('A heavier plane stalls at a higher speed.',true,'Less margin.'),
 tf('You may exceed max weight if the day is cool.',false,'Never.'),
 fl('The weight you can add is the useful ___.',['load','lift','line','level'],'Useful load.')]),
L('ld-fuelw','Fuel weight',[
 cd('Weights to remember','Aviation gasoline weighs 6 pounds per gallon. Jet fuel weighs about 6.7 pounds per gallon. Oil weighs about 7.5 pounds per gallon. Pilots use these numbers to figure weight.'),
 cd('A quick example','If you add 30 gallons of avgas, that is 30 times 6 pounds, or 180 pounds. A full tank adds a lot of weight, so a plane may not be able to carry both full tanks and four adults. Plan the trade-off.')],
 'Avgas: 6 pounds per gallon.',[
 mc('How much does a gallon of avgas weigh?',['6 pounds','1 pound','60 pounds','600 pounds'],'Six.'),
 mc('How much do 20 gallons of avgas weigh?',['120 pounds','20 pounds','60 pounds','200 pounds'],'20 × 6.'),
 mc('Which is heavier per gallon?',['Oil','Avgas','Both equal','Air'],'7.5 vs 6.'),
 tf('A full tank can limit how many passengers fit.',true,'Trade-offs.'),
 tf('Fuel has no weight.',false,'It is heavy.'),
 fl('Avgas weighs ___ pounds per gallon.',['6','60','0','600'],'Six.')]),
L('ld-cg','Balance and center of gravity',[
 cd('The balance point','The center of gravity, or CG, is the point where the airplane would balance. It must stay within limits set by the maker. Too far forward or too far back makes the airplane hard to control.'),
 cd('Nose heavy or tail heavy','Nose-heavy airplanes need more elevator to flare and fly with higher stall speed. Tail-heavy airplanes are less stable and may be hard to recover from a stall. Staying within limits keeps the airplane safe.')],
 'Keep the CG inside the limits.',[
 mc('What is the CG?',['The balance point','The engine','A radio','A map'],'Center of gravity.'),
 mc('Which is dangerous?',['Tail-heavy loading','Loading inside limits','Planning','Checking'],'Poor stability.'),
 mc('Who sets the CG limits?',['The manufacturer','Passengers','The tower','The sun'],'In the manual.'),
 tf('CG must stay within limits.',true,'Always.'),
 tf('Tail-heavy is more stable.',false,'It is less stable.'),
 fl('The CG is the airplane’s ___ point.',['balance','landing','fuel','radio'],'Center of gravity: where it balances.')]),
L('ld-moment','Moments and arms',[
 cd('Arm and moment','The arm is the distance from a reference line, called the datum, to an item. Moment is weight multiplied by arm. Pilots add up weights and moments, then divide to find the CG.'),
 cd('A simple example','Suppose a 150-pound pilot sits 40 inches from the datum. Moment equals 150 × 40, or 6,000 pound-inches. Do this for each item. The total moment divided by total weight gives the CG.')],
 'Moment = weight × arm.',[
 mc('What is moment?',['Weight × arm','Weight + arm','Weight − arm','Arm only'],'Multiply.'),
 mc('What is a datum?',['A reference line','A radio','A tire','A cloud'],'Where measuring starts.'),
 mc('A 100-pound bag at 50 inches has what moment?',['5,000','150','50','500'],'100 × 50.'),
 tf('CG equals total moment divided by total weight.',true,'That is the method.'),
 tf('The arm is a weight.',false,'It is a distance.'),
 fl('Moment equals weight times ___.',['arm','wing','air','fuel'],'Arm.')]),
L('ld-wb','Weight and balance sheet',[
 cd('Steps','Start with the basic empty weight and moment from the airplane’s record. Add pilot, passengers, bags and fuel, each with weight and moment. Total them. Check that the weight and CG fit the envelope in the manual.'),
 cd('Use the real numbers','Never guess at passenger weights; use actual ones. Use the current weight and balance record for that exact airplane, because equipment changes can alter it. Do it before each flight where loading changes.')],
 'Total up, then check the envelope.',[
 mc('Where do you start?',['Empty weight and moment','Fuel price','Speed','Time'],'Base numbers.'),
 mc('Why use actual passenger weights?',['Guessing can cause errors','It is polite','It is required for fun','No reason'],'Accuracy.'),
 mc('Where do you check the final CG?',['The envelope in the manual','A radio','A map','A tire'],'Within limits.'),
 tf('Each airplane has its own weight and balance record.',true,'Equipment varies.'),
 tf('You can reuse old numbers forever.',false,'Update after changes.'),
 od('Put the steps in order.',['Find empty weight','Add people, bags, fuel','Total weight and moment','Check the envelope'],'Build up then check.')]),
L('ld-env','The CG envelope',[
 cd('A safe shape','The CG envelope is a graph showing safe combinations of weight and CG position. If the point for your load is inside the shape, it is within limits. If it is outside, you must change the loading.'),
 cd('Fixing a problem','To fix a CG problem, move baggage, rearrange passengers or take less fuel. Moving weight toward the nose or tail shifts the CG. If weight is too high, remove items. Never fly outside the envelope.')],
 'Inside the envelope is safe; outside is not.',[
 mc('What does the envelope show?',['Safe weight and CG combinations','Fuel prices','Wind','Time'],'Limits.'),
 mc('If the point is outside the envelope…',['Change the loading','Fly anyway','Ignore it','Add fuel'],'Fix it.'),
 mc('Which can fix a CG problem?',['Move baggage','Paint','Wash','Honk'],'Redistribute weight.'),
 tf('Rearranging passengers can shift the CG.',true,'Weight moves.'),
 tf('Slightly outside the envelope is fine.',false,'It is not.'),
 fl('The CG ___ is the safe zone.',['envelope','wing','tail','map'],'Envelope.')]),
L('ld-da','Density altitude',[
 cd('Thin air','Density altitude is the altitude the airplane feels, based on temperature and pressure. High, hot and humid days make the air thinner, so density altitude is higher. Thin air means less lift, less engine power and less propeller thrust.'),
 cd('Hot and high','A runway at 5,000 feet on a hot day may feel like 8,000 feet. The airplane takes more runway and climbs poorly. Plan with the performance charts, fly early in the day, and consider taking less load.')],
 'Hot, high, humid means poor performance.',[
 mc('What makes density altitude higher?',['Hot temperature','Cold temperature','Clouds only','Night only'],'Thin air.'),
 mc('Higher density altitude means…',['Longer takeoff roll','Shorter roll','More power','Less weight'],'Poorer performance.'),
 mc('When is a good time to fly in hot places?',['Early in the day','Noon','Never','Midnight only'],'Cooler air.'),
 tf('Thin air reduces lift and power.',true,'Yes.'),
 tf('Humidity improves performance.',false,'It hurts it.'),
 fl('Density ___ is felt altitude.',['altitude','airport','airspeed','area'],'Density altitude.')]),
L('ld-toperf','Takeoff performance',[
 cd('The chart','The manual has takeoff charts. You enter with pressure altitude, temperature, weight and wind. The chart gives the ground roll and the distance to clear a 50-foot obstacle.'),
 cd('Add a margin','Charts assume a new airplane flown by an expert, on a hard dry runway. Real life is worse. Pilots add a margin, often 50 percent or more, and check that the runway is well beyond that number.')],
 'Use the chart and add a safety margin.',[
 mc('What does the takeoff chart give?',['Distance to take off and clear an obstacle','Fuel prices','Menus','Songs'],'Ground roll and 50 feet.'),
 mc('Why add a margin?',['Real conditions are worse than the chart','It is fun','The chart is wrong','No reason'],'Safety.'),
 mc('Which are chart inputs?',['Weight, temperature, altitude, wind','Name, age, color','Radio, song, map','None'],'Inputs.'),
 tf('A headwind shortens the takeoff run.',true,'Yes.'),
 tf('The chart assumes tired pilots.',false,'It assumes expert technique.'),
 fl('Headwinds ___ the takeoff run.',['shorten','lengthen','erase','ignore'],'Shorten.')]),
L('ld-climb','Climb and cruise performance',[
 cd('Climb charts','Climb charts show rate of climb and time, fuel and distance to climb at different altitudes. Climb is slower with more weight, heat or altitude. Plan so you can clear terrain along your route.'),
 cd('Cruise charts','Cruise charts show speed and fuel flow at different power settings and altitudes. Leaner settings save fuel but may reduce speed. Use the charts to estimate range and endurance and to plan fuel stops.')],
 'Charts tell you what to expect up high.',[
 mc('Climb performance gets worse with…',['Higher weight','Lower weight','Cooler air','Headwinds only'],'More weight.'),
 mc('What do cruise charts show?',['Speed and fuel flow','Colors','Songs','Names'],'Planning data.'),
 mc('Why plan the climb?',['To clear terrain','To be fast','To avoid maps','No reason'],'Terrain.'),
 tf('Endurance is how long you can fly.',true,'Based on fuel.'),
 tf('Range is how long you can fly in hours.',false,'Range is distance.'),
 fl('Range is measured in ___.',['miles','minutes','pounds','colors'],'Miles.')]),
L('ld-land','Landing performance',[
 cd('Landing distance','The landing chart gives the ground roll and the distance to clear a 50-foot obstacle. Heavier weights, tailwinds, hot air and high altitude all make landing distances longer. Wet or slippery runways make it worse.'),
 cd('Decide ahead','Before you land, compare the chart distance to the runway length with a margin. If there is not enough room, choose a longer runway or a different airport. A go-around is always an option if the landing is not going well.')],
 'Compare the runway to your landing distance.',[
 mc('What makes landing distance longer?',['Tailwind','Headwind','Cooler air','Less weight'],'A tailwind adds distance.'),
 mc('What if the runway is too short?',['Choose another one','Land anyway','Close your eyes','Wait'],'Pick a safe option.'),
 mc('What is always available if landing goes poorly?',['A go-around','A nap','A dance','Nothing'],'Go around.'),
 tf('Wet runways increase landing distance.',true,'Less braking.'),
 tf('A tailwind shortens the landing.',false,'It lengthens it.'),
 fl('A ___ is a safe escape from a bad landing.',['go-around','dive','roll','flip'],'Go-around.')])
]);
})();
