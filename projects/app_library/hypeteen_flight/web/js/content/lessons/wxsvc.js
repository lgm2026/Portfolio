/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* PRIVATE PILOT 6 - WEATHER REPORTS: where pilots get weather, METAR, sky cover, flight categories, TAF, PIREPs, AIRMET/SIGMET, winds aloft, imagery, the briefing, NOTAMs, the go/no-go. */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,mt,od,L}=H.dsl;
H.addLessons('wxsvc',[
L('ws-src','Where pilots get weather',[
 cd('Official sources','Pilots get weather from official sources: Flight Service by phone or online (1800wxbrief.com), the Aviation Weather Center at aviationweather.gov, and approved apps. These pull from the same National Weather Service data.'),
 cd('At the airport','Many airports have an automated weather station, called AWOS or ASOS, which broadcasts current conditions on a radio frequency and by phone. Listening to it before you arrive tells you the wind, visibility, clouds, temperature and altimeter.')],
 'Get an official weather briefing every time.',[
 mc('What does AWOS stand for?',['Automated Weather Observing System','All Wind Over Seas','Aircraft Weather Operating Service','Air Wave Over Station'],'It reports current weather by radio.'),
 mc('Where do pilots get official briefings?',['Flight Service and the Aviation Weather Center','A friend','A guess','A cartoon'],'Official sources.'),
 mc('What do AWOS and ASOS give you?',['Current airport weather','A forecast for next week','A map','Fuel prices'],'Live observations.'),
 tf('Weather apps often use the same official data.',true,'They display NWS information.'),
 tf('A guess is as good as a briefing.',false,'Use official sources.'),
 fl('AWOS broadcasts the ___ weather.',['current','ancient','secret','future'],'Current conditions.')]),
L('ws-metar','Reading a METAR',[
 cd('A snapshot of now','A METAR is a coded report of the current weather at an airport. Here is one: KHFQ 141553Z 27010G18KT 10SM FEW040 BKN090 18/09 A3002. KHFQ is the airport, 141553Z is the day (14) and time in Zulu (15:53 UTC).'),
 cd('The rest of the code','27010G18KT is wind from 270 degrees at 10 knots, gusting to 18. 10SM is ten miles visibility. FEW040 is a few clouds at 4,000 feet and BKN090 broken clouds at 9,000. 18/09 is temperature 18 and dew point 9 Celsius. A3002 is altimeter 30.02.')],
 'Station, time, wind, visibility, sky, temp, altimeter.',[
 mc('What does 27010G18KT mean?',['Wind from 270 at 10 knots, gusting to 18','Wind to 270','Visibility 27 miles','Cloud at 27,000'],'Wind from the west at 10, gusts to 18.'),
 mc('What does A3002 mean?',['Altimeter setting 30.02','Altitude 3,002 feet','Airport 3002','Temperature 30'],'A is for altimeter.'),
 mc('In 18/09, what is 09?',['Dew point in Celsius','Day of month','Visibility','Wind'],'Temperature slash dew point.'),
 tf('A METAR shows current weather, not a forecast.',true,'It is an observation.'),
 tf('Z means a time zone in New York.',false,'Zulu is UTC.'),
 fl('KHFQ is the ___ identifier.',['station','cloud','wind','fuel'],'Station identifier.')]),
L('ws-sky','Clouds in a METAR',[
 cd('Cover codes','Sky cover is reported in eighths. FEW means one or two eighths, SCT scattered is three or four, BKN broken is five to seven, and OVC overcast is eight. SKC or CLR means clear. Heights are in hundreds of feet above the ground, so BKN040 is broken at 4,000 feet.'),
 cd('The ceiling','A ceiling is the height of the lowest layer reported as broken or overcast. Few and scattered layers do not count. If the lowest broken layer is at 900 feet, the ceiling is 900 feet, which can be too low for VFR.')],
 'Ceiling is the lowest broken or overcast layer.',[
 mc('What does BKN mean?',['Broken','Blank','Brisk','Bumpy'],'Five to seven eighths.'),
 mc('What is a ceiling?',['The lowest broken or overcast layer','Any cloud','The highest cloud','The sun'],'It limits VFR flying.'),
 mc('What does OVC mean?',['Overcast','Overhead','Open','Over'],'The sky is fully covered.'),
 tf('Scattered clouds do not make a ceiling.',true,'Only broken or overcast layers do.'),
 tf('Cloud heights in a METAR are above sea level.',false,'They are above ground level.'),
 mt('Match the code to its cover.',[['FEW','1–2 eighths'],['SCT','3–4 eighths'],['OVC','8 eighths']],'The more eighths, the more sky is covered.')]),
L('ws-cat','Flight categories',[
 cd('Four categories','Weather is sorted by ceiling and visibility. VFR is a ceiling above 3,000 feet and visibility over 5 miles. Marginal VFR, or MVFR, is a ceiling of 1,000 to 3,000 feet or visibility of 3 to 5 miles. IFR is 500 to below 1,000 feet or 1 to under 3 miles.'),
 cd('Colors on the map','Low IFR, or LIFR, is a ceiling below 500 feet or visibility below 1 mile. Maps color them: green for VFR, blue for MVFR, red for IFR and magenta for LIFR. A VFR-only pilot should be cautious in MVFR and stay out of IFR.')],
 'Green go, blue careful, red and magenta stay home.',[
 mc('What color is IFR on a weather map?',['Red','Green','Blue','Yellow'],'Red is IFR.'),
 mc('What color is VFR?',['Green','Red','Magenta','Pink'],'Green is VFR.'),
 mc('Which describes MVFR?',['Ceiling 1,000–3,000 ft or visibility 3–5 mi','Perfect weather','Zero visibility','Thunderstorms'],'It is marginal.'),
 tf('A VFR-only pilot should avoid IFR conditions.',true,'It takes an instrument rating.'),
 tf('LIFR is better than VFR.',false,'LIFR is the worst.'),
 od('Order from best to worst weather.',['VFR','MVFR','IFR','LIFR'],'VFR is the best.')]),
L('ws-taf','The TAF',[
 cd('A forecast for an airport','A TAF is a forecast for the area within five statute miles of an airport. It covers 24 or 30 hours and is written in a code like a METAR. It starts with the airport, issue time, valid period, then forecast wind, visibility and sky.'),
 cd('Change groups','FM means from a time on, conditions change. BECMG means becoming, a gradual change. TEMPO means temporary changes for under an hour at a time. PROB30 means a 30 percent chance. Pilots plan around these changes at the time they will arrive.')],
 'TAF is a forecast. FM, BECMG, TEMPO, PROB.',[
 mc('What is a TAF?',['A terminal aerodrome forecast','A tire air filter','A tower alert','A tail altitude'],'A forecast for an airport.'),
 mc('What does TEMPO mean?',['Temporary changes','Tempo of the engine','Time of departure','A new airport'],'Short-lived conditions.'),
 mc('What does BECMG mean?',['Gradual change','Instant change','No change','Broken'],'Becoming.'),
 tf('A TAF covers the area within about five miles of the airport.',true,'It is local.'),
 tf('A TAF shows current weather.',false,'It is a forecast.'),
 fl('PROB30 means a 30 percent ___.',['chance','change','chill','cloud'],'A 30 percent probability.')]),
L('ws-pirep','Pilot reports',[
 cd('From pilots, for pilots','A PIREP, or pilot report, tells what a pilot actually saw in the air: turbulence, icing, cloud tops and bases, and visibility. Real reports are valuable because forecasts can be wrong. They are labeled UA for routine and UUA for urgent.'),
 cd('Help the next pilot','Pilots are encouraged to make reports, especially of unexpected weather. A report includes location, time, altitude, aircraft type, and conditions. A short call to Flight Service or a controller helps everyone who follows.')],
 'Real weather reports from real pilots.',[
 mc('What is a PIREP?',['A report from a pilot','A kind of airplane','A fuel report','A parking permit'],'Pilot report.'),
 mc('What does UUA mean?',['Urgent PIREP','Under air','Up and up','Unused airplane'],'It marks urgent reports.'),
 mc('Why are PIREPs valuable?',['They show actual conditions','They are free gifts','They replace weather','They are a rule'],'Reality check on forecasts.'),
 tf('You can make a PIREP when you see unexpected weather.',true,'It helps other pilots.'),
 tf('PIREPs only come from airliners.',false,'Any pilot can report.'),
 fl('A pilot report is a ___.',['PIREP','METAR','TAF','NOTAM'],'PIREP.')]),
L('ws-sigmet','AIRMETs and SIGMETs',[
 cd('Hazard advisories','An AIRMET warns of weather that is hazardous to light airplanes. AIRMET Sierra is for IFR conditions and mountain obscuration, Tango for turbulence, strong surface wind and low-level wind shear, and Zulu for icing.'),
 cd('The more serious ones','A SIGMET warns about severe weather that threatens all aircraft, such as severe turbulence, severe icing, or volcanic ash. A convective SIGMET warns of thunderstorms. When a SIGMET covers your route, change your plans.')],
 'AIRMET for light aircraft, SIGMET for everyone.',[
 mc('Which AIRMET covers icing?',['Zulu','Sierra','Tango','Alpha'],'Zulu is icing.'),
 mc('Which AIRMET covers turbulence?',['Tango','Sierra','Zulu','Echo'],'Tango is turbulence and winds.'),
 mc('What does a SIGMET warn about?',['Severe weather for all aircraft','Light rain','Fuel prices','Parking'],'Severe hazards.'),
 tf('A convective SIGMET is about thunderstorms.',true,'Convective means storms.'),
 tf('AIRMETs are more serious than SIGMETs.',false,'SIGMETs are more serious.'),
 mt('Match AIRMET letters to hazards.',[['Sierra','IFR, mountain obscuration'],['Tango','Turbulence, strong wind'],['Zulu','Icing']],'Sierra, Tango, Zulu.')]),
L('ws-winds','Winds and temperatures aloft',[
 cd('A forecast for altitude','A winds-aloft forecast gives wind direction, speed and temperature at altitudes like 3,000, 6,000 and 9,000 feet. A coded entry 2735+05 means wind from 270 degrees at 35 knots and a temperature of plus 5 Celsius.'),
 cd('Using it','Pilots use winds aloft to pick the best altitude and to figure their ground speed and fuel. A strong tailwind can save time, and a headwind may mean choosing a lower altitude or a different route.')],
 'Direction, speed, temperature at each altitude.',[
 mc('What does 2735+05 mean?',['270 degrees at 35 knots, plus 5 Celsius','27 miles','35,000 feet','2.7 gallons'],'Direction, speed, temperature.'),
 mc('Why use winds aloft?',['To plan altitude, ground speed and fuel','To count clouds','To check tires','To fuel'],'Wind changes your trip.'),
 mc('What is a tailwind?',['Wind from behind','Wind from the front','Wind from the side','No wind'],'It pushes you along.'),
 tf('Winds can be very different at 6,000 than at the ground.',true,'They change with altitude.'),
 tf('Winds aloft are the same as the surface wind.',false,'They differ.'),
 fl('A tailwind increases ground ___.',['speed','weight','noise','color'],'Ground speed.')]),
L('ws-radar','Radar and satellite',[
 cd('Radar','Weather radar shows where rain, snow and hail are, and how heavy. It does not show clouds without precipitation or fog. Colors go from green for light to red and purple for intense. Radar images are a few minutes old.'),
 cd('Satellite','Satellite images show cloud cover from above, in visible light by day and infrared at night. They are good for seeing big systems but do not show the cloud bottoms or how thick they are. Use both radar and satellite with reports.')],
 'Radar shows rain, satellite shows clouds.',[
 mc('What does radar show?',['Precipitation','All clouds','Fog','Wind direction'],'Rain, snow and hail.'),
 mc('What does a red or purple radar return mean?',['Intense precipitation','Clear sky','Light drizzle','No weather'],'Strong storms.'),
 mc('What do satellite images show?',['Cloud cover from above','Rain depth','Runway length','Fuel'],'Cloud patterns.'),
 tf('Radar images are slightly old by the time you see them.',true,'They lag a few minutes.'),
 tf('Radar always shows fog.',false,'It does not.'),
 fl('Weather ___ shows rain and storms.',['radar','compass','seat','light'],'Radar.')]),
L('ws-chart','Weather charts',[
 cd('The surface analysis chart','A surface analysis chart shows pressure systems, fronts and weather at a given time. It shows highs and lows, isobars (lines of equal pressure), and the types of fronts. Close isobars mean strong wind.'),
 cd('Forecast charts','Prognostic charts, called prog charts, show how those systems are expected to move and what weather to expect. Pilots compare charts with current reports to see if the forecast is on track and to plan around fronts.')],
 'Close lines mean strong wind.',[
 mc('What do isobars show?',['Lines of equal pressure','Lines of equal altitude','Roads','Borders'],'Isobars link equal pressure.'),
 mc('What do close isobars mean?',['Strong winds','Calm','Rain only','Ice'],'Big pressure gradient.'),
 mc('What does a prog chart show?',['Expected weather','Past weather','Airports','Fuel stops'],'It is a forecast chart.'),
 tf('A surface chart shows fronts.',true,'Fronts are drawn on it.'),
 tf('A prog chart is a current observation.',false,'It is a forecast.'),
 fl('Isobars connect points of equal ___.',['pressure','speed','heat','color'],'Pressure.')]),
L('ws-brief','The weather briefing',[
 cd('What a briefing covers','A standard weather briefing includes adverse conditions, a synopsis of the weather pattern, current conditions, forecasts, winds aloft, NOTAMs, and ATC delays. Ask for it when planning a flight, and ask questions.'),
 cd('Document it','A pilot who gets a briefing should make a note of when and from whom. Many pilots keep a record. If the weather changes, update the briefing before departure. A good briefing before takeoff makes the decision easy.')],
 'Get a briefing, write it down, update it.',[
 mc('What does a standard briefing include?',['Hazards, current weather, forecasts, NOTAMs','Only the wind','Only the time','Only fuel'],'It is thorough.'),
 mc('When should you update a briefing?',['If conditions change','Never','After landing','During cruise only'],'Weather changes.'),
 mc('Why note when you got the briefing?',['To know how current it is','For fun','Required by the tower','For taxes'],'Weather ages quickly.'),
 tf('You can ask questions during a briefing.',true,'Briefers want to help.'),
 tf('A briefing from yesterday is fine for today.',false,'Get a new one.'),
 od('Put the briefing in order.',['Adverse conditions','Synopsis','Current weather','Forecast'],'A standard briefing follows this order.')]),
L('ws-notam','NOTAMs and TFRs',[
 cd('Notices to Air Missions','A NOTAM is a notice about things that can affect a flight: runways or taxiways closed, lights out, obstacles, navigation aids off the air, or airspace restrictions. Pilots must review NOTAMs before each flight.'),
 cd('Temporary flight restrictions','A TFR is a temporary no-fly area, such as around a fire, a stadium event, or the president. Entering one without permission can lead to serious penalties. Check TFRs on your route every time you fly.')],
 'Check NOTAMs and TFRs, every flight.',[
 mc('What does a NOTAM tell you?',['Things that affect the flight, like closures','Weather only','Your speed','Radio volume'],'A notice to pilots.'),
 mc('What does TFR stand for?',['Temporary flight restriction','Tire fuel report','Tower frequency radio','Time for rest'],'TFR.'),
 mc('Why check TFRs?',['Entering without permission can bring penalties','They show fuel prices','They are free tickets','They show the wind'],'Safety and legality.'),
 tf('A runway closure may be in a NOTAM.',true,'Check before you go.'),
 tf('TFRs are permanent.',false,'They are temporary.'),
 fl('A TFR is a temporary flight ___.',['restriction','report','radio','record'],'Restriction.')])
]);
})();
