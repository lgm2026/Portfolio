/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* CLOSE-UPS (r7.4): what the Tool Cart, the Workbench and the Fuel Truck are for. Pure data for hfq_inspect.js.
   Each object: {id, t (title), sub, crew (who explains it), hello (their first line), items:[{id, t, b, at:[x,y,w,h] 0-1 of the
   picture]}, quiz:[{q, a:[right, wrong...], why}]}. The picture itself is drawn by hfq_inspect.js, item by item at `at`.
   Sources: FAA Pilot's Handbook of Aeronautical Knowledge (FAA-H-8083-25C) ch. 7 (dual ignition, fuel grades and colors,
   fuel contamination, fueling and static); FAA Aviation Maintenance Technician Handbook - General (FAA-H-8083-30A) ch. 9-10
   (torque, safety wire, hand tools, tool control) and ch. 12 (maintenance records); 14 CFR 91.409(a) (annual inspection) and
   43.9 (maintenance record entries); 14 CFR 23.1557(c) (fuel filler placards); 14 CFR 65 Subpart D (A&P certificate); AC 43.13-1B
   ch. 7 (safety wiring) and ch. 8 (propeller nicks are dressed out). Written for ages 10-14; nothing here is a maintenance procedure. */
(function(){
const H=G.HFQ;
H.addInspect([
 {id:'toolcart',t:'THE TOOL CART',sub:'TAP A TOOL TO SEE WHAT IT IS FOR',crew:'chief',
  hello:'Go ahead, open the drawer. Every tool here has a job, and every one has its own spot.',
  items:[
   {id:'torque',t:'TORQUE WRENCH',at:[.06,.18,.56,.16],b:'Tightens a bolt to an exact tightness, called torque. The maintenance manual lists the torque for each part. Too loose, and vibration can shake it free. Too tight, and the bolt can stretch or break.'},
   {id:'pliers',t:'SAFETY-WIRE PLIERS',at:[.66,.18,.28,.16],b:'They twist stainless steel safety wire through tiny holes drilled in bolt heads. The wire is put on so it pulls each bolt the tightening way, so vibration can never loosen it.'},
   {id:'mirror',t:'MIRROR AND FLASHLIGHT',at:[.06,.44,.36,.16],b:'A little mirror on a stick and a bright light let a mechanic see behind engine parts, up inside wheel wells and under the instrument panel without taking anything apart.'},
   {id:'gauge',t:'TIRE PRESSURE GAUGE',at:[.46,.44,.2,.16],b:'Airplane tires are filled to the pressure printed in the airplane’s manual. A tire that is too low flexes too much, heats up and wears out fast.'},
   {id:'sampler',t:'FUEL SAMPLER',at:[.7,.44,.24,.16],b:'A clear cup with a little probe. Push it into a drain under the wing or the engine and fuel flows in. Water is heavier than fuel, so it sinks to the bottom of the cup where you can see it.'},
   {id:'shadow',t:'THE EMPTY OUTLINE',at:[.06,.7,.88,.18],b:'Every tool has its own shaped spot in the foam. If a spot is empty when the job is done, nobody signs off until that tool is found. A wrench left inside an engine can wreck it, so mechanics count their tools every time.'}],
  quiz:[
   {q:'What does a torque wrench do?',a:['Tightens a bolt to an exact tightness','Measures tire pressure','Cuts safety wire','Drains fuel from the tanks'],why:'Torque is the exact tightness listed in the manual. Too loose can shake free; too tight can break the bolt.'},
   {q:'Why do mechanics count every tool after a job?',a:['A tool left in an airplane can cause serious damage','Tools are rented by the hour','So the cart looks neat','To decide who goes home first'],why:'A forgotten wrench can jam a control or damage an engine. An empty outline in the foam shows something is missing.'},
   {q:'Safety wire is twisted onto bolts so that…',a:['Vibration cannot loosen them','They are easier to remove','They look shiny','The bolts weigh less'],why:'The wire pulls each bolt the tightening way, so shaking can’t turn it loose.'}]},
 {id:'workbench',t:'THE WORKBENCH',sub:'TAP A PART TO INSPECT IT',crew:'chief',
  hello:'This is where parts get checked. A good mechanic looks closely and writes down everything.',
  items:[
   {id:'plug',t:'SPARK PLUGS',at:[.06,.2,.24,.24],b:'Most airplane piston engines have TWO spark plugs in every cylinder, fired by two separate magnetos. If one ignition system quits, the other keeps the engine running. Pilots test both on every run-up.'},
   {id:'filter',t:'OIL FILTER, CUT OPEN',at:[.34,.18,.26,.28],b:'At an oil change, the old filter is cut open and its folds are checked. Tiny metal flakes can be an early warning that something inside the engine is wearing out.'},
   {id:'prop',t:'PROPELLER BLADE',at:[.06,.56,.6,.14],b:'A small nick in a propeller blade gets smoothed out by a mechanic, because a crack can start at a nick. Pilots look over the propeller’s edges for nicks on every preflight.'},
   {id:'brake',t:'BRAKE DISC',at:[.66,.18,.28,.28],b:'Most light airplanes use disc brakes, a lot like a bike’s. The pilot presses the TOP of the rudder pedals with their toes, and each wheel can brake on its own to help steer on the ground.'},
   {id:'seal',t:'TORQUE STRIPE',at:[.7,.56,.24,.14],b:'After a nut is tightened, a stripe of bright paint is drawn across the nut and the part. If the nut ever turns, the stripe breaks, so anyone can spot it at a glance.'},
   {id:'logbook',t:'MAINTENANCE LOGBOOK',at:[.06,.76,.88,.14],b:'Every inspection and repair is written in the airplane’s records and signed by the mechanic. An airplane needs an annual inspection every 12 calendar months to keep flying. Mechanics hold an FAA certificate called the A&P: Airframe and Powerplant.'}],
  quiz:[
   {q:'Why do airplane piston engines have two spark plugs in each cylinder?',a:['So the engine keeps running if one ignition system fails','To make the engine twice as loud','Because one plug is for cold days','So the propeller spins faster at night'],why:'Two magnetos fire two sets of plugs. If one system quits, the other keeps the engine going.'},
   {q:'What can tiny metal flakes in an old oil filter mean?',a:['Something inside the engine may be wearing out','The oil was too clean','The filter was installed upside down','The airplane flew too high'],why:'Metal in the filter is an early warning sign, so mechanics cut filters open to look.'},
   {q:'How often does an airplane need an annual inspection?',a:['Every 12 calendar months','Every 12 years','Only when it is new','Once every 100 years'],why:'The annual inspection is due every 12 calendar months (14 CFR 91.409).'}]},
 {id:'fueltruck',t:'THE FUEL TRUCK',sub:'TAP A PART TO SEE HOW FUELING STAYS SAFE',crew:'marshal',
  hello:'Fueling is quick, but we never rush it. Here is everything that keeps it safe.',
  items:[
   {id:'blue',t:'100LL AVGAS IS BLUE',at:[.06,.14,.5,.2],b:'Avgas 100LL, the fuel for most small piston airplanes, is dyed BLUE so everyone can recognize it. LL stands for low lead. Pilots check the color in every fuel sample.'},
   {id:'ground',t:'THE GROUNDING WIRE',at:[.6,.14,.34,.2],b:'Before any fuel flows, a wire from the truck is clipped to the airplane. Moving fuel can build up static electricity, and the wire lets it drain away safely so there is never a spark.'},
   {id:'nozzle',t:'TWO KINDS OF NOZZLE',at:[.06,.42,.42,.2],b:'Jet fuel is clear to straw colored, not blue. Its nozzle is wide and flat, so it will not fit the small round filler on a piston airplane. That helps keep the wrong fuel out of the wrong airplane.'},
   {id:'placard',t:'THE FUEL CAP LABEL',at:[.52,.42,.42,.2],b:'Beside every fuel filler is a label saying which fuel the airplane takes and how much the tank holds. The fueler and the pilot both check it.'},
   {id:'ext',t:'FIRE EXTINGUISHER',at:[.06,.7,.36,.2],b:'A fire extinguisher stands ready at every fueling. No smoking, no flames, and no engines running nearby while fuel is flowing.'},
   {id:'settle',t:'WAIT, THEN SAMPLE',at:[.46,.7,.48,.2],b:'After fueling, pilots wait a few minutes before draining a fuel sample. That gives any water time to sink to the drains, where the sample can catch it.'}],
  quiz:[
   {q:'What color is 100LL avgas?',a:['Blue','Red','Green','Clear like water'],why:'100LL is dyed blue so it is easy to recognize.'},
   {q:'Why is a grounding wire clipped to the airplane before fueling?',a:['To drain static electricity so there is no spark','To hold the airplane still','To measure how much fuel goes in','To charge the airplane’s battery'],why:'Flowing fuel builds up static; the wire lets it drain safely.'},
   {q:'Why is a jet fuel nozzle wide and flat?',a:['So it won’t fit a piston airplane’s small round filler','So it pumps faster','So it is easier to carry','Because jet fuel is thicker than water'],why:'The shape helps prevent putting jet fuel into an airplane that needs avgas.'}]}
]);
})();
