/* Additional curriculum — in-depth airplane lessons.
   Merged into window.__AV_LESSONS__ at build time. Safe to edit this file directly to
   add or adjust lessons; each key here becomes a lesson and feeds the quiz/exam pools. */
window.__AV_LESSONS__ = Object.assign((window.__AV_LESSONS__ || {}), {

  /* ============================ AERODYNAMICS IN DEPTH ============================ */
  "aero-aoa": {
    title: "Angle of attack & the critical angle",
    pathway: "airplane", cert: "Aerodynamics in Depth", faa: "phak", acs: "PHAK Ch.5 — Aerodynamics of flight", time: 6,
    explain: [
      "Angle of attack (AOA) is the angle between the wing's chord line and the relative wind — the air actually striking the wing. It is NOT the same as pitch attitude (nose position relative to the horizon). You can have a high pitch attitude and low AOA, or a low pitch attitude and a dangerously high AOA, such as in a steep, descending turn.",
      "Lift increases as AOA increases — up to a point. Every wing has a critical angle of attack where the air can no longer flow smoothly over the top and separates into turbulent eddies. At that instant the wing stalls and lift drops sharply, regardless of airspeed, weight, or attitude.",
      "Because the critical AOA is always the same for a given wing, the stall always happens at that angle. That is why an AOA indicator is so valuable: it shows how close you are to the stall directly, while the airspeed at which you stall changes with weight, load factor, and configuration."
    ],
    quiz: [
      { type: "mc", q: "A wing always stalls when it exceeds its:", choices: ["Maximum airspeed", "Critical angle of attack", "Service ceiling", "Maneuvering speed"], answer: 1, why: "A stall is a function of exceeding the critical angle of attack, which is a fixed value for a given wing." },
      { type: "tf", q: "Angle of attack and pitch attitude are the same thing.", answer: false, why: "AOA is measured against the relative wind; pitch attitude is measured against the horizon. They are often different." }
    ]
  },
  "aero-stall": {
    title: "Stalls: cause, warning signs & recovery",
    pathway: "airplane", cert: "Aerodynamics in Depth", faa: "afh", acs: "AFH Ch.4 — Maneuvering / stalls", time: 6,
    explain: [
      "A stall is the loss of lift that occurs when the critical angle of attack is exceeded. It can happen at any airspeed and any attitude — in a climb, a descent, a steep turn, or even inverted. The cure is always the same: reduce the angle of attack by lowering the nose.",
      "Warning signs usually come in order: the stall warning horn or light, then a loss of control effectiveness (mushy controls), buffeting as separated air strikes the tail, and finally a nose drop or wing drop at the full stall. Trainers are designed to give gentle, recoverable stalls.",
      "Recovery: reduce AOA (lower the nose) first, add full power, level the wings with coordinated rudder, and return to level flight while minimizing altitude loss. Stalls close to the ground — on takeoff or a botched landing — are the most dangerous because there is little altitude to recover."
    ],
    quiz: [
      { type: "mc", q: "The first and most important step to recover from a stall is to:", choices: ["Add full power", "Pull back on the yoke", "Reduce the angle of attack", "Retract the flaps"], answer: 2, why: "Reducing AOA reattaches the airflow and restores lift; power and cleanup follow." },
      { type: "tf", q: "An airplane can only stall at low airspeed.", answer: false, why: "Exceeding the critical AOA causes a stall at ANY airspeed, including high-speed accelerated stalls in steep turns." }
    ]
  },
  "aero-spin": {
    title: "Spins & spin recovery",
    pathway: "airplane", cert: "Aerodynamics in Depth", faa: "afh", acs: "AFH Ch.4 — Spin awareness", time: 6,
    explain: [
      "A spin is an aggravated stall in which the airplane descends in a corkscrew path. It requires two ingredients: a stall AND yaw. If one wing is more stalled than the other (uncoordinated flight near the stall), the aircraft can roll and yaw into autorotation.",
      "The classic killer is the cross-control stall in the traffic pattern — for example, skidding the turn from base to final with bottom rudder to tighten the turn. Staying coordinated (ball centered) near the stall is the best spin prevention.",
      "A common recovery is the PARE method: Power idle, Ailerons neutral, Rudder full opposite to the rotation, Elevator forward to break the stall. Once rotation stops, neutralize the rudder and recover from the dive. Always follow the specific procedure in your aircraft's POH."
    ],
    quiz: [
      { type: "mc", q: "A spin requires a stall plus:", choices: ["High airspeed", "Yaw", "Full flaps", "A tailwind"], answer: 1, why: "Spins need both a stalled wing and yaw, which produces autorotation." },
      { type: "tf", q: "Skidding a base-to-final turn with bottom rudder increases the risk of a spin.", answer: true, why: "Cross-controlled, uncoordinated flight near the stall is a leading cause of stall/spin accidents in the pattern." }
    ]
  },
  "aero-loadfactor": {
    title: "Load factor, G-forces & maneuvering speed",
    pathway: "airplane", cert: "Aerodynamics in Depth", faa: "phak", acs: "PHAK Ch.5 — Load factors", time: 6,
    explain: [
      "Load factor is the ratio of lift to the airplane's weight, expressed in G's. In level flight it is 1G. In a turn, lift must both support the airplane and pull it around, so load factor rises — about 2G in a 60-degree bank. Stall speed increases with the square root of load factor, so a 2G turn raises stall speed roughly 41 percent.",
      "Maneuvering speed (Va) is the highest speed at which an abrupt, full control input will not overstress the airframe — because the wing will stall before it can generate a damaging load. Below Va the wing protects you; above Va, abrupt control inputs or turbulence can bend or break the structure.",
      "Va decreases at lighter weights. A lighter airplane stalls at a lower load, so it reaches the limit load sooner. This is why Va is lower when you are light — counterintuitive but important in turbulence."
    ],
    quiz: [
      { type: "mc", q: "In a level 60-degree bank turn, load factor is approximately:", choices: ["1G", "1.5G", "2G", "4G"], answer: 2, why: "A 60-degree bank in level flight produces about 2G and raises stall speed by roughly 41 percent." },
      { type: "tf", q: "Maneuvering speed (Va) is lower at lighter aircraft weights.", answer: true, why: "A lighter airplane reaches its limit load factor sooner, so Va decreases as weight decreases." }
    ]
  },
  "aero-stability": {
    title: "Stability, trim & control feel",
    pathway: "airplane", cert: "Aerodynamics in Depth", faa: "phak", acs: "PHAK Ch.5 — Stability", time: 5,
    explain: [
      "Stability is the airplane's tendency to return to a trimmed condition after a disturbance. Positive static stability means it initially returns toward where it started; positive dynamic stability means the oscillations dampen out over time. Most trainers are designed to be positively stable so they are forgiving.",
      "Longitudinal (pitch) stability is strongly affected by the center of gravity. A forward CG makes the airplane more stable but heavier in pitch and raises stall speed; an aft CG makes it less stable and can make stalls and spins harder to recover. That is why CG limits matter.",
      "Trim relieves control pressures so you do not have to hold force on the yoke. Set pitch attitude and power first, then trim off the remaining pressure. Good trim technique reduces fatigue and makes precise flying far easier."
    ],
    quiz: [
      { type: "mc", q: "An aft center of gravity generally makes an airplane:", choices: ["More stable and easier to recover from spins", "Less stable and harder to recover from spins", "Unable to take off", "Heavier on the controls"], answer: 1, why: "An aft CG reduces longitudinal stability and can make stall/spin recovery more difficult." },
      { type: "tf", q: "Trim is used to relieve the control pressures you would otherwise have to hold.", answer: true, why: "Trim sets a control surface so the airplane maintains an attitude without constant yoke force." }
    ]
  },
  "aero-leftturn": {
    title: "The four left-turning tendencies",
    pathway: "airplane", cert: "Aerodynamics in Depth", faa: "phak", acs: "PHAK Ch.5 — Torque and P-factor", time: 5,
    explain: [
      "Single-engine propeller airplanes with a clockwise-turning prop (as seen from the cockpit) tend to yaw left, especially at high power and high AOA. Four effects combine: torque reaction, the spiraling slipstream, P-factor, and gyroscopic precession.",
      "Torque reaction is the equal-and-opposite roll to the left from the engine turning the prop right. The spiraling slipstream corkscrews back and strikes the left side of the vertical fin, pushing the tail right and the nose left. P-factor is the descending (right) blade taking a bigger bite at high AOA, pulling the nose left.",
      "Gyroscopic precession shows up mainly in tailwheel airplanes when the tail is raised — the precessed force yaws the nose left. The fix for all of them on takeoff and climb is right rudder to keep the airplane coordinated."
    ],
    quiz: [
      { type: "mc", q: "During a full-power climb, a single-engine airplane tends to yaw left and the pilot corrects with:", choices: ["Left rudder", "Right rudder", "Left aileron", "Forward elevator"], answer: 1, why: "The left-turning tendencies are strongest at high power and high AOA; right rudder keeps the airplane coordinated." },
      { type: "tf", q: "P-factor is strongest at high angles of attack and high power.", answer: true, why: "At high AOA the descending blade generates more thrust than the ascending blade, yawing the nose left." }
    ]
  },
  "aero-groundeffect": {
    title: "Ground effect",
    pathway: "airplane", cert: "Aerodynamics in Depth", faa: "phak", acs: "PHAK Ch.5 — Ground effect", time: 4,
    explain: [
      "Within about one wingspan of the surface, the ground interferes with the wingtip vortices and downwash. This reduces induced drag, so the wing becomes temporarily more efficient. The airplane feels like it wants to float just above the runway.",
      "On landing, ground effect is why you float during the flare if you carry too much speed. On takeoff, an airplane can lift off in ground effect at a speed too slow to climb out of it — a trap on hot days or short, soft fields, where it settles back as it climbs out of ground effect.",
      "Manage it with proper approach speed and patience: let the airplane decelerate in the flare, and on takeoff, accelerate in ground effect to a safe climb speed before climbing away."
    ],
    quiz: [
      { type: "mc", q: "Ground effect reduces:", choices: ["Parasite drag", "Induced drag", "Weight", "Thrust"], answer: 1, why: "Ground effect interferes with wingtip vortices and downwash, reducing induced drag near the surface." },
      { type: "tf", q: "An airplane can become airborne in ground effect below a speed that will sustain a climb.", answer: true, why: "Lifting off too slowly can cause the airplane to settle back as it climbs out of ground effect." }
    ]
  },

  /* ============================ AIRCRAFT SYSTEMS ============================ */
  "sys-engine": {
    title: "The piston engine & the four-stroke cycle",
    pathway: "airplane", cert: "Aircraft Systems", faa: "phak", acs: "PHAK Ch.7 — Aircraft systems", time: 6,
    explain: [
      "Most training airplanes use a four-stroke, air-cooled, horizontally-opposed piston engine. The four strokes are intake, compression, power, and exhaust — the same Otto cycle as a car, but built for reliability with dual ignition and simple controls.",
      "The throttle controls power by metering the fuel-air mixture into the cylinders. The mixture control adjusts the ratio of fuel to air, which matters because air thins with altitude. Engine instruments — tachometer (RPM), oil pressure, and oil temperature — tell you the engine is healthy.",
      "Aircraft engines are air-cooled, so cooling depends on airflow. Prolonged high-power climbs at low airspeed can overheat the engine (shock the cylinders the opposite way on rapid descents). Smooth power changes and proper cowl-flap or airspeed management keep temperatures in the green."
    ],
    quiz: [
      { type: "mc", q: "The four strokes of a typical aircraft piston engine are intake, compression, power, and:", choices: ["Ignition", "Exhaust", "Combustion", "Cooling"], answer: 1, why: "The Otto four-stroke cycle is intake, compression, power, and exhaust." },
      { type: "tf", q: "Most training airplane engines are liquid-cooled like a car.", answer: false, why: "Most are air-cooled, relying on airflow over the cylinders for cooling." }
    ]
  },
  "sys-ignition": {
    title: "Ignition, magnetos & the mag check",
    pathway: "airplane", cert: "Aircraft Systems", faa: "phak", acs: "PHAK Ch.7 — Ignition system", time: 5,
    explain: [
      "Aircraft engines use two magnetos, each firing its own set of spark plugs. Magnetos are engine-driven and self-contained, so the engine keeps running even with a total electrical failure. Dual ignition also improves combustion and provides redundancy.",
      "During run-up you check each magneto individually. A small RPM drop on each mag is normal; the engine should run a little rougher on one mag (you are running on half the plugs). An excessive drop, no drop, or a large difference between mags signals a problem.",
      "Because magnetos can fire even with the master off, a propeller must always be treated as live. The ignition switch grounds the magnetos to stop them; a broken P-lead can leave a mag hot. Never hand-prop or move a prop carelessly."
    ],
    quiz: [
      { type: "mc", q: "Why do aircraft engines use magnetos instead of relying on the battery for ignition?", choices: ["They are cheaper", "They keep the engine running even with electrical failure", "They burn less fuel", "They are required for radios"], answer: 1, why: "Magnetos are self-contained and engine-driven, so ignition continues independent of the electrical system." },
      { type: "tf", q: "During the mag check, a small RPM drop on each magneto is normal.", answer: true, why: "Running on one mag uses half the spark plugs, so a small, roughly equal RPM drop is expected." }
    ]
  },
  "sys-fuel": {
    title: "Fuel system, grades & contamination",
    pathway: "airplane", cert: "Aircraft Systems", faa: "phak", acs: "PHAK Ch.7 — Fuel systems", time: 5,
    explain: [
      "Fuel feeds from the tanks to the engine either by gravity (high-wing) or by pump (low-wing, which adds an electric boost pump for starting and backup). The fuel selector lets you draw from left, right, both, or off. Mismanaging the selector is a needless cause of engine stoppage.",
      "Aviation gasoline is dyed by grade: 100LL (low-lead) is blue. Using the wrong grade or, worse, jet fuel in a piston engine is dangerous. Always confirm the correct fuel and quantity, and never assume the tanks are full.",
      "Before every flight, drain fuel from the sumps and check it for water (which sinks below the fuel and appears as clear bubbles), sediment, and the correct color and smell. Water in the fuel from condensation or rain is a common, preventable hazard."
    ],
    quiz: [
      { type: "mc", q: "The color of 100LL avgas is:", choices: ["Clear", "Red", "Blue", "Green"], answer: 2, why: "100LL low-lead aviation gasoline is dyed blue." },
      { type: "tf", q: "Water in fuel is heavier than avgas and collects at the bottom of the sump.", answer: true, why: "Water sinks below the fuel, which is why you drain and inspect the sumps before flight." }
    ]
  },
  "sys-carb": {
    title: "Mixture, carburetors & carb ice",
    pathway: "airplane", cert: "Aircraft Systems", faa: "phak", acs: "PHAK Ch.7 — Induction / carburetor ice", time: 6,
    explain: [
      "The mixture control sets the fuel-to-air ratio. As you climb, the air thins but the carburetor keeps adding the same fuel, so the mixture becomes too rich. Leaning restores the correct ratio for smooth running and fuel economy. You enrich (push the mixture in) before descending into thicker air or adding full power for go-arounds.",
      "A carburetor can form ice even on warm days. As fuel vaporizes and air accelerates through the venturi, the temperature drops sharply; with visible moisture or high humidity, ice forms in the throat and chokes the engine. Symptoms in a fixed-pitch airplane are a gradual RPM loss and rough running.",
      "Carburetor heat routes warm air into the carburetor to melt the ice. Apply full carb heat at the first sign of ice (or as a checklist item at low power, like on approach). Fuel-injected engines do not have this carburetor-ice risk, though they can suffer induction or impact icing."
    ],
    quiz: [
      { type: "mc", q: "In a fixed-pitch propeller airplane, a symptom of carburetor ice is:", choices: ["Rising oil pressure", "A gradual loss of RPM and rough running", "Increased airspeed", "A drop in fuel quantity"], answer: 1, why: "Carb ice restricts the induction air, causing a gradual RPM loss and roughness; carb heat is the remedy." },
      { type: "tf", q: "Carburetor ice can form on warm, humid days.", answer: true, why: "The temperature drop in the venturi can be 30+ degrees, so ice can form well above freezing ambient temperatures." }
    ]
  },
  "sys-electrical": {
    title: "The electrical system",
    pathway: "airplane", cert: "Aircraft Systems", faa: "phak", acs: "PHAK Ch.7 — Electrical system", time: 5,
    explain: [
      "A typical airplane has a battery and an engine-driven alternator (or generator) feeding a bus that powers radios, lights, instruments, and electric gauges. The master switch connects the battery and alternator to the bus. The ammeter or loadmeter shows whether the alternator is charging.",
      "Because the magnetos are independent, the engine keeps running if the electrical system fails — but you lose radios, electric instruments, flaps (if electric), and most lighting. An alternator failure means you are running on battery alone, so you shed nonessential loads to extend the remaining power.",
      "Circuit breakers protect individual circuits and pop when overloaded. You may reset a breaker once if it is safe and the circuit is needed; repeated tripping means leave it alone. Knowing what is on each bus helps you prioritize in a failure."
    ],
    quiz: [
      { type: "mc", q: "If the alternator fails in flight, the airplane will:", choices: ["Lose engine power immediately", "Continue running the engine on the magnetos while draining the battery", "Be unable to glide", "Stall"], answer: 1, why: "Ignition is from the magnetos, so the engine runs; electrical loads now draw down the battery." },
      { type: "tf", q: "A circuit breaker that keeps tripping should be repeatedly reset until it holds.", answer: false, why: "Repeated tripping indicates a fault; resetting more than once risks fire and should be avoided." }
    ]
  },
  "sys-pitotstatic": {
    title: "The pitot-static system",
    pathway: "airplane", cert: "Aircraft Systems", faa: "phak", acs: "PHAK Ch.8 — Flight instruments", time: 6,
    explain: [
      "Three instruments run on air pressure: the airspeed indicator, altimeter, and vertical speed indicator. The pitot tube senses ram (dynamic) pressure; static ports sense ambient (static) pressure. The airspeed indicator compares the two; the altimeter and VSI use static pressure only.",
      "Blockages cause classic, testable failures. If the pitot tube ices over but the drain stays open, airspeed drops to zero. If both the pitot ram inlet and drain block, the airspeed indicator acts like an altimeter — reading higher as you climb and lower as you descend. A blocked static port freezes the altimeter and makes airspeed read incorrectly.",
      "Pitot heat melts ice in the pitot tube and is essential in visible moisture near freezing. If the static port blocks, the alternate static source (often cabin air) restores the instruments, though readings shift slightly. Knowing these failure patterns is a favorite exam topic."
    ],
    quiz: [
      { type: "mc", q: "Which instruments operate from the static system alone?", choices: ["Airspeed indicator and tachometer", "Altimeter and vertical speed indicator", "Attitude indicator and heading indicator", "Turn coordinator"], answer: 1, why: "The altimeter and VSI use static pressure; the airspeed indicator also needs pitot (ram) pressure." },
      { type: "tf", q: "If both the pitot ram inlet and its drain hole become blocked, the airspeed indicator behaves like an altimeter.", answer: true, why: "Trapped pressure makes airspeed increase in a climb and decrease in a descent, mimicking an altimeter." }
    ]
  },
  "sys-prop": {
    title: "Propellers: fixed-pitch & constant-speed",
    pathway: "airplane", cert: "Aircraft Systems", faa: "phak", acs: "PHAK Ch.7 — Propeller", time: 5,
    explain: [
      "A propeller is a rotating airfoil; each blade produces thrust like a wing produces lift. A fixed-pitch prop has one blade angle, so the tachometer (RPM) is your only power gauge and the throttle controls everything.",
      "A constant-speed propeller lets the pilot select a blade angle with a propeller control while a governor holds a chosen RPM. You set manifold pressure with the throttle and RPM with the prop control, like a transmission. Lower RPM with higher manifold pressure is an efficient cruise setting.",
      "A common rule for power changes on a constant-speed prop is to avoid over-boosting: when increasing power, prop (RPM) up first then throttle up; when decreasing, throttle back first then prop back. Always follow your POH numbers."
    ],
    quiz: [
      { type: "mc", q: "On an airplane with a constant-speed propeller, RPM is controlled by the:", choices: ["Throttle", "Propeller control and governor", "Mixture", "Carb heat"], answer: 1, why: "The propeller control commands the governor to hold a selected RPM; the throttle sets manifold pressure." },
      { type: "tf", q: "A fixed-pitch propeller airplane uses the tachometer as its primary power indicator.", answer: true, why: "With a single blade angle, RPM reflects power, so the tachometer is the main reference." }
    ]
  },

  /* ============================ FLIGHT INSTRUMENTS ============================ */
  "inst-altimeter": {
    title: "The altimeter & types of altitude",
    pathway: "airplane", cert: "Flight Instruments", faa: "phak", acs: "PHAK Ch.8 — Pitot-static instruments", time: 6,
    explain: [
      "The altimeter is an aneroid barometer that reads altitude from static pressure. Because pressure changes with weather, you set the current altimeter setting (in the Kollsman window) so the instrument reads field elevation. A common memory aid: from high pressure to low, or hot to cold, look out below — the altimeter reads higher than you actually are.",
      "Several altitudes matter. Indicated altitude is what the altimeter shows with the proper setting. True altitude is the real height above sea level. Pressure altitude is the height above the standard datum plane (set 29.92), used for performance and at high altitude. Density altitude is pressure altitude corrected for temperature and drives aircraft performance.",
      "Always update the altimeter setting from ATIS, AWOS, or ATC, especially on long flights. A setting that is too high makes you fly lower than indicated; near terrain or in cold weather this margin can be deadly."
    ],
    quiz: [
      { type: "mc", q: "Flying from a high-pressure area into a lower-pressure area without resetting the altimeter, the altimeter will:", choices: ["Read lower than you actually are", "Read higher than you actually are", "Read correctly", "Freeze"], answer: 1, why: "From high to low pressure, the altimeter over-reads — you are actually lower than indicated." },
      { type: "mc", q: "Which altitude is used as the basis for performance calculations after correcting for temperature?", choices: ["Indicated altitude", "True altitude", "Density altitude", "Absolute altitude"], answer: 2, why: "Density altitude (pressure altitude corrected for nonstandard temperature) determines performance." }
    ]
  },
  "inst-airspeed": {
    title: "Airspeed indicator: V-speeds & color arcs",
    pathway: "airplane", cert: "Flight Instruments", faa: "phak", acs: "PHAK Ch.8 — Airspeed indicator", time: 6,
    explain: [
      "The airspeed indicator's color arcs encode limits. The white arc is the flap operating range, from the flaps-down stall speed (Vs0) to the maximum flap-extension speed (Vfe). The green arc is the normal operating range, from the clean stall speed (Vs1) to the maximum structural cruising speed (Vno).",
      "The yellow arc is the caution range — smooth air only. The red line is Vne, the never-exceed speed. Flying in the yellow arc in turbulence, or beyond the red line at all, risks structural damage.",
      "Several V-speeds are not marked but are vital: Vx (best angle of climb, most altitude per distance — clears obstacles), Vy (best rate of climb, most altitude per time), Va (maneuvering speed), and Vg (best glide). Know your airplane's numbers cold."
    ],
    quiz: [
      { type: "mc", q: "The white arc on the airspeed indicator represents the:", choices: ["Never-exceed range", "Flap operating range", "Best glide range", "Caution range"], answer: 1, why: "The white arc runs from Vs0 (flaps-down stall) to Vfe (max flap extension speed)." },
      { type: "mc", q: "Vx is the speed for:", choices: ["Best rate of climb (altitude per time)", "Best angle of climb (altitude per distance)", "Best glide", "Maneuvering"], answer: 1, why: "Vx gives the most altitude gained per unit of horizontal distance, useful for clearing obstacles." }
    ]
  },
  "inst-gyro": {
    title: "Gyroscopic instruments",
    pathway: "airplane", cert: "Flight Instruments", faa: "phak", acs: "PHAK Ch.8 — Gyroscopic instruments", time: 5,
    explain: [
      "Three instruments use spinning gyros: the attitude indicator (pitch and bank), the heading indicator (a stable compass card), and the turn coordinator or turn-and-slip (rate of turn and coordination). Older airplanes spin these gyros with engine-driven vacuum; glass cockpits use solid-state sensors instead.",
      "The heading indicator drifts over time and must be reset to the magnetic compass during straight-and-level, unaccelerated flight, usually about every 15 minutes. The attitude indicator can show small errors during rapid acceleration or steep maneuvers but settles quickly.",
      "The inclinometer (the ball) shows coordination. Step on the ball — apply rudder toward the side the ball has slipped — to keep flight coordinated. A centered ball means the rudder and bank are working together."
    ],
    quiz: [
      { type: "mc", q: "The heading indicator should be reset to the magnetic compass:", choices: ["Only before takeoff", "During straight-and-level, unaccelerated flight about every 15 minutes", "Never", "Only in turns"], answer: 1, why: "Gyroscopic precession causes drift, so realign in stable flight roughly every 15 minutes." },
      { type: "tf", q: "To correct a slip or skid, you 'step on the ball.'", answer: true, why: "Applying rudder toward the displaced ball recenters it and coordinates the flight." }
    ]
  },
  "inst-compass": {
    title: "The magnetic compass & its errors",
    pathway: "airplane", cert: "Flight Instruments", faa: "phak", acs: "PHAK Ch.8 — Magnetic compass", time: 5,
    explain: [
      "The magnetic compass is simple and needs no power, but it has predictable errors. On a northerly or southerly heading it lags and leads during turns; the memory aid UNOS means Undershoot North, Overshoot South — roll out before the heading when turning to north, and after it when turning to south.",
      "Acceleration and deceleration cause errors on east or west headings. ANDS means Accelerate North, Decelerate South — speeding up swings the compass toward north, slowing down swings it toward south, even though your heading has not changed.",
      "The compass only reads accurately in straight-and-level, unaccelerated flight. Because of these quirks, pilots use the heading indicator for turns and use the compass to set and cross-check it."
    ],
    quiz: [
      { type: "mc", q: "When accelerating on an easterly heading, the magnetic compass tends to indicate a turn toward:", choices: ["South", "North", "East", "West"], answer: 1, why: "ANDS: Accelerate North, Decelerate South describes the acceleration error on east/west headings." },
      { type: "tf", q: "The magnetic compass reads accurately only in straight-and-level, unaccelerated flight.", answer: true, why: "Turning, accelerating, and decelerating all introduce temporary compass errors." }
    ]
  },

  /* ============================ WEATHER DEEP DIVE ============================ */
  "wx-atmosphere": {
    title: "The atmosphere & altimetry",
    pathway: "airplane", cert: "Weather Deep Dive", faa: "phak", acs: "PHAK Ch.12 — Weather theory", time: 5,
    explain: [
      "The standard atmosphere is a reference: 59 degrees Fahrenheit (15 Celsius) and 29.92 inches of mercury at sea level, with temperature decreasing about 2 degrees Celsius per 1,000 feet and pressure decreasing about 1 inch of mercury per 1,000 feet. Real conditions vary, which is why we measure and correct.",
      "Air flows from high pressure to low pressure, but the Coriolis effect deflects it, creating the circulation around highs and lows. Around a low-pressure system (in the Northern Hemisphere) winds flow counterclockwise and inward, usually bringing clouds and unsettled weather; highs bring sinking air and generally fair skies.",
      "Because pressure and temperature change constantly, your altimeter needs current settings and your performance depends on density altitude. Understanding the standard atmosphere lets you predict how the airplane and instruments will behave."
    ],
    quiz: [
      { type: "mc", q: "Standard sea-level pressure and temperature are:", choices: ["29.92 inHg and 15 C", "30.00 inHg and 0 C", "29.92 inHg and 59 C", "28.00 inHg and 15 F"], answer: 0, why: "The standard atmosphere is 29.92 inches of mercury and 15 degrees Celsius (59 F) at sea level." },
      { type: "tf", q: "Around a low-pressure system in the Northern Hemisphere, surface winds flow counterclockwise and inward.", answer: true, why: "Coriolis deflection produces inflow and counterclockwise rotation around Northern Hemisphere lows." }
    ]
  },
  "wx-stability2": {
    title: "Stability, temperature & moisture",
    pathway: "airplane", cert: "Weather Deep Dive", faa: "phak", acs: "PHAK Ch.12 — Atmospheric stability", time: 5,
    explain: [
      "A stable atmosphere resists vertical motion; an unstable one encourages it. Stability depends on the lapse rate — how fast temperature drops with height. When the air cools quickly with altitude, rising parcels stay warmer than their surroundings and keep rising, producing cumulus clouds, good visibility, gusty winds, and showery precipitation.",
      "Stable air produces stratus clouds, steady precipitation, poor visibility (haze, fog), and smooth flight. The dewpoint tells you how much cooling it takes to reach saturation; a small temperature-dewpoint spread means clouds, fog, or mist are likely.",
      "Watching the temperature-dewpoint spread is a practical forecasting tool. As the spread narrows toward evening, expect fog or low stratus, especially over moist ground and in valleys."
    ],
    quiz: [
      { type: "mc", q: "Unstable air is typically associated with:", choices: ["Stratus clouds and steady rain", "Cumulus clouds and showery precipitation", "Smooth air and poor visibility", "Persistent fog"], answer: 1, why: "Instability drives vertical development: cumulus clouds, turbulence, good visibility, and showers." },
      { type: "tf", q: "A small temperature-dewpoint spread suggests fog or low clouds are likely.", answer: true, why: "When temperature and dewpoint converge, the air is near saturation and condensation is likely." }
    ]
  },
  "wx-fronts2": {
    title: "Air masses & fronts",
    pathway: "airplane", cert: "Weather Deep Dive", faa: "phak", acs: "PHAK Ch.12 — Air masses and fronts", time: 6,
    explain: [
      "A front is the boundary between two air masses of different temperature and moisture. A warm front is warm air overtaking cold air; it slopes gently, bringing widespread layered clouds, steady precipitation, and lowering ceilings well ahead of the front.",
      "A cold front is cold air pushing under warm air; it is steeper and faster, often producing a narrow band of towering cumulus or thunderstorms, gusty winds, and a sharp wind shift, followed by clearing and cooler, drier air. An occluded front combines features of both.",
      "Expect the wind to shift as a front passes, and plan for turbulence and changing ceilings. Knowing which front is coming tells you whether to expect a long stretch of low IFR (warm front) or a brief but violent line of weather (cold front)."
    ],
    quiz: [
      { type: "mc", q: "Compared with a warm front, a fast-moving cold front more often brings:", choices: ["Widespread steady rain and gradual clearing", "A narrow band of showers or thunderstorms and gusty winds", "Persistent fog for days", "No weather changes"], answer: 1, why: "Cold fronts lift warm air steeply, producing a narrow but intense band of weather and a sharp wind shift." },
      { type: "tf", q: "Wind direction typically shifts as a front passes.", answer: true, why: "A change in wind direction is one of the most reliable indicators that a front has passed." }
    ]
  },
  "wx-thunderstorms2": {
    title: "Thunderstorms & microbursts",
    pathway: "airplane", cert: "Weather Deep Dive", faa: "phak", acs: "PHAK Ch.12 — Thunderstorms", time: 6,
    explain: [
      "A thunderstorm needs three ingredients: moisture, unstable air, and a lifting force. It grows through a cumulus (updraft) stage, a mature stage (updrafts and downdrafts, heavy rain, lightning, and the greatest hazard), and a dissipating stage. Never fly through, under, or near a building thunderstorm.",
      "The most dangerous low-altitude hazard is the microburst — a violent, localized downdraft that spreads out at the surface. An airplane flying through one first gets a performance-increasing headwind, then a sudden, severe performance-decreasing tailwind and downdraft that can exceed the airplane's climb ability near the ground.",
      "Give thunderstorms a wide berth — at least 20 nautical miles from severe cells. Avoid taking off or landing when a storm is near the field, and remember that hail and severe turbulence can be thrown far outside the visible cloud."
    ],
    quiz: [
      { type: "mc", q: "The thunderstorm stage with the greatest hazards (heavy rain, lightning, and both updrafts and downdrafts) is the:", choices: ["Cumulus stage", "Mature stage", "Dissipating stage", "Cirrus stage"], answer: 1, why: "The mature stage has coexisting strong updrafts and downdrafts, the most violent conditions." },
      { type: "tf", q: "A microburst can produce a sudden, severe tailwind and downdraft hazardous near the ground.", answer: true, why: "After an initial headwind, the airplane meets a strong tailwind and sinking air that can overwhelm climb performance." }
    ]
  },
  "wx-icing2": {
    title: "Icing & how to avoid it",
    pathway: "airplane", cert: "Weather Deep Dive", faa: "phak", acs: "PHAK Ch.12 — Icing", time: 5,
    explain: [
      "Structural icing needs two things: visible moisture (clouds, rain, drizzle) and a surface temperature at or below freezing. Ice on the wings and tail destroys lift, adds weight, increases drag, and can jam controls. Most training airplanes are not approved for flight into known icing.",
      "Clear ice forms from large supercooled drops that flow back before freezing into a heavy, hard glaze; rime ice forms from small drops freezing on contact into a rough, milky deposit; mixed ice is both. Freezing rain is especially dangerous because liquid drops freeze on impact and can coat the airframe quickly.",
      "Induction icing (carburetor ice or blocked air inlets) can choke the engine even without structural ice. The best defense is avoidance: do not fly into visible moisture near freezing, and if you encounter ice, change altitude or course to warmer or drier air and exit the conditions."
    ],
    quiz: [
      { type: "mc", q: "Structural icing requires visible moisture and:", choices: ["High humidity only", "A surface temperature at or below freezing", "Turbulence", "Strong sunlight"], answer: 1, why: "Ice accretes when an aircraft surface at or below 0 C meets visible moisture." },
      { type: "tf", q: "Most training airplanes are certified for flight into known icing.", answer: false, why: "Typical trainers are not approved for known icing; the correct response is to avoid or exit the conditions." }
    ]
  },
  "wx-reports": {
    title: "METARs, TAFs & PIREPs",
    pathway: "airplane", cert: "Weather Deep Dive", faa: "aim", acs: "AIM Ch.7 — Weather products", time: 6,
    explain: [
      "A METAR is observed weather, usually issued hourly. It reads in order: station, day/time in Zulu, wind, visibility, weather, sky condition (FEW, SCT, BKN, OVC with heights in hundreds of feet), temperature/dewpoint in Celsius, and altimeter setting (in the US, an A followed by inches of mercury, e.g., A2992).",
      "A TAF is a forecast for the area within about five statute miles of an airport, typically covering 24 to 30 hours, using similar codes plus change groups like FM (from), TEMPO (temporary), and BECMG (becoming). A ceiling is the lowest broken or overcast layer.",
      "PIREPs are pilot reports of actual conditions — turbulence, icing, cloud tops, ride quality. They fill gaps between stations and are some of the most useful real-time weather you can get. File one when you see something; read them when you plan."
    ],
    quiz: [
      { type: "mc", q: "In a METAR, 'BKN' followed by a number indicates:", choices: ["Wind speed in knots", "A broken cloud layer with height in hundreds of feet", "Visibility in miles", "Temperature in Celsius"], answer: 1, why: "BKN means a broken layer; the number is height in hundreds of feet above the field." },
      { type: "tf", q: "A TAF is an observed report of current weather.", answer: false, why: "A TAF is a forecast; the METAR is the observed report." }
    ]
  },

  /* ============================ NAVIGATION ============================ */
  "nav-charts2": {
    title: "Sectional charts & latitude/longitude",
    pathway: "airplane", cert: "Navigation", faa: "phak", acs: "PHAK Ch.16 — Navigation", time: 6,
    explain: [
      "VFR sectional charts pack a lot into color and symbols. Blue and magenta lines and tints show airspace; numbers and figures show terrain elevation, obstacle heights, and the maximum elevation figure for each quadrant. Airport symbols, frequencies, and runway information are printed right on the chart.",
      "Position is given in latitude (north-south, parallels, 0 at the equator to 90 at the poles) and longitude (east-west, meridians, 0 at Greenwich to 180). One minute of latitude equals one nautical mile, a handy fact for measuring distance.",
      "Always use a current chart — airspace, frequencies, and obstacles change. Reading a sectional fluently lets you plan a route, spot terrain and airspace, and find the information you need without fumbling in flight."
    ],
    quiz: [
      { type: "mc", q: "One minute of latitude equals approximately:", choices: ["One statute mile", "One nautical mile", "One kilometer", "Ten nautical miles"], answer: 1, why: "One minute of latitude equals one nautical mile, useful for quick distance estimates." },
      { type: "tf", q: "Lines of longitude (meridians) run east and west of the prime meridian at Greenwich.", answer: true, why: "Longitude is measured 0 to 180 degrees east and west of the Greenwich prime meridian." }
    ]
  },
  "nav-ded": {
    title: "Pilotage, dead reckoning & the wind triangle",
    pathway: "airplane", cert: "Navigation", faa: "phak", acs: "PHAK Ch.16 — Navigation systems", time: 6,
    explain: [
      "Pilotage is navigating by looking outside and matching landmarks to the chart — rivers, roads, towns, lakes. Dead reckoning is navigating by calculation: from a known position, you compute heading and time using true airspeed, wind, and your planned course. Together they are the foundation of cross-country flying.",
      "Wind blows you off course, so you must crab into it to track the desired line over the ground. The wind correction angle, groundspeed, and time en route come from the wind triangle, which you can solve with an E6B flight computer or an app. Headwinds slow you; tailwinds speed you up.",
      "Even with GPS, pilotage and dead reckoning keep you aware and provide a backup if the avionics fail. Pick prominent checkpoints, note your time between them, and adjust your estimates as the actual winds reveal themselves."
    ],
    quiz: [
      { type: "mc", q: "Navigating by reference to landmarks and the chart is called:", choices: ["Dead reckoning", "Pilotage", "Triangulation", "Radar vectoring"], answer: 1, why: "Pilotage uses visual landmarks; dead reckoning uses computed heading, speed, time, and wind." },
      { type: "tf", q: "A pilot crabs into the wind to track the desired course over the ground.", answer: true, why: "The wind correction angle offsets drift so the airplane's ground track stays on the planned line." }
    ]
  },
  "nav-radio": {
    title: "VOR, GPS & radio navigation",
    pathway: "airplane", cert: "Navigation", faa: "phak", acs: "PHAK Ch.16 — Radio navigation", time: 6,
    explain: [
      "A VOR (VHF Omnidirectional Range) is a ground station that broadcasts 360 radials. In the cockpit you select a course with the OBS and fly to center the needle, with a TO or FROM flag showing which way the station lies. VORs require line of sight and are limited by distance and altitude.",
      "GPS uses a constellation of satellites to give precise position, distance, and groundspeed anywhere, and powers modern moving maps and RNAV procedures. It is accurate and easy, but you should cross-check it and be ready for an outage; keep your situational awareness with the chart.",
      "Know the basics of tuning, identifying a station by its Morse code identifier, and interpreting the course deviation indicator. Whether you fly VOR, GPS, or both, the goal is the same: know where you are and where you are going."
    ],
    quiz: [
      { type: "mc", q: "A VOR provides navigation by transmitting:", choices: ["Satellite ranging signals", "360 radials a pilot can select and track", "Weather data only", "Voice weather broadcasts"], answer: 1, why: "A VOR defines 360 radials; the pilot selects and tracks one with the OBS and CDI." },
      { type: "tf", q: "Before relying on a VOR for navigation, a pilot should identify the station by its Morse code identifier.", answer: true, why: "Confirming the Morse identifier ensures the correct, in-service station is being received." }
    ]
  },
  "nav-xc": {
    title: "Planning a cross-country",
    pathway: "airplane", cert: "Navigation", faa: "phak", acs: "PHAK Ch.16 — Flight planning", time: 6,
    explain: [
      "Planning a cross-country ties everything together. Pick a route that avoids hazardous terrain and airspace, choose checkpoints, and use the winds aloft forecast to compute headings, groundspeeds, and times for each leg. Then calculate fuel required, including required reserves, plus a comfortable margin.",
      "Check weather (METARs, TAFs, winds aloft, AIRMETs/SIGMETs), NOTAMs, airport information, and required documents. Confirm your aircraft's performance for the runways, density altitude, and weight and balance. File a flight plan and know your alternates.",
      "In the air, fly the plan but stay flexible: note actual times at checkpoints, revise your estimates, and update fuel and weather thinking. A good plan plus honest in-flight reassessment is what keeps cross-country flying safe."
    ],
    quiz: [
      { type: "mc", q: "Headings and groundspeeds for a cross-country are computed using the:", choices: ["Altimeter setting", "Winds aloft forecast", "Tachometer", "Sky condition"], answer: 1, why: "Winds aloft drive the wind correction angle, groundspeed, and time for each leg." },
      { type: "tf", q: "Fuel planning must include the required reserves, not just the fuel to reach the destination.", answer: true, why: "Regulations require landing with specified reserves, and prudent pilots add a margin beyond that." }
    ]
  },

  /* ============================ REGULATIONS & CURRENCY ============================ */
  "reg-docs": {
    title: "Required documents & inspections",
    pathway: "airplane", cert: "Regulations & Currency", faa: "cfr91", acs: "14 CFR 91.203, 91.409", time: 5,
    explain: [
      "An airworthy airplane must carry certain documents, remembered as ARROW: Airworthiness certificate, Registration, Radio station license (for international flights), Operating limitations (POH/AFM and placards), and Weight and balance data. The airworthiness and registration certificates must be on board.",
      "Inspections keep the airplane legal. Most require an annual inspection every 12 calendar months, and aircraft for hire also require a 100-hour inspection. The transponder must be checked every 24 calendar months, and the ELT and its battery and altimeter/pitot-static system (for IFR) have their own intervals.",
      "As pilot in command you are responsible for determining the airplane is airworthy. Knowing what documents and inspections are required — and where to find the records — is part of a thorough preflight, not just paperwork."
    ],
    quiz: [
      { type: "mc", q: "In the memory aid ARROW, the second R stands for:", choices: ["Rudder check", "Radio station license", "Reserve fuel", "Runway data"], answer: 1, why: "ARROW: Airworthiness, Registration, Radio station license, Operating limitations, Weight and balance." },
      { type: "tf", q: "An airplane used for hire requires a 100-hour inspection in addition to the annual.", answer: true, why: "Aircraft carrying persons for hire or used for flight instruction for hire need 100-hour inspections." }
    ]
  },
  "reg-currency": {
    title: "Currency, flight reviews & medicals",
    pathway: "airplane", cert: "Regulations & Currency", faa: "cfr61", acs: "14 CFR 61.56, 61.57, 61.23", time: 5,
    explain: [
      "To act as pilot in command you must be current, which is different from being certificated. A flight review every 24 calendar months (or an equivalent) keeps your certificate exercisable. To carry passengers you need three takeoffs and landings in the preceding 90 days in the same category and class (and to a full stop at night, and in tailwheel airplanes).",
      "Medical certificates have validity periods that depend on the class and your age. Many private pilots fly under BasicMed instead of a traditional medical, after meeting its one-time exam and education requirements and flying within its limitations.",
      "Currency is about recent experience and fitness, not just holding a certificate. Track your landings, your flight review date, and your medical status so you always know you are legal and proficient before you fly."
    ],
    quiz: [
      { type: "mc", q: "To carry passengers, a pilot must have made how many takeoffs and landings in the preceding 90 days (same category and class)?", choices: ["One", "Two", "Three", "Six"], answer: 2, why: "Three takeoffs and landings in the prior 90 days are required to carry passengers." },
      { type: "tf", q: "A flight review is generally required every 24 calendar months.", answer: true, why: "A satisfactory flight review (or qualifying activity) within 24 calendar months is required to act as PIC." }
    ]
  },
  "reg-vfr": {
    title: "Right-of-way, VFR minimums & fuel reserves",
    pathway: "airplane", cert: "Regulations & Currency", faa: "cfr91", acs: "14 CFR 91.113, 91.155, 91.151", time: 6,
    explain: [
      "Right-of-way rules prevent collisions. An aircraft in distress has the right of way over all others. When converging, a balloon has the right of way over a glider, which has it over an airship, which has it over an airplane; when aircraft of the same category converge, the one to the other's right has the right of way. When approaching head-on, both turn right. An aircraft being overtaken has the right of way, and the overtaking aircraft passes on the right.",
      "VFR weather minimums vary by airspace and altitude but a common one to memorize is Class E below 10,000 feet MSL: three statute miles visibility and cloud clearance of 500 feet below, 1,000 feet above, and 2,000 feet horizontal. Class G has lower minimums; Class B is simply clear of clouds with three miles visibility.",
      "Fuel reserves: day VFR requires enough fuel to reach the first point of intended landing and then fly 30 minutes at normal cruise; night VFR requires 45 minutes. These are minimums — plan more, because winds and diversions eat into your margin fast."
    ],
    quiz: [
      { type: "mc", q: "Two airplanes are approaching each other head-on. Each pilot should:", choices: ["Turn left", "Turn right", "Climb", "Maintain course"], answer: 1, why: "When approaching head-on, both aircraft alter course to the right." },
      { type: "mc", q: "Minimum fuel reserve for a night VFR flight is enough to fly to the destination plus:", choices: ["20 minutes", "30 minutes", "45 minutes", "60 minutes"], answer: 2, why: "Night VFR requires a 45-minute reserve at normal cruise; day VFR requires 30 minutes." }
    ]
  },

  /* ============================ AEROMEDICAL & DECISION-MAKING ============================ */
  "med-fitness": {
    title: "Fitness for flight, IMSAFE & hypoxia",
    pathway: "airplane", cert: "Aeromedical & Decision-Making", faa: "phak", acs: "PHAK Ch.17 — Aeromedical factors", time: 6,
    explain: [
      "Before every flight, assess yourself with IMSAFE: Illness, Medication, Stress, Alcohol, Fatigue, and Emotion (or Eating). A legal-to-fly pilot can still be unsafe. Regulations also bar flying within 8 hours of alcohol, with a blood alcohol of 0.04 or higher, or while impaired.",
      "Hypoxia is oxygen starvation, and it sneaks up on you — symptoms include euphoria, poor judgment, tingling, and a bluish tint to the fingernails and lips, often without the victim noticing. It worsens with altitude, at night, and with smoking. The fix is supplemental oxygen and descending.",
      "Hyperventilation, from rapid breathing under stress, can mimic hypoxia. Slow your breathing (or breathe into a bag) to restore the balance. The common thread is that your body gives subtle warnings; honest self-assessment and prompt action keep small problems from becoming emergencies."
    ],
    quiz: [
      { type: "mc", q: "The I in the IMSAFE checklist stands for:", choices: ["Instruments", "Illness", "Inspection", "IFR"], answer: 1, why: "IMSAFE: Illness, Medication, Stress, Alcohol, Fatigue, Emotion/Eating." },
      { type: "tf", q: "A pilot suffering from hypoxia may feel euphoric and not realize anything is wrong.", answer: true, why: "Hypoxia impairs judgment and often produces a false sense of well-being, which is what makes it dangerous." }
    ]
  },
  "med-illusions": {
    title: "Spatial disorientation & illusions",
    pathway: "airplane", cert: "Aeromedical & Decision-Making", faa: "phak", acs: "PHAK Ch.17 — Vision and illusions", time: 6,
    explain: [
      "Without an outside horizon — in cloud, haze, or a dark night — your inner ear can lie to you. Spatial disorientation makes you feel level when you are turning, or turning when you are level. The cure is to trust and fly the instruments, not your sensations. This is why VFR flight into instrument conditions is so often fatal.",
      "Visual illusions distort approaches. A narrower-than-usual runway makes you feel high (so you fly low); a wider runway makes you feel low. Upsloping terrain or a runway makes you feel high; downsloping makes you feel low. Featureless terrain, fog, and rain on the windscreen all tend to make you fly a lower, more dangerous approach.",
      "At night, the black-hole effect over unlit terrain on approach can cause you to descend too soon. Defend against illusions by cross-checking the altimeter, using visual glide aids like VASI or PAPI, and flying a stable, instrument-backed approach."
    ],
    quiz: [
      { type: "mc", q: "A runway that is narrower than what a pilot is used to tends to create the illusion that the aircraft is:", choices: ["Too low, leading to a high approach", "Too high, leading to a low approach", "Too fast", "Off course"], answer: 1, why: "A narrow runway looks farther away, creating a 'too high' illusion that tempts a dangerously low approach." },
      { type: "tf", q: "When disoriented in clouds, a pilot should trust bodily sensations over the instruments.", answer: false, why: "Sensations are unreliable without a horizon; the pilot must trust and fly the instruments." }
    ]
  },
  "adm-risk": {
    title: "ADM, the PAVE checklist & hazardous attitudes",
    pathway: "airplane", cert: "Aeromedical & Decision-Making", faa: "rmh", acs: "RMH — Aeronautical decision-making", time: 6,
    explain: [
      "Aeronautical decision-making (ADM) is a systematic approach to managing risk. Before and during a flight, the PAVE checklist sorts risk into the Pilot (fitness, currency), the Aircraft (airworthiness, performance, fuel), the enVironment (weather, terrain, airspace, lighting), and External pressures (schedules, get-there-itis).",
      "The five hazardous attitudes are anti-authority ('don't tell me'), impulsivity ('do something quickly'), invulnerability ('it won't happen to me'), macho ('I can do it'), and resignation ('what's the use'). Each has a spoken antidote you apply when you catch yourself thinking it, such as 'follow the rules' for anti-authority.",
      "Good ADM means setting personal minimums, recognizing external pressure, and being willing to cancel or divert. The most important decision a pilot makes is often the one to not go, or to turn back, before a chain of small problems becomes an accident."
    ],
    quiz: [
      { type: "mc", q: "In the PAVE checklist, the V stands for:", choices: ["Velocity", "enVironment", "Visibility", "Vector"], answer: 1, why: "PAVE: Pilot, Aircraft, enVironment, External pressures." },
      { type: "mc", q: "Thinking 'rules are for other people' reflects which hazardous attitude?", choices: ["Macho", "Impulsivity", "Anti-authority", "Resignation"], answer: 2, why: "Anti-authority resents rules; the antidote is 'Follow the rules. They are usually right.'" }
    ]
  },

  /* ============================ CROSSWINDS, MANEUVERS & EMERGENCIES ============================ */
  "man-crosswind": {
    title: "Crosswind landings: the crab & the slip",
    pathway: "airplane", cert: "Crosswinds, Maneuvers & Emergencies", faa: "afh", acs: "AFH Ch.8 — Approaches and landings", time: 6,
    explain: [
      "In a crosswind, the wind pushes the airplane sideways, so you must counter the drift or you will land moving across the runway and side-load the gear. There are two techniques, and most pilots blend them: the crab and the wing-low (sideslip) method.",
      "Crabbing means pointing the nose partly into the wind so the airplane tracks straight down the runway centerline while the fuselage is angled — like a crab walking sideways. It is comfortable and coordinated on the approach, but you must remove the crab before touchdown or the airplane lands skidding sideways.",
      "The wing-low method lowers the upwind wing into the wind to stop the drift and uses opposite rudder to keep the nose aligned with the runway, so you touch down on the upwind main wheel first. A common technique is to crab on final, then transition to a wing-low slip in the flare, touching down upwind wheel first with the nose straight. Know your airplane's maximum demonstrated crosswind component."
    ],
    quiz: [
      { type: "mc", q: "Crabbing in a crosswind means:", choices: ["Lowering the upwind wing and using opposite rudder", "Pointing the nose into the wind so the airplane tracks the centerline", "Adding power to climb", "Landing with the nosewheel first"], answer: 1, why: "A crab angles the nose into the wind so ground track stays straight while the fuselage is offset." },
      { type: "tf", q: "Using the wing-low method, the airplane should touch down on the upwind main wheel first.", answer: true, why: "Lowering the upwind wing stops drift, and the upwind main wheel contacts first while the nose stays aligned." }
    ]
  },
  "man-takeland": {
    title: "Short-field & soft-field technique",
    pathway: "airplane", cert: "Crosswinds, Maneuvers & Emergencies", faa: "afh", acs: "AFH Ch.6/8 — Takeoffs and landings", time: 6,
    explain: [
      "A short-field takeoff gets the most performance from a limited runway: use the full runway length, the recommended flap setting, apply full power before brake release, rotate at the specified speed, and climb at Vx until clear of obstacles, then lower the nose to Vy. The short-field landing aims for a precise touchdown point at minimum safe speed with prompt, firm braking.",
      "A soft-field takeoff keeps weight off a soft or rough surface: hold the yoke back to lift the nosewheel early, lift off as soon as possible in ground effect, then stay low to accelerate to a safe climb speed before climbing away. The soft-field landing keeps the nosewheel off as long as possible with power and back-pressure for a gentle touchdown.",
      "The key difference: short-field is about distance and obstacle clearance; soft-field is about protecting the airplane on a poor surface. Many real runways demand a little of both. Always use the airplane's published speeds and procedures."
    ],
    quiz: [
      { type: "mc", q: "During a short-field takeoff over an obstacle, the pilot should climb at:", choices: ["Vy (best rate)", "Vx (best angle)", "Va (maneuvering)", "Vne"], answer: 1, why: "Vx gives the most altitude per distance to clear the obstacle, then transition to Vy." },
      { type: "tf", q: "A soft-field takeoff technique keeps the nosewheel light and lifts off as soon as possible in ground effect.", answer: true, why: "Reducing weight on a soft surface and using ground effect protects the airplane and aids acceleration." }
    ]
  },
  "man-goaround": {
    title: "Go-arounds, rejected takeoffs & wake turbulence",
    pathway: "airplane", cert: "Crosswinds, Maneuvers & Emergencies", faa: "afh", acs: "AFH Ch.8 — Go-around / rejected takeoff", time: 6,
    explain: [
      "A go-around is a normal, safe decision, not a failure. When an approach is unstable, the runway is blocked, or anything feels wrong, apply full power, pitch for Vy, and as the airplane accelerates retract flaps in stages per the POH and establish a positive climb before cleaning up further. Decide early and commit.",
      "A rejected takeoff is the ground equivalent: if something is wrong before liftoff — an engine that is not making full power, a door open, a warning — close the throttle and brake to a stop while runway remains. Brief your reject point before you roll.",
      "Wake turbulence is the pair of powerful counter-rotating vortices trailing from a wing, strongest behind heavy, slow, clean aircraft. Stay at or above a larger aircraft's flight path and land beyond its touchdown point; on departure, rotate before its rotation point and climb above its path. Give large aircraft time and space."
    ],
    quiz: [
      { type: "mc", q: "Wake turbulence vortices are strongest behind an aircraft that is:", choices: ["Heavy, clean, and slow", "Light, dirty, and fast", "On the ground", "Descending fast"], answer: 0, why: "Vortex strength is greatest behind a heavy, clean (no flaps/gear), slow aircraft generating high lift." },
      { type: "tf", q: "Deciding to go around when an approach is unstable is a sign of good judgment, not failure.", answer: true, why: "A timely go-around prevents unstable approaches from becoming runway accidents." }
    ]
  },
  "man-emergency": {
    title: "Engine failure & forced landings",
    pathway: "airplane", cert: "Crosswinds, Maneuvers & Emergencies", faa: "afh", acs: "AFH Ch.18 — Emergency procedures", time: 6,
    explain: [
      "If the engine quits, the first priority is to fly the airplane: pitch for best glide speed (Vg) immediately to get maximum distance and time. Then pick the best landing site within gliding range — into the wind if possible, on the largest, smoothest, most obstacle-free area you can reach.",
      "While gliding, run the flow and checklist to try a restart: fuel selector to a good tank, mixture rich, carburetor heat on, magnetos on both, and check the primer and fuel pump. If it will not restart, commit to the landing site, declare an emergency (squawk 7700, call on the frequency in use or 121.5), and secure the airplane before touchdown.",
      "Practice the picture often: from a given altitude, how far can you glide, and where would you go? Maintaining best glide and a calm, methodical flow turns an engine failure from a panic into a managed landing. Walking away is the only goal."
    ],
    quiz: [
      { type: "mc", q: "Immediately after an engine failure, the pilot's first action should be to:", choices: ["Restart the engine", "Establish best glide speed", "Declare an emergency", "Lower full flaps"], answer: 1, why: "Pitching for best glide (Vg) preserves the most distance and time to manage the situation." },
      { type: "tf", q: "The emergency transponder code is 7700.", answer: true, why: "Squawk 7700 alerts ATC to an emergency; 7600 is lost communications and 7500 is unlawful interference." }
    ]
  }

});
