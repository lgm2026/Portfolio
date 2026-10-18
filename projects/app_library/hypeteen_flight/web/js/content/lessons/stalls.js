/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* STUDENT PILOT 6 - SLOW FLIGHT + STALLS: angle of attack, stall warnings, recoveries, spins. */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,od,L}=H.dsl;
H.addLessons('stalls',[
L('stl-aoa','A stall is about angle, not speed',[
 cd('What a stall is','A wing stalls when its angle of attack, the angle between the wing and the oncoming air, gets too big. The smooth airflow breaks away from the top of the wing and lift drops sharply. The airplane did not run out of power or gas.'),
 cd('Any speed, any attitude','Because it is the angle that matters, an airplane can stall at any airspeed and in any attitude, even in a steep turn or a dive pull-up. Reducing the angle of attack is always the fix.')],
 'A wing stalls when the angle is too big.',[
 mc('What causes a stall?',['Exceeding the critical angle of attack','Running out of fuel','A lost propeller','Low oil'],'Airflow separates when the angle gets too large.'),
 mc('What is the fix for a stall?',['Reduce the angle of attack','Pull back harder','Raise the flaps','Turn off the engine'],'Lowering the nose brings the airflow back.'),
 mc('Can an airplane stall in a steep turn?',['Yes, at any speed','No, never','Only on the ground','Only in rain'],'It stalls whenever the critical angle is exceeded.'),
 tf('A stall means the engine has quit.',false,'It is a wing problem, not an engine problem.'),
 tf('An airplane can stall at a high airspeed.',true,'A sharp pull can exceed the critical angle at any speed.'),
 fl('The angle between the wing and the oncoming air is the angle of ___.',['attack','bank','roll','climb'],'Angle of attack is the key to stalls.')]),
L('stl-speed','What changes stall speed',[
 cd('Weight and load','A heavier airplane stalls at a higher speed. So does an airplane pulling extra g in a turn. At a 60-degree bank, the wing carries twice the airplane’s weight, and the stall speed rises about 40 percent.'),
 cd('Flaps and more','Lowering flaps lowers the stall speed, which is why we land with them. Ice, a forward center of gravity, and rough or dirty wings can also change it. Pilots always keep a safe margin above stall speed.')],
 'Heavier, steeper, faster stall. Flaps lower the speed.',[
 mc('What happens to stall speed in a steep bank?',['It goes up','It goes down','It stays the same','It disappears'],'Higher load factor raises stall speed.'),
 mc('What do flaps do to stall speed?',['Lower it','Raise it','Nothing','Double it'],'Extended flaps let the airplane fly slower.'),
 mc('Which airplane stalls at a higher speed?',['A heavier one','A lighter one','A cleaner one','A newer one'],'More weight needs more lift.'),
 tf('A 60-degree bank makes the wing carry about twice the weight.',true,'That is a load factor of 2 g.'),
 tf('Stall speed is the same no matter what.',false,'Many things change it.'),
 fl('Flying with extra g raises the stall ___.',['speed','angle','pitch','trim'],'Stall speed goes up with load factor.')]),
L('stl-warn','Warnings that a stall is coming',[
 cd('Signals','Most airplanes warn you before a stall. The stall horn sounds. The controls feel soft and mushy. The nose is high, the engine sound changes, and the airplane may start to shake, which is called buffet.'),
 cd('Respond early','Do not wait for the full stall. Lower the nose and add power at the first warning. A pilot who recognizes the signs early never has to deal with the stall itself.')],
 'Horn, mush, buffet: nose down.',[
 mc('What is stall buffet?',['A shaking as the airflow breaks away','A kind of cloud','A radio fault','A tire noise'],'Turbulent air from the wing shakes the airplane.'),
 mc('What should you do at the first stall warning?',['Lower the nose and add power','Pull back','Close your eyes','Turn off the radio'],'Reduce the angle of attack right away.'),
 mc('Which is a stall sign?',['Mushy controls','Brighter lights','Louder radio','Colder cabin'],'The controls feel less effective.'),
 tf('A stall horn is a warning to act.',true,'It means you are close to the stall.'),
 tf('The stall horn can be ignored if you feel fine.',false,'It is a safety system.'),
 fl('A shaking of the airplane before a stall is called ___.',['buffet','lunch','fade','float'],'Buffet is a strong warning.')]),
L('stl-recover','Recovering from a stall',[
 cd('The steps','To recover, first reduce the angle of attack by lowering the nose. Then add full power, level the wings, and return to the desired flight. Use the rudder to keep the nose straight if one wing drops.'),
 cd('Smooth, not scary','You will lose some altitude, so practice at a safe height. A prompt recovery is smooth and calm. Raise flaps in stages only after the airplane is flying well again.')],
 'Nose down, power up, wings level, fly.',[
 mc('What is the first step in a stall recovery?',['Reduce the angle of attack','Raise the flaps fully','Turn off the engine','Pull back'],'Lowering the nose gets the wing flying again.'),
 mc('Which control keeps the nose straight if a wing drops?',['Rudder','Throttle','Flaps','Trim'],'Opposite rudder prevents a spin.'),
 mc('Why practice stalls at a safe height?',['You lose altitude during recovery','Because it is colder','Because of traffic','Because of the radio'],'Height gives room to recover.'),
 tf('Full power is added during recovery.',true,'Power helps the airplane gain speed.'),
 tf('Recovery means pulling the yoke all the way back.',false,'That keeps the wing stalled.'),
 od('Put the recovery steps in order.',['Lower the nose','Add full power','Level the wings','Return to flight'],'Reduce the angle, add power, level up, and fly away.')]),
L('stl-slow','Slow flight',[
 cd('On the edge','Slow flight is flying just above the speed at which the airplane would stall, with a high nose and extra power. It teaches you how the airplane feels, how the controls get mushy, and how power and pitch work together.'),
 cd('Back of the power curve','At slow speeds, pulling back makes you sink instead of climb, and power controls altitude. Pilots also use slow flight to practice for landing, where speed is low and attention must be high.')],
 'At slow speeds, power holds altitude.',[
 mc('What is slow flight?',['Flying just above stall speed','Flying at top speed','Flying upside down','Taxiing'],'It is controlled flight at a very low airspeed.'),
 mc('What do the controls feel like in slow flight?',['Mushy','Stiff','Frozen','Noisy'],'Less airflow means less control feel.'),
 mc('At slow speeds, which control mostly holds altitude?',['Power','The compass','The radio','The seat'],'The airplane is on the back side of the power curve.'),
 tf('Slow flight practice helps with landing.',true,'Landing happens at slow speeds.'),
 tf('Pulling back always makes you climb in slow flight.',false,'You may sink instead.'),
 fl('Slow flight is flown at a high nose attitude and extra ___.',['power','trim','fuel','flaps up'],'Extra power supports the airplane.')]),
L('stl-off','Power-off stalls',[
 cd('Landing practice','A power-off stall imitates the end of a landing. The pilot reduces power, sets landing flaps, holds altitude by raising the nose, and waits for the stall. Then the recovery begins.'),
 cd('Why practice','This stall shows what happens if a pilot lets the airplane get too slow on final approach. Learning the signs and the recovery makes you confident close to the ground, where you must never stall by accident.')],
 'Practice the stall high so it never happens low.',[
 mc('What does a power-off stall imitate?',['A landing approach','A takeoff','A taxi','A refueling'],'It copies the speed and setup of landing.'),
 mc('How is the stall brought on?',['Raising the nose to hold altitude','Adding power','Banking steeply','Dropping the gear'],'The nose rises as speed falls until the wing stalls.'),
 mc('Why practice power-off stalls?',['To avoid an accidental stall during landing','For fun only','To waste fuel','To meet the weather'],'Recognition prevents accidents.'),
 tf('Landing flaps are normally set for a power-off stall practice.',true,'It matches the landing setup.'),
 tf('You must complete this practice near the ground.',false,'Do it high, with plenty of room.'),
 fl('A stall with the engine at idle is called a power-___ stall.',['off','on','low','up'],'Power-off stall matches a landing.')]),
L('stl-on','Power-on stalls',[
 cd('Takeoff practice','A power-on stall imitates a takeoff or go-around. The pilot sets takeoff power and raises the nose until the wing stalls. The nose is much higher than in a power-off stall.'),
 cd('Right rudder','With full power and a high nose, the airplane wants to turn left, so the pilot uses right rudder to stay straight. Recovery is the same: lower the nose, keep the wings level, and fly out.')],
 'High power, high nose: use the rudder.',[
 mc('What does a power-on stall imitate?',['A takeoff or go-around','A landing','A taxi','A refueling'],'It copies the climb out.'),
 mc('Why use right rudder in a power-on stall?',['To counter the left turning tendency','To go faster','To slow the engine','To change the radio'],'Propeller effects pull the nose left.'),
 mc('Is the nose higher in power-on or power-off?',['Power-on','Power-off','The same','Neither'],'The extra power allows a higher nose.'),
 tf('The recovery starts by lowering the nose.',true,'Reduce the angle of attack.'),
 tf('The airplane will never turn in a power-on stall.',false,'It tends to roll or yaw, so rudder is needed.'),
 fl('A power-on stall copies a ___ climb.',['takeoff','landing','taxi','spin'],'It simulates leaving the runway.')]),
L('stl-types','Other stalls',[
 cd('Secondary and accelerated','A secondary stall happens if you pull too hard after the first recovery. An accelerated stall happens at a higher speed when the wing is loaded in a steep turn or sharp pull-up. Both are surprises that careful flying avoids.'),
 cd('Cross-control stalls','A cross-control stall happens when you are turning with the rudder and aileron crossed, such as in a skidding turn. It can cause a sudden roll and a spin, and is most dangerous in the pattern.')],
 'Keep the ball centered, especially when it is low and slow.',[
 mc('What causes a secondary stall?',['Pulling too hard after the first recovery','Using flaps','Flying slow on purpose','A weak battery'],'Recover smoothly instead.'),
 mc('Where is a cross-control stall most dangerous?',['Near the ground in the pattern','At 10,000 feet','On the ground','In a simulator'],'Low altitude leaves no recovery room.'),
 mc('An accelerated stall happens…',['At higher speed under extra load','Only at idle','Only in cruise','Never'],'The wing stalls whenever the angle gets too big.'),
 tf('A skidding turn near the ground is a trap.',true,'It can lead to a spin close to the ground.'),
 tf('You can only stall at one speed.',false,'Speed depends on load.'),
 fl('Keeping the ___ centered avoids cross-control flying.',['ball','tach','clock','flap'],'Coordinated turns avoid cross-control stalls.')]),
L('stl-spin','Spins and recovery',[
 cd('What a spin is','A spin happens when one wing is more stalled than the other, usually because of yaw. The airplane rotates around while descending steeply. Spins are rare, but a stall with a yaw can turn into one.'),
 cd('PARE','The standard recovery is PARE: reduce Power to idle, neutralize Ailerons, apply opposite Rudder against the rotation, and move the Elevator forward to break the stall. Then level the wings and pull out smoothly.')],
 'PARE: Power, Ailerons, Rudder, Elevator.',[
 mc('What does the P in PARE stand for?',['Power to idle','Pitch up','Pressure','Prop'],'Reduce power to idle first.'),
 mc('Which rudder is used to recover from a spin?',['Opposite the rotation','Same as the rotation','None','Both'],'Opposite rudder stops the spin.'),
 mc('What causes a spin?',['One wing more stalled than the other','A flat tire','A closed window','A full tank'],'Yaw while stalled can start it.'),
 tf('The recovery includes moving the elevator forward.',true,'It breaks the stall.'),
 tf('Spins are the same as spiral dives.',false,'A spin is a stalled condition, a spiral dive is not.'),
 od('Put PARE in order.',['Power to idle','Ailerons neutral','Rudder opposite','Elevator forward'],'The letters give the order.')]),
L('stl-safe','Safe altitudes and stall habits',[
 cd('Room to recover','Practice stalls and slow flight high above the ground. Many training standards expect stall recoveries to be completed no lower than 1,500 feet above the ground. That is plenty of space to recover.'),
 cd('Never near the ground','Stalls near the ground leave no room. Keep your speed up in the pattern, fly coordinated turns, and add power before the airplane gets too slow. Most stall accidents happen low and close to the runway.')],
 'High to practice, never low to find out.',[
 mc('Where should you practice stalls?',['High above the ground','Over a school','On the runway','In the pattern'],'Altitude is room to recover.'),
 mc('About how high is a common minimum for stall recoveries?',['1,500 feet above the ground','50 feet','100 feet','Sea level'],'Standards require a safe margin.'),
 mc('Where do most stall accidents happen?',['Low and close to the ground','At 10,000 feet','Over the ocean','In a simulator'],'There is no room to recover low.'),
 tf('Keep your speed up in the traffic pattern.',true,'Low and slow is dangerous.'),
 tf('Stalls are safe to try near the runway.',false,'Never do that.'),
 fl('Practice stalls with plenty of ___ below you.',['altitude','traffic','water','fuel'],'Height gives room to recover.')])
]);
})();
