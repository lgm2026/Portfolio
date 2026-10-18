/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* PRIVATE PILOT 7 - PLOTTING A COURSE: kinds of navigation, latitude and longitude, true and magnetic, wind triangles, time-speed-distance, fuel, logs, the E6B, diversions. */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,mt,od,L}=H.dsl;
H.addLessons('navplot',[
L('np-kinds','Four ways to navigate',[
 cd('Pilotage and dead reckoning','Pilotage is flying by looking at landmarks and matching them to a chart. Dead reckoning is computing where you should be from your course, speed, wind and time. Many pilots use both together.'),
 cd('Radio and GPS','Radio navigation uses ground stations like VORs. GPS uses signals from satellites to tell your exact position. Every pilot should still be able to navigate by chart and clock, because electronics can fail.')],
 'Chart and clock first, electronics as backup.',[
 mc('What is pilotage?',['Navigating by landmarks','Navigating by stars only','Navigating by radio only','Navigating by luck'],'Matching the ground to the chart.'),
 mc('What is dead reckoning?',['Computing position from course, speed and time','Guessing','A radio method','Satellite navigation'],'Math and a clock.'),
 mc('Why keep chart skills if you have GPS?',['Electronics can fail','GPS is illegal','Charts are free','It looks nice'],'Backups matter.'),
 tf('GPS uses signals from satellites.',true,'It finds your position.'),
 tf('A pilot should only ever rely on one tool.',false,'Use several.'),
 mt('Match the method to its tool.',[['Pilotage','Landmarks and chart'],['Dead reckoning','Math and a clock'],['GPS','Satellites']],'Different methods use different tools.')]),
L('np-ll','Latitude and longitude',[
 cd('A grid on the Earth','Lines of latitude, called parallels, run east and west and measure how far north or south you are from the equator. Lines of longitude, called meridians, run north and south and measure how far east or west you are from the prime meridian.'),
 cd('Nautical miles','One degree of latitude equals 60 nautical miles, and one minute equals one nautical mile. That makes it easy to measure distance on a chart by looking at the latitude scale on the sides. Longitude lines get closer together toward the poles.')],
 'A minute of latitude is a nautical mile.',[
 mc('Which lines run east and west?',['Parallels of latitude','Meridians','Contours','Isobars'],'Latitude lines are parallel to the equator.'),
 mc('How many nautical miles are in a degree of latitude?',['60','6','600','1'],'Sixty nautical miles.'),
 mc('What does longitude measure?',['East-west position','North-south position','Altitude','Speed'],'Distance from the prime meridian.'),
 tf('One minute of latitude is one nautical mile.',true,'It is a handy fact.'),
 tf('Meridians run east and west.',false,'They run north and south.'),
 fl('Lines of latitude are also called ___.',['parallels','meridians','isobars','contours'],'Parallels.')]),
L('np-tm','True and magnetic north',[
 cd('Two norths','True north is the geographic North Pole. Magnetic north is where a compass points, and it is in a different place. The angle between them where you are is called magnetic variation. It is shown on charts as dashed magenta lines.'),
 cd('Converting','Courses drawn on a chart are true courses. To get a magnetic course, subtract easterly variation or add westerly variation. A memory aid: “East is least, west is best.” Easterly variation makes the number smaller and westerly makes it bigger.')],
 'East is least, west is best.',[
 mc('Which chart lines show magnetic variation?',['Dashed magenta lines','Solid blue lines','Brown contour lines','Green dots'],'The amount depends on where you are.'),
 mc('True course 090 with 10 degrees east variation. What is the magnetic course?',['080','100','090','010'],'East is least: subtract 10.'),
 mc('True course 090 with 10 degrees west variation. What is the magnetic course?',['100','080','090','190'],'West is best: add 10.'),
 tf('Chart courses are measured against true north.',true,'Then you convert.'),
 tf('Magnetic north and true north are the same place.',false,'They are different.'),
 fl('East is least, west is ___.',['best','worst','first','last'],'West is best.')]),
L('np-comp','From course to compass',[
 cd('The chain','To fly a course, start with the true course from the chart. Correct for wind to get a true heading. Apply magnetic variation to get a magnetic heading. Then apply compass deviation, the small error from your airplane, to get the heading to steer on the compass.'),
 cd('A memory aid','Many pilots remember the order with the letters T-V-M-D-C: True, Variation, Magnetic, Deviation, Compass. Going from true to compass, you apply the corrections in that order. Going back from compass to true, you reverse the signs.')],
 'True, Variation, Magnetic, Deviation, Compass.',[
 mc('What does the letter V stand for in TVMDC?',['Variation','Velocity','Visibility','Volume'],'Magnetic variation.'),
 mc('What does D stand for?',['Deviation','Distance','Direction','Descent'],'Compass deviation.'),
 mc('Where does the wind correction happen?',['Between true course and true heading','After the compass','Before the chart','Not at all'],'It gives the true heading.'),
 tf('Compass deviation is an error caused by the airplane itself.',true,'Metal and electronics affect it.'),
 tf('You never need to correct for deviation.',false,'You apply it to get the compass heading.'),
 od('Put the letters in order.',['True','Variation','Magnetic','Deviation','Compass'],'TVMDC.')]),
L('np-triangle','The wind triangle',[
 cd('Wind pushes you','If you point the nose along your course and the wind blows from the side, the airplane will drift off its path. The pilot must turn the nose into the wind. The airplane then flies sideways a little, called crabbing, and tracks along the course.'),
 cd('Three sides','A wind triangle has three sides: the course and ground speed over the ground, the heading and airspeed through the air, and the wind direction and speed. If you know two, you can find the third. This is the basis of flight planning.')],
 'Crab into the wind to hold the course.',[
 mc('What does a pilot do to stay on course in a crosswind?',['Turn the nose into the wind','Turn away from the wind','Speed up','Ignore it'],'Crabbing keeps you on track.'),
 mc('What is crabbing?',['Pointing into the wind to hold the course','Flying backward','A landing type','A radio call'],'The airplane flies at an angle.'),
 mc('How many sides does a wind triangle have?',['Three','Two','Four','Ten'],'Course, heading and wind.'),
 tf('Wind can push the airplane off its path.',true,'The airplane moves with the air.'),
 tf('Pointing the nose along the course always holds the course in a crosswind.',false,'It drifts.'),
 fl('A wind ___ has course, heading and wind.',['triangle','circle','square','line'],'Triangle.')]),
L('np-wca','Wind correction angle',[
 cd('How much to correct','The wind correction angle, or WCA, is how many degrees you turn into the wind. It depends on how strong the wind is compared to your speed and how far to the side it blows. Stronger wind or slower airplane means a larger angle.'),
 cd('A quick estimate','A rough rule: for a wind directly across your course, WCA in degrees is about the wind speed divided by your airspeed in miles per minute. At 100 knots with a 20-knot crosswind, about 12 degrees. A flight computer gives a precise answer.')],
 'Stronger wind or slower plane means more correction.',[
 mc('What is the WCA?',['The angle you turn into the wind','The wing area','The radio channel','The weight'],'Wind correction angle.'),
 mc('Which gives a bigger WCA?',['Stronger crosswind','Weaker crosswind','No wind','A faster airplane'],'More wind needs more angle.'),
 mc('Direct headwind or tailwind needs…',['No wind correction angle','A big angle','90 degrees','Landing gear'],'The wind is along your course.'),
 tf('A slower airplane needs a bigger WCA for the same wind.',true,'Wind has more effect.'),
 tf('A crosswind never changes your heading.',false,'It does.'),
 fl('WCA means wind ___ angle.',['correction','crossing','cooling','climbing'],'Wind correction angle.')]),
L('np-tsd','Time, speed and distance',[
 cd('The formula','Distance equals speed times time. If you fly 120 knots for 30 minutes, you go 60 nautical miles. A knot is one nautical mile per hour, so 120 knots is 2 nautical miles per minute. Ground speed is what counts for the trip.'),
 cd('Quick mental math','Divide speed by 60 to get miles per minute. At 90 knots you cover 1.5 miles per minute. A 45-mile trip takes 30 minutes. Pilots do this in their heads all the time to check their plan.')],
 'Divide the speed by 60 for miles per minute.',[
 mc('How far do you go at 120 knots for 30 minutes?',['60 nautical miles','12 nautical miles','120 nautical miles','30 nautical miles'],'Half an hour is half of 120.'),
 mc('How many nautical miles per minute at 120 knots?',['2','12','0.2','20'],'120 divided by 60.'),
 mc('How long is a 45-mile trip at 90 knots?',['30 minutes','45 minutes','15 minutes','90 minutes'],'1.5 miles per minute.'),
 tf('Ground speed matters for trip time.',true,'It includes wind.'),
 tf('One knot is one mile per minute.',false,'It is one nautical mile per hour.'),
 fl('Distance equals speed times ___.',['time','weight','color','altitude'],'Time.')]),
L('np-fuel','Fuel planning',[
 cd('Fuel burn','If an airplane burns 8 gallons per hour and the trip takes 2 hours and 30 minutes, it needs 20 gallons for the trip. Add reserves and a safety margin, and the total determines whether you must stop for fuel.'),
 cd('Known quantities','Include fuel for taxi and takeoff, climb, cruise and the reserve required by law. Know the unusable fuel and the airplane’s usable fuel capacity. If the numbers are close, stop sooner. A fuel stop is cheaper than an emergency.')],
 'Trip fuel plus reserves, with margin.',[
 mc('An airplane burns 8 gallons an hour. How much for 2.5 hours?',['20 gallons','16 gallons','10 gallons','40 gallons'],'8 times 2.5.'),
 mc('What must be added beyond the trip fuel?',['Reserves','Extra oil','Extra paint','Another pilot'],'Legal and safety reserves.'),
 mc('What if the fuel numbers are close?',['Stop for fuel earlier','Hope','Fly higher','Skip the reserve'],'Stop earlier.'),
 tf('A fuel stop is cheaper than an emergency.',true,'Plan margins.'),
 tf('Taxi fuel never matters.',false,'Include it.'),
 fl('Fuel burn is measured in gallons per ___.',['hour','mile','pound','pilot'],'Gallons per hour.')]),
L('np-log','The navigation log',[
 cd('A trip on paper','A navigation log is a form that lists each leg of the trip: the checkpoints, courses, distances, headings, estimated times and fuel. In flight you fill in the actual times and compare them to the plan.'),
 cd('Why it works','If you are early or late at a checkpoint, you can update the ground speed and your arrival time. A log also helps you notice when you are off course or when fuel is being used faster than planned. Keep it handy in the cockpit.')],
 'Plan on paper, compare in flight.',[
 mc('What does a navigation log list?',['Checkpoints, courses, times and fuel','Only the weather','Only radio calls','Only the passengers'],'Each leg of the trip.'),
 mc('Why note actual times at checkpoints?',['To compare with the plan','To pass time','For the tower','To get a ticket'],'You can update ground speed and arrival.'),
 mc('What does an early or late checkpoint tell you?',['Your ground speed differs from plan','The sun is up','The engine is perfect','You are lost'],'Wind or speed differs.'),
 tf('A log helps you notice fuel problems early.',true,'Compare with plan.'),
 tf('A navigation log is only for airlines.',false,'All pilots can use one.'),
 fl('A trip is divided into ___.',['legs','tails','rooms','pages'],'Legs.')]),
L('np-e6b','The flight computer',[
 cd('The E6B','The E6B is a hand-held flight computer, like a circular slide rule, used for time-speed-distance, fuel, and wind problems. The wheel side solves the math, and the other side finds wind correction and ground speed.'),
 cd('Electronic versions','There are electronic E6Bs, apps and aircraft computers that give the same answers. Learn how the manual one works, because understanding the steps helps you check an app’s answer and spot a mistake.')],
 'Understand the math, not just the buttons.',[
 mc('What is an E6B?',['A flight computer','A radio','A cloud type','A compass'],'It solves flight math.'),
 mc('What does the wheel side do?',['Time, speed, distance and fuel','Radio tuning','Engine start','Weather maps'],'It is a slide rule.'),
 mc('Why learn the manual method?',['To check answers from an app','To avoid math forever','It is a rule for kids','It is cheaper'],'Understanding prevents mistakes.'),
 tf('Electronic versions give the same answers.',true,'They solve the same problems.'),
 tf('The E6B finds the weather.',false,'It solves math.'),
 fl('An E6B is a flight ___.',['computer','kite','tower','tire'],'Computer.')]),
L('np-plot','Plotting on the chart',[
 cd('Draw the line','With a ruler or plotter, draw a line from the departure airport to the destination on a sectional chart. Measure the true course with the plotter’s protractor, and the distance with its scale in nautical miles.'),
 cd('Pick checkpoints','Choose clear landmarks along the line, such as towns, lakes, highways, railroads, and towers. Spread them out roughly every 10 to 20 miles. Avoid features that look alike, like many small lakes. Good checkpoints keep you confident of your position.')],
 'Good checkpoints are easy to see and easy to tell apart.',[
 mc('What tool measures true course on a chart?',['A plotter','A thermometer','A wrench','A clock'],'A plotter has a protractor and scales.'),
 mc('How far apart should checkpoints be?',['About 10 to 20 miles','1 foot','1,000 miles','Never'],'Often enough to stay oriented.'),
 mc('Which makes a poor checkpoint?',['One of many look-alike lakes','A tall tower','A big river bend','A highway intersection'],'Avoid features that look alike.'),
 tf('The chart line is a true course.',true,'Measured against true north.'),
 tf('You should avoid unique landmarks.',false,'Unique landmarks help.'),
 fl('A line drawn on a chart is the planned ___.',['course','weight','price','style'],'Course.')]),
L('np-divert','Diversions and the 1-in-60 rule',[
 cd('1 in 60','If you are off course by one degree, after 60 nautical miles you will be one nautical mile off. This 1-in-60 rule helps figure out how much to turn to get back. If you are 5 miles off after 50 miles, you are about 6 degrees off.'),
 cd('Diverting','Sometimes you must change your destination because of weather, fuel, or a problem. Pick the new airport, turn toward it, estimate the distance and time, and tell someone. Plan alternates before you fly so you know your options.')],
 'One degree off is one mile off in sixty.',[
 mc('What is the 1-in-60 rule?',['One degree off equals one mile off per 60 miles','60 gallons per hour','1 hour in 60 days','60 knots per mile'],'A simple way to figure corrections.'),
 mc('You are 6 miles off after 60 miles. How many degrees off are you?',['About 6','About 1','About 60','About 0.6'],'Six miles in sixty is six degrees.'),
 mc('What is a good thing to do before diverting?',['Pick the new airport and tell someone','Panic','Turn off the radio','Dive'],'Aviate, navigate, communicate.'),
 tf('Plan alternates before you fly.',true,'It saves time.'),
 tf('The 1-in-60 rule only works on the ground.',false,'It works in the air.'),
 fl('Changing your destination in flight is a ___.',['diversion','division','dive','dish'],'Diversion.')])
]);
})();
