/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* PRIVATE PILOT 11 - CHARTS & PUBLICATIONS */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,mt,L}=H.dsl;
H.addLessons('charts',[
L('ch-sect','Sectional charts',[
 cd('The VFR map','A sectional chart is the main map for visual pilots. Its scale is 1:500,000, so one inch on the chart equals about 6.86 nautical miles. It shows airports, towers, terrain, airspace and landmarks.'),
 cd('Colors and symbols','Blue airport symbols have control towers; magenta ones do not. Blue and magenta shaded edges mark airspace. Brown contour lines and colors show ground height. Always use the legend on the chart.')],
 'Read the legend before you read the map.',[
 mc('What is the scale of a sectional chart?',['1:500,000','1:1,000','1:50','1:10'],'About 6.86 NM per inch.'),
 mc('What do blue airport symbols show?',['A control tower','No runway','A mountain','Water'],'Towered airports are blue.'),
 mc('What shows ground height?',['Contour lines and colors','Radio waves','Arrows','Clouds'],'Elevation shading.'),
 tf('Sectional charts include airspace.',true,'Edges show class and limits.'),
 tf('Magenta airports have control towers.',false,'Those are blue.'),
 fl('A sectional chart has a ___ in the margin.',['legend','engine','wing','tire'],'Use the legend.')]),
L('ch-latlon','Latitude and longitude',[
 cd('Lines on the globe','Latitude lines run east-west and measure north or south of the equator. Longitude lines run north-south and measure east or west of the prime meridian. Together they name any point on Earth.'),
 cd('Degrees and minutes','Each degree has 60 minutes. A position such as 40°N, 105°W tells you exactly where. Pilots use these to find places and to plot courses. One minute of latitude is one nautical mile.')],
 'Latitude north-south; longitude east-west.',[
 mc('Which lines run east-west?',['Latitude','Longitude','Meridians','Altitude'],'Parallels of latitude.'),
 mc('How many minutes are in a degree?',['60','100','30','10'],'Sixty.'),
 mc('One minute of latitude equals how far?',['1 nautical mile','10 miles','1 inch','100 feet'],'One NM.'),
 tf('Longitude is measured from the prime meridian.',true,'Zero degrees longitude.'),
 tf('Latitude measures east and west.',false,'It measures north and south.'),
 mt('Match each to its direction.',[['Latitude','North-south position'],['Longitude','East-west position'],['Equator','Zero latitude']],'Two coordinates.')]),
L('ch-airspace','Airspace on the chart',[
 cd('Reading the shapes','Class B appears as solid blue lines, Class C as solid magenta, and Class D as dashed blue. Class E starting at the surface is dashed magenta. Numbers tell the floor and ceiling in hundreds of feet.'),
 cd('Reading the numbers','A label like 40 over 10 means the top is 4,000 feet MSL and the bottom is 1,000 feet MSL. Shaded vignettes and lines also show where controlled airspace begins above ground. Always check the numbers before you enter.')],
 'Colors say the class; numbers say the altitudes.',[
 mc('How is Class B shown?',['Solid blue lines','Dashed red','Green dots','Yellow'],'Blue solid.'),
 mc('What does 40 over 10 mean?',['Top 4,000 and floor 1,000 feet MSL','Four planes','Ten miles','Forty knots'],'Hundreds of feet.'),
 mc('How is Class D shown?',['Dashed blue lines','Solid magenta','Gray','Black'],'Dashed blue.'),
 tf('Altitudes on airspace boxes are in hundreds of feet.',true,'Add two zeros.'),
 tf('Class C is shown in solid blue.',false,'Class C is magenta.'),
 fl('Class B is drawn with ___ blue lines.',['solid','dotted','wavy','no'],'Solid.')]),
L('ch-obst','Obstacles and terrain',[
 cd('Towers and wires','Charts show towers, wind turbines and power lines with symbols and heights. A number in bold tells height above ground; one in parentheses is height above ground level when separate. High obstacles can be hidden at night or in haze.'),
 cd('Max elevation figures','Each section of the chart has a Maximum Elevation Figure, in bold large numbers. It shows the highest terrain or obstacle in that box, rounded up. Use it for a quick safe altitude check.')],
 'Know what is the tallest thing in your path.',[
 mc('What does a Maximum Elevation Figure show?',['Highest obstacle in a section','Fuel cost','Radio range','Wind'],'Rounded up.'),
 mc('Why note towers?',['They can be hard to see','They are colorful','They are friends','They are fast'],'Avoid them.'),
 mc('What shows obstacle height?',['Numbers next to symbols','Radio calls','Clouds','Pages'],'Heights listed.'),
 tf('Tall towers can be hidden in haze.',true,'Plan clearances.'),
 tf('MEF numbers show the lowest point.',false,'They show the highest.'),
 fl('MEF stands for maximum ___ figure.',['elevation','engine','energy','exit'],'Elevation.')]),
L('ch-vfrsym','Landmarks and airports',[
 cd('Finding your way','Use landmarks such as rivers, highways, lakes, railways and towns to check your position. Sectionals show them in simple forms. Pick features that are easy to see from the air and hard to confuse.'),
 cd('Airport data','Next to each airport symbol are its name, elevation, longest runway length and tower frequency. Lighting and fuel are shown by special marks. Use the legend to read every detail before you choose where to land.')],
 'Pick clear landmarks and read the airport data.',[
 mc('What data sits near an airport symbol?',['Name, elevation, runway length','Menu','Phone number','Weather forecast'],'Basic details.'),
 mc('Which makes the best landmark?',['A big lake','A small tree','A car','A cloud'],'Easy to see.'),
 mc('Where do you see the legend?',['On the chart','On the engine','In the seat','On the wheels'],'Chart margin.'),
 tf('Rivers and highways make good landmarks.',true,'They are easy to spot.'),
 tf('All landmarks are always easy to see.',false,'Haze can hide them.'),
 fl('Airport elevation is given in ___.',['feet','knots','pounds','gallons'],'Feet MSL.')]),
L('ch-tac','Terminal area charts',[
 cd('A closer look','A Terminal Area Chart, or TAC, shows busy Class B areas at a larger scale: 1:250,000. It adds more detail on routes and airspace shelves to help pilots near big airports.'),
 cd('VFR flyways','Some TACs show VFR flyways, planning charts and corridors. These are suggested paths that help pilots go around or under busy airspace. They are not ATC clearances, and you still need to see and avoid traffic.')],
 'More detail near the busiest airports.',[
 mc('What is the TAC scale?',['1:250,000','1:5','1:1,000,000','1:50'],'Closer than a sectional.'),
 mc('Why use a TAC?',['More detail near busy airports','To cook','To save paper','To see stars'],'Class B detail.'),
 mc('What is a VFR flyway?',['A suggested path around busy airspace','A river','A runway','A radio'],'Not an ATC clearance.'),
 tf('A TAC shows a smaller area in more detail.',true,'Larger scale.'),
 tf('A VFR flyway is a clearance.',false,'It is only a suggestion.'),
 fl('TAC stands for Terminal Area ___.',['Chart','Cargo','Cloud','Check'],'Terminal Area Chart.')]),
L('ch-supp','Chart Supplement',[
 cd('The airport book','The Chart Supplement lists every public airport with runway lengths, lighting, fuel, frequencies, and special notes. It is updated every 56 days. Use it with the sectional to get the full picture.'),
 cd('Reading entries','Each entry has abbreviations for runway surfaces, lighting and services. A note may warn of birds, hills or closed taxiways. Check it before landing at an unfamiliar airport.')],
 'The book with the details the map leaves out.',[
 mc('How often is the Chart Supplement updated?',['Every 56 days','Every day','Every 10 years','Never'],'Eight-week cycle.'),
 mc('What does it list?',['Airport details like fuel and lights','Recipes','Movies','Songs'],'Airport facts.'),
 mc('When should you read it?',['Before landing at an unfamiliar airport','After landing','Never','Only at night'],'Planning.'),
 tf('It may include warnings about birds or terrain.',true,'Read the remarks.'),
 tf('It is the same as a sectional chart.',false,'They work together.'),
 fl('Airport ___ include fuel and lighting.',['services','seats','wings','clouds'],'Services.')]),
L('ch-notam','NOTAMs',[
 cd('Notices to pilots','A NOTAM is a Notice to Air Missions. It tells pilots about temporary changes: a closed runway, a broken light, a crane near the airport, or a restricted area. Some are short lived; others last for months.'),
 cd('How to check','Pilots read NOTAMs during preflight planning and from a flight briefer. Look at the airports you will use, the route and the airspace. A TFR, for example, can close an area for an event or emergency.')],
 'Check NOTAMs for every flight.',[
 mc('What does NOTAM stand for?',['Notice to Air Missions','News of the Air Maps','No Tower Altitude Marker','None'],'Pilot notices.'),
 mc('What might a NOTAM report?',['A closed runway','Lunch','A joke','A song'],'Temporary changes.'),
 mc('When do you check NOTAMs?',['During preflight planning','After landing','Never','Next year'],'Before every flight.'),
 tf('A TFR can limit where you may fly.',true,'Check before you go.'),
 tf('NOTAMs never change.',false,'They are temporary.'),
 fl('A runway ___ may appear in a NOTAM.',['closure','color','song','fan'],'Closure.')]),
L('ch-tfr','Temporary flight restrictions',[
 cd('What is a TFR?','A temporary flight restriction closes or limits airspace for a time. Reasons include wildfires, presidential visits, space launches, disasters and large events. Flying into one without permission can bring serious penalties.'),
 cd('Finding them','Check TFRs on the FAA website, with a flight briefer, or in your flight planning app. They can change quickly, so check just before takeoff as well as the day before.')],
 'Check TFRs right before you fly.',[
 mc('What is a TFR?',['A temporary limit on airspace','A radio brand','A fuel type','A cloud'],'Short-term restriction.'),
 mc('Which could cause a TFR?',['A wildfire','A sandwich','A rainbow','A holiday card'],'Emergencies and events.'),
 mc('When should you check TFRs?',['Right before takeoff','Never','Only on Mondays','Only at night'],'They change.'),
 tf('TFRs can be set up quickly.',true,'So check often.'),
 tf('You can ignore a TFR if the sky looks clear.',false,'It still applies.'),
 fl('TFR stands for temporary flight ___.',['restriction','report','rule','route'],'Restriction.')]),
L('ch-ifrlow','Other chart types',[
 cd('Special charts','Pilots also use IFR enroute charts for flying by instruments, approach plates for instrument approaches, and airport diagrams for taxi layouts. A World Aeronautical Chart covers large areas at 1:1,000,000.'),
 cd('Digital charts','Many pilots use apps and electronic flight bags to see charts, weather and maps on a tablet. Digital charts are handy but need care: battery, updates and backup. Many pilots still carry paper charts as a backup.')],
 'Know the chart for each job, and have a backup.',[
 mc('What does an airport diagram show?',['Taxiways and runways','Mountains','Weather','Fuel prices'],'Surface layout.'),
 mc('What do IFR enroute charts help with?',['Navigating by instruments','Cooking','Sports','Painting'],'IFR flight.'),
 mc('Why carry a backup for a tablet?',['Batteries and screens can fail','Paper is heavier','Tablets are loud','Nobody cares'],'Redundancy.'),
 tf('Digital charts need updates.',true,'Keep them current.'),
 tf('All charts have the same scale.',false,'Scales differ.'),
 fl('An electronic flight ___ is an app tool.',['bag','box','boot','bell'],'EFB.')])
]);
})();
