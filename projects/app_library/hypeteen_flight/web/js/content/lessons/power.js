/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* PRIVATE PILOT 4 - ENGINES + PROPELLERS: carburetors and injection, ice, leaning, detonation, constant-speed props, manifold pressure, turbocharging, fuel management. */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,od,L}=H.dsl;
H.addLessons('power',[
L('pow-fuelsys','Carburetor or fuel injection',[
 cd('Carburetor','A carburetor mixes fuel into the incoming air using the suction of the engine. It is simple and cheap, but it can ice up because the fuel evaporating inside it cools the air a lot. Carbureted engines have a carb heat control.'),
 cd('Fuel injection','A fuel injection system sprays fuel directly into the cylinders or intake ports. It is less likely to ice and gives each cylinder an even mix. It can be harder to start when hot. Both systems rely on the mixture control for altitude.')],
 'Carburetors ice. Injectors seldom do.',[
 mc('Which engine system can get carburetor ice?',['A carburetor','Fuel injection','Both equally','Neither'],'Carburetors cool the air as fuel evaporates.'),
 mc('Where does fuel injection spray fuel?',['Into the cylinders or intake ports','Into the exhaust','Onto the propeller','Into the tires'],'It delivers fuel directly.'),
 mc('Which one has a carb heat control?',['Carbureted engines','Injected engines','Gliders','Jets'],'Carb heat melts ice.'),
 tf('Fuel injection spreads the mix evenly among cylinders.',true,'Each cylinder gets its own supply.'),
 tf('A carburetor works by magnets.',false,'It uses airflow suction.'),
 fl('A carburetor ___ fuel with the incoming air.',['mixes','freezes','paints','lights'],'Mixing fuel and air is its job.')]),
L('pow-ice','When carburetor ice forms',[
 cd('Surprising conditions','Carburetor ice can form with outside temperatures between about 20 and 70 degrees Fahrenheit, especially with high humidity or visible moisture. The temperature inside the carburetor can drop 40 degrees or more below the outside air.'),
 cd('Spotting and fixing','The first sign is a loss of RPM in a fixed-pitch propeller or loss of manifold pressure in a constant-speed one, and perhaps a rough engine. Apply full carb heat. RPM may drop and run rough at first as ice melts, then recover. Keep carb heat on until it is clear.')],
 'Cool and damp can freeze the carb.',[
 mc('What outside temperature range is common for carb ice?',['About 20 to 70 degrees Fahrenheit','Below 0','Above 100','Only at 0'],'It can form on mild, humid days.'),
 mc('Why can the carb get much colder than the air?',['Fuel evaporating cools the air','The sun','The tires','The radio'],'Evaporation cools.'),
 mc('What do you do at the first sign of carb ice?',['Apply full carb heat','Turn off the engine','Lean the mixture','Add flaps'],'Full heat melts ice.'),
 tf('The engine may run rougher at first after carb heat is applied.',true,'The melting ice passes through.'),
 tf('Carb ice only happens in freezing weather.',false,'It happens in mild humid weather.'),
 fl('The first sign of carb ice in a fixed-pitch prop is lost ___.',['RPM','radio','color','lift'],'RPM falls.')]),
L('pow-lean','Leaning the mixture',[
 cd('Why lean','As you climb, the air thins out. If the mixture stays rich, there is too much fuel for the air and the engine wastes fuel and can foul spark plugs. Leaning matches fuel to the thinner air for smooth, efficient running.'),
 cd('How to lean','Many pilots use the exhaust gas temperature gauge. Slowly pull the mixture until the temperature rises to a peak, then enrich a little. Without an EGT, lean until the engine runs roughest then richen it. Follow the POH. Never lean for takeoff at low altitude.')],
 'Lean for cruise, rich for takeoff and landing.',[
 mc('Why do pilots lean the mixture in a climb?',['The air is thinner','The tires are low','The sun is hot','The flaps are down'],'Less air needs less fuel.'),
 mc('What does EGT stand for?',['Exhaust gas temperature','Engine ground time','Extra gas tank','Electrical ground tool'],'EGT measures exhaust temperature.'),
 mc('When should you not lean?',['At takeoff at low altitude','In cruise','At altitude','Never'],'Takeoff needs full rich at low altitude.'),
 tf('Too rich a mixture can foul spark plugs.',true,'Extra fuel leaves carbon deposits.'),
 tf('You must always lean to full lean.',false,'Lean to the POH procedure.'),
 fl('Leaning matches fuel to the ___ air.',['thinner','colder only','wetter','louder'],'High altitude air is thinner.')]),
L('pow-det','Detonation and pre-ignition',[
 cd('Uncontrolled burning','Normally the fuel burns smoothly after the spark. In detonation the fuel explodes instead, hitting the piston like a hammer. Pre-ignition is when the mixture ignites too early from a hot spot. Both cause damage fast.'),
 cd('Causes and prevention','Causes include too low a fuel grade, an overly lean mixture at high power, and overheating. Prevent them by using the right fuel, keeping the mixture rich enough at high power, and watching engine temperatures. Cool the engine if temperatures rise.')],
 'Right fuel, enough mixture, cool engine.',[
 mc('What is detonation?',['Fuel exploding instead of burning smoothly','A loud radio','A tire burst','A fuel leak'],'It hits the piston like a hammer.'),
 mc('Which can cause detonation?',['Fuel with too low a grade','Perfect fuel','A cold engine','Rich mixture at idle'],'Use the right fuel.'),
 mc('How do you reduce the risk?',['Keep the engine temperatures in range','Run it as hot as possible','Lean at full power on the ground','Skip the oil'],'Temperature control prevents it.'),
 tf('Pre-ignition can come from a hot spot.',true,'Hot deposits ignite the mix early.'),
 tf('Detonation is gentle and harmless.',false,'It can damage pistons fast.'),
 fl('Detonation is an uncontrolled fuel ___.',['explosion','leak','smell','tank'],'Explosion.')]),
L('pow-oil','Oil: type, level and change',[
 cd('Choosing oil','Aircraft engines use special aviation oil, either straight-weight or multi-viscosity. Oil thickness is rated by a number: thicker oil is better for hot weather, and thinner for cold. The engine maker lists the right type.'),
 cd('Changing oil','Oil is changed regularly, often every 50 hours or four to six months. Changing it removes dirt and metal bits. A new filter helps. Mechanics also look at the old oil and filter for signs of trouble.')],
 'Right oil, right level, change on schedule.',[
 mc('Who lists the correct oil type?',['The engine maker','A passenger','The tower','The radio'],'Follow the manual.'),
 mc('Why change oil regularly?',['To remove dirt and wear particles','To change the color','To add weight','To make noise'],'Clean oil protects the engine.'),
 mc('How often is oil often changed?',['About every 50 hours','Every 5 minutes','Every 50 years','Never'],'Typical interval.'),
 tf('Thicker oil suits hot weather.',true,'It keeps its film.'),
 tf('You can use car oil in any aircraft engine.',false,'Use approved aviation oil.'),
 fl('A new oil ___ catches particles.',['filter','flap','float','flag'],'The oil filter.')]),
L('pow-csp','The constant-speed propeller',[
 cd('A prop that adjusts','A constant-speed propeller has blades whose angle changes automatically so the engine keeps the RPM you set. A governor adjusts blade pitch. At takeoff the blades take a small bite for climb, and in cruise they take a bigger bite for speed.'),
 cd('Two levers','The throttle sets manifold pressure and the propeller control sets RPM. To increase power, move the propeller control forward first, then the throttle. To decrease power, reduce the throttle first, then the propeller. This keeps from putting too much pressure in the cylinders.')],
 'Prop first to add power. Throttle first to reduce.',[
 mc('What does the prop control set?',['RPM','Altitude','Fuel flow','Flap angle'],'It sets the engine speed.'),
 mc('To increase power, which do you move first?',['The prop control','The throttle','The flaps','The trim'],'Increase RPM, then add manifold pressure.'),
 mc('To reduce power, which do you move first?',['The throttle','The prop control','The mixture','The gear'],'Reduce manifold pressure first.'),
 tf('A governor changes blade pitch.',true,'It holds RPM steady.'),
 tf('A fixed-pitch propeller changes pitch by itself.',false,'It cannot.'),
 od('Put the steps to increase power in order.',['Mixture rich','Propeller forward','Throttle forward'],'Mixture, prop, throttle.')]),
L('pow-mp','Manifold pressure and power',[
 cd('Reading power','Engines with constant-speed props show manifold pressure in inches of mercury and RPM. Manifold pressure is the pressure of the fuel-air mix in the intake. At rest it equals outside air pressure, about 29 or 30 inches at sea level.'),
 cd('Square or oversquare','A rule of thumb avoids having manifold pressure higher than RPM divided by 100, such as 25 inches at 2,400 RPM. Check the engine manual because limits differ. High pressure with low RPM stresses the engine.')],
 'Watch both gauges, follow the manual.',[
 mc('What does manifold pressure measure?',['Pressure in the intake','Oil temperature','Fuel quantity','Altitude'],'It shows how much air enters.'),
 mc('Typical sea-level manifold pressure with the engine off?',['About 29 to 30 inches','About 1','About 100','About 0'],'Ambient pressure.'),
 mc('What combination stresses the engine?',['High pressure with low RPM','Low pressure','High RPM only','Idle'],'Avoid this.'),
 tf('Manifold pressure is measured in inches of mercury.',true,'That is the common unit.'),
 tf('Limits are the same for every engine.',false,'Follow the manual.'),
 fl('Manifold pressure is shown in inches of ___.',['mercury','water','oil','wind'],'Mercury.')]),
L('pow-turbo','Turbochargers and altitude',[
 cd('Breathing at altitude','At altitude the air is thin, so a normal engine loses power. A turbocharger uses exhaust gas to spin a compressor that packs more air into the engine. It keeps power up to a higher altitude.'),
 cd('Critical altitude','Every turbocharged engine has a critical altitude above which it can no longer keep sea-level power. Pilots monitor temperatures closely, because compression makes heat. Turbos are common in high-performance airplanes.')],
 'Turbos keep power high in thin air.',[
 mc('What does a turbocharger do?',['Compresses air to keep power at altitude','Cools the cabin','Makes electricity','Lights the lights'],'It boosts intake air.'),
 mc('What spins a turbocharger?',['Exhaust gas','Wind from the cabin','The battery','The radio'],'Exhaust gas drives it.'),
 mc('What is critical altitude?',['Where the turbo can’t hold sea-level power','The highest tower','Pattern altitude','Minimum altitude'],'Above it, power drops.'),
 tf('Turbocharged engines need close temperature monitoring.',true,'Compressed air is hot.'),
 tf('Thin air increases normal engine power.',false,'It decreases.'),
 fl('A ___ boosts the air going into the engine.',['turbocharger','tire','flap','wing'],'Turbocharger.')]),
L('pow-da','Density altitude and the engine',[
 cd('Hot and high','Engine power depends on the weight of air it takes in. Hot or high air is less dense, so there is less oxygen per breath. This is called high density altitude, and it lowers power, thrust and lift.'),
 cd('Effects','At high density altitude, the takeoff roll is longer and the climb is weaker. Pilots plan for it by leaving earlier in the day, flying lighter, using longer runways, and leaning properly for best power.')],
 'Hot, high and humid make the engine weaker.',[
 mc('What does high density altitude do to engine power?',['Lowers it','Raises it','No change','Doubles it'],'Thin air has less oxygen.'),
 mc('Which makes density altitude higher?',['Hot temperature','Cold temperature','Heavy rain only','Night'],'Heat thins the air.'),
 mc('How can pilots cope?',['Fly lighter and use more runway','Fly heavier','Skip the checklist','Lean to the limit at takeoff'],'Plan for longer takeoffs.'),
 tf('Early morning flights often have better performance.',true,'Cooler air is denser.'),
 tf('High density altitude shortens the takeoff roll.',false,'It lengthens it.'),
 fl('Thin air has less ___.',['oxygen','color','sound','light'],'Less oxygen per breath.')]),
L('pow-fuelmgmt','Fuel management',[
 cd('Know your burn rate','Pilots know about how many gallons per hour the engine burns at each power setting. Multiply by time to find the fuel you need. Always compare the planned fuel use with the gauge, and write down the time each tank was selected.'),
 cd('Starvation and exhaustion','Fuel exhaustion means all the fuel is gone. Fuel starvation means there is fuel on board but it is not reaching the engine, such as when the selector is on an empty tank. Both stop the engine, and both are avoidable with good habits.')],
 'Do the math, switch tanks on time, never trust one gauge.',[
 mc('What is fuel exhaustion?',['No fuel left on board','Fuel not reaching the engine','Fuel with water','Blue fuel'],'Exhaustion means running out.'),
 mc('What is fuel starvation?',['Fuel on board but not reaching the engine','No fuel on board','Fuel leaks','Fuel color'],'A selector on an empty tank can do it.'),
 mc('How can you track tanks?',['Write down the times you switch','Hope','Ask a passenger','Use the radio'],'Notes help.'),
 tf('Pilots should compare planned fuel use with gauges.',true,'Gauges alone can be wrong.'),
 tf('Fuel gauges are always exact.',false,'They can be off.'),
 fl('Burn rate is measured in ___ per hour.',['gallons','miles','feet','knots'],'Gallons per hour.')])
]);
})();
