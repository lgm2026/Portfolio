/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* PRIVATE PILOT 8 - RADIO NAV + GPS: VOR, DME, GPS, ADS-B, transponder codes, NDB, ILS, and what to do when navigation fails. */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,mt,L}=H.dsl;
H.addLessons('radionav',[
L('rn-vor','The VOR',[
 cd('Highways in the sky','A VOR, or VHF omnidirectional range, is a ground station that sends signals in all directions. Each direction is a radial, numbered by degrees from magnetic north. A pilot can fly to or from the station on a radial, like a road.'),
 cd('Identify before trusting','Every VOR sends its three-letter identifier in Morse code. The pilot listens and confirms before using it. VOR signals travel in a line of sight, so reception depends on altitude and distance. The network of VORs forms the Victor airways.')],
 'Listen for the Morse ident before you trust a VOR.',[
 mc('What is a VOR radial?',['A direction measured from the station','A kind of tire','A fuel line','A cloud'],'A radial is a magnetic course from the VOR.'),
 mc('How can a pilot confirm a VOR station?',['Listen to its Morse code identifier','Look at the sky','Taste the signal','Ask a passenger'],'Always check the ident.'),
 mc('Why does VOR reception depend on altitude?',['Signals travel in line of sight','Altitude changes color','Clouds block signals','Engines cause it'],'Higher altitude sees farther.'),
 tf('VOR airways are called Victor airways.',true,'They are numbered like V12.'),
 tf('A VOR works well even if you are far below the horizon line.',false,'Line of sight is required.'),
 fl('A VOR sends a ___ code to identify itself.',['Morse','secret','color','sound-only'],'Morse code.')]),
L('rn-track','Tracking with a VOR',[
 cd('The instrument','The VOR indicator has a compass card called an OBS, a needle called a CDI, and a TO/FROM flag. Turn the OBS knob until the needle centers. The number at the top is your course, and the flag shows whether it takes you to or from the station.'),
 cd('Flying it','To fly to a VOR, center the needle with a TO flag and fly that heading, correcting for wind. If the needle moves left, turn left to follow it. Near the station the needle gets very sensitive, then the flag flips as you pass over it.')],
 'Center the needle, read the flag, chase the needle.',[
 mc('What does the CDI do?',['Shows if you are left or right of the course','Shows altitude','Shows fuel','Shows speed'],'Course deviation indicator.'),
 mc('What does OBS stand for?',['Omni bearing selector','Over big sky','Onboard speed','Open bottom seal'],'You set the course with it.'),
 mc('What does the TO/FROM flag show?',['If the course goes to or from the station','The time','The wind','The speed'],'Direction relative to the station.'),
 tf('The CDI becomes very sensitive near the station.',true,'The lines come together.'),
 tf('You can ignore wind while tracking a VOR.',false,'Wind pushes you off.'),
 fl('The needle is called the course ___ indicator.',['deviation','direction','distance','density'],'Course deviation indicator.')]),
L('rn-dme','DME and VORTAC',[
 cd('Distance measuring','DME, distance measuring equipment, tells how far you are from a station in nautical miles. The airplane sends a pulse and the station replies. The time it takes becomes the distance. Many VORs include DME and are called VOR/DME or VORTAC.'),
 cd('Slant range','DME measures the straight line from the airplane to the station, called slant range, not the distance along the ground. The error is tiny except when you are very high and very close to the station, such as directly above it.')],
 'DME measures the slant to the station.',[
 mc('What does DME measure?',['Distance to a station','Altitude','Wind','Heading'],'Distance measuring equipment.'),
 mc('What is slant range?',['The straight line distance to the station','Distance along the ground','A kind of turn','Fuel range'],'It includes altitude.'),
 mc('What is a VORTAC?',['A VOR with military distance equipment','A kind of aircraft','A cloud','A radio type only'],'It combines VOR and TACAN.'),
 tf('DME shows distance in statute miles.',false,'DME reads in nautical miles.'),
 tf('DME works by time of a returned pulse.',true,'Pulse, reply, timing.'),
 fl('DME stands for distance ___ equipment.',['measuring','mixing','moving','making'],'Distance measuring equipment.')]),
L('rn-gps','How GPS works',[
 cd('Satellites above','GPS, the Global Positioning System, uses a group of more than 24 satellites that circle Earth. Each satellite broadcasts the time and its position. The receiver uses signals from at least four satellites to work out your position and altitude.'),
 cd('Better accuracy','Aviation GPS can use WAAS, a system that corrects errors to make positions accurate to about a few meters. GPS gives a moving map, your ground speed and track, and the time to a destination. It is usually a very reliable tool.')],
 'Four satellites give you a position in three dimensions.',[
 mc('How many satellites does a receiver need for a 3D position?',['At least four','Exactly one','At least 100','None'],'Four satellites solve for position and time.'),
 mc('What does WAAS do?',['Improves GPS accuracy','Fills the tanks','Controls flaps','Starts the engine'],'Wide Area Augmentation System.'),
 mc('Who sends GPS signals?',['Satellites','Cell towers','Airplanes','Lighthouses'],'A constellation in orbit.'),
 tf('GPS shows ground speed and track.',true,'It computes them.'),
 tf('GPS makes charts unnecessary.',false,'Keep backup navigation.'),
 fl('GPS stands for Global ___ System.',['Positioning','Plane','Pilot','Propeller'],'Global Positioning System.')]),
L('rn-guse','Using GPS wisely',[
 cd('Useful features','A GPS lets you go direct to any airport, build a flight plan, see the nearest airports, and watch ground speed and estimated arrival. Many airplanes show a moving map with airspace and terrain.'),
 cd('Watch for traps','Heads-down time can pull your eyes from outside. Always keep scanning for traffic. Check that databases are current, since airports, frequencies and airspace change. Cross-check the GPS with your chart to catch an input error.')],
 'Use the tool, but fly the airplane.',[
 mc('What is a risk of GPS use?',['Too much time looking down','Too little power','Too much lift','A heavy battery'],'Keep your eyes outside.'),
 mc('Why must the database be current?',['Airports and airspace change','Colors fade','For radio','For fuel'],'Out-of-date data is risky.'),
 mc('What does “direct to” do?',['Navigates straight to a chosen point','Starts the engine','Raises flaps','Calls the tower'],'It is a quick shortcut.'),
 tf('You should cross-check the GPS with a chart.',true,'It catches mistakes.'),
 tf('You can stop scanning for traffic when GPS is on.',false,'Scan always.'),
 fl('Keep your eyes ___ the cockpit.',['outside','inside','closed','down in'],'Outside.')]),
L('rn-adsb','ADS-B',[
 cd('Out and In','ADS-B Out transmits your GPS position, altitude and speed from the airplane, once per second, to ground stations and to other aircraft. ADS-B In receives traffic, weather and flight information for display in the cockpit.'),
 cd('Why it helps','It gives controllers precise positions and shows pilots nearby traffic. Free weather like NEXRAD radar and METARs may appear on the display. ADS-B Out is required in most controlled airspace, above 10,000 feet, and near busy airports.')],
 'ADS-B Out is seen. ADS-B In sees.',[
 mc('What does ADS-B Out do?',['Broadcasts your position','Shows you weather only','Starts the engine','Controls flaps'],'It lets others see you.'),
 mc('What does ADS-B In do?',['Receives traffic and weather','Sends your speed only','Cools the engine','Holds fuel'],'Information in the cockpit.'),
 mc('Where is ADS-B Out required?',['Most controlled airspace and above 10,000 feet','Nowhere','Only in school','Only over water'],'Broadly required.'),
 tf('ADS-B can show nearby traffic.',true,'Helpful, but keep looking.'),
 tf('ADS-B replaces looking outside.',false,'Not all traffic is equipped.'),
 fl('ADS-B Out sends your ___.',['position','lunch order','story','color'],'Position.')]),
L('rn-xpdr','Transponder codes and modes',[
 cd('Modes','Mode A sends a code. Mode C adds your pressure altitude. Mode S adds a unique address and other data. Most airplanes today use Mode C or S. You usually must have a transponder in controlled airspace and above 10,000 feet.'),
 cd('Special codes','1200 is the VFR code. 7500 means hijacking, 7600 means lost communications, and 7700 means emergency. The IDENT button makes your target flash on the controller’s screen when asked. Switch the transponder to ALT or ON after takeoff.')],
 '1200 VFR, 7500 hijack, 7600 radio, 7700 emergency.',[
 mc('Which code means emergency?',['7700','1200','7500','7600'],'7700.'),
 mc('Which code means lost communications?',['7600','7700','1200','7500'],'7600.'),
 mc('Which mode reports your altitude?',['Mode C','Mode A','Mode B','Mode Z'],'C is altitude.'),
 tf('IDENT makes your target flash for a controller.',true,'Only press it when asked.'),
 tf('1200 means an emergency.',false,'1200 is the normal VFR code.'),
 mt('Match each code to its meaning.',[['1200','VFR'],['7600','Radio failure'],['7700','Emergency']],'Remember these three.')]),
L('rn-ndb','The NDB',[
 cd('An older system','An NDB, non-directional beacon, is a simple low-frequency radio station. An ADF receiver in the airplane has a needle that points toward the station. NDBs were once a main navigation aid and are less common now.'),
 cd('Quirks','NDB signals can be bent by storms, mountains and the shoreline, and the needle may wander. Pilots must identify the station by its Morse code. Learning NDBs gives you a better understanding of how radio navigation works.')],
 'ADF points to the station.',[
 mc('What does an ADF needle point to?',['The NDB station','North','The horizon','The nearest town'],'It points toward the station.'),
 mc('What does NDB stand for?',['Non-directional beacon','New data bank','Near distance beam','North direction base'],'Non-directional beacon.'),
 mc('How do you identify an NDB?',['Morse code','A flag','A bell','A song'],'Listen for the code.'),
 tf('NDB signals can be affected by thunderstorms.',true,'Static can deflect the needle.'),
 tf('NDBs are the newest technology.',false,'They are old.'),
 fl('ADF stands for automatic direction ___.',['finder','fixer','filter','feeder'],'Automatic direction finder.')]),
L('rn-ils','Instrument landing system',[
 cd('A path to the runway','An ILS, instrument landing system, guides airplanes down to the runway in low visibility. A localizer gives left-right guidance, and a glideslope gives up-down. Together they form a precise path.'),
 cd('A needle cross','On the instrument two needles cross. If the vertical needle moves left, fly left; if the horizontal one is above center, fly up. When both are centered, you are on the path. VFR pilots may use an ILS in good weather as a helpful reference.')],
 'Localizer left-right, glideslope up-down.',[
 mc('What does the localizer give?',['Left-right guidance','Up-down guidance','Speed','Fuel'],'Lateral guidance.'),
 mc('What does the glideslope give?',['Up-down guidance','Left-right guidance','Weather','Heading'],'Vertical guidance.'),
 mc('What does ILS stand for?',['Instrument landing system','Inside land strip','Inner light signal','Intersection line sensor'],'ILS.'),
 tf('A centered pair of needles means on the path.',true,'You are lined up.'),
 tf('ILS is only for night.',false,'It works day and night.'),
 fl('The ILS has a localizer and a ___.',['glideslope','tower','trim','float'],'Glideslope.')]),
L('rn-fail','When navigation fails',[
 cd('Backup plans','Radios and GPS can fail. A good pilot always carries paper charts or a second device, and uses pilotage and dead reckoning to verify. Keep a known position in mind. Check GPS integrity messages. If in doubt, trust the chart.'),
 cd('Fallback steps','If the GPS goes out, use your last known position, compass and clock, and look for landmarks. Contact a controller if needed. In instruments, the magnetic compass is the final backup for direction. Always know where the nearest airport is.')],
 'Always have a Plan B for navigation.',[
 mc('What should a pilot carry in case GPS fails?',['A paper chart','A balloon','An umbrella','A kite'],'Backup charts.'),
 mc('What is the last backup for direction?',['The magnetic compass','The radio','The seat','The clock'],'It needs no power.'),
 mc('If confused about your position, what helps?',['Last known position, chart and landmarks','Panic','Speeding up','Spinning'],'Dead reckoning plus pilotage.'),
 tf('Always know where the nearest airport is.',true,'It is an option if trouble comes.'),
 tf('You should trust a GPS over everything.',false,'Cross-check.'),
 fl('Always carry a ___ plan B.',['navigation','sandwich','paint','game'],'A navigation backup.')])
]);
})();
