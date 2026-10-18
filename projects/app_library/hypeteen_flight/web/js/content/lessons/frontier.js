/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* BEYOND 10 - NEW FRONTIERS */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,L}=H.dsl;
H.addLessons('frontier',[
L('fr-drone','Drones',[
 cd('Unmanned aircraft','A drone, also called an unmanned aircraft system or UAS, flies without a pilot on board. A remote pilot controls it from the ground. Drones inspect bridges, map land, help farmers and film movies.'),
 cd('Rules','In the U.S., remote pilots of drones used for work need a Part 107 certificate. Drones must stay low, within sight and away from airports without permission. Recreational flyers follow safety rules too.')],
 'Small aircraft, real rules.',[
 mc('What is a UAS?',['Unmanned aircraft system','Underwater air ship','Universal air signal','Utility airport station'],'A drone.'),
 mc('What certificate do commercial drone pilots need?',['Part 107','Part 1','Part 7','None'],'Remote pilot certificate.'),
 mc('Where must drones avoid flying?',['Near airports without permission','Over fields','In open sky','At home'],'Safety.'),
 tf('Drones can inspect bridges.',true,'Yes.'),
 tf('Drones follow no rules.',false,'Rules apply.'),
 fl('A drone pilot is called a ___ pilot.',['remote','robot','random','rapid'],'Remote.')]),
L('fr-evtol','Electric air taxis',[
 cd('eVTOL','An eVTOL is an electric vertical takeoff and landing aircraft. It lifts straight up with rotors, then flies forward on wings. Companies are developing air taxis for short city trips.'),
 cd('Challenges','Batteries are heavy, so range is limited. Regulators must certify designs, and cities need landing sites called vertiports. Safety and noise are major goals.')],
 'Up like a helicopter, forward like a plane.',[
 mc('What does eVTOL stand for?',['Electric vertical takeoff and landing','Easy vertical takeoff lift','Engine very tall landing','None'],'Electric VTOL.'),
 mc('What is a vertiport?',['A landing site for eVTOLs','A harbor','A parking lot','A mall'],'Aircraft hub.'),
 mc('What limits range?',['Battery weight','Wing color','Noise','Landing gear'],'Energy storage.'),
 tf('Regulators must certify new designs.',true,'Yes.'),
 tf('eVTOLs are already everywhere.',false,'They are new.'),
 fl('eVTOLs fly on ___ power.',['electric','steam','wind','coal'],'Electric.')]),
L('fr-electric','Electric airplanes',[
 cd('Battery power','Electric airplanes use motors powered by batteries. They are quiet, have fewer parts and produce no exhaust in flight. Today they are mostly used for training and short trips.'),
 cd('Future','Better batteries could allow longer flights. Hybrid systems mix electric motors with fuel engines. Engineers also study hydrogen as a clean fuel.')],
 'Quiet and clean, but range is limited.',[
 mc('What powers an electric airplane?',['Batteries and motors','Steam','Coal','Wind only'],'Electric.'),
 mc('What is one benefit?',['Quiet operation','More noise','More exhaust','More oil'],'Quiet.'),
 mc('What is a hybrid?',['Electric plus fuel engine','Two wings','Two tails','Two pilots'],'Mixed power.'),
 tf('Hydrogen is being studied as fuel.',true,'Yes.'),
 tf('Electric planes have unlimited range today.',false,'Battery limits.'),
 fl('Electric motors have fewer ___ parts.',['moving','blue','sweet','loud'],'Moving.')]),
L('fr-saf','Sustainable fuels',[
 cd('Cleaner jet fuel','Sustainable aviation fuel, or SAF, is made from waste oils, plants or other sources. It can work in current engines and cut carbon emissions over its life cycle. Supply is still limited.'),
 cd('Growing use','Airlines are blending more SAF into regular fuel. Research continues to lower costs. Combined with better routes and aircraft, it helps reduce aviation’s footprint.')],
 'Cleaner fuel for today’s engines.',[
 mc('What is SAF?',['Sustainable aviation fuel','Super air fan','Safe airline fee','Sky alarm filter'],'Cleaner fuel.'),
 mc('Can SAF work in current engines?',['Yes, blended','No never','Only boats','Only cars'],'Drop-in.'),
 mc('What limits SAF?',['Limited supply','Too much supply','Color','Smell'],'Production.'),
 tf('SAF can be made from waste oils.',true,'Yes.'),
 tf('SAF requires new engines.',false,'Drop-in fuel.'),
 fl('SAF helps cut ___ emissions.',['carbon','color','cloud','coin'],'Carbon.')]),
L('fr-super','Supersonic comeback',[
 cd('Concorde','The Concorde flew passengers at twice the speed of sound from 1976 to 2003, crossing the Atlantic in about 3.5 hours. It was fast but noisy and costly. Supersonic flight over land has been restricted.'),
 cd('New designs','Engineers are working on quieter supersonic aircraft. New shapes try to reduce the loud sonic boom to a soft thump. NASA’s X-59 is testing this idea.')],
 'Concorde: Mach 2 across the Atlantic.',[
 mc('How fast did Concorde fly?',['About Mach 2','About Mach 0.2','About Mach 20','About Mach 200'],'Twice sound.'),
 mc('Why limit supersonic flight over land?',['Sonic booms','Birds','Snow','Radio'],'Noise.'),
 mc('Which NASA aircraft tests quiet supersonic flight?',['X-59','X-15','Cub','Comet'],'Low boom.'),
 tf('Concorde retired in 2003.',true,'Yes.'),
 tf('A sonic boom is quiet by default.',false,'It is loud.'),
 fl('A sonic ___ is a loud sound.',['boom','bell','bark','bloom'],'Boom.')]),
L('fr-hyper','Hypersonic and spaceplanes',[
 cd('Mach 5 and beyond','Hypersonic means faster than Mach 5. Researchers study vehicles and engines that can fly at these speeds. The extreme heat is a major challenge, so special materials are needed.'),
 cd('Spaceplanes','A spaceplane would take off from a runway, fly to space and land again. Projects like the Dream Chaser and Sierra Space aim to make orbital trips more flexible.')],
 'Extreme speed means extreme heat.',[
 mc('What is hypersonic?',['Faster than Mach 5','Slower than Mach 1','Exactly Mach 1','Standing still'],'Very fast.'),
 mc('What is a big challenge?',['Heat','Cold','Boredom','Rain'],'Friction.'),
 mc('What is a spaceplane?',['A craft that flies to space, lands on a runway','A kite','A boat','A train'],'Hybrid craft.'),
 tf('Special materials resist heat.',true,'Yes.'),
 tf('Hypersonic flight is common for airliners.',false,'It is experimental.'),
 fl('Hypersonic means faster than Mach ___.',['5','1','0','100'],'Five.')]),
L('fr-auto','Autonomous aircraft',[
 cd('Flying itself','Autonomous aircraft use computers and sensors to make decisions with little or no human control. Cargo drones and experimental airliners are being tested. Safety proof is a high bar.'),
 cd('The human role','Even highly automated systems need human oversight, backup plans and clear rules. People set goals, supervise and handle surprises. Pilots and engineers work together.')],
 'Computers help; humans supervise.',[
 mc('What do autonomous aircraft use?',['Sensors and computers','Magic','Chalk','Wind only'],'Technology.'),
 mc('What still matters?',['Human oversight','Nothing','Guessing','Luck'],'Supervision.'),
 mc('What is a high bar?',['Proving safety','Selling tickets','Painting','Waving'],'Certification.'),
 tf('Cargo drones are being tested.',true,'Yes.'),
 tf('Humans are never needed.',false,'Oversight remains.'),
 fl('Autonomous aircraft make ___ with computers.',['decisions','dinner','dolls','dust'],'Decisions.')]),
L('fr-air','Smarter airspace',[
 cd('Managing more traffic','As drones, air taxis and airplanes share the sky, new systems manage traffic. Unmanned traffic management, or UTM, helps drones avoid each other and manned aircraft.'),
 cd('Data sharing','Digital systems share routes, weather and restrictions in real time. The goal is a sky where many users fly safely and efficiently.')],
 'More users need smarter rules.',[
 mc('What is UTM?',['Unmanned traffic management','Ultra tall mountain','Universal tower map','Unit time marker'],'Drone traffic system.'),
 mc('What does it help drones avoid?',['Each other and airplanes','Clouds','Rain','Birds only'],'Separation.'),
 mc('What is shared digitally?',['Routes and weather','Songs','Menus','Jokes'],'Data.'),
 tf('More users need new traffic tools.',true,'Yes.'),
 tf('The sky never changes.',false,'It evolves.'),
 fl('UTM stands for unmanned traffic ___.',['management','machine','map','motion'],'Management.')]),
L('fr-comm','Commercial spaceflight',[
 cd('Space tourism and cargo','Private companies launch satellites, supply the Space Station and fly paying passengers. Reusable rockets land back on Earth and fly again, lowering costs.'),
 cd('Pilot skills','Spaceflight draws on pilot skills: teamwork, procedures and judgment. Many commercial astronauts are pilots, though some missions are highly automated.')],
 'Reusable rockets lower the cost of space.',[
 mc('What do reusable rockets do?',['Land and fly again','Explode each time','Never leave Earth','Float'],'Cost savings.'),
 mc('Who launches satellites?',['Private companies too','Nobody','Only birds','Only kids'],'Commercial space.'),
 mc('Which skill matters in spaceflight?',['Teamwork and procedures','Cooking','Painting','Singing'],'Pilot skills.'),
 tf('Some missions carry paying passengers.',true,'Yes.'),
 tf('All rockets are used once.',false,'Many are reusable.'),
 fl('Reusable rockets ___ on Earth.',['land','swim','sleep','sing'],'Land.')]),
L('fr-you','Your place in the future',[
 cd('The next chapter','Aviation has changed from wooden biplanes to jets and spacecraft in about a century. The next changes will come from people who learn, create and care about safety.'),
 cd('Your turn','Whether you become a pilot, engineer, controller or scientist, you can help shape the sky. Start with curiosity and keep learning.')],
 'The future of flight is waiting.',[
 mc('What drives aviation forward?',['People who learn and create','Luck','Wishing','Time alone'],'Innovation.'),
 mc('How long ago did powered flight begin?',['About 120 years','About 12 years','About 1,200 years','About 12,000 years'],'1903.'),
 mc('What should you keep doing?',['Learning','Quitting','Guessing','Waiting'],'Curiosity.'),
 tf('You can help shape the future of flight.',true,'Yes.'),
 tf('Everything is already invented.',false,'There is more to do.'),
 fl('Keep your ___ alive.',['curiosity','coupons','cookies','coins'],'Curiosity.')])
]);
})();
