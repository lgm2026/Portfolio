/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* BEYOND 6 - JET AGE */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,od,L}=H.dsl;
H.addLessons('jet',[
L('jt-how','How a jet engine works',[
 cd('Suck, squeeze, bang, blow','A jet engine pulls in air, squeezes it with a compressor, burns fuel with it in a combustor and blows the hot gas out the back. That push forward is thrust. A turbine spins to run the compressor.'),
 cd('Newton’s law','Thrust follows Newton’s third law: for every action there is an equal and opposite reaction. Hot gas goes backward, so the engine and airplane go forward.')],
 'Suck, squeeze, bang, blow.',[
 mc('What does the compressor do?',['Squeezes the air','Cools the fuel','Spins the wheels','Lights the cabin'],'Compression.'),
 mc('What produces thrust?',['Hot gas pushed backward','Wings','Wheels','Radio'],'Reaction.'),
 mc('Whose law explains it?',['Newton’s third law','Murphy’s law','Ohm’s law','None'],'Action and reaction.'),
 tf('A turbine runs the compressor.',true,'Yes.'),
 tf('Jet engines use propellers only.',false,'Many use fans.'),
 od('Put the jet steps in order.',['Suck in air','Squeeze it','Burn fuel','Blow out gas'],'Four strokes.')]),
L('jt-turbo','Turbofans',[
 cd('Big fans','Most airliners use turbofan engines. A large fan at the front moves lots of air around the core. Most of the thrust comes from this bypass air, which is quieter and more efficient than pure jet exhaust.'),
 cd('Bypass ratio','The bypass ratio compares air going around the core to air going through it. Modern airliners have high ratios, which save fuel. Fighter jets use lower ratios for speed.')],
 'Bigger fans are quieter and thriftier.',[
 mc('What is a turbofan?',['Jet with a big front fan','Prop engine','Rocket','Sail'],'Fan plus core.'),
 mc('Where does most thrust come from in an airliner?',['Bypass air','Fuel smell','Wheels','Lights'],'Fan air.'),
 mc('What do high bypass ratios give?',['Better fuel efficiency','Less thrust','More noise','Smaller wings'],'Efficiency.'),
 tf('Fighter jets often use lower bypass ratios.',true,'Speed.'),
 tf('Turbofans are louder than old jets.',false,'They are quieter.'),
 fl('Bypass air flows ___ the core.',['around','under','over only','into only'],'Around.')]),
L('jt-press','Pressurization',[
 cd('Breathable cabins','At 35,000 feet, the air is too thin to breathe. Jets pump compressed air into the cabin to keep it like an altitude of about 6,000 to 8,000 feet. This lets passengers breathe normally.'),
 cd('If pressure is lost','If pressure drops, oxygen masks fall and pilots descend quickly to a safe altitude. Passengers should put on their own mask first. Training prepares the crew for this event.')],
 'Cabin altitude is lower than flight altitude.',[
 mc('What does pressurization do?',['Keeps the cabin breathable','Cools wings','Makes noise','Adds fuel'],'Cabin air.'),
 mc('Typical cabin altitude is about…',['6,000 to 8,000 feet','35,000 feet','Sea level only','100 feet'],'Comfortable.'),
 mc('If pressure drops, pilots…',['Descend quickly','Climb','Hover','Sleep'],'Get to thicker air.'),
 tf('Masks drop if cabin pressure is lost.',true,'Yes.'),
 tf('Passengers help others first.',false,'Own mask first.'),
 fl('The cabin is kept at a lower ___ than the flight.',['altitude','attitude','airspeed','area'],'Altitude.')]),
L('jt-mach','Speed of sound',[
 cd('Mach number','Mach 1 is the speed of sound, about 575 knots at airliner altitudes. Mach number compares an aircraft’s speed to sound. Airliners cruise near Mach 0.8, a little below it.'),
 cd('Shock waves','Near the speed of sound, air flows over parts of the wing at supersonic speed, making shock waves and more drag. Sweep-back wings delay this problem, which is why jets have swept wings.')],
 'Mach 1 = speed of sound.',[
 mc('What is Mach 1?',['The speed of sound','Half the speed of light','Walking speed','Twice sound'],'Sound speed.'),
 mc('Airliners cruise near…',['Mach 0.8','Mach 8','Mach 0.08','Mach 80'],'High subsonic.'),
 mc('Why sweep wings back?',['To delay shock waves','To look cool','To hold fuel','To fit gates'],'High-speed design.'),
 tf('Shock waves increase drag.',true,'Yes.'),
 tf('Airliners fly at Mach 5.',false,'No.'),
 fl('Mach compares speed to the speed of ___.',['sound','light','wind','water'],'Sound.')]),
L('jt-alt','Why fly so high',[
 cd('Thin air, less drag','At 35,000 feet, air is thin, so there is less drag. Jet engines work efficiently in cold, thin air and use less fuel per mile. The airplane also flies above most weather.'),
 cd('The trade-off','Higher altitudes need pressurization and have a narrow range between low-speed and high-speed limits, called the coffin corner. Pilots monitor speed closely at the top.')],
 'High and thin saves fuel but needs care.',[
 mc('Why fly high?',['Less drag and better efficiency','More wind','Bigger tires','More noise'],'Efficient.'),
 mc('Above what do most airliners cruise?',['Most weather','The Moon','The ocean','Space'],'Above weather.'),
 mc('What is needed in high flight?',['Pressurization','Floats','Skis','Sails'],'Breathing.'),
 tf('The coffin corner is a narrow speed range.',true,'Yes.'),
 tf('Thin air increases drag.',false,'It decreases drag.'),
 fl('Cold thin air helps engine ___.',['efficiency','color','noise','mood'],'Efficiency.')]),
L('jt-jetstream','The jet stream',[
 cd('Rivers of wind','The jet stream is a fast river of air high above the ground, often 100 knots or more. It flows west to east. Flights going east ride it and save time and fuel.'),
 cd('Planning around it','Flights going west may fly routes to avoid its strongest winds. Dispatchers plan tracks each day. The jet stream also moves weather systems and can bring clear air turbulence.')],
 'Eastbound flights ride a tailwind.',[
 mc('Which way does the jet stream flow?',['West to east','East to west','North only','South only'],'Prevailing flow.'),
 mc('Who benefits from the jet stream?',['Eastbound flights','Westbound flights','Nobody','Boats'],'Tailwind.'),
 mc('What can it bring?',['Clear air turbulence','Snow cones','Bananas','Songs'],'Sometimes.'),
 tf('Dispatchers plan tracks daily.',true,'Wind changes.'),
 tf('The jet stream is slow.',false,'It is fast.'),
 fl('The jet stream is a river of ___.',['air','water','lava','oil'],'Air.')]),
L('jt-fbw','Fly-by-wire',[
 cd('Computers in control','In fly-by-wire airplanes, pilot inputs go to a computer, which moves the control surfaces through wires and actuators. There are no direct cables to the surfaces.'),
 cd('Protections','Computers can prevent dangerous angles, speeds or stalls. Pilots still make the decisions, but the system helps them stay inside safe limits. Backup systems provide redundancy.')],
 'The pilot commands; the computer carries out and protects.',[
 mc('What does fly-by-wire use?',['Computers and actuators','Direct cables only','Sails','Rockets'],'Electronic.'),
 mc('What can the computer prevent?',['Dangerous angles and speeds','Landings','Takeoffs','Sleep'],'Envelope protection.'),
 mc('Does the pilot still decide?',['Yes','No','Never','Only birds'],'Yes.'),
 tf('Backup systems add redundancy.',true,'Yes.'),
 tf('Fly-by-wire removes the pilot.',false,'No.'),
 fl('Fly-by-___ uses electronic signals.',['wire','wing','wind','water'],'Wire.')]),
L('jt-noise','Noise and the environment',[
 cd('Quieter engines','Modern engines are much quieter than early jets. Pilots follow noise-reducing procedures near cities. Airports also set curfews and routes to limit noise.'),
 cd('Cleaner fuel','The industry is working to cut emissions with efficient engines, lighter planes, better routes and sustainable aviation fuel made from waste or plants. Every improvement adds up.')],
 'Quieter, cleaner, more efficient.',[
 mc('How are modern engines compared to early jets?',['Much quieter','Louder','Heavier','Larger only'],'Improved.'),
 mc('What is SAF?',['Sustainable aviation fuel','Super air fan','Safe airline fee','Sky alarm filter'],'Cleaner fuel.'),
 mc('What helps reduce emissions?',['Efficient engines and routes','Flying slower for no reason','More weight','Skipping maintenance'],'Many steps.'),
 tf('Airports may have noise curfews.',true,'Yes.'),
 tf('Aviation has made no effort to cut emissions.',false,'Better engines, lighter planes and cleaner fuels are all in progress.'),
 fl('Lighter airplanes use less ___.',['fuel','sky','time zone','paint'],'Fuel.')]),
L('jt-turbo2','Turboprops',[
 cd('Jet core, propeller thrust','A turboprop uses a jet engine core to spin a propeller. It is efficient at lower speeds and altitudes and works well on short runways. Many regional and cargo airplanes are turboprops.'),
 cd('Why choose one','Turboprops burn less fuel than jets on short trips and can operate from small airports. They are also popular for bush and utility work.')],
 'A jet core that turns a propeller.',[
 mc('What does a turboprop turn?',['A propeller','A wheel','A sail','A fan only'],'Prop.'),
 mc('Where are turboprops efficient?',['Short trips','Space','Underwater','Highways'],'Lower speeds.'),
 mc('Who uses them?',['Regional and cargo operators','Nobody','Only toys','Only ships'],'Common.'),
 tf('Turboprops work on short runways.',true,'Yes.'),
 tf('Turboprops are faster than all jets.',false,'They are slower.'),
 fl('A turbo___ blends jet and propeller.',['prop','pop','top','shop'],'Turboprop.')]),
L('jt-records','Jet milestones',[
 cd('The first jets','The first jet airliner, the de Havilland Comet, flew passengers in 1952. The Boeing 707 made jet travel common in 1958. Jets made the world feel smaller by cutting travel times in half.'),
 cd('Jumbo era','The Boeing 747 first flew in 1969 and carried hundreds of people. Today’s twin-engine jets, such as the 787 and A350, are quieter and more efficient than those early giants.')],
 'Jets shrank the world.',[
 mc('Which was the first jet airliner?',['De Havilland Comet','Boeing 747','Concorde','787'],'1952.'),
 mc('What made jet travel common?',['Boeing 707','A hot air balloon','A biplane','A train'],'1958.'),
 mc('What did the 747 carry?',['Hundreds of people','One person','Cargo only','Animals only'],'Jumbo jet.'),
 tf('Jets cut travel times a lot.',true,'Yes.'),
 tf('The 747 came before the Comet.',false,'The Comet was first.'),
 od('Put these in date order.',['Comet','707','747'],'1952, 1958, 1969.')])
]);
})();
