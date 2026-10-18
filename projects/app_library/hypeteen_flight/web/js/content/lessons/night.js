/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* PRIVATE PILOT 10 - NIGHT FLYING: eyes at night, illusions, definitions and equipment, preflight, takeoff, airport lights, landings, night trouble. */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,mt,L}=H.dsl;
H.addLessons('night',[
L('nt-eyes','How your eyes work at night',[
 cd('Rods and cones','Your eye has two kinds of cells. Cones see color and fine detail in bright light and sit in the center of your vision. Rods see in dim light and sit around the edges. At night you see best with the rods, so you must look a little off to the side of what you want to see.'),
 cd('Dark adaptation','It takes about 30 minutes for your eyes to adjust fully to the dark. A bright white light resets this. Pilots use red flashlights and dim cockpit lights, and shield their eyes from bright lights. Good dark adaptation helps spot traffic and terrain.')],
 'Look off-center and protect your night vision.',[
 mc('Which cells see best in dim light?',['Rods','Cones','Lenses','Pupils'],'Rods work in low light.'),
 mc('How long does full dark adaptation take?',['About 30 minutes','About 3 seconds','About 3 days','About 3 hours'],'Half an hour.'),
 mc('What kind of flashlight is best in a night cockpit?',['Red','Bright white','Blinking','UV'],'Red preserves night vision.'),
 tf('At night you see better by looking slightly off-center.',true,'Rods are around the edges.'),
 tf('A bright white light helps night vision.',false,'It ruins it.'),
 fl('The cells that see color are called ___.',['cones','rods','lashes','lids'],'Cones.')]),
L('nt-illus','Night illusions',[
 cd('Tricks of the dark','At night your senses can trick you. Autokinesis makes a stationary light appear to move if you stare at it. A false horizon happens when a line of lights or a dark slope looks like the horizon. Always trust the instruments.'),
 cd('Landing illusions','A black hole approach is landing toward a runway with no lights before it, such as over water or empty land. It can make you feel too high, and you descend too low. Using a glide path indicator and a stable approach prevents this.')],
 'Trust instruments and use glide path guides.',[
 mc('What is autokinesis?',['A stationary light seeming to move','A kind of cloud','A fuel mix','A radio call'],'Staring causes it.'),
 mc('How do you avoid it?',['Scan; do not stare','Stare harder','Close your eyes','Turn off the lights'],'Keep your eyes moving.'),
 mc('What does a black hole approach do?',['Makes you feel too high so you descend too low','Makes you land long','Lights the runway','Speeds you up'],'No visual clues, so you descend low.'),
 tf('A line of lights can create a false horizon.',true,'Check your attitude indicator.'),
 tf('You should rely only on feelings at night.',false,'Use instruments.'),
 fl('A ___ horizon is a line that looks like the real one.',['false','blue','straight','soft'],'False horizon.')]),
L('nt-def','What counts as night',[
 cd('Two definitions','For position lights, night is from sunset to sunrise. For carrying passengers, night currency applies from one hour after sunset to one hour before sunrise. A pilot needs three full-stop landings during that time to carry passengers at night.'),
 cd('Required equipment','For night VFR the airplane needs position lights, an anti-collision light, a source of electrical power, and spare fuses. Pilots also carry a flashlight with spare batteries. Instrument lights must work, and a landing light is recommended.')],
 'Lights on from sunset; night landings an hour later.',[
 mc('When must position lights be on?',['Sunset to sunrise','Only at noon','Only on weekends','Never'],'During night.'),
 mc('How many night landings are needed to carry passengers at night?',['Three full-stop landings','One','Twenty','None'],'Within 90 days.'),
 mc('Which of these is required for night VFR?',['An anti-collision light','A radio','A parachute','Floats'],'Required lighting.'),
 tf('Pilots should carry a flashlight at night.',true,'You need light for charts and checks.'),
 tf('Night currency starts at sunset.',false,'It starts one hour after sunset.'),
 fl('Night currency uses ___ landings.',['full-stop','touch-and-go','water','glide'],'Full-stop.')]),
L('nt-pre','Preflight at night',[
 cd('See what you check','Use a flashlight to inspect the airplane at night. Look at the wings, control surfaces and tires closely, as things are harder to see. Check all the lights: position, strobes, beacon and landing lights.'),
 cd('Plan more carefully','Study the route, airport diagrams and frequencies before you go. Choose airports that have lights and services. Write down altitudes that clear terrain and towers. Plan to fly at a higher altitude than you would in the day.')],
 'More light, more care, more margin.',[
 mc('Why look at lights during the preflight?',['To be sure they work','To count them','For decoration','To save fuel'],'They must be on.'),
 mc('How do you plan the night route?',['Use higher altitudes and lit airports','Fly low','Avoid charts','Skip weather'],'Margins matter.'),
 mc('What is helpful for the preflight?',['A flashlight','A sunglass','A hat','A kite'],'Light to see.'),
 tf('Things are harder to see at night.',true,'Look closely.'),
 tf('You can skip the preflight at night.',false,'Always check.'),
 fl('At night, choose airports with ___.',['lights','trees','hills','no radio'],'Lighted runways.')]),
L('nt-to','Takeoff and climb at night',[
 cd('Instruments matter','At night, after liftoff, the world outside may be dark. The pilot uses the attitude indicator and other instruments to keep the wings level and the climb steady. Don’t try to rely only on seeing outside.'),
 cd('No early turns','Climb straight ahead until you are at a safe altitude and speed. Avoid turning just after liftoff when there is no horizon. Look for lights of towns to the sides but not for a horizon. Set the climb attitude and let the airplane do its work.')],
 'Dark horizon? Fly the instruments.',[
 mc('What do you rely on after a dark takeoff?',['The instruments','Only your feelings','A song','The seat'],'Use attitude and speed.'),
 mc('When should you start your first turn?',['After reaching a safe altitude','Immediately','Before liftoff','Never'],'Climb straight first.'),
 mc('What outside reference is often missing?',['The horizon','The runway','The sky','Stars'],'No visible horizon.'),
 tf('Avoid turning just after liftoff at night.',true,'You may lose your sense of direction.'),
 tf('You can see the horizon clearly over a dark area.',false,'Often you cannot.'),
 fl('At night use the attitude ___.',['indicator','antenna','arrow','arm'],'Attitude indicator.')]),
L('nt-lights','Airport lights at night',[
 cd('Finding the field','At night, look for the rotating beacon: white and green flashes mean a lighted civilian airport. Runway edge lights are white, taxiway lights are blue, and the runway ends have green at the approach end and red at the departure end.'),
 cd('Pilot-controlled lighting','At many small airports the lights are off until you turn them on with your radio. Key the microphone on the airport’s frequency: 3 clicks for low intensity, 5 for medium, and 7 for high. Check the chart supplement for the frequency and details.')],
 'Three, five, seven clicks for low, medium, high.',[
 mc('How many clicks turn on pilot-controlled lights to high intensity?',['7','3','5','1'],'Seven for high.'),
 mc('How many clicks for low intensity?',['3','7','5','10'],'Three for low.'),
 mc('What color is the runway end as seen from the approach end?',['Green','Red','Blue','White'],'Green threshold, red at the far end.'),
 tf('Taxiway edge lights are blue.',true,'They help tell taxiways from runways.'),
 tf('Pilot-controlled lights are always on.',false,'You turn them on by radio.'),
 mt('Match the clicks to the setting.',[['3 clicks','Low'],['5 clicks','Medium'],['7 clicks','High']],'Odd numbers, rising intensity.')]),
L('nt-land','Night landings',[
 cd('Depth perception','At night it is harder to judge height above the runway. Use a glide path indicator like a PAPI if there is one, fly a stable approach, and keep the speed right. Look down the runway, not at the lights directly below you.'),
 cd('Use the landing light','Turn on the landing light on final if you have one. The flare may seem later than during the day, so ease the nose up smoothly and expect the ground to arrive. Many pilots find night landings smooth once practiced.')],
 'Stable approach, glide path guide, look far ahead.',[
 mc('What helps judge height at night?',['A PAPI','A radio','The tires','The seat'],'Glide path lights.'),
 mc('Where do you look in the flare at night?',['Down the runway','At your feet','At the stars','At the panel'],'Look far ahead.'),
 mc('When do you turn on the landing light?',['On final approach','After landing','Never','In cruise'],'It helps you see.'),
 tf('Night landings are easier with a stable approach.',true,'Consistency is key.'),
 tf('You should flare based only on the lights below you.',false,'Look far down the runway.'),
 fl('A PAPI helps with ___ path.',['glide','radio','fuel','map'],'Glide path.')]),
L('nt-trouble','Trouble at night',[
 cd('Engine trouble','If an engine fails at night, set the best glide speed and pick the safest option. Head for a known airport if possible. Over lit areas, choose open dark spaces such as parks or fields rather than lit streets with wires and traffic. Use the landing light when you are low.'),
 cd('Staying ahead','Fly routes near airports and over terrain you know. Keep your fuel high. Tell someone your route. At night there are fewer places to land safely, so a margin is worth even more than in the daytime.')],
 'Fly where you have options.',[
 mc('What should you do first if the engine fails at night?',['Set best glide speed','Turn off the lights','Climb','Call a friend'],'Aviate.'),
 mc('Which makes a better landing area at night?',['Open dark fields','Lit streets with wires','A busy road','A city center'],'Open areas are safer.'),
 mc('Why keep extra fuel at night?',['Fewer places to land safely','To save weight','For fun','Not needed'],'Extra margin.'),
 tf('Tell someone your night route.',true,'It aids search and rescue.'),
 tf('Night flying has the same landing options as day.',false,'There are fewer visible options.'),
 fl('At night, fly routes that offer ___.',['options','traffic','clouds','mountains'],'Options.')])
]);
})();
