/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* PRIVATE PILOT 5 - WEATHER THEORY: atmosphere, pressure, temperature, wind, moisture, stability, clouds, fog, fronts, thunderstorms, icing and turbulence. */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,mt,od,L}=H.dsl;
H.addLessons('wxtheory',[
L('wxt-atmo','The atmosphere',[
 cd('A thin blanket','The atmosphere is a layer of gases wrapped around Earth, about 78 percent nitrogen and 21 percent oxygen. Almost all weather happens in the lowest layer, the troposphere, which reaches about 36,000 feet on average.'),
 cd('Above the weather','The top of the troposphere is the tropopause. Above it is the stratosphere, where the air is dry and calm, and jets often cruise. Thinner air higher up is why pilots need oxygen above certain altitudes.')],
 'Weather lives in the troposphere.',[
 mc('Which layer holds nearly all weather?',['Troposphere','Stratosphere','Mesosphere','Space'],'The troposphere is the weather layer.'),
 mc('About how much of the air is oxygen?',['21 percent','78 percent','1 percent','50 percent'],'Nitrogen is 78 percent, oxygen 21.'),
 mc('What is the boundary above the troposphere?',['Tropopause','Ozone line','Skyline','Ceiling'],'Tropopause.'),
 tf('The stratosphere is above the troposphere.',true,'Jets often cruise there.'),
 tf('Weather mostly happens in the stratosphere.',false,'It happens in the troposphere.'),
 od('Put these layers from the ground up.',['Troposphere','Tropopause','Stratosphere'],'Weather layer first, then the boundary, then the calm layer.')]),
L('wxt-press','Air pressure',[
 cd('Weight of air','Air has weight, and the weight of the air above you is air pressure. At sea level on a standard day, pressure is 29.92 inches of mercury, or 1013.2 hectopascals. Pressure drops as you climb because there is less air above you.'),
 cd('About an inch per thousand','Near sea level, pressure falls about one inch of mercury for each 1,000 feet of climb. The altimeter works by sensing pressure, so a change in weather pressure changes its reading unless you update it.')],
 'Climb higher, pressure falls.',[
 mc('What is standard sea-level pressure?',['29.92 inches of mercury','12.5 inches','100 inches','0 inches'],'The standard number is 29.92.'),
 mc('How does pressure change as you climb?',['It decreases','It increases','It stays the same','It doubles'],'Less air above you.'),
 mc('About how much does pressure drop per 1,000 feet near sea level?',['About 1 inch of mercury','About 10 inches','About 0.01 inches','About 100 inches'],'About an inch.'),
 tf('The altimeter senses pressure.',true,'It converts pressure to altitude.'),
 tf('Pressure never changes with weather.',false,'It changes, so you reset the altimeter.'),
 fl('Standard sea-level pressure is 29.92 inches of ___.',['mercury','water','oil','ice'],'Mercury.')]),
L('wxt-temp','Temperature and lapse rate',[
 cd('Cooler as you climb','On a standard day, sea-level temperature is 15 degrees Celsius, or 59 degrees Fahrenheit. In the troposphere, temperature drops about 2 degrees Celsius, or 3.5 Fahrenheit, for each 1,000 feet. That is the standard lapse rate.'),
 cd('Real air differs','Real days are hotter or colder than standard. An inversion is when temperature rises with height instead of falling. Inversions trap haze and smoke and can make a calm, smooth ride with poor visibility.')],
 'Two degrees Celsius per thousand feet.',[
 mc('What is the standard sea-level temperature?',['15 degrees Celsius','0 degrees Celsius','50 degrees Celsius','100 degrees Celsius'],'Fifteen Celsius or 59 Fahrenheit.'),
 mc('About how much does temperature drop per 1,000 feet?',['2 degrees Celsius','20 degrees Celsius','0.2 degrees Celsius','200 degrees Celsius'],'Standard lapse rate.'),
 mc('What is an inversion?',['Temperature rising with height','Temperature falling fast','A kind of turn','A radio mix'],'It reverses the normal pattern.'),
 tf('Inversions can trap haze and smoke.',true,'Air above caps the layer.'),
 tf('The standard lapse rate is 20 degrees per 1,000 feet.',false,'It is about 2.'),
 fl('Warmer air above cooler air is a temperature ___.',['inversion','plunge','cone','loop'],'Inversion.')]),
L('wxt-wind','Why the wind blows',[
 cd('Pressure differences','Uneven heating of Earth’s surface creates areas of high and low pressure. Air flows from high pressure toward low pressure, and that flow is wind. The bigger the difference over a distance, the stronger the wind.'),
 cd('Earth’s spin','Earth’s rotation bends the wind to the right in the Northern Hemisphere. This is the Coriolis effect. The result is that wind circles clockwise around highs and counterclockwise around lows, spiraling slightly outward from highs and inward toward lows.')],
 'High to low, bent right by Earth’s spin.',[
 mc('Which way does air flow before it is bent?',['From high pressure to low pressure','From low to high','Straight up','In a square'],'High to low.'),
 mc('Which way does wind circle around a high in the Northern Hemisphere?',['Clockwise','Counterclockwise','Straight','Upward only'],'Clockwise around highs.'),
 mc('What bends wind to the right?',['The Coriolis effect','The radio','Fuel','Flaps'],'Earth’s rotation.'),
 tf('Lows have counterclockwise winds in the Northern Hemisphere.',true,'Air spirals inward.'),
 tf('Wind blows from low to high pressure.',false,'It blows from high to low.'),
 fl('The bigger the pressure difference, the ___ the wind.',['stronger','weaker','bluer','quieter'],'Stronger.')]),
L('wxt-moist','Moisture, dew point and humidity',[
 cd('Water in the air','Air holds water vapor. Warm air can hold more than cold air. Relative humidity is how full the air is compared to what it could hold at that temperature. When it reaches 100 percent, the water vapor condenses into cloud or fog.'),
 cd('Dew point','The dew point is the temperature at which the air becomes saturated. When the temperature and dew point are within about 5 degrees Fahrenheit, or 3 Celsius, clouds or fog may form. The smaller the gap, the closer the air is to condensing.')],
 'Temperature and dew point close? Expect fog or cloud.',[
 mc('What happens when relative humidity reaches 100 percent?',['Water vapor condenses','The air disappears','It gets drier','Nothing'],'The air is saturated.'),
 mc('What is the dew point?',['The temperature where air becomes saturated','The highest temperature','The altitude of clouds','A time of day'],'The saturation temperature.'),
 mc('A small temperature–dew point spread suggests…',['Clouds or fog may form','Clear skies forever','High winds','Low pressure only'],'The air is nearly saturated.'),
 tf('Warm air holds more water vapor than cold air.',true,'Warmth increases capacity.'),
 tf('A big spread means fog is about to form.',false,'A small spread does.'),
 fl('Temperature and dew point close together mean ___ or clouds.',['fog','sun','dust','stars'],'Fog.')]),
L('wxt-stable','Stable and unstable air',[
 cd('Lifting air cools','When air rises, it expands and cools. If the rising air stays cooler than the air around it, it sinks back. That is stable air. If it stays warmer than the air around it, it keeps rising. That is unstable air.'),
 cd('What you notice','Stable air gives smooth flying, layered clouds, and poor visibility from haze. Unstable air gives rough, bumpy flying, towering clouds, showers, and good visibility between them. Pilots look at both to plan the flight.')],
 'Stable is smooth and layered. Unstable is bumpy and heaped.',[
 mc('What does unstable air do?',['Keeps rising','Sinks back','Stays still','Freezes'],'It continues to rise.'),
 mc('Which clouds go with unstable air?',['Towering heaped clouds','Flat layers','No clouds','Fog only'],'Cumulus and towering cumulus.'),
 mc('What kind of ride goes with stable air?',['Smooth','Violent','Bumpy','Loud'],'Smooth but often hazy.'),
 tf('Rising air cools as it expands.',true,'Pressure falls with height.'),
 tf('Stable air produces thunderstorms.',false,'Unstable air does.'),
 mt('Match the air to the sky.',[['Stable air','Layered clouds, smooth'],['Unstable air','Heaped clouds, bumpy'],['Moist stable air','Fog or low stratus']],'The type of air shapes the weather.')]),
L('wxt-clouds','Reading the clouds',[
 cd('Shape names','Cumulus clouds are puffy heaps. Stratus clouds are flat layers. Cirrus clouds are thin, wispy, and high. Nimbus means rain-bearing. Words combine, so cumulonimbus is a towering thunderstorm cloud, and nimbostratus is a thick gray rain layer.'),
 cd('Heights','Low clouds are below about 6,500 feet above the ground, middle clouds from 6,500 to 20,000, and high clouds above 20,000. Cumulus can start low and grow tall. Cirrus often signals that weather is changing in a day or so.')],
 'Heap is cumulus, layer is stratus, wisp is cirrus.',[
 mc('Which cloud is a flat layer?',['Stratus','Cumulus','Cirrus','Nimbus'],'Stratus means layer.'),
 mc('Which cloud type is thin and high?',['Cirrus','Stratus','Cumulus','Fog'],'Cirrus.'),
 mc('What is cumulonimbus?',['A thunderstorm cloud','A fog','A thin cloud','A haze'],'A giant cloud with a storm.'),
 tf('Nimbus means rain.',true,'It is part of storm and rain cloud names.'),
 tf('Cirrus clouds are low and heavy.',false,'They are high and thin.'),
 fl('Cumulus clouds look like puffy ___.',['heaps','sheets','smoke','lines'],'Heaps.')]),
L('wxt-fog','Fog and how it forms',[
 cd('Fog is a cloud on the ground','Fog forms when air near the ground cools to its dew point. Radiation fog forms on clear, calm nights as the ground cools. Advection fog forms when moist air moves over a cooler surface, like warm ocean air over cold water.'),
 cd('Other types','Upslope fog forms when air is pushed up a hill, cooling as it rises. Steam fog forms when cold air passes over warmer water. Fog can drop visibility to nearly zero, so VFR pilots check temperature and dew point spread before takeoff.')],
 'Cool to the dew point and fog forms.',[
 mc('What is radiation fog?',['Fog from a cooling ground on clear calm nights','Fog from a radiator','Fog on a mountain','Fog in space'],'The ground cools and chills the air.'),
 mc('What is advection fog?',['Moist air over a cooler surface','Fog from rain','Fog from smoke','Fog from engines'],'It forms when air moves.'),
 mc('What does upslope fog need?',['Air pushed uphill','A flat desert','A lake of fire','A storm'],'Rising air cools.'),
 tf('Fog forms when air cools to its dew point.',true,'That is saturation.'),
 tf('Fog only occurs in winter.',false,'It can form in any season.'),
 fl('Fog is a cloud on the ___.',['ground','moon','wing','radio'],'Ground.')]),
L('wxt-front','Fronts',[
 cd('Where air masses meet','A front is a boundary between two air masses of different temperature. A cold front is cold air pushing under warm air, often with fast storms. A warm front is warm air sliding over cold air, with a long gentle slope and widespread clouds and drizzle.'),
 cd('Other fronts','A stationary front barely moves. An occluded front forms when a cold front catches up to a warm front. Fronts are shown on weather maps with colored lines, such as a blue line with triangles for cold and a red line with half circles for warm.')],
 'Cold fronts are fast and sharp; warm fronts are slow and wide.',[
 mc('What weather is common with a fast cold front?',['Storms and gusty winds','Perfect calm','Nothing','Thick fog only'],'Cold fronts lift warm air quickly.'),
 mc('What is a warm front like?',['Slow and widespread clouds','Fast and violent','Invisible','Over in a minute'],'Gentle slope, long lasting.'),
 mc('How is a cold front drawn on a map?',['Blue line with triangles','Red line with half circles','Green dots','Black dashes'],'Blue triangles.'),
 tf('A stationary front barely moves.',true,'It stalls in place.'),
 tf('A warm front always brings thunderstorms in minutes.',false,'Warm fronts are gradual.'),
 fl('A front is a boundary between two air ___.',['masses','towns','planes','stars'],'Air masses.')]),
L('wxt-thunder','Thunderstorms',[
 cd('What they need','Three ingredients make a thunderstorm: moist air, unstable air, and something to lift it. They grow through three stages: cumulus, where air rises; mature, where rain and downdrafts begin; and dissipating, when downdrafts take over.'),
 cd('Dangers','Thunderstorms bring severe turbulence, hail, lightning, strong winds, wind shear, microbursts and sometimes tornadoes. Never fly into one. Stay at least 20 nautical miles from a severe thunderstorm, and remember storms can grow quickly in the afternoon.')],
 'Stay 20 miles away from the big ones.',[
 mc('Which stage has rain and downdrafts?',['Mature','Cumulus','Dissipating','Beginning'],'Rain and downdrafts start in the mature stage.'),
 mc('How far should you stay from severe thunderstorms?',['At least 20 nautical miles','2 miles','200 feet','Right next to them'],'Twenty nautical miles.'),
 mc('Which is a thunderstorm ingredient?',['Moist, unstable air and a lifting force','Cold dry air only','A clear sky','A flat desert'],'These three ingredients.'),
 tf('Microbursts are dangerous for aircraft near the ground.',true,'They can bring sudden sinking air.'),
 tf('It is safe to fly under a thunderstorm.',false,'It is very dangerous.'),
 od('Put the stages in order.',['Cumulus','Mature','Dissipating'],'Growth, peak, decay.')]),
L('wxt-ice','Icing and turbulence',[
 cd('Structural icing','Icing is when ice forms on the airplane. It spoils the wing’s shape, adds weight, and can block pitot tubes and air intakes. Ice needs visible moisture and a temperature near or below freezing. Most small airplanes are not approved for flight in icing.'),
 cd('Turbulence','Turbulence is uneven air that bounces the airplane. It comes from heat rising, wind over mountains, storms, and wind shear. Slow down to maneuvering speed and keep the airplane level. Most turbulence is only uncomfortable, but severe turbulence can damage an airplane.')],
 'Avoid icing. Slow to Va in turbulence.',[
 mc('What does ice on the wing do?',['Spoils lift and adds weight','Adds lift','Adds speed','Cools the engine'],'Icing disrupts the airflow.'),
 mc('What do you do in turbulence?',['Slow to maneuvering speed','Speed up','Dive','Turn off the engine'],'Va protects the airplane.'),
 mc('What is needed for ice to form?',['Visible moisture and near-freezing temps','Clear dry air','Warm sun','A flat sky'],'Both are needed.'),
 tf('Most small airplanes are not approved for known icing.',true,'Avoid it.'),
 tf('Turbulence always damages the airplane.',false,'Most is only uncomfortable.'),
 fl('Slow to ___ speed in turbulence.',['maneuvering','top','landing','taxi'],'Maneuvering speed, Va.')])
]);
})();
