/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* BEYOND 11 - AVIATION HISTORY */
(function(){
const H=G.HFQ, {cd,mc,tf,fl,od,L}=H.dsl;
H.addLessons('history',[
L('hs-early','Dreamers and kites',[
 cd('Before engines','People dreamed of flying for thousands of years. Kites in China, Leonardo da Vinci’s sketches, and the first hot air balloon flights in France in 1783 all showed that the sky could be reached.'),
 cd('Gliders','Otto Lilienthal flew hundreds of glider flights in the 1890s and took careful notes. His work taught the Wright brothers how wings work.')],
 'Gliders and balloons came first.',[
 mc('When did the first balloon flights happen?',['1783','1583','1983','1883'],'France.'),
 mc('Who studied gliders in the 1890s?',['Otto Lilienthal','Chuck Yeager','Neil Armstrong','Wilbur Wright'],'German glider pioneer.'),
 mc('Who sketched flying machines?',['Leonardo da Vinci','Isaac Newton','Albert Einstein','Marie Curie'],'Renaissance artist.'),
 tf('Kites were used in China long ago.',true,'Yes.'),
 tf('Balloons came after jets.',false,'Much earlier.'),
 fl('Lilienthal flew ___.',['gliders','jets','rockets','trains'],'Gliders.')]),
L('hs-wright','The Wright brothers',[
 cd('Kitty Hawk','On December 17, 1903, Orville and Wilbur Wright made the first sustained, controlled powered flights near Kitty Hawk, North Carolina. The first flight lasted 12 seconds and went about 120 feet.'),
 cd('Three-axis control','The Wrights invented a way to control roll, pitch and yaw, using wing warping, an elevator and a rudder. Their method of three-axis control is still the basis of airplane control today.')],
 'December 17, 1903: 12 seconds that changed the world.',[
 mc('When did the Wrights first fly?',['December 17, 1903','July 4, 1776','May 1, 1927','June 1, 1969'],'Kitty Hawk.'),
 mc('How long was the first flight?',['12 seconds','12 hours','12 minutes','12 days'],'Short but historic.'),
 mc('What did they invent?',['Three-axis control','The radio','The jet','The parachute'],'Roll, pitch and yaw.'),
 tf('The Wrights flew near Kitty Hawk.',true,'North Carolina.'),
 tf('The first flight lasted an hour.',false,'12 seconds.'),
 fl('The Wright brothers were Orville and ___.',['Wilbur','Walter','William','Warren'],'Wilbur.')]),
L('hs-ww1','World War I aviation',[
 cd('Planes go to war','In 1914, airplanes were used mostly to scout. Within four years they had machine guns, bombs and fighters. Aircraft grew rapidly in speed and strength.'),
 cd('Lessons learned','The war pushed engineers to improve engines, structures and radios. Pilots learned about navigation and teamwork. After 1918, many returned to start airlines and flying schools.')],
 'War sped up aircraft development.',[
 mc('What was early military use?',['Scouting','Cargo only','Racing','Tourism'],'Observation.'),
 mc('What improved quickly?',['Engines and structures','Colors only','Names','Hats'],'Technology.'),
 mc('What did pilots do after the war?',['Start airlines and schools','Stop flying','Hide','Retire'],'Aviation grew.'),
 tf('Planes improved fast during the war.',true,'Yes.'),
 tf('Airplanes were invented during WWI.',false,'1903.'),
 fl('World War I lasted from 1914 to ___.',['1918','1928','1908','1938'],'1918.')]),
L('hs-lindy','Lindbergh and the Atlantic',[
 cd('Solo across the ocean','On May 20–21, 1927, Charles Lindbergh flew the Spirit of St. Louis from New York to Paris in about 33.5 hours. It was the first solo nonstop flight across the Atlantic.'),
 cd('Impact','The flight sparked worldwide interest in aviation. Airlines grew, and people began to believe that flying could connect continents. Careful planning and navigation made it possible.')],
 'New York to Paris, alone, 1927.',[
 mc('What was Lindbergh’s plane called?',['Spirit of St. Louis','Enterprise','Flyer','Eagle'],'1927.'),
 mc('Where did he land?',['Paris','London','Rome','Berlin'],'France.'),
 mc('How long did the flight take?',['About 33.5 hours','About 3 hours','About 3 days','About 3 weeks'],'Long solo trip.'),
 tf('It was a nonstop solo flight.',true,'Yes.'),
 tf('Lindbergh had a copilot.',false,'He flew alone.'),
 fl('Lindbergh flew across the ___.',['Atlantic','Pacific','Sahara','Rockies'],'Atlantic.')]),
L('hs-earhart','Amelia Earhart',[
 cd('A record setter','In 1932, Amelia Earhart became the first woman to fly solo across the Atlantic. She set many records and inspired countless girls and women to fly. She also helped found the Ninety-Nines, an organization of women pilots.'),
 cd('Her last flight','In 1937 she and navigator Fred Noonan disappeared during an attempt to fly around the world. Her legacy lives on in her courage and curiosity.')],
 'First woman to fly solo across the Atlantic.',[
 mc('What did Earhart achieve in 1932?',['Solo Atlantic crossing','Moon landing','Sound barrier','Round the world'],'Record.'),
 mc('What group did she help found?',['The Ninety-Nines','The Blue Angels','The Thunderbirds','The Flyers'],'Women pilots.'),
 mc('Who was her navigator in 1937?',['Fred Noonan','Wiley Post','Neil Armstrong','Chuck Yeager'],'World flight attempt.'),
 tf('She inspired many women to fly.',true,'Yes.'),
 tf('She was the first person to fly the Atlantic.',false,'Alcock and Brown were earlier.'),
 fl('Earhart was a famous ___.',['pilot','painter','pirate','plumber'],'Pilot.')]),
L('hs-golden','The golden age',[
 cd('Between the wars','The 1920s and 1930s saw air races, record flights and new airliners. The Douglas DC-3, first flown in 1935, made air travel practical and profitable. Many are still flying today.'),
 cd('Air mail','Air mail pilots flew in all weather to carry letters quickly across the country. Their courage and routes laid the foundation for airlines.')],
 'The DC-3 made airline travel practical.',[
 mc('Which airliner made flying practical?',['DC-3','Comet','747','Concorde'],'1935.'),
 mc('What did air mail pilots carry?',['Letters','Sandwiches','Cars','Boats'],'Mail.'),
 mc('What happened in the 1930s?',['Air races and records','No flying','Moon landing','Jets for all'],'Golden age.'),
 tf('Some DC-3s still fly.',true,'Yes.'),
 tf('The DC-3 was a jet.',false,'Propeller driven.'),
 fl('Air ___ pilots carried letters.',['mail','milk','music','metal'],'Mail.')]),
L('hs-ww2','Aviation in World War II',[
 cd('Rapid change','From 1939 to 1945, aircraft design changed dramatically. Planes flew faster and higher. Radar, pressurized cabins and the first jet fighters appeared. Millions of people worked to build and fly aircraft.'),
 cd('Many roles','Women Airforce Service Pilots, called WASPs, flew new airplanes from factories to bases. The Tuskegee Airmen, the first Black military pilots in the U.S., proved their skill and helped change history.')],
 'WASPs and Tuskegee Airmen broke barriers.',[
 mc('What did WASPs do?',['Flew new airplanes to bases','Built houses','Cooked','Sailed'],'Ferry work.'),
 mc('Who were the Tuskegee Airmen?',['First Black military pilots in the U.S.','First astronauts','Firefighters','Airline founders'],'Pioneers.'),
 mc('What new technology appeared?',['Radar and jets','Balloons','Kites','Sails'],'Innovation.'),
 tf('Aircraft got faster and higher.',true,'Yes.'),
 tf('Radar was invented after 1970.',false,'Earlier.'),
 fl('The Tuskegee Airmen were skilled ___.',['pilots','painters','poets','potters'],'Pilots.')]),
L('hs-jet','The jet and space age',[
 cd('Supersonic and beyond','In 1947, Chuck Yeager broke the sound barrier. By 1958, the Boeing 707 began jet service. In 1961, Yuri Gagarin became the first human in space, and in 1969 humans walked on the Moon.'),
 cd('Faster, higher','Within 66 years of Kitty Hawk, humans went from 12-second hops to the Moon. Few periods in history have changed as fast.')],
 'From Kitty Hawk to the Moon in 66 years.',[
 mc('Who was first in space?',['Yuri Gagarin','Neil Armstrong','Chuck Yeager','Buzz Aldrin'],'1961.'),
 mc('When did humans walk on the Moon?',['1969','1929','1909','1999'],'Apollo 11.'),
 mc('When did the 707 start service?',['1958','1938','1978','1998'],'Jet service.'),
 tf('1947 was the first supersonic flight.',true,'Yes.'),
 tf('Gagarin walked on the Moon.',false,'He orbited Earth.'),
 od('Put in order.',['Kitty Hawk','Sound barrier','Moon landing'],'1903, 1947, 1969.')]),
L('hs-women','Women in aviation',[
 cd('Pioneers','Harriet Quimby was the first U.S. woman to earn a pilot license in 1911. Bessie Coleman became the first Black woman pilot with a license in 1921, learning in France. Jacqueline Cochran broke records and led the WASP program.'),
 cd('Today','Women fly airliners, fighters and spacecraft. Eileen Collins was the first woman to pilot and command the Space Shuttle. Organizations like Women in Aviation International support new generations.')],
 'Pioneers opened doors for everyone.',[
 mc('Who was the first Black woman with a pilot license?',['Bessie Coleman','Harriet Quimby','Amelia Earhart','Sally Ride'],'1921.'),
 mc('Who first commanded the Space Shuttle?',['Eileen Collins','Sally Ride','Mae Jemison','Amelia Earhart'],'Commander.'),
 mc('Who led the WASP program?',['Jacqueline Cochran','Harriet Quimby','Bessie Coleman','Betty Skelton'],'Aviator and leader.'),
 tf('Women now fly airliners and spacecraft.',true,'Yes.'),
 tf('Harriet Quimby flew in 1990.',false,'1911.'),
 fl('Bessie Coleman earned her license in ___.',['France','Brazil','Japan','Peru'],'France.')]),
L('hs-airline','Airlines and everyday flight',[
 cd('From mail to millions','Airlines began carrying mail, then passengers. In 1978 the U.S. deregulated the industry, lowering fares and making flying more common. Today, airlines carry billions of passengers each year.'),
 cd('Safety record','Air travel is among the safest forms of transportation, thanks to better aircraft, training, procedures and shared lessons from accidents. Every improvement came from careful study.')],
 'Safety grows from lessons learned.',[
 mc('What did deregulation do?',['Lowered fares and expanded flying','Banned flying','Raised taxes','Ended mail'],'1978.'),
 mc('Why is air travel so safe?',['Better planes, training and lessons learned','Luck','Magic','Slow speed'],'Continuous improvement.'),
 mc('How many passengers do airlines carry yearly?',['Billions','Hundreds','Thousands','Dozens'],'Huge growth.'),
 tf('Accident lessons improve safety.',true,'Yes.'),
 tf('Flying has always been equally safe.',false,'It improved.'),
 fl('Airlines carry ___ of passengers.',['billions','dozens','pairs','pets'],'Billions.')]),
L('hs-now','Aviation today',[
 cd('A connected world','Today more than 100,000 flights take off every day around the world. Airliners are quiet, efficient and connected by satellite. GPS guides pilots, and weather data flows into the cockpit.'),
 cd('Always learning','Aviation never stands still. Every new generation of pilots, engineers and controllers adds ideas that make flying safer and more useful.')],
 'The story continues.',[
 mc('About how many flights occur daily?',['More than 100,000','About 100','About 10','About 5'],'Global flights.'),
 mc('What guides pilots today?',['GPS','Compass only','Smoke signals','Maps only'],'Satellites.'),
 mc('Who keeps improving aviation?',['Each new generation','No one','Only machines','Only birds'],'People.'),
 tf('Modern airliners are quieter than early jets.',true,'Yes.'),
 tf('Aviation has stopped changing.',false,'It keeps growing.'),
 fl('GPS uses ___.',['satellites','sandwiches','sails','sticks'],'Satellites.')])
]);
})();
