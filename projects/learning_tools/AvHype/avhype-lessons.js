/* Curriculum / lessons & quiz bank
   Part of AvHype Aviation Education. This file is loaded by the page at startup
   and MUST sit in the same folder as the .html file when deployed.
   Safe to edit this section's content directly. */
(function(){
  var BRAND = "AvHype Aviation Education";
window.__AV_LESSONS__ = {

  /* ===================== AVIATION FUNDAMENTALS — AIRPLANE ================== */
  "af-a-intro": {
    title: "How an airplane flies",
    pathway: "airplane", cert: "Aviation Fundamentals — Airplane", faa: "phak", acs: "PHAK Ch.5 — Aerodynamics of flight", time: 7,
    explain: [
      "Four forces act on an airplane in flight: lift pulls it up, weight (gravity) pulls it down, thrust pushes it forward, and drag holds it back. In steady, level flight these forces are in balance — lift equals weight and thrust equals drag.",
      "Lift comes from the wing. As the wing moves through the air, it deflects air downward and creates lower pressure on top than on the bottom. That pressure difference is lift. The amount depends mostly on airspeed and the wing's angle of attack — the angle between the wing and the oncoming air."
    ],
    explainByTier: {
      junior: [
        "An airplane has four invisible forces pushing and pulling on it. Lift pushes it up, weight pulls it down toward the ground, thrust pushes it forward, and drag tries to slow it down. When they are balanced, the plane flies smoothly.",
        "The wings make the lift. When the wing slices through the air, it bends the air downward and the air pushes the wing up — a little like how the wind can lift a kite. The faster the plane goes, the more lift the wings can make."
      ],
      teen: [
        "Every airplane is a tug-of-war between four forces: lift up, weight down, thrust forward, and drag back. In smooth level flight they balance out — lift matches weight and thrust matches drag.",
        "The wing is the lift-maker. Moving through the air, it pushes air down and creates lower pressure above the wing than below it, and that difference lifts the airplane. How much lift you get depends mainly on your speed and your angle of attack — how the wing meets the air."
      ],
      adult: [
        "Four forces act on an airplane: lift, weight, thrust, and drag. In unaccelerated level flight lift equals weight and thrust equals drag, so the airplane neither climbs nor accelerates. Change any one force and the others must respond.",
        "Lift is produced by the wing through a combination of pressure differential and the downward deflection of air. Its magnitude is governed largely by airspeed and angle of attack — the angle between the chord line and the relative wind. Exceed the critical angle of attack and the wing stalls, regardless of airspeed or attitude."
      ]
    },
    why: "Every maneuver you will ever fly is just managing these four forces. Understanding them turns mysterious control inputs into cause and effect.",
    mistake: "Believing speed alone creates lift. A wing stalls when it exceeds its critical angle of attack — that can happen at high speed in a steep turn, not just when slow.",
    instructor: "If you remember nothing else from week one, remember angle of attack. It is the single idea that explains stalls, slow flight, and most loss-of-control accidents.",
    safety: "A stall is a loss of lift from too much angle of attack, not from 'running out of speed.' Respect it and you will fly a long time.",
    terms: [
      ["Lift", "Upward force produced by the wing moving through the air."],
      ["Angle of attack", "Angle between the wing and the oncoming (relative) air."],
      ["Thrust", "Forward force, produced by the propeller or engine."],
      ["Drag", "Rearward force that resists the airplane's motion."]
    ],
    hook: "Lift up, Weight down, Thrust go, Drag slow.",
    hookByTier: {
      junior: "Up, down, go, slow — lift, weight, thrust, drag!",
      teen: "Lift up, Weight down, Thrust go, Drag slow.",
      adult: "Lift opposes weight; thrust opposes drag — balance them and you fly."
    },
    scenario: "In a level turn you pull back to hold altitude and the airplane suddenly buffets and drops a wing. Which of the four forces did the angle change push past its limit?",
    oral: "Define angle of attack and explain why a wing can stall at any airspeed.",
    practical: "Watch a slow-motion video of a wing in a wind tunnel and identify where the air separates as angle of attack increases.",
    quiz: [
      { type: "mc", q: "In steady, level, unaccelerated flight, lift is equal to:", choices: ["Thrust", "Drag", "Weight", "Angle of attack"], answer: 2, why: "Level flight requires lift to balance weight, and thrust to balance drag." },
      { type: "tf", q: "A wing can only stall when the airplane is flying slowly.", answer: false, why: "A stall is caused by exceeding the critical angle of attack, which can occur at any airspeed." }
    ]
  },

  "af-a-controls": {
    title: "Flight controls and the three axes",
    pathway: "airplane", cert: "Aviation Fundamentals — Airplane", faa: "phak", acs: "PHAK Ch.6 — Flight controls", time: 6,
    explain: [
      "An airplane rotates about three axes that all pass through its center of gravity. The longitudinal axis runs nose to tail (roll), the lateral axis runs wingtip to wingtip (pitch), and the vertical axis runs straight up and down (yaw).",
      "Three primary controls move the airplane about those axes. The ailerons on the wings control roll, the elevator on the tail controls pitch, and the rudder on the tail controls yaw. The control yoke or stick works the ailerons and elevator; the rudder is worked with your feet."
    ],
    why: "Coordinated flight means using these controls together. Knowing which surface does what is the foundation of every maneuver and every recovery.",
    mistake: "Thinking the rudder 'steers' the airplane like a car. In the air the rudder mainly coordinates turns and corrects yaw; the airplane turns by banking with the ailerons.",
    instructor: "Feet and hands move together. New students fly with their feet flat on the floor and wonder why their turns feel sloppy.",
    safety: "Uncoordinated flight near a stall — too much rudder, not enough coordination — is how a stall becomes a spin. Keep the ball centered.",
    terms: [
      ["Aileron", "Wing surface that controls roll about the longitudinal axis."],
      ["Elevator", "Tail surface that controls pitch about the lateral axis."],
      ["Rudder", "Tail surface that controls yaw about the vertical axis."]
    ],
    hook: "Aileron-Roll, Elevator-Pitch, Rudder-Yaw.",
    scenario: "You bank into a left turn and the nose initially swings right before coming around. Which control input corrects that adverse yaw?",
    oral: "Name the three axes of rotation and the primary control surface for each.",
    practical: "Sit in a training airplane on the ground and have an instructor show you each surface move as you work the controls.",
    quiz: [
      { type: "mc", q: "The elevator controls movement about which axis?", choices: ["Longitudinal (roll)", "Lateral (pitch)", "Vertical (yaw)", "Directional"], answer: 1, why: "The elevator changes pitch, which is rotation about the lateral axis." },
      { type: "fill", q: "Roll is controlled by the ___.", answer: "ailerons", alts: ["aileron"], why: "Ailerons on the wings control roll about the longitudinal axis." }
    ]
  },

  "af-a-cockpit": {
    title: "The cockpit and the six basic instruments",
    pathway: "airplane", cert: "Aviation Fundamentals — Airplane", faa: "phak", acs: "PHAK Ch.8 — Flight instruments", time: 7,
    explain: [
      "The classic instrument panel has a 'six pack.' Three are pitot-static instruments driven by air pressure: the airspeed indicator, the altimeter, and the vertical speed indicator. Three are gyroscopic: the attitude indicator, the heading indicator, and the turn coordinator.",
      "Each answers a basic question. How fast (airspeed), how high (altimeter), going up or down (VSI), what attitude (attitude indicator), what heading (heading indicator), and how is the turn going (turn coordinator). Glass cockpits show the same information on screens."
    ],
    why: "You will scan these constantly. Knowing what drives each one tells you which to trust when something fails.",
    mistake: "Fixating on one instrument. A good scan moves continuously; staring at the altimeter is how heading and airspeed drift away.",
    instructor: "Trust the attitude indicator to fly the airplane and use the others to confirm. Outside the window is your first instrument in visual conditions.",
    safety: "If the pitot tube or static port becomes blocked, the airspeed indicator, altimeter, and VSI can read wrong. Recognizing that early prevents a chase of false indications.",
    terms: [
      ["Pitot-static", "System using ram and static air pressure to drive ASI, altimeter, and VSI."],
      ["Attitude indicator", "Gyroscopic instrument showing pitch and bank against an artificial horizon."],
      ["Six pack", "The traditional grouping of six primary flight instruments."]
    ],
    hook: "Three from pressure, three from spin.",
    scenario: "On a climb your altimeter reads frozen while airspeed slowly drops. A blockage of which port would explain both readings?",
    oral: "List the three pitot-static and three gyroscopic instruments and what each tells you.",
    practical: "Photograph a training airplane's panel and label all six instruments from memory, then check yourself.",
    quiz: [
      { type: "mc", q: "Which instrument is NOT driven by the pitot-static system?", choices: ["Airspeed indicator", "Altimeter", "Attitude indicator", "Vertical speed indicator"], answer: 2, why: "The attitude indicator is gyroscopic; the other three are pitot-static." },
      { type: "tf", q: "The altimeter measures the airplane's height using air pressure.", answer: true, why: "The altimeter is an aneroid instrument that converts static air pressure to an altitude reading." }
    ]
  },

  "af-a-anatomy": {
    title: "Parts of the airplane",
    pathway: "airplane", cert: "Aviation Fundamentals — Airplane", faa: "phak", acs: "PHAK Ch.3 — Aircraft structure", time: 5,
    explain: [
      "A typical training airplane has five major parts: the fuselage (the body), the wings (which make lift), the empennage (the tail, including the horizontal and vertical stabilizers), the powerplant (engine and propeller), and the landing gear.",
      "Smaller surfaces hang off the big ones: ailerons and flaps on the wings, the elevator on the horizontal stabilizer, and the rudder on the vertical stabilizer. Flaps are not primary controls — they increase lift and drag for slower, steeper approaches."
    ],
    why: "Every preflight inspection walks these parts in order. Naming them is the first step to inspecting them.",
    mistake: "Confusing the stabilizer (fixed) with the elevator or rudder (movable). The stabilizer keeps the airplane steady; the movable surface controls it.",
    instructor: "Learn the airplane's anatomy on the ground so your preflight is a confident walk-around, not a confused hunt.",
    safety: "Flaps change the airplane's handling. Extending or retracting them at the wrong speed or moment can surprise a new pilot during landing.",
    terms: [
      ["Fuselage", "The main body of the airplane."],
      ["Empennage", "The tail group: horizontal and vertical stabilizers plus elevator and rudder."],
      ["Flaps", "Wing devices that increase lift and drag for slower flight and steeper descents."]
    ],
    hook: "Body, Wings, Tail, Engine, Gear.",
    scenario: "During a walk-around you find a movable surface on the trailing edge of the vertical tail. What is it, and what does it do?",
    oral: "Name the five major components of an airplane and the purpose of flaps.",
    practical: "Do a guided walk-around of a training airplane and touch each major component as you name it.",
    quiz: [
      { type: "mc", q: "The empennage refers to the airplane's:", choices: ["Engine", "Tail section", "Wing", "Landing gear"], answer: 1, why: "The empennage is the tail assembly, including stabilizers, elevator, and rudder." },
      { type: "tf", q: "Flaps are primary flight controls.", answer: false, why: "Flaps are secondary devices that change lift and drag; the primary controls are ailerons, elevator, and rudder." }
    ]
  },

  "af-a-firstflight": {
    title: "What a first lesson looks like",
    pathway: "airplane", cert: "Aviation Fundamentals — Airplane", faa: "afh", acs: "AFH Ch.2-3 — Ground operations & basic maneuvers", time: 6,
    explain: [
      "A first flight lesson usually starts on the ground: a preflight inspection, a passenger and safety brief, starting the engine, and taxiing with the rudder pedals. Then comes the takeoff, a climb, and learning to hold straight-and-level flight.",
      "Your instructor will likely demonstrate gentle turns, climbs, and descents and then let you try. The goal is not to land the airplane on day one — it is to get the feel of the controls and to see that the airplane is stable and forgiving when flown smoothly."
    ],
    why: "Knowing the shape of a first lesson removes the nerves and lets you focus on learning instead of guessing what happens next.",
    mistake: "Over-controlling. Beginners squeeze and jerk the controls; airplanes respond to small, smooth pressures, not big movements.",
    instructor: "Relax your grip. Fly with your fingertips. The airplane wants to fly straight — your job early on is mostly to stop interfering.",
    safety: "A discovery or introductory flight with a certificated instructor is real flight training under their supervision. It is not a solo and it is not a ride; you are a student from minute one.",
    terms: [
      ["Preflight inspection", "The walk-around check of the airplane before every flight."],
      ["Taxi", "Moving the airplane on the ground, steered mainly with the rudder pedals."],
      ["Straight-and-level", "Maintaining a constant heading and altitude — the first core skill."]
    ],
    hook: "Preflight, Taxi, Takeoff, Climb, Cruise.",
    scenario: "On your first taxi the airplane keeps drifting left of the centerline. Which controls do you use to steer on the ground?",
    oral: "Describe the typical sequence of a first flight lesson from walk-around to straight-and-level.",
    practical: "Schedule an introductory flight and write down three questions to ask your instructor before you go.",
    quiz: [
      { type: "mc", q: "On the ground, a training airplane is normally steered with the:", choices: ["Control yoke", "Rudder pedals", "Throttle", "Ailerons"], answer: 1, why: "Nosewheel steering and rudder are controlled with the feet during taxi." },
      { type: "tf", q: "An introductory flight with a CFI counts as flight training under their supervision.", answer: true, why: "You are a student under instructor supervision, not a passenger on a ride." }
    ]
  },

  /* ====================== AVIATION FUNDAMENTALS — DRONE ==================== */
  "af-d-intro": {
    title: "What a drone is (sUAS)",
    pathway: "drone", cert: "Aviation Fundamentals — Drone", faa: "suas", acs: "sUAS Study Guide — Introduction", time: 6,
    explain: [
      "In FAA language a drone is an unmanned aircraft. A small unmanned aircraft system (sUAS) weighs less than 55 pounds including everything on board, and it is still an aircraft — the same airspace and many of the same responsibilities apply.",
      "Most camera drones are multirotors (several spinning rotors), though fixed-wing UAS exist for mapping and longer range. How you may fly depends on your purpose: recreational flying follows a set of rules including a free knowledge test (TRUST), while any flight for work or compensation requires an FAA Part 107 Remote Pilot Certificate."
    ],
    explainByTier: {
      junior: [
        "A drone is an aircraft with no pilot on board — you fly it from the ground. A small one weighs less than 55 pounds. Even though it is small, the FAA still calls it an aircraft, so there are rules about where it can go.",
        "Most camera drones have four spinning rotors, which is why they are called quadcopters. If you are just flying for fun, there is a short free test for recreational flyers. Grown-ups who fly drones for a job need a special FAA certificate."
      ],
      teen: [
        "To the FAA a drone is an unmanned aircraft. A small unmanned aircraft system, or sUAS, weighs under 55 pounds with everything attached, and it shares the sky with everything else — so airspace rules still apply.",
        "Most drones you see are multirotors with several rotors; fixed-wing drones exist too. The rules depend on why you fly: recreational flying has its own set including the free TRUST test, while flying for any kind of work or pay requires the FAA Part 107 Remote Pilot Certificate."
      ],
      adult: [
        "The FAA classifies a drone as an unmanned aircraft. A small UAS (sUAS) is one weighing less than 55 pounds at takeoff, including payload and everything on board. Critically, it is an aircraft operating in the National Airspace System, and the operator carries real responsibility for it.",
        "Airframes are typically multirotor or fixed-wing. The governing rules hinge on intent: recreational operations fall under the exception for limited recreational flyers and require passing TRUST, while any operation for business, work, or compensation requires certification under 14 CFR Part 107."
      ]
    },
    why: "Picking the right rule set — recreational versus Part 107 — is the first decision a drone pilot makes. Get it wrong and an otherwise routine flight becomes illegal.",
    mistake: "Assuming a small toy-sized drone is unregulated. Weight thresholds and the purpose of the flight, not the price of the drone, decide the rules.",
    instructor: "Ask one question before every flight: am I flying for fun or for any kind of benefit? The honest answer sets which rules you are under today.",
    safety: "A drone is an aircraft. Treating it as a toy is how operators drift into controlled airspace, over people, or beyond sight, where the real risks live.",
    terms: [
      ["sUAS", "Small unmanned aircraft system weighing less than 55 pounds."],
      ["Multirotor", "A drone that flies using several rotors, such as a quadcopter."],
      ["TRUST", "The Recreational UAS Safety Test required for recreational flyers."]
    ],
    hook: "Small or large, it is still an aircraft.",
    hookByTier: {
      junior: "A drone is a real aircraft, not just a toy.",
      teen: "Small or large, a drone is still an aircraft.",
      adult: "An unmanned aircraft is still an aircraft — fly it like one."
    },
    scenario: "A friend offers to pay you to photograph a house with your drone. Does that flight fall under recreational rules or Part 107?",
    oral: "Define sUAS and explain what determines whether a flight is recreational or commercial.",
    practical: "Write down your drone's takeoff weight and decide, for your next planned flight, which rule set applies.",
    quiz: [
      { type: "mc", q: "A small unmanned aircraft system (sUAS) weighs:", choices: ["Less than 55 pounds", "Less than 5 pounds", "Less than 100 pounds", "Any weight"], answer: 0, why: "An sUAS is defined as an unmanned aircraft weighing less than 55 pounds, including everything on board." },
      { type: "tf", q: "Flying a drone for paid work requires an FAA Part 107 Remote Pilot Certificate.", answer: true, why: "Any operation for work or compensation falls under Part 107 and requires certification." }
    ]
  },

  "af-d-howfly": {
    title: "How a multirotor flies",
    pathway: "drone", cert: "Aviation Fundamentals — Drone", faa: "suas", acs: "sUAS Study Guide — Aircraft performance", time: 6,
    explain: [
      "A quadcopter has four rotors. Each spins to push air down and create thrust upward. To climb, all four speed up together; to descend, they slow together. The flight controller adjusts each rotor hundreds of times a second to keep the drone steady.",
      "Direction comes from spinning rotors at slightly different speeds. Speed up the rear pair and the drone tips forward and moves ahead. Two rotors spin clockwise and two counter-clockwise so their twisting forces cancel; to turn (yaw), the controller lets one pair's twist win slightly."
    ],
    why: "Understanding that the drone moves by tilting helps you anticipate drift in wind and fly smoother, safer footage.",
    mistake: "Expecting a drone to move without tilting. A multirotor leans in the direction it travels — in strong wind it must lean just to hold position.",
    instructor: "Watch the horizon, not just the screen. Seeing the drone tilt teaches you what the sticks are really commanding.",
    safety: "If a multirotor loses a rotor or a motor, it can lose control quickly. Routine inspection of props and motors is not optional.",
    terms: [
      ["Thrust", "The upward force each rotor produces by pushing air down."],
      ["Yaw", "Rotation of the drone left or right about its vertical axis."],
      ["Flight controller", "The onboard computer that adjusts rotor speeds to keep the drone stable."]
    ],
    hook: "Tilt to travel; balance to hover.",
    scenario: "Your drone holds position but visibly leans into a steady breeze. Why must it tilt just to stay in one spot?",
    oral: "Explain how a quadcopter changes direction and how it controls yaw.",
    practical: "In a wide open, legal area, hover your drone in a light breeze and observe how it tilts to hold position.",
    quiz: [
      { type: "mc", q: "To make a quadcopter climb straight up, the flight controller:", choices: ["Speeds up all rotors together", "Speeds up only the front rotors", "Slows all rotors", "Tilts the drone forward"], answer: 0, why: "Increasing thrust on all rotors equally produces a vertical climb." },
      { type: "tf", q: "A multirotor must tilt in the direction it wants to travel.", answer: true, why: "Horizontal movement comes from tilting the thrust, so the drone leans the way it moves." }
    ]
  },

  "af-d-controller": {
    title: "The controller and flight modes",
    pathway: "drone", cert: "Aviation Fundamentals — Drone", faa: "suas", acs: "sUAS Study Guide — Operations", time: 5,
    explain: [
      "Most drones use a two-stick controller in 'Mode 2.' The left stick controls throttle (up and down) and yaw (rotate left and right). The right stick controls pitch (forward and back) and roll (left and right). Small, smooth inputs produce smooth flight.",
      "Flight modes change how much the drone helps you. GPS or position hold uses satellites to lock the drone in place when you release the sticks. Altitude hold keeps it at one height. Return-to-home (RTH) flies it back to a saved launch point, which is a safety feature, not a guarantee."
    ],
    why: "Knowing which mode you are in, and what it does when you let go of the sticks, prevents flyaways and panic inputs.",
    mistake: "Trusting return-to-home blindly. RTH can fly straight into obstacles if the home point or altitude is set poorly.",
    instructor: "Before launch, confirm your mode, your home point, and your RTH altitude. Surprises in the air usually trace back to skipping that check.",
    safety: "Switching modes in flight changes the drone's behavior instantly. Practice mode changes high and clear of people and obstacles.",
    terms: [
      ["Mode 2", "The common stick layout: throttle and yaw on the left, pitch and roll on the right."],
      ["Position hold", "GPS-based mode that keeps the drone steady when sticks are centered."],
      ["Return-to-home", "Automatic return to a saved launch point; a safety aid, not a guarantee."]
    ],
    hook: "Left stick height and spin; right stick go and lean.",
    scenario: "You release both sticks in a GPS mode and the drone stops and hovers. Which feature is holding it there?",
    oral: "Describe Mode 2 stick functions and explain the limits of return-to-home.",
    practical: "Set your RTH altitude above the tallest nearby obstacle and confirm your home point locks before takeoff.",
    quiz: [
      { type: "mc", q: "In Mode 2, the left stick controls:", choices: ["Pitch and roll", "Throttle and yaw", "Roll and yaw", "Camera tilt"], answer: 1, why: "In Mode 2 the left stick manages throttle (climb/descend) and yaw (rotation)." },
      { type: "tf", q: "Return-to-home guarantees the drone will avoid all obstacles on its way back.", answer: false, why: "RTH follows a programmed path and can strike obstacles if home point or altitude is set poorly." }
    ]
  },

  "af-d-rules": {
    title: "Where you can and cannot fly",
    pathway: "drone", cert: "Aviation Fundamentals — Drone", faa: "suas", acs: "sUAS Study Guide — Airspace & rules", time: 7,
    explain: [
      "Several core limits apply to small drones. Keep the drone within visual line of sight, generally at or below 400 feet above the ground, away from other aircraft, and not over people or moving vehicles unless you meet specific rules. Never fly in a careless or reckless way.",
      "Airspace matters. Much of the country is uncontrolled (Class G) near the surface, but controlled airspace around airports requires authorization before you fly — often available instantly through LAANC. Always check for temporary flight restrictions and stadium or security areas first."
    ],
    why: "Most drone enforcement actions come from flying somewhere not allowed. A 30-second airspace check keeps a fun flight legal.",
    mistake: "Assuming open sky means legal sky. Controlled airspace and temporary restrictions are invisible from the ground but very real.",
    instructor: "Build a habit: check airspace and restrictions on an app every single time, even at a spot you have flown before.",
    safety: "Flying near airports, over people, or beyond sight removes your margin to avoid a collision. The rules exist because those are exactly where drones have caused incidents.",
    terms: [
      ["Visual line of sight", "Keeping the drone where you can see it with your own eyes."],
      ["Controlled airspace", "Airspace, often around airports, requiring authorization before flight."],
      ["LAANC", "A system that can grant near-instant airspace authorization for drone flights."]
    ],
    hook: "See it, stay low, check the airspace.",
    scenario: "You want to fly in a park three miles from a tower-controlled airport. What must you obtain before launching there?",
    oral: "List the core operating limits for small drones and explain when airspace authorization is required.",
    practical: "Open an airspace app and identify the airspace class and any restrictions over your home location.",
    quiz: [
      { type: "mc", q: "The general maximum altitude for a small drone is:", choices: ["100 feet AGL", "400 feet AGL", "1,000 feet AGL", "No limit"], answer: 1, why: "Small drones are generally limited to 400 feet above ground level, with specific exceptions." },
      { type: "tf", q: "You may fly in controlled airspace around an airport without any authorization.", answer: false, why: "Controlled airspace requires authorization before flight, often obtained instantly via LAANC." }
    ]
  },

  "af-d-preflight": {
    title: "Drone preflight and responsibility",
    pathway: "drone", cert: "Aviation Fundamentals — Drone", faa: "suas", acs: "sUAS Study Guide — Preflight & maintenance", time: 6,
    explain: [
      "A good preflight checks the aircraft, the environment, and yourself. On the aircraft: firmware updated, propellers undamaged and secure, batteries charged and not swollen, and the camera and gimbal clear. In the environment: wind, weather, obstacles, and airspace. For yourself: are you fit, focused, and within the rules today?",
      "Many drones must be registered with the FAA, and the registration number must be marked on the aircraft. Whether you fly recreationally or under Part 107, you are the remote pilot in command — responsible for the safety of every flight."
    ],
    why: "Most drone mishaps are preventable on the ground. Two minutes of checks protect your aircraft, the public, and your record.",
    mistake: "Skipping the battery and prop check. A swollen battery or a cracked prop that 'looked fine' is a leading cause of sudden failures.",
    instructor: "Use a written or app checklist every time. Memory is the first thing that fails when you are excited to fly.",
    safety: "A swollen or damaged battery can fail or catch fire. Remove it from service and store and dispose of it safely.",
    terms: [
      ["Remote PIC", "The remote pilot in command, responsible for the safety of the flight."],
      ["Registration", "FAA marking required on many drones, displayed on the aircraft."],
      ["Gimbal", "The stabilized mount that keeps the camera steady in flight."]
    ],
    hook: "Aircraft, Environment, Pilot — check all three.",
    scenario: "During preflight you notice one battery is slightly puffed compared to the others. What should you do with it before flying?",
    oral: "Walk through a drone preflight covering the aircraft, the environment, and the pilot.",
    practical: "Build a personal preflight checklist for your drone and run it before your next three flights.",
    quiz: [
      { type: "mc", q: "A swollen drone battery should be:", choices: ["Used carefully", "Charged fully first", "Removed from service and handled safely", "Flown until it fails"], answer: 2, why: "A swollen battery is a safety hazard and must be taken out of service and disposed of properly." },
      { type: "tf", q: "The remote pilot in command is responsible for the safety of each drone flight.", answer: true, why: "Whether recreational or Part 107, the remote PIC carries responsibility for the operation." }
    ]
  },

  /* ==================== AVIATION FUNDAMENTALS — HELICOPTER ================= */
  "af-h-intro": {
    title: "How a helicopter flies",
    pathway: "helicopter", cert: "Aviation Fundamentals — Helicopter", faa: "hfh", acs: "HFH Ch.2-3 — Aerodynamics", time: 7,
    explain: [
      "A helicopter's main rotor is a set of spinning wings. Like an airplane wing, each rotor blade makes lift as it moves through the air — but instead of moving the whole aircraft forward to make lift, the helicopter spins the blades. That is why it can lift straight up and hover.",
      "The pilot changes lift by changing the pitch (angle) of the blades. Increase the blade angle and the rotor makes more lift and the helicopter rises; tilt the spinning rotor disc and the lift tilts with it, pulling the helicopter in that direction. The engine's job is to keep the rotor turning at a steady speed."
    ],
    explainByTier: {
      junior: [
        "A helicopter's top spinning blades are really wings that go around in a circle. Each blade makes lift just like an airplane wing, but the helicopter spins them instead of flying forward. That is the secret to how it can go straight up and hover in one place.",
        "To go up, the pilot tips the blades so they grab more air and make more lift. To move, the whole spinning circle of blades tilts a little, and the helicopter slides that way. The engine just keeps the blades spinning at the right speed."
      ],
      teen: [
        "The main rotor is a stack of rotating wings. Each blade generates lift the same way an airplane wing does, except the helicopter spins the blades rather than flying the whole machine forward. That is what lets it climb vertically and hover.",
        "The pilot controls lift by changing blade pitch — the angle of the blades. More angle means more lift and the helicopter rises. Tilt the spinning rotor disc and the lift tilts too, moving the helicopter in that direction. The engine keeps rotor speed constant while the pilot manages pitch."
      ],
      adult: [
        "The main rotor system is a set of rotating airfoils. Each blade produces lift exactly as a fixed wing does, but the helicopter achieves the necessary airflow by rotating the blades rather than translating the airframe. This decoupling of lift from forward motion is what permits vertical flight and the hover.",
        "Lift is modulated by blade pitch. Raising collective pitch increases the angle of attack on all blades simultaneously, increasing total rotor thrust; tilting the tip-path plane vectors that thrust horizontally, producing directional flight. The powerplant's role is to maintain rotor RPM within limits while the pilot commands pitch."
      ]
    },
    why: "Everything unique about helicopters — the hover, the controls, the hazards — flows from this one idea: lift comes from spinning, pitch-adjustable wings.",
    mistake: "Picturing the rotor as a simple fan that just blows air down. It is a set of wings, and the pilot is constantly adjusting their angle, not just their speed.",
    instructor: "Think 'rotating wing,' not 'propeller on top.' Once that clicks, the controls and the dangers all start to make sense.",
    safety: "Rotor speed must stay within limits. Let it decay too far and the blades can stop making enough lift to fly — one of the most serious situations in a helicopter.",
    terms: [
      ["Main rotor", "The set of rotating blades (wings) that produce lift."],
      ["Blade pitch", "The angle of the rotor blades, which the pilot changes to control lift."],
      ["Rotor disc", "The circular area swept by the spinning rotor blades."]
    ],
    hook: "It does not fly forward to make lift — it spins to make lift.",
    hookByTier: {
      junior: "The blades are spinning wings — that is how it hovers!",
      teen: "A helicopter spins its wings instead of flying them forward.",
      adult: "Rotating wing, vectored thrust — the hover is just lift with no forward motion."
    },
    scenario: "An airplane needs forward speed down a runway to make enough lift to fly. Why can a helicopter rise straight up from a standstill?",
    oral: "Explain how a helicopter produces lift and how the pilot changes the amount of lift.",
    practical: "Watch a helicopter hover and lift off, and identify the moment the pilot increases blade pitch to climb.",
    quiz: [
      { type: "mc", q: "A helicopter's main rotor blades are best described as:", choices: ["Fan blades that only push air", "Rotating wings (airfoils)", "Propellers for forward thrust", "Fixed surfaces"], answer: 1, why: "Each rotor blade is an airfoil — a wing — that produces lift as it rotates." },
      { type: "tf", q: "A helicopter must move forward to generate enough lift to fly.", answer: false, why: "By spinning its blades, a helicopter generates lift without forward motion, allowing vertical flight and hovering." }
    ]
  },

  "af-h-controls": {
    title: "The four helicopter controls",
    pathway: "helicopter", cert: "Aviation Fundamentals — Helicopter", faa: "hfh", acs: "HFH Ch.3 — Helicopter controls", time: 7,
    explain: [
      "A helicopter has four flight controls. The collective, in the pilot's left hand, raises or lowers the pitch of all blades together to control climb and descent. The throttle, usually a twist grip on the collective, sets engine power to hold rotor speed — on many helicopters it is governed automatically.",
      "The cyclic, in the pilot's right hand, tilts the rotor disc to move the helicopter forward, back, left, or right. The anti-torque pedals, worked with the feet, change the tail rotor's thrust to control the nose direction (yaw), especially in a hover. All four are worked at once."
    ],
    why: "Helicopter controls are deeply interconnected — moving one disturbs the others. Knowing each control's job is the start of coordinating them.",
    mistake: "Thinking the controls are independent like a car's pedals and wheel. Raise the collective and you also change torque and need pedal — everything is linked.",
    instructor: "Hovering is hard because all four controls interact at once. We start you on one control at a time for a reason.",
    safety: "Because the controls are interconnected, abrupt or large inputs can quickly get ahead of a new pilot. Smoothness is a safety skill, not just style.",
    terms: [
      ["Collective", "Left-hand control that changes all blades' pitch together for up and down."],
      ["Cyclic", "Right-hand control that tilts the rotor disc for directional movement."],
      ["Anti-torque pedals", "Foot controls that vary tail rotor thrust to control yaw."]
    ],
    hook: "Collective up-down, Cyclic where-to, Pedals point-the-nose.",
    scenario: "While hovering you raise the collective to climb and the nose begins to swing. Which control do you use to keep the nose straight?",
    oral: "Name the four helicopter controls and state what each one does.",
    practical: "Sit in a helicopter with an instructor and identify the collective, throttle, cyclic, and pedals by hand and foot.",
    quiz: [
      { type: "mc", q: "Which control changes the pitch of all rotor blades together for climb and descent?", choices: ["Cyclic", "Collective", "Anti-torque pedals", "Throttle"], answer: 1, why: "The collective raises or lowers the pitch of all blades simultaneously, controlling vertical flight." },
      { type: "fill", q: "The ___ tilts the rotor disc to move the helicopter directionally.", answer: "cyclic", alts: ["cyclic control"], why: "The cyclic tilts the tip-path plane to produce forward, aft, and sideward flight." }
    ]
  },

  "af-h-torque": {
    title: "Torque and the tail rotor",
    pathway: "helicopter", cert: "Aviation Fundamentals — Helicopter", faa: "hfh", acs: "HFH Ch.3 — Anti-torque systems", time: 6,
    explain: [
      "When the engine spins the main rotor one way, Newton's third law spins the fuselage the other way. Left unchecked, the helicopter body would rotate opposite to the rotor. This twisting effect is called torque.",
      "A conventional helicopter uses a tail rotor to fix this. The tail rotor pushes air sideways to counteract the main rotor's torque and keep the nose straight. The anti-torque pedals let the pilot vary that thrust to point the nose, which is how a helicopter turns in a hover."
    ],
    why: "Torque explains why a helicopter needs a tail rotor and why your feet are always working. It is central to safe hovering and takeoffs.",
    mistake: "Forgetting that changing power changes torque. Raise the collective and torque increases, so the pedals must move to hold heading.",
    instructor: "Your feet keep the nose straight. Any time you change power, expect to change pedal at the same moment.",
    safety: "In certain wind and power conditions the tail rotor can struggle to counter torque, letting the nose swing unexpectedly. Awareness and prompt pedal input matter.",
    terms: [
      ["Torque", "The tendency of the fuselage to rotate opposite the main rotor."],
      ["Tail rotor", "The small rotor that counteracts torque and controls yaw."],
      ["Newton's third law", "For every action there is an equal and opposite reaction."]
    ],
    hook: "Rotor spins one way; the body wants the other.",
    scenario: "You add collective to climb out of a hover and the nose yaws. Why does increasing main rotor power require more anti-torque pedal?",
    oral: "Explain the cause of torque and how a tail rotor counteracts it.",
    practical: "Watch a helicopter takeoff and notice the pedal-driven heading corrections as power is applied.",
    quiz: [
      { type: "mc", q: "The main purpose of a conventional tail rotor is to:", choices: ["Provide forward thrust", "Counteract main rotor torque and control yaw", "Generate lift", "Slow the main rotor"], answer: 1, why: "The tail rotor offsets the torque reaction of the main rotor and gives the pilot yaw control." },
      { type: "tf", q: "Increasing main rotor power increases torque, requiring a pedal correction.", answer: true, why: "More power produces more torque, so the pilot must adjust the anti-torque pedals to hold heading." }
    ]
  },

  "af-h-hover": {
    title: "Hovering and ground effect",
    pathway: "helicopter", cert: "Aviation Fundamentals — Helicopter", faa: "hfh", acs: "HFH Ch.9 — Hovering flight", time: 6,
    explain: [
      "Hovering means holding the helicopter steady over one spot. It is widely considered the hardest basic skill because all four controls interact and the helicopter has no natural tendency to stay put — the pilot makes constant tiny corrections.",
      "Close to the ground, within about one rotor diameter, the rotor becomes more efficient because the ground interrupts the downwash. This is called ground effect, and it reduces the power needed to hover. A helicopter also tends to drift slightly because of tail rotor thrust, which the pilot trims out with the cyclic."
    ],
    why: "The hover is where takeoffs, landings, and precise work begin. It also reveals exactly how interconnected the controls are.",
    mistake: "Chasing the aircraft with big inputs. Hovering is a game of small, anticipatory corrections, not large reactions.",
    instructor: "Look well ahead, not down at the skids. New pilots who stare straight down chase the helicopter all over the ramp.",
    safety: "Hovering low and slow leaves little room to recover from errors. Power and pedal awareness near the ground is essential.",
    terms: [
      ["Hover", "Maintaining a steady position over a fixed point on the ground."],
      ["Ground effect", "Improved rotor efficiency near the surface that lowers hover power."],
      ["Translating tendency", "The helicopter's slight drift caused by tail rotor thrust."]
    ],
    hook: "Small corrections, eyes ahead, hold the spot.",
    scenario: "Hovering a few feet up takes noticeably less power than climbing higher. Which aerodynamic effect explains the easier low hover?",
    oral: "Explain why hovering is difficult and describe ground effect.",
    practical: "Observe a helicopter hover taxi and watch how the pilot makes continuous small control corrections.",
    quiz: [
      { type: "mc", q: "Ground effect makes a hover require:", choices: ["More power", "Less power", "No power", "The same power as a high hover"], answer: 1, why: "Within about one rotor diameter of the surface, the rotor is more efficient, reducing the power needed to hover." },
      { type: "tf", q: "A helicopter naturally stays in one place when hovering, requiring no input.", answer: false, why: "A helicopter has no natural tendency to hold position; the pilot makes constant small corrections." }
    ]
  },

  "af-h-anatomy-haz": {
    title: "Helicopter anatomy and unique hazards",
    pathway: "helicopter", cert: "Aviation Fundamentals — Helicopter", faa: "hfh", acs: "HFH Ch.4-11 — Systems & safety of flight", time: 7,
    explain: [
      "Key helicopter parts include the main rotor and its hub, the swashplate (which translates the pilot's control inputs to the spinning blades), the engine and transmission, the tail boom and tail rotor, and the landing gear or skids. The transmission carries engine power to both rotors.",
      "Helicopters have their own hazards to respect early. Settling with power (vortex ring state) can occur in a steep, slow, powered descent into the rotor's own downwash. Loss of tail rotor effectiveness can let the nose swing in certain wind conditions. And the spinning main and tail rotors are deadly on the ground — approach only when and where a pilot directs."
    ],
    why: "Knowing the parts makes your preflight meaningful, and knowing the signature hazards early builds the instincts that keep helicopter pilots alive.",
    mistake: "Treating helicopter hazards as advanced topics for later. Awareness of rotor danger and descent hazards belongs on day one.",
    instructor: "Never walk toward a helicopter without the pilot's signal, and never approach from the rear where the tail rotor lives. This is non-negotiable.",
    safety: "The tail rotor is nearly invisible when spinning and has caused fatal accidents on the ground. Approach and depart only in the pilot's view, from the front, and crouched.",
    terms: [
      ["Swashplate", "The component that transmits control inputs to the rotating blades."],
      ["Settling with power", "A dangerous powered descent into the rotor's own downwash (vortex ring state)."],
      ["Transmission", "The gearbox that delivers engine power to the main and tail rotors."]
    ],
    hook: "Front and low, only when the pilot says go.",
    scenario: "You need to approach a running helicopter on a ramp. From which direction and posture should you approach, and what must you wait for first?",
    oral: "Identify the major helicopter components and name two hazards unique to helicopters.",
    practical: "Learn and practice the correct, pilot-directed way to approach and depart a running helicopter before ever doing it for real.",
    quiz: [
      { type: "mc", q: "When approaching a running helicopter, you should:", choices: ["Approach from the rear", "Approach only when the pilot signals, from the front and crouched", "Walk upright toward the tail", "Approach from any direction quickly"], answer: 1, why: "Always wait for the pilot's signal and approach from the front, crouched, never near the tail rotor." },
      { type: "tf", q: "Settling with power can occur during a steep, slow, powered descent.", answer: true, why: "Vortex ring state develops when a helicopter descends into its own downwash at low airspeed with power applied." }
    ]
  },

  /* ----------------------------- AVIATION 000 (foundation) ---------------- */
  "f-intro": {
    title: "What aviation is — and how to use this website",
    pathway: "foundation", cert: "All pathways", faa: "phak", acs: "Foundational orientation", time: 5,
    explain: [
      "Aviation is the system of people, machines, rules, and weather that lets aircraft move safely through shared airspace. You are not just learning to push controls — you are learning to make decisions with incomplete information while the ground keeps its distance.",
      BRAND + " is a study, preparation, and progress-tracking tool. It does not issue certificates and it does not replace a real instructor. Think of it as the ground-school and discipline layer that makes your time in a real aircraft cheaper, safer, and shorter."
    ],
    why: "Every dollar and hour you save in the airplane or simulator usually traces back to knowledge you nailed down on the ground first.",
    mistake: "Treating ground knowledge as the boring part. The checkride examiner spends as much time on the ground (oral) as in the air.",
    instructor: "Show up to lesson one already knowing the words. An instructor who isn't re-teaching vocabulary can teach you flying.",
    safety: "No website, video, or chatbot can certify you to fly. Certification happens only through authorized FAA processes and people.",
    terms: [
      ["Airspace", "The regulated volume of sky, divided into classes with different rules."],
      ["PIC", "Pilot in Command — the person ultimately responsible for the flight."],
      ["Ground school", "The knowledge portion of training, separate from flight time."]
    ],
    hook: "Aviate, Navigate, Communicate — in that order, always.",
    scenario: "A friend says 'just buy a drone and fly it for your business.' What's the first question you should ask before taking money?",
    oral: "In your own words, what is the difference between training and certification?",
    practical: "Set a daily 5-minute study slot. Consistency beats cramming for aviation knowledge retention.",
    quiz: [
      { type: "mc", q: "Which best describes this website's role?", choices: ["It certifies pilots", "It replaces a flight instructor", "It is a study and tracking tool", "It is an FAA testing center"], answer: 2, why: "It supports learning and preparation; certification is an FAA process." },
      { type: "tf", q: "Completing every lesson here legally lets you fly passengers.", answer: false, why: "Only FAA certificates, sign-offs, tests, and checkrides authorize you to fly." }
    ]
  },

  "f-cert": {
    title: "Certificates vs ratings vs endorsements",
    pathway: "foundation", cert: "All pathways", faa: "phak", acs: "61 — Certification structure", time: 6,
    explain: [
      "A certificate is the core credential that says what kind of pilot you are: Student, Sport, Recreational, Private, Commercial, ATP, Remote, or Instructor. You earn one and build on it.",
      "A rating is added to a certificate to expand what you may fly or how. Examples: an Instrument rating, a Multi-Engine class rating, a Helicopter category rating.",
      "An endorsement is a logbook entry from an authorized instructor that authorizes a specific privilege or activity — solo, tailwheel, high-performance, complex, a flight review. It lives in your logbook, not on a plastic card."
    ],
    why: "Knowing which credential you actually need keeps you from training for the wrong thing or flying outside your privileges.",
    mistake: "Believing a 'license' is one thing. Privileges are a stack: certificate + category/class + ratings + endorsements + currency + medical.",
    instructor: "When a student says 'I want my license,' I ask: to do what, in what, by when? The answer sets the whole syllabus.",
    safety: "Flying outside your certificate, ratings, or endorsements is illegal and statistically dangerous — the regs exist because of accidents.",
    terms: [
      ["Certificate", "Core pilot credential (e.g., Private Pilot)."],
      ["Category", "Broad aircraft grouping: airplane, rotorcraft, glider, etc."],
      ["Class", "Subdivision: single-engine land, multi-engine sea, helicopter, etc."],
      ["Rating", "Add-on that expands privileges (e.g., Instrument)."],
      ["Endorsement", "Instructor logbook sign-off authorizing a privilege."]
    ],
    hook: "Certificate = the noun, Rating = the adjective, Endorsement = the permission slip.",
    scenario: "You hold a Private Pilot certificate (airplane single-engine land) and want to fly a 250-horsepower aircraft. Which do you need — a new certificate, a rating, or an endorsement?",
    oral: "Differentiate category, class, and type, with an example of each.",
    practical: "Open your goal list and label each one C (certificate), R (rating), or E (endorsement).",
    quiz: [
      { type: "mc", q: "An Instrument privilege added to your Private Pilot certificate is a:", choices: ["Certificate", "Rating", "Endorsement", "Type"], answer: 1, why: "Instrument is a rating added to an existing certificate." },
      { type: "mc", q: "Authorization to fly a high-performance airplane is a:", choices: ["Rating", "Certificate", "Endorsement", "Class"], answer: 2, why: "High-performance is a one-time instructor endorsement in your logbook." },
      { type: "fill", q: "The core pilot credential (Student, Private, Commercial...) is called a ______.", answer: "certificate", alts: ["certificates"], why: "Certificates are the foundation; ratings and endorsements build on them." }
    ]
  },

  "f-orgs": {
    title: "Who's who: FAA, TSA, NTSB, ICAO",
    pathway: "foundation", cert: "All pathways", faa: "phak", acs: "Regulatory environment", time: 5,
    explain: [
      "The FAA (Federal Aviation Administration) regulates U.S. civil aviation: rules, certificates, airspace, air traffic control, and airworthiness. It is the agency you train and test under.",
      "The TSA (Transportation Security Administration) handles security. For flight training, the TSA runs the Alien Flight Student Program — non-U.S. citizens need security vetting before certain training.",
      "The NTSB (National Transportation Safety Board) is an independent agency that investigates accidents and issues safety recommendations. It does not write the regulations; it studies what went wrong so they can be improved.",
      "ICAO (International Civil Aviation Organization) is a United Nations body that sets international standards so aviation works across borders."
    ],
    why: "These boundaries explain why you verify citizenship with one agency, train under another, and read accident reports from a third.",
    mistake: "Assuming the NTSB enforces rules. It investigates and recommends; the FAA regulates and enforces.",
    instructor: "If a foreign-national student books training, the AFSP/TSA step comes before flight training, not after.",
    safety: "NTSB reports are some of the most valuable free safety education you will ever read — accidents teach what checklists cannot.",
    terms: [
      ["FAA", "Regulates U.S. civil aviation."],
      ["TSA", "Security; runs Alien Flight Student Program."],
      ["NTSB", "Independent accident investigator."],
      ["ICAO", "UN body setting international standards."]
    ],
    hook: "FAA flies you, TSA screens you, NTSB studies you, ICAO connects you.",
    scenario: "You read an NTSB report that recommends a design change. Who would actually have to make that a rule?",
    oral: "Which organization investigates a civil aircraft accident, and is it the same one that certificates you?",
    practical: "Bookmark the NTSB database and read one accident summary this week.",
    quiz: [
      { type: "mc", q: "Which agency investigates aviation accidents independently?", choices: ["FAA", "TSA", "NTSB", "ICAO"], answer: 2, why: "The NTSB is the independent accident investigator." },
      { type: "tf", q: "Non-U.S. citizens may need TSA security vetting before flight training.", answer: true, why: "The Alien Flight Student Program is a TSA security requirement." }
    ]
  },

  "f-catclass": {
    title: "Aircraft categories and classes",
    pathway: "foundation", cert: "All pathways", faa: "phak", acs: "61 — Aircraft category & class", time: 6,
    explain: [
      "'Category' and 'class' have a precise meaning in certification. Category is the broad grouping: airplane, rotorcraft, glider, lighter-than-air, powered-lift, powered parachute, weight-shift-control.",
      "Class narrows it down. Within airplane: single-engine land, single-engine sea, multi-engine land, multi-engine sea. Within rotorcraft: helicopter and gyroplane.",
      "Unmanned aircraft (drones) under Part 107 are a separate operating world with their own certificate (Remote Pilot) rather than a category/class on a pilot certificate."
    ],
    why: "Your privileges are tied to category and class. Earning 'airplane single-engine land' does not let you fly a seaplane or a helicopter.",
    mistake: "Confusing 'category/class' (certification terms) with 'category' used in airworthiness (normal, utility, acrobatic) — same word, different context.",
    instructor: "Adding a class (say, multi-engine) is usually faster than people expect; adding a category (say, rotorcraft) is closer to starting over.",
    safety: "Each class flies differently. A single-engine pilot stepping into a twin without training is a classic accident setup.",
    terms: [
      ["Category (cert)", "Airplane, rotorcraft, glider, etc."],
      ["Class (cert)", "Single-engine land, multi-engine sea, helicopter, etc."],
      ["Type", "Specific make/model needing a type rating (large/turbojet)."]
    ],
    hook: "Category is the family, class is the sibling, type is the individual.",
    scenario: "You hold airplane single-engine land. A friend offers their helicopter. What stops you from legally flying it solo?",
    oral: "Name the airplane classes and the rotorcraft classes.",
    practical: "Write your target category and class at the top of your training plan so every lesson ties back to it.",
    quiz: [
      { type: "mc", q: "'Helicopter' is a ______ within the rotorcraft category.", choices: ["category", "class", "type", "rating endorsement"], answer: 1, why: "Helicopter and gyroplane are classes of rotorcraft." },
      { type: "mc", q: "Which is a category, not a class?", choices: ["Single-engine land", "Multi-engine sea", "Rotorcraft", "Helicopter"], answer: 2, why: "Rotorcraft is the category; helicopter is a class within it." }
    ]
  },

  "f-airspace": {
    title: "How airspace works (the big picture)",
    pathway: "foundation", cert: "All pathways", faa: "aim", acs: "Airspace fundamentals", time: 8,
    explain: [
      "U.S. airspace is layered into classes A, B, C, D, E, and G. Classes A through E are 'controlled' (ATC services exist there); Class G is 'uncontrolled.' The letters roughly track how busy and protected the airspace is.",
      "Class A: 18,000 ft MSL up to FL600, instrument flight only. Class B: the busiest airports (think major hubs), shaped like an upside-down wedding cake, entry requires an ATC clearance. Class C and D surround airports with control towers and require two-way radio communication to enter.",
      "Class E is controlled airspace that fills most of the gaps, often starting at 700 or 1,200 ft above ground. Class G is the uncontrolled airspace near the surface in less busy areas.",
      "Drone pilots care about this too: Part 107 operations in controlled airspace near airports require authorization (often instant, through LAANC)."
    ],
    why: "Airspace determines who you must talk to, what weather you need, and where you may legally be — for both crewed aircraft and drones.",
    mistake: "Reading the floors and ceilings as feet above ground everywhere. Some are MSL (above sea level), some AGL (above ground) — always check the chart.",
    instructor: "Learn the shape before the numbers. Picture the upside-down cake for Class B and the rest gets easier.",
    safety: "Busting airspace — entering without clearance or comms — is a top enforcement issue and a real collision risk near busy airports.",
    terms: [
      ["MSL", "Mean Sea Level — altitude above the sea."],
      ["AGL", "Above Ground Level — height above the terrain below."],
      ["Controlled airspace", "Classes A–E, where ATC services are provided."],
      ["LAANC", "Low Altitude Authorization and Notification Capability — near-instant drone airspace authorization."]
    ],
    hook: "A is for Airliners up high, B is the Big city, C has a Control tower with radar, D has a tower, E is Everywhere else controlled, G is the Ground-level free zone.",
    scenario: "You want to fly a drone for a real-estate shoot two miles from a towered airport. What must you obtain first?",
    oral: "What are the two ways drone pilots can get authorization to operate in controlled airspace?",
    practical: "Pull up a sectional chart online and find one Class D airport and the blue dashed circle around it.",
    quiz: [
      { type: "mc", q: "Which airspace class is uncontrolled?", choices: ["Class B", "Class D", "Class E", "Class G"], answer: 3, why: "Class G is uncontrolled airspace." },
      { type: "mc", q: "Entering Class B airspace requires:", choices: ["Only a radio call", "An ATC clearance", "Nothing for VFR", "A flight plan only"], answer: 1, why: "Class B requires an explicit ATC clearance to enter." },
      { type: "tf", q: "Class A airspace begins at 18,000 ft MSL and is for instrument flight only.", answer: true, why: "Class A is 18,000 MSL to FL600, IFR only." }
    ]
  },

  "f-adm": {
    title: "Decisions that keep you alive: ADM, PAVE, IMSAFE, 5P, DECIDE",
    pathway: "foundation", cert: "All pathways", faa: "rmh", acs: "Risk management — ADM", time: 9,
    explain: [
      "Most aviation accidents are not caused by the machine breaking — they are caused by decisions. Aeronautical Decision Making (ADM) is the structured habit of catching bad chains before they finish.",
      "PAVE checks the four sources of risk before you go: Pilot, Aircraft, enVironment, External pressures. IMSAFE checks you personally: Illness, Medication, Stress, Alcohol, Fatigue, Emotion/Eating.",
      "The 5P check (Plan, Plane, Pilot, Passengers, Programming) is a recurring in-flight gut-check. DECIDE is the loop you run when something goes wrong: Detect, Estimate, Choose, Identify, Do, Evaluate.",
      "These are not trivia. The examiner expects you to apply them out loud, and good pilots run them automatically for the rest of their careers."
    ],
    why: "Risk-management models turn vague worry into a checklist you can actually act on under pressure.",
    mistake: "Memorizing the acronyms but never using them. The value is in actually stopping to run the check.",
    instructor: "I want to hear you say 'let me run PAVE' on a real preflight, not just spell it on a quiz.",
    safety: "'Get-there-itis' — pressing on because you want to arrive — is the External pressure in PAVE and a leading killer. Naming it helps you resist it.",
    terms: [
      ["ADM", "Aeronautical Decision Making — structured judgment."],
      ["PAVE", "Pilot, Aircraft, enVironment, External pressures."],
      ["IMSAFE", "Illness, Medication, Stress, Alcohol, Fatigue, Emotion."],
      ["5P", "Plan, Plane, Pilot, Passengers, Programming."],
      ["DECIDE", "Detect, Estimate, Choose, Identify, Do, Evaluate."]
    ],
    hook: "PAVE the road before you drive it, run IMSAFE on yourself, check the 5P in the air, and DECIDE when it breaks.",
    scenario: "You're tired, the weather is marginal, and your passengers really want to get home tonight. Which PAVE elements are flashing red?",
    oral: "Walk me through IMSAFE as if you were deciding whether to fly this morning.",
    practical: "Run IMSAFE on yourself right now, honestly. Would today's you be safe to fly?",
    quiz: [
      { type: "mc", q: "The 'E' in PAVE stands for:", choices: ["Emotion", "enVironment", "Equipment", "Endurance"], answer: 1, why: "PAVE = Pilot, Aircraft, enVironment, External pressures." },
      { type: "mc", q: "Which model is a personal readiness checklist?", choices: ["DECIDE", "IMSAFE", "5P", "PAVE"], answer: 1, why: "IMSAFE checks the pilot's personal fitness to fly." },
      { type: "fill", q: "Pressing on to reach a destination despite worsening conditions is called get-there-______.", answer: "itis", alts: ["itus"], why: "'Get-there-itis' is a classic external-pressure hazard." }
    ]
  },

  "f-weather": {
    title: "Reading the sky: intro to weather and METARs",
    pathway: "foundation", cert: "All pathways", faa: "phak", acs: "Weather information", time: 8,
    explain: [
      "Weather is the environment you fly inside, and it does not care about your schedule. Pilots learn to read standardized weather products rather than guessing from the window.",
      "A METAR is a coded current weather observation for an airport. A TAF is a forecast. They use a compact format: wind, visibility, clouds, temperature/dewpoint, and altimeter setting.",
      "You don't need to fly to use weather skill — a drone pilot checks wind, visibility, and ceilings before every mission, and the smart ones treat a gusty day the way an airplane pilot treats a thunderstorm."
    ],
    why: "Reading weather products is the difference between a personal go/no-go decision and a gamble.",
    mistake: "Looking only at the destination. Weather along the whole route — and the alternates — is what bites pilots.",
    instructor: "I teach students to decode one real METAR a day until the format disappears and they just 'read' it.",
    safety: "VFR-into-IMC (flying visually into clouds) is one of the deadliest scenarios in aviation. Weather discipline prevents it.",
    terms: [
      ["METAR", "Coded current weather observation."],
      ["TAF", "Terminal Aerodrome Forecast."],
      ["Ceiling", "Height of the lowest broken or overcast cloud layer."],
      ["Visibility", "How far you can see horizontally, in statute miles."],
      ["Dewpoint", "Temperature at which air becomes saturated; close to temp means fog/clouds likely."]
    ],
    hook: "Wind, Viz, Sky, Temp/Dew, Altimeter — every METAR, same order.",
    scenario: "A METAR shows temperature and dewpoint only 1 degree apart at dawn. What weather hazard should you expect?",
    oral: "What is the difference between a METAR and a TAF?",
    practical: "Find your nearest airport's METAR on the Aviation Weather Center and identify the wind and visibility.",
    quiz: [
      { type: "mc", q: "A METAR provides:", choices: ["A forecast", "A current observation", "A NOTAM", "A clearance"], answer: 1, why: "METAR is an observation; TAF is the forecast." },
      { type: "tf", q: "A small temperature/dewpoint spread suggests fog or low clouds are likely.", answer: true, why: "When temp and dewpoint converge, the air is near saturation." }
    ]
  },

  /* ----------------------------- DRONE — Part 107 ------------------------- */
  "d-overview": {
    title: "Part 107 overview — who needs it",
    pathway: "drone", cert: "Remote Pilot", faa: "suas", acs: "sUAS ACS — Regulations", time: 6,
    explain: [
      "14 CFR Part 107 is the rule set for flying small unmanned aircraft (under 55 lb) for any non-recreational purpose. If you are paid, promoting a business, or doing work — even unpaid work for someone — you generally operate under Part 107 and need a Remote Pilot Certificate.",
      "Purely recreational flying follows a different, lighter path (the exception for recreational flyers) and requires passing TRUST, a free safety test — but the moment money or business purpose enters, Part 107 applies.",
      "Part 107 covers eligibility, registration, where and when you may fly, operations near people, night operations, airspace authorization, and Remote ID."
    ],
    why: "Mislabeling a commercial flight as 'recreational' is a common, enforceable mistake that can void insurance and draw penalties.",
    mistake: "Believing 'I wasn't paid' makes it recreational. Purpose, not payment, often decides — promoting your business is not recreational.",
    instructor: "If you would put the footage on a company page or a client's listing, plan it as a Part 107 operation.",
    safety: "Part 107 exists because drones share airspace with crewed aircraft and fly over people — the rules are collision and injury prevention.",
    terms: [
      ["Part 107", "FAA rules for small commercial UAS operations."],
      ["sUAS", "Small Unmanned Aircraft System (under 55 lb)."],
      ["TRUST", "The Recreational UAS Safety Test (free, for hobby flyers)."],
      ["Remote Pilot Certificate", "Credential required to fly under Part 107."]
    ],
    hook: "Recreational = fun only; Part 107 = anything that helps anyone's business.",
    scenario: "You photograph a neighbor's house for free, and they use it to sell the home. Recreational or Part 107?",
    oral: "What distinguishes a recreational drone flight from one requiring Part 107?",
    practical: "List three flights you might do and label each recreational or Part 107.",
    quiz: [
      { type: "mc", q: "Part 107 generally applies to drones under:", choices: ["25 lb", "55 lb", "100 lb", "5 lb"], answer: 1, why: "Part 107 covers small UAS under 55 lb." },
      { type: "tf", q: "Flying for free still requires Part 107 if it serves a business purpose.", answer: true, why: "Purpose, not payment, often determines the applicable rules." }
    ]
  },

  "d-eligibility": {
    title: "Remote pilot eligibility and the knowledge test",
    pathway: "drone", cert: "Remote Pilot", faa: "suas", acs: "sUAS ACS — Eligibility", time: 6,
    explain: [
      "To earn a Remote Pilot Certificate you must be at least 16 years old, be able to read, speak, write, and understand English, and be in a physical/mental condition to operate safely.",
      "You pass the Unmanned Aircraft General (UAG) knowledge test at an FAA-approved testing center. After passing, you apply through IACRA and undergo TSA security vetting before the certificate is issued.",
      "Certificate holders must complete recurrent online training every 24 calendar months to stay current — it is free and self-paced."
    ],
    why: "Knowing the exact eligibility and renewal cadence keeps your certificate valid and your operations legal.",
    mistake: "Forgetting recurrent training. Letting currency lapse means you may not exercise Part 107 privileges until you complete it.",
    instructor: "Schedule the recurrent training reminder the day you pass — 24 months sneaks up fast.",
    safety: "The English-language requirement is a safety rule: radio and airspace coordination depend on clear communication.",
    terms: [
      ["UAG", "Unmanned Aircraft General — the Part 107 knowledge test."],
      ["IACRA", "FAA's electronic application system."],
      ["Recurrent training", "Free online refresher required every 24 calendar months."]
    ],
    hook: "16, English, IACRA, UAG, then recurrent every 24 months.",
    scenario: "It's been 25 months since your last training and a client wants a flight today. May you legally fly under Part 107?",
    oral: "State the minimum age and the recurrency interval for a remote pilot.",
    practical: "Add a recurring 23-month reminder for Part 107 recurrent training to your calendar.",
    quiz: [
      { type: "mc", q: "Minimum age for a Remote Pilot Certificate:", choices: ["14", "16", "18", "21"], answer: 1, why: "You must be at least 16 years old." },
      { type: "fill", q: "Remote pilots must complete recurrent training every ____ calendar months.", answer: "24", alts: ["twenty four", "twentyfour"], why: "Currency requires recurrent training every 24 calendar months." }
    ]
  },

  "d-limits": {
    title: "Operating limitations: altitude, speed, line of sight, daylight",
    pathway: "drone", cert: "Remote Pilot", faa: "suas", acs: "sUAS ACS — Operating limitations", time: 8,
    explain: [
      "Part 107 sets hard limits. Maximum altitude is 400 ft above ground level — unless you stay within 400 ft of a structure, in which case you may go up to 400 ft above that structure's top.",
      "Maximum groundspeed is 100 mph (87 knots). You must keep the aircraft within visual line of sight (VLOS) at all times, either by you or a visual observer.",
      "Minimum flight visibility is 3 statute miles from the control station, and you must stay 500 ft below and 2,000 ft horizontally from clouds. Operations are allowed in daylight and civil twilight, and at night, provided the aircraft has anti-collision lighting visible for 3 statute miles."
    ],
    why: "These numbers are the most-tested and most-enforced part of Part 107 — and the most likely to cause a midair or a violation if ignored.",
    mistake: "Flying first-person-view goggles solo without a visual observer — that breaks the VLOS requirement.",
    instructor: "Memorize 400 / 100 / 3 / 500 / 2000 cold. They come up on the test and on every real mission brief.",
    safety: "Line of sight is the primary way a small drone avoids crewed aircraft — losing sight of it is losing your collision avoidance.",
    terms: [
      ["VLOS", "Visual Line of Sight — must see the aircraft at all times."],
      ["Visual observer", "A person who maintains VLOS to assist the remote pilot."],
      ["Civil twilight", "The period just after sunset / before sunrise; defined times."]
    ],
    hook: "400 up, 100 fast, 3 miles to see, 500 below and 2000 beside the clouds.",
    scenario: "You want to inspect a 700-ft tower's top antenna. Does Part 107's 400 ft limit stop you?",
    oral: "State the altitude, speed, and visibility limits under Part 107.",
    practical: "Before your next sim or real flight, recite the five core limits out loud.",
    quiz: [
      { type: "mc", q: "Maximum Part 107 altitude (away from structures) is:", choices: ["200 ft AGL", "400 ft AGL", "500 ft AGL", "1000 ft AGL"], answer: 1, why: "400 ft AGL, or within 400 ft of a structure." },
      { type: "mc", q: "Minimum flight visibility under Part 107 is:", choices: ["1 SM", "3 SM", "5 SM", "No minimum"], answer: 1, why: "3 statute miles minimum from the control station." },
      { type: "tf", q: "Flying with FPV goggles alone, with no visual observer, satisfies VLOS.", answer: false, why: "Someone must maintain visual line of sight at all times." }
    ]
  },

  "d-airspace": {
    title: "Airspace and LAANC authorization",
    pathway: "drone", cert: "Remote Pilot", faa: "suas", acs: "sUAS ACS — Airspace", time: 8,
    explain: [
      "By default, Part 107 operations are allowed in uncontrolled (Class G) airspace without authorization. Operating in controlled airspace (B, C, D, and surface Class E around airports) requires FAA authorization.",
      "The fastest way to get it is LAANC — Low Altitude Authorization and Notification Capability — which provides near-instant approval up to published altitude ceilings via approved apps. Areas without LAANC coverage use the FAA DroneZone manual request, which takes longer.",
      "You read the same sectional charts crewed pilots use, plus UAS Facility Maps that show the pre-approved altitude grid around airports."
    ],
    why: "Most drone airspace violations happen near airports — exactly where authorization is required and where crewed traffic is densest.",
    mistake: "Assuming LAANC approval means 'anything goes.' It authorizes a specific area and altitude — exceed it and you're unauthorized again.",
    instructor: "Check the UAS Facility Map first; if the grid shows 0 ft, that cell needs a manual waiver, not a quick LAANC tap.",
    safety: "The grid altitudes exist to keep drones below approach and departure paths — they are collision buffers, not bureaucracy.",
    terms: [
      ["LAANC", "Near-instant controlled-airspace authorization for drones."],
      ["UAS Facility Map", "Grid of pre-approved altitudes around airports."],
      ["Sectional chart", "Aeronautical chart showing airspace, terrain, obstacles."]
    ],
    hook: "Class G is go; B/C/D and surface E need a yes — LAANC gives it fast.",
    scenario: "A LAANC grid cell near the airport shows 100 ft. Your inspection needs 250 ft. What now?",
    oral: "How does a remote pilot obtain authorization to fly in controlled airspace?",
    practical: "Open a UAS Facility Map for an airport near you and note the grid altitudes.",
    quiz: [
      { type: "mc", q: "Part 107 flight in controlled airspace requires:", choices: ["Nothing", "FAA authorization (e.g., LAANC)", "A pilot certificate", "A flight plan"], answer: 1, why: "Controlled airspace requires authorization, often via LAANC." },
      { type: "tf", q: "Class G (uncontrolled) airspace generally needs no authorization for Part 107.", answer: true, why: "Default Part 107 operations in Class G need no airspace authorization." }
    ]
  },

  "d-remoteid": {
    title: "Remote ID — the drone's digital license plate",
    pathway: "drone", cert: "Remote Pilot", faa: "suas", acs: "sUAS ACS — Remote ID", time: 6,
    explain: [
      "Remote ID lets a drone broadcast identification and location information so the FAA, law enforcement, and others can identify it in flight. Think of it as a digital license plate.",
      "Most drones must comply by broadcasting Standard Remote ID (built in) or using a Remote ID broadcast module. The alternative is flying within an FAA-Recognized Identification Area (FRIA).",
      "Registration ties your drone to you; Remote ID ties the in-flight aircraft to that registration in real time."
    ],
    why: "Remote ID is now a compliance requirement — flying a non-compliant drone outside a FRIA can be a violation.",
    mistake: "Confusing registration with Remote ID. Registration is paperwork; Remote ID is an active broadcast during flight.",
    instructor: "Verify your specific drone's Remote ID status before a job — firmware and module setup matter.",
    safety: "Remote ID improves airspace security and accountability, which keeps drone access open for everyone.",
    terms: [
      ["Remote ID", "In-flight broadcast of drone ID and location."],
      ["Broadcast module", "Add-on device providing Remote ID for drones without it built in."],
      ["FRIA", "FAA-Recognized Identification Area where Remote ID isn't required."]
    ],
    hook: "Registration is the plate, Remote ID is the plate lit up and moving.",
    scenario: "Your older drone has no built-in Remote ID and you're not in a FRIA. What makes it compliant?",
    oral: "What are the ways to comply with the Remote ID rule?",
    practical: "Check whether your drone has Standard Remote ID or needs a module.",
    quiz: [
      { type: "mc", q: "Remote ID functions most like a:", choices: ["Flight plan", "Digital license plate", "Weather report", "Logbook"], answer: 1, why: "It broadcasts identity and location, like a license plate." },
      { type: "tf", q: "A FRIA is one way to operate without broadcasting Remote ID.", answer: true, why: "Flying within a FRIA is an alternative to Remote ID broadcast." }
    ]
  },

  "d-people": {
    title: "Operations over people and moving vehicles",
    pathway: "drone", cert: "Remote Pilot", faa: "suas", acs: "sUAS ACS — Ops over people", time: 8,
    explain: [
      "Flying directly over people who are not part of your operation is restricted and sorted into four categories based on injury risk. Category 1 covers the smallest drones (under 0.55 lb) with no exposed rotating parts capable of lacerating skin.",
      "Categories 2 and 3 are defined by injury-severity thresholds the drone must meet, with Category 3 adding operational restrictions (such as not sustaining flight over open-air assemblies). Category 4 requires an airworthiness certificate.",
      "Operations over moving vehicles have their own conditions. The unifying idea: the more risk you pose to uninvolved people, the more the aircraft and operation must prove they are safe."
    ],
    why: "People-overflight is where drones can actually hurt someone — these rules are direct injury prevention.",
    mistake: "Assuming a small consumer drone automatically qualifies for any over-people flight. Categories depend on weight, design, and declarations.",
    instructor: "If a crowd gathers, the safe default is do not fly over them unless you have verified your category and conditions.",
    safety: "A drone failure over a crowd is a worst-case scenario — treat over-people operations as the high-stakes flights they are.",
    terms: [
      ["Category 1", "Under 0.55 lb, no lacerating exposed parts."],
      ["Open-air assembly", "A gathering of people; the most restricted to overfly."],
      ["Uninvolved person", "Someone not participating in or protected from the operation."]
    ],
    hook: "Heavier and riskier means higher category and more proof.",
    scenario: "A 0.5-lb camera drone with guarded props — which category framework applies for brief overflight?",
    oral: "How does the FAA categorize operations over people, and what drives the category?",
    practical: "Note your drone's weight and whether it has exposed rotating parts.",
    quiz: [
      { type: "mc", q: "Category 1 over-people operations require a drone under:", choices: ["0.55 lb", "5 lb", "25 lb", "55 lb"], answer: 0, why: "Category 1 is for drones under 0.55 lb with no lacerating parts." },
      { type: "tf", q: "Heavier drones with higher injury potential face stricter over-people rules.", answer: true, why: "Categories scale with the injury risk to uninvolved people." }
    ]
  },

  "d-wx-perf": {
    title: "Weather, loading, performance, and drone risk management",
    pathway: "drone", cert: "Remote Pilot", faa: "suas", acs: "sUAS ACS — Performance & ADM", time: 8,
    explain: [
      "Drones are small and light, which makes them sensitive to wind, density altitude, and battery state. Gusts that feel mild on the ground can exceed a small drone's authority and cause a flyaway or hard landing.",
      "Loading matters: added payload (a heavier camera, a sensor) changes endurance, climb, and handling. High density altitude — hot, high, humid conditions — reduces propeller efficiency just as it does for crewed aircraft.",
      "Apply the same risk management (PAVE, personal minimums) you learned in the foundation. Set wind and battery limits before launch and respect them."
    ],
    why: "Most drone losses are environmental or battery-related, not exotic failures — managing them is most of the safety job.",
    mistake: "Flying a battery 'just a little longer.' Voltage sag under load can cause a sudden power loss far from a safe landing spot.",
    instructor: "Bring the drone home with reserve battery, the same way an airplane pilot lands with fuel reserves.",
    safety: "A flyaway over people or traffic is the nightmare — conservative wind and battery limits prevent most of them.",
    terms: [
      ["Density altitude", "Pressure altitude corrected for temperature; high DA reduces performance."],
      ["Flyaway", "Loss of control where the drone departs uncommanded."],
      ["Reserve", "Battery margin kept for a safe return and landing."]
    ],
    hook: "Wind, weight, watts — brief all three before you launch.",
    scenario: "It's 95 degrees, you've added a heavy camera, and winds gust to 22 mph. What does each factor do to performance?",
    oral: "How do payload and density altitude affect a small drone's performance?",
    practical: "Write personal wind and battery minimums for your drone and tape them to the case.",
    quiz: [
      { type: "mc", q: "High density altitude on a drone primarily:", choices: ["Improves climb", "Reduces performance", "Has no effect", "Increases battery life"], answer: 1, why: "Thin air reduces propeller efficiency and performance." },
      { type: "tf", q: "Adding payload reduces endurance and changes handling.", answer: true, why: "More weight means more power draw and altered handling." }
    ]
  },

  /* ----------------------------- AIRPLANE — pre-solo + PPL ---------------- */
  "a-fundamentals": {
    title: "The four fundamentals of flight",
    pathway: "airplane", cert: "Student / Private", faa: "afh", acs: "PA.III — Fundamentals", time: 8,
    explain: [
      "Every airplane maneuver is built from four fundamentals: straight-and-level flight, turns, climbs, and descents. Master these and the 'advanced' maneuvers are just combinations.",
      "Straight-and-level means holding heading and altitude using outside references and a light touch. Turns coordinate aileron and rudder while managing back pressure. Climbs and descents trade airspeed, power, and pitch in predictable ways.",
      "The big lesson early on is that pitch, power, and trim work together — you control the airplane with small, coordinated inputs, not by muscling it."
    ],
    why: "These four are the literal building blocks of every checkride maneuver and every real flight.",
    mistake: "Staring at the instruments instead of outside. Early flying is primarily visual, with instruments as a cross-check.",
    instructor: "I'd rather you fly smoothly and slightly imperfectly than chase the needles and over-control.",
    safety: "Loss of control in flight is a leading fatal accident category — solid fundamentals are the foundation of preventing it.",
    terms: [
      ["Straight-and-level", "Constant heading and altitude."],
      ["Coordination", "Matching rudder to aileron so the ball stays centered."],
      ["Trim", "Relieving control pressure to hold an attitude hands-light."]
    ],
    hook: "Straight, Turn, Climb, Descend — everything else is a remix.",
    scenario: "In a turn the airplane's nose drops and the turn tightens. Which fundamental input are you likely mismanaging?",
    oral: "Name the four fundamentals and describe what changes in a climb.",
    practical: "On your next flight or sim, hold heading and altitude for 60 seconds using only outside references.",
    quiz: [
      { type: "mc", q: "Which is NOT one of the four fundamentals?", choices: ["Turns", "Climbs", "Slips", "Descents"], answer: 2, why: "The four fundamentals are straight-and-level, turns, climbs, descents." },
      { type: "tf", q: "Early visual flying should rely mostly on outside references.", answer: true, why: "Instruments are a cross-check; the primary reference is outside." }
    ]
  },

  "a-forces": {
    title: "Four forces and angle of attack",
    pathway: "airplane", cert: "Student / Private", faa: "phak", acs: "PA.I — Aerodynamics", time: 9,
    explain: [
      "Four forces act on an airplane: lift (up), weight (down), thrust (forward), and drag (back). In steady flight they balance; change one and the airplane responds.",
      "Lift comes from the wing's interaction with the air, and the key variable a pilot controls is angle of attack — the angle between the wing and the oncoming air. More angle of attack means more lift, up to a point.",
      "Past the critical angle of attack the airflow separates and the wing stalls — it stops producing the lift you need. Crucially, a wing can stall at any airspeed and any attitude if the critical angle is exceeded."
    ],
    why: "Angle of attack — not airspeed alone — is what stalls a wing. Understanding it prevents the most fundamental loss-of-control accidents.",
    mistake: "Believing a stall only happens 'when you're slow.' You can stall fast in a steep turn by exceeding the critical angle of attack.",
    instructor: "When I say 'unload,' I mean reduce angle of attack — that is what ends a stall, not just adding power.",
    safety: "Stall/spin accidents in the pattern are historically deadly. Respect angle of attack near the ground.",
    terms: [
      ["Lift", "Aerodynamic force supporting the airplane."],
      ["Angle of attack", "Angle between the wing and the relative wind."],
      ["Critical angle of attack", "The AoA beyond which the wing stalls."],
      ["Relative wind", "The airflow direction relative to the wing."]
    ],
    hook: "A wing stalls at an angle, not a number — exceed the critical AoA and it quits.",
    scenario: "In a steep, tight turn at cruise speed the airplane buffets and stalls. How is that possible at high airspeed?",
    oral: "Define the critical angle of attack and explain why a stall can occur at any airspeed.",
    practical: "Watch an angle-of-attack indicator or sim AoA display through a slow-flight entry.",
    quiz: [
      { type: "mc", q: "A wing stalls when it exceeds the:", choices: ["Maximum airspeed", "Critical angle of attack", "Service ceiling", "Maneuvering speed"], answer: 1, why: "Exceeding the critical AoA causes a stall, regardless of airspeed." },
      { type: "tf", q: "An airplane can stall at high airspeed.", answer: true, why: "Exceeding critical AoA stalls the wing at any speed." },
      { type: "fill", q: "The four forces are lift, weight, thrust, and ______.", answer: "drag", alts: [], why: "Lift, weight, thrust, and drag act on every airplane." }
    ]
  },

  "a-pattern": {
    title: "The traffic pattern",
    pathway: "airplane", cert: "Student / Private", faa: "afh", acs: "PA.IV — Pattern ops", time: 8,
    explain: [
      "The traffic pattern is the standardized rectangular path pilots fly around an airport to sequence safely for landing. Its legs are: upwind, crosswind, downwind, base, and final.",
      "Standard turns are to the left unless the airport specifies otherwise. Pattern altitude is typically 1,000 ft above the airport, and pilots make position radio calls at non-towered fields so everyone can build a mental picture.",
      "The pattern is as much about communication and seeing other traffic as it is about flying the rectangle precisely."
    ],
    why: "Most light-aircraft traffic conflicts happen near airports — the pattern is the system that keeps everyone predictable.",
    mistake: "Flying the legs but forgetting to look for traffic and to listen. Predictability and a good scan prevent collisions.",
    instructor: "Fly the pattern like you're on a conveyor belt — same altitudes, same calls, every time, so others can predict you.",
    safety: "Midair collisions cluster in the pattern. 'See and avoid' plus standard procedures are your defense.",
    terms: [
      ["Downwind", "Leg parallel to the runway, opposite landing direction."],
      ["Base", "Leg perpendicular, connecting downwind to final."],
      ["Final", "Leg aligned with the runway for landing."],
      ["Pattern altitude", "Standard height for the pattern, usually 1,000 ft AGL."]
    ],
    hook: "Up, Cross, Down, Base, Final — a rectangle you fly the same way every time.",
    scenario: "You're on downwind and hear another aircraft call a straight-in final. How should you adjust to avoid a conflict?",
    oral: "Name the legs of the traffic pattern and the standard turn direction.",
    practical: "Sketch a left-traffic pattern and label all five legs.",
    quiz: [
      { type: "mc", q: "The leg aligned with the runway for landing is:", choices: ["Base", "Downwind", "Final", "Crosswind"], answer: 2, why: "Final is the leg aligned with the runway." },
      { type: "tf", q: "Standard traffic pattern turns are to the left unless stated otherwise.", answer: true, why: "Left traffic is standard unless the airport specifies right." }
    ]
  },

  "a-airspace-vfr": {
    title: "Airspace for the VFR pilot and weather minimums",
    pathway: "airplane", cert: "Private", faa: "aim", acs: "PA.I — Airspace", time: 10,
    explain: [
      "Building on the foundation airspace lesson, the VFR pilot must know the entry requirements and the visibility and cloud-clearance minimums for each class. These minimums keep visual pilots far enough from clouds to see and avoid other aircraft.",
      "In Class B, the rule is simplified to 3 statute miles visibility and remaining clear of clouds. In Class C, D, and E below 10,000 ft MSL, the rule is 3 statute miles and 500 ft below, 1,000 ft above, 2,000 ft horizontal from clouds.",
      "Class G is more permissive near the surface but the principle is the same: enough visibility and cloud clearance to operate visually and avoid traffic."
    ],
    why: "VFR minimums are a frequent test topic and, more importantly, the legal line that keeps you out of the clouds and away from IFR traffic.",
    mistake: "Memorizing the numbers without the why. They exist to give you time to see and avoid — not as arbitrary trivia.",
    instructor: "I teach '3-152' for the common case: 3 miles, 1,000 above, 500 below, 2,000 horizontal.",
    safety: "Scud-running near minimums is how VFR pilots end up in IMC. Build personal minimums well above the legal floor.",
    terms: [
      ["VFR", "Visual Flight Rules — fly by outside reference."],
      ["Cloud clearance", "Required distance to remain from clouds."],
      ["Statute mile", "The visibility unit (about 5,280 ft)."]
    ],
    hook: "Class B: 3 and clear; most everywhere else below 10k: 3, with 5-1-2 hundred from clouds (500/1000/2000).",
    scenario: "You're VFR in Class E at 4,500 ft with broken clouds 400 ft above you. Are you legal?",
    oral: "State the basic VFR visibility and cloud clearance for Class C/D/E below 10,000 ft.",
    practical: "Quiz yourself on the cloud clearance for three airspace classes from memory.",
    quiz: [
      { type: "mc", q: "Basic VFR cloud clearance in Class D (below 10k MSL) is:", choices: ["Clear of clouds", "500 below / 1000 above / 2000 horizontal", "1000 below / 1000 above / 1 mile", "None"], answer: 1, why: "The 500/1000/2000 rule applies in C/D/E below 10,000 MSL." },
      { type: "tf", q: "In Class B, VFR aircraft must remain clear of clouds with 3 SM visibility.", answer: true, why: "Class B simplifies to 3 SM and clear of clouds." }
    ]
  },

  "a-wb": {
    title: "Weight and balance basics",
    pathway: "airplane", cert: "Private", faa: "wbh", acs: "PA.I — Weight & balance", time: 9,
    explain: [
      "An airplane has limits on how much it can weigh and where that weight sits. Total weight must stay at or under the maximum gross weight, and the center of gravity (CG) must fall within the approved range.",
      "Weight affects takeoff distance, climb, and stall speed. CG affects stability and control: too far forward and the airplane is nose-heavy and may not flare; too far aft and it becomes dangerously unstable and hard to recover from a stall.",
      "Pilots compute weight and balance before flight using the aircraft's loading data, arms, and moments — it is arithmetic that prevents real accidents."
    ],
    why: "Overweight or out-of-CG airplanes have crashed on takeoff or become uncontrollable — this is preventable arithmetic.",
    mistake: "Loading by eyeball. 'It fit last time' ignores that passengers, fuel, and baggage shift the CG every flight.",
    instructor: "Run the numbers every flight until it's automatic. An aft-CG surprise on a go-around is not the time to learn this.",
    safety: "Aft-CG loading degrades stall recovery; forward-CG can prevent flare. Both are documented accident causes.",
    terms: [
      ["Center of gravity", "The balance point of the loaded aircraft."],
      ["Arm", "Distance from the reference datum to an item's location."],
      ["Moment", "Weight multiplied by arm; used to find CG."],
      ["Max gross weight", "The maximum approved total weight."]
    ],
    hook: "Weight is how much; CG is where — both must be in limits before you fly.",
    scenario: "You add two heavy passengers in the back and load aft baggage. Which way does the CG move, and what's the risk?",
    oral: "Explain how an aft center of gravity affects stability and stall recovery.",
    practical: "Compute a sample weight and balance for a training aircraft using its loading chart.",
    quiz: [
      { type: "mc", q: "Center of gravity primarily affects:", choices: ["Fuel burn", "Stability and control", "Radio range", "Tire pressure"], answer: 1, why: "CG location drives stability and controllability." },
      { type: "fill", q: "Weight multiplied by arm equals the ______.", answer: "moment", alts: ["moments"], why: "Moment = weight x arm, used to compute CG." }
    ]
  },

  "a-metar": {
    title: "Aviation weather products: METAR, TAF, and go/no-go",
    pathway: "airplane", cert: "Private", faa: "phak", acs: "PA.I — Weather information", time: 10,
    explain: [
      "Building on the foundation weather lesson, the private pilot must actually decode METARs and TAFs and combine them into a personal go/no-go decision for a route.",
      "A METAR gives current conditions; a TAF forecasts a terminal area, valid for a period with change groups. You also use winds aloft, AIRMETs/SIGMETs for hazards, and PIREPs from other pilots.",
      "The decision is never 'is it legal' alone — it's 'is it safe for me, in this airplane, today.' Personal minimums sit above the legal minimums."
    ],
    why: "Weather is the number-one factor in general-aviation accidents — fluency with the products is a core survival skill.",
    mistake: "Trusting a single product. Cross-check METAR, TAF, winds aloft, and hazards for the whole route and time window.",
    instructor: "Brief weather out loud as a story: where it is now, where it's going, and your outs if it's worse than forecast.",
    safety: "A forecast is not a guarantee. Always plan an alternate and a turn-back point before launching into marginal conditions.",
    terms: [
      ["TAF", "Terminal Aerodrome Forecast for an airport area."],
      ["AIRMET / SIGMET", "Advisories for weather hazardous to aircraft."],
      ["PIREP", "Pilot report of actual conditions encountered."],
      ["Personal minimums", "Self-imposed limits stricter than the regs."]
    ],
    hook: "Now (METAR), Next (TAF), Winds, Hazards, Outs — then decide.",
    scenario: "TAF forecasts marginal VFR deteriorating to IFR mid-trip. You're a VFR-only pilot. What's your decision and why?",
    oral: "Walk through the weather products you'd use to plan a 150-mile cross-country.",
    practical: "Decode a real METAR and the matching TAF for the same airport and compare them.",
    quiz: [
      { type: "mc", q: "A TAF is:", choices: ["A current observation", "A forecast for a terminal area", "A NOTAM", "A clearance"], answer: 1, why: "TAF forecasts; METAR observes." },
      { type: "tf", q: "Personal minimums should be stricter than the legal minimums.", answer: true, why: "Personal minimums add margin above the regulatory floor." }
    ]
  },

  "a-slowflight": {
    title: "Slow flight, stalls, and the region of reversed command",
    pathway: "airplane", cert: "Private", faa: "afh", acs: "PA.VII — Slow flight & stalls", time: 10,
    explain: [
      "Slow flight is controlled flight just above stall speed, where the airplane is mushy and responsive to angle of attack. Practicing it builds the feel that prevents inadvertent stalls.",
      "A stall happens at the critical angle of attack. Recovery is the same regardless of type: reduce angle of attack (lower the nose), add power as appropriate, and level the wings — in that priority.",
      "At low speeds you enter the 'region of reversed command,' where you need more power, not less, to maintain altitude as you slow — a counterintuitive zone that matters on approach."
    ],
    why: "Stall awareness and recovery directly counter loss-of-control accidents, the leading cause of GA fatalities.",
    mistake: "Pulling back to stop a descent near a stall. That increases angle of attack and can deepen the stall — lower the nose first.",
    instructor: "The first move in any stall is always the same: reduce angle of attack. Power and wings come after.",
    safety: "Stall recovery near the ground (base-to-final) leaves little margin — fly coordinated and respect AoA in the pattern.",
    terms: [
      ["Slow flight", "Controlled flight just above stall speed."],
      ["Region of reversed command", "Low-speed regime where more power is needed to hold altitude."],
      ["Recovery", "Reduce AoA, add power, level wings — in priority order."]
    ],
    hook: "Stall fix, always: nose down, power up, wings level.",
    scenario: "On final you're slow and sinking. Instinct says pull. Why is that the wrong first move?",
    oral: "Describe the stall recovery sequence and explain the region of reversed command.",
    practical: "In a sim, practice a power-off stall and apply the recovery in the correct order.",
    quiz: [
      { type: "mc", q: "The first action in stall recovery is to:", choices: ["Add full power", "Reduce angle of attack", "Raise the nose", "Retract flaps"], answer: 1, why: "Reducing AoA is always the first recovery action." },
      { type: "tf", q: "In the region of reversed command, more power is needed to maintain altitude as you slow.", answer: true, why: "Below a certain speed, slowing requires added power to hold altitude." }
    ]
  },

  /* ===================== INSTRUMENT RATING — AIRPLANE ===================== */
  "ir-intro": {
    title: "What the instrument rating is",
    pathway: "airplane", cert: "Instrument Rating — Airplane", faa: "ifh", acs: "Instrument ACS — Certification", time: 7,
    explain: [
      "An instrument rating lets you fly under Instrument Flight Rules (IFR) in clouds and low visibility, controlling the airplane by reference to instruments alone when there is no usable horizon outside. It is added to a pilot certificate, not earned separately.",
      "The core eligibility under 14 CFR 61.65 includes holding at least a private pilot certificate, logging 50 hours of cross-country flight time as pilot in command, and 40 hours of actual or simulated instrument time, including a set amount of training from an instrument instructor. You also pass a knowledge test and a practical test."
    ],
    why: "The instrument rating is the single biggest jump in capability and safety for most pilots — it turns a marginal-weather day from a cancellation into a managed flight.",
    mistake: "Treating it as just a weather waiver. It is a demanding skill set: precise aircraft control, procedures, and decision-making under workload.",
    instructor: "Instrument flying is a discipline of trust and scan. We build both slowly — you will fly attitudes you cannot feel and learn to believe the instruments.",
    safety: "Continued visual flight into instrument conditions by unrated or unprepared pilots is a leading cause of fatal accidents. The rating exists to break that chain.",
    terms: [
      ["IFR", "Instrument Flight Rules — operating by reference to instruments under ATC."],
      ["IMC", "Instrument Meteorological Conditions — weather below visual minimums."],
      ["Instrument time", "Time controlling the aircraft solely by reference to instruments."]
    ],
    hook: "See nothing outside; fly everything inside.",
    scenario: "You hold a private certificate and want to legally fly through a cloud layer to climb on top. Which rating do you need to do that lawfully?",
    oral: "State the purpose of the instrument rating and name three eligibility requirements from 14 CFR 61.65.",
    practical: "Sit under a view-limiting device with an instructor and hold heading and altitude using only the instruments for two minutes.",
    quiz: [
      { type: "mc", q: "The instrument rating authorizes flight:", choices: ["Only at night", "Under IFR in instrument conditions", "Above 18,000 feet only", "Without ATC contact"], answer: 1, why: "An instrument rating allows operation under IFR in instrument meteorological conditions." },
      { type: "tf", q: "An instrument rating is a separate certificate, not an addition to an existing one.", answer: false, why: "It is a rating added to a pilot certificate, not a standalone certificate." }
    ]
  },

  "ir-scan": {
    title: "The instrument scan and attitude instrument flying",
    pathway: "airplane", cert: "Instrument Rating — Airplane", faa: "ifh", acs: "Instrument ACS — Flight instruments", time: 7,
    explain: [
      "Without an outside horizon, you fly the airplane by interpreting the instruments and cross-checking them against each other. Two common methods are taught: the control-and-performance method and the primary-and-supporting method. Both rely on a continuous, organized scan rather than fixating on one gauge.",
      "The attitude indicator is the control instrument that you set, and the performance instruments — airspeed, altimeter, vertical speed, heading — confirm the result. If a vacuum or instrument fails, you must fly 'partial panel,' using the surviving instruments to keep the airplane upright and on course."
    ],
    why: "A disciplined scan is the foundation of all instrument flying. A broken scan is how pilots lose control in the clouds.",
    mistake: "Fixating. Staring at the altimeter while heading and bank quietly drift is the classic instrument-student error.",
    instructor: "Set the attitude, then check the performance. Pitch plus power equals performance — say it until it is reflexive.",
    safety: "Recognizing an instrument failure quickly, and switching to partial-panel technique, prevents a slow loss of control from a single failed component.",
    terms: [
      ["Control instrument", "The attitude indicator and power, which you set directly."],
      ["Performance instruments", "Airspeed, altimeter, VSI, heading — they confirm the result."],
      ["Partial panel", "Flying with one or more primary instruments failed."]
    ],
    hook: "Set attitude, check performance, keep scanning.",
    scenario: "Your attitude indicator slowly tumbles and gives a false reading. Which instruments do you use to keep the wings level partial-panel?",
    oral: "Explain the difference between control and performance instruments and describe a basic scan.",
    practical: "Practice a partial-panel scan in a sim with the attitude indicator covered.",
    quiz: [
      { type: "mc", q: "In the control-and-performance method, the attitude indicator is a:", choices: ["Performance instrument", "Control instrument", "Navigation instrument", "Backup only"], answer: 1, why: "The attitude indicator is the primary control instrument that the pilot sets." },
      { type: "tf", q: "Fixating on a single instrument is a recommended instrument technique.", answer: false, why: "Instrument flying requires a continuous cross-check, not fixation on one gauge." }
    ]
  },

  "ir-spatial": {
    title: "Spatial disorientation and illusions",
    pathway: "airplane", cert: "Instrument Rating — Airplane", faa: "ifh", acs: "Instrument ACS — Human factors", time: 6,
    explain: [
      "Your inner ear and body senses are unreliable without an outside reference. In clouds they can convince you that you are turning when you are level, or climbing when you are diving. This is spatial disorientation, and it can be overwhelming and fatal if you follow your feelings instead of the instruments.",
      "Common illusions include 'the leans' (a false sense of bank after a slow roll), the graveyard spiral (a steepening turn that feels level), and the somatogravic illusion (acceleration feeling like a pitch-up). The defense is simple to state and hard to do: believe the instruments, not your body."
    ],
    why: "More than feel, more than instinct, instrument flying is the practiced act of overriding false sensations with verified data.",
    mistake: "Trusting the seat of your pants. In instrument conditions your physical sensations are the thing most likely to kill you.",
    instructor: "When your body and the instruments disagree in the clouds, the instruments win. Every time, no exceptions.",
    safety: "Spatial disorientation can develop within seconds of losing visual reference. Pilots without instrument skills can lose control almost immediately in IMC.",
    terms: [
      ["Spatial disorientation", "Inability to correctly sense position and motion without outside reference."],
      ["The leans", "A false sensation of bank, often after a slow, unnoticed roll."],
      ["Somatogravic illusion", "Acceleration sensed as a nose-up pitch change."]
    ],
    hook: "Believe the panel, not the feeling.",
    scenario: "After leveling from a long, gentle turn you feel strongly banked the other way, but the instruments read wings-level. Which do you trust?",
    oral: "Define spatial disorientation and describe two illusions and how to counter them.",
    practical: "Review video demonstrations of the leans and the graveyard spiral and note the instrument indications for each.",
    quiz: [
      { type: "mc", q: "The correct response to spatial disorientation in IMC is to:", choices: ["Trust your physical senses", "Rely on the flight instruments", "Close your eyes briefly", "Maneuver aggressively"], answer: 1, why: "You must rely on the instruments, because your physical senses are unreliable without a horizon." },
      { type: "tf", q: "Physical sensations are a reliable guide to aircraft attitude in clouds.", answer: false, why: "Without an outside reference, bodily senses are unreliable and can produce dangerous illusions." }
    ]
  },

  "ir-weather": {
    title: "IFR weather and icing",
    pathway: "airplane", cert: "Instrument Rating — Airplane", faa: "ifh", acs: "Instrument ACS — Weather information", time: 7,
    explain: [
      "Instrument pilots plan around ceilings, visibilities, and hazards that visual pilots simply avoid. You read forecasts and reports to know where conditions are above your minimums, where ice and embedded thunderstorms lurk, and what your alternate options are if the destination goes below limits.",
      "Structural icing is a special concern. Most training airplanes are not approved for flight into known icing, so freezing levels, visible moisture, and temperature define hard no-go boundaries. Convective weather — thunderstorms — must be avoided entirely, never penetrated, even on instruments."
    ],
    why: "The instrument rating expands where you can fly, but weather still sets the real limits. Knowing those limits keeps the rating from writing a check the airplane cannot cash.",
    mistake: "Believing instruments make any weather flyable. Ice and thunderstorms are off-limits for typical IFR training aircraft, rating or not.",
    instructor: "An instrument rating is permission to fly in clouds, not in ice or storms. Learn the difference cold.",
    safety: "Structural icing and thunderstorm penetration have destroyed capable aircraft and crews. Respect freezing levels and convective activity as absolute boundaries.",
    terms: [
      ["Ceiling", "The height of the lowest broken or overcast cloud layer."],
      ["Structural icing", "Ice accumulating on the airframe; a serious hazard in visible moisture below freezing."],
      ["Alternate", "A backup airport planned in case the destination is below minimums."]
    ],
    hook: "Clouds yes, ice and storms no.",
    scenario: "Your route is solid cloud at a temperature below freezing in a non-deiced trainer. Why is this a no-go even with an instrument rating?",
    oral: "Explain why structural icing and thunderstorms remain off-limits for most IFR training aircraft.",
    practical: "Pull a current area forecast and identify freezing levels and any convective activity along a sample route.",
    quiz: [
      { type: "mc", q: "For most instrument training airplanes, flight into known icing is:", choices: ["Allowed under IFR", "Not approved", "Required for the rating", "Allowed above the freezing level"], answer: 1, why: "Most training aircraft are not approved for flight into known icing, regardless of the pilot's rating." },
      { type: "tf", q: "An instrument rating allows you to fly through thunderstorms safely.", answer: false, why: "Thunderstorms must be avoided entirely; instruments do not make convective weather safe to penetrate." }
    ]
  },

  "ir-clearance": {
    title: "IFR clearances and enroute charts",
    pathway: "airplane", cert: "Instrument Rating — Airplane", faa: "iph", acs: "Instrument ACS — ATC clearances & procedures", time: 7,
    explain: [
      "Under IFR you fly within a clearance issued by ATC. A useful memory aid for the elements is CRAFT: Clearance limit, Route, Altitude, Frequency, and Transponder code. You read it back and then fly exactly what was cleared unless amended.",
      "You navigate using low-altitude enroute charts, which show airways, navigation fixes, minimum enroute altitudes (MEAs) that guarantee obstacle clearance and signal reception, and reporting points. Learning to read these charts is as fundamental to IFR as the sectional is to visual flying."
    ],
    why: "IFR is a system of clearances and charted routes. Fluency with both is what lets you operate inside controlled airspace safely and predictably.",
    mistake: "Accepting a clearance you do not understand. If a clearance is unclear or unflyable, you ask or decline — you never guess in the system.",
    instructor: "Copy the clearance with CRAFT, read it back clean, and fly it precisely. ATC builds its whole plan around you doing exactly that.",
    safety: "Minimum enroute altitudes exist for terrain and obstacle clearance. Descending below a charted minimum without authorization removes that protection.",
    terms: [
      ["CRAFT", "Clearance limit, Route, Altitude, Frequency, Transponder — the clearance elements."],
      ["MEA", "Minimum Enroute Altitude — guarantees obstacle clearance and signal reception."],
      ["Airway", "A charted IFR route between navigation fixes."]
    ],
    hook: "Copy CRAFT, read it back, fly it exactly.",
    scenario: "ATC assigns an altitude lower than the charted MEA on your airway. What should you do before descending?",
    oral: "List the elements of CRAFT and explain what an MEA guarantees.",
    practical: "Copy a sample IFR clearance using the CRAFT format and read it back to your instructor.",
    quiz: [
      { type: "mc", q: "In the CRAFT clearance format, the 'A' stands for:", choices: ["Airway", "Altitude", "Approach", "Alternate"], answer: 1, why: "CRAFT stands for Clearance limit, Route, Altitude, Frequency, Transponder." },
      { type: "fill", q: "The charted altitude that guarantees obstacle clearance and signal reception on an airway is the ___.", answer: "mea", alts: ["minimum enroute altitude"], why: "The MEA (Minimum Enroute Altitude) provides obstacle clearance and navigation signal coverage." }
    ]
  },

  "ir-approaches": {
    title: "Instrument approaches",
    pathway: "airplane", cert: "Instrument Rating — Airplane", faa: "iph", acs: "Instrument ACS — Instrument approach procedures", time: 8,
    explain: [
      "An instrument approach is a charted procedure that brings you safely from the enroute structure down toward a runway in low visibility. Approaches are broadly precision (with vertical guidance, like an ILS) or nonprecision (lateral guidance only, like some VOR or LOC approaches). Modern GPS approaches such as LPV provide near-precision vertical guidance.",
      "Each approach has minimums: a decision altitude (DA) for precision and approach-with-vertical-guidance procedures, or a minimum descent altitude (MDA) for nonprecision. At the missed approach point, if you do not have the required visual references, you fly the published missed approach and try again or divert."
    ],
    why: "The approach is where instrument flying delivers its payoff and its highest workload. Flying it precisely, to the right minimums, is the heart of the rating.",
    mistake: "Descending below DA or MDA without the required visual references. The minimums are hard floors, not suggestions.",
    instructor: "Brief the approach before you fly it: the course, the altitudes, the minimums, and exactly what you will do at the missed approach point. No surprises in the soup.",
    safety: "Controlled flight into terrain on approach is a known killer. Honoring decision and minimum descent altitudes is non-negotiable.",
    terms: [
      ["Precision approach", "An approach with electronic vertical guidance, such as an ILS."],
      ["DA / MDA", "Decision Altitude (precision/APV) or Minimum Descent Altitude (nonprecision)."],
      ["Missed approach", "The published procedure flown when landing is not possible from the approach."]
    ],
    hook: "Brief it, fly it, and respect the minimums.",
    scenario: "You reach the decision altitude on an ILS and cannot see the runway environment. What is the correct action?",
    oral: "Distinguish a precision from a nonprecision approach and explain DA versus MDA.",
    practical: "Brief and fly a simulated ILS in a sim, executing the missed approach at DA without visual contact.",
    quiz: [
      { type: "mc", q: "An ILS approach is an example of a:", choices: ["Nonprecision approach", "Precision approach", "Visual approach", "Contact approach"], answer: 1, why: "An ILS provides both lateral and vertical electronic guidance, making it a precision approach." },
      { type: "tf", q: "You may descend below the MDA without the required visual references if you are close to the runway.", answer: false, why: "MDA is a hard floor; you may not descend below it without the required visual references." }
    ]
  },

  /* ===================== PRIVATE PILOT — HELICOPTER ====================== */
  "hp-intro": {
    title: "The Private Pilot — Helicopter certificate",
    pathway: "helicopter", cert: "Private Pilot — Helicopter", faa: "hfh", acs: "Helicopter ACS — Private, certification", time: 6,
    explain: [
      "A Private Pilot certificate with a rotorcraft category and helicopter class rating lets you act as pilot in command of a helicopter, carrying passengers, but not for compensation or hire. It is the foundation rotary-wing certificate that other helicopter ratings build on.",
      "Under 14 CFR 61.109(c), the airplane-style requirements are replaced with helicopter ones: a minimum of 40 hours total time including at least 20 hours of training from an instructor and 10 hours of solo, with specified cross-country, night, and test-preparation flights. You must be at least 17 and hold an appropriate medical certificate."
    ],
    why: "This is the entry point to flying helicopters as pilot in command. Everything in the helicopter world — commercial, instrument, instructor — starts here.",
    mistake: "Assuming airplane time transfers directly. Helicopter training is its own skill; prior airplane experience helps with knowledge but not with the hover.",
    instructor: "Expect the first several hours to be humbling. Hovering takes most people longer than anything they have learned before, and that is completely normal.",
    safety: "Helicopters are less forgiving of certain errors than airplanes. Sound habits built during private training carry directly into survival later.",
    terms: [
      ["Rotorcraft category", "The aircraft category that includes helicopters and gyroplanes."],
      ["Helicopter class", "The class rating within rotorcraft for helicopters."],
      ["PIC privileges", "Acting as pilot in command, here without compensation or hire."]
    ],
    hook: "Rotorcraft category, helicopter class — your rotary foundation.",
    scenario: "You hold a private certificate for airplanes and want to legally fly a helicopter with friends aboard. What must you add to your certificate first?",
    oral: "State the privileges of a private helicopter certificate and three requirements from 14 CFR 61.109(c).",
    practical: "Map out the flight-hour requirements for the private helicopter certificate and compare them to your current logbook.",
    quiz: [
      { type: "mc", q: "A private helicopter certificate allows you to:", choices: ["Fly helicopters for hire", "Fly helicopters as PIC, not for compensation", "Instruct in helicopters", "Fly only with another pilot"], answer: 1, why: "Private privileges allow acting as PIC carrying passengers, but not for compensation or hire." },
      { type: "tf", q: "Helicopter belongs to the rotorcraft category.", answer: true, why: "Rotorcraft is the category; helicopter is a class within it." }
    ]
  },

  "hp-maneuvers": {
    title: "Basic helicopter maneuvers",
    pathway: "helicopter", cert: "Private Pilot — Helicopter", faa: "hfh", acs: "Helicopter ACS — Hovering & traffic pattern", time: 7,
    explain: [
      "Private helicopter training builds from the hover outward. You learn to hold a stable hover, hover taxi at walking pace, perform a vertical takeoff to a hover, fly a traffic pattern, and make a normal approach back to a hover near the ground. Each maneuver layers the four controls together.",
      "Because the controls are interconnected, every maneuver is an exercise in coordination. Adding power changes torque and needs pedal; tilting the disc moves the aircraft and changes the picture. Smoothness and anticipation, not strength, produce good helicopter flying."
    ],
    why: "These core maneuvers are the building blocks of every helicopter flight and the backbone of the practical test.",
    mistake: "Over-controlling. New helicopter pilots make large, late inputs; the machine responds best to small, early, smooth corrections.",
    instructor: "Pick a reference point and fly the picture. We start you on one control at a time, then combine them as your scan and feel develop.",
    safety: "Low, slow maneuvering near the ground leaves little margin. Precise power and pedal management during takeoff and approach is a safety skill.",
    terms: [
      ["Hover taxi", "Moving at low groundspeed in a hover, a few feet above the surface."],
      ["Normal approach", "A stabilized descent to a hover at a constant angle and rate."],
      ["Traffic pattern", "The standard rectangular path flown around an airport or helipad."]
    ],
    hook: "Hover, taxi, takeoff, pattern, approach.",
    scenario: "During a normal approach the helicopter starts to settle and drift left. Which controls do you coordinate to correct rate and position?",
    oral: "Describe the sequence of basic helicopter maneuvers taught for the private certificate.",
    practical: "Observe a helicopter traffic pattern and identify each maneuver from takeoff to approach.",
    quiz: [
      { type: "mc", q: "Helicopter training typically begins by mastering the:", choices: ["Cross-country", "Hover", "Autorotation", "Night landing"], answer: 1, why: "The stable hover is the foundational skill from which other maneuvers are built." },
      { type: "tf", q: "Large, forceful control inputs are the key to smooth helicopter flying.", answer: false, why: "Helicopters respond best to small, smooth, anticipatory inputs, not force." }
    ]
  },

  "hp-autorotation": {
    title: "Autorotation and engine failure",
    pathway: "helicopter", cert: "Private Pilot — Helicopter", faa: "hfh", acs: "Helicopter ACS — Emergency operations", time: 7,
    explain: [
      "If the engine fails, a helicopter does not simply fall. The pilot lowers the collective so that upward airflow through the descending rotor keeps the blades spinning — this is autorotation, and it is how a helicopter glides without power. The spinning rotor stores energy that the pilot then uses to cushion the touchdown.",
      "Near the ground the pilot flares with aft cyclic to slow the descent and forward speed, then raises collective at the right moment to trade the rotor's stored energy for a soft landing. Entering autorotation promptly and managing rotor RPM are the keys to a survivable engine failure."
    ],
    why: "Autorotation is the helicopter pilot's fundamental survival skill. Practiced and understood, an engine failure becomes a manageable emergency, not a catastrophe.",
    mistake: "Hesitating. Delaying the collective reduction after a power loss lets rotor RPM decay, which can quickly make recovery impossible.",
    instructor: "Lower the collective first, before anything else, the instant you suspect a power loss. Rotor RPM is your lifeline, and you protect it immediately.",
    safety: "Rotor RPM that decays too far in a power-off descent may not be recoverable. Prompt entry and RPM management are non-negotiable.",
    terms: [
      ["Autorotation", "Power-off flight where airflow keeps the rotor spinning, allowing a controlled descent."],
      ["Flare", "Aft cyclic near the ground to slow descent and forward speed before touchdown."],
      ["Rotor RPM", "The spin rate of the main rotor, which must stay within limits to fly."]
    ],
    hook: "Power gone, collective down, protect the RPM.",
    scenario: "At altitude the engine quits. What is the very first control action that preserves your ability to land safely?",
    oral: "Explain how autorotation works and why prompt entry matters after a power loss.",
    practical: "Watch a practice autorotation and identify the entry, the steady descent, the flare, and the touchdown.",
    quiz: [
      { type: "mc", q: "Immediately upon a suspected engine failure, the helicopter pilot should:", choices: ["Raise the collective", "Lower the collective to enter autorotation", "Apply full pedal", "Increase throttle"], answer: 1, why: "Lowering the collective preserves rotor RPM and establishes autorotation." },
      { type: "tf", q: "A helicopter can descend safely without engine power through autorotation.", answer: true, why: "Airflow up through the descending rotor keeps it spinning, allowing a controlled power-off landing." }
    ]
  },

  "hp-performance": {
    title: "Performance: density altitude and ground effect",
    pathway: "helicopter", cert: "Private Pilot — Helicopter", faa: "hfh", acs: "Helicopter ACS — Performance & limitations", time: 6,
    explain: [
      "A helicopter's lifting ability falls as density altitude rises — hot, high, and humid conditions thin the air and reduce rotor performance, sometimes drastically. A load that hovers easily on a cool morning at sea level may be impossible on a hot afternoon in the mountains.",
      "Ground effect matters too. Hovering in ground effect (HIGE), close to the surface, requires less power than hovering out of ground effect (HOGE). The height-velocity diagram shows combinations of height and airspeed from which a safe autorotation may not be possible, and pilots plan takeoffs and approaches to avoid that region."
    ],
    why: "Most helicopter performance accidents trace to ignoring density altitude or operating in the avoid region of the height-velocity diagram. Planning prevents them.",
    mistake: "Assuming sea-level performance everywhere. Density altitude can quietly erase your power margin until a routine maneuver becomes impossible.",
    instructor: "Run the numbers for the day's conditions, every flight. The air does not care what the helicopter did yesterday at a cooler airport.",
    safety: "Operating in the shaded avoid area of the height-velocity diagram leaves no safe autorotation option if the engine fails. Plan profiles that stay clear of it.",
    terms: [
      ["Density altitude", "Pressure altitude corrected for temperature; high values reduce performance."],
      ["HIGE / HOGE", "Hover in ground effect versus out of ground effect; HOGE needs more power."],
      ["Height-velocity diagram", "A chart of height-airspeed combinations to avoid for safe autorotation."]
    ],
    hook: "Hot, high, humid — less lift to give.",
    scenario: "A helicopter that hovered easily at a cool coastal airport struggles to lift the same load at a hot mountain strip. Which factor most likely changed?",
    oral: "Explain how density altitude affects helicopter performance and what the height-velocity diagram shows.",
    practical: "Compute density altitude for a hot, high scenario and discuss its effect on hover performance.",
    quiz: [
      { type: "mc", q: "Hovering out of ground effect (HOGE) compared to in ground effect (HIGE) requires:", choices: ["Less power", "More power", "The same power", "No power"], answer: 1, why: "HOGE requires more power because the efficiency boost from ground effect is absent." },
      { type: "tf", q: "High density altitude reduces a helicopter's lifting performance.", answer: true, why: "Thinner air at high density altitude reduces rotor thrust and available performance." }
    ]
  },

  "hp-emergencies": {
    title: "Helicopter emergencies and aerodynamic hazards",
    pathway: "helicopter", cert: "Private Pilot — Helicopter", faa: "hfh", acs: "Helicopter ACS — Emergency & safety of flight", time: 7,
    explain: [
      "Helicopters have signature hazards every pilot must recognize. Settling with power (vortex ring state) can occur in a steep, slow, powered descent into the rotor's own downwash, producing a high sink rate that adding power only worsens. Loss of tail rotor effectiveness can cause an uncommanded yaw in certain wind and power conditions.",
      "On or near the ground, dynamic rollover can occur if the helicopter pivots about a skid or wheel beyond a critical angle, and in some rotor systems a low-G pushover can lead to mast bumping. Recovery techniques are specific to each, and recognizing the onset early is what keeps them survivable."
    ],
    why: "These hazards are unique to rotary-wing flight and have caused many accidents. Early recognition and the correct, practiced response are lifesaving.",
    mistake: "Adding power to arrest a high sink rate in vortex ring state. That deepens the condition; recovery requires gaining airspeed and reducing the descent into the disturbed air.",
    instructor: "Learn the entry conditions for each hazard so you can avoid them, and rehearse the recovery so it is reflexive. Avoidance beats recovery every time.",
    safety: "Settling with power, loss of tail rotor effectiveness, dynamic rollover, and low-G mast bumping each demand specific responses. Treat their entry conditions as boundaries to stay away from.",
    terms: [
      ["Vortex ring state", "Settling with power — a powered descent into the rotor's own downwash."],
      ["Loss of tail rotor effectiveness", "An uncommanded yaw in certain wind and power conditions."],
      ["Dynamic rollover", "A rollover about a ground contact point past a critical angle."]
    ],
    hook: "Know the entry, avoid the hazard, rehearse the out.",
    scenario: "In a steep, slow, powered descent the helicopter develops a high sink rate that worsens when you raise collective. Which condition is this, and what is the recovery direction?",
    oral: "Name three helicopter-specific hazards and describe the recognition and recovery for one.",
    practical: "Study the entry conditions for vortex ring state and dynamic rollover and list how to avoid each.",
    quiz: [
      { type: "mc", q: "Adding collective during settling with power (vortex ring state) typically:", choices: ["Stops the descent", "Worsens the high sink rate", "Has no effect", "Increases airspeed"], answer: 1, why: "More power feeds the vortex; recovery requires gaining airspeed and reducing the descent into disturbed air." },
      { type: "tf", q: "Dynamic rollover involves the helicopter pivoting about a point of ground contact.", answer: true, why: "Dynamic rollover occurs when the helicopter rotates about a skid or wheel beyond a critical angle." }
    ]
  },

  /* ================= PART 107 RECURRENT & ADVANCED — DRONE =============== */
  "da-recurrent": {
    title: "Staying current: Part 107 recurrent training",
    pathway: "drone", cert: "Remote Pilot — Recurrent & Advanced", faa: "suas", acs: "sUAS Study Guide — Currency", time: 5,
    explain: [
      "A Remote Pilot Certificate does not expire, but its privileges require staying current. Certificate holders must complete recurrent training to keep exercising Part 107 privileges, and the current recurrent training is a free online course rather than a proctored test at a testing center.",
      "The recurrent training refreshes the highest-risk areas, including airspace, weather, and operating rules, and is required on a recurring basis. Keeping a record of completion is part of being a responsible remote pilot in command."
    ],
    why: "Currency is what keeps your certificate's privileges valid. Letting recurrent training lapse means you may no longer legally operate under Part 107.",
    mistake: "Assuming a one-time pass is forever. The certificate is durable, but the privileges depend on staying current through recurrent training.",
    instructor: "Set a reminder the day you finish. Recurrent training is quick and free now, but it is easy to forget until it is overdue.",
    safety: "Recurrent training reinforces airspace and weather decision-making — the areas where lapses most often lead to unsafe drone operations.",
    terms: [
      ["Recurrent training", "Required refresher training to keep exercising Part 107 privileges."],
      ["Remote PIC", "The remote pilot in command responsible for the operation."],
      ["Currency", "Meeting the ongoing requirements that keep privileges valid."]
    ],
    hook: "The certificate lasts; the currency must be renewed.",
    scenario: "You passed your Part 107 knowledge test three years ago and have not done anything since. May you legally fly a commercial job today?",
    oral: "Explain the difference between certificate validity and currency, and how recurrent training is completed now.",
    practical: "Locate the current FAA recurrent training and note when your next completion would be due.",
    quiz: [
      { type: "mc", q: "To keep exercising Part 107 privileges, a remote pilot must:", choices: ["Retake the exam yearly at a center", "Complete recurrent training on a recurring basis", "Renew a plastic card", "Do nothing; it never expires"], answer: 1, why: "Privileges require completing recurrent training, currently a free online course." },
      { type: "tf", q: "The current Part 107 recurrent requirement is a free online training course.", answer: true, why: "Recurrent currency is now met through free online training rather than a proctored test." }
    ]
  },

  "da-waivers": {
    title: "Waivers and what they unlock",
    pathway: "drone", cert: "Remote Pilot — Recurrent & Advanced", faa: "suas", acs: "sUAS Study Guide — Waivers", time: 6,
    explain: [
      "Some Part 107 operating rules can be waived if you show the FAA you can fly safely under different conditions. A waiver is an approved deviation from a specific rule — for example, flying beyond visual line of sight, or over people in ways the standard rules do not otherwise permit.",
      "Not every rule is waivable, and a waiver requires a detailed safety case submitted in advance. Some operations that once required a waiver, such as routine night operations, are now allowed under the rules themselves with the proper lighting and training, which is why knowing the current regulation matters before you apply."
    ],
    why: "Waivers open advanced operations, but only with a credible safety plan. Understanding what is waivable and what is now standard saves wasted applications.",
    mistake: "Applying for a waiver for something already permitted, or assuming any rule can be waived. Check the current regulation first.",
    instructor: "Before you write a waiver request, confirm the operation is not already allowed under the current rules — the regulations have expanded.",
    safety: "Waivered operations push beyond the standard safety margins, so the FAA expects a thorough mitigation plan. The rigor exists because the risk is higher.",
    terms: [
      ["Waiver", "An approved deviation from a specific Part 107 operating rule."],
      ["BVLOS", "Beyond visual line of sight — an operation that generally requires a waiver."],
      ["Safety case", "The documented justification showing an operation can be conducted safely."]
    ],
    hook: "A waiver is permission to deviate, earned with a safety case.",
    scenario: "You want to fly a drone you cannot keep in sight the whole time. Is that a standard operation or one that generally needs a waiver?",
    oral: "Define a Part 107 waiver and give an example of an operation that requires one.",
    practical: "Review the list of waivable Part 107 sections and identify which apply to an operation you have in mind.",
    quiz: [
      { type: "mc", q: "A Part 107 waiver is:", choices: ["A pilot certificate", "An approved deviation from a specific rule", "A type of airspace", "A weather product"], answer: 1, why: "A waiver grants approval to deviate from a specific operating rule under stated conditions." },
      { type: "tf", q: "Routine night operations under Part 107 always require a waiver.", answer: false, why: "Night operations are now permitted under the rules with proper anti-collision lighting and training." }
    ]
  },

  "da-airspace-auth": {
    title: "Airspace authorizations in depth",
    pathway: "drone", cert: "Remote Pilot — Recurrent & Advanced", faa: "suas", acs: "sUAS Study Guide — Airspace authorization", time: 6,
    explain: [
      "Operating in controlled airspace requires authorization before you fly. The UAS Facility Maps show the maximum altitudes at which authorization may be granted in each grid around an airport, and many of these requests can be approved almost instantly through LAANC.",
      "Where a grid shows a zero-foot ceiling, or where you need to exceed the listed altitude, LAANC will not grant it automatically and you must request a manual authorization through the FAA's DroneZone, which takes time. Reading the facility maps before you plan a flight tells you which path you are on."
    ],
    why: "Knowing whether your spot allows instant authorization or needs a manual request prevents last-minute surprises and illegal flights.",
    mistake: "Expecting LAANC to approve any location. A zero-grid or an above-ceiling request needs a slower manual authorization, planned well ahead.",
    instructor: "Check the UAS Facility Map first. If the grid reads zero, plan for a manual authorization with lead time, not a quick tap at the field.",
    safety: "Authorization ceilings exist to keep drones clear of manned-aircraft operations near airports. Honoring them is core to airspace safety.",
    terms: [
      ["UAS Facility Map", "A grid map of maximum altitudes for which authorization may be granted."],
      ["LAANC", "A system providing near-instant airspace authorization in eligible areas."],
      ["DroneZone", "The FAA portal for manual authorization and waiver requests."]
    ],
    hook: "Check the grid: instant tap or manual request.",
    scenario: "The facility map grid over your site shows zero feet. Can you get a quick LAANC authorization, or do you need a different process?",
    oral: "Explain how UAS Facility Maps and LAANC work together and when manual authorization is required.",
    practical: "Look up the UAS Facility Map grid for a nearby airport and note its authorization ceiling.",
    quiz: [
      { type: "mc", q: "A UAS Facility Map grid showing 0 feet means:", choices: ["You may fly to 400 feet", "LAANC cannot auto-authorize; a manual request is needed", "Drones are always allowed there", "No authorization is required"], answer: 1, why: "A zero grid requires a manual authorization through DroneZone rather than instant LAANC approval." },
      { type: "tf", q: "Operating in controlled airspace requires authorization before the flight.", answer: true, why: "Controlled airspace operations require prior authorization, often via LAANC." }
    ]
  },

  "da-ops-people": {
    title: "Operations over people and moving vehicles",
    pathway: "drone", cert: "Remote Pilot — Recurrent & Advanced", faa: "suas", acs: "sUAS Study Guide — Operations over people", time: 6,
    explain: [
      "The standard rules restrict flying directly over people who are not part of your operation. A rule structure of operating categories defines when flight over people is allowed, based largely on the drone's weight and design and its potential to cause injury, with the smallest, lowest-risk drones facing the fewest restrictions.",
      "Heavier or higher-risk drones must meet specific injury-protection and design standards to qualify for operations over people, and some require manufacturer compliance documentation. Flight over moving vehicles is similarly limited. Knowing which category your aircraft meets tells you what you may legally do."
    ],
    why: "Flying over people is one of the most sensitive and regulated drone activities. Matching your aircraft to a category keeps a crowd-area flight legal and safe.",
    mistake: "Flying over a gathering because the drone is small, without confirming it actually meets a category that permits it.",
    instructor: "If people who are not part of your crew are below, stop and verify your category and conditions before you ever fly over them.",
    safety: "People on the ground are the parties most at risk from a drone failure. The category rules exist to limit injury if something goes wrong overhead.",
    terms: [
      ["Operating categories", "The rule structure defining when flight over people is permitted."],
      ["Means of compliance", "Manufacturer documentation showing a drone meets injury and design standards."],
      ["Over people", "Flight directly above persons not participating in the operation."]
    ],
    hook: "Match the category before you fly overhead.",
    scenario: "You want to film a crowd from directly above with a mid-size drone. What must you confirm about your aircraft before doing so legally?",
    oral: "Explain how the operating categories determine when flight over people is allowed.",
    practical: "Identify which over-people category your drone could meet and what documentation it would need.",
    quiz: [
      { type: "mc", q: "Whether a drone may fly over people is determined largely by:", choices: ["Its color", "Its weight, design, and injury potential", "The pilot's age", "The time of day"], answer: 1, why: "The operating categories are based on the drone's weight, design, and potential to cause injury." },
      { type: "tf", q: "Any small drone may always be flown directly over crowds.", answer: false, why: "Flight over people is governed by categories and conditions; small size alone is not blanket permission." }
    ]
  },

  "da-remoteid": {
    title: "Remote ID compliance",
    pathway: "drone", cert: "Remote Pilot — Recurrent & Advanced", faa: "suas", acs: "sUAS Study Guide — Remote ID", time: 5,
    explain: [
      "Remote ID is like a digital license plate for drones: it broadcasts identification and location information that others can receive. Most drones that require registration must meet Remote ID, either by being a standard Remote ID drone that broadcasts on its own, or by attaching a Remote ID broadcast module.",
      "A third path is to operate only within an FAA-Recognized Identification Area (FRIA), a defined location where drones without Remote ID may fly. Checking your drone's Remote ID status and method before a flight is now a standard part of compliance."
    ],
    why: "Remote ID is a current legal requirement for most operations. Knowing how your aircraft complies keeps routine flights on the right side of the rules.",
    mistake: "Assuming an older drone is automatically compliant. Verify whether it broadcasts standard Remote ID, needs a module, or must stay within a FRIA.",
    instructor: "Confirm your specific drone's Remote ID status before a job. Firmware and module setup differ between models and matter for compliance.",
    safety: "Remote ID supports airspace awareness and accountability, helping authorities and other operators understand who is flying nearby.",
    terms: [
      ["Remote ID", "Broadcast of a drone's identity and location, like a digital license plate."],
      ["Broadcast module", "An add-on device that provides Remote ID for a drone without it built in."],
      ["FRIA", "An FAA-Recognized Identification Area where drones without Remote ID may operate."]
    ],
    hook: "Built-in, module, or fly inside a FRIA.",
    scenario: "Your older drone does not broadcast Remote ID and you have no module. Where can you still legally fly it?",
    oral: "Describe the three ways to comply with Remote ID requirements.",
    practical: "Check whether your drone has standard Remote ID, needs a module, or would require a FRIA.",
    quiz: [
      { type: "mc", q: "Which is NOT a way to meet Remote ID requirements?", choices: ["Standard Remote ID drone", "Remote ID broadcast module", "Operating within a FRIA", "Flying only at night"], answer: 3, why: "Compliance is met by standard Remote ID, a broadcast module, or operating within a FRIA." },
      { type: "tf", q: "A Remote ID broadcast module can bring a drone without built-in Remote ID into compliance.", answer: true, why: "Attaching an approved broadcast module is one of the accepted compliance methods." }
    ]
  },

  /* ===================== COMMERCIAL PILOT — AIRPLANE ===================== */
  "cp-intro": {
    title: "The Commercial Pilot certificate",
    pathway: "airplane", cert: "Commercial Pilot — Airplane", faa: "phak", acs: "Commercial ACS — Certification & privileges", time: 7,
    explain: [
      "A Commercial Pilot certificate allows you to act as pilot in command of an aircraft for compensation or hire — the legal threshold between flying as a hobby and being paid to fly. It demands higher precision, deeper knowledge, and more experience than the private certificate.",
      "Holding the certificate is not the same as being able to run any paid operation. Most commercial work for the public is also governed by additional operating rules (such as 14 CFR Part 119, 135, or 121), and if you do not hold an instrument rating, the commercial certificate carries a limitation prohibiting carrying passengers for hire on cross-country flights over 50 nautical miles or at night."
    ],
    why: "The commercial certificate is the gateway to professional flying. Understanding exactly what it does and does not authorize keeps new commercial pilots out of legal trouble.",
    mistake: "Believing the certificate alone lets you fly any paying job. Carrying the public for hire usually requires operating under, or working for someone who holds, an air carrier or operator certificate.",
    instructor: "A commercial certificate means you can be paid to fly. It does not by itself mean you can advertise rides to the public — that is what the operating rules govern.",
    safety: "Professional flying raises the stakes: paying passengers, schedules, and pressure. The higher commercial standards exist because the consequences of error are higher.",
    terms: [
      ["Compensation or hire", "Being paid, directly or indirectly, to act as a pilot."],
      ["Operating rules", "Parts such as 119, 135, and 121 that govern commercial operations."],
      ["Instrument limitation", "Restriction on a commercial certificate held without an instrument rating."]
    ],
    hook: "Paid to fly — within higher standards and more rules.",
    scenario: "You earn a commercial certificate but hold no instrument rating. A friend offers to pay you to fly passengers 120 nautical miles at night. Why can you not legally do that flight?",
    oral: "State the privileges of a commercial certificate and the limitation that applies without an instrument rating.",
    practical: "List three paid flying activities and note which would require operating under an additional Part beyond your certificate.",
    quiz: [
      { type: "mc", q: "A Commercial Pilot certificate primarily authorizes a pilot to:", choices: ["Instruct students", "Fly for compensation or hire", "Fly only at night", "Operate airliners"], answer: 1, why: "The commercial certificate allows acting as PIC for compensation or hire." },
      { type: "tf", q: "Without an instrument rating, a commercial certificate limits carrying passengers for hire on cross-countries over 50 NM or at night.", answer: true, why: "This limitation is placed on a commercial certificate held without an instrument rating." }
    ]
  },

  "cp-eligibility": {
    title: "Commercial eligibility and aeronautical experience",
    pathway: "airplane", cert: "Commercial Pilot — Airplane", faa: "phak", acs: "Commercial ACS — Aeronautical experience", time: 7,
    explain: [
      "Under 14 CFR 61.129, the airplane commercial applicant must be at least 18 years old, be able to read, speak, write, and understand English, and hold at least a private pilot certificate. Training under Part 61 requires a minimum of 250 hours of total flight time.",
      "Within that time are specific requirements, including pilot-in-command time, cross-country experience, 10 hours of instrument training, and 10 hours of training in a complex, turbine-powered, or technically advanced airplane (TAA). Certificated training academies under Part 141 can reach the certificate with fewer total hours."
    ],
    why: "Knowing the experience requirements lets you build time efficiently toward the certificate instead of logging hours that do not count where you need them.",
    mistake: "Logging lots of hours but missing specific categories. The cross-country, instrument, and complex/TAA requirements are easy to overlook until the checkride looms.",
    instructor: "Map your logbook against 61.129 early. It is far cheaper to plan the required flights than to discover a missing requirement weeks before your test.",
    safety: "Experience requirements are not bureaucratic hoops; they ensure a commercial pilot has flown enough varied scenarios to handle the demands of paid operations.",
    terms: [
      ["Part 61", "The standard certification path with the 250-hour commercial minimum."],
      ["Part 141", "Approved-school path that can certificate pilots with fewer total hours."],
      ["TAA", "Technically advanced airplane, accepted toward the complex training requirement."]
    ],
    hook: "250 hours under Part 61 — with the right hours in the right places.",
    scenario: "You have 260 total hours but no time in a complex, turbine, or TAA airplane. Are you ready for the airplane commercial practical test under Part 61?",
    oral: "State the minimum age and total-time requirement for the airplane commercial certificate under Part 61.",
    practical: "Audit your logbook against the major 61.129 experience categories and list any gaps.",
    quiz: [
      { type: "mc", q: "The minimum total flight time for an airplane commercial certificate under Part 61 is:", choices: ["150 hours", "200 hours", "250 hours", "1,500 hours"], answer: 2, why: "Part 61 requires at least 250 hours of total time for the airplane commercial certificate." },
      { type: "tf", q: "Commercial training under Part 141 can require fewer total hours than Part 61.", answer: true, why: "Approved Part 141 schools may certificate commercial pilots with fewer total hours." }
    ]
  },

  "cp-maneuvers": {
    title: "Commercial flight maneuvers and standards",
    pathway: "airplane", cert: "Commercial Pilot — Airplane", faa: "afh", acs: "Commercial ACS — Performance maneuvers", time: 7,
    explain: [
      "The commercial certificate adds precision maneuvers that demand smooth, coordinated, and exact control. These include chandelles (a maximum-performance climbing turn), lazy eights, steep spirals, eights-on-pylons, steep turns, and the power-off 180-degree accuracy approach and landing.",
      "Eights-on-pylons introduce the idea of pivotal altitude, where your line of sight to a point on the ground stays fixed as you turn. Across all commercial maneuvers, the test tolerances are tighter than at the private level — the same maneuvers, flown to a professional standard."
    ],
    why: "These maneuvers build the fine aircraft control and energy management a professional pilot needs, and they are the core of the commercial practical test.",
    mistake: "Flying commercial maneuvers like private maneuvers. The standards are tighter, and sloppy coordination or altitude control that passed before will not pass now.",
    instructor: "Commercial maneuvers are about control finesse and planning. Fly the airplane smoothly and think two steps ahead of where it is.",
    safety: "The power-off 180 accuracy landing builds a real skill: judging a power-off glide to a precise touchdown, exactly what you need if the engine quits.",
    terms: [
      ["Chandelle", "A maximum-performance 180-degree climbing turn."],
      ["Pivotal altitude", "The altitude at which the line of sight to a ground point holds steady in a turn."],
      ["Power-off 180", "A precision approach and landing to a spot with the engine at idle."]
    ],
    hook: "Same sky, tighter tolerances, smoother hands.",
    scenario: "During eights-on-pylons the pylon appears to move ahead of your wingtip reference line. Does that indicate you are above or below pivotal altitude?",
    oral: "Name three commercial maneuvers and explain the concept of pivotal altitude.",
    practical: "Watch a power-off 180 demonstration and note how the pilot manages glide path to the touchdown point.",
    quiz: [
      { type: "mc", q: "Pivotal altitude is a concept used in which commercial maneuver?", choices: ["Chandelle", "Eights-on-pylons", "Steep turn", "Lazy eight"], answer: 1, why: "Eights-on-pylons are flown at pivotal altitude, where the sight line holds on the pylon." },
      { type: "tf", q: "Commercial test tolerances are the same as private test tolerances.", answer: false, why: "Commercial maneuvers are held to tighter tolerances than the private standard." }
    ]
  },

  "cp-complex": {
    title: "Complex, high-performance, and TAA systems",
    pathway: "airplane", cert: "Commercial Pilot — Airplane", faa: "afh", acs: "Commercial ACS — Systems & equipment", time: 6,
    explain: [
      "Commercial training often involves more capable airplanes. A complex airplane has retractable landing gear, flaps, and a controllable-pitch propeller. A high-performance airplane has an engine of more than 200 horsepower. A technically advanced airplane (TAA) has an integrated glass cockpit with a moving-map display and an autopilot.",
      "Each adds systems to manage. A controllable-pitch (constant-speed) propeller is set with two controls — throttle for power and propeller for RPM — using the manifold pressure and tachometer together. Retractable gear adds checklists and the discipline of confirming the gear is down and locked before every landing."
    ],
    why: "Paid flying frequently happens in more complex airplanes. Mastering their systems is both a certificate requirement and a real-world necessity.",
    mistake: "Forgetting the landing gear. Gear-up landings are a classic, expensive, and avoidable error tied to broken checklist discipline.",
    instructor: "Flow the checklist out loud on every approach: gear down, confirmed down and locked. The day you trust memory instead is the day you land on the belly.",
    safety: "Mismanaging a constant-speed propeller or forgetting retractable gear are leading causes of expensive incidents in complex airplanes. Procedures prevent both.",
    terms: [
      ["Complex airplane", "Retractable gear, flaps, and a controllable-pitch propeller."],
      ["High-performance", "An airplane with an engine of more than 200 horsepower."],
      ["Constant-speed propeller", "A propeller set by RPM, managed with manifold pressure and the tachometer."]
    ],
    hook: "Gear, prop, power — manage the extra systems.",
    scenario: "You are flying a complex airplane and turn final after a busy approach. What item must you positively confirm before landing?",
    oral: "Define complex, high-performance, and technically advanced airplanes and how each differs.",
    practical: "Study a constant-speed propeller diagram and explain how throttle and propeller controls work together.",
    quiz: [
      { type: "mc", q: "A high-performance airplane is defined by having an engine of:", choices: ["More than 150 horsepower", "More than 200 horsepower", "More than 300 horsepower", "Any turbine engine"], answer: 1, why: "A high-performance airplane has an engine of more than 200 horsepower." },
      { type: "tf", q: "A complex airplane has retractable gear, flaps, and a controllable-pitch propeller.", answer: true, why: "Those three features together define a complex airplane." }
    ]
  },

  "cp-regs": {
    title: "Commercial operations and operating rules",
    pathway: "airplane", cert: "Commercial Pilot — Airplane", faa: "phak", acs: "Commercial ACS — Regulations", time: 7,
    explain: [
      "A commercial certificate lets you be paid to fly, but the kind of operation determines which rules apply. Many paid activities, like certain aerial work, can be done under 14 CFR Part 91, while carrying the public for hire generally falls under air carrier or operator rules such as Part 135 (on-demand) or Part 121 (scheduled airline).",
      "A key concept is 'holding out' — offering air transportation to the public. Holding out usually requires operating under, or flying for a company that holds, the appropriate operating certificate. Knowing where your job fits keeps you on the legal side of a line the FAA takes seriously."
    ],
    why: "The most common way new commercial pilots get in trouble is performing public-carriage operations without the right operating certificate. The certificate is necessary but not sufficient.",
    mistake: "Assuming 'I have a commercial license' covers any paid flight. Public charter and on-demand passenger work require Part 135 or 121 authority, not just your certificate.",
    instructor: "Before you accept a paid job, ask which Part it falls under. If it involves holding out to the public, you need more than your certificate.",
    safety: "The operating rules add layers of safety oversight, maintenance, and duty limits precisely because paid public operations carry higher risk and responsibility.",
    terms: [
      ["Holding out", "Offering air transportation to the public for hire."],
      ["Part 135", "Rules for on-demand and commuter commercial operations."],
      ["Part 121", "Rules for scheduled airline operations."]
    ],
    hook: "The certificate lets you be paid; the Part defines how.",
    scenario: "You want to advertise sightseeing passenger flights to the general public for money. Does your commercial certificate alone make this legal?",
    oral: "Explain holding out and identify the operating rules that typically govern public passenger carriage.",
    practical: "List several commercial activities and label which operate under Part 91 versus Part 135 or 121.",
    quiz: [
      { type: "mc", q: "Carrying the public for hire on demand generally falls under:", choices: ["Part 61", "Part 91", "Part 135", "Part 107"], answer: 2, why: "On-demand carriage of the public for hire generally operates under Part 135." },
      { type: "tf", q: "A commercial certificate by itself authorizes holding out passenger flights to the public.", answer: false, why: "Holding out to the public typically requires operating under an air carrier or operator certificate." }
    ]
  },

  "cp-prof": {
    title: "Professionalism, ADM, and single-pilot resource management",
    pathway: "airplane", cert: "Commercial Pilot — Airplane", faa: "rmh", acs: "Commercial ACS — Risk management", time: 6,
    explain: [
      "Becoming a commercial pilot is a shift in mindset as much as skill. Paying passengers, schedules, and the pressure to complete a trip can quietly push a pilot toward poor decisions, so aeronautical decision-making and risk management move to the center of professional flying.",
      "Single-pilot resource management is the practice of using every resource available — automation, checklists, ATC, weather services, and your own discipline — to manage workload and avoid task saturation. The professional pilot manages risk deliberately rather than relying on luck or skill alone."
    ],
    why: "Most commercial accidents are decision accidents, not stick-and-rudder failures. Professional judgment is the skill that keeps the others from being tested.",
    mistake: "Letting external pressure win. 'I have to get them there' is the thought that precedes a large share of weather and fuel accidents.",
    instructor: "The mark of a professional is not flying through anything — it is the willingness to say no when the risk does not add up, even when it is inconvenient.",
    safety: "External pressures and self-induced get-there-itis are among the most dangerous hazards in commercial flying. Deliberate risk management is the countermeasure.",
    terms: [
      ["ADM", "Aeronautical decision-making — a structured approach to flight decisions."],
      ["SRM", "Single-pilot resource management — using all resources to manage workload."],
      ["Risk management", "Identifying and mitigating hazards before and during flight."]
    ],
    hook: "Professional means knowing when to say no.",
    scenario: "A client pressures you to depart into deteriorating weather you are not equipped for. What does professional risk management require of you?",
    oral: "Define single-pilot resource management and explain how external pressure affects decision-making.",
    practical: "Apply a risk-management checklist to a scenario flight and identify the pressures and mitigations.",
    quiz: [
      { type: "mc", q: "Single-pilot resource management is best described as:", choices: ["Flying without a checklist", "Using all available resources to manage workload and risk", "Always completing the mission", "Relying on autopilot only"], answer: 1, why: "SRM is the effective use of all resources to manage workload, situational awareness, and risk." },
      { type: "tf", q: "Most commercial accidents stem from decision-making, not basic flying skill.", answer: true, why: "Decision and risk-management errors account for a large share of accidents." }
    ]
  },

  /* ==================== COMMERCIAL PILOT — HELICOPTER ==================== */
  "ch-intro": {
    title: "The Commercial Pilot — Helicopter certificate",
    pathway: "helicopter", cert: "Commercial Pilot — Helicopter", faa: "hfh", acs: "Helicopter Commercial ACS — Certification", time: 7,
    explain: [
      "A Commercial Pilot certificate with a rotorcraft category and helicopter class rating lets you fly helicopters for compensation or hire. It is the credential behind most professional helicopter work, from tours and utility to news and emergency services support.",
      "Under 14 CFR 61.129(c), the helicopter applicant must be at least 18 and, training under Part 61, log a minimum of 150 hours of total flight time — notably fewer than the 250 hours required for the airplane commercial certificate. The required hours include specified pilot-in-command, cross-country, night, and instrument-aircraft-control training."
    ],
    why: "This certificate opens the professional helicopter world. Knowing its specific requirements, which differ from the airplane path, lets you plan training accurately.",
    mistake: "Assuming the airplane commercial numbers apply. The helicopter commercial total-time minimum under Part 61 is 150 hours, not 250.",
    instructor: "The helicopter commercial path has its own experience requirements. Build your hours against 61.129(c), not the airplane rule everyone quotes.",
    safety: "Commercial helicopter operations often involve low-level, confined, and high-workload environments. The training requirements prepare you for that demanding reality.",
    terms: [
      ["Rotorcraft category", "The category that includes helicopters and gyroplanes."],
      ["Compensation or hire", "Being paid, directly or indirectly, to act as a pilot."],
      ["150-hour minimum", "The Part 61 total-time minimum for the helicopter commercial certificate."]
    ],
    hook: "Paid to fly helicopters — 150 hours under Part 61.",
    scenario: "A friend says you need 250 hours for any commercial certificate. Why is that wrong for the helicopter rating?",
    oral: "State the minimum age and Part 61 total-time requirement for the commercial helicopter certificate.",
    practical: "Compare the helicopter and airplane commercial total-time requirements and note the difference.",
    quiz: [
      { type: "mc", q: "The Part 61 total-time minimum for a commercial helicopter certificate is:", choices: ["100 hours", "150 hours", "200 hours", "250 hours"], answer: 1, why: "Part 61 requires at least 150 hours of total time for the commercial helicopter certificate." },
      { type: "tf", q: "Commercial helicopter privileges include flying for compensation or hire.", answer: true, why: "The commercial certificate authorizes acting as PIC of a helicopter for compensation or hire." }
    ]
  },

  "ch-maneuvers": {
    title: "Commercial helicopter maneuvers",
    pathway: "helicopter", cert: "Commercial Pilot — Helicopter", faa: "hfh", acs: "Helicopter Commercial ACS — Maneuvers", time: 7,
    explain: [
      "Commercial helicopter training sharpens precision and adds demanding maneuvers. These include the 180-degree autorotation, the rapid deceleration (quick stop), running and maximum-performance takeoffs, and steep, precise approaches to confined areas and elevated surfaces.",
      "Confined area, pinnacle, and platform operations require careful reconnaissance, power planning, and escape routes. As with the airplane commercial certificate, the tolerances tighten — the same maneuvers as private training, now flown to a professional standard with less margin for error."
    ],
    why: "Professional helicopter work happens in tight, unforgiving places. These maneuvers build the control and planning that real utility and tour flying demand.",
    mistake: "Rushing the reconnaissance for confined and pinnacle areas. Skipping the high and low recon is how pilots discover wires, slopes, or wind they should have seen first.",
    instructor: "Plan the approach and always plan the escape. In confined-area work, knowing how you will get out is as important as how you will get in.",
    safety: "Confined-area and pinnacle operations concentrate hazards: obstacles, limited power margins, and wind. Disciplined reconnaissance and power planning are essential.",
    terms: [
      ["180-degree autorotation", "A power-off autorotation that includes a 180-degree turn to the landing area."],
      ["Quick stop", "A rapid deceleration maneuver from forward flight."],
      ["Confined area operation", "Approach and departure from an area surrounded by obstacles."]
    ],
    hook: "Recon, plan the approach, plan the escape.",
    scenario: "Before landing in a tight clearing ringed by trees, what reconnaissance should you perform to identify hazards and a power-safe path?",
    oral: "Name three commercial helicopter maneuvers and describe how you plan a confined-area approach.",
    practical: "Study a confined-area operation profile and list the reconnaissance and power-planning steps.",
    quiz: [
      { type: "mc", q: "Confined-area helicopter operations especially require:", choices: ["High airspeed", "Careful reconnaissance and power planning", "Maximum gross weight", "Tailwind approaches"], answer: 1, why: "Reconnaissance and power planning identify obstacles, wind, and escape routes in confined areas." },
      { type: "tf", q: "Commercial helicopter maneuvers are flown to tighter tolerances than private maneuvers.", answer: true, why: "The commercial standard demands greater precision than the private level." }
    ]
  },

  "ch-ops": {
    title: "Helicopter commercial operations",
    pathway: "helicopter", cert: "Commercial Pilot — Helicopter", faa: "hfh", acs: "Helicopter Commercial ACS — Operations", time: 6,
    explain: [
      "Commercial helicopter work spans tours, utility, agriculture, news, and emergency-services support, and like airplane operations, much of it is governed by additional rules. Carrying passengers for hire generally falls under Part 135, while specialized external-load work has its own rule set in 14 CFR Part 133.",
      "External-load operations — carrying loads on a longline or hook beneath the helicopter — require specific authorization, equipment, and technique, and are a distinct skill from passenger flying. Knowing which operating rule governs a job tells you what authorization and training you actually need."
    ],
    why: "Helicopters do specialized commercial work that airplanes cannot. Understanding the governing rules keeps those operations legal and properly authorized.",
    mistake: "Treating external-load or tour work as just flying. Each is governed by its own Part and demands specific authorization beyond the pilot certificate.",
    instructor: "Match the job to the rule first. Longline work lives under Part 133; passenger tours typically live under Part 135. The certificate alone does not cover either.",
    safety: "External-load and low-level utility operations are high-risk specialties. The dedicated rules and training requirements exist because of that elevated hazard.",
    terms: [
      ["Part 135", "Rules for on-demand commercial operations, including passenger carriage."],
      ["Part 133", "Rules for rotorcraft external-load operations."],
      ["External load", "A load carried on a hook or line beneath the helicopter."]
    ],
    hook: "Match the mission to its operating rule.",
    scenario: "You are offered a job carrying construction materials on a longline beneath a helicopter. Which Part governs that external-load operation?",
    oral: "Identify the operating rules that govern helicopter passenger tours and external-load work.",
    practical: "List several helicopter commercial jobs and note which Part each would operate under.",
    quiz: [
      { type: "mc", q: "Rotorcraft external-load operations are governed by:", choices: ["Part 107", "Part 121", "Part 133", "Part 61"], answer: 2, why: "14 CFR Part 133 governs rotorcraft external-load operations." },
      { type: "tf", q: "A commercial helicopter certificate alone authorizes any external-load job.", answer: false, why: "External-load work requires specific authorization and operating under Part 133, beyond the certificate." }
    ]
  },

  "ch-performance": {
    title: "Advanced helicopter performance and planning",
    pathway: "helicopter", cert: "Commercial Pilot — Helicopter", faa: "hfh", acs: "Helicopter Commercial ACS — Performance", time: 6,
    explain: [
      "Professional helicopter flying lives close to performance limits, so commercial pilots plan power and weight carefully. Density altitude, gross weight, and wind decide whether a takeoff, hover, or confined-area landing is possible, and a maximum-performance takeoff is used when obstacles demand the steepest safe climb.",
      "Pilots compare power required against power available for the conditions, use running or rolling takeoffs when a hover is not possible, and weigh center-of-gravity limits, especially with external loads or asymmetric loading. Good planning turns a marginal-power day into a safe, deliberate operation."
    ],
    why: "Helicopter performance accidents usually trace to operating beyond the power available for the day. Disciplined planning is the defense.",
    mistake: "Assuming you can hover out of any situation. On a hot, high, heavy day the power may simply not be there, and a confined departure can become a trap.",
    instructor: "Know your power required versus power available before you commit. If the numbers say you cannot hover out, you plan a different profile or you do not go.",
    safety: "Exceeding available power in a confined or high-density-altitude environment removes your options. Performance planning preserves a safe way out.",
    terms: [
      ["Power required vs available", "The comparison that determines what maneuvers are possible."],
      ["Maximum-performance takeoff", "A steep takeoff profile used to clear obstacles."],
      ["Running takeoff", "A takeoff with forward ground movement when a hover is not possible."]
    ],
    hook: "Power required versus available — know it before you commit.",
    scenario: "On a hot, high day at gross weight, your power check shows you cannot hover out of ground effect. How should that change your departure plan?",
    oral: "Explain power required versus power available and when a running takeoff is used.",
    practical: "Work a performance scenario comparing power required and available for a hot, high, heavy condition.",
    quiz: [
      { type: "mc", q: "A running takeoff is used when:", choices: ["The helicopter is light", "A hover is not possible due to available power", "The wind is calm", "The pilot prefers it"], answer: 1, why: "A running takeoff is used when power is insufficient for a stationary hover takeoff." },
      { type: "tf", q: "High density altitude and high weight reduce the power available for a helicopter.", answer: true, why: "Hot, high, and heavy conditions reduce performance and the power margin." }
    ]
  },

  "ch-safety": {
    title: "Professional judgment in commercial helicopter work",
    pathway: "helicopter", cert: "Commercial Pilot — Helicopter", faa: "rmh", acs: "Helicopter Commercial ACS — Risk management", time: 6,
    explain: [
      "Commercial helicopter operations concentrate risk: low altitudes, obstacles, wires, demanding clients, and pressure to complete the mission. Aeronautical decision-making and risk management are therefore central, not optional, to professional rotary-wing flying.",
      "The professional helicopter pilot manages workload deliberately, respects the aircraft's limits, and is willing to decline or delay a flight when the risk does not justify it. Wire strikes, dynamic rollover, and power-limited operations are repeatedly cited hazards, and disciplined judgment is what keeps them from being encountered."
    ],
    why: "The skills that keep commercial helicopter pilots alive are as much about judgment as control. The environment punishes complacency quickly.",
    mistake: "Letting the mission override the limits. 'The client is waiting' and 'just one more load' are the thoughts that precede many helicopter accidents.",
    instructor: "Your best tool is the willingness to say no. In this work, declining a flight is not failure — it is the professional decision that keeps you flying for years.",
    safety: "Wire strikes and operating beyond power limits are among the most repeated causes of helicopter accidents. Deliberate risk management directly addresses both.",
    terms: [
      ["ADM", "Aeronautical decision-making applied to the rotary-wing environment."],
      ["Wire strike", "Collision with power lines or cables, a leading low-level hazard."],
      ["Mission pressure", "The push to complete a flight despite rising risk."]
    ],
    hook: "Respect the limits; declining is professional.",
    scenario: "A client pushes for one more low-level load as light fades and wind rises near wires. What does professional judgment require?",
    oral: "Identify two repeated commercial helicopter hazards and explain how risk management addresses them.",
    practical: "Review a low-level operation scenario and list the hazards and the decisions that mitigate them.",
    quiz: [
      { type: "mc", q: "A leading hazard specific to low-level helicopter operations is:", choices: ["High-altitude hypoxia", "Wire strikes", "Jet upset", "Runway incursion"], answer: 1, why: "Wire strikes are a repeatedly cited hazard in low-level helicopter work." },
      { type: "tf", q: "Declining a flight when risk is too high is a sign of professional judgment.", answer: true, why: "A willingness to decline or delay when risk is unjustified is core to professional decision-making." }
    ]
  },

  /* ================= FLIGHT INSTRUCTOR — CFI / CFII / MEI / GI =========== */
  "cfi-intro": {
    title: "The Flight Instructor certificate",
    pathway: "airplane", cert: "Flight Instructor (CFI)", faa: "aih", acs: "CFI — Certification & privileges", time: 7,
    explain: [
      "A Certificated Flight Instructor (CFI) is authorized to provide flight and ground training and to endorse students for solo, knowledge tests, and practical tests. It is both a teaching credential and a major step in a pilot's own mastery — you cannot teach what you do not deeply understand.",
      "Under 14 CFR Part 61, the applicant must hold a commercial pilot or ATP certificate with the appropriate ratings (and, for an airplane CFI, an instrument rating), pass the Fundamentals of Instructing and flight instructor knowledge tests, receive spin training and an endorsement for single-engine airplane instruction, and pass a practical test focused on the ability to teach."
    ],
    why: "The CFI is how aviation knowledge is passed on, and how most pilots build the experience toward an airline or professional career. It carries real authority and real responsibility.",
    mistake: "Thinking being a good pilot is enough. The CFI practical test evaluates your ability to teach — to explain, diagnose, and correct — which is a separate skill from flying well.",
    instructor: "Teaching forces you to truly know your material. The first time you instruct a maneuver, you discover every gap in your own understanding.",
    safety: "Instructors set the safety habits of every pilot they train. A CFI's discipline, or lack of it, propagates into the next generation of pilots.",
    terms: [
      ["CFI", "Certificated Flight Instructor, authorized to train and endorse pilots."],
      ["Fundamentals of Instructing", "The knowledge area covering how people learn and are taught (FOI)."],
      ["Endorsement authority", "A CFI's ability to sign off solo, tests, and privileges."]
    ],
    hook: "To teach it, you must truly know it.",
    scenario: "You are an excellent commercial pilot but have never formally taught. Why is that not, by itself, enough to pass the CFI practical test?",
    oral: "State the certificate prerequisites for a CFI and name two tests required to earn it.",
    practical: "Pick a maneuver you know well and outline how you would teach it to a beginner, step by step.",
    quiz: [
      { type: "mc", q: "To become a CFI, a pilot must first hold at least a:", choices: ["Private certificate", "Sport certificate", "Commercial or ATP certificate", "Student certificate"], answer: 2, why: "A commercial or ATP certificate with appropriate ratings is required to earn a CFI." },
      { type: "tf", q: "The CFI practical test mainly evaluates the applicant's ability to teach.", answer: true, why: "The CFI test focuses on instructional ability, not just flying skill." }
    ]
  },

  "cfi-foi": {
    title: "Fundamentals of Instructing",
    pathway: "airplane", cert: "Flight Instructor (CFI)", faa: "aih", acs: "CFI — Fundamentals of instructing", time: 7,
    explain: [
      "Before teaching flying, an instructor learns how people learn. The Fundamentals of Instructing cover the learning process, the laws of learning, the levels of learning from rote to correlation, human behavior and motivation, and how to communicate and manage a student's progress.",
      "Effective instruction moves a student from simply repeating facts (rote) toward understanding, application, and finally correlation — connecting knowledge across situations. Instructors also manage barriers to learning, defense mechanisms, and motivation, because a frustrated or overloaded student does not learn well no matter how good the information is."
    ],
    why: "The best pilot in the world cannot create good pilots without understanding how learning works. The FOI is the foundation of everything a CFI does.",
    mistake: "Teaching by lecturing facts and assuming understanding. A student parroting a definition has reached rote, not the correlation level needed to fly safely.",
    instructor: "Aim for correlation, not recitation. A student who can apply a concept to a new situation has actually learned it; one who can only repeat it has not.",
    safety: "A student pushed past their saturation point stops learning and starts making errors. Recognizing overload protects both learning and safety.",
    terms: [
      ["Laws of learning", "Principles such as readiness, exercise, effect, primacy, intensity, and recency."],
      ["Levels of learning", "Rote, understanding, application, and correlation."],
      ["Correlation", "The highest level, connecting and applying knowledge across situations."]
    ],
    hook: "Rote, understanding, application, correlation.",
    scenario: "A student can recite the definition of a stall perfectly but cannot recognize one developing in flight. Which level of learning have they actually reached?",
    oral: "List the levels of learning and explain why correlation is the goal of training.",
    practical: "Take one aviation concept and describe what mastery looks like at each of the four levels of learning.",
    quiz: [
      { type: "mc", q: "The highest level of learning, applying knowledge across situations, is:", choices: ["Rote", "Understanding", "Application", "Correlation"], answer: 3, why: "Correlation is the highest level, connecting and applying knowledge to new situations." },
      { type: "tf", q: "A student who can only recite a fact has reached the correlation level.", answer: false, why: "Reciting a fact is the rote level; correlation requires applying knowledge across situations." }
    ]
  },

  "cfi-teaching": {
    title: "The teaching process and instructor responsibilities",
    pathway: "airplane", cert: "Flight Instructor (CFI)", faa: "aih", acs: "CFI — Teaching & professional development", time: 7,
    explain: [
      "Instructors deliver training through a structured process: preparation and lesson planning, presentation (often by the telling-and-doing or demonstration-performance method), student practice, and evaluation with constructive critique. Good lesson plans define objectives, content, and completion standards.",
      "A CFI also carries professional and legal responsibilities: making accurate logbook endorsements, keeping required records, evaluating students honestly, and modeling safe, lawful behavior. An endorsement is a legal statement that a student is prepared, so instructors give them deliberately and only when the standard is truly met."
    ],
    why: "Structure and integrity are what separate effective, responsible instruction from random demonstration. They also keep the instructor and student legally protected.",
    mistake: "Giving endorsements as a courtesy or under pressure. An endorsement is a legal certification of readiness, not a favor, and a premature one can endanger a student.",
    instructor: "Endorse only what you have verified. Your signature says this person is ready, and you are professionally and legally standing behind that statement.",
    safety: "Honest evaluation and disciplined endorsements keep unprepared pilots from being turned loose. The integrity of the endorsement protects everyone downstream.",
    terms: [
      ["Demonstration-performance", "A method where the instructor shows, then the student performs."],
      ["Lesson plan", "An organized outline of objectives, content, and completion standards."],
      ["Endorsement", "A signed, dated logbook entry certifying a student meets a requirement."]
    ],
    hook: "Plan it, show it, let them do it, evaluate honestly.",
    scenario: "A student asks you to endorse them for a checkride before they consistently meet the standards. What is the professional and legal answer?",
    oral: "Describe the demonstration-performance teaching method and the responsibility carried by an endorsement.",
    practical: "Write a simple lesson plan for one maneuver, including objective, content, and completion standards.",
    quiz: [
      { type: "mc", q: "An instructor endorsement is best understood as:", choices: ["A courtesy to the student", "A legal certification that a requirement is met", "An optional note", "A scheduling tool"], answer: 1, why: "An endorsement is a signed legal statement that the student meets the relevant standard." },
      { type: "tf", q: "Instructors should give checkride endorsements on request, before standards are consistently met.", answer: false, why: "Endorsements certify readiness and must only be given when the standard is genuinely met." }
    ]
  },

  "cfi-addons": {
    title: "Added instructor ratings: CFII and MEI",
    pathway: "airplane", cert: "Flight Instructor (CFI)", faa: "aih", acs: "CFII / MEI — Added ratings", time: 6,
    explain: [
      "A CFI can add instructor ratings to teach more. A CFII (instrument flight instructor) is authorized to provide instrument training and endorsements; an MEI (multi-engine instructor) is authorized to teach in multi-engine airplanes. Each is added to the existing flight instructor certificate.",
      "These add-ons generally require holding the corresponding pilot rating, passing the relevant instructor knowledge and practical tests, and demonstrating the ability to teach in that area. They expand both an instructor's earning potential and the breadth of training they can responsibly provide."
    ],
    why: "Instrument and multi-engine instruction are in high demand. Adding these ratings broadens what a CFI can teach and accelerates the path toward professional flying.",
    mistake: "Trying to teach beyond your instructor ratings. A CFI without a CFII cannot provide instrument training toward the rating, and a CFI without an MEI cannot instruct in multi-engine airplanes.",
    instructor: "Teach only within your instructor authorizations. Adding CFII and MEI is how you responsibly expand what you are qualified to instruct.",
    safety: "Instrument and multi-engine flying have their own failure modes. Dedicated instructor ratings ensure the teacher has demonstrated competence to teach those high-stakes areas.",
    terms: [
      ["CFII", "Instrument flight instructor, authorized to teach instrument flying."],
      ["MEI", "Multi-engine instructor, authorized to teach in multi-engine airplanes."],
      ["Added rating", "An instructor authorization added to an existing CFI certificate."]
    ],
    hook: "CFII teaches the clouds; MEI teaches two engines.",
    scenario: "You hold a basic CFI but not a CFII. May you provide a student the instrument training required for an instrument rating?",
    oral: "Explain what a CFII and an MEI each authorize an instructor to teach.",
    practical: "Identify which added instructor rating you would pursue first and what it would let you teach.",
    quiz: [
      { type: "mc", q: "A CFII is authorized to provide:", choices: ["Multi-engine training", "Instrument training", "Seaplane training", "Tailwheel endorsements only"], answer: 1, why: "A CFII (instrument flight instructor) is authorized to teach instrument flying." },
      { type: "tf", q: "A basic CFI without an MEI may instruct in multi-engine airplanes.", answer: false, why: "Multi-engine instruction requires an MEI rating added to the flight instructor certificate." }
    ]
  },

  "cfi-ground": {
    title: "Ground Instructor certificates",
    pathway: "airplane", cert: "Ground Instructor (BGI / AGI / IGI)", faa: "aih", acs: "Ground Instructor — Certification", time: 6,
    explain: [
      "Not all instruction happens in the air. Ground Instructor certificates authorize a person to provide ground training, and they come in three kinds: Basic (BGI), Advanced (AGI), and Instrument (IGI). Unlike flight instructor certificates, ground instructor certificates require no flight test.",
      "Under 14 CFR Part 61, a ground instructor applicant must be at least 18, be able to read, speak, write, and understand English, and pass the required knowledge tests, including the Fundamentals of Instructing. Ground instructors can teach the knowledge portions of training and provide certain endorsements within their authorizations."
    ],
    why: "Ground instructor certificates let knowledgeable people teach aviation theory and endorse students for knowledge tests, supporting training without requiring a flight instructor certificate.",
    mistake: "Confusing ground and flight instructor privileges. A ground instructor teaches knowledge areas and gives certain endorsements, but cannot provide flight training.",
    instructor: "A ground instructor certificate is a real, respected credential for teaching the knowledge side. It is also an accessible entry into instructing for those strong on theory.",
    safety: "Solid ground instruction builds the knowledge foundation that keeps pilots safe long before they reach the airplane. Strong theory prevents in-flight surprises.",
    terms: [
      ["BGI / AGI", "Basic and Advanced Ground Instructor certificates for ground training."],
      ["IGI", "Instrument Ground Instructor, for instrument knowledge instruction."],
      ["No flight test", "Ground instructor certificates are earned by knowledge tests, without a practical flight test."]
    ],
    hook: "Teach the knowledge side — no flight test required.",
    scenario: "Someone strong in aviation theory but not a pilot wants to teach ground school and endorse students for the knowledge test. Which certificate fits?",
    oral: "Name the three ground instructor certificates and explain how they differ from a CFI.",
    practical: "Compare the requirements for a ground instructor certificate and a flight instructor certificate.",
    quiz: [
      { type: "mc", q: "Which is true of ground instructor certificates?", choices: ["They require a flight test", "They require no flight test", "They authorize flight training", "They require an ATP"], answer: 1, why: "Ground instructor certificates are earned through knowledge tests and require no flight test." },
      { type: "tf", q: "There are three ground instructor certificates: Basic, Advanced, and Instrument.", answer: true, why: "The ground instructor certificates are BGI, AGI, and IGI." }
    ]
  },

  /* ===================== AIRLINE TRANSPORT PILOT (ATP) ==================== */
  "atp-intro": {
    title: "The Airline Transport Pilot certificate",
    pathway: "airplane", cert: "Airline Transport Pilot", faa: "phak", acs: "ATP ACS — Certification & privileges", time: 7,
    explain: [
      "The Airline Transport Pilot (ATP) certificate is the highest level of pilot certification. It is required to act as pilot in command in scheduled airline operations under 14 CFR Part 121, and current rules also require it for second in command at those airlines. It represents the professional pinnacle of airmanship and judgment.",
      "An ATP applicant must already hold a commercial pilot certificate with an instrument rating, or a military equivalent. The certificate is built on substantial experience and a demanding knowledge and practical standard, because it qualifies a pilot to operate the largest, fastest, and most consequential aircraft carrying the public."
    ],
    why: "The ATP is the gateway to an airline career and the benchmark of professional flying. Knowing what it requires lets you plan a multi-year path with clear milestones.",
    mistake: "Treating the ATP as just another rating. It is a separate certificate with its own experience, training-program, and standards requirements that take years to meet.",
    instructor: "The ATP is earned over time, not in a season. Everything from your first solo onward is building toward the experience and judgment it certifies.",
    safety: "ATP standards exist because airline operations carry hundreds of lives. The high bar for experience and precision is a direct safety investment.",
    terms: [
      ["ATP", "Airline Transport Pilot, the highest pilot certificate."],
      ["Part 121", "Rules for scheduled airline operations requiring ATP-level crews."],
      ["Prerequisite", "A commercial certificate with an instrument rating, or military equivalent."]
    ],
    hook: "The top certificate, for the highest-stakes flying.",
    scenario: "You want to fly as captain for a scheduled passenger airline. Which pilot certificate is required to hold that seat?",
    oral: "State what the ATP certificate authorizes and the certificate a pilot must already hold to pursue it.",
    practical: "Sketch a timeline from private certificate to ATP, marking the major certificates and ratings along the way.",
    quiz: [
      { type: "mc", q: "The Airline Transport Pilot certificate is:", choices: ["A private add-on", "The highest level of pilot certification", "A type of medical", "A ground rating"], answer: 1, why: "The ATP is the highest level of pilot certification." },
      { type: "tf", q: "An ATP applicant must already hold a commercial certificate with an instrument rating, or a military equivalent.", answer: true, why: "The commercial certificate with instrument rating is a prerequisite for the ATP." }
    ]
  },

  "atp-eligibility": {
    title: "ATP eligibility and the restricted ATP",
    pathway: "airplane", cert: "Airline Transport Pilot", faa: "phak", acs: "ATP ACS — Eligibility", time: 7,
    explain: [
      "For an unrestricted ATP certificate, an applicant must be at least 23 years old and have at least 1,500 hours of total flight time as a pilot, meeting the detailed experience requirements of 14 CFR 61.159. This is the standard path to the full certificate.",
      "A restricted privileges ATP (R-ATP) allows qualified pilots to serve as airline second in command at age 21 with fewer hours: generally 1,250 hours with a qualifying associate degree, 1,000 hours with a qualifying bachelor degree, or 750 hours for certain military-trained pilots. The reduced minimums recognize structured, approved training backgrounds."
    ],
    why: "The age and hour thresholds shape every airline career timeline. Knowing the restricted-ATP options can shorten the path for pilots with the right training background.",
    mistake: "Assuming everyone needs 1,500 hours at 23. The restricted ATP lets qualifying degree or military pilots start at 21 with fewer hours.",
    instructor: "If a structured degree or military path fits you, the restricted ATP can get you into an airline seat sooner. Confirm the exact hours your background qualifies for.",
    safety: "The 1,500-hour rule and the ATP itself grew out of accident lessons. The experience requirements are deliberate safety thresholds, not arbitrary numbers.",
    terms: [
      ["Unrestricted ATP", "Full ATP at age 23 with at least 1,500 hours total time."],
      ["Restricted ATP (R-ATP)", "Reduced-hour ATP at age 21 for qualifying degree or military pilots."],
      ["1,500-hour rule", "The standard total-time requirement for the unrestricted ATP."]
    ],
    hook: "1,500 hours at 23 — fewer, at 21, with the right background.",
    scenario: "A pilot with a qualifying bachelor degree in aviation wants the earliest airline first-officer seat possible. Roughly what age and hour threshold might the restricted ATP allow?",
    oral: "State the age and total-time requirement for the unrestricted ATP, and explain what the restricted ATP changes.",
    practical: "Look up the restricted-ATP hour reductions and identify which, if any, your background would qualify for.",
    quiz: [
      { type: "mc", q: "The unrestricted ATP requires a minimum total flight time of:", choices: ["1,000 hours", "1,200 hours", "1,500 hours", "2,000 hours"], answer: 2, why: "The unrestricted ATP requires at least 1,500 hours of total time under 61.159." },
      { type: "tf", q: "A restricted ATP can allow qualifying pilots to serve as airline SIC at age 21 with fewer than 1,500 hours.", answer: true, why: "The R-ATP permits age 21 with reduced hours for qualifying degree or military pilots." }
    ]
  },

  "atp-experience": {
    title: "The ATP aeronautical experience breakdown",
    pathway: "airplane", cert: "Airline Transport Pilot", faa: "phak", acs: "ATP ACS — Aeronautical experience", time: 6,
    explain: [
      "The 1,500 hours for the unrestricted airplane ATP are not just any flight time. Under 14 CFR 61.159, the total must include at least 500 hours of cross-country flight time, 100 hours of night flight time, 75 hours of instrument flight time, and 250 hours as pilot in command.",
      "These categories ensure an ATP has flown extensively in the conditions airline operations demand: long distances, at night, in instrument conditions, and in command. Tracking your logbook against each category is essential, because a pilot can reach 1,500 total hours while still missing one of the required components."
    ],
    why: "Reaching the airline minimums means hitting specific sub-requirements, not just a total. Pilots who track them avoid discovering a shortfall right before applying.",
    mistake: "Watching only the total-time number. Falling short on night or instrument time can stall an otherwise ready ATP application.",
    instructor: "Log with the ATP categories in mind from early on. It is far easier to seek out night and instrument time gradually than to scramble for it near 1,500 hours.",
    safety: "Each experience category maps to a real airline demand. The instrument and night minimums ensure a new ATP has faced those conditions before carrying passengers in them.",
    terms: [
      ["Cross-country time", "Flight time to other airports; 500 hours required for the ATP."],
      ["Instrument time", "Time controlling the aircraft by reference to instruments; 75 hours required."],
      ["PIC time", "Pilot-in-command time; 250 hours required for the ATP."]
    ],
    hook: "1,500 total — with 500 XC, 100 night, 75 instrument, 250 PIC.",
    scenario: "You have logged 1,520 total hours but only 60 hours of night time. Do you meet the unrestricted ATP experience requirements yet?",
    oral: "List the major aeronautical experience components within the 1,500-hour ATP requirement.",
    practical: "Total your logbook in each ATP experience category and compare against the minimums.",
    quiz: [
      { type: "mc", q: "The ATP requires a minimum of how many hours of cross-country flight time?", choices: ["100 hours", "250 hours", "500 hours", "1,000 hours"], answer: 2, why: "The ATP requires at least 500 hours of cross-country flight time." },
      { type: "tf", q: "Reaching 1,500 total hours guarantees you meet every ATP experience sub-requirement.", answer: false, why: "You can reach 1,500 total hours while still missing a category such as night or instrument time." }
    ]
  },

  "atp-ctp": {
    title: "The ATP Certification Training Program",
    pathway: "airplane", cert: "Airline Transport Pilot", faa: "phak", acs: "ATP ACS — Training requirements", time: 6,
    explain: [
      "Before taking the ATP airplane multiengine knowledge test, a pilot must complete the ATP Certification Training Program (ATP-CTP). It is a structured course of academic instruction and flight-simulator training covering high-altitude operations, automation, adverse weather, and crew leadership.",
      "The ATP-CTP was added to certification after accident investigations highlighted gaps in airline-pilot preparation, including stall recognition and recovery and high-altitude aerodynamics. It must be completed at an authorized provider before the knowledge test, which in turn precedes the practical test."
    ],
    why: "The ATP-CTP is a mandatory gate on the path to the certificate. Knowing it comes before the knowledge test keeps your training sequence on track.",
    mistake: "Trying to take the ATP knowledge test without the ATP-CTP. The course is a prerequisite, and skipping it simply is not an option.",
    instructor: "Plan the ATP-CTP into your timeline. It is required before you can even sit the ATP written, and it teaches the high-altitude and automation realities of airline flying.",
    safety: "The ATP-CTP exists because of hard lessons about stall recovery and high-altitude operations. Its content is safety distilled from real accidents.",
    terms: [
      ["ATP-CTP", "ATP Certification Training Program, required before the ATP knowledge test."],
      ["High-altitude operations", "Flight in the thin-air, high-speed regime of airline cruise."],
      ["Authorized provider", "An approved organization that delivers the ATP-CTP."]
    ],
    hook: "Course first, then the written, then the checkride.",
    scenario: "You schedule your ATP knowledge test but have not taken any structured airline-transition course. What required step is missing first?",
    oral: "Explain what the ATP-CTP is and where it falls in the ATP certification sequence.",
    practical: "Outline the ATP path order: training program, knowledge test, and practical test.",
    quiz: [
      { type: "mc", q: "The ATP-CTP must be completed before:", choices: ["The first solo", "The ATP knowledge test", "Earning a private certificate", "A medical exam"], answer: 1, why: "The ATP-CTP is a prerequisite to taking the ATP airplane multiengine knowledge test." },
      { type: "tf", q: "The ATP-CTP includes flight-simulator training on high-altitude operations and automation.", answer: true, why: "The program combines academics with simulator training on those airline-relevant areas." }
    ]
  },

  "atp-type": {
    title: "Type ratings and crew operations",
    pathway: "airplane", cert: "Airline Transport Pilot", faa: "phak", acs: "ATP ACS — Type ratings & crew", time: 6,
    explain: [
      "Large and turbojet aircraft require a type rating — a specific authorization to act as pilot in command of that exact aircraft type. Under 14 CFR 61.31, a type rating is required for aircraft over 12,500 pounds maximum takeoff weight and for turbojet-powered aircraft, among others. ATP candidates often earn a type rating at the same time as the certificate.",
      "Airline flying is also crew flying. Two pilots operate as a team, dividing duties as pilot flying and pilot monitoring, and using crew resource management to share workload, cross-check decisions, and catch errors. The shift from single-pilot to crew operations is a core part of becoming an airline pilot."
    ],
    why: "Type ratings and crew coordination define how the largest aircraft are flown. Understanding both prepares a pilot for the airline cockpit environment.",
    mistake: "Thinking single-pilot habits transfer unchanged. Crew operations require communication, callouts, and explicit task-sharing that solo flying never demanded.",
    instructor: "In a crew, the quiet, capable single-pilot mindset must become a communicating, cross-checking team member. That transition is as important as the type rating itself.",
    safety: "Crew resource management was developed because well-functioning crews catch errors that individuals miss. Good cockpit teamwork is a proven accident preventer.",
    terms: [
      ["Type rating", "Authorization to act as PIC of a specific aircraft type."],
      ["Crew resource management", "Using all crew and resources to manage workload and catch errors."],
      ["Pilot flying / monitoring", "The division of duties between the two pilots of a crew."]
    ],
    hook: "Right type, right team, shared workload.",
    scenario: "You are hired to fly a turbojet airliner well over 12,500 pounds. Beyond your ATP, what specific authorization must you hold for that aircraft?",
    oral: "Explain when a type rating is required and describe the roles of pilot flying and pilot monitoring.",
    practical: "Identify two aircraft characteristics that trigger a type-rating requirement under 61.31.",
    quiz: [
      { type: "mc", q: "A type rating is required for aircraft that are:", choices: ["Over 12,500 pounds or turbojet-powered", "Any twin-engine airplane", "Any retractable-gear airplane", "Any aircraft flown at night"], answer: 0, why: "Aircraft over 12,500 pounds MTOW and turbojet-powered aircraft require a type rating." },
      { type: "tf", q: "Crew resource management is about using all available crew and resources to manage workload and catch errors.", answer: true, why: "CRM coordinates the crew and resources to improve safety and error-catching." }
    ]
  },

  "atp-pro": {
    title: "Airline operations and professional standards",
    pathway: "airplane", cert: "Airline Transport Pilot", faa: "phak", acs: "ATP ACS — Professional operations", time: 6,
    explain: [
      "Airline operations run on standardization and discipline. Pilots follow standard operating procedures, sterile-cockpit rules during critical phases, and structured checklists so that any qualified crew can operate together safely and predictably. The ATP standard reflects this culture of precision and consistency.",
      "Professionalism at this level means rigorous adherence to procedures, honest self-assessment, continuous training, and a safety-first mindset that resists schedule pressure. The ATP is not just a skill threshold but the entry point into a professional system built around layered safety and accountability."
    ],
    why: "The airline world rewards consistency over improvisation. Internalizing standardization and professionalism is what makes a safe, employable airline pilot.",
    mistake: "Improvising in a standardized environment. Deviating from standard operating procedures undermines the predictability that crew safety depends on.",
    instructor: "At the airline level, flying by the book is the skill. Standardization is what lets two pilots who just met operate a complex jet safely together.",
    safety: "Sterile-cockpit discipline and standard procedures exist because distraction and nonstandard actions during critical phases have caused accidents. Discipline here saves lives.",
    terms: [
      ["Standard operating procedures", "Defined procedures that keep crew operations consistent and safe."],
      ["Sterile cockpit", "Limiting nonessential activity during critical phases of flight."],
      ["Standardization", "Operating to a common standard so any qualified crew can work together."]
    ],
    hook: "Standardize, stay sterile, fly the procedures.",
    scenario: "During taxi and takeoff, a fellow crew member starts a casual unrelated conversation. Which professional standard does the sterile-cockpit rule invoke here?",
    oral: "Explain the sterile-cockpit concept and why standardization matters in airline operations.",
    practical: "List the critical phases of flight where sterile-cockpit discipline applies.",
    quiz: [
      { type: "mc", q: "The sterile-cockpit concept calls for:", choices: ["Silence at all times", "Limiting nonessential activity during critical phases", "Solo decision-making", "Skipping checklists when busy"], answer: 1, why: "Sterile cockpit limits nonessential activity during critical phases of flight." },
      { type: "tf", q: "Standardization helps two pilots who have just met operate a complex aircraft safely together.", answer: true, why: "Common standards make crew operations predictable and safe regardless of pairing." }
    ]
  },

  /* ===================== SPORT & RECREATIONAL PILOT ====================== */
  "sr-sport-intro": {
    title: "The Sport Pilot certificate",
    pathway: "airplane", cert: "Sport Pilot", faa: "phak", acs: "Sport Pilot — Certification", time: 7,
    explain: [
      "The Sport Pilot certificate is an accessible entry into flying. It authorizes operating light-sport aircraft, with fewer required training hours than the private certificate. Its best-known advantage is medical flexibility: a sport pilot may use a valid U.S. driver's license to meet the medical eligibility requirement, provided they meet the conditions in the rule and have not had a medical application denied or a certificate revoked.",
      "Sport pilot privileges are governed by 14 CFR Part 61, Subpart J, and center on visual flying with no more than one passenger and not for compensation or hire. The FAA's MOSAIC rule, whose sport pilot provisions took effect in late 2025, significantly expanded the range of aircraft a sport pilot may fly and added privileges such as flight at night with proper training and an endorsement, while the one-passenger limit remains. Always confirm the current regulations for the specific privileges and limits that apply."
    ],
    why: "For many people, sport pilot is the fastest, lowest-barrier way into the cockpit, especially without an FAA medical. Knowing its scope helps you decide if it fits your goals.",
    mistake: "Assuming sport pilot privileges equal private privileges. The certificate is deliberately scoped, and its privileges — recently expanded under the MOSAIC rule — are set by regulation, so verify the current ones.",
    instructor: "Sport pilot is a real certificate, not a lesser one — it is simply scoped. If your flying fits within its privileges, it is an efficient and affordable path.",
    safety: "The driver's-license medical option carries personal responsibility: you must not fly if you have a condition that makes you unable to operate safely, regardless of paperwork.",
    terms: [
      ["Sport Pilot", "An entry-level certificate to operate light-sport aircraft."],
      ["Driver's-license medical", "Using a valid U.S. driver's license to meet medical eligibility, under conditions."],
      ["Subpart J", "The Part 61 subpart governing sport pilot certification."]
    ],
    hook: "Lowest barrier to the cockpit — within set limits.",
    scenario: "A student wants to fly without going through an FAA medical exam. How does the sport pilot route address that, and what responsibility comes with it?",
    oral: "Describe the sport pilot certificate and the medical-eligibility option it allows.",
    practical: "Confirm the current sport pilot privileges and limitations in 14 CFR Part 61, Subpart J.",
    quiz: [
      { type: "mc", q: "A notable advantage of the sport pilot certificate is:", choices: ["No training required", "Using a valid driver's license for medical eligibility", "Airline privileges", "Unlimited aircraft"], answer: 1, why: "A sport pilot may use a valid U.S. driver's license to meet medical eligibility, under the rule's conditions." },
      { type: "tf", q: "Sport pilot privileges are the same as private pilot privileges.", answer: false, why: "Sport pilot privileges are intentionally limited and narrower than private pilot privileges." }
    ]
  },

  "sr-sport-limits": {
    title: "Sport pilot privileges and limitations",
    pathway: "airplane", cert: "Sport Pilot", faa: "phak", acs: "Sport Pilot — Privileges & limitations", time: 6,
    explain: [
      "Sport pilot privileges are framed around lower-risk operations: visual flight conditions, carrying no more than one passenger, and never for compensation or hire. Operating in certain controlled airspace requires specific training and an endorsement.",
      "The MOSAIC rule, whose sport pilot provisions are now in effect, expanded what sport pilots can do — including flying a wider range of aircraft and flying at night with additional training and an endorsement, subject to the rule's conditions. The enduring core remains the same: lower-risk flying with no more than one passenger, not for hire. Confirm the specific current privileges in the regulation."
    ],
    why: "Flying within your privileges is a legal and safety requirement. Sport pilots especially need to track the current rules as the category modernizes.",
    mistake: "Carrying more than one passenger or flying for hire. Those core limits define the certificate, and exceeding them is operating outside your privileges.",
    instructor: "Know your limits cold and verify the current ones. MOSAIC expanded sport pilot privileges, so learn the current rules rather than relying on an outdated cheat sheet.",
    safety: "The limitations exist to keep sport pilots within a lower-risk envelope. Respecting passenger, weather, and airspace limits keeps the safety margin intact.",
    terms: [
      ["One passenger", "Sport pilots may carry no more than a single passenger."],
      ["Not for hire", "Sport pilots may not fly for compensation or hire."],
      ["Airspace endorsement", "Training and sign-off required for certain controlled airspace."]
    ],
    hook: "No more than one passenger, never for hire.",
    scenario: "A sport pilot is asked to fly two friends and split the fuel cost as payment. Which two core limitations does that request run into?",
    oral: "State the core limitations of the sport pilot certificate and note which specifics to verify against current rules.",
    practical: "Read the current sport pilot limitations in the regulation and list any that have changed from older summaries.",
    quiz: [
      { type: "mc", q: "A core, enduring limitation of the sport pilot certificate is:", choices: ["No more than one passenger", "Night IFR allowed", "Flying for hire allowed", "Any aircraft allowed"], answer: 0, why: "Sport pilots may carry no more than one passenger." },
      { type: "tf", q: "Sport pilots may fly for compensation or hire.", answer: false, why: "Sport pilots may not operate for compensation or hire." }
    ]
  },

  "sr-lsa": {
    title: "Light-sport aircraft",
    pathway: "airplane", cert: "Sport Pilot", faa: "phak", acs: "Sport Pilot — Light-sport aircraft", time: 6,
    explain: [
      "A light-sport aircraft is a simpler class of aircraft that sport pilots are authorized to fly. Historically the category was defined largely by a fixed maximum weight, but the FAA's MOSAIC rule has moved to a performance-based definition built around a maximum stalling speed rather than a single weight number, which broadens the range of aircraft that can qualify.",
      "As a result, a sport pilot can now fly a wider variety of aircraft, including some heavier and more capable airplanes, though a sport pilot may still carry only one passenger. The precise criteria live in 14 CFR, and the aircraft-certification side of MOSAIC phases in during 2026, so confirm the current definition rather than relying on older weight-based figures."
    ],
    why: "Sport pilot privileges are tied directly to what counts as a light-sport aircraft. Knowing the category, and checking its current definition, keeps your operations legal.",
    mistake: "Relying on the old weight-based LSA limits. MOSAIC replaced the fixed weight limit with performance-based criteria, so an older figure may no longer define what you can fly.",
    instructor: "Think of light-sport in terms of performance now, not one weight number. MOSAIC shifted the definition toward a maximum stalling speed, so verify the current criteria in 14 CFR.",
    safety: "Even as the category broadens, sport pilots must respect each aircraft's real performance and their own training. Newer eligible aircraft can be faster and more capable than the original light-sport fleet.",
    terms: [
      ["Light-sport aircraft", "A simpler class of aircraft a sport pilot may fly, now defined by performance."],
      ["Performance-based definition", "Criteria such as a maximum stalling speed, rather than a fixed weight, that define an LSA."],
      ["MOSAIC", "The rule modernizing sport pilot privileges and light-sport aircraft, phasing in through 2026."]
    ],
    hook: "Now defined by performance, not just weight — verify the criteria.",
    scenario: "You read a years-old article listing a specific LSA weight limit. Why should you confirm that against the current rule before relying on it today?",
    oral: "Describe what characterizes a light-sport aircraft today and how MOSAIC changed its defining basis.",
    practical: "Look up the current LSA definition in 14 CFR and note how MOSAIC frames it by performance.",
    quiz: [
      { type: "mc", q: "Under the MOSAIC rule, light-sport aircraft are defined mainly by:", choices: ["A fixed maximum weight", "Performance criteria such as a maximum stalling speed", "The number of engines", "The paint scheme"], answer: 1, why: "MOSAIC replaced the fixed weight limit with a performance-based definition centered on a maximum stalling speed." },
      { type: "tf", q: "MOSAIC replaced the old fixed weight limit for light-sport aircraft with performance-based criteria.", answer: true, why: "The defining basis shifted from a single weight number to performance criteria such as stalling speed." }
    ]
  },

  "sr-rec-intro": {
    title: "The Recreational Pilot certificate",
    pathway: "airplane", cert: "Recreational Pilot", faa: "phak", acs: "Recreational Pilot — Certification", time: 6,
    explain: [
      "The Recreational Pilot certificate sits between student and private. It requires fewer total training hours than the private certificate but, unlike sport pilot, it does require at least a third-class FAA medical certificate. It is governed by 14 CFR Part 61, Subpart D.",
      "Recreational privileges are limited: day visual flying, one passenger, single-engine aircraft with modest horsepower and fixed gear, and operations generally within 50 nautical miles of the departure airport unless additional training and endorsements are obtained. Flight in controlled airspace and flying for hire are restricted."
    ],
    why: "Recreational pilot is a lighter path to flying for fun. Understanding its trade-offs against sport and private helps you pick the right certificate.",
    mistake: "Confusing recreational with sport. Recreational requires an FAA medical and centers on small single-engine airplanes within a limited area, with its own privilege set.",
    instructor: "Recreational pilot is a narrower certificate that still needs a medical. For many people, sport (no medical) or private (full privileges) ends up being the better fit.",
    safety: "The distance, passenger, and airspace limits keep recreational operations within a manageable envelope. Endorsements expand privileges only after added training.",
    terms: [
      ["Recreational Pilot", "A certificate between student and private with limited privileges."],
      ["Third-class medical", "The FAA medical certificate required for recreational pilots."],
      ["50-nautical-mile limit", "The general range limit without additional training and endorsement."]
    ],
    hook: "Between student and private — medical required, limits apply.",
    scenario: "A pilot wants a simpler certificate than private but is willing to get an FAA medical and stay near home. Which certificate matches that profile?",
    oral: "Describe the recreational pilot certificate and two of its key limitations.",
    practical: "Compare recreational pilot requirements against the sport and private certificates.",
    quiz: [
      { type: "mc", q: "Unlike a sport pilot, a recreational pilot must hold:", choices: ["An instrument rating", "At least a third-class medical certificate", "A type rating", "An ATP"], answer: 1, why: "Recreational pilots must hold at least a third-class FAA medical certificate." },
      { type: "tf", q: "Recreational pilots are generally limited to within 50 nautical miles of the departure airport without additional training.", answer: true, why: "The 50-NM limit applies unless the pilot obtains additional training and an endorsement." }
    ]
  },

  "sr-compare": {
    title: "Choosing: sport vs recreational vs private",
    pathway: "airplane", cert: "Sport / Recreational / Private", faa: "phak", acs: "Entry certificates — Comparison", time: 6,
    explain: [
      "These three certificates trade privileges against requirements. Sport pilot has the fewest required hours and can use a driver's license for medical eligibility, but flies only light-sport aircraft with the most limited privileges. Recreational pilot needs an FAA medical and offers somewhat more, but with distance, airspace, and aircraft limits.",
      "Private pilot requires the most training and an FAA medical, but offers by far the broadest privileges: more aircraft, passengers, cross-country range, and airspace, and the foundation to add instrument, commercial, and beyond. Many pilots start with sport or recreational and later upgrade, or go straight to private if their goals call for it."
    ],
    why: "Picking the right starting certificate saves time and money and matches your actual flying goals. The wrong choice can mean retraining later.",
    mistake: "Choosing on hours alone. The cheapest certificate to earn may not allow the flying you actually want to do.",
    instructor: "Start from your goal, not the hour count. If you want to fly far, at night, or toward a career, private is usually the smarter first stop even if it takes longer.",
    safety: "Each certificate's limits are matched to its training depth. Flying within the privileges you have actually earned is the safe and legal path.",
    terms: [
      ["Privileges vs requirements", "The core trade-off among the entry certificates."],
      ["Upgrade path", "Starting with one certificate and adding privileges later."],
      ["Goal-based choice", "Selecting a certificate based on the flying you intend to do."]
    ],
    hook: "Match the certificate to the flying you actually want.",
    scenario: "Someone wants to eventually fly for an airline. Which entry certificate gives the cleanest foundation toward that long-term goal?",
    oral: "Compare sport, recreational, and private certificates by medical, aircraft, and privileges.",
    practical: "Write down your flying goals and identify which entry certificate best fits them.",
    quiz: [
      { type: "mc", q: "Which certificate offers the broadest privileges of the three?", choices: ["Sport", "Recreational", "Private", "They are equal"], answer: 2, why: "The private certificate offers the broadest privileges and the foundation for further ratings." },
      { type: "tf", q: "The certificate with the fewest required hours always best fits a pilot's goals.", answer: false, why: "The lowest-hour certificate may not permit the flying a pilot actually wants to do." }
    ]
  },

  /* ============== ADDITIONAL CLASS RATINGS — MULTI-ENGINE & SEAPLANE ===== */
  "cr-me-intro": {
    title: "The Multi-Engine rating",
    pathway: "airplane", cert: "Multi-Engine Class Rating", faa: "afh", acs: "AMEL — Class rating", time: 6,
    explain: [
      "A multi-engine rating is an additional class rating added to an existing pilot certificate, authorizing flight in airplanes with more than one engine. Adding it requires training and a practical test, but generally no separate knowledge (written) test for the class rating itself.",
      "A second engine is not simply twice the safety. It adds performance and redundancy, but it also adds the complex and critical task of controlling the airplane if one engine fails, especially right after takeoff when speed is low and the airplane is heavy. That asymmetric-thrust situation is what multi-engine training centers on."
    ],
    why: "Multi-engine time and ratings are valuable for advanced and professional flying. Understanding the engine-out challenge is the heart of operating twins safely.",
    mistake: "Believing a twin is automatically safer. A poorly handled engine failure in a light twin can be more dangerous than the same failure in a single.",
    instructor: "Two engines give you options and a problem. The rating is mostly about managing the problem: keeping control when one quits at the worst moment.",
    safety: "Loss of control after an engine failure is the defining risk in light twins. Multi-engine training builds the immediate, correct response to that emergency.",
    terms: [
      ["Class rating", "An add-on like multi-engine, added to an existing certificate."],
      ["Asymmetric thrust", "Uneven thrust when one engine fails, yawing the airplane."],
      ["Engine-out control", "Maintaining directional control after an engine failure."]
    ],
    hook: "Two engines: more options, and one big problem to manage.",
    scenario: "Just after takeoff in a light twin, one engine fails. Why is this moment, rather than cruise, the most demanding for engine-out control?",
    oral: "Explain what a multi-engine rating adds and why a second engine is not automatically safer.",
    practical: "Describe what happens to a twin's directional control the instant one engine stops producing thrust.",
    quiz: [
      { type: "mc", q: "A multi-engine rating is:", choices: ["A separate certificate", "An added class rating", "A medical category", "A type rating"], answer: 1, why: "Multi-engine is a class rating added to an existing pilot certificate." },
      { type: "tf", q: "Adding a multi-engine class rating generally requires a separate knowledge (written) test.", answer: false, why: "The multi-engine class rating add-on generally requires training and a practical test, not a separate written." }
    ]
  },

  "cr-me-vmc": {
    title: "Engine-out: Vmc and the critical engine",
    pathway: "airplane", cert: "Multi-Engine Class Rating", faa: "afh", acs: "AMEL — Engine-inoperative aerodynamics", time: 7,
    explain: [
      "Vmc is the minimum control speed with the critical engine inoperative — the slowest speed at which you can keep directional control with one engine out and the other at takeoff power. It is marked by a red radial line on the airspeed indicator. The blue radial line marks Vyse, the best rate-of-climb speed with one engine inoperative.",
      "On a conventional twin where both propellers turn clockwise as seen from behind, the left engine is the critical engine. Because of P-factor, each propeller's effective thrust is displaced to the right, giving the right engine a longer moment arm. Losing the left engine therefore produces the larger, harder-to-control yawing moment."
    ],
    why: "Vmc and the critical engine are the core aerodynamics of engine-out flight. Mismanaging them near the ground is how light-twin accidents happen.",
    mistake: "Letting airspeed decay below Vmc with an engine out. Below Vmc the rudder can no longer counter the asymmetric thrust, and control is lost.",
    instructor: "Memorize blue line and red line and what they mean. Below the red line on one engine, the airplane will roll and yaw toward the dead engine no matter how hard you push.",
    safety: "An engine failure below Vmc can produce an uncontrollable roll and yaw. Maintaining at least Vyse, the blue line, preserves both control and climb.",
    terms: [
      ["Vmc", "Minimum control speed with the critical engine inoperative (red radial line)."],
      ["Vyse", "Best rate-of-climb speed with one engine inoperative (blue radial line)."],
      ["Critical engine", "The engine whose failure most adversely affects control and performance."]
    ],
    hook: "Red line is control, blue line is climb.",
    scenario: "On a conventional twin with both props turning clockwise, an engine fails. Which engine, if it is the one that quit, creates the harder control problem, and why?",
    oral: "Define Vmc and Vyse and explain why the left engine is critical on a conventional twin.",
    practical: "Identify the red and blue radial lines on a multi-engine airspeed indicator and state what each means.",
    quiz: [
      { type: "mc", q: "The red radial line on a twin's airspeed indicator marks:", choices: ["Best single-engine climb speed", "Minimum control speed (Vmc)", "Never-exceed speed", "Stall speed"], answer: 1, why: "The red radial line marks Vmc, the minimum control speed with the critical engine inoperative." },
      { type: "tf", q: "On a conventional twin with both propellers turning clockwise, the left engine is the critical engine.", answer: true, why: "P-factor displaces each prop's thrust to the right, making the left engine critical." }
    ]
  },

  "cr-me-perf": {
    title: "Multi-engine performance and decisions",
    pathway: "airplane", cert: "Multi-Engine Class Rating", faa: "afh", acs: "AMEL — Performance & decision making", time: 6,
    explain: [
      "Losing one engine on a light twin does not cut performance in half — it can erase most of the climb capability, sometimes leaving only a marginal single-engine climb at best. This is why takeoff planning in a twin includes knowing your speeds and having a clear plan for an engine failure at each phase.",
      "The takeoff decision mirrors that of larger aircraft: before a certain point you can reject and stop on the remaining runway; after it, the safer choice may be to continue while managing the failure. Knowing the accelerate-stop and engine-out climb realities turns a sudden failure into a briefed, practiced response."
    ],
    why: "The biggest twin-engine misconception is expecting full performance on one engine. Realistic planning is what keeps an engine failure survivable.",
    mistake: "Assuming a twin will climb well on one engine. Many light twins barely climb, or cannot, when heavy, hot, and high on a single engine.",
    instructor: "Brief the engine failure before every takeoff: what you will do before the decision point and after it. A surprise in a twin is far more dangerous than in a single.",
    safety: "Single-engine climb performance in light twins can be marginal or nonexistent in adverse conditions. Planning and briefing the failure is the safety margin.",
    terms: [
      ["Single-engine climb", "The often-marginal climb capability with one engine inoperative."],
      ["Accelerate-stop", "The distance to accelerate and then stop if takeoff is rejected."],
      ["Takeoff decision", "The pre-briefed plan for an engine failure before or after a set point."]
    ],
    hook: "One engine out can erase the climb — brief it every time.",
    scenario: "On a hot, high, heavy day a light twin loses an engine just after liftoff and barely climbs. Why is pre-takeoff briefing of this exact situation so important?",
    oral: "Explain why single-engine performance in a light twin is often marginal and what the takeoff decision involves.",
    practical: "Brief an engine-failure plan for a sample twin takeoff, before and after the decision point.",
    quiz: [
      { type: "mc", q: "Losing one engine in a light twin typically:", choices: ["Reduces performance by about half", "Erases most of the climb capability", "Has little effect", "Improves control"], answer: 1, why: "A single engine failure can eliminate most climb capability, not just half the performance." },
      { type: "tf", q: "Briefing the engine-failure plan before takeoff is an important multi-engine safety practice.", answer: true, why: "A pre-briefed plan turns a sudden failure into a practiced response." }
    ]
  },

  "cr-sea-intro": {
    title: "The Seaplane rating (single-engine sea)",
    pathway: "airplane", cert: "Seaplane Class Rating", faa: "afh", acs: "ASES — Class rating", time: 6,
    explain: [
      "A seaplane rating is an additional class rating, most commonly single-engine sea (ASES), authorizing operations from water. Like other class-rating add-ons, it requires training and a practical test, generally without a separate knowledge test. Seaplanes come as floatplanes, which sit on pontoons, and flying boats, whose hull is the fuselage.",
      "Water flying is a different world. There are no painted runways, no centerlines, and no brakes — the aircraft is always moving once it is on the water. The surface, wind, and current constantly change, so seaplane pilots read the water the way other pilots read a runway and the sky."
    ],
    why: "A seaplane rating opens flying to lakes, rivers, and coastlines that land airplanes can never reach. It also builds sharp energy and surface awareness.",
    mistake: "Bringing land-runway habits to the water. There are no brakes and no fixed runway, so taxi, takeoff, and docking demand entirely different technique.",
    instructor: "On the water you are part pilot, part boat captain. The airplane never simply stops, so you always plan where the wind and current are taking you.",
    safety: "Water operations add hazards like submerged objects, glassy-water depth illusions, and the lack of brakes. Reading the surface is a core safety skill.",
    terms: [
      ["Floatplane", "An airplane mounted on floats (pontoons) for water operations."],
      ["Flying boat", "A seaplane whose hull serves as the fuselage on the water."],
      ["No brakes", "A seaplane keeps moving on the water; there is nothing to stop it like wheel brakes."]
    ],
    hook: "No runway, no brakes — read the water.",
    scenario: "A land pilot tries to bring runway habits to a seaplane and looks for a way to brake to a stop on the water. Why does that habit not transfer?",
    oral: "Describe what a seaplane rating authorizes and two ways water operations differ from land operations.",
    practical: "Compare a floatplane and a flying boat and note how each contacts the water.",
    quiz: [
      { type: "mc", q: "A seaplane on the water differs from a landplane in that it:", choices: ["Has wheel brakes", "Has no brakes and is always moving", "Uses painted runways", "Cannot be steered"], answer: 1, why: "A seaplane has no brakes and keeps moving on the water." },
      { type: "tf", q: "The single-engine sea rating is an added class rating, generally requiring training and a practical test.", answer: true, why: "ASES is a class-rating add-on earned through training and a practical test." }
    ]
  },

  "cr-sea-ops": {
    title: "Water operations",
    pathway: "airplane", cert: "Seaplane Class Rating", faa: "afh", acs: "ASES — Water operations", time: 7,
    explain: [
      "Seaplane handling on the water uses distinct taxi modes: idling (displacement) taxi at low speed, plowing taxi with the nose high while transitioning, and step taxi up on the planing surface at higher speed. Pilots also sail the seaplane using wind and water current to maneuver without power, much like a sailboat, since there are no brakes to hold position.",
      "Two surface conditions demand special technique. Glassy water — perfectly smooth and mirror-like — removes the visual cues needed to judge height, so pilots use a known pitch attitude and rate of descent for landing. Rough water, with waves and whitecaps, calls for a different approach to protect the aircraft. And because seaplanes operate among boats, the navigation rules of the waterway apply."
    ],
    why: "Water technique is what makes seaplane flying safe and precise. Glassy-water and rough-water skills in particular prevent some of the most common seaplane accidents.",
    mistake: "Trying to judge a glassy-water landing by looking at the surface. Without texture there is no depth cue, so a normal visual flare can lead to a hard or late touchdown.",
    instructor: "On glassy water you fly the attitude and rate, not the surface, because the surface will lie to you about how high you are. Set it up and hold it.",
    safety: "Glassy-water depth illusions and rough-water impacts are leading seaplane hazards. The specific techniques for each condition are essential, not optional.",
    terms: [
      ["Step taxi", "Taxiing up on the planing surface (the step) at higher speed."],
      ["Sailing", "Using wind and current to maneuver a seaplane without engine power."],
      ["Glassy water", "Smooth, mirror-like water that removes height cues for landing."]
    ],
    hook: "Idle, plow, step — and fly attitude on glassy water.",
    scenario: "You approach a perfectly smooth, mirror-like lake to land. Why can you not judge your height visually, and what technique replaces the normal visual flare?",
    oral: "Describe the seaplane taxi modes and the special technique used for glassy-water landings.",
    practical: "Explain how you would maneuver a seaplane to a dock using sailing when power must be minimized.",
    quiz: [
      { type: "mc", q: "Glassy-water landings are challenging mainly because:", choices: ["The water is too rough", "There are no visual height cues", "Brakes do not work", "The engine overheats"], answer: 1, why: "A smooth, mirror-like surface removes the visual cues needed to judge height." },
      { type: "tf", q: "Seaplane pilots can use sailing to maneuver on the water without engine power.", answer: true, why: "Like a sailboat, a seaplane can be maneuvered using wind and current with little or no power." }
    ]
  },

  /* ===================== INSTRUMENT RATING — HELICOPTER ================== */
  "hir-intro": {
    title: "Instrument flying in helicopters",
    pathway: "helicopter", cert: "Instrument Rating — Helicopter", faa: "ifh", acs: "Instrument Helicopter ACS — Certification", time: 7,
    explain: [
      "A helicopter instrument rating authorizes operating a helicopter under Instrument Flight Rules, controlling it solely by reference to instruments when there is no usable outside horizon. It is added to a pilot certificate and follows the same general structure as the airplane instrument rating, including a knowledge test and a practical test.",
      "Under 14 CFR 61.65, the rating requires substantial cross-country pilot-in-command time, a block of actual or simulated instrument time, and a set amount of instrument flight training from an authorized instructor. The principles of attitude instrument flying, navigation, and approaches carry over from airplanes, applied to the helicopter."
    ],
    why: "An instrument-rated helicopter pilot can operate in weather that would ground a visual-only pilot, which matters greatly for missions like air medical and offshore work.",
    mistake: "Assuming helicopter instrument flying is just airplane instrument flying in a helicopter. The platform is less inherently stable, which changes the workload and technique.",
    instructor: "The scan, the procedures, and the approaches transfer from airplanes. What changes is how much the aircraft helps you, which we will cover next.",
    safety: "Inadvertent flight into instrument conditions without the rating and the right equipment is a serious, recurring helicopter accident cause. The rating exists to prevent that.",
    terms: [
      ["Instrument rating", "Authorization to operate under IFR by reference to instruments."],
      ["Attitude instrument flying", "Controlling the aircraft using the flight instruments."],
      ["61.65", "The regulation outlining instrument rating requirements."]
    ],
    hook: "Same instrument discipline, flown in a helicopter.",
    scenario: "An air-medical helicopter must reach a hospital through a low cloud layer. Which rating allows that flight to be conducted legally under IFR?",
    oral: "Describe what a helicopter instrument rating authorizes and the general experience it requires.",
    practical: "Compare the structure of the helicopter and airplane instrument ratings and note what carries over.",
    quiz: [
      { type: "mc", q: "A helicopter instrument rating authorizes:", choices: ["Night VFR only", "Operating the helicopter under IFR by reference to instruments", "External-load work", "Airline operations"], answer: 1, why: "The rating allows IFR operation of the helicopter by reference to instruments." },
      { type: "tf", q: "The helicopter instrument rating follows the same general structure as the airplane instrument rating.", answer: true, why: "Both share the same general certification structure under 14 CFR 61.65." }
    ]
  },

  "hir-challenges": {
    title: "Why helicopter instrument flying is demanding",
    pathway: "helicopter", cert: "Instrument Rating — Helicopter", faa: "ifh", acs: "Instrument Helicopter ACS — Aircraft control", time: 7,
    explain: [
      "Most helicopters are less inherently stable than airplanes. Without the natural tendency to return to level flight, an instrument scan in a helicopter is more demanding, and small lapses in attention can let the aircraft diverge more quickly. Many IFR-capable helicopters use a stability augmentation system or autopilot to reduce that workload.",
      "Because of the higher workload, helicopter instrument operations lean heavily on automation, careful task management, and precise control inputs. The pilot must understand what the stability and autopilot systems are doing, and be ready to hand-fly accurately if they fail."
    ],
    why: "The reduced stability of a helicopter is the central difference in instrument flying. Understanding it explains the reliance on augmentation and the premium on a disciplined scan.",
    mistake: "Becoming dependent on the autopilot without the skill to hand-fly on instruments. If augmentation fails in cloud, the pilot must take over precisely and immediately.",
    instructor: "Know your stability and autopilot systems cold, and keep your hand-flying instrument skills sharp. The automation reduces workload, but it does not replace your scan.",
    safety: "A loss of stability augmentation in instrument conditions sharply increases workload. A pilot who cannot hand-fly the helicopter on instruments is in serious danger if that happens.",
    terms: [
      ["Stability augmentation", "A system that helps stabilize the helicopter, reducing pilot workload."],
      ["Autopilot", "Automation that can hold attitude, heading, or altitude in IFR helicopters."],
      ["Workload management", "Organizing tasks to stay ahead of a demanding instrument flight."]
    ],
    hook: "Less stable platform, higher workload, sharper scan.",
    scenario: "In cloud, a helicopter's stability augmentation system fails and the workload jumps. Why is the ability to hand-fly on instruments suddenly critical?",
    oral: "Explain why helicopters are more demanding to fly on instruments and the role of stability augmentation.",
    practical: "List the helicopter systems that reduce instrument workload and what a pilot must do if they fail.",
    quiz: [
      { type: "mc", q: "Compared with most airplanes, most helicopters are:", choices: ["More inherently stable", "Less inherently stable", "Identical in stability", "Unable to fly on instruments"], answer: 1, why: "Most helicopters are less inherently stable, which raises instrument-flying workload." },
      { type: "tf", q: "Stability augmentation removes the need to keep hand-flying instrument skills sharp.", answer: false, why: "If augmentation fails in cloud, the pilot must hand-fly precisely, so those skills remain essential." }
    ]
  },

  "hir-ops": {
    title: "Helicopter instrument operations",
    pathway: "helicopter", cert: "Instrument Rating — Helicopter", faa: "iph", acs: "Instrument Helicopter ACS — Procedures", time: 6,
    explain: [
      "Instrument-rated helicopters fly clearances, enroute procedures, and instrument approaches much like airplanes, but they also use procedures suited to rotary-wing capability. Point-in-space approaches, for example, guide a helicopter by instruments to a position from which it can proceed visually to a landing site such as a hospital helipad.",
      "Helicopter instrument flying is central to missions like helicopter air ambulance and offshore operations, where reaching a destination in marginal weather safely is the entire point. These operations combine the instrument rating with demanding decision-making about weather, fuel, and alternates."
    ],
    why: "Real helicopter IFR work, from air medical to offshore, depends on these procedures. They turn the instrument rating into a practical mission capability.",
    mistake: "Pressing into weather beyond your equipment, approaches available, or personal limits. The rating is a tool, not a license to ignore deteriorating conditions.",
    instructor: "Plan weather, fuel, and alternates conservatively in the helicopter IFR world. The missions that need instruments most are also the ones that punish poor decisions hardest.",
    safety: "Helicopter air-ambulance operations have a difficult safety history tied to weather decisions. Disciplined limits and planning are core to flying them safely.",
    terms: [
      ["Point-in-space approach", "An instrument approach to a point from which a helicopter proceeds visually."],
      ["Helicopter air ambulance", "Air-medical operations that often rely on instrument capability."],
      ["Alternate planning", "Choosing backup airports in case the destination is below minimums."]
    ],
    hook: "Instruments to the point, then eyes to the pad.",
    scenario: "A medical helicopter flies an instrument approach to a point near a hospital, then continues visually to the helipad. What type of approach is that?",
    oral: "Describe a point-in-space approach and a mission that relies on helicopter instrument capability.",
    practical: "Explain how weather, fuel, and alternate planning factor into a helicopter IFR mission.",
    quiz: [
      { type: "mc", q: "A point-in-space approach guides a helicopter to:", choices: ["A runway only", "A point from which it proceeds visually to a landing site", "A hover at altitude", "An airway intersection"], answer: 1, why: "It brings the helicopter by instruments to a point, then the pilot proceeds visually to land." },
      { type: "tf", q: "Helicopter instrument capability is important for missions like air ambulance and offshore operations.", answer: true, why: "Those missions often depend on reaching destinations safely in marginal weather using instruments." }
    ]
  },

  /* ====================== AIRLINE TRANSPORT PILOT — HELICOPTER =========== */
  "hatp-intro": {
    title: "The Airline Transport Pilot — Helicopter",
    pathway: "helicopter", cert: "Airline Transport Pilot — Helicopter", faa: "phak", acs: "ATP Helicopter ACS — Certification", time: 7,
    explain: [
      "The ATP certificate with a rotorcraft category and helicopter class rating is the highest level of helicopter certification. It is required for certain higher-level commercial helicopter operations and represents the top tier of rotary-wing experience and judgment.",
      "Under 14 CFR 61.161, the helicopter ATP applicant must be at least 23 years old and have at least 1,200 hours of total flight time as a pilot, with required cross-country, night, helicopter, and instrument components. Notably, the helicopter ATP total-time minimum is lower than the 1,500 hours required for the airplane ATP."
    ],
    why: "The helicopter ATP is the professional summit for rotary-wing pilots, opening the most demanding operations. Knowing its requirements lets you plan a long-term career path.",
    mistake: "Assuming the airplane ATP numbers apply. The helicopter ATP requires 1,200 hours of total time under Part 61, not 1,500.",
    instructor: "The helicopter ATP has its own experience requirements. Build toward 61.161, and remember the age requirement of 23 applies to every ATP.",
    safety: "ATP-level helicopter operations are demanding and high-stakes. The experience requirements ensure pilots have faced varied, challenging conditions before reaching them.",
    terms: [
      ["ATP — Helicopter", "The highest rotorcraft-helicopter pilot certificate."],
      ["1,200-hour minimum", "The Part 61 total-time minimum for the helicopter ATP."],
      ["Age 23", "The minimum age for any ATP certificate."]
    ],
    hook: "Top rotary certificate — 1,200 hours, age 23.",
    scenario: "A friend insists every ATP needs 1,500 hours. Why is that wrong for the rotorcraft-helicopter ATP?",
    oral: "State the minimum age and Part 61 total-time requirement for the helicopter ATP.",
    practical: "Compare the helicopter and airplane ATP total-time requirements and note the difference.",
    quiz: [
      { type: "mc", q: "The Part 61 total-time minimum for the helicopter ATP is:", choices: ["1,000 hours", "1,200 hours", "1,500 hours", "750 hours"], answer: 1, why: "The rotorcraft-helicopter ATP requires at least 1,200 hours of total time under 61.161." },
      { type: "tf", q: "The minimum age for any ATP certificate, including helicopter, is 23.", answer: true, why: "The age requirement of 23 applies to all ATP certificates." }
    ]
  },

  "hatp-ops": {
    title: "Professional helicopter air-carrier operations",
    pathway: "helicopter", cert: "Airline Transport Pilot — Helicopter", faa: "phak", acs: "ATP Helicopter ACS — Operations", time: 6,
    explain: [
      "ATP-level helicopter pilots often operate in the most demanding sectors of the industry, such as scheduled and on-demand passenger transport, offshore energy support, and complex air-medical systems. Much of this work is conducted under operating rules like Part 135, with the structure, oversight, and standardization that implies.",
      "These operations emphasize crew coordination where applicable, rigorous standard procedures, weather discipline, and continuous training. The professional helicopter pilot manages high workload and pressure while holding firmly to limits, because the environments, from offshore platforms to night air-medical scenes, leave little room for error."
    ],
    why: "The ATP opens helicopter flying's most serious missions. Understanding their professional standards prepares a pilot for that level of responsibility.",
    mistake: "Carrying a casual mindset into high-tempo operations. Offshore and air-medical flying demand standardization and discipline, not improvisation.",
    instructor: "At this level, professionalism and weather discipline define you. The willingness to decline a flight when conditions or fatigue demand it is the mark of a career pilot.",
    safety: "Offshore and air-medical helicopter operations face real, recurring hazards from weather and workload. Standardization and conservative decisions are central to their safety.",
    terms: [
      ["Part 135", "Rules for on-demand commercial operations, common in helicopter work."],
      ["Offshore operations", "Helicopter support for offshore energy platforms."],
      ["Standardization", "Operating to common procedures for predictable, safe operations."]
    ],
    hook: "Hardest missions, highest standards, firm limits.",
    scenario: "An offshore passenger flight faces deteriorating weather and a tight schedule. What does professional ATP-level decision-making prioritize?",
    oral: "Identify sectors where helicopter ATP pilots operate and the standards those operations demand.",
    practical: "List the professional disciplines that keep demanding helicopter operations safe.",
    quiz: [
      { type: "mc", q: "On-demand commercial helicopter operations commonly fall under:", choices: ["Part 61", "Part 91 only", "Part 135", "Part 107"], answer: 2, why: "Much on-demand commercial helicopter work operates under Part 135." },
      { type: "tf", q: "Standardization and weather discipline are central to safe ATP-level helicopter operations.", answer: true, why: "These professional disciplines directly address the recurring hazards of demanding helicopter missions." }
    ]
  },

  /* ============================== GLIDER ================================= */
  "gl-intro": {
    title: "What glider flying is",
    pathway: "glider", cert: "Glider Pilot", faa: "phak", acs: "Glider ACS — Introduction", time: 7,
    explain: [
      "A glider, or sailplane, is an aircraft that flies without an engine. After being launched to altitude, it stays aloft by finding rising air, trading altitude for distance and speed the way a cyclist coasts downhill. Glider flying, called soaring, is among the purest forms of aviation.",
      "Glider is its own aircraft category, with private and commercial pilot certificates available in it. A distinctive feature is medical certification: under 14 CFR 61.23, no FAA medical certificate is required to operate a glider. The pilot is still responsible for self-certifying that they are medically fit to fly safely."
    ],
    why: "Soaring teaches energy management and stick-and-rudder skill better than almost anything, and the no-medical rule makes it remarkably accessible.",
    mistake: "Thinking a glider just falls slowly. A good sailplane can climb thousands of feet and fly hundreds of miles cross-country by working rising air.",
    instructor: "Gliding makes you feel the air. With no engine to mask mistakes, you learn coordination and energy management in their purest form.",
    safety: "No engine means no go-around with power. Glider pilots manage energy and plan every landing carefully, because there is no second chance to add thrust.",
    terms: [
      ["Glider / sailplane", "An engineless aircraft that soars by using rising air."],
      ["Soaring", "Staying aloft and gaining altitude by finding rising air."],
      ["No FAA medical", "Operating a glider does not require an FAA medical certificate."]
    ],
    hook: "No engine, no medical — just you and the air.",
    scenario: "Someone is told a pilot certificate always requires an FAA medical exam. Why is that not true for flying a glider?",
    oral: "Describe glider flying and explain the medical certification rule for gliders.",
    practical: "Watch a soaring flight and note how the glider gains altitude without any engine.",
    quiz: [
      { type: "mc", q: "To operate a glider, an FAA medical certificate is:", choices: ["Always required", "Not required", "Required only for cross-country", "Required only for passengers"], answer: 1, why: "Under 14 CFR 61.23, no FAA medical certificate is required to operate a glider." },
      { type: "tf", q: "A glider can gain altitude after launch by using rising air.", answer: true, why: "Soaring pilots climb by finding and circling in rising air such as thermals." }
    ]
  },

  "gl-certs": {
    title: "Glider certificates and eligibility",
    pathway: "glider", cert: "Glider Pilot", faa: "phak", acs: "Glider ACS — Certification & eligibility", time: 6,
    explain: [
      "Glider certification follows the familiar ladder of student, private, and commercial, but with lower age requirements than powered aircraft. A student may solo a glider at age 14, and a person may earn a private pilot certificate with a glider rating at age 16 — two years earlier than the typical powered minimums.",
      "The flight-experience requirements for glider ratings are generally lower than for airplanes, reflecting the simpler aircraft and operations. As with all certificates, applicants pass a knowledge test and a practical test, and they must be able to read, speak, write, and understand English."
    ],
    why: "Gliding is a path young aviators can begin earlier than powered flying, and it builds a strong foundation for any later certificate.",
    mistake: "Assuming the age 16 and 17 powered minimums apply. Gliders allow solo at 14 and a private glider certificate at 16.",
    instructor: "If you are young and eager, gliders let you solo at 14 and earn a certificate at 16. It is a superb early foundation in airmanship.",
    safety: "Lower hour requirements do not mean lower standards of judgment. Glider students still build solid decision-making before flying alone.",
    terms: [
      ["Solo at 14", "The minimum age to solo a glider."],
      ["Private glider at 16", "The minimum age for a private pilot certificate with a glider rating."],
      ["Commercial glider", "The commercial certificate available in the glider category."]
    ],
    hook: "Solo at 14, private glider at 16.",
    scenario: "A 15-year-old wants to fly solo as soon as legally possible. In which category can they solo a year before powered-aircraft students can?",
    oral: "State the solo and private-certificate minimum ages for gliders.",
    practical: "Compare the minimum ages for glider and powered-airplane certificates.",
    quiz: [
      { type: "mc", q: "The minimum age to solo a glider is:", choices: ["12", "14", "16", "17"], answer: 1, why: "A student may solo a glider at age 14." },
      { type: "tf", q: "A person can earn a private pilot certificate with a glider rating at age 16.", answer: true, why: "The glider private-certificate minimum age is 16, earlier than typical powered minimums." }
    ]
  },

  "gl-launch": {
    title: "Getting a glider airborne",
    pathway: "glider", cert: "Glider Pilot", faa: "afh", acs: "Glider ACS — Launch & recovery", time: 7,
    explain: [
      "Since a glider has no engine, it must be launched. The most common method is the aerotow, where a powered airplane pulls the glider into the air on a long rope and the glider pilot releases at altitude. Ground launch by winch uses a powerful ground-based winch to rapidly reel in a cable, slinging the glider upward in a steep climb.",
      "Other methods include auto tow, using a vehicle, and self-launch in motorgliders that carry a retractable engine. Each launch method has its own techniques and emergencies, especially a launch failure such as a rope or cable break, which the pilot must be trained to handle immediately."
    ],
    why: "Launch is a high-workload, safety-critical phase unique to gliders. Knowing the methods and their failure responses is fundamental to soaring safely.",
    mistake: "Being unprepared for a launch failure. A rope or cable break low to the ground demands an immediate, pre-planned decision, not improvisation.",
    instructor: "Brief the launch failure before every launch. You decide in advance what you will do at each altitude if the rope or cable lets go.",
    safety: "A premature launch failure near the ground is one of the most critical glider emergencies. Trained, immediate action prevents it from becoming an accident.",
    terms: [
      ["Aerotow", "Launch by a powered airplane towing the glider on a rope."],
      ["Winch launch", "Ground launch using a winch to rapidly reel in a cable."],
      ["Launch failure", "A rope or cable break or power loss during launch."]
    ],
    hook: "Tow, winch, or auto — always brief the break.",
    scenario: "During a winch launch the cable breaks while the glider is still low. Why must the response be pre-briefed and immediate?",
    oral: "Describe two glider launch methods and the emergency every launch briefing must cover.",
    practical: "Explain what a pilot decides in advance for a launch failure at low altitude.",
    quiz: [
      { type: "mc", q: "The most common glider launch method is:", choices: ["Winch launch", "Aerotow", "Auto tow", "Bungee launch"], answer: 1, why: "Aerotow, using a powered airplane and a rope, is the most common launch method." },
      { type: "tf", q: "A launch failure such as a rope break should be briefed and planned before each launch.", answer: true, why: "A low launch failure demands an immediate, pre-planned response, so it is briefed every time." }
    ]
  },

  "gl-soaring": {
    title: "Staying up: sources of lift",
    pathway: "glider", cert: "Glider Pilot", faa: "phak", acs: "Glider ACS — Soaring weather", time: 7,
    explain: [
      "Once aloft, a glider stays up by finding air that is rising faster than the glider sinks. The most common source is the thermal — a column of warm air rising from sun-heated ground. Pilots circle within a thermal to climb, then glide on to the next one.",
      "Two other major sources are ridge lift, where wind striking a hill or ridge is deflected upward, and mountain wave, a powerful standing wave that forms downwind of mountains and can carry gliders to very high altitudes. Reading the sky and terrain to find lift is the central skill of soaring."
    ],
    why: "Finding and using lift is what makes soaring possible. Recognizing thermals, ridge lift, and wave is the difference between a long flight and an early landing.",
    mistake: "Flying straight through rising air. New pilots often fail to center a thermal, leaving lift behind instead of circling to climb in it.",
    instructor: "Learn to read the sky. Cumulus clouds, soaring birds, and the shape of the terrain all tell you where the air is going up.",
    safety: "Mountain wave and strong thermals also bring turbulence and rotor. Understanding the weather that creates lift also means respecting the hazards it carries.",
    terms: [
      ["Thermal", "A rising column of warm air used to gain altitude."],
      ["Ridge lift", "Upward-deflected wind along a hill or ridge."],
      ["Mountain wave", "A standing wave downwind of mountains that can reach great heights."]
    ],
    hook: "Thermals, ridges, and waves — find the rising air.",
    scenario: "A glider pilot notices cumulus clouds forming over sun-heated fields. What source of lift do those clouds often mark?",
    oral: "Name three sources of lift used in soaring and how a pilot recognizes each.",
    practical: "Identify visual cues, such as cumulus clouds or soaring birds, that indicate rising air.",
    quiz: [
      { type: "mc", q: "A column of warm air rising from sun-heated ground is a:", choices: ["Ridge lift", "Thermal", "Mountain wave", "Downdraft"], answer: 1, why: "A thermal is a rising column of warm air, the most common soaring lift source." },
      { type: "tf", q: "Mountain wave can carry a glider to very high altitudes.", answer: true, why: "Mountain wave is a powerful standing wave that can lift gliders to great heights." }
    ]
  },

  "gl-performance": {
    title: "Glider performance: glide ratio and speed to fly",
    pathway: "glider", cert: "Glider Pilot", faa: "phak", acs: "Glider ACS — Performance", time: 6,
    explain: [
      "A glider's efficiency is described by its glide ratio, or lift-to-drag ratio: how far it travels forward for each unit of altitude lost in still air. High-performance sailplanes have glide ratios of forty to one or better, meaning forty feet forward for every foot of descent. Each glider also has a best-glide airspeed that achieves its maximum range.",
      "Cross-country soaring adds speed-to-fly: the idea that a pilot should fly faster through sinking air and slower through rising air to maximize average cross-country speed. Managing airspeed against the air around you is how soaring pilots cover long distances between thermals efficiently."
    ],
    why: "Glide ratio and speed-to-fly are the core performance ideas in soaring. They decide whether you reach the next thermal or land in a field.",
    mistake: "Flying one fixed speed everywhere. Holding best-glide speed through strong sink can leave you short; speed-to-fly adjusts for the conditions.",
    instructor: "Know your glider's best-glide speed and glide ratio, then learn to vary speed with the air. Slow in lift, faster in sink, to stretch every glide.",
    safety: "Misjudging glide performance into a landing area can leave a glider short of a safe field. Conservative glide planning protects against an unsafe arrival.",
    terms: [
      ["Glide ratio", "Distance traveled forward per unit of altitude lost (lift-to-drag ratio)."],
      ["Best-glide speed", "The airspeed that achieves maximum glide range."],
      ["Speed to fly", "Adjusting airspeed for sink and lift to maximize cross-country speed."]
    ],
    hook: "Slow in lift, faster in sink — fly the air.",
    scenario: "A sailplane with a 40-to-1 glide ratio is at 2,000 feet above the ground in still air. Roughly how far could it glide before reaching the ground?",
    oral: "Define glide ratio and explain the speed-to-fly concept.",
    practical: "Use a glider's glide ratio to estimate how far it can travel from a given altitude in still air.",
    quiz: [
      { type: "mc", q: "A glide ratio of 40 to 1 means the glider travels:", choices: ["40 feet down per foot forward", "40 feet forward per foot of altitude lost", "40 miles per hour", "40 degrees of bank"], answer: 1, why: "A 40-to-1 glide ratio means 40 feet forward for each foot of altitude lost in still air." },
      { type: "tf", q: "Speed-to-fly suggests flying faster through sinking air and slower through rising air.", answer: true, why: "Adjusting speed for sink and lift maximizes average cross-country speed." }
    ]
  },

  "gl-safety": {
    title: "Glider energy management and landing out",
    pathway: "glider", cert: "Glider Pilot", faa: "afh", acs: "Glider ACS — Approach, landing & emergencies", time: 7,
    explain: [
      "With no engine, a glider pilot manages energy as a fixed budget. The approach and landing must be planned and flown precisely, because there is no power to go around. Gliders use spoilers or dive brakes on the wings to control the glide path and adjust the descent to land on the chosen spot.",
      "In cross-country soaring, a pilot may be unable to reach an airport and must perform a land-out, an off-field landing in a suitable field. This is a planned-for, normal part of the sport: experienced pilots continuously keep a reachable landing area in mind and evaluate fields for size, surface, slope, and obstacles."
    ],
    why: "Energy management and the willingness to land out safely are what keep soaring safe. The pilot who always has a landing option never gets trapped without power.",
    mistake: "Pressing on with no landing option in reach. Flying beyond gliding range of a safe field, hoping for lift, is how soaring pilots get into trouble.",
    instructor: "Always know where you would land right now. In a glider you never let yourself get beyond reach of a safe field while waiting for lift.",
    safety: "Running out of altitude without a reachable landing area is a serious glider hazard. Keeping a safe field always within glide range is a core safety habit.",
    terms: [
      ["Spoilers / dive brakes", "Wing devices that steepen the glide to control the approach."],
      ["Land-out", "A planned off-field landing when no airport is reachable."],
      ["Energy management", "Treating altitude and speed as a budget with no engine to replenish it."]
    ],
    hook: "Always keep a safe field within glide.",
    scenario: "Cross-country in a glider, you cannot reach an airport. Why is selecting and landing in a suitable field a normal, planned part of soaring rather than an emergency surprise?",
    oral: "Explain how a glider controls its approach without power and what a land-out involves.",
    practical: "Describe what a glider pilot evaluates when choosing a field for a possible land-out.",
    quiz: [
      { type: "mc", q: "Gliders typically control their glide path on approach using:", choices: ["Engine power", "Spoilers or dive brakes", "Reverse thrust", "Flaps only"], answer: 1, why: "Spoilers or dive brakes steepen the glide to control the approach and landing point." },
      { type: "tf", q: "A land-out is a planned, normal part of cross-country soaring, not just an emergency.", answer: true, why: "Soaring pilots plan for off-field landings and keep a safe field within reach." }
    ]
  },

  /* ===================== BALLOON / LIGHTER-THAN-AIR ===================== */
  "bl-intro": {
    title: "What balloon flying is",
    pathway: "balloon", cert: "Balloon Pilot", faa: "phak", acs: "Balloon ACS — Introduction", time: 7,
    explain: [
      "A balloon is a lighter-than-air aircraft that floats because the air inside it is less dense than the air around it. The most common type is the hot air balloon, which uses a burner to heat the air in a large fabric envelope; gas balloons instead use a lighter-than-air gas. Balloon is part of the lighter-than-air category, which also includes airships.",
      "Like gliders, balloons require no FAA medical certificate to operate under 14 CFR 61.23, though the pilot remains responsible for being fit to fly. Private and commercial pilot certificates are available in the balloon category, and commercial balloon pilots are the ones who fly the passenger rides many people experience."
    ],
    why: "Ballooning is one of the oldest and most accessible forms of flight, and the no-medical rule and gentle pace make it welcoming to many pilots.",
    mistake: "Picturing a balloon as steerable like an airplane. A balloon goes where the wind takes it; the pilot controls altitude, not heading directly.",
    instructor: "Ballooning teaches patience and weather judgment above all. You do not fight the air, you read it and use it.",
    safety: "A balloon cannot simply stop or turn. Weather, launch and landing sites, and obstacles must be planned carefully, because options in the air are limited.",
    terms: [
      ["Lighter-than-air", "The aircraft category including balloons and airships."],
      ["Envelope", "The large fabric bag that holds the heated air or gas."],
      ["No FAA medical", "Operating a balloon does not require an FAA medical certificate."]
    ],
    hook: "It floats because the air inside is lighter.",
    scenario: "Someone assumes every aircraft can be steered left or right by the pilot. Why is a balloon different, and what does the pilot actually control?",
    oral: "Describe what makes a balloon fly and the medical rule for balloon operations.",
    practical: "Watch a hot air balloon inflate and launch, and note how the burner is used.",
    quiz: [
      { type: "mc", q: "A hot air balloon rises because the air inside is:", choices: ["Heavier than outside air", "Less dense than outside air", "Pressurized", "Spinning"], answer: 1, why: "Heating the air makes it less dense than the surrounding air, producing buoyancy." },
      { type: "tf", q: "Operating a balloon requires an FAA medical certificate.", answer: false, why: "Under 14 CFR 61.23, no FAA medical certificate is required to operate a balloon." }
    ]
  },

  "bl-certs": {
    title: "Balloon certificates and eligibility",
    pathway: "balloon", cert: "Balloon Pilot", faa: "phak", acs: "Balloon ACS — Certification & eligibility", time: 6,
    explain: [
      "Balloon certification mirrors the glider category in its lower age limits. A student may solo a balloon at age 14, and a person may earn a private pilot certificate with a lighter-than-air balloon rating at 16 — earlier than the typical powered-aircraft minimums.",
      "Hot air balloon ratings are distinguished by whether the balloon has an airborne heater (a burner). Commercial balloon pilots conduct passenger rides, which is a significant part of the ballooning world. As always, applicants pass a knowledge test and a practical test and must understand English."
    ],
    why: "The accessible age limits and no-medical rule make ballooning a path young or medically restricted aviators can pursue.",
    mistake: "Assuming powered-aircraft ages apply. Balloon, like glider, allows solo at 14 and a private certificate at 16.",
    instructor: "If a medical rules out powered flying, balloon and glider remain open. They are real certificates with real standards, not consolation prizes.",
    safety: "Lower hour and age requirements do not reduce the need for sound weather judgment, which is the heart of safe ballooning.",
    terms: [
      ["Solo at 14", "The minimum age to solo a balloon."],
      ["Private balloon at 16", "The minimum age for a private balloon rating."],
      ["Airborne heater", "A burner that distinguishes hot air balloon rating types."]
    ],
    hook: "Solo at 14, private balloon at 16.",
    scenario: "A pilot candidate cannot obtain an FAA medical but wants a real pilot certificate. Which two categories remain available without a medical?",
    oral: "State the solo and private-certificate minimum ages for balloons and the medical rule.",
    practical: "Compare balloon and powered-aircraft minimum ages and medical requirements.",
    quiz: [
      { type: "mc", q: "The minimum age to solo a balloon is:", choices: ["12", "14", "16", "17"], answer: 1, why: "A student may solo a balloon at age 14, the same as a glider." },
      { type: "tf", q: "Commercial balloon pilots are the ones who fly passenger balloon rides.", answer: true, why: "Conducting passenger rides for compensation requires a commercial balloon certificate." }
    ]
  },

  "bl-howfly": {
    title: "How a hot air balloon flies",
    pathway: "balloon", cert: "Balloon Pilot", faa: "phak", acs: "Balloon ACS — Systems & controls", time: 6,
    explain: [
      "A hot air balloon controls altitude through temperature. Firing the burner heats the air in the envelope, making it lighter and causing the balloon to climb; letting the air cool, or opening a vent at the top to release hot air, causes it to descend. The pilot constantly trims these to hold or change altitude.",
      "Because heating and cooling take time, balloon flying requires anticipation: a pilot adds heat before a climb is needed and plans a descent well in advance. There is no throttle for instant response, so smooth, forward-thinking control is essential, especially near the ground for landing."
    ],
    why: "Altitude is the balloon pilot's only direct control, and it is the key to both flying the balloon and steering it using the wind. Mastering it is everything.",
    mistake: "Reacting late. Because the balloon responds slowly to the burner and vent, waiting until you need a change means the response comes too late.",
    instructor: "Fly ahead of the balloon. Heat for the climb you will need in a few seconds, not the one you needed already.",
    safety: "Delayed control inputs near the ground can cause hard landings or obstacle contact. Anticipation is the core safety skill in ballooning.",
    terms: [
      ["Burner", "The propane heater that warms the air to climb."],
      ["Vent / parachute valve", "An opening at the top to release hot air and descend."],
      ["Anticipation", "Acting early because the balloon responds slowly to control inputs."]
    ],
    hook: "Heat to climb, vent to descend — and plan ahead.",
    scenario: "A balloon pilot wants to begin descending toward a landing field. Why must that descent be planned well in advance rather than initiated at the last moment?",
    oral: "Explain how a hot air balloon climbs and descends and why anticipation matters.",
    practical: "Describe the sequence of control inputs to level a balloon at a chosen altitude.",
    quiz: [
      { type: "mc", q: "To make a hot air balloon descend, the pilot can:", choices: ["Fire the burner", "Open the vent to release hot air", "Add ballast", "Spin the envelope"], answer: 1, why: "Releasing hot air through the vent cools the envelope and causes a descent." },
      { type: "tf", q: "A hot air balloon responds instantly to control inputs like a throttle.", answer: false, why: "Heating and cooling take time, so balloon control requires anticipation." }
    ]
  },

  "bl-wind": {
    title: "Steering by wind and weather",
    pathway: "balloon", cert: "Balloon Pilot", faa: "phak", acs: "Balloon ACS — Weather & navigation", time: 7,
    explain: [
      "A balloon travels with the wind, so a pilot cannot turn directly. The trick is that wind often blows in slightly different directions at different altitudes. By climbing or descending into a layer with a more favorable wind, a skilled balloon pilot can steer, choosing a path and a landing area by selecting altitudes.",
      "Weather governs everything in ballooning. Flights happen in calm, stable conditions, typically in the early morning or evening, and pilots avoid strong winds, gusts, and instability. Understanding the wind profile before and during flight is what makes a balloon flight both possible and safe."
    ],
    why: "Steering by altitude is the defining art of ballooning, and weather judgment is its defining safety skill. Together they make a controlled flight from an uncontrolled medium.",
    mistake: "Flying in marginal wind. Ballooning has little tolerance for strong or gusty conditions, and pushing the weather is a serious hazard.",
    instructor: "The wind at one altitude is not the wind at another. Learning to find and use those layers is how you steer a craft that has no rudder.",
    safety: "Surface winds and instability drive the most serious balloon accidents, including hard landings and dragging. Conservative weather limits are essential.",
    terms: [
      ["Wind gradient", "The change of wind direction and speed with altitude."],
      ["Steering by altitude", "Changing height to catch winds blowing a different way."],
      ["Stable conditions", "The calm, smooth air ballooning requires."]
    ],
    hook: "No rudder — steer by choosing your altitude.",
    scenario: "A balloon pilot wants to move toward a landing field that is not directly downwind. How can changing altitude help steer the balloon there?",
    oral: "Explain how a balloon pilot uses winds at different altitudes to steer and what weather conditions are required.",
    practical: "Describe how a pre-flight wind profile at several altitudes informs a balloon flight plan.",
    quiz: [
      { type: "mc", q: "A balloon pilot changes direction primarily by:", choices: ["Using a rudder", "Changing altitude to catch different winds", "Firing the burner harder", "Adjusting the basket"], answer: 1, why: "Different altitudes often have different wind directions, which the pilot uses to steer." },
      { type: "tf", q: "Ballooning is typically conducted in calm, stable conditions such as early morning or evening.", answer: true, why: "Calm, stable air is required for safe balloon operations." }
    ]
  },

  "bl-ops": {
    title: "Balloon operations and safety",
    pathway: "balloon", cert: "Balloon Pilot", faa: "afh", acs: "Balloon ACS — Operations & emergencies", time: 7,
    explain: [
      "A balloon flight is a team effort. A ground crew helps inflate the envelope, and a chase crew follows to assist at the landing, which can be in a field reached only by selecting the right winds. Pilots arrange suitable launch and landing sites and respect landowner permission and local rules.",
      "Key hazards include power lines, which are a leading cause of serious balloon accidents, along with hard landings in gusty conditions and fuel-system care with the propane burner. Pilots plan approaches to avoid wires and obstacles and brief passengers on the landing position before touchdown."
    ],
    why: "Ballooning safety lives in planning: sites, weather, crew, and obstacle avoidance. The flight itself is the easy part when the planning is done well.",
    mistake: "Underestimating power lines. Their low visibility and the balloon's limited maneuverability make wires a uniquely dangerous obstacle.",
    instructor: "Plan your landing area and your approach to avoid wires every time. In a balloon you cannot make a sharp last-second turn to miss them.",
    safety: "Power line contact is among the most serious balloon hazards. Careful site selection, approach planning, and passenger briefing are core safety practices.",
    terms: [
      ["Chase crew", "The ground team that follows and assists at the landing."],
      ["Landing site", "A suitable field selected and reached by choosing winds."],
      ["Power lines", "A leading balloon hazard that must be planned around."]
    ],
    hook: "Plan the site, brief the landing, avoid the wires.",
    scenario: "On approach to a field, a balloon pilot spots power lines along one edge. Why is early planning, rather than a last-moment maneuver, the safe response?",
    oral: "Describe the roles of a balloon ground and chase crew and the leading hazard pilots plan around.",
    practical: "List what a balloon pilot evaluates when selecting and approaching a landing site.",
    quiz: [
      { type: "mc", q: "A leading hazard in balloon operations is:", choices: ["High-altitude hypoxia", "Power lines", "Engine failure", "Retractable gear"], answer: 1, why: "Power lines are a leading cause of serious balloon accidents and must be planned around." },
      { type: "tf", q: "A chase crew follows the balloon to assist at the landing.", answer: true, why: "The chase crew tracks the balloon and helps recover it at the landing site." }
    ]
  },

  /* ============================== GYROPLANE ============================== */
  "gy-intro": {
    title: "What a gyroplane is",
    pathway: "gyroplane", cert: "Gyroplane Pilot", faa: "phak", acs: "Gyroplane ACS — Introduction", time: 7,
    explain: [
      "A gyroplane, sometimes called an autogyro, is a rotorcraft with a free-spinning rotor that is not powered in flight. A separate engine and propeller provide forward thrust, and as the gyroplane moves forward, air flowing up through the rotor keeps it turning and producing lift. It sits in the rotorcraft category, gyroplane class.",
      "A gyroplane is not a helicopter. A helicopter powers its rotor to hover; a gyroplane's rotor always autorotates and cannot hover or take off straight up in normal flight. The result is an aircraft that flies slowly and is highly stable, but always needs forward airspeed to keep the rotor producing lift."
    ],
    why: "Understanding that the rotor is unpowered and driven by airflow explains everything about how a gyroplane flies, takes off, and stays safe.",
    mistake: "Treating a gyroplane like a helicopter. It cannot hover, and its rotor is driven by the air, not the engine.",
    instructor: "Think of the rotor as a free-spinning wing kept turning by the wind. The propeller pushes you forward; the airflow keeps the rotor flying.",
    safety: "Because lift depends on the rotor turning, keeping airspeed and rotor RPM up is essential. The aircraft is stable, but it still has its own specific hazards.",
    terms: [
      ["Gyroplane", "A rotorcraft with a free-spinning, unpowered rotor."],
      ["Autorotation", "Airflow up through the rotor keeping it spinning to produce lift."],
      ["Rotorcraft category", "The category that includes helicopters and gyroplanes."]
    ],
    hook: "A free-spinning rotor, pushed along by a propeller.",
    scenario: "Someone calls a gyroplane a small helicopter. What key difference about the rotor and hovering makes that comparison wrong?",
    oral: "Explain how a gyroplane produces lift and how it differs from a helicopter.",
    practical: "Watch a gyroplane takeoff and note that the rotor spins from airflow, not engine power.",
    quiz: [
      { type: "mc", q: "A gyroplane's rotor in flight is:", choices: ["Powered by the engine", "Free-spinning, driven by airflow", "Fixed in place", "Only for landing"], answer: 1, why: "The gyroplane rotor autorotates, driven by air flowing up through it, not by the engine." },
      { type: "tf", q: "A gyroplane can hover in place like a helicopter.", answer: false, why: "A gyroplane cannot hover; its unpowered rotor needs forward airflow to produce lift." }
    ]
  },

  "gy-howfly": {
    title: "How a gyroplane flies",
    pathway: "gyroplane", cert: "Gyroplane Pilot", faa: "phak", acs: "Gyroplane ACS — Aerodynamics", time: 7,
    explain: [
      "In forward flight, the relative wind flows upward through the tilted rotor disc, keeping the rotor spinning and generating lift continuously — the same autorotation a helicopter uses only during an engine failure, but for a gyroplane it is the normal, all-the-time state. The engine-driven propeller supplies the thrust that keeps the aircraft moving forward.",
      "Because the rotor is always autorotating, a gyroplane is highly resistant to stalling and spinning in the way an airplane can. It can fly very slowly and lands in a short distance. But it depends on maintaining rotor RPM, so the rotor must be managed carefully on takeoff and never be unloaded in flight."
    ],
    why: "Continuous autorotation is what makes a gyroplane uniquely stable and slow-flying. It also defines the one thing a pilot must always protect: rotor RPM.",
    mistake: "Unloading the rotor. Pushing into low-G can reduce the load on the rotor and the airflow keeping it spinning, which is dangerous in a gyroplane.",
    instructor: "Keep the rotor loaded and spinning. The airflow up through the disc is your lift, and you never do anything that takes the air or the load away from it.",
    safety: "Unloading the rotor in flight, such as an abrupt low-G pushover, is a recognized gyroplane hazard. Keeping the rotor loaded is a core safety rule.",
    terms: [
      ["Continuous autorotation", "The rotor spinning from airflow at all times in normal flight."],
      ["Rotor RPM", "The rotor spin rate that must be maintained for lift."],
      ["Unloading the rotor", "Reducing rotor load, such as in low-G, which is hazardous."]
    ],
    hook: "Air up through the disc keeps the rotor flying.",
    scenario: "A gyroplane pilot is tempted to push abruptly into a low-G pushover. Why is unloading the rotor in flight a serious hazard?",
    oral: "Explain why a gyroplane resists stalling and what the pilot must always protect.",
    practical: "Describe how relative airflow keeps a gyroplane rotor turning in normal flight.",
    quiz: [
      { type: "mc", q: "Compared with an airplane, a gyroplane is:", choices: ["More prone to stalling", "Highly resistant to stalling and spinning", "Unable to fly slowly", "Dependent on engine-powered rotor lift"], answer: 1, why: "Continuous autorotation makes a gyroplane resistant to the stalls and spins of an airplane." },
      { type: "tf", q: "Unloading the rotor in flight, such as an abrupt low-G pushover, is hazardous in a gyroplane.", answer: true, why: "Reducing rotor load can compromise the airflow keeping it spinning, a recognized hazard." }
    ]
  },

  "gy-controls": {
    title: "Gyroplane controls and prerotation",
    pathway: "gyroplane", cert: "Gyroplane Pilot", faa: "phak", acs: "Gyroplane ACS — Controls & takeoff", time: 6,
    explain: [
      "A gyroplane pilot uses a control stick that tilts the rotor disc to pitch and roll, rudder pedals for yaw, and the throttle to control propeller thrust and therefore speed and climb. Tilting the rotor changes where its lift points, steering the aircraft much as a cyclic does on a helicopter.",
      "Before takeoff, the rotor must already be spinning. A prerotator mechanism spins the rotor up to speed on the ground so the gyroplane can begin its takeoff roll with the rotor already producing lift, shortening the distance needed. Managing the rotor through prerotation and the early takeoff roll is a key skill."
    ],
    why: "Knowing how the controls work and why prerotation matters is the foundation of operating a gyroplane safely from the ground up.",
    mistake: "Beginning a takeoff with the rotor too slow. Without enough rotor RPM from prerotation, the gyroplane cannot generate the lift it needs to fly.",
    instructor: "Spin the rotor up properly before you roll. The takeoff begins with the rotor already alive, not with a slow disc you are hoping will catch up.",
    safety: "Mismanaging the rotor during prerotation and the takeoff roll, including rotor blade flapping at low RPM, is a known hazard. Proper technique is essential.",
    terms: [
      ["Control stick", "Tilts the rotor disc to pitch and roll the gyroplane."],
      ["Prerotator", "A mechanism that spins the rotor up before takeoff."],
      ["Takeoff roll", "The ground run during which the rotor takes up flying speed and lift builds."]
    ],
    hook: "Spin the rotor up first, then roll.",
    scenario: "A gyroplane pilot starts the takeoff roll with the rotor spinning too slowly. Why can the aircraft fail to develop the lift it needs?",
    oral: "Describe the gyroplane controls and the purpose of prerotation.",
    practical: "Explain the sequence of prerotating the rotor and beginning a gyroplane takeoff.",
    quiz: [
      { type: "mc", q: "A gyroplane prerotator is used to:", choices: ["Provide forward thrust", "Spin the rotor up before takeoff", "Brake the rotor", "Steer on the ground"], answer: 1, why: "The prerotator spins the rotor to speed before takeoff so lift is available sooner." },
      { type: "tf", q: "The gyroplane control stick tilts the rotor disc to pitch and roll the aircraft.", answer: true, why: "Tilting the rotor disc directs its lift, controlling pitch and roll." }
    ]
  },

  "gy-certs": {
    title: "Gyroplane certificates and ratings",
    pathway: "gyroplane", cert: "Gyroplane Pilot", faa: "phak", acs: "Gyroplane ACS — Certification", time: 6,
    explain: [
      "Gyroplane flying can be pursued at several certificate levels. A sport pilot may operate an eligible gyroplane, and private and commercial pilot certificates are available with a rotorcraft category, gyroplane class rating. The sport route offers a lighter-requirement entry, while private and commercial expand privileges.",
      "Because the gyroplane is in the rotorcraft category, its ratings are distinct from airplane and helicopter ratings. A pilot adds the gyroplane class within rotorcraft, and earning it requires training and a practical test appropriate to the unique way a gyroplane flies."
    ],
    why: "Knowing the certificate options helps a prospective gyroplane pilot pick the right path, from a sport-pilot entry to commercial privileges.",
    mistake: "Assuming a helicopter rating covers gyroplanes. They are separate classes in the rotorcraft category, each requiring its own training and test.",
    instructor: "Gyroplane is its own rotorcraft class. Whether you start at sport pilot or go straight for private, you train specifically for how a gyroplane flies.",
    safety: "Gyroplane-specific training matters because the aircraft has handling and hazards unlike airplanes or helicopters. The rating ensures that specific competence.",
    terms: [
      ["Gyroplane class", "The rotorcraft-category class rating for gyroplanes."],
      ["Sport pilot gyroplane", "Operating an eligible gyroplane under sport pilot privileges."],
      ["Private / commercial gyroplane", "Higher certificate levels in the gyroplane class."]
    ],
    hook: "Its own rotorcraft class — sport, private, or commercial.",
    scenario: "A helicopter pilot wants to fly a gyroplane. Why does holding a helicopter rating not automatically authorize that?",
    oral: "Describe the certificate levels available for gyroplane flying and the category and class they fall under.",
    practical: "Identify which gyroplane certificate path fits a given pilot's goals.",
    quiz: [
      { type: "mc", q: "A gyroplane rating falls under which category?", choices: ["Airplane", "Rotorcraft", "Glider", "Powered-lift"], answer: 1, why: "Gyroplane is a class within the rotorcraft category." },
      { type: "tf", q: "A sport pilot may operate an eligible gyroplane.", answer: true, why: "Gyroplane flying is available at the sport pilot level for eligible aircraft." }
    ]
  },

  "gy-safety": {
    title: "Gyroplane handling and safety",
    pathway: "gyroplane", cert: "Gyroplane Pilot", faa: "phak", acs: "Gyroplane ACS — Safety of flight", time: 6,
    explain: [
      "A gyroplane's continuous autorotation makes it stall- and spin-resistant and forgiving in slow flight, but it has its own critical hazards. Pilot-induced oscillation can develop if a pilot over-controls in pitch, and a power push-over, or buntover, can occur if the rotor is unloaded by an abrupt low-G pushover, particularly in some high-thrust-line designs.",
      "Safe gyroplane flying centers on keeping the rotor loaded and spinning, using smooth control inputs, and managing the rotor carefully during ground handling and takeoff. Respecting these specific behaviors, rather than assuming airplane or helicopter habits apply, is what keeps gyroplane operations safe."
    ],
    why: "The gyroplane's strengths come with specific risks. Knowing them turns a forgiving, stable aircraft into a genuinely safe one.",
    mistake: "Applying abrupt, large pitch inputs. Over-controlling can trigger pilot-induced oscillation, and an aggressive pushover can unload the rotor dangerously.",
    instructor: "Fly the gyroplane smoothly and keep the rotor loaded. Most gyroplane accidents trace to over-controlling or unloading the rotor, both of which you can simply avoid.",
    safety: "Pilot-induced oscillation and rotor unloading (buntover) are the defining gyroplane hazards. Smooth inputs and a loaded rotor directly prevent both.",
    terms: [
      ["Pilot-induced oscillation", "A worsening pitch oscillation from over-controlling."],
      ["Power push-over / buntover", "Loss of control from unloading the rotor in a low-G pushover."],
      ["Loaded rotor", "Keeping positive load on the rotor so it stays driven by airflow."]
    ],
    hook: "Smooth inputs, loaded rotor, no abrupt pushovers.",
    scenario: "A new gyroplane pilot makes large, rapid pitch inputs and the oscillation grows. What hazard is developing, and what input style prevents it?",
    oral: "Name two gyroplane-specific hazards and how a pilot avoids each.",
    practical: "Explain why smooth control inputs and a loaded rotor are central to gyroplane safety.",
    quiz: [
      { type: "mc", q: "A power push-over (buntover) in a gyroplane results from:", choices: ["Too much rotor RPM", "Unloading the rotor in a low-G pushover", "Flying too slowly", "Landing too softly"], answer: 1, why: "Unloading the rotor by an abrupt low-G pushover can lead to loss of control." },
      { type: "tf", q: "Smooth control inputs help prevent pilot-induced oscillation in a gyroplane.", answer: true, why: "Over-controlling causes PIO, so smooth inputs prevent it." }
    ]
  },

  /* ============================= POWERED-LIFT =========================== */
  "pl-intro": {
    title: "What powered-lift is",
    pathway: "poweredlift", cert: "Powered-Lift Pilot", faa: "phak", acs: "Powered-Lift — Introduction", time: 7,
    explain: [
      "Powered-lift is an FAA aircraft category for aircraft that can take off and land vertically and fly at low speed using engine-driven lift, yet cruise on a wing like an airplane. In regulation, a powered-lift depends mainly on engine-driven lift devices or engine thrust for lift at low speed, and on nonrotating wings for lift in forward flight.",
      "Tiltrotor aircraft are a classic example: they take off like a helicopter, then tilt their rotors forward to fly like an airplane. Powered-lift is also the category many new electric air-taxi designs fall under, which has made this once-niche category one of the most active frontiers in aviation."
    ],
    why: "Powered-lift bridges helicopter and airplane capability, and it is central to the emerging air-taxi industry. Understanding the category frames everything that follows.",
    mistake: "Lumping powered-lift in with helicopters or airplanes. It is its own category precisely because it behaves like both at different points in a flight.",
    instructor: "Think of powered-lift as an aircraft that changes its identity in flight: helicopter-like for takeoff and landing, airplane-like in cruise.",
    safety: "Aircraft that operate in two regimes carry the demands of both. Powered-lift training and rules reflect that dual nature and its added complexity.",
    terms: [
      ["Powered-lift", "An FAA category combining vertical lift with winged cruise."],
      ["Tiltrotor", "An aircraft that tilts its rotors to switch between hover and forward flight."],
      ["Engine-driven lift", "Lift produced by powered devices at low speed, as in a hover."]
    ],
    hook: "Lifts like a helicopter, cruises like an airplane.",
    scenario: "An aircraft takes off vertically, then tilts its rotors forward and flies on its wings. Which FAA category does that aircraft belong to?",
    oral: "Define the powered-lift category and give an example aircraft type.",
    practical: "Describe how a tiltrotor's flight changes from takeoff to cruise.",
    quiz: [
      { type: "mc", q: "Powered-lift aircraft are characterized by:", choices: ["Only vertical flight", "Vertical lift plus winged cruise", "Only winged cruise", "Lighter-than-air flight"], answer: 1, why: "Powered-lift combines vertical, low-speed lift with wing-borne forward flight." },
      { type: "tf", q: "Many new electric air-taxi designs fall under the powered-lift category.", answer: true, why: "Numerous eVTOL air-taxi aircraft are being certificated as powered-lift." }
    ]
  },

  "pl-howfly": {
    title: "How powered-lift flies: the transition",
    pathway: "poweredlift", cert: "Powered-Lift Pilot", faa: "phak", acs: "Powered-Lift — Aerodynamics", time: 7,
    explain: [
      "A powered-lift flight has distinct phases. At takeoff and landing it uses engine-driven lift to hover or fly slowly, much like a helicopter. As it accelerates, its wings begin to carry the load, and it transitions to wing-borne flight where it cruises efficiently like an airplane.",
      "The transition between powered-lift and wing-borne flight is the defining challenge of the category. During it, lift shifts from the engines to the wing, the controls and handling change, and the aircraft passes through a regime that is neither full hover nor full airplane. Managing that transition smoothly and safely is at the heart of powered-lift flying."
    ],
    why: "The transition is what makes powered-lift unique and demanding. Understanding it is the key to grasping how these aircraft are flown and where their risks concentrate.",
    mistake: "Treating the transition as a non-event. The shift between lift sources is the most complex and critical part of a powered-lift flight.",
    instructor: "Watch the transition. That is where the aircraft changes character, and where precision and understanding matter most.",
    safety: "The transition regime concentrates handling complexity. Powered-lift training emphasizes flying it correctly, because it is unlike anything in a pure airplane or helicopter.",
    terms: [
      ["Transition", "The shift between engine-driven lift and wing-borne flight."],
      ["Wing-borne flight", "Cruise flight where the wing carries the aircraft's weight."],
      ["Hover mode", "Low-speed flight supported by engine-driven lift."]
    ],
    hook: "The transition is where two aircraft become one.",
    scenario: "As a powered-lift aircraft accelerates after takeoff, lift shifts from its engines to its wings. Why is this transition the most demanding part of the flight?",
    oral: "Describe the phases of a powered-lift flight and why the transition is critical.",
    practical: "Trace how lift moves from engines to wing as a powered-lift aircraft accelerates.",
    quiz: [
      { type: "mc", q: "In powered-lift, the transition refers to:", choices: ["Changing pilots", "Shifting between engine-driven lift and wing-borne flight", "Switching fuel tanks", "Lowering the gear"], answer: 1, why: "The transition is the shift between powered lift and wing-borne flight." },
      { type: "tf", q: "The transition between lift sources is the defining challenge of powered-lift flying.", answer: true, why: "Handling and lift change through the transition, making it the most complex phase." }
    ]
  },

  "pl-certs": {
    title: "Powered-lift certification",
    pathway: "poweredlift", cert: "Powered-Lift Pilot", faa: "phak", acs: "Powered-Lift — Certification", time: 6,
    explain: [
      "Because powered-lift aircraft blend helicopter and airplane behavior, certificating their pilots required a tailored approach. The FAA established that framework through a Special Federal Aviation Regulation (SFAR) effective in early 2025, drawing on both airplane and rotorcraft training where each applies and using a performance-based approach. The rule is recent and expected to evolve as the industry matures.",
      "Under this framework, powered-lift certificates are available at the private, commercial, and airline transport pilot levels with a powered-lift category rating, along with an instrument rating and flight instructor ratings for powered-lift. Because the area is developing quickly, always confirm the current path, ratings, and operating rules against the regulations and FAA guidance. The enduring point is that powered-lift is now a recognized certification area, distinct from airplane and helicopter."
    ],
    why: "Powered-lift certification is the newest pilot pathway, and it is the gateway to flying tiltrotors and air taxis. Knowing it exists, and that it is evolving, sets accurate expectations.",
    mistake: "Assuming an existing airplane or helicopter certificate automatically covers powered-lift. It is its own certification area with tailored requirements.",
    instructor: "This is the newest frontier in certification, so verify the current rules. What stays true is that powered-lift now has its own defined path, separate from airplane and helicopter.",
    safety: "Tailored certification exists because powered-lift demands competencies from both airplane and helicopter flying. Meeting those specific requirements is a safety foundation.",
    terms: [
      ["Powered-lift certification", "The tailored pilot certification path for the category."],
      ["Evolving framework", "Rules that are new and continue to develop."],
      ["Verify current rules", "Confirming the latest requirements and guidance for this fast-moving area."]
    ],
    hook: "A new, evolving path — verify the current rules.",
    scenario: "A pilot assumes a fixed-wing certificate lets them fly a tiltrotor. Why is powered-lift treated as its own certification area, and what should the pilot confirm?",
    oral: "Explain why powered-lift required a tailored certification approach and why current rules should be verified.",
    practical: "Identify the official sources to confirm current powered-lift certification requirements.",
    quiz: [
      { type: "mc", q: "Powered-lift pilot certification is:", choices: ["Identical to airplane certification", "A tailored path drawing on airplane and rotorcraft training", "Not required", "The same as a drone certificate"], answer: 1, why: "Certification is tailored to powered-lift, drawing on both airplane and rotorcraft training." },
      { type: "tf", q: "Powered-lift certification rules are new and continue to evolve, so current rules should be verified.", answer: true, why: "This is a fast-developing area, so the latest regulations and guidance should be confirmed." }
    ]
  },

  "pl-future": {
    title: "Advanced air mobility and eVTOL",
    pathway: "poweredlift", cert: "Powered-Lift Pilot", faa: "phak", acs: "Powered-Lift — Operations & the future", time: 6,
    explain: [
      "Much of the energy around powered-lift comes from electric vertical-takeoff-and-landing (eVTOL) aircraft, part of a movement often called advanced air mobility. These designs aim to provide quiet, efficient short-range flight, including air taxis that take off vertically from compact sites and cruise on wings between destinations.",
      "Realizing this vision involves not just the aircraft but new infrastructure, airspace integration, and operating procedures, much of it still being developed. Powered-lift pilots are positioned at the center of this emerging field, applying both vertical-flight and winged-flight skills to a new kind of operation."
    ],
    why: "Advanced air mobility is one of aviation's most active frontiers, and powered-lift pilots are its first operators. Understanding the landscape frames the category's future.",
    mistake: "Assuming the technology alone makes the industry. Airspace integration, infrastructure, and procedures are being built alongside the aircraft.",
    instructor: "This field is being built right now. The powered-lift skills you would learn apply directly to the air-taxi operations taking shape.",
    safety: "Integrating new aircraft into shared airspace safely is a central challenge of advanced air mobility, and a core focus of the rules being developed.",
    terms: [
      ["eVTOL", "Electric vertical-takeoff-and-landing aircraft."],
      ["Advanced air mobility", "The emerging field of new short-range, often electric, air transport."],
      ["Airspace integration", "Safely fitting new operations into existing airspace."]
    ],
    hook: "Electric vertical flight — aviation's newest frontier.",
    scenario: "An eVTOL air taxi lifts off vertically from a compact pad and cruises on wings to its destination. Which aircraft category and emerging field does it represent?",
    oral: "Describe advanced air mobility and the role powered-lift pilots play in it.",
    practical: "List the elements beyond the aircraft that advanced air mobility requires to operate.",
    quiz: [
      { type: "mc", q: "eVTOL aircraft are most associated with:", choices: ["Long-haul airline flights", "Advanced air mobility and air taxis", "Crop dusting", "Gas balloon racing"], answer: 1, why: "eVTOL designs are central to advanced air mobility and air-taxi operations." },
      { type: "tf", q: "Advanced air mobility requires new infrastructure and airspace integration, not just the aircraft.", answer: true, why: "Infrastructure, procedures, and airspace integration are being developed alongside the aircraft." }
    ]
  },

  /* ====================== WEIGHT-SHIFT CONTROL (TRIKE) ================== */
  "ws-intro": {
    title: "What a weight-shift trike is",
    pathway: "weightshift", cert: "Weight-Shift-Control Pilot", faa: "phak", acs: "Weight-Shift ACS — Introduction", time: 7,
    explain: [
      "A weight-shift-control (WSC) aircraft, often called a trike, is a flexible wing, similar to a large hang glider wing, mounted above a wheeled carriage that carries the pilot, the engine, and a pusher propeller. It is its own FAA aircraft category, with weight-shift-control land and sea classes.",
      "What makes it distinctive is how it is flown. There is no conventional control stick or rudder. Instead, the pilot steers by physically shifting the carriage's weight relative to the wing using a control bar, changing the aircraft's pitch and roll. It is an open, simple, low-and-slow way to fly."
    ],
    why: "Understanding that the whole aircraft is controlled by shifting weight against a free-flying wing explains everything about how a trike handles.",
    mistake: "Expecting stick-and-rudder controls. A trike has neither; the entire control method is shifting weight relative to the wing.",
    instructor: "Forget the yoke and pedals. On a trike, your body and the carriage are the controls, and the wing responds to where the weight goes.",
    safety: "The open carriage and flexible wing make trikes sensitive to wind and turbulence. They are flown in calm conditions, and respecting weather is essential.",
    terms: [
      ["Weight-shift control", "Steering by shifting the carriage's weight relative to the wing."],
      ["Trike", "The common name for a WSC aircraft, from its three-wheeled carriage."],
      ["Flexible wing", "The hang-glider-style wing mounted above the carriage."]
    ],
    hook: "A wing, a carriage, and weight to steer it.",
    scenario: "Someone looks for the control stick and rudder pedals in a trike and finds neither. How is the aircraft actually controlled?",
    oral: "Describe what a weight-shift-control aircraft is and how it is steered.",
    practical: "Watch a trike fly and note how the pilot moves the carriage relative to the wing.",
    quiz: [
      { type: "mc", q: "A weight-shift-control trike is steered by:", choices: ["A control stick", "Rudder pedals", "Shifting weight relative to the wing", "A steering wheel"], answer: 2, why: "WSC aircraft are flown by shifting the carriage's weight relative to the wing." },
      { type: "tf", q: "A weight-shift trike uses conventional ailerons, elevator, and rudder.", answer: false, why: "Trikes have no conventional control surfaces; control is by weight shift." }
    ]
  },

  "ws-control": {
    title: "How weight-shift control works",
    pathway: "weightshift", cert: "Weight-Shift-Control Pilot", faa: "phak", acs: "Weight-Shift ACS — Controls", time: 7,
    explain: [
      "The pilot holds a control bar connected to the wing. Pushing the bar out, away from the body, moves the weight aft and raises the nose, slowing the trike; pulling the bar in lowers the nose and speeds it up. This pitch response is opposite to a conventional control yoke, which is one of the first things a trike pilot must internalize.",
      "Turns are made by shifting weight toward the direction of the turn, which banks the wing that way. Because the controls work differently from an airplane, transitioning pilots train deliberately to rewire their instincts, especially the reversed-feeling pitch control."
    ],
    why: "The weight-shift control logic, particularly the reversed pitch sense, is the core skill and the most common point of confusion for new trike pilots.",
    mistake: "Applying airplane pitch instincts. Pulling the bar in lowers the nose, the opposite of pulling a yoke back, and confusing the two is dangerous.",
    instructor: "Push out to slow and climb, pull in to speed up and descend. Say it until the reversed-from-an-airplane feel becomes automatic.",
    safety: "Reverting to airplane control instincts near the ground can cause a dangerous pitch input. Trike pilots must have the weight-shift logic fully internalized.",
    terms: [
      ["Control bar", "The bar the pilot uses to shift weight against the wing."],
      ["Reversed pitch", "Pushing the bar out raises the nose, opposite to a yoke."],
      ["Bank by weight", "Shifting weight toward the turn to roll the wing."]
    ],
    hook: "Push out to slow, pull in to speed up.",
    scenario: "A trike pilot wants to slow down and raise the nose. Which way do they move the control bar, and why is that opposite to an airplane yoke?",
    oral: "Explain how a trike pilot controls pitch and makes a turn, and how it differs from an airplane.",
    practical: "Describe the bar input to slow a trike and the input to turn it.",
    quiz: [
      { type: "mc", q: "To raise the nose and slow a weight-shift trike, the pilot:", choices: ["Pulls the bar in", "Pushes the bar out", "Adds rudder", "Lowers flaps"], answer: 1, why: "Pushing the bar out moves weight aft and raises the nose, slowing the trike." },
      { type: "tf", q: "A trike's pitch control feels opposite to a conventional airplane yoke.", answer: true, why: "Pushing the bar out raises the nose, the reverse of pulling a yoke back." }
    ]
  },

  "ws-certs": {
    title: "Weight-shift certificates and classes",
    pathway: "weightshift", cert: "Weight-Shift-Control Pilot", faa: "phak", acs: "Weight-Shift ACS — Certification", time: 6,
    explain: [
      "Weight-shift flying is available at the sport pilot and private pilot levels, in a weight-shift-control category with land and sea classes. The sport pilot route is the common entry point and offers a lighter set of requirements suited to these simple aircraft.",
      "At the sport pilot level, a valid U.S. driver's license can be used to meet the medical eligibility requirement, under the rule's conditions, the same flexibility that applies to other sport pilot operations. A pilot earning a weight-shift rating trains specifically for the aircraft's unique handling and passes a knowledge test and a practical test."
    ],
    why: "Knowing the certificate options helps a prospective trike pilot choose between a sport-pilot entry and private privileges.",
    mistake: "Assuming an airplane certificate covers trikes. Weight-shift is its own category, requiring training and a test specific to it.",
    instructor: "Most trike pilots start at sport pilot. Whatever level you choose, you train specifically for weight-shift handling, which is unlike anything in an airplane.",
    safety: "Category-specific training matters because trike handling and weather sensitivity differ sharply from other aircraft. The rating ensures that specific competence.",
    terms: [
      ["WSC land / sea", "The land and sea classes within the weight-shift category."],
      ["Sport pilot WSC", "Operating a weight-shift trike under sport pilot privileges."],
      ["Driver's-license medical", "Using a valid U.S. driver's license for medical eligibility at the sport level."]
    ],
    hook: "Sport or private — a category of its own.",
    scenario: "A pilot wants the simplest path into trikes without an FAA medical exam. Which certificate level and medical option fits?",
    oral: "Describe the certificate levels and classes available for weight-shift flying.",
    practical: "Identify which weight-shift certificate path fits a given pilot's goals.",
    quiz: [
      { type: "mc", q: "Weight-shift-control flying is available at which certificate levels?", choices: ["Only ATP", "Sport and private pilot", "Only commercial", "Only student"], answer: 1, why: "Weight-shift ratings are available at the sport pilot and private pilot levels." },
      { type: "tf", q: "At the sport pilot level, a valid driver's license can meet weight-shift medical eligibility.", answer: true, why: "The driver's-license medical option applies to sport pilot operations, including weight-shift." }
    ]
  },

  "ws-ops": {
    title: "Trike operations and safety",
    pathway: "weightshift", cert: "Weight-Shift-Control Pilot", faa: "afh", acs: "Weight-Shift ACS — Operations & safety", time: 6,
    explain: [
      "Trikes are flown low, slow, and usually in the calm air of early morning or evening. The open carriage exposes the pilot to the elements, and the flexible wing reacts readily to wind, gusts, and turbulence, so weather judgment and conservative limits are central to safe operation.",
      "Takeoffs and landings use the wheeled carriage on a runway or suitable strip, with the pilot managing the wing through the ground roll and the transition to flight. As with all aircraft, the pilot remains responsible for preflighting the wing, the carriage, and the engine, and for flying within personal and aircraft limits."
    ],
    why: "Trike safety lives in weather discipline and respect for the aircraft's sensitivity. The flying is simple; the judgment about when to fly is what matters most.",
    mistake: "Flying a trike in marginal wind. Their light weight and flexible wing leave little margin in gusty or turbulent conditions.",
    instructor: "Pick your weather carefully. A trike rewards calm mornings and punishes gusty afternoons, so the decision to fly is half the skill.",
    safety: "Wind and turbulence are the dominant trike hazards. Flying only in suitable, calm conditions is a core safety practice.",
    terms: [
      ["Open carriage", "The exposed seat-and-engine structure of a trike."],
      ["Wind sensitivity", "The trike's strong reaction to gusts and turbulence."],
      ["Calm conditions", "The smooth air trikes are best flown in."]
    ],
    hook: "Low, slow, and only in calm air.",
    scenario: "A trike pilot considers flying on a gusty, turbulent afternoon. Why is that a poor choice for this type of aircraft?",
    oral: "Describe the conditions trikes are flown in and the dominant hazard to manage.",
    practical: "List what a trike pilot checks during preflight and the weather limits they set.",
    quiz: [
      { type: "mc", q: "Trikes are best flown in:", choices: ["Strong, gusty winds", "Calm, smooth conditions", "Any weather", "Only at night"], answer: 1, why: "Their light weight and flexible wing make calm conditions essential for safe flight." },
      { type: "tf", q: "A trike's flexible wing and open carriage make it sensitive to wind and turbulence.", answer: true, why: "Trikes react readily to gusts, so weather judgment is central to safety." }
    ]
  },

  /* ========================= POWERED PARACHUTE ========================= */
  "pp-intro": {
    title: "What a powered parachute is",
    pathway: "poweredchute", cert: "Powered Parachute Pilot", faa: "phak", acs: "Powered Parachute ACS — Introduction", time: 7,
    explain: [
      "A powered parachute (PPC) is a wheeled carriage with an engine and pusher propeller, flying beneath a large ram-air parachute wing, similar to a paraglider canopy. It is its own FAA aircraft category, with powered parachute land and sea classes, and it is widely considered the simplest powered aircraft to fly.",
      "The fabric canopy inflates into a wing shape in flight and supports the carriage below it. Because the canopy is a soft, self-stabilizing wing, a powered parachute is very stable and forgiving, and it flies low and slow, making it popular for recreation and aerial sightseeing in calm conditions."
    ],
    why: "Understanding that the wing is a soft, inflating canopy explains why a powered parachute flies the simple, stable way it does.",
    mistake: "Thinking of the canopy as just an emergency parachute. In a PPC it is the wing, a deliberately designed ram-air airfoil that the whole aircraft depends on.",
    instructor: "The canopy is your wing, not a backup. It inflates into an airfoil and carries you, and learning to manage it on the ground and in the air is the whole skill.",
    safety: "Like other light aircraft with fabric wings, powered parachutes are wind-sensitive and flown in calm air. Canopy management on launch and landing is key to safety.",
    terms: [
      ["Powered parachute", "A carriage and engine flying beneath a ram-air parachute wing."],
      ["Ram-air canopy", "A self-inflating fabric wing that forms an airfoil in flight."],
      ["PPC land / sea", "The land and sea classes within the powered parachute category."]
    ],
    hook: "A soft wing overhead, a cart and engine below.",
    scenario: "Someone assumes a powered parachute's canopy is just a safety parachute. What is its actual role in the aircraft?",
    oral: "Describe what a powered parachute is and why it is considered simple and stable to fly.",
    practical: "Watch a powered parachute launch and note how the canopy inflates into a wing.",
    quiz: [
      { type: "mc", q: "In a powered parachute, the canopy serves as:", choices: ["An emergency parachute only", "The aircraft's wing", "A drag brake", "Decoration"], answer: 1, why: "The ram-air canopy is the wing that supports the carriage in flight." },
      { type: "tf", q: "A powered parachute is widely considered one of the simplest powered aircraft to fly.", answer: true, why: "Its stable, self-correcting canopy wing makes it simple and forgiving." }
    ]
  },

  "pp-control": {
    title: "How a powered parachute flies",
    pathway: "poweredchute", cert: "Powered Parachute Pilot", faa: "phak", acs: "Powered Parachute ACS — Controls", time: 7,
    explain: [
      "A powered parachute flies at a roughly constant airspeed set by the canopy's design, so the pilot does not control speed in the usual way. Instead, the throttle controls climb and descent: adding power climbs, reducing power descends, and the airspeed stays about the same throughout.",
      "Steering is done with the feet. Foot-operated steering bars pull down the trailing edge on one side of the canopy, turning the aircraft toward that side, much like the brake toggles on a parachute. This simple combination, throttle for altitude and foot bars for direction, is what makes the powered parachute so easy to learn."
    ],
    why: "The throttle-for-altitude and feet-for-steering logic is the essence of flying a powered parachute, and it is unlike the controls of most other aircraft.",
    mistake: "Trying to control airspeed with pitch like an airplane. In a powered parachute, speed is largely fixed and power controls altitude instead.",
    instructor: "Throttle is your up and down; your feet are your left and right. Once that clicks, the powered parachute is about the simplest aircraft there is.",
    safety: "Because power controls altitude, an engine issue means a descent under the canopy. Pilots stay within gliding reach of safe landing areas and manage the canopy carefully.",
    terms: [
      ["Constant airspeed", "The roughly fixed flying speed set by the canopy design."],
      ["Throttle for altitude", "Using power to climb and descend at near-constant airspeed."],
      ["Steering bars", "Foot controls that deflect the canopy to turn."]
    ],
    hook: "Throttle for up and down, feet for left and right.",
    scenario: "A powered parachute pilot wants to climb. Since airspeed is roughly fixed, what control achieves the climb?",
    oral: "Explain how a powered parachute controls altitude and direction.",
    practical: "Describe the control used to climb and the control used to turn a powered parachute.",
    quiz: [
      { type: "mc", q: "In a powered parachute, climbing and descending are controlled mainly by:", choices: ["Pitch", "The throttle", "The canopy size", "Weight shift"], answer: 1, why: "At a near-constant airspeed, throttle controls climb and descent." },
      { type: "tf", q: "A powered parachute is steered using foot-operated bars that deflect the canopy.", answer: true, why: "Foot steering bars pull down a side of the canopy to turn the aircraft." }
    ]
  },

  "pp-certs": {
    title: "Powered parachute certificates and classes",
    pathway: "poweredchute", cert: "Powered Parachute Pilot", faa: "phak", acs: "Powered Parachute ACS — Certification", time: 6,
    explain: [
      "Powered parachute flying is available at the sport pilot and private pilot levels, in a powered parachute category with land and sea classes. The sport pilot route is the usual entry point and matches the simplicity of the aircraft.",
      "At the sport pilot level, a valid U.S. driver's license can satisfy the medical eligibility requirement, under the rule's conditions, the same flexibility other sport pilot operations enjoy. Earning the rating involves training specific to the powered parachute and passing a knowledge test and a practical test."
    ],
    why: "Knowing the certificate options helps a new powered parachute pilot choose between a sport-pilot entry and private privileges.",
    mistake: "Assuming any pilot certificate covers powered parachutes. It is its own category, requiring specific training and a test.",
    instructor: "Most powered parachute pilots begin at sport pilot. Whatever level you pick, you train specifically for this aircraft, simple as it is to fly.",
    safety: "Even the simplest aircraft requires proper training in its specific handling and weather limits. The rating ensures that focused competence.",
    terms: [
      ["PPC land / sea", "The land and sea classes within the powered parachute category."],
      ["Sport pilot PPC", "Operating a powered parachute under sport pilot privileges."],
      ["Driver's-license medical", "Using a valid U.S. driver's license for medical eligibility at the sport level."]
    ],
    hook: "Sport or private — its own simple category.",
    scenario: "A beginner wants the easiest powered aircraft to learn, without an FAA medical exam. Which certificate level and medical option fits?",
    oral: "Describe the certificate levels and classes available for powered parachute flying.",
    practical: "Identify which powered parachute certificate path fits a given pilot's goals.",
    quiz: [
      { type: "mc", q: "Powered parachute flying is available at which certificate levels?", choices: ["Sport and private pilot", "Only ATP", "Only commercial", "Only instructor"], answer: 0, why: "Powered parachute ratings are available at the sport pilot and private pilot levels." },
      { type: "tf", q: "At the sport pilot level, a valid driver's license can meet powered parachute medical eligibility.", answer: true, why: "The driver's-license medical option applies to sport pilot operations, including powered parachutes." }
    ]
  },

  "pp-ops": {
    title: "Powered parachute operations and safety",
    pathway: "poweredchute", cert: "Powered Parachute Pilot", faa: "afh", acs: "Powered Parachute ACS — Operations & safety", time: 6,
    explain: [
      "Powered parachutes are flown low, slow, and in calm conditions, most often in the smooth air of early morning or evening. The canopy must be laid out, inflated, and checked before each flight, and managing it during the launch run and after landing is the part of the operation that demands the most attention.",
      "Wind is the dominant limitation. The large fabric canopy reacts strongly to gusts and turbulence, so pilots fly only in light winds and avoid conditions that could collapse or distort the wing. As always, the pilot preflights the aircraft and operates within personal and aircraft limits."
    ],
    why: "Powered parachute safety centers on canopy management and flying only in calm wind. The aircraft is simple, but the wing demands respect on the ground and in gusts.",
    mistake: "Launching in too much wind. A gusty day can collapse or distort the canopy, and the large soft wing offers little margin in rough air.",
    instructor: "Treat the canopy with care and pick calm air. The flying is easy, but a mishandled launch or a gusty day is where the trouble starts.",
    safety: "Canopy collapse or distortion in gusty wind is the central powered parachute hazard. Light winds and careful canopy handling keep operations safe.",
    terms: [
      ["Canopy management", "Laying out, inflating, and controlling the wing on the ground."],
      ["Light winds", "The calm conditions required for powered parachute flight."],
      ["Launch run", "The ground roll during which the canopy inflates and lift builds."]
    ],
    hook: "Calm air and a well-managed canopy.",
    scenario: "A powered parachute pilot considers launching as the wind picks up and becomes gusty. Why is the large canopy a reason to wait for calmer air?",
    oral: "Describe the conditions powered parachutes are flown in and the main hazard to manage.",
    practical: "List the canopy and aircraft checks a powered parachute pilot performs before flight.",
    quiz: [
      { type: "mc", q: "The dominant limitation for powered parachute operations is:", choices: ["Altitude", "Wind", "Engine power", "Runway length"], answer: 1, why: "The large fabric canopy reacts strongly to wind, making light conditions essential." },
      { type: "tf", q: "Gusty wind can collapse or distort a powered parachute canopy.", answer: true, why: "The soft fabric wing is vulnerable to gusts, so flight is limited to light winds." }
    ]
  }
};
})();
