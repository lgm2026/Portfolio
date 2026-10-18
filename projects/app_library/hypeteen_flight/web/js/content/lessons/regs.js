/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* PRIVATE PILOT 2 - THE REGULATIONS: the parts of 14 CFR a private pilot lives by, in plain words. Practice only; always read the current rules. */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,mt,od,L}=H.dsl;
H.addLessons('regs',[
L('reg-what','Where the rules live',[
 cd('Title 14','Aviation rules in the United States are written in Title 14 of the Code of Federal Regulations, called the 14 CFR, or often the FARs. They are divided into parts. Part 1 defines words, Part 61 covers pilot certificates, and Part 91 sets general flight rules.'),
 cd('Other parts','Part 67 covers medical standards. Part 830, from the NTSB, covers accident reporting. Part 107 covers small drones. Pilots do not memorize everything, but they know where to look and the rules they use every day.')],
 'Part 61 is about you. Part 91 is about flying.',[
 mc('Which part covers pilot certificates?',['Part 61','Part 91','Part 107','Part 830'],'Part 61 covers certification of pilots.'),
 mc('Which part contains general operating and flight rules?',['Part 91','Part 1','Part 67','Part 107'],'Part 91 is the main flight-rules part.'),
 mc('Which part covers small drones?',['Part 107','Part 61','Part 91','Part 67'],'Part 107 is for small unmanned aircraft.'),
 tf('FAR stands for Federal Aviation Regulations.',true,'It is a common nickname for the rules.'),
 tf('Part 1 covers medical standards.',false,'Part 1 defines terms; Part 67 covers medicals.'),
 mt('Match the part to its topic.',[['Part 61','Pilot certificates'],['Part 91','Flight rules'],['Part 830','Accident reporting']],'Each part has a focus.')]),
L('reg-pic','The pilot in command',[
 cd('Final authority','The pilot in command, or PIC, is directly responsible for the operation of the airplane and has the final authority to decide how it is flown. That means if something is not safe, the PIC makes the call.'),
 cd('Emergencies','In an in-flight emergency that needs immediate action, the PIC may deviate from any rule to the extent required to meet that emergency. If asked, the pilot must send a written report to the FAA about the deviation.')],
 'The PIC has the final say.',[
 mc('What does PIC stand for?',['Pilot in command','Plane in cloud','Pressure in cabin','Power in climb'],'The pilot in command is in charge.'),
 mc('Who has the final authority over the airplane?',['The PIC','The passengers','The mechanic','The tower'],'Ultimately the PIC decides.'),
 mc('Can a PIC deviate from a rule in an emergency?',['Yes, as needed to handle it','Never','Only with a ticket','Only on Sundays'],'Emergencies allow necessary deviation.'),
 tf('The PIC is responsible for the operation of the airplane.',true,'It is the core duty.'),
 tf('The tower is the pilot in command.',false,'The tower guides; the pilot decides.'),
 fl('The PIC has the final ___ to operate the airplane.',['authority','price','luck','sticker'],'Final authority.')]),
L('reg-prep','Preflight action',[
 cd('Know before you go','Before every flight a pilot must become familiar with all available information. For any flight away from the airport that means weather reports and forecasts, fuel needs, alternate airports if the flight cannot be completed, and any known delays.'),
 cd('Runways and performance','The pilot must also know the runway lengths at airports of intended use, and the airplane’s takeoff and landing distance data. That includes how heat, altitude and wind change those distances. Knowing these keeps surprises small.')],
 'All available information, every flight.',[
 mc('What must a pilot do before every flight?',['Become familiar with all available information','Only check the oil','Skip weather','Hurry'],'Preflight action is required.'),
 mc('What must a pilot know about runways?',['Their lengths','Their color','Their names only','Their age'],'Length matters for performance.'),
 mc('Why check takeoff and landing distance data?',['To be sure the airplane can do it','To count the lights','For radio calls','To save fuel'],'Distances change with heat and altitude.'),
 tf('Weather reports are part of preflight information.',true,'Weather is always checked.'),
 tf('You can skip preflight planning on short flights.',false,'Every flight needs it.'),
 fl('Pilots check an ___ airport in case they cannot land at the first.',['alternate','ancient','average','angry'],'An alternate is a backup airport.')]),
L('reg-docs','Papers on board',[
 cd('Pilot documents','A pilot must carry a pilot certificate, a photo ID, and a medical certificate or other medical qualification when flying as pilot in command. A student pilot’s certificate with the right endorsements is also kept on board for solo flights.'),
 cd('Aircraft documents: ARROW','For the airplane, remember ARROW. Airworthiness certificate, Registration, Radio station license if flying outside the U.S., Operating limitations (the POH or placards), and Weight and balance data. They must be aboard or available.')],
 'ARROW: five papers for the airplane.',[
 mc('What does the A in ARROW stand for?',['Airworthiness certificate','Altitude','Alternator','Airspeed'],'The airworthiness certificate.'),
 mc('What does the second R stand for?',['Radio station license','Runway','Rudder','Reserve'],'It is only needed for international flights.'),
 mc('What does W stand for in ARROW?',['Weight and balance','Wind','Wing','Water'],'Weight and balance data.'),
 tf('A pilot carries a photo ID.',true,'It proves identity.'),
 tf('The pilot certificate can stay at home.',false,'It must be on board.'),
 od('Put ARROW in order.',['Airworthiness','Registration','Radio license','Operating limitations','Weight and balance'],'The letters spell ARROW.')]),
L('reg-fuel','Fuel reserves',[
 cd('Enough fuel to land with extra','For flights under visual flight rules in an airplane, a pilot must have enough fuel to fly to the first point of intended landing and then fly at normal cruise for at least 30 minutes in the day, or 45 minutes at night.'),
 cd('Beyond the minimum','The legal minimum is not always a safe plan. Good pilots add more reserve for weather, headwinds and detours. If the fuel at the destination will be low, they stop earlier for fuel. No pilot ever regretted extra fuel.')],
 'Thirty minutes day, forty-five at night.',[
 mc('How much fuel reserve is required for day VFR?',['30 minutes','3 minutes','3 hours','30 seconds'],'Thirty minutes at normal cruise.'),
 mc('How much fuel reserve is required at night?',['45 minutes','4 minutes','4 hours','45 seconds'],'Forty-five minutes.'),
 mc('Is the legal minimum always enough?',['No, add extra for safety','Yes, always','Only on cloudy days','Never'],'Good judgment uses more.'),
 tf('Stopping for fuel earlier is smart when reserves are small.',true,'It is safe and flexible.'),
 tf('Running out of fuel is a surprise you cannot prevent.',false,'Planning prevents it.'),
 fl('Fuel reserves are measured at normal ___ speed.',['cruise','taxi','climb','landing'],'Cruise speed.')]),
L('reg-alt','Cruising altitudes',[
 cd('East odd, west even','When flying above 3,000 feet above the ground in level flight on a magnetic course, VFR pilots use certain altitudes. On courses from 0 to 179 degrees, fly odd thousands plus 500, like 3,500 or 5,500. From 180 to 359, fly even thousands plus 500, like 4,500 or 6,500.'),
 cd('Why','The rule separates opposite-direction traffic by 1,000 feet so planes meeting head-on pass at different heights. It does not apply below 3,000 feet above the ground. Remember: east is odd, west is even.')],
 'East odd, west even, plus 500.',[
 mc('Which altitude fits a magnetic course of 090 degrees?',['5,500','6,500','5,000','6,000'],'East uses odd thousands plus 500.'),
 mc('Which altitude fits a magnetic course of 270 degrees?',['6,500','5,500','5,000','6,000'],'West uses even thousands plus 500.'),
 mc('Where does the rule start to apply?',['Above 3,000 feet above the ground','At sea level','At 100 feet','Below 1,000 feet'],'Applies above 3,000 AGL.'),
 tf('The rule separates head-on traffic by 1,000 feet.',true,'It lowers collision risk.'),
 tf('The rule applies at all altitudes.',false,'It starts above 3,000 AGL.'),
 fl('East is odd, west is ___.',['even','odd','low','high'],'Even for west.')]),
L('reg-speed','Speed limits',[
 cd('The 250 rule','Below 10,000 feet above sea level, aircraft may not exceed 250 knots. In the airspace around busy airports, the limit is lower. Within 4 nautical miles of the primary airport of Class C or D, and below 2,500 feet above the ground, the limit is 200 knots.'),
 cd('Under Class B','The same 200-knot limit applies in the airspace below the shelves of Class B and in VFR corridors. Slower speeds give more time to see traffic and obstacles. Most training airplanes never come close to these limits.')],
 'Two-fifty below ten thousand, two hundred near busy airports.',[
 mc('What is the speed limit below 10,000 feet MSL?',['250 knots','25 knots','2,500 knots','50 knots'],'Two hundred fifty knots.'),
 mc('What is the limit near a Class C or D primary airport below 2,500 AGL?',['200 knots','100 knots','300 knots','400 knots'],'Two hundred knots.'),
 mc('Why have speed limits?',['To give time to see traffic','To save paint','For radio','For lights'],'Slower speeds are safer near traffic.'),
 tf('Most training airplanes fly well below these limits.',true,'They cruise at around 100 knots.'),
 tf('Speed limits never apply to airplanes.',false,'They apply to aircraft.'),
 fl('The speed limit under 10,000 MSL is ___ knots.',['250','150','350','450'],'Two hundred fifty.')]),
L('reg-vfr','VFR weather minimums',[
 cd('What VFR means','VFR means visual flight rules. They require enough visibility and distance from clouds so pilots can see and avoid others. In Class E airspace below 10,000 feet, the minimum is 3 statute miles of visibility.'),
 cd('Cloud clearance','In that same airspace, stay at least 500 feet below clouds, 1,000 feet above, and 2,000 feet horizontally. Remember “3-152”: 3 miles visibility, 1,000 above, 500 below, 2,000 horizontal. Minimums vary by airspace and altitude.')],
 'Three-one-five-two: 3 miles, 1000 above, 500 below, 2000 sideways.',[
 mc('How much visibility is required in Class E below 10,000 feet?',['3 statute miles','3 feet','30 miles','300 meters'],'Three statute miles.'),
 mc('How far below clouds must you stay in Class E?',['500 feet','50 feet','5,000 feet','5 feet'],'Five hundred feet below.'),
 mc('How far horizontally from clouds?',['2,000 feet','20 feet','200 feet','200 miles'],'Two thousand feet.'),
 tf('VFR minimums keep pilots able to see and avoid.',true,'That is their purpose.'),
 tf('Cloud clearance does not matter in VFR.',false,'You must keep away from clouds.'),
 fl('The memory aid for Class E minimums is “3-___”.',['152','999','000','777'],'Three-one-five-two.')]),
L('reg-alc','Alcohol and drugs',[
 cd('Eight hours, bottle to throttle','A pilot may not fly within 8 hours after drinking alcohol, while under the influence, or with an alcohol concentration of 0.04 percent or more in the blood. Many pilots wait longer, because effects remain.'),
 cd('Medicines','Pilots may not fly while using any drug that affects their ability to fly safely. That includes some over-the-counter medicines that cause drowsiness. When in doubt, ask an aviation medical examiner before flying.')],
 'Eight hours bottle to throttle, and when in doubt, don’t.',[
 mc('How many hours after drinking alcohol is the legal wait before flying?',['At least 8','At least 8 minutes','At least 1','None'],'Eight hours minimum.'),
 mc('What blood alcohol level is the limit for pilots?',['0.04 percent','0.4 percent','4 percent','40 percent'],'0.04 or more is prohibited.'),
 mc('Who should you ask about a medicine?',['An aviation medical examiner','A random friend','The tower','A passenger'],'AMEs know the effects.'),
 tf('Some cold medicines can make a pilot drowsy.',true,'They can be unsafe.'),
 tf('You can fly right after one drink.',false,'Eight hours is the minimum.'),
 fl('The rule is eight hours from bottle to ___.',['throttle','table','bed','book'],'Bottle to throttle.')]),
L('reg-ntsb','Accident reporting',[
 cd('What must be reported','The NTSB, the National Transportation Safety Board, investigates aircraft accidents. A pilot must notify them immediately after an accident or certain serious incidents, such as in-flight fire or flight-control problems.'),
 cd('The written report','A written report may be required within 10 days of an accident. The aircraft wreckage must not be moved except to save a person, protect it from damage, or prevent hazards. The goal is to learn so it doesn’t happen again.')],
 'Report it so everyone can learn from it.',[
 mc('What does NTSB stand for?',['National Transportation Safety Board','National Tower Safety Bureau','New Trip Safety Basics','Nose Tail Safety Board'],'The NTSB investigates accidents.'),
 mc('When must a pilot notify the NTSB?',['Immediately after an accident','Next year','Never','At lunch'],'Immediate notice is required.'),
 mc('What is the purpose of accident investigation?',['To learn and prevent repeats','To punish','To advertise','To count planes'],'Safety improves from lessons learned.'),
 tf('Wreckage should not be moved except in limited cases.',true,'It preserves evidence.'),
 tf('A report is optional after an accident.',false,'It is required.'),
 fl('The NTSB ___ accidents.',['investigates','paints','sells','repairs'],'It investigates.')]),
L('reg-belts','Passengers and seat belts',[
 cd('Briefing passengers','Before takeoff the pilot must brief passengers on how to fasten and release the seat belts and shoulder harnesses. The pilot also explains where to find emergency equipment and what to do in an emergency.'),
 cd('Belts on','Crew members must keep their seat belts fastened during takeoff, landing and any time they are at their stations. Every passenger must wear a belt for takeoff, landing and when the pilot tells them. Seat belts save lives in rough air and accidents.')],
 'Brief passengers every time.',[
 mc('What should a pilot brief passengers on?',['Belts, exits and emergency equipment','The weather channel','Sports scores','Dinner plans'],'Safety briefing.'),
 mc('When must belts be worn?',['Takeoff and landing, at least','Never','Only at night','Only in clouds'],'Required at those times.'),
 mc('Who is responsible for passengers’ briefing?',['The pilot in command','The tower','The passenger','The fuel truck'],'The PIC is responsible.'),
 tf('Seat belts save lives in rough air.',true,'They keep you secure.'),
 tf('Passengers can skip belts on short flights.',false,'Belts are needed for takeoff and landing.'),
 fl('A seat belt and shoulder ___ protect passengers.',['harness','radio','antenna','wing'],'Harness protects the upper body.')]),
L('reg-aero','Aerobatic flight rules',[
 cd('What counts','Aerobatic flight means an intentional maneuver with an abrupt change in attitude or abnormal attitude, such as loops or rolls. Banking more than 60 degrees or pitching more than 30 degrees up or down counts for the parachute rule.'),
 cd('Where not to do it','Aerobatics are not allowed over congested areas, over open-air assemblies, within the surface area of Class B, C, D or E airspace, within 4 nautical miles of the centerline of a federal airway, below 1,500 feet above the ground, or when visibility is under 3 miles.')],
 'High, clear, away from crowds and airports.',[
 mc('What is the minimum altitude for aerobatics?',['1,500 feet above the ground','150 feet','15 feet','15,000 feet'],'Fifteen hundred feet AGL.'),
 mc('Where are aerobatics banned?',['Over congested areas','Over empty desert','At altitude over water','None'],'People on the ground are at risk.'),
 mc('Parachutes are required for bank greater than…',['60 degrees','6 degrees','160 degrees','260 degrees'],'The rule applies above 60 degrees bank or 30 degrees pitch.'),
 tf('Loops and rolls are aerobatic maneuvers.',true,'They involve abnormal attitudes.'),
 tf('Aerobatics are allowed at any airport pattern.',false,'Not in the surface area of controlled airports.'),
 fl('Aerobatic flight is an intentional abrupt change in ___.',['attitude','radio','fuel','tires'],'Attitude changes define it.')])
]);
})();
